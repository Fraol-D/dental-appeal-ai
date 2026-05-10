"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { GlassNavbar } from "../../components/marketing/GlassNavbar";
import { DenialForm, DenialFormValues } from "../../components/DenialForm";
import { LetterPreview } from "../../components/LetterPreview";

const API_BASE = "https://bubbly-endurance-production-094f.up.railway.app";

type AppError = {
  message: string;
  isRateLimit: boolean;
};

export default function AppPage() {
  const [letter, setLetter] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<AppError | null>(null);

  const handleSubmit = async (values: DenialFormValues) => {
    setIsLoading(true);
    setError(null);
    setLetter("");

    try {
      const response = await fetch(`${API_BASE}/generate-appeal`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          denial_text: values.denialText,
          payer_name: values.payerName || undefined,
          cdt_code: values.cdtCode || undefined,
        }),
      });

      if (!response.ok) {
        let message = "Something went wrong. Please try again.";
        try {
          const data = await response.json();
          if (data.detail) {
            message = data.detail;
          }
        } catch {
          // ignore parse errors
        }

        if (response.status === 429) {
          setError({ message: "Please wait a moment and try again", isRateLimit: true });
        } else if (response.status === 400 || response.status === 422) {
          setError({ message, isRateLimit: false });
        } else {
          setError({ message: "Something went wrong. Please try again.", isRateLimit: false });
        }
        return;
      }

      const data = await response.json();
      setLetter(data.letter || "");
    } catch {
      setError({ message: "Unable to reach the server. Please check your connection and try again.", isRateLimit: false });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[var(--color-dark-surface)] text-white">
      <GlassNavbar />

      <section className="relative z-10 px-6 pt-32 pb-16 sm:pt-40 sm:pb-24">
        <div className="mx-auto max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="mb-10 text-center"
          >
            <h1 className="font-manrope text-[clamp(1.9rem,4vw,2.25rem)] font-extrabold tracking-[-0.02em] text-white">
              Generate Your Appeal Letter
            </h1>
            <p className="mx-auto mt-3 max-w-xl font-work leading-relaxed text-[var(--color-secondary-text)]">
              Paste the denial reason, add any known details, and let AppealMD draft a payer-specific appeal in seconds.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <DenialForm onSubmit={handleSubmit} isLoading={isLoading} />
          </motion.div>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="mt-6 rounded-2xl border border-white/[0.08] bg-[rgba(15,33,50,0.6)] p-5 text-center"
              >
                <p className="text-sm font-medium text-amber-300">{error.message}</p>
                {error.isRateLimit && (
                  <p className="mt-1 text-xs text-[var(--color-secondary-text)]">
                    Our system limits submissions to ensure quality for every clinic.
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-10">
            <LetterPreview letter={letter} isLoading={isLoading} />
          </div>
        </div>
      </section>
    </main>
  );
}
