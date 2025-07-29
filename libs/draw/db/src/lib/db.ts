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
  // Metadata,
  // Conflict
} from "@draw/models"
import { seedAll } from './seeds/seed';

// TODO
interface Metadata { id: string; [key: string]: any; }
interface Conflict { id: string; entityType: string; entityId: string; resolved: boolean; }

export class LocalDB extends Dexie {
  projects!: Table<Project>;
  materials!: Table<Material>;
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
      projects: 'id, name, createdAt, syncStatus',
      materials: 'id, code, name, category, isCustom',
      elementGroups: 'id, name, isCustom',
      elementSubgroups: 'id, groupId, name',
      subgroupMaterials: 'id, [subgroupId+materialId], subgroupId, materialId',
      cadElements: 'id, projectId, subgroupId, elementType, layerName, lastModified, syncStatus',
      syncLog: 'id, entityType, entityId, action, timestamp, synced',
      metadata: 'id',
      conflicts: 'id, entityType, entityId, resolved',
    });

     this.on('populate', () => {
      console.log("Seeding the db")
      seedAll();
    });
  }
}

export const db = new LocalDB();