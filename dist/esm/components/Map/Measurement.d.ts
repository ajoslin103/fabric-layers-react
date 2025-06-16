import React from 'react';
import { Measurement as CoreMeasurement } from 'fabric-layers';
export interface MeasurementProps {
    startX: number;
    startY: number;
    endX: number;
    endY: number;
    unit?: string;
    lineColor?: string;
    lineWidth?: number;
    labelColor?: string;
    labelSize?: number;
    labelOffset?: number;
    showLabels?: boolean;
    precision?: number;
    onUpdate?: (measurement: CoreMeasurement) => void;
    onSelect?: (measurement: CoreMeasurement) => void;
    onDeselect?: (measurement: CoreMeasurement) => void;
}
declare const Measurement: React.ForwardRefExoticComponent<MeasurementProps & React.RefAttributes<CoreMeasurement>>;
export { Measurement };
export default Measurement;
