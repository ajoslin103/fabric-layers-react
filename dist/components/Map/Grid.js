"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Grid = void 0;
var react_1 = require("react");
var fabric_layers_1 = require("fabric-layers");
var LayerManagerContext_1 = require("../../context/LayerManagerContext");
var Grid = (0, react_1.forwardRef)(function (_a, ref) {
    var _b = _a.size, size = _b === void 0 ? 20 : _b, _c = _a.color, color = _c === void 0 ? '#cccccc' : _c, _d = _a.dashArray, dashArray = _d === void 0 ? [1, 2] : _d, _e = _a.opacity, opacity = _e === void 0 ? 0.5 : _e, _f = _a.visible, visible = _f === void 0 ? true : _f, mapId = _a.mapId;
    var gridRef = (0, react_1.useRef)(null);
    var layerManager = (0, LayerManagerContext_1.useLayerManager)().layerManager;
    // Initialize grid
    (0, react_1.useEffect)(function () {
        if (!layerManager)
            return;
        var map = mapId ? layerManager.getMap(mapId) : layerManager.getActiveMap();
        if (!map)
            return;
        var grid = new fabric_layers_1.Grid({
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
    (0, react_1.useEffect)(function () {
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
    (0, react_1.useImperativeHandle)(ref, function () { return gridRef.current; }, []);
    return null;
});
exports.Grid = Grid;
Grid.displayName = 'Grid';
exports.default = Grid;
