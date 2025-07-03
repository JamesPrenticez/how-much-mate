import { create } from 'zustand';

export enum Themes {
  DARK = 'dark',
  LIGHT = 'light',
}

interface ThemeStore {
  activeTheme: Themes;
  setTheme: (theme: Themes) => void;
}

export const useThemeStore = create<ThemeStore>((set) => {
  const savedTheme = (localStorage.getItem('theme') as Themes | null) || Themes.DARK;

  return {
    activeTheme: savedTheme,
    setTheme: (theme) => {
      localStorage.setItem('theme', theme);
      set({ activeTheme: theme });
    },
  };
});
