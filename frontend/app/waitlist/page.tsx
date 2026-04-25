import { GlassNavbar } from "../../components/marketing/GlassNavbar";
import { WaitlistForm } from "../../components/marketing/WaitlistForm";

export default function WaitlistPage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[var(--color-dark-surface)] px-6 pb-20 pt-28 text-white">
      <GlassNavbar />

      <section className="mx-auto max-w-3xl rounded-[2rem] border border-white/10 bg-[rgba(30,58,95,0.82)] p-8 sm:p-12">
        <p className="font-inter text-xs uppercase tracking-[0.16em] text-[var(--color-secondary-text)]">Early access</p>
        <h1 className="mt-4 font-manrope text-[clamp(2rem,5vw,3rem)] font-extrabold leading-[1.08] tracking-[-0.02em]">
          Join the AppealMD waitlist
        </h1>
        <p className="mt-4 max-w-2xl font-work text-base leading-relaxed text-[var(--color-secondary-text)]">
          Bring clinical precision to insurance appeals and reclaim denied revenue for your dental team.
        </p>

        <div className="mt-10">
          <WaitlistForm compact />
        </div>
      </section>
    </main>
  );
}
