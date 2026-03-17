import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useDatabase } from '@/src/hooks/useDatabase';
import { useTasks } from '@/src/hooks/useTasks';
import { ConstellationPreview } from '@/src/components/ui/ConstellationPreview';
import { DecorativeTitle } from '@/src/components/ui/DecorativeTitle';
import { Colors } from '@/src/constants/colors';
import { Typography } from '@/src/constants/typography';
import { Layout } from '@/src/constants/layout';
import { DAY_TYPES } from '@/src/constants/dayTypes';
import { getDayOfYear, getTodayString } from '@/src/utils/dayOfYear';
import { generateChapterTitleLocal } from '@/src/utils/titleGenerator';
import { saveChapter } from '@/src/db/chapterRepository';
import { buildConstellationDeterministic } from '@/src/utils/constellationLayout';
import type { Task } from '@/src/types/models';

type Step = 'moments' | 'day-type' | 'constellation' | 'pick-title' | 'reveal';

export function CloseChapterScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { db } = useDatabase();
  const { tasks, meaningfulMoments } = useTasks();

  const [step, setStep] = useState<Step>('moments');
  const [selectedMomentIds, setSelectedMomentIds] = useState<Set<number>>(new Set());
  const [selectedDayType, setSelectedDayType] = useState<string | null>(null);
  const [allTitles, setAllTitles] = useState<string[]>([]);
  const [subtitleKeywords, setSubtitleKeywords] = useState<string[]>([]);
  const [themeExplanation, setThemeExplanation] = useState('');
  const [chosenTitle, setChosenTitle] = useState<string | null>(null);

  // Animation values
  const constellationOpacity = useSharedValue(0);
  const pickTitleOpacity = useSharedValue(0);
  const titleOpacity = useSharedValue(0);
  const subtitleOpacity = useSharedValue(0);
  const chapterNumOpacity = useSharedValue(0);

  const dayOfYear = getDayOfYear();
  const today = getTodayString();

  // Pre-select all meaningful moments
  useEffect(() => {
    setSelectedMomentIds(new Set(meaningfulMoments.map((m) => m.id)));
  }, [meaningfulMoments]);

  const constellationEmojis = tasks
    .filter((t) => t.emoji)
    .reduce<{ emoji: string; isMeaningful: boolean }[]>((acc, t) => {
      if (!acc.find((e) => e.emoji === t.emoji)) {
        acc.push({ emoji: t.emoji!, isMeaningful: t.is_meaningful });
      }
      return acc;
    }, []);

  const saveChapterToDB = useCallback(async (title: string) => {
    if (!db) return;
    const constellationData = buildConstellationDeterministic(constellationEmojis);
    await saveChapter(db, {
      date: today,
      day_of_year: dayOfYear,
      title,
      subtitle_keywords: subtitleKeywords,
      theme_explanation: themeExplanation,
      constellation_data: constellationData,
    });
  }, [db, constellationEmojis, today, dayOfYear, subtitleKeywords, themeExplanation]);

  function toggleMoment(id: number) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedMomentIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function handleContinueFromMoments() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setStep('day-type');
  }

  function handlePickDayType(dayTypeId: string) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSelectedDayType(dayTypeId);

    // Generate titles from selected moments + day type
    const selectedMoments = meaningfulMoments.filter((m) => selectedMomentIds.has(m.id));
    const result = generateChapterTitleLocal(
      selectedMoments.length > 0 ? selectedMoments : meaningfulMoments,
      tasks,
      dayTypeId
    );
    setAllTitles(result.titles);
    setSubtitleKeywords(result.subtitleKeywords);
    setThemeExplanation(result.themeExplanation);

    setStep('constellation');
  }

  // Constellation step
  useEffect(() => {
    if (step !== 'constellation') return;
    constellationOpacity.value = withTiming(1, { duration: 800 });
    const timer = setTimeout(() => {
      constellationOpacity.value = withTiming(0, { duration: 400 });
      setTimeout(() => setStep('pick-title'), 400);
    }, 2000);
    return () => clearTimeout(timer);
  }, [step, constellationOpacity]);

  // Pick title step
  useEffect(() => {
    if (step !== 'pick-title') return;
    pickTitleOpacity.value = withTiming(1, { duration: 600 });
  }, [step, pickTitleOpacity]);

  // Reveal step
  useEffect(() => {
    if (step !== 'reveal' || !chosenTitle) return;
    chapterNumOpacity.value = withDelay(200, withTiming(1, { duration: 600 }));
    titleOpacity.value = withDelay(800, withTiming(1, { duration: 800 }));
    subtitleOpacity.value = withDelay(1400, withTiming(1, { duration: 500 }));
    saveChapterToDB(chosenTitle);
  }, [step, chosenTitle, chapterNumOpacity, titleOpacity, subtitleOpacity, saveChapterToDB]);

  function handlePickTitle(title: string) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setChosenTitle(title);
    pickTitleOpacity.value = withTiming(0, { duration: 400 });
    setTimeout(() => setStep('reveal'), 400);
  }

  const constStyle = useAnimatedStyle(() => ({ opacity: constellationOpacity.value }));
  const pickStyle = useAnimatedStyle(() => ({ opacity: pickTitleOpacity.value }));
  const chapterNumStyle = useAnimatedStyle(() => ({ opacity: chapterNumOpacity.value }));
  const titleStyle = useAnimatedStyle(() => ({ opacity: titleOpacity.value }));
  const subtitleStyle = useAnimatedStyle(() => ({ opacity: subtitleOpacity.value }));

  const selectableMoments: Task[] = meaningfulMoments.length > 0
    ? meaningfulMoments
    : tasks.filter((t) => !t.is_completed).slice(0, 8);

  return (
    <LinearGradient
      colors={Colors.skyNight}
      style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}
    >
      {/* Step 1: Select moments */}
      {step === 'moments' && (
        <View style={styles.centered}>
          <Text style={styles.stepTitle}>Moments That Shaped Today</Text>
          <Text style={styles.stepSubtitle}>
            Tap to choose what defines this chapter
          </Text>

          <ScrollView
            style={styles.momentsList}
            contentContainerStyle={styles.momentsListContent}
            showsVerticalScrollIndicator={false}
          >
            {selectableMoments.map((m) => {
              const isSelected = selectedMomentIds.has(m.id);
              return (
                <Pressable
                  key={m.id}
                  style={[styles.momentRow, isSelected && styles.momentRowSelected]}
                  onPress={() => toggleMoment(m.id)}
                >
                  <Text style={styles.momentCheck}>
                    {isSelected ? '\u2728' : '\u25CB'}
                  </Text>
                  <Text style={[styles.momentText, isSelected && styles.momentTextSelected]}>
                    {m.emoji ? `${m.emoji} ` : ''}{m.text}
                  </Text>
                </Pressable>
              );
            })}
            {selectableMoments.length === 0 && (
              <Text style={styles.momentText}>Every day writes its own story</Text>
            )}
          </ScrollView>

          <Pressable style={styles.continueButton} onPress={handleContinueFromMoments}>
            <Text style={styles.continueText}>Continue</Text>
          </Pressable>
        </View>
      )}

      {/* Step 2: Pick day type */}
      {step === 'day-type' && (
        <View style={styles.centered}>
          <Text style={styles.stepTitle}>What kind of day was it?</Text>
          <Text style={styles.stepSubtitle}>Pick the energy that fits</Text>

          <ScrollView
            style={styles.dayTypeList}
            contentContainerStyle={styles.dayTypeGrid}
            showsVerticalScrollIndicator={false}
          >
            {DAY_TYPES.map((dt) => (
              <Pressable
                key={dt.id}
                style={styles.dayTypeCard}
                onPress={() => handlePickDayType(dt.id)}
              >
                <Text style={styles.dayTypeEmoji}>{dt.emoji}</Text>
                <Text style={styles.dayTypeLabel}>{dt.label}</Text>
                <Text style={styles.dayTypeDesc}>{dt.description}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Step 3: Constellation */}
      {step === 'constellation' && (
        <Animated.View style={[styles.centered, constStyle]}>
          <ConstellationPreview emojis={constellationEmojis} height={200} />
        </Animated.View>
      )}

      {/* Step 4: Pick a title */}
      {step === 'pick-title' && (
        <Animated.View style={[styles.centered, pickStyle]}>
          <Text style={styles.stepTitle}>Name today's chapter</Text>
          <View style={styles.titleOptions}>
            {allTitles.map((title, i) => (
              <Pressable
                key={i}
                style={styles.titleOption}
                onPress={() => handlePickTitle(title)}
              >
                <DecorativeTitle
                  title={title}
                  size={Typography.sizes.h3}
                  color={Colors.textOnDark}
                />
              </Pressable>
            ))}
          </View>
        </Animated.View>
      )}

      {/* Step 5: Final reveal */}
      {step === 'reveal' && chosenTitle && (
        <View style={styles.centered}>
          <ConstellationPreview emojis={constellationEmojis} height={140} />

          <Animated.Text style={[styles.chapterNumber, chapterNumStyle]}>
            Chapter {dayOfYear}
          </Animated.Text>

          <Animated.View style={titleStyle}>
            <DecorativeTitle title={chosenTitle} />
          </Animated.View>

          <Animated.Text style={[styles.subtitleKeywords, subtitleStyle]}>
            {subtitleKeywords.join(' \u2022 ')}
          </Animated.Text>

          <Animated.View style={[styles.actions, subtitleStyle]}>
            <Pressable style={styles.shareButton} onPress={() => router.back()}>
              <Text style={styles.shareText}>Share Chapter</Text>
            </Pressable>
            <Pressable style={styles.doneButton} onPress={() => router.back()}>
              <Text style={styles.doneText}>Done</Text>
            </Pressable>
          </Animated.View>
        </View>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Layout.screen.paddingHorizontal,
  },
  stepTitle: {
    fontFamily: Typography.families.serif,
    fontSize: Typography.sizes.h2,
    color: Colors.textOnDark,
    textAlign: 'center',
    marginBottom: Layout.spacing.sm,
  },
  stepSubtitle: {
    fontFamily: Typography.families.sans,
    fontSize: Typography.sizes.bodySmall,
    color: Colors.textOnDarkSecondary,
    textAlign: 'center',
    marginBottom: Layout.spacing.xl,
  },

  // Moments
  momentsList: { maxHeight: 320, width: '100%' },
  momentsListContent: { gap: Layout.spacing.sm },
  momentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Layout.spacing.md,
    paddingHorizontal: Layout.spacing.md,
    borderRadius: Layout.borderRadius.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
  },
  momentRowSelected: {
    borderColor: 'rgba(201, 169, 110, 0.4)',
    backgroundColor: 'rgba(201, 169, 110, 0.08)',
  },
  momentCheck: { fontSize: 16, marginRight: Layout.spacing.md },
  momentText: {
    fontFamily: Typography.families.sans,
    fontSize: Typography.sizes.body,
    color: Colors.textOnDarkSecondary,
    flex: 1,
    lineHeight: Typography.lineHeights.body,
  },
  momentTextSelected: { color: Colors.textOnDark },
  continueButton: {
    marginTop: Layout.spacing.xl,
    paddingVertical: Layout.spacing.md,
    paddingHorizontal: Layout.spacing.xxl,
    borderRadius: Layout.borderRadius.full,
    backgroundColor: Colors.gold,
  },
  continueText: {
    fontFamily: Typography.families.sansSemiBold,
    fontSize: Typography.sizes.body,
    color: Colors.navy,
  },

  // Day type
  dayTypeList: { maxHeight: 420, width: '100%' },
  dayTypeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: Layout.spacing.sm,
  },
  dayTypeCard: {
    width: '48%',
    paddingVertical: Layout.spacing.lg,
    paddingHorizontal: Layout.spacing.md,
    borderRadius: Layout.borderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    alignItems: 'center',
  },
  dayTypeEmoji: { fontSize: 28, marginBottom: Layout.spacing.sm },
  dayTypeLabel: {
    fontFamily: Typography.families.sansSemiBold,
    fontSize: Typography.sizes.body,
    color: Colors.textOnDark,
    marginBottom: Layout.spacing.xs,
  },
  dayTypeDesc: {
    fontFamily: Typography.families.sans,
    fontSize: Typography.sizes.captionSmall,
    color: Colors.textOnDarkSecondary,
    textAlign: 'center',
    lineHeight: 14,
  },

  // Title picker
  titleOptions: { width: '100%', gap: Layout.spacing.md },
  titleOption: {
    paddingVertical: Layout.spacing.lg,
    paddingHorizontal: Layout.spacing.md,
    borderRadius: Layout.borderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(201, 169, 110, 0.25)',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },

  // Reveal
  chapterNumber: {
    fontFamily: Typography.families.sansMedium,
    fontSize: Typography.sizes.caption,
    color: Colors.gold,
    letterSpacing: 3,
    textTransform: 'uppercase',
    marginTop: Layout.spacing.lg,
    marginBottom: Layout.spacing.md,
  },
  subtitleKeywords: {
    fontFamily: Typography.families.sansMedium,
    fontSize: Typography.sizes.bodySmall,
    color: Colors.textOnDarkSecondary,
    letterSpacing: 1,
    marginTop: Layout.spacing.lg,
  },
  actions: {
    marginTop: Layout.spacing.xxl,
    alignItems: 'center',
    gap: Layout.spacing.md,
  },
  shareButton: {
    paddingVertical: Layout.spacing.md,
    paddingHorizontal: Layout.spacing.xl,
    borderRadius: Layout.borderRadius.full,
    backgroundColor: Colors.gold,
  },
  shareText: {
    fontFamily: Typography.families.sansSemiBold,
    fontSize: Typography.sizes.body,
    color: Colors.navy,
  },
  doneButton: {
    paddingVertical: Layout.spacing.sm,
    paddingHorizontal: Layout.spacing.lg,
  },
  doneText: {
    fontFamily: Typography.families.sansMedium,
    fontSize: Typography.sizes.bodySmall,
    color: Colors.textOnDarkSecondary,
  },
});
