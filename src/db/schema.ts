export const CREATE_TASKS_TABLE = `
  CREATE TABLE IF NOT EXISTS tasks (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    date            TEXT NOT NULL,
    section         TEXT NOT NULL CHECK (section IN ('appts', 'habits', 'today')),
    text            TEXT NOT NULL,
    emoji           TEXT,
    is_priority     INTEGER NOT NULL DEFAULT 0,
    is_meaningful   INTEGER NOT NULL DEFAULT 0,
    meaningful_note TEXT,
    is_completed    INTEGER NOT NULL DEFAULT 0,
    time            TEXT,
    sort_order      INTEGER NOT NULL DEFAULT 0,
    created_at      TEXT NOT NULL DEFAULT (datetime('now'))
  );
`;

export const CREATE_HABIT_TEMPLATES_TABLE = `
  CREATE TABLE IF NOT EXISTS habit_templates (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    text        TEXT NOT NULL,
    emoji       TEXT,
    sort_order  INTEGER NOT NULL DEFAULT 0,
    is_active   INTEGER NOT NULL DEFAULT 1,
    created_at  TEXT NOT NULL DEFAULT (datetime('now'))
  );
`;

export const CREATE_CHAPTERS_TABLE = `
  CREATE TABLE IF NOT EXISTS chapters (
    id                  INTEGER PRIMARY KEY AUTOINCREMENT,
    date                TEXT NOT NULL UNIQUE,
    day_of_year         INTEGER NOT NULL,
    title               TEXT NOT NULL,
    subtitle_keywords   TEXT NOT NULL DEFAULT '[]',
    theme_explanation   TEXT,
    constellation_data  TEXT NOT NULL DEFAULT '{"points":[],"connections":[]}',
    created_at          TEXT NOT NULL DEFAULT (datetime('now'))
  );
`;

export const CREATE_TASKS_DATE_INDEX = `
  CREATE INDEX IF NOT EXISTS idx_tasks_date ON tasks(date);
`;

export const SCHEMA_VERSION = 1;
