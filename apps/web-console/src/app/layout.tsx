import type { Metadata } from "next";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";

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
      className={`h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-(--gov-bg) text-(--gov-text-primary) font-sans">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {/* Official GOI Top Header */}
          <header 
            className="flex justify-between items-center px-6 py-3 shrink-0 bg-zinc-950 border-b-[3px] border-(--gov-saffron)"
          >
            <div className="flex items-center gap-3">
              <div className="flex flex-col">
                <span className="text-zinc-50 font-bold text-lg tracking-wide flex items-center gap-2">
                  🇮🇳 Government of India
                </span>
                <span className="text-zinc-50 opacity-80 text-xs font-medium tracking-wider">
                  CRYPTOGRAPHIC DOCUMENT SECURITY & ATTRIBUTION PLATFORM
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4 text-zinc-50 text-sm font-medium">
              <ThemeToggle />
              <span className="flex items-center gap-2 cursor-pointer hover:opacity-80 ml-2">
                🔔 Alerts (0)
              </span>
              <span className="flex items-center gap-2 border-l border-zinc-50/20 pl-6 cursor-pointer hover:opacity-80">
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
