/**
 * Fills whatever height the hero has left once everything else has its share,
 * then backs off by a tenth so the player doesn't crowd the headline above it
 * or the email capture below. Both terms carry the same reduction: on most
 * viewports the height-derived one is the smaller of the two and wins, so
 * trimming only the rem cap would change nothing on screens that matter.
 *
 * The ratio here converts leftover height into width, so it has to be the same
 * one the player actually uses — see VIDEO_ASPECT in ProofVideo.
 *
 * Kept outside ProofVideo because that file is "use client": a plain string
 * exported from it can't be read by server components such as the service
 * section, which sizes its player off this one.
 */
export const HERO_MAX_WIDTH =
  "min(50rem, calc((100svh - 29rem) * 1660 / 1080 * 0.9))";
