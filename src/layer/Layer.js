import Base from '../core/Base';

/**
 * Layer - Base class for all layer components
 *
 * Provides the fundamental properties and methods for manipulating layers
 * within a coordinate plane or canvas.
 *
 * @class
 * @extends {Base}
 */
export class Layer extends Base {
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

export const layer = options => new Layer(options);

export default Layer;
