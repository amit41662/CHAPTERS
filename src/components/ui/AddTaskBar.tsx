import { View, TextInput, Pressable, Text, StyleSheet, Keyboard } from 'react-native';
import { useState } from 'react';
import * as Haptics from 'expo-haptics';
import { Colors } from '@/src/constants/colors';
import { Typography } from '@/src/constants/typography';
import { Layout } from '@/src/constants/layout';
import type { Section } from '@/src/constants/sections';

interface AddTaskBarProps {
  onAdd: (text: string, section: Section) => void;
  onOpenModal: () => void;
  defaultSection?: Section;
  isDark: boolean;
}

export function AddTaskBar({ onAdd, onOpenModal, defaultSection = 'today', isDark }: AddTaskBarProps) {
  const [text, setText] = useState('');

  function handleSubmit() {
    const trimmed = text.trim();
    if (!trimmed) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onAdd(trimmed, defaultSection);
    setText('');
    Keyboard.dismiss();
  }

  return (
    <View style={[
      styles.container,
      { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : Colors.inputBackground },
      { borderColor: isDark ? 'rgba(255,255,255,0.15)' : Colors.inputBorder },
    ]}>
      <Pressable style={styles.plusButton} onPress={onOpenModal} hitSlop={8}>
        <Text style={[styles.plus, { color: isDark ? Colors.textOnDarkSecondary : Colors.textTertiary }]}>+</Text>
      </Pressable>
      <TextInput
        style={[
          styles.input,
          { color: isDark ? Colors.textOnDark : Colors.textPrimary },
        ]}
        placeholder="Add something..."
        placeholderTextColor={isDark ? 'rgba(255,255,255,0.4)' : Colors.inputPlaceholder}
        value={text}
        onChangeText={setText}
        onSubmitEditing={handleSubmit}
        returnKeyType="done"
        blurOnSubmit={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: Layout.addBar.height,
    borderRadius: Layout.borderRadius.xl,
    borderWidth: 1,
    paddingHorizontal: Layout.spacing.md,
    marginHorizontal: Layout.screen.paddingHorizontal,
    marginBottom: Layout.spacing.md,
  },
  plusButton: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Layout.spacing.sm,
  },
  plus: {
    fontSize: 24,
    fontWeight: '300',
  },
  input: {
    flex: 1,
    fontFamily: Typography.families.sans,
    fontSize: Typography.sizes.body,
    height: '100%',
  },
});
