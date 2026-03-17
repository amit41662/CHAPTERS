import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Colors } from '@/src/constants/colors';
import { Typography } from '@/src/constants/typography';
import { Layout } from '@/src/constants/layout';
import { CURATED_EMOJIS } from '@/src/constants/emojis';

interface EmojiSelectorProps {
  onSelect: (emoji: string) => void;
  onRemove: () => void;
  onClose: () => void;
}

export function EmojiSelector({ onSelect, onRemove, onClose }: EmojiSelectorProps) {
  function handleSelect(emoji: string) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onSelect(emoji);
  }

  return (
    <View style={styles.overlay}>
      <Pressable style={styles.backdrop} onPress={onClose} />
      <View style={styles.sheet}>
        <View style={styles.handle} />
        <Text style={styles.title}>Choose emoji</Text>
        <ScrollView contentContainerStyle={styles.grid}>
          {CURATED_EMOJIS.map((emoji) => (
            <Pressable
              key={emoji}
              style={styles.emojiCell}
              onPress={() => handleSelect(emoji)}
            >
              <Text style={styles.emoji}>{emoji}</Text>
            </Pressable>
          ))}
        </ScrollView>
        <Pressable style={styles.removeButton} onPress={onRemove}>
          <Text style={styles.removeText}>Remove emoji</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    zIndex: 100,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  sheet: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: Layout.borderRadius.xl,
    borderTopRightRadius: Layout.borderRadius.xl,
    paddingTop: Layout.spacing.md,
    paddingBottom: Layout.spacing.xxl,
    paddingHorizontal: Layout.screen.paddingHorizontal,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.separator,
    alignSelf: 'center',
    marginBottom: Layout.spacing.md,
  },
  title: {
    fontFamily: Typography.families.sansSemiBold,
    fontSize: Typography.sizes.h3,
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: Layout.spacing.md,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: Layout.spacing.md,
    paddingVertical: Layout.spacing.sm,
  },
  emojiCell: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Layout.borderRadius.md,
    backgroundColor: Colors.backgroundCardSolid,
  },
  emoji: {
    fontSize: 28,
  },
  removeButton: {
    marginTop: Layout.spacing.md,
    alignItems: 'center',
    paddingVertical: Layout.spacing.sm,
  },
  removeText: {
    fontFamily: Typography.families.sansMedium,
    fontSize: Typography.sizes.bodySmall,
    color: Colors.textTertiary,
  },
});
