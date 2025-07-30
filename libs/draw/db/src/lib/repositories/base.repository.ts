import { IRepository, IQueryable, PartialWhere } from '@draw/models';
import Dexie, { Collection, Table } from 'dexie';

export abstract class BaseRepository<
  T extends { id: string; createdAt: string; updatedAt?: string }
> implements IRepository<T>, IQueryable<T>
{
  protected abstract storeName: string;
  
  protected get table(): Table<T, string> {
    return this.db.table(this.storeName);
  }

  constructor(protected db: Dexie) {}
  
  public generateId(): string {
    return crypto.randomUUID();
  }

  public getCurrentTimestamp(): string {
    return new Date().toISOString();
  }

  async create(
    entityData: Omit<T, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<T> {
    const entity = {
      ...entityData,
      id: this.generateId(),
      createdAt: this.getCurrentTimestamp(),
      updatedAt: this.getCurrentTimestamp(),
    } as T;

    await this.table.add(entity);
    return entity;
  }

  async findById(id: string): Promise<T | null> {
    const result = await this.table.get(id);
    return result ?? null;
  }

  async findAll(): Promise<T[]> {
    return this.table.toArray();
  }

  async update(id: string, updates: Partial<T>): Promise<T> {
    const existing = await this.table.get(id);
    if (!existing) throw new Error(`Entity with id ${id} not found`);

    const updated: T = {
      ...existing,
      ...updates,
      updatedAt: this.getCurrentTimestamp(),
    };

    await this.table.put(updated);
    return updated;
  }

  async delete(id: string): Promise<void> {
    await this.table.delete(id);
  }

  async findBy(field: keyof T, value: any): Promise<T[]> {
    return this.table
      .where(field as string)
      .equals(value)
      .toArray();
  }

  async count(): Promise<number> {
    return this.table.count();
  }

  async findOne(where: PartialWhere<T>): Promise<T | null> {
    let collection = this.table.toCollection();

    for (const [key, value] of Object.entries(where)) {
      collection = collection.filter((item) => item[key as keyof T] === value);
    }

    const result = await collection.first();
    return result ?? null;
  }

  async findOneBy(field: keyof T, value: any): Promise<T | null> {
    const result = await this.table
      .where(field as string)
      .equals(value)
      .first();
    return result ?? null;
  }

  async findMany(where: PartialWhere<T>): Promise<T[]> {
    let collection: Collection<T, string> = this.table.toCollection();

    for (const [key, value] of Object.entries(where)) {
      collection = collection.filter((item) => item[key as keyof T] === value);
    }

    return collection.toArray();
  }
}
