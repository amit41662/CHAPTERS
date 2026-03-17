import type { Section } from '../constants/sections';

export interface Task {
  id: number;
  date: string; // YYYY-MM-DD
  section: Section;
  text: string;
  emoji: string | null;
  is_priority: boolean;
  is_meaningful: boolean;
  meaningful_note: string | null;
  is_completed: boolean;
  time: string | null; // HH:MM for appointments
  sort_order: number;
  created_at: string;
}

export interface TaskRow {
  id: number;
  date: string;
  section: string;
  text: string;
  emoji: string | null;
  is_priority: number;
  is_meaningful: number;
  meaningful_note: string | null;
  is_completed: number;
  time: string | null;
  sort_order: number;
  created_at: string;
}

export interface HabitTemplate {
  id: number;
  text: string;
  emoji: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export interface HabitTemplateRow {
  id: number;
  text: string;
  emoji: string | null;
  sort_order: number;
  is_active: number;
  created_at: string;
}

export interface Chapter {
  id: number;
  date: string; // YYYY-MM-DD
  day_of_year: number;
  title: string;
  subtitle_keywords: string; // JSON array
  theme_explanation: string | null;
  constellation_data: string; // JSON
  created_at: string;
}

export interface ConstellationPoint {
  emoji: string;
  x: number; // 0-1 normalized
  y: number; // 0-1 normalized
  isMeaningful: boolean;
}

export interface ConstellationData {
  points: ConstellationPoint[];
  connections: [number, number][]; // pairs of point indices
}
