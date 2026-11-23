import * as Haptics from 'expo-haptics';

const safe = (run: () => Promise<void>) => {
  run().catch(() => {});
};

const success = () =>
  safe(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success));

/** Thin wrapper so features never import expo-haptics directly (settings toggle plugs in here later). */
export const haptics = {
  tap: () => safe(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)),
  success,
  warning: () => safe(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning)),
  /** One firm buzz for every 33rd count. It takes the place of the normal tap buzz. */
  milestone: () => safe(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)),
  /** Double success buzz for finishing something bigger than a round. */
  celebrate: () => {
    success();
    setTimeout(success, 250);
  },
};
