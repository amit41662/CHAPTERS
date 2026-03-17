import { View, Text, StyleSheet } from 'react-native';
import { Typography } from '@/src/constants/typography';
import { Colors } from '@/src/constants/colors';
import { Layout } from '@/src/constants/layout';
import { getDayOfYear } from '@/src/utils/dayOfYear';

interface ChapterHeaderProps {
  textColor: string;
  secondaryTextColor: string;
}

export function ChapterHeader({ textColor, secondaryTextColor }: ChapterHeaderProps) {
  const dayOfYear = getDayOfYear();

  return (
    <View style={styles.container}>
      <Text style={[styles.brand, { color: textColor }]}>CHAPTERS</Text>
      <Text style={[styles.chapterNumber, { color: Colors.gold }]}>
        Chapter {dayOfYear}
      </Text>
      <Text style={[styles.subtitle, { color: secondaryTextColor }]}>
        Today's chapter is forming...
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingTop: Layout.spacing.md,
    paddingBottom: Layout.spacing.sm,
  },
  brand: {
    fontFamily: Typography.families.serif,
    fontSize: Typography.sizes.h1,
    letterSpacing: 4,
  },
  chapterNumber: {
    fontFamily: Typography.families.sansMedium,
    fontSize: Typography.sizes.caption,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginTop: Layout.spacing.xs,
  },
  subtitle: {
    fontFamily: Typography.families.sans,
    fontSize: Typography.sizes.bodySmall,
    marginTop: Layout.spacing.xs,
  },
});
