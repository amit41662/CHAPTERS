export const Colors = {
  // Sky gradients (time-of-day)
  skyMorning: ['#E8F0FE', '#B8D4F0', '#87BFEB'],
  skyAfternoon: ['#87BFEB', '#5BA3D9', '#3D8EC9'],
  skyEvening: ['#2D3A5C', '#5C4A6E', '#C47A5A'],
  skyNight: ['#0A1628', '#121E36', '#1A2844'],

  // Core palette
  navy: '#0A1628',
  navyLight: '#1A2844',
  navyMid: '#121E36',

  gold: '#C9A96E',
  goldLight: '#E2CC9C',
  goldMuted: 'rgba(201, 169, 110, 0.3)',

  // Text
  textPrimary: '#1A1A2E',
  textSecondary: '#4A4A6A',
  textTertiary: '#8A8AA0',
  textOnDark: '#F0EDE8',
  textOnDarkSecondary: 'rgba(240, 237, 232, 0.7)',

  // Backgrounds
  backgroundCard: 'rgba(255, 255, 255, 0.85)',
  backgroundCardSolid: '#FFFFFF',
  backgroundOverlay: 'rgba(255, 255, 255, 0.08)',
  backgroundSection: 'rgba(255, 255, 255, 0.92)',

  // Task states
  completedText: '#B0B0C0',
  completedBackground: 'rgba(0, 0, 0, 0.03)',
  priorityStar: '#C9A96E',
  priorityStarEmpty: 'rgba(201, 169, 110, 0.3)',
  meaningfulSparkle: '#C9A96E',

  // Tab bar
  tabBarBackground: 'rgba(255, 255, 255, 0.95)',
  tabBarBorder: 'rgba(0, 0, 0, 0.08)',
  tabBarActive: '#1A1A2E',
  tabBarInactive: '#8A8AA0',

  // Constellation
  constellationLine: 'rgba(201, 169, 110, 0.25)',
  constellationStar: '#C9A96E',
  constellationSparkle: '#E2CC9C',

  // Input
  inputBackground: 'rgba(255, 255, 255, 0.9)',
  inputBorder: 'rgba(0, 0, 0, 0.1)',
  inputPlaceholder: '#8A8AA0',

  // Misc
  separator: 'rgba(0, 0, 0, 0.06)',
  transparent: 'transparent',
  white: '#FFFFFF',
  black: '#000000',
} as const;
