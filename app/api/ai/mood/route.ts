import { NextRequest, NextResponse } from "next/server";
import { getMoodSuggestion } from "@/lib/ai";
import { getAllGames } from "@/lib/games";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { mood } = body;

    if (!mood || typeof mood !== "string") {
      return NextResponse.json({ error: "mood is required" }, { status: 400 });
    }

    const games = getAllGames().map((g) => ({ title: g.title, genre: g.genre }));
    const suggestion = await getMoodSuggestion(mood, games);

    return NextResponse.json({ suggestion, mood });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
