"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Measurement = void 0;
var react_1 = require("react");
var fabric_layers_1 = require("fabric-layers");
var MapContext_1 = require("../../context/MapContext");
var Measurement = (0, react_1.forwardRef)(function (_a, ref) {
    var startX = _a.startX, startY = _a.startY, endX = _a.endX, endY = _a.endY, _b = _a.unit, unit = _b === void 0 ? 'px' : _b, _c = _a.lineColor, lineColor = _c === void 0 ? '#ff0000' : _c, _d = _a.lineWidth, lineWidth = _d === void 0 ? 2 : _d, _e = _a.labelColor, labelColor = _e === void 0 ? '#000000' : _e, _f = _a.labelSize, labelSize = _f === void 0 ? 12 : _f, _g = _a.labelOffset, labelOffset = _g === void 0 ? 10 : _g, _h = _a.showLabels, showLabels = _h === void 0 ? true : _h, _j = _a.precision, precision = _j === void 0 ? 2 : _j, onUpdate = _a.onUpdate, onSelect = _a.onSelect, onDeselect = _a.onDeselect;
    var measurementRef = (0, react_1.useRef)(null);
    var map = (0, MapContext_1.useMap)().map;
    // Initialize measurement
    (0, react_1.useEffect)(function () {
        if (!map)
            return;
        var measurement = new fabric_layers_1.Measurement({
            start: { x: startX, y: startY },
            end: { x: endX, y: endY },
            unit: unit,
            lineColor: lineColor,
            lineWidth: lineWidth,
            labelColor: labelColor,
            labelSize: labelSize,
            labelOffset: labelOffset,
            showLabels: showLabels,
            precision: precision,
        });
        // Add event listeners
        if (onUpdate)
            measurement.on('update', function () { return onUpdate(measurement); });
        if (onSelect)
            measurement.on('select', function () { return onSelect(measurement); });
        if (onDeselect)
            measurement.on('deselect', function () { return onDeselect(measurement); });
        map.addMeasurement(measurement);
        measurementRef.current = measurement;
        return function () {
            if (measurementRef.current) {
                // Remove event listeners
                measurement.off();
                map.removeMeasurement(measurementRef.current);
                measurementRef.current = null;
            }
        };
    }, [map]);
    // Update measurement properties when they change
    (0, react_1.useEffect)(function () {
        if (!measurementRef.current)
            return;
        measurementRef.current.setOptions({
            start: { x: startX, y: startY },
            end: { x: endX, y: endY },
            unit: unit,
            lineColor: lineColor,
            lineWidth: lineWidth,
            labelColor: labelColor,
            labelSize: labelSize,
            labelOffset: labelOffset,
            showLabels: showLabels,
            precision: precision,
        });
    }, [
        startX, startY, endX, endY, unit, lineColor, lineWidth,
        labelColor, labelSize, labelOffset, showLabels, precision
    ]);
    // Expose measurement methods via ref
    (0, react_1.useImperativeHandle)(ref, function () { return measurementRef.current; }, []);
    return null;
});
exports.Measurement = Measurement;
Measurement.displayName = 'Measurement';
exports.default = Measurement;
