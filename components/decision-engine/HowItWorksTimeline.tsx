"use client";
import React, { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "../../lib/gsapSetup";
import { HOW_IT_WORKS_STEPS } from "../../data/games.mock";

export default function HowItWorksTimeline() {
  const pathRef = useRef<SVGPathElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!pathRef.current || !containerRef.current) return;
    
    const length = pathRef.current.getTotalLength();
    gsap.set(pathRef.current, { strokeDasharray: length, strokeDashoffset: length });
    
    const trigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top center",
      end: "bottom center",
      scrub: 1,
      animation: gsap.to(pathRef.current, { strokeDashoffset: 0, ease: "none" }),
    });

    return () => trigger.kill();
  }, []);

  return (
    <div ref={containerRef} className="timeline-container">
      <svg className="timeline-svg" viewBox="0 0 100 400" preserveAspectRatio="none">
        <path ref={pathRef} d="M50,0 Q80,100 50,200 T50,400" stroke="var(--accent-500)" strokeWidth="3" fill="none" />
      </svg>
      <div className="timeline-steps">
        {HOW_IT_WORKS_STEPS.map((step, idx) => (
          <div key={idx} className="timeline-step">
            <div className="timeline-step__number">{step.number}</div>
            <div className="timeline-step__content">
              <h4 className="timeline-step__title">{step.title}</h4>
              <p className="timeline-step__desc">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
