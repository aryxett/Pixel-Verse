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
    const url = new URL(`${RAWG_BASE}/games`);
    url.searchParams.set("key",       RAWG_KEY);
    url.searchParams.set("page_size", limit.toString());
    url.searchParams.set("ordering",  "-rating");

    if (query) {
      url.searchParams.set("search",             query);
      url.searchParams.set("search_precise",     "true");
      url.searchParams.set("search_exact",       "false");
    }
    if (genre) {
      url.searchParams.set("genres", genre);
    }

    const res = await fetch(url.toString(), { next: { revalidate: 300 } });
    if (!res.ok) return NextResponse.json({ suggestions: [] });

    const data = await res.json();
    const results = (data.results || []).map((g: {
      slug: string;
      name: string;
      background_image: string | null;
      rating: number;
      genres: Array<{ name: string }>;
      metacritic: number | null;
    }) => ({
      slug:       g.slug,
      title:      g.name,
      image:      g.background_image || "",
      rating:     Math.round(g.rating * 2 * 10) / 10,
      genre:      g.genres?.slice(0, 2).map((gen) => gen.name) || [],
      metacritic: g.metacritic || null,
    }));

    return NextResponse.json({ suggestions: results });
  } catch {
    return NextResponse.json({ suggestions: [] });
  }
}
