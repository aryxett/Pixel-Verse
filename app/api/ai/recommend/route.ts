import { NextRequest, NextResponse } from "next/server";
import { getGameRecommendation } from "@/lib/ai";
import { getAllGames } from "@/lib/games";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { query } = body;

    if (!query || typeof query !== "string") {
      return NextResponse.json({ error: "query is required" }, { status: 400 });
    }

    const games = getAllGames();
    const gameTitles = games.map((g) => g.title);

    const recommendation = await getGameRecommendation(query, gameTitles);
    return NextResponse.json({ recommendation });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    if (message.includes("timed out") || message.includes("No AI API key")) {
      return NextResponse.json({ error: message, fallback: true }, { status: 503 });
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
