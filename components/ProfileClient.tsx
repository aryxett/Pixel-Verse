"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User, Sparkles, Loader2, ChevronRight,
  Trophy, Gamepad2, Clock, RefreshCw,
  MapPin, Calendar, Star, Zap, Heart,
} from "lucide-react";
import { useSession } from "next-auth/react";
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
  { id: "casual",       label: "Casual",       emoji: "😊", desc: "Relaxed, fun sessions" },
  { id: "hardcore",     label: "Hardcore",     emoji: "💀", desc: "Max difficulty, no mercy" },
  { id: "competitive",  label: "Competitive",  emoji: "🏆", desc: "Ranked, tournaments" },
  { id: "story-driven", label: "Story-Driven", emoji: "📖", desc: "Narrative & lore first" },
  { id: "creative",     label: "Creative",     emoji: "🎨", desc: "Building & sandbox" },
  { id: "speedrunner",  label: "Speedrunner",  emoji: "⚡", desc: "Fastest completion" },
  { id: "explorer",     label: "Explorer",     emoji: "🗺️", desc: "Open world, 100%" },
  { id: "social",       label: "Social",       emoji: "👥", desc: "Co-op & multiplayer" },
];

const PLATFORMS = [
  { id: "pc",      label: "PC",        emoji: "🖥️" },
  { id: "ps5",     label: "PS5",       emoji: "🎮" },
  { id: "xbox",    label: "Xbox",      emoji: "🟢" },
  { id: "switch",  label: "Switch",    emoji: "🕹️" },
  { id: "mobile",  label: "Mobile",    emoji: "📱" },
];

const ARCHETYPE_COLORS: Record<string, string> = {
  strategist:  "from-blue-500 to-indigo-600",
  explorer:    "from-emerald-500 to-teal-600",
  competitor:  "from-red-500 to-orange-600",
  creator:     "from-cyan-500 to-blue-600",
  storyteller: "from-purple-500 to-pink-600",
  default:     "from-violet-500 to-purple-600",
};

function getArchetypeGradient(a: string) {
  const l = a.toLowerCase();
  for (const [k, v] of Object.entries(ARCHETYPE_COLORS)) if (l.includes(k)) return v;
  return ARCHETYPE_COLORS.default;
}

const ALL_GAMES = getAllGames();

// Extended game list with correct RAWG image URLs
const EXTRA_GAMES = [
  { id: "god-of-war",          title: "God of War",              image: "https://media.rawg.io/media/games/4be/4be6a6ad0364751a96229c56bf69be73.jpg" },
  { id: "red-dead-2",          title: "Red Dead Redemption 2",   image: "https://media.rawg.io/media/games/511/5118aff5091cb3efec399c808f8c598f.jpg" },
  { id: "gta5",                title: "GTA V",                   image: "https://media.rawg.io/media/games/456/456dea5e1c7e3cd07060c14e96612001.jpg" },
  { id: "dark-souls-3",        title: "Dark Souls III",          image: "https://media.rawg.io/media/games/da1/da1b267764d77221f07a4386b6548e5a.jpg" },
  { id: "the-last-of-us",      title: "The Last of Us",          image: "https://media.rawg.io/media/games/a5a/a5abaa1b5cc1567b026354f4a1bfac4d.jpg" },
  { id: "overwatch-2",         title: "Overwatch 2",             image: "https://media.rawg.io/media/games/3ea/3ea3c9bbd940b6cb7f2139e42d3d443f.jpg" },
  { id: "league-of-legends",   title: "League of Legends",       image: "https://media.rawg.io/media/games/78b/78bc81e247fc7e77af700cbd632a9297.jpg" },
  { id: "monster-hunter-world",title: "Monster Hunter: World",   image: "https://media.rawg.io/media/games/7cf/7cfc9220b401b7a300e409e539c9afd5.jpg" },
  { id: "fortnite",            title: "Fortnite",                image: "https://media.rawg.io/media/games/b7d/b7d3f1715fa8381a4e780173a197a615.jpg" },
  { id: "destiny-2",           title: "Destiny 2",               image: "https://media.rawg.io/media/games/34b/34b1de1b9f3e4e4e4e4e4e4e4e4e4e4e.jpg" },
  { id: "apex-legends",        title: "Apex Legends",            image: "https://media.rawg.io/media/games/b72/b7233d5d1b399644f6f2fb6621f4f1e5.jpg" },
  { id: "call-of-duty-mw",     title: "Call of Duty: MW",        image: "https://media.rawg.io/media/games/736/73619d587b2f3e7f6fe5b323cc8f25da.jpg" },
  { id: "fifa-23",             title: "FIFA 23",                 image: "https://media.rawg.io/media/games/ea4/ea459c8e6e8e4e4e4e4e4e4e4e4e4e4e.jpg" },
  { id: "minecraft-dungeons",  title: "Minecraft Dungeons",      image: "https://media.rawg.io/media/games/f46/f466571d536f2e3ea9e815ad17177501.jpg" },
  { id: "terraria",            title: "Terraria",                image: "https://media.rawg.io/media/games/f46/f46571d536f2e3ea9e815ad17177501.jpg" },
  { id: "portal-2",            title: "Portal 2",                image: "https://media.rawg.io/media/games/328/3283617cb7d75d67257fc58339188742.jpg" },
  { id: "bioshock-infinite",   title: "BioShock Infinite",       image: "https://media.rawg.io/media/games/fc1/fc1307a2774506b5bd65d7e8424664a7.jpg" },
  { id: "mass-effect-2",       title: "Mass Effect 2",           image: "https://media.rawg.io/media/games/3cf/3cff89996570cf29a10eb9cd967dcf45.jpg" },
  { id: "disco-elysium",       title: "Disco Elysium",           image: "https://media.rawg.io/media/games/d69/d69810315bd7e226ea2d21f9156af629.jpg" },
  { id: "hades-2",             title: "Hades II",                image: "https://media.rawg.io/media/games/1f4/1f47a270b8f241f1b7559b2e97e27e4e.jpg" },
];

export default function ProfileClient() {
  const { data: session } = useSession();
  const [step, setStep]                     = useState<"form" | "loading" | "result">("form");
  const [username, setUsername]             = useState("");
  const [bio, setBio]                       = useState("");
  const [selectedGames, setSelectedGames]   = useState<string[]>([]);
  const [playStyle, setPlayStyle]           = useState<string[]>(["casual"]);
  const [platforms, setPlatforms]           = useState<string[]>(["pc"]);
  const [hoursPerWeek, setHoursPerWeek]     = useState(10);
  const [favoriteGenres, setFavoriteGenres] = useState<string[]>([]);
  const [profile, setProfile]               = useState<GamerProfile | null>(null);
  const [offline, setOffline]               = useState(false);
  const [error, setError]                   = useState<string | null>(null);

  const GENRES = ["Action", "RPG", "Strategy", "Shooter", "Adventure", "Puzzle", "Horror", "Sports", "Simulation", "Fighting", "Platformer", "Indie"];

  useEffect(() => {
    const saved = localStorage.getItem("pixelverse_profile");
    if (saved) {
      try {
        const d = JSON.parse(saved);
        setProfile(d.profile);
        setUsername(d.username || "");
        setBio(d.bio || "");
        setPlayStyle(d.playStyle || ["casual"]);
        setPlatforms(d.platforms || ["pc"]);
        setStep("result");
      } catch { /* ignore */ }
    }
  }, []);

  const toggleArr = (arr: string[], val: string, set: (v: string[]) => void) =>
    set(arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val]);

  const generateProfile = async () => {
    if (selectedGames.length === 0) { setError("Select at least one game"); return; }
    setError(null); setStep("loading");
    try {
      const res  = await fetch("/api/ai/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ favoriteGames: selectedGames, playStyle: playStyle[0] || "casual", hoursPerWeek }),
      });
      const data = await res.json();
      setProfile(data.profile);
      setOffline(data.offline || false);
      localStorage.setItem("pixelverse_profile", JSON.stringify({
        profile: data.profile, username, bio, playStyle, platforms,
      }));
      setStep("result");
    } catch {
      setError("Failed to generate profile. Please try again.");
      setStep("form");
    }
  };

  const resetProfile = () => {
    localStorage.removeItem("pixelverse_profile");
    setProfile(null); setSelectedGames([]); setStep("form");
  };

  const allGamesList = [
    ...ALL_GAMES.map(g => ({ id: g.id, title: g.title, image: g.image })),
    ...EXTRA_GAMES,
  ];

  const recommendedGames: Game[] = profile
    ? ALL_GAMES.filter(g => profile.recommendations.some(r => g.title.toLowerCase().includes(r.toLowerCase()))).slice(0, 3)
    : [];

  return (
    <div className="min-h-screen" style={{ background: "#050508" }}>
      <div className="max-w-4xl mx-auto px-6 py-10">

          {/* ── Profile header ── */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <div className="flex items-center gap-5">
              {session?.user?.image ? (
                <img src={session.user.image} alt="avatar"
                  className="w-20 h-20 rounded-2xl border-2 border-violet-500/40 object-cover flex-shrink-0"
                  style={{ boxShadow: "0 0 30px rgba(124,58,237,0.3)" }} />
              ) : (
                <div className="w-20 h-20 rounded-2xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "linear-gradient(135deg, #7c3aed, #06b6d4)", boxShadow: "0 0 30px rgba(124,58,237,0.4)" }}>
                  <User className="w-10 h-10 text-white" />
                </div>
              )}
              <div>
                <h1 className="text-4xl font-black text-slate-100 leading-none mb-1.5">
                  {session?.user?.name
                    ? <>{session.user.name.split(" ")[0]}&apos;s <span className="gradient-text">Profile</span></>
                    : <>Gamer <span className="gradient-text">Profile</span></>}
                </h1>
                <p className="text-slate-500 text-sm">
                  {session ? `Signed in as ${session.user?.email}` : "Let AI analyze your gaming taste"}
                </p>
                {step === "result" && (
                  <div className="flex items-center gap-3 mt-2">
                    {platforms.map(p => {
                      const pl = PLATFORMS.find(x => x.id === p);
                      return pl ? <span key={p} className="text-sm">{pl.emoji} {pl.label}</span> : null;
                    })}
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          <AnimatePresence mode="wait">

            {/* ── FORM ── */}
            {step === "form" && (
              <motion.div key="form" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-5">

                {/* Gamertag + Bio row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="rounded-2xl border border-white/[0.07] p-5"
                    style={{ background: "rgba(10,10,18,0.7)", backdropFilter: "blur(16px)" }}>
                    <label className="flex items-center gap-2 text-sm font-bold text-slate-300 mb-3">
                      <User className="w-3.5 h-3.5 text-violet-400" />Gamer Tag
                    </label>
                    <input type="text" value={username} onChange={e => setUsername(e.target.value)}
                      placeholder="e.g. DarkSoulsFan99"
                      className="input-glow w-full px-4 py-2.5 rounded-xl text-sm" />
                  </div>
                  <div className="rounded-2xl border border-white/[0.07] p-5"
                    style={{ background: "rgba(10,10,18,0.7)", backdropFilter: "blur(16px)" }}>
                    <label className="flex items-center gap-2 text-sm font-bold text-slate-300 mb-3">
                      <Heart className="w-3.5 h-3.5 text-pink-400" />Bio
                    </label>
                    <input type="text" value={bio} onChange={e => setBio(e.target.value)}
                      placeholder="e.g. RPG lover, 10 years gaming..."
                      className="input-glow w-full px-4 py-2.5 rounded-xl text-sm" />
                  </div>
                </div>

                {/* Platforms */}
                <div className="rounded-2xl border border-white/[0.07] p-5"
                  style={{ background: "rgba(10,10,18,0.7)", backdropFilter: "blur(16px)" }}>
                  <label className="flex items-center gap-2 text-sm font-bold text-slate-300 mb-4">
                    <Gamepad2 className="w-3.5 h-3.5 text-cyan-400" />Your Platforms
                  </label>
                  <div className="flex flex-wrap gap-2.5">
                    {PLATFORMS.map(p => (
                      <motion.button key={p.id} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                        onClick={() => toggleArr(platforms, p.id, setPlatforms)}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-semibold transition-all"
                        style={{
                          borderColor: platforms.includes(p.id) ? "rgba(6,182,212,0.5)" : "rgba(255,255,255,0.06)",
                          background:  platforms.includes(p.id) ? "rgba(6,182,212,0.12)" : "rgba(13,13,20,0.6)",
                          color:       platforms.includes(p.id) ? "#67e8f9" : "#64748b",
                        }}>
                        <span>{p.emoji}</span>{p.label}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Favorite games */}
                <div className="rounded-2xl border border-white/[0.07] p-5"
                  style={{ background: "rgba(10,10,18,0.7)", backdropFilter: "blur(16px)" }}>
                  <label className="flex items-center gap-2 text-sm font-bold text-slate-300 mb-1">
                    <Star className="w-3.5 h-3.5 text-yellow-400" />Favorite Games
                  </label>
                  <p className="text-xs text-slate-600 mb-4">{selectedGames.length} selected</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
                    {allGamesList.map(game => {
                      const sel = selectedGames.includes(game.title);
                      return (
                        <motion.button key={game.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                          onClick={() => toggleArr(selectedGames, game.title, setSelectedGames)}
                          className="flex items-center gap-2.5 p-2.5 rounded-xl border text-left transition-all"
                          style={{
                            borderColor: sel ? "rgba(124,58,237,0.5)" : "rgba(255,255,255,0.06)",
                            background:  sel ? "rgba(124,58,237,0.12)" : "rgba(13,13,20,0.6)",
                          }}>
                          <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0 bg-slate-800">
                            <img src={game.image} alt={game.title} className="w-full h-full object-cover"
                              onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                          </div>
                          <span className="text-xs font-semibold line-clamp-2"
                            style={{ color: sel ? "#c4b5fd" : "#64748b" }}>{game.title}</span>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                {/* Play style — multi-select */}
                <div className="rounded-2xl border border-white/[0.07] p-5"
                  style={{ background: "rgba(10,10,18,0.7)", backdropFilter: "blur(16px)" }}>
                  <label className="flex items-center gap-2 text-sm font-bold text-slate-300 mb-4">
                    <Zap className="w-3.5 h-3.5 text-violet-400" />Play Style <span className="text-slate-600 font-normal text-xs">(pick all that apply)</span>
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {PLAY_STYLES.map(s => {
                      const sel = playStyle.includes(s.id);
                      return (
                        <motion.button key={s.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                          onClick={() => toggleArr(playStyle, s.id, setPlayStyle)}
                          className="flex flex-col items-start gap-1 p-3 rounded-xl border text-left transition-all"
                          style={{
                            borderColor: sel ? "rgba(124,58,237,0.5)" : "rgba(255,255,255,0.06)",
                            background:  sel ? "rgba(124,58,237,0.12)" : "rgba(13,13,20,0.6)",
                          }}>
                          <span className="text-lg">{s.emoji}</span>
                          <span className="text-xs font-bold" style={{ color: sel ? "#c4b5fd" : "#e2e8f0" }}>{s.label}</span>
                          <span className="text-[10px] text-slate-600">{s.desc}</span>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                {/* Favorite genres */}
                <div className="rounded-2xl border border-white/[0.07] p-5"
                  style={{ background: "rgba(10,10,18,0.7)", backdropFilter: "blur(16px)" }}>
                  <label className="flex items-center gap-2 text-sm font-bold text-slate-300 mb-4">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400" />Favorite Genres
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {GENRES.map(g => {
                      const sel = favoriteGenres.includes(g);
                      return (
                        <motion.button key={g} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                          onClick={() => toggleArr(favoriteGenres, g, setFavoriteGenres)}
                          className="px-3.5 py-1.5 rounded-full border text-xs font-semibold transition-all"
                          style={{
                            borderColor: sel ? "rgba(16,185,129,0.5)" : "rgba(255,255,255,0.06)",
                            background:  sel ? "rgba(16,185,129,0.12)" : "rgba(13,13,20,0.6)",
                            color:       sel ? "#6ee7b7" : "#64748b",
                          }}>
                          {g}
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                {/* Hours per week */}
                <div className="rounded-2xl border border-white/[0.07] p-5"
                  style={{ background: "rgba(10,10,18,0.7)", backdropFilter: "blur(16px)" }}>
                  <label className="flex items-center gap-2 text-sm font-bold text-slate-300 mb-1">
                    <Clock className="w-3.5 h-3.5 text-orange-400" />Hours per Week
                  </label>
                  <p className="text-xs text-slate-500 mb-4">
                    <span className="text-violet-300 font-bold text-base">{hoursPerWeek}h</span> / week
                  </p>
                  <input type="range" min={1} max={60} value={hoursPerWeek}
                    onChange={e => setHoursPerWeek(Number(e.target.value))}
                    className="w-full accent-violet-500" />
                  <div className="flex justify-between text-xs text-slate-600 mt-2">
                    <span>1h Casual</span><span>20h Regular</span><span>60h Hardcore</span>
                  </div>
                </div>

                {error && <p className="text-red-400 text-sm text-center">{error}</p>}

                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }}
                  onClick={generateProfile}
                  className="w-full flex items-center justify-center gap-3 py-4 rounded-xl font-black text-white"
                  style={{ background: "linear-gradient(135deg, #7c3aed, #6d28d9)", boxShadow: "0 0 30px rgba(124,58,237,0.4)" }}>
                  <Sparkles className="w-5 h-5" />
                  Generate My Gamer Profile
                  <ChevronRight className="w-5 h-5" />
                </motion.button>
              </motion.div>
            )}

            {/* ── LOADING ── */}
            {step === "loading" && (
              <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-40 gap-6">
                <Loader2 className="w-14 h-14 text-violet-400 animate-spin" />
                <div className="text-center">
                  <p className="text-slate-200 font-bold text-xl mb-2">Analyzing your gaming DNA...</p>
                  <p className="text-slate-500 text-sm">Crafting your unique gamer archetype</p>
                </div>
              </motion.div>
            )}

            {/* ── RESULT ── */}
            {step === "result" && profile && (
              <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-5">
                {offline && (
                  <div className="p-3 rounded-xl border border-amber-700/30 text-amber-300 text-sm text-center"
                    style={{ background: "rgba(180,83,9,0.1)" }}>
                    ⚠️ Showing demo profile. Check your GitHub token for AI-generated results.
                  </div>
                )}

                {/* Archetype hero */}
                <div className={`relative overflow-hidden rounded-2xl p-8 bg-gradient-to-br ${getArchetypeGradient(profile.archetype)}`}>
                  <div className="absolute inset-0 opacity-10 grid-pattern" />
                  <div className="relative z-10 flex items-start justify-between">
                    <div className="flex-1">
                      {username && <p className="text-white/70 text-sm mb-1">@{username}</p>}
                      {bio && <p className="text-white/60 text-xs mb-3 italic">{bio}</p>}
                      <h2 className="text-4xl font-black text-white mb-2">{profile.archetype}</h2>
                      <p className="text-white/80 leading-relaxed max-w-lg mb-4">{profile.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {profile.strengths.map(s => (
                          <span key={s} className="flex items-center gap-1 px-3 py-1 rounded-full bg-white/20 text-white text-sm font-semibold">
                            <Trophy className="w-3 h-3" />{s}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="w-20 h-20 rounded-2xl bg-white/20 flex items-center justify-center flex-shrink-0 ml-6">
                      <Gamepad2 className="w-10 h-10 text-white" />
                    </div>
                  </div>
                </div>

                {/* Stats grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { label: "Hours/Week", value: `${hoursPerWeek}h`, icon: Clock, color: "#f97316" },
                    { label: "Play Styles", value: playStyle.length.toString(), icon: Zap, color: "#a78bfa" },
                    { label: "Platforms", value: platforms.length.toString(), icon: Gamepad2, color: "#06b6d4" },
                    { label: "Fav Games", value: selectedGames.length.toString(), icon: Star, color: "#fbbf24" },
                  ].map(({ label, value, icon: Icon, color }) => (
                    <div key={label} className="rounded-2xl border border-white/[0.07] p-4 text-center"
                      style={{ background: "rgba(10,10,18,0.7)" }}>
                      <Icon className="w-5 h-5 mx-auto mb-2" style={{ color }} />
                      <p className="text-2xl font-black text-white">{value}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{label}</p>
                    </div>
                  ))}
                </div>

                {/* Playstyle breakdown */}
                <div className="rounded-2xl border border-white/[0.07] p-6"
                  style={{ background: "rgba(10,10,18,0.7)", backdropFilter: "blur(16px)" }}>
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

                <div className="flex gap-3">
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={resetProfile}
                    className="flex items-center gap-2 px-5 py-3 rounded-xl border border-white/[0.07] text-slate-400 hover:text-slate-200 transition-colors text-sm font-semibold"
                    style={{ background: "rgba(13,13,20,0.6)" }}>
                    <RefreshCw className="w-4 h-4" />Edit Profile
                  </motion.button>
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={generateProfile}
                    className="flex items-center gap-2 px-5 py-3 rounded-xl text-violet-300 border border-violet-500/25 hover:border-violet-500/50 transition-colors text-sm font-semibold"
                    style={{ background: "rgba(124,58,237,0.1)" }}>
                    <Sparkles className="w-4 h-4" />Regenerate
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
    </div>
  );
}
