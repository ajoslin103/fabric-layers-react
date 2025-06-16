"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Point = void 0;
var react_1 = require("react");
var fabric_layers_1 = require("fabric-layers");
var MapContext_1 = require("../../context/MapContext");
var Point = (0, react_1.forwardRef)(function (_a, ref) {
    var x = _a.x, y = _a.y, _b = _a.radius, radius = _b === void 0 ? 5 : _b, _c = _a.fill, fill = _c === void 0 ? '#ff0000' : _c, _d = _a.stroke, stroke = _d === void 0 ? '#000000' : _d, _e = _a.strokeWidth, strokeWidth = _e === void 0 ? 1 : _e, _f = _a.opacity, opacity = _f === void 0 ? 1 : _f, _g = _a.visible, visible = _g === void 0 ? true : _g, onSelect = _a.onSelect, onDeselect = _a.onDeselect, onClick = _a.onClick, onMouseEnter = _a.onMouseEnter, onMouseLeave = _a.onMouseLeave;
    var pointRef = (0, react_1.useRef)(null);
    var map = (0, MapContext_1.useMap)().map;
    // Initialize point
    (0, react_1.useEffect)(function () {
        if (!map)
            return;
        var point = new fabric_layers_1.Point({
            x: x,
            y: y,
            radius: radius,
            fill: fill,
            stroke: stroke,
            strokeWidth: strokeWidth,
            opacity: opacity,
            visible: visible,
        });
        // Add event listeners
        if (onSelect)
            point.on('selected', function () { return onSelect(point); });
        if (onDeselect)
            point.on('deselected', function () { return onDeselect(point); });
        if (onClick)
            point.on('click', function () { return onClick(point); });
        if (onMouseEnter)
            point.on('mouseenter', function () { return onMouseEnter(point); });
        if (onMouseLeave)
            point.on('mouseleave', function () { return onMouseLeave(point); });
        map.addPoint(point);
        pointRef.current = point;
        return function () {
            if (pointRef.current) {
                // Remove event listeners
                point.off();
                map.removePoint(pointRef.current);
                pointRef.current = null;
            }
        };
    }, [map]);
    // Update point properties when they change
    (0, react_1.useEffect)(function () {
        if (!pointRef.current)
            return;
        pointRef.current.setOptions({
            x: x,
            y: y,
            radius: radius,
            fill: fill,
            stroke: stroke,
            strokeWidth: strokeWidth,
            opacity: opacity,
            visible: visible,
        });
    }, [x, y, radius, fill, stroke, strokeWidth, opacity, visible]);
    // Expose point methods via ref
    (0, react_1.useImperativeHandle)(ref, function () { return pointRef.current; }, []);
    return null;
});
exports.Point = Point;
Point.displayName = 'Point';
exports.default = Point;
