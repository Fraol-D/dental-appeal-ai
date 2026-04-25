const PAYERS = ["Delta Dental", "Cigna", "MetLife", "Aetna", "Guardian", "Humana"];

export function PayerMarquee() {
  const items = [...PAYERS, ...PAYERS];

  return (
    <section className="border-y border-white/10 bg-[rgba(30,58,95,0.55)] py-4">
      <div className="marquee overflow-hidden whitespace-nowrap" aria-label="Supported payer list">
        <div className="marquee-track inline-flex items-center gap-5 text-sm text-[var(--color-secondary-text)]">
          {items.map((payer, index) => (
            <span key={`${payer}-${index}`} className="inline-flex items-center gap-5">
              <span>{payer}</span>
              <span className="text-[var(--color-clinical-blue)]" aria-hidden>
                +
              </span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
