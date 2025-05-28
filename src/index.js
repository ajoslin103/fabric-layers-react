/**
 * fabric-layers-react
 * A fabric.js coordinate-plane (grid) & layers library for React
 */

import fabric from 'fabric-pure-browser';
import { version } from '../package.json';
import CanvasLayer from './layer/CanvasLayer';
import Grid from './grid/Grid';
import { Map } from './map/Map';

// Log version information in development only
if (process.env.NODE_ENV !== 'production') {
  console.log('fabric-layers-react', version);
  console.log('fabric.js', fabric.version);
}

// Export version
export { version };

// Core functionality
export * from './core/index';

// Geometry utilities
export * from './geometry/index';

// Grid system
export * from './grid/index';

// Layer system
export * from './layer/index';

// Canvas utilities
export * from './paint/index';

// Re-export with better names for the new library purpose
export { CanvasLayer };
export { Grid as GridSystem };
export { Map as CoordinatePlane };

// For backwards compatibility, but these should be considered deprecated
export * from './map/index';
export * from './floorplan/index';
