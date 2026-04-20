"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Star, Clock, Users, Zap } from "lucide-react";
import { GameCardSkeleton } from "@/components/GameCard";
import { cardEntry, staggerContainer, viewportOnce } from "@/lib/animations";

interface RAWGGameCard {
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
}

function LiveGameCard({ game, index }: { game: RAWGGameCard; index: number }) {
  const metacriticColor = game.metacritic
    ? game.metacritic >= 75 ? "#66cc33"
    : game.metacritic >= 50 ? "#ffcc33"
    : "#ff4444"
    : null;

  return (
    <motion.div
      variants={cardEntry}
      whileHover={{ y: -10, scale: 1.02, transition: { duration: 0.25 } }}
      className="group relative"
    >
      <Link href={`/game/rawg/${game.id}`}>
        <div
          className="relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 border border-white/[0.07] hover:border-violet-500/40"
          style={{
            background: "rgba(13,13,20,0.85)",
            backdropFilter: "blur(16px)",
            boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
          }}
        >
          {/* Hover glow */}
          <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
            style={{ boxShadow: "inset 0 0 40px rgba(124,58,237,0.06), 0 0 40px rgba(124,58,237,0.1)" }} />

          {/* Cover image */}
          <div className="relative h-48 overflow-hidden bg-slate-900">
            <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d14] via-[#0d0d14]/10 to-transparent z-10" />
            <motion.img
              src={game.image}
              alt={game.title}
              className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
              onError={(e) => { (e.target as HTMLImageElement).style.opacity = "0"; }}
            />

            {/* Metacritic badge */}
            {game.metacritic && metacriticColor && (
              <div
                className="absolute top-3 left-3 z-20 w-9 h-9 rounded-lg flex items-center justify-center text-xs font-black border-2"
                style={{
                  background: metacriticColor,
                  borderColor: metacriticColor,
                  color: game.metacritic >= 50 ? "#000" : "#fff",
                  boxShadow: `0 0 10px ${metacriticColor}80`,
                }}
              >
                {game.metacritic}
              </div>
            )}

            {/* AI Score */}
            <div
              className="absolute top-3 right-3 z-20 px-2 py-1 rounded-full text-xs font-bold text-white"
              style={{
                background: "rgba(124,58,237,0.85)",
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(167,139,250,0.3)",
              }}
            >
              AI {game.aiScore}
            </div>

            {/* Star rating */}
            <div className="absolute bottom-3 left-3 z-20 flex items-center gap-1 text-yellow-400 text-sm font-bold">
              <Star className="w-3.5 h-3.5 fill-yellow-400" />
              {game.rating}
            </div>
          </div>

          {/* Content */}
          <div className="p-4">
            <h3 className="font-bold text-slate-100 text-sm mb-1 group-hover:text-violet-300 transition-colors line-clamp-1">
              {game.title}
            </h3>
            <p className="text-slate-600 text-xs mb-3">{game.developer} · {game.releaseYear}</p>

            <div className="flex items-center justify-between text-xs text-slate-600 mb-3">
              <div className="flex items-center gap-1.5">
                <Clock className="w-3 h-3" />
                {game.playtime}
              </div>
              {game.multiplayer && (
                <div className="flex items-center gap-1.5 text-cyan-500">
                  <Users className="w-3 h-3" />
                  Multi
                </div>
              )}
            </div>

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

export default function TrendingSection() {
  const [games, setGames] = useState<RAWGGameCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState<"rawg" | "local">("local");

  useEffect(() => {
    // Try RAWG first
    fetch("/api/rawg/trending")
      .then((r) => {
        if (!r.ok) throw new Error("RAWG not available");
        return r.json();
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setGames(data.slice(0, 8));
          setSource("rawg");
        } else {
          throw new Error("Empty response");
        }
        setLoading(false);
      })
      .catch(() => {
        // Fallback to local JSON
        fetch("/api/games?trending=true")
          .then((r) => r.json())
          .then((data) => {
            setGames(data);
            setSource("local");
            setLoading(false);
          })
          .catch(() => setLoading(false));
      });
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => <GameCardSkeleton key={i} />)}
      </div>
    );
  }

  return (
    <div>
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        {source === "rawg"
          ? games.map((game, i) => <LiveGameCard key={game.id} game={game} index={i} />)
          : games.map((game, i) => {
              const { default: GameCard } = require("@/components/GameCard");
              return <GameCard key={(game as any).id} game={game} index={i} />;
            })
        }
      </motion.div>
    </div>
  );
}
