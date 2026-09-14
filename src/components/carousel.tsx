"use client";

import { useState, type ReactNode } from "react";

export type Slide = { key: string; content: ReactNode };

/**
 * Slides, one at a time, in a single box.
 *
 * It wraps at both ends rather than disabling the arrows: with a handful of
 * items the loop is short enough that a dead button is more annoying than a
 * repeat.
 *
 * Slides arrive pre-rendered so a server component can build them; a render
 * function couldn't cross into this client component.
 */
export function Carousel({
  slides,
  label,
  itemName,
  boxClassName,
  showCounter = true,
}: {
  slides: readonly Slide[];
  /** Accessible name for the whole carousel. */
  label: string;
  /** Singular noun for the dot buttons, e.g. "Go to signal 2 of 5". */
  itemName: string;
  /** Sizing and padding for the box; the shared frame is applied here. */
  boxClassName: string;
  /** The "01 / 05" counter in the box's top-right corner. */
  showCounter?: boolean;
}) {
  const [index, setIndex] = useState(0);
  // Which way the incoming panel should travel. Kept alongside the index so a
  // wrap-around still animates the way the arrow implies.
  const [direction, setDirection] = useState<1 | -1>(1);

  const total = slides.length;

  function go(step: 1 | -1) {
    setDirection(step);
    setIndex((i) => (i + step + total) % total);
  }

  function jumpTo(target: number) {
    if (target === index) return;
    setDirection(target > index ? 1 : -1);
    setIndex(target);
  }

  return (
    <div
      role="group"
      aria-roledescription="carousel"
      aria-label={label}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") go(1);
        if (e.key === "ArrowLeft") go(-1);
      }}
    >
      {/*
        Every slide is laid into the same grid cell, so the box is exactly as
        tall as the longest one and no taller. A guessed min-height either
        stranded the short slides in empty space or clipped the long one, and
        sizing to the active slide alone made the box jump on every click.

        The inactive copies are there only to hold that height: visibility
        hidden keeps their space while taking them out of the page for both the
        eye and the screen reader.
      */}
      <div className={`metal-edge relative grid rounded-2xl ${boxClassName}`}>
        {/*
          Anchored to the box rather than carried inside the slide, so it holds
          the corner while the content moves under it. Out of flow, so it sits
          in the box's top padding without pushing the content down.
        */}
        {showCounter && (
          <p className="pointer-events-none absolute top-4 right-5 font-mono text-xs tracking-[0.14em] text-white/30 sm:top-5 sm:right-6">
            {pad(index + 1)} / {pad(total)}
          </p>
        )}

        {slides.map((slide) => (
          <SlideFrame key={slide.key} sizer>
            {slide.content}
          </SlideFrame>
        ))}

        {/*
          Keyed on the index so React remounts it on every change, which is what
          restarts the animation. aria-live announces the new content to a
          screen reader, which would otherwise get no signal that anything moved.
        */}
        <SlideFrame
          key={index}
          className="slide-in"
          style={
            { "--slide-from": `${direction * 24}px` } as React.CSSProperties
          }
        >
          {slides[index].content}
        </SlideFrame>
      </div>

      <div className="mt-6 flex items-center justify-center gap-6">
        <Arrow direction="left" onClick={() => go(-1)} />

        <div className="flex items-center gap-2.5">
          {slides.map((slide, i) => (
            <button
              key={slide.key}
              type="button"
              onClick={() => jumpTo(i)}
              aria-label={`Go to ${itemName} ${i + 1} of ${total}`}
              aria-current={i === index}
              className={`h-1.5 rounded-full transition-all ${
                i === index
                  ? "w-6 bg-white"
                  : "w-1.5 bg-white/25 hover:bg-white/50"
              }`}
            />
          ))}
        </div>

        <Arrow direction="right" onClick={() => go(1)} />
      </div>
    </div>
  );
}

/** 1 becomes "01", so the counter never changes width as it advances. */
function pad(n: number): string {
  return String(n).padStart(2, "0");
}

/**
 * One slide.
 *
 * `sizer` marks the invisible copies that exist only to give the box its
 * height: `invisible` is visibility hidden, which holds the space, where the
 * `hidden` attribute would remove it. They are hidden from assistive tech too,
 * so the same content isn't read out under the one that's on screen.
 */
function SlideFrame({
  children,
  sizer = false,
  className = "",
  style,
}: {
  children: ReactNode;
  sizer?: boolean;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`col-start-1 row-start-1 flex flex-col justify-center ${
        sizer ? "invisible" : ""
      } ${className}`}
      style={style}
      {...(sizer ? { "aria-hidden": true } : { "aria-live": "polite" as const })}
    >
      {children}
    </div>
  );
}

function Arrow({
  direction,
  onClick,
}: {
  direction: "left" | "right";
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={direction === "left" ? "Previous" : "Next"}
      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/20 text-white transition hover:border-white/40 hover:bg-white/10"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.25"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
        className="h-5 w-5"
      >
        <path d={direction === "left" ? "M15 5l-7 7 7 7" : "M9 5l7 7-7 7"} />
      </svg>
    </button>
  );
}
