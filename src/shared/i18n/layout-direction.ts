import { Platform, type ViewStyle } from 'react-native';

/**
 * Style that makes a view lay out left-to-right or right-to-left. Native uses `direction`;
 * react-native-web only knows `writingDirection` for the same CSS property.
 */
export function layoutDirection(rtl: boolean): ViewStyle {
  const value = rtl ? 'rtl' : 'ltr';
  return (Platform.OS === 'web' ? { writingDirection: value } : { direction: value }) as ViewStyle;
}
