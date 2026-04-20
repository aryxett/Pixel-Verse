import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import Navbar from "@/components/Navbar";
import CustomCursor from "@/components/CustomCursor";
import IntroScreen from "@/components/IntroScreen";

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
      <head>
        {/* Tell Dark Reader to not process this page — prevents hydration mismatches */}
        <meta name="color-scheme" content="dark" />
      </head>
      <body className="noise-overlay antialiased" suppressHydrationWarning>
        <Providers>
          <IntroScreen />
          <CustomCursor />
          <div className="relative min-h-screen flex flex-col" suppressHydrationWarning>
            {/* Grid background */}
            <div className="fixed inset-0 grid-pattern pointer-events-none z-0" suppressHydrationWarning />

            {/* Navbar */}
            <Navbar />

            {/* Page content */}
            <main className="relative z-10 flex-1" suppressHydrationWarning>
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
