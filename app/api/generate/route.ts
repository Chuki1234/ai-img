import { NextRequest, NextResponse } from "next/server";
import { generate } from "@/lib/providers";

export const runtime = "nodejs";
export const maxDuration = 120;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = await generate(body);
    return NextResponse.json({ images: result.images });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Lỗi không xác định" }, { status: 500 });
  }
}
