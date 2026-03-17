import type * as SQLite from 'expo-sqlite';
import type { Task, TaskRow } from '../types/models';
import type { Section } from '../constants/sections';

function rowToTask(row: TaskRow): Task {
  return {
    ...row,
    section: row.section as Section,
    is_priority: row.is_priority === 1,
    is_meaningful: row.is_meaningful === 1,
    is_completed: row.is_completed === 1,
  };
}

export async function getTasksForDate(
  db: SQLite.SQLiteDatabase,
  date: string
): Promise<Task[]> {
  const rows = await db.getAllAsync<TaskRow>(
    `SELECT * FROM tasks WHERE date = ?
     ORDER BY section, is_completed ASC, is_priority DESC, sort_order ASC, created_at ASC`,
    [date]
  );
  return rows.map(rowToTask);
}

export async function addTask(
  db: SQLite.SQLiteDatabase,
  task: {
    date: string;
    section: Section;
    text: string;
    emoji?: string | null;
    time?: string | null;
  }
): Promise<number> {
  const maxOrder = await db.getFirstAsync<{ max_order: number | null }>(
    'SELECT MAX(sort_order) as max_order FROM tasks WHERE date = ? AND section = ?',
    [task.date, task.section]
  );
  const nextOrder = (maxOrder?.max_order ?? -1) + 1;

  const result = await db.runAsync(
    `INSERT INTO tasks (date, section, text, emoji, time, sort_order)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [task.date, task.section, task.text, task.emoji ?? null, task.time ?? null, nextOrder]
  );
  return result.lastInsertRowId;
}

export async function updateTaskText(
  db: SQLite.SQLiteDatabase,
  id: number,
  text: string
): Promise<void> {
  await db.runAsync('UPDATE tasks SET text = ? WHERE id = ?', [text, id]);
}

export async function updateTaskEmoji(
  db: SQLite.SQLiteDatabase,
  id: number,
  emoji: string | null
): Promise<void> {
  await db.runAsync('UPDATE tasks SET emoji = ? WHERE id = ?', [emoji, id]);
}

export async function toggleTaskPriority(
  db: SQLite.SQLiteDatabase,
  id: number
): Promise<void> {
  await db.runAsync(
    'UPDATE tasks SET is_priority = CASE WHEN is_priority = 1 THEN 0 ELSE 1 END WHERE id = ?',
    [id]
  );
}

export async function toggleTaskMeaningful(
  db: SQLite.SQLiteDatabase,
  id: number,
  note?: string | null
): Promise<void> {
  await db.runAsync(
    `UPDATE tasks SET
       is_meaningful = CASE WHEN is_meaningful = 1 THEN 0 ELSE 1 END,
       meaningful_note = CASE WHEN is_meaningful = 1 THEN NULL ELSE ? END
     WHERE id = ?`,
    [note ?? null, id]
  );
}

export async function setMeaningfulNote(
  db: SQLite.SQLiteDatabase,
  id: number,
  note: string | null
): Promise<void> {
  await db.runAsync(
    'UPDATE tasks SET meaningful_note = ? WHERE id = ?',
    [note, id]
  );
}

export async function toggleTaskCompleted(
  db: SQLite.SQLiteDatabase,
  id: number
): Promise<void> {
  await db.runAsync(
    'UPDATE tasks SET is_completed = CASE WHEN is_completed = 1 THEN 0 ELSE 1 END WHERE id = ?',
    [id]
  );
}

export async function deleteTask(
  db: SQLite.SQLiteDatabase,
  id: number
): Promise<void> {
  await db.runAsync('DELETE FROM tasks WHERE id = ?', [id]);
}

export async function moveTaskToSection(
  db: SQLite.SQLiteDatabase,
  id: number,
  section: Section
): Promise<void> {
  const maxOrder = await db.getFirstAsync<{ max_order: number | null }>(
    'SELECT MAX(sort_order) as max_order FROM tasks WHERE date = (SELECT date FROM tasks WHERE id = ?) AND section = ?',
    [id, section]
  );
  const nextOrder = (maxOrder?.max_order ?? -1) + 1;
  await db.runAsync(
    'UPDATE tasks SET section = ?, sort_order = ? WHERE id = ?',
    [section, nextOrder, id]
  );
}

export async function getMeaningfulMoments(
  db: SQLite.SQLiteDatabase,
  date: string
): Promise<Task[]> {
  const rows = await db.getAllAsync<TaskRow>(
    'SELECT * FROM tasks WHERE date = ? AND is_meaningful = 1 ORDER BY created_at ASC',
    [date]
  );
  return rows.map(rowToTask);
}

export async function getEmojisForDate(
  db: SQLite.SQLiteDatabase,
  date: string
): Promise<string[]> {
  const rows = await db.getAllAsync<{ emoji: string }>(
    'SELECT DISTINCT emoji FROM tasks WHERE date = ? AND emoji IS NOT NULL',
    [date]
  );
  return rows.map((r) => r.emoji);
}
