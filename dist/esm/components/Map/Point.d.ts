import React from 'react';
import { Point as CorePoint } from 'fabric-layers';
export interface PointProps {
    x: number;
    y: number;
    radius?: number;
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
    opacity?: number;
    visible?: boolean;
    onSelect?: (point: CorePoint) => void;
    onDeselect?: (point: CorePoint) => void;
    onClick?: (point: CorePoint) => void;
    onMouseEnter?: (point: CorePoint) => void;
    onMouseLeave?: (point: CorePoint) => void;
}
declare const Point: React.ForwardRefExoticComponent<PointProps & React.RefAttributes<CorePoint>>;
export { Point };
export default Point;
