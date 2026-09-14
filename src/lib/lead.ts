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
  /**
   * Honeypot. Rendered off-screen and hidden from assistive tech, so a person
   * never fills it in — anything here came from a bot.
   */
  website?: string;
};

/**
 * Throwaway inboxes. Not exhaustive — new ones appear daily — but these cover
 * the ones people actually reach for when they don't want to be contacted.
 */
const DISPOSABLE_DOMAINS = new Set([
  "10minutemail.com",
  "dispostable.com",
  "fakeinbox.com",
  "getnada.com",
  "guerrillamail.com",
  "maildrop.cc",
  "mailinator.com",
  "mailnesia.com",
  "sharklasers.com",
  "temp-mail.org",
  "tempmail.com",
  "throwawaymail.com",
  "trashmail.com",
  "yopmail.com",
]);

const LOCAL_PART = /^[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+(\.[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+)*$/;
const DOMAIN_LABEL = /^[A-Za-z0-9]([A-Za-z0-9-]*[A-Za-z0-9])?$/;
const TOP_LEVEL = /^[A-Za-z]{2,63}$/;

/**
 * Why an address won't do, or null if it's fine. Shared by the forms and the
 * API route, so what the browser accepts is exactly what the server accepts.
 *
 * Checks shape only — one @, a sane local part, a real-looking domain with a
 * letters-only TLD, RFC length limits — and turns away disposable inboxes.
 * Whether the mailbox exists is for Cal.com's booker verification to prove.
 */
export function emailError(value: unknown): string | null {
  if (typeof value !== "string") return "Enter your email address.";
  const email = value.trim();
  if (!email) return "Enter your email address.";

  const invalid = "Enter a valid email address, like you@company.com.";
  if (email.length > 254) return invalid;

  const at = email.lastIndexOf("@");
  if (at < 1 || email.indexOf("@") !== at) return invalid;

  const local = email.slice(0, at);
  const domain = email.slice(at + 1).toLowerCase();
  if (local.length > 64 || !LOCAL_PART.test(local)) return invalid;

  const labels = domain.split(".");
  if (labels.length < 2) return invalid;
  if (!labels.every((label) => label.length <= 63 && DOMAIN_LABEL.test(label))) {
    return invalid;
  }
  if (!TOP_LEVEL.test(labels[labels.length - 1])) return invalid;

  if (DISPOSABLE_DOMAINS.has(domain)) {
    return "Please use a permanent email address, not a disposable one.";
  }
  return null;
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
