import Link from "next/link";

export function GlassNavbar() {
  return (
    <header className="fixed inset-x-0 top-4 z-40 px-4 sm:px-6">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between rounded-full border border-white/10 bg-[rgba(30,58,95,0.7)] px-5 py-3 backdrop-blur-[24px]">
        <Link href="/" className="text-sm font-semibold uppercase tracking-[0.16em] text-white">
          Appeal<span className="text-[var(--color-clinical-blue)]">MD</span>
        </Link>
        <Link href="/waitlist" className="btn-primary text-sm">
          Join Waitlist <span aria-hidden>→</span>
        </Link>
      </div>
    </header>
  );
}
