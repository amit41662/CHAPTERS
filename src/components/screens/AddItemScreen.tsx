import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { useDatabase } from '@/src/hooks/useDatabase';
import { addTask } from '@/src/db/taskRepository';
import { getTodayString } from '@/src/utils/dayOfYear';
import { Colors } from '@/src/constants/colors';
import { Typography } from '@/src/constants/typography';
import { Layout } from '@/src/constants/layout';
import { SECTION_ORDER, SECTION_LABELS, type Section } from '@/src/constants/sections';
import { CURATED_EMOJIS } from '@/src/constants/emojis';

export function AddItemScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { db } = useDatabase();

  const [text, setText] = useState('');
  const [emoji, setEmoji] = useState<string | null>(null);
  const [section, setSection] = useState<Section>('today');
  const [time, setTime] = useState('');

  async function handleAdd() {
    const trimmed = text.trim();
    if (!trimmed || !db) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await addTask(db, { date: getTodayString(), section, text: trimmed, emoji, time: time.trim() || null });
    router.back();
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top + 16, paddingBottom: insets.bottom }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.cancelText}>Cancel</Text>
        </Pressable>
        <Text style={styles.title}>Add Item</Text>
        <Pressable onPress={handleAdd}>
          <Text style={[styles.addText, !text.trim() && styles.addTextDisabled]}>Add</Text>
        </Pressable>
      </View>

      {/* Emoji + text */}
      <View style={styles.inputRow}>
        <Pressable
          style={styles.emojiPickerButton}
          onPress={() => {
            // Cycle through a few curated emojis for quick selection
            const idx = emoji ? CURATED_EMOJIS.indexOf(emoji as any) : -1;
            setEmoji(CURATED_EMOJIS[(idx + 1) % CURATED_EMOJIS.length]);
          }}
        >
          <Text style={styles.emojiPreview}>{emoji ?? '\u25CB'}</Text>
        </Pressable>
        <TextInput
          style={styles.textInput}
          placeholder="What's on your mind?"
          placeholderTextColor={Colors.inputPlaceholder}
          value={text}
          onChangeText={setText}
          autoFocus
          multiline={false}
          returnKeyType="done"
        />
      </View>

      {/* Section selector */}
      <Text style={styles.sectionLabel}>Section</Text>
      <View style={styles.sectionRow}>
        {SECTION_ORDER.map((s) => (
          <Pressable
            key={s}
            style={[
              styles.sectionChip,
              section === s && styles.sectionChipActive,
            ]}
            onPress={() => setSection(s)}
          >
            <Text style={[
              styles.sectionChipText,
              section === s && styles.sectionChipTextActive,
            ]}>
              {SECTION_LABELS[s]}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Time (optional, for appts) */}
      {section === 'appts' && (
        <View style={styles.timeRow}>
          <Text style={styles.sectionLabel}>Time (optional)</Text>
          <TextInput
            style={styles.timeInput}
            placeholder="e.g. 2:30 PM"
            placeholderTextColor={Colors.inputPlaceholder}
            value={time}
            onChangeText={setTime}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundCardSolid,
    paddingHorizontal: Layout.screen.paddingHorizontal,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Layout.spacing.xl,
  },
  cancelText: {
    fontFamily: Typography.families.sans,
    fontSize: Typography.sizes.body,
    color: Colors.textSecondary,
  },
  title: {
    fontFamily: Typography.families.sansSemiBold,
    fontSize: Typography.sizes.h3,
    color: Colors.textPrimary,
  },
  addText: {
    fontFamily: Typography.families.sansSemiBold,
    fontSize: Typography.sizes.body,
    color: Colors.navy,
  },
  addTextDisabled: {
    opacity: 0.3,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Layout.spacing.xl,
  },
  emojiPickerButton: {
    width: 44,
    height: 44,
    borderRadius: Layout.borderRadius.md,
    backgroundColor: Colors.backgroundSection,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Layout.spacing.md,
  },
  emojiPreview: {
    fontSize: 24,
  },
  textInput: {
    flex: 1,
    fontFamily: Typography.families.sans,
    fontSize: Typography.sizes.h3,
    color: Colors.textPrimary,
  },
  sectionLabel: {
    fontFamily: Typography.families.sansSemiBold,
    fontSize: Typography.sizes.caption,
    color: Colors.textSecondary,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: Layout.spacing.sm,
  },
  sectionRow: {
    flexDirection: 'row',
    gap: Layout.spacing.sm,
    marginBottom: Layout.spacing.xl,
  },
  sectionChip: {
    paddingVertical: Layout.spacing.sm,
    paddingHorizontal: Layout.spacing.md,
    borderRadius: Layout.borderRadius.full,
    backgroundColor: Colors.backgroundSection,
    borderWidth: 1,
    borderColor: Colors.inputBorder,
  },
  sectionChipActive: {
    backgroundColor: Colors.navy,
    borderColor: Colors.navy,
  },
  sectionChipText: {
    fontFamily: Typography.families.sansMedium,
    fontSize: Typography.sizes.bodySmall,
    color: Colors.textSecondary,
  },
  sectionChipTextActive: {
    color: Colors.textOnDark,
  },
  timeRow: {
    marginBottom: Layout.spacing.xl,
  },
  timeInput: {
    fontFamily: Typography.families.sans,
    fontSize: Typography.sizes.body,
    color: Colors.textPrimary,
    borderWidth: 1,
    borderColor: Colors.inputBorder,
    borderRadius: Layout.borderRadius.md,
    padding: Layout.spacing.md,
  },
});
