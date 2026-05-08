import { notFound } from "next/navigation";
import { getGameById, getRelatedGames } from "@/lib/games";
import GameDetailClient from "./GameDetailClient";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  const { getAllGames } = await import("@/lib/games");
  return getAllGames().map((g) => ({ id: g.id }));
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const game = getGameById(id);
  if (!game) return { title: "Game Not Found" };
  return {
    title: `${game.title} — PixelVerse`,
    description: game.description,
  };
}

export default async function GameDetailPage({ params }: Props) {
  const { id } = await params;
  const game = getGameById(id);

  if (!game) notFound();

  const related = getRelatedGames(game);

  return <GameDetailClient game={game} related={related} />;
}
