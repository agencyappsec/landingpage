/**
 * Values rendered verbatim into the privacy policy at /privacy.
 *
 * There is deliberately no postal address. GDPR Art. 13 requires the
 * controller's "identity and contact details" — for a sole individual an
 * email address satisfies that, and publishing a home address on a public
 * page is a real cost with no legal benefit here.
 */
export const legal = {
  /** Date the policy was last changed, e.g. "8 September 2026". */
  lastUpdated: "21 September 2026",
  /** The controller. An individual, not a company — there is no business. */
  businessName: "Jason Ogwueleka",
  /** Where rights requests and policy questions go. */
  email: "agencyappsec@gmail.com",
  /** Named in the processor table as the host of the inbox enquiries land in. */
  emailProvider: "Google (Gmail)",
} as const;

/** Third parties named in the policy, with what each one actually handles. */
export const processors = [
  { name: "Resend", handles: "Delivers form submissions to my email inbox" },
  { name: "Cal.com", handles: "Call scheduling" },
  { name: "Wistia", handles: "Video hosting and playback analytics" },
  { name: "Netlify", handles: "Website hosting and server logs" },
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
