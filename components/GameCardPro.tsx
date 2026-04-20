"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Star, Clock, Users, Play, Pause, VolumeX, Volume2, Zap, ChevronRight } from "lucide-react";
import LibraryButton from "@/components/LibraryButton";
import WishlistButton from "@/components/WishlistButton";

/* ─────────────────────────────────────────
   Types
───────────────────────────────────────── */
export interface GameCardProProps {
  id: string;
  title: string;
  genre: string[];
  rating: number;
  thumbnail: string;
  video?: string;           // mp4 URL (optional — fetched lazily if not provided)
  youtubeId?: string;       // YouTube video ID (fallback)
  metacritic?: number | null;
  aiScore?: number;
  developer?: string;
  releaseYear?: number;
  playtime?: string;
  multiplayer?: boolean;
  tags?: string[];
  href?: string;            // override link destination
  index?: number;           // stagger animation delay
  onHover?: (id: string) => void;
}

/* ─────────────────────────────────────────
   Metacritic badge
───────────────────────────────────────── */
function MCBadge({ score }: { score: number }) {
  const color = score >= 75 ? "#66cc33" : score >= 50 ? "#ffcc33" : "#ff4444";
  const text  = score >= 50 ? "#000" : "#fff";
  return (
    <div
      className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black border-2 flex-shrink-0"
      style={{ background: color, borderColor: color, color: text, boxShadow: `0 0 10px ${color}70` }}
    >
      {score}
    </div>
  );
}

/* ─────────────────────────────────────────
   Neon border animation (CSS keyframes via
   inline style — no Tailwind plugin needed)
───────────────────────────────────────── */
const NEON_KEYFRAMES = `
@keyframes neon-border {
  0%   { border-color: rgba(124,58,237,0.8); box-shadow: 0 0 12px rgba(124,58,237,0.6), 0 0 30px rgba(124,58,237,0.3); }
  33%  { border-color: rgba(6,182,212,0.8);  box-shadow: 0 0 12px rgba(6,182,212,0.6),  0 0 30px rgba(6,182,212,0.3); }
  66%  { border-color: rgba(236,72,153,0.8); box-shadow: 0 0 12px rgba(236,72,153,0.6), 0 0 30px rgba(236,72,153,0.3); }
  100% { border-color: rgba(124,58,237,0.8); box-shadow: 0 0 12px rgba(124,58,237,0.6), 0 0 30px rgba(124,58,237,0.3); }
}
`;

/* ─────────────────────────────────────────
   Main Component
───────────────────────────────────────── */
export default function GameCardPro({
  id,
  title,
  genre,
  rating,
  thumbnail,
  video,
  youtubeId,
  metacritic,
  aiScore,
  developer,
  releaseYear,
  playtime,
  multiplayer,
  tags = [],
  href,
  index = 0,
  onHover,
}: GameCardProProps) {
  const [hovered, setHovered]           = useState(false);
  const [videoReady, setVideoReady]     = useState(false);
  const [playing, setPlaying]           = useState(true);
  const [muted, setMuted]               = useState(true);
  const [imgLoaded, setImgLoaded]       = useState(false);
  const [fetchedVideo, setFetchedVideo] = useState<string | null>(null);
  const [fetchedYtId, setFetchedYtId]   = useState<string | null>(null);

  const videoRef   = useRef<HTMLVideoElement>(null);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fetchedRef = useRef(false);

  // 3D tilt via mouse position
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-0.5, 0.5], [4, -4]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-4, 4]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top)  / rect.height - 0.5);
  };
  const handleMouseLeaveCard = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  /* ── Lazy-fetch trailer on hover ── */
  const fetchTrailer = useCallback(async () => {
    if (fetchedRef.current || video || youtubeId) return;
    fetchedRef.current = true;
    try {
      const res  = await fetch(`/api/trailer?slug=${encodeURIComponent(id)}&title=${encodeURIComponent(title)}`);
      const data = await res.json();
      if (data.type === "mp4"     && data.url)     setFetchedVideo(data.url);
      if (data.type === "youtube" && data.videoId) setFetchedYtId(data.videoId);
    } catch { /* silent */ }
  }, [id, title, video, youtubeId]);

  const handleMouseEnter = () => {
    setHovered(true);
    setPlaying(true);
    onHover?.(id);
    hoverTimer.current = setTimeout(fetchTrailer, 350);
  };

  const handleMouseLeave = () => {
    setHovered(false);
    setPlaying(false);
    setVideoReady(false);
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
    handleMouseLeaveCard();
  };

  /* ── mp4 play/pause ── */
  const activeVideo = video || fetchedVideo;
  useEffect(() => {
    if (!videoRef.current || !activeVideo) return;
    if (hovered && playing) {
      videoRef.current.play().catch(() => {});
    } else {
      videoRef.current.pause();
    }
  }, [hovered, playing, activeVideo]);

  useEffect(() => {
    if (videoRef.current) videoRef.current.muted = muted;
  }, [muted]);

  /* ── YouTube postMessage control ── */
  const activeYtId = youtubeId || fetchedYtId;
  const iframeRef  = useRef<HTMLIFrameElement>(null);
  const ytReady    = useRef(false);

  const ytPost = useCallback((fn: string, args?: unknown[]) => {
    iframeRef.current?.contentWindow?.postMessage(
      JSON.stringify({ event: "command", func: fn, args: args ?? [] }), "*"
    );
  }, []);

  useEffect(() => {
    const handler = (e: MessageEvent) => {
      try {
        const d = typeof e.data === "string" ? JSON.parse(e.data) : e.data;
        if ((d?.event === "onReady" || d?.info !== undefined) && !ytReady.current) {
          ytReady.current = true;
          setVideoReady(true);
        }
      } catch { /* ignore */ }
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  useEffect(() => {
    if (!ytReady.current || !activeYtId) return;
    playing && hovered ? ytPost("playVideo") : ytPost("pauseVideo");
  }, [playing, hovered, activeYtId, ytPost]);

  useEffect(() => {
    if (!ytReady.current) return;
    ytPost(muted ? "mute" : "unMute");
  }, [muted, ytPost]);

  const showVideo = hovered && (
    (activeVideo && videoReady) ||
    (activeYtId  && videoReady)
  );

  const destination = href || `/game/rawg/${id}`;

  return (
    <>
      {/* Inject neon keyframes once */}
      <style>{NEON_KEYFRAMES}</style>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: Math.min(index * 0.05, 0.6), ease: [0.22, 1, 0.36, 1] }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
        style={{ zIndex: hovered ? 30 : 1, position: "relative", perspective: 800 }}
      >
        {/* Wishlist button — outside Link, single click adds to wishlist */}
        <div
          className="absolute z-[9999]"
          style={{ top: metacritic ? "3.25rem" : "0.75rem", left: "0.75rem" }}
        >
          <WishlistButton
            id={id}
            title={title}
            image={thumbnail}
            rating={rating}
            metacritic={metacritic}
            genre={genre}
            developer={developer}
            releaseYear={releaseYear}
          />
        </div>

        <Link href={destination}>
          <motion.div
            animate={hovered ? { scale: 1.07, y: -12 } : { scale: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-2xl border-2 cursor-pointer select-none overflow-visible"
            style={{
              rotateX,
              rotateY,
              transformStyle: "preserve-3d",
              background: "rgba(10,10,18,0.92)",
              backdropFilter: "blur(20px)",
              borderColor: hovered ? "rgba(124,58,237,0.8)" : "rgba(255,255,255,0.07)",
              boxShadow: hovered
                ? "0 28px 70px rgba(0,0,0,0.85), 0 0 50px rgba(124,58,237,0.25)"
                : "0 4px 20px rgba(0,0,0,0.5)",
              animation: hovered ? "neon-border 2s linear infinite" : "none",
              transition: "box-shadow 0.3s",
            } as React.CSSProperties}
          >
            {/* ── Media area ── */}
            <div className="relative overflow-hidden" style={{ aspectRatio: "16/9" }}>

              {/* Thumbnail — Next.js Image with lazy loading */}
              <div className={`absolute inset-0 transition-opacity duration-500 ${showVideo ? "opacity-0" : "opacity-100"}`}>
                {thumbnail && thumbnail.length > 0 ? (
                  <Image
                    src={thumbnail}
                    alt={title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover"
                    loading="lazy"
                    onLoad={() => setImgLoaded(true)}
                    onError={() => setImgLoaded(true)}
                    style={{ opacity: imgLoaded ? 1 : 0, transition: "opacity 0.3s" }}
                    unoptimized
                  />
                ) : null}
                {/* Skeleton — show while loading or no image */}
                {(!imgLoaded || !thumbnail) && (
                  <div className="absolute inset-0 bg-slate-800 animate-pulse" />
                )}
              </div>

              {/* MP4 video — lazy loaded, only rendered when needed */}
              {activeVideo && hovered && (
                <video
                  ref={videoRef}
                  src={activeVideo}
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${showVideo ? "opacity-100" : "opacity-0"}`}
                  muted={muted}
                  loop
                  playsInline
                  preload="metadata"
                  onCanPlay={() => {
                    setVideoReady(true);
                    if (hovered && playing) videoRef.current?.play().catch(() => {});
                  }}
                />
              )}

              {/* YouTube iframe — only mounted on hover */}
              {activeYtId && hovered && (
                <div className={`absolute inset-0 transition-opacity duration-500 ${showVideo ? "opacity-100" : "opacity-0"}`}>
                  <iframe
                    ref={iframeRef}
                    src={`https://www.youtube-nocookie.com/embed/${activeYtId}?autoplay=1&mute=1&controls=0&rel=0&modestbranding=1&playsinline=1&enablejsapi=1&loop=1&playlist=${activeYtId}`}
                    className="absolute inset-0 w-full h-full"
                    style={{ border: "none", transform: "scale(1.18)", transformOrigin: "center", pointerEvents: "none" }}
                    allow="autoplay; encrypted-media"
                    title={`${title} trailer`}
                  />
                </div>
              )}

              {/* Gradient overlay — always present */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: hovered
                    ? "linear-gradient(to top, rgba(10,10,18,1) 0%, rgba(10,10,18,0.3) 50%, transparent 100%)"
                    : "linear-gradient(to top, rgba(10,10,18,0.9) 0%, transparent 60%)",
                  transition: "background 0.4s",
                  zIndex: 5,
                }}
              />

              {/* ── Static badges ── */}
              {/* Metacritic */}
              {metacritic && (
                <div className="absolute top-3 left-3 z-10">
                  <MCBadge score={metacritic} />
                </div>
              )}

              {/* AI Score */}
              {aiScore && (
                <div
                  className="absolute top-3 right-3 z-10 flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold text-white"
                  style={{ background: "rgba(124,58,237,0.85)", border: "1px solid rgba(167,139,250,0.35)" }}
                >
                  <Zap className="w-2.5 h-2.5" />
                  {aiScore}
                </div>
              )}

              {/* Rating */}
              <div className="absolute bottom-3 left-3 z-10 flex items-center gap-1 text-yellow-400 text-xs font-bold">
                <Star className="w-3 h-3 fill-yellow-400" />
                {rating}
              </div>

              {/* ── Hover controls (play/pause + mute) ── */}
              <AnimatePresence>
                {hovered && videoReady && (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="absolute bottom-3 right-3 z-10 flex items-center gap-1.5"
                    onClick={(e) => e.preventDefault()}
                  >
                    <button
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); setPlaying((p) => !p); }}
                      className="w-7 h-7 rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform"
                      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.15)" }}
                    >
                      {playing
                        ? <Pause className="w-3 h-3" fill="white" />
                        : <Play  className="w-3 h-3 ml-0.5" fill="white" />}
                    </button>
                    <button
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); setMuted((m) => !m); }}
                      className="w-7 h-7 rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform"
                      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.15)" }}
                    >
                      {muted ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ── Info section ── */}
            <div className="relative overflow-hidden">
              {/* Static info — always visible */}
              <div className="px-4 pt-3 pb-3">
                <h3
                  className="font-bold text-sm line-clamp-1 transition-colors duration-200 mb-0.5"
                  style={{ color: hovered ? "#c4b5fd" : "#f1f5f9" }}
                >
                  {title}
                </h3>
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  {developer && <span className="truncate max-w-[100px]">{developer}</span>}
                  {developer && releaseYear && <span>·</span>}
                  {releaseYear && <span>{releaseYear}</span>}
                </div>
              </div>

              {/* ── Slide-up detailed info on hover ── */}
              <AnimatePresence>
                {hovered && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 space-y-3">
                      {/* Divider */}
                      <div className="h-px bg-gradient-to-r from-violet-500/30 via-cyan-500/20 to-transparent" />

                      {/* Genre tags */}
                      <div className="flex flex-wrap gap-1.5">
                        {genre.slice(0, 3).map((g) => (
                          <span key={g} className="tag-chip">{g}</span>
                        ))}
                      </div>

                      {/* Meta row */}
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        {playtime && (
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {playtime}
                          </div>
                        )}
                        {multiplayer && (
                          <div className="flex items-center gap-1 text-cyan-500">
                            <Users className="w-3 h-3" />
                            Multiplayer
                          </div>
                        )}
                      </div>

                      {/* Tags */}
                      {tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {tags.slice(0, 4).map((t) => (
                            <span
                              key={t}
                              className="px-2 py-0.5 rounded-full text-[10px] border border-slate-800 text-slate-600"
                              style={{ background: "rgba(13,13,20,0.6)" }}
                            >
                              #{t}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* CTA */}
                      <motion.div
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="flex items-center gap-1 text-xs font-semibold text-violet-400"
                      >
                        View Details
                        <ChevronRight className="w-3.5 h-3.5" />
                      </motion.div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </Link>
      </motion.div>
    </>
  );
}
