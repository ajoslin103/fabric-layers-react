(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("@emotion/styled"), require("fabric-layers"), require("react"));
	else if(typeof define === 'function' && define.amd)
		define(["@emotion/styled", "fabric-layers", "react"], factory);
	else if(typeof exports === 'object')
		exports["FabricLayersReact"] = factory(require("@emotion/styled"), require("fabric-layers"), require("react"));
	else
		root["FabricLayersReact"] = factory(root["emotionStyled"], root["FabricLayers"], root["React"]);
})(this, (__WEBPACK_EXTERNAL_MODULE__emotion_styled__, __WEBPACK_EXTERNAL_MODULE_fabric_layers__, __WEBPACK_EXTERNAL_MODULE_react__) => {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/components/Map/Map.tsx":
/*!************************************!*\
  !*** ./src/components/Map/Map.tsx ***!
  \************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Map = void 0;
var react_1 = __importStar(__webpack_require__(/*! react */ "react"));
var fabric_layers_1 = __webpack_require__(/*! fabric-layers */ "fabric-layers");
var MapContext_1 = __webpack_require__(/*! ../../context/MapContext */ "./src/context/MapContext.tsx");
var Map = function (_a) {
    var _b = _a.width, width = _b === void 0 ? '100%' : _b, _c = _a.height, height = _c === void 0 ? '100%' : _c, _d = _a.initialMode, initialMode = _d === void 0 ? 'default' : _d, defaultMode = _a.defaultMode, onReady = _a.onReady, children = _a.children, onModeChange = _a.onModeChange;
    var containerRef = (0, react_1.useRef)(null);
    var _e = (0, react_1.useState)(null), map = _e[0], setMapInstance = _e[1];
    (0, react_1.useEffect)(function () {
        if (!containerRef.current)
            return;
        var mapInstance = new fabric_layers_1.Map(containerRef.current);
        setMapInstance(mapInstance);
        if (onReady) {
            onReady(mapInstance);
        }
        // Register default mode if needed
        var mode = defaultMode || initialMode;
        if (mode !== 'default') {
            mapInstance.registerMode(mode, {});
            mapInstance.setMode(mode);
        }
        return function () {
            if (mapInstance) {
                mapInstance.dispose();
            }
        };
    }, [initialMode, defaultMode, onReady]);
    (0, react_1.useEffect)(function () {
        if (!map || !onModeChange)
            return;
        var handleModeChange = function (mode) {
            onModeChange(mode);
        };
        map.registerEventListener('modeChange', handleModeChange);
        return function () {
            map.unregisterEventListener('modeChange', handleModeChange);
        };
    }, [map, onModeChange]);
    return (react_1.default.createElement(MapContext_1.MapContext.Provider, { value: { map: map, setMap: setMapInstance } },
        react_1.default.createElement("div", { ref: containerRef, style: { width: width, height: height } }, map && children)));
};
exports.Map = Map;
exports["default"] = exports.Map;


/***/ }),

/***/ "./src/components/Map/index.ts":
/*!*************************************!*\
  !*** ./src/components/Map/index.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Map = void 0;
var Map_1 = __webpack_require__(/*! ./Map */ "./src/components/Map/Map.tsx");
Object.defineProperty(exports, "Map", ({ enumerable: true, get: function () { return Map_1.Map; } }));


/***/ }),

/***/ "./src/components/demo/GridDemo.tsx":
/*!******************************************!*\
  !*** ./src/components/demo/GridDemo.tsx ***!
  \******************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GridDemo = void 0;
var react_1 = __importStar(__webpack_require__(/*! react */ "react"));
var Map_1 = __webpack_require__(/*! ../Map */ "./src/components/Map/index.ts");
var styled_1 = __importDefault(__webpack_require__(/*! @emotion/styled */ "@emotion/styled"));
var DemoContainer = styled_1.default.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  margin: 0;\n  padding: 20px;\n  font-family: Arial, sans-serif;\n"], ["\n  margin: 0;\n  padding: 20px;\n  font-family: Arial, sans-serif;\n"])));
var CanvasContainer = styled_1.default.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  border: 1px solid #ccc;\n  margin: 20px 0;\n  width: 800px;\n  height: 600px;\n  background: #f8f9fa;\n"], ["\n  border: 1px solid #ccc;\n  margin: 20px 0;\n  width: 800px;\n  height: 600px;\n  background: #f8f9fa;\n"])));
var Controls = styled_1.default.div(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  margin: 20px 0;\n  padding: 15px;\n  background: #f5f5f5;\n  border-radius: 4px;\n"], ["\n  margin: 20px 0;\n  padding: 15px;\n  background: #f5f5f5;\n  border-radius: 4px;\n"])));
var Button = styled_1.default.button(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  padding: 8px 16px;\n  margin-right: 10px;\n  cursor: pointer;\n"], ["\n  padding: 8px 16px;\n  margin-right: 10px;\n  cursor: pointer;\n"])));
var Label = styled_1.default.label(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  margin-right: 10px;\n"], ["\n  margin-right: 10px;\n"])));
var Input = styled_1.default.input(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n  width: 70px;\n"], ["\n  width: 70px;\n"])));
var MonospaceText = styled_1.default.span(templateObject_7 || (templateObject_7 = __makeTemplateObject(["\n  font-family: monospace;\n  margin-left: 20px;\n"], ["\n  font-family: monospace;\n  margin-left: 20px;\n"])));
var GridDemo = function () {
    var _a = (0, react_1.useState)({ x: 0, y: 0 }), coordinates = _a[0], setCoordinates = _a[1];
    var _b = (0, react_1.useState)(1), zoom = _b[0], setZoom = _b[1];
    var _c = (0, react_1.useState)(0.05), minZoom = _c[0], setMinZoom = _c[1];
    var _d = (0, react_1.useState)(20), maxZoom = _d[0], setMaxZoom = _d[1];
    var _e = (0, react_1.useState)(null), mapInstance = _e[0], setMapInstance = _e[1];
    var handleMapReady = (0, react_1.useCallback)(function (map) {
        setMapInstance(map);
        map.on('mouse:move', function (e) {
            if (e && e.pointer) {
                setCoordinates({
                    x: e.pointer.x,
                    y: e.pointer.y
                });
            }
        });
        map.on('mouse:out', function () {
            setCoordinates({ x: 0, y: 0 });
        });
        map.on('update', function () {
            setZoom(map.zoom || 1);
        });
        // Debug events
        map.on('mouse:down', function (e) {
            if (e && e.pointer) {
                console.log('mouse:down', e.pointer);
            }
        });
        map.on('mouse:up', function (e) {
            if (e && e.pointer) {
                console.log('mouse:up', e.pointer);
            }
        });
        map.on('mouse:dblclick', function (e) {
            if (e && e.pointer) {
                console.log('mouse:dblclick', e.pointer);
            }
        });
    }, []);
    var handleMinZoomChange = (0, react_1.useCallback)(function (e) {
        var value = parseFloat(e.target.value);
        if (!isNaN(value) && value > 0) {
            setMinZoom(value);
            if (mapInstance) {
                mapInstance.minZoom = value;
                if (mapInstance.zoom < value) {
                    mapInstance.setZoom(value);
                }
            }
        }
    }, [mapInstance]);
    var handleMaxZoomChange = (0, react_1.useCallback)(function (e) {
        var value = parseFloat(e.target.value);
        if (!isNaN(value) && value > minZoom) {
            setMaxZoom(value);
            if (mapInstance) {
                mapInstance.maxZoom = value;
                if (mapInstance.zoom > value) {
                    mapInstance.setZoom(value);
                }
            }
        }
    }, [mapInstance, minZoom]);
    var handleResetView = (0, react_1.useCallback)(function () {
        if (mapInstance && mapInstance.reset) {
            mapInstance.reset();
        }
    }, [mapInstance]);
    return (react_1.default.createElement(DemoContainer, null,
        react_1.default.createElement("h1", null, "fabric-layers Grid Demo"),
        react_1.default.createElement(Controls, null,
            react_1.default.createElement(Label, null,
                "Min Zoom:",
                react_1.default.createElement(Input, { type: "number", step: "0.01", value: minZoom, onChange: handleMinZoomChange })),
            react_1.default.createElement(Label, null,
                "Max Zoom:",
                react_1.default.createElement(Input, { type: "number", step: "0.01", value: maxZoom, onChange: handleMaxZoomChange })),
            react_1.default.createElement(Button, { onClick: handleResetView }, "Reset View"),
            react_1.default.createElement(MonospaceText, null,
                "X: ",
                coordinates.x.toFixed(1),
                ", Y: ",
                coordinates.y.toFixed(1)),
            react_1.default.createElement(MonospaceText, null,
                "Zoom: ",
                zoom.toFixed(2),
                "x")),
        react_1.default.createElement(CanvasContainer, null,
            react_1.default.createElement(Map_1.Map, { width: 800, height: 600, onReady: handleMapReady, defaultMode: "GRAB" }))));
};
exports.GridDemo = GridDemo;
exports["default"] = exports.GridDemo;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7;


/***/ }),

/***/ "./src/components/demo/index.ts":
/*!**************************************!*\
  !*** ./src/components/demo/index.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GridDemo = void 0;
var GridDemo_1 = __webpack_require__(/*! ./GridDemo */ "./src/components/demo/GridDemo.tsx");
Object.defineProperty(exports, "GridDemo", ({ enumerable: true, get: function () { return GridDemo_1.GridDemo; } }));


/***/ }),

/***/ "./src/context/MapContext.tsx":
/*!************************************!*\
  !*** ./src/context/MapContext.tsx ***!
  \************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.useMap = exports.MapContext = void 0;
var react_1 = __importStar(__webpack_require__(/*! react */ "react"));
exports.MapContext = (0, react_1.createContext)({
    map: null,
    setMap: function () { },
});
var useMap = function () {
    var context = react_1.default.useContext(exports.MapContext);
    if (!context) {
        throw new Error('useMap must be used within a MapProvider');
    }
    return context;
};
exports.useMap = useMap;


/***/ }),

/***/ "@emotion/styled":
/*!****************************************************************************************************************************!*\
  !*** external {"commonjs":"@emotion/styled","commonjs2":"@emotion/styled","amd":"@emotion/styled","root":"emotionStyled"} ***!
  \****************************************************************************************************************************/
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_MODULE__emotion_styled__;

/***/ }),

/***/ "fabric-layers":
/*!*********************************************************************************************************************!*\
  !*** external {"commonjs":"fabric-layers","commonjs2":"fabric-layers","amd":"fabric-layers","root":"FabricLayers"} ***!
  \*********************************************************************************************************************/
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_MODULE_fabric_layers__;

/***/ }),

/***/ "react":
/*!**************************************************************************************!*\
  !*** external {"commonjs":"react","commonjs2":"react","amd":"react","root":"React"} ***!
  \**************************************************************************************/
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_MODULE_react__;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;
/*!*********************!*\
  !*** ./src/demo.ts ***!
  \*********************/

Object.defineProperty(exports, "__esModule", ({ value: true }));
var Map_1 = __webpack_require__(/*! ./components/Map/Map */ "./src/components/Map/Map.tsx");
var demo_1 = __webpack_require__(/*! ./components/demo */ "./src/components/demo/index.ts");
exports["default"] = {
    Map: Map_1.Map,
    GridDemo: demo_1.GridDemo
};

})();

/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=demo.js.map