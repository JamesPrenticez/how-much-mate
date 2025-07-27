import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";
import { groups } from "./groups";

export const elements = sqliteTable("elements", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  groupId: integer("group_id").references(() => groups.id),
});