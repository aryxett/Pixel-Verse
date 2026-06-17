"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Play, ChevronLeft, ChevronRight, X, Gamepad2 } from "lucide-react";
import Link from "next/link";

interface GameSlide {
  title: string;
  slug: string;
  criticScore: number;
  userScore: number;
  image: string;
  trailerId: string;
  platforms: string[];
  excerpt: string;
  badge: string;
  releaseYear: number;
  genre: string[];
}

const FEATURED_SLIDES: GameSlide[] = [
  {
    title: "Elden Ring",
    slug: "elden-ring",
    criticScore: 95,
    userScore: 8.8,
    image: "https://media.rawg.io/media/games/b29/b294fdd866dcdb643e7bab370a552855.jpg",
    trailerId: "E3Huy09DM50",
    platforms: ["PC", "PS5", "Xbox Series X/S", "PS4", "Xbox One"],
    excerpt: "FromSoftware's open-world masterpiece achieves near-perfection, merging breathtaking exploration mechanics with the studio's signature gameplay challenge.",
    badge: "Must Play",
    releaseYear: 2022,
    genre: ["Action", "RPG"],
  },
  {
    title: "Hollow Knight",
    slug: "hollow-knight",
    criticScore: 90,
    userScore: 9.0,
    image: "https://media.rawg.io/media/games/4cf/4cfc6b7f1850590a4634b08bfab308ab.jpg",
    trailerId: "UAO2urG23S0",
    platforms: ["PC", "Nintendo Switch", "PS4", "Xbox One"],
    excerpt: "A hauntingly beautiful metroidvania featuring precise action-combat, deeply atmospheric environmental design, and a vast subterranean kingdom to explore.",
    badge: "Editors' Choice",
    releaseYear: 2017,
    genre: ["Action", "Indie"],
  },
  {
    title: "Cyberpunk 2077",
    slug: "cyberpunk-2077",
    criticScore: 86,
    userScore: 8.5,
    image: "https://media.rawg.io/media/games/26d/26d4437715bee60138dab4a7c8c59c92.jpg",
    trailerId: "8X2kIfS6fb8",
    platforms: ["PC", "PS5", "Xbox Series X/S", "PS4", "Xbox One"],
    excerpt: "Night City is a sprawling, detailed metropolis offering unmatched visual scale, rich narrative depth, and deep futuristic action-RPG gameplay.",
    badge: "Must Play",
    releaseYear: 2020,
    genre: ["Action", "RPG"],
  },
  {
    title: "The Witcher 3: Wild Hunt",
    slug: "the-witcher-3-wild-hunt",
    criticScore: 92,
    userScore: 9.1,
    image: "https://media.rawg.io/media/games/618/618c2031a07bbff6b4f611f10b6bcdbc.jpg",
    trailerId: "XHrsk3USPUM",
    platforms: ["PC", "PS5", "Xbox Series X/S", "PS4", "Xbox One", "Nintendo Switch"],
    excerpt: "One of the most acclaimed RPGs of all time, offering a massive, gorgeously realized open world full of rich storytelling, unforgettable characters, and intense combat.",
    badge: "Must Play",
    releaseYear: 2015,
    genre: ["Action", "RPG"],
  },
  {
    title: "Baldur's Gate 3",
    slug: "baldurs-gate-3",
    criticScore: 96,
    userScore: 8.9,
    image: "https://media.rawg.io/media/games/699/69907ecf13f172e9e144069769c3be73.jpg",
    trailerId: "1T22jUttHi8",
    platforms: ["PC", "PS5", "Xbox Series X/S", "macOS"],
    excerpt: "An unparalleled cinematic RPG experience set in the Dungeons & Dragons universe. Gathering your party and returning to the Forgotten Realms in a tale of fellowship and betrayal.",
    badge: "Editors' Choice",
    releaseYear: 2023,
    genre: ["RPG"],
  },
];

export default function HeroSection() {
  const [page, setPage] = useState([0, 0]); // [index, direction]
  const [trailerOpen, setTrailerOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const index = page[0];
  const direction = page[1];
  const activeSlide = FEATURED_SLIDES[index];

  // Auto scroll logic
  useEffect(() => {
    if (trailerOpen || isHovered) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setPage(([prevIndex]) => [(prevIndex + 1) % FEATURED_SLIDES.length, 1]);
    }, 8000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [trailerOpen, isHovered]);

  const handlePrev = () => {
    setPage(([prevIndex]) => [(prevIndex - 1 + FEATURED_SLIDES.length) % FEATURED_SLIDES.length, -1]);
  };

  const handleNext = () => {
    setPage(([prevIndex]) => [(prevIndex + 1) % FEATURED_SLIDES.length, 1]);
  };

  // Close trailer modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setTrailerOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Framer Motion Sliding variants for horizontal carousel effect
  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 120 : -120,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -120 : 120,
      opacity: 0,
    }),
  };

  return (
    <section 
      className="relative min-h-screen flex items-center overflow-hidden keep-dark"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* ── Background Slides (Parallax + Crossfade) ── */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 w-full h-full"
          >
            <motion.img
              src={activeSlide.image}
              alt={activeSlide.title}
              initial={{ scale: 1.03 }}
              animate={{ scale: 1.08 }}
              transition={{ duration: 8, ease: "easeOut" }}
              className="w-full h-full object-cover animate-fade-in"
            />
            {/* Cinematic Gradient Masks */}
            <div className="absolute inset-0 hero-linear-left z-10" />
            <div className="absolute inset-0 hero-linear-bottom z-10" />
            <div className="absolute inset-0 hero-radial-mask z-10" />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Grid Pattern overlay */}
      <div className="absolute inset-0 grid-pattern opacity-15 pointer-events-none z-10" />

      {/* ── Main Content Container ── */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 py-20 mt-12">
        <div className="flex items-center justify-between gap-6 w-full">
          
          {/* Left Arrow Button (Desktop - Designed & Animated) */}
          <motion.button 
            onClick={handlePrev}
            whileHover="hover"
            whileTap={{ scale: 0.95 }}
            className="hidden md:flex items-center justify-center w-14 h-14 rounded-full border border-violet-500/20 hover:border-violet-500/50 bg-black/60 text-violet-400 hover:text-white transition-colors cursor-pointer backdrop-blur-md z-30 shadow-[0_0_15px_rgba(124,58,237,0.1)] hover:shadow-[0_0_25px_rgba(124,58,237,0.3)]"
          >
            <motion.div
              variants={{
                hover: { x: -4, scale: 1.1 }
              }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
            >
              <ChevronLeft className="w-6 h-6" />
            </motion.div>
          </motion.button>

          {/* Content Grid */}
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch w-full overflow-hidden p-2">
            
            {/* Left Column: The Text Details Box */}
            <div className="lg:col-span-5 flex flex-col justify-between p-6 sm:p-8 rounded-3xl border border-white/[0.08] bg-black/45 backdrop-blur-md relative overflow-hidden shadow-2xl min-h-[380px]">
              {/* Ambient inner box glows */}
              <div className="absolute -top-20 -left-20 w-40 h-40 rounded-full bg-violet-500/10 blur-[60px] pointer-events-none" />
              
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={index}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.25 }
                  }}
                  className="space-y-6 relative z-10 flex flex-col h-full justify-between"
                >
                  <div className="space-y-6">
                    {/* Badge & Year */}
                    <div className="flex items-center gap-3">
                      <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider text-violet-300 border border-violet-500/30 bg-violet-500/10 backdrop-blur-md">
                        <Sparkles className="w-3.5 h-3.5" />
                        {activeSlide.badge}
                      </span>
                      <span className="text-xs font-semibold text-slate-450">{activeSlide.releaseYear}</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-700" />
                      <span className="text-xs font-semibold text-slate-450">{activeSlide.genre.join(" / ")}</span>
                    </div>

                    {/* Game Title */}
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight drop-shadow-2xl">
                      {activeSlide.title}
                    </h1>

                    {/* Excerpt */}
                    <p className="text-slate-350 text-sm sm:text-base leading-relaxed drop-shadow-md">
                      {activeSlide.excerpt}
                    </p>

                    {/* Platforms */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {activeSlide.platforms.map((p) => (
                        <span 
                          key={p} 
                          className="px-2.5 py-0.5 rounded-md text-[10px] font-semibold text-slate-400 border border-white/[0.05] bg-white/[0.04] backdrop-blur-sm"
                        >
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* CTAs */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-white/[0.05] mt-4">
                    <Link href={`/game/rawg/${activeSlide.slug}`} className="w-full sm:w-auto" style={{ textDecoration: "none" }}>
                      <motion.button
                        whileHover={{ scale: 1.03, y: -1 }}
                        whileTap={{ scale: 0.98 }}
                        className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-white font-bold text-sm w-full sm:w-auto cursor-pointer"
                        style={{
                          background: "linear-gradient(135deg, #7c3aed, #6d28d9)",
                          border: "1px solid rgba(167,139,250,0.3)",
                          boxShadow: "0 0 20px rgba(124,58,237,0.3)",
                        }}
                      >
                        <Gamepad2 className="w-4 h-4" />
                        Read Review
                      </motion.button>
                    </Link>
                    
                    <motion.button
                      whileHover={{ scale: 1.03, y: -1 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setTrailerOpen(true)}
                      className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm text-slate-200 w-full sm:w-auto border border-white/10 hover:bg-white/5 transition-colors cursor-pointer"
                      style={{ background: "rgba(255,255,255,0.02)", backdropFilter: "blur(12px)" }}
                    >
                      <Play className="w-3.5 h-3.5 fill-slate-200 text-slate-200" />
                      Watch Trailer
                    </motion.button>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Right Column: Game Image and Ratings/Metacritics */}
            <div className="lg:col-span-7 flex flex-col justify-center rounded-3xl border border-white/[0.08] bg-black/30 backdrop-blur-md relative overflow-hidden shadow-2xl min-h-[320px] lg:min-h-[450px]">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={index}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.25 }
                  }}
                  className="absolute inset-0 w-full h-full"
                >
                  {/* Sharp Game Image */}
                  <img 
                    src={activeSlide.image} 
                    alt={activeSlide.title}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Vignette overlay inside the image card to make scores readable */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/40 z-10" />

                  {/* Score Badges Overlayed on the Image Card */}
                  <div className="absolute top-6 right-6 flex gap-4 z-20">
                    {/* Critic Score */}
                    <div className="flex flex-col items-center gap-1 bg-black/60 backdrop-blur-md p-3 rounded-2xl border border-white/10 shadow-lg">
                      <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl font-black ${
                        activeSlide.criticScore >= 90 ? "score-badge-green" : "score-badge-yellow"
                      }`}>
                        {activeSlide.criticScore}
                      </div>
                      <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Critic Score</span>
                    </div>

                    {/* User Score */}
                    <div className="flex flex-col items-center gap-1 bg-black/60 backdrop-blur-md p-3 rounded-2xl border border-white/10 shadow-lg">
                      <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl font-black border-2 ${
                        activeSlide.userScore >= 8.5 
                          ? "border-green-500/40 text-green-400 bg-green-500/10" 
                          : "border-yellow-500/40 text-yellow-400 bg-yellow-500/10"
                      }`}>
                        {activeSlide.userScore.toFixed(1)}
                      </div>
                      <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">User Score</span>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

          </div>

          {/* Right Arrow Button (Desktop - Designed & Animated) */}
          <motion.button 
            onClick={handleNext}
            whileHover="hover"
            whileTap={{ scale: 0.95 }}
            className="hidden md:flex items-center justify-center w-14 h-14 rounded-full border border-cyan-500/20 hover:border-cyan-500/50 bg-black/60 text-cyan-400 hover:text-white transition-colors cursor-pointer backdrop-blur-md z-30 shadow-[0_0_15px_rgba(6,182,212,0.1)] hover:shadow-[0_0_25px_rgba(6,182,212,0.3)]"
          >
            <motion.div
              variants={{
                hover: { x: 4, scale: 1.1 }
              }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
            >
              <ChevronRight className="w-6 h-6" />
            </motion.div>
          </motion.button>

        </div>

        {/* Mobile Arrow Controls (Shown below card on mobile screens only) */}
        <div className="flex md:hidden justify-center items-center gap-4 mt-6">
          <button 
            onClick={handlePrev}
            className="p-3 rounded-full border border-white/10 bg-black/40 text-slate-350 hover:text-white transition-all active:scale-95 cursor-pointer backdrop-blur-md"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="text-sm font-semibold text-slate-400">
            {index + 1} / {FEATURED_SLIDES.length}
          </div>
          <button 
            onClick={handleNext}
            className="p-3 rounded-full border border-white/10 bg-black/40 text-slate-350 hover:text-white transition-all active:scale-95 cursor-pointer backdrop-blur-md"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* ── Modern Pagination Indicators (Dots at the bottom) ── */}
        <div className="flex justify-center items-center gap-2 mt-8">
          {FEATURED_SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setPage([idx, idx > index ? 1 : -1])}
              className="py-2 cursor-pointer focus:outline-none"
            >
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${
                  idx === index 
                    ? "w-8 bg-gradient-to-r from-violet-500 to-cyan-400" 
                    : "w-2 bg-white/20 hover:bg-white/40"
                }`}
              />
            </button>
          ))}
        </div>

      </div>

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none z-10"
        style={{ background: "linear-gradient(to top, var(--bg-primary), transparent)" }}
      />

      {/* ── YouTube Video Modal (Overlay) ── */}
      <AnimatePresence>
        {trailerOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
            onClick={() => setTrailerOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl rounded-2xl overflow-hidden border border-slate-200/10 dark:border-white/[0.08] shadow-2xl bg-[var(--bg-secondary)]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Aspect Ratio Video wrapper */}
              <div className="aspect-video w-full">
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${activeSlide.trailerId}?autoplay=1&mute=0&controls=1&rel=0&modestbranding=1`}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={`${activeSlide.title} Trailer`}
                />
              </div>

              {/* Close button */}
              <button 
                onClick={() => setTrailerOpen(false)}
                className="absolute top-3 right-3 p-2 rounded-xl bg-black/60 hover:bg-black/80 border border-white/10 text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
