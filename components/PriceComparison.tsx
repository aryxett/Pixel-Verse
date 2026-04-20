"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingDown, ExternalLink, Loader2,
  ChevronDown, ChevronUp, Trophy, Tag, History,
} from "lucide-react";
import type { PriceResult } from "@/app/api/prices/route";

/* ── Store logos ── */
const STORE_LOGOS: Record<string, React.ReactNode> = {
  "61": <svg viewBox="0 0 24 24" className="w-4 h-4 flex-shrink-0" fill="currentColor"><path d="M11.979 0C5.678 0 .511 4.86.022 11.037l6.432 2.658c.545-.371 1.203-.59 1.912-.59.063 0 .125.004.188.006l2.861-4.142V8.91c0-2.495 2.028-4.524 4.524-4.524 2.494 0 4.524 2.031 4.524 4.527s-2.03 4.525-4.524 4.525h-.105l-4.076 2.911c0 .052.004.105.004.159 0 1.875-1.515 3.396-3.39 3.396-1.635 0-3.016-1.173-3.331-2.727L.436 15.27C1.862 20.307 6.486 24 11.979 24c6.627 0 11.999-5.373 11.999-12S18.606 0 11.979 0z"/></svg>,
  "35": <svg viewBox="0 0 24 24" className="w-4 h-4 flex-shrink-0" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 4.8c3.975 0 7.2 3.225 7.2 7.2s-3.225 7.2-7.2 7.2S4.8 15.975 4.8 12 8.025 4.8 12 4.8z"/></svg>,
  "16": <svg viewBox="0 0 24 24" className="w-4 h-4 flex-shrink-0" fill="currentColor"><path d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zm3.5 9H13V8.5a1 1 0 0 0-2 0V11H8.5a1 1 0 0 0 0 2H11v2.5a1 1 0 0 0 2 0V13h2.5a1 1 0 0 0 0-2z"/></svg>,
  "6":  <svg viewBox="0 0 24 24" className="w-4 h-4 flex-shrink-0" fill="currentColor"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>,
  "37": <svg viewBox="0 0 24 24" className="w-4 h-4 flex-shrink-0" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/></svg>,
  "11": <svg viewBox="0 0 24 24" className="w-4 h-4 flex-shrink-0" fill="currentColor"><path d="M3 2v20h18V2H3zm9 16.5L5.5 12 12 5.5l6.5 6.5-6.5 6.5z"/></svg>,
};

function StoreLogo({ storeId }: { storeId: string }) {
  return STORE_LOGOS[storeId] || <Tag className="w-4 h-4 flex-shrink-0" />;
}

/* ── Currency conversion ── */
const USD_TO_INR = 84; // approximate rate

function formatINR(usd: number | null | undefined): string {
  if (usd == null || isNaN(usd)) return "₹—";
  const inr = Math.round(usd * USD_TO_INR);
  if (inr >= 1000) {
    return `₹${inr.toLocaleString("en-IN")}`;
  }
  return `₹${inr}`;
}

interface Props { gameName: string; slug?: string }

export default function PriceComparison({ gameName, slug }: Props) {
  const [prices, setPrices]     = useState<PriceResult[]>([]);
  const [loading, setLoading]   = useState(true);
  const [found, setFound]       = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams({ title: gameName });
    if (slug) params.set("slug", slug);
    fetch(`/api/prices?${params}`)
      .then((r) => r.json())
      .then((data) => {
        setPrices(data.prices || []);
        setFound(data.found || false);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [gameName, slug]);

  if (loading) {
    return (
      <div className="rounded-2xl border border-white/[0.06] overflow-hidden"
        style={{ background: "rgba(13,13,20,0.8)" }}>
        <div className="flex items-center gap-2 px-5 py-4 text-xs text-slate-500 font-bold uppercase tracking-wider">
          <TrendingDown className="w-3.5 h-3.5 text-emerald-400" />
          Price Comparison
          <Loader2 className="w-3 h-3 animate-spin" />
        </div>
        <div className="px-5 pb-4 space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 rounded-xl bg-slate-800/50 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!found || prices.length === 0) return null;

  const shown = expanded ? prices : prices.slice(0, 5);
  const best  = prices[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15 }}
      className="rounded-2xl border border-white/[0.06] overflow-hidden"
      style={{ background: "rgba(13,13,20,0.8)" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.05]">
        <div className="flex items-center gap-2">
          <TrendingDown className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Price Comparison
          </span>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold text-slate-500 border border-slate-800">
            {prices.length} stores
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <Trophy className="w-3.5 h-3.5 text-yellow-400" />
          <span className="text-slate-500">Best:</span>
          <span className="font-black text-emerald-400 text-sm">{formatINR(best.salePrice)}</span>
          {best.savings > 0 && (
            <span className="px-1.5 py-0.5 rounded text-[10px] font-black text-white"
              style={{ background: "#16a34a" }}>
              -{best.savings}%
            </span>
          )}
        </div>
      </div>

      {/* Column headers */}
      <div className="grid grid-cols-12 gap-2 px-5 py-2 border-b border-white/[0.04]">
        <span className="col-span-1 text-[10px] text-slate-700 font-semibold uppercase">#</span>
        <span className="col-span-4 text-[10px] text-slate-700 font-semibold uppercase">Store</span>
        <span className="col-span-3 text-[10px] text-slate-700 font-semibold uppercase text-right">Normal</span>
        <span className="col-span-2 text-[10px] text-slate-700 font-semibold uppercase text-right">Sale</span>
        <span className="col-span-2 text-[10px] text-slate-700 font-semibold uppercase text-right">Price</span>
      </div>

      {/* Rows */}
      <div className="divide-y divide-white/[0.03]">
        <AnimatePresence initial={false}>
          {shown.map((p, i) => (
            <motion.a
              key={p.storeId}
              href={p.dealUrl}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: i * 0.04 }}
              className="grid grid-cols-12 gap-2 items-center px-5 py-3 group cursor-pointer"
              style={{
                textDecoration: "none",
                background: p.isBest ? "rgba(16,185,129,0.04)" : "transparent",
                transition: "background 0.15s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = "rgba(124,58,237,0.05)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = p.isBest ? "rgba(16,185,129,0.04)" : "transparent";
              }}
            >
              {/* Rank */}
              <span className="col-span-1 text-xs font-bold text-slate-700">
                {i + 1}
              </span>

              {/* Store */}
              <div className="col-span-4 flex items-center gap-2" style={{ color: p.storeColor }}>
                <StoreLogo storeId={p.storeId} />
                <span className="text-sm font-semibold truncate">{p.storeName}</span>
                {p.isBest && (
                  <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full flex-shrink-0 hidden sm:inline"
                    style={{ background: "#16a34a", color: "#fff" }}>
                    BEST
                  </span>
                )}
              </div>

              {/* Normal price */}
              <div className="col-span-3 text-right">
                {p.normalPrice > p.salePrice ? (
                  <span className="text-xs text-slate-600 line-through">
                    {formatINR(p.normalPrice)}
                  </span>
                ) : (
                  <span className="text-xs text-slate-700">—</span>
                )}
              </div>

              {/* Discount */}
              <div className="col-span-2 text-right">
                {p.savings > 0 ? (
                  <span className="text-xs font-black px-1.5 py-0.5 rounded text-white"
                    style={{ background: "#16a34a" }}>
                    -{p.savings}%
                  </span>
                ) : (
                  <span className="text-xs text-slate-700">—</span>
                )}
              </div>

              {/* Current price */}
              <div className="col-span-2 flex items-center justify-end gap-1.5">
                <span className="text-sm font-black"
                  style={{ color: p.isBest ? "#22c55e" : "#f1f5f9" }}>
                  {formatINR(p.salePrice)}
                </span>
                <ExternalLink className="w-3 h-3 text-slate-700 group-hover:text-violet-400 transition-colors flex-shrink-0" />
              </div>
            </motion.a>
          ))}
        </AnimatePresence>
      </div>

      {/* Historical low row */}
      {prices.some((p) => p.storeLow && p.storeLow < p.salePrice) && (
        <div className="px-5 py-3 border-t border-white/[0.04] flex flex-wrap items-center gap-2 text-xs text-slate-600">
          <History className="w-3.5 h-3.5 text-violet-400" />
          <span>Historical lows:</span>
          {prices.filter((p) => p.storeLow && p.storeLow < p.salePrice).slice(0, 3).map((p) => (
            <span key={p.storeId} className="text-slate-500">
              {p.storeName}: <span className="text-violet-400 font-semibold">{formatINR(p.storeLow!)}</span>
            </span>
          ))}
        </div>
      )}

      {/* Show more */}
      {prices.length > 5 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-center gap-1.5 py-3 text-xs text-slate-600 hover:text-slate-400 border-t border-white/[0.04] transition-colors"
          style={{ background: "rgba(13,13,20,0.4)" }}
        >
          {expanded
            ? <><ChevronUp className="w-3.5 h-3.5" />Show less</>
            : <><ChevronDown className="w-3.5 h-3.5" />Show {prices.length - 5} more stores</>}
        </button>
      )}

      <div className="px-5 py-2.5 border-t border-white/[0.04]">
        <p className="text-[10px] text-slate-700 text-center">
          Prices via IsThereAnyDeal · Real-time · INR · Click to buy
        </p>
      </div>
    </motion.div>
  );
}
