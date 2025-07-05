import { useState } from 'react';
import { useSystemStore } from './measurement-system.store';
import {
  ImperialUnit,
  MeasurementData,
  MeasurementType,
  MetricUnit,
} from './measurement.types';
import { formatMeasurement } from './measurement-formatter.util';
import { Button, Input } from '@shared/components';
import { useUnitSystemSyncAll } from './sync-hook';
import { DynamicCube } from './shapes/cube';
import { ZoomWrapper } from './shapes/zoom-wrapper';

const initialData: MeasurementData = {
  type: MeasurementType.CUBE,
  name: 'Slab',
  inputs: {
    width: { value: 20000, unit: 'm' },
    length: { value: 50000, unit: 'm' },
    depth: { value: 100, unit: 'mm' },
  },
};

export const Simple = () => {
  const [data, setData] = useState<MeasurementData>(initialData);

  const desiredSystem = useSystemStore((s) => s.system);

  // when we change desired system
  // update data units
  useUnitSystemSyncAll(data, setData, desiredSystem);

  return (
    <div>
      {Object.entries(data.inputs).map(([key, input]) => (
        <div key={key}>
          {formatMeasurement(input.value, input.unit)}
          <UnitToggle
            inputKey={key}
            activeUnit={input.unit}
            setData={setData}
          />
        </div>
      ))}
      {data.type === MeasurementType.CUBE && (
        <ZoomWrapper
          targetSize={500}
        >
        <DynamicCube
          targetSize={500}
          padding={100}
          width={50000}
          length={50000}
          depth={100}
          widthUnit={data.inputs.width.unit}
          lengthUnit={data.inputs.length.unit}
          depthUnit={data.inputs.depth.unit}
          stroke='var(--color-text)'
        />
        {/* <DynamicCube
          targetSize={500}
          padding={100}
          width={data.inputs.width.value}
          length={data.inputs.length.value}
          depth={data.inputs.depth.value}
          widthUnit={data.inputs.width.unit}
          lengthUnit={data.inputs.length.unit}
          depthUnit={data.inputs.depth.unit}
          stroke='var(--color-text)'
        /> */}
        </ZoomWrapper>
      )}
    </div>
  );
};

interface UnitToggleProps {
  inputKey: string;
  activeUnit: MetricUnit | ImperialUnit;
  setData: React.Dispatch<React.SetStateAction<MeasurementData>>;
}

const UnitToggle = ({ inputKey, activeUnit, setData }: UnitToggleProps) => {
  const desiredSystem = useSystemStore((s) => s.system);
  const units =
    desiredSystem === 'metric' ? ['mm', 'cm', 'm'] : ['in', 'ft', 'yd'];

  const handleChangeUnit = (clickedUnit: MetricUnit | ImperialUnit) => {
    // const newUnit = unitMap[clickedUnit] ?? clickedUnit;
    const newUnit = clickedUnit;

    setData((prev) => {
      switch (prev.type) {
        case MeasurementType.LINEAR: {
          // Linear type, inputKey can be an index in string form
          const updatedInputs = prev.inputs.map((input, idx) =>
            idx.toString() === inputKey ? { ...input, unit: newUnit } : input
          );
          return { ...prev, inputs: updatedInputs } as MeasurementData;
        }

        case MeasurementType.SQUARE:
        case MeasurementType.CUBE: {
          // Square or Cube: update by key
          const updatedObjectInputs = {
            ...prev.inputs,
            [inputKey]: {
              ...prev.inputs[inputKey as keyof typeof prev.inputs],
              unit: newUnit,
            },
          };
          return { ...prev, inputs: updatedObjectInputs } as MeasurementData;
        }

        default:
          return prev;
      }
    });
  };

  return (
    <div>
      {units.map((unit) => (
        <Button
          key={unit}
          style={{ color: activeUnit === unit ? 'lime' : 'red' }}
          onClick={() => handleChangeUnit(unit as MetricUnit | ImperialUnit)}
        >
          {unit}
        </Button>
      ))}
    </div>
  );
};
