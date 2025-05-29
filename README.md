# fabric-layers-react

[![npm version](https://img.shields.io/npm/v/fabric-layers-react.svg)](https://www.npmjs.com/package/fabric-layers-react)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A fabric.js coordinate-plane (grid) & layers library for React applications.

## Features

- **Coordinate Plane System**: Create interactive canvases with precise coordinate systems
- **Grid System**: Customizable grid with labels, colors, and spacing options
- **Layer Management**: Easily add, remove, and organize multiple canvas layers
- **Vector Drawing Tools**: Draw shapes, lines, and markers with built-in vector components
- **Image Support**: Display and manipulate images on canvas
- **Measurement Tools**: Measure distances and areas on your canvas
- **Full TypeScript Support**: Comprehensive type definitions for all components

## Installation

### Using npm

```bash
npm install fabric-layers-react fabric-pure-browser react
```

### Using yarn

```bash
yarn add fabric-layers-react fabric-pure-browser react
```

## Basic Usage

### Create a Coordinate Plane

```jsx
import React, { useEffect, useRef } from 'react';
import { CoordinatePlane } from 'fabric-layers-react';

function MyCanvas() {
  const containerRef = useRef(null);
  const planeRef = useRef(null);
  
  useEffect(() => {
    if (containerRef.current && !planeRef.current) {
      // Create coordinate plane
      planeRef.current = new CoordinatePlane(containerRef.current, {
        gridEnabled: true,
        zoomEnabled: true,
        selectEnabled: true
      });
    }
    
    return () => {
      // Clean up
      if (planeRef.current) {
        // Handle cleanup if needed
      }
    };
  }, []);
  
  return (
    <div ref={containerRef} style={{ width: '100%', height: '500px' }} />
  );
}
```

### Add Layers to Your Coordinate Plane

```jsx
import React, { useEffect, useRef } from 'react';
import { CoordinatePlane, ImageLayer, Polyline } from 'fabric-layers-react';

function MyLayeredCanvas() {
  const containerRef = useRef(null);
  const planeRef = useRef(null);
  
  useEffect(() => {
    if (containerRef.current && !planeRef.current) {
      // Create coordinate plane
      const plane = new CoordinatePlane(containerRef.current, {
        gridEnabled: true
      });
      planeRef.current = plane;
      
      // Add an image layer
      const image = new ImageLayer({
        url: 'path/to/image.png',
        position: { x: 0, y: 0 },
        width: 500,
        height: 300
      });
      
      // Add a shape layer
      const path = new Polyline({
        points: [
          { x: 10, y: 10 },
          { x: 100, y: 50 },
          { x: 200, y: 10 }
        ],
        strokeColor: '#ff0000',
        strokeWidth: 2
      });
      
      // Add layers to the coordinate plane
      plane.addLayer(image);
      plane.addLayer(path);
    }
  }, []);
  
  return (
    <div ref={containerRef} style={{ width: '100%', height: '500px' }} />
  );
}
```

### Customize the Grid

```jsx
import React, { useEffect, useRef } from 'react';
import { CoordinatePlane, GridManager } from 'fabric-layers-react';

function CustomGrid() {
  const containerRef = useRef(null);
  
  useEffect(() => {
    if (containerRef.current) {
      // Create coordinate plane
      const plane = new CoordinatePlane(containerRef.current);
      
      // Create a grid manager
      const gridManager = new GridManager({
        coordinatePlane: plane,
        spacing: 20,
        color: '#0099cc',
        opacity: 0.4,
        showLabels: true
      });
      
      // Customize the grid
      gridManager.setColor('#333333');
      gridManager.setSpacing(50);
      gridManager.setOpacity(0.6);
    }
  }, []);
  
  return (
    <div ref={containerRef} style={{ width: '100%', height: '500px' }} />
  );
}
```

## Advanced Usage

For more advanced usage examples and detailed API documentation, please refer to the [API Documentation](API.md).

### Using the Layer Manager

```jsx
import React, { useEffect, useRef } from 'react';
import { CoordinatePlane, LayerManager, ImageLayer, Marker } from 'fabric-layers-react';

function AdvancedLayerManagement() {
  const containerRef = useRef(null);
  
  useEffect(() => {
    if (containerRef.current) {
      // Create coordinate plane
      const plane = new CoordinatePlane(containerRef.current);
      
      // Create a layer manager
      const layerManager = new LayerManager({
        coordinatePlane: plane
      });
      
      // Create layers
      const baseMap = new ImageLayer({
        id: 'base-map',
        url: 'path/to/map.png',
        position: { x: 0, y: 0 }
      });
      
      const marker1 = new Marker({
        id: 'marker-1',
        position: { x: 100, y: 100 },
        label: 'Location A'
      });
      
      const marker2 = new Marker({
        id: 'marker-2',
        position: { x: 200, y: 150 },
        label: 'Location B'
      });
      
      // Add layers to the manager
      layerManager.addLayer(baseMap);
      layerManager.addLayer(marker1);
      layerManager.addLayer(marker2);
      
      // Sort layers by z-index
      layerManager.sortLayers();
      
      // You can now easily manage layers
      // For example, to get a layer by id:
      const locationA = layerManager.getLayer('marker-1');
      
      // To hide all layers except the base map:
      layerManager.hideAllLayers();
      layerManager.getLayer('base-map').setVisible(true);
    }
  }, []);
  
  return (
    <div ref={containerRef} style={{ width: '100%', height: '500px' }} />
  );
}
```

## Browser Support

fabric-layers-react works in all modern browsers that support Canvas, including:

- Chrome
- Firefox
- Safari
- Edge

## Development

### Building from Source

```bash
# Clone the repository
git clone https://github.com/ajoslin103/fabric-layers-react.git
cd fabric-layers-react

# Install dependencies
npm install

# Build the library
npm run build

# Run development server
npm start
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
