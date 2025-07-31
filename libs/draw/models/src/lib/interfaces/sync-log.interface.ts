import z from "zod";

export const SyncLogSchema = z.object({
  id: z.string(),
  entityType: z.string(),
  entityId: z.string(),
  action: z.union([z.literal("create"), z.literal("update"), z.literal("delete")]),
  timestamp: z.string(),
  synced: z.boolean(),
  data: z.any().optional(),
});

export type SyncLog = z.infer<typeof SyncLogSchema>;