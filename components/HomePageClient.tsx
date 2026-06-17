"use client";

import HeroSection from "@/components/HeroSection";
import AIChat from "@/components/AIChat";
import TrendingSection from "@/components/TrendingSection";
import DecisionEngine from "@/components/DecisionEngine";
import SectionDivider from "@/components/SectionDivider";
import { TrendingUp, Sparkles, Zap } from "lucide-react";

export default function HomePageClient() {
  return (
    <div>
      {/* Hero */}
      <HeroSection />

      {/* Divider */}
      <SectionDivider />

      {/* Trending Games */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="flex items-center gap-3 mb-8">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: "rgba(249,115,22,0.15)", border: "1px solid rgba(249,115,22,0.2)" }}
          >
            <TrendingUp className="w-4 h-4 text-orange-400" />
          </div>
          <h2 className="text-2xl font-bold text-slate-100">Trending Now</h2>
          <span
            className="px-2.5 py-0.5 rounded-full text-xs font-semibold text-orange-400 border border-orange-500/20"
            style={{ background: "rgba(249,115,22,0.08)" }}
          >
            Hot 🔥
          </span>
        </div>
        <TrendingSection />
      </section>

      {/* Divider */}
      <SectionDivider />

      {/* AI Chat Section */}
      <section id="ai-chat" className="max-w-7xl mx-auto px-4 sm:px-6 py-16 scroll-mt-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">

          {/* Left: AI Chat */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.2)" }}
              >
                <Sparkles className="w-4 h-4 text-violet-400" />
              </div>
              <h2 className="text-2xl font-bold text-slate-100">AI Game Advisor</h2>
            </div>
            <p className="text-slate-500 mb-6 leading-relaxed text-sm">
              Describe your mood, what you&apos;ve been playing, or what kind of
              experience you want. GPT-4o will find your perfect match.
            </p>
            <AIChat />
          </div>

          {/* Right: Features */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-200 mb-6">Why PixelVerse AI?</h3>
            {[
              {
                icon: "🔒",
                title: "100% Private",
                desc: "Powered by GitHub Models. Your queries stay secure.",
              },
              {
                icon: "🧠",
                title: "Context-Aware",
                desc: "Understands your gaming history, mood, and preferences.",
              },
              {
                icon: "⚡",
                title: "Instant Results",
                desc: "GPT-4o-mini delivers fast, accurate recommendations.",
              },
              {
                icon: "🎮",
                title: "Gamer-First",
                desc: "Built by gamers. Understands genres, mechanics, and vibes.",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="flex gap-4 p-4 rounded-xl border border-white/[0.06] transition-all hover:border-violet-500/25"
                style={{ background: "rgba(13,13,20,0.7)", backdropFilter: "blur(12px)" }}
              >
                <span className="text-xl flex-shrink-0 mt-0.5">{feature.icon}</span>
                <div>
                  <p className="font-semibold text-slate-200 text-sm mb-1">{feature.title}</p>
                  <p className="text-slate-500 text-sm">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Divider */}
      <SectionDivider />

      {/* Decision Engine Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="flex items-center gap-3 mb-8">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.2)" }}
          >
            <Zap className="w-4 h-4 text-violet-400" />
          </div>
          <h2 className="text-2xl font-bold text-slate-100">AI Decision Engine</h2>
          <span
            className="px-2.5 py-0.5 rounded-full text-xs font-semibold text-violet-300 border border-violet-500/20"
            style={{ background: "rgba(124,58,237,0.08)" }}
          >
            New
          </span>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          <DecisionEngine />
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-200">How it works</h3>
            {[
              { step: "01", title: "Set your constraints", desc: "Tell us how much time you have, your current mood, and what device you're on." },
              { step: "02", title: "AI analyzes your profile", desc: "GPT-4o-mini cross-references your inputs against our game database to find the perfect match." },
              { step: "03", title: "Get your recommendation", desc: "Receive a tailored game pick with a match score and explanation — no generic answers." },
            ].map((item) => (
              <div
                key={item.step}
                className="flex gap-4 p-4 rounded-xl border border-white/[0.06]"
                style={{ background: "rgba(13,13,20,0.7)", backdropFilter: "blur(12px)" }}
              >
                <span
                  className="text-xs font-black w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(124,58,237,0.15)", color: "#a78bfa", border: "1px solid rgba(124,58,237,0.2)" }}
                >
                  {item.step}
                </span>
                <div>
                  <p className="font-semibold text-slate-200 text-sm mb-1">{item.title}</p>
                  <p className="text-slate-500 text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
