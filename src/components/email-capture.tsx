"use client";

import { useState } from "react";

import { dispatchPrefillEmail, emailError, submitLead } from "@/lib/lead";

/**
 * The email bar under the video. Two jobs on submit:
 *
 * 1. Record the address immediately as an unqualified lead. Most people who
 *    type here never finish the fit form, and a bare address is still a lead.
 * 2. Walk them down to the form with the email already filled in, so the one
 *    thing they've typed isn't asked for a second time.
 */
export function EmailCapture() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [website, setWebsite] = useState("");

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    const trimmed = email.trim();
    const problem = emailError(trimmed);
    if (problem) {
      setError(problem);
      return;
    }
    setError(null);

    submitLead({ source: "hero", email: trimmed, website });
    dispatchPrefillEmail(trimmed);

    document.getElementById("book")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto w-full max-w-md" noValidate>
      {/*
        The metal edge owns the border, so focus and the error state can no
        longer be shown by colouring it. Focus brightens the fill instead, and
        an error draws a ring outside the edge, which stays legible without
        fighting the gradient.
      */}
      <div
        className={`metal-edge flex w-full items-center gap-2 rounded-full p-1.5 pl-5 transition [--metal-fill:#0a0a0c] focus-within:[--metal-fill:#141418] ${
          error ? "ring-1 ring-white/35" : ""
        }`}
      >
        <HoneypotField value={website} onChange={setWebsite} />
        <label htmlFor="work-email" className="sr-only">
          Your work email
        </label>
        <input
          id="work-email"
          type="email"
          autoComplete="email"
          maxLength={254}
          placeholder="Your work email here"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (error) setError(null);
          }}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? "work-email-error" : undefined}
          className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/40"
        />
        <button
          type="submit"
          className="shrink-0 rounded-full bg-white px-5 py-2.5 text-sm font-medium whitespace-nowrap text-black transition hover:bg-white/90"
        >
          Book a demo
        </button>
      </div>
      {error && (
        <p id="work-email-error" className="mt-2 text-center text-xs text-white/50">
          {error}
        </p>
      )}
    </form>
  );
}

/**
 * Bot trap. Off-screen, out of the tab order and hidden from screen readers,
 * so only a script filling every input it finds will put anything in it.
 */
export function HoneypotField({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <input
      type="text"
      name="website"
      tabIndex={-1}
      autoComplete="off"
      aria-hidden="true"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="pointer-events-none absolute -left-[9999px] h-px w-px opacity-0"
    />
  );
}
