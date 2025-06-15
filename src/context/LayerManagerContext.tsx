import React, { createContext, useContext, useRef, useEffect } from 'react';
import type { fabric } from 'fabric';
import { LayerManager } from 'fabric-layers';
import { LayerManagerContextType } from '../types';

export const LayerManagerContext = createContext<LayerManagerContextType>({
  canvas: null,
  layerManager: null,
});

export const useLayerManager = (): LayerManagerContextType => {
  const context = useContext(LayerManagerContext);
  if (!context) {
    throw new Error('useLayerManager must be used within a LayerManagerProvider');
  }
  return context;
};

export const LayerManagerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const canvasRef = useRef<fabric.Canvas | null>(null);
  const layerManagerRef = useRef<LayerManager | null>(null);

  useEffect(() => {
    return () => {
      // Cleanup
      if (canvasRef.current) {
        canvasRef.current.dispose();
      }
      if (layerManagerRef.current) {
        layerManagerRef.current.dispose();
      }
    };
  }, []);

  const value = {
    canvas: canvasRef.current,
    layerManager: layerManagerRef.current,
  };

  return (
    <LayerManagerContext.Provider value={value}>
      {children}
    </LayerManagerContext.Provider>
  );
};
