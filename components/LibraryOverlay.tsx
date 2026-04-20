"use client";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  X, BookOpen, Search, Gamepad2, Bookmark, CheckCircle2,
  XCircle, Archive, Star, Trash2, SlidersHorizontal,
  ChevronRight, Plus, FolderOpen, Users, UserPlus,
  Heart, Trophy, Zap, Clock,
} from "lucide-react";
import {
  getLibrary, getWishlist, getCollections,
  removeFromLibrary, removeFromWishlist,
  updateStatus, createCollection, deleteCollection,
  addGameToCollection, removeGameFromCollection,
  STATUS_META,
  type LibraryGame, type LibraryStatus, type WishlistGame, type Collection,
} from "@/lib/library";

// ── Dummy social data ─────────────────────────────────────────────────────────
const DUMMY_FOLLOWING = [
  { id: "1", name: "NightOwlGamer",  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=night",   games: 142, mutual: true },
  { id: "2", name: "PixelHunter99",  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=pixel",   games: 87,  mutual: false },
  { id: "3", name: "SoulsBorneFan",  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=souls",   games: 203, mutual: true },
  { id: "4", name: "IndieDevLover",  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=indie",   games: 56,  mutual: false },
  { id: "5", name: "RPGMaster2024",  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=rpg",     games: 318, mutual: true },
  { id: "6", name: "CasualGamer_X",  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=casual",  games: 29,  mutual: false },
];
const DUMMY_FOLLOWERS = [
  { id: "7",  name: "GamingLegend",   avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=legend",  games: 512, mutual: true },
  { id: "8",  name: "RetroPlayer",    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=retro",   games: 178, mutual: false },
  { id: "9",  name: "SpeedRunner_Z",  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=speed",   games: 94,  mutual: true },
  { id: "10", name: "CoopQueen",      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=coop",    games: 267, mutual: false },
  { id: "11", name: "HorrorFanatic",  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=horror",  games: 133, mutual: true },
];

// ── Reusable game card ────────────────────────────────────────────────────────
function GameTile({
  id, title, image, rating, genre, status, onRemove, onStatusChange,
}: {
  id: string; title: string; image: string; rating: number;
  genre?: string[]; status?: LibraryStatus;
  onRemove: () => void;
  onStatusChange?: (s: LibraryStatus) => void;
}) {
  const [menu, setMenu] = useState(false);
  const meta = status ? STATUS_META[status] : null;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="group relative rounded-2xl border border-white/[0.07] overflow-hidden"
      style={{ background: "rgba(13,13,20,0.9)" }}
    >
      <Link href={`/game/rawg/${id}`}>
        <div className="relative overflow-hidden bg-slate-900" style={{ aspectRatio: "16/9" }}>
          {image ? (
            <img src={image} alt={title}
              className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Gamepad2 className="w-8 h-8 text-slate-700" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d14] via-transparent to-transparent" />
          {meta && (
            <div className="absolute top-2 left-2">
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full"
                style={{ background: `${meta.color}25`, color: meta.color, border: `1px solid ${meta.color}40`, backdropFilter: "blur(8px)" }}>
                {meta.emoji} {meta.label}
              </span>
            </div>
          )}
          {rating > 0 && (
            <div className="absolute bottom-2 left-2 flex items-center gap-1 text-yellow-400 text-xs font-bold">
              <Star className="w-3 h-3 fill-yellow-400" />{rating}
            </div>
          )}
        </div>
      </Link>
      <div className="p-3">
        <Link href={`/game/rawg/${id}`}>
          <p className="text-sm font-bold text-slate-200 truncate hover:text-violet-300 transition-colors">{title}</p>
        </Link>
        {genre && genre.length > 0 && (
          <p className="text-[11px] text-slate-600 truncate mt-0.5">{genre.slice(0, 2).join(" · ")}</p>
        )}
      </div>
      {/* Hover actions */}
      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
        {onStatusChange && (
          <div className="relative">
            <button onClick={() => setMenu(v => !v)}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-white border border-white/20 hover:border-violet-400/50 transition-all"
              style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)" }}>
              <SlidersHorizontal className="w-3.5 h-3.5" />
            </button>
            <AnimatePresence>
              {menu && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: -4 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="absolute right-0 top-full mt-1 rounded-xl border border-white/[0.1] overflow-hidden"
                  style={{ background: "rgba(10,10,18,0.98)", backdropFilter: "blur(20px)", minWidth: 150, zIndex: 50 }}
                >
                  {(Object.keys(STATUS_META) as LibraryStatus[]).map(s => {
                    const m = STATUS_META[s];
                    return (
                      <button key={s} onClick={() => { onStatusChange(s); setMenu(false); }}
                        className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs font-semibold hover:bg-white/[0.05] transition-colors text-left"
                        style={{ color: status === s ? m.color : "#94a3b8" }}>
                        {m.emoji} {m.label}{status === s && <span className="ml-auto">✓</span>}
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
        <button onClick={onRemove}
          className="w-7 h-7 rounded-lg flex items-center justify-center text-white border border-white/20 hover:border-red-400/50 hover:text-red-400 transition-all"
          style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)" }}>
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </motion.div>
  );
}

// ── Tab types ─────────────────────────────────────────────────────────────────
type Tab = "overview" | "library" | "wishlist" | "collections" | "following" | "followers";

const TABS: { key: Tab; label: string }[] = [
  { key: "overview",    label: "Overview" },
  { key: "library",     label: "Library" },
  { key: "wishlist",    label: "Wishlist" },
  { key: "collections", label: "Collections" },
  { key: "following",   label: "Following" },
  { key: "followers",   label: "Followers" },
];

// ── Overview tab ──────────────────────────────────────────────────────────────
function OverviewTab({ library, wishlist, collections, onTabChange }: {
  library: LibraryGame[]; wishlist: WishlistGame[];
  collections: Collection[]; onTabChange: (t: Tab) => void;
}) {
  const stats = [
    { label: "Library",     value: library.length,   emoji: "🎮", tab: "library" as Tab,     color: "#a78bfa" },
    { label: "Wishlist",    value: wishlist.length,  emoji: "🔖", tab: "wishlist" as Tab,    color: "#06b6d4" },
    { label: "Collections", value: collections.length, emoji: "📁", tab: "collections" as Tab, color: "#f59e0b" },
    { label: "Following",   value: DUMMY_FOLLOWING.length, emoji: "👥", tab: "following" as Tab, color: "#22c55e" },
  ];

  const playing   = library.filter(g => g.status === "playing");
  const completed = library.filter(g => g.status === "completed");
  const recent    = [...library, ...wishlist].sort((a, b) => b.addedAt - a.addedAt).slice(0, 6);

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {stats.map(s => (
          <motion.button key={s.label} whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.97 }}
            onClick={() => onTabChange(s.tab)}
            className="flex flex-col items-center gap-2 p-5 rounded-2xl border border-white/[0.07] transition-all hover:border-white/[0.15]"
            style={{ background: "rgba(13,13,20,0.8)" }}>
            <span className="text-3xl">{s.emoji}</span>
            <span className="text-3xl font-black text-white">{s.value}</span>
            <span className="text-xs text-slate-500 font-semibold">{s.label}</span>
          </motion.button>
        ))}
      </div>

      {/* Currently Playing */}
      {playing.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-black text-slate-200 flex items-center gap-2">
              <span className="text-lg">🎮</span> Currently Playing
            </h3>
            <button onClick={() => onTabChange("library")} className="text-xs text-violet-400 hover:text-violet-300 transition-colors">
              View all →
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {playing.slice(0, 4).map(g => (
              <GameTile key={g.id} {...g} onRemove={() => {}} />
            ))}
          </div>
        </div>
      )}

      {/* Recently Added */}
      {recent.length > 0 && (
        <div>
          <h3 className="font-black text-slate-200 mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4 text-violet-400" /> Recently Added
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {recent.map(g => (
              <GameTile key={g.id} {...g} onRemove={() => {}} />
            ))}
          </div>
        </div>
      )}

      {/* Collections preview */}
      {collections.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-black text-slate-200 flex items-center gap-2">
              <FolderOpen className="w-4 h-4 text-yellow-400" /> Collections
            </h3>
            <button onClick={() => onTabChange("collections")} className="text-xs text-violet-400 hover:text-violet-300 transition-colors">
              View all →
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {collections.slice(0, 3).map(col => (
              <div key={col.id} className="p-4 rounded-2xl border border-white/[0.07] hover:border-white/[0.15] transition-all"
                style={{ background: "rgba(13,13,20,0.8)" }}>
                <p className="font-bold text-slate-200 mb-1">{col.name}</p>
                <p className="text-xs text-slate-600 mb-2">{col.games.length} games</p>
                {col.description && <p className="text-xs text-slate-500 line-clamp-2">{col.description}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {library.length === 0 && wishlist.length === 0 && (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🎮</div>
          <p className="text-slate-400 text-lg font-bold mb-2">Your library is empty</p>
          <p className="text-slate-600 text-sm mb-6">Start adding games from the Explore page</p>
          <Link href="/explore">
            <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
              className="flex items-center gap-2 mx-auto px-6 py-3 rounded-xl font-bold text-sm text-white"
              style={{ background: "linear-gradient(135deg, #7c3aed, #6d28d9)", boxShadow: "0 0 24px rgba(124,58,237,0.4)" }}>
              Explore Games <ChevronRight className="w-4 h-4" />
            </motion.button>
          </Link>
        </div>
      )}
    </div>
  );
}

// ── Library tab ───────────────────────────────────────────────────────────────
function LibraryTab({ games, reload }: { games: LibraryGame[]; reload: () => void }) {
  const [filter, setFilter] = useState<LibraryStatus | "all">("all");
  const [search, setSearch] = useState("");
  const [sort, setSort]     = useState<"added" | "name" | "rating">("added");

  const counts = (Object.keys(STATUS_META) as LibraryStatus[]).reduce((acc, s) => {
    acc[s] = games.filter(g => g.status === s).length; return acc;
  }, {} as Record<LibraryStatus, number>);

  const filtered = games
    .filter(g => filter === "all" || g.status === filter)
    .filter(g => !search || g.title.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => sort === "name" ? a.title.localeCompare(b.title) : sort === "rating" ? (b.rating || 0) - (a.rating || 0) : b.addedAt - a.addedAt);

  return (
    <div>
      {/* Filter bar */}
      <div className="flex items-center gap-2 mb-4 p-3 rounded-xl border border-white/[0.06]"
        style={{ background: "rgba(10,10,18,0.6)" }}>
        <button onClick={() => setFilter("all")}
          className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
          style={{ background: filter === "all" ? "rgba(124,58,237,0.2)" : "transparent", color: filter === "all" ? "#a78bfa" : "#475569" }}>
          All ({games.length})
        </button>
        {(Object.keys(STATUS_META) as LibraryStatus[]).map(s => {
          const m = STATUS_META[s];
          return (
            <button key={s} onClick={() => setFilter(s)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
              style={{ background: filter === s ? `${m.color}20` : "transparent", color: filter === s ? m.color : "#475569" }}>
              {m.emoji} {m.label} ({counts[s]})
            </button>
          );
        })}
        <div className="ml-auto flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-600 pointer-events-none" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search library..."
              className="pl-8 pr-3 py-1.5 rounded-lg text-xs text-slate-300 placeholder-slate-600 border border-white/[0.07] focus:border-violet-500/40 focus:outline-none w-44"
              style={{ background: "rgba(13,13,20,0.7)" }} />
          </div>
          <select value={sort} onChange={e => setSort(e.target.value as typeof sort)}
            className="px-3 py-1.5 rounded-lg text-xs text-slate-400 border border-white/[0.07] focus:outline-none"
            style={{ background: "rgba(13,13,20,0.7)" }}>
            <option value="added">Recently Added</option>
            <option value="name">A–Z</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-3">{filter === "all" ? "🎮" : STATUS_META[filter as LibraryStatus]?.emoji}</div>
          <p className="text-slate-400 font-bold mb-2">{search ? "No results" : "No games here yet"}</p>
          <p className="text-slate-600 text-sm">Add games from the Explore page</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          <AnimatePresence mode="popLayout">
            {filtered.map(g => (
              <GameTile key={g.id} {...g}
                onRemove={() => { removeFromLibrary(g.id); reload(); }}
                onStatusChange={s => { updateStatus(g.id, s); reload(); }} />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

// ── Wishlist tab ──────────────────────────────────────────────────────────────
function WishlistTab({ games, reload }: { games: WishlistGame[]; reload: () => void }) {
  const [search, setSearch] = useState("");
  const filtered = games.filter(g => !search || g.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-slate-400 text-sm">{games.length} games on your wishlist</p>
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-600 pointer-events-none" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search wishlist..."
            className="pl-8 pr-3 py-1.5 rounded-lg text-xs text-slate-300 placeholder-slate-600 border border-white/[0.07] focus:border-violet-500/40 focus:outline-none w-48"
            style={{ background: "rgba(13,13,20,0.7)" }} />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-3">🔖</div>
          <p className="text-slate-400 font-bold mb-2">{search ? "No results" : "Wishlist is empty"}</p>
          <p className="text-slate-600 text-sm mb-6">Add games from Explore using the bookmark button</p>
          <Link href="/explore">
            <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
              className="flex items-center gap-2 mx-auto px-5 py-2.5 rounded-xl font-bold text-sm text-white"
              style={{ background: "linear-gradient(135deg, #7c3aed, #6d28d9)" }}>
              Explore Games <ChevronRight className="w-4 h-4" />
            </motion.button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          <AnimatePresence mode="popLayout">
            {filtered.map(g => (
              <GameTile key={g.id} {...g}
                onRemove={() => { removeFromWishlist(g.id); reload(); }} />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

// ── Collections tab ───────────────────────────────────────────────────────────
function CollectionsTab({ collections, reload }: { collections: Collection[]; reload: () => void }) {
  const [creating, setCreating]   = useState(false);
  const [name, setName]           = useState("");
  const [desc, setDesc]           = useState("");
  const [activeCol, setActiveCol] = useState<string | null>(null);

  const handleCreate = () => {
    if (!name.trim()) return;
    createCollection(name.trim(), desc.trim());
    setName(""); setDesc(""); setCreating(false); reload();
  };

  const col = collections.find(c => c.id === activeCol);

  if (col) {
    return (
      <div>
        <button onClick={() => setActiveCol(null)}
          className="flex items-center gap-2 text-sm text-slate-400 hover:text-slate-200 transition-colors mb-6">
          ← Back to Collections
        </button>
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="text-2xl font-black text-white mb-1">{col.name}</h3>
            {col.description && <p className="text-slate-500 text-sm">{col.description}</p>}
            <p className="text-slate-600 text-xs mt-1">{col.games.length} games</p>
          </div>
          <button onClick={() => { deleteCollection(col.id); setActiveCol(null); reload(); }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-red-400 border border-red-500/20 hover:bg-red-500/10 transition-all">
            <Trash2 className="w-3.5 h-3.5" /> Delete
          </button>
        </div>
        {col.games.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-4xl mb-3">📁</div>
            <p className="text-slate-500 text-sm">No games in this collection yet</p>
            <p className="text-slate-600 text-xs mt-1">Add games from the Explore page</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            <AnimatePresence mode="popLayout">
              {col.games.map(g => (
                <GameTile key={g.id} {...g}
                  onRemove={() => { removeGameFromCollection(col.id, g.id); reload(); }} />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-slate-400 text-sm">{collections.length} collections</p>
        <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
          onClick={() => setCreating(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-white"
          style={{ background: "linear-gradient(135deg, #7c3aed, #6d28d9)", boxShadow: "0 0 20px rgba(124,58,237,0.3)" }}>
          <Plus className="w-4 h-4" /> New Collection
        </motion.button>
      </div>

      {/* Create form */}
      <AnimatePresence>
        {creating && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 overflow-hidden"
          >
            <div className="p-5 rounded-2xl border border-violet-500/25"
              style={{ background: "rgba(124,58,237,0.06)" }}>
              <h4 className="font-bold text-slate-200 mb-4">Create New Collection</h4>
              <div className="space-y-3">
                <input value={name} onChange={e => setName(e.target.value)}
                  placeholder="Collection name *"
                  className="w-full px-4 py-2.5 rounded-xl text-sm text-slate-200 placeholder-slate-600 border border-white/[0.08] focus:border-violet-500/50 focus:outline-none"
                  style={{ background: "rgba(13,13,20,0.7)" }} />
                <textarea value={desc} onChange={e => setDesc(e.target.value)}
                  placeholder="Description (optional)"
                  rows={2}
                  className="w-full px-4 py-2.5 rounded-xl text-sm text-slate-200 placeholder-slate-600 border border-white/[0.08] focus:border-violet-500/50 focus:outline-none resize-none"
                  style={{ background: "rgba(13,13,20,0.7)" }} />
                <div className="flex gap-2">
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                    onClick={handleCreate}
                    className="px-5 py-2 rounded-xl text-sm font-bold text-white"
                    style={{ background: "linear-gradient(135deg, #7c3aed, #6d28d9)" }}>
                    Create
                  </motion.button>
                  <button onClick={() => { setCreating(false); setName(""); setDesc(""); }}
                    className="px-5 py-2 rounded-xl text-sm font-semibold text-slate-400 border border-white/[0.07] hover:text-slate-200 transition-colors">
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {collections.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-3">📁</div>
          <p className="text-slate-400 font-bold mb-2">No collections yet</p>
          <p className="text-slate-600 text-sm">Create a collection to organize your games</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {collections.map(col => (
            <motion.button key={col.id} whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }}
              onClick={() => setActiveCol(col.id)}
              className="text-left p-5 rounded-2xl border border-white/[0.07] hover:border-violet-500/25 transition-all"
              style={{ background: "rgba(13,13,20,0.8)" }}>
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.2)" }}>
                  <FolderOpen className="w-5 h-5 text-violet-400" />
                </div>
                <span className="text-xs text-slate-600 font-semibold">{col.games.length} games</span>
              </div>
              <p className="font-bold text-slate-200 mb-1">{col.name}</p>
              {col.description && <p className="text-xs text-slate-500 line-clamp-2">{col.description}</p>}
              {/* Mini covers */}
              {col.games.length > 0 && (
                <div className="flex gap-1 mt-3">
                  {col.games.slice(0, 4).map(g => (
                    <div key={g.id} className="w-8 h-8 rounded-lg overflow-hidden bg-slate-800 flex-shrink-0">
                      {g.image && <img src={g.image} alt={g.title} className="w-full h-full object-cover" />}
                    </div>
                  ))}
                  {col.games.length > 4 && (
                    <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-[10px] text-slate-500 font-bold flex-shrink-0">
                      +{col.games.length - 4}
                    </div>
                  )}
                </div>
              )}
            </motion.button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Social tab ────────────────────────────────────────────────────────────────
function SocialTab({ users, type }: { users: typeof DUMMY_FOLLOWING; type: "following" | "followers" }) {
  return (
    <div>
      <p className="text-slate-400 text-sm mb-5">{users.length} {type}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {users.map(u => (
          <motion.div key={u.id} whileHover={{ scale: 1.02, y: -2 }}
            className="flex items-center gap-3 p-4 rounded-2xl border border-white/[0.07] hover:border-white/[0.15] transition-all"
            style={{ background: "rgba(13,13,20,0.8)" }}>
            <img src={u.avatar} alt={u.name} className="w-12 h-12 rounded-2xl border border-white/[0.1] bg-slate-800" />
            <div className="flex-1 min-w-0">
              <p className="font-bold text-slate-200 text-sm truncate">{u.name}</p>
              <p className="text-xs text-slate-600">{u.games} games</p>
              {u.mutual && (
                <span className="text-[10px] font-bold text-emerald-400">✓ Mutual</span>
              )}
            </div>
            <button className="w-8 h-8 rounded-xl flex items-center justify-center border border-white/[0.07] text-slate-500 hover:text-violet-400 hover:border-violet-500/30 transition-all"
              style={{ background: "rgba(13,13,20,0.6)" }}>
              <UserPlus className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ── Main overlay ──────────────────────────────────────────────────────────────
interface Props { open: boolean; onClose: () => void; }

export default function LibraryOverlay({ open, onClose }: Props) {
  const [tab, setTab]               = useState<Tab>("overview");
  const [library, setLibrary]       = useState<LibraryGame[]>([]);
  const [wishlist, setWishlist]     = useState<WishlistGame[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);

  const reload = useCallback(() => {
    setLibrary(getLibrary());
    setWishlist(getWishlist());
    setCollections(getCollections());
  }, []);

  useEffect(() => {
    reload();
    window.addEventListener("library-updated", reload);
    return () => window.removeEventListener("library-updated", reload);
  }, [reload]);

  useEffect(() => {
    if (!open) return;
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [open, onClose]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[200]"
            style={{ background: "rgba(2,2,8,0.88)", backdropFilter: "blur(14px)" }}
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.96 }}
            transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-4 sm:inset-6 z-[201] rounded-3xl overflow-hidden flex flex-col"
            style={{
              background: "rgba(6,6,12,0.99)",
              border: "1px solid rgba(124,58,237,0.18)",
              boxShadow: "0 40px 120px rgba(0,0,0,0.95), 0 0 80px rgba(124,58,237,0.08)",
            }}
          >
            {/* Top neon line */}
            <div className="absolute top-0 left-0 right-0 h-px"
              style={{ background: "linear-gradient(90deg, transparent, rgba(124,58,237,0.9), rgba(6,182,212,0.5), transparent)" }} />

            {/* ── Header ── */}
            <div className="flex items-center justify-between px-8 py-5 border-b border-white/[0.06] flex-shrink-0"
              style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.07), rgba(6,182,212,0.02))" }}>
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-2xl flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg, #7c3aed, #06b6d4)", boxShadow: "0 0 24px rgba(124,58,237,0.5)" }}>
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-white">My Library</h2>
                  <p className="text-xs text-slate-500">
                    {library.length} games · {wishlist.length} wishlisted · {collections.length} collections
                  </p>
                </div>
              </div>
              <button onClick={onClose}
                className="w-10 h-10 rounded-2xl flex items-center justify-center border border-white/[0.08] text-slate-400 hover:text-white hover:border-white/20 transition-all"
                style={{ background: "rgba(13,13,20,0.7)" }}>
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* ── Tab bar ── */}
            <div className="flex items-center gap-1 px-8 py-0 border-b border-white/[0.05] flex-shrink-0 overflow-x-auto scrollbar-none">
              {TABS.map(t => (
                <button key={t.key} onClick={() => setTab(t.key)}
                  className="relative px-5 py-4 text-sm font-semibold whitespace-nowrap transition-all flex-shrink-0"
                  style={{ color: tab === t.key ? "#e2e8f0" : "#475569" }}>
                  {t.label}
                  {tab === t.key && (
                    <motion.div layoutId="tab-underline"
                      className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                      style={{ background: "linear-gradient(90deg, #7c3aed, #06b6d4)" }} />
                  )}
                </button>
              ))}
            </div>

            {/* ── Content ── */}
            <div className="flex-1 overflow-y-auto px-8 py-6">
              <AnimatePresence mode="wait">
                <motion.div key={tab}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.22 }}>
                  {tab === "overview"    && <OverviewTab library={library} wishlist={wishlist} collections={collections} onTabChange={setTab} />}
                  {tab === "library"     && <LibraryTab games={library} reload={reload} />}
                  {tab === "wishlist"    && <WishlistTab games={wishlist} reload={reload} />}
                  {tab === "collections" && <CollectionsTab collections={collections} reload={reload} />}
                  {tab === "following"   && <SocialTab users={DUMMY_FOLLOWING} type="following" />}
                  {tab === "followers"   && <SocialTab users={DUMMY_FOLLOWERS} type="followers" />}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
