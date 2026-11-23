import { Platform } from 'react-native';

/**
 * Where the About buttons lead. Fill these in once the app is published; while a value is empty
 * the matching button shows a "coming soon" message instead of opening anything.
 */
export const FEEDBACK_EMAIL = '';
export const ANDROID_PACKAGE = '';
export const IOS_APP_ID = '';

export const feedbackUrl = (subject: string): string | null =>
  FEEDBACK_EMAIL ? `mailto:${FEEDBACK_EMAIL}?subject=${encodeURIComponent(subject)}` : null;

export const reviewUrl = (): string | null => {
  if (Platform.OS === 'ios') {
    return IOS_APP_ID
      ? `itms-apps://itunes.apple.com/app/id${IOS_APP_ID}?action=write-review`
      : null;
  }
  return ANDROID_PACKAGE ? `market://details?id=${ANDROID_PACKAGE}` : null;
};
