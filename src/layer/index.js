/**
 * Layer system exports
 */

// Import core layer components from fabric-layers
import { 
  Layer as CoreLayer, 
  CanvasLayer as CoreCanvasLayer, 
  Connector as CoreConnector, 
  Group as CoreGroup, 
  LayerManager as CoreLayerManager 
} from 'fabric-layers';

// Re-export React-specific layer components
export { default as Layer } from './Layer';
export { default as CanvasLayer } from './CanvasLayer';
export { default as Connector } from './Connector';
export { default as Group } from './Group';
export { default as Tooltip } from './Tooltip';

// Re-export core components for backward compatibility
export { CoreLayerManager as LayerManager };

// Marker components
export * from './marker/index';

// Vector components
export * from './vector/index';
