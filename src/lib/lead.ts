import type { FitAnswers } from "@/lib/fit";

/**
 * A lead can arrive at two very different levels of completeness:
 *
 * - "hero"     — just an email, typed into the bar under the video. Nothing is
 *                known about them yet, so it's never treated as qualified.
 * - "fit-form" — the full picture: contact details plus all four answers, and
 *                a verdict from isQualified().
 *
 * Both are worth an email. The hero one exists precisely because most people
 * who type an address there never finish the form, and an address with no
 * answers still beats losing them entirely.
 */
export type LeadSource = "hero" | "fit-form";

export type Lead = {
  source: LeadSource;
  email: string;
  name?: string;
  phone?: string;
  answers?: FitAnswers;
  qualified?: boolean;
};

/** Deliberately loose — real validation is the mail provider's job. */
export function looksLikeEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

/**
 * Fire-and-forget by design.
 *
 * Capturing the lead must never stand between someone and the calendar, so a
 * failure here is swallowed rather than surfaced: if Resend is down, the
 * booking still goes through and the lead is lost — which is strictly better
 * than blocking the booking *and* losing the lead. Errors go to the console so
 * the failure is at least visible while developing.
 */
export function submitLead(lead: Lead): void {
  void fetch("/api/lead", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(lead),
    keepalive: true,
  }).catch((err) => {
    console.error("[lead] could not be recorded", err);
  });
}

/**
 * Carries the hero email down to the form without putting an address in the
 * URL. Both components live on the same page, so a window event is enough —
 * no context provider, no store, and the hero stays a server component apart
 * from the capture bar itself.
 */
export const PREFILL_EMAIL_EVENT = "agencyappsec:prefill-email";

export function dispatchPrefillEmail(email: string): void {
  window.dispatchEvent(
    new CustomEvent<string>(PREFILL_EMAIL_EVENT, { detail: email }),
  );
}
