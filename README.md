# Fabric Layers

An interactive coordinate-plane, grid, and layer management library for [fabric.js](https://fabricjs.com/) canvases.

`fabric-layers` is based on the excellent original work of [ReactIndoorMapping](https://github.com/martinwairegi/ReactIndoorMapping) featured in this blog:https://blog.logrocket.com/build-indoor-maps-fabric-js-react/ (interestingly, the code names React but doesn't require it) 

`ReactIndoorMapping` turned a plain Fabric canvas into a powerful 2-D workspace with a pixel-perfect grid system, reusable layers, and fully-typed events – ideal for editors, games, mapping tools, CAD-like apps, and any time you need structured interaction on an HTML canvas.

`fabric-layers` repackages this functionality, removing any traces of React (since the original codebase didn't actually use it) to provide a more generic image manipulation library. It can still be used in React apps, but it's not a React library.

---

## ✨ Features

* Configurable Cartesian grid with panning, zooming, and snapping helpers
* Lightweight Layer API: add, remove, reorder, show/hide, lock, and listen for events
* Precise coordinate transformation utilities (grid ⇄ canvas ⇄ screen)
* Event-driven core powered by `eventemitter2`
* Framework-agnostic – works in vanilla JS, React, Vue, Svelte, etc.
* Tree-shakable ESM, CommonJS, and UMD builds + source-maps

---

## 📦 Installation

```bash
# peer dependency – you bring your own fabric.js (≥3.0.0)
npm install fabric

# library
npm install fabric-layers
```

CDN / direct `<script>` usage:

```html
<script src="https://unpkg.com/fabric@latest/dist/fabric.min.js"></script>
<script src="https://unpkg.com/fabric-layers/dist/index.umd.js"></script>
```

---

## 🚀 Quick Start

```html
<canvas id="c" width="800" height="600"></canvas>
<script type="module">
  import { CoordinatePlane, GridLayer, Layer } from 'fabric-layers';
  import { fabric } from 'fabric';

  const canvas = new fabric.Canvas('c');

  // 1️⃣  Create a coordinate plane
  const plane = new CoordinatePlane({
    canvas,
    grid: { spacing: 20, color: '#eee' }
  });

  // 2️⃣  Work with layers
  const shapes = new Layer('shapes');
  plane.addLayer(shapes);

  // add an interactive rect
  shapes.add(new fabric.Rect({
    left: 100,
    top: 80,
    width: 120,
    height: 60,
    fill: 'skyblue'
  }));

  // 3️⃣  Listen for grid-aware events
  plane.on('click', ({ point /* {x, y} in grid units */ }) => {
    console.log('Clicked grid location', point);
  });
</script>
```

---

## 🛠 API Reference (high-level)

### CoordinatePlane
* `constructor(options)` – create a plane around an existing `fabric.Canvas`.
* `.addLayer(layer)` / `.removeLayer(id)`
* `.toGrid(point)` / `.toCanvas(point)` – coordinate transforms.
* Events: `click`, `pan:start|move|end`, `zoom`, *etc.*

### Layer
* `.add(object)` / `.remove(object)` – manage `fabric.Object`s.
* `.show()` / `.hide()` / `.lock()` / `.unlock()`
* Events scoped to the layer (e.g., `object:modified`).

### GridLayer (extends Layer)
* Built-in grid rendering + snapping helpers.

---

## 🤝 Contributing

PRs and issues are welcome!
1. Fork & `git clone`
2. `npm install`
3. `npm run dev` – watch/build
4. Add tests in `test/` and run `npm test`

Please follow the [Conventional Commits](https://www.conventionalcommits.org/) spec; CI will lint commit messages.

---

## 📄 Licenses

MIT © 2022-2025 [Martin Wairegi](https://github.com/martinwairegi) (original author of ReactIndoorMapping)

MIT © 2022-2025 [Allen Joslin](https://github.com/ajoslin103) (current author of fabric-layers)
