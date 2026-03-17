import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withDelay,
  useSharedValue,
  withSequence,
} from 'react-native-reanimated';
import { useEffect } from 'react';
import { Colors } from '@/src/constants/colors';
import { Layout } from '@/src/constants/layout';
import { buildConstellationDeterministic } from '@/src/utils/constellationLayout';

interface ConstellationPreviewProps {
  emojis: { emoji: string; isMeaningful: boolean }[];
  height?: number;
}

function ConstellationStar({
  emoji,
  x,
  y,
  isMeaningful,
  index,
  containerWidth,
  containerHeight,
}: {
  emoji: string;
  x: number;
  y: number;
  isMeaningful: boolean;
  index: number;
  containerWidth: number;
  containerHeight: number;
}) {
  const sparkleOpacity = useSharedValue(1);

  useEffect(() => {
    if (isMeaningful) {
      sparkleOpacity.value = withDelay(
        index * 200,
        withRepeat(
          withSequence(
            withTiming(0.4, { duration: 1200 }),
            withTiming(1, { duration: 1200 })
          ),
          -1,
          true
        )
      );
    }
  }, [isMeaningful, index, sparkleOpacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: isMeaningful ? sparkleOpacity.value : 0.85,
  }));

  return (
    <Animated.View
      style={[
        styles.star,
        animatedStyle,
        {
          left: x * containerWidth - Layout.constellation.starSize / 2,
          top: y * containerHeight - Layout.constellation.starSize / 2,
        },
      ]}
    >
      <Text style={styles.starEmoji}>{emoji}</Text>
    </Animated.View>
  );
}

function ConstellationLine({
  x1,
  y1,
  x2,
  y2,
  containerWidth,
  containerHeight,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  containerWidth: number;
  containerHeight: number;
}) {
  const px1 = x1 * containerWidth;
  const py1 = y1 * containerHeight;
  const px2 = x2 * containerWidth;
  const py2 = y2 * containerHeight;

  const dx = px2 - px1;
  const dy = py2 - py1;
  const length = Math.sqrt(dx * dx + dy * dy);
  const angle = Math.atan2(dy, dx) * (180 / Math.PI);

  return (
    <View
      style={[
        styles.line,
        {
          width: length,
          left: px1,
          top: py1,
          transform: [{ rotate: `${angle}deg` }],
        },
      ]}
    />
  );
}

export function ConstellationPreview({ emojis, height }: ConstellationPreviewProps) {
  const containerHeight = height ?? Layout.constellation.height;
  const containerWidth = 300; // approximate, will be measured

  if (emojis.length === 0) {
    return (
      <View style={[styles.container, { height: containerHeight }]}>
        <Text style={styles.emptyText}>Your constellation will form here</Text>
      </View>
    );
  }

  const constellation = buildConstellationDeterministic(emojis);

  return (
    <View
      style={[styles.container, { height: containerHeight }]}
    >
      {constellation.connections.map(([a, b], i) => (
        <ConstellationLine
          key={`line-${i}`}
          x1={constellation.points[a].x}
          y1={constellation.points[a].y}
          x2={constellation.points[b].x}
          y2={constellation.points[b].y}
          containerWidth={containerWidth}
          containerHeight={containerHeight}
        />
      ))}
      {constellation.points.map((point, i) => (
        <ConstellationStar
          key={`star-${i}`}
          emoji={point.emoji}
          x={point.x}
          y={point.y}
          isMeaningful={point.isMeaningful}
          index={i}
          containerWidth={containerWidth}
          containerHeight={containerHeight}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  star: {
    position: 'absolute',
    width: Layout.constellation.starSize,
    height: Layout.constellation.starSize,
    alignItems: 'center',
    justifyContent: 'center',
  },
  starEmoji: {
    fontSize: 20,
  },
  line: {
    position: 'absolute',
    height: 1,
    backgroundColor: Colors.constellationLine,
    transformOrigin: 'left center',
  },
  emptyText: {
    color: Colors.textTertiary,
    fontSize: 13,
    fontStyle: 'italic',
  },
});
