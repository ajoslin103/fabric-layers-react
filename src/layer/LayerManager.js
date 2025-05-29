import Base from '../core/Base';

/**
 * LayerManager - Manages layers in a coordinate plane
 *
 * This component provides methods for adding, removing, and organizing layers
 * within a coordinate plane. It maintains a registry of layers and handles
 * their rendering order, visibility, and organization.
 *
 * @class
 * @extends {Base}
 */
class LayerManager extends Base {
  /**
   * Create a new LayerManager
   *
   * @param {Object} options - Configuration options
   * @param {CoordinatePlane} [options.coordinatePlane] - The coordinate plane to manage layers for
   */
  constructor(options = {}) {
    super(options);

    this.layers = [];
    this.layersMap = new Map();
    this._coordinatePlane = options.coordinatePlane || null;
  }

  /**
   * Add a layer to the manager
   * @param {Layer} layer The layer to add
   * @param {boolean} render Whether to render the layer immediately
   * @returns {LayerManager} This LayerManager instance for chaining
   */
  addLayer(layer, render = true) {
    if (!layer) return this;

    // Generate a unique ID if one doesn't exist
    layer.id = layer.id || `layer-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // Store the layer
    this.layers.push(layer);
    this.layersMap.set(layer.id, layer);

    // Add to canvas if coordinate plane exists
    if (this._coordinatePlane && this._coordinatePlane.canvas) {
      if (layer.group) {
        this._coordinatePlane.canvas.add(layer.group);
      } else if (layer.shape) {
        this._coordinatePlane.canvas.add(layer.shape);
      }

      if (render) {
        this._coordinatePlane.canvas.renderAll();
      }
    }

    // Sort layers by z-index
    this.sortLayers();

    this.fire('layer:add', { layer });
    return this;
  }

  /**
   * Remove a layer from the manager
   * @param {Layer|string} layer The layer or layer ID to remove
   * @param {boolean} render Whether to render after removal
   * @returns {LayerManager} This LayerManager instance for chaining
   */
  removeLayer(layer, render = true) {
    let layerId;
    if (typeof layer === 'string') {
      layerId = layer;
    } else if (layer && layer.id) {
      layerId = layer.id;
    } else {
      return this;
    }

    const layerObj = this.layersMap.get(layerId);

    if (!layerObj) return this;

    // Remove from arrays and map
    this.layers = this.layers.filter(l => l.id !== layerId);
    this.layersMap.delete(layerId);

    // Remove from canvas if coordinate plane exists
    if (this._coordinatePlane && this._coordinatePlane.canvas) {
      if (layerObj.group) {
        this._coordinatePlane.canvas.remove(layerObj.group);
      } else if (layerObj.shape) {
        this._coordinatePlane.canvas.remove(layerObj.shape);
      }

      if (render) {
        this._coordinatePlane.canvas.renderAll();
      }
    }

    this.fire('layer:remove', { layer: layerObj });
    return this;
  }

  /**
   * Get a layer by its ID
   * @param {string} id The layer ID
   * @returns {Layer|null} The layer object or null if not found
   */
  getLayer(id) {
    return this.layersMap.get(id) || null;
  }

  /**
   * Sort layers by z-index
   * @returns {LayerManager} This LayerManager instance for chaining
   */
  sortLayers() {
    this.layers.sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0));

    // Update the stacking order if coordinate plane exists
    if (this._coordinatePlane && this._coordinatePlane.canvas) {
      this.layers.forEach(layer => {
        if (layer.group) {
          layer.group.bringToFront();
        } else if (layer.shape) {
          layer.shape.bringToFront();
        }
      });
    }

    return this;
  }

  /**
   * Show all layers
   * @param {boolean} render Whether to render after showing
   * @returns {LayerManager} This LayerManager instance for chaining
   */
  showAllLayers(render = true) {
    this.layers.forEach(layer => {
      if (layer.setVisible) {
        layer.setVisible(true);
      } else if (layer.group) {
        layer.group.visible = true;
      } else if (layer.shape) {
        layer.shape.visible = true;
      }
    });
    
    if (render && this._coordinatePlane && this._coordinatePlane.canvas) {
      this._coordinatePlane.canvas.renderAll();
    }
    
    return this;
  }

  /**
   * Hide all layers
   * @param {boolean} render Whether to render after hiding
   * @returns {LayerManager} This LayerManager instance for chaining
   */
  hideAllLayers(render = true) {
    this.layers.forEach(layer => {
      if (layer.setVisible) {
        layer.setVisible(false);
      } else if (layer.group) {
        layer.group.visible = false;
      } else if (layer.shape) {
        layer.shape.visible = false;
      }
    });
    
    if (render && this._coordinatePlane && this._coordinatePlane.canvas) {
      this._coordinatePlane.canvas.renderAll();
    }
    
    return this;
  }

  /**
   * Set the coordinate plane for this layer manager
   * @param {CoordinatePlane} coordinatePlane The coordinate plane
   * @returns {LayerManager} This LayerManager instance for chaining
   */
  setCoordinatePlane(coordinatePlane) {
    this._coordinatePlane = coordinatePlane;

    // Add existing layers to the new coordinate plane
    if (coordinatePlane && coordinatePlane.canvas) {
      this.layers.forEach(layer => {
        if (layer.group) {
          coordinatePlane.canvas.add(layer.group);
        } else if (layer.shape) {
          coordinatePlane.canvas.add(layer.shape);
        }
      });

      this.sortLayers();
      coordinatePlane.canvas.renderAll();
    }

    return this;
  }
}

export default LayerManager;
