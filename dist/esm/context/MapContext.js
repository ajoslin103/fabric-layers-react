import { createContext, useContext } from 'react';
export var MapContext = createContext({
    map: null,
});
export var useMap = function () {
    var context = useContext(MapContext);
    if (!context) {
        throw new Error('useMap must be used within a MapProvider');
    }
    return context;
};
