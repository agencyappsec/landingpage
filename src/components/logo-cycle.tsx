import { brandLogos } from "@/components/brand-logos";

const STEP_SECONDS = 1.45;

/**
 * The intro, in seconds.
 *
 * The headline lands as an ordinary sentence — "Ship fast, stay covered." —
 * and only then does the comma give way to the logo slot. OPEN_DELAY is long
 * enough to sit after the h1's own `rise` (0.9s), so the line is read once
 * before it moves; drop it and the split competes with the entrance.
 *
 * CYCLE_START overlaps the tail of the opening on purpose. Waiting for the gap
 * to finish left an empty square for a beat, which read as something failing to
 * load; arriving early, the first logo pops out of a gap still widening.
 */
const OPEN_DELAY = 1.05;
const OPEN_SECONDS = 0.6;
const CYCLE_START = OPEN_DELAY + OPEN_SECONDS - 0.18;

/**
 * Sits where the comma used to be in the headline and cycles the marks of the
 * tools agencies build with. The slot is a fixed square so swapping a logo
 * never nudges the rest of the line.
 *
 * Still no "use client": the whole sequence is CSS, so the headline animates
 * on the first paint rather than waiting for hydration.
 */
export function LogoCycle() {
  const cycle = brandLogos.length * STEP_SECONDS;

  return (
    <>
      {/*
        The real comma of the sentence, which shrinks away as the gap opens.
        It animates `font-size` to 0 rather than width: a comma's box is auto
        width, and auto doesn't interpolate, so a width animation would snap
        shut instead of closing. Collapsing the type collapses its advance too.
      */}
      <span
        aria-hidden="true"
        /* Matches the "Ship fast" half it punctuates, not the h1's default. */
        className="logo-slot-comma font-normal text-white/55"
        style={{ ["--comma-delay" as string]: `${OPEN_DELAY}s` }}
      >
        ,
      </span>

      <span
        className="logo-slot relative mx-3 inline-block h-[0.78em] w-[0.78em] align-baseline sm:mx-4"
        style={{
          ["--open-delay" as string]: `${OPEN_DELAY}s`,
          ["--open-seconds" as string]: `${OPEN_SECONDS}s`,
        }}
      >
        <span className="sr-only">
          {brandLogos.map((l) => l.name).join(", ")}
        </span>
        <span
          aria-hidden="true"
          className="absolute inset-0 translate-y-[0.1em]"
          style={{ ["--cycle" as string]: `${cycle}s` }}
        >
          {brandLogos.map((logo, i) => (
            <span
              key={logo.name}
              className="logo-cycle-item absolute inset-0 flex items-center justify-center"
              style={{ animationDelay: `${CYCLE_START + i * STEP_SECONDS}s` }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={logo.src}
                alt=""
                aria-hidden="true"
                className="h-full w-full object-contain"
                style={logo.scale ? { scale: String(logo.scale) } : undefined}
              />
            </span>
          ))}
        </span>
      </span>
    </>
  );
}
