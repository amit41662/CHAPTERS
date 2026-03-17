export const CURATED_EMOJIS = [
  '💼', '👩‍💼', '💋', '🦸',
  '👯‍♀️', '🧡', '👩‍❤️‍👨',
  '👰', '🤰', '👙',
  '🏃', '💡', '📚',
  '🧘', '🎉', '🎵',
  '🍳', '✈️', '🏠',
  '💰', '🎓', '🌱',
] as const;

export const EMOJI_DOMAIN_MAP: Record<string, string> = {
  '💼': 'Career',
  '👩‍💼': 'Side Hustle',
  '👯‍♀️': 'Friendship',
  '🧡': 'Family',
  '👩‍❤️‍👨': 'Love',
  '💋': 'Romance',
  '👙': 'Body',
  '🏃': 'Movement',
  '🦸': 'Growth',
  '👰': 'Wedding',
  '🤰': 'Fertility',
  '💡': 'Ideas',
  '📚': 'Learning',
  '🧘': 'Wellness',
  '🎉': 'Celebration',
  '🎵': 'Music',
  '🍳': 'Nourishment',
  '✈️': 'Travel',
  '🏠': 'Home',
  '💰': 'Finance',
  '🎓': 'Education',
  '🌱': 'Growth',
};

export function getDomainForEmoji(emoji: string): string | null {
  return EMOJI_DOMAIN_MAP[emoji] ?? null;
}

export function getTopDomains(emojis: string[], maxCount: number = 3): string[] {
  const counts = new Map<string, number>();
  for (const emoji of emojis) {
    const domain = getDomainForEmoji(emoji);
    if (domain) {
      counts.set(domain, (counts.get(domain) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, maxCount)
    .map(([domain]) => domain);
}
