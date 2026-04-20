import { NextRequest, NextResponse } from "next/server";
import { getRAWGGame, getRAWGScreenshots, rawgToGame } from "@/lib/rawg";

const RAWG_BASE = "https://api.rawg.io/api";
const RAWG_KEY = process.env.RAWG_API_KEY || "";
const YT_KEY   = process.env.YOUTUBE_API_KEY || "";

async function getRawgTrailer(slug: string): Promise<string | null> {
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
    const best = items.find((item: { snippet: { title: string }; id: { videoId: string } }) => {
      const t = item.snippet.title.toLowerCase();
      return t.includes("trailer") || t.includes("official");
    }) || items[0];
    return best?.id?.videoId || null;
  } catch { return null; }
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  if (!RAWG_KEY) {
    return NextResponse.json({ error: "RAWG_API_KEY not set" }, { status: 503 });
  }

  try {
    const [game, screenshots, rawgMp4] = await Promise.all([
      getRAWGGame(slug),
      getRAWGScreenshots(slug),
      getRawgTrailer(slug),
    ]);

    // Get YouTube ID if no RAWG trailer
    const ytVideoId = rawgMp4 ? null : await getYouTubeVideoId(game.name);

    return NextResponse.json({
      ...rawgToGame(game),
      screenshots,
      description_full: game.description_raw,
      esrb: game.esrb_rating?.name || null,
      website: game.website || null,
      ratings_breakdown: game.ratings || [],
      trailer_mp4: rawgMp4 || null,
      trailer_youtube_id: ytVideoId,
      trailer_youtube_embed: ytVideoId
        ? `https://www.youtube-nocookie.com/embed/${ytVideoId}?autoplay=1&mute=0&controls=1&rel=0&modestbranding=1`
        : null,
      trailer_youtube_thumb: ytVideoId
        ? `https://img.youtube.com/vi/${ytVideoId}/maxresdefault.jpg`
        : null,
      has_trailer: !!(rawgMp4 || ytVideoId),
      trailer_source: rawgMp4 ? "rawg" : ytVideoId ? "youtube" : "none",
      // Game facts
      achievements_count: (game as any).achievements_count || 0,
      additions_count:    (game as any).additions_count    || 0,
      game_series_count:  (game as any).game_series_count  || 0,
      reviews_count:      (game as any).reviews_count      || 0,
      suggestions_count:  (game as any).suggestions_count  || 0,
      added:              (game as any).added               || 0,
      added_by_status:    (game as any).added_by_status     || null,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Not found" },
      { status: 404 }
    );
  }
}
