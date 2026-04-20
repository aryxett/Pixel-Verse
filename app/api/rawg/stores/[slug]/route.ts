import { NextRequest, NextResponse } from "next/server";

const RAWG_BASE = "https://api.rawg.io/api";
const RAWG_KEY  = process.env.RAWG_API_KEY || "";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  if (!RAWG_KEY) {
    return NextResponse.json({ stores: [] });
  }

  try {
    const res = await fetch(
      `${RAWG_BASE}/games/${slug}/stores?key=${RAWG_KEY}`,
      { next: { revalidate: 86400 } }
    );

    if (!res.ok) return NextResponse.json({ stores: [] });

    const data = await res.json();
    return NextResponse.json({ stores: data.results || [] });
  } catch {
    return NextResponse.json({ stores: [] });
  }
}
