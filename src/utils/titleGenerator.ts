import { getTopDomains } from '../constants/emojis';
import { DAY_TYPES, type DayType } from '../constants/dayTypes';
import type { Task } from '../types/models';

interface ChapterTitleResult {
  titles: string[];
  subtitleKeywords: string[];
  themeExplanation: string;
}

export function generateChapterTitleLocal(
  meaningfulMoments: Task[],
  allTasks: Task[],
  dayTypeId?: string | null
): ChapterTitleResult {
  const allEmojis = allTasks
    .filter((t) => t.emoji)
    .map((t) => t.emoji!);
  const meaningfulEmojis = meaningfulMoments
    .filter((t) => t.emoji)
    .map((t) => t.emoji!);

  const domains = getTopDomains(
    meaningfulEmojis.length > 0 ? meaningfulEmojis : allEmojis,
    3
  );

  const dayType = dayTypeId ? DAY_TYPES.find((d) => d.id === dayTypeId) : null;

  // If we have a day type, blend its prefixes with domain-specific flavor
  if (dayType) {
    const titles = dayType.titlePrefixes.map((prefix) => {
      if (domains.length > 0) {
        return customizeTitleWithDomain(prefix, domains[0]);
      }
      return prefix;
    });

    const explanation = meaningfulMoments.length > 0
      ? `A ${dayType.label.toLowerCase()} day with ${meaningfulMoments.length} meaningful moment${meaningfulMoments.length > 1 ? 's' : ''}, centered around ${domains.join(' and ')}.`
      : `A ${dayType.label.toLowerCase()} day — ${dayType.description.toLowerCase()}.`;

    return {
      titles,
      subtitleKeywords: domains.length > 0
        ? [dayType.label, ...domains.slice(0, 2)]
        : [dayType.label, 'Life'],
      themeExplanation: explanation,
    };
  }

  // Fallback: no day type selected
  const completedCount = allTasks.filter((t) => t.is_completed).length;
  const meaningfulCount = meaningfulMoments.length;

  const titles: string[] = [];

  if (meaningfulCount > 0 && domains.length > 0) {
    const primaryDomain = domains[0];
    titles.push(`The Day ${primaryDomain} Took Center Stage`);
    titles.push(`The Day I Noticed What Mattered`);
    titles.push(`A Chapter Written in ${primaryDomain}`);
  } else if (completedCount > 5) {
    titles.push('The Day of Quiet Momentum');
    titles.push('A Day That Built Something');
    titles.push('The Day the Pieces Moved');
  } else if (completedCount > 0) {
    titles.push('The Day I Showed Up');
    titles.push('A Gentle Kind of Progress');
    titles.push('The Day That Counted');
  } else {
    titles.push('The Day of Stillness');
    titles.push('A Chapter of Rest');
    titles.push('The Day I Let Things Be');
  }

  const explanation = meaningfulCount > 0
    ? `Today held ${meaningfulCount} meaningful moment${meaningfulCount > 1 ? 's' : ''}, centered around ${domains.join(' and ')}.`
    : `A day of ${completedCount} completed tasks, building steady momentum.`;

  return {
    titles,
    subtitleKeywords: domains.length > 0 ? domains : ['Life', 'Momentum'],
    themeExplanation: explanation,
  };
}

function customizeTitleWithDomain(baseTitle: string, domain: string): string {
  // Add domain flavor to some titles for variety
  const domainSwaps: Record<string, Record<string, string>> = {
    'Career': {
      'The Day the Pieces Moved': 'The Day My Career Took a Step',
      'The Day Everything Changed': 'The Day Work Became Something More',
      'The Day Love Showed Up': 'The Day Career Felt Like Purpose',
    },
    'Side Hustle': {
      'The Day the Pieces Moved': 'The Day the Side Hustle Clicked',
      'The Day I Built Something Real': 'The Day I Bet on Myself',
      'The Day Momentum Carried Me': 'The Day My Hustle Had Wings',
    },
    'Wedding': {
      'The Day the Pieces Moved': 'The Day the Wedding Chapter Came Alive',
      'The Day Everything Changed': 'The Day It All Felt Real',
      'The Day That Sparkled': 'The Day Love Was in Every Detail',
    },
    'Friendship': {
      'The Day Love Showed Up': 'The Day My People Showed Up',
      'The Day I Felt Held': 'The Day Friendship Carried Me',
      'The Day That Was About Us': 'The Day That Was About Showing Up',
    },
    'Body': {
      'The Day I Grew Into It': 'The Day My Body Felt Like Mine',
      'The Day I Surprised Myself': 'The Day I Saw How Far I\'ve Come',
      'The Day Momentum Carried Me': 'The Day My Energy Felt Magnetic',
    },
  };

  return domainSwaps[domain]?.[baseTitle] ?? baseTitle;
}
