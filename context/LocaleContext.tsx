import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { ActionSheetIOS, Alert, Platform } from 'react-native';

import {
  type AppLocale,
  type SettingsStringKey,
  SUPPORTED_LOCALES,
  getSettingsString,
} from '@/i18n/settingsStrings';

const LOCALE_STORAGE_KEY = 'cc_app_locale';

const APP_LOCALE_CODES = new Set<string>(SUPPORTED_LOCALES.map((l) => l.code));

function isAppLocale(value: string | null): value is AppLocale {
  return value != null && APP_LOCALE_CODES.has(value);
}

interface LocaleContextValue {
  locale: AppLocale;
  setLocale: (next: AppLocale) => Promise<void>;
  tSettings: (key: SettingsStringKey) => string;
  openLanguagePicker: () => void;
  currentLanguageLabel: string;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<AppLocale>('en');

  useEffect(() => {
    AsyncStorage.getItem(LOCALE_STORAGE_KEY).then((stored) => {
      if (isAppLocale(stored)) setLocaleState(stored);
    });
  }, []);

  const setLocale = useCallback(async (next: AppLocale) => {
    setLocaleState(next);
    await AsyncStorage.setItem(LOCALE_STORAGE_KEY, next);
  }, []);

  const tSettings = useCallback(
    (key: SettingsStringKey) => getSettingsString(locale, key),
    [locale],
  );

  const currentLanguageLabel = useMemo(
    () => SUPPORTED_LOCALES.find((l) => l.code === locale)?.label ?? 'English',
    [locale],
  );

  const openLanguagePicker = useCallback(() => {
    const apply = (code: AppLocale) => {
      void setLocale(code);
    };

    if (Platform.OS === 'ios') {
      const labels = SUPPORTED_LOCALES.map((l) => l.label);
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: [tSettings('cancel'), ...labels],
          cancelButtonIndex: 0,
          title: tSettings('pickerTitle'),
          message: tSettings('pickerMessage'),
        },
        (buttonIndex) => {
          if (buttonIndex <= 0) return;
          const picked = SUPPORTED_LOCALES[buttonIndex - 1];
          if (picked) apply(picked.code);
        },
      );
      return;
    }

    Alert.alert(tSettings('pickerTitle'), tSettings('pickerMessage'), [
      ...SUPPORTED_LOCALES.map((l) => ({
        text: l.label,
        onPress: () => apply(l.code),
      })),
      { text: tSettings('cancel'), style: 'cancel' },
    ]);
  }, [setLocale, tSettings]);

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      tSettings,
      openLanguagePicker,
      currentLanguageLabel,
    }),
    [locale, setLocale, tSettings, openLanguagePicker, currentLanguageLabel],
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error('useLocale must be used within LocaleProvider');
  return ctx;
}
