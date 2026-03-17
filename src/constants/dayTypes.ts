export interface DayType {
  id: string;
  label: string;
  emoji: string;
  description: string;
  titlePrefixes: string[];
}

export const DAY_TYPES: DayType[] = [
  {
    id: 'momentum',
    label: 'Momentum',
    emoji: '\u{1F680}',
    description: 'Things moved forward today',
    titlePrefixes: [
      'The Day the Pieces Moved',
      'The Day I Built Something Real',
      'The Day Momentum Carried Me',
    ],
  },
  {
    id: 'breakthrough',
    label: 'Breakthrough',
    emoji: '\u{1F4A1}',
    description: 'Something clicked or shifted',
    titlePrefixes: [
      'The Day Everything Changed',
      'The Day I Finally Saw It',
      'The Day the Fog Lifted',
    ],
  },
  {
    id: 'connection',
    label: 'Connection',
    emoji: '\u{1F91D}',
    description: 'People and relationships mattered',
    titlePrefixes: [
      'The Day Love Showed Up',
      'The Day I Felt Held',
      'The Day That Was About Us',
    ],
  },
  {
    id: 'quiet',
    label: 'Quiet',
    emoji: '\u{1F54A}\uFE0F',
    description: 'Rest, reflection, or stillness',
    titlePrefixes: [
      'The Day I Let Things Be',
      'The Day of Gentle Quiet',
      'The Day That Asked for Nothing',
    ],
  },
  {
    id: 'growth',
    label: 'Growth',
    emoji: '\u{1F331}',
    description: 'Learning or stretching myself',
    titlePrefixes: [
      'The Day I Grew Into It',
      'The Day I Surprised Myself',
      'The Day I Showed Up Differently',
    ],
  },
  {
    id: 'celebration',
    label: 'Celebration',
    emoji: '\u{2728}',
    description: 'Wins, milestones, or joy',
    titlePrefixes: [
      'The Day Life Felt Generous',
      'The Day I Let Myself Celebrate',
      'The Day That Sparkled',
    ],
  },
  {
    id: 'creative',
    label: 'Creative',
    emoji: '\u{1F3A8}',
    description: 'Ideas, inspiration, or making',
    titlePrefixes: [
      'The Day Ideas Wouldn\'t Stop',
      'The Day I Made Something',
      'The Day My Mind Came Alive',
    ],
  },
  {
    id: 'grounding',
    label: 'Grounding',
    emoji: '\u{1F3E0}',
    description: 'Stability, routine, or anchoring',
    titlePrefixes: [
      'The Day I Held My Ground',
      'The Day That Felt Like Home',
      'The Day I Trusted the Process',
    ],
  },
];
