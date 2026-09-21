import { ProofVideo } from "@/components/ProofVideo";
import { EmailCapture } from "@/components/email-capture";
import { LogoCycle } from "@/components/logo-cycle";
import { SiteNav } from "@/components/site-nav";
import { StackStrip } from "@/components/stack-strip";
import { HERO_MAX_WIDTH } from "@/lib/video-sizing";

export function Hero() {
  return (
    <section
      id="top"
      // Full-screen only from sm up. On a phone the content is shorter than the
      // screen, and stretching to fit left a dead gap above the stack strip.
      className="relative isolate flex flex-col overflow-hidden bg-background sm:min-h-[100svh]"
    >
      {/* backdrop */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="grid-field" />
      </div>

      <SiteNav />

      {/*
        justify-center matters once the hero is taller than its content: flex-1
        makes this box absorb the leftover height either way, and without it
        every pixel of that slack collected below the email capture as one dead
        band above the stack strip. Centred, it splits above and below instead.
      */}
      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col items-center justify-center px-6 pt-6 text-center sm:pt-7">
        {/*
          Phones get a steeper vw so the one-line slogan uses the width it has
          (it still fits at 320px). Capped at 2rem so it meets the sm size at the
          breakpoint instead of shrinking as the screen gets wider.
        */}
        <h1 className="rise whitespace-nowrap font-brand text-[clamp(1.15rem,7vw,2rem)] leading-[1.08] tracking-[-0.03em] sm:text-[clamp(1.15rem,4.9vw,4.5rem)]">
          <span className="font-normal text-white/55">Ship fast</span>
          <LogoCycle />
          <span className="font-semibold text-white">stay covered.</span>
        </h1>

        {/*
          The player used to be sized to match the one-line description above it
          (a w-max wrapper, the player at width 0 with min-width 100%). That was
          tuned against a longer sentence; the description is now short enough
          that matching it starved the player — 532px where its height-derived
          fit allows 800px — and the 150px of height that bought went straight
          into the gap above the stack strip. It takes its own fit again.
        */}
        <div className="flex w-full flex-col items-center">
          <p
            className="rise mt-5 max-w-2xl text-balance text-base leading-relaxed text-white/55 sm:text-lg lg:max-w-none lg:whitespace-nowrap"
            style={{ animationDelay: "80ms" }}
          >
            Security that runs inside your pipeline, on every project you
            build.
          </p>

          <div
            className="rise mx-auto w-full max-w-(--hero-video-max)"
            style={
              {
                animationDelay: "160ms",
                "--hero-video-max": HERO_MAX_WIDTH,
              } as React.CSSProperties
            }
          >
            <ProofVideo maxWidth="100%" />
          </div>
        </div>

        <div
          className="rise mt-6 w-full"
          style={{ animationDelay: "240ms" }}
        >
          <EmailCapture />
        </div>
      </div>

      {/*
        TODO: A testimonial strip belongs here once there are real reviews. The
        previous one was removed rather than hidden: every quote in it was
        invented placeholder copy, and unrendered invented endorsements are
        still one careless import away from being published as real ones. See
        src/components/testimonials.tsx in the history for the markup.
      */}
      <StackStrip />
    </section>
  );
}
