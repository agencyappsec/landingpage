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

      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col items-center px-6 pt-6 text-center sm:pt-7">
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
          On desktop the player is exactly as wide as the one-line description
          above it. The wrapper is sized by the text alone (w-max); the player's
          box is width 0 with min-width 100%, so it fills that width without
          adding to it. Below lg the description wraps, so the player keeps its
          height-derived fit instead.
        */}
        <div className="flex w-full flex-col items-center lg:w-max">
          <p
            className="rise mt-5 max-w-2xl text-balance text-base leading-relaxed text-white/55 sm:text-lg lg:max-w-none lg:whitespace-nowrap"
            style={{ animationDelay: "80ms" }}
          >
            Security that runs inside your pipeline, on every project you
            build.
          </p>

          <div
            className="rise mx-auto w-full max-w-(--hero-video-max) lg:w-0 lg:min-w-full lg:max-w-none"
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
