"use client";
import React, { useState } from "react";
import PillSelector from "./PillSelector";
import HowItWorksTimeline from "./HowItWorksTimeline";
import { DECISION_ENGINE_OPTIONS } from "../../data/games.mock";
import "./DecisionEngine.css";

export default function DecisionEngineSection() {
  const [selectedTime, setSelectedTime] = useState<number | null>(null);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);

  return (
    <section className="decision-section">
      <div className="decision-header">
        <h2 className="decision-title">Constraint Builder</h2>
        <p className="decision-subtitle">Fine-tune the AI's parameters for your perfect match.</p>
      </div>

      <div className="decision-content">
        <div className="decision-builder">
          <div className="builder-group">
            <h3 className="builder-group__label">Time Available</h3>
            <div className="pill-group">
              {DECISION_ENGINE_OPTIONS.timeAvailable.map(t => (
                <PillSelector 
                  key={t.value} 
                  label={t.label} 
                  isActive={selectedTime === t.value} 
                  onClick={() => setSelectedTime(t.value)} 
                />
              ))}
            </div>
          </div>

          <div className="builder-group">
            <h3 className="builder-group__label">Current Mood</h3>
            <div className="pill-group">
              {DECISION_ENGINE_OPTIONS.mood.map(m => (
                <PillSelector 
                  key={m.value} 
                  label={m.label} 
                  iconName={m.icon}
                  isActive={selectedMood === m.value} 
                  onClick={() => setSelectedMood(m.value)} 
                />
              ))}
            </div>
          </div>

          <button className="btn-primary-glow" style={{ marginTop: 'var(--space-6)', width: '100%', justifyContent: 'center' }}>
            Initialize Search Sequence
          </button>
        </div>

        <div className="decision-timeline">
          <HowItWorksTimeline />
        </div>
      </div>
    </section>
  );
}
