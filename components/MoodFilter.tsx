"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Loader2, Sparkles } from "lucide-react";
import moodsData from "@/data/moods.json";

interface MoodFilterProps {
  selected: string | null;
  onSelect: (mood: string | null) => void;
  showAISuggestion?: boolean;
}

export default function MoodFilter({ selected, onSelect, showAISuggestion = false }: MoodFilterProps) {
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);
  const [loadingAI, setLoadingAI] = useState(false);

  const handleMoodClick = async (moodId: string) => {
    const newMood = selected === moodId ? null : moodId;
    onSelect(newMood);

    if (newMood && showAISuggestion) {
      setLoadingAI(true);
      setAiSuggestion(null);
      try {
        const res = await fetch("/api/ai/mood", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ mood: newMood }),
        });
        const data = await res.json();
        if (data.suggestion) setAiSuggestion(data.suggestion);
      } catch { /* silent */ }
      finally { setLoadingAI(false); }
    } else {
      setAiSuggestion(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {moodsData.map((mood) => {
          const active = selected === mood.id;
          return (
            <motion.button
              key={mood.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleMoodClick(mood.id)}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200"
              style={active ? {
                borderColor: "rgba(124,58,237,0.6)",
                background: "rgba(124,58,237,0.15)",
                color: "#c4b5fd",
                boxShadow: "0 0 16px rgba(124,58,237,0.2)",
              } : {
                borderColor: "rgba(255,255,255,0.07)",
                background: "rgba(13,13,20,0.6)",
                color: "#64748b",
              }}
            >
              <span>{mood.emoji}</span>
              <span>{mood.label}</span>
            </motion.button>
          );
        })}

        {selected && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={() => { onSelect(null); setAiSuggestion(null); }}
            className="px-4 py-2 rounded-full text-sm border border-slate-800 text-slate-600 hover:text-slate-400 hover:border-slate-600 transition-all"
          >
            Clear ✕
          </motion.button>
        )}
      </div>

      {/* AI Suggestion */}
      <AnimatePresence>
        {showAISuggestion && (selected || loadingAI) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 rounded-xl border border-violet-500/20 bg-violet-500/6"
              style={{ backdropFilter: "blur(12px)" }}>
              <div className="flex items-center gap-2 mb-2 text-violet-400 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                AI Mood Suggestion
              </div>
              {loadingAI
                ? <div className="flex items-center gap-2 text-slate-500 text-sm"><Loader2 className="w-4 h-4 animate-spin" />Thinking...</div>
                : aiSuggestion
                  ? <p className="text-slate-300 text-sm leading-relaxed">{aiSuggestion}</p>
                  : null}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
