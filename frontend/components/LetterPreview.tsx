type LetterPreviewProps = {
  letter: string;
  isLoading: boolean;
};

export function LetterPreview({ letter, isLoading }: LetterPreviewProps) {
  return (
    <section className="rounded-3xl border border-white/15 bg-slate-900/70 p-5 shadow-[0_15px_50px_rgba(2,6,23,0.45)] backdrop-blur sm:p-7">
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 className="font-serif text-2xl text-white">Generated Appeal Letter</h2>
        {isLoading ? <span className="text-xs uppercase tracking-[0.18em] text-emerald-300">Working</span> : null}
      </div>

      {letter ? (
        <article className="max-h-[32rem] overflow-y-auto whitespace-pre-wrap rounded-2xl border border-white/20 bg-white px-5 py-4 text-[15px] leading-7 text-slate-800">
          {letter}
        </article>
      ) : (
        <div className="rounded-2xl border border-dashed border-white/25 bg-slate-950/30 px-5 py-8 text-sm text-slate-300">
          Submit the form to generate and preview your letter here.
        </div>
      )}
    </section>
  );
}
