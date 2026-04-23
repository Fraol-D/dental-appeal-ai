import Link from "next/link";

export default function ResultPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="max-w-lg rounded-2xl border border-white/15 bg-slate-900/60 p-8 text-center">
        <h1 className="font-serif text-2xl text-white">Use The Main Form</h1>
        <p className="mt-3 text-sm text-slate-300">
          This phase uses a single-page flow. Submit denial details from the homepage.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex rounded-lg bg-emerald-400 px-4 py-2 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-300"
        >
          Go To Form
        </Link>
      </div>
    </main>
  );
}
