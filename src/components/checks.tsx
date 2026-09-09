import { Reveal } from "@/components/reveal";
import { checks, checksIntro } from "@/lib/checks";

export function Checks() {
  return (
    <section id="patterns" className="w-full px-6 pt-12 sm:pt-16">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <h2 className="reveal-item font-brand text-center text-[clamp(1.9rem,4vw,3.25rem)] leading-[1.1] font-semibold tracking-[-0.03em] text-white">
            What I actually check.
          </h2>
          <p
            className="reveal-item mx-auto mt-6 max-w-3xl text-center text-base leading-relaxed text-white/55 sm:text-lg"
            style={{ "--reveal-delay": "90ms" } as React.CSSProperties}
          >
            {checksIntro.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </p>
        </Reveal>

        <Reveal>
          <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {checks.map((check, i) => (
              <li
                key={check.question}
                className="reveal-item rounded-2xl border border-line bg-white/[0.02] p-6 transition hover:border-white/15 hover:bg-white/[0.04]"
                style={{ "--reveal-delay": `${i * 70}ms` } as React.CSSProperties}
              >
                <h3 className="text-lg leading-snug font-medium tracking-[-0.01em] text-white">
                  {check.question}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-white/55">
                  {check.body}
                </p>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
