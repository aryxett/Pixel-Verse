"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Link from "next/link";
import { Sparkles, ChevronRight, Zap } from "lucide-react";

/* ─────────────────────────────────────────
   WebGL-style volumetric canvas
   — light beams, fog layers, floating dust
───────────────────────────────────────── */
function AtmosphericCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf: number;
    let W = (canvas.width = window.innerWidth);
    let H = (canvas.height = window.innerHeight);
    window.addEventListener("resize", () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    });

    // Dust particles
    const dust = Array.from({ length: 180 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.2 + 0.2,
      vx: (Math.random() - 0.5) * 0.15,
      vy: -Math.random() * 0.3 - 0.05,
      a: Math.random() * 0.4 + 0.05,
      c: Math.random() > 0.6 ? "124,58,237" : Math.random() > 0.5 ? "6,182,212" : "236,72,153",
    }));

    // Light beams
    const beams = [
      { x: 0.25, angle: -0.18, w: 220, rgb: "124,58,237", a: 0.07 },
      { x: 0.5,  angle:  0.0,  w: 300, rgb: "6,182,212",  a: 0.05 },
      { x: 0.78, angle:  0.15, w: 180, rgb: "124,58,237", a: 0.06 },
    ];

    // Fog orbs
    const orbs = [
      { bx: 0.15, by: 0.55, r: 500, rgb: "124,58,237", a: 0.12, sp: 0.00035 },
      { bx: 0.85, by: 0.35, r: 420, rgb: "6,182,212",  a: 0.09, sp: 0.00028 },
      { bx: 0.5,  by: 0.9,  r: 380, rgb: "236,72,153", a: 0.07, sp: 0.00045 },
      { bx: 0.5,  by: 0.1,  r: 600, rgb: "124,58,237", a: 0.06, sp: 0.0002  },
    ];

    let t = 0;

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      t++;

      // ── Deep background gradient ──
      const bg = ctx.createLinearGradient(0, 0, 0, H);
      bg.addColorStop(0,   "rgba(2,2,8,1)");
      bg.addColorStop(0.5, "rgba(5,3,14,1)");
      bg.addColorStop(1,   "rgba(2,2,8,1)");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      // ── Fog orbs ──
      orbs.forEach((o, i) => {
        const ox = o.bx * W + Math.sin(t * o.sp + i * 1.8) * 80;
        const oy = o.by * H + Math.cos(t * o.sp * 0.7 + i * 2.3) * 60;
        const g = ctx.createRadialGradient(ox, oy, 0, ox, oy, o.r);
        g.addColorStop(0,   `rgba(${o.rgb},${o.a})`);
        g.addColorStop(0.4, `rgba(${o.rgb},${o.a * 0.5})`);
        g.addColorStop(1,   `rgba(${o.rgb},0)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(ox, oy, o.r, 0, Math.PI * 2);
        ctx.fill();
      });

      // ── Light beams from top ──
      beams.forEach((b) => {
        const bx = b.x * W;
        const pulse = 1 + Math.sin(t * 0.008) * 0.15;
        ctx.save();
        ctx.translate(bx, 0);
        ctx.rotate(b.angle);
        const g = ctx.createLinearGradient(0, 0, 0, H * 0.85);
        g.addColorStop(0,   `rgba(${b.rgb},${b.a * pulse})`);
        g.addColorStop(0.5, `rgba(${b.rgb},${b.a * 0.4 * pulse})`);
        g.addColorStop(1,   `rgba(${b.rgb},0)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.moveTo(-b.w / 2, 0);
        ctx.lineTo(b.w / 2, 0);
        ctx.lineTo(b.w * 1.8, H * 0.85);
        ctx.lineTo(-b.w * 1.8, H * 0.85);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      });

      // ── Horizontal scan line ──
      const scanY = ((t * 0.4) % (H + 40)) - 20;
      const sg = ctx.createLinearGradient(0, scanY - 1, 0, scanY + 1);
      sg.addColorStop(0,   "rgba(124,58,237,0)");
      sg.addColorStop(0.5, "rgba(124,58,237,0.35)");
      sg.addColorStop(1,   "rgba(124,58,237,0)");
      ctx.fillStyle = sg;
      ctx.fillRect(0, scanY - 1, W, 2);

      // ── Grid ──
      ctx.strokeStyle = "rgba(124,58,237,0.04)";
      ctx.lineWidth = 1;
      const gs = 70;
      for (let x = 0; x < W; x += gs) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
      }
      for (let y = 0; y < H; y += gs) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
      }

      // ── Dust ──
      dust.forEach((p) => {
        p.x += p.vx; p.y += p.vy;
        if (p.y < -5) { p.y = H + 5; p.x = Math.random() * W; }
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.c},${p.a})`;
        ctx.fill();
      });

      // ── Particle connections ──
      for (let i = 0; i < dust.length; i += 2) {
        for (let j = i + 2; j < dust.length; j += 2) {
          const dx = dust[i].x - dust[j].x;
          const dy = dust[i].y - dust[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 90) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(124,58,237,${0.06 * (1 - d / 90)})`;
            ctx.lineWidth = 0.4;
            ctx.moveTo(dust[i].x, dust[i].y);
            ctx.lineTo(dust[j].x, dust[j].y);
            ctx.stroke();
          }
        }
      }

      raf = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ zIndex: 0, pointerEvents: "none" }}
    />
  );
}

/* ─────────────────────────────────────────
   Floating stat badge
───────────────────────────────────────── */
function StatBadge({
  value, label, color, delay, pos,
}: {
  value: string; label: string; color: string;
  delay: number; pos: React.CSSProperties;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.85 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="absolute hidden xl:block"
      style={{ zIndex: 20, ...pos }}
    >
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 3 + delay, repeat: Infinity, ease: "easeInOut" }}
        className="px-4 py-3 rounded-2xl border backdrop-blur-xl"
        style={{
          background: "rgba(5,5,12,0.85)",
          borderColor: `${color}30`,
          boxShadow: `0 0 30px ${color}18, 0 8px 32px rgba(0,0,0,0.6)`,
        }}
      >
        <p className="text-base font-black text-white leading-none">{value}</p>
        <p className="text-[10px] font-semibold mt-0.5" style={{ color: `${color}cc` }}>{label}</p>
        <div className="absolute top-0 left-0 right-0 h-px rounded-t-2xl"
          style={{ background: `linear-gradient(90deg, transparent, ${color}60, transparent)` }} />
      </motion.div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────
   Main Hero
───────────────────────────────────────── */
export default function HeroSection() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const sX = useSpring(mouseX, { stiffness: 30, damping: 20 });
  const sY = useSpring(mouseY, { stiffness: 30, damping: 20 });
  const rX = useTransform(sY, [-500, 500], [3, -3]);
  const rY = useTransform(sX, [-500, 500], [-3, 3]);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      mouseX.set(e.clientX - window.innerWidth / 2);
      mouseY.set(e.clientY - window.innerHeight / 2);
    };
    window.addEventListener("mousemove", h);
    return () => window.removeEventListener("mousemove", h);
  }, [mouseX, mouseY]);

  return (
    <section
      className="relative flex items-center justify-center overflow-hidden"
      style={{ minHeight: "100svh" }}
    >
      {/* Atmospheric WebGL-style canvas */}
      <AtmosphericCanvas />

      {/* Radial vignette */}
      <div className="absolute inset-0 pointer-events-none" style={{
        zIndex: 1,
        background: "radial-gradient(ellipse 80% 70% at 50% 50%, transparent 20%, rgba(2,2,8,0.7) 100%)",
      }} />

      {/* Bottom fade into page */}
      <div className="absolute bottom-0 left-0 right-0 h-48 pointer-events-none" style={{
        zIndex: 2,
        background: "linear-gradient(to top, #050508 0%, transparent 100%)",
      }} />

      {/* Floating stat badges */}
      <StatBadge value="900K+" label="Games Indexed"    color="#7c3aed" delay={1.2} pos={{ left: "4%",  top: "28%" }} />
      <StatBadge value="Live"  label="Price Tracking"   color="#06b6d4" delay={1.4} pos={{ left: "4%",  top: "58%" }} />
      <StatBadge value="GPT-4o" label="AI Engine"       color="#a78bfa" delay={1.6} pos={{ right: "4%", top: "22%" }} />
      <StatBadge value="Free"  label="Always Free"      color="#ec4899" delay={1.8} pos={{ right: "4%", top: "62%" }} />

      {/* ── Main content ── */}
      <motion.div
        style={{ rotateX: rX, rotateY: rY, transformStyle: "preserve-3d", zIndex: 10 }}
        className="relative text-center px-4 max-w-6xl mx-auto"
      >
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="flex justify-center mb-8"
        >
          <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full border text-xs font-bold tracking-[0.15em] uppercase"
            style={{
              background: "rgba(124,58,237,0.08)",
              borderColor: "rgba(124,58,237,0.3)",
              color: "#a78bfa",
              backdropFilter: "blur(12px)",
              boxShadow: "0 0 30px rgba(124,58,237,0.15)",
            }}
          >
            <motion.span
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1.5 h-1.5 rounded-full bg-violet-400"
              style={{ boxShadow: "0 0 8px #a78bfa" }}
            />
            <Sparkles className="w-3.5 h-3.5" />
            AI-Powered Game Discovery
          </div>
        </motion.div>

        {/* ── MASSIVE headline — EV2 style ── */}
        <div className="overflow-hidden mb-2">
          <motion.div
            initial={{ y: "110%" }}
            animate={{ y: 0 }}
            transition={{ delay: 0.1, duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="font-black tracking-tighter text-white"
            style={{ fontSize: "clamp(3.5rem, 11vw, 9rem)", lineHeight: 0.88, letterSpacing: "-0.03em" }}
          >
            DISCOVER
          </motion.div>
        </div>
        <div className="overflow-hidden mb-2">
          <motion.div
            initial={{ y: "110%" }}
            animate={{ y: 0 }}
            transition={{ delay: 0.2, duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="font-black tracking-tighter"
            style={{
              fontSize: "clamp(3.5rem, 11vw, 9rem)",
              lineHeight: 0.88,
              letterSpacing: "-0.03em",
              background: "linear-gradient(135deg, #a78bfa 0%, #06b6d4 50%, #ec4899 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              filter: "drop-shadow(0 0 60px rgba(124,58,237,0.6))",
            }}
          >
            YOUR GAME
          </motion.div>
        </div>
        <div className="overflow-hidden mb-10">
          <motion.div
            initial={{ y: "110%" }}
            animate={{ y: 0 }}
            transition={{ delay: 0.3, duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="font-black tracking-tighter text-white/20"
            style={{ fontSize: "clamp(3.5rem, 11vw, 9rem)", lineHeight: 0.88, letterSpacing: "-0.03em" }}
          >
            UNIVERSE
          </motion.div>
        </div>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="text-slate-400 max-w-xl mx-auto mb-10 leading-relaxed"
          style={{ fontSize: "clamp(0.9rem, 1.8vw, 1.05rem)" }}
        >
          Real-time prices, AI recommendations, trailers and Metacritic scores
          for <span className="text-violet-300 font-semibold">900,000+ games</span> — all in one futuristic dashboard.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.7 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
        >
          {/* Primary */}
          <Link href="/explore">
            <motion.button
              whileHover={{ scale: 1.04, y: -3 }}
              whileTap={{ scale: 0.97 }}
              className="group relative flex items-center justify-center gap-3 px-10 py-4 rounded-xl font-bold text-white text-sm tracking-wide overflow-hidden"
              style={{
                background: "linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)",
                boxShadow: "0 0 40px rgba(124,58,237,0.5), inset 0 1px 0 rgba(255,255,255,0.15)",
                letterSpacing: "0.06em",
              }}
            >
              {/* Shimmer */}
              <motion.span
                animate={{ x: ["-120%", "220%"] }}
                transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 2 }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent skew-x-12 pointer-events-none"
              />
              <Sparkles className="w-4 h-4 relative z-10" />
              <span className="relative z-10 uppercase tracking-widest text-xs font-black">Explore Games</span>
              <ChevronRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </Link>

          {/* Secondary */}
          <Link href="#ai-chat">
            <motion.button
              whileHover={{ scale: 1.04, y: -3, boxShadow: "0 0 30px rgba(6,182,212,0.35)" }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center justify-center gap-3 px-10 py-4 rounded-xl font-black text-xs tracking-widest uppercase"
              style={{
                background: "rgba(6,182,212,0.06)",
                border: "1px solid rgba(6,182,212,0.3)",
                color: "#67e8f9",
                letterSpacing: "0.1em",
              }}
            >
              <Zap className="w-4 h-4" />
              Ask the AI
            </motion.button>
          </Link>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          className="flex items-center justify-center gap-8 sm:gap-12"
        >
          {[
            { value: "900K+",   label: "Games" },
            { value: "GPT-4o",  label: "AI Model" },
            { value: "Live",    label: "Prices" },
            { value: "Free",    label: "Forever" },
          ].map(({ value, label }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.15 + i * 0.08 }}
              className="text-center"
            >
              <p className="text-lg font-black text-white leading-none">{value}</p>
              <p className="text-[10px] text-slate-600 font-semibold tracking-widest uppercase mt-1">{label}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer"
        style={{ zIndex: 10 }}
        onClick={() => window.scrollTo({ top: window.innerHeight, behavior: "smooth" })}
      >
        <span className="text-[9px] text-slate-700 font-bold tracking-[0.25em] uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 7, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="w-5 h-8 rounded-full border border-slate-800 flex items-start justify-center pt-1.5"
        >
          <motion.div
            animate={{ height: ["8px", "3px", "8px"], opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-0.5 rounded-full bg-violet-500"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
