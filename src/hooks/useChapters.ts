import { useState, useEffect, useCallback } from 'react';
import { useDatabase } from './useDatabase';
import type { Chapter } from '../types/models';
import { getAllChapters, getChapter, hasChapterForDate } from '../db/chapterRepository';

export function useChapters() {
  const { db, isReady } = useDatabase();
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!db) return;
    const data = await getAllChapters(db);
    setChapters(data);
    setLoading(false);
  }, [db]);

  useEffect(() => {
    if (isReady && db) refresh();
  }, [isReady, db, refresh]);

  const getChapterForDate = useCallback(
    async (date: string): Promise<Chapter | null> => {
      if (!db) return null;
      return getChapter(db, date);
    },
    [db]
  );

  const hasChapter = useCallback(
    async (date: string): Promise<boolean> => {
      if (!db) return false;
      return hasChapterForDate(db, date);
    },
    [db]
  );

  return { chapters, loading, refresh, getChapterForDate, hasChapter };
}
