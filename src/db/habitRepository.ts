import type * as SQLite from 'expo-sqlite';
import type { HabitTemplate, HabitTemplateRow } from '../types/models';

function rowToHabit(row: HabitTemplateRow): HabitTemplate {
  return {
    ...row,
    is_active: row.is_active === 1,
  };
}

export async function getActiveHabits(
  db: SQLite.SQLiteDatabase
): Promise<HabitTemplate[]> {
  const rows = await db.getAllAsync<HabitTemplateRow>(
    'SELECT * FROM habit_templates WHERE is_active = 1 ORDER BY sort_order ASC'
  );
  return rows.map(rowToHabit);
}

export async function addHabit(
  db: SQLite.SQLiteDatabase,
  habit: { text: string; emoji?: string | null }
): Promise<number> {
  const maxOrder = await db.getFirstAsync<{ max_order: number | null }>(
    'SELECT MAX(sort_order) as max_order FROM habit_templates'
  );
  const nextOrder = (maxOrder?.max_order ?? -1) + 1;

  const result = await db.runAsync(
    'INSERT INTO habit_templates (text, emoji, sort_order) VALUES (?, ?, ?)',
    [habit.text, habit.emoji ?? null, nextOrder]
  );
  return result.lastInsertRowId;
}

export async function updateHabit(
  db: SQLite.SQLiteDatabase,
  id: number,
  updates: { text?: string; emoji?: string | null }
): Promise<void> {
  if (updates.text !== undefined) {
    await db.runAsync('UPDATE habit_templates SET text = ? WHERE id = ?', [updates.text, id]);
  }
  if (updates.emoji !== undefined) {
    await db.runAsync('UPDATE habit_templates SET emoji = ? WHERE id = ?', [updates.emoji, id]);
  }
}

export async function deleteHabit(
  db: SQLite.SQLiteDatabase,
  id: number
): Promise<void> {
  await db.runAsync('UPDATE habit_templates SET is_active = 0 WHERE id = ?', [id]);
}

export async function ensureHabitsForDate(
  db: SQLite.SQLiteDatabase,
  date: string
): Promise<void> {
  const existing = await db.getFirstAsync<{ count: number }>(
    'SELECT COUNT(*) as count FROM tasks WHERE date = ? AND section = ?',
    [date, 'habits']
  );

  if (existing && existing.count > 0) return;

  const habits = await getActiveHabits(db);
  for (const habit of habits) {
    await db.runAsync(
      'INSERT INTO tasks (date, section, text, emoji, sort_order) VALUES (?, ?, ?, ?, ?)',
      [date, 'habits', habit.text, habit.emoji, habit.sort_order]
    );
  }
}
