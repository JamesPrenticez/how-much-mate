import React, { useEffect, useMemo, useState } from 'react';
import { useSystemStore } from './measurement-system.store';
import { ImperialUnit, MetricUnit } from './measurement.types';
import { formatMeasurement } from './measurement-formatter.util';
import { Button } from '@shared/components';

export const Simple = () => {
  const desiredSystem = useSystemStore((s) => s.system);
  const units = desiredSystem === 'metric' ? ['mm', 'cm', 'm'] : ['in', 'ft', 'yd'];
  const [activeUnit, setActiveUnit] = useState(units[0]);

  const value = 500;

  const formattedValue = useMemo(() => formatMeasurement(value, activeUnit as MetricUnit | ImperialUnit), [value, activeUnit]);

  useEffect(() => {
  if (desiredSystem === 'metric') {
    if (activeUnit === 'in') setActiveUnit('mm');
    else if (activeUnit === 'ft') setActiveUnit('cm');
    else if (activeUnit === 'yd') setActiveUnit('m');
  } else if (desiredSystem === 'imperial') {
    if (activeUnit === 'mm') setActiveUnit('in');
    else if (activeUnit === 'cm') setActiveUnit('ft');
    else if (activeUnit === 'm') setActiveUnit('yd'); // if you support yards
  }
}, [activeUnit, desiredSystem]);

  return (
<div>
  Raw value in mm: {value} <br/>
  Formatted: {formattedValue}

  {units.map((unit) => (
    <Button
      key={unit}
      style={{ color: activeUnit === unit ? 'lime' : 'red' }}
      onClick={() => setActiveUnit(unit)}
    >
      {unit}
    </Button>
  ))}
</div>
  );
};
