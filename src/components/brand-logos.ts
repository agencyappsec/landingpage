/**
 * Marks of the tools agencies build with, each in the brand's own colour as it
 * is meant to appear on a dark background. Cursor is a monochrome brand —
 * white is its correct rendering, not a fallback.
 */
export type BrandLogo = {
  name: string;
  src: string;
  /** Optical size tweak so marks with different padding read as equal weight. */
  scale?: number;
};

/**
 * Order puts Cursor, the one white mark, in the back half of the loop rather
 * than beside the opening colour marks, so it reads as its own beat instead of
 * a gap where a colour should be.
 */
export const brandLogos: BrandLogo[] = [
  { name: "Claude", src: "/logos/claude.svg" }, // colour
  { name: "Codex", src: "/logos/codex.png" }, // colour
  { name: "Lovable", src: "/logos/lovable.svg", scale: 0.9 }, // colour
  { name: "Base44", src: "/logos/base44.png" }, // colour
  { name: "Cursor", src: "/logos/cursor.svg", scale: 0.94 }, // white
  { name: "Supabase", src: "/logos/supabase.svg", scale: 0.94 }, // colour
];
