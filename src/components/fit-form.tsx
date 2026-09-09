"use client";

import { useEffect, useRef, useState } from "react";

import Cal from "@calcom/embed-react";

import {
  calLink,
  declineReason,
  fitQuestions,
  isQualified,
  type FitAnswers,
} from "@/lib/fit";
import { PREFILL_EMAIL_EVENT, submitLead } from "@/lib/lead";

/**
 * One card that advances a step at a time: four questions, then contact
 * details, then either the calendar or an honest decline.
 *
 * Submitting posts the lead to /api/lead, which mails it on. That happens for
 * everyone who reaches the end — the ones who don't qualify are worth knowing
 * about too, since the decline is a judgement call and some of them are worth
 * a second look.
 */
const TOTAL_STEPS = fitQuestions.length + 1;

export function FitForm() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<FitAnswers>({});
  const [contact, setContact] = useState({ name: "", email: "", phone: "" });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // A pending advance must not fire after the card has gone.
  useEffect(() => {
    return () => {
      if (advanceTimer.current) clearTimeout(advanceTimer.current);
    };
  }, []);

  const question = fitQuestions[step];
  const onContactStep = step === fitQuestions.length;
  const qualified = isQualified(answers);
  const calConfigured = Boolean(calLink) && calLink !== "REPLACE_ME";
  const showCalendar = qualified && calConfigured;

  /*
    The hero bar fires this when someone books a demo from the top of the page.
    It only fills a blank field — if they've already typed an address here,
    theirs is the more deliberate one and stands.
  */
  useEffect(() => {
    function prefill(event: Event) {
      const email = (event as CustomEvent<string>).detail;
      setContact((c) => (c.email ? c : { ...c, email }));
    }
    window.addEventListener(PREFILL_EMAIL_EVENT, prefill);
    return () => window.removeEventListener(PREFILL_EMAIL_EVENT, prefill);
  }, []);

  /*
    The answer registers immediately, but the step is held back a beat.
    Advancing in the same tick swapped in the next question before the chosen
    option could paint, so the selected state was never actually seen: the
    click just looked like the form jumping forward.
  */
  function choose(id: (typeof fitQuestions)[number]["id"], option: string) {
    setAnswers((prev) => ({ ...prev, [id]: option }));

    if (advanceTimer.current) clearTimeout(advanceTimer.current);
    advanceTimer.current = setTimeout(() => {
      setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1));
    }, 260);
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!contact.name.trim() || !contact.email.trim()) {
      setError("Name and work email are needed to book.");
      return;
    }
    setError(null);

    submitLead({
      source: "fit-form",
      email: contact.email.trim(),
      name: contact.name.trim(),
      phone: contact.phone.trim() || undefined,
      answers,
      qualified,
    });

    setSubmitted(true);
  }

  if (submitted) {
    /*
      Cal's month view only lays itself out side by side — details, calendar,
      times — once it has room. The questions live in a narrow square card, so
      the booking step breaks out of that column (and out of the section's
      max-w-3xl) to take the width it needs, capped so it stays readable.
    */
    return (
      <div
        className={`metal-edge mt-14 rounded-2xl p-6 sm:p-8 ${
          showCalendar
            ? "relative left-1/2 w-[min(calc(100vw-3rem),1180px)] -translate-x-1/2"
            : "mx-auto w-full max-w-xl"
        }`}
      >
        <div className="step-in">
          <h3 className="font-brand text-xl font-semibold text-white">
            {qualified ? "We’re a fit. Pick a time" : "Probably not a fit"}
          </h3>
          {qualified ? (
            calConfigured ? (
              /*
                The answers ride along as booking metadata, so the call lands
                in the calendar already knowing what they built and where they
                are — no repeating the form on the call itself.

                No fixed height on purpose. Cal sizes the iframe to its own
                content on every step, so the box has to be free to follow it
                — a fixed height leaves the short confirmation screen stranded
                inside a tall scrolling frame. min-h only covers the moment
                before Cal reports a height.
              */
              <Cal
                calLink={calLink!}
                className="metal-edge mt-5 min-h-[320px] w-full rounded-xl [--metal-fill:#000000]"
                config={{
                  layout: "month_view",
                  name: contact.name,
                  email: contact.email,
                  theme: "dark",
                  ...(contact.phone.trim()
                    ? { attendeePhoneNumber: contact.phone.trim() }
                    : {}),
                  "metadata[role]": answers.role ?? "",
                  "metadata[builtWith]": answers.builtWith ?? "",
                  "metadata[backend]": answers.backend ?? "",
                  "metadata[stage]": answers.stage ?? "",
                }}
              />
            ) : (
              <p className="mt-3 text-sm leading-relaxed text-white/55">
                Calendar not connected yet. Set NEXT_PUBLIC_CAL_LINK in
                .env.local to your cal.com link.
              </p>
            )
          ) : (
            <p className="mt-3 text-sm leading-relaxed text-white/55">
              {declineReason(answers)}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="metal-edge mx-auto mt-14 flex w-full max-w-xl flex-col rounded-2xl p-6 sm:aspect-square sm:p-8"
    >
      {/* progress */}
      <div className="flex items-center gap-4">
        <div className="h-px flex-1 bg-white/10">
          <div
            className="h-px bg-white/60 transition-[width] duration-500 ease-out"
            style={{ width: `${((step + 1) / TOTAL_STEPS) * 100}%` }}
          />
        </div>
        <span className="font-mono text-xs text-white/35">
          {step + 1} / {TOTAL_STEPS}
        </span>
      </div>

      <div key={step} className="step-in mt-7 flex flex-1 flex-col">
        {question ? (
          <>
            <h3 className="font-brand text-2xl leading-tight font-semibold tracking-[-0.02em] text-white sm:text-3xl">
              {question.label}
            </h3>
            {/*
              Options stretch to fill whatever height is left, so a four-option
              step and a seven-option step both fill the square instead of
              leaving a gap under the short ones.
            */}
            <div className="mt-6 flex flex-1 flex-col gap-2">
              {question.options.map((option) => {
                const active = answers[question.id] === option;
                return (
                  <button
                    key={option}
                    type="button"
                    aria-pressed={active}
                    onClick={() => choose(question.id, option)}
                    /*
                      The chosen option flips to a white fill. That is set
                      through the metal edge's own fill variable rather than a
                      bg- class: the fill is a background image, so a
                      background-colour would be painted over and never seen.
                    */
                    className={`metal-edge flex min-h-11 flex-1 items-center rounded-xl px-5 text-left text-sm transition sm:text-base ${
                      active
                        ? "font-medium text-black [--metal-fill:#ffffff]"
                        : "text-white/70 [--metal-fill:#000000] hover:text-white hover:[--metal-fill:#101013]"
                    }`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </>
        ) : (
          <>
            <h3 className="font-brand text-2xl leading-tight font-semibold tracking-[-0.02em] text-white sm:text-3xl">
              Where do I reach you
            </h3>
            <div className="mt-6 flex flex-1 flex-col justify-center gap-4">
              <Field
                id="fit-name"
                label="Name"
                value={contact.name}
                onChange={(v) => setContact((c) => ({ ...c, name: v }))}
                autoComplete="name"
              />
              <Field
                id="fit-email"
                label="Work email"
                type="email"
                value={contact.email}
                onChange={(v) => setContact((c) => ({ ...c, email: v }))}
                autoComplete="email"
              />
              <Field
                id="fit-phone"
                label="Phone number"
                hint="optional"
                type="tel"
                value={contact.phone}
                onChange={(v) => setContact((c) => ({ ...c, phone: v }))}
                autoComplete="tel"
              />
            </div>
          </>
        )}
      </div>

      {/*
        Only rendered once there's something to put in it: on the first step
        there's no Back and no submit, so the row — and the rule above it —
        would just be a strip of empty card.
      */}
      {step > 0 ? (
        <div className="mt-7 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => {
              setError(null);
              setStep((s) => Math.max(s - 1, 0));
            }}
            className="text-sm text-white/45 transition hover:text-white"
          >
            ← Back
          </button>

          {onContactStep ? (
            <div className="flex items-center gap-4">
              {error && <p className="text-sm text-white/50">{error}</p>}
              <button
                type="submit"
                className="rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition hover:bg-white/90"
              >
                See if we’re a fit
              </button>
            </div>
          ) : null}
        </div>
      ) : null}
    </form>
  );
}

function Field({
  id,
  label,
  hint,
  value,
  onChange,
  type = "text",
  autoComplete,
}: {
  id: string;
  label: string;
  hint?: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  autoComplete?: string;
}) {
  return (
    <label htmlFor={id} className="block">
      <span className="text-xs tracking-[0.1em] text-white/40 uppercase">
        {label}
        {hint && <span className="normal-case"> · {hint}</span>}
      </span>
      <input
        id={id}
        type={type}
        value={value}
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full rounded-xl border border-line bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition focus:border-white/25"
      />
    </label>
  );
}
