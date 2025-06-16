import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { Map as CoreMap } from 'fabric-layers';
import { useLayerManager } from '../../context/LayerManagerContext';

export interface MapProps {
  width?: number | string;
  height?: number | string;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  onReady?: (map: CoreMap) => void;
  modes?: Record<string, any>;
  defaultMode?: string;
}

const Map = forwardRef<CoreMap, MapProps>(({
  width = '100%',
  height = '100%',
  className = '',
  style = {},
  children,
  onReady,
  modes,
  defaultMode,
}, ref) => {
  const mapRef = useRef<CoreMap | null>(null);
  const { layerManager } = useLayerManager();
  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize map
  useEffect(() => {
    if (!layerManager || !containerRef.current) return;

    const map = new CoreMap(containerRef.current, {
      width: typeof width === 'number' ? width : undefined,
      height: typeof height === 'number' ? height : undefined,
    });

    // Add map to layer manager
    layerManager.addMap(map);
    mapRef.current = map;

    // Set modes if provided
    if (modes) {
      Object.entries(modes).forEach(([name, mode]) => {
        map.registerMode(name, mode);
      });
    }

    // Set default mode if provided
    if (defaultMode) {
      map.setMode(defaultMode);
    }

    // Call onReady callback
    if (onReady) {
      onReady(map);
    }


    return () => {
      if (mapRef.current) {
        layerManager.removeMap(mapRef.current);
        mapRef.current.dispose();
        mapRef.current = null;
      }
    };
  }, [layerManager, width, height, modes, defaultMode, onReady]);

  // Expose map methods via ref
  useImperativeHandle(ref, () => mapRef.current as CoreMap, []);

  return (
    <div
      ref={containerRef}
      className={`fabric-map ${className}`}
      style={{
        width,
        height,
        position: 'relative',
        overflow: 'hidden',
        ...style,
      }}
    >
      {children}
    </div>
  );
});

Map.displayName = 'Map';

export { Map };
export default Map;
