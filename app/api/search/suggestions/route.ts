import { NextRequest, NextResponse } from "next/server";

const RAWG_BASE = "https://api.rawg.io/api";
const RAWG_KEY  = process.env.RAWG_API_KEY || "";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query  = searchParams.get("q")     || "";
  const genre  = searchParams.get("genre") || "";
  const limit  = parseInt(searchParams.get("limit") || "8");

  if (!RAWG_KEY) {
    return NextResponse.json({ suggestions: [] });
  }

  try {
    // If no text query, fall back to simple top-rated search (by genre if specified)
    if (!query) {
      const url = new URL(`${RAWG_BASE}/games`);
      url.searchParams.set("key",       RAWG_KEY);
      url.searchParams.set("page_size", limit.toString());
      url.searchParams.set("ordering",  "-rating");
      if (genre) {
        url.searchParams.set("genres", genre);
      }

      const res = await fetch(url.toString(), { next: { revalidate: 300 } });
      if (!res.ok) return NextResponse.json({ suggestions: [] });
      const data = await res.json();
      
      interface RawgGameResult {
        slug: string;
        name: string;
        background_image: string | null;
        rating: number;
        genres?: Array<{ name: string; slug?: string }>;
        tags?: Array<{ slug?: string }>;
        metacritic: number | null;
      }

      const results = (data.results || []).map((g: RawgGameResult) => ({
        slug:       g.slug,
        title:      g.name,
        image:      g.background_image || "",
        rating:     Math.round(g.rating * 2 * 10) / 10,
        genre:      g.genres?.slice(0, 2).map((gen) => gen.name) || [],
        metacritic: g.metacritic || null,
        relation:   "match",
      }));
      return NextResponse.json({ suggestions: results });
    }

    // High relevance search query (remove general rating ordering to prioritize search term matching)
    const searchUrl = new URL(`${RAWG_BASE}/games`);
    searchUrl.searchParams.set("key", RAWG_KEY);
    searchUrl.searchParams.set("search", query);
    searchUrl.searchParams.set("search_precise", "true");
    searchUrl.searchParams.set("search_exact", "false");
    searchUrl.searchParams.set("page_size", "8");
    if (genre) {
      searchUrl.searchParams.set("genres", genre);
    }

    const searchRes = await fetch(searchUrl.toString(), { next: { revalidate: 300 } });
    if (!searchRes.ok) return NextResponse.json({ suggestions: [] });
    const searchData = await searchRes.json();
    
    interface RawgGameResult {
      slug: string;
      name: string;
      background_image: string | null;
      rating: number;
      genres?: Array<{ name: string; slug?: string }>;
      tags?: Array<{ slug?: string }>;
      metacritic: number | null;
    }

    const searchResults: RawgGameResult[] = searchData.results || [];

    if (searchResults.length === 0) {
      return NextResponse.json({ suggestions: [] });
    }

    const topGame = searchResults[0];

    // Fetch game-series and similar games concurrently
    const seriesPromise: Promise<{ results: RawgGameResult[] } | null> = fetch(
      `${RAWG_BASE}/games/${topGame.slug}/game-series?key=${RAWG_KEY}&page_size=5`,
      { next: { revalidate: 3600 } }
    ).then((r) => (r.ok ? r.json() : null));

    // Construct similar games query based on top game's genres/tags
    const genresCsv = topGame.genres?.map((g) => g.slug).filter(Boolean).join(",") || "";
    const tagsCsv = topGame.tags?.slice(0, 3).map((t) => t.slug).filter(Boolean).join(",") || "";

    let similarPromise: Promise<{ results: RawgGameResult[] } | null> = Promise.resolve(null);
    if (genresCsv || tagsCsv) {
      const similarUrl = new URL(`${RAWG_BASE}/games`);
      similarUrl.searchParams.set("key", RAWG_KEY);
      if (genresCsv) similarUrl.searchParams.set("genres", genresCsv);
      if (tagsCsv) similarUrl.searchParams.set("tags", tagsCsv);
      similarUrl.searchParams.set("ordering", "-rating");
      similarUrl.searchParams.set("page_size", "6");
      similarPromise = fetch(similarUrl.toString(), { next: { revalidate: 3600 } })
        .then((r) => (r.ok ? r.json() : null));
    }

    const [seriesResult, similarResult] = await Promise.allSettled([
      seriesPromise,
      similarPromise,
    ]);

    const seriesGames: RawgGameResult[] =
      seriesResult.status === "fulfilled" && seriesResult.value
        ? seriesResult.value.results || []
        : [];

    const similarGames: RawgGameResult[] =
      similarResult.status === "fulfilled" && similarResult.value
        ? similarResult.value.results || []
        : [];

    // Format & merge
    const format = (g: RawgGameResult, relation: string) => ({
      slug:       g.slug,
      title:      g.name,
      image:      g.background_image || "",
      rating:     Math.round(g.rating * 2 * 10) / 10,
      genre:      g.genres?.slice(0, 2).map((gen) => gen.name) || [],
      metacritic: g.metacritic || null,
      relation,
    });

    interface FormattedSuggestion {
      slug: string;
      title: string;
      image: string;
      rating: number;
      genre: string[];
      metacritic: number | null;
      relation: string;
    }

    const suggestions: FormattedSuggestion[] = [];
    const seen = new Set<string>();

    // 1. Add matches (up to 6)
    for (const g of searchResults.slice(0, 6)) {
      if (!seen.has(g.slug)) {
        seen.add(g.slug);
        suggestions.push(format(g, "match"));
      }
    }

    // 2. Add series/parts (up to 4)
    let seriesCount = 0;
    for (const g of seriesGames) {
      if (!seen.has(g.slug) && seriesCount < 4) {
        seen.add(g.slug);
        suggestions.push(format(g, "series"));
        seriesCount++;
      }
    }

    // 3. Add similar/related games (up to 4)
    let similarCount = 0;
    for (const g of similarGames) {
      if (!seen.has(g.slug) && similarCount < 4) {
        seen.add(g.slug);
        suggestions.push(format(g, "similar"));
        similarCount++;
      }
    }

    return NextResponse.json({ suggestions });
  } catch {
    return NextResponse.json({ suggestions: [] });
  }
}
