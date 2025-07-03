import { ToggleButtonGroup } from '@shared/components';
import { useThemeStore, Themes } from './theme.store';

export const ThemeSwitcher = () => {
  const activeTheme = useThemeStore(s => s.activeTheme);
  const setTheme = useThemeStore(s => s.setTheme);

  const options = [Themes.ORANGE_LIGHT, Themes.ORANGE_DARK]

  const handleUnitChange = (theme: Themes) => {
    setTheme(theme)
  };

  return (
    <ToggleButtonGroup
      options={options}
      active={activeTheme}
      onChange={handleUnitChange}
    />
  );
};
