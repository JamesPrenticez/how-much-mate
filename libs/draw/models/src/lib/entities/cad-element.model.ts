import { ElementType, SyncStatus } from '../enums';
import { Geometry, MaterialQuantity } from '../interfaces';

export interface CadElementProperties {
  color?: string;
  lineweight?: number;
  linetype?: string;
  layer?: string;
  [key: string]: any; // Allow custom CAD properties
}

export interface CadElement {
  id: string;
  projectId: string;
  subgroupId?: string;
  elementType: ElementType;
  layerName?: string;
  geometry: Geometry;
  properties?: CadElementProperties;
  
  // Calculated quantities
  area?: number;
  length?: number;
  volume?: number;
  
  // Cached material quantities (for performance)
  materialQuantities?: MaterialQuantity[];
  
  // Sync and audit
  createdAt?: string;
  lastModified?: string;
  syncStatus?: SyncStatus;
  syncVersion?: string;
  isDeleted?: boolean;
}