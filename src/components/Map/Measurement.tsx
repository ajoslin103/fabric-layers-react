import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { Measurement as CoreMeasurement } from 'fabric-layers';
import { useLayerManager } from '../../context/LayerManagerContext';

export interface MeasurementProps {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  unit?: string;
  lineColor?: string;
  lineWidth?: number;
  labelColor?: string;
  labelSize?: number;
  labelOffset?: number;
  showLabels?: boolean;
  precision?: number;
  mapId?: string;
  onUpdate?: (measurement: CoreMeasurement) => void;
  onSelect?: (measurement: CoreMeasurement) => void;
  onDeselect?: (measurement: CoreMeasurement) => void;
}

const Measurement = forwardRef<CoreMeasurement, MeasurementProps>(({
  startX,
  startY,
  endX,
  endY,
  unit = 'px',
  lineColor = '#ff0000',
  lineWidth = 2,
  labelColor = '#000000',
  labelSize = 12,
  labelOffset = 10,
  showLabels = true,
  precision = 2,
  mapId,
  onUpdate,
  onSelect,
  onDeselect,
}, ref) => {
  const measurementRef = useRef<CoreMeasurement | null>(null);
  const { layerManager } = useLayerManager();

  // Initialize measurement
  useEffect(() => {
    if (!layerManager) return;

    const map = mapId ? layerManager.getMap(mapId) : layerManager.getActiveMap();
    if (!map) return;

    const measurement = new CoreMeasurement({
      start: { x: startX, y: startY },
      end: { x: endX, y: endY },
      unit,
      lineColor,
      lineWidth,
      labelColor,
      labelSize,
      labelOffset,
      showLabels,
      precision,
    });

    // Add event listeners
    if (onUpdate) measurement.on('update', () => onUpdate(measurement));
    if (onSelect) measurement.on('select', () => onSelect(measurement));
    if (onDeselect) measurement.on('deselect', () => onDeselect(measurement));

    map.addMeasurement(measurement);
    measurementRef.current = measurement;

    return () => {
      if (measurementRef.current) {
        // Remove event listeners
        measurement.off();
        map.removeMeasurement(measurementRef.current);
        measurementRef.current = null;
      }
    };
  }, [layerManager, mapId]);

  // Update measurement properties when they change
  useEffect(() => {
    if (!measurementRef.current) return;
    
    measurementRef.current.setOptions({
      start: { x: startX, y: startY },
      end: { x: endX, y: endY },
      unit,
      lineColor,
      lineWidth,
      labelColor,
      labelSize,
      labelOffset,
      showLabels,
      precision,
    });
  }, [
    startX, startY, endX, endY, unit, lineColor, lineWidth, 
    labelColor, labelSize, labelOffset, showLabels, precision
  ]);

  // Expose measurement methods via ref
  useImperativeHandle(ref, () => measurementRef.current as CoreMeasurement, []);

  return null;
});

Measurement.displayName = 'Measurement';

export { Measurement };
export default Measurement;
