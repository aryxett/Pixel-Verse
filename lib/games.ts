/**
 * Game data access layer
 * Reads from JSON — swap with DB queries when MongoDB is connected
 */

import gamesData from "@/data/games.json";

export interface Game {
  id: string;
  title: string;
  genre: string[];
  platform: string[];
  rating: number;
  releaseYear: number;
  developer: string;
  publisher: string;
  description: string;
  image: string;
  coverColor: string;
  tags: string[];
  mood: string[];
  trending: boolean;
  aiScore: number;
  playtime: string;
  multiplayer: boolean;
}

export function getAllGames(): Game[] {
  return gamesData as Game[];
}

export function getGameById(id: string): Game | undefined {
  return (gamesData as Game[]).find((g) => g.id === id);
}

export function getTrendingGames(): Game[] {
  return (gamesData as Game[]).filter((g) => g.trending);
}

export function getGamesByMood(mood: string): Game[] {
  return (gamesData as Game[]).filter((g) => g.mood.includes(mood));
}

export function getGamesByGenre(genre: string): Game[] {
  return (gamesData as Game[]).filter((g) =>
    g.genre.some((gen) => gen.toLowerCase() === genre.toLowerCase())
  );
}

export function searchGames(query: string): Game[] {
  const q = query.toLowerCase();
  return (gamesData as Game[]).filter(
    (g) =>
      g.title.toLowerCase().includes(q) ||
      g.genre.some((gen) => gen.toLowerCase().includes(q)) ||
      g.tags.some((tag) => tag.toLowerCase().includes(q)) ||
      g.developer.toLowerCase().includes(q)
  );
}

export function getTopRatedGames(limit = 5): Game[] {
  return [...(gamesData as Game[])]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, limit);
}

export function getRelatedGames(game: Game, limit = 3): Game[] {
  return (gamesData as Game[])
    .filter((g) => g.id !== game.id)
    .map((g) => ({
      game: g,
      score:
        g.genre.filter((gen) => game.genre.includes(gen)).length * 2 +
        g.mood.filter((m) => game.mood.includes(m)).length +
        g.tags.filter((t) => game.tags.includes(t)).length,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.game);
}
