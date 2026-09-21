import { Reveal } from "@/components/reveal";
import { offers } from "@/lib/service";

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
          The two offers side by side. The walkthrough that used to sit under
          them now plays in the hero, so this section is just the cards.
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
      </div>
    </section>
  );
}
