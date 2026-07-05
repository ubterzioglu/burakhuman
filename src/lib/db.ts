import { readFileSync } from "fs";
import { join } from "path";
import { Pool, types, type QueryResult, type QueryResultRow } from "pg";

types.setTypeParser(20, (value) => Number(value));

const connectionEnvKeys = [
  "DATABASE_URL",
  "POSTGRES_URL",
  "POSTGRES_PRISMA_URL",
  "POSTGRES_URL_NON_POOLING",
  "SUPABASE_DB_URL",
];

let pool: Pool | null | undefined;

function normalizeConnectionString(connectionString: string) {
  try {
    const url = new URL(connectionString);
    for (const key of [...url.searchParams.keys()]) {
      if (key.toLowerCase().startsWith("ssl")) url.searchParams.delete(key);
    }
    return url.toString();
  } catch {
    return connectionString;
  }
}

function readRawLocalDatabaseUrl() {
  if (process.env.NODE_ENV === "production") return "";

  try {
    const raw = readFileSync(join(process.cwd(), ".env.local"), "utf8");
    const match = raw.match(/postgres(?:ql)?:\/\/[^\s'"]+/i);
    return match?.[0] ?? "";
  } catch {
    return "";
  }
}

export function getDatabaseUrl() {
  for (const key of connectionEnvKeys) {
    const value = process.env[key];
    if (value) return value;
  }

  return readRawLocalDatabaseUrl();
}

export function isPostgresConfigured() {
  return Boolean(getDatabaseUrl());
}

function getPool() {
  if (pool !== undefined) return pool;

  const rawConnectionString = getDatabaseUrl();
  if (!rawConnectionString) {
    pool = null;
    return pool;
  }

  const connectionString = normalizeConnectionString(rawConnectionString);
  pool = new Pool({
    connectionString,
    ssl: connectionString.includes("supabase.co") || connectionString.includes("pooler.supabase.com")
      ? { rejectUnauthorized: false }
      : undefined,
  });

  return pool;
}

export async function query<T extends QueryResultRow = QueryResultRow>(text: string, values: unknown[] = []): Promise<QueryResult<T>> {
  const activePool = getPool();
  if (!activePool) throw new Error("Postgres database is not configured");
  return activePool.query<T>(text, values);
}

export async function checkPostgresConnection() {
  if (!isPostgresConfigured()) return false;

  try {
    await query("select 1");
    return true;
  } catch {
    return false;
  }
}
