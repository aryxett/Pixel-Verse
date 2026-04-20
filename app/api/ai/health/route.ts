import { NextResponse } from "next/server";
import { checkAIHealth } from "@/lib/ai";

export async function GET() {
  const health = await checkAIHealth();
  return NextResponse.json(
    { online: health.online, backend: health.backend, model: health.model },
    { status: health.online ? 200 : 503 }
  );
}
