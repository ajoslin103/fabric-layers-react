import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useRef, useEffect } from 'react';
export var LayerManagerContext = createContext({
    canvas: null,
    layerManager: null,
});
export var useLayerManager = function () {
    var context = useContext(LayerManagerContext);
    if (!context) {
        throw new Error('useLayerManager must be used within a LayerManagerProvider');
    }
    return context;
};
export var LayerManagerProvider = function (_a) {
    var children = _a.children;
    var canvasRef = useRef(null);
    var layerManagerRef = useRef(null);
    useEffect(function () {
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
    return (_jsx(LayerManagerContext.Provider, { value: value, children: children }));
};
