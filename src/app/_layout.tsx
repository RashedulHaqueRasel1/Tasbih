import '@/global.css';

import { useFonts } from 'expo-font';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import * as SystemUI from 'expo-system-ui';
import { useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';

import { useColorScheme } from '@/shared/hooks/use-color-scheme';
import { useStoreHydrated } from '@/shared/hooks/use-store-hydrated';
import { useLanguageStore } from '@/shared/i18n';
import { fontAssets, palettes, useThemePreferenceStore } from '@/shared/theme';
import { IntroSplash } from '@/shared/ui';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts(fontAssets);
  const themeReady = useStoreHydrated(useThemePreferenceStore);
  const languageReady = useStoreHydrated(useLanguageStore);
  const scheme = useColorScheme();
  const [introDone, setIntroDone] = useState(false);
  const finishIntro = useCallback(() => setIntroDone(true), []);
  const ready = (fontsLoaded || fontError !== null) && themeReady && languageReady;

  useEffect(() => {
    if (ready) {
      SplashScreen.hideAsync();
    }
  }, [ready]);

  // The native window behind the screens: without this it shows white while a screen slides away.
  const windowBackground = palettes[scheme].background;
  useEffect(() => {
    SystemUI.setBackgroundColorAsync(windowBackground);
  }, [windowBackground]);

  if (!ready) {
    return null;
  }

  const base = scheme === 'dark' ? DarkTheme : DefaultTheme;

  return (
    <ThemeProvider
      value={{ ...base, colors: { ...base.colors, background: palettes[scheme].background } }}>
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
      <View style={{ flex: 1 }}>
        <Stack
          screenOptions={{
            headerShown: false,
            animation: 'slide_from_right',
            animationDuration: 300,
            gestureEnabled: true,
            fullScreenGestureEnabled: true,
            contentStyle: { backgroundColor: palettes[scheme].background },
          }}
        />
        {!introDone && <IntroSplash onDone={finishIntro} />}
      </View>
    </ThemeProvider>
  );
}
