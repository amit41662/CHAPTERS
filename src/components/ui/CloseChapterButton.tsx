import { Pressable, Text, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Colors } from '@/src/constants/colors';
import { Typography } from '@/src/constants/typography';
import { Layout } from '@/src/constants/layout';
import type { TimeOfDay } from '@/src/constants/sky';

interface CloseChapterButtonProps {
  timeOfDay: TimeOfDay;
  hasMoments: boolean;
  onPress: () => void;
}

export function CloseChapterButton({ timeOfDay, hasMoments, onPress }: CloseChapterButtonProps) {
  // Always visible but more prominent in evening/night
  const isEvening = timeOfDay === 'evening' || timeOfDay === 'night';
  const opacity = isEvening ? 1 : 0.6;

  function handlePress() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onPress();
  }

  return (
    <Pressable
      style={[styles.button, { opacity }]}
      onPress={handlePress}
    >
      <Text style={styles.text}>Close Today's Chapter</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignSelf: 'center',
    paddingVertical: Layout.spacing.md,
    paddingHorizontal: Layout.spacing.xl,
    borderRadius: Layout.borderRadius.full,
    backgroundColor: Colors.navy,
    marginTop: Layout.spacing.xl,
    marginBottom: Layout.spacing.lg,
  },
  text: {
    fontFamily: Typography.families.sansSemiBold,
    fontSize: Typography.sizes.body,
    color: Colors.goldLight,
    letterSpacing: 0.5,
  },
});
