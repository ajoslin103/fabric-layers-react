import React from 'react';
import { LayerManagerContextType } from '../types';
export declare const LayerManagerContext: React.Context<LayerManagerContextType>;
export declare const useLayerManager: () => LayerManagerContextType;
export declare const LayerManagerProvider: React.FC<{
    children: React.ReactNode;
}>;
