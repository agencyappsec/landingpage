import { ProofVideo } from "@/components/ProofVideo";
import { Reveal } from "@/components/reveal";
import { offers, serviceVideoLeadIn } from "@/lib/service";
import { HERO_MAX_WIDTH } from "@/lib/video-sizing";

export function Service() {
  return (
    <section id="service" className="w-full px-6 pt-20 pb-24 sm:pt-24 sm:pb-32">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <h2 className="reveal-item font-brand text-center text-[clamp(1.9rem,4vw,3.25rem)] leading-[1.1] font-semibold tracking-[-0.03em] text-white">
            Two ways I work with builders.
          </h2>
        </Reveal>

        {/*
          One column: the two offers side by side, then the walkthrough under
          them. Putting the video beside the cards never lined up, because the
          lead-in above it made that column taller than the cards.
        */}
        <Reveal>
          <ul className="mt-14 grid gap-4 sm:grid-cols-2">
            {offers.map((offer, i) => (
              <li
                key={offer.name}
                className="metal-edge reveal-item flex flex-col rounded-2xl p-6 transition hover:[--metal-fill:#101013]"
                style={{ "--reveal-delay": `${i * 90}ms` } as React.CSSProperties}
              >
                <h3 className="font-brand text-xl font-semibold tracking-[-0.01em] text-white">
                  {offer.name}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-white/55">
                  {offer.body}
                </p>
              </li>
            ))}
          </ul>
        </Reveal>

        {/* The lead-in and player are one block so the text never leaves the video. */}
        <Reveal>
          <div className="mx-auto mt-12 max-w-4xl sm:mt-14">
            <p className="reveal-item mx-auto max-w-3xl text-center text-base leading-relaxed text-white/55 sm:text-lg">
              {serviceVideoLeadIn}
            </p>
            <div
              className="reveal-item"
              style={{ "--reveal-delay": "110ms" } as React.CSSProperties}
            >
              {/* Falls back to the hero's cut until the long one has an ID. */}
              {/*
                The hero player's height-derived fit. On desktop the hero itself
                now spans its description line, so this keeps the size the hero
                had before that.
              */}
              <ProofVideo
                media="service"
                maxWidth={HERO_MAX_WIDTH}
                className="mt-6"
              />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
