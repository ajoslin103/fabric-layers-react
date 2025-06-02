/**
 * Grid system exports
 */

// Re-export core grid components from fabric-layers
import { Grid as CoreGrid, Axis as CoreAxis, gridStyle as coreGridStyle, GridManager as CoreGridManager } from 'fabric-layers';

// Export React-specific grid components
export { default as Grid } from './Grid';

// Re-export core components for backward compatibility
export { CoreAxis as Axis, coreGridStyle as gridStyle, CoreGridManager as GridManager };
