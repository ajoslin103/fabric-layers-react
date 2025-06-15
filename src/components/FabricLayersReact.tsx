import React, { useEffect, useRef, useCallback } from 'react';
import type { fabric } from 'fabric';
import { LayerManager } from 'fabric-layers';
import { LayerManagerProvider, useLayerManager } from '../context/LayerManagerContext';
import { FabricLayersReactProps } from '../types';

const FabricLayersComponent: React.FC<FabricLayersReactProps> = ({
  width = '100%',
  height = '100%',
  className = '',
  style = {},
  onReady,
  canvasOptions = {},
  children,
}) => {
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const { canvas: contextCanvas, layerManager: contextLayerManager } = useLayerManager();
  const canvasRef = useRef<fabric.Canvas | null>(contextCanvas);
  const layerManagerRef = useRef<LayerManager | null>(contextLayerManager);

  const initCanvas = useCallback(() => {
    if (canvasContainerRef.current && !canvasRef.current) {
      // Create canvas
      const canvas = new fabric.Canvas(canvasContainerRef.current.querySelector('canvas') || undefined, {
        width: typeof width === 'number' ? width : undefined,
        height: typeof height === 'number' ? height : undefined,
        ...canvasOptions,
      });

      // Initialize layer manager
      const layerManager = new LayerManager(canvas, {
        boxSelection: true,
      });

      canvasRef.current = canvas;
      layerManagerRef.current = layerManager;

      // Call onReady callback if provided
      if (onReady) {
        onReady(canvas, layerManager);
      }

      // Handle window resize
      const handleResize = () => {
        if (canvasContainerRef.current && canvas) {
          const container = canvasContainerRef.current;
          canvas.setDimensions({
            width: container.clientWidth,
            height: container.clientHeight,
          });
          canvas.renderAll();
        }
      };

      window.addEventListener('resize', handleResize);
      handleResize();

      return () => {
        window.removeEventListener('resize', handleResize);
        layerManager.dispose();
        canvas.dispose();
      };
    }
  }, [width, height, canvasOptions, onReady]);

  useEffect(() => {
    const cleanup = initCanvas();
    return () => {
      if (cleanup) cleanup();
    };
  }, [initCanvas]);

  return (
    <div
      ref={canvasContainerRef}
      className={`fabric-layers-react ${className}`}
      style={{
        width,
        height,
        position: 'relative',
        ...style,
      }}
    >
      <canvas />
      {children}
    </div>
  );
};

const FabricLayersReact: React.FC<FabricLayersReactProps> = (props) => {
  return (
    <LayerManagerProvider>
      <FabricLayersComponent {...props} />
    </LayerManagerProvider>
  );
};

export { FabricLayersReact };
export default FabricLayersReact;
