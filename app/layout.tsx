import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import Navbar from "@/components/Navbar";
import ClientOnly from "@/components/ClientOnly";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "PixelVerse — AI Gaming Assistant",
  description:
    "Your AI-powered gaming companion. Discover games, build your gamer profile, and get personalized recommendations.",
  keywords: ["gaming", "AI", "game recommendations", "gamer profile"],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="noise-overlay antialiased" suppressHydrationWarning>
        <Providers>
          <div className="relative min-h-screen flex flex-col">
            {/* Grid background */}
            <div className="fixed inset-0 grid-pattern pointer-events-none z-0" />

            {/* Navbar */}
            <ClientOnly
              fallback={
                <div className="sticky top-0 z-50 h-16 border-b border-white/[0.06] bg-[#050508]/80" />
              }
            >
              <Navbar />
            </ClientOnly>

            {/* Page content */}
            <main className="relative z-10 flex-1">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
