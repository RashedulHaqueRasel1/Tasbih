import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import { ChainStepIndicator, useChainStore } from '@/features/chain';
import {
  dhikrMeaning,
  dhikrName,
  showsNameLine,
  useAllDhikr,
  useDhikrStore,
} from '@/features/dhikr';
import { useSettingsStore } from '@/features/settings';
import { haptics } from '@/shared/haptics';
import { useStoreHydrated } from '@/shared/hooks/use-store-hydrated';
import { useI18n } from '@/shared/i18n';
import { spacing } from '@/shared/theme';
import { ConfirmDialog, Screen } from '@/shared/ui';

import { BeadDisplay } from '../components/bead-display';
import { ChainCompletePanel } from '../components/chain-complete-panel';
import { ControlBar } from '../components/control-bar';
import { CountDisplay } from '../components/count-display';
import { CounterHeader } from '../components/counter-header';
import { DhikrChips } from '../components/dhikr-chips';
import { DhikrHeading } from '../components/dhikr-heading';
import { RoundProgressBar } from '../components/round-progress-bar';
import { TapSurface } from '../components/tap-surface';
import { GoldFlash } from '../components/gold-flash';
import { CountHint } from '../components/count-hint';
import { TargetPickerModal, formatTarget } from '../components/target-picker-modal';
import { useCounterSession } from '../hooks/use-counter-session';
import { useMilestone } from '../hooks/use-milestone';
import { useCounterStore } from '../store/counter-store';
import { roundProgress } from '../utils/counter-logic';

type CounterScreenProps = {
  onOpenSettings: () => void;
  onOpenLibrary: () => void;
  onOpenChains: () => void;
  onOpenHistory: () => void;
};

const HINT_TAPS = 3;

export function CounterScreen({
  onOpenSettings,
  onOpenLibrary,
  onOpenChains,
  onOpenHistory,
}: CounterScreenProps) {
  const counterReady = useStoreHydrated(useCounterStore);
  const dhikrReady = useStoreHydrated(useDhikrStore);
  const settingsReady = useStoreHydrated(useSettingsStore);
  const chainReady = useStoreHydrated(useChainStore);
  const hydrated = counterReady && dhikrReady && settingsReady && chainReady;

  const displayMode = useSettingsStore((s) => s.displayMode);
  const malaStyle = useSettingsStore((s) => s.malaStyle);
  const allDhikr = useAllDhikr();
  const { t, n, language } = useI18n();
  const session = useCounterSession(hydrated);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const milestoneFlash = useMilestone(session.count, session.totalTaps);

  if (!hydrated) {
    return <Screen>{null}</Screen>;
  }

  const { chain } = session;
  const finished = chain?.finished ?? false;
  const display = {
    count: session.count,
    target: session.target,
    rounds: session.rounds,
    trend: session.totalTaps,
  };
  const vertical = displayMode === 'bead' && malaStyle === 'vertical';
  const dhikr = session.dhikr;
  const heading = {
    arabic: dhikr.arabic,
    name: showsNameLine(dhikr, language) ? dhikrName(dhikr, language) : '',
    meaning: dhikrMeaning(dhikr, language),
  };

  // The tip is only for a fresh start: it goes away after a few taps and returns on a new count.
  const showHint = session.totalTaps < HINT_TAPS;

  const handleReset = () => {
    haptics.warning();
    setResetOpen(true);
  };

  const center = chain
    ? {
        label: t('counter.exitChain'),
        icon: 'close-circle-outline' as const,
        onPress: session.exitChain,
      }
    : {
        label: t('counter.target'),
        value: n(formatTarget(session.target)),
        onPress: () => setPickerOpen(true),
      };

  return (
    <Screen>
      {/* Full-area tap layer sits behind the content so buttons never nest inside another button. */}
      <TapSurface onCount={session.tap} onUndo={session.undo} disabled={finished} />
      <View pointerEvents="box-none" style={styles.content}>
        {!focusMode && (
          <Animated.View entering={FadeIn.duration(250)} exiting={FadeOut.duration(200)}>
            <CounterHeader
              onOpenChains={onOpenChains}
              onOpenLibrary={onOpenLibrary}
              onOpenHistory={onOpenHistory}
              onOpenSettings={onOpenSettings}
            />
          </Animated.View>
        )}

        {chain ? (
          <View pointerEvents="none">
            <ChainStepIndicator
              chainName={chain.name}
              stepIndex={chain.stepIndex}
              stepCount={chain.stepCount}
              finished={chain.finished}
            />
          </View>
        ) : (
          !focusMode && (
            <Animated.View entering={FadeIn.duration(250)} exiting={FadeOut.duration(200)}>
              <DhikrChips dhikr={allDhikr} activeId={dhikr.id} onSelect={session.selectDhikr} />
            </Animated.View>
          )
        )}

        {chain?.finished ? (
          <ChainCompletePanel
            chainName={chain.name}
            totalTaps={chain.totalTaps}
            onRestart={session.restartChain}
            onExit={session.exitChain}
          />
        ) : vertical ? (
          <View pointerEvents="none" style={styles.verticalDisplay}>
            <BeadDisplay totalTaps={session.totalTaps}>
              <View style={styles.sideColumn}>
                <CountDisplay {...display} align="left" showRounds={!chain} />
                <DhikrHeading align="left" {...heading} />
                <CountHint text={t('counter.hintVertical')} visible={showHint} />
              </View>
            </BeadDisplay>
          </View>
        ) : (
          <View pointerEvents="none" style={styles.display}>
            <DhikrHeading {...heading} />
            {displayMode === 'bead' ? (
              <BeadDisplay totalTaps={session.totalTaps}>
                <CountDisplay {...display} size="compact" showRounds={!chain} />
              </BeadDisplay>
            ) : (
              <View style={styles.simple}>
                <CountDisplay {...display} showRounds={!chain} />
                <RoundProgressBar progress={roundProgress(display)} />
              </View>
            )}
            <CountHint text={t('counter.hintTap')} visible={showHint} />
          </View>
        )}

        <ControlBar
          onUndo={session.undo}
          onReset={handleReset}
          pristine={session.pristine}
          center={center}
          focus={{ active: focusMode, onToggle: () => setFocusMode((on) => !on) }}
        />
      </View>

      <GoldFlash trigger={milestoneFlash} />
      <ConfirmDialog
        visible={resetOpen}
        title={t('counter.resetTitle')}
        message={chain ? t('counter.resetChainMessage') : t('counter.resetMessage')}
        confirmLabel={t('common.reset')}
        destructive
        onConfirm={() => {
          setResetOpen(false);
          session.reset();
        }}
        onCancel={() => setResetOpen(false)}
      />
      <TargetPickerModal
        visible={pickerOpen}
        current={session.target}
        onSelect={session.setTarget}
        onClose={() => setPickerOpen(false)}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { flex: 1, gap: spacing.md },
  display: { flex: 1, alignItems: 'center', gap: spacing.md },
  verticalDisplay: { flex: 1, alignSelf: 'stretch' },
  sideColumn: { gap: spacing.lg, alignItems: 'flex-start' },
  simple: {
    flex: 1,
    alignSelf: 'stretch',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.xl,
  },
});
