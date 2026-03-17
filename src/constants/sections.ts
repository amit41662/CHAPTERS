export type Section = 'appts' | 'habits' | 'today';

export const SECTION_LABELS: Record<Section, string> = {
  appts: 'Key Appts / Social',
  habits: 'Daily Habits',
  today: 'Today',
};

export const SECTION_ORDER: Section[] = ['appts', 'habits', 'today'];
