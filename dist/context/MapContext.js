"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useMap = exports.MapContext = void 0;
var react_1 = require("react");
exports.MapContext = (0, react_1.createContext)({
    map: null,
});
var useMap = function () {
    var context = (0, react_1.useContext)(exports.MapContext);
    if (!context) {
        throw new Error('useMap must be used within a MapProvider');
    }
    return context;
};
exports.useMap = useMap;
