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

export interface BaseLayerProps {
  style?: StyleProps;
  onSelect?: (event: any) => void;
  [key: string]: any;
}

export interface VectorLayerProps extends BaseLayerProps {
  position?: Point;
  points?: Point[];
  radius?: number;
  width?: number;
  height?: number;
}

export interface IconProps {
  url: string;
  width?: number;
  height?: number;
  anchor?: Point;
  [key: string]: any;
}

export interface MarkerProps extends BaseLayerProps {
  position: Point;
  icon?: IconProps;
  tooltip?: string;
  onClick?: (event: any) => void;
  onDragEnd?: (event: any) => void;
}

export interface MarkerGroupProps extends BaseLayerProps {
  markers: MarkerProps[];
}

export interface GroupProps extends BaseLayerProps {
  layers: BaseLayerProps[];
}

export interface ConnectorProps extends BaseLayerProps {
  start: Point;
  end: Point;
}

export interface TooltipProps {
  content: string;
  position: Point;
  style?: StyleProps;
  [key: string]: any;
}

// Re-export to maintain backwards compatibility
export type * from './LayerTypes';