import React, { useEffect, useRef } from 'react';
import { Measurement as FabricMeasurement } from 'fabric-layers/measurement';
import type { MeasurementProps } from '../../types';

export const Measurement: React.FC<MeasurementProps> = ({
  start,
  end,
  unit = 'px',
  precision = 2,
  style,
  onUpdate,
  ...options
}) => {
  const measurementRef = useRef<FabricMeasurement | null>(null);

  useEffect(() => {
    measurementRef.current = new FabricMeasurement({
      start,
      end,
      unit,
      precision,
      style,
      ...options
    });

    if (onUpdate) {
      measurementRef.current.on('update', onUpdate);
    }

    return () => {
      if (measurementRef.current) {
        if (onUpdate) {
          measurementRef.current.off('update', onUpdate);
        }
        measurementRef.current.destroy();
        measurementRef.current = null;
      }
    };
  }, [start, end, unit, precision, style]);

  return null; // Renders directly on canvas
};

export default Measurement;