"use client";
import React, { useEffect, useRef } from "react";
import { gsap } from "../../lib/gsapSetup";
import { ADVISOR_SUGGESTED_PROMPTS } from "../../data/games.mock";
import { Send as SendIcon } from "lucide-react";

function ChatMessage({ message, isAI }: { message: string, isAI: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if(!ref.current) return;
    gsap.fromTo(ref.current,
      { opacity: 0, scale: 0.92, y: 12, x: isAI ? -8 : 8 },
      { opacity: 1, scale: 1, y: 0, x: 0, duration: 0.45, ease: "snap" }
    );
  }, [isAI]);
  return (
    <div ref={ref} className={`chat-bubble ${isAI ? "chat-bubble--ai" : "chat-bubble--user"}`}>
      {message}
    </div>
  );
}

function TypingIndicator() {
  useEffect(() => {
    const dots = gsap.utils.toArray(".typing-dot");
    gsap.to(dots, { scale: 1.4, opacity: 1, duration: 0.4, stagger: { each: 0.15, repeat: -1, yoyo: true } });
  }, []);
  return (
    <div className="typing-indicator chat-bubble chat-bubble--ai">
      <div className="typing-dot" />
      <div className="typing-dot" />
      <div className="typing-dot" />
    </div>
  );
}

export default function ChatPanel() {
  return (
    <div className="advisor-chat-panel">
      <div className="chat-header">
        <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 600, margin: 0 }}>PixelVerse Advisor</h3>
        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--score-green-400)', margin: 0, letterSpacing: 'var(--tracking-widest)', textTransform: 'uppercase' }}>● Online</p>
      </div>
      
      <div className="chat-message-list" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', overflowY: 'auto' }}>
        <ChatMessage isAI={true} message="Hey there! Looking for your next obsession? Tell me what you've been playing recently." />
        <ChatMessage isAI={false} message="I just finished Elden Ring and want something similar but maybe more story-focused." />
        <TypingIndicator />
      </div>

      <div className="suggested-prompts">
        {ADVISOR_SUGGESTED_PROMPTS.map(p => (
          <button key={p} className="suggested-prompt-chip">{p}</button>
        ))}
      </div>

      <div className="chat-input-row">
        <input type="text" placeholder="Ask for a recommendation..." />
        <button className="chat-send-btn"><SendIcon size={16} color="white" /></button>
      </div>
    </div>
  );
}
