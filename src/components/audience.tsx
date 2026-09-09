import { Reveal } from "@/components/reveal";
import { audienceIntro, audienceSignals } from "@/lib/audience";

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
          <ul className="mt-12 space-y-px overflow-hidden rounded-2xl border border-line">
            {audienceSignals.map((signal, i) => (
              <li
                key={signal}
                className="reveal-item flex gap-4 border-b border-line bg-white/[0.02] p-5 last:border-b-0 sm:p-6"
                style={{ "--reveal-delay": `${i * 70}ms` } as React.CSSProperties}
              >
                <svg
                  viewBox="0 0 16 16"
                  aria-hidden="true"
                  className="mt-0.5 h-4 w-4 shrink-0 text-white/40"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 8.5 6.2 12 13 4.5" />
                </svg>
                <p className="text-sm leading-relaxed text-white/70 sm:text-base">
                  {signal}
                </p>
              </li>
            ))}
          </ul>
        </Reveal>

      </div>
    </section>
  );
}
