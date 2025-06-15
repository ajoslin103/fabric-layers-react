import { useEffect, useRef, useCallback } from 'react';
import type { Object as FabricObject, TPointerEvent, TPointerEventInfo } from 'fabric';
import { LayerManager } from 'fabric-layers';
import { useLayerManager } from '../context/LayerManagerContext';

// Define the shape of the map objects
type MapObject = {
  id?: string | number;
  type: string;
  [key: string]: any; // Allow additional properties
};

export interface LayerCallbacks {
  onObjectAdded?: (object: MapObject) => void;
  onObjectRemoved?: (object: MapObject) => void;
  onSelectionCreated?: (options: { selected: MapObject[]; e: Event }) => void;
  onSelectionCleared?: (options: { deselected: MapObject[]; e: Event }) => void;
}

export const useFabricLayers = () => {
  const { canvas, layerManager } = useLayerManager();
  const callbacks = useRef<LayerCallbacks>({});
  
  // Type guard to check if the object is a FabricObject
  const isFabricObject = (obj: unknown): obj is FabricObject => {
    if (!obj || typeof obj !== 'object' || obj === null) return false;
    
    const fabricObj = obj as Record<string, unknown>;
    return (
      'type' in fabricObj &&
      typeof fabricObj.type === 'string' &&
      'toObject' in fabricObj &&
      typeof fabricObj.toObject === 'function'
    );
  };

  const onObjectAdded = useCallback((callback: LayerCallbacks['onObjectAdded']) => {
    callbacks.current.onObjectAdded = callback;
  }, []);

  const onObjectRemoved = useCallback((callback: LayerCallbacks['onObjectRemoved']) => {
    callbacks.current.onObjectRemoved = callback;
  }, []);

  const onSelectionCreated = useCallback((callback: LayerCallbacks['onSelectionCreated']) => {
    callbacks.current.onSelectionCreated = callback;
  }, []);

  const onSelectionCleared = useCallback((callback: LayerCallbacks['onSelectionCleared']) => {
    callbacks.current.onSelectionCleared = callback;
  }, []);

  useEffect(() => {
    if (!layerManager || !canvas) return;

    const createMapObject = (obj: unknown): MapObject | null => {
      if (!obj || typeof obj !== 'object') return null;
      
      const target = obj as Record<string, any>;
      const toObject = (keys?: string[]) => {
        if (typeof target.toObject === 'function') {
          try {
            return target.toObject(keys) as Record<string, unknown>;
          } catch (e) {
            console.warn('Failed to call toObject on fabric object', e);
          }
        }
        return {};
      };

      return {
        id: target.name || target.data?.id || target.id,
        type: target.type || 'unknown',
        ...toObject(['data', 'name', 'type', 'id'])
      };
    };

    const handleObjectAdded = (e: TPointerEvent) => {
      if (callbacks.current.onObjectAdded && e.target) {
        const mapObj = createMapObject(e.target);
        if (mapObj) {
          callbacks.current.onObjectAdded(mapObj);
        }
      }
    };

    const handleObjectRemoved = (e: TPointerEvent) => {
      if (callbacks.current.onObjectRemoved && e.target) {
        const mapObj = createMapObject(e.target);
        if (mapObj) {
          callbacks.current.onObjectRemoved(mapObj);
        }
      }
    };

    const handleSelectionCreated = (e: TPointerEventInfo) => {
      if (callbacks.current.onSelectionCreated && canvas) {
        const selected = canvas.getActiveObjects()
          .filter((obj: unknown): obj is FabricObject => isFabricObject(obj))
          .map(createMapObject)
          .filter((obj): obj is MapObject => obj !== null);
        
        callbacks.current.onSelectionCreated({
          selected,
          e: e.e as Event,
        });
      }
    };

    const handleSelectionCleared = (e: TPointerEventInfo & { selected?: unknown[] }) => {
      if (callbacks.current.onSelectionCleared) {
        const selectedItems = Array.isArray(e.selected) ? e.selected : [];
        const deselected = selectedItems
          .filter((obj): obj is FabricObject => isFabricObject(obj))
          .map(createMapObject)
          .filter((obj): obj is MapObject => obj !== null);

        callbacks.current.onSelectionCleared({
          deselected,
          e: e.e as Event,
        });
      }
    };

    canvas.on('object:added', handleObjectAdded);
    canvas.on('object:removed', handleObjectRemoved);
    canvas.on('selection:created', handleSelectionCreated);
    canvas.on('selection:cleared', handleSelectionCleared);

    return () => {
      canvas.off('object:added', handleObjectAdded);
      canvas.off('object:removed', handleObjectRemoved);
      canvas.off('selection:created', handleSelectionCreated);
      canvas.off('selection:cleared', handleSelectionCleared);
    };
  }, [canvas, layerManager]);

  return {
    canvas,
    layerManager,
    onObjectAdded,
    onObjectRemoved,
    onSelectionCreated,
    onSelectionCleared,
  };
};