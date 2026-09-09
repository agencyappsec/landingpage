/**
 * Marks of the tools agencies build with, each in the brand's own colour as it
 * is meant to appear on a dark background. Codex and Cursor are monochrome
 * brands — white is their correct rendering, not a fallback.
 */
export type BrandLogo = {
  name: string;
  src: string;
  /** Optical size tweak so marks with different padding read as equal weight. */
  scale?: number;
};

/**
 * Order matters: the two monochrome marks are spaced evenly through the loop so
 * colour and white keep trading off rather than clumping.
 */
export const brandLogos: BrandLogo[] = [
  { name: "Claude", src: "/logos/claude.svg" }, // colour
  { name: "Codex", src: "/logos/codex.svg" }, // white
  { name: "Lovable", src: "/logos/lovable.svg", scale: 0.9 }, // colour
  { name: "Base44", src: "/logos/base44.png" }, // colour
  { name: "Cursor", src: "/logos/cursor.svg", scale: 0.94 }, // white
  { name: "Supabase", src: "/logos/supabase.svg", scale: 0.94 }, // colour
];
