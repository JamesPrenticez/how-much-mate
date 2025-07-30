import { db } from '../db';
import { ElementGroup, ElementSubgroup } from '@draw/models';
import { ElementRepository, ElementSubGroupRepository } from '../repositories';

const repo1 = new ElementRepository(db);
const repo2 = new ElementSubGroupRepository(db);

export const elementService = {
  async getAll(): Promise<ElementGroup[]> {
    return repo1.findAll();
  },
  async getAllSub(): Promise<ElementSubgroup[]> {
    return repo2.findAll();
  },
}