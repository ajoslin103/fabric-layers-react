// Type definitions for fabric-layers-react
// Requires TypeScript >= 4.0

import * as fabric from 'fabric-pure-browser';
import * as React from 'react';

declare module 'fabric-layers-react' {
  /**
   * Library version
   */
  export const version: string;

  /**
   * Core Components and Constants
   */
  export interface Point {
    x: number;
    y: number;
  }

  export function point(x: number, y: number): Point;

  export class Base {
    constructor(options?: Record<string, any>);
    on(eventName: string, handler: Function): void;
    off(eventName: string, handler?: Function): void;
    fire(eventName: string, data?: any): void;
  }

  export enum Modes {
    SELECT = 'SELECT',
    GRAB = 'GRAB',
    MEASURE = 'MEASURE',
    DRAW = 'DRAW'
  }

  /**
   * Grid System
   */
  export interface GridOptions {
    color?: string;
    opacity?: number;
    axisColor?: string;
    spacing?: number;
    showLabels?: boolean;
    visible?: boolean;
  }

  export class Grid extends Base {
    constructor(canvas: HTMLCanvasElement, options?: GridOptions);
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    update(options: Partial<GridOptions>): Grid;
    draw(): Grid;
    render(): Grid;
  }

  export class GridManager extends Base {
    constructor(options?: {
      coordinatePlane?: CoordinatePlane;
      canvas?: HTMLCanvasElement;
      visible?: boolean;
      spacing?: number;
      color?: string;
      opacity?: number;
      axisColor?: string;
      showLabels?: boolean;
    });
    setVisible(visible: boolean): GridManager;
    setSpacing(spacing: number): GridManager;
    setColor(color: string): GridManager;
    setOpacity(opacity: number): GridManager;
    setShowLabels(show: boolean): GridManager;
    setCanvas(canvas: HTMLCanvasElement): GridManager;
    setCoordinatePlane(coordinatePlane: CoordinatePlane): GridManager;
    redraw(): GridManager;
    getGrid(): Grid;
    getSettings(): {
      visible: boolean;
      spacing: number;
      color: string;
      opacity: number;
      axisColor: string;
      showLabels: boolean;
    };
  }

  /**
   * Layer System
   */
  export interface LayerOptions {
    label?: string;
    draggable?: boolean;
    zIndex?: number;
    opacity?: number;
    keepOnZoom?: boolean;
    clickable?: boolean;
    hoverCursor?: string;
    moveCursor?: string;
    id?: string;
    class?: string;
  }

  export class Layer extends Base {
    constructor(options?: LayerOptions);
    label: string | null;
    draggable: boolean;
    zIndex: number;
    opacity: number;
    keepOnZoom: boolean;
    clickable: boolean;
    hoverCursor: string;
    moveCursor: string;
    id: string;
    class: string;
    style: Record<string, any>;
    setDraggable(draggable: boolean): Layer;
    setOpacity(opacity: number): Layer;
    setZIndex(zIndex: number): Layer;
    setVisible(visible: boolean): Layer;
  }

  export class CanvasLayer extends Layer {
    constructor(options?: LayerOptions);
    canvasRef: React.RefObject<HTMLCanvasElement>;
    ctx: CanvasRenderingContext2D | null;
    initCanvas(): void;
    clearCanvas(): void;
    resizeCanvas(): void;
    render(): React.ReactElement;
  }

  export class LayerManager extends Base {
    constructor(options?: {
      coordinatePlane?: CoordinatePlane;
    });
    layers: Layer[];
    layersMap: Map<string, Layer>;
    addLayer(layer: Layer, render?: boolean): LayerManager;
    removeLayer(layer: Layer | string, render?: boolean): LayerManager;
    getLayer(id: string): Layer | null;
    sortLayers(): LayerManager;
    showAllLayers(render?: boolean): LayerManager;
    hideAllLayers(render?: boolean): LayerManager;
    setCoordinatePlane(coordinatePlane: CoordinatePlane): LayerManager;
  }

  /**
   * Coordinate Plane (formerly Map)
   */
  export interface CoordinatePlaneOptions {
    center?: Point;
    zoom?: number;
    minZoom?: number;
    maxZoom?: number;
    gridEnabled?: boolean;
    zoomEnabled?: boolean;
    selectEnabled?: boolean;
    mode?: Modes;
  }

  export class CoordinatePlane extends Base {
    constructor(container: HTMLElement, options?: CoordinatePlaneOptions);
    container: HTMLElement;
    canvas: fabric.Canvas;
    gridCanvas: HTMLCanvasElement;
    grid: Grid;
    center: Point;
    zoom: number;
    minZoom: number;
    maxZoom: number;
    gridEnabled: boolean;
    zoomEnabled: boolean;
    selectEnabled: boolean;
    mode: Modes;
    setCenter(point: Point): CoordinatePlane;
    setZoom(zoom: number): CoordinatePlane;
    addLayer(layer: Layer): CoordinatePlane;
    removeLayer(layer: Layer): CoordinatePlane;
    getPointer(event: any): { x: number; y: number };
    toMap(point: Point): Point;
    toScreen(point: Point): Point;
  }

  /**
   * Image Handling
   */
  export interface ImageLayerOptions extends LayerOptions {
    url: string;
    width?: number;
    height?: number;
    position?: Point;
    keepRatio?: boolean;
  }

  export class ImageLayer extends Layer {
    constructor(options: ImageLayerOptions);
    url: string;
    width: number;
    height: number;
    position: Point;
    keepRatio: boolean;
    shape: fabric.Object | null;
    group: fabric.Group | null;
    load(): ImageLayer;
    onLoad(shape: fabric.Object): void;
    bindEvents(): void;
    getBounds(): { width: number; height: number };
  }

  export function imageLayer(options: ImageLayerOptions): ImageLayer;
}
