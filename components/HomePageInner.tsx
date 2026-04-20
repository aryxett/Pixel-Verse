"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import HeroSection from "@/components/HeroSection";
import AIChat from "@/components/AIChat";
import TrendingSection from "@/components/TrendingSection";
import DecisionEngine from "@/components/DecisionEngine";
import { TrendingUp, Sparkles, Zap, Brain, Target } from "lucide-react";
import { fadeUp, staggerContainer, cardEntry, slideLeft, slideRight, viewportOnce } from "@/lib/animations";

/* ── Cinematic section label — EV2 style ── */
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <motion.div variants={fadeUp} className="flex items-center gap-3 mb-4">
      <div className="h-px flex-1 max-w-8" style={{ background: "rgba(124,58,237,0.5)" }} />
      <span className="text-[10px] font-black tracking-[0.25em] uppercase text-violet-400">{children}</span>
      <div className="h-px flex-1 max-w-8" style={{ background: "rgba(124,58,237,0.5)" }} />
    </motion.div>
  );
}

/* ── Big cinematic heading ── */
function CinematicHeading({ line1, line2, accent }: { line1: string; line2?: string; accent?: string }) {
  return (
    <div className="mb-12">
      <div className="overflow-hidden">
        <motion.h2
          variants={fadeUp}
          className="font-black tracking-tighter text-white leading-none"
          style={{ fontSize: "clamp(2.2rem, 5vw, 4rem)", letterSpacing: "-0.03em" }}
        >
          {line1}
        </motion.h2>
      </div>
      {line2 && (
        <div className="overflow-hidden">
          <motion.h2
            variants={fadeUp}
            className="font-black tracking-tighter leading-none"
            style={{
              fontSize: "clamp(2.2rem, 5vw, 4rem)",
              letterSpacing: "-0.03em",
              background: accent || "linear-gradient(135deg, #a78bfa, #06b6d4)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            {line2}
          </motion.h2>
        </div>
      )}
    </div>
  );
}

/* ── Atmospheric section divider ── */
function AtmosphericDivider({ color = "#7c3aed" }: { color?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const scaleX = useTransform(scrollYProgress, [0, 0.5, 1], [0.3, 1, 0.3]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  return (
    <div ref={ref} className="relative py-16 overflow-hidden">
      <motion.div
        style={{ scaleX, opacity }}
        className="h-px mx-auto origin-center"
        style={{
          background: `linear-gradient(90deg, transparent, ${color}80, rgba(6,182,212,0.4), ${color}80, transparent)`,
          scaleX,
          opacity,
          maxWidth: "900px",
        } as React.CSSProperties}
      />
      <motion.div
        style={{ opacity }}
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 60% 100% at 50% 50%, ${color}08, transparent)`,
          opacity,
        } as React.CSSProperties}
      />
    </div>
  );
}

export default function HomePageInner() {
  return (
    <div style={{ background: "#050508" }}>
      {/* ── Hero ── */}
      <HeroSection />

      {/* ── Trending ── */}
      <motion.section
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-20"
      >
        <SectionLabel>Trending Games</SectionLabel>
        <CinematicHeading line1="TRENDING" line2="RIGHT NOW" accent="linear-gradient(135deg, #f97316, #ef4444)" />
        <motion.div variants={staggerContainer}>
          <TrendingSection />
        </motion.div>
      </motion.section>

      <AtmosphericDivider color="#7c3aed" />

      {/* ── AI Advisor ── */}
      <motion.section
        id="ai-chat"
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        className="max-w-7xl mx-auto px-4 sm:px-6 pb-20 scroll-mt-20"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <motion.div variants={slideLeft}>
            <SectionLabel>AI Game Assistant</SectionLabel>
            <CinematicHeading line1="YOUR AI" line2="GAME ADVISOR" />
            <p className="text-slate-500 mb-8 leading-relaxed max-w-md">
              Describe your mood, what you&apos;ve been playing, or what kind of
              experience you want. Our AI finds your perfect match instantly.
            </p>
            <AIChat />
          </motion.div>

          <motion.div variants={staggerContainer} className="space-y-4 pt-4 lg:pt-24">
            {[
              { icon: "🔒", title: "100% Private",    desc: "Your queries stay secure and private at all times." },
              { icon: "🧠", title: "Context-Aware",   desc: "Understands your gaming history, mood, and preferences." },
              { icon: "⚡", title: "Instant Results", desc: "Fast, accurate recommendations delivered in seconds." },
              { icon: "🎮", title: "Gamer-First",     desc: "Built by gamers. Understands genres, mechanics, and vibes." },
            ].map((f) => (
              <motion.div
                key={f.title}
                variants={cardEntry}
                whileHover={{ x: 8, borderColor: "rgba(124,58,237,0.35)" }}
                className="flex gap-4 p-5 rounded-2xl border border-white/[0.06] cursor-default group transition-colors"
                style={{ background: "rgba(10,10,18,0.7)", backdropFilter: "blur(16px)" }}
              >
                <span className="text-2xl flex-shrink-0">{f.icon}</span>
                <div>
                  <p className="font-bold text-slate-100 text-sm mb-1 group-hover:text-violet-300 transition-colors">{f.title}</p>
                  <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      <AtmosphericDivider color="#06b6d4" />

      {/* ── Decision Engine ── */}
      <motion.section
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        className="max-w-7xl mx-auto px-4 sm:px-6 pb-24"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <motion.div variants={slideLeft}>
            <SectionLabel>Smart Recommendations</SectionLabel>
            <CinematicHeading line1="DECISION" line2="ENGINE" accent="linear-gradient(135deg, #a78bfa, #ec4899)" />
            <p className="text-slate-500 mb-8 leading-relaxed max-w-md">
              Tell us your time, mood, and device. Our AI cross-references
              500,000+ games and picks your perfect match with a score.
            </p>

            {/* How it works steps */}
            <div className="space-y-4">
              {[
                { n: "01", icon: Target,   title: "Set constraints", desc: "Time available, mood, and device specs." },
                { n: "02", icon: Brain,    title: "AI analyzes",     desc: "Scans 500K+ games for your profile." },
                { n: "03", icon: Sparkles, title: "Get your match",  desc: "Scored recommendation with full explanation." },
              ].map(({ n, icon: Icon, title, desc }) => (
                <motion.div
                  key={n}
                  variants={fadeUp}
                  className="flex gap-4 items-start"
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center border"
                    style={{ background: "rgba(124,58,237,0.1)", borderColor: "rgba(124,58,237,0.2)" }}>
                    <Icon className="w-4 h-4 text-violet-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[10px] font-black text-violet-600 tracking-widest">{n}</span>
                      <p className="font-bold text-slate-200 text-sm">{title}</p>
                    </div>
                    <p className="text-slate-600 text-xs leading-relaxed">{desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div variants={slideRight}>
            <DecisionEngine />
          </motion.div>
        </div>
      </motion.section>

      {/* ── Bottom atmospheric fade ── */}
      <div className="h-32" style={{
        background: "linear-gradient(to bottom, transparent, rgba(5,5,8,0.8))",
      }} />
    </div>
  );
}
