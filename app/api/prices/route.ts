import { NextRequest, NextResponse } from "next/server";

const ITAD_BASE = "https://api.isthereanydeal.com";
const ITAD_KEY  = process.env.ITAD_API_KEY || "";
const UA        = "PixelVerse/1.0 (gaming-assistant)";

const SHOP_INFO: Record<number, { name: string; color: string }> = {
  2:  { name: "AllYouPlay",      color: "#8b5cf6" },
  4:  { name: "Blizzard",        color: "#00aeff" },
  6:  { name: "Fanatical",       color: "#ff6b35" },
  13: { name: "DLGamer",         color: "#06b6d4" },
  15: { name: "Dreamgame",       color: "#a78bfa" },
  16: { name: "Epic Game Store", color: "#2563eb" },
  17: { name: "FireFlower",      color: "#f97316" },
  19: { name: "2Game",           color: "#84cc16" },
  20: { name: "GameBillet",      color: "#f59e0b" },
  24: { name: "GamersGate",      color: "#e85d04" },
  25: { name: "Gamesload",       color: "#8b5cf6" },
  26: { name: "GamesPlanet UK",  color: "#10b981" },
  27: { name: "GamesPlanet DE",  color: "#10b981" },
  28: { name: "GamesPlanet FR",  color: "#10b981" },
  29: { name: "GamesPlanet US",  color: "#10b981" },
  35: { name: "GOG",             color: "#86328a" },
  36: { name: "GreenManGaming",  color: "#00c853" },
  37: { name: "Humble Store",    color: "#cc2929" },
  42: { name: "IndieGala",       color: "#f97316" },
  47: { name: "MacGameStore",    color: "#999999" },
  48: { name: "Microsoft Store", color: "#00a4ef" },
  49: { name: "Newegg",          color: "#ff6600" },
  50: { name: "Nuuvem",          color: "#0ea5e9" },
  52: { name: "EA Store",        color: "#ff4747" },
  61: { name: "Steam",           color: "#c7d5e0" },
  62: { name: "Ubisoft Store",   color: "#0070ff" },
  64: { name: "WinGameStore",    color: "#6366f1" },
  65: { name: "JoyBuggy",        color: "#ec4899" },
  70: { name: "Playsum",         color: "#a78bfa" },
  72: { name: "ZOOM Platform",   color: "#06b6d4" },
  73: { name: "PlanetPlay",      color: "#84cc16" },
  75: { name: "Fortuna Digital", color: "#f59e0b" },
};

export interface PriceResult {
  storeId:     string;
  storeName:   string;
  storeColor:  string;
  salePrice:   number;
  normalPrice: number;
  savings:     number;
  isOnSale:    boolean;
  dealUrl:     string;
  isBest:      boolean;
  storeLow:    number | null;
  currency:    string;
}

interface ITADDeal {
  shop:     { id: number; name: string };
  price:    { amount: number; currency: string };
  regular:  { amount: number };
  cut:      number;
  url:      string;
  storeLow: { amount: number } | null;
}

interface ITADGameResult {
  id:          string;
  slug:        string;
  deals:       ITADDeal[];
  historyLow?: { all?: { amount: number } };
}

/* ─────────────────────────────────────────
   Get ITAD game ID — slug + title both try
───────────────────────────────────────── */
async function getGameIdBySlug(slug: string, title?: string): Promise<string | null> {
  // Try multiple search queries for best match
  const queries = [
    slug.replace(/-/g, " "),           // slug as words
    title || "",                        // exact title
    slug.replace(/-/g, " ").replace(/\b(the|a|an|of|in|on|at|to|for|with|by)\b/gi, "").trim(), // without articles
  ].filter(Boolean).filter((q, i, arr) => arr.indexOf(q) === i); // deduplicate

  for (const query of queries) {
    if (!query) continue;
    try {
      const res = await fetch(
        `${ITAD_BASE}/games/search/v1?title=${encodeURIComponent(query)}&key=${ITAD_KEY}`,
        { headers: { "User-Agent": UA }, next: { revalidate: 86400 } }
      );
      if (!res.ok) continue;

      const results: Array<{ id: string; slug: string; title: string; type: string }> = await res.json();
      if (!results?.length) continue;

      // Priority 1: exact slug match
      const slugMatch = results.find((g) => g.slug === slug);
      if (slugMatch) return slugMatch.id;

      // Priority 2: exact title match (case insensitive), type=game
      const titleLower = (title || query).toLowerCase();
      const exactTitle = results.find(
        (g) => g.title.toLowerCase() === titleLower && g.type === "game"
      );
      if (exactTitle) return exactTitle.id;

      // Priority 3: title starts with query, type=game
      const startsWith = results.find(
        (g) => g.title.toLowerCase().startsWith(titleLower.slice(0, 10)) && g.type === "game"
      );
      if (startsWith) return startsWith.id;

      // Priority 4: first game type result
      const firstGame = results.find((g) => g.type === "game");
      if (firstGame) return firstGame.id;
    } catch { continue; }
  }
  return null;
}

/* ─────────────────────────────────────────
   Get prices by ITAD game ID
───────────────────────────────────────── */
async function getPricesByGameId(gameId: string): Promise<PriceResult[]> {
  // No shop filter — get ALL available stores
  const res = await fetch(
    `${ITAD_BASE}/games/prices/v3?key=${ITAD_KEY}&country=US`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json", "User-Agent": UA },
      body: JSON.stringify([gameId]),
      next: { revalidate: 1800 },
    }
  );
  if (!res.ok) return [];

  const arr: ITADGameResult[] = await res.json();
  if (!Array.isArray(arr) || arr.length === 0) return [];

  const data = arr.find((g) => g.id === gameId) || arr[0];
  const deals: ITADDeal[] = data?.deals || [];

  return deals
    .map((deal) => {
      const knownInfo   = SHOP_INFO[deal.shop.id];
      const salePrice   = deal.price?.amount   || 0;
      const normalPrice = deal.regular?.amount || salePrice;
      const savings     = deal.cut             || 0;
      return {
        storeId:     deal.shop.id.toString(),
        storeName:   knownInfo?.name || deal.shop.name,
        storeColor:  knownInfo?.color || "#64748b",
        salePrice,
        normalPrice,
        savings,
        isOnSale:    savings > 0,
        dealUrl:     deal.url || "#",
        isBest:      false,
        storeLow:    deal.storeLow?.amount || null,
        currency:    deal.price?.currency || "USD",
      };
    })
    .filter((p) => p.salePrice > 0)
    .sort((a, b) => a.salePrice - b.salePrice);
}

/* ─────────────────────────────────────────
   GET /api/prices?slug=hollow-knight&title=Hollow Knight
───────────────────────────────────────── */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const slug  = searchParams.get("slug")  || "";
  const title = searchParams.get("title") || "";

  if (!slug && !title) {
    return NextResponse.json({ error: "slug or title required" }, { status: 400 });
  }

  if (!ITAD_KEY) {
    return NextResponse.json(
      { error: "ITAD_API_KEY not set", prices: [], found: false },
      { status: 503 }
    );
  }

  try {
    // Use slug for exact match, fallback to title
    const lookupSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const gameId = await getGameIdBySlug(lookupSlug, title || undefined);

    if (!gameId) {
      return NextResponse.json({ prices: [], found: false, source: "itad" });
    }

    const prices = await getPricesByGameId(gameId);
    if (prices.length > 0) prices[0].isBest = true;

    return NextResponse.json({ prices, found: prices.length > 0, source: "itad" });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed", prices: [], found: false },
      { status: 500 }
    );
  }
}
