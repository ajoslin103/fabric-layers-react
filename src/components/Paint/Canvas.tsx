import React, { useEffect, useRef } from 'react';
import { Canvas as FabricCanvas } from 'fabric-layers/paint';
import type { CanvasProps } from '../../types';

export const Canvas: React.FC<CanvasProps> = ({
  width,
  height,
  backgroundColor,
  onModified,
  ...options
}) => {
  const canvasRef = useRef<FabricCanvas | null>(null);

  useEffect(() => {
    canvasRef.current = new FabricCanvas({
      width,
      height,
      backgroundColor,
      ...options
    });

    if (onModified) {
      canvasRef.current.on('modified', onModified);
    }

    return () => {
      if (canvasRef.current) {
        if (onModified) {
          canvasRef.current.off('modified', onModified);
        }
        canvasRef.current.destroy();
        canvasRef.current = null;
      }
    };
  }, [width, height, backgroundColor]);

  return null; // Renders directly on parent canvas
};

export default Canvas;