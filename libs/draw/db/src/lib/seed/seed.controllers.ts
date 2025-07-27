
import type { Database } from 'sql.js';
import { seedDb } from './seed';

const SEEDED_KEY = 'db_seeded';

export function hasBeenSeeded(): boolean {
  return localStorage.getItem(SEEDED_KEY) === 'true';
}

export function markAsSeeded() {
  localStorage.setItem(SEEDED_KEY, 'true');
}

export function clearSeededFlag() {
  localStorage.removeItem(SEEDED_KEY);
}

export function resetDb(db: Database) {
  db.run(`DELETE FROM materials`);
  clearSeededFlag();
  seedDb(db);
}
