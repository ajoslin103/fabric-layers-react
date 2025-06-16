import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { Point as CorePoint } from 'fabric-layers';
import { useLayerManager } from '../../context/LayerManagerContext';
var Point = forwardRef(function (_a, ref) {
    var x = _a.x, y = _a.y, _b = _a.radius, radius = _b === void 0 ? 5 : _b, _c = _a.fill, fill = _c === void 0 ? '#ff0000' : _c, _d = _a.stroke, stroke = _d === void 0 ? '#000000' : _d, _e = _a.strokeWidth, strokeWidth = _e === void 0 ? 1 : _e, _f = _a.opacity, opacity = _f === void 0 ? 1 : _f, _g = _a.visible, visible = _g === void 0 ? true : _g, mapId = _a.mapId, onSelect = _a.onSelect, onDeselect = _a.onDeselect, onClick = _a.onClick, onMouseEnter = _a.onMouseEnter, onMouseLeave = _a.onMouseLeave;
    var pointRef = useRef(null);
    var layerManager = useLayerManager().layerManager;
    // Initialize point
    useEffect(function () {
        if (!layerManager)
            return;
        var map = mapId ? layerManager.getMap(mapId) : layerManager.getActiveMap();
        if (!map)
            return;
        var point = new CorePoint({
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
    }, [layerManager, mapId]);
    // Update point properties when they change
    useEffect(function () {
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
    useImperativeHandle(ref, function () { return pointRef.current; }, []);
    return null;
});
Point.displayName = 'Point';
export { Point };
export default Point;
