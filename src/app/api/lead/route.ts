import { Resend } from "resend";

import { fitQuestions } from "@/lib/fit";
import { looksLikeEmail, type Lead } from "@/lib/lead";

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

export async function POST(request: Request) {
  let lead: Lead;
  try {
    lead = await request.json();
  } catch {
    return Response.json({ error: "Malformed body" }, { status: 400 });
  }

  if (!lead?.email || !looksLikeEmail(lead.email)) {
    return Response.json({ error: "A valid email is required" }, { status: 400 });
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
