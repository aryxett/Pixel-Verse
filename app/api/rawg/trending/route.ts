import { NextResponse } from "next/server";
import { getTrendingRAWGGames, rawgToGame } from "@/lib/rawg";

export async function GET() {
  if (!process.env.RAWG_API_KEY) {
    return NextResponse.json(
      { error: "RAWG_API_KEY not set", hint: "Get free key at rawg.io/apidocs" },
      { status: 503 }
    );
  }

  try {
    const games = await getTrendingRAWGGames(12);
    return NextResponse.json(games.map(rawgToGame));
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed" },
      { status: 500 }
    );
  }
}
