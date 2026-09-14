/**
 * Wordmarks for the stack strip, in each brand's dark-background variant.
 *
 * Heights are set per logo rather than uniformly: these wordmarks have very
 * different proportions (Stripe is 2.4:1 and heavy, Supabase 5.1:1 and light),
 * so a single shared height would make some tower and others vanish. These
 * values equalise how large each one *reads* — matched on x-height, not box
 * height, since a wordmark that spends its box on ascenders and descenders
 * (Supabase's b and p, Stripe's t and p) has smaller letters in it than one
 * that doesn't. That's why those two carry the tallest boxes, and why Next.js
 * carries the shortest: it is set in caps, so its box is all letter.
 * Nudge a single number to retune.
 * Width is derived from the source aspect ratio so nothing is distorted.
 *
 * GitHub ships no light-on-dark wordmark, so ours is the black source in
 * assets/brand-source recoloured to purple and knocked out of its background.
 */
export type StackLogo = {
  name: string;
  src: string;
  width: number;
  height: number;
};

export const stackLogos: StackLogo[] = [
  { name: "Supabase", src: "/logos/stack/supabase_wordmark_dark.svg", width: 144, height: 28 },
  { name: "Clerk", src: "/logos/stack/clerk-wordmark-dark.svg", width: 83, height: 24 },
  { name: "Stripe", src: "/logos/stack/stripe_wordmark.svg", width: 69, height: 29 },
  { name: "Next.js", src: "/logos/stack/nextjs_logo_dark.svg", width: 99, height: 20 },
  { name: "GitHub", src: "/logos/stack/github-wordmark-purple.png", width: 105, height: 24 },
];
