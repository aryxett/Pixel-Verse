import { NextRequest, NextResponse } from "next/server";
import { getGameRecommendation } from "@/lib/ai";
import { getAllGames } from "@/lib/games";
import { searchRAWGGames, getTrendingRAWGGames } from "@/lib/rawg";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { query } = body;

    if (!query || typeof query !== "string") {
      return NextResponse.json({ error: "query is required" }, { status: 400 });
    }

    // 1. Fetch real-time data from RAWG matching the query
    const searchResults = await searchRAWGGames(query).catch(() => null);

    // 2. Fetch the latest trending games from RAWG to keep the AI updated on new releases
    const trendingResults = await getTrendingRAWGGames(10).catch(() => null);

    // 3. Format the real-time context
    const currentDateStr = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    let realTimeContext = `[System Context]\n- User's Current Date: ${currentDateStr}\n- Rule: Treat ${currentDateStr} as the absolute present day. Compare all game release dates against this date. If a game's release date is before ${currentDateStr}, it has ALREADY been released. If it is after, it is UPCOMING.\n`;
    
    if (searchResults && searchResults.results?.length > 0) {
      realTimeContext += "\n[Real-time search results matching user query from RAWG database]:\n";
      searchResults.results.slice(0, 5).forEach((g) => {
        const released = g.released || "Unknown";
        const meta = g.metacritic ? `${g.metacritic}/100` : "N/A";
        const genres = g.genres?.map((x) => x.name).join(", ") || "Unknown";
        realTimeContext += `- "${g.name}" (Released: ${released}, Metacritic: ${meta}, Genres: ${genres})\n`;
      });
    }

    if (trendingResults && trendingResults.length > 0) {
      realTimeContext += "\n[Current trending & popular games from RAWG database]:\n";
      trendingResults.slice(0, 5).forEach((g) => {
        const released = g.released || "Unknown";
        const meta = g.metacritic ? `${g.metacritic}/100` : "N/A";
        const genres = g.genres?.map((x) => x.name).join(", ") || "Unknown";
        realTimeContext += `- "${g.name}" (Released: ${released}, Metacritic: ${meta}, Genres: ${genres})\n`;
      });
    }

    // Prepend real-time context to help the AI answer with the latest data
    const enrichedQuery = `${query}\n\n${realTimeContext}`;

    const games = getAllGames();
    const gameTitles = games.map((g) => g.title);

    const recommendation = await getGameRecommendation(enrichedQuery, gameTitles);
    return NextResponse.json({ recommendation });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    if (message.includes("timed out") || message.includes("No AI API key")) {
      return NextResponse.json({ error: message, fallback: true }, { status: 503 });
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
