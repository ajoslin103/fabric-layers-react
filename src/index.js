/**
 * fabric-layers-react
 * A fabric.js coordinate-plane (grid) & layers library for React
 */

import fabric from 'fabric-pure-browser';
import { version } from '../package.json';
import Grid from './grid/Grid';

// Log version information in development only
if (process.env.NODE_ENV !== 'production') {
  console.log('fabric-layers-react', version);
  console.log('fabric.js', fabric.version);
}

/**
 * Library Version
 */
export { version };

/**
 * Core Components and Constants
 */
export * from './core/index';

/**
 * Geometry Utilities
 */
export * from './geometry/index';

/**
 * Grid System
 * @deprecated Use GridSystem instead of Grid for new projects
 */
export * from './grid/index';
export { Grid as GridSystem };

/**
 * Layer System
 */
export * from './layer/index';

/**
 * Canvas Utilities
 */
export * from './paint/index';

/**
 * Coordinate Plane (formerly Map)
 * @deprecated Use CoordinatePlane instead of Map for new projects
 */
export { Map as CoordinatePlane } from './map/Map';

/**
 * Measurement Tools
 */
export * from './measurement/index';

/**
 * Legacy Components
 * @deprecated These will be removed in a future version
 */
export * from './map/index';
export * from './floorplan/index';
