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

    // Helper function to check if a unit needs conversion
    const needsConversion = (unit: string): boolean => {
      return desiredSystem === 'metric' 
        ? unit in metricMap 
        : unit in imperialMap;
    };

    // Helper function to convert a unit - returns the correct type
    const convertUnit = (unit: MetricUnit | ImperialUnit): MetricUnit | ImperialUnit => {
      return desiredSystem === 'metric'
        ? metricMap[unit as ImperialUnit] ?? unit
        : imperialMap[unit as MetricUnit] ?? unit;
    };

    let shouldUpdate = false;
    let updatedData: MeasurementData = { ...data };

    if (data.type === MeasurementType.LINEAR) {
      const updatedInputs = data.inputs.map((input) => {
        if (needsConversion(input.unit)) {
          shouldUpdate = true;
          return { ...input, unit: convertUnit(input.unit) };
        }
        return input;
      });

      if (shouldUpdate) {
        updatedData = { ...data, inputs: updatedInputs };
      }
    } else if (data.type === MeasurementType.SQUARE) {
      const widthNeedsConversion = needsConversion(data.inputs.width.unit);
      const lengthNeedsConversion = needsConversion(data.inputs.length.unit);
      
      if (widthNeedsConversion || lengthNeedsConversion) {
        shouldUpdate = true;
        updatedData = {
          ...data,
          inputs: {
            width: {
              ...data.inputs.width,
              unit: widthNeedsConversion ? convertUnit(data.inputs.width.unit) : data.inputs.width.unit,
            },
            length: {
              ...data.inputs.length,
              unit: lengthNeedsConversion ? convertUnit(data.inputs.length.unit) : data.inputs.length.unit,
            },
          },
        };
      }
    } else if (data.type === MeasurementType.CUBE) {
      const widthNeedsConversion = needsConversion(data.inputs.width.unit);
      const lengthNeedsConversion = needsConversion(data.inputs.length.unit);
      const depthNeedsConversion = needsConversion(data.inputs.depth.unit);
      
      if (widthNeedsConversion || lengthNeedsConversion || depthNeedsConversion) {
        shouldUpdate = true;
        updatedData = {
          ...data,
          inputs: {
            width: {
              ...data.inputs.width,
              unit: widthNeedsConversion ? convertUnit(data.inputs.width.unit) : data.inputs.width.unit,
            },
            length: {
              ...data.inputs.length,
              unit: lengthNeedsConversion ? convertUnit(data.inputs.length.unit) : data.inputs.length.unit,
            },
            depth: {
              ...data.inputs.depth,
              unit: depthNeedsConversion ? convertUnit(data.inputs.depth.unit) : data.inputs.depth.unit,
            },
          },
        };
      }
    }

    // Only update if conversion was actually needed
    if (shouldUpdate) {
      setData(updatedData);
    }
  }, [desiredSystem, data.type, setData]);
}