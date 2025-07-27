import React, { createContext, useContext, useEffect, useState } from 'react';
import { initDb } from '@draw/db';
import type { Database } from 'sql.js';
import { resetDb, hasBeenSeeded, materialsController } from '@draw/db';
import { Material } from '@draw/models';

type DbContextType = {
  db: Database;
  resetDb: () => void;
  hasBeenSeeded: () => boolean;

  materials: {
    getAll: () => Material[];
  }
};

const DbContext = createContext<DbContextType | null>(null);

export const DbProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [db, setDb] = useState<Database | null>(null);

  useEffect(() => {
    initDb().then((database) => {
      setDb(database);
      if (!hasBeenSeeded()) resetDb(database);
    });
  }, []);

  if (!db) return null;

  const value: DbContextType = {
    db,
    resetDb: () => resetDb(db),
    hasBeenSeeded,
materials: {
  getAll: () => materialsController.getAll(db),
  // insert: (material: Material) => materialsController.insert(db, material),
  // update: 
}

  };

  return <DbContext.Provider value={value}>{children}</DbContext.Provider>;
};

export const useDb = () => {
  const ctx = useContext(DbContext);
  if (!ctx) throw new Error('useDb must be used within DbProvider');
  return ctx;
};