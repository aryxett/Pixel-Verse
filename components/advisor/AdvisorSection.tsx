"use client";
import React from "react";
import FeatureRow from "./FeatureRow";
import ChatPanel from "./ChatPanel";
import { ADVISOR_FEATURES } from "../../data/games.mock";
import "./AdvisorSection.css";

export default function AdvisorSection() {
  return (
    <section className="advisor-section">
      <div className="advisor-container">
        <div className="advisor-left">
          <ChatPanel />
        </div>
        <div className="advisor-right">
          <div className="advisor-features-panel">
            <h2 className="advisor-title">Why PixelVerse AI?</h2>
            <div className="advisor-features-list">
              {ADVISOR_FEATURES.map(f => (
                <FeatureRow 
                  key={f.id} 
                  iconName={f.icon} 
                  title={f.title} 
                  description={f.description} 
                  accent={f.accent} 
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
