"use client";

import React from "react";
import GameCard, { GameType } from "./GameCard";
import { TRENDING_GAMES } from "../../data/games.mock";
import "./TrendingGrid.css";

export default function TrendingGrid() {
  return (
    <section className="trending-section">
      <div className="trending-header">
        <h2 className="trending-title">Trending Now</h2>
        <span className="eyebrow-label">Curated for you</span>
      </div>
      <div className="trending-grid">
        {TRENDING_GAMES.map((game: GameType, index: number) => (
          <GameCard 
            key={game.id} 
            game={game} 
            featured={game.featured} 
            index={index} 
          />
        ))}
      </div>
    </section>
  );
}
