import { NextRequest, NextResponse } from "next/server";
import { getSteamGameData, getSteamHeaderImage, getSteamLibraryCover, getSteamStoreUrl } from "@/lib/steam";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ appId: string }> }
) {
  const { appId } = await params;
  const id = parseInt(appId);

  if (!id || isNaN(id)) {
    return NextResponse.json({ error: "Invalid appId" }, { status: 400 });
  }

  const data = await getSteamGameData(id);

  if (!data) {
    // Return at least the CDN images even if API fails
    return NextResponse.json({
      appId: id,
      header_image: getSteamHeaderImage(id),
      library_image: getSteamLibraryCover(id),
      store_url: getSteamStoreUrl(id),
      fallback: true,
    });
  }

  return NextResponse.json({
    appId: id,
    name: data.name,
    description: data.short_description,
    header_image: data.header_image,
    library_image: getSteamLibraryCover(id),
    screenshots: data.screenshots?.slice(0, 6).map((s) => s.path_full) || [],
    metacritic: data.metacritic,
    genres: data.genres?.map((g) => g.description) || [],
    developers: data.developers || [],
    publishers: data.publishers || [],
    release_date: data.release_date?.date,
    platforms: data.platforms,
    is_free: data.is_free,
    price: data.price_overview?.final_formatted || (data.is_free ? "Free" : null),
    recommendations: data.recommendations?.total,
    store_url: getSteamStoreUrl(id),
    background: data.background,
    trailer: data.movies?.[0]?.mp4?.max || null,
  });
}
