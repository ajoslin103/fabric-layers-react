// Paint System Types
export interface CanvasProps {
  width: number;
  height: number;
  backgroundColor?: string;
  onModified?: (event: any) => void;
  [key: string]: any;
}

export interface ArrowProps {
  start: Point;
  end: Point;
  headSize?: number;
  style?: StyleProps;
  [key: string]: any;
}

export interface ArrowHeadProps {
  position: Point;
  angle: number;
  size?: number;
  style?: StyleProps;
  [key: string]: any;
}

export interface PaintManagerProps {
  mode: 'brush' | 'pencil' | 'eraser';
  color?: string;
  width?: number;
  onDrawStart?: (event: any) => void;
  onDrawEnd?: (event: any) => void;
  [key: string]: any;
}

// Measurement System Types
export interface MeasurementProps {
  start: Point;
  end: Point;
  unit?: string;
  precision?: number;
  style?: StyleProps;
  onUpdate?: (measurement: any) => void;
  [key: string]: any;
}

export interface MeasurerProps {
  mode?: 'distance' | 'area' | 'angle';
  unit?: string;
  precision?: number;
  onMeasureStart?: (event: any) => void;
  onMeasureEnd?: (event: any, measurement: any) => void;
  [key: string]: any;
}