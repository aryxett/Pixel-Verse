import { NextRequest, NextResponse } from "next/server";
import { generateAIResponse } from "@/lib/ai";

const RAWG_BASE = "https://api.rawg.io/api";
const RAWG_KEY  = process.env.RAWG_API_KEY || "";

/* ─────────────────────────────────────────
   Types
───────────────────────────────────────── */
interface DecisionInput {
  timeAvailable: number;
  mood: string;
  device: string;
}

export interface DecisionOutput {
  game: string;
  slug: string;
  reason: string;
  playtime: string;
  genre: string[];
  matchScore: number;
  image: string;
  rating: number;
  metacritic: number | null;
  releaseYear: number;
  developer: string;
  multiplayer: boolean;
}

/* ─────────────────────────────────────────
   Mood → RAWG genres + tags (strict)
───────────────────────────────────────── */
const MOOD_CONFIG: Record<string, { genres: string; tags: string; ordering: string }> = {
  chill:       { genres: "simulation,puzzle,casual",          tags: "relaxing,casual,farming,cozy",              ordering: "-rating" },
  action:      { genres: "action,shooter",                    tags: "action,fast-paced,combat,hack-and-slash",   ordering: "-metacritic" },
  competitive: { genres: "sports,racing,shooter",             tags: "competitive,multiplayer,esports,pvp",       ordering: "-added" },
  adventurous: { genres: "adventure,rpg,action-rpg",          tags: "open-world,exploration,story-rich",         ordering: "-metacritic" },
  creative:    { genres: "simulation,strategy,puzzle",        tags: "building,sandbox,crafting,base-building",   ordering: "-rating" },
  social:      { genres: "sports,racing,fighting",            tags: "co-op,multiplayer,online-co-op,local-co-op",ordering: "-added" },
  horror:      { genres: "action,adventure",                  tags: "horror,dark,atmospheric,survival-horror",   ordering: "-rating" },
};

/* ─────────────────────────────────────────
   Device → RAWG platform IDs (strict)
   PC=4, PS5=187, PS4=18, XboxSeries=186,
   XboxOne=1, Switch=7, iOS=3, Android=21
───────────────────────────────────────── */
const DEVICE_PLATFORM_IDS: Record<string, string> = {
  "low-end": "4,7,3,21",          // PC (low spec), Switch, iOS, Android
  "mid":     "4,18,1",            // PC, PS4, Xbox One
  "high":    "4,187,186",         // PC (high spec), PS5, Xbox Series
};

/* ─────────────────────────────────────────
   Device → min metacritic threshold
   High-end users expect premium games
───────────────────────────────────────── */
const DEVICE_MIN_METACRITIC: Record<string, string> = {
  "low-end": "60,100",
  "mid":     "70,100",
  "high":    "80,100",
};

/* ─────────────────────────────────────────
   Device → release year range
   High-end = modern games only
───────────────────────────────────────── */
const DEVICE_YEAR_RANGE: Record<string, { from: string; to: string }> = {
  "low-end": { from: "2010-01-01", to: "2024-12-31" },
  "mid":     { from: "2015-01-01", to: "2024-12-31" },
  "high":    { from: "2019-01-01", to: "2025-12-31" },
};

/* ─────────────────────────────────────────
   Device → required platform names for AI validation
───────────────────────────────────────── */
const DEVICE_PLATFORM_NAMES: Record<string, string[]> = {
  "low-end": ["PC", "macOS", "Linux", "Nintendo Switch", "iOS", "Android", "Web"],
  "mid":     ["PC", "macOS", "PlayStation 4", "Xbox One", "Nintendo Switch"],
  "high":    ["PC", "PlayStation 5", "Xbox Series S/X", "Xbox Series X"],
};

/* ─────────────────────────────────────────
   Time → playtime filter
───────────────────────────────────────── */
function getPlaytimeFilter(hours: number): { min: number; max: number } {
  if (hours <= 0.5) return { min: 0, max: 2 };
  if (hours <= 1)   return { min: 0, max: 5 };
  if (hours <= 2)   return { min: 1, max: 10 };
  if (hours <= 3)   return { min: 2, max: 20 };
  return              { min: 5, max: 999 };
}

/* ─────────────────────────────────────────
   Fallback
───────────────────────────────────────── */
const FALLBACK: DecisionOutput[] = [
  { game: "Elden Ring",      slug: "elden-ring",      reason: "Epic open-world RPG for high-end systems.",    playtime: "~3h",  genre: ["RPG", "Action"],   matchScore: 90, image: "", rating: 4.8, metacritic: 96, releaseYear: 2022, developer: "FromSoftware", multiplayer: false },
  { game: "Hades",           slug: "hades",           reason: "Perfect roguelike for any session length.",    playtime: "~1h",  genre: ["Roguelike"],        matchScore: 85, image: "", rating: 4.6, metacritic: 93, releaseYear: 2020, developer: "Supergiant",   multiplayer: false },
  { game: "Stardew Valley",  slug: "stardew-valley",  reason: "Relaxing farming sim, runs on any device.",   playtime: "~2h",  genre: ["Simulation"],       matchScore: 80, image: "", rating: 4.6, metacritic: 89, releaseYear: 2016, developer: "ConcernedApe", multiplayer: false },
];

/* ─────────────────────────────────────────
   RAWG game type
───────────────────────────────────────── */
interface RAWGGame {
  id: number;
  slug: string;
  name: string;
  background_image: string | null;
  rating: number;
  metacritic: number | null;
  released: string | null;
  playtime: number;
  genres: Array<{ name: string; slug: string }>;
  tags: Array<{ slug: string; name: string }>;
  developers?: Array<{ name: string }>;
  platforms?: Array<{ platform: { id: number; name: string } }>;
}

/* ─────────────────────────────────────────
   Fetch games from RAWG with strict filters
───────────────────────────────────────── */
async function fetchRAWGGames(input: DecisionInput): Promise<RAWGGame[]> {
  if (!RAWG_KEY) return [];

  const cfg        = MOOD_CONFIG[input.mood] || MOOD_CONFIG["action"];
  const platforms  = DEVICE_PLATFORM_IDS[input.device] || DEVICE_PLATFORM_IDS["mid"];
  const metacritic = DEVICE_MIN_METACRITIC[input.device] || "70,100";
  const yearRange  = DEVICE_YEAR_RANGE[input.device] || DEVICE_YEAR_RANGE["mid"];
  const ptFilter   = getPlaytimeFilter(input.timeAvailable);

  const url = new URL(`${RAWG_BASE}/games`);
  url.searchParams.set("key",        RAWG_KEY);
  url.searchParams.set("genres",     cfg.genres);
  url.searchParams.set("tags",       cfg.tags);
  url.searchParams.set("platforms",  platforms);
  url.searchParams.set("metacritic", metacritic);
  url.searchParams.set("ordering",   cfg.ordering);
  url.searchParams.set("page_size",  "40");
  // Strict year filter — high-end only gets modern games
  url.searchParams.set("dates", `${yearRange.from},${yearRange.to}`);

  try {
    const res = await fetch(url.toString(), { next: { revalidate: 1800 } });
    if (!res.ok) return [];
    const data = await res.json();
    let games: RAWGGame[] = data.results || [];

    // Client-side playtime filter
    games = games.filter((g) => {
      if (!g.playtime || g.playtime === 0) return true;
      return g.playtime >= ptFilter.min && g.playtime <= ptFilter.max;
    });

    // Strict platform validation — remove games that don't run on selected device
    const validPlatformNames = DEVICE_PLATFORM_NAMES[input.device] || [];
    games = games.filter((g) => {
      if (!g.platforms || g.platforms.length === 0) return false;
      return g.platforms.some((p) =>
        validPlatformNames.some((vp) =>
          p.platform.name.toLowerCase().includes(vp.toLowerCase())
        )
      );
    });

    return games;
  } catch {
    return [];
  }
}

/* ─────────────────────────────────────────
   Build AI prompt
───────────────────────────────────────── */
function buildPrompt(input: DecisionInput, games: RAWGGame[]): string {
  const ptFilter      = getPlaytimeFilter(input.timeAvailable);
  const platformNames = DEVICE_PLATFORM_NAMES[input.device]?.join(", ") || "";
  const yearRange     = DEVICE_YEAR_RANGE[input.device];

  const gameList = games
    .slice(0, 25)
    .map((g) => {
      const genres = g.genres.map((gen) => gen.name).join("/");
      const pt     = g.playtime ? `${g.playtime}h avg` : "unknown";
      const mc     = g.metacritic ? ` MC:${g.metacritic}` : "";
      const year   = g.released ? new Date(g.released).getFullYear() : "?";
      const plat   = g.platforms?.map((p) => p.platform.name).slice(0, 3).join("/") || "";
      return `- ${g.name} [${g.slug}] (${genres}, ${pt}${mc}, ${year}, ${plat})`;
    })
    .join("\n");

  return `STRICT RULES — you MUST follow these:
1. Only recommend games released after ${yearRange.from.slice(0, 4)}
2. Only recommend games that run on: ${platformNames}
3. Only recommend games with session length ${ptFilter.min}-${ptFilter.max}h
4. Mood must be: ${input.mood}

User: ${input.timeAvailable}h available, ${input.mood} mood, ${input.device} device (${platformNames})

Games (already filtered — pick from these only):
${gameList}

Pick TOP 5. Return ONLY valid JSON array:
[
  {
    "game": "exact name from list",
    "slug": "exact slug from list",
    "reason": "1 sentence why it fits ${input.timeAvailable}h ${input.mood} on ${input.device}",
    "playtime": "~${input.timeAvailable}h session",
    "matchScore": 0-100
  }
]`;
}

/* ─────────────────────────────────────────
   Parse AI response
───────────────────────────────────────── */
function parseAIResponse(raw: string, rawgGames: RAWGGame[]): DecisionOutput[] | null {
  try {
    const cleaned = raw.replace(/```json\s*/gi, "").replace(/```\s*/g, "").trim();
    const match   = cleaned.match(/\[[\s\S]*\]/);
    if (!match) return null;

    const parsed = JSON.parse(match[0]);
    if (!Array.isArray(parsed) || parsed.length === 0) return null;

    return parsed
      .filter((item) => typeof item.game === "string")
      .map((item) => {
        const rawg = rawgGames.find(
          (g) => g.slug === item.slug || g.name.toLowerCase() === item.game.toLowerCase()
        );
        const isMulti = rawg?.tags?.some((t) =>
          ["multiplayer", "co-op", "online-co-op", "online-multiplayer"].includes(t.slug)
        ) || false;

        return {
          game:        item.game,
          slug:        item.slug || rawg?.slug || item.game.toLowerCase().replace(/\s+/g, "-"),
          reason:      item.reason || "",
          playtime:    item.playtime || (rawg?.playtime ? `~${rawg.playtime}h` : "Varies"),
          genre:       rawg?.genres.map((g) => g.name) || [],
          matchScore:  typeof item.matchScore === "number" ? Math.min(100, Math.max(0, item.matchScore)) : 75,
          image:       rawg?.background_image || "",
          rating:      rawg ? Math.round(rawg.rating * 2 * 10) / 10 : 0,
          metacritic:  rawg?.metacritic || null,
          releaseYear: rawg?.released ? new Date(rawg.released).getFullYear() : 0,
          developer:   rawg?.developers?.[0]?.name || "Unknown",
          multiplayer: isMulti,
        };
      })
      .slice(0, 5);
  } catch {
    return null;
  }
}

/* ─────────────────────────────────────────
   Input validator
───────────────────────────────────────── */
function validateInput(body: unknown): { valid: true; data: DecisionInput } | { valid: false; error: string } {
  if (!body || typeof body !== "object")
    return { valid: false, error: "Request body must be a JSON object" };
  const b = body as Record<string, unknown>;
  if (b.timeAvailable === undefined) return { valid: false, error: "timeAvailable required" };
  if (typeof b.timeAvailable !== "number" || b.timeAvailable <= 0) return { valid: false, error: "timeAvailable must be positive number" };
  if (!b.mood || typeof b.mood !== "string") return { valid: false, error: "mood required" };
  if (!b.device || typeof b.device !== "string") return { valid: false, error: "device required (low-end|mid|high)" };
  const validDevices = ["low-end", "mid", "high"];
  if (!validDevices.includes((b.device as string).toLowerCase())) return { valid: false, error: `device must be: ${validDevices.join(", ")}` };
  return { valid: true, data: { timeAvailable: b.timeAvailable as number, mood: (b.mood as string).trim().toLowerCase(), device: (b.device as string).trim().toLowerCase() } };
}

/* ─────────────────────────────────────────
   POST /api/decision
───────────────────────────────────────── */
export async function POST(req: NextRequest) {
  let body: unknown;
  try { body = await req.json(); }
  catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

  const validation = validateInput(body);
  if (!validation.valid) return NextResponse.json({ error: validation.error }, { status: 400 });

  const input = validation.data;
  const rawgGames = await fetchRAWGGames(input);

  if (rawgGames.length === 0) {
    return NextResponse.json({ results: FALLBACK, fallback: true }, { status: 200 });
  }

  let aiRaw: string;
  try {
    aiRaw = await generateAIResponse(buildPrompt(input, rawgGames), {
      temperature: 0.6,
      maxTokens:   700,
      systemPrompt: "You are a professional gaming assistant. Recommend games based on user constraints. Respond ONLY with valid JSON array. No markdown, no explanation outside JSON.",
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "AI error";
    return NextResponse.json({ results: FALLBACK, fallback: true, error: msg }, { status: 200 });
  }

  const results = parseAIResponse(aiRaw, rawgGames);
  if (!results || results.length === 0) {
    return NextResponse.json({ results: FALLBACK, fallback: true }, { status: 200 });
  }

  return NextResponse.json({ results }, { status: 200 });
}

export async function GET() {
  return NextResponse.json({ endpoint: "POST /api/decision", description: "AI Game Decision Engine — RAWG.io powered" });
}
