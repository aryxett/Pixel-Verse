"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ExternalLink, ShoppingCart } from "lucide-react";

/* ─────────────────────────────────────────
   Store definitions with SVG logos
───────────────────────────────────────── */
interface StoreInfo {
  name: string;
  color: string;
  bg: string;
  border: string;
  logo: React.ReactNode;
  urlTemplate?: (slug: string, name: string) => string;
}

const STORE_MAP: Record<number, StoreInfo> = {
  1: {
    name: "Steam",
    color: "#c7d5e0",
    bg: "rgba(23,26,33,0.9)",
    border: "rgba(199,213,224,0.2)",
    logo: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="#c7d5e0">
        <path d="M11.979 0C5.678 0 .511 4.86.022 11.037l6.432 2.658c.545-.371 1.203-.59 1.912-.59.063 0 .125.004.188.006l2.861-4.142V8.91c0-2.495 2.028-4.524 4.524-4.524 2.494 0 4.524 2.031 4.524 4.527s-2.03 4.525-4.524 4.525h-.105l-4.076 2.911c0 .052.004.105.004.159 0 1.875-1.515 3.396-3.39 3.396-1.635 0-3.016-1.173-3.331-2.727L.436 15.27C1.862 20.307 6.486 24 11.979 24c6.627 0 11.999-5.373 11.999-12S18.606 0 11.979 0zM7.54 18.21l-1.473-.61c.262.543.714.999 1.314 1.25 1.297.539 2.793-.076 3.332-1.375.263-.63.264-1.319.005-1.949s-.75-1.121-1.377-1.383c-.624-.26-1.29-.249-1.878-.03l1.523.63c.956.4 1.409 1.5 1.009 2.455-.397.957-1.497 1.41-2.455 1.012H7.54zm11.415-9.303c0-1.662-1.353-3.015-3.015-3.015-1.665 0-3.015 1.353-3.015 3.015 0 1.665 1.35 3.015 3.015 3.015 1.663 0 3.015-1.35 3.015-3.015zm-5.273-.005c0-1.252 1.013-2.266 2.265-2.266 1.249 0 2.266 1.014 2.266 2.266 0 1.251-1.017 2.265-2.266 2.265-1.252 0-2.265-1.014-2.265-2.265z"/>
      </svg>
    ),
    urlTemplate: (slug) => `https://store.steampowered.com/search/?term=${encodeURIComponent(slug)}`,
  },
  2: {
    name: "Xbox Store",
    color: "#52b043",
    bg: "rgba(16,124,16,0.15)",
    border: "rgba(82,176,67,0.3)",
    logo: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="#52b043">
        <path d="M4.102 21.033C6.211 22.881 8.977 24 12 24c3.026 0 5.789-1.119 7.902-2.967 1.877-1.912-4.316-8.709-7.902-11.417-3.582 2.708-9.779 9.505-7.898 11.417zm11.16-14.406c2.5 2.961 7.484 10.313 6.076 12.912C23.002 17.854 24 15.043 24 12c0-3.734-1.619-7.09-4.203-9.418 0 0-4.837 3.399-4.535 4.045zM4.166 2.582C1.62 4.913 0 8.267 0 12c0 3.043.998 5.854 2.661 8.139 1.401-2.599 6.388-9.951 8.885-12.912.302-.646-4.534-4.045-4.38-4.645zM12 1.301S9.63 3.532 9.63 4.287c0 .754 2.37 2.154 2.37 2.154s2.37-1.4 2.37-2.154C14.37 3.532 12 1.301 12 1.301z"/>
      </svg>
    ),
    urlTemplate: (_, name) => `https://www.xbox.com/en-US/search?q=${encodeURIComponent(name)}`,
  },
  3: {
    name: "PlayStation",
    color: "#003087",
    bg: "rgba(0,48,135,0.2)",
    border: "rgba(0,112,209,0.4)",
    logo: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="#0070d1">
        <path d="M8.984 2.596v14.347l3.915 1.261V6.688c0-.69.304-1.151.794-.991.636.181.76.814.76 1.505v5.876c2.441 1.193 4.362-.001 4.362-3.199 0-3.29-1.126-4.767-4.438-5.836-1.307-.42-3.16-.906-4.393-1.447zm7.857 15.093c-2.695.68-5.038.168-5.038-2.36v-1.318l-3.915-1.26v2.57c0 3.866 4.298 5.662 8.953 3.842v-1.474zm-12.84-5.07v-2.16l-4.001-1.29v2.16l4.001 1.29z"/>
      </svg>
    ),
    urlTemplate: (_, name) => `https://store.playstation.com/en-us/search/${encodeURIComponent(name)}`,
  },
  4: {
    name: "App Store",
    color: "#0071e3",
    bg: "rgba(0,113,227,0.15)",
    border: "rgba(0,113,227,0.3)",
    logo: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="#0071e3">
        <path d="M8.809 0c-.48 3.168 2.145 5.088 4.32 5.088C13.608 2.064 11.001 0 8.809 0zm-3.12 6.336C3.24 6.336 0 9.168 0 13.2c0 5.28 4.944 10.8 8.4 10.8 1.44 0 2.4-.576 3.6-.576 1.2 0 2.016.576 3.6.576 3.6 0 6-3.6 7.2-6.48-3.12-1.44-4.32-5.04-1.2-7.68-1.44-1.68-3.36-2.64-5.28-2.64-1.44 0-2.64.576-3.6.576-.96 0-2.16-.576-3.6-.576-.144 0-.288.048-.432.048z"/>
      </svg>
    ),
    urlTemplate: (_, name) => `https://apps.apple.com/search?term=${encodeURIComponent(name)}`,
  },
  5: {
    name: "GOG",
    color: "#86328a",
    bg: "rgba(134,50,138,0.15)",
    border: "rgba(134,50,138,0.35)",
    logo: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="#86328a">
        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 4.8c3.975 0 7.2 3.225 7.2 7.2s-3.225 7.2-7.2 7.2S4.8 15.975 4.8 12 8.025 4.8 12 4.8zm0 2.4c-2.651 0-4.8 2.149-4.8 4.8s2.149 4.8 4.8 4.8 4.8-2.149 4.8-4.8-2.149-4.8-4.8-4.8z"/>
      </svg>
    ),
    urlTemplate: (_, name) => `https://www.gog.com/games?search=${encodeURIComponent(name)}`,
  },
  6: {
    name: "Nintendo",
    color: "#e4000f",
    bg: "rgba(228,0,15,0.12)",
    border: "rgba(228,0,15,0.3)",
    logo: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="#e4000f">
        <path d="M7.2 0C3.225 0 0 3.225 0 7.2v9.6C0 20.775 3.225 24 7.2 24h9.6C20.775 24 24 20.775 24 16.8V7.2C24 3.225 20.775 0 16.8 0H7.2zm0 2.4h3.6v19.2H7.2C4.551 21.6 2.4 19.449 2.4 16.8V7.2C2.4 4.551 4.551 2.4 7.2 2.4zm6 0h3.6c2.649 0 4.8 2.151 4.8 4.8v9.6c0 2.649-2.151 4.8-4.8 4.8h-3.6V2.4zM7.2 6a2.4 2.4 0 1 0 0 4.8A2.4 2.4 0 0 0 7.2 6zm9.6 7.2a2.4 2.4 0 1 0 0 4.8 2.4 2.4 0 0 0 0-4.8z"/>
      </svg>
    ),
    urlTemplate: (_, name) => `https://www.nintendo.com/search/#q=${encodeURIComponent(name)}`,
  },
  7: {
    name: "Xbox 360",
    color: "#52b043",
    bg: "rgba(16,124,16,0.12)",
    border: "rgba(82,176,67,0.25)",
    logo: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="#52b043">
        <path d="M4.102 21.033C6.211 22.881 8.977 24 12 24c3.026 0 5.789-1.119 7.902-2.967 1.877-1.912-4.316-8.709-7.902-11.417-3.582 2.708-9.779 9.505-7.898 11.417zm11.16-14.406c2.5 2.961 7.484 10.313 6.076 12.912C23.002 17.854 24 15.043 24 12c0-3.734-1.619-7.09-4.203-9.418 0 0-4.837 3.399-4.535 4.045zM4.166 2.582C1.62 4.913 0 8.267 0 12c0 3.043.998 5.854 2.661 8.139 1.401-2.599 6.388-9.951 8.885-12.912.302-.646-4.534-4.045-4.38-4.645zM12 1.301S9.63 3.532 9.63 4.287c0 .754 2.37 2.154 2.37 2.154s2.37-1.4 2.37-2.154C14.37 3.532 12 1.301 12 1.301z"/>
      </svg>
    ),
    urlTemplate: (_, name) => `https://www.xbox.com/en-US/search?q=${encodeURIComponent(name)}`,
  },
  8: {
    name: "Android",
    color: "#3ddc84",
    bg: "rgba(61,220,132,0.12)",
    border: "rgba(61,220,132,0.3)",
    logo: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="#3ddc84">
        <path d="M17.523 15.341a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5m-11.046 0a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5m11.4-6.461 1.86-3.22a.387.387 0 0 0-.141-.529.387.387 0 0 0-.529.141l-1.884 3.262A11.3 11.3 0 0 0 12 7.875c-1.617 0-3.15.346-4.523.959L5.593 5.272a.387.387 0 0 0-.529-.141.387.387 0 0 0-.141.529l1.86 3.22C3.924 10.512 2.25 13.05 2.25 16h19.5c0-2.95-1.674-5.488-3.873-7.12"/>
      </svg>
    ),
    urlTemplate: (_, name) => `https://play.google.com/store/search?q=${encodeURIComponent(name)}&c=apps`,
  },
  9: {
    name: "iOS",
    color: "#0071e3",
    bg: "rgba(0,113,227,0.12)",
    border: "rgba(0,113,227,0.25)",
    logo: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="#0071e3">
        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
      </svg>
    ),
    urlTemplate: (_, name) => `https://apps.apple.com/search?term=${encodeURIComponent(name)}`,
  },
  13: {
    name: "macOS",
    color: "#999",
    bg: "rgba(150,150,150,0.12)",
    border: "rgba(150,150,150,0.25)",
    logo: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="#aaa">
        <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 2c4.418 0 8 3.582 8 8s-3.582 8-8 8-8-3.582-8-8 3.582-8 8-8zm0 2a6 6 0 1 0 0 12A6 6 0 0 0 12 6z"/>
      </svg>
    ),
    urlTemplate: (_, name) => `https://apps.apple.com/search?term=${encodeURIComponent(name)}&entity=macSoftware`,
  },
  14: {
    name: "Linux",
    color: "#fcc624",
    bg: "rgba(252,198,36,0.12)",
    border: "rgba(252,198,36,0.25)",
    logo: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="#fcc624">
        <path d="M12.504 0c-.155 0-.315.008-.48.021-4.226.333-3.105 4.807-3.17 6.298-.076 1.092-.3 1.953-1.05 3.02-.885 1.051-2.127 2.75-2.716 4.521-.278.832-.41 1.684-.287 2.489a.424.424 0 00-.11.135c-.26.268-.45.6-.663.839-.199.199-.485.267-.797.4-.313.136-.658.269-.864.68-.09.189-.136.394-.132.602 0 .199.027.4.055.536.058.399.116.728.04.97-.249.68-.28 1.145-.106 1.484.174.334.535.47.94.601.81.2 1.91.135 2.774.6.926.466 1.866.67 2.616.47.526-.116.97-.464 1.208-.946.587-.003 1.23-.269 2.26-.334.699-.058 1.574.267 2.577.2.025.134.063.198.114.333l.003.003c.391.778 1.113 1.132 1.884 1.071.771-.06 1.592-.536 2.257-1.306.631-.765 1.683-1.084 2.378-1.503.348-.199.629-.469.649-.853.023-.4-.2-.811-.714-1.376v-.097l-.003-.003c-.17-.2-.25-.535-.338-.926-.085-.401-.182-.786-.492-1.046h-.003c-.059-.054-.123-.067-.188-.135a.357.357 0 00-.19-.064c.431-1.278.264-2.55-.173-3.694-.533-1.41-1.465-2.638-2.175-3.483-.796-1.005-1.576-1.957-1.56-3.368.026-2.152.236-6.133-3.544-6.139zm.529 3.405h.013c.213 0 .396.062.584.198.19.135.33.332.438.533.105.259.158.459.166.724 0-.02.006-.04.006-.06v.105a.086.086 0 01-.004-.021l-.004-.024a1.807 1.807 0 01-.15.706.953.953 0 01-.213.335.71.71 0 00-.088-.042c-.104-.045-.198-.064-.284-.133a1.312 1.312 0 00-.22-.066c.05-.06.146-.133.183-.198.053-.128.082-.264.088-.402v-.02a1.21 1.21 0 00-.061-.4c-.045-.134-.101-.2-.183-.333-.084-.066-.167-.132-.267-.132h-.016c-.093 0-.176.03-.262.132-.09.133-.145.2-.19.333a1.21 1.21 0 00-.06.4v.02c.006.138.034.274.088.402.037.065.132.137.182.198a1.312 1.312 0 00-.22.066c-.086.069-.18.088-.284.133a.71.71 0 00-.088.042.953.953 0 01-.213-.335 1.807 1.807 0 01-.15-.706l-.004.024a.086.086 0 01-.004.021v-.105c0 .02.005.04.006.06.008-.265.06-.465.166-.724.108-.201.247-.398.438-.533.188-.136.371-.198.584-.198z"/>
      </svg>
    ),
    urlTemplate: (_, name) => `https://store.steampowered.com/search/?term=${encodeURIComponent(name)}&os=linux`,
  },
};

// Epic Games — detected from tags/stores
const EPIC_STORE: StoreInfo = {
  name: "Epic Games",
  color: "#2563eb",
  bg: "rgba(37,99,235,0.12)",
  border: "rgba(37,99,235,0.3)",
  logo: (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="#2563eb">
      <path d="M3 2v20h18V2H3zm9 16.5L5.5 12 12 5.5l6.5 6.5-6.5 6.5z"/>
    </svg>
  ),
  urlTemplate: (_, name) => `https://store.epicgames.com/en-US/browse?q=${encodeURIComponent(name)}`,
};

// Discount / deal stores
const DEAL_STORES: StoreInfo[] = [
  {
    name: "Fanatical",
    color: "#ff6b35",
    bg: "rgba(255,107,53,0.12)",
    border: "rgba(255,107,53,0.3)",
    logo: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="#ff6b35">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
      </svg>
    ),
    urlTemplate: (_, name) => `https://www.fanatical.com/en/search?search=${encodeURIComponent(name)}`,
  },
  {
    name: "Humble Bundle",
    color: "#cc2929",
    bg: "rgba(204,41,41,0.12)",
    border: "rgba(204,41,41,0.3)",
    logo: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="#cc2929">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/>
      </svg>
    ),
    urlTemplate: (_, name) => `https://www.humblebundle.com/store/search?search=${encodeURIComponent(name)}`,
  },
  {
    name: "Green Man Gaming",
    color: "#00c853",
    bg: "rgba(0,200,83,0.12)",
    border: "rgba(0,200,83,0.3)",
    logo: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="#00c853">
        <path d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16zm3.5-9H13V8.5a1 1 0 0 0-2 0V11H8.5a1 1 0 0 0 0 2H11v2.5a1 1 0 0 0 2 0V13h2.5a1 1 0 0 0 0-2z"/>
      </svg>
    ),
    urlTemplate: (_, name) => `https://www.greenmangaming.com/search/?query=${encodeURIComponent(name)}`,
  },
];

/* ─────────────────────────────────────────
   Store Button
───────────────────────────────────────── */
function StoreButton({ info, url, index }: { info: StoreInfo; url: string; index: number }) {
  return (
    <motion.a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.97 }}
      className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl border font-medium text-sm"
      style={{
        background: info.bg,
        borderColor: info.border,
        color: info.color,
        boxShadow: `0 2px 12px ${info.border}`,
        textDecoration: "none",
        transition: "transform 0.2s, box-shadow 0.2s",
      }}
    >
      {info.logo}
      <span>{info.name}</span>
      <ExternalLink className="w-3 h-3 opacity-50" />
    </motion.a>
  );
}

/* ─────────────────────────────────────────
   Component
───────────────────────────────────────── */
interface RAWGStore {
  id: number;
  store: { id: number; name: string; slug: string };
  url: string;
}

/* ─────────────────────────────────────────
   Component
───────────────────────────────────────── */
interface PlatformStoresProps {
  slug: string;
  gameName: string;
  platforms: string[];
}

export default function PlatformStores({ slug, gameName, platforms }: PlatformStoresProps) {
  const [officialStores, setOfficialStores] = useState<Array<{ info: StoreInfo; url: string }>>([]);
  const [loading, setLoading] = useState(true);

  // Build stores from platform names (always available immediately)
  const buildFromPlatforms = () => {
    const buttons: Array<{ info: StoreInfo; url: string }> = [];

    // Always add Steam for PC games — most RAWG games are on PC
    const hasPlatformData = platforms.length > 0;
    const platformsToCheck = hasPlatformData ? platforms : ["PC"]; // default to PC if no data

    platformsToCheck.forEach((p) => {
      const pLower = p.toLowerCase();
      if (pLower.includes("pc") || pLower.includes("windows"))
        buttons.push({ info: STORE_MAP[1], url: STORE_MAP[1].urlTemplate!(slug, gameName) });
      if (pLower.includes("playstation 5") || pLower.includes("ps5") || pLower.includes("playstation 4") || pLower.includes("ps4"))
        buttons.push({ info: STORE_MAP[3], url: STORE_MAP[3].urlTemplate!(slug, gameName) });
      if (pLower.includes("xbox"))
        buttons.push({ info: STORE_MAP[2], url: STORE_MAP[2].urlTemplate!(slug, gameName) });
      if (pLower.includes("nintendo") || pLower.includes("switch"))
        buttons.push({ info: STORE_MAP[6], url: STORE_MAP[6].urlTemplate!(slug, gameName) });
      if (pLower.includes("android"))
        buttons.push({ info: STORE_MAP[8], url: STORE_MAP[8].urlTemplate!(slug, gameName) });
      if (pLower.includes("ios") || pLower.includes("iphone"))
        buttons.push({ info: STORE_MAP[9], url: STORE_MAP[9].urlTemplate!(slug, gameName) });
      if (pLower.includes("macos") || pLower.includes("mac"))
        buttons.push({ info: STORE_MAP[13], url: STORE_MAP[13].urlTemplate!(slug, gameName) });
      if (pLower.includes("linux"))
        buttons.push({ info: STORE_MAP[14], url: STORE_MAP[14].urlTemplate!(slug, gameName) });
    });
    // Deduplicate
    const seen = new Set<string>();
    return buttons.filter(({ info }) => {
      if (seen.has(info.name)) return false;
      seen.add(info.name);
      return true;
    });
  };

  useEffect(() => {
    // Start with platform-based stores immediately
    setOfficialStores(buildFromPlatforms());
    setLoading(false);

    // Then try to enrich with RAWG store data
    if (!slug) return;
    fetch(`/api/rawg/stores/${slug}`)
      .then((r) => r.json())
      .then((data) => {
        const rawgStores = data.stores || [];
        if (rawgStores.length === 0) return;

        const buttons: Array<{ info: StoreInfo; url: string }> = [];
        rawgStores.forEach((s: RAWGStore) => {
          if (!s?.store?.id) return;
          const info = STORE_MAP[s.store.id];
          if (info) buttons.push({ info, url: s.url || info.urlTemplate?.(slug, gameName) || "#" });
          if (s.store.slug === "epic-games")
            buttons.push({ info: EPIC_STORE, url: s.url || EPIC_STORE.urlTemplate?.(slug, gameName) || "#" });
        });

        if (buttons.length > 0) {
          const seen = new Set<string>();
          setOfficialStores(buttons.filter(({ info }) => {
            if (seen.has(info.name)) return false;
            seen.add(info.name);
            return true;
          }));
        }
      })
      .catch(() => {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, gameName]);

  // Deal stores — always show for PC games
  const isPCGame = platforms.some((p) =>
    p.toLowerCase().includes("pc") || p.toLowerCase().includes("windows")
  );
  const dealStores = isPCGame ? DEAL_STORES : [];

  if (officialStores.length === 0 && dealStores.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="p-4 rounded-2xl border border-white/[0.06]"
      style={{ background: "rgba(13,13,20,0.8)" }}
    >
      <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-4 flex items-center gap-2">
        <ShoppingCart className="w-3.5 h-3.5 text-violet-400" />
        Where to Buy / Play
      </p>

      {/* Official stores */}
      {officialStores.length > 0 && (
        <div className="mb-4">
          <p className="text-xs text-slate-600 mb-2 font-medium">Official Stores</p>
          <div className="flex flex-wrap gap-2">
            {officialStores.map(({ info, url }, i) => (
              <StoreButton key={info.name} info={info} url={url} index={i} />
            ))}
          </div>
        </div>
      )}

      {/* Deal stores */}
      {dealStores.length > 0 && (
        <div>
          <p className="text-xs text-slate-600 mb-2 font-medium flex items-center gap-1.5">
            🏷️ Best Deals
            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold text-emerald-400 border border-emerald-500/30"
              style={{ background: "rgba(16,185,129,0.1)" }}>
              Up to 90% OFF
            </span>
          </p>
          <div className="flex flex-wrap gap-2">
            {dealStores.map((info, i) => (
              <StoreButton
                key={info.name}
                info={info}
                url={info.urlTemplate!(slug, gameName)}
                index={officialStores.length + i}
              />
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
