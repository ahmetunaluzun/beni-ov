// Tema tanımlamaları
export type ThemeName = 'purple' | 'blue' | 'pink' | 'green' | 'orange' | 'dark';

export interface Theme {
  name: string;
  primary: string;
  secondary: string;
  gradientFrom: string;
  gradientVia: string;
  gradientTo: string;
  accent: string;
  buttonGradient: string;
}

export const themes: Record<ThemeName, Theme> = {
  purple: {
    name: 'Mor Galaksi',
    primary: '#8B5CF6',
    secondary: '#EC4899',
    gradientFrom: 'from-gray-900',
    gradientVia: 'via-purple-900',
    gradientTo: 'to-gray-900',
    accent: 'purple',
    buttonGradient: 'from-purple-500 to-pink-500'
  },
  blue: {
    name: 'Okyanus Mavisi',
    primary: '#3B82F6',
    secondary: '#06B6D4',
    gradientFrom: 'from-gray-900',
    gradientVia: 'via-blue-900',
    gradientTo: 'to-cyan-900',
    accent: 'blue',
    buttonGradient: 'from-blue-500 to-cyan-500'
  },
  pink: {
    name: 'Pembe Rüya',
    primary: '#EC4899',
    secondary: '#F472B6',
    gradientFrom: 'from-pink-900',
    gradientVia: 'via-rose-900',
    gradientTo: 'to-purple-900',
    accent: 'pink',
    buttonGradient: 'from-pink-500 to-rose-500'
  },
  green: {
    name: 'Yeşil Doğa',
    primary: '#10B981',
    secondary: '#34D399',
    gradientFrom: 'from-gray-900',
    gradientVia: 'via-emerald-900',
    gradientTo: 'to-teal-900',
    accent: 'emerald',
    buttonGradient: 'from-emerald-500 to-teal-500'
  },
  orange: {
    name: 'Günbatımı',
    primary: '#F59E0B',
    secondary: '#EF4444',
    gradientFrom: 'from-gray-900',
    gradientVia: 'via-orange-900',
    gradientTo: 'to-red-900',
    accent: 'orange',
    buttonGradient: 'from-orange-500 to-red-500'
  },
  dark: {
    name: 'Gece Karanlığı',
    primary: '#6B7280',
    secondary: '#9CA3AF',
    gradientFrom: 'from-black',
    gradientVia: 'via-gray-900',
    gradientTo: 'to-black',
    accent: 'gray',
    buttonGradient: 'from-gray-600 to-gray-800'
  }
};

export const getThemeClasses = (themeName: ThemeName) => {
  const theme = themes[themeName];
  return {
    background: `bg-gradient-to-br ${theme.gradientFrom} ${theme.gradientVia} ${theme.gradientTo}`,
    button: `bg-gradient-to-r ${theme.buttonGradient}`,
    text: `text-${theme.accent}-400`,
    border: `border-${theme.accent}-500`,
    shadow: `shadow-${theme.accent}-500/30`,
    hover: `hover:bg-${theme.accent}-500`
  };
};
