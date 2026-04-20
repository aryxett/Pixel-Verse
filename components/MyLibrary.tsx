"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  BookOpen, Bookmark, Gamepad2, CheckCircle2,
  XCircle, Archive, Star, Trash2, ChevronRight,
  Search, SlidersHorizontal,
} from "lucide-react";
import {
  getLibrary, removeFromLibrary, updateStatus,
  STATUS_META, type LibraryGame, type LibraryStatus,
} from "@/lib/library";

const TABS: { key: LibraryStatus | "all"; label: string; emoji: string }[] = [
  { key: "all",       label: "All",       emoji: "📋" },
  { key: "playing",   label: "Playing",   emoji: "🎮" },
  { key: "wishlist",  label: "Wishlist",  emoji: "🔖" },
  { key: "completed", label: "Done",      emoji: "✅" },
  { key: "backlog",   label: "Backlog",   emoji: "📚" },
  { key: "dropped",   label: "Dropped",   emoji: "❌" },
];

function GameRow({ game, onRemove, onStatusChange }: {
  game: LibraryGame;
  onRemove: (id: string) => void;
  onStatusChange: (id: string, s: LibraryStatus) => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const meta = STATUS_META[game.status];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -16, height: 0 }}
      transition={{ duration: 0.2 }}
      className="group relative flex items-center gap-3 px-4 py-3 rounded-xl border border-white/[0.05] hover:border-white/[0.12] transition-all"
      style={{ background: "rgba(10,10,18,0.5)" }}
    >
      {/* Cover */}
      <Link href={`/game/rawg/${game.id}`} className="flex-shrink-0">
        <div className="w-12 h-12 rounded-xl overflow-hidden border border-white/[0.08] bg-slate-800">
          {game.image
            ? <img src={game.image} alt={game.title} className="w-full h-full object-cover" />
            : <div className="w-full h-full flex items-center justify-center"><Gamepad2 className="w-5 h-5 text-slate-600" /></div>
          }
        </div>
      </Link>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <Link href={`/game/rawg/${game.id}`}>
          <p className="text-sm font-semibold text-slate-200 truncate hover:text-violet-300 transition-colors">
            {game.title}
          </p>
        </Link>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full"
            style={{ background: `${meta.color}18`, color: meta.color, border: `1px solid ${meta.color}30` }}>
            {meta.emoji} {meta.label}
          </span>
          {game.rating > 0 && (
            <span className="flex items-center gap-0.5 text-[11px] text-yellow-400 font-semibold">
              <Star className="w-3 h-3 fill-yellow-400" />{game.rating}
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
        <div className="relative">
          <button onClick={() => setMenuOpen(v => !v)}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-600 hover:text-violet-400 transition-colors">
            <SlidersHorizontal className="w-3.5 h-3.5" />
          </button>
          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: -4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="absolute right-0 top-full mt-1 z-50 rounded-xl border border-white/[0.1] overflow-hidden"
                style={{ background: "rgba(12,12,20,0.98)", backdropFilter: "blur(20px)", minWidth: 140 }}
              >
                {(Object.keys(STATUS_META) as LibraryStatus[]).map(s => {
                  const m = STATUS_META[s];
                  return (
                    <button key={s} onClick={() => { onStatusChange(game.id, s); setMenuOpen(false); }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium hover:bg-white/[0.05] transition-colors text-left"
                      style={{ color: game.status === s ? m.color : "#94a3b8" }}>
                      <span>{m.emoji}</span>{m.label}
                      {game.status === s && <span className="ml-auto">✓</span>}
                    </button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <button onClick={() => onRemove(game.id)}
          className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-600 hover:text-red-400 transition-colors">
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </motion.div>
  );
}

export default function MyLibrary() {
  const [games, setGames]       = useState<LibraryGame[]>([]);
  const [activeTab, setActiveTab] = useState<LibraryStatus | "all">("all");
  const [search, setSearch]     = useState("");

  const reload = () => setGames(getLibrary());

  useEffect(() => {
    reload();
    window.addEventListener("library-updated", reload);
    return () => window.removeEventListener("library-updated", reload);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = games.filter(g => {
    const matchTab    = activeTab === "all" || g.status === activeTab;
    const matchSearch = !search || g.title.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  const counts = (Object.keys(STATUS_META) as LibraryStatus[]).reduce((acc, s) => {
    acc[s] = games.filter(g => g.status === s).length;
    return acc;
  }, {} as Record<LibraryStatus, number>);

  return (
    <div className="flex flex-col" style={{ minHeight: "calc(100vh - 64px)" }}>

      {/* ── Header ── */}
      <div className="px-6 pt-6 pb-4 border-b border-white/[0.06]"
        style={{ background: "linear-gradient(180deg, rgba(124,58,237,0.1) 0%, transparent 100%)" }}>
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: "linear-gradient(135deg, #7c3aed, #06b6d4)", boxShadow: "0 0 20px rgba(124,58,237,0.4)" }}>
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-black text-slate-100 text-lg leading-none">My Library</h2>
            <p className="text-xs text-slate-500 mt-0.5">{games.length} games tracked</p>
          </div>
        </div>

        {/* Status counts — 5 tiles */}
        <div className="grid grid-cols-5 gap-2">
          {(Object.keys(STATUS_META) as LibraryStatus[]).map(s => {
            const m = STATUS_META[s];
            const active = activeTab === s;
            return (
              <button key={s} onClick={() => setActiveTab(s)}
                className="flex flex-col items-center gap-1 py-2.5 rounded-xl border transition-all"
                style={{
                  background:  active ? `${m.color}18` : "rgba(13,13,20,0.4)",
                  borderColor: active ? `${m.color}40` : "rgba(255,255,255,0.05)",
                }}>
                <span className="text-xl leading-none">{m.emoji}</span>
                <span className="text-xs font-black" style={{ color: active ? m.color : "#334155" }}>
                  {counts[s]}
                </span>
                <span className="text-[9px] text-slate-600 font-medium">{m.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Tab pills ── */}
      <div className="px-4 pt-3 flex flex-wrap gap-1.5">
        {TABS.map(tab => {
          const count  = tab.key === "all" ? games.length : counts[tab.key as LibraryStatus] ?? 0;
          const active = activeTab === tab.key;
          return (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
              style={{
                background:  active ? "rgba(124,58,237,0.15)" : "transparent",
                color:       active ? "#a78bfa" : "#475569",
                border:      active ? "1px solid rgba(124,58,237,0.25)" : "1px solid transparent",
              }}>
              {tab.emoji} {tab.label}
              {count > 0 && (
                <span className="text-[10px] font-black px-1.5 py-0.5 rounded-full"
                  style={{ background: active ? "rgba(124,58,237,0.25)" : "rgba(255,255,255,0.06)", color: active ? "#c4b5fd" : "#334155" }}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ── Search ── */}
      <div className="px-4 pt-2.5 pb-1">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-600 pointer-events-none" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search library..."
            className="w-full pl-9 pr-3 py-2 rounded-xl text-xs text-slate-300 placeholder-slate-600 border border-white/[0.06] focus:border-violet-500/40 focus:outline-none transition-colors"
            style={{ background: "rgba(13,13,20,0.6)" }} />
        </div>
      </div>

      {/* ── Game list ── */}
      <div className="px-4 pb-4 pt-1 space-y-1.5 overflow-y-auto flex-1" style={{ scrollbarWidth: "thin" }}>
        <AnimatePresence mode="popLayout">
          {filtered.length === 0 ? (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-16 text-center">
              <div className="text-5xl mb-3">
                {activeTab === "wishlist" ? "🔖" : activeTab === "playing" ? "🎮" : activeTab === "completed" ? "✅" : activeTab === "dropped" ? "❌" : activeTab === "backlog" ? "📚" : "🎮"}
              </div>
              <p className="text-slate-400 text-sm font-semibold mb-1">
                {search ? "No results" : "No games yet"}
              </p>
              <p className="text-slate-600 text-xs max-w-[200px] leading-relaxed mb-4">
                {search ? "Try different keywords" : "Browse games and add them to your library"}
              </p>
              {!search && (
                <Link href="/explore">
                  <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold text-violet-300 border border-violet-500/25"
                    style={{ background: "rgba(124,58,237,0.1)" }}>
                    Explore Games <ChevronRight className="w-3.5 h-3.5" />
                  </motion.button>
                </Link>
              )}
            </motion.div>
          ) : (
            filtered.map(game => (
              <GameRow key={game.id} game={game} onRemove={id => { removeFromLibrary(id); reload(); }}
                onStatusChange={(id, s) => { updateStatus(id, s); reload(); }} />
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
