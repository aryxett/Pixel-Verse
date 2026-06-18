"use client";

import React, { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "../lib/gsapSetup";
import { Gamepad2 as GamepadIcon, Moon as MoonIcon } from "lucide-react";
import "./Navbar.css";

export default function Navbar() {
  const navRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const trigger = ScrollTrigger.create({
      start: "top top",
      end: "+=60",
      scrub: true,
      onUpdate: (self) => {
        if (!navRef.current || !logoRef.current) return;
        gsap.to(navRef.current, {
          height: gsap.utils.interpolate(88, 64, self.progress),
          backgroundColor: self.progress > 0 ? "var(--surface-glass)" : "transparent",
          backdropFilter: self.progress > 0 ? "blur(20px) saturate(140%)" : "none",
          borderBottomColor: self.progress > 0 ? "var(--border-subtle)" : "transparent",
          duration: 0.1,
          overwrite: "auto",
        });
        gsap.to(logoRef.current, {
          scale: gsap.utils.interpolate(1, 0.88, self.progress),
          overwrite: "auto",
        });
      },
    });
    return () => {
      trigger.kill();
    };
  }, []);

  return (
    <nav ref={navRef} className="navbar">
      <div ref={logoRef} className="navbar__logo">
        <GamepadIcon size={22} />
        <div>
          <span className="navbar__logo-name">PixelVerse</span>
          <span className="navbar__logo-tag">AI GAMING</span>
        </div>
      </div>
      <ul className="navbar__links">
        {["Home", "Explore", "Profile"].map((link) => (
          <li key={link} className="navbar__link-item">
            <a href={`#${link.toLowerCase()}`}>
              {link}
              <span className="navbar__link-underline" />
            </a>
          </li>
        ))}
      </ul>
      <div className="navbar__actions">
        <button className="btn-ghost-sm">Log In</button>
        <button className="btn-primary-glow btn-primary-glow--sm">Sign Up</button>
        <button className="navbar__theme-toggle" aria-label="Toggle theme">
          <MoonIcon size={18} />
        </button>
      </div>
    </nav>
  );
}
