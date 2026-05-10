"use client";

import { useState, useCallback, useEffect } from "react";

type LetterPreviewProps = {
  letter: string;
  isLoading: boolean;
};

async function exportLetterToDocx(letterText: string) {
  const { Document, Packer, Paragraph, TextRun } = await import("docx");

  const paragraphs = letterText
    .split("\n")
    .map(
      (line) =>
        new Paragraph({
          children: [new TextRun({ text: line, size: 22, font: "Calibri" })],
          spacing: { after: 120 },
        })
    );

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: paragraphs,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "appeal-letter.docx";
  a.click();
  URL.revokeObjectURL(url);
}

export function LetterPreview({ letter, isLoading }: LetterPreviewProps) {
  const [editableLetter, setEditableLetter] = useState(letter);

  useEffect(() => {
    setEditableLetter(letter);
  }, [letter]);

  const handleDownload = useCallback(async () => {
    await exportLetterToDocx(editableLetter);
  }, [editableLetter]);

  if (!letter && !isLoading) {
    return (
      <section className="rounded-3xl border border-white/[0.08] bg-[rgba(30,58,95,0.82)] p-6 sm:p-8">
        <div className="rounded-2xl border border-dashed border-white/20 bg-[rgba(15,33,50,0.4)] px-6 py-10 text-center text-sm text-[var(--color-secondary-text)]">
          Submit the form to generate and preview your letter here.
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-3xl border border-white/[0.08] bg-[rgba(30,58,95,0.82)] p-6 sm:p-8">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
        <h2 className="font-manrope text-xl font-bold text-white">Generated Appeal Letter</h2>
        <div className="flex items-center gap-3">
          {isLoading ? (
            <span className="font-inter text-xs uppercase tracking-[0.18em] text-[var(--color-clinical-blue)]">
              Working
            </span>
          ) : null}
          {!isLoading && letter ? (
            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-[rgba(15,33,50,0.6)] px-4 py-2 text-sm font-medium text-white transition hover:bg-[rgba(15,33,50,0.9)]"
            >
              Download .docx
            </button>
          ) : null}
        </div>
      </div>

      {letter ? (
        <textarea
          value={editableLetter}
          onChange={(e) => setEditableLetter(e.target.value)}
          className="max-h-[40rem] min-h-[16rem] w-full resize-y overflow-y-auto rounded-2xl border border-white/20 bg-white px-6 py-5 text-[15px] leading-7 text-[#1a1a2e] outline-none focus:border-[var(--color-clinical-blue)] focus:shadow-[0_0_0_3px_rgba(46,134,193,0.25)]"
          spellCheck
        />
      ) : (
        <div className="space-y-3">
          <div className="h-4 w-3/4 animate-pulse rounded bg-white/10" />
          <div className="h-4 w-full animate-pulse rounded bg-white/10" />
          <div className="h-4 w-5/6 animate-pulse rounded bg-white/10" />
          <div className="h-4 w-full animate-pulse rounded bg-white/10" />
          <div className="h-4 w-2/3 animate-pulse rounded bg-white/10" />
        </div>
      )}

      {!isLoading && letter ? (
        <p className="mt-4 text-xs text-[var(--color-secondary-text)]">
          Tip: You can edit the letter directly above before downloading.
        </p>
      ) : null}
    </section>
  );
}
