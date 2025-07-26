import Dexie, { Table } from 'dexie';
import { Material } from './schema';

export class LocalDB extends Dexie {
  materials!: Table<Material>;

  constructor() {
    super('localAppDb');

    this.version(1).stores({
      materials: '_id, title, done',
    });
  }
}

export const db = new LocalDB();