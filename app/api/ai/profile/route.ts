import { NextRequest, NextResponse } from "next/server";
import { getGamerProfile } from "@/lib/ai";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { favoriteGames, playStyle, hoursPerWeek } = body;

    if (!favoriteGames || !Array.isArray(favoriteGames)) {
      return NextResponse.json({ error: "favoriteGames array is required" }, { status: 400 });
    }

    const profile = await getGamerProfile(
      favoriteGames,
      playStyle || "casual",
      hoursPerWeek || 10
    );

    return NextResponse.json({ profile });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";

    // Offline fallback
    if (message.includes("timed out") || message.includes("No AI API key")) {
      return NextResponse.json({
        profile: {
          archetype: "The Versatile Gamer",
          description: "You have a diverse taste in games and adapt to any challenge. Your gaming style is unique and hard to pin down.",
          strengths: ["Adaptability", "Game sense", "Strategic thinking", "Persistence"],
          recommendations: ["Elden Ring", "Hades", "Stardew Valley"],
          playstyleScore: { strategy: 65, action: 70, exploration: 75, social: 50, creativity: 60 },
        },
        offline: true,
      });
    }

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
