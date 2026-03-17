import { Colors } from './colors';

export type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night';

export function getTimeOfDay(hour: number): TimeOfDay {
  if (hour >= 6 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 20) return 'evening';
  return 'night';
}

export function getSkyGradient(timeOfDay: TimeOfDay): readonly string[] {
  switch (timeOfDay) {
    case 'morning':
      return Colors.skyMorning;
    case 'afternoon':
      return Colors.skyAfternoon;
    case 'evening':
      return Colors.skyEvening;
    case 'night':
      return Colors.skyNight;
  }
}

export function getStatusBarStyle(timeOfDay: TimeOfDay): 'light' | 'dark' {
  return timeOfDay === 'evening' || timeOfDay === 'night' ? 'light' : 'dark';
}

export function getTextColor(timeOfDay: TimeOfDay): string {
  return timeOfDay === 'evening' || timeOfDay === 'night'
    ? Colors.textOnDark
    : Colors.textPrimary;
}

export function getSecondaryTextColor(timeOfDay: TimeOfDay): string {
  return timeOfDay === 'evening' || timeOfDay === 'night'
    ? Colors.textOnDarkSecondary
    : Colors.textSecondary;
}
