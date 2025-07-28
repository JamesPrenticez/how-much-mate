import type { Database } from 'sql.js';
import { seedMaterials } from '@draw/data';

export function setSchema(db: Database) {
  db.run(`
    CREATE TABLE IF NOT EXISTS materials (
      id TEXT PRIMARY KEY,
      name TEXT,
      cost_per_unit REAL
    );
  `);
}

export function seedDb(db: Database) {
  setSchema(db);

  for (const mat of seedMaterials) {
    db.run('INSERT INTO materials (id, name, cost_per_unit) VALUES (?, ?, ?)', [
      mat.id,
      mat.name,
      mat.cost_per_unit,
    ]);
  }
}
