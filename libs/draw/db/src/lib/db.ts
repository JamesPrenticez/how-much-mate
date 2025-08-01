import Dexie, { Table } from 'dexie';

const DB_NAME = 'AutoCADWebApp';
const DB_VERSION = 1;

import {
  Project,
  Material,
  ElementGroup,
  ElementSubgroup,
  SubgroupMaterial,
  CadElement,
  SyncLog,
  Company,
  // Metadata,
  // Conflict
} from "@draw/models"
import { seedCompanyTree } from './seeds/seed';
import { SEED_TREE } from './seeds/seed.data';

// TODO
interface Metadata { id: string; [key: string]: any; }
interface Conflict { id: string; entityType: string; entityId: string; resolved: boolean; }

export class LocalDB extends Dexie {
  materials!: Table<Material>;
  companies!: Table<Company>;
  projects!: Table<Project>;
  elementGroups!: Table<ElementGroup>;
  elementSubgroups!: Table<ElementSubgroup>;
  subgroupMaterials!: Table<SubgroupMaterial>;
  cadElements!: Table<CadElement>;
  syncLog!: Table<SyncLog>;
  metadata!: Table<Metadata>;
  conflicts!: Table<Conflict>;

  constructor() {
    super(DB_NAME);

    this.version(DB_VERSION).stores({
      companies: 'id, name, createdAt, syncStatus',
      projects: 'id, companyId, name, createdAt, syncStatus',
      materials: 'id, code, name, category, isCustom',
      elementGroups: 'id, projectId, name, isCustom',
      elementSubgroups: 'id, elementGroupId, groupId, name',
      subgroupMaterials: 'id, [subgroupId+materialId], subgroupId, materialId',
      cadElements: 'id, projectId, elementSubgroupId, elementType, layerName, lastModified, syncStatus',
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