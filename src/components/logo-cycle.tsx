import { brandLogos } from "@/components/brand-logos";

const STEP_SECONDS = 1.45;

/**
 * Sits where the comma used to be in the headline and cycles the marks of the
 * tools agencies build with. The slot is a fixed square so swapping a logo
 * never nudges the rest of the line.
 */
export function LogoCycle() {
  const cycle = brandLogos.length * STEP_SECONDS;

  return (
    <span className="relative mx-3 inline-block h-[0.78em] w-[0.78em] align-baseline sm:mx-4">
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
            style={{ animationDelay: `${i * STEP_SECONDS}s` }}
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
  );
}
