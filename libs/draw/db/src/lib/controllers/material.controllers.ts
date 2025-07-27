import type { Database } from 'sql.js';
import { rowsToObject } from '../utils/rows-to-object';
import { Material } from '@draw/models';

export const materialsController = {
  getAll(db: Database): Material[] {
    const result = db.exec('SELECT * FROM materials;');
    return rowsToObject<Material>(result);
  },

  // getById(db: Database, id: string): Material | null {
  //   const stmt = db.prepare('SELECT * FROM materials WHERE id = ?;');
  //   stmt.bind([id]);

  //   let material: Material | null = null;
  //   if (stmt.step()) {
  //     material = stmt.getAsObject() as Material;
  //   }
  //   stmt.free();
  //   return material;
  // },

  // insert(db: Database, material: Material) {
  //   db.run(
  //     'INSERT INTO materials (id, name, cost_per_unit) VALUES (?, ?, ?);',
  //     [material.id, material.name, material.cost_per_unit]
  //   );
  // },

  // update(db: Database, material: Material) {
  //   db.run(
  //     'UPDATE materials SET name = ?, cost_per_unit = ? WHERE id = ?;',
  //     [material.name, material.cost_per_unit, material.id]
  //   );
  // },

  // delete(db: Database, id: string) {
  //   db.run('DELETE FROM materials WHERE id = ?;', [id]);
  // },
};
