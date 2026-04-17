import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

import { Brand } from '@/constants/brand';

export type SocialPalette = {
  bgBase: string;
  bgSurface: string;
  bgElevated: string;
  bgHover: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  borderSubtle: string;
  borderMedium: string;
  csunRed: string;
  csunRedGlow: string;
  info: string;
};

const light: SocialPalette = {
  bgBase: '#EEF0F4',
  bgSurface: '#FFFFFF',
  bgElevated: '#F8F9FB',
  bgHover: '#F3F4F6',
  textPrimary: '#0F1117',
  textSecondary: '#525A6A',
  textMuted: '#8C95A3',
  borderSubtle: '#E3E6EC',
  borderMedium: '#CDD1DA',
  csunRed: Brand.primary,
  csunRedGlow: 'rgba(168, 5, 50, 0.18)',
  info: '#2563eb',
};

const dark: SocialPalette = {
  bgBase: '#2d0410',
  bgSurface: 'rgba(255,255,255,0.10)',
  bgElevated: 'rgba(255,255,255,0.17)',
  bgHover: 'rgba(255,255,255,0.22)',
  textPrimary: '#ffffff',
  textSecondary: 'rgba(255,255,255,0.85)',
  textMuted: 'rgba(255,255,255,0.55)',
  borderSubtle: 'rgba(255,255,255,0.18)',
  borderMedium: 'rgba(255,255,255,0.30)',
  csunRed: '#ff8fab',
  csunRedGlow: 'rgba(255, 143, 171, 0.28)',
  info: '#60a5fa',
};

type Ctx = {
  isDark: boolean;
  toggleTheme: () => void;
  colors: SocialPalette;
};

const SocialThemeContext = createContext<Ctx | null>(null);

export function SocialThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(false);
  const toggleTheme = useCallback(() => setIsDark((d) => !d), []);
  const colors = useMemo(() => (isDark ? dark : light), [isDark]);

  const value = useMemo(() => ({ isDark, toggleTheme, colors }), [isDark, toggleTheme, colors]);

  return <SocialThemeContext.Provider value={value}>{children}</SocialThemeContext.Provider>;
}

export function useSocialTheme() {
  const ctx = useContext(SocialThemeContext);
  if (!ctx) throw new Error('useSocialTheme must be used within SocialThemeProvider');
  return ctx;
}
