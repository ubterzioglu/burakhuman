import { NextResponse } from "next/server";
import { clearMemberSessionCookie } from "@/lib/member-auth";

export async function GET(request: Request) {
  await clearMemberSessionCookie();
  return NextResponse.redirect(new URL("/", request.url));
}
