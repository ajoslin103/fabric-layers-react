import { fabric } from 'fabric';
import { LayerManager } from 'fabric-layers';

export interface FabricLayersReactProps {
  width?: number | string;
  height?: number | string;
  className?: string;
  style?: React.CSSProperties;
  onReady?: (canvas: fabric.Canvas, layerManager: LayerManager) => void;
  canvasOptions?: fabric.ICanvasOptions;
  children?: React.ReactNode;
}

export interface LayerManagerContextType {
  canvas: fabric.Canvas | null;
  layerManager: LayerManager | null;
}
