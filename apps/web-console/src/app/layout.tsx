import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";

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
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[var(--gov-bg)] text-[var(--gov-text-primary)]">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {/* Official GOI Top Header */}
          <header 
            className="flex justify-between items-center px-6 py-3 shrink-0"
            style={{ backgroundColor: 'var(--gov-primary)', borderBottom: '3px solid var(--gov-saffron)' }}
          >
            <div className="flex items-center gap-3">
              <div className="flex flex-col">
                <span className="text-white font-bold text-lg tracking-wide flex items-center gap-2">
                  🇮🇳 Government of India
                </span>
                <span className="text-gray-200 text-xs font-medium tracking-wider">
                  CRYPTOGRAPHIC DOCUMENT SECURITY & ATTRIBUTION PLATFORM
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4 text-white text-sm font-medium">
              <ThemeToggle />
              <span className="flex items-center gap-2 cursor-pointer hover:text-gray-200 ml-2">
                🔔 Alerts (0)
              </span>
              <span className="flex items-center gap-2 border-l border-white/20 pl-6 cursor-pointer hover:text-gray-200">
                👤 Document Officer
              </span>
            </div>
          </header>

          <div className="flex flex-1 overflow-hidden">
            <Sidebar />

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto p-8">
              {children}
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
