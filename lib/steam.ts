/**
 * Steam Store API integration
 * No API key required for basic game data
 * Uses Steam's public storefront API
 */

export interface SteamGame {
  steam_appid: number;
  name: string;
  short_description: string;
  detailed_description: string;
  header_image: string;        // 460x215 banner
  capsule_image: string;       // small capsule
  capsule_imagev5: string;     // large capsule
  screenshots: Array<{
    id: number;
    path_thumbnail: string;    // 600x338
    path_full: string;         // 1920x1080
  }>;
  movies?: Array<{
    id: number;
    name: string;
    thumbnail: string;
    webm: { 480: string; max: string };
    mp4: { 480: string; max: string };
  }>;
  genres: Array<{ id: string; description: string }>;
  categories: Array<{ id: number; description: string }>;
  developers: string[];
  publishers: string[];
  release_date: { coming_soon: boolean; date: string };
  platforms: { windows: boolean; mac: boolean; linux: boolean };
  metacritic?: { score: number; url: string };
  recommendations?: { total: number };
  price_overview?: {
    currency: string;
    initial: number;
    final: number;
    discount_percent: number;
    final_formatted: string;
  };
  is_free: boolean;
  background: string;
  background_raw: string;
}

// Popular game Steam App IDs
export const STEAM_APP_IDS: Record<string, number> = {
  "elden-ring":        1245620,
  "cyberpunk-2077":    1091500,
  "hollow-knight":     367520,
  "baldurs-gate-3":    1086940,
  "hades":             1145360,
  "stardew-valley":    413150,
  "valorant":          0,       // not on Steam
  "the-witcher-3":     292030,
  "minecraft":         0,       // not on Steam
  "sekiro":            814380,
  "among-us":          945360,
  "celeste":           504230,
};

/**
 * Fetch game details from Steam Store API
 * Uses a CORS proxy for client-side calls
 */
export async function getSteamGameData(appId: number): Promise<SteamGame | null> {
  if (!appId) return null;

  try {
    // Server-side: direct call
    const res = await fetch(
      `https://store.steampowered.com/api/appdetails?appids=${appId}&cc=us&l=en`,
      {
        headers: { "Accept-Language": "en-US,en;q=0.9" },
        next: { revalidate: 3600 }, // cache 1 hour
      }
    );

    if (!res.ok) return null;

    const data = await res.json();
    const gameData = data[appId.toString()];

    if (!gameData?.success) return null;
    return gameData.data as SteamGame;
  } catch {
    return null;
  }
}

/**
 * Get Steam cover image URL directly (no API needed)
 */
export function getSteamHeaderImage(appId: number): string {
  return `https://cdn.cloudflare.steamstatic.com/steam/apps/${appId}/header.jpg`;
}

export function getSteamCapsuleImage(appId: number): string {
  return `https://cdn.cloudflare.steamstatic.com/steam/apps/${appId}/capsule_616x353.jpg`;
}

export function getSteamLibraryCover(appId: number): string {
  return `https://cdn.cloudflare.steamstatic.com/steam/apps/${appId}/library_600x900.jpg`;
}

export function getSteamScreenshot(appId: number, index = 0): string {
  return `https://cdn.cloudflare.steamstatic.com/steam/apps/${appId}/ss_${index}.jpg`;
}

export function getSteamStoreUrl(appId: number): string {
  return `https://store.steampowered.com/app/${appId}`;
}
