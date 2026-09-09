import { AudienceCarousel } from "@/components/audience-carousel";
import { Reveal } from "@/components/reveal";
import { audienceIntro } from "@/lib/audience";

export function Audience() {
  return (
    <section id="fit" className="w-full px-6 pt-4 pb-24 sm:pb-32">
      <div className="mx-auto max-w-3xl">
        <Reveal>
          <h2 className="reveal-item font-brand text-center text-[clamp(1.9rem,4vw,3.25rem)] leading-[1.1] font-semibold tracking-[-0.03em] text-white">
            Who this is for.
          </h2>
          <p
            className="reveal-item mt-6 text-center text-base leading-relaxed text-white/55 sm:text-lg"
            style={{ "--reveal-delay": "90ms" } as React.CSSProperties}
          >
            {audienceIntro}
          </p>
        </Reveal>

        <Reveal>
          <div className="reveal-item mt-12">
            <AudienceCarousel />
          </div>
        </Reveal>

      </div>
    </section>
  );
}
