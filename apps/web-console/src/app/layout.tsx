import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Document Attribution Platform - Government of India",
  description: "Secure Document Leak Attribution Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {/* Official GOI Top Banner */}
        <div style={{ backgroundColor: 'var(--gov-primary)' }} className="text-white text-xs px-4 py-1 flex justify-between items-center">
          <div className="flex space-x-4">
            <span>GOVERNMENT OF INDIA</span>
            <span className="hidden sm:inline">|</span>
            <span className="hidden sm:inline">MINISTRY OF DEFENCE</span>
          </div>
          <div>
            <span className="text-gray-300">Secure Air-Gapped Console</span>
          </div>
        </div>
        
        {/* Main Navigation */}
        <nav style={{ backgroundColor: 'var(--gov-surface)', borderBottom: '1px solid var(--gov-border)' }} className="p-4 flex gap-6 items-center shadow-sm">
          <div className="font-bold text-lg mr-8" style={{ color: 'var(--gov-primary)' }}>
            <span style={{ color: 'var(--gov-secondary)' }}>D</span>L<span style={{ color: 'var(--gov-tertiary)' }}>A</span> Platform
          </div>
          <a href="/" className="font-semibold text-sm hover:underline" style={{ color: 'var(--gov-text)' }}>Distribution</a>
          <a href="/forensics" className="font-semibold text-sm hover:underline" style={{ color: 'var(--gov-text-muted)' }}>Forensics</a>
          <a href="/recipients" className="font-semibold text-sm hover:underline" style={{ color: 'var(--gov-text-muted)' }}>Recipients</a>
        </nav>
        
        <main className="flex-1">
          {children}
        </main>

        <footer style={{ backgroundColor: 'var(--gov-surface)', borderTop: '1px solid var(--gov-border)' }} className="p-4 text-center text-xs" >
          <p style={{ color: 'var(--gov-text-muted)' }}>
            © {new Date().getFullYear()} Government of India. All rights reserved. Highly Confidential.
          </p>
        </footer>
      </body>
    </html>
  );
}
