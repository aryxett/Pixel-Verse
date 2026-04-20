"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, Loader2, AlertCircle, Sparkles, Zap } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const SUGGESTED_PROMPTS = [
  "What game should I play if I love Elden Ring?",
  "I want something relaxing tonight",
  "Best co-op games for friends?",
  "Deep story-driven RPG recommendation",
];

export default function AIChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hey! I'm your PixelVerse AI 🎮 Tell me your mood, what you've been playing, or what kind of experience you want — I'll find your perfect match.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async (text?: string) => {
    const query = (text || input).trim();
    if (!query || loading) return;

    setMessages((prev) => [...prev, { id: Date.now().toString(), role: "user", content: query }]);
    setInput("");
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/ai/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setMessages((prev) => [...prev, { id: (Date.now() + 1).toString(), role: "assistant", content: data.recommendation }]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  return (
    <div className="flex flex-col rounded-2xl overflow-hidden border border-white/[0.07]"
      style={{ background: "rgba(10,10,18,0.85)", backdropFilter: "blur(20px)", maxHeight: "580px" }}>

      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-white/[0.06]"
        style={{ background: "rgba(124,58,237,0.06)" }}>
        <div className="relative w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: "linear-gradient(135deg, #7c3aed, #06b6d4)", boxShadow: "0 0 16px rgba(124,58,237,0.4)" }}>
          <Bot className="w-4 h-4 text-white" />
          <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#0a0a12] shadow-[0_0_6px_#10b981]" />
        </div>
        <div>
          <p className="font-bold text-sm text-slate-200">PixelVerse AI</p>
          <p className="text-xs text-slate-600">GPT-4o · GitHub Models</p>
        </div>
        <div className="ml-auto flex items-center gap-1.5 text-xs text-emerald-400">
          <Zap className="w-3 h-3" />
          <span>Online</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 min-h-0">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
            >
              {/* Avatar */}
              <div className={`w-7 h-7 rounded-xl flex-shrink-0 flex items-center justify-center text-xs ${
                msg.role === "assistant"
                  ? "bg-gradient-to-br from-violet-600 to-cyan-500"
                  : "bg-gradient-to-br from-pink-500 to-orange-500"
              }`}>
                {msg.role === "assistant"
                  ? <Bot className="w-3.5 h-3.5 text-white" />
                  : <User className="w-3.5 h-3.5 text-white" />}
              </div>

              {/* Bubble */}
              <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                msg.role === "assistant"
                  ? "text-slate-200 rounded-tl-sm border border-white/[0.06]"
                  : "text-white rounded-tr-sm border border-violet-500/20"
              }`}
                style={msg.role === "assistant"
                  ? { background: "rgba(30,30,50,0.8)" }
                  : { background: "rgba(124,58,237,0.7)", backdropFilter: "blur(8px)" }}>
                {msg.content}
              </div>
            </motion.div>
          ))}

          {/* Loading dots */}
          {loading && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex gap-3">
              <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center">
                <Bot className="w-3.5 h-3.5 text-white" />
              </div>
              <div className="px-4 py-3 rounded-2xl rounded-tl-sm border border-white/[0.06]"
                style={{ background: "rgba(30,30,50,0.8)" }}>
                <div className="flex gap-1 items-center h-4">
                  {[0, 150, 300].map((delay) => (
                    <motion.span key={delay}
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: delay / 1000 }}
                      className="w-1.5 h-1.5 rounded-full bg-violet-400"
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error */}
        {error && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="flex items-start gap-2 p-3 rounded-xl border border-red-500/20 bg-red-500/8 text-red-300 text-sm">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            {error}
          </motion.div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Suggested prompts */}
      {messages.length === 1 && (
        <div className="px-4 pb-3">
          <p className="text-xs text-slate-600 mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-violet-500" /> Try asking:
          </p>
          <div className="flex flex-wrap gap-2">
            {SUGGESTED_PROMPTS.slice(0, 3).map((p) => (
              <button key={p} onClick={() => sendMessage(p)}
                className="text-xs px-3 py-1.5 rounded-full border border-violet-500/20 bg-violet-500/8 text-violet-400 hover:bg-violet-500/15 hover:border-violet-500/40 transition-all">
                {p}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="px-4 pb-4 pt-2 border-t border-white/[0.06]">
        <div className="flex gap-2 items-end">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about games, genres, mood..."
            rows={1}
            className="flex-1 input-glow rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-600 resize-none"
            style={{ maxHeight: "100px" }}
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => sendMessage()}
            disabled={!input.trim() || loading}
            className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            style={{
              background: "linear-gradient(135deg, #7c3aed, #6d28d9)",
              boxShadow: input.trim() ? "0 0 20px rgba(124,58,237,0.4)" : "none",
            }}
          >
            {loading
              ? <Loader2 className="w-4 h-4 text-white animate-spin" />
              : <Send className="w-4 h-4 text-white" />}
          </motion.button>
        </div>
      </div>
    </div>
  );
}
