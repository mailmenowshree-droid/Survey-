import { NextResponse } from "next/server";
import { Pool } from "pg";
export const runtime="nodejs";
let pool:Pool|null=null;
function getPool(){if(!process.env.DATABASE_URL)return null;pool??=new Pool({connectionString:process.env.DATABASE_URL,ssl:{rejectUnauthorized:false}});return pool}
export async function GET(){const db=getPool();if(!db)return NextResponse.json({error:"Database is not configured"},{status:503});try{await db.query(`CREATE TABLE IF NOT EXISTS survey_responses(id BIGSERIAL PRIMARY KEY,created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),source TEXT,answers JSONB NOT NULL,user_agent TEXT)`);const q=await db.query("SELECT id,created_at,source,answers FROM survey_responses ORDER BY created_at DESC");return NextResponse.json({responses:q.rows})}catch{return NextResponse.json({error:"Unable to load responses"},{status:500})}}