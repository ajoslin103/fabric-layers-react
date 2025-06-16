export * from './LayerTypes';
export * from './PaintMeasurementTypes';

export interface Point {
  x: number;
  y: number;
}

export interface StyleProps {
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  opacity?: number;
  [key: string]: any;
}