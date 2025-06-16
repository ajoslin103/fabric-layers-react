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
exports.useFabricLayers = void 0;
var react_1 = require("react");
var LayerManagerContext_1 = require("../context/LayerManagerContext");
var useFabricLayers = function () {
    var _a = (0, LayerManagerContext_1.useLayerManager)(), canvas = _a.canvas, layerManager = _a.layerManager;
    var callbacks = (0, react_1.useRef)({});
    // Type guard to check if the object is a FabricObject
    var isFabricObject = function (obj) {
        if (!obj || typeof obj !== 'object' || obj === null)
            return false;
        var fabricObj = obj;
        return ('type' in fabricObj &&
            typeof fabricObj.type === 'string' &&
            'toObject' in fabricObj &&
            typeof fabricObj.toObject === 'function');
    };
    var onObjectAdded = (0, react_1.useCallback)(function (callback) {
        callbacks.current.onObjectAdded = callback;
    }, []);
    var onObjectRemoved = (0, react_1.useCallback)(function (callback) {
        callbacks.current.onObjectRemoved = callback;
    }, []);
    var onSelectionCreated = (0, react_1.useCallback)(function (callback) {
        callbacks.current.onSelectionCreated = callback;
    }, []);
    var onSelectionCleared = (0, react_1.useCallback)(function (callback) {
        callbacks.current.onSelectionCleared = callback;
    }, []);
    (0, react_1.useEffect)(function () {
        if (!layerManager || !canvas)
            return;
        var createMapObject = function (obj) {
            var _a;
            if (!obj || typeof obj !== 'object')
                return null;
            var target = obj;
            var toObject = function (keys) {
                if (typeof target.toObject === 'function') {
                    try {
                        return target.toObject(keys);
                    }
                    catch (e) {
                        console.warn('Failed to call toObject on fabric object', e);
                    }
                }
                return {};
            };
            return __assign({ id: target.name || ((_a = target.data) === null || _a === void 0 ? void 0 : _a.id) || target.id, type: target.type || 'unknown' }, toObject(['data', 'name', 'type', 'id']));
        };
        var handleObjectAdded = function (e) {
            if (callbacks.current.onObjectAdded && e.target) {
                var mapObj = createMapObject(e.target);
                if (mapObj) {
                    callbacks.current.onObjectAdded(mapObj);
                }
            }
        };
        var handleObjectRemoved = function (e) {
            if (callbacks.current.onObjectRemoved && e.target) {
                var mapObj = createMapObject(e.target);
                if (mapObj) {
                    callbacks.current.onObjectRemoved(mapObj);
                }
            }
        };
        var handleSelectionCreated = function (e) {
            if (callbacks.current.onSelectionCreated && canvas) {
                var selected = canvas.getActiveObjects()
                    .filter(function (obj) { return isFabricObject(obj); })
                    .map(createMapObject)
                    .filter(function (obj) { return obj !== null; });
                callbacks.current.onSelectionCreated({
                    selected: selected,
                    e: e.e,
                });
            }
        };
        var handleSelectionCleared = function (e) {
            if (callbacks.current.onSelectionCleared) {
                var selectedItems = Array.isArray(e.selected) ? e.selected : [];
                var deselected = selectedItems
                    .filter(function (obj) { return isFabricObject(obj); })
                    .map(createMapObject)
                    .filter(function (obj) { return obj !== null; });
                callbacks.current.onSelectionCleared({
                    deselected: deselected,
                    e: e.e,
                });
            }
        };
        canvas.on('object:added', handleObjectAdded);
        canvas.on('object:removed', handleObjectRemoved);
        canvas.on('selection:created', handleSelectionCreated);
        canvas.on('selection:cleared', handleSelectionCleared);
        return function () {
            canvas.off('object:added', handleObjectAdded);
            canvas.off('object:removed', handleObjectRemoved);
            canvas.off('selection:created', handleSelectionCreated);
            canvas.off('selection:cleared', handleSelectionCleared);
        };
    }, [canvas, layerManager]);
    return {
        canvas: canvas,
        layerManager: layerManager,
        onObjectAdded: onObjectAdded,
        onObjectRemoved: onObjectRemoved,
        onSelectionCreated: onSelectionCreated,
        onSelectionCleared: onSelectionCleared,
    };
};
exports.useFabricLayers = useFabricLayers;
