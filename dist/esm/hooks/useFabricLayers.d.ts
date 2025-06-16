import { LayerManager } from 'fabric-layers';
type MapObject = {
    id?: string | number;
    type: string;
    [key: string]: any;
};
export interface LayerCallbacks {
    onObjectAdded?: (object: MapObject) => void;
    onObjectRemoved?: (object: MapObject) => void;
    onSelectionCreated?: (options: {
        selected: MapObject[];
        e: Event;
    }) => void;
    onSelectionCleared?: (options: {
        deselected: MapObject[];
        e: Event;
    }) => void;
}
export declare const useFabricLayers: () => {
    canvas: import("fabric").fabric.Canvas | null;
    layerManager: LayerManager | null;
    onObjectAdded: (callback: LayerCallbacks["onObjectAdded"]) => void;
    onObjectRemoved: (callback: LayerCallbacks["onObjectRemoved"]) => void;
    onSelectionCreated: (callback: LayerCallbacks["onSelectionCreated"]) => void;
    onSelectionCleared: (callback: LayerCallbacks["onSelectionCleared"]) => void;
};
export {};
