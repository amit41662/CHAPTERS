import { View, Text, FlatList, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useChapters } from '@/src/hooks/useChapters';
import { Colors } from '@/src/constants/colors';
import { Typography } from '@/src/constants/typography';
import { Layout } from '@/src/constants/layout';
import type { Chapter, ConstellationData } from '@/src/types/models';
import { format, parseISO } from 'date-fns';

function ChapterCard({ chapter }: { chapter: Chapter }) {
  const date = parseISO(chapter.date);
  const formattedDate = format(date, 'MMMM d, yyyy');
  const keywords: string[] = JSON.parse(chapter.subtitle_keywords || '[]');

  return (
    <View style={styles.card}>
      <Text style={styles.cardChapterNum}>Chapter {chapter.day_of_year}</Text>
      <Text style={styles.cardTitle}>{chapter.title}</Text>
      {keywords.length > 0 && (
        <Text style={styles.cardKeywords}>{keywords.join(' \u2022 ')}</Text>
      )}
      <Text style={styles.cardDate}>{formattedDate}</Text>
    </View>
  );
}

export function ChaptersListScreen() {
  const insets = useSafeAreaInsets();
  const { chapters, loading } = useChapters();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Text style={styles.header}>Your Chapters</Text>

      {chapters.length === 0 && !loading ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>No chapters yet</Text>
          <Text style={styles.emptySubtext}>
            Close your first day to see it appear here
          </Text>
        </View>
      ) : (
        <FlatList
          data={chapters}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <ChapterCard chapter={item} />}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundCardSolid,
  },
  header: {
    fontFamily: Typography.families.serif,
    fontSize: Typography.sizes.h1,
    color: Colors.textPrimary,
    paddingHorizontal: Layout.screen.paddingHorizontal,
    paddingTop: Layout.spacing.lg,
    paddingBottom: Layout.spacing.md,
  },
  list: {
    paddingHorizontal: Layout.screen.paddingHorizontal,
    paddingBottom: Layout.spacing.xxl,
  },
  card: {
    backgroundColor: Colors.navy,
    borderRadius: Layout.borderRadius.lg,
    padding: Layout.spacing.lg,
    marginBottom: Layout.spacing.md,
  },
  cardChapterNum: {
    fontFamily: Typography.families.sansMedium,
    fontSize: Typography.sizes.captionSmall,
    color: Colors.gold,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: Layout.spacing.sm,
  },
  cardTitle: {
    fontFamily: Typography.families.serif,
    fontSize: Typography.sizes.h3,
    color: Colors.textOnDark,
    lineHeight: Typography.lineHeights.h3,
    marginBottom: Layout.spacing.sm,
  },
  cardKeywords: {
    fontFamily: Typography.families.sansMedium,
    fontSize: Typography.sizes.caption,
    color: Colors.textOnDarkSecondary,
    letterSpacing: 1,
    marginBottom: Layout.spacing.sm,
  },
  cardDate: {
    fontFamily: Typography.families.sans,
    fontSize: Typography.sizes.captionSmall,
    color: Colors.textOnDarkSecondary,
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 100,
  },
  emptyText: {
    fontFamily: Typography.families.serif,
    fontSize: Typography.sizes.h2,
    color: Colors.textPrimary,
    marginBottom: Layout.spacing.sm,
  },
  emptySubtext: {
    fontFamily: Typography.families.sans,
    fontSize: Typography.sizes.bodySmall,
    color: Colors.textSecondary,
  },
});
