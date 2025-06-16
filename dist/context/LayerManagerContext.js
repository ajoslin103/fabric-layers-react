"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LayerManagerProvider = exports.useLayerManager = exports.LayerManagerContext = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
exports.LayerManagerContext = (0, react_1.createContext)({
    canvas: null,
    layerManager: null,
});
var useLayerManager = function () {
    var context = (0, react_1.useContext)(exports.LayerManagerContext);
    if (!context) {
        throw new Error('useLayerManager must be used within a LayerManagerProvider');
    }
    return context;
};
exports.useLayerManager = useLayerManager;
var LayerManagerProvider = function (_a) {
    var children = _a.children;
    var canvasRef = (0, react_1.useRef)(null);
    var layerManagerRef = (0, react_1.useRef)(null);
    (0, react_1.useEffect)(function () {
        return function () {
            // Cleanup
            if (canvasRef.current) {
                canvasRef.current.dispose();
            }
            if (layerManagerRef.current) {
                layerManagerRef.current.dispose();
            }
        };
    }, []);
    var value = {
        canvas: canvasRef.current,
        layerManager: layerManagerRef.current,
    };
    return ((0, jsx_runtime_1.jsx)(exports.LayerManagerContext.Provider, { value: value, children: children }));
};
exports.LayerManagerProvider = LayerManagerProvider;
