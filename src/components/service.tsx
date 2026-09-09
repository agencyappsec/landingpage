import { ProofVideo } from "@/components/ProofVideo";
import { Reveal } from "@/components/reveal";
import { offers, serviceVideoLeadIn } from "@/lib/service";

export function Service() {
  return (
    <section id="service" className="w-full px-6 pt-20 pb-24 sm:pt-24 sm:pb-32">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <h2 className="reveal-item font-brand text-center text-[clamp(1.9rem,4vw,3.25rem)] leading-[1.1] font-semibold tracking-[-0.03em] text-white">
            Three ways I work with agencies.
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Left: the three offers, stacked. */}
          <Reveal>
            <ul className="grid gap-4">
              {offers.map((offer, i) => (
                <li
                  key={offer.name}
                  className="metal-edge reveal-item flex flex-col rounded-2xl p-6 transition hover:[--metal-fill:#101013]"
                  style={{ "--reveal-delay": `${i * 90}ms` } as React.CSSProperties}
                >
                  <h3 className="font-brand text-xl font-semibold tracking-[-0.01em] text-white">
                    {offer.name}
                  </h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-white/55">
                    {offer.body}
                  </p>
                  <p className="mt-6 border-t border-line pt-4 text-[11px] font-medium tracking-[0.14em] text-white/40 uppercase">
                    {offer.pricing}
                  </p>
                </li>
              ))}
            </ul>
          </Reveal>

          {/* Right: the walkthrough. */}
          {/*
            The player alone is centred on the row, so its midpoint lines up
            with the middle card's. The lead-in is taken out of flow above it
            (lg only) — left in flow it would push the player down by half its
            own height and break that alignment.
          */}
          <Reveal className="lg:flex lg:h-full lg:items-center">
            <div className="relative w-full">
              <p className="reveal-item text-base leading-relaxed text-white/55 sm:text-lg lg:absolute lg:bottom-full lg:left-0 lg:mb-5 lg:w-full">
                {serviceVideoLeadIn}
              </p>
              <div
                className="reveal-item"
                style={{ "--reveal-delay": "110ms" } as React.CSSProperties}
              >
                {/* Placeholder: same media as the hero until the long cut is recorded. */}
                <ProofVideo maxWidth="100%" className="mt-5 lg:mt-0" />
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
