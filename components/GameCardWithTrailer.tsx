"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Star, Clock, Users, Play, Pause, VolumeX, Volume2, Loader2 } from "lucide-react";

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
}

interface TrailerData {
  type: "mp4" | "youtube" | "none";
  url?: string;
  videoId?: string;
  thumbnailUrl?: string;
  source?: string;
}

function MCBadge({ score }: { score: number | null }) {
  if (!score) return null;
  const color = score >= 75 ? "#66cc33" : score >= 50 ? "#ffcc33" : "#ff4444";
  const textColor = score >= 50 ? "#000" : "#fff";
  return (
    <div
      className="absolute top-3 left-3 z-20 w-9 h-9 rounded-lg flex items-center justify-center text-xs font-black border-2"
      style={{ background: color, borderColor: color, color: textColor, boxShadow: `0 0 10px ${color}80` }}
    >
      {score}
    </div>
  );
}

/* ── YouTube Player using postMessage API ── */
function YouTubeTrailer({
  videoId,
  playing,
  muted,
  onReady,
}: {
  videoId: string;
  playing: boolean;
  muted: boolean;
  onReady: () => void;
}) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const readyRef = useRef(false);

  const postMsg = useCallback((action: string, value?: unknown) => {
    iframeRef.current?.contentWindow?.postMessage(
      JSON.stringify({ event: "command", func: action, args: value !== undefined ? [value] : [] }),
      "*"
    );
  }, []);

  useEffect(() => {
    const handler = (e: MessageEvent) => {
      try {
        const data = typeof e.data === "string" ? JSON.parse(e.data) : e.data;
        if (data?.event === "onReady" || data?.info !== undefined) {
          if (!readyRef.current) {
            readyRef.current = true;
            onReady();
          }
        }
      } catch { /* ignore */ }
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, [onReady]);

  useEffect(() => {
    if (!readyRef.current) return;
    if (playing) {
      postMsg("playVideo");
    } else {
      postMsg("pauseVideo");
    }
  }, [playing, postMsg]);

  useEffect(() => {
    if (!readyRef.current) return;
    postMsg(muted ? "mute" : "unMute");
  }, [muted, postMsg]);

  // enablejsapi=1 allows postMessage control
  const src = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=1&controls=0&rel=0&modestbranding=1&playsinline=1&enablejsapi=1&loop=1&playlist=${videoId}`;

  return (
    <iframe
      ref={iframeRef}
      src={src}
      className="absolute inset-0 w-full h-full"
      style={{ border: "none", transform: "scale(1.2)", transformOrigin: "center" }}
      allow="autoplay; encrypted-media"
      title="trailer"
    />
  );
}

export default function GameCardWithTrailer({ game, index }: { game: Game; index: number }) {
  const [hovered, setHovered] = useState(false);
  const [trailer, setTrailer] = useState<TrailerData | null>(null);
  const [trailerLoading, setTrailerLoading] = useState(false);
  const [trailerReady, setTrailerReady] = useState(false);
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(true);

  const videoRef = useRef<HTMLVideoElement>(null);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fetchedRef = useRef(false);

  const fetchTrailer = useCallback(async () => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;
    setTrailerLoading(true);
    try {
      const res = await fetch(
        `/api/trailer?slug=${encodeURIComponent(game.id)}&title=${encodeURIComponent(game.title)}`
      );
      const data: TrailerData = await res.json();
      setTrailer(data);
    } catch {
      setTrailer({ type: "none" });
    } finally {
      setTrailerLoading(false);
    }
  }, [game.id, game.title]);

  const handleMouseEnter = () => {
    setHovered(true);
    setPlaying(true);
    // Start fetching after 400ms — don't fetch on quick mouse-overs
    hoverTimer.current = setTimeout(fetchTrailer, 400);
  };

  const handleMouseLeave = () => {
    setHovered(false);
    setPlaying(false);
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    // Pause mp4
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  // mp4 play/pause
  useEffect(() => {
    if (!videoRef.current || trailer?.type !== "mp4") return;
    if (playing && hovered) {
      videoRef.current.play().catch(() => {});
    } else {
      videoRef.current.pause();
    }
  }, [playing, hovered, trailer]);

  // mp4 mute
  useEffect(() => {
    if (videoRef.current) videoRef.current.muted = muted;
  }, [muted]);

  const showTrailer = hovered && trailer && trailer.type !== "none" && (trailerReady || trailer.type === "mp4");
  const isYT = trailer?.type === "youtube";
  const isMp4 = trailer?.type === "mp4";

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.04, 0.5) }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ zIndex: hovered ? 20 : 1, position: "relative" }}
    >
      <Link href={`/game/rawg/${game.id}`}>
        <motion.div
          animate={hovered ? { scale: 1.06, y: -10 } : { scale: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-2xl overflow-hidden border cursor-pointer"
          style={{
            background: "rgba(13,13,20,0.9)",
            backdropFilter: "blur(16px)",
            borderColor: hovered ? "rgba(124,58,237,0.5)" : "rgba(255,255,255,0.07)",
            boxShadow: hovered
              ? "0 24px 64px rgba(0,0,0,0.8), 0 0 50px rgba(124,58,237,0.25)"
              : "0 4px 24px rgba(0,0,0,0.4)",
            transition: "box-shadow 0.3s, border-color 0.3s",
          }}
        >
          {/* Media area */}
          <div className="relative overflow-hidden bg-slate-900" style={{ aspectRatio: "16/9" }}>

            {/* Cover image — always rendered, hidden when trailer plays */}
            <img
              src={game.image}
              alt={game.title}
              className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
              style={{ opacity: showTrailer ? 0 : 1 }}
              onError={(e) => { (e.target as HTMLImageElement).style.opacity = "0"; }}
            />

            {/* MP4 trailer */}
            {isMp4 && trailer.url && (
              <video
                ref={videoRef}
                src={trailer.url}
                className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
                style={{ opacity: hovered ? 1 : 0 }}
                muted={muted}
                loop
                playsInline
                onCanPlay={() => {
                  setTrailerReady(true);
                  if (hovered) videoRef.current?.play().catch(() => {});
                }}
              />
            )}

            {/* YouTube trailer */}
            {isYT && trailer.videoId && hovered && (
              <div
                className="absolute inset-0 transition-opacity duration-500"
                style={{ opacity: trailerReady ? 1 : 0 }}
              >
                <YouTubeTrailer
                  videoId={trailer.videoId}
                  playing={playing}
                  muted={muted}
                  onReady={() => setTrailerReady(true)}
                />
              </div>
            )}

            {/* Gradient overlay */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: "linear-gradient(to top, rgba(13,13,20,1) 0%, rgba(13,13,20,0.1) 50%, transparent 100%)",
                zIndex: 5,
              }}
            />

            {/* Loading spinner */}
            {hovered && trailerLoading && (
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <Loader2 className="w-7 h-7 text-violet-400 animate-spin" />
              </div>
            )}

            {/* Badges */}
            <MCBadge score={game.metacritic} />
            <div
              className="absolute top-3 right-3 z-10 px-2 py-0.5 rounded-full text-xs font-bold text-white"
              style={{ background: "rgba(124,58,237,0.85)", border: "1px solid rgba(167,139,250,0.3)" }}
            >
              AI {game.aiScore}
            </div>
            <div className="absolute bottom-3 left-3 z-10 flex items-center gap-1 text-yellow-400 text-xs font-bold">
              <Star className="w-3 h-3 fill-yellow-400" />{game.rating}
            </div>

            {/* Trailer controls — show on hover when trailer is ready */}
            <AnimatePresence>
              {hovered && trailerReady && trailer?.type !== "none" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute bottom-3 right-3 z-10 flex items-center gap-2"
                  onClick={(e) => e.preventDefault()} // prevent link navigation
                >
                  {/* Play/Pause */}
                  <button
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setPlaying((p) => !p); }}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white transition-all hover:scale-110"
                    style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.2)" }}
                  >
                    {playing
                      ? <Pause className="w-3.5 h-3.5" fill="white" />
                      : <Play className="w-3.5 h-3.5 ml-0.5" fill="white" />}
                  </button>
                  {/* Mute/Unmute */}
                  <button
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setMuted((m) => !m); }}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white transition-all hover:scale-110"
                    style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.2)" }}
                  >
                    {muted
                      ? <VolumeX className="w-3.5 h-3.5" />
                      : <Volume2 className="w-3.5 h-3.5" />}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Info */}
          <div className="p-4">
            <h3
              className="font-bold text-sm mb-1 line-clamp-1 transition-colors duration-200"
              style={{ color: hovered ? "#c4b5fd" : "#f1f5f9" }}
            >
              {game.title}
            </h3>
            <p className="text-slate-600 text-xs mb-3 truncate">
              {game.developer !== "Unknown" ? game.developer : game.genre.join(", ")} · {game.releaseYear || "—"}
            </p>
            <div className="flex items-center justify-between text-xs text-slate-600 mb-3">
              <div className="flex items-center gap-1"><Clock className="w-3 h-3" />{game.playtime}</div>
              {game.multiplayer && (
                <div className="flex items-center gap-1 text-cyan-500"><Users className="w-3 h-3" />Multi</div>
              )}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {game.genre.slice(0, 2).map((g) => <span key={g} className="tag-chip">{g}</span>)}
            </div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}
