# fabric-layers-react API Documentation

This document describes the public API for the fabric-layers-react library, a lightweight React library that provides coordinate plane (grid) and layering system built on top of fabric.js.

## Core Components

### CoordinatePlane (formerly Map)

The `CoordinatePlane` is the main container for the canvas and provides a coordinate system for all layers and elements.

```javascript
import { CoordinatePlane } from 'fabric-layers-react';

const container = document.getElementById('canvas-container');
const coordinatePlane = new CoordinatePlane(container, {
  center: { x: 0, y: 0 },
  zoom: 1,
  minZoom: 0.5,
  maxZoom: 5,
  gridEnabled: true,
  zoomEnabled: true,
  selectEnabled: true
});
```

#### Key Properties

- `center`: The center point of the coordinate plane
- `zoom`: The current zoom level
- `minZoom`: Minimum allowed zoom level
- `maxZoom`: Maximum allowed zoom level
- `gridEnabled`: Whether the grid is displayed
- `zoomEnabled`: Whether zooming is enabled
- `selectEnabled`: Whether selecting elements is enabled
- `mode`: Current interaction mode ('SELECT', 'GRAB', 'MEASURE', 'DRAW')

#### Key Methods

- `setCenter(point)`: Set the center of the coordinate plane
- `setZoom(zoom)`: Set the zoom level
- `addLayer(layer)`: Add a layer to the coordinate plane
- `removeLayer(layer)`: Remove a layer from the coordinate plane
- `getPointer(event)`: Get the pointer coordinates for an event
- `toMap(point)`: Convert screen coordinates to map coordinates
- `toScreen(point)`: Convert map coordinates to screen coordinates

### GridSystem (formerly Grid)

The `GridSystem` provides a coordinate grid for the coordinate plane.

```javascript
import { GridSystem } from 'fabric-layers-react';

// The grid is automatically created with the CoordinatePlane
// But you can also create a standalone grid:
const grid = new GridSystem(canvasElement, {
  color: '#cccccc',
  opacity: 0.5,
  spacing: 10
});
```

#### Key Properties

- `color`: Grid line color
- `opacity`: Grid line opacity
- `spacing`: Grid line spacing
- `showLabels`: Whether to show axis labels

#### Key Methods

- `render()`: Render the grid
- `setSpacing(spacing)`: Set the grid spacing
- `setVisible(visible)`: Show or hide the grid

## Layer System

### Layer

The `Layer` class is the base class for all layers.

```javascript
import { Layer } from 'fabric-layers-react';

const layer = new Layer({
  label: 'My Layer',
  draggable: true,
  zIndex: 2,
  opacity: 0.8,
  clickable: true
});
```

#### Key Properties

- `label`: Layer label
- `draggable`: Whether the layer can be dragged
- `zIndex`: Layer stacking order
- `opacity`: Layer opacity
- `clickable`: Whether the layer responds to click events

#### Key Methods

- `setDraggable(draggable)`: Set whether the layer can be dragged
- `setOpacity(opacity)`: Set the layer opacity
- `setZIndex(zIndex)`: Set the layer stacking order
- `setVisible(visible)`: Show or hide the layer

### CanvasLayer

The `CanvasLayer` provides a canvas-based layer for drawing custom content.

```javascript
import { CanvasLayer } from 'fabric-layers-react';

const canvasLayer = new CanvasLayer({
  label: 'Canvas Layer',
  zIndex: 3
});

// Use the canvas context for custom drawing
canvasLayer.initCanvas();
canvasLayer.ctx.fillRect(0, 0, 100, 100);
```

#### Key Methods

- `initCanvas()`: Initialize the canvas context
- `clearCanvas()`: Clear the canvas
- `resizeCanvas()`: Resize the canvas to match parent dimensions

## Vector Shapes

The library provides several vector shape layers:

### Polyline

```javascript
import { Polyline } from 'fabric-layers-react';

const polyline = new Polyline({
  points: [
    { x: 10, y: 10 },
    { x: 20, y: 20 },
    { x: 30, y: 10 }
  ],
  strokeColor: '#ff0000',
  strokeWidth: 2
});
```

### Circle

```javascript
import { Circle } from 'fabric-layers-react';

const circle = new Circle({
  center: { x: 50, y: 50 },
  radius: 20,
  fillColor: '#0000ff',
  strokeColor: '#000000',
  strokeWidth: 1
});
```

### Line

```javascript
import { Line } from 'fabric-layers-react';

const line = new Line({
  start: { x: 10, y: 10 },
  end: { x: 100, y: 100 },
  strokeColor: '#00ff00',
  strokeWidth: 3
});
```

### Rect

```javascript
import { Rect } from 'fabric-layers-react';

const rect = new Rect({
  position: { x: 10, y: 10 },
  width: 100,
  height: 50,
  fillColor: '#ffff00',
  strokeColor: '#000000',
  strokeWidth: 1
});
```

## Markers

### Marker

```javascript
import { Marker } from 'fabric-layers-react';

const marker = new Marker({
  position: { x: 50, y: 50 },
  label: 'Point of Interest',
  iconUrl: 'path/to/icon.png',
  draggable: true
});
```

## Utilities

### Geometry Utilities

```javascript
import { Point } from 'fabric-layers-react';

const point = new Point(10, 20);
const point2 = new Point(30, 40);
const distance = point.distanceTo(point2);
```

### Measurement Tools

```javascript
import { Measurement } from 'fabric-layers-react';

const measurement = new Measurement(coordinatePlane);
measurement.start(); // Begin measurement mode
```
