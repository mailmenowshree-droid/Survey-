import { NextResponse } from "next/server";
import { Pool } from "pg";

export const runtime = "nodejs";

let pool: Pool | null = null;

function getPool() {
  if (!process.env.DATABASE_URL) return null;
  pool ??= new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL.includes("localhost") ? false : { rejectUnauthorized: false }
  });
  return pool;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const answers = body?.answers;
    const source = typeof body?.source === "string" ? body.source.slice(0, 120) : "";
    const userAgent = typeof body?.userAgent === "string" ? body.userAgent.slice(0, 500) : "";

    if (!answers || typeof answers !== "object") {
      return NextResponse.json({ error: "Invalid response" }, { status: 400 });
    }

    const db = getPool();
    if (!db) {
      return NextResponse.json({ error: "Database is not configured" }, { status: 503 });
    }

    await db.query(`
      CREATE TABLE IF NOT EXISTS survey_responses (
        id BIGSERIAL PRIMARY KEY,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        source TEXT,
        answers JSONB NOT NULL,
        user_agent TEXT
      )
    `);

    await db.query(
      "INSERT INTO survey_responses (source, answers, user_agent) VALUES ($1, $2, $3)",
      [source, JSON.stringify(answers), userAgent]
    );

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Unable to save response" }, { status: 500 });
  }
}