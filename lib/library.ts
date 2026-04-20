// ─── Library Store (localStorage) ───────────────────────────────────────────

export type LibraryStatus = "playing" | "completed" | "dropped" | "backlog";

export interface LibraryGame {
  id: string;
  title: string;
  image: string;
  rating: number;
  metacritic?: number | null;
  genre: string[];
  developer?: string;
  releaseYear?: number;
  addedAt: number;
  status: LibraryStatus;
}

export interface WishlistGame {
  id: string;
  title: string;
  image: string;
  rating: number;
  metacritic?: number | null;
  genre: string[];
  developer?: string;
  releaseYear?: number;
  addedAt: number;
}

export interface Collection {
  id: string;
  name: string;
  description: string;
  createdAt: number;
  games: WishlistGame[];
}

export const STATUS_META: Record<LibraryStatus, { label: string; emoji: string; color: string; desc: string }> = {
  playing:   { label: "Playing",   emoji: "🎮", color: "#22c55e", desc: "Currently playing" },
  completed: { label: "Completed", emoji: "✅", color: "#06b6d4", desc: "Finished" },
  dropped:   { label: "Dropped",   emoji: "❌", color: "#ef4444", desc: "Abandoned" },
  backlog:   { label: "Backlog",   emoji: "📚", color: "#f59e0b", desc: "Owned, not started" },
};

// ── Helpers ──────────────────────────────────────────────────────────────────
function emit() { if (typeof window !== "undefined") window.dispatchEvent(new Event("library-updated")); }
function get<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try { return JSON.parse(localStorage.getItem(key) || "null") ?? fallback; } catch { return fallback; }
}
function set<T>(key: string, val: T) {
  localStorage.setItem(key, JSON.stringify(val)); emit();
}

// ── Library ──────────────────────────────────────────────────────────────────
const LIB_KEY = "pv_library";
export function getLibrary(): LibraryGame[] { return get<LibraryGame[]>(LIB_KEY, []); }
export function addToLibrary(game: Omit<LibraryGame, "addedAt">) {
  const lib = getLibrary();
  const idx = lib.findIndex(g => g.id === game.id);
  if (idx >= 0) lib[idx] = { ...lib[idx], ...game };
  else lib.unshift({ ...game, addedAt: Date.now() });
  set(LIB_KEY, lib);
}
export function removeFromLibrary(id: string) { set(LIB_KEY, getLibrary().filter(g => g.id !== id)); }
export function updateStatus(id: string, status: LibraryStatus) {
  const lib = getLibrary();
  const idx = lib.findIndex(g => g.id === id);
  if (idx >= 0) { lib[idx].status = status; set(LIB_KEY, lib); }
}
export function getGameStatus(id: string): LibraryStatus | null {
  return getLibrary().find(g => g.id === id)?.status ?? null;
}

// ── Wishlist ─────────────────────────────────────────────────────────────────
const WISH_KEY = "pv_wishlist";
export function getWishlist(): WishlistGame[] { return get<WishlistGame[]>(WISH_KEY, []); }
export function addToWishlist(game: Omit<WishlistGame, "addedAt">) {
  const list = getWishlist();
  if (list.find(g => g.id === game.id)) return;
  list.unshift({ ...game, addedAt: Date.now() });
  set(WISH_KEY, list);
}
export function removeFromWishlist(id: string) { set(WISH_KEY, getWishlist().filter(g => g.id !== id)); }
export function isWishlisted(id: string): boolean { return !!getWishlist().find(g => g.id === id); }

// ── Collections ──────────────────────────────────────────────────────────────
const COL_KEY = "pv_collections";
export function getCollections(): Collection[] { return get<Collection[]>(COL_KEY, []); }
export function createCollection(name: string, description: string): Collection {
  const col: Collection = { id: Date.now().toString(), name, description, createdAt: Date.now(), games: [] };
  const cols = getCollections();
  cols.unshift(col);
  set(COL_KEY, cols);
  return col;
}
export function deleteCollection(id: string) { set(COL_KEY, getCollections().filter(c => c.id !== id)); }
export function addGameToCollection(colId: string, game: Omit<WishlistGame, "addedAt">) {
  const cols = getCollections();
  const col  = cols.find(c => c.id === colId);
  if (!col) return;
  if (col.games.find(g => g.id === game.id)) return;
  col.games.unshift({ ...game, addedAt: Date.now() });
  set(COL_KEY, cols);
}
export function removeGameFromCollection(colId: string, gameId: string) {
  const cols = getCollections();
  const col  = cols.find(c => c.id === colId);
  if (!col) return;
  col.games = col.games.filter(g => g.id !== gameId);
  set(COL_KEY, cols);
}
export function isInCollection(colId: string, gameId: string): boolean {
  return !!getCollections().find(c => c.id === colId)?.games.find(g => g.id === gameId);
}
