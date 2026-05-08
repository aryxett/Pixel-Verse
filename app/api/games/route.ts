import { NextRequest, NextResponse } from "next/server";
import {
  getAllGames,
  getTrendingGames,
  getGamesByMood,
  searchGames,
} from "@/lib/games";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const mood = searchParams.get("mood");
  const search = searchParams.get("search");
  const trending = searchParams.get("trending");

  if (trending === "true") {
    return NextResponse.json(getTrendingGames());
  }

  if (mood) {
    return NextResponse.json(getGamesByMood(mood));
  }

  if (search) {
    return NextResponse.json(searchGames(search));
  }

  return NextResponse.json(getAllGames());
}
