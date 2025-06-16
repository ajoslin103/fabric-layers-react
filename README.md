# Fabric Layers React

React component library for [fabric-layers](https://github.com/ajoslin103/fabric-layers), providing declarative React components for all fabric-layers classes.

## Structure

The component library mirrors the structure of the original fabric-layers library:

```
Base (EventEmitter2)
├── Map (components/Map/)
│   ├── Grid
│   ├── Point
│   └── Measurement
└── Layer (components/Layers/)
    ├── Vector Layers
    │   ├── Line
    │   ├── Circle
    │   ├── Rect
    │   └── Polyline
    ├── Marker System
    │   ├── Marker
    │   ├── MarkerGroup
    │   └── Icon
    ├── Group
    ├── Connector
    └── Tooltip
```

## Installation

```bash
npm install fabric-layers-react fabric-layers
# or
yarn add fabric-layers-react fabric-layers
```

## Usage

Basic example using Map and various layer types:

```tsx
import { Map } from 'fabric-layers-react';
import { 
  Circle, 
  Line, 
  Marker, 
  Group 
} from 'fabric-layers-react/components/Layers';

function MyMap() {
  return (
    <Map width={800} height={600}>
      {/* Vector layer example */}
      <Circle
        position={{ x: 100, y: 100 }}
        radius={50}
        style={{ fill: 'blue', stroke: 'black' }}
        onSelect={handleSelect}
      />

      {/* Line example */}
      <Line
        points={[
          { x: 0, y: 0 },
          { x: 100, y: 100 }
        ]}
        style={{ stroke: 'red' }}
      />

      {/* Marker with tooltip */}
      <Marker
        position={{ x: 200, y: 200 }}
        icon={{
          url: 'marker.png',
          width: 32,
          height: 32
        }}
        tooltip="My Marker"
        onClick={handleClick}
      />

      {/* Group of layers */}
      <Group
        layers={[
          { type: 'circle', position: {x: 300, y: 300}, radius: 30 },
          { type: 'rect', position: {x: 350, y: 350}, width: 50, height: 50 }
        ]}
        style={{ opacity: 0.8 }}
      />
    </Map>
  );
}
```

## Component Reference

### Map Components

- **Map**: Main container component that initializes the fabric-layers canvas
  ```tsx
  <Map 
    width={800} 
    height={600}
    gridVisible={true}
    {...options}
  />
  ```

- **Grid**: Coordinate grid overlay
  ```tsx
  <Grid 
    size={50}
    color="#ccc"
    visible={true}
  />
  ```

### Vector Layers

- **Circle**
  ```tsx
  <Circle
    position={{ x: 100, y: 100 }}
    radius={50}
    style={{ fill: 'blue' }}
    onSelect={(e) => {}}
  />
  ```

- **Line**
  ```tsx
  <Line
    points={[
      { x: 0, y: 0 },
      { x: 100, y: 100 }
    ]}
    style={{ stroke: 'red' }}
  />
  ```

- **Rect**
  ```tsx
  <Rect
    position={{ x: 100, y: 100 }}
    width={200}
    height={100}
    style={{ fill: 'green' }}
  />
  ```

- **Polyline**
  ```tsx
  <Polyline
    points={[
      { x: 0, y: 0 },
      { x: 100, y: 100 },
      { x: 200, y: 50 }
    ]}
    style={{ stroke: 'blue' }}
  />
  ```

### Marker System

- **Marker**
  ```tsx
  <Marker
    position={{ x: 200, y: 200 }}
    icon={{
      url: 'marker.png',
      width: 32,
      height: 32
    }}
    tooltip="My Marker"
    onClick={(e) => {}}
    onDragEnd={(e) => {}}
  />
  ```

- **MarkerGroup**
  ```tsx
  <MarkerGroup
    markers={[
      { position: { x: 100, y: 100 }, tooltip: "Marker 1" },
      { position: { x: 200, y: 200 }, tooltip: "Marker 2" }
    ]}
    style={{ opacity: 0.8 }}
  />
  ```

### Other Components

- **Group**: Container for multiple layers
  ```tsx
  <Group
    layers={[/* layer configs */]}
    style={{ opacity: 0.8 }}
    onSelect={(e) => {}}
  />
  ```

- **Connector**: Connect two points or objects
  ```tsx
  <Connector
    start={{ x: 0, y: 0 }}
    end={{ x: 100, y: 100 }}
    style={{ stroke: 'black' }}
  />
  ```

- **Tooltip**: Add tooltips to layers
  ```tsx
  <Tooltip
    content="My tooltip"
    position={{ x: 100, y: 100 }}
    style={{ background: 'white' }}
  />
  ```

## TypeScript Support

All components are written in TypeScript and include comprehensive type definitions.

## Contributing

PRs and issues are welcome! Please make sure to:
1. Fork & `git clone`
2. `npm install`
3. Make your changes
4. Add/update tests in `test/`
5. `npm test`

## License

MIT © 2025