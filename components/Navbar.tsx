"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Gamepad2, Compass, User, Zap, Menu, X, LogOut, BookOpen } from "lucide-react";
import { clsx } from "clsx";
import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import LibraryOverlay from "@/components/LibraryOverlay";

const navLinks = [
  { href: "/",        label: "Home",    icon: Zap },
  { href: "/explore", label: "Explore", icon: Compass },
  { href: "/profile", label: "Profile", icon: User },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen]     = useState(false);
  const [libraryOpen, setLibraryOpen]   = useState(false);
  const [mounted, setMounted]           = useState(false);
  const { data: session }               = useSession();

  useEffect(() => { setMounted(true); }, []);

  if (!mounted) {
    return (
      <header className="sticky top-0 z-50 h-16 border-b border-white/[0.06] bg-[#050508]/80 backdrop-blur-2xl">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/60 to-transparent" />
      </header>
    );
  }

  return (
    <>
      <LibraryOverlay open={libraryOpen} onClose={() => setLibraryOpen(false)} />

      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="sticky top-0 z-50"
      >
        <div className="relative border-b border-white/[0.06] bg-[#050508]/80 backdrop-blur-2xl">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/60 to-transparent" />

          <div className="w-full px-4 sm:px-6 h-16 flex items-center gap-6">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0">
              <motion.div
                whileHover={{ rotate: 15, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
                className="relative w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, #7c3aed, #06b6d4)", boxShadow: "0 0 20px rgba(124,58,237,0.4)" }}
              >
                <Gamepad2 className="w-5 h-5 text-white" />
                <span className="absolute inset-0 rounded-xl ring-1 ring-violet-400/30 group-hover:ring-violet-400/60 transition-all" />
              </motion.div>
              <div>
                <span className="font-black text-lg gradient-text tracking-tight">PixelVerse</span>
                <span className="hidden sm:block text-[10px] text-slate-600 -mt-1 font-medium tracking-widest uppercase">AI Gaming</span>
              </div>
            </Link>

            {/* Nav links */}
            <nav className="hidden md:flex items-center gap-1 flex-1 justify-center">
              {navLinks.map(({ href, label, icon: Icon }) => {
                const active = pathname === href;
                return (
                  <Link key={href} href={href}>
                    <motion.div
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      className={clsx(
                        "relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200",
                        active ? "text-violet-300" : "text-slate-500 hover:text-slate-200"
                      )}
                    >
                      {active && (
                        <motion.span
                          layoutId="nav-pill"
                          className="absolute inset-0 rounded-xl bg-violet-600/15 border border-violet-500/25"
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      )}
                      <Icon className="w-4 h-4 relative z-10" />
                      <span className="relative z-10">{label}</span>
                    </motion.div>
                  </Link>
                );
              })}
            </nav>

            {/* Right */}
            <div className="flex items-center gap-2 ml-auto">
              <div className="hidden sm:flex items-center gap-2">

                {/* ── My Library button ── */}
                <motion.button
                  whileHover={{ scale: 1.04, y: -1 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setLibraryOpen(true)}
                  className="relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition-all overflow-hidden"
                  style={{
                    background: "rgba(124,58,237,0.08)",
                    borderColor: "rgba(124,58,237,0.25)",
                    color: "#a78bfa",
                    boxShadow: "0 0 16px rgba(124,58,237,0.1)",
                  }}
                >
                  {/* Shimmer */}
                  <motion.span
                    animate={{ x: ["-120%", "220%"] }}
                    transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-violet-400/10 to-transparent skew-x-12 pointer-events-none"
                  />
                  <BookOpen className="w-4 h-4 relative z-10" />
                  <span className="relative z-10">My Library</span>
                </motion.button>

                {session ? (
                  <div className="flex items-center gap-2">
                    <div
                      className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-white/[0.07]"
                      style={{ background: "rgba(13,13,20,0.7)" }}
                    >
                      {session.user?.image ? (
                        <img src={session.user.image} alt="avatar"
                          className="w-6 h-6 rounded-full border border-violet-500/30" />
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-violet-600 flex items-center justify-center text-xs font-bold text-white">
                          {session.user?.name?.[0]?.toUpperCase() || "U"}
                        </div>
                      )}
                      <span className="text-sm text-slate-300 font-medium max-w-[100px] truncate">
                        {session.user?.name?.split(" ")[0] || "Gamer"}
                      </span>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className="w-8 h-8 rounded-xl flex items-center justify-center border border-slate-800 text-slate-500 hover:text-red-400 hover:border-red-500/30 transition-all"
                      style={{ background: "rgba(13,13,20,0.7)" }}
                      title="Sign out"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                    </motion.button>
                  </div>
                ) : (
                  <>
                    <Link href="/login">
                      <motion.button
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.96 }}
                        className="px-4 py-2 rounded-xl text-sm font-semibold border transition-all"
                        style={{ borderColor: "rgba(124,58,237,0.35)", color: "#a78bfa", background: "transparent" }}
                      >
                        Log In
                      </motion.button>
                    </Link>
                    <Link href="/register">
                      <motion.button
                        whileHover={{ scale: 1.04, boxShadow: "0 0 24px rgba(124,58,237,0.6)" }}
                        whileTap={{ scale: 0.96 }}
                        className="px-4 py-2 rounded-xl text-sm font-bold text-white relative overflow-hidden"
                        style={{ background: "linear-gradient(135deg, #7c3aed, #6d28d9)", boxShadow: "0 0 16px rgba(124,58,237,0.4)" }}
                      >
                        <motion.span
                          animate={{ x: ["-100%", "200%"] }}
                          transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
                        />
                        <span className="relative z-10">Sign Up</span>
                      </motion.button>
                    </Link>
                  </>
                )}
              </div>

              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-200 border border-slate-800 hover:border-slate-600 transition-colors"
              >
                {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden sticky top-16 z-40 overflow-hidden border-b border-white/[0.06] bg-[#050508]/95 backdrop-blur-2xl"
          >
            <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col gap-1">
              {navLinks.map(({ href, label, icon: Icon }) => {
                const active = pathname === href;
                return (
                  <Link key={href} href={href} onClick={() => setMobileOpen(false)}>
                    <div className={clsx(
                      "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                      active
                        ? "bg-violet-600/15 text-violet-300 border border-violet-500/25"
                        : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                    )}>
                      <Icon className="w-4 h-4" />
                      {label}
                    </div>
                  </Link>
                );
              })}
              <button onClick={() => { setMobileOpen(false); setLibraryOpen(true); }}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-violet-300 hover:bg-violet-500/10 transition-all">
                <BookOpen className="w-4 h-4" />
                My Library
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
