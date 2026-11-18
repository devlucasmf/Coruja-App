import { StyleSheet, Text, useColorScheme, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing } from '../src/ui/tokens';

/** Tela provisória do passo 1. O Chat de verdade chega no passo 2. */
export function HomeScreen() {
  const insets = useSafeAreaInsets();
  const c = colors[useColorScheme() === 'dark' ? 'dark' : 'light'];

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: c.bg, paddingTop: insets.top + spacing.xl },
      ]}
    >
      <Text style={styles.owl}>🦉</Text>
      <Text style={[styles.title, { color: c.text }]}>Coruja</Text>
      <Text style={[styles.subtitle, { color: c.muted }]}>
        Sua IA em português, 100% no seu aparelho.
      </Text>
      <Text style={[styles.status, { color: c.accent }]}>
        Fundação pronta. O chat chega na próxima etapa.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', paddingHorizontal: spacing.lg },
  owl: { fontSize: 72 },
  title: { fontSize: 36, fontWeight: '700', marginTop: spacing.md },
  subtitle: { fontSize: 16, marginTop: spacing.sm, textAlign: 'center' },
  status: { fontSize: 14, marginTop: spacing.xl, textAlign: 'center' },
});
