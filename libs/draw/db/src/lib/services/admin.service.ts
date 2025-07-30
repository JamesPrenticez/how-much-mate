import { db } from '../db';
import { AdminRepository } from '../repositories';

const repo = new AdminRepository(db);

export const adminService = {
  async clearDatabase(): Promise<void> {
    try {
      console.log('Clearing database...');
      await repo.clear();
      console.log('Database cleared.');
    } catch (err) {
      console.error('Failed to clear database:', err);
      throw err;
    }
  },

  async reSeed(): Promise<void> {
    try {
      await repo.reSeed();
    } catch (err) {
      console.error('Failed to seed database:', err);
      throw err;
    }
  }
};
