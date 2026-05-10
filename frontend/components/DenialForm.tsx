"use client";

import { FormEvent, useState } from "react";

export type DenialFormValues = {
  denialText: string;
  payerName: string;
  cdtCode: string;
};

type DenialFormProps = {
  onSubmit: (values: DenialFormValues) => Promise<void>;
  isLoading: boolean;
};

export function DenialForm({ onSubmit, isLoading }: DenialFormProps) {
  const [denialText, setDenialText] = useState("");
  const [payerName, setPayerName] = useState("");
  const [cdtCode, setCdtCode] = useState("");
  const [localError, setLocalError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (denialText.trim().length < 10) {
      setLocalError("Please enter a longer denial reason before submitting.");
      return;
    }

    setLocalError("");
    await onSubmit({
      denialText: denialText.trim(),
      payerName: payerName.trim(),
      cdtCode: cdtCode.trim(),
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-3xl border border-white/[0.08] bg-[rgba(30,58,95,0.82)] p-6 sm:p-8"
    >
      <div className="rounded-xl border border-white/[0.08] bg-[rgba(15,33,50,0.6)] p-4 text-sm leading-relaxed text-[var(--color-secondary-text)]">
        <span className="font-semibold text-white">Privacy note:</span> Do not enter patient names,
        dates of birth, insurance IDs, or other identifying details. Use placeholders like{" "}
        <span className="font-mono text-[var(--color-clinical-blue)]">[PATIENT NAME]</span> instead.
        Fill these in after downloading.
      </div>

      <div className="space-y-2">
        <label htmlFor="denial-text" className="font-inter text-sm font-medium text-white">
          Denial Reason
        </label>
        <textarea
          id="denial-text"
          value={denialText}
          onChange={(event) => setDenialText(event.target.value)}
          placeholder="Paste the denial reason text from your EOB or payer notice..."
          className="h-56 w-full rounded-xl border border-white/20 bg-[var(--color-dark-surface)] px-4 py-3 text-sm text-white outline-none ring-0 transition placeholder:text-white/40 focus:border-[var(--color-clinical-blue)] focus:shadow-[0_0_0_3px_rgba(46,134,193,0.25)] sm:text-base"
          required
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="payer-name" className="font-inter text-sm font-medium text-white">
            Payer Name <span className="text-[var(--color-secondary-text)]">(optional)</span>
          </label>
          <input
            id="payer-name"
            type="text"
            value={payerName}
            onChange={(event) => setPayerName(event.target.value)}
            placeholder="Delta Dental"
            className="w-full rounded-xl border border-white/20 bg-[var(--color-dark-surface)] px-4 py-3 text-sm text-white outline-none ring-0 transition placeholder:text-white/40 focus:border-[var(--color-clinical-blue)] focus:shadow-[0_0_0_3px_rgba(46,134,193,0.25)] sm:text-base"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="cdt-code" className="font-inter text-sm font-medium text-white">
            CDT Code <span className="text-[var(--color-secondary-text)]">(optional)</span>
          </label>
          <input
            id="cdt-code"
            type="text"
            value={cdtCode}
            onChange={(event) => setCdtCode(event.target.value)}
            placeholder="D4341"
            className="w-full rounded-xl border border-white/20 bg-[var(--color-dark-surface)] px-4 py-3 text-sm text-white outline-none ring-0 transition placeholder:text-white/40 focus:border-[var(--color-clinical-blue)] focus:shadow-[0_0_0_3px_rgba(46,134,193,0.25)] sm:text-base"
          />
        </div>
      </div>

      {localError ? (
        <p className="text-sm text-amber-300">{localError}</p>
      ) : null}

      <button
        type="submit"
        disabled={isLoading}
        className="btn-primary w-full items-center justify-center px-6 py-3 text-sm disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {isLoading ? (
          <span className="inline-flex items-center gap-2">
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            Generating Letter...
          </span>
        ) : (
          <>
            Generate Appeal Letter <span aria-hidden>→</span>
          </>
        )}
      </button>
    </form>
  );
}
