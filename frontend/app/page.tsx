"use client";

import { useState } from "react";

import { DenialForm, DenialFormValues } from "../components/DenialForm";
import { LetterPreview } from "../components/LetterPreview";

type GenerateAppealResponse = {
  letter: string;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8000";

export default function Page() {
  const [letter, setLetter] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (values: DenialFormValues) => {
    setError("");
    setLetter("");
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/generate-appeal`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          denial_text: values.denialText,
          payer_name: values.payerName || undefined,
        }),
      });

      const data = (await response.json()) as GenerateAppealResponse | { detail?: string };

      if (!response.ok) {
        const message = typeof data === "object" && data && "detail" in data ? data.detail : "Request failed.";
        throw new Error(message || "Request failed.");
      }

      setLetter((data as GenerateAppealResponse).letter);
    } catch (submitError) {
      const message = submitError instanceof Error ? submitError.message : "Something went wrong.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-x-hidden px-4 py-8 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,_rgba(56,189,248,0.2),_transparent_40%),radial-gradient(circle_at_20%_20%,_rgba(16,185,129,0.18),_transparent_35%)]" />
      <section className="mx-auto w-full max-w-4xl space-y-8">
        <header className="space-y-3">
          <p className="text-xs uppercase tracking-[0.22em] text-emerald-300">Phase 2 Frontend</p>
          <h1 className="font-serif text-3xl leading-tight text-white sm:text-4xl">
            Dental Insurance Denial Appeal Generator
          </h1>
          <p className="max-w-2xl text-sm text-slate-300 sm:text-base">
            Paste a denial reason, optionally add payer name, and generate a professional appeal letter in seconds.
          </p>
        </header>

        <DenialForm onSubmit={handleSubmit} isLoading={isLoading} />

        {error ? (
          <div className="rounded-2xl border border-rose-400/40 bg-rose-500/10 p-4 text-sm text-rose-200">{error}</div>
        ) : null}

        <LetterPreview letter={letter} isLoading={isLoading} />
      </section>
    </main>
  );
}
