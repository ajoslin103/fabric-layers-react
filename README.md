# Fabric Layers React v1.0.1

A React wrapper for the [fabric-layers](https://www.npmjs.com/package/fabric-layers) library, providing a React-friendly way to work with interactive, layered canvases using Fabric.js.

## Overall Structure

This project is delivered as two packages:

1. **fabric-layers** - Core functionality
   - Core utilities and constants
   - Geometry tools and grid fundamentals
   - Framework-agnostic implementation
   - No React dependencies

2. **fabric-layers-react** (this package) - React extensions
   - React components and hooks
   - JSX rendering utilities
   - React-specific implementations
   - Built on top of fabric-layers core

## Installation

```bash
# Install both packages (recommended)
npm install fabric-layers-react fabric
# or with yarn
yarn add fabric-layers-react fabric
```

## React Architecture

```
React (fabric-layers-react)
├── Components
│   ├── Map
│   │   ├── Grid
│   │   ├── Map
│   │   ├── Measurement
│   │   └── Point
└── Hooks
    └── useFabricLayers
```

### Components

#### Map

The main container component that renders the interactive canvas and manages the map instance.

**Props:**
- `width`: `number | string` (default: '100%') - Width of the map container
- `height`: `number | string` (default: '100%') - Height of the map container
- `className`: `string` - Additional CSS class names
- `style`: `React.CSSProperties` - Inline styles for the container
- `children`: `React.ReactNode` - Child components to render within the map
- `onReady`: `(map: CoreMap) => void` - Callback when the map is initialized
- `modes`: `Record<string, any>` - Map interaction modes
- `defaultMode`: `string` - Default interaction mode

#### Grid

Renders a grid overlay on the map for better spatial reference.

**Props:**
- `size`: `number` (default: 20) - Size of grid cells in pixels
- `color`: `string` (default: '#cccccc') - Color of the grid lines
- `dashArray`: `number[]` (default: [1, 2]) - Dash pattern for grid lines
- `opacity`: `number` (default: 0.5) - Opacity of the grid
- `visible`: `boolean` (default: true) - Whether the grid is visible
- `mapId`: `string` - ID of the map to attach to (defaults to active map)

#### Point

Renders a point on the map with various styling options.

**Props:**
- `x`: `number` - X coordinate of the point
- `y`: `number` - Y coordinate of the point
- `radius`: `number` (default: 5) - Radius of the point in pixels
- `fill`: `string` (default: '#ff0000') - Fill color of the point
- `stroke`: `string` (default: '#000000') - Stroke color of the point
- `strokeWidth`: `number` (default: 1) - Width of the point's stroke
- `opacity`: `number` (default: 1) - Opacity of the point (0-1)
- `visible`: `boolean` (default: true) - Whether the point is visible
- `mapId`: `string` - ID of the map to attach to (defaults to active map)
- Event handlers: `onSelect`, `onDeselect`, `onClick`, `onMouseEnter`, `onMouseLeave`

#### Measurement

Renders a measurement line between two points with optional labels.

**Props:**
- `startX`: `number` - Starting X coordinate
- `startY`: `number` - Starting Y coordinate
- `endX`: `number` - Ending X coordinate
- `endY`: `number` - Ending Y coordinate
- `unit`: `string` (default: 'px') - Unit of measurement
- `lineColor`: `string` (default: '#ff0000') - Color of the measurement line
- `lineWidth`: `number` (default: 2) - Width of the measurement line
- `labelColor`: `string` (default: '#000000') - Color of the measurement labels
- `labelSize`: `number` (default: 12) - Font size of the labels
- `labelOffset`: `number` (default: 10) - Offset of labels from the line
- `showLabels`: `boolean` (default: true) - Whether to show measurement labels
- `precision`: `number` (default: 2) - Number of decimal places for measurements
- `mapId`: `string` - ID of the map to attach to (defaults to active map)
- Event handlers: `onUpdate`, `onSelect`, `onDeselect`

## Hooks

    ### useFabricLayers

## Licenses

MIT © 2025 [Allen Joslin](https://github.com/ajoslin103) (current author of fabric-layers-react)

MIT © 2025 [Allen Joslin](https://github.com/ajoslin103) (current author of fabric-layers)

MIT © 2022 [Martin Wairegi](https://github.com/martinwairegi) (original author of ReactIndoorMapping)
