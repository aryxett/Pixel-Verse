"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Star, Clock, Users, Calendar, Building2,
  ChevronLeft, Zap, Tag, ExternalLink, ImageIcon,
} from "lucide-react";
import GameCard from "@/components/GameCard";
import MetacriticBadge, { MetacriticBar } from "@/components/MetacriticBadge";
import type { Game } from "@/lib/games";
import { STEAM_APP_IDS, getSteamHeaderImage, getSteamLibraryCover } from "@/lib/steam";

interface SteamData {
  header_image: string;
  library_image: string;
  screenshots?: string[];
  metacritic?: { score: number; url: string };
  price?: string | null;
  recommendations?: number;
  store_url: string;
  trailer?: string | null;
  fallback?: boolean;
}

interface Props {
  game: Game;
  related: Game[];
}

export default function GameDetailClient({ game, related }: Props) {
  const [steamData, setSteamData] = useState<SteamData | null>(null);
  const [activeScreenshot, setActiveScreenshot] = useState(0);
  const appId = STEAM_APP_IDS[game.id];

  useEffect(() => {
    if (!appId) return;
    // Use CDN images directly — no API call needed for images
    setSteamData({
      header_image: getSteamHeaderImage(appId),
      library_image: getSteamLibraryCover(appId),
      store_url: `https://store.steampowered.com/app/${appId}`,
    });

    // Fetch full data in background
    fetch(`/api/steam/${appId}`)
      .then((r) => r.json())
      .then((d) => setSteamData(d))
      .catch(() => {});
  }, [appId]);

  const coverImage = steamData?.library_image || steamData?.header_image || game.image;
  const screenshots = steamData?.screenshots || [];
  const metacriticScore = steamData?.metacritic?.score || null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

      {/* Back */}
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-8">
        <Link href="/explore"
          className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-200 transition-colors text-sm">
          <ChevronLeft className="w-4 h-4" />
          Back to Explore
        </Link>
      </motion.div>

      {/* Hero banner */}
      {(steamData?.header_image || game.image) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative w-full h-48 sm:h-64 rounded-2xl overflow-hidden mb-8 border border-white/[0.06]"
          suppressHydrationWarning
        >
          <img
            src={steamData?.header_image || game.image}
            alt={game.title}
            className="w-full h-full object-cover"
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
          <div className="absolute inset-0"
            style={{ background: "linear-gradient(to right, rgba(5,5,8,0.8) 0%, transparent 50%, rgba(5,5,8,0.4) 100%)" }} />
          <div className="absolute inset-0"
            style={{ background: "linear-gradient(to top, rgba(5,5,8,1) 0%, transparent 60%)" }} />
        </motion.div>
      )}

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">

        {/* Cover */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="lg:col-span-1"
        >
          <div
            className="relative rounded-2xl overflow-hidden border border-white/[0.07]"
            style={{ aspectRatio: "2/3", backgroundColor: game.coverColor, maxWidth: 280, margin: "0 auto" }}
            suppressHydrationWarning
          >
            <img
              src={coverImage}
              alt={game.title}
              className="w-full h-full object-cover"
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
            {game.trending && (
              <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold text-white"
                style={{ background: "linear-gradient(135deg, #f97316, #ef4444)", boxShadow: "0 0 12px rgba(249,115,22,0.5)" }}>
                <Zap className="w-3 h-3" /> Trending
              </div>
            )}
          </div>

          {/* Steam link */}
          {steamData?.store_url && (
            <a href={steamData.store_url} target="_blank" rel="noopener noreferrer"
              className="mt-3 flex items-center justify-center gap-2 w-full max-w-[280px] mx-auto py-2.5 rounded-xl text-sm font-semibold text-slate-300 border border-slate-700 hover:border-slate-500 transition-all"
              style={{ background: "rgba(13,13,20,0.8)" }}>
              <ExternalLink className="w-4 h-4" />
              View on Steam
            </a>
          )}
        </motion.div>

        {/* Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="lg:col-span-2 space-y-5"
        >
          {/* Title + scores */}
          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-100 mb-3">{game.title}</h1>
            <div className="flex flex-wrap items-center gap-3">
              {/* Star rating */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-yellow-500/20"
                style={{ background: "rgba(234,179,8,0.08)" }}>
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span className="text-yellow-300 font-bold">{game.rating}</span>
                <span className="text-slate-600 text-sm">/ 10</span>
              </div>
              {/* AI Score */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-violet-500/20"
                style={{ background: "rgba(124,58,237,0.08)" }}>
                <Zap className="w-4 h-4 text-violet-400" />
                <span className="text-violet-300 font-bold">{game.aiScore}</span>
                <span className="text-slate-600 text-sm">AI Score</span>
              </div>
              {/* Metacritic */}
              {metacriticScore && (
                <div className="flex items-center gap-2">
                  <MetacriticBadge score={metacriticScore} size="sm" />
                  <span className="text-slate-500 text-sm">Metacritic</span>
                </div>
              )}
              {/* Price */}
              {steamData?.price && (
                <div className="px-3 py-1.5 rounded-xl border border-emerald-500/20 text-emerald-300 font-bold text-sm"
                  style={{ background: "rgba(16,185,129,0.08)" }}>
                  {steamData.price}
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <p className="text-slate-400 leading-relaxed text-sm">{game.description}</p>

          {/* Metacritic bar */}
          {metacriticScore && (
            <div className="p-4 rounded-xl border border-white/[0.06]"
              style={{ background: "rgba(13,13,20,0.7)" }}>
              <p className="text-xs text-slate-500 font-semibold mb-3 uppercase tracking-wider">Review Score</p>
              <MetacriticBar score={metacriticScore} />
            </div>
          )}

          {/* Meta grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { icon: Building2, label: "Developer", value: game.developer },
              { icon: Calendar,  label: "Released",  value: game.releaseYear.toString() },
              { icon: Clock,     label: "Playtime",  value: game.playtime },
              { icon: Users,     label: "Multiplayer", value: game.multiplayer ? "Yes" : "Solo" },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="p-3 rounded-xl border border-white/[0.06] text-center"
                style={{ background: "rgba(13,13,20,0.7)" }}>
                <Icon className="w-4 h-4 text-slate-600 mx-auto mb-1" />
                <p className="text-xs text-slate-600 mb-0.5">{label}</p>
                <p className="text-sm font-semibold text-slate-200 truncate">{value}</p>
              </div>
            ))}
          </div>

          {/* Genres */}
          <div>
            <p className="text-xs text-slate-600 mb-2 font-semibold uppercase tracking-wider">Genres</p>
            <div className="flex flex-wrap gap-2">
              {game.genre.map((g) => (
                <span key={g} className="tag-chip">{g}</span>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div>
            <p className="text-xs text-slate-600 mb-2 font-semibold uppercase tracking-wider flex items-center gap-1">
              <Tag className="w-3 h-3" /> Tags
            </p>
            <div className="flex flex-wrap gap-2">
              {game.tags.map((tag) => (
                <span key={tag} className="px-2.5 py-1 rounded-full text-xs border border-slate-800 text-slate-500"
                  style={{ background: "rgba(13,13,20,0.6)" }}>
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Platforms */}
          <div>
            <p className="text-xs text-slate-600 mb-2 font-semibold uppercase tracking-wider">Platforms</p>
            <div className="flex flex-wrap gap-2">
              {game.platform.map((p) => (
                <span key={p} className="px-3 py-1 rounded-full text-xs border border-cyan-500/20 text-cyan-400"
                  style={{ background: "rgba(6,182,212,0.08)" }}>
                  {p}
                </span>
              ))}
            </div>
          </div>

          {/* Moods */}
          <div>
            <p className="text-xs text-slate-600 mb-2 font-semibold uppercase tracking-wider">Best for moods</p>
            <div className="flex flex-wrap gap-2">
              {game.mood.map((m) => (
                <span key={m} className="px-3 py-1 rounded-full text-xs border border-pink-500/20 text-pink-400 capitalize"
                  style={{ background: "rgba(236,72,153,0.08)" }}>
                  {m}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Screenshots from Steam */}
      {screenshots.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-12"
        >
          <h2 className="text-xl font-bold text-slate-100 mb-4 flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-violet-400" />
            Screenshots
          </h2>

          {/* Main screenshot */}
          <div className="relative rounded-2xl overflow-hidden border border-white/[0.06] mb-3"
            style={{ aspectRatio: "16/9" }}>
            <img
              src={screenshots[activeScreenshot]}
              alt={`Screenshot ${activeScreenshot + 1}`}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Thumbnails */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {screenshots.map((src, i) => (
              <button
                key={i}
                onClick={() => setActiveScreenshot(i)}
                className={`flex-shrink-0 w-24 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                  i === activeScreenshot ? "border-violet-500" : "border-transparent opacity-60 hover:opacity-100"
                }`}
              >
                <img src={src} alt={`Thumb ${i + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </motion.section>
      )}

      {/* Related games */}
      {related.length > 0 && (
        <section>
          <h2 className="text-xl font-bold text-slate-100 mb-6">You Might Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {related.map((g, i) => (
              <GameCard key={g.id} game={g} index={i} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
