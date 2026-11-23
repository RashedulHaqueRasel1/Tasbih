import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

import { spacing } from '@/shared/theme';
import { AppText, Button, Screen } from '@/shared/ui';

import { BeadRing } from '../components/bead-ring';
import { WELCOME_TEXT } from '../data/welcome-text';

type WelcomeScreenProps = {
  onStart: () => void;
};

export function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  return (
    <Screen>
      <Animated.View entering={FadeIn.duration(700)} style={styles.top}>
        <AppText variant="arabic" color="accent" style={styles.centered}>
          {WELCOME_TEXT.bismillah}
        </AppText>
      </Animated.View>

      <View style={styles.hero}>
        <Animated.View entering={FadeIn.duration(900).delay(150)}>
          <BeadRing size={280}>
            <AppText variant="arabic" color="gold" style={styles.ringText}>
              {WELCOME_TEXT.center}
            </AppText>
          </BeadRing>
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(600).delay(450)} style={styles.titles}>
          <AppText variant="title" style={styles.centered}>
            {WELCOME_TEXT.title}
          </AppText>
          <AppText variant="headline" color="accent" style={styles.centered}>
            {WELCOME_TEXT.titleLine}
          </AppText>
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(600).delay(650)} style={styles.taglines}>
          {WELCOME_TEXT.taglines.map((line) => (
            <AppText key={line.language} color="textSecondary" style={styles.centered}>
              {line.text}
            </AppText>
          ))}
        </Animated.View>
      </View>

      <Animated.View entering={FadeInDown.duration(600).delay(850)}>
        <Button label={WELCOME_TEXT.start} variant="primary" onPress={onStart} />
      </Animated.View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  top: { alignItems: 'center', paddingTop: spacing.md },
  hero: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.lg },
  titles: { alignItems: 'center', gap: spacing.xs },
  taglines: { alignItems: 'center', gap: spacing.xs },
  centered: { textAlign: 'center' },
  ringText: { textAlign: 'center', fontSize: 36, lineHeight: 60 },
});
