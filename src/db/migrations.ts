import type * as SQLite from 'expo-sqlite';
import {
  CREATE_TASKS_TABLE,
  CREATE_HABIT_TEMPLATES_TABLE,
  CREATE_CHAPTERS_TABLE,
  CREATE_TASKS_DATE_INDEX,
  SCHEMA_VERSION,
} from './schema';

type Migration = {
  version: number;
  up: (db: SQLite.SQLiteDatabase) => Promise<void>;
};

const migrations: Migration[] = [
  {
    version: 1,
    up: async (db) => {
      await db.execAsync(CREATE_TASKS_TABLE);
      await db.execAsync(CREATE_HABIT_TEMPLATES_TABLE);
      await db.execAsync(CREATE_CHAPTERS_TABLE);
      await db.execAsync(CREATE_TASKS_DATE_INDEX);
    },
  },
];

export async function runMigrations(db: SQLite.SQLiteDatabase): Promise<void> {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS schema_version (
      version INTEGER NOT NULL
    );
  `);

  const row = await db.getFirstAsync<{ version: number }>(
    'SELECT version FROM schema_version LIMIT 1'
  );
  const currentVersion = row?.version ?? 0;

  for (const migration of migrations) {
    if (migration.version > currentVersion) {
      await migration.up(db);
    }
  }

  if (currentVersion === 0) {
    await db.runAsync('INSERT INTO schema_version (version) VALUES (?)', SCHEMA_VERSION);
  } else if (currentVersion < SCHEMA_VERSION) {
    await db.runAsync('UPDATE schema_version SET version = ?', SCHEMA_VERSION);
  }
}
