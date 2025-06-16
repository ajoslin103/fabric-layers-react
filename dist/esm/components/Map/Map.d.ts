import React from 'react';
import { Map as CoreMap } from 'fabric-layers';
export interface MapProps {
    width?: number | string;
    height?: number | string;
    className?: string;
    style?: React.CSSProperties;
    children?: React.ReactNode;
    onReady?: (map: CoreMap) => void;
    modes?: Record<string, any>;
    defaultMode?: string;
}
declare const Map: React.ForwardRefExoticComponent<MapProps & React.RefAttributes<CoreMap>>;
export { Map };
export default Map;
