export interface SyncLog {
  id: string;
  entityType: string;  // 'project', 'cadElement', etc.
  entityId: string;
  action: 'create' | 'update' | 'delete';
  timestamp: string;
  synced: boolean;
  data?: any; // Snapshot of changes for conflict resolution
}