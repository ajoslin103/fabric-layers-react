// Mock for fabric-layers using class inheritance approach

class Point {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  add(point) {
    return new Point(this.x + point.x, this.y + point.y);
  }

  subtract(point) {
    return new Point(this.x - point.x, this.y - point.y);
  }

  multiply(scalar) {
    return new Point(this.x * scalar, this.y * scalar);
  }

  divide(scalar) {
    return new Point(this.x / scalar, this.y / scalar);
  }

  equals(point) {
    return this.x === point.x && this.y === point.y;
  }

  clone() {
    return new Point(this.x, this.y);
  }
}

class EventEmitter {
  constructor() {
    this._events = {};
  }

  on(event, callback) {
    if (!this._events[event]) {
      this._events[event] = [];
    }
    this._events[event].push(callback);
    return this;
  }

  off(event, callback) {
    if (!this._events[event]) return this;
    if (!callback) {
      delete this._events[event];
      return this;
    }
    const index = this._events[event].indexOf(callback);
    if (index !== -1) {
      this._events[event].splice(index, 1);
    }
    return this;
  }

  emit(event, ...args) {
    if (!this._events[event]) return false;
    this._events[event].forEach(callback => callback(...args));
    return true;
  }
}

class Map extends EventEmitter {
  constructor(options = {}) {
    super();
    this.options = options;
    this.canvas = options.canvas || {};
    this.markers = [];
    this.layers = [];
    this.coordinatePlane = {
      origin: new Point(0, 0),
      scale: 1
    };
  }

  addMarker(marker) {
    this.markers.push(marker);
    this.emit('marker:added', marker);
    return marker;
  }

  removeMarker(marker) {
    const index = this.markers.indexOf(marker);
    if (index !== -1) {
      this.markers.splice(index, 1);
      this.emit('marker:removed', marker);
    }
    return this;
  }

  addLayer(layer) {
    this.layers.push(layer);
    this.emit('layer:added', layer);
    return this;
  }

  removeLayer(layer) {
    const index = this.layers.indexOf(layer);
    if (index !== -1) {
      this.layers.splice(index, 1);
      this.emit('layer:removed', layer);
    }
    return this;
  }

  setZoom(zoom) {
    this.coordinatePlane.scale = zoom;
    this.emit('zoom:changed', zoom);
    return this;
  }

  getZoom() {
    return this.coordinatePlane.scale;
  }

  panTo(point) {
    this.coordinatePlane.origin = point instanceof Point ? point : new Point(point.x, point.y);
    this.emit('pan', this.coordinatePlane.origin);
    return this;
  }
}

class Marker extends EventEmitter {
  constructor(options = {}) {
    super();
    this.options = options;
    this.position = options.position || new Point();
    this.type = options.type || MARKER_TYPES.DEFAULT;
  }

  setPosition(point) {
    this.position = point instanceof Point ? point : new Point(point.x, point.y);
    this.emit('position:changed', this.position);
    return this;
  }

  getPosition() {
    return this.position;
  }
}

// Constants
const MARKER_TYPES = {
  DEFAULT: 'default',
  CUSTOM: 'custom'
};

const LAYER_TYPES = {
  IMAGE: 'image',
  VECTOR: 'vector'
};

const fabricLayers = {
  // Math utilities
  clamp: (value, min, max) => Math.min(Math.max(value, min), max),
  len: (x, y) => Math.sqrt(x * x + y * y),
  lerp: (a, b, t) => a + (b - a) * t,
  
  // Classes
  Point,
  Map,
  Marker,
  MARKER_TYPES,
  LAYER_TYPES,
  // Constants
  MARKER: {
    position: new Point(),
    minZoom: 1,
    maxZoom: 20
  }
};

module.exports = fabricLayers;
