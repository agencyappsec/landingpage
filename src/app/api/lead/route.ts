import { Resend } from "resend";

import { fitQuestions } from "@/lib/fit";
import { emailError, type Lead } from "@/lib/lead";

/**
 * Receives a lead from the hero bar or the fit form and emails it on.
 *
 * Read at request time rather than at module scope: a missing key should fail
 * this one request with a log line, not blow up the build or the first render
 * of an otherwise fine page.
 */
function config() {
  return {
    apiKey: process.env.RESEND_API_KEY,
    to: process.env.LEAD_NOTIFY_EMAIL,
    from: process.env.RESEND_FROM_EMAIL ?? "AgencyAppSec <onboarding@resend.dev>",
  };
}

/**
 * Abuse limits, kept in memory. On serverless each instance has its own copy,
 * so these are best-effort: they stop a script hammering one warm instance and
 * collapse double submits, which is most of what actually happens. A shared
 * store (Upstash, Vercel KV) would make them exact if that ever matters.
 */
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_IP = 5;
const requestsByIp = new Map<string, number[]>();
const lastSentByLead = new Map<string, number>();

function clientIp(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

function isRateLimited(ip: string, now: number): boolean {
  const recent = (requestsByIp.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  requestsByIp.set(ip, recent);

  // Keep the maps from growing without bound on a long-lived instance.
  if (requestsByIp.size > 5000) requestsByIp.clear();
  if (lastSentByLead.size > 5000) lastSentByLead.clear();

  return recent.length > MAX_PER_IP;
}

function isTooLong(value: unknown, max: number): boolean {
  return value !== undefined && (typeof value !== "string" || value.length > max);
}

export async function POST(request: Request) {
  let lead: Lead;
  try {
    lead = await request.json();
  } catch {
    return Response.json({ error: "Malformed body" }, { status: 400 });
  }

  if (!lead || typeof lead !== "object") {
    return Response.json({ error: "Malformed body" }, { status: 400 });
  }

  // A filled honeypot is a bot. Answer like a success so it has no signal to
  // adapt to, and send nothing.
  if (lead.website) {
    return Response.json({ ok: true, delivered: true });
  }

  if (lead.source !== "hero" && lead.source !== "fit-form") {
    return Response.json({ error: "Unknown source" }, { status: 400 });
  }

  if (emailError(lead.email)) {
    return Response.json({ error: "A valid email is required" }, { status: 400 });
  }
  lead.email = lead.email.trim();

  if (isTooLong(lead.name, 100) || isTooLong(lead.phone, 40)) {
    return Response.json({ error: "Field too long" }, { status: 400 });
  }

  const now = Date.now();
  if (isRateLimited(clientIp(request), now)) {
    return Response.json({ error: "Too many requests" }, { status: 429 });
  }

  // The same person resubmitting the same form is one lead, not several.
  const leadKey = `${lead.source}:${lead.email.toLowerCase()}`;
  const lastSent = lastSentByLead.get(leadKey);
  if (lastSent && now - lastSent < WINDOW_MS) {
    return Response.json({ ok: true, delivered: false, duplicate: true });
  }

  const { apiKey, to, from } = config();
  if (!apiKey || !to) {
    // Not a client error — the visitor did nothing wrong, the site is
    // misconfigured. Say so in the log and accept the request so the form
    // doesn't punish them for it.
    const missing = [
      !apiKey && "RESEND_API_KEY",
      !to && "LEAD_NOTIFY_EMAIL",
    ].filter(Boolean);
    console.error(
      `[lead] dropped ${lead.email}: nothing set for ${missing.join(" and ")}`,
    );
    return Response.json({ ok: false, delivered: false }, { status: 202 });
  }

  const heading =
    lead.source === "hero"
      ? "New email captured (hero)"
      : lead.qualified
        ? "New qualified lead"
        : "New lead, did not qualify";

  try {
    const { error } = await new Resend(apiKey).emails.send({
      from,
      to,
      replyTo: lead.email,
      subject: `${heading}: ${lead.email}`,
      text: asPlainText(heading, lead),
    });

    if (error) {
      console.error("[lead] Resend rejected the message", error);
      return Response.json({ ok: false, delivered: false }, { status: 502 });
    }
  } catch (err) {
    console.error("[lead] could not reach Resend", err);
    return Response.json({ ok: false, delivered: false }, { status: 502 });
  }

  lastSentByLead.set(leadKey, now);
  return Response.json({ ok: true, delivered: true });
}

/**
 * Plain text on purpose — it renders identically everywhere, can't trip a spam
 * filter on markup, and these only ever go to one inbox.
 */
function asPlainText(heading: string, lead: Lead): string {
  const lines = [heading, "", `Email:  ${lead.email}`];

  if (lead.name) lines.push(`Name:   ${lead.name}`);
  if (lead.phone) lines.push(`Phone:  ${lead.phone}`);

  if (lead.answers) {
    lines.push("", "Answers");
    for (const question of fitQuestions) {
      lines.push(`  ${question.label}: ${lead.answers[question.id] ?? "(none)"}`);
    }
  }

  if (lead.source === "hero") {
    lines.push(
      "",
      "Typed their email into the hero bar. They may or may not have gone on",
      "to finish the fit form. If they did, a second email will follow.",
    );
  }

  lines.push("", `Received ${new Date().toUTCString()}`);
  return lines.join("\n");
}
