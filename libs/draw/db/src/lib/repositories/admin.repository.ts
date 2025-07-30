import { seedAll } from '../seeds/seed';
import { BaseRepository } from './base.repository';
import { Dexie } from 'dexie';

interface Admin {
  id: string; createdAt: string; updatedAt?: string 
}

export class AdminRepository extends BaseRepository<Admin> {
  protected storeName = 'admins';

  constructor(db: Dexie) {
    super(db);
  }

  async clear(): Promise<void> {
    await this.db.transaction('rw', this.db.tables, async () => {
      for (const table of this.db.tables) {
        await table.clear();
      }
    });
  }

  async reSeed(): Promise<void> {
    seedAll(); 
  }

  // You dont really wanna do this
  async deleteDatabase(): Promise<void> {
    await this.db.delete();
  }
}