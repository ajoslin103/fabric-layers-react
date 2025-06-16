declare module 'fabric-layers' {
  import { fabric } from 'fabric';
  
  export interface ObjectMethods {
    on(event: string, handler: (...args: any[]) => void): void;
    off(event?: string, handler?: (...args: any[]) => void): void;
    setOptions(options: any): void;
  }

  export interface Point2D {
    x: number;
    y: number;
  }

  export interface LayerOptions {
    id?: string;
    name?: string;
    visible?: boolean;
    selectable?: boolean;
    evented?: boolean;
    hoverCursor?: string;
    [key: string]: any;   
  }

  export interface GridOptions {
    size?: number;
    color?: string;
    opacity?: number;
    dashArray?: number[];
    visible?: boolean;
    [key: string]: any;
  }

  export interface MapOptions {
    width?: number;
    height?: number;
    [key: string]: any;
  }

  export interface MeasurementOptions {
    start?: Point2D;
    end?: Point2D;
    unit?: string;
    lineColor?: string;
    lineWidth?: number;
    labelColor?: string;
    labelSize?: number;
    labelOffset?: number;
    showLabels?: boolean;
    precision?: number;
    [key: string]: any;
  }

  export interface PointOptions {
    x: number;
    y: number;
    radius?: number;
    fill?: string;
    [key: string]: any;
  }

  export class LayerManager implements ObjectMethods {
    constructor(canvas: fabric.Canvas, options?: LayerOptions);
    addMap(map: FabricMap): void;
    removeMap(map: FabricMap): void;
    getMap(id: string): FabricMap | undefined;
    getActiveMap(): FabricMap | undefined;
    createLayer(options?: LayerOptions): any;
    getLayer(id: string): any;
    getLayers(): any[];
    removeLayer(id: string): boolean;
    setActiveLayer(id: string): boolean;
    getActiveLayer(): any;
    moveLayer(id: string, newIndex: number): boolean;
    showLayer(id: string): void;
    hideLayer(id: string): void;
    toggleLayerVisibility(id: string): void;
    getActiveObjects(): fabric.Object[];
    getActiveObject(): fabric.Object | null;
    on(event: string, handler: (...args: any[]) => void): void;
    off(event?: string, handler?: (...args: any[]) => void): void;
    setOptions(options: LayerOptions): void;
    render(): void;
    dispose(): void;
  }

  export class FabricMap implements ObjectMethods {
    constructor(container: HTMLElement, options?: MapOptions);
    registerMode(name: string, mode: any): void;
    setMode(mode: string): void;
    addGrid(grid: Grid): void;
    removeGrid(grid: Grid): void;
    addPoint(point: Point): void;
    removePoint(point: Point): void;
    addMeasurement(measurement: Measurement): void;
    removeMeasurement(measurement: Measurement): void;
    on(event: string, handler: (...args: any[]) => void): void;
    off(event?: string, handler?: (...args: any[]) => void): void;
    setOptions(options: MapOptions): void;
    dispose(): void;
  }

  export { FabricMap as Map };

  export class Grid implements ObjectMethods {
    constructor(options?: GridOptions);
    on(event: string, handler: (...args: any[]) => void): void;
    off(event?: string, handler?: (...args: any[]) => void): void;
    setOptions(options: GridOptions): void;
    dispose(): void;
  }

  export class Measurement implements ObjectMethods {
    constructor(options?: MeasurementOptions);
    on(event: string, handler: (...args: any[]) => void): void;
    off(event?: string, handler?: (...args: any[]) => void): void;
    setOptions(options: MeasurementOptions): void;
    dispose(): void;
  }

  export class Point implements ObjectMethods {
    constructor(options?: PointOptions);
    on(event: string, handler: (...args: any[]) => void): void;
    off(event?: string, handler?: (...args: any[]) => void): void;
    setOptions(options: PointOptions): void;
    dispose(): void;
  }
}