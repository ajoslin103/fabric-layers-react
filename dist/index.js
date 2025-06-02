/* @preserve
 * fabric-layers-react 2.0.0, a fabric.js coordinate-plane (grid) & layers library for React
 * (c) 2025 Allen Joslin
 */

import fabric$1 from 'fabric-pure-browser';
import * as fabricLayers from 'fabric-layers';
import { Grid as Grid$1, clamp, alpha, parseUnit, toPx, isObj, gridStyle, Axis, Point as Point$1, len, almost, Group as Group$1, Layer as Layer$1, CanvasLayer as CanvasLayer$1, Connector as Connector$1, Base, Modes as Modes$1, Measurer, MAP } from 'fabric-layers';
export { Axis, Base, GridManager, LayerManager, MAP, Measurer, Modes, Point, gridStyle, point } from 'fabric-layers';
import React from 'react';
import EventEmitter2 from 'eventemitter2';

var global$2 = (typeof global !== "undefined" ? global :
  typeof self !== "undefined" ? self :
  typeof window !== "undefined" ? window : {});

var global$1 = (typeof global$2 !== "undefined" ? global$2 :
            typeof self !== "undefined" ? self :
            typeof window !== "undefined" ? window : {});

// shim for using process in browser
// based off https://github.com/defunctzombie/node-process/blob/master/browser.js

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
var cachedSetTimeout = defaultSetTimout;
var cachedClearTimeout = defaultClearTimeout;
if (typeof global$1.setTimeout === 'function') {
    cachedSetTimeout = setTimeout;
}
if (typeof global$1.clearTimeout === 'function') {
    cachedClearTimeout = clearTimeout;
}

function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}
function nextTick(fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
}
// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
var env = {};

// from https://github.com/kumavis/browser-process-hrtime/blob/master/index.js
var performance = global$1.performance || {};
performance.now        ||
  performance.mozNow     ||
  performance.msNow      ||
  performance.oNow       ||
  performance.webkitNow  ||
  function(){ return (new Date()).getTime() };

var process = {
  env: env};

var version = "2.0.0";

// Import dependencies from fabric-layers core library

/**
 * Grid - React extension of the core Grid class
 *
 * Handles drawing grid lines, labels, and axes based on the current
 * coordinate plane state and viewport with React integration.
 *
 * @class
 * @extends {CoreGrid}
 */
class Grid extends Grid$1 {
  /**
   * Create a new grid
   *
   * @param {HTMLCanvasElement} canvas - Canvas element to draw the grid on
   * @param {Object} opts - Grid configuration options
   * @param {string} [opts.color='#cccccc'] - Grid line color
   * @param {number} [opts.opacity=0.5] - Grid line opacity
   * @param {string} [opts.axisColor='#999999'] - Axis line color
   * @param {number} [opts.spacing=10] - Grid line spacing
   * @param {boolean} [opts.showLabels=true] - Whether to show grid labels
   * @param {boolean} [opts.visible=true] - Whether the grid is visible
   */
  constructor(canvas, opts) {
    super(opts);
    this.canvas = canvas;
    this.context = this.canvas.getContext('2d');
    this.state = {};
    this.setDefaults();
    this.update(opts);
  }

  /**
   * Render the grid to the canvas
   *
   * @returns {Grid} This grid instance for chaining
   */
  render() {
    this.draw();
    return this;
  }
  getCenterCoords() {
    let state = this.state.x;
    let [width, height] = state.shape;
    let [pt, pr, pb, pl] = state.padding;
    let axisCoords = state.opposite.coordinate.getCoords([state.coordinate.axisOrigin], state.opposite);
    const y = pt + axisCoords[1] * (height - pt - pb);
    state = this.state.y;
    [width, height] = state.shape;
    [pt, pr, pb, pl] = state.padding;
    axisCoords = state.opposite.coordinate.getCoords([state.coordinate.axisOrigin], state.opposite);
    const x = pl + axisCoords[0] * (width - pr - pl);
    return {
      x,
      y
    };
  }
  setSize(width, height) {
    this.setWidth(width);
    this.setHeight(height);
  }
  setWidth(width) {
    this.canvas.width = width;
  }
  setHeight(height) {
    this.canvas.height = height;
  }

  // re-evaluate lines, calc options for renderer
  update(opts) {
    if (!opts) opts = {};
    const shape = [this.canvas.width, this.canvas.height];

    // recalc state
    this.state.x = this.calcCoordinate(this.axisX, shape, this);
    this.state.y = this.calcCoordinate(this.axisY, shape, this);
    this.state.x.opposite = this.state.y;
    this.state.y.opposite = this.state.x;
    this.emit('update', opts);
    return this;
  }

  // re-evaluate lines, calc options for renderer
  update2(center) {
    const shape = [this.canvas.width, this.canvas.height];
    Object.assign(this.center, center);
    // recalc state
    this.state.x = this.calcCoordinate(this.axisX, shape, this);
    this.state.y = this.calcCoordinate(this.axisY, shape, this);
    this.state.x.opposite = this.state.y;
    this.state.y.opposite = this.state.x;
    this.emit('update', center);
    this.axisX.offset = center.x;
    this.axisX.zoom = 1 / center.zoom;
    this.axisY.offset = center.y;
    this.axisY.zoom = 1 / center.zoom;
  }

  // get state object with calculated params, ready for rendering
  calcCoordinate(coord, shape) {
    const state = {
      coordinate: coord,
      shape,
      grid: this
    };
    // calculate real offset/range
    state.range = coord.getRange(state);
    state.offset = clamp(coord.offset - state.range * clamp(0.5, 0, 1), Math.max(coord.min, -Number.MAX_VALUE + 1), Math.min(coord.max, Number.MAX_VALUE) - state.range);
    state.zoom = coord.zoom;
    // calc style
    state.axisColor = typeof coord.axisColor === 'number' ? alpha(coord.color, coord.axisColor) : coord.axisColor || coord.color;
    state.axisWidth = coord.axisWidth || coord.lineWidth;
    state.lineWidth = coord.lineWidth;
    state.tickAlign = coord.tickAlign;
    state.labelColor = state.color;
    // get padding
    if (typeof coord.padding === 'number') {
      state.padding = Array(4).fill(coord.padding);
    } else if (coord.padding instanceof Function) {
      state.padding = coord.padding(state);
    } else {
      state.padding = coord.padding;
    }
    // calc font
    if (typeof coord.fontSize === 'number') {
      state.fontSize = coord.fontSize;
    } else {
      const units = parseUnit(coord.fontSize);
      state.fontSize = units[0] * toPx(units[1]);
    }
    state.fontFamily = coord.fontFamily || 'sans-serif';
    // get lines stops, including joined list of values
    let lines;
    if (coord.lines instanceof Function) {
      lines = coord.lines(state);
    } else {
      lines = coord.lines || [];
    }
    state.lines = lines;
    // calc colors
    if (coord.lineColor instanceof Function) {
      state.lineColors = coord.lineColor(state);
    } else if (Array.isArray(coord.lineColor)) {
      state.lineColors = coord.lineColor;
    } else {
      let color = alpha(coord.color, coord.lineColor);
      if (typeof coord.lineColor !== 'number') {
        color = coord.lineColor === false || coord.lineColor == null ? null : coord.color;
      }
      state.lineColors = Array(lines.length).fill(color);
    }
    // calc ticks
    let ticks;
    if (coord.ticks instanceof Function) {
      ticks = coord.ticks(state);
    } else if (Array.isArray(coord.ticks)) {
      ticks = coord.ticks;
    } else {
      const tick = coord.ticks === true || coord.ticks === true ? state.axisWidth * 2 : coord.ticks || 0;
      ticks = Array(lines.length).fill(tick);
    }
    state.ticks = ticks;
    // calc labels
    let labels;
    if (coord.labels === true) labels = state.lines;else if (coord.labels instanceof Function) {
      labels = coord.labels(state);
    } else if (Array.isArray(coord.labels)) {
      labels = coord.labels;
    } else if (isObj(coord.labels)) {
      labels = coord.labels;
    } else {
      labels = Array(state.lines.length).fill(null);
    }
    state.labels = labels;
    // convert hashmap ticks/labels to lines + colors
    if (isObj(ticks)) {
      state.ticks = Array(lines.length).fill(0);
    }
    if (isObj(labels)) {
      state.labels = Array(lines.length).fill(null);
    }
    if (isObj(ticks)) {
      // eslint-disable-next-line guard-for-in
      Object.keys(ticks).forEach((value, tick) => {
        state.ticks.push(tick);
        state.lines.push(parseFloat(value));
        state.lineColors.push(null);
        state.labels.push(null);
      });
    }
    if (isObj(labels)) {
      Object.keys(labels).forEach((label, value) => {
        state.labels.push(label);
        state.lines.push(parseFloat(value));
        state.lineColors.push(null);
        state.ticks.push(null);
      });
    }
    return state;
  }
  setDefaults() {
    this.pixelRatio = window.devicePixelRatio;
    this.autostart = true;
    this.interactions = true;
    this.defaults = Object.assign({
      type: 'linear',
      name: '',
      units: '',
      state: {},
      // visible range params
      minZoom: -Infinity,
      maxZoom: Infinity,
      min: -Infinity,
      max: Infinity,
      offset: 0,
      origin: 0.5,
      center: {
        x: 0,
        y: 0,
        zoom: 1
      },
      zoom: 1,
      zoomEnabled: true,
      panEnabled: true,
      // labels
      labels: true,
      fontSize: '11pt',
      fontFamily: 'sans-serif',
      padding: 0,
      color: 'rgb(0,0,0,1)',
      // lines params
      lines: true,
      tick: 8,
      tickAlign: 0.5,
      lineWidth: 1,
      distance: 13,
      style: 'lines',
      lineColor: 0.4,
      // axis params
      axis: true,
      axisOrigin: 0,
      axisWidth: 2,
      axisColor: 0.8,
      // stub methods
      // return coords for the values, redefined by axes
      getCoords: () => [0, 0, 0, 0],
      // return 0..1 ratio based on value/offset/range, redefined by axes
      getRatio: () => 0,
      // default label formatter
      format: v => v
    }, gridStyle, this._options);
    this.axisX = new Axis('x', this.defaults);
    this.axisY = new Axis('y', this.defaults);
    this.axisX = Object.assign({}, this.defaults, {
      orientation: 'x',
      offset: this.center.x,
      getCoords: (values, state) => {
        const coords = [];
        if (!values) return coords;
        for (let i = 0; i < values.length; i += 1) {
          const t = state.coordinate.getRatio(values[i], state);
          coords.push(t);
          coords.push(0);
          coords.push(t);
          coords.push(1);
        }
        return coords;
      },
      getRange: state => state.shape[0] * state.coordinate.zoom,
      // FIXME: handle infinity case here
      getRatio: (value, state) => (value - state.offset) / state.range
    });
    this.axisY = Object.assign({}, this.defaults, {
      orientation: 'y',
      offset: this.center.y,
      getCoords: (values, state) => {
        const coords = [];
        if (!values) return coords;
        for (let i = 0; i < values.length; i += 1) {
          const t = state.coordinate.getRatio(values[i], state);
          coords.push(0);
          coords.push(t);
          coords.push(1);
          coords.push(t);
        }
        return coords;
      },
      getRange: state => state.shape[1] * state.coordinate.zoom,
      getRatio: (value, state) => 1 - (value - state.offset) / state.range
    });
    Object.assign(this, this.defaults);
    Object.assign(this, this._options);
    this.center = new Point$1(this.center);
  }

  // draw grid to the canvas
  draw() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawLines(this.state.x);
    this.drawLines(this.state.y);
    return this;
  }

  // lines instance draw
  drawLines(state) {
    // draw lines and sublines
    if (!state || !state.coordinate) return;
    const ctx = this.context;
    const [width, height] = state.shape;
    const left = 0;
    const top = 0;
    const [pt, pr, pb, pl] = state.padding;
    let axisRatio = state.opposite.coordinate.getRatio(state.coordinate.axisOrigin, state.opposite);
    axisRatio = clamp(axisRatio, 0, 1);
    const coords = state.coordinate.getCoords(state.lines, state);
    // draw state.lines
    ctx.lineWidth = 1; // state.lineWidth/2.;
    for (let i = 0, j = 0; i < coords.length; i += 4, j += 1) {
      const color = state.lineColors[j];
      if (!color) continue;
      ctx.strokeStyle = color;
      ctx.beginPath();
      const x1 = left + pl + coords[i] * (width - pr - pl);
      const y1 = top + pt + coords[i + 1] * (height - pb - pt);
      const x2 = left + pl + coords[i + 2] * (width - pr - pl);
      const y2 = top + pt + coords[i + 3] * (height - pb - pt);
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
      ctx.closePath();
    }
    const normals = [];
    for (let i = 0; i < coords.length; i += 4) {
      const x1 = coords[i];
      const y1 = coords[i + 1];
      const x2 = coords[i + 2];
      const y2 = coords[i + 3];
      const xDif = x2 - x1;
      const yDif = y2 - y1;
      const dist = len(xDif, yDif);
      normals.push(xDif / dist);
      normals.push(yDif / dist);
    }
    // calc state.labels/tick coords
    const tickCoords = [];
    state.labelCoords = [];
    const ticks = state.ticks;
    for (let i = 0, j = 0, k = 0; i < normals.length; k += 1, i += 2, j += 4) {
      const x1 = coords[j];
      const y1 = coords[j + 1];
      const x2 = coords[j + 2];
      const y2 = coords[j + 3];
      const xDif = (x2 - x1) * axisRatio;
      const yDif = (y2 - y1) * axisRatio;
      const tick = [normals[i] * ticks[k] / (width - pl - pr), normals[i + 1] * ticks[k] / (height - pt - pb)];
      tickCoords.push(normals[i] * (xDif + tick[0] * state.tickAlign) + x1);
      tickCoords.push(normals[i + 1] * (yDif + tick[1] * state.tickAlign) + y1);
      tickCoords.push(normals[i] * (xDif - tick[0] * (1 - state.tickAlign)) + x1);
      tickCoords.push(normals[i + 1] * (yDif - tick[1] * (1 - state.tickAlign)) + y1);
      state.labelCoords.push(normals[i] * xDif + x1);
      state.labelCoords.push(normals[i + 1] * yDif + y1);
    }
    // draw ticks
    if (ticks.length) {
      ctx.lineWidth = state.axisWidth / 2;
      ctx.beginPath();
      for (let i = 0, j = 0; i < tickCoords.length; i += 4, j += 1) {
        if (almost(state.lines[j], state.opposite.coordinate.axisOrigin)) continue;
        const x1 = left + pl + tickCoords[i] * (width - pl - pr);
        const y1 = top + pt + tickCoords[i + 1] * (height - pt - pb);
        const x2 = left + pl + tickCoords[i + 2] * (width - pl - pr);
        const y2 = top + pt + tickCoords[i + 3] * (height - pt - pb);
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
      }
      ctx.strokeStyle = state.axisColor;
      ctx.stroke();
      ctx.closePath();
    }
    // draw axis
    if (state.coordinate.axis && state.axisColor) {
      const axisCoords = state.opposite.coordinate.getCoords([state.coordinate.axisOrigin], state.opposite);
      ctx.lineWidth = state.axisWidth / 2;
      const x1 = left + pl + clamp(axisCoords[0], 0, 1) * (width - pr - pl);
      const y1 = top + pt + clamp(axisCoords[1], 0, 1) * (height - pt - pb);
      const x2 = left + pl + clamp(axisCoords[2], 0, 1) * (width - pr - pl);
      const y2 = top + pt + clamp(axisCoords[3], 0, 1) * (height - pt - pb);
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = state.axisColor;
      ctx.stroke();
      ctx.closePath();
    }
    // draw state.labels
    this.drawLabels(state);
  }
  drawLabels(state) {
    if (state.labels) {
      const ctx = this.context;
      const [width, height] = state.shape;
      const [pt, pr, pb, pl] = state.padding;
      ctx.font = `300 ${state.fontSize}px ${state.fontFamily}`;
      ctx.fillStyle = state.labelColor;
      ctx.textBaseline = 'top';
      const textHeight = state.fontSize;
      const indent = state.axisWidth + 1.5;
      const textOffset = state.tickAlign < 0.5 ? -textHeight - state.axisWidth * 2 : state.axisWidth * 2;
      const isOpp = state.coordinate.orientation === 'y' && !state.opposite.disabled;
      for (let i = 0; i < state.labels.length; i += 1) {
        let label = state.labels[i];
        if (label == null) continue;
        if (isOpp && almost(state.lines[i], state.opposite.coordinate.axisOrigin)) continue;
        const textWidth = ctx.measureText(label).width;
        let textLeft = state.labelCoords[i * 2] * (width - pl - pr) + indent + pl;
        if (state.coordinate.orientation === 'y') {
          textLeft = clamp(textLeft, indent, width - textWidth - 1 - state.axisWidth);
          label *= -1;
        }
        let textTop = state.labelCoords[i * 2 + 1] * (height - pt - pb) + textOffset + pt;
        if (state.coordinate.orientation === 'x') {
          textTop = clamp(textTop, 0, height - textHeight - textOffset);
        }
        ctx.fillText(label, textLeft, textTop);
      }
    }
  }
}

// Re-export Point class and factory function from fabric-layers for backward compatibility

// Extend the Point class to maintain any custom methods from the React version
class Point extends Point$1 {
  copy(point) {
    this.x = point.x;
    this.y = point.y;
    return this;
  }
  getArray() {
    return [this.x, this.y];
  }
}

/**
 * Group - React extension of the core Group class
 * 
 * Provides grouping functionality for fabric objects with React integration
 */
class Group extends Group$1 {
  constructor(objects, options) {
    options = options || {};
    super(objects, options);
  }
  getBounds() {
    const coords = [];
    coords.push(new Point$1(this.left - this.width / 2.0, this.top - this.height / 2.0));
    coords.push(new Point$1(this.left + this.width / 2.0, this.top + this.height / 2.0));
    return coords;
  }
}

/**
 * Layer - React extension of the core Layer class
 *
 * Provides the fundamental properties and methods for manipulating layers
 * within a coordinate plane or canvas, with React-specific enhancements.
 *
 * @class
 * @extends {CoreLayer}
 */
class Layer extends Layer$1 {
  /**
   * Create a new layer
   *
   * @param {Object} options - Layer configuration options
   * @param {string} [options.label=null] - Display label for the layer
   * @param {boolean} [options.draggable=false] - Whether the layer can be dragged
   * @param {number} [options.zIndex=1] - Z-index for layer stacking order
   * @param {number} [options.opacity=1] - Layer opacity (0-1)
   * @param {boolean} [options.keepOnZoom=false] - Whether to maintain size when zooming
   * @param {boolean} [options.clickable=false] - Whether the layer responds to clicks
   * @param {string} [options.hoverCursor] - Cursor to display on hover
   * @param {string} [options.moveCursor='move'] - Cursor to display when moving
   * @param {string} [options.id] - Unique identifier for the layer
   * @param {string} [options.class] - CSS class name for the layer
   */
  constructor(options) {
    super(options);
    this.label = this.label !== undefined ? this.label : null;
    this.draggable = this.draggable || false;
    this.zIndex = this.zIndex || 1;
    this.opacity = this.opacity || 1;
    this.keepOnZoom = this.keepOnZoom || false;
    this.clickable = this.clickable || false;
    this.hoverCursor = this.hoverCursor || this.clickable ? 'pointer' : 'default';
    this.moveCursor = this.moveCursor || 'move';

    // this.class = this.class || this.constructor.name.toLowerCase();

    this.style = {
      zIndex: this.zIndex,
      class: this.class,
      parent: this,
      keepOnZoom: this.keepOnZoom,
      id: this.id,
      hasControls: false,
      hasBorders: false,
      lockMovementX: !this.draggable,
      lockMovementY: !this.draggable,
      draggable: this.draggable,
      clickable: this.clickable,
      evented: this.clickable,
      selectable: this.draggable,
      hoverCursor: this.hoverCursor,
      moveCursor: this.moveCursor
    };
  }
  setOptions(options) {
    if (!this.shape) return;
    Object.keys(options).forEach(key => {
      this.shape.set(key, options[key]);
    });
    if (this.shape.canvas) {
      this.shape.canvas.renderAll();
    }
  }
  addTo(map) {
    if (!map) {
      if (this._map) {
        this._map.removeLayer(this);
      }
      return;
    }
    this._map = map;
    this._map.addLayer(this);
  }
}

// Import core constants from fabric-layers
({
  position: new Point$1()});
const ICON = {
  url: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAy8SURBVHhe7Z1r1BVVGcdn5n0hQZMyL62VEGmIN4xqhaV2QQwE0cxLSHbRMsH6nvVdQEWgPpUo0kUDQQGt5eqLIaho2jKF1irAoEi8QEtdXApEV/2e2SPC4Zl59z5n5szl7P9af877cp7/s/d+nnln9uzZe0/QQPTDEfC8IAivCYLoh/x8J1zF7+v4fQvcAXfBAwnlZ/k/vhMbsQ0W8jvacLrxFfsU3x4Vw6kk6Wo+F8DVJG0bfDsMov/lSfFpfAePmbLCr5myPbqN95OIi/mcx+dzcJ+WsG5QyjZ1CObzOZnPY6WCHvnjKAI8lc9FfG7TklEFUrd/JXWUulJnj05xJryFgG7WAl5lUucXqfuspA0ebggn8M8KgviWFtw6kTbQyQxW0qaL4qZ5ZCG6jECt0QLZBNK2tbTxK0ljPd5DOAmu1oLWRNJW7iTijmzP42z4gBakXiBtfxCOkUD0GoZAOkjRf7TA9BKJwX+JxWw4VALTA5DOUPSCFoyiKAcafBn+hQo8AX8PH4LLEsrP8n98JzaxbVcPTspbT2wmUofGYjCcqzU+TxLILZTzMJxDQK8Ngj4Zxv0oPAaGcCCIjdiiEa34EF/iM9qilZknKWcelFg1CucQyGe0BndK89caPBAF0Qw+x8IiB2DEN2XEZS2XsrU6dUpi9Sz+PyEFNgDyMCXapTW0XeLvFRwv5lNuqT4QF1MOhlEHbl3juuR6MOBvN7H7uimmvpijNa5dEhBuFcPr8XuccV8pUCepW763s/i91bivF94H79ca5Er+EmQkbSn8gjiuCT4Pl1D3XEYy8SUd1do8WzgBrtUa4kr83Avlul5XyHX81xwI72jtcyF+HocnitMq4yM0tuNbPPyshp+LPTYDn4UdXxqILbeKwfDYYwUxkgpu1CpuS/Qv05u/MfHXQEjbOussot+Eo1OMv+pA/vI3aRW2JT4Wwg/H3pqNk+CdWgxsSaw34+Pk2FsFcDwVWq9V1IZo/03Pflriq4cgU8qinVpMbIh2A06kv1Uq6O2HT2oVtCF66dicFnvqTYyCbXeYib1MYC317qDtWz20MuTpZ9kGQR+8Q4uRDdEuj72UgLYHeejo/SDx4XEQ0U1arGyI+Dbjo2sIp2kVGYg0cn9vXu9tEfcLiJEevyyilfULXcGZVHK3VoksonmDSn458eGRivhx+etaDLOIZg9imWBTKAZR0HNaBbKI5k20MhjiYYdxEjMtlllE8zzaQh8lO3dWqNR+dH5GrDsuJHbOi17QzTfy/PElrcCBGS+h8mgL4dV6TLOJcLzR5wfu96O/aoVlkd7+9xO9R9uIZmqxzSKajQhzHR+YpRWURTSFnYp6EG1ceuNpbLlgtFzHtULSyKlLRqhkgMMjH0TE1GnEVXKG7nQj7wwPaQWkkYK53Qs+ZqQeOYKYut0eovmtkbaNcILmOItc969MxB65I7pCi3kWyWEnYy+upx1ZGu1RMO7SYp9GcvhUonNFdInmMI3Y70B0vNF6FIgPEevXtBykEftLE60Lwqc0Z+kMb0iEHoUj/I6eA53Y/zER2iL8ouYojdjLciuPriJ8XMtFGrF3Ghyy7vlzenkb+08bmUcX8UmJvZYTjdhb3xGMwvEBzYlG7JcYmUcJuE/LiUbJKfajjSwbt2gONOL0Lez9Hjjl4QxyYD1Ih70sQ8+EjPn/QxNrxF5WrHiUi6VabjSS239in/WMILpYE6YRgX/GXz7O1XKTRnI8JdGpWKSJNPqef5UQWs8sxnix0RyJYzg6XtFEOsPrEp1H6Qi/pefoSJLjVxHIBhitCCdqAo04kVE/vy1qdSDb51qPDmKr7lBm/cwZ218YiUeFsFjLlUZs1bkaf9aMNXIEyV64HpVCNEXLlUaMZfLoYfslycpeq/tJ7OT0r11DPMrF0eTG6jKAnYzfHLrCOLpKM9SI8Qqj8aggrDfd5AQg71g4iPmakcYoiGYmGo/KIbpRy5lGjH9iNAaPaUYag6C/KduXNRD9YzgIrLajwXit0cQrdKOXNKNWYidDibIBlEc1MZgcWQ3lY7cd+0EiGs4vVo8Vse10kqFH8bB6lC85x1Z2UA3O0ww0YpvbXHOPwmC9hgNb2c7Ofqk3trXfubL5CKdrudMotgiim7UvNQZBn3/6V3n0Wz8dJPc/FoXVjlUYy772I0XgUWmMkFxpOWwltrIzW7BK+7KVOJVe49Ei8Kg0hpIry7u6+D0J4Trty1biVF62YLPfvke5IEfRBi2HrcRUFo3YvQQBwydj9x51gNWUcck9ttEO7ctWYiivVPGoBx7RcthKcr8TW7uXOWAo1wuPemCllsNWSu6xtVsDgKGfAVwfWM0Ultxj6w+ABsLpAPCXgObB6RLgO4HNg1Mn0N8GNg+2t4FbsbXbBwBjPxBUD7gMBD0tAj8U3Cy4DgU7PQyKJxB4VBouD4Pugv5xcLPQP07LnUZyL4+D/YSQZiG8RsudRmxlQkjf+dqXGjEecIMBj9LhsMFHn0wJc5oUKq9l96g2bDv1ByeF+mnhzYFMC9+q5a6V2B2cFi5wWBgSnGMkHhVEWwtDBNZLwyhgRqLxqBzaXhrmF4c2BC6LQw97k4vL8vDXsPfLw6sHWR7+qpazVmLXujxcELlsEHFJIvKoDKLJWq40YvsCgiOe6/gtYuqNe7RcacRW2yImnKQZa+QI8ptEVQu5bBLltE0cB8y3E51H6Qi/qeVIoxwoCDhgdDicRkJ59btHJRCu0XKkEeOsy7d9R0KI4Fyj8ygR1k//hOQ4swN/FAZ+s+h6YYmWG43kdhv2Q4wsHQ4bDMT3k2cYmUcJOJ0cuGwXb7XBx2k4dXlhxG+MzKME3KvlRCM5lad/1i+SfFhzojFx/Ckj8+gixjr+of7OyKwQOr0p3N8RlAH7LeKF2F+YCG0RPq05SiP2302EHoUjvF7LQRqxfyYRuiCaqjlLI/YywOBfHFk8jpNYazlII/aXJVpX2O0e8i4R3G10HgVioRb7NMqZPNG1g/AizWkWOdquSMQeuSO6XIt5FslhJy+PjmF9RyCkkq+j8a+Pzx8yZ8P19fEuPf9UjKZg68EGIUedLCSNjNwjBxDL8Akt1mlEkusg3WytkCyimWekHjlgrhbjLKK51UjzgTwj+JtWUBbR+HcLdIxohhbbLKLZiDDrBZFtYbxW2EDk1HXYmyk8XBBdqcV0ICJ0HfSxxjytwCzSiP3oCqtQgzGe2O3TYppFdAuMvBgMolLWk0ffJZo30Y4zLjws8Bli9oYWyyyikcmeg42L4nAWBe3RKpBFaZCMKyQ+PFIRTiBWTrd7QjR7EY8xPgqH/RLkQ0kluRz4PkE6oqug82nfsPtL92/TKzIwaeRNiQ+Pg4hmarGyIeK5xkf3sVyrkA3R3gH7Yi+9DYnB7VqMbIj2wdhLSeBe0+2B0aFEvwaOij31Jj4OrVdmt5LYy3bvA87xKxoncPqy2pZMI9qdvdkviK/3Vpt0akQr2/adaHyVj5Op0GatorbEx8/hSbG3ZkOS9jMtBrYk1i/iY3jsrUI4hYpt0ipsS/TbORvckPhrIKRt0Xat7bZMkn+q8Vc9yH5D67WKuxA/f4BNWnQig2CPam11IbGV0/6I2GOFIac4q71qs0hj38HPr2Cd31Us2+n8krZYbcKVRfzII/baXCLlSdQyrSGuJHjyXFvWHlwgjmuC8+F91N1pHkUa8bUclt7bbwdtDxZpJKCPch29Dr8fNO4rBeokK6ajjk/1hxK/txv3tUV4LUHZrTWuXeJPtjhbxOelfA6LiykHx1KHqXxKXTrq3LUSf3vCIPyGKab+4DoePqs1tFMmB8My/H/PlFPoPobim+t6XNb9lG21v6Ir8fsn/I+VApsECZ7zfAJXEry/U45sgz6LRE1PNriWnrNsdW/zvgOxEVs0oo3308VXsEp8a2XmScqR5/lN3owznEggO75VdCHl7YUvwQ1UQJaxPQJXwqUJ5Wf5P74Tm9h2r+arKFIet3jhJOrQExgK59Boq33tm0xisI9YyAROiUnPQe6TV2iB6QXSdjnz1HmcIy9Ekzn9tf1UrG6krWto85Sk8R7vIbqc4HQ8ilhVStto41eTxnqkI17PJr1u6w0QqkraIBtocFcinV8PV5wFZxPEwm+/8qbU2dQ9OFsa4tEZhhBQGfW7h89CBl/yoNSNOi7mU9bj13Lsvg4YRoClA7WAz+dhLg9c2qGUbeoge+/HdSpzWLpnMYrr6zQ+fwqldy2DOFZvzXCh+DS+4zdtUFZcZi/PZ6wsZGWMvAzpApIkD6Ju5md5QaJ0xNbx+xa4A+6CBxLKz/J/W7GRiZYylIwm+pHxET+KHgkLX3XTXQTB/wEErHoK8OgOXgAAAABJRU5ErkJggg==',
  size: [128, 128],
  anchor: [64, 64]
};
fabric.Object.prototype.originX = 'center';
fabric.Object.prototype.originY = 'center';
fabric.Object.prototype.lockUniScaling = true;
fabric.Object.prototype.lockScalingFlip = true;
fabric.Object.prototype.transparentCorners = false;
fabric.Object.prototype.centeredScaling = true;
// fabric.Object.prototype.cornerStyle = 'circle';
fabric.Object.prototype.cornerColor = 'blue';
fabric.Object.prototype.borderColor = 'blue';
fabric.Object.prototype.borderOpacity = 0.7;
fabric.Object.prototype.cornerOpacity = 0.7;
fabric.Object.prototype.cornerStrokeColor = 'blue';
fabric.Object.prototype.borderColor = '#ff0099';
fabric.Object.prototype.cornerColor = '#00eaff';
fabric.Object.prototype.cornerStrokeColor = '#00bbff';
fabric.Object.prototype.objectCaching = false;
fabric.Group.prototype.objectCaching = true;
fabric.Group.prototype.selectionBackgroundColor = 'rgba(45,207,171,0.25)';
fabric.Object.prototype.borderDashArray = [3, 3];
fabric.Object.prototype.padding = 5;
fabric.Object.prototype.getBounds = function getBounds() {
  const coords = [];
  coords.push(new Point$1(this.left - this.width / 2.0, this.top - this.height / 2.0));
  coords.push(new Point$1(this.left + this.width / 2.0, this.top + this.height / 2.0));
  return coords;
};

function _defineProperty(e, r, t) {
  return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
    value: t,
    enumerable: true,
    configurable: true,
    writable: true
  }) : e[r] = t, e;
}
function ownKeys(e, r) {
  var t = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e);
    r && (o = o.filter(function (r) {
      return Object.getOwnPropertyDescriptor(e, r).enumerable;
    })), t.push.apply(t, o);
  }
  return t;
}
function _objectSpread2(e) {
  for (var r = 1; r < arguments.length; r++) {
    var t = null != arguments[r] ? arguments[r] : {};
    r % 2 ? ownKeys(Object(t), true).forEach(function (r) {
      _defineProperty(e, r, t[r]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) {
      Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
    });
  }
  return e;
}
function _objectWithoutProperties(e, t) {
  if (null == e) return {};
  var o,
    r,
    i = _objectWithoutPropertiesLoose(e, t);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]);
  }
  return i;
}
function _objectWithoutPropertiesLoose(r, e) {
  if (null == r) return {};
  var t = {};
  for (var n in r) if ({}.hasOwnProperty.call(r, n)) {
    if (-1 !== e.indexOf(n)) continue;
    t[n] = r[n];
  }
  return t;
}
function _toPrimitive(t, r) {
  if ("object" != typeof t || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r);
    if ("object" != typeof i) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == typeof i ? i : i + "";
}

const _excluded = ["style", "className"];

/**
 * CanvasLayer - A specialized layer for canvas-based content with React integration
 * This extends the core CanvasLayer with React-specific functionality
 */
class CanvasLayer extends CanvasLayer$1 {
  constructor(props) {
    super(props);
    this.canvasRef = React.createRef();
  }

  /**
   * Initialize the canvas context
   */
  initCanvas() {
    if (this.canvasRef.current) {
      this.ctx = this.canvasRef.current.getContext('2d');
    }
  }

  /**
   * Clear the canvas
   */
  clearCanvas() {
    if (this.ctx && this.canvasRef.current) {
      this.ctx.clearRect(0, 0, this.canvasRef.current.width, this.canvasRef.current.height);
    }
  }

  /**
   * Resize the canvas to match parent dimensions
   */
  resizeCanvas() {
    if (this.canvasRef.current && this.canvasRef.current.parentElement) {
      const parent = this.canvasRef.current.parentElement;
      this.canvasRef.current.width = parent.clientWidth;
      this.canvasRef.current.height = parent.clientHeight;
    }
  }

  /**
   * Component lifecycle method - after mounting
   */
  componentDidMount() {
    super.componentDidMount();
    this.initCanvas();
    this.resizeCanvas();
    window.addEventListener('resize', this.resizeCanvas.bind(this));
  }

  /**
   * Component lifecycle method - before unmounting
   */
  componentWillUnmount() {
    super.componentWillUnmount();
    window.removeEventListener('resize', this.resizeCanvas.bind(this));
  }

  /**
   * Render method
   */
  render() {
    const _this$props = this.props,
      {
        style,
        className
      } = _this$props,
      otherProps = _objectWithoutProperties(_this$props, _excluded);
    return React.createElement('div', {
      className,
      style: _objectSpread2({
        position: 'absolute',
        width: '100%',
        height: '100%'
      }, style)
    }, React.createElement('canvas', _objectSpread2(_objectSpread2({
      ref: this.canvasRef
    }, otherProps), {}, {
      style: {
        display: 'block',
        width: '100%',
        height: '100%'
      }
    })));
  }
}

class Line extends fabric.Line {
  constructor(points, options) {
    options = options || {};
    options.strokeWidth = options.strokeWidth || 1;
    options.class = 'line';
    super(points, options);
    this._strokeWidth = options.strokeWidth;
  }
  _renderStroke(ctx) {
    const stroke = this._strokeWidth / this.canvas.getZoom();
    this.strokeWidth = stroke > 0.01 ? stroke : 0.01;
    super._renderStroke(ctx);
    this.setCoords();
  }
}
const line = (points, options) => new Line(points, options);

/**
 * Connector - React extension of the core Connector class
 * 
 * Provides connection functionality between layer objects with React integration
 */
class Connector extends Connector$1 {
  constructor(start, end, options) {
    options = options || {};
    options.zIndex = options.zIndex || 10;
    options.class = 'connector';
    super(options);
    if (!start || !end) {
      console.error('start or end is missing');
      return;
    }
    this.start = start;
    this.end = end;
    this.strokeWidth = this.strokeWidth || 1;
    Object.assign(this.style, {
      strokeWidth: this.strokeWidth,
      stroke: this.color || 'grey',
      fill: this.fill || false,
      selectable: false
    });
    this.draw();
    this.registerListeners();
  }
  registerListeners() {
    const vm = this;
    this.start.on('update:links', () => {
      vm.shape.set({
        x1: vm.start.position.x,
        y1: vm.start.position.y
      });
    });
    this.end.on('update:links', () => {
      vm.shape.set({
        x2: vm.end.position.x,
        y2: vm.end.position.y
      });
    });
  }
  draw() {
    this.shape = new Line([this.start.position.x, this.start.position.y, this.end.position.x, this.end.position.y], this.style);
    // this.shape.setCoords();
  }
  redraw() {
    this.shape.set({
      x1: this.start.position.x,
      y1: this.start.position.y,
      x2: this.end.position.x,
      y2: this.end.position.y
    });
  }
  setStart(start) {
    this.start = start;
    this.redraw();
  }
  setEnd(end) {
    this.end = end;
    this.redraw();
  }
  setColor(color) {
    this.color = color;
    this.style.stroke = color;
    this.shape.set('stroke', color);
    if (this.shape.canvas) {
      this.shape.canvas.renderAll();
    }
  }
  setStrokeWidth(strokeWidth) {
    this.strokeWidth = strokeWidth;
    this.style.strokeWidth = strokeWidth;
    this.shape.set('strokeWidth', strokeWidth);
    if (this.shape.canvas) {
      this.shape.canvas.renderAll();
    }
  }
}

class Tooltip extends Layer {
  constructor(position, options) {
    options = options || {};
    options.zIndex = options.zIndex || 300;
    options.keepOnZoom = true;
    options.position = new Point(position);
    options.class = 'tooltip';
    super(options);
    this.content = this.content || '';
    this.size = this.size || 10;
    this.textColor = this.textColor || 'black';
    this.fill = this.fill || 'white';
    this.stroke = this.stroke || 'red';
    Object.assign(this.style, {
      left: this.position.x,
      top: this.position.y
    });
    if (this.content) {
      this.textObj = new fabric.Text(this.content, {
        fontSize: this.size,
        fill: this.textColor
      });
    }
    this.init();
  }
  init() {
    const objects = [];
    if (this.textObj) {
      objects.push(this.textObj);
    }
    this.shape = new Group(objects, this.style);
    nextTick(() => {
      this.emit('ready');
    });
  }
}

class Marker extends Layer {
  constructor(position, options) {
    options = options || {};
    options.zIndex = options.zIndex || 100;
    options.keepOnZoom = options.keepOnZoom === undefined ? true : options.keepOnZoom;
    options.position = new Point(position);
    options.rotation = options.rotation || 0;
    options.yaw = options.yaw || 0;
    options.clickable = options.clickable !== undefined ? options.clickable : true;
    options.class = 'marker';
    super(options);
    const vm = this;
    this.text = this.text || '';
    this.size = this.size || 10;
    this.textColor = this.textColor || 'black';
    this.fill = this.fill || 'white';
    this.stroke = this.stroke || 'red';
    Object.assign(this.style, {
      left: this.position.x,
      top: this.position.y,
      // selectionBackgroundColor: false,
      angle: this.rotation,
      yaw: this.yaw,
      clickable: this.clickable
    });
    if (this.text) {
      this.textObj = new fabric.Text(this.text, {
        fontSize: this.size,
        fill: this.textColor
      });
    }
    if (this.icon) {
      fabric.Image.fromURL(this.icon.url, image => {
        vm.image = image.scaleToWidth(this.size);
        this.init();
        // vm.shape.removeWithUpdate();
      }, {
        selectable: false,
        evented: this.evented,
        clickable: this.clickable,
        opacity: this.opacity
      });
    } else {
      this.circle = new fabric.Circle({
        radius: this.size,
        strokeWidth: 2,
        stroke: this.stroke,
        fill: this.fill
      });
      this.init();
    }
  }
  init() {
    const objects = [];
    if (this.image) {
      objects.push(this.image);
    }
    if (this.circle) {
      objects.push(this.circle);
    }
    if (this.textObj) {
      objects.push(this.textObj);
    }
    this.shape = new Group(objects, this.style);
    this.links = this.links || [];
    this.addLinks();
    this.registerListeners();
    nextTick(() => {
      this.emit('ready');
    });
  }
  registerListeners() {
    const vm = this;
    this.shape.on('moving', () => {
      vm.onShapeDrag();
    });
    this.shape.on('rotating', () => {
      vm.emit('rotating');
    });
    this.shape.on('mousedown', e => {
      vm.onShapeMouseDown(e);
    });
    this.shape.on('mousemove', e => {
      vm.onShapeMouseMove(e);
    });
    this.shape.on('mouseup', e => {
      vm.onShapeMouseUp(e);
    });
    this.shape.on('mouseover', () => {
      vm.emit('mouseover', vm);
    });
    this.shape.on('mouseout', () => {
      vm.emit('mouseout', vm);
    });
  }
  setPosition(position) {
    this.position = new Point(position);
    if (!this.shape) return;
    this.shape.set({
      left: this.position.x,
      top: this.position.y
    });
    this.emit('update:links');
    if (this.shape.canvas) {
      this.shape.canvas.renderAll();
    }
  }
  setRotation(rotation) {
    this.rotation = rotation;
    if (!this.shape) return;
    this.shape.set({
      angle: this.rotation
    });
    if (this.shape.canvas) {
      this.shape.canvas.renderAll();
    }
  }
  setOptions(options) {
    if (!this.shape) return;
    Object.keys(options).forEach(key => {
      switch (key) {
        case 'textColor':
          this.setTextColor(options[key]);
          break;
        case 'stroke':
          this.setStroke(options[key]);
          break;
        case 'fill':
          this.setColor(options[key]);
          break;
      }
    });
    if (this.shape.canvas) {
      this.shape.canvas.renderAll();
    }
  }
  setTextColor(color) {
    if (this.text && this.textObj) {
      this.textObj.setColor(color);
      this.textObj.canvas.renderAll();
    }
  }
  setText(text) {
    if (this.text && this.textObj) {
      this.textObj.set({
        text
      });
      this.textObj.canvas.renderAll();
    }
  }
  setStroke(color) {
    if (this.circle) {
      this.circle.set('stroke', color);
    }
  }
  setColor(color) {
    if (this.circle) {
      this.circle.setColor(color);
    }
  }
  setLinks(links) {
    this.links = links;
    this.addLinks();
  }
  setSize(size) {
    if (this.image) {
      this.image.scaleToWidth(size);
      if (this.image.canvas) {
        this.image.canvas.renderAll();
      }
    } else if (this.circle) {
      this.circle.setRadius(size);
    }
  }
  addLinks() {
    this.connectors = [];
    this.links.forEach(link => {
      const connector = new Connector(this, link);
      this.connectors.push(connector);
    });
    this.addConnectors();
  }
  addConnectors() {
    const vm = this;
    this.connectors.forEach(connector => {
      vm._map.addLayer(connector);
    });
  }
  onAdded() {
    this.addConnectors();
  }
  onShapeDrag() {
    const matrix = this.shape.calcTransformMatrix();
    const [,,,, x, y] = matrix;
    this.position = new Point(x, y);
    this.emit('update:links');
    this.emit('moving');
  }
  onShapeMouseDown(e) {
    this.dragStart = e;
  }
  onShapeMouseMove(e) {
    if (this.dragStart) {
      this.emit('dragstart');
      const a = new fabric.Point(e.pointer.x, e.pointer.y);
      const b = new fabric.Point(this.dragStart.pointer.x, this.dragStart.pointer.y);
      // if distance is far enough, we don't want to fire click event
      if (a.distanceFrom(b) > 3) {
        this.dragStart = null;
        this.dragging = true;
      }
    }
    if (this.dragging) {
      this.emit('drag');
    } else {
      this.emit('hover');
    }
  }
  onShapeMouseUp() {
    if (!this.dragging) {
      this.emit('click');
    } else {
      this.emit('moved');
    }
    this.dragStart = null;
    this.dragging = false;
  }
}
const marker = (position, options) => new Marker(position, options);

class Icon extends fabric.Image {
  constructor(options) {
    super(options);
    this.defaults = Object.assign({}, ICON);
    Object.assign({}, this.defaults);
    Object.assign({}, this._options);
  }
}
const icon = options => new Icon(options);

class Polyline extends Layer {
  constructor(_points, options) {
    options = options || {};
    options.points = _points || [];
    super(options);
    this.lines = [];
    this.class = 'polyline';
    this.strokeWidth = 1;
    this.lineOptions = {
      strokeWidth: this.strokeWidth,
      stroke: this.color || 'grey',
      fill: this.fill || false
    };
    this.shape = new Group([], {
      selectable: false,
      hasControls: false,
      class: this.class,
      parent: this
    });
    this.setPoints(this._points);
  }
  addPoint(point) {
    this.points.push(new Point(point));
    if (this.points.length > 1) {
      const i = this.points.length - 1;
      const j = this.points.length - 2;
      const p1 = this.points[i];
      const p2 = this.points[j];
      const line = new fabric.Line(p1.getArray().concat(p2.getArray()), this.lineOptions);
      this.lines.push(line);
      this.shape.addWithUpdate(line);
    }
  }
  setStrokeWidth(strokeWidth) {
    this.lines.forEach(line => {
      line.setStrokeWidth(strokeWidth);
    });
  }
  setPoints(points = []) {
    this.removeLines();
    this.points = [];
    for (let i = 0; i < points.length; i += 1) {
      const point = new Point(points[i]);
      this.points.push(point);
      this.addPoint();
    }
  }
  removeLines() {
    for (let i = 0; i < this.lines.length; i += 1) {
      this.shape.remove(this.lines[i]);
    }
    this.lines = [];
  }
}
const polyline = (points, options) => new Polyline(points, options);

class Circle extends fabric.Circle {}
const circle = options => new Circle(options);

class Rect extends fabric.Rect {
  constructor(points, options) {
    options = options || {};
    options.strokeWidth = options.strokeWidth || 1;
    options.class = 'rect';
    super(points, options);
    this._strokeWidth = options.strokeWidth;
  }
  _renderStroke(ctx) {
    this.strokeWidth = this._strokeWidth / this.canvas.getZoom();
    super._renderStroke(ctx);
  }
}
const rect = (points, options) => new Rect(points, options);

class MarkerGroup extends Layer {
  constructor(bounds, options) {
    options = options || {};
    options.bounds = bounds;
    options.zIndex = options.zIndex || 50;
    options.class = 'markergroup';
    super(options);
    if (!this.bounds) {
      console.error('bounds is missing!');
      return;
    }
    this.style = {
      strokeWidth: 1,
      stroke: this.stroke || 'black',
      fill: this.color || '#88888822',
      class: this.class,
      zIndex: this.zIndex,
      parent: this
    };
    this.draw();
  }
  setBounds(bounds) {
    this.bounds = bounds;
    this.draw();
  }
  draw() {
    const width = this.bounds[1][0] - this.bounds[0][0];
    const height = this.bounds[1][1] - this.bounds[0][1];
    this.coords = {
      left: this.bounds[0][0] + width / 2,
      top: this.bounds[0][1] + height / 2,
      width,
      height
    };
    if (this.shape) {
      this.shape.set(this.coords);
    } else {
      Object.assign(this.style, this.coords);
      this.shape = new Rect(this.style);
    }
  }
}
const markerGroup = (bounds, options) => new MarkerGroup(bounds, options);

class ArrowHead extends fabric.Triangle {
  constructor(points, options) {
    options = options || {};
    options.headLength = options.headLength || 10;
    options.stroke = options.stroke || '#207cca';
    const [x1, y1, x2, y2] = points;
    const dx = x2 - x1;
    const dy = y2 - y1;
    let angle = Math.atan2(dy, dx);
    angle *= 180 / Math.PI;
    angle += 90;
    if (options.lastAngle !== undefined) {
      angle = options.lastAngle;
      console.log(`Angle: ${angle}`);
    }
    super({
      angle,
      fill: options.stroke,
      top: y2,
      left: x2,
      height: options.headLength,
      width: options.headLength,
      originX: 'center',
      originY: 'center',
      selectable: false
    });
  }
}

class Arrow extends fabric.Group {
  constructor(point, options) {
    options = options || {};
    options.strokeWidth = options.strokeWidth || 5;
    options.stroke = options.stroke || '#7db9e8';
    options.class = 'arrow';
    super([], Object.assign(options, {
      evented: false
    }));
    this.pointArray = [point, Object.assign({}, point)];
    this.options = options;
    this.draw();
  }
  draw() {
    if (this.head) {
      this.remove(this.head);
    }
    if (this.polyline) {
      this.remove(this.polyline);
    }
    this.polyline = new fabric.Polyline(this.pointArray, Object.assign(this.options, {
      strokeLineJoin: 'round',
      fill: false
    }));
    this.addWithUpdate(this.polyline);
    const lastPoints = this.getLastPoints();
    const p1 = new fabric.Point(lastPoints[0], lastPoints[1]);
    const p2 = new fabric.Point(lastPoints[2], lastPoints[3]);
    const dis = p1.distanceFrom(p2);
    console.log(`dis = ${dis}`);
    this.head = new ArrowHead(lastPoints, Object.assign(this.options, {
      headLength: this.strokeWidth * 2,
      lastAngle: dis <= 10 ? this.lastAngle : undefined
    }));
    if (dis > 10) {
      this.lastAngle = this.head.angle;
    }
    this.addWithUpdate(this.head);
  }
  addPoint(point) {
    this.pointArray.push(point);
    this.draw();
  }
  addTempPoint(point) {
    const len = this.pointArray.length;
    const lastPoint = this.pointArray[len - 1];
    lastPoint.x = point.x;
    lastPoint.y = point.y;
    this.draw();
  }
  getLastPoints() {
    const len = this.pointArray.length;
    const point1 = this.pointArray[len - 2];
    const point2 = this.pointArray[len - 1];
    return [point1.x, point1.y, point2.x, point2.y];
  }
  setColor(color) {
    this._objects.forEach(obj => {
      obj.setColor(color);
    });
  }
}

/* eslint-disable no-unused-vars */
const Modes = {
  SELECT: 'select',
  DRAWING: 'drawing',
  ARROW: 'arrow',
  TEXT: 'text'
};
class Canvas extends Base {
  constructor(container, options) {
    super(options);
    this.container = container;
    const canvas = document.createElement('canvas');
    this.container.appendChild(canvas);
    canvas.setAttribute('id', 'fabric-layers-canvas');
    canvas.width = this.width || this.container.clientWidth;
    canvas.height = this.height || this.container.clientHeight;
    this.currentColor = this.currentColor || 'black';
    this.fontFamily = this.fontFamily || 'Roboto';
    this.canvas = new fabric.Canvas(canvas, {
      freeDrawingCursor: 'none',
      freeDrawingLineWidth: this.lineWidth
    });
    this.arrows = [];
    this.setLineWidth(this.lineWidth || 10);
    this.addCursor();
    this.addListeners();
    this.setModeAsArrow();
  }
  setModeAsDrawing() {
    this.mode = Modes.DRAWING;
    this.canvas.isDrawingMode = true;
    this.canvas.selection = false;
    this.onModeChanged();
  }
  isDrawingMode() {
    return this.mode === Modes.DRAWING;
  }
  setModeAsSelect() {
    this.mode = Modes.SELECT;
    this.canvas.isDrawingMode = false;
    this.canvas.selection = true;
    this.onModeChanged();
  }
  isSelectMode() {
    return this.mode === Modes.SELECT;
  }
  setModeAsArrow() {
    this.mode = Modes.ARROW;
    this.canvas.isDrawingMode = false;
    this.canvas.selection = false;
    this.onModeChanged();
  }
  isArrowMode() {
    return this.mode === Modes.ARROW;
  }
  setModeAsText() {
    this.mode = Modes.TEXT;
    this.canvas.isDrawingMode = false;
    this.canvas.selection = false;
    this.onModeChanged();
  }
  isTextMode() {
    return this.mode === Modes.TEXT;
  }
  onModeChanged() {
    this.updateCursor();
    this.emit('mode-changed', this.mode);
    this.canvas._objects.forEach(obj => {
      obj.evented = this.isSelectMode();
    });
  }
  addListeners() {
    const canvas = this.canvas;
    canvas.on('mouse:move', evt => {
      const mouse = canvas.getPointer(evt.e);
      if (this.mousecursor) {
        this.mousecursor.set({
          top: mouse.y,
          left: mouse.x
        }).setCoords().canvas.renderAll();
      }
      if (this.isTextMode()) {
        console.log('text');
      } else if (this.isArrowMode()) {
        if (this.activeArrow) {
          this.activeArrow.addTempPoint(mouse);
        }
        this.canvas.requestRenderAll();
      }
    });
    canvas.on('mouse:out', () => {
      // put circle off screen
      if (!this.mousecursor) return;
      this.mousecursor.set({
        left: -1e3,
        top: -1e3
      }).setCoords();
      this.cursor.renderAll();
    });
    canvas.on('mouse:up', event => {
      if (canvas.mouseDown) {
        canvas.fire('mouse:click', event);
      }
      canvas.mouseDown = false;
    });
    canvas.on('mouse:move', event => {
      canvas.mouseDown = false;
    });
    canvas.on('mouse:down', event => {
      canvas.mouseDown = true;
    });
    canvas.on('mouse:click', event => {
      console.log('mouse click', event);
      const mouse = canvas.getPointer(event.e);
      if (event.target) return;
      if (this.isTextMode()) {
        const text = new fabric.IText('Text', {
          left: mouse.x,
          top: mouse.y,
          width: 100,
          fontSize: 20,
          fontFamily: this.fontFamily,
          lockUniScaling: true,
          fill: this.currentColor,
          stroke: this.currentColor
        });
        canvas.add(text).setActiveObject(text).renderAll();
        this.setModeAsSelect();
      } else if (this.isArrowMode()) {
        console.log('arrow mode');
        if (this.activeArrow) {
          this.activeArrow.addPoint(mouse);
        } else {
          this.activeArrow = new Arrow(mouse, {
            stroke: this.currentColor,
            strokeWidth: this.lineWidth
          });
          this.canvas.add(this.activeArrow);
        }
        this.canvas.requestRenderAll();
      }
    });
    canvas.on('mouse:dblclick', event => {
      console.log('mouse:dbclick');
      if (this.isArrowMode() && this.activeArrow) {
        this.arrows.push(this.activeArrow);
        this.activeArrow = null;
      }
    });
    canvas.on('selection:created', event => {
      this.emit('selected');
    });
    canvas.on('selection:cleared', event => {
      this.emit('unselected');
    });
  }
  removeSelected() {
    this.canvas.remove(this.canvas.getActiveObject());
    this.canvas.getActiveObjects().forEach(obj => {
      this.canvas.remove(obj);
    });
    this.canvas.discardActiveObject().renderAll();
  }
  updateCursor() {
    if (!this.cursor) return;
    const canvas = this.canvas;
    if (this.mousecursor) {
      this.cursor.remove(this.mousecursor);
      this.mousecursor = null;
    }
    const cursorOpacity = 0.3;
    let mousecursor = null;
    if (this.isDrawingMode()) {
      mousecursor = new fabric.Circle({
        left: -1e3,
        top: -1e3,
        radius: canvas.freeDrawingBrush.width / 2,
        fill: `rgba(255,0,0,${cursorOpacity})`,
        stroke: 'black',
        originX: 'center',
        originY: 'center'
      });
    } else if (this.isTextMode()) {
      mousecursor = new fabric.Path('M0,-10 V10', {
        left: -1e3,
        top: -1e3,
        radius: canvas.freeDrawingBrush.width / 2,
        fill: `rgba(255,0,0,${cursorOpacity})`,
        stroke: `rgba(0,0,0,${cursorOpacity})`,
        originX: 'center',
        originY: 'center',
        scaleX: 1,
        scaleY: 1
      });
    } else {
      mousecursor = new fabric.Path('M0,-10 V10 M-10,0 H10', {
        left: -1e3,
        top: -1e3,
        radius: canvas.freeDrawingBrush.width / 2,
        fill: `rgba(255,0,0,${cursorOpacity})`,
        stroke: `rgba(0,0,0,${cursorOpacity})`,
        originX: 'center',
        originY: 'center'
      });
    }
    if (this.isSelectMode()) {
      mousecursor = null;
      this.canvas.defaultCursor = 'default';
    } else {
      this.canvas.defaultCursor = 'none';
    }
    if (mousecursor) {
      this.cursor.add(mousecursor);
    }
    this.mousecursor = mousecursor;
  }
  addCursor() {
    const canvas = this.canvas;
    const cursorCanvas = document.createElement('canvas');
    this.canvas.wrapperEl.appendChild(cursorCanvas);
    cursorCanvas.setAttribute('id', 'fabric-layers-cursor-canvas');
    cursorCanvas.style.position = 'absolute';
    cursorCanvas.style.top = '0';
    cursorCanvas.style.pointerEvents = 'none';
    cursorCanvas.width = this.width || this.container.clientWidth;
    cursorCanvas.height = this.height || this.container.clientHeight;
    this.cursorCanvas = cursorCanvas;
    canvas.defaultCursor = 'none';
    this.cursor = new fabric.StaticCanvas(cursorCanvas);
    this.updateCursor();
  }
  setColor(color) {
    this.currentColor = color;
    this.canvas.freeDrawingBrush.color = color;
    const obj = this.canvas.getActiveObject();
    if (obj) {
      obj.set('stroke', color);
      obj.set('fill', color);
      this.canvas.requestRenderAll();
    }
    if (!this.mousecursor) return;
    this.mousecursor.set({
      left: 100,
      top: 100,
      fill: color
    }).setCoords().canvas.renderAll();
  }
  setLineWidth(width) {
    this.lineWidth = width;
    this.canvas.freeDrawingBrush.width = width;
    if (!this.mousecursor) return;
    this.mousecursor.set({
      left: 100,
      top: 100,
      radius: width / 2
    }).setCoords().canvas.renderAll();
  }
  setFontFamily(family) {
    this.fontFamily = family;
    const obj = this.canvas.getActiveObject();
    if (obj && obj.type === 'i-text') {
      obj.set('fontFamily', family);
      this.canvas.requestRenderAll();
    }
  }
  clear() {
    this.arrows = [];
    this.canvas.clear();
  }
}

const isNum = function (val) {
  return typeof val === 'number' && !isNaN(val);
};
var evPos = (ev, toElement) => {
  toElement = toElement || ev.currentTarget;
  const toElementBoundingRect = toElement.getBoundingClientRect();
  const orgEv = ev.originalEvent || ev;
  const hasTouches = ev.touches && ev.touches.length;
  let pageX = 0;
  let pageY = 0;
  if (hasTouches) {
    if (isNum(ev.touches[0].pageX) && isNum(ev.touches[0].pageY)) {
      pageX = ev.touches[0].pageX;
      pageY = ev.touches[0].pageY;
    } else if (isNum(ev.touches[0].clientX) && isNum(ev.touches[0].clientY)) {
      pageX = orgEv.touches[0].clientX;
      pageY = orgEv.touches[0].clientY;
    }
  } else if (isNum(ev.pageX) && isNum(ev.pageY)) {
    pageX = ev.pageX;
    pageY = ev.pageY;
  } else if (ev.currentPoint && isNum(ev.currentPoint.x) && isNum(ev.currentPoint.y)) {
    pageX = ev.currentPoint.x;
    pageY = ev.currentPoint.y;
  }
  let isRight = false;
  if ('which' in ev) {
    // Gecko (Firefox), WebKit (Safari/Chrome) & Opera
    isRight = ev.which == 3;
  } else if ('button' in ev) {
    // IE, Opera
    isRight = ev.button == 2;
  }
  return {
    x: pageX - toElementBoundingRect.left,
    y: pageY - toElementBoundingRect.top,
    isRight
  };
};

const stopThresholdDefault = 0.3;
const bounceDeceleration = 0.04;
const bounceAcceleration = 0.11;

// fixes weird safari 10 bug where preventDefault is prevented
// @see https://github.com/metafizzy/flickity/issues/457#issuecomment-254501356
window.addEventListener('touchmove', () => {});
class Impetus {
  constructor({
    source: sourceEl = document,
    update: updateCallback,
    stop: stopCallback,
    multiplier = 1,
    friction = 0.92,
    initialValues,
    boundX,
    boundY,
    bounce = true
  }) {
    let boundXmin;
    let boundXmax;
    let boundYmin;
    let boundYmax;
    let pointerLastX;
    let pointerLastY;
    let pointerCurrentX;
    let pointerCurrentY;
    let pointerId;
    let decVelX;
    let decVelY;
    let targetX = 0;
    let targetY = 0;
    let stopThreshold = stopThresholdDefault * multiplier;
    let ticking = false;
    let pointerActive = false;
    let paused = false;
    let decelerating = false;
    let trackingPoints = [];

    /**
     * Initialize instance
     */
    (function init() {
      sourceEl = typeof sourceEl === 'string' ? document.querySelector(sourceEl) : sourceEl;
      if (!sourceEl) {
        throw new Error('IMPETUS: source not found.');
      }
      if (!updateCallback) {
        throw new Error('IMPETUS: update function not defined.');
      }
      if (initialValues) {
        if (initialValues[0]) {
          targetX = initialValues[0];
        }
        if (initialValues[1]) {
          targetY = initialValues[1];
        }
        callUpdateCallback();
      }

      // Initialize bound values
      if (boundX) {
        boundXmin = boundX[0];
        boundXmax = boundX[1];
      }
      if (boundY) {
        boundYmin = boundY[0];
        boundYmax = boundY[1];
      }
      sourceEl.addEventListener('touchstart', onDown);
      sourceEl.addEventListener('mousedown', onDown);
    })();

    /**
     * In edge cases where you may need to
     * reinstanciate Impetus on the same sourceEl
     * this will remove the previous event listeners
     */
    this.destroy = function () {
      sourceEl.removeEventListener('touchstart', onDown);
      sourceEl.removeEventListener('mousedown', onDown);
      cleanUpRuntimeEvents();

      // however it won't "destroy" a reference
      // to instance if you'd like to do that
      // it returns null as a convinience.
      // ex: `instance = instance.destroy();`
      return null;
    };

    /**
     * Disable movement processing
     * @public
     */
    this.pause = function () {
      cleanUpRuntimeEvents();
      pointerActive = false;
      paused = true;
    };

    /**
     * Enable movement processing
     * @public
     */
    this.resume = function () {
      paused = false;
    };

    /**
     * Update the current x and y values
     * @public
     * @param {Number} x
     * @param {Number} y
     */
    this.setValues = function (x, y) {
      if (typeof x === 'number') {
        targetX = x;
      }
      if (typeof y === 'number') {
        targetY = y;
      }
    };

    /**
     * Update the multiplier value
     * @public
     * @param {Number} val
     */
    this.setMultiplier = function (val) {
      multiplier = val;
      stopThreshold = stopThresholdDefault * multiplier;
    };

    /**
     * Update boundX value
     * @public
     * @param {Number[]} boundX
     */
    this.setBoundX = function (boundX) {
      boundXmin = boundX[0];
      boundXmax = boundX[1];
    };

    /**
     * Update boundY value
     * @public
     * @param {Number[]} boundY
     */
    this.setBoundY = function (boundY) {
      boundYmin = boundY[0];
      boundYmax = boundY[1];
    };

    /**
     * Removes all events set by this instance during runtime
     */
    function cleanUpRuntimeEvents() {
      // Remove all touch events added during 'onDown' as well.
      document.removeEventListener('touchmove', onMove, getPassiveSupported() ? {
        passive: false
      } : false);
      document.removeEventListener('touchend', onUp);
      document.removeEventListener('touchcancel', stopTracking);
      document.removeEventListener('mousemove', onMove, getPassiveSupported() ? {
        passive: false
      } : false);
      document.removeEventListener('mouseup', onUp);
    }

    /**
     * Add all required runtime events
     */
    function addRuntimeEvents() {
      cleanUpRuntimeEvents();

      // @see https://developers.google.com/web/updates/2017/01/scrolling-intervention
      document.addEventListener('touchmove', onMove, getPassiveSupported() ? {
        passive: false
      } : false);
      document.addEventListener('touchend', onUp);
      document.addEventListener('touchcancel', stopTracking);
      document.addEventListener('mousemove', onMove, getPassiveSupported() ? {
        passive: false
      } : false);
      document.addEventListener('mouseup', onUp);
    }

    /**
     * Executes the update function
     */
    function callUpdateCallback() {
      updateCallback.call(sourceEl, targetX, targetY);
    }

    /**
     * Creates a custom normalized event object from touch and mouse events
     * @param  {Event} ev
     * @returns {Object} with x, y, and id properties
     */
    function normalizeEvent(ev) {
      if (ev.type === 'touchmove' || ev.type === 'touchstart' || ev.type === 'touchend') {
        const touch = ev.targetTouches[0] || ev.changedTouches[0];
        return {
          x: touch.clientX,
          y: touch.clientY,
          id: touch.identifier
        };
      }
      // mouse events
      return {
        x: ev.clientX,
        y: ev.clientY,
        id: null
      };
    }

    /**
     * Initializes movement tracking
     * @param  {Object} ev Normalized event
     */
    function onDown(ev) {
      const event = normalizeEvent(ev);
      if (!pointerActive && !paused) {
        pointerActive = true;
        decelerating = false;
        pointerId = event.id;
        pointerLastX = pointerCurrentX = event.x;
        pointerLastY = pointerCurrentY = event.y;
        trackingPoints = [];
        addTrackingPoint(pointerLastX, pointerLastY);
        addRuntimeEvents();
      }
    }

    /**
     * Handles move events
     * @param  {Object} ev Normalized event
     */
    function onMove(ev) {
      ev.preventDefault();
      const event = normalizeEvent(ev);
      if (pointerActive && event.id === pointerId) {
        pointerCurrentX = event.x;
        pointerCurrentY = event.y;
        addTrackingPoint(pointerLastX, pointerLastY);
        requestTick();
      }
    }

    /**
     * Handles up/end events
     * @param {Object} ev Normalized event
     */
    function onUp(ev) {
      const event = normalizeEvent(ev);
      if (pointerActive && event.id === pointerId) {
        stopTracking();
      }
    }

    /**
     * Stops movement tracking, starts animation
     */
    function stopTracking() {
      pointerActive = false;
      addTrackingPoint(pointerLastX, pointerLastY);
      startDecelAnim();
      cleanUpRuntimeEvents();
    }

    /**
     * Records movement for the last 100ms
     * @param {number} x
     * @param {number} y [description]
     */
    function addTrackingPoint(x, y) {
      const time = Date.now();
      while (trackingPoints.length > 0) {
        if (time - trackingPoints[0].time <= 100) {
          break;
        }
        trackingPoints.shift();
      }
      trackingPoints.push({
        x,
        y,
        time
      });
    }

    /**
     * Calculate new values, call update function
     */
    function updateAndRender() {
      const pointerChangeX = pointerCurrentX - pointerLastX;
      const pointerChangeY = pointerCurrentY - pointerLastY;
      targetX += pointerChangeX * multiplier;
      targetY += pointerChangeY * multiplier;
      if (bounce) {
        const diff = checkBounds();
        if (diff.x !== 0) {
          targetX -= pointerChangeX * dragOutOfBoundsMultiplier(diff.x) * multiplier;
        }
        if (diff.y !== 0) {
          targetY -= pointerChangeY * dragOutOfBoundsMultiplier(diff.y) * multiplier;
        }
      } else {
        checkBounds(true);
      }
      callUpdateCallback();
      pointerLastX = pointerCurrentX;
      pointerLastY = pointerCurrentY;
      ticking = false;
    }

    /**
     * Returns a value from around 0.5 to 1, based on distance
     * @param {Number} val
     */
    function dragOutOfBoundsMultiplier(val) {
      return 0.000005 * Math.pow(val, 2) + 0.0001 * val + 0.55;
    }

    /**
     * prevents animating faster than current framerate
     */
    function requestTick() {
      if (!ticking) {
        requestAnimFrame(updateAndRender);
      }
      ticking = true;
    }

    /**
     * Determine position relative to bounds
     * @param {Boolean} restrict Whether to restrict target to bounds
     */
    function checkBounds(restrict) {
      let xDiff = 0;
      let yDiff = 0;
      if (boundXmin !== undefined && targetX < boundXmin) {
        xDiff = boundXmin - targetX;
      } else if (boundXmax !== undefined && targetX > boundXmax) {
        xDiff = boundXmax - targetX;
      }
      if (boundYmin !== undefined && targetY < boundYmin) {
        yDiff = boundYmin - targetY;
      } else if (boundYmax !== undefined && targetY > boundYmax) {
        yDiff = boundYmax - targetY;
      }
      if (restrict) {
        if (xDiff !== 0) {
          targetX = xDiff > 0 ? boundXmin : boundXmax;
        }
        if (yDiff !== 0) {
          targetY = yDiff > 0 ? boundYmin : boundYmax;
        }
      }
      return {
        x: xDiff,
        y: yDiff,
        inBounds: xDiff === 0 && yDiff === 0
      };
    }

    /**
     * Initialize animation of values coming to a stop
     */
    function startDecelAnim() {
      const firstPoint = trackingPoints[0];
      const lastPoint = trackingPoints[trackingPoints.length - 1];
      const xOffset = lastPoint.x - firstPoint.x;
      const yOffset = lastPoint.y - firstPoint.y;
      const timeOffset = lastPoint.time - firstPoint.time;
      const D = timeOffset / 15 / multiplier;
      decVelX = xOffset / D || 0; // prevent NaN
      decVelY = yOffset / D || 0;
      const diff = checkBounds();
      if (Math.abs(decVelX) > 1 || Math.abs(decVelY) > 1 || !diff.inBounds) {
        decelerating = true;
        requestAnimFrame(stepDecelAnim);
      } else if (stopCallback) {
        stopCallback(sourceEl);
      }
    }

    /**
     * Animates values slowing down
     */
    function stepDecelAnim() {
      if (!decelerating) {
        return;
      }
      decVelX *= friction;
      decVelY *= friction;
      targetX += decVelX;
      targetY += decVelY;
      const diff = checkBounds();
      if (Math.abs(decVelX) > stopThreshold || Math.abs(decVelY) > stopThreshold || !diff.inBounds) {
        if (bounce) {
          const reboundAdjust = 2.5;
          if (diff.x !== 0) {
            if (diff.x * decVelX <= 0) {
              decVelX += diff.x * bounceDeceleration;
            } else {
              const adjust = diff.x > 0 ? reboundAdjust : -2.5;
              decVelX = (diff.x + adjust) * bounceAcceleration;
            }
          }
          if (diff.y !== 0) {
            if (diff.y * decVelY <= 0) {
              decVelY += diff.y * bounceDeceleration;
            } else {
              const adjust = diff.y > 0 ? reboundAdjust : -2.5;
              decVelY = (diff.y + adjust) * bounceAcceleration;
            }
          }
        } else {
          if (diff.x !== 0) {
            if (diff.x > 0) {
              targetX = boundXmin;
            } else {
              targetX = boundXmax;
            }
            decVelX = 0;
          }
          if (diff.y !== 0) {
            if (diff.y > 0) {
              targetY = boundYmin;
            } else {
              targetY = boundYmax;
            }
            decVelY = 0;
          }
        }
        callUpdateCallback();
        requestAnimFrame(stepDecelAnim);
      } else {
        decelerating = false;
        if (stopCallback) {
          stopCallback(sourceEl);
        }
      }
    }
  }
}

/**
 * @see http://www.paulirish.com/2011/requestanimationframe-for-smart-animating/
 */
const requestAnimFrame = function () {
  return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function (callback) {
    window.setTimeout(callback, 1000 / 60);
  };
}();
function getPassiveSupported() {
  let passiveSupported = false;
  try {
    const options = Object.defineProperty({}, 'passive', {
      get() {
        passiveSupported = true;
      }
    });
    window.addEventListener('test', null, options);
  } catch (err) {}
  getPassiveSupported = () => passiveSupported;
  return passiveSupported;
}

var rootPosition = {
  left: 0,
  top: 0
};
function mouseEventOffset(ev, target, out) {
  target = target || ev.currentTarget || ev.srcElement;
  if (!Array.isArray(out)) {
    out = [0, 0];
  }
  var cx = ev.clientX || 0;
  var cy = ev.clientY || 0;
  var rect = getBoundingClientOffset(target);
  out[0] = cx - rect.left;
  out[1] = cy - rect.top;
  return out;
}
function getBoundingClientOffset(element) {
  if (element === window || element === document || element === document.body) {
    return rootPosition;
  } else {
    return element.getBoundingClientRect();
  }
}

function distance(a, b) {
  var x = b[0] - a[0],
    y = b[1] - a[1];
  return Math.sqrt(x * x + y * y);
}
function touchPinch(target) {
  target = target || window;
  var emitter = new EventEmitter2();
  var fingers = [null, null];
  var activeCount = 0;
  var lastDistance = 0;
  var ended = false;
  var enabled = false;

  // some read-only values
  Object.defineProperties(emitter, {
    pinching() {
      return activeCount === 2;
    },
    fingers() {
      return fingers;
    }
  });
  enable();
  emitter.enable = enable;
  emitter.disable = disable;
  emitter.indexOfTouch = indexOfTouch;
  return emitter;
  function indexOfTouch(touch) {
    var id = touch.identifier;
    for (var i = 0; i < fingers.length; i++) {
      if (fingers[i] && fingers[i].touch && fingers[i].touch.identifier === id) {
        return i;
      }
    }
    return -1;
  }
  function enable() {
    if (enabled) return;
    enabled = true;
    target.addEventListener('touchstart', onTouchStart, false);
    target.addEventListener('touchmove', onTouchMove, false);
    target.addEventListener('touchend', onTouchRemoved, false);
    target.addEventListener('touchcancel', onTouchRemoved, false);
  }
  function disable() {
    if (!enabled) return;
    enabled = false;
    activeCount = 0;
    fingers[0] = null;
    fingers[1] = null;
    lastDistance = 0;
    ended = false;
    target.removeEventListener('touchstart', onTouchStart, false);
    target.removeEventListener('touchmove', onTouchMove, false);
    target.removeEventListener('touchend', onTouchRemoved, false);
    target.removeEventListener('touchcancel', onTouchRemoved, false);
  }
  function onTouchStart(ev) {
    for (var i = 0; i < ev.changedTouches.length; i++) {
      var newTouch = ev.changedTouches[i];
      var id = newTouch.identifier;
      var idx = indexOfTouch(id);
      if (idx === -1 && activeCount < 2) {
        var first = activeCount === 0;

        // newest and previous finger (previous may be undefined)
        var newIndex = fingers[0] ? 1 : 0;
        var oldIndex = fingers[0] ? 0 : 1;
        var newFinger = new Finger();

        // add to stack
        fingers[newIndex] = newFinger;
        activeCount++;

        // update touch event & position
        newFinger.touch = newTouch;
        mouseEventOffset(newTouch, target, newFinger.position);
        var oldTouch = fingers[oldIndex] ? fingers[oldIndex].touch : undefined;
        emitter.emit('place', newTouch, oldTouch);
        if (!first) {
          var initialDistance = computeDistance();
          ended = false;
          emitter.emit('start', initialDistance);
          lastDistance = initialDistance;
        }
      }
    }
  }
  function onTouchMove(ev) {
    var changed = false;
    for (var i = 0; i < ev.changedTouches.length; i++) {
      var movedTouch = ev.changedTouches[i];
      var idx = indexOfTouch(movedTouch);
      if (idx !== -1) {
        changed = true;
        fingers[idx].touch = movedTouch; // avoid caching touches
        mouseEventOffset(movedTouch, target, fingers[idx].position);
      }
    }
    if (activeCount === 2 && changed) {
      var currentDistance = computeDistance();
      emitter.emit('change', currentDistance, lastDistance);
      lastDistance = currentDistance;
    }
  }
  function onTouchRemoved(ev) {
    for (var i = 0; i < ev.changedTouches.length; i++) {
      var removed = ev.changedTouches[i];
      var idx = indexOfTouch(removed);
      if (idx !== -1) {
        fingers[idx] = null;
        activeCount--;
        var otherIdx = idx === 0 ? 1 : 0;
        var otherTouch = fingers[otherIdx] ? fingers[otherIdx].touch : undefined;
        emitter.emit('lift', removed, otherTouch);
      }
    }
    if (!ended && activeCount !== 2) {
      ended = true;
      emitter.emit('end');
    }
  }
  function computeDistance() {
    if (activeCount < 2) return 0;
    return distance(fingers[0].position, fingers[1].position);
  }
}
function Finger() {
  this.position = [0, 0];
  this.touch = null;
}

function getPrefixed(name) {
  return window['webkit' + name] || window['moz' + name] || window['ms' + name];
}
var lastTime = 0;

// fallback for IE 7-8
function timeoutDefer(fn) {
  var time = +new Date(),
    timeToCall = Math.max(0, 16 - (time - lastTime));
  lastTime = time + timeToCall;
  return window.setTimeout(fn, timeToCall);
}
function bind(fn, obj) {
  var slice = Array.prototype.slice;
  if (fn.bind) {
    return fn.bind.apply(fn, slice.call(arguments, 1));
  }
  var args = slice.call(arguments, 2);
  return function () {
    return fn.apply(obj, args.length ? args.concat(slice.call(arguments)) : arguments);
  };
}
var requestFn = window.requestAnimationFrame || getPrefixed('RequestAnimationFrame') || timeoutDefer;
var cancelFn = window.cancelAnimationFrame || getPrefixed('CancelAnimationFrame') || getPrefixed('CancelRequestAnimationFrame') || function (id) {
  window.clearTimeout(id);
};
const raf = (fn, context, immediate) => {
  if (immediate && requestFn === timeoutDefer) {
    fn.call(context);
  } else {
    return requestFn.call(window, bind(fn, context));
  }
};
raf.cancel = id => {
  if (id) {
    cancelFn.call(window, id);
  }
};

class MagicScroll {
  constructor(target, speed = 80, smooth = 12, current = 0, passive = false) {
    if (target === document) {
      target = document.scrollingElement || document.documentElement || document.body.parentNode || document.body;
    } // cross browser support for document scrolling

    this.speed = speed;
    this.smooth = smooth;
    this.moving = false;
    this.scrollTop = current * 3000;
    this.pos = this.scrollTop;
    this.frame = target === document.body && document.documentElement ? document.documentElement : target; // safari is the new IE

    target.addEventListener('wheel', scrolled, {
      passive
    });
    target.addEventListener('DOMMouseScroll', scrolled, {
      passive
    });
    const scope = this;
    function scrolled(e) {
      e.preventDefault(); // disable default scrolling

      const delta = scope.normalizeWheelDelta(e);
      scope.pos += -delta * scope.speed;
      // scope.pos = Math.max(0, Math.min(scope.pos, 3000)); // limit scrolling

      if (!scope.moving) scope.update(e);
    }
  }
  normalizeWheelDelta(e) {
    if (e.detail) {
      if (e.wheelDelta) return e.wheelDelta / e.detail / 40 * (e.detail > 0 ? 1 : -1);
      // Opera
      return -e.detail / 3; // Firefox
    }
    return e.wheelDelta / 120; // IE,Safari,Chrome
  }
  update(e) {
    this.moving = true;
    const delta = (this.pos - this.scrollTop) / this.smooth;
    this.scrollTop += delta;

    // this.scrollTop = Math.round(this.scrollTop);

    if (this.onUpdate) {
      this.onUpdate(delta, e);
    }
    const scope = this;
    if (Math.abs(delta) > 1) {
      requestFrame(() => {
        scope.update();
      });
    } else this.moving = false;
  }
}
var requestFrame = function () {
  // requestAnimationFrame cross browser
  return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (func) {
    window.setTimeout(func, 1000);
  };
}();

const panzoom = (target, cb) => {
  if (target instanceof Function) {
    cb = target;
    target = document.documentElement || document.body;
  }
  if (typeof target === 'string') target = document.querySelector(target);
  let cursor = {
    x: 0,
    y: 0
  };
  const hasPassive = () => {
    let supported = false;
    try {
      const opts = Object.defineProperty({}, 'passive', {
        get() {
          supported = true;
        }
      });
      window.addEventListener('test', null, opts);
      window.removeEventListener('test', null, opts);
    } catch (e) {
      supported = false;
    }
    return supported;
  };
  let impetus;
  let magicScroll;
  let initX = 0;
  let initY = 0;
  let init = true;
  const initFn = function (e) {
    init = true;
  };
  target.addEventListener('mousedown', initFn);
  const onMouseMove = e => {
    cursor = evPos(e);
  };
  target.addEventListener('mousemove', onMouseMove);
  const wheelListener = function (e) {
    if (e) {
      cursor = evPos(e);
    }
  };
  target.addEventListener('wheel', wheelListener);
  target.addEventListener('touchstart', initFn, hasPassive() ? {
    passive: true
  } : false);
  target.addEventListener('contextmenu', e => {
    e.preventDefault();
    return false;
  }, false);
  let lastY = 0;
  let lastX = 0;
  impetus = new Impetus({
    source: target,
    update(x, y) {
      if (init) {
        init = false;
        initX = cursor.x;
        initY = cursor.y;
      }
      const e = {
        target,
        type: 'mouse',
        dx: x - lastX,
        dy: y - lastY,
        dz: 0,
        x: cursor.x,
        y: cursor.y,
        x0: initX,
        y0: initY,
        isRight: cursor.isRight
      };
      lastX = x;
      lastY = y;
      schedule(e);
    },
    stop() {
      const ev = {
        target,
        type: 'mouse',
        dx: 0,
        dy: 0,
        dz: 0,
        x: cursor.x,
        y: cursor.y,
        x0: initX,
        y0: initY
      };
      schedule(ev);
    },
    multiplier: 1,
    friction: 0.75
  });
  magicScroll = new MagicScroll(target, 80, 12, 0);
  magicScroll.onUpdate = (dy, e) => {
    schedule({
      target,
      type: 'mouse',
      dx: 0,
      dy: 0,
      dz: dy,
      x: cursor.x,
      y: cursor.y,
      x0: cursor.x,
      y0: cursor.y
    });
  };

  // mobile pinch zoom
  const pinch = touchPinch(target);
  const mult = 2;
  let initialCoords;
  pinch.on('start', curr => {
    const f1 = pinch.fingers[0];
    const f2 = pinch.fingers[1];
    initialCoords = [f2.position[0] * 0.5 + f1.position[0] * 0.5, f2.position[1] * 0.5 + f1.position[1] * 0.5];
    impetus && impetus.pause();
  });
  pinch.on('end', () => {
    if (!initialCoords) return;
    initialCoords = null;
    impetus && impetus.resume();
  });
  pinch.on('change', (curr, prev) => {
    if (!pinch.pinching || !initialCoords) return;
    schedule({
      target,
      type: 'touch',
      dx: 0,
      dy: 0,
      dz: -(curr - prev) * mult,
      x: initialCoords[0],
      y: initialCoords[1],
      x0: initialCoords[0],
      y0: initialCoords[0]
    });
  });

  // schedule function to current or next frame
  let planned;
  let frameId;
  function schedule(ev) {
    if (frameId != null) {
      if (!planned) planned = ev;else {
        planned.dx += ev.dx;
        planned.dy += ev.dy;
        planned.dz += ev.dz;
        planned.x = ev.x;
        planned.y = ev.y;
      }
      return;
    }

    // Firefox sometimes does not clear webgl current drawing buffer
    // so we have to schedule callback to the next frame, not the current
    // cb(ev)

    frameId = raf(() => {
      cb(ev);
      frameId = null;
      if (planned) {
        const arg = planned;
        planned = null;
        schedule(arg);
      }
    });
  }
  return function unpanzoom() {
    target.removeEventListener('mousedown', initFn);
    target.removeEventListener('mousemove', onMouseMove);
    target.removeEventListener('touchstart', initFn);
    impetus.destroy();
    target.removeEventListener('wheel', wheelListener);
    pinch.disable();
    raf.cancel(frameId);
  };
};

const ModesMixin = superclass => class extends superclass {
  /**
   * MODES
   */
  setMode(mode) {
    this.mode = mode;
    switch (mode) {
      case Modes$1.SELECT:
        this.canvas.isDrawingMode = false;
        this.canvas.interactive = true;
        this.canvas.selection = true;
        this.canvas.hoverCursor = 'default';
        this.canvas.moveCursor = 'default';
        break;
      case Modes$1.GRAB:
        this.canvas.isDrawingMode = false;
        this.canvas.interactive = false;
        this.canvas.selection = false;
        this.canvas.discardActiveObject();
        this.canvas.hoverCursor = 'move';
        this.canvas.moveCursor = 'move';
        break;
      case Modes$1.MEASURE:
        this.canvas.isDrawingMode = true;
        this.canvas.freeDrawingBrush.color = 'transparent';
        this.canvas.discardActiveObject();
        break;
      case Modes$1.DRAW:
        this.canvas.isDrawingMode = true;
        break;
    }
  }
  setModeAsDraw() {
    this.setMode(Modes$1.DRAW);
  }
  setModeAsSelect() {
    this.setMode(Modes$1.SELECT);
  }
  setModeAsMeasure() {
    this.setMode(Modes$1.MEASURE);
  }
  setModeAsGrab() {
    this.setMode(Modes$1.GRAB);
  }
  isSelectMode() {
    return this.mode === Modes$1.SELECT;
  }
  isGrabMode() {
    return this.mode === Modes$1.GRAB;
  }
  isMeasureMode() {
    return this.mode === Modes$1.MEASURE;
  }
  isDrawMode() {
    return this.mode === Modes$1.DRAW;
  }
};

class Measurement {
  constructor(map) {
    this.map = map;
    this.measurer = null;
  }
  onMouseMove(e) {
    const point = {
      x: e.absolutePointer.x,
      y: e.absolutePointer.y
    };
    if (this.measurer && !this.measurer.completed) {
      this.measurer.setEnd(point);
      this.map.canvas.requestRenderAll();
    }
  }
  onClick(e) {
    const point = {
      x: e.absolutePointer.x,
      y: e.absolutePointer.y
    };
    if (!this.measurer) {
      this.measurer = new Measurer({
        start: point,
        end: point,
        map: this.map
      });

      // this.map.canvas.add(this.measurer);
    } else if (!this.measurer.completed) {
      this.measurer.setEnd(point);
      this.measurer.complete();
    }
  }
}

/**
 * A fluent interface to apply a list of mixins to a superclass.
 *
 * ```javascript
 * class X extends mix(Object).with(A, B, C) {}
 * ```
 *
 * The mixins are applied in order to the superclass, so the prototype chain
 * will be: X->C'->B'->A'->Object.
 *
 * This is purely a convenience function. The above example is equivalent to:
 *
 * ```javascript
 * class X extends C(B(A(Object))) {}
 * ```
 *
 * @function
 * @param {Function} [superclass=Object]
 * @return {MixinBuilder}
 */
const mix = superclass => new MixinBuilder(superclass);
class MixinBuilder {
  constructor(superclass) {
    this.superclass = superclass || class {};
  }

  /**
   * Applies `mixins` in order to the superclass given to `mix()`.
   *
   * @param {Array.<Mixin>} mixins
   * @return {Function} a subclass of `superclass` with `mixins` applied
   */
  with(...mixins) {
    return mixins.reduce((c, m) => m(c), this.superclass);
  }
}

/**
 * CoordinatePlane (formerly Map)
 *
 * Main container component that provides a canvas with a coordinate system,
 * grid management, and layer management capabilities.
 *
 * @class
 * @extends {Base}
 * @mixes {ModesMixin}
 */
class Map extends mix(Base).with(ModesMixin) {
  /**
   * Create a new coordinate plane
   *
   * @param {HTMLElement} container - The DOM element to contain the canvas
   * @param {Object} options - Configuration options
   * @param {Point} [options.center] - Center point of the coordinate plane
   * @param {number} [options.zoom=1] - Initial zoom level
   * @param {number} [options.minZoom=0] - Minimum allowed zoom level
   * @param {number} [options.maxZoom=20] - Maximum allowed zoom level
   * @param {boolean} [options.gridEnabled=true] - Whether to display the grid
   * @param {boolean} [options.zoomEnabled=true] - Whether zooming is enabled
   * @param {boolean} [options.selectEnabled=true] - Whether selection is enabled
   * @param {string} [options.mode=Modes.SELECT] - Initial interaction mode
   */
  constructor(container, options) {
    super(options);
    this.defaults = Object.assign({}, MAP);

    // set defaults
    Object.assign(this, this.defaults);

    // overwrite options
    Object.assign(this, this._options);
    this.center = new Point(this.center);
    this.container = container || document.body;
    const canvas = document.createElement('canvas');
    this.container.appendChild(canvas);
    canvas.setAttribute('id', 'fabric-layers-canvas');
    canvas.width = this.width || this.container.clientWidth;
    canvas.height = this.height || this.container.clientHeight;
    this.canvas = new fabric.Canvas(canvas, {
      preserveObjectStacking: true,
      renderOnAddRemove: true
    });
    this.context = this.canvas.getContext('2d');
    this.on('render', () => {
      if (this.autostart) this.clear();
    });
    this.originX = -this.canvas.width / 2;
    this.originY = -this.canvas.height / 2;
    this.canvas.absolutePan({
      x: this.originX,
      y: this.originY
    });

    // this.center = {
    //   x: this.canvas.width / 2.0,
    //   y: this.canvas.height / 2.0
    // };

    this.x = this.center.x;
    this.y = this.center.y;
    this.dx = 0;
    this.dy = 0;
    try {
      this.addFloorPlan();
    } catch (e) {
      console.error(e);
    }
    if (this.showGrid) {
      this.addGrid();
    }
    this.setMode(this.mode || Modes$1.GRAB);
    const vm = this;
    panzoom(this.container, e => {
      vm.panzoom(e);
    });
    this.registerListeners();
    setTimeout(() => {
      this.emit('ready', this);
    }, 300);
    this.measurement = new Measurement(this);
  }
  addBaseLayer() {
    if (!this.baseLayer) return;
    const vm = this;
    this.baseLayer.on('load', img => {
      vm.addLayer(img);
    });
  }
  addLayer(layer) {
    // this.canvas.renderOnAddRemove = false;
    if (!layer.shape) {
      console.error('shape is undefined');
      return;
    }
    this.canvas.add(layer.shape);
    this.canvas._objects.sort((o1, o2) => o1.zIndex - o2.zIndex);
    if (layer.shape.keepOnZoom) {
      const scale = 1.0 / this.zoom;
      layer.shape.set('scaleX', scale);
      layer.shape.set('scaleY', scale);
      layer.shape.setCoords();
      this.emit(`${layer.class}scaling`, layer);
    }
    if (layer.class) {
      this.emit(`${layer.class}:added`, layer);
    }

    // this.canvas.renderOnAddRemove = true;

    // this.update();
    this.canvas.requestRenderAll();
  }
  removeLayer(layer) {
    if (!layer || !layer.shape) return;
    if (layer.class) {
      this.emit(`${layer.class}:removed`, layer);
    }
    this.canvas.remove(layer.shape);
  }
  addGrid() {
    this.gridCanvas = this.cloneCanvas();
    this.gridCanvas.setAttribute('id', 'fabric-layers-grid-canvas');
    this.grid = new Grid(this.gridCanvas, this);
    this.grid.draw();
  }
  moveTo(obj, index) {
    if (index !== undefined) {
      obj.zIndex = index;
    }
    this.canvas.moveTo(obj.shape, obj.zIndex);
  }
  cloneCanvas(canvas) {
    canvas = canvas || this.canvas;
    const clone = document.createElement('canvas');
    clone.width = canvas.width;
    clone.height = canvas.height;
    canvas.wrapperEl.appendChild(clone);
    return clone;
  }
  setZoom(zoom) {
    const {
      width,
      height
    } = this.canvas;
    this.zoom = clamp(zoom, this.minZoom, this.maxZoom);
    this.dx = 0;
    this.dy = 0;
    this.x = width / 2.0;
    this.y = height / 2.0;
    this.update();
    nextTick(() => {
      this.update();
    });
  }
  getBounds() {
    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;
    this.canvas.forEachObject(obj => {
      const coords = obj.getBounds();
      coords.forEach(point => {
        minX = Math.min(minX, point.x);
        maxX = Math.max(maxX, point.x);
        minY = Math.min(minY, point.y);
        maxY = Math.max(maxY, point.y);
      });
    });
    return [new Point(minX, minY), new Point(maxX, maxY)];
  }
  fitBounds(padding = 100) {
    this.onResize();
    const {
      width,
      height
    } = this.canvas;
    this.originX = -this.canvas.width / 2;
    this.originY = -this.canvas.height / 2;
    const bounds = this.getBounds();
    this.center.x = (bounds[0].x + bounds[1].x) / 2.0;
    this.center.y = -(bounds[0].y + bounds[1].y) / 2.0;
    const boundWidth = Math.abs(bounds[0].x - bounds[1].x) + padding;
    const boundHeight = Math.abs(bounds[0].y - bounds[1].y) + padding;
    const scaleX = width / boundWidth;
    const scaleY = height / boundHeight;
    this.zoom = Math.min(scaleX, scaleY);
    this.canvas.setZoom(this.zoom);
    this.canvas.absolutePan({
      x: this.originX + this.center.x * this.zoom,
      y: this.originY - this.center.y * this.zoom
    });
    this.update();
    nextTick(() => {
      this.update();
    });
  }
  setCursor(cursor) {
    this.container.style.cursor = cursor;
  }
  reset() {
    const {
      width,
      height
    } = this.canvas;
    this.zoom = this._options.zoom || 1;
    this.center = new Point();
    this.originX = -this.canvas.width / 2;
    this.originY = -this.canvas.height / 2;
    this.canvas.absolutePan({
      x: this.originX,
      y: this.originY
    });
    this.x = width / 2.0;
    this.y = height / 2.0;
    this.update();
    nextTick(() => {
      this.update();
    });
  }
  onResize(width, height) {
    const oldWidth = this.canvas.width;
    const oldHeight = this.canvas.height;
    width = width || this.container.clientWidth;
    height = height || this.container.clientHeight;
    this.canvas.setWidth(width);
    this.canvas.setHeight(height);
    if (this.grid) {
      this.grid.setSize(width, height);
    }
    const dx = width / 2.0 - oldWidth / 2.0;
    const dy = height / 2.0 - oldHeight / 2.0;
    this.canvas.relativePan({
      x: dx,
      y: dy
    });
    this.update();
  }
  update() {
    const canvas = this.canvas;
    if (this.grid) {
      this.grid.update2({
        x: this.center.x,
        y: this.center.y,
        zoom: this.zoom
      });
    }
    this.emit('update', this);
    if (this.grid) {
      this.grid.render();
    }
    canvas.zoomToPoint(new Point(this.x, this.y), this.zoom);
    if (this.isGrabMode() || this.isRight) {
      canvas.relativePan(new Point(this.dx, this.dy));
      this.emit('panning');
      this.setCursor('grab');
    } else {
      this.setCursor('pointer');
    }
    const now = Date.now();
    if (!this.lastUpdatedTime && Math.abs(this.lastUpdatedTime - now) < 100) {
      return;
    }
    this.lastUpdatedTime = now;
    const objects = canvas.getObjects();
    let hasKeepZoom = false;
    for (let i = 0; i < objects.length; i += 1) {
      const object = objects[i];
      if (object.keepOnZoom) {
        object.set('scaleX', 1.0 / this.zoom);
        object.set('scaleY', 1.0 / this.zoom);
        object.setCoords();
        hasKeepZoom = true;
        this.emit(`${object.class}scaling`, object);
      }
    }
    if (hasKeepZoom) canvas.requestRenderAll();
  }
  panzoom(e) {
    // enable interactions
    const {
      width,
      height
    } = this.canvas;
    // shift start
    const zoom = clamp(-e.dz, -height * 0.75, height * 0.75) / height;
    const prevZoom = 1 / this.zoom;
    let curZoom = prevZoom * (1 - zoom);
    curZoom = clamp(curZoom, this.minZoom, this.maxZoom);
    let {
      x,
      y
    } = this.center;

    // pan
    const oX = 0.5;
    const oY = 0.5;
    if (this.isGrabMode() || e.isRight) {
      x -= prevZoom * e.dx;
      y += prevZoom * e.dy;
      this.setCursor('grab');
    } else {
      this.setCursor('pointer');
    }
    if (this.zoomEnabled) {
      const tx = e.x / width - oX;
      x -= width * (curZoom - prevZoom) * tx;
      const ty = oY - e.y / height;
      y -= height * (curZoom - prevZoom) * ty;
    }
    this.center.setX(x);
    this.center.setY(y);
    this.zoom = 1 / curZoom;
    this.dx = e.dx;
    this.dy = e.dy;
    this.x = e.x0;
    this.y = e.y0;
    this.isRight = e.isRight;
    this.isRight = e.isRight;
    this.update();
  }
  setView(view) {
    this.dx = 0;
    this.dy = 0;
    this.x = 0;
    this.y = 0;
    view.y *= -1;
    const dx = this.center.x - view.x;
    const dy = -this.center.y + view.y;
    this.center.copy(view);
    this.canvas.relativePan(new Point(dx * this.zoom, dy * this.zoom));
    this.canvas.renderAll();
    this.update();
    nextTick(() => {
      this.update();
    });
  }
  registerListeners() {
    const vm = this;
    this.canvas.on('object:scaling', e => {
      if (e.target.class) {
        vm.emit(`${e.target.class}:scaling`, e.target.parent);
        e.target.parent.emit('scaling', e.target.parent);
        return;
      }
      const group = e.target;
      if (!group.getObjects) return;
      const objects = group.getObjects();
      group.removeWithUpdate();
      for (let i = 0; i < objects.length; i += 1) {
        const object = objects[i];
        object.orgYaw = object.parent.yaw || 0;
        object.fire('moving', object.parent);
        vm.emit(`${object.class}:moving`, object.parent);
      }
      vm.update();
      vm.canvas.requestRenderAll();
    });
    this.canvas.on('object:rotating', e => {
      if (e.target.class) {
        vm.emit(`${e.target.class}:rotating`, e.target.parent, e.target.angle);
        e.target.parent.emit('rotating', e.target.parent, e.target.angle);
        return;
      }
      const group = e.target;
      if (!group.getObjects) return;
      const objects = group.getObjects();
      for (let i = 0; i < objects.length; i += 1) {
        const object = objects[i];
        if (object.class === 'marker') {
          object._set('angle', -group.angle);
          object.parent.yaw = -group.angle + (object.orgYaw || 0);
          // object.orgYaw = object.parent.yaw;
          object.fire('moving', object.parent);
          vm.emit(`${object.class}:moving`, object.parent);
          object.fire('rotating', object.parent);
          vm.emit(`${object.class}:rotating`, object.parent);
        }
      }
      this.update();
    });
    this.canvas.on('object:moving', e => {
      if (e.target.class) {
        vm.emit(`${e.target.class}:moving`, e.target.parent);
        e.target.parent.emit('moving', e.target.parent);
        return;
      }
      const group = e.target;
      if (!group.getObjects) return;
      const objects = group.getObjects();
      for (let i = 0; i < objects.length; i += 1) {
        const object = objects[i];
        if (object.class) {
          object.fire('moving', object.parent);
          vm.emit(`${object.class}:moving`, object.parent);
        }
      }
      this.update();
    });
    this.canvas.on('object:moved', e => {
      if (e.target.class) {
        vm.emit(`${e.target.class}dragend`, e);
        vm.emit(`${e.target.class}:moved`, e.target.parent);
        e.target.parent.emit('moved', e.target.parent);
        this.update();
        return;
      }
      const group = e.target;
      if (!group.getObjects) return;
      const objects = group.getObjects();
      for (let i = 0; i < objects.length; i += 1) {
        const object = objects[i];
        if (object.class) {
          object.fire('moved', object.parent);
          vm.emit(`${object.class}:moved`, object.parent);
        }
      }
      this.update();
    });
    this.canvas.on('selection:cleared', e => {
      const objects = e.deselected;
      if (!objects || !objects.length) return;
      for (let i = 0; i < objects.length; i += 1) {
        const object = objects[i];
        if (object.class === 'marker') {
          object._set('angle', 0);
          object._set('scaleX', 1 / vm.zoom);
          object._set('scaleY', 1 / vm.zoom);
          if (object.parent) {
            object.parent.inGroup = false;
          }
          object.fire('moving', object.parent);
        }
      }
    });
    this.canvas.on('selection:created', e => {
      const objects = e.selected;
      if (!objects || objects.length < 2) return;
      for (let i = 0; i < objects.length; i += 1) {
        const object = objects[i];
        if (object.class && object.parent) {
          object.parent.inGroup = true;
          object.orgYaw = object.parent.yaw || 0;
        }
      }
    });
    this.canvas.on('selection:updated', e => {
      const objects = e.selected;
      if (!objects || objects.length < 2) return;
      for (let i = 0; i < objects.length; i += 1) {
        const object = objects[i];
        if (object.class && object.parent) {
          object.parent.inGroup = true;
          object.orgYaw = object.parent.yaw || 0;
        }
      }
    });
    this.canvas.on('mouse:down', e => {
      vm.dragObject = e.target;
    });
    this.canvas.on('mouse:move', e => {
      if (this.isMeasureMode()) {
        this.measurement.onMouseMove(e);
      }
      if (vm.dragObject && vm.dragObject.clickable) {
        if (vm.dragObject === e.target) {
          vm.dragObject.dragging = true;
        } else {
          vm.dragObject.dragging = false;
        }
      }
      this.isRight = false;
      if ('which' in e.e) {
        // Gecko (Firefox), WebKit (Safari/Chrome) & Opera
        this.isRight = e.e.which === 3;
      } else if ('button' in e.e) {
        // IE, Opera
        this.isRight = e.e.button === 2;
      }
      vm.emit('mouse:move', e);
    });
    this.canvas.on('mouse:up', e => {
      if (this.isMeasureMode()) {
        this.measurement.onClick(e);
      }
      this.isRight = false;
      this.dx = 0;
      this.dy = 0;
      if (!vm.dragObject || !e.target || !e.target.selectable) {
        e.target = null;
        vm.emit('mouse:click', e);
      }
      if (vm.dragObject && vm.dragObject.clickable) {
        if (vm.dragObject !== e.target) return;
        if (!vm.dragObject.dragging && !vm.modeToggleByKey) {
          vm.emit(`${vm.dragObject.class}:click`, vm.dragObject.parent);
        }
        vm.dragObject.dragging = false;
      }
      vm.dragObject = null;
    });
    window.addEventListener('resize', () => {
      vm.onResize();
    });

    // document.addEventListener('keyup', () => {
    //   if (this.modeToggleByKey && this.isGrabMode()) {
    //     this.setModeAsSelect();
    //     this.modeToggleByKey = false;
    //   }
    // });

    // document.addEventListener('keydown', event => {
    //   if (event.ctrlKey || event.metaKey) {
    //     if (this.isSelectMode()) {
    //       this.setModeAsGrab();
    //     }
    //     this.modeToggleByKey = true;
    //   }
    // });
  }
  unregisterListeners() {
    this.canvas.off('object:moving');
    this.canvas.off('object:moved');
  }
  getMarkerById(id) {
    const objects = this.canvas.getObjects();
    for (let i = 0; i < objects.length; i += 1) {
      const obj = objects[i];
      if (obj.class === 'marker' && obj.id === id) {
        return obj.parent;
      }
    }
    return null;
  }
  getMarkers() {
    const list = [];
    const objects = this.canvas.getObjects();
    for (let i = 0; i < objects.length; i += 1) {
      const obj = objects[i];
      if (obj.class === 'marker') {
        list.push(obj.parent);
      }
    }
    return list;
  }
}

/**
 * ImageLayer - A layer for displaying and manipulating images
 *
 * This component provides functionality for loading and managing images
 * within the coordinate plane. It supports image loading, positioning,
 * scaling, and other transformations.
 *
 * @class
 * @extends {Layer}
 */
class ImageLayer extends Layer {
  /**
   * Create a new ImageLayer
   *
   * @param {Object} options - Configuration options
   * @param {string} options.url - URL of the image to load
   * @param {Point|Object} [options.position] - Position of the image (x,y coordinates)
   * @param {number} [options.width=-1] - Width of the image (-1 for auto)
   * @param {number} [options.height=-1] - Height of the image (-1 for auto)
   * @param {number} [options.opacity=1] - Opacity of the image (0-1)
   * @param {boolean} [options.draggable=false] - Whether the image can be dragged
   * @param {number} [options.zIndex=1] - Z-index for layer stacking order
   * @param {string} [options.id] - Unique identifier for the layer
   */
  constructor(options) {
    super(options);
    this.width = this.width || -1;
    this.height = this.height || -1;
    this.position = new Point(this.position);
    this.class = 'image-layer';
    this.load();
  }

  /**
   * Load the image from the provided URL
   *
   * Creates a fabric.js Image object from the URL and sets up event handlers
   * for when the image is loaded. Auto-scales the image if width/height are not specified.
   *
   * @returns {void}
   */
  load() {
    const vm = this;
    const index = this.url.lastIndexOf('.');
    const ext = index > 0 ? this.url.substring(index + 1) : '';
    if (ext === 'svg') {
      fabric.loadSVGFromURL(this.url, (objects, options) => {
        const shape = fabric.util.groupSVGElements(objects, options);
        vm.onLoad(shape);
      });
    } else {
      fabric.Image.fromURL(this.url, img => {
        vm.onLoad(img);
      });
    }
    return this;
  }

  /**
   * Handles the loaded image
   * @param {Object} shape The loaded image object
   */
  onLoad(shape) {
    const group = new Group({
      label: this.label,
      zIndex: this.zIndex,
      selectable: false,
      subTargetCheck: true,
      width: shape.width || 0,
      height: shape.height || 0
    });
    group.add(shape);
    if (this.width < 0) {
      this.width = shape.width || 0;
    }
    if (this.height < 0) {
      this.height = shape.height || 0;
    }
    this.width = parseFloat(this.width);
    this.height = parseFloat(this.height);
    if (this.width > 0 && this.height > 0) {
      if (this.keepRatio) {
        const widthScale = this.width / shape.width;
        const heightScale = this.height / shape.height;
        const minScale = Math.min(widthScale, heightScale);
        shape.scale(minScale);
      } else {
        shape.scaleToWidth(this.width);
        shape.scaleToHeight(this.height);
      }
      this.width = shape.getScaledWidth();
      this.height = shape.getScaledHeight();
    } else {
      this.width = shape.width;
      this.height = shape.height;
    }
    this.shape = shape;
    this.group = group;
    shape.lockMovementX = true;
    shape.lockMovementY = true;
    shape.hoverCursor = 'default';
    this.canvas = shape.canvas;
    this.bindEvents();
    this.fire('load', this);
  }

  /**
   * Bind events to the image
   */
  bindEvents() {
    const vm = this;
    this.shape.on('mousedown', e => {
      vm.fire('mousedown', e);
    });
    this.shape.on('mousemove', e => {
      vm.fire('mousemove', e);
    });
    this.shape.on('mouseup', e => {
      vm.fire('mouseup', e);
    });
    this.shape.on('mouseover', e => {
      vm.fire('mouseover', e);
    });
    this.shape.on('mouseout', e => {
      vm.fire('mouseout', e);
    });
  }

  /**
   * Get the bounds of the image
   * @returns {Object} The bounds of the image
   */
  getBounds() {
    return {
      width: this.width,
      height: this.height
    };
  }
}

/**
 * Factory function to create an ImageLayer
 * @param {Object} options Configuration options
 * @returns {ImageLayer} A new ImageLayer instance
 */
const imageLayer = options => new ImageLayer(options);

// Log version information in development only
if (process.env.NODE_ENV !== 'production') {
  console.log('fabric-layers-react', version);
  console.log('fabric-layers', fabricLayers.version);
  console.log('fabric.js', fabric$1.version);
}

export { Arrow, Canvas, CanvasLayer, Circle, Connector, Map as CoordinatePlane, Grid, Grid as GridSystem, Group, ICON, Icon, ImageLayer, Layer, Line, Map, Marker, MarkerGroup, Measurement, ModesMixin, Polyline, Rect, Tooltip, circle, icon, imageLayer, line, marker, markerGroup, polyline, rect, version };
//# sourceMappingURL=index.js.map
