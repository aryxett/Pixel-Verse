"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bookmark, BookmarkCheck, Gamepad2, CheckCircle2,
  XCircle, Archive, ChevronDown, FolderOpen, X, Trash2,
} from "lucide-react";
import {
  addToLibrary, removeFromLibrary, getGameStatus,
  addToWishlist, removeFromWishlist, isWishlisted,
  getCollections, addGameToCollection,
  STATUS_META, type LibraryStatus,
} from "@/lib/library";

interface GameInfo {
  id: string; title: string; image: string;
  rating?: number; metacritic?: number | null;
  genre?: string[]; developer?: string; releaseYear?: number;
}

interface Props extends GameInfo { compact?: boolean; }

export default function LibraryButton({
  id, title, image, rating = 0, metacritic, genre = [],
  developer, releaseYear, compact = false,
}: Props) {
  const [status, setStatus]         = useState<LibraryStatus | null>(null);
  const [wishlisted, setWishlisted] = useState(false);
  const [open, setOpen]             = useState(false);
  const [pulse, setPulse]           = useState(false);
  const [collections, setCollections] = useState(getCollections());
  const ref = useRef<HTMLDivElement>(null);

  const game: GameInfo = { id, title, image, rating, metacritic, genre, developer, releaseYear };

  const reload = () => {
    setStatus(getGameStatus(id));
    setWishlisted(isWishlisted(id));
    setCollections(getCollections());
  };

  useEffect(() => {
    reload();
    window.addEventListener("library-updated", reload);
    return () => window.removeEventListener("library-updated", reload);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [open]);

  const flash = () => { setPulse(true); setTimeout(() => setPulse(false), 500); };

  const handleLibrary = (s: LibraryStatus) => {
    if (status === s) { removeFromLibrary(id); setStatus(null); }
    else { addToLibrary({ ...game, status: s }); setStatus(s); flash(); }
    setOpen(false);
  };

  const handleWishlist = () => {
    if (wishlisted) { removeFromWishlist(id); setWishlisted(false); }
    else { addToWishlist(game); setWishlisted(true); flash(); }
    setOpen(false);
  };

  const handleCollection = (colId: string) => {
    addGameToCollection(colId, game); flash(); setOpen(false);
  };

  const handleRemoveAll = () => {
    removeFromLibrary(id); removeFromWishlist(id);
    setStatus(null); setWishlisted(false); setOpen(false);
  };

  const meta = status ? STATUS_META[status] : null;
  const activeColor = meta ? meta.color : wishlisted ? "#06b6d4" : null;
  const hasAny = !!(status || wishlisted);

  /* ── Compact (on game cards) ── */
  if (compact) {
    return (
      <div
        ref={ref}
        className="relative"
        style={{ zIndex: open ? 9999 : "auto" }}
        onClickCapture={e => { e.stopPropagation(); e.preventDefault(); }}
      >
        {/* Trigger button */}
        <motion.button
          whileHover={{ scale: 1.12 }}
          whileTap={{ scale: 0.88 }}
          animate={pulse ? { scale: [1, 1.35, 1] } : {}}
          onClick={() => setOpen(v => !v)}
          className="w-8 h-8 rounded-xl flex items-center justify-center border-2 transition-all"
          style={{
            background: activeColor ? `${activeColor}22` : "rgba(5,5,10,0.85)",
            borderColor: activeColor ? `${activeColor}70` : "rgba(255,255,255,0.25)",
            backdropFilter: "blur(10px)",
            boxShadow: activeColor ? `0 0 14px ${activeColor}40` : "0 2px 8px rgba(0,0,0,0.5)",
            color: activeColor || "#c4b5fd",
          }}
          title="Add to Library / Wishlist / Collection"
        >
          {status === "playing"   ? <Gamepad2 className="w-3.5 h-3.5" /> :
           status === "completed" ? <CheckCircle2 className="w-3.5 h-3.5" /> :
           status === "dropped"   ? <XCircle className="w-3.5 h-3.5" /> :
           status === "backlog"   ? <Archive className="w-3.5 h-3.5" /> :
           wishlisted             ? <Bookmark className="w-3.5 h-3.5 fill-current" /> :
                                    <Bookmark className="w-3.5 h-3.5" />}
        </motion.button>

        {/* Dropdown */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: -6 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -4 }}
              transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
              className="absolute left-0 top-full mt-2"
              style={{
                zIndex: 99999,
                width: 210,
                background: "rgba(8,8,18,0.99)",
                border: "1px solid rgba(124,58,237,0.3)",
                borderRadius: 16,
                boxShadow: "0 24px 60px rgba(0,0,0,0.9), 0 0 30px rgba(124,58,237,0.15)",
                backdropFilter: "blur(24px)",
                overflow: "hidden",
              }}
            >
              {/* Header */}
              <div className="px-3 py-2.5 border-b border-white/[0.07]"
                style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.1), rgba(6,182,212,0.04))" }}>
                <p className="text-[11px] font-black text-slate-300 truncate">{title}</p>
                <p className="text-[10px] text-slate-600 mt-0.5">Add to your collection</p>
              </div>

              {/* Wishlist */}
              <div className="px-2 py-1.5">
                <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest px-2 mb-1">Wishlist</p>
                <button
                  onClick={handleWishlist}
                  className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-semibold hover:bg-white/[0.06] transition-colors text-left"
                  style={{ color: wishlisted ? "#06b6d4" : "#94a3b8" }}
                >
                  <Bookmark className={`w-3.5 h-3.5 flex-shrink-0 ${wishlisted ? "fill-current" : ""}`} />
                  {wishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
                  {wishlisted && <span className="ml-auto text-[10px] font-black">✓</span>}
                </button>
              </div>

              {/* Library */}
              <div className="px-2 py-1.5 border-t border-white/[0.05]">
                <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest px-2 mb-1">Library</p>
                {(Object.keys(STATUS_META) as LibraryStatus[]).map(s => {
                  const m = STATUS_META[s];
                  const active = status === s;
                  return (
                    <button
                      key={s}
                      onClick={() => handleLibrary(s)}
                      className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-semibold hover:bg-white/[0.06] transition-colors text-left"
                      style={{ color: active ? m.color : "#94a3b8" }}
                    >
                      <span className="text-sm flex-shrink-0">{m.emoji}</span>
                      {m.label}
                      {active && <span className="ml-auto text-[10px] font-black">✓</span>}
                    </button>
                  );
                })}
              </div>

              {/* Collections */}
              {collections.length > 0 && (
                <div className="px-2 py-1.5 border-t border-white/[0.05]">
                  <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest px-2 mb-1">Collections</p>
                  {collections.map(col => (
                    <button
                      key={col.id}
                      onClick={() => handleCollection(col.id)}
                      className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-semibold hover:bg-white/[0.06] transition-colors text-left text-slate-400"
                    >
                      <FolderOpen className="w-3.5 h-3.5 text-yellow-500 flex-shrink-0" />
                      <span className="truncate">{col.name}</span>
                      <span className="ml-auto text-slate-600 text-[10px]">{col.games.length}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Remove all */}
              {hasAny && (
                <div className="px-2 py-1.5 border-t border-white/[0.05]">
                  <button
                    onClick={handleRemoveAll}
                    className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-semibold text-red-400 hover:bg-red-500/10 transition-colors text-left"
                  >
                    <Trash2 className="w-3.5 h-3.5 flex-shrink-0" />
                    Remove from Library
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  /* ── Full button (game detail page) ── */
  return (
    <div ref={ref} className="relative">
      <motion.button
        whileHover={{ scale: 1.02, y: -1 }}
        whileTap={{ scale: 0.97 }}
        animate={pulse ? { scale: [1, 1.06, 1] } : {}}
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-2.5 px-5 py-3 rounded-xl font-bold text-sm border transition-all"
        style={{
          background: activeColor ? `${activeColor}12` : "rgba(124,58,237,0.1)",
          borderColor: activeColor ? `${activeColor}40` : "rgba(124,58,237,0.3)",
          color: activeColor || "#a78bfa",
          boxShadow: activeColor ? `0 0 20px ${activeColor}18` : "none",
        }}
      >
        <BookmarkCheck className="w-4 h-4" />
        {status ? `${meta!.emoji} ${meta!.label}` : wishlisted ? "🔖 Wishlisted" : "Add to Library"}
        <ChevronDown className="w-3.5 h-3.5 opacity-60" />
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: -6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ duration: 0.18 }}
            className="absolute left-0 top-full mt-2"
            style={{
              zIndex: 99999,
              width: 240,
              background: "rgba(8,8,18,0.99)",
              border: "1px solid rgba(124,58,237,0.25)",
              borderRadius: 20,
              boxShadow: "0 24px 60px rgba(0,0,0,0.85), 0 0 40px rgba(124,58,237,0.1)",
              backdropFilter: "blur(24px)",
              overflow: "hidden",
            }}
          >
            {/* Wishlist */}
            <div className="px-3 py-3 border-b border-white/[0.06]">
              <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-2">Wishlist</p>
              <button onClick={handleWishlist}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold hover:bg-white/[0.05] transition-colors text-left"
                style={{ color: wishlisted ? "#06b6d4" : "#94a3b8" }}>
                <Bookmark className={`w-4 h-4 flex-shrink-0 ${wishlisted ? "fill-current" : ""}`} />
                {wishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
                {wishlisted && <span className="ml-auto font-black">✓</span>}
              </button>
            </div>

            {/* Library */}
            <div className="px-3 py-3 border-b border-white/[0.06]">
              <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-2">Library</p>
              {(Object.keys(STATUS_META) as LibraryStatus[]).map(s => {
                const m = STATUS_META[s];
                const active = status === s;
                return (
                  <button key={s} onClick={() => handleLibrary(s)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold hover:bg-white/[0.05] transition-colors text-left"
                    style={{ color: active ? m.color : "#94a3b8" }}>
                    <span className="text-base flex-shrink-0">{m.emoji}</span>
                    <div className="flex-1">
                      <p style={{ color: active ? m.color : "#e2e8f0" }}>{m.label}</p>
                      <p className="text-[11px] text-slate-600">{m.desc}</p>
                    </div>
                    {active && <span className="font-black" style={{ color: m.color }}>✓</span>}
                  </button>
                );
              })}
            </div>

            {/* Collections */}
            {collections.length > 0 && (
              <div className="px-3 py-3 border-b border-white/[0.06]">
                <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-2">Add to Collection</p>
                {collections.map(col => (
                  <button key={col.id} onClick={() => handleCollection(col.id)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold hover:bg-white/[0.05] transition-colors text-left text-slate-400">
                    <FolderOpen className="w-4 h-4 text-yellow-500 flex-shrink-0" />
                    <span className="truncate flex-1">{col.name}</span>
                    <span className="text-xs text-slate-600">{col.games.length}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Remove */}
            {hasAny && (
              <div className="px-3 py-2">
                <button onClick={handleRemoveAll}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-red-400 hover:bg-red-500/10 transition-colors">
                  <Trash2 className="w-4 h-4 flex-shrink-0" />
                  Remove from Library
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
