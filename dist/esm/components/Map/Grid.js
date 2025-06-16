import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { Grid as CoreGrid } from 'fabric-layers';
import { useLayerManager } from '../../context/LayerManagerContext';
var Grid = forwardRef(function (_a, ref) {
    var _b = _a.size, size = _b === void 0 ? 20 : _b, _c = _a.color, color = _c === void 0 ? '#cccccc' : _c, _d = _a.dashArray, dashArray = _d === void 0 ? [1, 2] : _d, _e = _a.opacity, opacity = _e === void 0 ? 0.5 : _e, _f = _a.visible, visible = _f === void 0 ? true : _f, mapId = _a.mapId;
    var gridRef = useRef(null);
    var layerManager = useLayerManager().layerManager;
    // Initialize grid
    useEffect(function () {
        if (!layerManager)
            return;
        var map = mapId ? layerManager.getMap(mapId) : layerManager.getActiveMap();
        if (!map)
            return;
        var grid = new CoreGrid({
            size: size,
            color: color,
            dashArray: dashArray,
            opacity: opacity,
            visible: visible,
        });
        map.addGrid(grid);
        gridRef.current = grid;
        return function () {
            if (gridRef.current) {
                map.removeGrid(gridRef.current);
                gridRef.current = null;
            }
        };
    }, [layerManager, mapId]);
    // Update grid properties when they change
    useEffect(function () {
        if (!gridRef.current)
            return;
        gridRef.current.setOptions({
            size: size,
            color: color,
            dashArray: dashArray,
            opacity: opacity,
            visible: visible,
        });
    }, [size, color, dashArray, opacity, visible]);
    // Expose grid methods via ref
    useImperativeHandle(ref, function () { return gridRef.current; }, []);
    return null;
});
Grid.displayName = 'Grid';
export { Grid };
export default Grid;
