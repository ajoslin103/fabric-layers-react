# Fabric Layers React Demo

This demo application showcases the key features of the fabric-layers-react library, a fabric.js coordinate-plane (grid) & layers library for React.

## Features Demonstrated

1. **Basic Coordinate Plane Setup**
   - Simple initialization of a coordinate plane
   - Adding an image layer
   - Basic zoom and pan controls

2. **Advanced Layers Example**
   - Multiple layer types (image, rectangle, circle)
   - Layer management (add, remove, toggle visibility)
   - Layer properties and attributes

3. **Grid Customization Example**
   - Customizing grid appearance (color, opacity, spacing)
   - Axis and label styling
   - Grid behavior configuration

4. **Event Handling Example**
   - Object events (added, removed, modified, selected)
   - Mouse events (down, move, up)
   - Zoom events
   - Real-time event logging

## Running the Demo

### Prerequisites

- Node.js (version 14.x or compatible)
- npm or yarn

### Installation

1. Install dependencies:
   ```
   npm install
   ```
   or
   ```
   yarn
   ```

2. Start the development server:
   ```
   npm start
   ```
   or
   ```
   yarn start
   ```

3. Open your browser and navigate to `http://localhost:3000`

## Project Structure

- `src/`
  - `examples/` - Contains the four example components
    - `BasicCoordinatePlane.js` - Basic coordinate plane setup
    - `AdvancedLayersExample.js` - Advanced layer management
    - `GridCustomizationExample.js` - Grid customization options
    - `EventHandlingExample.js` - Event handling demonstration
  - `App.js` - Main application component with tab navigation
  - `index.js` - Entry point for the React application
  - `index.css` - Styles for the demo application

## Library Integration

This demo application uses the fabric-layers-react library locally by referencing it from the parent directory. In a real-world application, you would install it from npm:

```
npm install fabric-layers-react
```

Then import components as needed:

```javascript
import { 
  CoordinatePlane, 
  LayerManager, 
  GridManager,
  ImageLayer, 
  Layer,
  vector
} from 'fabric-layers-react';
```

## License

MIT
