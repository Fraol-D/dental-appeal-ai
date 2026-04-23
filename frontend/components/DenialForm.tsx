"use client";

import { FormEvent, useState } from "react";

export type DenialFormValues = {
  denialText: string;
  payerName: string;
};

type DenialFormProps = {
  onSubmit: (values: DenialFormValues) => Promise<void>;
  isLoading: boolean;
};

export function DenialForm({ onSubmit, isLoading }: DenialFormProps) {
  const [denialText, setDenialText] = useState("");
  const [payerName, setPayerName] = useState("");
  const [localError, setLocalError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (denialText.trim().length < 10) {
      setLocalError("Please enter a longer denial reason before submitting.");
      return;
    }

    setLocalError("");
    await onSubmit({ denialText: denialText.trim(), payerName: payerName.trim() });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-3xl border border-white/15 bg-slate-900/70 p-5 shadow-[0_15px_50px_rgba(2,6,23,0.45)] backdrop-blur sm:p-7"
    >
      <div className="rounded-xl border border-amber-300/25 bg-amber-300/10 p-3 text-xs text-amber-100 sm:text-sm">
        Do not enter patient names, dates of birth, insurance IDs, or other identifying details. Use placeholders.
      </div>

      <div className="space-y-2">
        <label htmlFor="denial-text" className="text-sm font-semibold text-slate-100">
          Denial Reason
        </label>
        <textarea
          id="denial-text"
          value={denialText}
          onChange={(event) => setDenialText(event.target.value)}
          placeholder="Paste the denial reason text here..."
          className="h-56 w-full rounded-xl border border-white/20 bg-slate-950/70 px-4 py-3 text-sm text-slate-100 outline-none ring-0 transition placeholder:text-slate-500 focus:border-emerald-300/60 focus:shadow-[0_0_0_3px_rgba(52,211,153,0.18)] sm:text-base"
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="payer-name" className="text-sm font-semibold text-slate-100">
          Payer Name (optional)
        </label>
        <input
          id="payer-name"
          type="text"
          value={payerName}
          onChange={(event) => setPayerName(event.target.value)}
          placeholder="Example: Delta Dental"
          className="w-full rounded-xl border border-white/20 bg-slate-950/70 px-4 py-3 text-sm text-slate-100 outline-none ring-0 transition placeholder:text-slate-500 focus:border-emerald-300/60 focus:shadow-[0_0_0_3px_rgba(52,211,153,0.18)] sm:text-base"
        />
      </div>

      {localError ? <p className="text-sm text-rose-300">{localError}</p> : null}

      <button
        type="submit"
        disabled={isLoading}
        className="inline-flex w-full items-center justify-center rounded-xl bg-emerald-400 px-4 py-3 text-sm font-bold text-emerald-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-65 sm:w-auto"
      >
        {isLoading ? "Generating Letter..." : "Generate Appeal Letter"}
      </button>
    </form>
  );
}
