import { useEffect, useRef, useCallback } from 'react';
import { fabric } from 'fabric';
import { LayerManager } from 'fabric-layers';
import { useLayerManager } from '../context/LayerManagerContext';

export const useFabricLayers = () => {
  const { canvas, layerManager } = useLayerManager();
  const callbacks = useRef<{
    onObjectAdded?: (object: fabric.Object) => void;
    onObjectRemoved?: (object: fabric.Object) => void;
    onSelectionCreated?: (options: { selected: fabric.Object[]; e: Event }) => void;
    onSelectionCleared?: (options: { deselected: fabric.Object[]; e: Event }) => void;
  }>({});

  const onObjectAdded = useCallback((callback: (object: fabric.Object) => void) => {
    callbacks.current.onObjectAdded = callback;
  }, []);

  const onObjectRemoved = useCallback((callback: (object: fabric.Object) => void) => {
    callbacks.current.onObjectRemoved = callback;
  }, []);

  const onSelectionCreated = useCallback((callback: (options: { selected: fabric.Object[]; e: Event }) => void) => {
    callbacks.current.onSelectionCreated = callback;
  }, []);

  const onSelectionCleared = useCallback((callback: (options: { deselected: fabric.Object[]; e: Event }) => void) => {
    callbacks.current.onSelectionCleared = callback;
  }, []);

  useEffect(() => {
    if (!canvas) return;

    const handleObjectAdded = (e: fabric.IEvent) => {
      if (e.target && callbacks.current.onObjectAdded) {
        callbacks.current.onObjectAdded(e.target);
      }
    };

    const handleObjectRemoved = (e: fabric.IEvent) => {
      if (e.target && callbacks.current.onObjectRemoved) {
        callbacks.current.onObjectRemoved(e.target);
      }
    };

    const handleSelectionCreated = (e: fabric.IEvent) => {
      if (callbacks.current.onSelectionCreated) {
        callbacks.current.onSelectionCreated({
          selected: canvas.getActiveObjects(),
          e: e.e,
        });
      }
    };

    const handleSelectionCleared = (e: fabric.IEvent) => {
      if (callbacks.current.onSelectionCleared) {
        callbacks.current.onSelectionCleared({
          deselected: e.selected || [],
          e: e.e,
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
  }, [canvas]);

  return {
    canvas,
    layerManager,
    onObjectAdded,
    onObjectRemoved,
    onSelectionCreated,
    onSelectionCleared,
  };
};
