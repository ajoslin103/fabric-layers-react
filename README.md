# Fabric Layers React

A React wrapper for the [fabric-layers](https://www.npmjs.com/package/fabric-layers) library, providing a React-friendly way to work with layered canvases using Fabric.js.

## Installation

```bash
npm install fabric-layers-react fabric-layers fabric
# or
yarn add fabric-layers-react fabric-layers fabric
```

## fabric-layer classes

Base (EventEmitter2)
├── Map (+ ModesMixin)
│   ├── Grid
│   ├── Point
│   └── Measurement
├── Layer
│   ├── Vector Layers (Line, Circle, Rect, Polyline)
│   ├── Marker System
│   │   ├── Marker
│   │   ├── MarkerGroup
│   │   └── Icon
│   ├── Group
│   ├── Connector
│   └── Tooltip
├── Paint System
│   ├── Canvas
│   ├── Arrow
│   ├── ArrowHead
│   └── PaintManager
└── Measurement System
    ├── Measurement
    └── Measurer

## Components

## Hooks

### useFabricLayers

## Licenses

MIT © 2025 [Allen Joslin](https://github.com/ajoslin103) (current author of fabric-layers-react)

MIT © 2025 [Allen Joslin](https://github.com/ajoslin103) (current author of fabric-layers)

MIT © 2022 [Martin Wairegi](https://github.com/martinwairegi) (original author of ReactIndoorMapping)
