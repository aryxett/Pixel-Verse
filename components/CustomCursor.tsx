"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CustomCursor() {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const trailX  = useMotionValue(-100);
  const trailY  = useMotionValue(-100);

  const springX = useSpring(trailX, { stiffness: 120, damping: 18, mass: 0.5 });
  const springY = useSpring(trailY, { stiffness: 120, damping: 18, mass: 0.5 });

  const [hovered, setHovered]   = useState(false);
  const [clicking, setClicking] = useState(false);
  const [hidden, setHidden]     = useState(false);
  const [label, setLabel]       = useState("");

  useEffect(() => {
    const move = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      trailX.set(e.clientX);
      trailY.set(e.clientY);
    };

    const down  = () => setClicking(true);
    const up    = () => setClicking(false);
    const leave = () => setHidden(true);
    const enter = () => setHidden(false);

    // Detect interactive elements
    const onOver = (e: MouseEvent) => {
      const el = (e.target as HTMLElement).closest(
        "a, button, [role='button'], input, textarea, select, [data-cursor]"
      ) as HTMLElement | null;
      if (el) {
        setHovered(true);
        setLabel(el.dataset.cursor || "");
      } else {
        setHovered(false);
        setLabel("");
      }
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("mousedown", down);
    window.addEventListener("mouseup", up);
    document.addEventListener("mouseleave", leave);
    document.addEventListener("mouseenter", enter);
    window.addEventListener("mouseover", onOver);

    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mousedown", down);
      window.removeEventListener("mouseup", up);
      document.removeEventListener("mouseleave", leave);
      document.removeEventListener("mouseenter", enter);
      window.removeEventListener("mouseover", onOver);
    };
  }, [cursorX, cursorY, trailX, trailY]);

  return (
    <>
      {/* ── Outer ring / trail ── */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none"
        style={{
          x: springX,
          y: springY,
          translateX: "-50%",
          translateY: "-50%",
          zIndex: 99999,
          opacity: hidden ? 0 : 1,
        }}
      >
        <motion.div
          animate={{
            width:  hovered ? 48 : clicking ? 28 : 36,
            height: hovered ? 48 : clicking ? 28 : 36,
            borderColor: hovered
              ? "rgba(167,139,250,0.9)"
              : clicking
              ? "rgba(6,182,212,0.9)"
              : "rgba(124,58,237,0.6)",
            boxShadow: hovered
              ? "0 0 20px rgba(167,139,250,0.5), 0 0 40px rgba(124,58,237,0.2)"
              : clicking
              ? "0 0 16px rgba(6,182,212,0.6)"
              : "0 0 12px rgba(124,58,237,0.3)",
            backgroundColor: hovered
              ? "rgba(124,58,237,0.08)"
              : "transparent",
          }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          className="rounded-full border-2"
        />
        {/* Label on hover */}
        {label && (
          <motion.span
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-full left-1/2 -translate-x-1/2 mt-2 text-[10px] font-black tracking-widest uppercase text-violet-300 whitespace-nowrap"
            style={{ textShadow: "0 0 10px rgba(124,58,237,0.8)" }}
          >
            {label}
          </motion.span>
        )}
      </motion.div>

      {/* ── Inner dot — crosshair style ── */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
          zIndex: 100000,
          opacity: hidden ? 0 : 1,
        }}
      >
        <motion.div
          animate={{
            width:  clicking ? 6 : hovered ? 5 : 4,
            height: clicking ? 6 : hovered ? 5 : 4,
            backgroundColor: hovered
              ? "#a78bfa"
              : clicking
              ? "#06b6d4"
              : "#7c3aed",
            boxShadow: hovered
              ? "0 0 10px #a78bfa, 0 0 20px rgba(124,58,237,0.5)"
              : "0 0 8px rgba(124,58,237,0.8)",
          }}
          transition={{ duration: 0.1 }}
          className="rounded-full"
        />

        {/* Crosshair lines — only on hover */}
        {hovered && (
          <>
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              className="absolute top-1/2 -translate-y-1/2 h-px w-4 -left-5"
              style={{ background: "rgba(167,139,250,0.6)" }}
            />
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              className="absolute top-1/2 -translate-y-1/2 h-px w-4 left-3"
              style={{ background: "rgba(167,139,250,0.6)" }}
            />
            <motion.div
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              className="absolute left-1/2 -translate-x-1/2 w-px h-4 -top-5"
              style={{ background: "rgba(167,139,250,0.6)" }}
            />
            <motion.div
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              className="absolute left-1/2 -translate-x-1/2 w-px h-4 top-3"
              style={{ background: "rgba(167,139,250,0.6)" }}
            />
          </>
        )}
      </motion.div>
    </>
  );
}
