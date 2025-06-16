import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { Grid as CoreGrid } from 'fabric-layers';
import { useLayerManager } from '../../context/LayerManagerContext';

export interface GridProps {
  size?: number;
  color?: string;
  dashArray?: number[];
  opacity?: number;
  visible?: boolean;
  mapId?: string;
}

const Grid = forwardRef<CoreGrid, GridProps>(({
  size = 20,
  color = '#cccccc',
  dashArray = [1, 2],
  opacity = 0.5,
  visible = true,
  mapId,
}, ref) => {
  const gridRef = useRef<CoreGrid | null>(null);
  const { layerManager } = useLayerManager();

  // Initialize grid
  useEffect(() => {
    if (!layerManager) return;

    const map = mapId ? layerManager.getMap(mapId) : layerManager.getActiveMap();
    if (!map) return;

    const grid = new CoreGrid({
      size,
      color,
      dashArray,
      opacity,
      visible,
    });

    map.addGrid(grid);
    gridRef.current = grid;

    return () => {
      if (gridRef.current) {
        map.removeGrid(gridRef.current);
        gridRef.current = null;
      }
    };
  }, [layerManager, mapId]);

  // Update grid properties when they change
  useEffect(() => {
    if (!gridRef.current) return;
    
    gridRef.current.setOptions({
      size,
      color,
      dashArray,
      opacity,
      visible,
    });
  }, [size, color, dashArray, opacity, visible]);

  // Expose grid methods via ref
  useImperativeHandle(ref, () => gridRef.current as CoreGrid, []);

  return null;
});

Grid.displayName = 'Grid';

export { Grid };
export default Grid;
