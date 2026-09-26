'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Sidebar() {
  const pathname = usePathname();

  const getLinkClass = (path: string) => {
    const isActive = pathname === path;
    return `block px-3 py-2 text-sm font-medium rounded transition-colors ${
      isActive
        ? 'bg-(--gov-primary) text-white'
        : 'hover:bg-(--gov-bg) text-(--gov-text-primary)'
    }`;
  };

  return (
    <aside 
      className="w-64 shrink-0 overflow-y-auto border-r"
      style={{ backgroundColor: 'var(--gov-surface)', borderColor: 'var(--gov-border)' }}
    >
      <nav className="p-4 space-y-6">
        
        <div>
          <h3 className="text-xs font-bold text-(--gov-text-secondary) uppercase tracking-wider mb-2 px-3">Overview</h3>
          <ul className="space-y-1">
            <li><Link href="/" className={getLinkClass('/')}>📊 Dashboard</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-bold text-(--gov-text-secondary) uppercase tracking-wider mb-2 px-3">Document Security</h3>
          <ul className="space-y-1">
            <li><Link href="/documents" className={getLinkClass('/documents')}>📄 Documents</Link></li>
            <li><Link href="/recipients" className={getLinkClass('/recipients')}>👥 Recipients</Link></li>
            <li><Link href="/distribution" className={getLinkClass('/distribution')}>📤 Distribution</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-bold text-(--gov-text-secondary) uppercase tracking-wider mb-2 px-3">Forensics</h3>
          <ul className="space-y-1">
            <li><Link href="/forensics" className={getLinkClass('/forensics')}>🕵 Investigations</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-bold text-(--gov-text-secondary) uppercase tracking-wider mb-2 px-3">Evidence</h3>
          <ul className="space-y-1">
            <li><Link href="/ledger" className={getLinkClass('/ledger')}>⛓ Ledger</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-bold text-(--gov-text-secondary) uppercase tracking-wider mb-2 px-3">Administration</h3>
          <ul className="space-y-1">
            <li><Link href="#" className={getLinkClass('/settings')}>⚙ System Settings</Link></li>
          </ul>
        </div>

      </nav>
    </aside>
  );
}
