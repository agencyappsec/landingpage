"use client";

import { useState } from "react";

import { dispatchPrefillEmail, looksLikeEmail, submitLead } from "@/lib/lead";

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
  const [error, setError] = useState(false);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    const trimmed = email.trim();
    if (!looksLikeEmail(trimmed)) {
      setError(true);
      return;
    }
    setError(false);

    submitLead({ source: "hero", email: trimmed });
    dispatchPrefillEmail(trimmed);

    document.getElementById("book")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto w-full max-w-md" noValidate>
      <div
        className={`flex w-full items-center gap-2 rounded-full border bg-white/[0.04] p-1.5 pl-5 backdrop-blur transition focus-within:border-white/25 ${
          error ? "border-white/40" : "border-line"
        }`}
      >
        <label htmlFor="work-email" className="sr-only">
          Your work email
        </label>
        <input
          id="work-email"
          type="email"
          autoComplete="email"
          placeholder="Your work email here"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (error) setError(false);
          }}
          aria-invalid={error}
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
          That doesn’t look like an email address.
        </p>
      )}
    </form>
  );
}
