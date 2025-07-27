import Dexie, { Table } from 'dexie';
import { Material, MaterialSchema } from './models';
import { seedMaterials } from './seed/materials.seed';
import { zodKeysToDexieString } from './utilities.ts/zod-to-dexie';

const dexieTableSchema = zodKeysToDexieString(MaterialSchema);

export class LocalDB extends Dexie {
  materials!: Table<Material>;

  constructor() {
    super('drawing-app-local-db');

    this.version(1)
      .stores({
        materials: dexieTableSchema,
    })

  this.on('populate', async () => {
      console.log("Seeding the db")
      await seedMaterials();
    });
  }
}

export const db = new LocalDB();

// db.delete().then(() => db.open());