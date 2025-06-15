declare module 'fabric-layers' {
  import { fabric } from 'fabric';

  export interface LayerOptions {
    id?: string;
    name?: string;
    visible?: boolean;
    selectable?: boolean;
    evented?: boolean;
    hoverCursor?: string;
    [key: string]: any;
  }

  export class LayerManager {
    constructor(canvas: fabric.Canvas, options?: any);
    
    // Layer management
    createLayer(options?: LayerOptions): any;
    getLayer(id: string): any;
    getLayers(): any[];
    removeLayer(id: string): boolean;
    setActiveLayer(id: string): boolean;
    getActiveLayer(): any;
    moveLayer(id: string, newIndex: number): boolean;
    
    // Layer visibility
    showLayer(id: string): void;
    hideLayer(id: string): void;
    toggleLayerVisibility(id: string): void;
    
    // Selection
    getActiveObjects(): fabric.Object[];
    getActiveObject(): fabric.Object | null;
    
    // Events
    on(event: string, handler: (...args: any[]) => void): void;
    off(event: string, handler: (...args: any[]) => void): void;
    
    // Rendering
    render(): void;
    
    // Cleanup
    dispose(): void;
  }
}
