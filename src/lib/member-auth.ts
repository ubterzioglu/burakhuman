import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { getMemberById } from "./data";
import type { Member } from "./types";

export const memberSessionSecret = process.env.MEMBER_SESSION_SECRET ?? "";

const memberCookieName = "hcd_member_session";
const memberSessionMaxAge = 60 * 60 * 24 * 30; // 30 days
const SCRYPT_N = 16384;
const SCRYPT_r = 8;
const SCRYPT_p = 1;
const SCRYPT_KEYLEN = 64;

type MemberSessionPayload = {
  sub: number;
  iat: number;
  exp: number;
};

export function isMemberAuthConfigured() {
  return Boolean(memberSessionSecret);
}

export function hashPassword(plain: string): string {
  const salt = randomBytes(16);
  const derived = scryptSync(plain, salt, SCRYPT_KEYLEN, { N: SCRYPT_N, r: SCRYPT_r, p: SCRYPT_p });
  return `scrypt$${SCRYPT_N}$${SCRYPT_r}$${SCRYPT_p}$${salt.toString("base64")}$${derived.toString("base64")}`;
}

export function verifyPassword(plain: string, stored: string): boolean {
  try {
    const [scheme, nStr, rStr, pStr, saltB64, hashB64] = stored.split("$");
    if (scheme !== "scrypt") return false;
    const salt = Buffer.from(saltB64, "base64");
    const expected = Buffer.from(hashB64, "base64");
    const derived = scryptSync(plain, salt, expected.length, {
      N: Number(nStr),
      r: Number(rStr),
      p: Number(pStr),
    });
    return derived.length === expected.length && timingSafeEqual(derived, expected);
  } catch {
    return false;
  }
}

function sign(value: string) {
  return createHmac("sha256", memberSessionSecret).update(value).digest("base64url");
}

function equalText(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
}

function encodeSession(payload: MemberSessionPayload) {
  const value = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${value}.${sign(value)}`;
}

function decodeSession(token: string | undefined): MemberSessionPayload | null {
  if (!token || !isMemberAuthConfigured()) return null;
  const [value, signature] = token.split(".");
  if (!value || !signature || !equalText(signature, sign(value))) return null;

  try {
    const payload = JSON.parse(Buffer.from(value, "base64url").toString("utf8")) as MemberSessionPayload;
    if (!payload.sub || !payload.exp || payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}

export async function setMemberSessionCookie(memberId: number) {
  if (!isMemberAuthConfigured()) throw new Error("Member auth is not configured");
  const now = Math.floor(Date.now() / 1000);
  const token = encodeSession({ sub: memberId, iat: now, exp: now + memberSessionMaxAge });

  const cookieStore = await cookies();
  cookieStore.set(memberCookieName, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: memberSessionMaxAge,
  });
}

export async function clearMemberSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.set(memberCookieName, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}

export async function getCurrentMember(): Promise<Member | null> {
  const cookieStore = await cookies();
  const session = decodeSession(cookieStore.get(memberCookieName)?.value);
  if (!session) return null;
  const member = await getMemberById(session.sub);
  if (!member || member.status !== "active") return null;
  return member;
}

export async function requireMember(): Promise<Member | null> {
  return getCurrentMember();
}
