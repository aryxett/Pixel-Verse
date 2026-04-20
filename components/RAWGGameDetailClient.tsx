"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  ChevronLeft, Star, Clock, Users, Calendar,
  Building2, Tag, Zap, Globe, Trophy,
  ImageIcon, Loader2, MessageSquare, ThumbsUp,
  ThumbsDown, Minus, ChevronRight, X, Play,
} from "lucide-react";
import PlatformStores from "@/components/PlatformStores";
import PriceComparison from "@/components/PriceComparison";
import GameFacts from "@/components/GameFacts";
import AddToLibraryButton from "@/components/AddToLibraryButton";
import AddToCollectionButton from "@/components/AddToCollectionButton";

interface GameDetail {
  id: string;
  title: string;
  image: string;
  rating: number;
  metacritic: number | null;
  genre: string[];
  platform: string[];
  playtime: string;
  multiplayer: boolean;
  aiScore: number;
  releaseYear: number;
  developer: string;
  publisher: string;
  description_full: string;
  description: string;
  screenshots: string[];
  tags: string[];
  esrb: string | null;
  website: string | null;
  ratings_breakdown: Array<{ id: number; title: string; count: number; percent: number }>;
  ratingsCount: number;
  trailer_mp4: string | null;
  trailer_youtube_id: string | null;
  trailer_youtube_embed: string | null;
  trailer_youtube_thumb: string | null;
  has_trailer: boolean;
  trailer_source: "rawg" | "youtube" | "none";
  // Game facts
  achievements_count: number;
  additions_count: number;
  game_series_count: number;
  reviews_count: number;
  added: number;
  added_by_status: Record<string, number> | null;
}

interface AIRecommendation {
  text: string;
  loading: boolean;
}

function MetacriticBadge({ score }: { score: number | null }) {
  if (!score) return (
    <div className="w-14 h-14 rounded-xl flex items-center justify-center text-sm font-bold text-slate-600 border border-slate-700"
      style={{ background: "rgba(30,30,50,0.6)" }}>tbd</div>
  );
  const color = score >= 75 ? "#66cc33" : score >= 50 ? "#ffcc33" : "#ff4444";
  const textColor = score >= 50 ? "#000" : "#fff";
  const label = score >= 75 ? "Positive" : score >= 50 ? "Mixed" : "Negative";
  return (
    <div className="flex flex-col items-center gap-1">
      <motion.div whileHover={{ scale: 1.08 }}
        className="w-14 h-14 rounded-xl flex items-center justify-center text-xl font-black border-2"
        style={{ background: color, borderColor: color, color: textColor, boxShadow: `0 0 20px ${color}60` }}>
        {score}
      </motion.div>
      <span className="text-xs text-slate-500">{label}</span>
    </div>
  );
}

function RatingBar({ title, percent, count }: { title: string; percent: number; count: number }) {
  const cfg: Record<string, { color: string; Icon: typeof ThumbsUp }> = {
    exceptional: { color: "#66cc33", Icon: ThumbsUp },
    recommended: { color: "#06b6d4", Icon: ThumbsUp },
    meh:         { color: "#f59e0b", Icon: Minus },
    skip:        { color: "#ef4444", Icon: ThumbsDown },
  };
  const { color, Icon } = cfg[title] || { color: "#64748b", Icon: Minus };
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-1.5 w-28 flex-shrink-0">
        <Icon className="w-3.5 h-3.5 flex-shrink-0" style={{ color }} />
        <span className="text-xs text-slate-400 capitalize">{title}</span>
      </div>
      <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
        <motion.div initial={{ width: 0 }} animate={{ width: `${percent}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="h-full rounded-full" style={{ background: color }} />
      </div>
      <span className="text-xs text-slate-500 w-10 text-right">{percent.toFixed(0)}%</span>
      <span className="text-xs text-slate-600 w-12 text-right">{count.toLocaleString()}</span>
    </div>
  );
}

export default function RAWGGameDetailClient({ slug }: { slug: string }) {
  const [game, setGame] = useState<GameDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeScreenshot, setActiveScreenshot] = useState(0);
  const [ai, setAi] = useState<AIRecommendation>({ text: "", loading: false });
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [trailerPlaying, setTrailerPlaying] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/rawg/game/${slug}`)
      .then((r) => { if (!r.ok) throw new Error("Game not found"); return r.json(); })
      .then((d) => { setGame(d); setLoading(false); })
      .catch((e) => { setError(e.message); setLoading(false); });
  }, [slug]);

  const askAI = async () => {
    if (!game) return;
    setAi({ text: "", loading: true });
    try {
      const res = await fetch("/api/ai/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `Write a concise review of "${game.title}" — a ${game.genre.join("/")} game${game.metacritic ? ` (Metacritic: ${game.metacritic})` : ""}. Cover: who should play it, what makes it unique, and one potential downside. Max 3 sentences.`,
        }),
      });
      const data = await res.json();
      setAi({ text: data.recommendation || "Could not get AI review.", loading: false });
    } catch {
      setAi({ text: "AI unavailable right now.", loading: false });
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-10 h-10 text-violet-400 animate-spin" />
        <p className="text-slate-500 text-sm">Loading game data...</p>
      </div>
    </div>
  );

  if (error || !game) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="text-4xl mb-4">🎮</p>
        <p className="text-slate-300 font-semibold mb-2">Game not found</p>
        <p className="text-slate-600 text-sm mb-6">{error}</p>
        <Link href="/explore">
          <button className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white"
            style={{ background: "linear-gradient(135deg, #7c3aed, #6d28d9)" }}>
            Back to Explore
          </button>
        </Link>
      </div>
    </div>
  );

  const desc = game.description_full || game.description || "";
  const shortDesc = desc.slice(0, 400);

  // Trailer thumbnail — prefer YouTube maxres, fallback to game image
  const trailerThumb = game.trailer_youtube_thumb || game.image;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

      {/* Back */}
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-6">
        <Link href="/explore"
          className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-200 transition-colors text-sm">
          <ChevronLeft className="w-4 h-4" />Back to Explore
        </Link>
      </motion.div>

      {/* ── TRAILER / HERO ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full rounded-2xl overflow-hidden mb-8 border border-white/[0.06]"
        style={{ aspectRatio: "16/9" }}
      >
        {!trailerPlaying ? (
          /* Poster */
          <>
            <img src={trailerThumb} alt={game.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0"
              style={{ background: "linear-gradient(to top, rgba(5,5,8,0.95) 0%, rgba(5,5,8,0.2) 60%, transparent 100%)" }} />

            {/* Play button */}
            {game.has_trailer && (
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setTrailerPlaying(true)}
                  className="flex flex-col items-center gap-3 group"
                >
                  <div className="w-20 h-20 rounded-full flex items-center justify-center border-2 border-white/30 group-hover:border-white/70 transition-all"
                    style={{ background: "rgba(124,58,237,0.75)", backdropFilter: "blur(12px)", boxShadow: "0 0 50px rgba(124,58,237,0.6)" }}>
                    <Play className="w-8 h-8 text-white ml-1" fill="white" />
                  </div>
                  <span className="text-white text-sm font-semibold bg-black/40 px-3 py-1 rounded-full backdrop-blur-sm">
                    Watch Trailer
                  </span>
                </motion.button>
              </div>
            )}

            {/* Source badge */}
            {game.has_trailer && (
              <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium"
                style={{ background: "rgba(0,0,0,0.65)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.1)",
                  color: game.trailer_source === "rawg" ? "#a78bfa" : "#f87171" }}>
                {game.trailer_source === "rawg" ? (
                  <><span className="w-1.5 h-1.5 rounded-full bg-violet-400" />Official Trailer</>
                ) : (
                  <><svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>YouTube Trailer</>
                )}
              </div>
            )}

            {/* Title + action buttons */}
            <div className="absolute bottom-6 left-6 right-6">
              <h1 className="text-3xl sm:text-5xl font-black text-white drop-shadow-2xl line-clamp-2 mb-4">{game.title}</h1>
              <div className="flex items-center gap-3 flex-wrap">
                <AddToLibraryButton
                  id={game.id}
                  title={game.title}
                  image={game.image}
                  rating={game.rating}
                  metacritic={game.metacritic}
                  genre={game.genre}
                  developer={game.developer}
                  releaseYear={game.releaseYear}
                />
                <AddToCollectionButton
                  id={game.id}
                  title={game.title}
                  image={game.image}
                  rating={game.rating}
                  metacritic={game.metacritic}
                  genre={game.genre}
                  developer={game.developer}
                  releaseYear={game.releaseYear}
                />
              </div>
            </div>
          </>
        ) : (
          /* Playing */
          <div className="relative w-full h-full bg-black">
            {game.trailer_source === "rawg" && game.trailer_mp4 ? (
              <video src={game.trailer_mp4} className="w-full h-full object-contain"
                controls autoPlay poster={game.image} />
            ) : game.trailer_youtube_embed ? (
              <iframe
                src={game.trailer_youtube_embed}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={`${game.title} trailer`}
              />
            ) : null}
            <button onClick={() => setTrailerPlaying(false)}
              className="absolute top-3 right-3 w-9 h-9 rounded-xl flex items-center justify-center text-white z-10 hover:bg-white/20 transition-all"
              style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)" }}>
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </motion.div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">

        {/* Left sidebar */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-1 flex flex-col gap-4"
        >

          {/* Cover */}
          <div className="relative rounded-2xl overflow-hidden border border-white/[0.07]" style={{ aspectRatio: "16/9" }}>
            <img src={game.image} alt={game.title} className="w-full h-full object-cover" />
          </div>

          {/* Scores */}
          <div className="p-4 rounded-2xl border border-white/[0.06] space-y-4"
            style={{ background: "rgba(13,13,20,0.8)", backdropFilter: "blur(16px)" }}>
            <div className="flex items-center justify-around">
              <div className="text-center">
                <MetacriticBadge score={game.metacritic} />
                <p className="text-xs text-slate-600 mt-1">Metacritic</p>
              </div>
              <div className="text-center">
                <div className="w-14 h-14 rounded-xl flex items-center justify-center text-xl font-black border-2 border-yellow-500/40"
                  style={{ background: "rgba(234,179,8,0.1)", color: "#fbbf24" }}>{game.rating}</div>
                <p className="text-xs text-slate-600 mt-1">Rating</p>
              </div>
              <div className="text-center">
                <div className="w-14 h-14 rounded-xl flex items-center justify-center text-xl font-black border-2 border-violet-500/40"
                  style={{ background: "rgba(124,58,237,0.1)", color: "#a78bfa" }}>{game.aiScore}</div>
                <p className="text-xs text-slate-600 mt-1">AI Score</p>
              </div>
            </div>

            {game.ratings_breakdown?.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-white/[0.06]">
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-3">
                  Player Reviews · {game.ratingsCount?.toLocaleString()}
                </p>
                {game.ratings_breakdown.map((r) => (
                  <RatingBar key={r.id} title={r.title} percent={r.percent} count={r.count} />
                ))}
              </div>
            )}
          </div>

          {/* Meta info */}
          <div className="p-4 rounded-2xl border border-white/[0.06] space-y-3"
            style={{ background: "rgba(13,13,20,0.8)", backdropFilter: "blur(16px)" }}>
            {[
              { icon: Building2, label: "Developer",    value: game.developer },
              { icon: Building2, label: "Publisher",    value: game.publisher },
              { icon: Calendar,  label: "Released",     value: game.releaseYear?.toString() || "—" },
              { icon: Clock,     label: "Avg Playtime", value: game.playtime },
              { icon: Users,     label: "Multiplayer",  value: game.multiplayer ? "Yes" : "Solo" },
              { icon: Trophy,    label: "ESRB",         value: game.esrb || "Not Rated" },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-start gap-3">
                <Icon className="w-4 h-4 text-slate-600 flex-shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <p className="text-xs text-slate-600">{label}</p>
                  <p className="text-sm text-slate-300 font-medium truncate">{value}</p>
                </div>
              </div>
            ))}
            {game.website && (
              <a href={game.website} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-violet-400 hover:text-violet-300 transition-colors pt-1">
                <Globe className="w-4 h-4" />Official Website
              </a>
            )}
          </div>

          {/* Game Facts — animated, fills remaining space */}
          <GameFacts
            achievements={game.achievements_count || 0}
            added={game.added || 0}
            seriesCount={game.game_series_count || 0}
            dlcCount={game.additions_count || 0}
            ratingsCount={game.ratingsCount || 0}
            playingNow={game.added_by_status?.playing ?? 0}
            beaten={game.added_by_status?.beaten ?? 0}
            toplay={game.added_by_status?.toplay ?? 0}
            dropped={game.added_by_status?.dropped ?? 0}
            playtime={game.playtime || "Unknown"}
          />
        </motion.div>

        {/* Right content */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="lg:col-span-2 space-y-5">

          {/* Description */}
          <div className="p-5 rounded-2xl border border-white/[0.06]"
            style={{ background: "rgba(13,13,20,0.8)", backdropFilter: "blur(16px)" }}>
            <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">About</h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              {showFullDesc ? desc : shortDesc}
              {desc.length > 400 && (
                <button onClick={() => setShowFullDesc(!showFullDesc)}
                  className="ml-2 text-violet-400 hover:text-violet-300 text-xs font-semibold transition-colors">
                  {showFullDesc ? "Show less" : "...Read more"}
                </button>
              )}
            </p>
          </div>

          {/* AI Review */}
          <div className="p-5 rounded-2xl border border-violet-500/20"
            style={{ background: "rgba(124,58,237,0.06)", backdropFilter: "blur(16px)" }}>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xs font-semibold text-violet-300 uppercase tracking-wider flex items-center gap-2">
                <Zap className="w-4 h-4" />AI Review
              </h2>
              {!ai.text && !ai.loading && (
                <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} onClick={askAI}
                  className="flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-semibold text-white"
                  style={{ background: "linear-gradient(135deg, #7c3aed, #6d28d9)", boxShadow: "0 0 16px rgba(124,58,237,0.3)" }}>
                  <MessageSquare className="w-3.5 h-3.5" />Ask GPT-4o
                </motion.button>
              )}
            </div>
            {ai.loading && (
              <div className="flex items-center gap-3 text-slate-400 text-sm">
                <Loader2 className="w-4 h-4 animate-spin text-violet-400" />
                GPT-4o is analyzing {game.title}...
              </div>
            )}
            {ai.text && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                <p className="text-slate-300 text-sm leading-relaxed">{ai.text}</p>
                <button onClick={askAI} className="mt-3 text-xs text-violet-400 hover:text-violet-300 transition-colors">
                  Regenerate ↺
                </button>
              </motion.div>
            )}
            {!ai.text && !ai.loading && (
              <p className="text-slate-600 text-sm">Click "Ask GPT-4o" to get an AI-powered review of this game.</p>
            )}
          </div>

          {/* Genres + Tags */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl border border-white/[0.06]" style={{ background: "rgba(13,13,20,0.8)" }}>
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-3">Genres</p>
              <div className="flex flex-wrap gap-2">
                {game.genre.map((g) => <span key={g} className="tag-chip">{g}</span>)}
              </div>
            </div>
            <div className="p-4 rounded-2xl border border-white/[0.06]" style={{ background: "rgba(13,13,20,0.8)" }}>
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-3 flex items-center gap-1">
                <Tag className="w-3 h-3" />Tags
              </p>
              <div className="flex flex-wrap gap-2">
                {game.tags.slice(0, 8).map((t) => (
                  <span key={t} className="px-2.5 py-1 rounded-full text-xs border border-slate-800 text-slate-500"
                    style={{ background: "rgba(13,13,20,0.6)" }}>#{t}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Platforms */}
          <div className="p-4 rounded-2xl border border-white/[0.06]" style={{ background: "rgba(13,13,20,0.8)" }}>
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-3">Platforms</p>
            <div className="flex flex-wrap gap-2">
              {game.platform.map((p) => (
                <span key={p} className="px-3 py-1 rounded-full text-xs border border-cyan-500/20 text-cyan-400"
                  style={{ background: "rgba(6,182,212,0.08)" }}>{p}</span>
              ))}
            </div>
          </div>

          {/* Where to Buy */}
          <PlatformStores
            slug={game.id}
            gameName={game.title}
            platforms={game.platform}
          />

          {/* Price Comparison */}
          <PriceComparison
            gameName={game.title}
            slug={game.id}
          />
        </motion.div>
      </div>

      {/* Screenshots */}
      {game.screenshots?.length > 0 && (
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mb-10">
          <h2 className="text-xl font-bold text-slate-100 mb-4 flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-violet-400" />
            Screenshots
            <span className="text-sm text-slate-600 font-normal">({game.screenshots.length})</span>
          </h2>
          <div className="relative rounded-2xl overflow-hidden border border-white/[0.06] mb-3" style={{ aspectRatio: "16/9" }}>
            <AnimatePresence mode="wait">
              <motion.img key={activeScreenshot} src={game.screenshots[activeScreenshot]}
                alt={`Screenshot ${activeScreenshot + 1}`} className="w-full h-full object-cover"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} />
            </AnimatePresence>
            {game.screenshots.length > 1 && (
              <>
                <button onClick={() => setActiveScreenshot((p) => (p - 1 + game.screenshots.length) % game.screenshots.length)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-xl flex items-center justify-center text-white border border-white/20 hover:bg-white/20 transition-all"
                  style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)" }}>
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button onClick={() => setActiveScreenshot((p) => (p + 1) % game.screenshots.length)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-xl flex items-center justify-center text-white border border-white/20 hover:bg-white/20 transition-all"
                  style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)" }}>
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}
            <div className="absolute bottom-3 right-3 px-2 py-1 rounded-lg text-xs text-white"
              style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)" }}>
              {activeScreenshot + 1} / {game.screenshots.length}
            </div>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {game.screenshots.map((src, i) => (
              <button key={i} onClick={() => setActiveScreenshot(i)}
                className={`flex-shrink-0 w-28 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                  i === activeScreenshot ? "border-violet-500 opacity-100" : "border-transparent opacity-50 hover:opacity-80"
                }`}>
                <img src={src} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </motion.section>
      )}
    </div>
  );
}
