/**
 * Wordmarks for the stack strip, in each brand's dark-background variant.
 *
 * Heights are set per logo rather than uniformly: these wordmarks have very
 * different proportions (Stripe is 2.4:1 and heavy, Supabase 5.1:1 and light),
 * so matching their box heights would make Stripe tower over the rest. These
 * values equalise how large each one *reads*. Nudge a single number to retune.
 * Width is derived from the source aspect ratio so nothing is distorted.
 */
export type StackLogo = {
  name: string;
  src: string;
  width: number;
  height: number;
};

export const stackLogos: StackLogo[] = [
  { name: "Supabase", src: "/logos/stack/supabase_wordmark_dark.svg", width: 113, height: 22 },
  { name: "Clerk", src: "/logos/stack/clerk-wordmark-dark.svg", width: 83, height: 24 },
  { name: "Stripe", src: "/logos/stack/stripe_wordmark.svg", width: 62, height: 26 },
  { name: "Next.js", src: "/logos/stack/nextjs_logo_dark.svg", width: 99, height: 20 },
];
