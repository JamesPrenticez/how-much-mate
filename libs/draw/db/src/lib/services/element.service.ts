import { db } from '../db';
import { ElementGroup, ElementSubgroup } from '@draw/models';
import { ElementRepository, ElementSubGroupRepository } from '../repositories';



export const elementService = {
  getAll(): Promise<ElementGroup[]> {
    return db.elementGroups.toArray();
  },
  getAllSub(): Promise<ElementSubgroup[]> {
    return db.elementSubgroups.toArray();
  },
};