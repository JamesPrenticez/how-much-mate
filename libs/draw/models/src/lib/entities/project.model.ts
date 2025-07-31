import { SyncStatus } from '../enums';

export interface Project {
  id: string;
  code: string;
  companyId: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  syncStatus: SyncStatus;
  syncVersion?: string;
  isDeleted: boolean;
  metadata?: Record<string, any>;
}