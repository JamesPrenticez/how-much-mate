import { db } from '../db';
import { ElementGroup } from '@draw/models';
import { ElementRepository } from '../repositories';

const repo = new ElementRepository(db);

export const elementService = {
  async getAll(): Promise<ElementGroup[]> {
    return repo.findAll();
  },
}