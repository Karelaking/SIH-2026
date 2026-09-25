export default function Home() {
  return (
    <div className="min-h-screen p-8 sm:p-20 bg-[var(--gov-bg)] text-[var(--gov-text)]">
      <header className="mb-12 border-b border-[var(--gov-border)] pb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--gov-primary)] dark:text-[var(--gov-text)]">GOV OF INDIA | CRYPTOGRAPHIC DOCUMENT SECURITY PLATFORM</h1>
          <p className="text-[var(--gov-text-muted)] mt-1 flex gap-4">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[var(--gov-success)]"></span> AIR-GAPPED
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[var(--gov-success)]"></span> LEDGER HEALTHY
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[var(--gov-success)]"></span> PQC ACTIVE
            </span>
          </p>
        </div>
        <div className="text-right">
          <p className="font-medium">System Status: <span className="text-[var(--gov-success)]">SECURE</span></p>
          <p className="text-[var(--gov-text-muted)] text-sm">Security Officer ▾</p>
        </div>
      </header>

      <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 rounded-lg bg-[var(--gov-surface)] border border-[var(--gov-border)] shadow-sm">
          <h2 className="text-sm font-semibold text-[var(--gov-text-muted)] uppercase tracking-wider mb-2">Protected Documents</h2>
          <p className="text-3xl font-bold">1,284</p>
          <p className="text-sm text-[var(--gov-success)] mt-2">+18 this week</p>
        </div>

        <div className="p-6 rounded-lg bg-[var(--gov-surface)] border border-[var(--gov-border)] shadow-sm">
          <h2 className="text-sm font-semibold text-[var(--gov-text-muted)] uppercase tracking-wider mb-2">Active Recipients</h2>
          <p className="text-3xl font-bold">426</p>
        </div>

        <div className="p-6 rounded-lg bg-[var(--gov-surface)] border border-[var(--gov-border)] shadow-sm">
          <h2 className="text-sm font-semibold text-[var(--gov-text-muted)] uppercase tracking-wider mb-2">Decryption Events</h2>
          <p className="text-3xl font-bold">18,492</p>
        </div>

        <div className="p-6 rounded-lg bg-[var(--gov-surface)] border border-[var(--gov-border)] shadow-sm">
          <h2 className="text-sm font-semibold text-[var(--gov-text-muted)] uppercase tracking-wider mb-2">Verified Ledger Events</h2>
          <p className="text-3xl font-bold">18,492</p>
          <p className="text-sm text-[var(--gov-success)] mt-2 flex items-center gap-1">
            <span className="text-[var(--gov-success)]">✓</span> 100% integrity
          </p>
        </div>
      </main>
    </div>
  );
}
