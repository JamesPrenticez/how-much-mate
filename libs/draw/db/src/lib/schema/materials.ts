import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";

export const materials = sqliteTable("materials", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  description: text("description"),
});