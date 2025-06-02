/**
 * Measurement module exports
 */

// Import core measurement components from fabric-layers
import { 
  Measurement as CoreMeasurement, 
  Measurer as CoreMeasurer 
} from 'fabric-layers';

// Re-export React-specific measurement components
export { default as Measurement } from './Measurement';

// Re-export core components for backward compatibility
export { CoreMeasurer as Measurer };
