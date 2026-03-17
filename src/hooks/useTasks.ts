import { useState, useEffect, useCallback } from 'react';
import { AppState } from 'react-native';
import { useDatabase } from './useDatabase';
import type { Task } from '../types/models';
import type { Section } from '../constants/sections';
import {
  getTasksForDate,
  addTask,
  updateTaskText,
  updateTaskEmoji,
  toggleTaskPriority,
  toggleTaskMeaningful,
  setMeaningfulNote,
  toggleTaskCompleted,
  deleteTask,
} from '../db/taskRepository';
import { ensureHabitsForDate } from '../db/habitRepository';
import { getTodayString } from '../utils/dayOfYear';

export function useTasks(date?: string) {
  const { db, isReady } = useDatabase();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const currentDate = date ?? getTodayString();

  const refresh = useCallback(async () => {
    if (!db) return;
    const data = await getTasksForDate(db, currentDate);
    setTasks(data);
    setLoading(false);
  }, [db, currentDate]);

  useEffect(() => {
    if (!isReady || !db) return;
    // Ensure habits are created for this date, then load
    ensureHabitsForDate(db, currentDate).then(() => refresh());
  }, [isReady, db, currentDate, refresh]);

  // Re-fetch when a modal/screen dismisses (triggers 'active' state change)
  useEffect(() => {
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active' && db) {
        getTasksForDate(db, currentDate).then(setTasks);
      }
    });
    return () => sub.remove();
  }, [db, currentDate]);

  // Also poll briefly to catch modal returns (modals don't always trigger AppState)
  useEffect(() => {
    if (!db) return;
    const interval = setInterval(() => {
      getTasksForDate(db, currentDate).then(setTasks);
    }, 2000);
    return () => clearInterval(interval);
  }, [db, currentDate]);

  const add = useCallback(
    async (text: string, section: Section, emoji?: string | null, time?: string | null) => {
      if (!db) return;
      await addTask(db, { date: currentDate, section, text, emoji, time });
      await refresh();
    },
    [db, currentDate, refresh]
  );

  const editText = useCallback(
    async (id: number, text: string) => {
      if (!db) return;
      await updateTaskText(db, id, text);
      await refresh();
    },
    [db, refresh]
  );

  const editEmoji = useCallback(
    async (id: number, emoji: string | null) => {
      if (!db) return;
      await updateTaskEmoji(db, id, emoji);
      await refresh();
    },
    [db, refresh]
  );

  const togglePriority = useCallback(
    async (id: number) => {
      if (!db) return;
      await toggleTaskPriority(db, id);
      await refresh();
    },
    [db, refresh]
  );

  const toggleMeaningful = useCallback(
    async (id: number, note?: string | null) => {
      if (!db) return;
      await toggleTaskMeaningful(db, id, note);
      await refresh();
    },
    [db, refresh]
  );

  const updateMeaningfulNote = useCallback(
    async (id: number, note: string | null) => {
      if (!db) return;
      await setMeaningfulNote(db, id, note);
      await refresh();
    },
    [db, refresh]
  );

  const toggleCompleted = useCallback(
    async (id: number) => {
      if (!db) return;
      await toggleTaskCompleted(db, id);
      await refresh();
    },
    [db, refresh]
  );

  const remove = useCallback(
    async (id: number) => {
      if (!db) return;
      await deleteTask(db, id);
      await refresh();
    },
    [db, refresh]
  );

  // Group tasks by section, with priority tasks first and completed last
  const tasksBySection = useCallback(
    (section: Section): Task[] => {
      const sectionTasks = tasks.filter((t) => t.section === section);
      const active = sectionTasks.filter((t) => !t.is_completed);
      const completed = sectionTasks.filter((t) => t.is_completed);

      const priorityActive = active.filter((t) => t.is_priority);
      const normalActive = active.filter((t) => !t.is_priority);

      return [...priorityActive, ...normalActive, ...completed];
    },
    [tasks]
  );

  const meaningfulMoments = tasks.filter((t) => t.is_meaningful);
  const emojis = tasks.filter((t) => t.emoji).map((t) => t.emoji!);
  const uniqueEmojis = [...new Set(emojis)];

  return {
    tasks,
    loading,
    refresh,
    add,
    editText,
    editEmoji,
    togglePriority,
    toggleMeaningful,
    updateMeaningfulNote,
    toggleCompleted,
    remove,
    tasksBySection,
    meaningfulMoments,
    uniqueEmojis,
  };
}
