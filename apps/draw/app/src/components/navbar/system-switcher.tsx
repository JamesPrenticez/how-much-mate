import { ToggleButtonGroup } from '@shared/components';
import { System, SystemType, useSystemStore } from "@shared/measurement"

export const SystemSwitcher = () => {
  const { system, setSystem } = useSystemStore();

  const handleChange = (value: string) => {
    setSystem(value as SystemType);
  };

  const options = Object.values(System).map((value) => (value));

  return (
    <ToggleButtonGroup
      options={options}
      active={system}
      onChange={handleChange}
    />
  );
};
