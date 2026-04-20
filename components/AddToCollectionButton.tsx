"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FolderOpen, Check, Plus, X } from "lucide-react";
import { getCollections, addGameToCollection, isInCollection, type Collection } from "@/lib/library";
import Link from "next/link";

interface Props {
  id: string; title: string; image: string;
  rating?: number; metacritic?: number | null;
  genre?: string[]; developer?: string; releaseYear?: number;
}

export default function AddToCollectionButton({
  id, title, image, rating = 0, metacritic, genre = [], developer, releaseYear,
}: Props) {
  const [open, setOpen]             = useState(false);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [added, setAdded]           = useState<string[]>([]);
  const [justAdded, setJustAdded]   = useState<string | null>(null);

  const reload = () => {
    const cols = getCollections();
    setCollections(cols);
    setAdded(cols.filter(c => isInCollection(c.id, id)).map(c => c.id));
  };

  useEffect(() => {
    reload();
    window.addEventListener("library-updated", reload);
    return () => window.removeEventListener("library-updated", reload);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const handleAdd = (colId: string) => {
    addGameToCollection(colId, { id, title, image, rating, metacritic, genre, developer, releaseYear });
    setJustAdded(colId);
    reload();
    setTimeout(() => setJustAdded(null), 1500);
  };

  return (
    <>
      {/* Trigger button */}
      <motion.button
        whileHover={{ scale: 1.03, y: -1 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => setOpen(true)}
        className="flex items-center gap-2.5 px-5 py-3 rounded-xl font-bold text-sm border transition-all"
        style={{
          background: added.length > 0 ? "rgba(245,158,11,0.15)" : "rgba(245,158,11,0.08)",
          borderColor: added.length > 0 ? "rgba(245,158,11,0.55)" : "rgba(245,158,11,0.25)",
          color: "#fbbf24",
          boxShadow: added.length > 0 ? "0 0 20px rgba(245,158,11,0.2)" : "none",
        }}
      >
        <FolderOpen className="w-4 h-4" />
        {added.length > 0 ? `In ${added.length} Collection${added.length > 1 ? "s" : ""}` : "Add to Collection"}
      </motion.button>

      {/* ── Modal popup ── */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0"
              style={{ zIndex: 99998, background: "rgba(2,2,8,0.75)", backdropFilter: "blur(8px)" }}
              onClick={() => setOpen(false)}
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.88, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.88, y: 16 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              style={{ zIndex: 99999, width: "min(420px, 90vw)" }}
            >
              <div
                className="rounded-2xl overflow-hidden"
                style={{
                  background: "rgba(8,8,18,0.99)",
                  border: "1px solid rgba(245,158,11,0.25)",
                  boxShadow: "0 32px 80px rgba(0,0,0,0.9), 0 0 40px rgba(245,158,11,0.08)",
                }}
              >
                {/* Top neon line */}
                <div className="h-px w-full"
                  style={{ background: "linear-gradient(90deg, transparent, rgba(245,158,11,0.8), transparent)" }} />

                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]"
                  style={{ background: "rgba(245,158,11,0.05)" }}>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                      style={{ background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.3)" }}>
                      <FolderOpen className="w-4 h-4 text-yellow-400" />
                    </div>
                    <div>
                      <p className="font-black text-slate-100 text-sm">Add to Collection</p>
                      <p className="text-[11px] text-slate-500 truncate max-w-[200px]">{title}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setOpen(false)}
                    className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-500 hover:text-white border border-white/[0.07] hover:border-white/20 transition-all"
                    style={{ background: "rgba(13,13,20,0.7)" }}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Collections list */}
                <div className="p-3 max-h-72 overflow-y-auto" style={{ scrollbarWidth: "thin" }}>
                  {collections.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="text-4xl mb-3">📁</div>
                      <p className="text-slate-400 text-sm font-semibold mb-1">No collections yet</p>
                      <p className="text-slate-600 text-xs mb-4">Create a collection from My Library first</p>
                      <Link href="/profile" onClick={() => setOpen(false)}>
                        <motion.button
                          whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                          className="flex items-center gap-2 mx-auto px-4 py-2 rounded-xl text-xs font-bold text-violet-300 border border-violet-500/25"
                          style={{ background: "rgba(124,58,237,0.1)" }}
                        >
                          <Plus className="w-3.5 h-3.5" /> Create Collection
                        </motion.button>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      {collections.map(col => {
                        const inCol   = added.includes(col.id);
                        const wasJust = justAdded === col.id;
                        return (
                          <motion.button
                            key={col.id}
                            whileHover={!inCol ? { x: 4 } : {}}
                            whileTap={!inCol ? { scale: 0.98 } : {}}
                            onClick={() => !inCol && handleAdd(col.id)}
                            disabled={inCol}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition-all text-left"
                            style={{
                              background: inCol ? "rgba(245,158,11,0.08)" : "rgba(13,13,20,0.6)",
                              borderColor: inCol ? "rgba(245,158,11,0.3)" : "rgba(255,255,255,0.06)",
                              cursor: inCol ? "default" : "pointer",
                            }}
                          >
                            {/* Collection cover mini-grid */}
                            <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-slate-800 relative">
                              {col.games.length > 0 ? (
                                <img src={col.games[0].image} alt="" className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <FolderOpen className="w-5 h-5 text-slate-600" />
                                </div>
                              )}
                            </div>

                            <div className="flex-1 min-w-0">
                              <p className="font-bold text-sm truncate"
                                style={{ color: inCol ? "#fbbf24" : "#e2e8f0" }}>
                                {col.name}
                              </p>
                              <p className="text-[11px] text-slate-600">
                                {col.games.length} game{col.games.length !== 1 ? "s" : ""}
                                {col.description ? ` · ${col.description}` : ""}
                              </p>
                            </div>

                            {/* Status indicator */}
                            <div className="flex-shrink-0">
                              {wasJust ? (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="w-6 h-6 rounded-full flex items-center justify-center"
                                  style={{ background: "rgba(245,158,11,0.2)" }}
                                >
                                  <Check className="w-3.5 h-3.5 text-yellow-400" />
                                </motion.div>
                              ) : inCol ? (
                                <div className="flex items-center gap-1.5 text-[11px] font-bold text-yellow-500">
                                  <Check className="w-3.5 h-3.5" /> Added
                                </div>
                              ) : (
                                <div className="w-6 h-6 rounded-full border border-white/[0.1] flex items-center justify-center">
                                  <Plus className="w-3 h-3 text-slate-600" />
                                </div>
                              )}
                            </div>
                          </motion.button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="px-5 py-3 border-t border-white/[0.05] flex items-center justify-between">
                  <p className="text-[11px] text-slate-600">
                    {collections.length} collection{collections.length !== 1 ? "s" : ""}
                  </p>
                  <button
                    onClick={() => setOpen(false)}
                    className="text-xs font-semibold text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    Done
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
