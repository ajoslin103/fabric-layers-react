import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { Point as CorePoint } from 'fabric-layers';
import { useLayerManager } from '../../context/LayerManagerContext';

export interface PointProps {
  x: number;
  y: number;
  radius?: number;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  opacity?: number;
  visible?: boolean;
  mapId?: string;
  onSelect?: (point: CorePoint) => void;
  onDeselect?: (point: CorePoint) => void;
  onClick?: (point: CorePoint) => void;
  onMouseEnter?: (point: CorePoint) => void;
  onMouseLeave?: (point: CorePoint) => void;
}

const Point = forwardRef<CorePoint, PointProps>(({
  x,
  y,
  radius = 5,
  fill = '#ff0000',
  stroke = '#000000',
  strokeWidth = 1,
  opacity = 1,
  visible = true,
  mapId,
  onSelect,
  onDeselect,
  onClick,
  onMouseEnter,
  onMouseLeave,
}, ref) => {
  const pointRef = useRef<CorePoint | null>(null);
  const { layerManager } = useLayerManager();

  // Initialize point
  useEffect(() => {
    if (!layerManager) return;

    const map = mapId ? layerManager.getMap(mapId) : layerManager.getActiveMap();
    if (!map) return;

    const point = new CorePoint({
      x,
      y,
      radius,
      fill,
      stroke,
      strokeWidth,
      opacity,
      visible,
    });

    // Add event listeners
    if (onSelect) point.on('selected', () => onSelect(point));
    if (onDeselect) point.on('deselected', () => onDeselect(point));
    if (onClick) point.on('click', () => onClick(point));
    if (onMouseEnter) point.on('mouseenter', () => onMouseEnter(point));
    if (onMouseLeave) point.on('mouseleave', () => onMouseLeave(point));

    map.addPoint(point);
    pointRef.current = point;

    return () => {
      if (pointRef.current) {
        // Remove event listeners
        point.off();
        map.removePoint(pointRef.current);
        pointRef.current = null;
      }
    };
  }, [layerManager, mapId]);

  // Update point properties when they change
  useEffect(() => {
    if (!pointRef.current) return;
    
    pointRef.current.setOptions({
      x,
      y,
      radius,
      fill,
      stroke,
      strokeWidth,
      opacity,
      visible,
    });
  }, [x, y, radius, fill, stroke, strokeWidth, opacity, visible]);

  // Expose point methods via ref
  useImperativeHandle(ref, () => pointRef.current as CorePoint, []);

  return null;
});

Point.displayName = 'Point';

export { Point };
export default Point;
