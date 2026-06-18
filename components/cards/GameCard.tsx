"use client";
import React, { useEffect, useRef } from "react";
import { gsap } from "../../lib/gsapSetup";
import { TrendingUp as TrendingUpIcon, Star as StarIcon, Clock as ClockIcon, Users as UsersIcon } from "lucide-react";
import "./GameCard.css";

// Interface mimicking the structure from games.mock.js
export interface GameType {
  id: string;
  title: string;
  description: string;
  cover: string;
  rating: number;
  aiScore: number;
  playtime: string;
  multiplayer: boolean;
  tags: string[];
  featured?: boolean;
}

export default function GameCard({ game, featured = false, index = 0 }: { game: GameType, featured?: boolean, index?: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  // Scroll-in reveal (staggered by index, NOT all-at-once)
  useEffect(() => {
    if (!cardRef.current) return;
    gsap.fromTo(cardRef.current,
      { opacity: 0, y: 48, rotateZ: index % 2 === 0 ? -1.2 : 1.2 },
      {
        opacity: 1, y: 0, rotateZ: 0, duration: 0.8, ease: "cinematic",
        scrollTrigger: { trigger: cardRef.current, start: "top 88%" },
        delay: (index % 4) * 0.08,
      }
    );
  }, [index]);

  // 3D tilt-on-hover (subtle, max 6deg) — the single highest-impact "premium card" trick
  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!cardRef.current || !imgRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    gsap.to(cardRef.current, {
      rotateY: px * 7, rotateX: -py * 7, scale: 1.02,
      duration: 0.5, ease: "signature", transformPerspective: 900,
    });
    gsap.to(imgRef.current, { x: px * 10, y: py * 10, scale: 1.08, duration: 0.6, ease: "signature" });
  };

  const handleMouseLeave = () => {
    if (!cardRef.current || !imgRef.current) return;
    gsap.to(cardRef.current, { rotateY: 0, rotateX: 0, scale: 1, duration: 0.6, ease: "settle" });
    gsap.to(imgRef.current, { x: 0, y: 0, scale: 1, duration: 0.6, ease: "settle" });
  };

  return (
    <article
      ref={cardRef}
      className={`game-card ${featured ? "game-card--featured" : "game-card--standard"}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transformStyle: "preserve-3d" }}
    >
      <div className="game-card__media">
        {/* We use a colored placeholder if the image fails to load, or just fallback styling */}
        <div style={{width: '100%', height: '100%', backgroundColor: 'var(--surface-overlay)'}}>
            <img ref={imgRef} src={game.cover} alt={game.title} loading="lazy" />
        </div>
        <div className="game-card__media-gradient" />
        <div className="game-card__badges">
          <span className="badge-trending"><TrendingUpIcon size={13}/> Trending</span>
          <span className="badge-ai-score">AI {game.aiScore}</span>
        </div>
        <div className="game-card__rating">
          <StarIcon size={14} fill="var(--ember-400)" color="var(--ember-400)" /> {game.rating}
        </div>
      </div>
      <div className="game-card__body">
        <h3 className="game-card__title">{game.title}</h3>
        <p className="game-card__desc">{game.description}</p>
        <div className="game-card__meta-row">
          <span><ClockIcon size={13}/> {game.playtime}</span>
          {game.multiplayer && <span><UsersIcon size={13}/> Multiplayer</span>}
        </div>
        <div className="game-card__tags">
          {game.tags.map((tag) => (
            <span key={tag} className="tag-pill-card">{tag}</span>
          ))}
        </div>
      </div>
      <div className="game-card__sheen" />
    </article>
  );
}
