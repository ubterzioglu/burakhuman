import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { isPostgresConfigured } from "./db";

export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
export const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
export const adminPassword = process.env.ADMIN_PASSWORD ?? "";
export const adminSessionSecret = process.env.ADMIN_SESSION_SECRET ?? "";

const adminCookieName = "hcd_admin_session";
const adminSessionMaxAge = 60 * 60 * 12;

type AdminSessionPayload = {
  role: "admin";
  iat: number;
  exp: number;
};

export function isSupabaseConfigured() {
  return Boolean(supabaseUrl && supabaseAnonKey);
}

export function isSupabaseServiceConfigured() {
  return Boolean((supabaseUrl && supabaseServiceRoleKey) || isPostgresConfigured());
}

export function isAdminAuthConfigured() {
  return Boolean(adminPassword && adminSessionSecret);
}

export async function createSupabaseServerClient() {
  if (!isSupabaseConfigured()) return null;
  const cookieStore = await cookies();

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Server components cannot set cookies; route handlers and server actions can.
        }
      },
    },
  });
}

export function createSupabaseServiceClient() {
  if (!supabaseUrl || !supabaseServiceRoleKey) return null;
  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

function sign(value: string) {
  return createHmac("sha256", adminSessionSecret).update(value).digest("base64url");
}

function equalText(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
}

function encodeSession(payload: AdminSessionPayload) {
  const value = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${value}.${sign(value)}`;
}

function decodeSession(token: string | undefined) {
  if (!token || !isAdminAuthConfigured()) return null;
  const [value, signature] = token.split(".");
  if (!value || !signature || !equalText(signature, sign(value))) return null;

  try {
    const payload = JSON.parse(Buffer.from(value, "base64url").toString("utf8")) as AdminSessionPayload;
    if (payload.role !== "admin" || !payload.exp || payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}

export function verifyAdminPassword(password: string) {
  if (!isAdminAuthConfigured()) return false;
  return equalText(password, adminPassword);
}

export async function setAdminSessionCookie() {
  if (!isAdminAuthConfigured()) throw new Error("Admin auth is not configured");

  const now = Math.floor(Date.now() / 1000);
  const token = encodeSession({
    role: "admin",
    iat: now,
    exp: now + adminSessionMaxAge,
  });

  const cookieStore = await cookies();
  cookieStore.set(adminCookieName, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: adminSessionMaxAge,
  });
}

export async function clearAdminSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.set(adminCookieName, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}

export async function requireAdmin() {
  const cookieStore = await cookies();
  const session = decodeSession(cookieStore.get(adminCookieName)?.value);
  if (!session) return null;

  return {
    id: "env-admin",
    display_name: "Admin",
    role: "admin",
  };
}
