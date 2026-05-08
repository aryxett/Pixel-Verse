import { NextRequest, NextResponse } from "next/server";
import { rawgToGame } from "@/lib/rawg";

const RAWG_BASE = "https://api.rawg.io/api";
const RAWG_KEY = process.env.RAWG_API_KEY || "";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const search   = searchParams.get("search") || "";
  const genre    = searchParams.get("genre") || "";
  const platform = searchParams.get("platform") || "";
  const ordering = searchParams.get("ordering") || "-rating";
  const page     = searchParams.get("page") || "1";
  const pageSize = searchParams.get("page_size") || "24";
  const multi    = searchParams.get("multiplayer") || "";
  const metacritic = searchParams.get("metacritic") || "";
  const dates    = searchParams.get("dates") || "";

  if (!RAWG_KEY) {
    return NextResponse.json(
      { error: "RAWG_API_KEY not set" },
      { status: 503 }
    );
  }

  const url = new URL(`${RAWG_BASE}/games`);
  url.searchParams.set("key", RAWG_KEY);
  url.searchParams.set("page", page);
  url.searchParams.set("page_size", pageSize);
  url.searchParams.set("ordering", ordering);

  if (search)    url.searchParams.set("search", search);
  if (genre)     url.searchParams.set("genres", genre);
  if (platform)  url.searchParams.set("platforms", platform);
  if (metacritic) url.searchParams.set("metacritic", metacritic);
  if (multi === "true") url.searchParams.set("tags", "multiplayer");
  if (dates)     url.searchParams.set("dates", dates);
  // Always show well-known games first when browsing by genre
  if (genre && !search && !metacritic) {
    url.searchParams.set("metacritic", "60,100");
  }

  try {
    const res = await fetch(url.toString(), {
      next: { revalidate: 300 },
    });

    if (!res.ok) {
      const err = await res.text();
      return NextResponse.json({ error: err }, { status: res.status });
    }

    const data = await res.json();

    return NextResponse.json({
      count: data.count,
      next: data.next ? true : false,
      previous: data.previous ? true : false,
      page: parseInt(page),
      results: (data.results || []).map(rawgToGame),
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed" },
      { status: 500 }
    );
  }
}
