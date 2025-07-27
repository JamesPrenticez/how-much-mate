import { ZodObject } from 'zod';

export const zodKeysToDexieString = <T extends ZodObject<any>>(schema: T): string => {
  return Object.keys(schema.shape).join(', ');
};