"use client";

import Link from "next/link";
import { motion } from "framer-motion";

import { AtmosphericPlusField } from "../components/marketing/AtmosphericPlusField";
import { GlassNavbar } from "../components/marketing/GlassNavbar";
import { PayerMarquee } from "../components/marketing/PayerMarquee";
import { VerticalReveal } from "../components/marketing/VerticalReveal";
import { WaitlistForm } from "../components/marketing/WaitlistForm";

const HEADLINE = "Appeal dental denials with clinical AI precision";

const STEPS = [
  {
    title: "Classify the denial",
    body: "Paste the payer response and AppealMD identifies the denial pattern and CDT context in seconds.",
  },
  {
    title: "Map payer-specific rules",
    body: "We align the case to payer policy logic and required documentation before drafting your response.",
  },
  {
    title: "Generate a ready-to-send appeal",
    body: "Get a polished, editable letter your team can review and submit with clinical confidence.",
  },
];

export default function LandingPage() {
  const headlineWords = HEADLINE.split(" ");

  return (
    <main className="relative overflow-x-hidden bg-[var(--color-dark-surface)] text-white">
      <AtmosphericPlusField className="z-0" />
      <GlassNavbar />

      <section className="relative z-10 flex min-h-screen items-center justify-center overflow-hidden px-6 pt-24">
        <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_30%_20%,rgba(46,134,193,0.22),transparent_45%),radial-gradient(circle_at_80%_0%,rgba(30,58,95,0.5),transparent_40%)]" />

        <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center text-center">
          <span className="pointer-events-none absolute inset-x-0 top-10 font-manrope text-[clamp(4rem,16vw,10rem)] font-extrabold tracking-[-0.03em] text-white/[0.04]">
            AppealMD
          </span>

          <h1 className="mx-auto max-w-[24ch] font-manrope text-[clamp(2.2rem,7vw,3.5rem)] font-extrabold leading-[1.06] tracking-[-0.02em] text-white">
            {(() => {
              let globalCharIndex = 0;

              return headlineWords.map((word, wordIndex) => {
                const wordStartIndex = globalCharIndex;
                globalCharIndex += word.length + 1;

                return (
                  <span key={`${word}-${wordIndex}`} className="inline-block whitespace-nowrap">
                    {word.split("").map((char, charIndex) => (
                      <motion.span
                        key={`${char}-${wordIndex}-${charIndex}`}
                        initial={{ y: -30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{
                          delay: (wordStartIndex + charIndex) * 0.03,
                          duration: 0.6,
                          ease: [0.34, 1.56, 0.64, 1],
                        }}
                        className="inline-block"
                      >
                        {char}
                      </motion.span>
                    ))}
                    {wordIndex < headlineWords.length - 1 ? "\u00A0" : null}
                  </span>
                );
              });
            })()}
          </h1>

          <p className="mt-5 max-w-2xl font-work text-lg leading-relaxed text-[var(--color-secondary-text)]">
            Generate payer-aware appeal letters in seconds and recover denied revenue for your clinic.
          </p>

          <Link href="/waitlist" className="btn-primary mt-10 px-8 py-3 text-base">
            Join the Waitlist <span aria-hidden>→</span>
          </Link>
        </div>
      </section>

      <div className="relative z-10">
        <PayerMarquee />
      </div>

      <section className="relative z-10 bg-[var(--color-brand-navy)] px-6 py-20 sm:py-24">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <VerticalReveal>
            <div>
              <p className="font-inter text-xs uppercase tracking-[0.18em] text-[var(--color-secondary-text)]">How it works</p>
              <h2 className="mt-4 font-manrope text-[clamp(1.9rem,4vw,2.25rem)] font-extrabold tracking-[-0.02em] text-white">
                Three steps. Zero manual work.
              </h2>

              <div className="mt-10 space-y-10">
                {STEPS.map((step, index) => (
                  <motion.article
                    key={step.title}
                    className="rounded-2xl border border-white/10 bg-[rgba(30,58,95,0.82)] p-6"
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ duration: 0.7, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <p className="font-manrope text-2xl font-bold text-[var(--color-clinical-blue)]">+ {index + 1}</p>
                    <h3 className="mt-3 font-manrope text-xl font-semibold text-white">{step.title}</h3>
                    <p className="mt-2 font-work leading-relaxed text-[var(--color-secondary-text)]">{step.body}</p>
                  </motion.article>
                ))}
              </div>
            </div>
          </VerticalReveal>

          <VerticalReveal delay={0.08}>
            <motion.div whileHover={{ scale: 1.03 }} transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}>
              <div className="group relative mx-auto w-full max-w-xl rounded-[2rem] border border-white/10 bg-[rgba(15,33,50,0.9)] p-5">
                <div className="absolute inset-0 rounded-[2rem] bg-black/15 transition duration-300 group-hover:bg-black/0" />
                <div className="relative space-y-4 rounded-3xl border border-white/10 bg-[rgba(30,58,95,0.88)] p-6">
                  <div className="flex items-center justify-between">
                    <p className="font-inter text-xs uppercase tracking-[0.14em] text-[var(--color-secondary-text)]">Appeal Preview</p>
                    <span className="rounded-full border border-white/10 bg-[rgba(46,134,193,0.2)] px-3 py-1 text-xs text-[var(--color-clinical-blue)]">
                      Processing
                    </span>
                  </div>
                  <h3 className="font-manrope text-xl font-semibold text-white">Denial Appeal Letter</h3>
                  <div className="space-y-3 text-sm leading-relaxed text-[var(--color-secondary-text)]">
                    <p>[PATIENT NAME]</p>
                    <p>Re: Claim [CLAIM NUMBER] for [DATE OF SERVICE]</p>
                    <p>
                      We respectfully request reconsideration based on payer policy interpretation, submitted documentation,
                      and CDT coding alignment.
                    </p>
                    <p>Sincerely,</p>
                    <p>Your Dental Office</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </VerticalReveal>
        </div>
      </section>

      <section className="relative z-10 bg-[var(--color-dark-surface)] px-6 py-20 sm:py-24">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="font-manrope text-[clamp(1.9rem,4vw,2.25rem)] font-extrabold tracking-[-0.02em] text-white">
            Be first to recover denied revenue with AppealMD
          </h2>
          <p className="mx-auto mt-4 max-w-xl font-work leading-relaxed text-[var(--color-secondary-text)]">
            Join the private waitlist for dental clinics and revenue teams.
          </p>
          <div className="mt-10">
            <WaitlistForm />
          </div>
        </div>
      </section>
    </main>
  );
}
