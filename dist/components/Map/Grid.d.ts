import React from 'react';
import { Grid as CoreGrid } from 'fabric-layers';
export interface GridProps {
    size?: number;
    color?: string;
    dashArray?: number[];
    opacity?: number;
    visible?: boolean;
    mapId?: string;
}
declare const Grid: React.ForwardRefExoticComponent<GridProps & React.RefAttributes<CoreGrid>>;
export { Grid };
export default Grid;
