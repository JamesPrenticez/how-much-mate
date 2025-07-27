// libs/db/src/lib/sqlite.ts
import initSqlJs, { Database } from 'sql.js';

let db: Database;

export async function initDb(): Promise<Database> {
  if (db) return db;

  const SQL = await initSqlJs({
    locateFile: file => `/sql-wasm.wasm`, // adjust this if needed
  });

  db = new SQL.Database();

  // Optionally create tables here
  db.run(`
    CREATE TABLE IF NOT EXISTS materials (
      id TEXT PRIMARY KEY,
      name TEXT,
      cost_per_unit REAL
    );
  `);

  return db;
}
