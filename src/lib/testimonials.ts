/**
 * PLACEHOLDER COPY — REPLACE BEFORE THIS PAGE IS LIVE.
 *
 * Every entry below is invented, written only so the strip can be designed
 * against realistic line lengths. Publishing invented testimonials as real
 * client quotes is deceptive to visitors and, for a US business, an FTC
 * problem — the endorsement rules cover fabricated reviews explicitly.
 *
 * Swap each one for a real quote you have permission to use, and delete any
 * you can't fill. The strip renders whatever length this array is.
 */
export type Testimonial = {
  name: string;
  /** X handle, without the leading @. */
  handle: string;
  /**
   * Full LinkedIn profile URL. Left on the REPLACE_ME placeholder, the card
   * still shows the mark but doesn't link it — a testimonial pointing at a
   * dead profile is worse than one pointing nowhere.
   */
  linkedin: string;
  quote: string;
};

/** A profile URL that's still the placeholder shipped with the file. */
export function hasProfile(url: string): boolean {
  return Boolean(url) && !url.includes("REPLACE_ME");
}

/** Sits above the strip, in the same key as the stack strip's label. */
export const testimonialsLabel = "Trusted by builders nationwide";

export const testimonials: Testimonial[] = [
  {
    name: "Elena Rostova",
    handle: "elena_builds",
    linkedin: "https://www.linkedin.com/in/REPLACE_ME",
    quote:
      "Found an RLS policy that let any signed-in user read every other tenant's rows. We'd shipped it to two clients already.",
  },
  {
    name: "Jordan Lee",
    handle: "jordan_tech",
    linkedin: "https://www.linkedin.com/in/REPLACE_ME",
    quote:
      "The report was written for my developers, not for a compliance binder. Every finding had the file and the fix in it.",
  },
  {
    name: "Samir Patel",
    handle: "dev_sam",
    linkedin: "https://www.linkedin.com/in/REPLACE_ME",
    quote:
      "Ran against our template repo, so every project we start now inherits the fixes. That was worth more than the audit itself.",
  },
  {
    name: "Alex Rivera",
    handle: "alexrivera",
    linkedin: "https://www.linkedin.com/in/REPLACE_ME",
    quote:
      "We had a client security questionnaire we couldn't answer. Two weeks later we could answer all of it honestly.",
  },
  {
    name: "Sarah Chen",
    handle: "sarah_dev",
    linkedin: "https://www.linkedin.com/in/REPLACE_ME",
    quote:
      "Turnaround was days, not a quarter. It fit inside the sprint we already had scheduled for the launch.",
  },
  {
    name: "Marcus Vance",
    handle: "marcus_ui",
    linkedin: "https://www.linkedin.com/in/REPLACE_ME",
    quote:
      "Caught a service-role key that had been sitting in a client-side bundle since the first deploy. Nobody had looked.",
  },
];
