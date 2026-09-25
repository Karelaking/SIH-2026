import React from 'react';

export default function RecipientsPage() {
  return (
    <div className="min-h-screen p-8 sm:p-20 bg-[var(--gov-bg)] text-[var(--gov-text)]">
      <header className="mb-12 border-b border-[var(--gov-border)] pb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--gov-primary)] dark:text-[var(--gov-text)]">RECIPIENT MANAGEMENT</h1>
          <p className="text-[var(--gov-text-muted)] mt-1">Manage cryptographic identities and PQC keys.</p>
        </div>
        <div className="flex gap-4">
          <button className="px-4 py-2 bg-[var(--gov-primary)] text-white rounded font-semibold hover:bg-[var(--gov-primary-hover)] transition-colors">
            + Register Recipient
          </button>
        </div>
      </header>

      <main>
        <div className="bg-[var(--gov-surface)] border border-[var(--gov-border)] rounded-lg shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[var(--gov-bg)] border-b border-[var(--gov-border)] text-[var(--gov-text-muted)] text-sm uppercase tracking-wider">
                <th className="px-6 py-4 font-semibold">Name / Dept</th>
                <th className="px-6 py-4 font-semibold">Role</th>
                <th className="px-6 py-4 font-semibold">Identity ID</th>
                <th className="px-6 py-4 font-semibold">Key Status</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--gov-border)]">
              
              <tr className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-medium text-[var(--gov-primary)] dark:text-white">Alice Sharma</div>
                  <div className="text-sm text-[var(--gov-text-muted)]">Defense Ministry</div>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-block px-2 py-1 text-xs font-semibold rounded bg-[var(--gov-info)] text-white opacity-90">
                    Document Owner
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="font-mono text-sm text-[var(--gov-text-muted)]">ID-8F92...A4B1</div>
                </td>
                <td className="px-6 py-4">
                  <span className="flex items-center gap-2 text-sm font-semibold text-[var(--gov-success)]">
                    <span className="w-2 h-2 rounded-full bg-[var(--gov-success)]"></span> ACTIVE
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-[var(--gov-primary)] hover:underline text-sm font-medium mr-4">View</button>
                  <button className="text-[var(--gov-danger)] hover:underline text-sm font-medium">Revoke</button>
                </td>
              </tr>

              <tr className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-medium text-[var(--gov-primary)] dark:text-white">Bob Kumar</div>
                  <div className="text-sm text-[var(--gov-text-muted)]">Intelligence Bureau</div>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-block px-2 py-1 text-xs font-semibold rounded bg-[var(--gov-secondary)] text-white opacity-90">
                    Recipient
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="font-mono text-sm text-[var(--gov-text-muted)]">ID-1A4C...9B3D</div>
                </td>
                <td className="px-6 py-4">
                  <span className="flex items-center gap-2 text-sm font-semibold text-[var(--gov-warning)]">
                    <span className="w-2 h-2 rounded-full bg-[var(--gov-warning)]"></span> ROTATING
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-[var(--gov-primary)] hover:underline text-sm font-medium mr-4">View</button>
                  <button className="text-[var(--gov-danger)] hover:underline text-sm font-medium">Revoke</button>
                </td>
              </tr>

            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
