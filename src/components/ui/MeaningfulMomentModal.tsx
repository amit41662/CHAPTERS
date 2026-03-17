import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { useState } from 'react';
import { Colors } from '@/src/constants/colors';
import { Typography } from '@/src/constants/typography';
import { Layout } from '@/src/constants/layout';

interface MeaningfulMomentModalProps {
  taskText: string;
  taskEmoji: string | null;
  onSave: (note: string | null) => void;
  onSkip: () => void;
}

export function MeaningfulMomentModal({
  taskText,
  taskEmoji,
  onSave,
  onSkip,
}: MeaningfulMomentModalProps) {
  const [note, setNote] = useState('');

  return (
    <View style={styles.overlay}>
      <Pressable style={styles.backdrop} onPress={onSkip} />
      <View style={styles.sheet}>
        <View style={styles.handle} />
        <Text style={styles.sparkle}>{'\u2728'}</Text>
        <Text style={styles.title}>Why was this meaningful?</Text>
        <Text style={styles.taskPreview}>
          {taskEmoji ? `${taskEmoji} ` : ''}{taskText}
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Optional - just skip if you want"
          placeholderTextColor={Colors.inputPlaceholder}
          value={note}
          onChangeText={setNote}
          multiline
          maxLength={200}
          autoFocus
        />
        <View style={styles.buttons}>
          <Pressable style={styles.skipButton} onPress={onSkip}>
            <Text style={styles.skipText}>Skip</Text>
          </Pressable>
          <Pressable
            style={styles.saveButton}
            onPress={() => onSave(note.trim() || null)}
          >
            <Text style={styles.saveText}>Save</Text>
          </Pressable>
        </View>
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
    marginBottom: Layout.spacing.lg,
  },
  sparkle: {
    fontSize: 32,
    textAlign: 'center',
    marginBottom: Layout.spacing.sm,
  },
  title: {
    fontFamily: Typography.families.serif,
    fontSize: Typography.sizes.h2,
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: Layout.spacing.sm,
  },
  taskPreview: {
    fontFamily: Typography.families.sans,
    fontSize: Typography.sizes.bodySmall,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Layout.spacing.lg,
  },
  input: {
    fontFamily: Typography.families.sans,
    fontSize: Typography.sizes.body,
    color: Colors.textPrimary,
    borderWidth: 1,
    borderColor: Colors.inputBorder,
    borderRadius: Layout.borderRadius.md,
    padding: Layout.spacing.md,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Layout.spacing.lg,
    gap: Layout.spacing.md,
  },
  skipButton: {
    flex: 1,
    paddingVertical: Layout.spacing.md,
    alignItems: 'center',
    borderRadius: Layout.borderRadius.md,
    backgroundColor: Colors.backgroundCardSolid,
    borderWidth: 1,
    borderColor: Colors.inputBorder,
  },
  skipText: {
    fontFamily: Typography.families.sansMedium,
    fontSize: Typography.sizes.body,
    color: Colors.textSecondary,
  },
  saveButton: {
    flex: 1,
    paddingVertical: Layout.spacing.md,
    alignItems: 'center',
    borderRadius: Layout.borderRadius.md,
    backgroundColor: Colors.navy,
  },
  saveText: {
    fontFamily: Typography.families.sansSemiBold,
    fontSize: Typography.sizes.body,
    color: Colors.textOnDark,
  },
});
