"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, X,
  ChevronLeft, ChevronRight, AlertCircle,
} from "lucide-react";
import GameCardPro from "@/components/GameCardPro";
import SearchSuggestions from "@/components/SearchSuggestions";
import ExploreSidebar from "@/components/ExploreSidebar";
import GenreDropdown from "@/components/GenreDropdown";

interface Game {
  id: string;
  title: string;
  image: string;
  rating: number;
  metacritic: number | null;
  genre: string[];
  playtime: string;
  multiplayer: boolean;
  aiScore: number;
  releaseYear: number;
  developer: string;
  ratingsCount: number;
  tags: string[];
}

interface ApiResponse {
  count: number;
  next: boolean;
  previous: boolean;
  page: number;
  results: Game[];
}

const SORT_OPTIONS = [
  { value: "-rating",     label: "Top Rated" },
  { value: "-metacritic", label: "Metacritic" },
  { value: "-added",      label: "Most Popular" },
  { value: "-released",   label: "Newest" },
  { value: "name",        label: "A–Z" },
];

// All RAWG genres — complete list
const GENRES_LIST = [
  { slug: "action",              name: "Action" },
  { slug: "indie",               name: "Indie" },
  { slug: "adventure",           name: "Adventure" },
  { slug: "rpg",                 name: "RPG" },
  { slug: "strategy",            name: "Strategy" },
  { slug: "shooter",             name: "Shooter" },
  { slug: "casual",              name: "Casual" },
  { slug: "simulation",          name: "Simulation" },
  { slug: "puzzle",              name: "Puzzle" },
  { slug: "arcade",              name: "Arcade" },
  { slug: "platformer",          name: "Platformer" },
  { slug: "massively-multiplayer", name: "MMO" },
  { slug: "racing",              name: "Racing" },
  { slug: "sports",              name: "Sports" },
  { slug: "fighting",            name: "Fighting" },
  { slug: "family",              name: "Family" },
  { slug: "board-games",         name: "Board Games" },
  { slug: "educational",         name: "Educational" },
  { slug: "card",                name: "Card" },
];

export default function ExploreClient() {
  const [games, setGames]           = useState<Game[]>([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [hasNext, setHasNext]       = useState(false);
  const [hasPrev, setHasPrev]       = useState(false);
  const [page, setPage]             = useState(1);

  // Filters
  const [search, setSearch]               = useState("");
  const [searchInput, setSearchInput]     = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState("");
  const [ordering, setOrdering]           = useState("-rating");
  const [showFilters, setShowFilters]     = useState(false);
  const [suggestionOpen, setSuggestionOpen] = useState(false);

  // Sidebar section state
  const [activeSection, setActiveSection]   = useState("all");
  const [sectionParams, setSectionParams]   = useState<Record<string, string>>({});
  const [sectionTitle, setSectionTitle]     = useState("All Games");

  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchGames = useCallback(async (pg = 1) => {
    setLoading(true);
    setError(null);

    const params = new URLSearchParams({
      page: pg.toString(),
      page_size: "24",
    });

    // Section params first (they define the base query)
    Object.entries(sectionParams).forEach(([k, v]) => params.set(k, v));

    // Then apply user overrides
    if (!params.has("ordering")) params.set("ordering", ordering);
    if (search)           params.set("search", search);
    if (selectedGenre)    params.set("genre", selectedGenre);
    if (selectedPlatform) params.set("platform", selectedPlatform);

    try {
      const res  = await fetch(`/api/rawg/explore?${params}`);
      const data: ApiResponse = await res.json();
      if (!res.ok) throw new Error((data as any).error || "Failed to load");
      setGames(data.results);
      setTotalCount(data.count);
      setHasNext(data.next);
      setHasPrev(data.previous);
      setPage(pg);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load games");
    } finally {
      setLoading(false);
    }
  }, [search, selectedGenre, selectedPlatform, ordering, sectionParams]);

  useEffect(() => { fetchGames(1); }, [fetchGames]);

  const handleSearchInput = (val: string) => {
    setSearchInput(val);
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => setSearch(val), 500);
  };

  const handleSectionChange = (section: string, params: Record<string, string>) => {
    setActiveSection(section);
    setSectionParams(params);
    setSearch(""); setSearchInput("");
    setSelectedGenre(""); setSelectedPlatform("");
    const year = new Date().getFullYear();
    const titles: Record<string, string> = {
      last30: "Last 30 Days", thisWeek: "This Week", nextWeek: "Next Week",
      bestYear: `Best of ${year}`, popular2025: "Popular in 2025",
      allTime: "All Time Top 250", all: "All Games",
    };
    setSectionTitle(titles[section] || "Games");
  };

  const handleGenreChange = (genre: string) => {
    setSelectedGenre(genre);
    setActiveSection("all");
    setSectionParams({});
    setSectionTitle(genre ? `${genre.charAt(0).toUpperCase() + genre.slice(1)} Games` : "All Games");
  };

  const handlePlatformChange = (platformId: string) => {
    setSelectedPlatform(platformId);
    setActiveSection("all");
    setSectionParams({});
    setSectionTitle(platformId ? "Platform Games" : "All Games");
  };

  return (
    <div className="flex min-h-screen" style={{ marginTop: "-1px" }}>

        {/* ── LEFT SIDEBAR ── */}
        <aside className="hidden lg:block w-60 flex-shrink-0 border-r border-white/[0.05]"
          style={{ background: "rgba(8,8,14,0.95)" }}>
          <div className="sticky top-16 overflow-y-auto" style={{ maxHeight: "calc(100vh - 64px)" }}>
            <ExploreSidebar
              activeSection={activeSection}
              activeGenre={selectedGenre}
              activePlatform={selectedPlatform}
              onSectionChange={handleSectionChange}
              onGenreChange={handleGenreChange}
              onPlatformChange={handlePlatformChange}
            />
          </div>
        </aside>

        {/* ── MAIN CONTENT ── */}
        <div className="flex-1 min-w-0 px-6 py-8">

          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
            <h1 className="text-3xl font-black text-slate-100 mb-1">
              <span className="gradient-text">{sectionTitle}</span>
            </h1>
            <p className="text-slate-500 text-sm">
              {loading ? "Loading..." : `${totalCount.toLocaleString()} games`}
              {selectedGenre && <span className="text-violet-400 ml-2">· {selectedGenre}</span>}
              {selectedPlatform && <span className="text-cyan-400 ml-2">· {selectedPlatform}</span>}
            </p>
          </motion.div>

          {/* Search + Sort + Genre Filter */}
          <div className="flex gap-3 mb-5">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 pointer-events-none z-10" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => { handleSearchInput(e.target.value); setSuggestionOpen(true); }}
                onFocus={() => setSuggestionOpen(true)}
                placeholder="Search any game..."
                className="input-glow w-full pl-11 pr-10 py-3 rounded-xl text-sm"
                autoComplete="off"
              />
              {searchInput && (
                <button onClick={() => { setSearchInput(""); setSearch(""); setSuggestionOpen(false); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-300 transition-colors z-10">
                  <X className="w-4 h-4" />
                </button>
              )}
              <SearchSuggestions
                query={searchInput}
                genre={selectedGenre}
                open={suggestionOpen && searchInput.length >= 2}
                onClose={() => setSuggestionOpen(false)}
                onSelect={(slug, title) => { setSearchInput(title); setSearch(title); setSuggestionOpen(false); }}
              />
            </div>

            {/* Genre filter dropdown */}
            <GenreDropdown
              value={selectedGenre}
              onChange={handleGenreChange}
            />

            <select value={ordering} onChange={(e) => setOrdering(e.target.value)}
              className="input-glow px-4 py-3 rounded-xl text-sm text-slate-300 cursor-pointer flex-shrink-0">
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value} className="bg-slate-900">{o.label}</option>
              ))}
            </select>
          </div>

          {/* Active filters */}
          {(selectedGenre || selectedPlatform) && (
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedGenre && (
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border border-violet-500/30 text-violet-300"
                  style={{ background: "rgba(124,58,237,0.1)" }}>
                  {selectedGenre}
                  <button onClick={() => setSelectedGenre("")} className="hover:text-white transition-colors">✕</button>
                </span>
              )}
              {selectedPlatform && (
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border border-cyan-500/30 text-cyan-300"
                  style={{ background: "rgba(6,182,212,0.1)" }}>
                  {selectedPlatform}
                  <button onClick={() => setSelectedPlatform("")} className="hover:text-white transition-colors">✕</button>
                </span>
              )}
              <button onClick={() => { setSelectedGenre(""); setSelectedPlatform(""); setActiveSection("all"); setSectionParams({}); }}
                className="text-xs text-slate-600 hover:text-slate-400 transition-colors px-2">
                Clear all
              </button>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="flex items-center gap-3 p-4 rounded-xl border border-red-500/20 bg-red-500/8 text-red-300 text-sm mb-6">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />{error}
            </div>
          )}

          {/* Loading skeletons */}
          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="rounded-2xl overflow-hidden border border-white/[0.05] animate-pulse"
                  style={{ background: "rgba(13,13,20,0.8)" }}>
                  <div className="bg-slate-800/60" style={{ aspectRatio: "16/9" }} />
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-slate-800 rounded w-3/4" />
                    <div className="h-3 bg-slate-800 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty */}
          {!loading && games.length === 0 && !error && (
            <div className="text-center py-24 text-slate-600">
              <p className="text-4xl mb-4">🎮</p>
              <p className="text-lg font-semibold mb-2 text-slate-400">No games found</p>
              <p className="text-sm">Try a different search or filter</p>
            </div>
          )}

          {/* Games grid */}
          {!loading && games.length > 0 && (
            <>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5" style={{ overflow: "visible" }}>
                {games.map((game, i) => (
                  <GameCardPro
                    key={`${game.id}-${i}`}
                    id={game.id}
                    title={game.title}
                    genre={game.genre}
                    rating={game.rating}
                    thumbnail={game.image || "/placeholder-game.svg"}
                    metacritic={game.metacritic}
                    aiScore={game.aiScore}
                    developer={game.developer}
                    releaseYear={game.releaseYear}
                    playtime={game.playtime}
                    multiplayer={game.multiplayer}
                    tags={game.tags}
                    index={i}
                  />
                ))}
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between mt-8 pt-5 border-t border-white/[0.06]">
                <p className="text-sm text-slate-600">
                  <span className="text-slate-400 font-semibold">{totalCount.toLocaleString()}</span> total games
                </p>
                <div className="flex items-center gap-1">
                  {/* Prev */}
                  <button
                    onClick={() => { fetchGames(page - 1); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                    disabled={!hasPrev}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-800 text-slate-400 hover:border-slate-600 hover:text-slate-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-sm"
                    style={{ background: "rgba(13,13,20,0.7)" }}
                  >
                    <ChevronLeft className="w-4 h-4" />Prev
                  </button>

                  {/* Page numbers: 1-10, ..., 50 */}
                  {(() => {
                    const pages: (number | "...")[] = [];

                    if (page <= 10) {
                      // Show 1-10 + ... + 50
                      for (let i = 1; i <= 10; i++) pages.push(i);
                      pages.push("...");
                      pages.push(50);
                    } else if (page > 10 && page <= 45) {
                      // Show 1 ... page-1, page, page+1 ... 50
                      pages.push(1);
                      pages.push("...");
                      for (let i = page - 1; i <= page + 1; i++) pages.push(i);
                      pages.push("...");
                      pages.push(50);
                    } else {
                      // Near end: 1 ... 41-50
                      pages.push(1);
                      pages.push("...");
                      for (let i = 41; i <= 50; i++) pages.push(i);
                    }

                    return pages.map((p, i) =>
                      p === "..." ? (
                        <span key={`dots-${i}`} className="px-2 text-slate-600 text-sm select-none">...</span>
                      ) : (
                        <button
                          key={p}
                          onClick={() => { fetchGames(p as number); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                          className="w-9 h-9 rounded-xl text-sm font-semibold transition-all"
                          style={{
                            background: p === page ? "rgba(124,58,237,0.2)" : "rgba(13,13,20,0.7)",
                            border: "1px solid",
                            borderColor: p === page ? "rgba(124,58,237,0.5)" : "rgba(255,255,255,0.07)",
                            color: p === page ? "#c4b5fd" : "#64748b",
                          }}
                        >
                          {p}
                        </button>
                      )
                    );
                  })()}

                  {/* Next */}
                  <button
                    onClick={() => { fetchGames(page + 1); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                    disabled={!hasNext}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-800 text-slate-400 hover:border-slate-600 hover:text-slate-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-sm"
                    style={{ background: "rgba(13,13,20,0.7)" }}
                  >
                    Next<ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
    </div>
  );
}
