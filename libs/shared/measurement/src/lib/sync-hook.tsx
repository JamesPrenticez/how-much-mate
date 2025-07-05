import { useEffect } from 'react';
import { MeasurementType, type ImperialUnit, type MeasurementData, type MetricUnit, type Quantity } from './measurement.types';

export function useUnitSystemSyncAll(
  data: MeasurementData,
  setData: (data: MeasurementData) => void,
  desiredSystem: 'metric' | 'imperial'
) {
  useEffect(() => {
    const metricMap: Record<ImperialUnit, MetricUnit> = { in: 'mm', ft: 'cm', yd: 'm' };
    const imperialMap: Record<MetricUnit, ImperialUnit> = { mm: 'in', cm: 'ft', m: 'yd' };

    if (data.type === MeasurementType.LINEAR) {
      const updatedInputs = data.inputs.map((input) => {
        const newUnit =
          desiredSystem === 'metric'
            ? metricMap[input.unit as ImperialUnit] ?? input.unit
            : imperialMap[input.unit as MetricUnit] ?? input.unit;
        return { ...input, unit: newUnit };
      });

      setData({ ...data, inputs: updatedInputs });
    } else if (data.type === MeasurementType.SQUARE) {
      const updatedInputs = {
        width: {
          ...data.inputs.width,
          unit:
            desiredSystem === 'metric'
              ? metricMap[data.inputs.width.unit as ImperialUnit] ?? data.inputs.width.unit
              : imperialMap[data.inputs.width.unit as MetricUnit] ?? data.inputs.width.unit,
        },
        height: {
          ...data.inputs.height,
          unit:
            desiredSystem === 'metric'
              ? metricMap[data.inputs.height.unit as ImperialUnit] ?? data.inputs.height.unit
              : imperialMap[data.inputs.height.unit as MetricUnit] ?? data.inputs.height.unit,
        },
      };
      setData({ ...data, inputs: updatedInputs });
    } else if (data.type === MeasurementType.CUBE) {
      const updatedInputs = {
        width: {
          ...data.inputs.width,
          unit:
            desiredSystem === 'metric'
              ? metricMap[data.inputs.width.unit as ImperialUnit] ?? data.inputs.width.unit
              : imperialMap[data.inputs.width.unit as MetricUnit] ?? data.inputs.width.unit,
        },
        height: {
          ...data.inputs.height,
          unit:
            desiredSystem === 'metric'
              ? metricMap[data.inputs.height.unit as ImperialUnit] ?? data.inputs.height.unit
              : imperialMap[data.inputs.height.unit as MetricUnit] ?? data.inputs.height.unit,
        },
        depth: {
          ...data.inputs.depth,
          unit:
            desiredSystem === 'metric'
              ? metricMap[data.inputs.depth.unit as ImperialUnit] ?? data.inputs.depth.unit
              : imperialMap[data.inputs.depth.unit as MetricUnit] ?? data.inputs.depth.unit,
        },
      };
      setData({ ...data, inputs: updatedInputs });
    }
  }, [desiredSystem, data, setData]);
}