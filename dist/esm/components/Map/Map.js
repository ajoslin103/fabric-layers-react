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
import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { Map as CoreMap } from 'fabric-layers';
import { MapContext } from '../../context/MapContext';
var Map = forwardRef(function (_a, ref) {
    var _b = _a.width, width = _b === void 0 ? '100%' : _b, _c = _a.height, height = _c === void 0 ? '100%' : _c, _d = _a.className, className = _d === void 0 ? '' : _d, _e = _a.style, style = _e === void 0 ? {} : _e, children = _a.children, onReady = _a.onReady, modes = _a.modes, defaultMode = _a.defaultMode;
    var mapRef = useRef(null);
    var containerRef = useRef(null);
    // Initialize map
    useEffect(function () {
        if (!containerRef.current)
            return;
        var map = new CoreMap(containerRef.current, {
            width: typeof width === 'number' ? width : undefined,
            height: typeof height === 'number' ? height : undefined,
        });
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
                mapRef.current.dispose();
                mapRef.current = null;
            }
        };
    }, [width, height, modes, defaultMode, onReady]);
    // Expose map methods via ref
    useImperativeHandle(ref, function () { return mapRef.current; }, []);
    return (_jsx("div", { ref: containerRef, className: "fabric-map ".concat(className), style: __assign({ width: width, height: height, position: 'relative', overflow: 'hidden' }, style), children: _jsx(MapContext.Provider, { value: { map: mapRef.current }, children: children }) }));
});
Map.displayName = 'Map';
export { Map };
export default Map;
