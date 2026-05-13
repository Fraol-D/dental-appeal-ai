import Image from "next/image";
import Link from "next/link";

export function GlassNavbar() {
  return (
    <header className="fixed inset-x-0 top-4 z-40 px-4 sm:px-6">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between rounded-full border border-white/10 bg-[rgba(30,58,95,0.7)] px-5 py-3 backdrop-blur-[24px]">
        <Link href="/" className="inline-flex items-center gap-2">
          <Image
            src="/assets/logo/appealMDsquareLogo.png"
            alt="AppealMD"
            width={32}
            height={32}
            className="h-8 w-auto"
            sizes="32px"
            priority
          />
          <span className="text-[18px] font-bold text-white">
            Appeal<span className="text-[#2E86C1]">MD</span>
          </span>
        </Link>
        <div className="flex items-center gap-3">
          <Link
            href="/app"
            className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
          >
            Try Free
          </Link>
          <Link href="/waitlist" className="btn-primary text-sm">
            Join Waitlist <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
