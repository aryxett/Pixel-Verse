"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { SessionProvider } from "next-auth/react";
import SmoothScroll from "@/components/SmoothScroll";

interface AppContextType {
  selectedMood: string | null;
  setSelectedMood: (mood: string | null) => void;
  aiLoading: boolean;
  setAiLoading: (loading: boolean) => void;
  theme: "dark" | "light";
  toggleTheme: () => void;
}

const AppContext = createContext<AppContextType>({
  selectedMood: null,
  setSelectedMood: () => {},
  aiLoading: false,
  setAiLoading: () => {},
  theme: "dark",
  toggleTheme: () => {},
});

export function useApp() {
  return useContext(AppContext);
}

export function Providers({ children }: { children: ReactNode }) {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const saved = localStorage.getItem("pixelverse_theme") as "dark" | "light" | null;
    if (saved) setTheme(saved);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("pixelverse_theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  return (
    <SessionProvider>
      <AppContext.Provider value={{ selectedMood, setSelectedMood, aiLoading, setAiLoading, theme, toggleTheme }}>
        <SmoothScroll>
          {/* suppressHydrationWarning here catches Dark Reader attribute injections on this wrapper */}
          <div suppressHydrationWarning>
            {children}
          </div>
        </SmoothScroll>
      </AppContext.Provider>
    </SessionProvider>
  );
}
