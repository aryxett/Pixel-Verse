/**
 * RAWG.io API integration
 * Free tier: 20,000 requests/month
 * Get your free API key at: https://rawg.io/apidocs
 * Set RAWG_API_KEY in .env.local
 */

const RAWG_BASE = "https://api.rawg.io/api";
const RAWG_KEY = process.env.RAWG_API_KEY || "";

export interface RAWGGame {
  id: number;
  slug: string;
  name: string;
  released: string;
  background_image: string;
  rating: number;           // 0-5
  rating_top: number;
  ratings_count: number;
  metacritic: number | null;
  playtime: number;         // avg hours
  platforms: Array<{
    platform: { id: number; name: string; slug: string };
  }>;
  genres: Array<{ id: number; name: string; slug: string }>;
  tags: Array<{ id: number; name: string; slug: string }>;
  developers: Array<{ id: number; name: string; slug: string }>;
  publishers: Array<{ id: number; name: string; slug: string }>;
  description_raw?: string;
  short_screenshots?: Array<{ id: number; image: string }>;
  ratings?: Array<{
    id: number;
    title: string;  // "exceptional" | "recommended" | "meh" | "skip"
    count: number;
    percent: number;
  }>;
  esrb_rating?: { id: number; name: string; slug: string } | null;
  website?: string;
}

export interface RAWGReview {
  id: number;
  text: string;
  rating: number;
  created: string;
  user: { username: string; avatar: string | null };
  reactions: Record<string, number>;
}

export interface RAWGSearchResult {
  count: number;
  results: RAWGGame[];
}

function buildUrl(path: string, params: Record<string, string | number> = {}): string {
  const url = new URL(`${RAWG_BASE}${path}`);
  if (RAWG_KEY) url.searchParams.set("key", RAWG_KEY);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, String(v)));
  return url.toString();
}

/**
 * Search games by name
 */
export async function searchRAWGGames(query: string, page = 1): Promise<RAWGSearchResult> {
  const url = buildUrl("/games", { search: query, page, page_size: 10 });
  const res = await fetch(url, { next: { revalidate: 3600 } });
  if (!res.ok) throw new Error(`RAWG search failed: ${res.status}`);
  return res.json();
}

/**
 * Get game details by RAWG slug or ID
 */
export async function getRAWGGame(slugOrId: string | number): Promise<RAWGGame> {
  const url = buildUrl(`/games/${slugOrId}`);
  const res = await fetch(url, { next: { revalidate: 3600 } });
  if (!res.ok) throw new Error(`RAWG game fetch failed: ${res.status}`);
  return res.json();
}

/**
 * Get trending/popular games
 */
export async function getTrendingRAWGGames(count = 12): Promise<RAWGGame[]> {
  const url = buildUrl("/games", {
    ordering: "-added",
    page_size: count,
    metacritic: "60,100",
  });
  const res = await fetch(url, { next: { revalidate: 1800 } });
  if (!res.ok) return [];
  const data: RAWGSearchResult = await res.json();
  return data.results;
}

/**
 * Get top rated games
 */
export async function getTopRatedRAWGGames(count = 12): Promise<RAWGGame[]> {
  const url = buildUrl("/games", {
    ordering: "-metacritic",
    page_size: count,
    metacritic: "80,100",
  });
  const res = await fetch(url, { next: { revalidate: 3600 } });
  if (!res.ok) return [];
  const data: RAWGSearchResult = await res.json();
  return data.results;
}

/**
 * Get games by genre
 */
export async function getRAWGGamesByGenre(genre: string, count = 12): Promise<RAWGGame[]> {
  const url = buildUrl("/games", {
    genres: genre,
    ordering: "-rating",
    page_size: count,
  });
  const res = await fetch(url, { next: { revalidate: 3600 } });
  if (!res.ok) return [];
  const data: RAWGSearchResult = await res.json();
  return data.results;
}

/**
 * Get game screenshots
 */
export async function getRAWGScreenshots(slugOrId: string | number): Promise<string[]> {
  const url = buildUrl(`/games/${slugOrId}/screenshots`, { page_size: 8 });
  const res = await fetch(url, { next: { revalidate: 86400 } });
  if (!res.ok) return [];
  const data = await res.json();
  return (data.results || []).map((s: { image: string }) => s.image);
}

/**
 * Convert RAWG rating (0-5) to 10-point scale
 */
export function rawgRatingTo10(rating: number): number {
  return Math.round(rating * 2 * 10) / 10;
}

/**
 * Map RAWG game to our Game format
 */
export function rawgToGame(g: RAWGGame) {
  return {
    id: g.slug,
    title: g.name,
    genre: g.genres.map((gen) => gen.name),
    platform: g.platforms.map((p) => p.platform.name),
    rating: rawgRatingTo10(g.rating),
    metacritic: g.metacritic,
    releaseYear: g.released ? new Date(g.released).getFullYear() : 0,
    developer: g.developers?.[0]?.name || "Unknown",
    publisher: g.publishers?.[0]?.name || "Unknown",
    description: g.description_raw?.slice(0, 300) || "",
    image: g.background_image || "",
    coverColor: "#1a1a2e",
    tags: g.tags?.slice(0, 6).map((t) => t.slug) || [],
    mood: [],
    trending: false,
    aiScore: g.metacritic ? Math.round(g.metacritic * 0.95) : Math.round(g.rating * 18),
    playtime: g.playtime ? `~${g.playtime}h` : "Unknown",
    multiplayer: g.tags?.some((t) => ["multiplayer", "co-op", "online-co-op"].includes(t.slug)) || false,
    rawgId: g.id,
    ratingsCount: g.ratings_count,
    ratings: g.ratings,
  };
}
