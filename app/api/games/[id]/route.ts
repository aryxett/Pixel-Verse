import { NextRequest, NextResponse } from "next/server";
import { getGameById, getRelatedGames } from "@/lib/games";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const game = getGameById(id);

  if (!game) {
    return NextResponse.json({ error: "Game not found" }, { status: 404 });
  }

  const related = getRelatedGames(game);
  return NextResponse.json({ game, related });
}
