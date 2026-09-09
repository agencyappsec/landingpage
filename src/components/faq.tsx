"use client";

import { useState } from "react";

import { Reveal } from "@/components/reveal";
import { faqIntro, faqs } from "@/lib/faq";

/**
 * One answer on screen at a time: opening a question closes whichever was
 * open. `open` holds a single index rather than a set, so that rule is
 * structural — there is no state that can represent two open at once.
 *
 * Height is animated with the 0fr → 1fr grid row trick instead of max-height,
 * so the panel travels its real height and long answers don't either clip or
 * spend the tail of the transition animating empty space.
 */
export function Faq() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" className="w-full px-6 pb-24 sm:pb-32">
      <div className="mx-auto max-w-3xl">
        <Reveal>
          <h2 className="reveal-item font-brand text-center text-[clamp(1.9rem,4vw,3.25rem)] leading-[1.1] font-semibold tracking-[-0.03em] text-white">
            Questions I get asked.
          </h2>
          <p
            className="reveal-item mx-auto mt-6 max-w-2xl text-center text-base leading-relaxed text-white/55 sm:text-lg"
            style={{ "--reveal-delay": "90ms" } as React.CSSProperties}
          >
            {faqIntro}
          </p>
        </Reveal>

        <Reveal>
          <ul className="mt-14 grid gap-3">
            {faqs.map((faq, i) => {
              const isOpen = open === i;
              return (
                <li
                  key={faq.question}
                  className={`reveal-item rounded-2xl border bg-white/[0.02] transition ${
                    isOpen
                      ? "border-white/15 bg-white/[0.04]"
                      : "border-line hover:border-white/15 hover:bg-white/[0.04]"
                  }`}
                  style={
                    { "--reveal-delay": `${i * 60}ms` } as React.CSSProperties
                  }
                >
                  <h3>
                    <button
                      type="button"
                      onClick={() => setOpen(isOpen ? null : i)}
                      aria-expanded={isOpen}
                      aria-controls={`faq-panel-${i}`}
                      id={`faq-question-${i}`}
                      className="flex w-full items-center justify-between gap-6 px-6 py-5 text-left text-base leading-snug font-medium tracking-[-0.01em] text-white sm:text-lg"
                    >
                      {faq.question}
                      {/* A plus that becomes a close mark on open. */}
                      <span
                        aria-hidden
                        className={`relative block size-4 shrink-0 text-white/45 transition-transform duration-300 motion-reduce:transition-none ${
                          isOpen ? "rotate-45" : ""
                        }`}
                      >
                        <span className="absolute top-1/2 left-0 h-px w-full -translate-y-1/2 bg-current" />
                        <span className="absolute top-0 left-1/2 h-full w-px -translate-x-1/2 bg-current" />
                      </span>
                    </button>
                  </h3>

                  {/*
                    Collapsed panels are `inert`, not `hidden`: display:none
                    would cancel the row transition, while inert keeps the
                    closed answer out of the tab order and off screen readers.
                  */}
                  <div
                    id={`faq-panel-${i}`}
                    role="region"
                    aria-labelledby={`faq-question-${i}`}
                    inert={!isOpen}
                    className={`grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none ${
                      isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="px-6 pb-6 text-sm leading-relaxed text-white/55 sm:text-base">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
