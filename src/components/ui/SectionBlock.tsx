import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/src/constants/colors';
import { Typography } from '@/src/constants/typography';
import { Layout } from '@/src/constants/layout';
import { SECTION_LABELS, type Section } from '@/src/constants/sections';
import { TaskRow } from './TaskRow';
import type { Task } from '@/src/types/models';

interface SectionBlockProps {
  section: Section;
  tasks: Task[];
  onToggleComplete: (id: number) => void;
  onTogglePriority: (id: number) => void;
  onToggleMeaningful: (id: number) => void;
  onEditText: (id: number, text: string) => void;
  onTapEmoji: (id: number) => void;
  onLongPress: (task: Task) => void;
  isDark: boolean;
}

export function SectionBlock({
  section,
  tasks,
  onToggleComplete,
  onTogglePriority,
  onToggleMeaningful,
  onEditText,
  onTapEmoji,
  onLongPress,
  isDark,
}: SectionBlockProps) {
  const labelColor = isDark ? Colors.textOnDarkSecondary : Colors.textSecondary;

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: labelColor }]}>
        {SECTION_LABELS[section]}
      </Text>
      <View style={[
        styles.card,
        { backgroundColor: isDark ? Colors.backgroundOverlay : Colors.backgroundSection },
      ]}>
        {tasks.length === 0 ? (
          <View style={styles.emptyRow}>
            <Text style={[styles.emptyText, { color: labelColor }]}>
              No items yet
            </Text>
          </View>
        ) : (
          tasks.map((task) => (
            <TaskRow
              key={task.id}
              task={task}
              onToggleComplete={onToggleComplete}
              onTogglePriority={onTogglePriority}
              onToggleMeaningful={onToggleMeaningful}
              onEditText={onEditText}
              onTapEmoji={onTapEmoji}
              onLongPress={onLongPress}
              isDark={isDark}
            />
          ))
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Layout.spacing.md,
  },
  label: {
    fontFamily: Typography.families.sansSemiBold,
    fontSize: Typography.sizes.caption,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: Layout.spacing.sm,
    marginLeft: Layout.spacing.xs,
  },
  card: {
    borderRadius: Layout.borderRadius.lg,
    overflow: 'hidden',
  },
  emptyRow: {
    paddingVertical: Layout.spacing.lg,
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: Typography.families.sans,
    fontSize: Typography.sizes.bodySmall,
    fontStyle: 'italic',
  },
});
