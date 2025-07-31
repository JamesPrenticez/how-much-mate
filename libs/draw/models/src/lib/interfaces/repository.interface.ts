export interface IRepository<T> {
  create(entity: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<T>;
  findById(id: string): Promise<T | null>;
  findAll(): Promise<T[]>;
  update(id: string, updates: Partial<T>): Promise<T>;
  delete(id: string): Promise<void>;
  count(): Promise<number>;
}

export type PartialWhere<T> = {
  [K in keyof T]?: T[K];
};

export interface IQueryable<T> {
  findBy(field: keyof T, value: any): Promise<T[]>;
  findOneBy(field: keyof T, value: any): Promise<T | null>;

  findMany(where: PartialWhere<T>): Promise<T[]>;
  findOne(where: PartialWhere<T>): Promise<T | null>;
}
