/**
 * fabric-layers-react
 * A fabric.js coordinate-plane (grid) & layers library for React
 */

import fabric from 'fabric-pure-browser';
import { version } from '../package.json';
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

// Named exports for better clarity with the new library purpose
export { Map as CoordinatePlane } from './map/Map';
// Re-export Grid with a more descriptive name
import Grid from './grid/Grid';
export { Grid as GridSystem };

// For backwards compatibility, but these should be considered deprecated
// These will be removed in a future version
export * from './map/index';
export * from './floorplan/index';
