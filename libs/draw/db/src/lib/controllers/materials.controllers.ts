import { db } from '../db';
import { Material, MaterialSchema } from '../models';

// Create
export  const addMaterial = async (data: Material) => {
  const parsed = MaterialSchema.safeParse(data);
  if (!parsed.success) throw new Error('Invalid material: ' + JSON.stringify(parsed.error.format()));
  await db.materials.add(parsed.data);
}

// Read
export const getMaterials = async(): Promise<Material[]> => {
  return db.materials.toArray();
}

// Update
export const updateTodo = async (id: string, updates: Partial<Material>) => {
  // Optionally validate partial fields here
  
  await db.materials.update(id, updates);
}

// Delete
export const deleteTodo = async (id: string) => {
  await db.materials.delete(id);
}