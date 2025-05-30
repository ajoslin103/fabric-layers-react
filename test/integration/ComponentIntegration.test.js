import { Map as CoordinatePlane } from '../../src/map/Map';
import { LayerManager } from '../../src/layer/LayerManager';
import { GridManager } from '../../src/grid/GridManager';
import { ImageLayer } from '../../src/image/ImageLayer';
import { fabric } from 'fabric-pure-browser';

// Mock the fabric library
jest.mock('fabric-pure-browser', () => {
  return {
    fabric: {
      Canvas: jest.fn().mockImplementation(() => ({
        add: jest.fn(),
        remove: jest.fn(),
        renderAll: jest.fn(),
        setWidth: jest.fn(),
        setHeight: jest.fn(),
        on: jest.fn(),
        off: jest.fn(),
        getContext: jest.fn().mockReturnValue({
          clearRect: jest.fn()
        })
      })),
      Image: jest.fn().mockImplementation((url, callback) => {
        const img = {
          set: jest.fn().mockReturnThis(),
          scale: jest.fn().mockReturnThis(),
          setCoords: jest.fn(),
          on: jest.fn(),
          getWidth: jest.fn().mockReturnValue(100),
          getHeight: jest.fn().mockReturnValue(100),
          width: 100,
          height: 100
        };
        if (callback) callback(img);
        return img;
      })
    }
  };
});

describe('Component Integration', () => {
  let coordinatePlane;
  let layerManager;
  let gridManager;
  let mockContainer;
  
  beforeEach(() => {
    // Create a mock container element
    mockContainer = document.createElement('div');
    document.body.appendChild(mockContainer);
    
    // Create a coordinate plane
    coordinatePlane = new CoordinatePlane(mockContainer, {
      width: 800,
      height: 600,
      gridEnabled: true
    });
    
    // Create a layer manager
    layerManager = new LayerManager({
      coordinatePlane: coordinatePlane
    });
    
    // Create a grid manager
    gridManager = new GridManager({
      coordinatePlane: coordinatePlane,
      canvas: coordinatePlane.gridCanvas
    });
  });
  
  afterEach(() => {
    // Clean up the DOM
    if (mockContainer && mockContainer.parentNode) {
      mockContainer.parentNode.removeChild(mockContainer);
    }
  });
  
  test('should integrate LayerManager with CoordinatePlane', () => {
    // Create an image layer
    const imageLayer = new ImageLayer({
      url: 'https://example.com/test-image.jpg',
      position: { x: 100, y: 100 },
      draggable: true
    });
    
    // Add the layer to the manager
    layerManager.addLayer(imageLayer);
    
    // Check if the layer was added to the layers array
    expect(layerManager.layers).toContain(imageLayer);
    
    // Check if the layer was added to the coordinate plane's canvas
    // This is an integration point between LayerManager and CoordinatePlane
    expect(coordinatePlane.canvas.add).toHaveBeenCalled();
    expect(coordinatePlane.canvas.renderAll).toHaveBeenCalled();
  });
  
  test('should integrate GridManager with CoordinatePlane', () => {
    // Set grid properties
    gridManager.setColor('#ff0000');
    gridManager.setOpacity(0.7);
    gridManager.setSpacing(15);
    
    // Check if the grid was initialized with the coordinate plane's canvas
    expect(gridManager._canvas).toBe(coordinatePlane.gridCanvas);
    
    // Toggle grid visibility
    const initialVisibility = gridManager._visible;
    gridManager.setVisible(!initialVisibility);
    
    // Check if the visibility was toggled
    expect(gridManager._visible).toBe(!initialVisibility);
    
    // If grid was made visible, it should be drawn
    if (gridManager._visible) {
      expect(gridManager._grid.draw).toHaveBeenCalled();
    }
    // If grid was made invisible, the canvas should be cleared
    else {
      expect(gridManager._canvas.getContext).toHaveBeenCalledWith('2d');
      expect(gridManager._canvas.getContext().clearRect).toHaveBeenCalled();
    }
  });
  
  test('should handle multiple layers with different z-indices', () => {
    // Create multiple layers with different z-indices
    const layer1 = new ImageLayer({
      id: 'layer1',
      url: 'https://example.com/image1.jpg',
      position: { x: 100, y: 100 },
      zIndex: 3
    });
    
    const layer2 = new ImageLayer({
      id: 'layer2',
      url: 'https://example.com/image2.jpg',
      position: { x: 200, y: 200 },
      zIndex: 1
    });
    
    const layer3 = new ImageLayer({
      id: 'layer3',
      url: 'https://example.com/image3.jpg',
      position: { x: 300, y: 300 },
      zIndex: 2
    });
    
    // Add layers to the manager
    layerManager.addLayer(layer1);
    layerManager.addLayer(layer2);
    layerManager.addLayer(layer3);
    
    // Check if layers were added in the correct order based on z-index
    expect(layerManager.layers[0]).toBe(layer2); // zIndex: 1
    expect(layerManager.layers[1]).toBe(layer3); // zIndex: 2
    expect(layerManager.layers[2]).toBe(layer1); // zIndex: 3
    
    // Remove a layer
    layerManager.removeLayer('layer2');
    
    // Check if the layer was removed
    expect(layerManager.layers).not.toContain(layer2);
    expect(layerManager.layers.length).toBe(2);
    
    // Check if the canvas was updated
    expect(coordinatePlane.canvas.remove).toHaveBeenCalled();
    expect(coordinatePlane.canvas.renderAll).toHaveBeenCalled();
  });
});
