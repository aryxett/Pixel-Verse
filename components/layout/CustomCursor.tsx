"use client";
import React, { useEffect, useRef } from "react";
import { gsap } from "../../lib/gsapSetup";
import "./CustomCursor.css";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Respect reduced motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      if (cursorRef.current) cursorRef.current.style.display = "none";
      if (followerRef.current) followerRef.current.style.display = "none";
      return;
    }
    
    const onMouseMove = (e: MouseEvent) => {
      gsap.to(cursorRef.current, { x: e.clientX, y: e.clientY, duration: 0, ease: "none" });
      gsap.to(followerRef.current, { x: e.clientX, y: e.clientY, duration: 0.15, ease: "signature" });
    };

    const onMouseDown = () => {
      gsap.to(cursorRef.current, { scale: 0.8, duration: 0.1 });
      gsap.to(followerRef.current, { scale: 1.5, opacity: 0.2, duration: 0.2 });
    };

    const onMouseUp = () => {
      gsap.to(cursorRef.current, { scale: 1, duration: 0.1 });
      gsap.to(followerRef.current, { scale: 1, opacity: 1, duration: 0.2 });
    };

    // Initialize position off-screen so it doesn't blink at 0,0
    gsap.set([cursorRef.current, followerRef.current], { x: -100, y: -100 });

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

  return (
    <>
      <div ref={cursorRef} className="custom-cursor-dot" />
      <div ref={followerRef} className="custom-cursor-ring" />
    </>
  );
}
