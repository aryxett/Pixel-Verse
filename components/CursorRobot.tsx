"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useSpring, useTransform } from "framer-motion";

const MESSAGES = [
  "Greetings, Gamer! Need a recommendation? Ask the AI below! 🤖🎮",
  "I'm tracking your cursor! It tickles! 😂",
  "Is your backlog too big? Let's pick a game to play today! 📚",
  "My sensors detect high levels of gaming potential here! ⚡",
  "Analyzing rawg database... 890,000+ games processed. 🧠",
  "Remember to log in to save your game reviews and ratings! 🔑",
];

export default function CursorRobot() {
  const [bubbleText, setBubbleText] = useState("");
  const [bubbleOpen, setBubbleOpen] = useState(false);
  const [msgIndex, setMsgIndex] = useState(0);
  const robotRef = useRef<HTMLDivElement>(null);

  // Framer Motion spring values for smooth, organic tracking
  const springConfig = { stiffness: 150, damping: 18, mass: 0.8 };
  const mouseX = useSpring(0, springConfig);
  const mouseY = useSpring(0, springConfig);

  // Map mouse offsets to small 3D rotations and eye translations
  const headRotateY = useTransform(mouseX, [-200, 200], [-18, 18]);
  const headRotateX = useTransform(mouseY, [-200, 200], [12, -12]);
  
  const eyeX = useTransform(mouseX, [-200, 200], [-5, 5]);
  const eyeY = useTransform(mouseY, [-200, 200], [-4, 4]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!robotRef.current) return;
      const rect = robotRef.current.getBoundingClientRect();
      const robotCenterX = rect.left + rect.width / 2;
      const robotCenterY = rect.top + rect.height / 2;

      // Calculate distance between cursor and robot center
      const dx = e.clientX - robotCenterX;
      const dy = e.clientY - robotCenterY;

      // Scale coordinates to be fed into transforms
      mouseX.set(dx);
      mouseY.set(dy);
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Initial greeting bubble after 2 seconds
    const greetingTimer = setTimeout(() => {
      setBubbleText(MESSAGES[0]);
      setBubbleOpen(true);
    }, 2000);

    // Hide initial greeting after 6 seconds
    const hideTimer = setTimeout(() => {
      setBubbleOpen(false);
    }, 8000);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      clearTimeout(greetingTimer);
      clearTimeout(hideTimer);
    };
  }, [mouseX, mouseY]);

  const handleRobotClick = () => {
    const nextIdx = (msgIndex + 1) % MESSAGES.length;
    setMsgIndex(nextIdx);
    setBubbleText(MESSAGES[nextIdx]);
    setBubbleOpen(true);

    // Auto close bubble after 5 seconds
    setTimeout(() => {
      setBubbleOpen(false);
    }, 5000);
  };

  return (
    <div
      ref={robotRef}
      className="fixed bottom-6 right-6 z-40 flex flex-col items-end pointer-events-none"
      style={{ perspective: 1000 }}
    >
      {/* Speech Bubble */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 10 }}
        animate={{
          opacity: bubbleOpen ? 1 : 0,
          scale: bubbleOpen ? 1 : 0.8,
          y: bubbleOpen ? 0 : 10,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="mb-3 max-w-[220px] bg-slate-950/90 border border-violet-500/35 text-slate-200 text-xs px-4 py-2.5 rounded-2xl shadow-xl shadow-violet-950/20 backdrop-blur-md relative pointer-events-auto cursor-pointer"
        onClick={() => setBubbleOpen(false)}
      >
        <p className="leading-relaxed font-medium">{bubbleText}</p>
        {/* Triangle arrow */}
        <div className="absolute right-6 -bottom-1.5 w-3 h-3 bg-slate-950 border-r border-b border-violet-500/35 rotate-45" />
      </motion.div>

      {/* Floating Robot Body */}
      <motion.div
        animate={{
          y: [0, -6, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className="w-20 h-24 pointer-events-auto cursor-pointer flex items-center justify-center"
        onClick={handleRobotClick}
        title="Click me for a tip!"
      >
        <motion.div
          style={{
            rotateY: headRotateY,
            rotateX: headRotateX,
            transformStyle: "preserve-3d",
          }}
          className="w-full h-full relative"
        >
          <svg
            viewBox="0 0 100 120"
            className="w-full h-full drop-shadow-[0_0_15px_rgba(124,58,237,0.35)]"
          >
            <defs>
              <linearGradient id="botGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1e1e38" />
                <stop offset="100%" stopColor="#0d0d1e" />
              </linearGradient>
              <linearGradient id="glowGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>
            </defs>

            {/* Jetpack/Engine Flame below */}
            <motion.path
              animate={{
                scaleY: [1, 1.4, 0.9, 1.2, 1],
                opacity: [0.7, 1, 0.6, 0.9, 0.7],
              }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              d="M 45 92 Q 50 115 55 92 Z"
              fill="url(#glowGrad)"
            />

            {/* Jetpack Nozzle */}
            <rect x="44" y="86" width="12" height="8" rx="2" fill="#2d2d44" stroke="#181825" strokeWidth="1" />

            {/* Left Ear Antenna */}
            <path d="M 15 50 Q 8 40 12 35" stroke="#7c3aed" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <circle cx="11" cy="34" r="3" fill="#06b6d4" />

            {/* Right Ear Antenna */}
            <path d="M 85 50 Q 92 40 88 35" stroke="#7c3aed" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <circle cx="89" cy="34" r="3" fill="#06b6d4" />

            {/* Central Top Antenna */}
            <line x1="50" y1="26" x2="50" y2="10" stroke="#7c3aed" strokeWidth="3" />
            <motion.circle
              cx="50"
              cy="10"
              r="4"
              fill="#ec4899"
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />

            {/* Main Head Body */}
            <rect
              x="18"
              y="26"
              width="64"
              height="60"
              rx="24"
              fill="url(#botGrad)"
              stroke="url(#glowGrad)"
              strokeWidth="2"
            />

            {/* Screen Faceplate */}
            <rect
              x="25"
              y="37"
              width="50"
              height="38"
              rx="12"
              fill="#07070d"
              stroke="#1f1f3a"
              strokeWidth="1.5"
            />

            {/* Eye tracking group */}
            <motion.g style={{ x: eyeX, y: eyeY }}>
              {/* Left Eye */}
              <ellipse cx="38" cy="53" rx="5" ry="6" fill="#06b6d4" />
              <circle cx="36.5" cy="51" r="1.5" fill="#ffffff" />

              {/* Right Eye */}
              <ellipse cx="62" cy="53" rx="5" ry="6" fill="#06b6d4" />
              <circle cx="60.5" cy="51" r="1.5" fill="#ffffff" />
            </motion.g>

            {/* Mouth LED Matrix */}
            <motion.path
              animate={{
                d: [
                  "M 44 67 Q 50 67 56 67", // straight
                  "M 44 66 Q 50 71 56 66", // smile
                  "M 44 67 Q 50 67 56 67", // straight
                  "M 45 68 Q 50 65 55 68", // slight frown
                ],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                repeatType: "mirror",
                ease: "easeInOut",
              }}
              stroke="#06b6d4"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />

            {/* Subtle reflection on the screen */}
            <path
              d="M 28 40 L 45 40 L 32 72 L 28 72 Z"
              fill="#ffffff"
              opacity="0.03"
            />
          </svg>
        </motion.div>
      </motion.div>
    </div>
  );
}
