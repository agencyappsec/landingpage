#!/usr/bin/env node
'use strict';
/**
 * Strix report + gate.
 *
 * Pipeline: parse findings.sarif -> apply severity overrides -> drop
 * suppressed (accepted) -> group by CWE (root-cause proxy) -> upsert ONE PR
 * comment marked with <!-- strix-report --> -> exit non-zero only if a
 * surviving finding meets/exceeds GATE_THRESHOLD.
 *
 * We parse findings.sarif, NOT vulnerabilities.json: a clean run omits
 * vulnerabilities.json entirely, but findings.sarif is always written (with an
 * empty results[]). SARIF results[].properties.strix carries every field we
 * need (id, cvss, cwe, method, endpoint, severity, remediation).
 *
 * FAIL CLOSED: if the findings file is missing or unparseable, or a config
 * file is present but invalid JSON, print loudly and exit 1. Never pass
 * silently because the parser broke -- that is worse than no gate.
 *
 * No npm dependencies: uses Node's built-in fetch (Node 18+).
 *
 * Env:
 *   GATE_THRESHOLD   off|none|low|medium|high|critical  (default: off = flag-only)
 *   STRIX_RUNS_DIR   override the strix_runs location (default: ./strix_runs) [for local testing]
 *   GITHUB_TOKEN / GITHUB_REPOSITORY / GITHUB_PR_NUMBER  (posting; skipped if absent)
 */

const fs = require('fs');
const path = require('path');

const MARKER = '<!-- strix-report -->';
const SEV_ORDER = ['none', 'info', 'low', 'medium', 'high', 'critical'];
const rank = s => SEV_ORDER.indexOf(String(s || 'none').toLowerCase());

function die(msg) {
  console.error('\n::error::[strix-report] FAIL-CLOSED: ' + msg + '\n');
  process.exit(1);
}

// ---- locate the newest run ----------------------------------------------
const runsRoot = path.resolve(process.env.STRIX_RUNS_DIR || 'strix_runs');
if (!fs.existsSync(runsRoot)) die('no strix_runs/ directory (' + runsRoot + ') — the scan produced no output.');
const runDirs = fs.readdirSync(runsRoot)
  .map(d => path.join(runsRoot, d))
  .filter(p => { try { return fs.statSync(p).isDirectory(); } catch { return false; } });
if (!runDirs.length) die('strix_runs/ has no run subdirectories.');
runDirs.sort((a, b) => fs.statSync(b).mtimeMs - fs.statSync(a).mtimeMs);
const runDir = runDirs[0];

const sarifPath = path.join(runDir, 'findings.sarif');
if (!fs.existsSync(sarifPath)) die('findings.sarif missing in ' + runDir + ' — cannot confirm scan results.');

let results;
try {
  const sarif = JSON.parse(fs.readFileSync(sarifPath, 'utf8'));
  results = sarif.runs[0].results || [];
} catch (e) {
  die('findings.sarif is not valid SARIF/JSON: ' + e.message);
}

// ---- load config (fail closed if present-but-broken; default-empty if absent)
function loadJson(rel, dflt) {
  const p = path.resolve(rel);
  if (!fs.existsSync(p)) { console.warn('[strix-report] note: ' + rel + ' not found; using default.'); return dflt; }
  try { return JSON.parse(fs.readFileSync(p, 'utf8')); }
  catch (e) { die(rel + ' is present but invalid JSON: ' + e.message); }
}
const overrides = loadJson('.strix/severity-overrides.json', { byCwe: {}, byFingerprint: {} });
const acceptedCfg = loadJson('.strix/accepted.json', { accepted: [] });
const byCwe = overrides.byCwe || {};
const byFp = overrides.byFingerprint || {};
const acceptedFps = new Set((Array.isArray(acceptedCfg.accepted) ? acceptedCfg.accepted : []).map(a => a.fingerprint));

// ---- helpers -------------------------------------------------------------
function cvssBand(n) {
  n = Number(n);
  if (!isFinite(n) || n <= 0) return 'info';
  if (n >= 9) return 'critical';
  if (n >= 7) return 'high';
  if (n >= 4) return 'medium';
  return 'low';
}
function extract(r) {
  const s = (r.properties && r.properties.strix) || {};
  const cweMatch = (r.ruleId || '').match(/CWE-\d+/);
  const cwe = s.cwe || (cweMatch ? cweMatch[0] : 'CWE-unknown');
  const method = s.method || '';
  const endpoint = s.endpoint || '';
  // Strix's SARIF has no short-title field; message.text is
  // "Short title\n\nLong description". Take the first line as the title.
  const msg = (r.message && r.message.text) || '';
  const title = (msg.split('\n')[0] || '').trim() || r.ruleId || '(no title)';
  return {
    id: s.id || r.ruleId || '(no id)',
    title,
    cvss: (s.cvss != null ? s.cvss : null),
    cwe, method, endpoint,
    fingerprint: method + ':' + endpoint + ':' + cwe,
    remediation: s.remediation_steps || null,
  };
}
function effectiveSeverity(f) {
  if (byFp[f.fingerprint]) return String(byFp[f.fingerprint]).toLowerCase();
  if (byCwe[f.cwe]) return String(byCwe[f.cwe]).toLowerCase();
  return cvssBand(f.cvss);
}

// ---- process -------------------------------------------------------------
const findings = results.map(extract);
findings.forEach(f => { f.severity = effectiveSeverity(f); });
const suppressed = findings.filter(f => acceptedFps.has(f.fingerprint));
const active = findings.filter(f => !acceptedFps.has(f.fingerprint));

const counts = {};
SEV_ORDER.forEach(s => counts[s] = 0);
active.forEach(f => counts[f.severity] = (counts[f.severity] || 0) + 1);

const threshold = String(process.env.GATE_THRESHOLD || 'off').toLowerCase();
const gatingOn = SEV_ORDER.includes(threshold) && threshold !== 'none';
const blockers = gatingOn ? active.filter(f => rank(f.severity) >= rank(threshold)) : [];

// ---- build the PR comment ------------------------------------------------
function buildComment() {
  let cost = null, mode = null;
  try {
    const rj = JSON.parse(fs.readFileSync(path.join(runDir, 'run.json'), 'utf8'));
    cost = rj.llm_usage && rj.llm_usage.cost;
    mode = rj.scan_mode;
  } catch { /* optional */ }

  const meta = [];
  if (mode) meta.push('mode: `' + mode + '`');
  if (cost != null) meta.push('cost: `$' + Number(cost).toFixed(4) + '`');
  meta.push(gatingOn ? 'gate: `block ≥ ' + threshold + '`' : 'gate: `flag-only`');

  const L = [];
  L.push(MARKER);
  L.push('## 🛡️ Strix security scan');
  L.push('_' + meta.join(' · ') + '_');
  L.push('');

  if (active.length === 0) {
    L.push('✅ **No new findings.**');
  } else {
    const summary = SEV_ORDER.slice().reverse().filter(s => counts[s] > 0)
      .map(s => '**' + counts[s] + ' ' + s + '**').join(' · ');
    L.push('Found **' + active.length + '** finding(s): ' + summary);
    if (gatingOn) {
      L.push(blockers.length
        ? '\n❌ **' + blockers.length + ' finding(s) at or above `' + threshold + '` — this check is failing.**'
        : '\n✅ Nothing at or above `' + threshold + '`.');
    } else {
      const wouldBlock = active.filter(f => rank(f.severity) >= rank('high')).length;
      L.push('\n⚠️ Flag-only mode: **not blocking** this merge. (' + wouldBlock +
        ' finding(s) would block once the gate is set to `high`.)');
    }
    L.push('');
    const groups = {};
    active.forEach(f => { (groups[f.cwe] = groups[f.cwe] || []).push(f); });
    Object.keys(groups)
      .sort((a, b) => Math.max(...groups[b].map(f => rank(f.severity))) - Math.max(...groups[a].map(f => rank(f.severity))))
      .forEach(cwe => {
        L.push('### ' + cwe + ' — ' + groups[cwe].length + ' finding(s)');
        groups[cwe].forEach(f => {
          const cv = (f.cvss != null) ? ' · CVSS ' + f.cvss : '';
          L.push('- **[' + f.severity.toUpperCase() + ']** `' + f.fingerprint + '`' + cv + '  \n  ' + f.title);
        });
        L.push('');
      });
  }
  L.push('');
  L.push('_' + suppressed.length + ' accepted finding(s) suppressed._');
  L.push('');
  L.push('<sub>Automated by Strix. Findings are advisory; a human verifies before you act.</sub>');
  return L.join('\n');
}

// ---- upsert the comment (search for the marker, PATCH or POST) -----------
async function upsertComment(body) {
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPOSITORY;
  const pr = process.env.GITHUB_PR_NUMBER;
  if (!token || !repo || !pr) {
    console.warn('[strix-report] no GITHUB_TOKEN/REPOSITORY/PR_NUMBER — skipping PR comment (local run).');
    return;
  }
  const api = 'https://api.github.com/repos/' + repo;
  const headers = {
    'Authorization': 'Bearer ' + token,
    'Accept': 'application/vnd.github+json',
    'User-Agent': 'strix-report',
    'Content-Type': 'application/json',
  };
  const listRes = await fetch(api + '/issues/' + pr + '/comments?per_page=100', { headers });
  if (!listRes.ok) die('GitHub list-comments failed: ' + listRes.status + ' ' + (await listRes.text()));
  const comments = await listRes.json();
  const existing = comments.find(c => typeof c.body === 'string' && c.body.includes(MARKER));
  if (existing) {
    const r = await fetch(api + '/issues/comments/' + existing.id, { method: 'PATCH', headers, body: JSON.stringify({ body }) });
    if (!r.ok) die('GitHub update-comment failed: ' + r.status + ' ' + (await r.text()));
    console.log('[strix-report] updated PR comment ' + existing.id);
  } else {
    const r = await fetch(api + '/issues/' + pr + '/comments', { method: 'POST', headers, body: JSON.stringify({ body }) });
    if (!r.ok) die('GitHub create-comment failed: ' + r.status + ' ' + (await r.text()));
    console.log('[strix-report] posted new PR comment');
  }
}

// ---- run -----------------------------------------------------------------
(async () => {
  const body = buildComment();
  console.log('----- PR comment body -----\n' + body + '\n---------------------------');
  await upsertComment(body);
  console.log('[strix-report] active=' + active.length + ' suppressed=' + suppressed.length +
    ' gate=' + (gatingOn ? threshold : 'flag-only') + ' blockers=' + blockers.length);
  process.exit(blockers.length ? 1 : 0);
})().catch(e => die('unexpected error: ' + (e && e.stack || e)));
