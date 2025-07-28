// libs/db/src/lib/sqlite.ts
import initSqlJs, { Database } from 'sql.js';
import { loadDbBuffer, saveDbBuffer } from './db.storage';
import { seedDb } from './seed/seed';
import { markAsSeeded } from './seed/seed.controllers';

let db: Database;

export const initDb = async (): Promise<Database> => {
  const SQL = await initSqlJs();
  const existing = await loadDbBuffer();

  db = existing ? new SQL.Database(existing) : new SQL.Database();

  // Only seed if DB was not found
  if (!existing) {
    console.log("Seed DB")
    seedDb(db); 
    markAsSeeded();
    persistDb();
  }

  return db;
}

export const getDb = (): Database => {
  return db;
}

export const persistDb = () => {
  const data = db.export();
  saveDbBuffer(data);
}
