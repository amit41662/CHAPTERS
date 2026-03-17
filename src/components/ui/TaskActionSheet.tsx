import { View, Text, Pressable, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Colors } from '@/src/constants/colors';
import { Typography } from '@/src/constants/typography';
import { Layout } from '@/src/constants/layout';
import type { Task } from '@/src/types/models';

interface TaskActionSheetProps {
  task: Task;
  onTogglePriority: () => void;
  onToggleMeaningful: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onClose: () => void;
}

export function TaskActionSheet({
  task,
  onTogglePriority,
  onToggleMeaningful,
  onEdit,
  onDelete,
  onClose,
}: TaskActionSheetProps) {
  function action(fn: () => void) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    fn();
    onClose();
  }

  return (
    <View style={styles.overlay}>
      <Pressable style={styles.backdrop} onPress={onClose} />
      <View style={styles.sheet}>
        <View style={styles.handle} />
        <Text style={styles.preview} numberOfLines={1}>
          {task.emoji ? `${task.emoji} ` : ''}{task.text}
        </Text>

        <Pressable style={styles.option} onPress={() => action(onTogglePriority)}>
          <Text style={styles.optionIcon}>{task.is_priority ? '\u2605' : '\u2606'}</Text>
          <Text style={styles.optionText}>
            {task.is_priority ? 'Remove priority' : 'Mark important'}
          </Text>
        </Pressable>

        <Pressable style={styles.option} onPress={() => action(onToggleMeaningful)}>
          <Text style={styles.optionIcon}>{'\u2728'}</Text>
          <Text style={styles.optionText}>
            {task.is_meaningful ? 'Remove meaningful' : 'Mark meaningful'}
          </Text>
        </Pressable>

        <Pressable style={styles.option} onPress={() => action(onEdit)}>
          <Text style={styles.optionIcon}>{'\u270F\uFE0F'}</Text>
          <Text style={styles.optionText}>Edit</Text>
        </Pressable>

        <View style={styles.divider} />

        <Pressable style={styles.option} onPress={() => action(onDelete)}>
          <Text style={styles.optionIcon}>{'\uD83D\uDDD1\uFE0F'}</Text>
          <Text style={[styles.optionText, styles.deleteText]}>Delete</Text>
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
  preview: {
    fontFamily: Typography.families.sansMedium,
    fontSize: Typography.sizes.body,
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: Layout.spacing.lg,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Layout.spacing.md,
  },
  optionIcon: {
    fontSize: 18,
    width: 32,
    textAlign: 'center',
  },
  optionText: {
    fontFamily: Typography.families.sans,
    fontSize: Typography.sizes.body,
    color: Colors.textPrimary,
    marginLeft: Layout.spacing.sm,
  },
  deleteText: {
    color: '#D94444',
  },
  divider: {
    height: 1,
    backgroundColor: Colors.separator,
    marginVertical: Layout.spacing.xs,
  },
});
