"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Map = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var fabric_layers_1 = require("fabric-layers");
var LayerManagerContext_1 = require("../../context/LayerManagerContext");
var Map = (0, react_1.forwardRef)(function (_a, ref) {
    var _b = _a.width, width = _b === void 0 ? '100%' : _b, _c = _a.height, height = _c === void 0 ? '100%' : _c, _d = _a.className, className = _d === void 0 ? '' : _d, _e = _a.style, style = _e === void 0 ? {} : _e, children = _a.children, onReady = _a.onReady, modes = _a.modes, defaultMode = _a.defaultMode;
    var mapRef = (0, react_1.useRef)(null);
    var layerManager = (0, LayerManagerContext_1.useLayerManager)().layerManager;
    var containerRef = (0, react_1.useRef)(null);
    // Initialize map
    (0, react_1.useEffect)(function () {
        if (!layerManager || !containerRef.current)
            return;
        var map = new fabric_layers_1.Map(containerRef.current, {
            width: typeof width === 'number' ? width : undefined,
            height: typeof height === 'number' ? height : undefined,
        });
        // Add map to layer manager
        layerManager.addMap(map);
        mapRef.current = map;
        // Set modes if provided
        if (modes) {
            Object.entries(modes).forEach(function (_a) {
                var name = _a[0], mode = _a[1];
                map.registerMode(name, mode);
            });
        }
        // Set default mode if provided
        if (defaultMode) {
            map.setMode(defaultMode);
        }
        // Call onReady callback
        if (onReady) {
            onReady(map);
        }
        return function () {
            if (mapRef.current) {
                layerManager.removeMap(mapRef.current);
                mapRef.current.dispose();
                mapRef.current = null;
            }
        };
    }, [layerManager, width, height, modes, defaultMode, onReady]);
    // Expose map methods via ref
    (0, react_1.useImperativeHandle)(ref, function () { return mapRef.current; }, []);
    return ((0, jsx_runtime_1.jsx)("div", { ref: containerRef, className: "fabric-map ".concat(className), style: __assign({ width: width, height: height, position: 'relative', overflow: 'hidden' }, style), children: children }));
});
exports.Map = Map;
Map.displayName = 'Map';
exports.default = Map;
