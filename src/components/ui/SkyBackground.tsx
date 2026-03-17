import { StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSkyGradient } from '@/src/hooks/useSkyGradient';

interface SkyBackgroundProps {
  children: React.ReactNode;
  colors?: readonly string[];
}

export function SkyBackground({ children, colors }: SkyBackgroundProps) {
  const { gradient } = useSkyGradient();

  return (
    <LinearGradient
      colors={colors ?? gradient}
      style={styles.container}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
    >
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
