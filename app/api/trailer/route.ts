import { NextRequest, NextResponse } from "next/server";

const RAWG_BASE = "https://api.rawg.io/api";
const RAWG_KEY = process.env.RAWG_API_KEY || "";
const YT_KEY = process.env.YOUTUBE_API_KEY || "";

/* ── RAWG movies ── */
async function getRawgTrailer(slug: string): Promise<string | null> {
  if (!RAWG_KEY) return null;
  try {
    const res = await fetch(
      `${RAWG_BASE}/games/${slug}/movies?key=${RAWG_KEY}`,
      { next: { revalidate: 86400 } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    const movies = data.results || [];
    if (!movies.length) return null;
    return movies[0]?.data?.max || movies[0]?.data?.["480"] || null;
  } catch { return null; }
}

/* ── YouTube Data API v3 ── */
async function getYouTubeVideoId(gameTitle: string): Promise<string | null> {
  if (!YT_KEY) return null;
  try {
    const q = encodeURIComponent(`${gameTitle} official game trailer`);
    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${q}&type=video&maxResults=3&videoCategoryId=20&key=${YT_KEY}`,
      { next: { revalidate: 86400 } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    const items = data.items || [];
    if (!items.length) return null;
    // Pick first result that has "trailer" or "official" in title
    const best = items.find((item: any) => {
      const t = item.snippet.title.toLowerCase();
      return t.includes("trailer") || t.includes("official");
    }) || items[0];
    return best?.id?.videoId || null;
  } catch { return null; }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const slug  = searchParams.get("slug") || "";
  const title = searchParams.get("title") || "";

  if (!slug && !title) {
    return NextResponse.json({ error: "slug or title required" }, { status: 400 });
  }

  // 1. Try RAWG mp4 first
  const rawgMp4 = slug ? await getRawgTrailer(slug) : null;
  if (rawgMp4) {
    return NextResponse.json({ type: "mp4", url: rawgMp4, source: "rawg" });
  }

  // 2. Try YouTube API
  const ytId = await getYouTubeVideoId(title || slug.replace(/-/g, " "));
  if (ytId) {
    return NextResponse.json({
      type: "youtube",
      videoId: ytId,
      embedUrl: `https://www.youtube-nocookie.com/embed/${ytId}?autoplay=1&mute=1&controls=1&rel=0&modestbranding=1&playsinline=1`,
      thumbnailUrl: `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg`,
      source: "youtube",
    });
  }

  // 3. No trailer found
  return NextResponse.json({ type: "none", source: null });
}
