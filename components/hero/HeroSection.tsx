"use client";
import React, { useEffect, useRef, useState } from "react";
import HeroVideoBackground from "./HeroVideoBackground";
import { HERO_SLIDES } from "../../data/games.mock";
import { gsap } from "../../lib/gsapSetup";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "./HeroSection.css";

function CountUpNumber({ value }: { value: number }) {
  const [displayValue, setDisplayValue] = useState(0);
  const obj = useRef({ val: 0 });

  useEffect(() => {
    gsap.to(obj.current, {
      val: value,
      duration: 1.5,
      ease: "cinematic",
      onUpdate: () => {
        const val = obj.current.val;
        if (value <= 10) setDisplayValue(Number(val.toFixed(1)));
        else setDisplayValue(Math.round(val));
      }
    });
  }, [value]);

  return <span className="score-numeral">{displayValue}</span>;
}

export default function HeroSection() {
  const contentRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const activeSlide = HERO_SLIDES[activeIndex];

  const handleNext = () => setActiveIndex((prev) => (prev + 1) % HERO_SLIDES.length);
  const handlePrev = () => setActiveIndex((prev) => (prev === 0 ? HERO_SLIDES.length - 1 : prev - 1));

  // Auto-scroll logic (resets timer on manual change)
  useEffect(() => {
    const interval = setInterval(handleNext, 10000); // 10 seconds per slide
    return () => clearInterval(interval);
  }, [activeIndex]);

  // Entrance animation for content when slide changes
  useEffect(() => {
    if (!contentRef.current) return;
    gsap.fromTo(
      contentRef.current.children,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1.2, stagger: 0.1, ease: "cinematic" }
    );
  }, [activeIndex]);

  return (
    <section className="hero-section">
      {/* Video Background */}
      <HeroVideoBackground 
        youtubeId={activeSlide.youtubeId!} 
        accentTheme={activeSlide.accentTheme} 
      />
      
      {/* Navigation Arrows */}
      <button className="hero-nav-btn hero-nav-prev" onClick={handlePrev} aria-label="Previous Slide">
        <ChevronLeft size={48} strokeWidth={1.5} />
      </button>
      <button className="hero-nav-btn hero-nav-next" onClick={handleNext} aria-label="Next Slide">
        <ChevronRight size={48} strokeWidth={1.5} />
      </button>

      {/* Gradients to blend video with the page background */}
      <div className="hero-gradient hero-gradient--bottom" />
      <div className="hero-gradient hero-gradient--left" />
      
      {/* HUD Content */}
      <div className="hero-content" ref={contentRef}>
        <span className="hero-eyebrow" style={{ borderColor: activeSlide.accentTheme.color, color: activeSlide.accentTheme.color }}>
          {activeSlide.tag}
        </span>
        <h1 className="hero-title">{activeSlide.title}</h1>
        <p className="hero-desc">{activeSlide.description}</p>
        
        <div className="hero-scores" style={{ display: 'flex', gap: 'var(--space-8)', marginBottom: 'var(--space-8)' }}>
          <div className="hero-score-block">
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: 'var(--tracking-widest)' }}>Critic</span>
            <div style={{ fontSize: 'var(--text-3xl)', color: 'var(--score-green-400)', fontWeight: 700 }}>
              <CountUpNumber value={activeSlide.criticScore} />
            </div>
          </div>
          <div className="hero-score-block">
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: 'var(--tracking-widest)' }}>User</span>
            <div style={{ fontSize: 'var(--text-3xl)', color: 'var(--info-500)', fontWeight: 700 }}>
              <CountUpNumber value={activeSlide.userScore} />
            </div>
          </div>
        </div>

        <div className="hero-actions">
          <button className="btn-primary-glow" style={{ background: `linear-gradient(135deg, ${activeSlide.accentTheme.color}, ${activeSlide.accentTheme.glow})`, boxShadow: `0 0 0 1px rgba(255,255,255,0.1), 0 0 24px ${activeSlide.accentTheme.color}40` }}>
            Play Now
          </button>
          <button className="btn-ghost">View Trailer</button>
        </div>
      </div>

      {/* Carousel Controls */}
      <div className="hero-carousel-controls" style={{ position: 'absolute', bottom: 'var(--space-10)', right: 'var(--space-10)', zIndex: 10, display: 'flex', gap: '12px' }}>
        {HERO_SLIDES.map((slide, idx) => (
          <button
            key={slide.id}
            onClick={() => setActiveIndex(idx)}
            style={{
              width: activeIndex === idx ? '32px' : '8px',
              height: '8px',
              borderRadius: '4px',
              background: activeIndex === idx ? slide.accentTheme.color : 'rgba(255,255,255,0.2)',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.4s var(--ease-signature)',
            }}
            aria-label={`Go to ${slide.title}`}
          />
        ))}
      </div>
    </section>
  );
}
