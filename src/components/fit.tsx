import Link from "next/link";

import { FitForm } from "@/components/fit-form";
import { Reveal } from "@/components/reveal";

export function Fit() {
  return (
    <section id="book" className="w-full px-6 pb-24 sm:pb-32">
      <div className="mx-auto max-w-3xl">
        <Reveal>
          <h2 className="reveal-item font-brand text-center text-[clamp(1.9rem,4vw,3.25rem)] leading-[1.1] font-semibold tracking-[-0.03em] text-white">
            See if we’re a fit.
          </h2>
        </Reveal>
        <FitForm />
        <p className="mt-5 text-center text-xs leading-relaxed text-white/35">
          Your details are never shared or sold. See our{" "}
          <Link
            href="/privacy"
            className="underline underline-offset-4 transition hover:text-white/70"
          >
            privacy policy
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
