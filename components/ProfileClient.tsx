"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User, Sparkles, Loader2, ChevronRight,
  Trophy, Gamepad2, Clock, RefreshCw,
} from "lucide-react";
import { PlaystyleStats } from "@/components/StatsBar";
import GameCard from "@/components/GameCard";
import { getAllGames } from "@/lib/games";
import type { Game } from "@/lib/games";

interface GamerProfile {
  archetype: string;
  description: string;
  strengths: string[];
  recommendations: string[];
  playstyleScore: Record<string, number>;
}

const PLAY_STYLES = [
  { id: "casual", label: "Casual", emoji: "😊" },
  { id: "hardcore", label: "Hardcore", emoji: "💀" },
  { id: "competitive", label: "Competitive", emoji: "🏆" },
  { id: "story-driven", label: "Story-Driven", emoji: "📖" },
  { id: "creative", label: "Creative", emoji: "🎨" },
];

const ALL_GAMES = getAllGames();

const ARCHETYPE_COLORS: Record<string, string> = {
  strategist: "from-blue-500 to-indigo-600",
  explorer: "from-emerald-500 to-teal-600",
  competitor: "from-red-500 to-orange-600",
  creator: "from-cyan-500 to-blue-600",
  storyteller: "from-purple-500 to-pink-600",
  default: "from-violet-500 to-purple-600",
};

function getArchetypeGradient(archetype: string): string {
  const lower = archetype.toLowerCase();
  for (const [key, val] of Object.entries(ARCHETYPE_COLORS)) {
    if (lower.includes(key)) return val;
  }
  return ARCHETYPE_COLORS.default;
}

export default function ProfileClient() {
  const [step, setStep] = useState<"form" | "loading" | "result">("form");
  const [username, setUsername] = useState("");
  const [selectedGames, setSelectedGames] = useState<string[]>([]);
  const [playStyle, setPlayStyle] = useState("casual");
  const [hoursPerWeek, setHoursPerWeek] = useState(10);
  const [profile, setProfile] = useState<GamerProfile | null>(null);
  const [offline, setOffline] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("pixelverse_profile");
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setProfile(data.profile);
        setUsername(data.username || "");
        setStep("result");
      } catch { /* ignore */ }
    }
  }, []);

  const toggleGame = (title: string) => {
    setSelectedGames((prev) =>
      prev.includes(title) ? prev.filter((g) => g !== title) : [...prev, title]
    );
  };

  const generateProfile = async () => {
    if (selectedGames.length === 0) { setError("Select at least one game"); return; }
    setError(null);
    setStep("loading");
    try {
      const res = await fetch("/api/ai/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ favoriteGames: selectedGames, playStyle, hoursPerWeek }),
      });
      const data = await res.json();
      setProfile(data.profile);
      setOffline(data.offline || false);
      localStorage.setItem("pixelverse_profile", JSON.stringify({ profile: data.profile, username }));
      setStep("result");
    } catch {
      setError("Failed to generate profile. Please try again.");
      setStep("form");
    }
  };

  const resetProfile = () => {
    localStorage.removeItem("pixelverse_profile");
    setProfile(null);
    setSelectedGames([]);
    setStep("form");
  };

  const recommendedGames: Game[] = profile
    ? ALL_GAMES.filter((g) =>
        profile.recommendations.some((r) =>
          g.title.toLowerCase().includes(r.toLowerCase())
        )
      ).slice(0, 3)
    : [];

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center">
            <User className="w-5 h-5 text-violet-400" />
          </div>
          <h1 className="text-4xl font-black text-slate-100">
            Gamer <span className="gradient-text">Profile</span>
          </h1>
        </div>
        <p className="text-slate-400">Let AI analyze your gaming taste and generate your unique gamer archetype.</p>
      </motion.div>

      <AnimatePresence mode="wait">
        {/* FORM */}
        {step === "form" && (
          <motion.div key="form" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8">
            {/* Username */}
            <div className="glass-card rounded-2xl p-6">
              <label className="block text-sm font-semibold text-slate-300 mb-3">Your Gamer Tag (optional)</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. DarkSoulsFan99"
                className="w-full px-4 py-3 rounded-xl bg-slate-800/60 border border-slate-700/50 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-violet-500/50 transition-colors"
              />
            </div>

            {/* Favorite games */}
            <div className="glass-card rounded-2xl p-6">
              <label className="block text-sm font-semibold text-slate-300 mb-1">Favorite Games</label>
              <p className="text-xs text-slate-500 mb-4">Select all that apply ({selectedGames.length} selected)</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {ALL_GAMES.map((game) => {
                  const selected = selectedGames.includes(game.title);
                  return (
                    <motion.button
                      key={game.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => toggleGame(game.title)}
                      className={`flex items-center gap-2 p-3 rounded-xl border text-left transition-all ${
                        selected
                          ? "border-violet-500 bg-violet-600/20 text-violet-200"
                          : "border-slate-700 bg-slate-800/40 text-slate-400 hover:border-slate-500"
                      }`}
                    >
                      <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0" style={{ backgroundColor: game.coverColor }} suppressHydrationWarning>
                        <img src={game.image} alt={game.title} className="w-full h-full object-cover"
                          onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                      </div>
                      <span className="text-xs font-medium line-clamp-2">{game.title}</span>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Play style */}
            <div className="glass-card rounded-2xl p-6">
              <label className="block text-sm font-semibold text-slate-300 mb-4">Play Style</label>
              <div className="flex flex-wrap gap-3">
                {PLAY_STYLES.map((style) => (
                  <button
                    key={style.id}
                    onClick={() => setPlayStyle(style.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm transition-all ${
                      playStyle === style.id
                        ? "border-violet-500 bg-violet-600/20 text-violet-200"
                        : "border-slate-700 text-slate-400 hover:border-slate-500"
                    }`}
                  >
                    <span>{style.emoji}</span>{style.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Hours per week */}
            <div className="glass-card rounded-2xl p-6">
              <label className="block text-sm font-semibold text-slate-300 mb-1">Hours per Week</label>
              <p className="text-xs text-slate-500 mb-4">{hoursPerWeek} hours/week</p>
              <input type="range" min={1} max={60} value={hoursPerWeek}
                onChange={(e) => setHoursPerWeek(Number(e.target.value))}
                className="w-full accent-violet-500" />
              <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>1h (Casual)</span><span>30h (Regular)</span><span>60h (Hardcore)</span>
              </div>
            </div>

            {error && <p className="text-red-400 text-sm text-center">{error}</p>}

            <motion.button
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              onClick={generateProfile}
              className="w-full flex items-center justify-center gap-3 py-4 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-base transition-colors glow-purple"
            >
              <Sparkles className="w-5 h-5" />
              Generate My Gamer Profile
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          </motion.div>
        )}

        {/* LOADING */}
        {step === "loading" && (
          <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-32 gap-6">
            <Loader2 className="w-12 h-12 text-violet-400 animate-spin" />
            <div className="text-center">
              <p className="text-slate-200 font-semibold text-lg mb-1">Analyzing your gaming DNA...</p>
              <p className="text-slate-500 text-sm">The AI is crafting your unique gamer archetype</p>
            </div>
          </motion.div>
        )}

        {/* RESULT */}
        {step === "result" && profile && (
          <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-8">
            {offline && (
              <div className="p-3 rounded-xl bg-amber-900/20 border border-amber-700/30 text-amber-300 text-sm text-center">
                ⚠️ Showing demo profile. Check your GitHub token for AI-generated results.
              </div>
            )}

            {/* Archetype card */}
            <div className={`relative overflow-hidden rounded-2xl p-8 bg-gradient-to-br ${getArchetypeGradient(profile.archetype)}`}>
              <div className="absolute inset-0 opacity-10 grid-pattern" />
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    {username && <p className="text-white/70 text-sm mb-1">@{username}</p>}
                    <h2 className="text-3xl font-black text-white mb-2">{profile.archetype}</h2>
                    <p className="text-white/80 leading-relaxed max-w-lg">{profile.description}</p>
                  </div>
                  <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center flex-shrink-0">
                    <Gamepad2 className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mt-4">
                  {profile.strengths.map((s) => (
                    <span key={s} className="flex items-center gap-1 px-3 py-1 rounded-full bg-white/20 text-white text-sm font-medium">
                      <Trophy className="w-3 h-3" />{s}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Playstyle stats */}
            <div className="glass-card rounded-2xl p-6">
              <h3 className="font-bold text-slate-200 mb-5 flex items-center gap-2">
                <Clock className="w-4 h-4 text-violet-400" />Playstyle Breakdown
              </h3>
              <PlaystyleStats scores={profile.playstyleScore} />
            </div>

            {/* Recommended games */}
            {recommendedGames.length > 0 && (
              <div>
                <h3 className="font-bold text-slate-200 mb-4 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-violet-400" />AI Picks For You
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {recommendedGames.map((g, i) => (
                    <GameCard key={g.id} game={g} index={i} variant="compact" />
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-4">
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={resetProfile}
                className="flex items-center gap-2 px-6 py-3 rounded-xl border border-slate-700 text-slate-400 hover:border-slate-500 hover:text-slate-200 transition-colors">
                <RefreshCw className="w-4 h-4" />Start Over
              </motion.button>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={generateProfile}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-violet-600/20 border border-violet-500/30 text-violet-300 hover:bg-violet-600/30 transition-colors">
                <Sparkles className="w-4 h-4" />Regenerate
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
