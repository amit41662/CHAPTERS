import { View, ScrollView, StyleSheet } from 'react-native';
import { useState, useCallback } from 'react';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSkyGradient } from '@/src/hooks/useSkyGradient';
import { useTasks } from '@/src/hooks/useTasks';
import { SkyBackground } from '@/src/components/ui/SkyBackground';
import { ChapterHeader } from '@/src/components/ui/ChapterHeader';
import { ConstellationPreview } from '@/src/components/ui/ConstellationPreview';
import { SectionBlock } from '@/src/components/ui/SectionBlock';
import { AddTaskBar } from '@/src/components/ui/AddTaskBar';
import { EmojiSelector } from '@/src/components/ui/EmojiSelector';
import { MeaningfulMomentModal } from '@/src/components/ui/MeaningfulMomentModal';
import { TaskActionSheet } from '@/src/components/ui/TaskActionSheet';
import { CloseChapterButton } from '@/src/components/ui/CloseChapterButton';
import { SECTION_ORDER } from '@/src/constants/sections';
import { Layout } from '@/src/constants/layout';
import type { Task } from '@/src/types/models';
import type { Section } from '@/src/constants/sections';

export function DailyHubScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const sky = useSkyGradient();
  const {
    tasks,
    loading,
    add,
    editText,
    editEmoji,
    togglePriority,
    toggleMeaningful,
    updateMeaningfulNote,
    toggleCompleted,
    remove,
    tasksBySection,
    meaningfulMoments,
    uniqueEmojis,
  } = useTasks();

  const [emojiTargetId, setEmojiTargetId] = useState<number | null>(null);
  const [meaningfulTarget, setMeaningfulTarget] = useState<Task | null>(null);
  const [actionSheetTarget, setActionSheetTarget] = useState<Task | null>(null);

  // Build constellation data from tasks
  const constellationEmojis = tasks
    .filter((t) => t.emoji)
    .reduce<{ emoji: string; isMeaningful: boolean }[]>((acc, t) => {
      // Deduplicate emojis for the constellation
      if (!acc.find((e) => e.emoji === t.emoji)) {
        acc.push({ emoji: t.emoji!, isMeaningful: t.is_meaningful });
      }
      return acc;
    }, []);

  const handleToggleMeaningful = useCallback(
    (id: number) => {
      const task = tasks.find((t) => t.id === id);
      if (!task) return;

      if (!task.is_meaningful) {
        // Show the meaningful moment modal
        setMeaningfulTarget(task);
      } else {
        toggleMeaningful(id);
      }
    },
    [tasks, toggleMeaningful]
  );

  const handleMeaningfulSave = useCallback(
    (note: string | null) => {
      if (meaningfulTarget) {
        toggleMeaningful(meaningfulTarget.id, note);
        setMeaningfulTarget(null);
      }
    },
    [meaningfulTarget, toggleMeaningful]
  );

  const handleAddTask = useCallback(
    (text: string, section: Section) => {
      add(text, section);
    },
    [add]
  );

  const handleLongPress = useCallback((task: Task) => {
    setActionSheetTarget(task);
  }, []);

  return (
    <SkyBackground>
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <ChapterHeader
            textColor={sky.textColor}
            secondaryTextColor={sky.secondaryTextColor}
          />

          <ConstellationPreview emojis={constellationEmojis} />

          <View style={styles.sections}>
            {SECTION_ORDER.map((section) => (
              <SectionBlock
                key={section}
                section={section}
                tasks={tasksBySection(section)}
                onToggleComplete={toggleCompleted}
                onTogglePriority={togglePriority}
                onToggleMeaningful={handleToggleMeaningful}
                onEditText={editText}
                onTapEmoji={(id) => setEmojiTargetId(id)}
                onLongPress={handleLongPress}
                isDark={sky.isDark}
              />
            ))}
          </View>

          <CloseChapterButton
            timeOfDay={sky.timeOfDay}
            hasMoments={meaningfulMoments.length > 0}
            onPress={() => router.push('/close-chapter/')}
          />
        </ScrollView>

        <AddTaskBar
          onAdd={handleAddTask}
          onOpenModal={() => router.push('/add-item/')}
          isDark={sky.isDark}
        />
      </View>

      {/* Emoji selector overlay */}
      {emojiTargetId !== null && (
        <EmojiSelector
          onSelect={(emoji) => {
            editEmoji(emojiTargetId, emoji);
            setEmojiTargetId(null);
          }}
          onRemove={() => {
            editEmoji(emojiTargetId, null);
            setEmojiTargetId(null);
          }}
          onClose={() => setEmojiTargetId(null)}
        />
      )}

      {/* Meaningful moment modal */}
      {meaningfulTarget && (
        <MeaningfulMomentModal
          taskText={meaningfulTarget.text}
          taskEmoji={meaningfulTarget.emoji}
          onSave={handleMeaningfulSave}
          onSkip={() => {
            toggleMeaningful(meaningfulTarget.id);
            setMeaningfulTarget(null);
          }}
        />
      )}

      {/* Action sheet */}
      {actionSheetTarget && (
        <TaskActionSheet
          task={actionSheetTarget}
          onTogglePriority={() => togglePriority(actionSheetTarget.id)}
          onToggleMeaningful={() => handleToggleMeaningful(actionSheetTarget.id)}
          onEdit={() => {
            // Editing is handled inline; just close
          }}
          onDelete={() => remove(actionSheetTarget.id)}
          onClose={() => setActionSheetTarget(null)}
        />
      )}
    </SkyBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Layout.screen.paddingHorizontal,
    paddingBottom: Layout.spacing.lg,
  },
  sections: {
    marginTop: Layout.spacing.lg,
  },
});
