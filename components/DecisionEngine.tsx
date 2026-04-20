"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from "framer-motion";
import Link from "next/link";
import {
  Zap, Clock, Gamepad2, Monitor, Loader2,
  ChevronRight, ChevronLeft, RefreshCw,
  Star, Users,
} from "lucide-react";
import type { DecisionOutput } from "@/app/api/decision/route";

/* ── Constants ── */
const MOODS = [
  { id: "chill",       label: "Chill",       emoji: "😌" },
  { id: "action",      label: "Action",      emoji: "⚔️" },
  { id: "competitive", label: "Competitive", emoji: "🏆" },
  { id: "adventurous", label: "Adventurous", emoji: "🗺️" },
  { id: "creative",    label: "Creative",    emoji: "🎨" },
  { id: "social",      label: "Social",      emoji: "👥" },
  { id: "horror",      label: "Horror",      emoji: "👻" },
];

const DEVICES = [
  { id: "low-end", label: "Low-End",   desc: "Older PC / Budget" },
  { id: "mid",     label: "Mid-Range", desc: "PS4 / Mid PC" },
  { id: "high",    label: "High-End",  desc: "PS5 / RTX PC" },
];

const TIME_OPTIONS = [
  { value: 0.5, label: "30 min" },
  { value: 1,   label: "1 hour" },
  { value: 2,   label: "2 hours" },
  { value: 3,   label: "3 hours" },
  { value: 5,   label: "5+ hours" },
];

function scoreColor(score: number) {
  if (score >= 80) return "#66cc33";
  if (score >= 60) return "#f59e0b";
  return "#06b6d4";
}

/* ─────────────────────────────────────────
   Dynamic 3D Game Card Slide
───────────────────────────────────────── */
function GameSlide({
  result,
  rank,
  direction,
}: {
  result: DecisionOutput;
  rank: number;
  direction: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX  = useMotionValue(0);
  const mouseY  = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), { stiffness: 400, damping: 25 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), { stiffness: 400, damping: 25 });
  const glowX   = useTransform(mouseX, [-0.5, 0.5], ["0%", "100%"]);
  const glowY   = useTransform(mouseY, [-0.5, 0.5], ["0%", "100%"]);
  const shine   = useTransform(mouseX, [-0.5, 0.5], ["translateX(-100%) skewX(-12deg)", "translateX(200%) skewX(-12deg)"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top)  / rect.height - 0.5);
  };
  const handleMouseLeave = () => { mouseX.set(0); mouseY.set(0); };

  const color = scoreColor(result.matchScore);
  const href  = `/game/rawg/${result.slug}`;

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? 300 : -300, opacity: 0, scale: 0.85, rotateY: d > 0 ? 25 : -25 }),
    center: { x: 0, opacity: 1, scale: 1, rotateY: 0 },
    exit:  (d: number) => ({ x: d > 0 ? -300 : 300, opacity: 0, scale: 0.85, rotateY: d > 0 ? -25 : 25 }),
  };

  return (
    <motion.div
      custom={direction}
      variants={variants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      style={{ perspective: 1000 }}
    >
      <Link href={href}>
        <motion.div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          whileHover={{ scale: 1.03 }}
          transition={{ duration: 0.2 }}
          className="relative rounded-2xl overflow-hidden border-2 cursor-pointer group"
          style={{
            rotateX,
            rotateY,
            transformStyle: "preserve-3d",
            borderColor: color + "60",
            boxShadow: `0 20px 60px rgba(0,0,0,0.7), 0 0 60px ${color}25`,
            background: "rgba(8,8,16,0.95)",
          } as React.CSSProperties}
        >
          {/* Holographic shimmer on hover */}
          <motion.div
            className="absolute inset-0 pointer-events-none z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 overflow-hidden"
          >
            <motion.div
              style={{ transform: shine }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.06] to-transparent"
            />
          </motion.div>

          {/* Dynamic mouse-follow glow */}
          <motion.div
            className="absolute inset-0 pointer-events-none z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              background: `radial-gradient(circle at ${glowX} ${glowY}, ${color}20 0%, transparent 55%)`,
            } as React.CSSProperties}
          />

          {/* Cover image — tall aspect for drama */}
          <div className="relative overflow-hidden" style={{ aspectRatio: "16/9" }}>
            {result.image ? (
              <motion.img
                src={result.image}
                alt={result.game}
                className="w-full h-full object-cover"
                whileHover={{ scale: 1.08 }}
                transition={{ duration: 0.6 }}
                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center"
                style={{ background: "rgba(20,20,40,0.8)" }}>
                <Gamepad2 className="w-16 h-16 text-slate-700" />
              </div>
            )}

            {/* Cinematic gradient */}
            <div className="absolute inset-0"
              style={{ background: "linear-gradient(to top, rgba(8,8,16,1) 0%, rgba(8,8,16,0.5) 40%, transparent 100%)" }} />

            {/* Rank */}
            <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
              <div className="px-3 py-1 rounded-full text-xs font-black text-white"
                style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.15)" }}>
                #{rank} Pick
              </div>
            </div>

            {/* Match score */}
            <div className="absolute top-4 right-4 z-20">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                className="w-14 h-14 rounded-2xl flex flex-col items-center justify-center border-2 font-black"
                style={{
                  background: color,
                  borderColor: color,
                  color: result.matchScore >= 50 ? "#000" : "#fff",
                  boxShadow: `0 0 24px ${color}80`,
                }}
              >
                <span className="text-lg leading-none">{result.matchScore}</span>
                <span className="text-[9px] font-semibold opacity-70">MATCH</span>
              </motion.div>
            </div>

            {/* Bottom scores */}
            <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center justify-between">
              {result.rating > 0 && (
                <div className="flex items-center gap-1.5 text-yellow-400 text-sm font-bold">
                  <Star className="w-4 h-4 fill-yellow-400" />
                  {result.rating}
                </div>
              )}
              {result.metacritic && (
                <div className="px-2.5 py-1 rounded-lg text-xs font-black"
                  style={{
                    background: result.metacritic >= 75 ? "#66cc33" : result.metacritic >= 50 ? "#ffcc33" : "#ff4444",
                    color: result.metacritic >= 50 ? "#000" : "#fff",
                    boxShadow: `0 0 10px ${result.metacritic >= 75 ? "#66cc33" : "#ffcc33"}60`,
                  }}>
                  MC {result.metacritic}
                </div>
              )}
            </div>
          </div>

          {/* Info panel */}
          <div className="p-5">
            {/* Title */}
            <motion.h3
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="text-xl font-black text-slate-100 mb-1 group-hover:text-violet-300 transition-colors"
            >
              {result.game}
            </motion.h3>

            {/* Developer + year */}
            <p className="text-slate-600 text-xs mb-3">
              {result.developer !== "Unknown" ? result.developer : ""}
              {result.developer !== "Unknown" && result.releaseYear ? " · " : ""}
              {result.releaseYear || ""}
            </p>

            {/* Reason */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-slate-400 text-sm leading-relaxed mb-4"
            >
              {result.reason}
            </motion.p>

            {/* Meta row */}
            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-2 items-center">
                <div className="flex items-center gap-1.5 text-xs text-slate-600">
                  <Clock className="w-3 h-3" />
                  {result.playtime}
                </div>
                {result.multiplayer && (
                  <div className="flex items-center gap-1.5 text-xs text-cyan-500">
                    <Users className="w-3 h-3" />
                    Multiplayer
                  </div>
                )}
                {result.genre.slice(0, 2).map((g) => (
                  <span key={g} className="tag-chip">{g}</span>
                ))}
              </div>
              <div className="flex items-center gap-1 text-xs text-violet-400 group-hover:text-violet-300 font-semibold transition-colors flex-shrink-0">
                View <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}

/* ─────────────────────────────────────────
   Main Component
───────────────────────────────────────── */
export default function DecisionEngine() {
  const [timeAvailable, setTimeAvailable] = useState<number>(2);
  const [mood, setMood]                   = useState<string>("");
  const [device, setDevice]               = useState<string>("mid");
  const [loading, setLoading]             = useState(false);
  const [results, setResults]             = useState<DecisionOutput[]>([]);
  const [activeIdx, setActiveIdx]         = useState(0);
  const [direction, setDirection]         = useState(1);
  const [error, setError]                 = useState<string | null>(null);
  const [fallback, setFallback]           = useState(false);

  const canSubmit = mood && device && timeAvailable > 0;

  const handleDecide = async () => {
    if (!canSubmit) return;
    setLoading(true);
    setResults([]);
    setError(null);
    setActiveIdx(0);
    setFallback(false);

    try {
      const res  = await fetch("/api/decision", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ timeAvailable, mood, device }),
      });
      const data = await res.json();
      if (!res.ok && !data.results) throw new Error(data.error || "Failed");
      setResults(data.results || []);
      setFallback(data.fallback || false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const goTo = (idx: number) => {
    setDirection(idx > activeIdx ? 1 : -1);
    setActiveIdx(idx);
  };
  const prev = () => { if (activeIdx > 0) goTo(activeIdx - 1); };
  const next = () => { if (activeIdx < results.length - 1) goTo(activeIdx + 1); };

  const btnStyle = (active: boolean): React.CSSProperties => active ? {
    borderColor: "rgba(124,58,237,0.6)",
    background: "rgba(124,58,237,0.15)",
    color: "#c4b5fd",
    boxShadow: "0 0 12px rgba(124,58,237,0.2)",
  } : {
    borderColor: "rgba(255,255,255,0.07)",
    background: "rgba(13,13,20,0.6)",
    color: "#64748b",
  };

  return (
    <div className="rounded-2xl border border-violet-500/20 overflow-hidden"
      style={{ background: "rgba(10,10,18,0.85)", backdropFilter: "blur(20px)" }}>

      {/* Header */}
      <div className="px-6 py-4 border-b border-white/[0.06] flex items-center gap-3"
        style={{ background: "rgba(124,58,237,0.08)" }}>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: "linear-gradient(135deg, #7c3aed, #06b6d4)", boxShadow: "0 0 16px rgba(124,58,237,0.4)" }}>
          <Zap className="w-4 h-4 text-white" />
        </div>
        <div>
          <p className="font-bold text-sm text-slate-200">AI Decision Engine</p>
          <p className="text-xs text-slate-600">RAWG.io · 500,000+ games · Strict device + time matching</p>
        </div>
      </div>

      <div className="p-6 space-y-5">

        {/* Time */}
        <div>
          <label className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
            <Clock className="w-3.5 h-3.5 text-violet-400" />Time Available
          </label>
          <div className="flex flex-wrap gap-2">
            {TIME_OPTIONS.map((t) => (
              <motion.button
                key={t.value}
                onClick={() => setTimeAvailable(t.value)}
                whileHover={{ scale: 1.05, y: -1 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 rounded-xl text-sm font-medium border transition-colors"
                style={btnStyle(timeAvailable === t.value)}
              >
                {t.label}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Mood */}
        <div>
          <label className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
            <Gamepad2 className="w-3.5 h-3.5 text-violet-400" />Current Mood
          </label>
          <div className="flex flex-wrap gap-2">
            {MOODS.map((m) => (
              <motion.button
                key={m.id}
                onClick={() => setMood(m.id)}
                whileHover={{ scale: 1.05, y: -1 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-colors"
                style={btnStyle(mood === m.id)}
              >
                <span>{m.emoji}</span><span>{m.label}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Device */}
        <div>
          <label className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
            <Monitor className="w-3.5 h-3.5 text-violet-400" />Device
          </label>
          <div className="grid grid-cols-3 gap-2">
            {DEVICES.map((d) => (
              <motion.button
                key={d.id}
                onClick={() => setDevice(d.id)}
                whileHover={{ scale: 1.03, y: -1 }}
                whileTap={{ scale: 0.97 }}
                className="p-3 rounded-xl text-left border transition-colors"
                style={btnStyle(device === d.id)}
              >
                <p className="text-sm font-semibold" style={{ color: device === d.id ? "#c4b5fd" : "#94a3b8" }}>
                  {d.label}
                </p>
                <p className="text-xs text-slate-600 mt-0.5">{d.desc}</p>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Submit */}
        <motion.button
          whileHover={canSubmit ? { scale: 1.02, y: -1 } : {}}
          whileTap={canSubmit ? { scale: 0.98 } : {}}
          onClick={handleDecide}
          disabled={!canSubmit || loading}
          className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl font-bold text-sm text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          style={{
            background: canSubmit ? "linear-gradient(135deg, #7c3aed, #6d28d9)" : "rgba(30,30,50,0.6)",
            boxShadow: canSubmit ? "0 0 24px rgba(124,58,237,0.4)" : "none",
          }}>
          {loading
            ? <><Loader2 className="w-4 h-4 animate-spin" />Searching 500,000+ games...</>
            : <><Zap className="w-4 h-4" />Find My Games<ChevronRight className="w-4 h-4" /></>}
        </motion.button>

        {error && <p className="text-red-400 text-sm text-center">{error}</p>}

        {/* ── Slides ── */}
        <AnimatePresence>
          {results.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              {/* Controls row */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  {/* Dot indicators */}
                  {results.map((_, i) => (
                    <button key={i} onClick={() => goTo(i)}
                      className="rounded-full transition-all duration-300"
                      style={{
                        width: i === activeIdx ? 24 : 8,
                        height: 8,
                        background: i === activeIdx
                          ? scoreColor(results[i].matchScore)
                          : "rgba(255,255,255,0.15)",
                        boxShadow: i === activeIdx ? `0 0 8px ${scoreColor(results[i].matchScore)}` : "none",
                      }} />
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  {fallback && <span className="text-xs text-amber-500">⚠ Fallback</span>}
                  <button onClick={prev} disabled={activeIdx === 0}
                    className="w-8 h-8 rounded-xl flex items-center justify-center border border-slate-800 text-slate-500 hover:border-violet-500/40 hover:text-violet-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    style={{ background: "rgba(13,13,20,0.7)" }}>
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-xs text-slate-600 font-medium w-10 text-center">
                    {activeIdx + 1}/{results.length}
                  </span>
                  <button onClick={next} disabled={activeIdx === results.length - 1}
                    className="w-8 h-8 rounded-xl flex items-center justify-center border border-slate-800 text-slate-500 hover:border-violet-500/40 hover:text-violet-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    style={{ background: "rgba(13,13,20,0.7)" }}>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Slide */}
              <div style={{ overflow: "hidden" }}>
                <AnimatePresence mode="wait" custom={direction}>
                  <GameSlide
                    key={activeIdx}
                    result={results[activeIdx]}
                    rank={activeIdx + 1}
                    direction={direction}
                  />
                </AnimatePresence>
              </div>

              {/* Try again */}
              <button onClick={handleDecide}
                className="mt-4 flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-400 transition-colors">
                <RefreshCw className="w-3 h-3" />Try again with same settings
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
