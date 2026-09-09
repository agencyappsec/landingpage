export const site = {
  name: "agencyappsec",
  tagline: "Security audits for AI-built agency software",
  description:
    "We audit the software agencies ship with AI, on Supabase, Vercel, Clerk and Stripe, for the vulnerabilities the model never thought to prevent.",
  email: "agencyappsec@gmail.com",
  /**
   * Personal portfolio, linked as "About me" in the footer. Left empty until
   * the page exists: the footer renders the label as plain text while this is
   * blank and turns it into a link the moment a URL is set, so there is never
   * a dead link on the page.
   */
  portfolio: "",
  ctaPrimary: { label: "Book a security audit", href: "#contact" },
  ctaSecondary: { label: "What we check", href: "#patterns" },
} as const;

export const stack = [
  "Supabase",
  "Clerk",
  "Stripe",
  "Next.js",
] as const;
