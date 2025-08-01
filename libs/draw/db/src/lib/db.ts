import Dexie, { Table } from 'dexie';

const DB_NAME = 'AutoCADWebApp';
const DB_VERSION = 1;

import {
  Organisation,
  Project,
  Material,
  ElementGroup,
  ElementSubgroup,
  SubgroupMaterial,
  CadElement,
  SyncLog,
  // Metadata,
  // Conflict
} from "@draw/models"
import { seedCompanyTree } from './seeds/seed';
import { SEED_TREE } from './seeds/seed.data';

// TODO
interface Metadata { id: string; [key: string]: any; }
interface Conflict { id: string; entityType: string; entityId: string; resolved: boolean; }

export class LocalDB extends Dexie {
  organisation!: Table<Organisation>;
  projects!: Table<Project>;
  elementGroups!: Table<ElementGroup>;
  elementSubgroups!: Table<ElementSubgroup>;
  subgroupMaterials!: Table<SubgroupMaterial>;
  cadElements!: Table<CadElement>;
  materials!: Table<Material>;
  syncLog!: Table<SyncLog>;
  metadata!: Table<Metadata>;
  conflicts!: Table<Conflict>;

  constructor() {
    super(DB_NAME);

    this.version(DB_VERSION).stores({
      organisation: 'id, name, createdAt, syncStatus',
      projects: 'id, organisationId, name, createdAt, syncStatus',
      elementGroups: 'id, projectId, name, isCustom',
      elementSubgroups: 'id, elementGroupId, groupId, name',
      subgroupMaterials: 'id, [subgroupId+materialId], subgroupId, materialId',
      cadElements: 'id, projectId, elementSubgroupId, elementType, layerName, lastModified, syncStatus',
      materials: 'id, code, name, category, isCustom',
      syncLog: 'id, entityType, entityId, action, timestamp, synced',
      metadata: 'id',
      conflicts: 'id, entityType, entityId, resolved',
    });

     this.on('populate', () => {
      seedCompanyTree(SEED_TREE);
    });
  }
}

export const db = new LocalDB();