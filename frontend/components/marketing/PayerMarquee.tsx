const PAYERS = ["Delta Dental", "Cigna", "MetLife", "Aetna", "Guardian", "Humana"];

export function PayerMarquee() {
  const LOOP_PAYERS = [...PAYERS, ...PAYERS, ...PAYERS];

  const renderSet = (suffix: string, isHidden = false) => (
    <div className="marquee-set" aria-label={isHidden ? undefined : "Supported payer list"} aria-hidden={isHidden}>
      {LOOP_PAYERS.map((payer, index) => (
        <span key={`${payer}-${suffix}-${index}`} className="inline-flex items-center gap-5">
          <span>{payer}</span>
          <span className="text-[var(--color-clinical-blue)]" aria-hidden>
            +
          </span>
        </span>
      ))}
    </div>
  );

  return (
    <section className="border-y border-white/10 bg-[rgba(30,58,95,0.55)] py-4">
      <div className="marquee overflow-hidden whitespace-nowrap text-sm text-[var(--color-secondary-text)]">
        <div className="marquee-track" role="presentation">
          {renderSet("primary")}
          {renderSet("clone", true)}
        </div>
      </div>
    </section>
  );
}
