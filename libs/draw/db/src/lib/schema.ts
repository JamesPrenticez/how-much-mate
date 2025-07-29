

export interface DBSchema {
  projects: {
    keyPath: 'id';
    indexes: {
      name: { unique: false };
      createdAt: { unique: false };
      syncStatus: { unique: false };
    };
  };
  materials: {
    keyPath: 'id';
    indexes: {
      code: { unique: true };
      name: { unique: false };
      category: { unique: false };
      isCustom: { unique: false };
    };
  };
  elementGroups: {
    keyPath: 'id';
    indexes: {
      name: { unique: false };
      isCustom: { unique: false };
    };
  };
  elementSubgroups: {
    keyPath: 'id';
    indexes: {
      groupId: { unique: false };
      name: { unique: false };
    };
  };
  subgroupMaterials: {
    keyPath: 'id';
    indexes: {
      subgroupId: { unique: false };
      materialId: { unique: false };
      'subgroupId+materialId': { unique: true };
    };
  };
  cadElements: {
    keyPath: 'id';
    indexes: {
      projectId: { unique: false };
      subgroupId: { unique: false };
      elementType: { unique: false };
      layerName: { unique: false };
      lastModified: { unique: false };
      syncStatus: { unique: false };
    };
  };
  syncLog: {
    keyPath: 'id';
    indexes: {
      entityType: { unique: false };
      entityId: { unique: false };
      action: { unique: false };
      timestamp: { unique: false };
      synced: { unique: false };
    };
  };
  metadata: {
    keyPath: 'id';
    indexes: object;
  };
  conflicts: {
    keyPath: 'id';
    indexes: {
      entityType: { unique: false };
      entityId: { unique: false };
      resolved: { unique: false };
    };
  };
}

