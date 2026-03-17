import React, { createContext, useContext, useEffect, useState } from 'react';
import type * as SQLite from 'expo-sqlite';
import { getDatabase } from '../db/database';

interface DatabaseContextValue {
  db: SQLite.SQLiteDatabase | null;
  isReady: boolean;
}

const DatabaseContext = createContext<DatabaseContextValue>({
  db: null,
  isReady: false,
});

export function DatabaseProvider({ children }: { children: React.ReactNode }) {
  const [db, setDb] = useState<SQLite.SQLiteDatabase | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let mounted = true;
    getDatabase().then((database) => {
      if (mounted) {
        setDb(database);
        setIsReady(true);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  return React.createElement(
    DatabaseContext.Provider,
    { value: { db, isReady } },
    children
  );
}

export function useDatabase(): DatabaseContextValue {
  return useContext(DatabaseContext);
}
