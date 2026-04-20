"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Check, Gamepad2 } from "lucide-react";

const GENRES = [
  { slug: "",                    name: "All Genres",    emoji: "🎮" },
  { slug: "action",              name: "Action",        emoji: "⚔️" },
  { slug: "indie",               name: "Indie",         emoji: "🎨" },
  { slug: "adventure",           name: "Adventure",     emoji: "🗺️" },
  { slug: "rpg",                 name: "RPG",           emoji: "🧙" },
  { slug: "strategy",            name: "Strategy",      emoji: "♟️" },
  { slug: "shooter",             name: "Shooter",       emoji: "🔫" },
  { slug: "casual",              name: "Casual",        emoji: "😌" },
  { slug: "simulation",          name: "Simulation",    emoji: "🏗️" },
  { slug: "puzzle",              name: "Puzzle",        emoji: "🧩" },
  { slug: "arcade",              name: "Arcade",        emoji: "🕹️" },
  { slug: "platformer",          name: "Platformer",    emoji: "🏃" },
  { slug: "massively-multiplayer", name: "MMO",         emoji: "👥" },
  { slug: "racing",              name: "Racing",        emoji: "🏎️" },
  { slug: "sports",              name: "Sports",        emoji: "⚽" },
  { slug: "fighting",            name: "Fighting",      emoji: "🥊" },
  { slug: "family",              name: "Family",        emoji: "👨‍👩‍👧" },
  { slug: "board-games",         name: "Board Games",   emoji: "🎲" },
  { slug: "educational",         name: "Educational",   emoji: "📚" },
  { slug: "card",                name: "Card",          emoji: "🃏" },
];

interface Props {
  value: string;
  onChange: (slug: string) => void;
}

export default function GenreDropdown({ value, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  const selected = GENRES.find((g) => g.slug === value) || GENRES[0];

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative flex-shrink-0" style={{ minWidth: 150 }}>
      {/* Trigger button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2.5 px-4 py-3 rounded-xl border text-sm font-medium transition-all"
        style={{
          background: open ? "rgba(124,58,237,0.12)" : "var(--bg-input)",
          borderColor: open ? "rgba(124,58,237,0.5)" : "var(--border-color)",
          color: "var(--text-primary)",
          boxShadow: open ? "0 0 0 3px rgba(124,58,237,0.1)" : "none",
        }}
      >
        <span className="text-base leading-none">{selected.emoji}</span>
        <span className="flex-1 text-left truncate">{selected.name}</span>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          <ChevronDown className="w-4 h-4 flex-shrink-0" style={{ color: "var(--text-muted)" }} />
        </motion.div>
      </motion.button>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="absolute top-full left-0 right-0 mt-2 z-50 rounded-2xl border overflow-hidden shadow-2xl"
            style={{
              background: "var(--bg-glass)",
              backdropFilter: "blur(20px)",
              borderColor: "var(--border-color)",
              maxHeight: 320,
              overflowY: "auto",
            }}
          >
            {GENRES.map((genre, i) => {
              const isActive  = genre.slug === value;
              const isHovered = hovered === genre.slug;

              return (
                <motion.button
                  key={genre.slug}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.02, duration: 0.15 }}
                  onMouseEnter={() => setHovered(genre.slug)}
                  onMouseLeave={() => setHovered(null)}
                  onClick={() => { onChange(genre.slug); setOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-all text-left"
                  style={{
                    background: isActive
                      ? "rgba(124,58,237,0.15)"
                      : isHovered
                      ? "rgba(124,58,237,0.07)"
                      : "transparent",
                    color: isActive ? "#a78bfa" : "var(--text-secondary)",
                  }}
                  whileHover={{ x: 4 }}
                >
                  <motion.span
                    animate={{ scale: isHovered ? 1.2 : 1 }}
                    transition={{ duration: 0.15 }}
                    className="text-base leading-none w-5 text-center flex-shrink-0"
                  >
                    {genre.emoji}
                  </motion.span>
                  <span className="flex-1">{genre.name}</span>
                  {isActive && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <Check className="w-3.5 h-3.5 text-violet-400 flex-shrink-0" />
                    </motion.div>
                  )}
                </motion.button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
