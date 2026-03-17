import type * as SQLite from 'expo-sqlite';
import type { Chapter, ConstellationData } from '../types/models';

export async function saveChapter(
  db: SQLite.SQLiteDatabase,
  chapter: {
    date: string;
    day_of_year: number;
    title: string;
    subtitle_keywords: string[];
    theme_explanation: string | null;
    constellation_data: ConstellationData;
  }
): Promise<number> {
  const result = await db.runAsync(
    `INSERT OR REPLACE INTO chapters (date, day_of_year, title, subtitle_keywords, theme_explanation, constellation_data)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      chapter.date,
      chapter.day_of_year,
      chapter.title,
      JSON.stringify(chapter.subtitle_keywords),
      chapter.theme_explanation,
      JSON.stringify(chapter.constellation_data),
    ]
  );
  return result.lastInsertRowId;
}

export async function getChapter(
  db: SQLite.SQLiteDatabase,
  date: string
): Promise<Chapter | null> {
  return db.getFirstAsync<Chapter>(
    'SELECT * FROM chapters WHERE date = ?',
    [date]
  );
}

export async function getChapterById(
  db: SQLite.SQLiteDatabase,
  id: number
): Promise<Chapter | null> {
  return db.getFirstAsync<Chapter>(
    'SELECT * FROM chapters WHERE id = ?',
    [id]
  );
}

export async function getAllChapters(
  db: SQLite.SQLiteDatabase
): Promise<Chapter[]> {
  return db.getAllAsync<Chapter>(
    'SELECT * FROM chapters ORDER BY date DESC'
  );
}

export async function hasChapterForDate(
  db: SQLite.SQLiteDatabase,
  date: string
): Promise<boolean> {
  const row = await db.getFirstAsync<{ count: number }>(
    'SELECT COUNT(*) as count FROM chapters WHERE date = ?',
    [date]
  );
  return (row?.count ?? 0) > 0;
}
