import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({
    ok: true,
    service: "hcd-next-supabase",
    timestamp: new Date().toISOString(),
  });
}
