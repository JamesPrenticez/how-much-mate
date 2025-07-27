import { Database } from "sql.js";

// export const rowsToObject = (result: ReturnType<Database['exec']>): Record<string, unknown>[] => {
//   if (!result.length) return [];

//   const { columns, values } = result[0];
//   return values.map(row =>
//     Object.fromEntries(row.map((value, i) => [columns[i], value]))
//   );
// }

export const rowsToObject = <T>(result: ReturnType<Database['exec']>): T[] => {
  if (!result.length) return [];

  const { columns, values } = result[0];
  return values.map(row =>
    Object.fromEntries(row.map((value, i) => [columns[i], value]))
  ) as T[];
}