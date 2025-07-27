import { sqliteTable, integer, text, int } from "drizzle-orm/sqlite-core";
import { elements } from "./elements";

export const measurements = sqliteTable("measurements", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  elementId: integer("element_id").references(() => elements.id),
  value: int("value").notNull(),
  unit: text("unit").notNull(),
});