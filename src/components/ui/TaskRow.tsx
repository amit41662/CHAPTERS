import { View, Text, Pressable, StyleSheet, TextInput } from 'react-native';
import { useState, useRef } from 'react';
import * as Haptics from 'expo-haptics';
import { Colors } from '@/src/constants/colors';
import { Typography } from '@/src/constants/typography';
import { Layout } from '@/src/constants/layout';
import type { Task } from '@/src/types/models';

interface TaskRowProps {
  task: Task;
  onToggleComplete: (id: number) => void;
  onTogglePriority: (id: number) => void;
  onToggleMeaningful: (id: number) => void;
  onEditText: (id: number, text: string) => void;
  onTapEmoji: (id: number) => void;
  onLongPress: (task: Task) => void;
  isDark: boolean;
}

export function TaskRow({
  task,
  onToggleComplete,
  onTogglePriority,
  onToggleMeaningful,
  onEditText,
  onTapEmoji,
  onLongPress,
  isDark,
}: TaskRowProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(task.text);
  const inputRef = useRef<TextInput>(null);
  const lastTapRef = useRef(0);

  const textColor = isDark ? Colors.textOnDark : Colors.textPrimary;
  const completedColor = isDark ? 'rgba(255,255,255,0.35)' : Colors.completedText;

  function handleTextSubmit() {
    setIsEditing(false);
    const trimmed = editValue.trim();
    if (trimmed && trimmed !== task.text) {
      onEditText(task.id, trimmed);
    } else {
      setEditValue(task.text);
    }
  }

  function handleLongPress() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onLongPress(task);
  }

  // Single tap = complete, double tap = edit
  function handleRowPress() {
    const now = Date.now();
    if (now - lastTapRef.current < 300) {
      // Double tap → edit
      lastTapRef.current = 0;
      setEditValue(task.text);
      setIsEditing(true);
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      // Single tap → complete (after short delay to check for double)
      lastTapRef.current = now;
      setTimeout(() => {
        if (lastTapRef.current === now) {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onToggleComplete(task.id);
        }
      }, 300);
    }
  }

  return (
    <Pressable
      style={[
        styles.container,
        task.is_completed && styles.completedContainer,
      ]}
      onLongPress={handleLongPress}
      onPress={handleRowPress}
    >
      {/* Priority star */}
      <Pressable
        style={styles.iconButton}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onTogglePriority(task.id);
        }}
        hitSlop={8}
      >
        <Text style={[
          styles.starIcon,
          { color: task.is_priority ? Colors.priorityStar : Colors.priorityStarEmpty },
        ]}>
          {task.is_priority ? '\u2605' : '\u2606'}
        </Text>
      </Pressable>

      {/* Emoji */}
      <Pressable
        style={styles.emojiButton}
        onPress={() => onTapEmoji(task.id)}
        hitSlop={4}
      >
        <Text style={styles.emoji}>{task.emoji ?? '\u25CB'}</Text>
      </Pressable>

      {/* Text */}
      <View style={styles.textContainer}>
        {isEditing ? (
          <TextInput
            ref={inputRef}
            style={[styles.textInput, { color: textColor }]}
            value={editValue}
            onChangeText={setEditValue}
            onSubmitEditing={handleTextSubmit}
            onBlur={handleTextSubmit}
            returnKeyType="done"
            autoCorrect={false}
          />
        ) : (
          <Text
            style={[
              styles.text,
              { color: task.is_completed ? completedColor : textColor },
              task.is_completed && styles.completedText,
            ]}
            numberOfLines={2}
          >
            {task.time ? `${task.time} ` : ''}{task.text}
          </Text>
        )}
      </View>

      {/* Meaningful sparkle */}
      <Pressable
        style={styles.iconButton}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onToggleMeaningful(task.id);
        }}
        hitSlop={8}
      >
        <Text style={[
          styles.sparkleIcon,
          { color: task.is_meaningful ? Colors.meaningfulSparkle : (isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.12)') },
        ]}>
          {'\u2728'}
        </Text>
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: Layout.taskRow.minHeight,
    paddingVertical: Layout.spacing.sm,
    paddingHorizontal: Layout.spacing.sm,
  },
  completedContainer: {
    opacity: 0.6,
  },
  iconButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  starIcon: {
    fontSize: 18,
  },
  emojiButton: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 2,
  },
  emoji: {
    fontSize: Layout.taskRow.emojiSize,
  },
  textContainer: {
    flex: 1,
    marginHorizontal: Layout.spacing.sm,
  },
  text: {
    fontFamily: Typography.families.sans,
    fontSize: Typography.sizes.body,
    lineHeight: Typography.lineHeights.body,
  },
  completedText: {
    textDecorationLine: 'line-through',
  },
  textInput: {
    fontFamily: Typography.families.sans,
    fontSize: Typography.sizes.body,
    lineHeight: Typography.lineHeights.body,
    padding: 0,
  },
  sparkleIcon: {
    fontSize: 16,
  },
});
