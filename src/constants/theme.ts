import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#000000',
    background: '#ffffff',
    backgroundElement: '#F0F0F3',
    backgroundSelected: '#E0E1E6',
    textSecondary: '#60646C',
  },
  dark: {
    text: '#ffffff',
    background: '#000000',
    backgroundElement: '#212225',
    backgroundSelected: '#2E3135',
    textSecondary: '#B0B4BA',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;

export const Clay = {
  colors: {
    // Brand greens
    primary:        '#1B5E3B',
    primaryMed:     '#2D7A4F',
    primaryLight:   '#52B788',
    primaryBg:      '#DCF0E0',
    // Neutrals — warm cream/stone, no green cast
    background:     '#F5F0EA',
    card:           '#FFFFFF',
    darkCard:       '#1B5E3B',
    textPrimary:    '#1C1917',
    textSecondary:  '#78716C',
    textOnDark:     '#FFFFFF',
    // Accents
    accentOrange:   '#E8773A',
    accentOrangeBg: '#FFF0E6',
    accentPurple:   '#7B68EE',
    accentPurpleBg: '#EDE9FE',
    accentAmber:    '#F59E0B',
    accentAmberBg:  '#FEF3C7',
    // Structure
    border:         '#E2D8CC',
    borderDark:     'rgba(255,255,255,0.18)',
    error:          '#E63946',
    placeholder:    '#A8A29E',
  },
  radius: {
    xs:   8,
    sm:   12,
    md:   20,
    lg:   28,
    pill: 100,
  },
  border: 2.5,
  shadow: {
    card: Platform.select({
      ios: {
        shadowColor: '#1C1917',
        shadowOpacity: 0.14,
        shadowRadius: 22,
        shadowOffset: { width: 0, height: 9 },
      },
      android: { elevation: 10 },
      default: {},
    }) as object,
    sm: Platform.select({
      ios: {
        shadowColor: '#1C1917',
        shadowOpacity: 0.09,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
      },
      android: { elevation: 5 },
      default: {},
    }) as object,
  },
} as const;
