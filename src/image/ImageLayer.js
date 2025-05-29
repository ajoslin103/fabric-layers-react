import { Point } from '../geometry/Point';
import { Group } from '../layer/Group';
import { Layer } from '../layer/Layer';

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
export class ImageLayer extends Layer {
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
export const imageLayer = options => new ImageLayer(options);
