import { NextResponse } from "next/server";

const RAWG_BASE = "https://api.rawg.io/api";
const RAWG_KEY  = process.env.RAWG_API_KEY || "";

async function fetchRAWG(path: string, params: Record<string, string> = {}) {
  const url = new URL(`${RAWG_BASE}${path}`);
  url.searchParams.set("key", RAWG_KEY);
  url.searchParams.set("page_size", "6");
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  const res = await fetch(url.toString(), { next: { revalidate: 3600 } });
  if (!res.ok) return null;
  return res.json();
}

export async function GET() {
  if (!RAWG_KEY) return NextResponse.json({ error: "No RAWG key" }, { status: 503 });

  const today = new Date();
  const fmt = (d: Date) => d.toISOString().split("T")[0];

  const last30Start = fmt(new Date(today.getTime() - 30 * 86400000));
  const thisWeekStart = fmt(new Date(today.getTime() - today.getDay() * 86400000));
  const thisWeekEnd = fmt(new Date(today.getTime() + (6 - today.getDay()) * 86400000));
  const nextWeekStart = fmt(new Date(today.getTime() + (7 - today.getDay()) * 86400000));
  const nextWeekEnd = fmt(new Date(today.getTime() + (13 - today.getDay()) * 86400000));
  const yearStart = `${today.getFullYear()}-01-01`;
  const yearEnd = fmt(today);

  const [
    last30Data, thisWeekData, nextWeekData,
    bestYearData, popular2025Data, allTimeData,
    genresData, platformsData,
  ] = await Promise.all([
    fetchRAWG("/games", { dates: `${last30Start},${fmt(today)}`, ordering: "-added" }),
    fetchRAWG("/games", { dates: `${thisWeekStart},${thisWeekEnd}`, ordering: "-added" }),
    fetchRAWG("/games", { dates: `${nextWeekStart},${nextWeekEnd}`, ordering: "-added" }),
    fetchRAWG("/games", { dates: `${yearStart},${yearEnd}`, ordering: "-metacritic", metacritic: "80,100" }),
    fetchRAWG("/games", { dates: "2025-01-01,2025-12-31", ordering: "-added" }),
    fetchRAWG("/games", { ordering: "-metacritic", metacritic: "90,100" }),
    fetchRAWG("/genres", { page_size: "20" }),
    fetchRAWG("/platforms", { page_size: "20" }),
  ]);

  const mapGames = (data: { results?: Array<{ slug: string; name: string; background_image: string | null; metacritic: number | null; rating: number }> } | null) =>
    (data?.results || []).map((g) => ({
      slug:       g.slug,
      name:       g.name,
      image:      g.background_image || "",
      metacritic: g.metacritic,
      rating:     Math.round(g.rating * 2 * 10) / 10,
    }));

  return NextResponse.json({
    newReleases: {
      last30:   { games: mapGames(last30Data),   count: last30Data?.count   || 0 },
      thisWeek: { games: mapGames(thisWeekData), count: thisWeekData?.count || 0 },
      nextWeek: { games: mapGames(nextWeekData), count: nextWeekData?.count || 0 },
    },
    top: {
      bestYear:    { games: mapGames(bestYearData),    count: bestYearData?.count    || 0 },
      popular2025: { games: mapGames(popular2025Data), count: popular2025Data?.count || 0 },
      allTime:     { games: mapGames(allTimeData),     count: allTimeData?.count     || 0 },
    },
    genres: (genresData?.results || []).map((g: { id: number; name: string; slug: string; games_count: number; image_background: string }) => ({
      id:    g.id,
      name:  g.name,
      slug:  g.slug,
      count: g.games_count,
      image: g.image_background,
    })),
    platforms: (platformsData?.results || []).map((p: { id: number; name: string; slug: string; games_count: number; image_background: string }) => ({
      id:    p.id,
      name:  p.name,
      slug:  p.slug,
      count: p.games_count,
      image: p.image_background,
    })),
  });
}
