import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

// Works with Railway/Supabase style DATABASE_URL connection strings.
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes("localhost")
    ? false
    : { rejectUnauthorized: false },
});
