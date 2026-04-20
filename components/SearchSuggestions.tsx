"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Star, Search, TrendingUp } from "lucide-react";

interface Suggestion {
  slug: string;
  title: string;
  image: string;
  rating: number;
  genre: string[];
  metacritic: number | null;
}

interface Props {
  query: string;
  genre?: string;
  onSelect: (slug: string, title: string) => void;
  open: boolean;
  onClose: () => void;
}

export default function SearchSuggestions({ query, genre, onSelect, open, onClose }: Props) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open || query.length < 2) {
      setSuggestions([]);
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({ q: query, limit: "8" });
        if (genre) params.set("genre", genre);
        const res = await fetch(`/api/search/suggestions?${params}`);
        const data = await res.json();
        setSuggestions(data.suggestions || []);
      } catch { setSuggestions([]); }
      finally { setLoading(false); }
    }, 300);
  }, [query, genre, open]);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  if (!open) return null;

  return (
    <div ref={containerRef} className="absolute top-full left-0 right-0 z-50 mt-2">
      <AnimatePresence>
        {(loading || suggestions.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="rounded-2xl border border-white/[0.08] overflow-hidden shadow-2xl"
            style={{ background: "rgba(10,10,18,0.97)", backdropFilter: "blur(20px)" }}
          >
            {/* Header */}
            <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/[0.05]">
              <Search className="w-3.5 h-3.5 text-violet-400" />
              <span className="text-xs text-slate-500 font-medium">
                {loading ? "Searching..." : `${suggestions.length} results for "${query}"`}
              </span>
            </div>

            {/* Loading */}
            {loading && (
              <div className="p-4 space-y-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-3 animate-pulse">
                    <div className="w-12 h-8 rounded-lg bg-slate-800 flex-shrink-0" />
                    <div className="flex-1 space-y-1.5">
                      <div className="h-3 bg-slate-800 rounded w-3/4" />
                      <div className="h-2.5 bg-slate-800 rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Results */}
            {!loading && suggestions.length > 0 && (
              <div className="py-1 max-h-80 overflow-y-auto">
                {suggestions.map((s, i) => (
                  <motion.div
                    key={s.slug}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                  >
                    <Link
                      href={`/game/rawg/${s.slug}`}
                      onClick={() => { onSelect(s.slug, s.title); onClose(); }}
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-violet-500/8 transition-colors group"
                      style={{ textDecoration: "none" }}
                    >
                      {/* Thumbnail */}
                      <div className="w-14 h-9 rounded-lg overflow-hidden flex-shrink-0 bg-slate-800">
                        {s.image && (
                          <img src={s.image} alt={s.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-200 group-hover:text-violet-300 transition-colors truncate">
                          {s.title}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          {s.genre.slice(0, 2).map((g) => (
                            <span key={g} className="text-[10px] text-slate-600">{g}</span>
                          ))}
                        </div>
                      </div>

                      {/* Rating */}
                      <div className="flex items-center gap-1 flex-shrink-0">
                        {s.metacritic ? (
                          <span className="text-xs font-black px-1.5 py-0.5 rounded"
                            style={{
                              background: s.metacritic >= 75 ? "#66cc33" : s.metacritic >= 50 ? "#ffcc33" : "#ff4444",
                              color: s.metacritic >= 50 ? "#000" : "#fff",
                            }}>
                            {s.metacritic}
                          </span>
                        ) : s.rating > 0 ? (
                          <div className="flex items-center gap-0.5 text-yellow-400 text-xs font-bold">
                            <Star className="w-3 h-3 fill-yellow-400" />
                            {s.rating}
                          </div>
                        ) : null}
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}

            {/* No results */}
            {!loading && suggestions.length === 0 && query.length >= 2 && (
              <div className="px-4 py-6 text-center text-slate-600 text-sm">
                No games found for &quot;{query}&quot;
              </div>
            )}

            {/* Genre suggestions footer */}
            {!loading && suggestions.length > 0 && (
              <div className="px-4 py-2.5 border-t border-white/[0.05] flex items-center gap-2">
                <TrendingUp className="w-3 h-3 text-violet-400" />
                <span className="text-[10px] text-slate-600">
                  Click a result to view full game details
                </span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
