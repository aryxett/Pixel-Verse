"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Star, Flame, Calendar, Trophy, TrendingUp,
  Crown, Gamepad2, Monitor, ChevronDown, ChevronUp,
  Loader2, Zap,
} from "lucide-react";

/* ── Types ── */
interface GameThumb { slug: string; name: string; image: string; metacritic: number | null; rating: number }
interface Section   { games: GameThumb[]; count: number }
interface Genre     { id: number; name: string; slug: string; count: number; image: string }
interface Platform  { id: number; name: string; slug: string; count: number; image: string }

interface SidebarData {
  newReleases: { last30: Section; thisWeek: Section; nextWeek: Section };
  top:         { bestYear: Section; popular2025: Section; allTime: Section };
  genres:      Genre[];
  platforms:   Platform[];
}

/* ── Platform icons ── */
const PLATFORM_ICONS: Record<string, string> = {
  pc: "🖥️", playstation5: "🎮", playstation4: "🎮",
  "xbox-series-x": "🟩", "xbox-one": "🟩",
  "nintendo-switch": "🔴", ios: "📱", android: "📱",
  macos: "🍎", linux: "🐧", web: "🌐",
};

/* ── Hover game preview ── */
function GamePreviewTooltip({ games }: { games: GameThumb[] }) {
  if (!games.length) return null;
  return (
    <motion.div
      initial={{ opacity: 0, x: 8, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 8, scale: 0.95 }}
      transition={{ duration: 0.15 }}
      className="absolute left-full top-0 ml-2 z-50 w-56 rounded-2xl border border-white/[0.08] overflow-hidden shadow-2xl"
      style={{ background: "rgba(10,10,18,0.97)", backdropFilter: "blur(20px)" }}
    >
      <div className="p-2 space-y-1.5">
        {games.slice(0, 4).map((g) => (
          <Link key={g.slug} href={`/game/rawg/${g.slug}`}
            className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-violet-500/10 transition-colors group"
            style={{ textDecoration: "none" }}>
            <div className="w-10 h-7 rounded-lg overflow-hidden flex-shrink-0 bg-slate-800">
              {g.image && <img src={g.image} alt={g.name} className="w-full h-full object-cover" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-slate-300 group-hover:text-violet-300 transition-colors truncate">{g.name}</p>
              {g.metacritic && (
                <span className="text-[10px] font-bold px-1 rounded"
                  style={{ background: g.metacritic >= 75 ? "#66cc33" : "#ffcc33", color: "#000" }}>
                  {g.metacritic}
                </span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </motion.div>
  );
}

/* ── Sidebar item ── */
function SidebarItem({
  icon, label, count, href, games, active, onClick, delay = 0,
}: {
  icon: React.ReactNode;
  label: string;
  count?: number;
  href?: string;
  games?: GameThumb[];
  active?: boolean;
  onClick?: () => void;
  delay?: number;
}) {
  const [hovered, setHovered] = useState(false);

  const content = (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
      className="relative flex items-center gap-3 px-3 py-2 rounded-xl cursor-pointer group transition-all"
      style={{
        background: active ? "rgba(124,58,237,0.15)" : hovered ? "rgba(255,255,255,0.04)" : "transparent",
        borderLeft: active ? "2px solid #7c3aed" : "2px solid transparent",
      }}
      whileHover={{ x: 3 }}
    >
      <span className="text-slate-500 group-hover:text-violet-400 transition-colors flex-shrink-0"
        style={{ color: active ? "#a78bfa" : undefined }}>
        {icon}
      </span>
      <span className="text-sm font-medium flex-1 truncate transition-colors"
        style={{ color: active ? "#c4b5fd" : hovered ? "#e2e8f0" : "#94a3b8" }}>
        {label}
      </span>
      {count !== undefined && count > 0 && (
        <span className="text-[10px] text-slate-600 font-medium flex-shrink-0">
          {count >= 1000 ? `${(count / 1000).toFixed(0)}K` : count}
        </span>
      )}

      {/* Hover preview tooltip */}
      <AnimatePresence>
        {hovered && games && games.length > 0 && (
          <GamePreviewTooltip games={games} />
        )}
      </AnimatePresence>
    </motion.div>
  );

  if (href) {
    return <Link href={href} style={{ textDecoration: "none" }}>{content}</Link>;
  }
  return content;
}

/* ── Section header ── */
function SectionHeader({ label, delay = 0 }: { label: string; delay?: number }) {
  return (
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay }}
      className="text-xs font-bold text-slate-400 uppercase tracking-widest px-3 pt-4 pb-1"
    >
      {label}
    </motion.p>
  );
}

/* ── Genre item with image ── */
function GenreItem({ genre, active, onClick, delay }: {
  genre: Genre; active: boolean; onClick: () => void; delay: number;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
      className="flex items-center gap-3 px-3 py-2 rounded-xl cursor-pointer group transition-all"
      style={{
        background: active ? "rgba(124,58,237,0.15)" : hovered ? "rgba(255,255,255,0.04)" : "transparent",
        borderLeft: active ? "2px solid #7c3aed" : "2px solid transparent",
      }}
      whileHover={{ x: 3 }}
    >
      {/* Genre image thumbnail */}
      <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0 border border-white/[0.08]"
        style={{ background: "rgba(30,30,50,0.8)" }}>
        {genre.image && (
          <img src={genre.image} alt={genre.name}
            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300" />
        )}
      </div>
      <span className="text-sm font-medium flex-1 truncate transition-colors"
        style={{ color: active ? "#c4b5fd" : hovered ? "#e2e8f0" : "#94a3b8" }}>
        {genre.name}
      </span>
      <span className="text-[10px] text-slate-700 flex-shrink-0">
        {genre.count >= 1000 ? `${(genre.count / 1000).toFixed(0)}K` : genre.count}
      </span>
    </motion.div>
  );
}

/* ── Main Sidebar ── */
interface Props {
  activeSection: string;
  activeGenre: string;
  activePlatform: string;
  onSectionChange: (section: string, params: Record<string, string>) => void;
  onGenreChange: (genre: string) => void;
  onPlatformChange: (platform: string) => void;
}

export default function ExploreSidebar({
  activeSection, activeGenre, activePlatform,
  onSectionChange, onGenreChange, onPlatformChange,
}: Props) {
  const [data, setData]               = useState<SidebarData | null>(null);
  const [loading, setLoading]         = useState(true);
  const [showAllGenres, setShowAllGenres]       = useState(false);
  const [showAllPlatforms, setShowAllPlatforms] = useState(false);

  useEffect(() => {
    fetch("/api/sidebar")
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-5 h-5 text-violet-400 animate-spin" />
      </div>
    );
  }

  if (!data) return null;

  // Safely destructure with fallbacks in case API returns partial data
  const newReleases = data.newReleases ?? { last30: { count: 0, games: [] }, thisWeek: { count: 0, games: [] }, nextWeek: { count: 0, games: [] } };
  const top = data.top ?? { bestYear: { count: 0, games: [] }, popular2025: { count: 0, games: [] }, allTime: { count: 0, games: [] } };
  const genres = data.genres ?? [];
  const platforms = data.platforms ?? [];

  const visibleGenres    = showAllGenres    ? genres    : genres.slice(0, 8);
  const visiblePlatforms = showAllPlatforms ? platforms : platforms.slice(0, 6);

  return (
    <div className="space-y-0.5 pb-8">

      {/* ── NEW RELEASES ── */}
      <SectionHeader label="New Releases" delay={0.05} />

      <SidebarItem
        icon={<Star className="w-4 h-4" />}
        label="Last 30 days"
        count={newReleases.last30.count}
        games={newReleases.last30.games}
        active={activeSection === "last30"}
        onClick={() => onSectionChange("last30", {
          ordering: "-added",
          dates: `${fmt30DaysAgo()},${fmtToday()}`,
        })}
        delay={0.07}
      />
      <SidebarItem
        icon={<Flame className="w-4 h-4" />}
        label="This week"
        count={newReleases.thisWeek.count}
        games={newReleases.thisWeek.games}
        active={activeSection === "thisWeek"}
        onClick={() => onSectionChange("thisWeek", {
          ordering: "-added",
          dates: `${fmtThisWeekStart()},${fmtThisWeekEnd()}`,
        })}
        delay={0.09}
      />
      <SidebarItem
        icon={<Calendar className="w-4 h-4" />}
        label="Next week"
        count={newReleases.nextWeek.count}
        games={newReleases.nextWeek.games}
        active={activeSection === "nextWeek"}
        onClick={() => onSectionChange("nextWeek", {
          ordering: "-added",
          dates: `${fmtNextWeekStart()},${fmtNextWeekEnd()}`,
        })}
        delay={0.11}
      />

      {/* ── TOP ── */}
      <SectionHeader label="Top" delay={0.13} />

      <SidebarItem
        icon={<Trophy className="w-4 h-4" />}
        label={`Best of ${new Date().getFullYear()}`}
        count={top.bestYear.count}
        games={top.bestYear.games}
        active={activeSection === "bestYear"}
        onClick={() => onSectionChange("bestYear", {
          ordering: "-metacritic",
          metacritic: "80,100",
          dates: `${new Date().getFullYear()}-01-01,${fmtToday()}`,
        })}
        delay={0.15}
      />
      <SidebarItem
        icon={<TrendingUp className="w-4 h-4" />}
        label="Popular in 2025"
        count={top.popular2025.count}
        games={top.popular2025.games}
        active={activeSection === "popular2025"}
        onClick={() => onSectionChange("popular2025", {
          ordering: "-added",
          dates: "2025-01-01,2025-12-31",
        })}
        delay={0.17}
      />
      <SidebarItem
        icon={<Crown className="w-4 h-4" />}
        label="All time top 250"
        count={top.allTime.count}
        games={top.allTime.games}
        active={activeSection === "allTime"}
        onClick={() => onSectionChange("allTime", {
          ordering: "-metacritic",
          metacritic: "90,100",
        })}
        delay={0.19}
      />

      {/* ── ALL GAMES ── */}
      <SectionHeader label="All Games" delay={0.21} />
      <SidebarItem
        icon={<Gamepad2 className="w-4 h-4" />}
        label="All games"
        active={activeSection === "all"}
        onClick={() => onSectionChange("all", { ordering: "-rating" })}
        delay={0.22}
      />

      {/* ── PLATFORMS ── */}
      <SectionHeader label="Platforms" delay={0.24} />
      {visiblePlatforms.map((p, i) => (
        <motion.div
          key={p.id}
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.25 + i * 0.03 }}
          onClick={() => onPlatformChange(activePlatform === p.id.toString() ? "" : p.id.toString())}
          className="flex items-center gap-3 px-3 py-2 rounded-xl cursor-pointer group transition-all"
          style={{
            background: activePlatform === p.id.toString() ? "rgba(124,58,237,0.15)" : "transparent",
            borderLeft: activePlatform === p.id.toString() ? "2px solid #7c3aed" : "2px solid transparent",
          }}
          whileHover={{ x: 3, backgroundColor: "rgba(255,255,255,0.04)" }}
        >
          <span className="text-base flex-shrink-0">
            {PLATFORM_ICONS[p.slug] || <Monitor className="w-4 h-4" />}
          </span>
          <span className="text-sm font-medium flex-1 truncate transition-colors"
            style={{ color: activePlatform === p.id.toString() ? "#c4b5fd" : "#94a3b8" }}>
            {p.name}
          </span>
          <span className="text-[10px] text-slate-700">
            {p.count >= 1000 ? `${(p.count / 1000).toFixed(0)}K` : p.count}
          </span>
        </motion.div>
      ))}
      {platforms.length > 6 && (
        <button
          onClick={() => setShowAllPlatforms(!showAllPlatforms)}
          className="flex items-center gap-2 px-3 py-1.5 text-xs text-slate-600 hover:text-slate-400 transition-colors w-full"
        >
          {showAllPlatforms ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          {showAllPlatforms ? "Show less" : `Show ${platforms.length - 6} more`}
        </button>
      )}

      {/* ── GENRES ── */}
      <SectionHeader label="Genres" delay={0.35} />
      {visibleGenres.map((g, i) => (
        <GenreItem
          key={g.id}
          genre={g}
          active={activeGenre === g.slug}
          onClick={() => onGenreChange(activeGenre === g.slug ? "" : g.slug)}
          delay={0.36 + i * 0.03}
        />
      ))}
      {genres.length > 8 && (
        <button
          onClick={() => setShowAllGenres(!showAllGenres)}
          className="flex items-center gap-2 px-3 py-1.5 text-xs text-slate-600 hover:text-slate-400 transition-colors w-full"
        >
          {showAllGenres ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          {showAllGenres ? "Hide" : `Show all ${genres.length} genres`}
        </button>
      )}

      {/* ── AI PICK ── */}
      <SectionHeader label="AI" delay={0.5} />
      <SidebarItem
        icon={<Zap className="w-4 h-4 text-violet-400" />}
        label="AI Recommendations"
        href="/#ai-chat"
        delay={0.52}
      />
    </div>
  );
}

/* ── Date helpers ── */
const fmtToday      = () => new Date().toISOString().split("T")[0];
const fmt30DaysAgo  = () => new Date(Date.now() - 30 * 86400000).toISOString().split("T")[0];
const fmtThisWeekStart = () => {
  const d = new Date(); d.setDate(d.getDate() - d.getDay()); return d.toISOString().split("T")[0];
};
const fmtThisWeekEnd = () => {
  const d = new Date(); d.setDate(d.getDate() + (6 - d.getDay())); return d.toISOString().split("T")[0];
};
const fmtNextWeekStart = () => {
  const d = new Date(); d.setDate(d.getDate() + (7 - d.getDay())); return d.toISOString().split("T")[0];
};
const fmtNextWeekEnd = () => {
  const d = new Date(); d.setDate(d.getDate() + (13 - d.getDay())); return d.toISOString().split("T")[0];
};
