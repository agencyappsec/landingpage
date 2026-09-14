/**
 * The source dimensions of both cuts, as Wistia reports them for the original
 * upload (2848 × 1622, a screen recording). This is NOT 16:9 — do not "tidy" it
 * into `aspect-video`. <wistia-player> derives its own height from the
 * container width using the media's real ratio, so the frame has to reserve
 * that same ratio:
 *
 * - Too tall a reservation (the old 1660 / 1080) leaves the player ending short
 *   of the frame, and the frame's dark fill shows as a black bar under the video.
 * - Too short a reservation (16:9) makes the player overflow the frame, and
 *   `overflow-hidden` shears the bottom off — taking the control bar
 *   (fullscreen, captions, volume) with it.
 *
 * If the videos are ever re-cut at another size, update these to match: check
 * https://fast.wistia.com/embed/medias/<media id>.json for the original asset.
 */
const VIDEO_WIDTH = 2848;
const VIDEO_HEIGHT = 1622;

export const VIDEO_ASPECT = `${VIDEO_WIDTH} / ${VIDEO_HEIGHT}`;

/**
 * Fills whatever height the hero has left once everything else has its share,
 * then backs off by a tenth so the player doesn't crowd the headline above it
 * or the email capture below. Both terms carry the same reduction: on most
 * viewports the height-derived one is the smaller of the two and wins, so
 * trimming only the rem cap would change nothing on screens that matter.
 *
 * The ratio here converts leftover height into width, so it is built from the
 * same dimensions the frame reserves above.
 *
 * Kept outside ProofVideo because that file is "use client": a plain string
 * exported from it can't be read by server components such as the service
 * section, which sizes its player off this one.
 */
export const HERO_MAX_WIDTH = `min(50rem, calc((100svh - 29rem) * ${VIDEO_WIDTH} / ${VIDEO_HEIGHT} * 0.9))`;
