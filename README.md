# Fabric Layers React

A React wrapper for the [fabric-layers](https://www.npmjs.com/package/fabric-layers) library, providing a React-friendly way to work with layered canvases using Fabric.js.

## Installation

```bash
npm install fabric-layers-react fabric-layers fabric
# or
yarn add fabric-layers-react fabric-layers fabric
```

## Basic Usage

```jsx
import React from 'react';
import { FabricLayersReact, LayerPanel, useFabricLayers } from 'fabric-layers-react';

const App = () => {
  const { canvas, layerManager } = useFabricLayers();

  const handleReady = (canvas, layerManager) => {
    // Access the canvas and layer manager here
    console.log('Canvas and LayerManager are ready');
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <div style={{ flex: 1 }}>
        <FabricLayersReact onReady={handleReady} />
      </div>
      <div style={{ width: '250px', borderLeft: '1px solid #ddd' }}>
        <LayerPanel />
      </div>
    </div>
  );
};

export default App;
```

## Components

### FabricLayersReact

The main component that renders the canvas and provides the context for all child components.

#### Props

- `width`: Width of the canvas (default: '100%')
- `height`: Height of the canvas (default: '100%')
- `className`: Additional CSS class for the container
- `style`: Additional inline styles for the container
- `canvasOptions`: Options to pass to the Fabric.js Canvas constructor
- `onReady`: Callback function that receives the canvas and layer manager instances

### LayerPanel

A pre-built panel for managing layers.

#### Props

- `className`: Additional CSS class for the panel
- `style`: Additional inline styles for the panel

## Hooks

### useFabricLayers

A hook that provides access to the canvas and layer manager instances, as well as event handlers.

```jsx
const { 
  canvas, 
  layerManager,
  onObjectAdded,
  onObjectRemoved,
  onSelectionCreated,
  onSelectionCleared 
} = useFabricLayers();

// Example usage of event handlers
useEffect(() => {
  const handleObjectAdded = (object) => {
    console.log('Object added:', object);
  };
  
  onObjectAdded(handleObjectAdded);
  
  return () => {
    // Cleanup if needed
  };
}, [onObjectAdded]);
```

## License

MIT
