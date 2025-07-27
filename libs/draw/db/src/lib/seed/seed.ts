import type { Database } from 'sql.js';
import { markAsSeeded } from './seed.controllers';
import { seedMaterials } from '@draw/data';

export function seedDb(db: Database) {
  for (const mat of seedMaterials) {
    db.run('INSERT INTO materials (id, name, cost_per_unit) VALUES (?, ?, ?)', [
      mat.id,
      mat.name,
      mat.cost_per_unit,
    ]);
  }
  markAsSeeded();
}
