#!/usr/bin/env node
/**
 * Database migration runner.
 * Run: npx tsx db/migrate.ts
 * Or via API: POST /api/db/migrate
 */

import { query, getClient } from "../lib/db";
import fs from "fs";
import path from "path";

async function runMigration() {
  console.log("[MIGRATE] Running database migration...");

  const schemaPath = path.join(__dirname, "schema.sql");
  const schema = fs.readFileSync(schemaPath, "utf-8");

  const client = await getClient();
  try {
    await client.query("BEGIN");

    // Split by semicolons and execute each statement
    const statements = schema
      .split(";")
      .map((s) => s.trim())
      .filter((s) => s.length > 0 && !s.startsWith("--"));

    for (const stmt of statements) {
      await client.query(stmt);
    }

    await client.query("COMMIT");
    console.log("[MIGRATE] Schema applied successfully");

    // Verify
    const tables = await client.query(`
      SELECT table_name FROM information_schema.tables
      WHERE table_schema = 'public' ORDER BY table_name
    `);
    console.log("[MIGRATE] Tables created:", tables.rows.map((r: { table_name: string }) => r.table_name).join(", "));
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("[MIGRATE] Failed:", err);
    process.exit(1);
  } finally {
    client.release();
  }
}

runMigration();
