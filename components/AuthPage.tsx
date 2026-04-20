"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { signIn } from "next-auth/react";
import {
  Gamepad2, Eye, EyeOff, Mail, Lock, User,
  ArrowRight, Sparkles, Zap, Shield,
} from "lucide-react";

interface Props { mode: "login" | "register" }

/* ── Official Google SVG logo ── */
function GoogleLogo() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5 flex-shrink-0">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

/* ── Official Discord SVG logo ── */
function DiscordLogo() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5 flex-shrink-0" fill="#5865F2">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.043.03.056a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
    </svg>
  );
}

export default function AuthPage({ mode }: Props) {
  const [showPass, setShowPass]       = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [email, setEmail]             = useState("");
  const [password, setPassword]       = useState("");
  const [username, setUsername]       = useState("");
  const [confirm, setConfirm]         = useState("");
  const [loading, setLoading]         = useState(false);
  const [focused, setFocused]         = useState<string | null>(null);

  const isLogin = mode === "login";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-4 py-16">

      {/* ── Animated background ── */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.25, 0.45, 0.25], x: [0, 30, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(124,58,237,0.22) 0%, transparent 70%)", filter: "blur(70px)" }}
        />
        <motion.div
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.35, 0.2], x: [0, -20, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(6,182,212,0.18) 0%, transparent 70%)", filter: "blur(70px)" }}
        />
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.12, 0.25, 0.12] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 4 }}
          className="absolute top-1/2 right-1/3 w-[300px] h-[300px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(236,72,153,0.15) 0%, transparent 70%)", filter: "blur(60px)" }}
        />
      </div>

      {/* Grid */}
      <div className="absolute inset-0 grid-pattern opacity-25 pointer-events-none" />

      {/* ── Card ── */}
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.93 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-[420px]"
      >
        {/* Outer glow */}
        <motion.div
          animate={{ opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="absolute -inset-1 rounded-[32px]"
          style={{
            background: "linear-gradient(135deg, rgba(124,58,237,0.4), rgba(6,182,212,0.25), rgba(236,72,153,0.2))",
            filter: "blur(12px)",
          }}
        />

        {/* Card body */}
        <div className="relative rounded-[28px] border border-white/[0.09] overflow-hidden"
          style={{ background: "rgba(7,7,14,0.96)", backdropFilter: "blur(28px)" }}>

          {/* Rainbow top bar */}
          <div className="h-[3px] w-full"
            style={{ background: "linear-gradient(90deg, #7c3aed, #06b6d4, #ec4899, #7c3aed)", backgroundSize: "200% 100%" }} />

          <div className="px-8 pt-8 pb-10 space-y-7">

            {/* ── Logo ── */}
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="flex items-center gap-3"
            >
              <motion.div
                whileHover={{ rotate: 10, scale: 1.08 }}
                className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{ background: "linear-gradient(135deg, #7c3aed, #06b6d4)", boxShadow: "0 0 24px rgba(124,58,237,0.55)" }}
              >
                <Gamepad2 className="w-5 h-5 text-white" />
              </motion.div>
              <div>
                <p className="font-black text-xl gradient-text leading-tight">PixelVerse</p>
                <p className="text-xs text-slate-600 font-medium">AI Gaming Assistant</p>
              </div>
            </motion.div>

            {/* ── Heading ── */}
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className="text-[2rem] font-black text-slate-100 leading-tight mb-2">
                {isLogin ? "Welcome back 👋" : "Join PixelVerse 🎮"}
              </h1>
              <p className="text-slate-500 text-sm leading-relaxed">
                {isLogin
                  ? "Sign in to your gaming profile and continue your journey"
                  : "Create your free account and start exploring 900K+ games"}
              </p>
            </motion.div>

            {/* ── Form ── */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">

              <AnimatePresence>
                {!isLogin && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    style={{ overflow: "hidden" }}
                  >
                    <div className="pb-0">
                      <InputField
                        id="username" icon={<User className="w-4 h-4" />}
                        type="text" placeholder="Choose a gamer tag"
                        value={username} onChange={setUsername}
                        focused={focused === "username"}
                        onFocus={() => setFocused("username")}
                        onBlur={() => setFocused(null)}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }}>
                <InputField
                  id="email" icon={<Mail className="w-4 h-4" />}
                  type="email" placeholder="Email address"
                  value={email} onChange={setEmail}
                  focused={focused === "email"}
                  onFocus={() => setFocused("email")}
                  onBlur={() => setFocused(null)}
                />
              </motion.div>

              <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                <InputField
                  id="password" icon={<Lock className="w-4 h-4" />}
                  type={showPass ? "text" : "password"} placeholder="Password"
                  value={password} onChange={setPassword}
                  focused={focused === "password"}
                  onFocus={() => setFocused("password")}
                  onBlur={() => setFocused(null)}
                  rightIcon={
                    <motion.button type="button" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                      onClick={() => setShowPass(!showPass)}
                      className="text-slate-600 hover:text-slate-300 transition-colors p-1 rounded-lg">
                      {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </motion.button>
                  }
                />
              </motion.div>

              <AnimatePresence>
                {!isLogin && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    style={{ overflow: "hidden" }}
                  >
                    <InputField
                      id="confirm" icon={<Shield className="w-4 h-4" />}
                      type={showConfirm ? "text" : "password"} placeholder="Confirm password"
                      value={confirm} onChange={setConfirm}
                      focused={focused === "confirm"}
                      onFocus={() => setFocused("confirm")}
                      onBlur={() => setFocused(null)}
                      rightIcon={
                        <motion.button type="button" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                          onClick={() => setShowConfirm(!showConfirm)}
                          className="text-slate-600 hover:text-slate-300 transition-colors p-1 rounded-lg">
                          {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </motion.button>
                      }
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {isLogin && (
                <div className="flex justify-end pt-0.5">
                  <motion.button type="button" whileHover={{ x: 2 }}
                    className="text-xs text-violet-400 hover:text-violet-300 transition-colors font-medium">
                    Forgot password?
                  </motion.button>
                </div>
              )}

              {/* ── Submit ── */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.38 }}
                className="pt-1"
              >
                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={!loading ? {
                    scale: 1.02, y: -2,
                    boxShadow: "0 0 50px rgba(124,58,237,0.75), 0 0 100px rgba(124,58,237,0.3)",
                  } : {}}
                  whileTap={!loading ? { scale: 0.98 } : {}}
                  className="w-full relative py-4 rounded-2xl font-bold text-white text-base overflow-hidden disabled:opacity-60 disabled:cursor-not-allowed"
                  style={{
                    background: "linear-gradient(135deg, #7c3aed 0%, #6d28d9 50%, #5b21b6 100%)",
                    boxShadow: "0 0 28px rgba(124,58,237,0.5), inset 0 1px 0 rgba(255,255,255,0.12)",
                  }}
                >
                  {/* Shimmer sweep */}
                  {!loading && (
                    <motion.span
                      animate={{ x: ["-120%", "220%"] }}
                      transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 1 }}
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/18 to-transparent skew-x-12 pointer-events-none"
                    />
                  )}
                  {/* Pulse ring */}
                  <motion.span
                    animate={{ scale: [1, 1.04, 1], opacity: [0.6, 0, 0.6] }}
                    transition={{ duration: 2.5, repeat: Infinity }}
                    className="absolute inset-0 rounded-2xl border-2 border-violet-400/50 pointer-events-none"
                  />

                  <span className="relative z-10 flex items-center justify-center gap-2.5">
                    {loading ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                          className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                        />
                        <span>{isLogin ? "Signing in..." : "Creating account..."}</span>
                      </>
                    ) : (
                      <>
                        {isLogin ? <Zap className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
                        <span>{isLogin ? "Sign In" : "Create Account"}</span>
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </span>
                </motion.button>
              </motion.div>
            </form>

            {/* ── Divider ── */}
            <div className="flex items-center gap-4">
              <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.07)" }} />
              <span className="text-xs text-slate-600 font-medium px-1">or continue with</span>
              <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.07)" }} />
            </div>

            {/* ── Social buttons ── */}
            <div className="grid grid-cols-2 gap-3">
              {/* Google */}
              <motion.button
                type="button"
                onClick={() => signIn("google", { callbackUrl: "/" })}
                whileHover={{ scale: 1.03, y: -3, boxShadow: "0 8px 30px rgba(66,133,244,0.25)" }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center justify-center gap-3 py-3.5 rounded-2xl border font-semibold text-sm transition-all"
                style={{
                  borderColor: "rgba(66,133,244,0.25)",
                  background: "rgba(66,133,244,0.06)",
                  color: "#e2e8f0",
                }}
              >
                <GoogleLogo />
                <span>Google</span>
              </motion.button>

              {/* Discord */}
              <motion.button
                type="button"
                onClick={() => signIn("discord", { callbackUrl: "/" })}
                whileHover={{ scale: 1.03, y: -3, boxShadow: "0 8px 30px rgba(88,101,242,0.3)" }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center justify-center gap-3 py-3.5 rounded-2xl border font-semibold text-sm transition-all"
                style={{
                  borderColor: "rgba(88,101,242,0.3)",
                  background: "rgba(88,101,242,0.08)",
                  color: "#e2e8f0",
                }}
              >
                <DiscordLogo />
                <span>Discord</span>
              </motion.button>
            </div>

            {/* ── Switch mode ── */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.55 }}
              className="text-center text-sm text-slate-600 pt-1"
            >
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <Link
                href={isLogin ? "/register" : "/login"}
                className="text-violet-400 hover:text-violet-300 font-bold transition-colors"
              >
                {isLogin ? "Sign up free →" : "Sign in →"}
              </Link>
            </motion.p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function InputField({
  id, icon, type, placeholder, value, onChange,
  focused, onFocus, onBlur, rightIcon,
}: {
  id: string;
  icon: React.ReactNode;
  type: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  focused: boolean;
  onFocus: () => void;
  onBlur: () => void;
  rightIcon?: React.ReactNode;
}) {
  return (
    <motion.div
      animate={{
        boxShadow: focused
          ? "0 0 0 2px rgba(124,58,237,0.5), 0 0 24px rgba(124,58,237,0.18)"
          : "0 0 0 1px rgba(255,255,255,0.07)",
        scale: focused ? 1.01 : 1,
      }}
      transition={{ duration: 0.2 }}
      className="flex items-center gap-3.5 px-4 py-3.5 rounded-2xl"
      style={{ background: "rgba(15,15,25,0.85)" }}
    >
      <motion.span
        animate={{ color: focused ? "#a78bfa" : "#475569" }}
        transition={{ duration: 0.2 }}
        className="flex-shrink-0"
      >
        {icon}
      </motion.span>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={onFocus}
        onBlur={onBlur}
        className="flex-1 bg-transparent text-sm text-slate-200 placeholder-slate-600 outline-none"
        style={{ letterSpacing: type === "password" && value ? "0.15em" : "normal" }}
      />
      {rightIcon}
    </motion.div>
  );
}
