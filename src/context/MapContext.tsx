import React, { createContext, useContext } from 'react';
import type { MapContextType } from '../types';

export const MapContext = createContext<MapContextType>({
  map: null,
});

export const useMap = () => {
  const context = useContext(MapContext);
  if (!context) {
    throw new Error('useMap must be used within a MapProvider');
  }
  return context;
};