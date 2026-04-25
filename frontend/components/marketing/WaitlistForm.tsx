"use client";

import { FormEvent, useState } from "react";

type WaitlistFormProps = {
  compact?: boolean;
};

export function WaitlistForm({ compact = false }: WaitlistFormProps) {
  const [email, setEmail] = useState("");
  const [isDentalOffice, setIsDentalOffice] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim()) {
      return;
    }
    setSubmitted(true);
  };

  return (
    <form onSubmit={handleSubmit} className={`mx-auto w-full ${compact ? "max-w-xl" : "max-w-3xl"}`}>
      <div className={`grid gap-4 ${compact ? "sm:grid-cols-1" : "sm:grid-cols-[1fr_auto]"}`}>
        <label className="relative block">
          <span className="sr-only">Work email</span>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Work email"
            required
            className="w-full rounded-2xl border border-white/15 bg-[var(--color-dark-surface)] px-5 py-3 font-work text-base text-white placeholder:text-white/40 outline-none transition focus:border-[var(--color-clinical-blue)] focus:shadow-[0_0_0_3px_rgba(46,134,193,0.25)]"
          />
        </label>

        <button type="submit" className="btn-primary justify-center px-6 py-3 text-sm">
          Request Access <span aria-hidden>→</span>
        </button>
      </div>

      <label className="mt-5 inline-flex cursor-pointer items-center gap-3 text-sm text-[var(--color-secondary-text)]">
        <input
          type="checkbox"
          checked={isDentalOffice}
          onChange={(event) => setIsDentalOffice(event.target.checked)}
          className="peer sr-only"
        />
        <span className="flex h-6 w-6 items-center justify-center rounded-md border border-white/15 bg-[var(--color-dark-surface)] text-sm text-transparent transition peer-checked:border-[var(--color-clinical-blue)] peer-checked:text-[var(--color-clinical-blue)]">
          +
        </span>
        I run a dental office
      </label>

      <p className="mt-4 font-inter text-xs text-[var(--color-secondary-text)]">
        No spam. We contact you when we&apos;re ready for your clinic.
      </p>

      {submitted ? (
        <p className="mt-3 text-sm text-[var(--color-clinical-blue)]">Thanks. You are on the early access list.</p>
      ) : null}
    </form>
  );
}
