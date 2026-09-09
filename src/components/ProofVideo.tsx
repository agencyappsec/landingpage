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
const MEDIA_ID = process.env.NEXT_PUBLIC_WISTIA_MEDIA_ID;
const isConfigured = Boolean(MEDIA_ID) && MEDIA_ID !== "REPLACE_ME";

/** Fills whatever height the hero has left once everything else has its share. */
const HERO_MAX_WIDTH = "min(56rem, calc((100svh - 29rem) * 16 / 9))";

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
  return (
    <div className={`w-full ${className}`}>
      <div className="mx-auto w-full" style={{ maxWidth }}>
        {/*
          The aspect ratio is reserved on this wrapper so the slot occupies its
          final size before the player script arrives — zero layout shift. The
          player derives its own height from the container width; never set an
          explicit height on it.
        */}
        <div className="aspect-video w-full overflow-hidden rounded-xl border border-line">
          {isConfigured ? <WistiaPlayer mediaId={MEDIA_ID as string} /> : null}
        </div>
      </div>
    </div>
  );
}
