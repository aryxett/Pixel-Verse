"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Star, Clock, Users, Zap } from "lucide-react";
import { clsx } from "clsx";
import type { Game } from "@/lib/games";
import { cardEntry, viewportOnce } from "@/lib/animations";

interface GameCardProps {
  game: Game;
  index?: number;
  variant?: "default" | "compact" | "featured";
}

export default function GameCard({ game, index = 0, variant = "default" }: GameCardProps) {
  if (variant === "compact") return <CompactCard game={game} index={index} />;
  if (variant === "featured") return <FeaturedCard game={game} />;
  return <DefaultCard game={game} index={index} />;
}

function DefaultCard({ game, index }: { game: Game; index: number }) {
  return (
    <motion.div
      variants={cardEntry}
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
      whileHover={{ y: -10, scale: 1.02, transition: { duration: 0.25 } }}
      className="group relative"
    >
      <Link href={`/game/${game.id}`}>
        <div className="relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 border border-white/[0.07] hover:border-violet-500/40"
          style={{
            background: "rgba(13,13,20,0.8)",
            backdropFilter: "blur(16px)",
            boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
          }}
        >
          {/* Hover glow */}
          <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
            style={{ boxShadow: "inset 0 0 40px rgba(124,58,237,0.08), 0 0 40px rgba(124,58,237,0.12)" }} />

          {/* Cover */}
          <div className="relative h-52 overflow-hidden" style={{ backgroundColor: game.coverColor }} suppressHydrationWarning>
            <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d14] via-[#0d0d14]/20 to-transparent z-10" />
            <motion.img
              src={game.image}
              alt={game.title}
              className="w-full h-full object-cover opacity-75 group-hover:opacity-95 group-hover:scale-110 transition-all duration-700"
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
            />

            {/* Badges */}
            {game.trending && (
              <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold text-white"
                style={{ background: "linear-gradient(135deg, #f97316, #ef4444)", boxShadow: "0 0 12px rgba(249,115,22,0.5)" }}>
                <Zap className="w-3 h-3" /> Trending
              </div>
            )}
            <div className="absolute top-3 right-3 z-20 px-2.5 py-1 rounded-full text-xs font-bold text-white"
              style={{ background: "rgba(124,58,237,0.85)", backdropFilter: "blur(8px)", border: "1px solid rgba(167,139,250,0.3)" }}>
              AI {game.aiScore}
            </div>

            {/* Rating */}
            <div className="absolute bottom-3 left-3 z-20 flex items-center gap-1 text-yellow-400 text-sm font-bold">
              <Star className="w-3.5 h-3.5 fill-yellow-400" />
              {game.rating}
            </div>
          </div>

          {/* Content */}
          <div className="p-4">
            <h3 className="font-bold text-slate-100 text-base mb-1.5 group-hover:text-violet-300 transition-colors line-clamp-1">
              {game.title}
            </h3>
            <p className="text-slate-500 text-xs mb-3 line-clamp-2 leading-relaxed">{game.description}</p>

            {/* Meta */}
            <div className="flex items-center justify-between text-xs text-slate-600 mb-3">
              <div className="flex items-center gap-1.5">
                <Clock className="w-3 h-3" />
                {game.playtime}
              </div>
              {game.multiplayer && (
                <div className="flex items-center gap-1.5 text-cyan-500">
                  <Users className="w-3 h-3" />
                  Multiplayer
                </div>
              )}
            </div>

            {/* Genre tags */}
            <div className="flex flex-wrap gap-1.5">
              {game.genre.slice(0, 2).map((g) => (
                <span key={g} className="tag-chip">{g}</span>
              ))}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function CompactCard({ game, index }: { game: Game; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
      whileHover={{ x: 4 }}
    >
      <Link href={`/game/${game.id}`}>
        <div className="flex items-center gap-3 p-3 rounded-xl border border-white/[0.06] hover:border-violet-500/30 transition-all cursor-pointer group"
          style={{ background: "rgba(13,13,20,0.7)", backdropFilter: "blur(12px)" }}>
          <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 border border-white/[0.06]"
            style={{ backgroundColor: game.coverColor }} suppressHydrationWarning>
            <img src={game.image} alt={game.title} className="w-full h-full object-cover"
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm text-slate-200 group-hover:text-violet-300 transition-colors truncate">{game.title}</p>
            <p className="text-xs text-slate-600 truncate">{game.genre.slice(0, 2).join(" · ")}</p>
          </div>
          <div className="flex items-center gap-1 text-yellow-400 text-xs font-bold flex-shrink-0">
            <Star className="w-3 h-3 fill-yellow-400" />
            {game.rating}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function FeaturedCard({ game }: { game: Game }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      className="group relative"
    >
      <Link href={`/game/${game.id}`}>
        <div className="relative h-80 rounded-2xl overflow-hidden cursor-pointer border border-white/[0.07] hover:border-violet-500/40 transition-all"
          style={{ backgroundColor: game.coverColor }} suppressHydrationWarning>
          <img src={game.image} alt={game.title}
            className="w-full h-full object-cover opacity-55 group-hover:opacity-75 group-hover:scale-105 transition-all duration-700"
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="flex items-center gap-2 mb-2">
              {game.trending && (
                <span className="px-2.5 py-1 rounded-full text-xs font-bold text-white"
                  style={{ background: "linear-gradient(135deg, #f97316, #ef4444)" }}>🔥 Trending</span>
              )}
              <span className="px-2.5 py-1 rounded-full text-xs font-bold text-white"
                style={{ background: "rgba(124,58,237,0.85)", border: "1px solid rgba(167,139,250,0.3)" }}>
                AI {game.aiScore}
              </span>
            </div>
            <h3 className="text-2xl font-black text-white mb-1">{game.title}</h3>
            <p className="text-slate-300 text-sm line-clamp-2 mb-3">{game.description}</p>
            <div className="flex items-center gap-4 text-sm">
              <span className="flex items-center gap-1 text-yellow-400 font-bold">
                <Star className="w-4 h-4 fill-yellow-400" />{game.rating}
              </span>
              <span className="text-slate-400">{game.developer}</span>
              <span className="text-slate-500">{game.releaseYear}</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export function GameCardSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden border border-white/[0.05] animate-pulse"
      style={{ background: "rgba(13,13,20,0.8)" }}>
      <div className="h-52 bg-slate-800/60" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-slate-800 rounded-lg w-3/4" />
        <div className="h-3 bg-slate-800 rounded-lg w-full" />
        <div className="h-3 bg-slate-800 rounded-lg w-2/3" />
        <div className="flex gap-2 mt-2">
          <div className="h-5 w-16 bg-slate-800 rounded-full" />
          <div className="h-5 w-16 bg-slate-800 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function MoodBadge({ mood, active, onClick }: {
  mood: { id: string; label: string; emoji: string; color: string };
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={clsx(
        "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-all",
        active
          ? "border-violet-500/60 bg-violet-600/20 text-violet-200 shadow-[0_0_15px_rgba(124,58,237,0.25)]"
          : "border-slate-800 bg-slate-900/50 text-slate-500 hover:border-slate-600 hover:text-slate-300"
      )}
    >
      <span>{mood.emoji}</span>
      <span>{mood.label}</span>
    </motion.button>
  );
}
