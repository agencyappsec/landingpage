"use client";

import { WistiaPlayer } from "@wistia/wistia-player-react";

/**
 * PLAYBACK SETTINGS LIVE IN WISTIA, NOT HERE.
 *
 * Autoplay, mute, captions and control visibility are configured in Wistia's
 * Customize panel on the media itself, and this embed inherits them
 * automatically. Do NOT add `autoplay`, `muted`, `captions` or control props to
 * <WistiaPlayer /> — setting them in both places creates two sources of truth,
 * and the props silently win over the panel, so changing the panel later will
 * appear to do nothing.
 *
 * Note also that `loading="lazy"` has no effect on <wistia-player>: it is a web
 * component, not an <iframe> or <img>, so the native attribute does not apply.
 * The lazy equivalent would be `preload="none"` — which we deliberately do not
 * want, because this video is the primary content of the page.
 */

// Inlined at build time, so the server and client agree — no hydration mismatch.
// Spelled out in full: Next substitutes the literal text
// `process.env.NEXT_PUBLIC_WISTIA_MEDIA_ID`, so a computed key is never replaced.
const MEDIA_ID = process.env.NEXT_PUBLIC_WISTIA_MEDIA_ID;

/** Unset, or still carrying the placeholder .env.example ships with. */
const isSet = (id?: string) => Boolean(id) && id !== "REPLACE_ME";

/**
 * The source ratio of the media, which the player is NOT free to ignore.
 *
 * <wistia-player> derives its own height from the container width using the
 * media's real ratio. If the box reserved here disagrees, `overflow-hidden`
 * shears whichever edge overflows — and when the box is too short that takes
 * the control bar (fullscreen, captions, volume) with it. The symptom is
 * controls that seem "turned off" while Wistia's Customize panel insists
 * they're on.
 *
 * The current cut is 1920x1080, so this is a genuine 16:9 — but it is 16:9
 * because the media is, not because video usually is. An earlier cut was
 * 1660x1080 and needed that ratio here instead. Re-cut the video at another
 * size and this has to follow it; check the asset dimensions rather than
 * assuming.
 */
const VIDEO_ASPECT = "16 / 9";

/**
 * Fills whatever height the hero has left once everything else has its share,
 * then backs off by a tenth so the player doesn't crowd the headline above it
 * or the email capture below. Both terms carry the same reduction: on most
 * viewports the height-derived one is the smaller of the two and wins, so
 * trimming only the rem cap would change nothing on screens that matter.
 *
 * The ratio here converts leftover height into width, so it has to be the same
 * one the player actually uses — see VIDEO_ASPECT above.
 */
const HERO_MAX_WIDTH = "min(50rem, calc((100svh - 29rem) * 16 / 9 * 0.9))";

type ProofVideoProps = {
  /** CSS max-width for the player. Defaults to the hero's height-derived fit. */
  maxWidth?: string;
  /** Spacing for the outer wrapper. */
  className?: string;
};

export function ProofVideo({
  maxWidth = HERO_MAX_WIDTH,
  className = "mt-6",
}: ProofVideoProps = {}) {
  const mediaId = isSet(MEDIA_ID) ? MEDIA_ID : undefined;
  return (
    <div className={`w-full ${className}`}>
      <div className="mx-auto w-full" style={{ maxWidth }}>
        {/*
          The aspect ratio is reserved on this wrapper so the slot occupies its
          final size before the player script arrives — zero layout shift. The
          player derives its own height from the container width; never set an
          explicit height on it.
        */}
        <div
          className="metal-edge w-full overflow-hidden rounded-xl"
          style={{ aspectRatio: VIDEO_ASPECT }}
        >
          {mediaId ? <WistiaPlayer mediaId={mediaId} /> : null}
        </div>
      </div>
    </div>
  );
}
