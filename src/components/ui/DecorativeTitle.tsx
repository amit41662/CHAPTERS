import { View, Text, StyleSheet } from 'react-native';
import { Typography } from '@/src/constants/typography';
import { Colors } from '@/src/constants/colors';

interface DecorativeTitleProps {
  title: string;
  color?: string;
  size?: number;
}

export function DecorativeTitle({
  title,
  color = Colors.textOnDark,
  size = Typography.sizes.chapterTitle,
}: DecorativeTitleProps) {
  if (!title) return null;

  const firstLetter = title[0];
  const rest = title.slice(1);

  return (
    <View style={styles.container}>
      <Text style={styles.wrapper}>
        <Text style={[
          styles.decorativeLetter,
          { color: Colors.goldLight, fontSize: size * 1.4 },
        ]}>
          {firstLetter}
        </Text>
        <Text style={[
          styles.titleText,
          { color, fontSize: size, lineHeight: size * 1.35 },
        ]}>
          {rest}
        </Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  wrapper: {
    textAlign: 'center',
  },
  decorativeLetter: {
    fontFamily: Typography.families.script,
  },
  titleText: {
    fontFamily: Typography.families.serif,
  },
});
