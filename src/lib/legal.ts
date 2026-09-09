/**
 * PLACEHOLDERS — fill these in before this site goes live.
 *
 * Every value here is rendered verbatim into the privacy policy at /privacy.
 * They are written in brackets so an unfilled one is obvious on the page
 * rather than quietly shipping as a plausible-looking wrong answer: a policy
 * naming the wrong controller or a stale date is worse than an unfinished one.
 */
export const legal = {
  /** Date the policy was last changed, e.g. "8 September 2026". */
  lastUpdated: "[DATE]",
  businessName: "[BUSINESS NAME / YOUR FULL NAME]",
  address: "[ADDRESS]",
  /** Where rights requests and policy questions go. */
  email: "[EMAIL]",
  /** Named in the processor table as the host of the inbox enquiries land in. */
  emailProvider: "[EMAIL PROVIDER]",
} as const;

/** Third parties named in the policy, with what each one actually handles. */
export const processors = [
  { name: "Resend", handles: "Delivers form submissions to my email inbox" },
  { name: "Cal.com", handles: "Call scheduling" },
  { name: "Wistia", handles: "Video hosting and playback analytics" },
  { name: "Vercel", handles: "Website hosting and server logs" },
  {
    name: legal.emailProvider,
    handles: "My email inbox, where your message arrives and is stored",
  },
] as const;

/** The GDPR rights listed under "Your rights". */
export const dataRights = [
  "Ask what information I hold about you, and get a copy of it",
  "Have inaccurate information corrected",
  "Have your information deleted",
  "Restrict or object to how I’m using it",
  "Receive your information in a portable format",
  "Withdraw consent, where I’ve relied on consent, at any time",
] as const;
