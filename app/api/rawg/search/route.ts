import { NextRequest, NextResponse } from "next/server";
import { searchRAWGGames, rawgToGame } from "@/lib/rawg";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q");

  if (!query) {
    return NextResponse.json({ error: "q param required" }, { status: 400 });
  }

  if (!process.env.RAWG_API_KEY) {
    return NextResponse.json(
      { error: "RAWG_API_KEY not set in .env.local", hint: "Get free key at rawg.io/apidocs" },
      { status: 503 }
    );
  }

  try {
    const results = await searchRAWGGames(query);
    return NextResponse.json({
      count: results.count,
      games: results.results.map(rawgToGame),
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Search failed" },
      { status: 500 }
    );
  }
}
