import Base from '../core/Base';
import Grid from './Grid';

/**
 * GridManager - Manages grid properties and behavior
 *
 * This component provides methods for configuring and controlling
 * the grid system in a coordinate plane.
 */
class GridManager extends Base {
  /**
   * Create a new GridManager
   * @param {Object} options Configuration options
   */
  constructor(options = {}) {
    super(options);
    this._coordinatePlane = options.coordinatePlane || null;
    this._canvas = options.canvas || null;
    this._grid = null;
    this._visible = options.visible !== undefined ? options.visible : true;
    this._spacing = options.spacing || 10;
    this._color = options.color || '#cccccc';
    this._opacity = options.opacity !== undefined ? options.opacity : 0.5;
    this._axisColor = options.axisColor || '#999999';
    this._showLabels = options.showLabels !== undefined ? options.showLabels : true;
    if (this._canvas) {
      this.initGrid();
    }
  }

  /**
   * Initialize the grid
   * @returns {GridManager} This GridManager instance for chaining
   */
  initGrid() {
    if (!this._canvas) return this;
    this._grid = new Grid(this._canvas, {
      color: this._color,
      opacity: this._opacity,
      axisColor: this._axisColor,
      spacing: this._spacing,
      showLabels: this._showLabels,
      visible: this._visible
    });
    if (this._grid && this._visible) {
      this._grid.draw();
    }
    
    return this;
  }

  /**
   * Set the grid visibility
   * @param {boolean} visible Whether the grid should be visible
   * @returns {GridManager} This GridManager instance for chaining
   */
  setVisible(visible) {
    this._visible = visible;
    if (this._grid) {
      if (visible) {
        this._grid.draw();
      } else if (this._canvas) {
        // Clear the grid canvas
        const context = this._canvas.getContext('2d');
        if (context) {
          context.clearRect(0, 0, this._canvas.width, this._canvas.height);
        }
      }
    }
    
    this.fire('grid:visibility', { visible });
    return this;
  }

  /**
   * Set the grid spacing
   * @param {number} spacing The grid spacing in pixels
   * @returns {GridManager} This GridManager instance for chaining
   */
  setSpacing(spacing) {
    this._spacing = spacing;
    if (this._grid) {
      this._grid.update({ spacing });
      if (this._visible) {
        this._grid.draw();
      }
    }
    
    this.fire('grid:spacing', { spacing });
    return this;
  }

  /**
   * Set the grid color
   * @param {string} color The grid color (CSS color string)
   * @returns {GridManager} This GridManager instance for chaining
   */
  setColor(color) {
    this._color = color;
    if (this._grid) {
      this._grid.update({ color });
      if (this._visible) {
        this._grid.draw();
      }
    }
    
    this.fire('grid:color', { color });
    return this;
  }

  /**
   * Set the grid opacity
   * @param {number} opacity The grid opacity (0-1)
   * @returns {GridManager} This GridManager instance for chaining
   */
  setOpacity(opacity) {
    this._opacity = opacity;
    if (this._grid) {
      this._grid.update({ opacity });
      if (this._visible) {
        this._grid.draw();
      }
    }
    
    this.fire('grid:opacity', { opacity });
    return this;
  }

  /**
   * Set whether to show grid labels
   * @param {boolean} show Whether to show grid labels
   * @returns {GridManager} This GridManager instance for chaining
   */
  setShowLabels(show) {
    this._showLabels = show;
    if (this._grid) {
      this._grid.update({ showLabels: show });
      if (this._visible) {
        this._grid.draw();
      }
    }
    
    this.fire('grid:labels', { showLabels: show });
    return this;
  }

  /**
   * Set the canvas for the grid
   * @param {HTMLCanvasElement} canvas The canvas element
   * @returns {GridManager} This GridManager instance for chaining
   */
  setCanvas(canvas) {
    this._canvas = canvas;
    if (canvas && !this._grid) {
      this.initGrid();
    } else if (canvas && this._grid) {
      this._grid.canvas = canvas;
      this._grid.context = canvas.getContext('2d');
      
      if (this._visible) {
        this._grid.draw();
      }
    }
    
    return this;
  }

  /**
   * Set the coordinate plane for this grid manager
   * @param {CoordinatePlane} coordinatePlane The coordinate plane
   * @returns {GridManager} This GridManager instance for chaining
   */
  setCoordinatePlane(coordinatePlane) {
    this._coordinatePlane = coordinatePlane;
    if (coordinatePlane && coordinatePlane.gridCanvas) {
      this.setCanvas(coordinatePlane.gridCanvas);
    }
    return this;
  }

  /**
   * Redraw the grid
   * @returns {GridManager} This GridManager instance for chaining
   */
  redraw() {
    if (this._grid && this._visible) {
      this._grid.draw();
    }
    return this;
  }

  /**
   * Get the current grid
   * @returns {Grid} The current grid instance
   */
  getGrid() {
    return this._grid;
  }

  /**
   * Get the current grid settings
   * @returns {Object} The current grid settings
   */
  getSettings() {
    return {
      visible: this._visible,
      spacing: this._spacing,
      color: this._color,
      opacity: this._opacity,
      axisColor: this._axisColor,
      showLabels: this._showLabels
    };
  }
}

export default GridManager;
