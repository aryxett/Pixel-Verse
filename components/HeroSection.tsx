"use client";

import { motion } from "framer-motion";
import { Sparkles, ChevronRight, Zap, Shield, Cpu } from "lucide-react";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0" style={{ background: "#050508" }} />

      {/* Animated orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute rounded-full"
          style={{
            top: "15%", left: "10%",
            width: "40vw", height: "40vw", maxWidth: 500, maxHeight: 500,
            background: "radial-gradient(circle, rgba(124,58,237,0.18) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
        <motion.div
          animate={{ scale: [1.1, 1, 1.1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute rounded-full"
          style={{
            bottom: "20%", right: "10%",
            width: "35vw", height: "35vw", maxWidth: 450, maxHeight: 450,
            background: "radial-gradient(circle, rgba(6,182,212,0.12) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.25, 0.15] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 4 }}
          className="absolute rounded-full"
          style={{
            top: "50%", right: "30%",
            width: "25vw", height: "25vw", maxWidth: 300, maxHeight: 300,
            background: "radial-gradient(circle, rgba(236,72,153,0.1) 0%, transparent 70%)",
            filter: "blur(50px)",
          }}
        />
      </div>

      {/* Grid pattern */}
      <div className="absolute inset-0 grid-pattern opacity-40 pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-4xl mx-auto px-6 py-24 text-center">

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex justify-center mb-8"
        >
          <div
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium text-violet-300 border border-violet-500/30"
            style={{ background: "rgba(124,58,237,0.08)", backdropFilter: "blur(12px)" }}
          >
            <Sparkles className="w-4 h-4 flex-shrink-0" />
            <span>AI-Powered Game Discovery</span>
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 flex-shrink-0" style={{ boxShadow: "0 0 8px #a78bfa" }} />
          </div>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-black leading-tight tracking-tight mb-6"
          style={{ fontSize: "clamp(2.5rem, 8vw, 5rem)" }}
        >
          Find Your{" "}
          <span className="gradient-text">Perfect</span>
          <br />
          <span className="text-slate-100">Next Game</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-slate-400 mb-10 max-w-xl mx-auto leading-relaxed"
          style={{ fontSize: "clamp(1rem, 2.5vw, 1.125rem)" }}
        >
          Tell our AI your mood, what you&apos;ve been playing, or the vibe you want.
          Get hyper-personalized picks — powered by GPT-4o.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
        >
          <Link href="#ai-chat">
            <motion.button
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl text-white font-bold text-base w-full sm:w-auto"
              style={{
                background: "linear-gradient(135deg, #7c3aed, #6d28d9)",
                border: "1px solid rgba(167,139,250,0.35)",
                boxShadow: "0 0 24px rgba(124,58,237,0.4), inset 0 1px 0 rgba(255,255,255,0.1)",
              }}
            >
              <Sparkles className="w-4 h-4 flex-shrink-0" />
              Ask the AI
              <ChevronRight className="w-4 h-4 flex-shrink-0" />
            </motion.button>
          </Link>
          <Link href="/explore">
            <motion.button
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold text-base text-violet-300 w-full sm:w-auto"
              style={{
                background: "transparent",
                border: "1px solid rgba(124,58,237,0.45)",
                transition: "all 0.2s",
              }}
            >
              Browse Games
              <ChevronRight className="w-4 h-4 flex-shrink-0" />
            </motion.button>
          </Link>
        </motion.div>

        {/* Feature pills */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-wrap justify-center gap-3 mb-14"
        >
          {[
            { icon: Shield, label: "100% Private" },
            { icon: Cpu, label: "GPT-4o Powered" },
            { icon: Zap, label: "Instant Results" },
          ].map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-sm text-slate-400 border border-slate-800"
              style={{ background: "rgba(13,13,20,0.6)", backdropFilter: "blur(8px)" }}
            >
              <Icon className="w-3.5 h-3.5 text-violet-400 flex-shrink-0" />
              {label}
            </div>
          ))}
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-lg mx-auto"
        >
          {[
            { value: "12+", label: "Games" },
            { value: "7", label: "Moods" },
            { value: "GPT-4o", label: "AI Model" },
            { value: "0ms", label: "Data Sent" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-2xl font-black gradient-text mb-0.5">{stat.value}</p>
              <p className="text-xs text-slate-600 uppercase tracking-wider font-medium">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
        style={{ background: "linear-gradient(to top, #050508, transparent)" }}
      />
    </section>
  );
}
