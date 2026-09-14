import { ProofVideo } from "@/components/ProofVideo";
import { Reveal } from "@/components/reveal";
import { offers, serviceVideoLeadIn } from "@/lib/service";

export function Service() {
  return (
    <section id="service" className="w-full px-6 pt-20 pb-24 sm:pt-24 sm:pb-32">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <h2 className="reveal-item font-brand text-center text-[clamp(1.9rem,4vw,3.25rem)] leading-[1.1] font-semibold tracking-[-0.03em] text-white">
            Two ways I work with agencies.
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Left: the two offers, stacked. */}
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
            Lead-in and player are one block, centred against the card stack, so
            the two columns balance on the same midline whatever the cards do.

            The lead-in used to be lifted out of flow above the player so the
            player alone could hold that midline. That was tuned for three
            cards; at two, the shorter row left the floated text stranded above
            the column. In flow it just moves down with everything else.
          */}
          <Reveal className="lg:flex lg:h-full lg:items-center">
            <div className="w-full">
              <p className="reveal-item text-base leading-relaxed text-white/55 sm:text-lg">
                {serviceVideoLeadIn}
              </p>
              <div
                className="reveal-item"
                style={{ "--reveal-delay": "110ms" } as React.CSSProperties}
              >
                {/* Falls back to the hero's cut until the long one has an ID. */}
                <ProofVideo media="service" maxWidth="100%" className="mt-5" />
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
