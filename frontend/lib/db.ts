/**
 * PostgreSQL connection pool for Code-SRS.
 * Uses Node.js `pg` with connection string from env vars.
 */

import { Pool } from "pg";

const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL ||
    "postgresql://codesrs:codesrs_dev_2026@localhost:5432/codesrs",
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

pool.on("error", (err: Error) => {
  console.error("Unexpected PostgreSQL pool error:", err);
});

/**
 * Execute a query with optional parameters.
 */
export async function query(text: string, params?: unknown[]) {
  const start = Date.now();
  const result = await pool.query(text, params);
  const duration = Date.now() - start;
  if (process.env.NODE_ENV === "development" && duration > 100) {
    console.warn(`[DB] Slow query (${duration}ms):`, text.slice(0, 80));
  }
  return result;
}

/**
 * Get a client from the pool for transactions.
 */
export async function getClient() {
  return pool.connect();
}

export default pool;
