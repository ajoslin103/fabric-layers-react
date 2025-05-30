import { LayerManager } from '../../src/layer/LayerManager';
import { Layer } from '../../src/layer/Layer';

describe('LayerManager', () => {
  let layerManager;
  let mockCoordinatePlane;
  
  beforeEach(() => {
    // Create a mock coordinate plane with a canvas
    mockCoordinatePlane = {
      canvas: {
        add: jest.fn(),
        remove: jest.fn(),
        renderAll: jest.fn()
      }
    };
    
    // Create a new layer manager instance before each test
    layerManager = new LayerManager({
      coordinatePlane: mockCoordinatePlane
    });
  });
  
  test('should initialize with empty layers array and map', () => {
    expect(layerManager.layers).toEqual([]);
    expect(layerManager.layersMap.size).toBe(0);
  });
  
  test('should add a layer correctly', () => {
    const layer = new Layer({ id: 'test-layer' });
    
    // Add the layer
    layerManager.addLayer(layer);
    
    // Check if layer was added to the layers array and map
    expect(layerManager.layers).toContain(layer);
    expect(layerManager.layersMap.get('test-layer')).toBe(layer);
  });
  
  test('should generate a unique ID for a layer if not provided', () => {
    const layer = new Layer({});
    
    // Add the layer
    layerManager.addLayer(layer);
    
    // Check if an ID was generated
    expect(layer.id).toBeDefined();
    expect(layer.id).toMatch(/^layer-\d+-\d+$/);
  });
  
  test('should add layer to canvas if coordinate plane exists', () => {
    const layer = new Layer({ id: 'test-layer' });
    layer.group = { id: 'test-group' };
    
    // Add the layer
    layerManager.addLayer(layer);
    
    // Check if layer was added to the canvas
    expect(mockCoordinatePlane.canvas.add).toHaveBeenCalledWith(layer.group);
    expect(mockCoordinatePlane.canvas.renderAll).toHaveBeenCalled();
  });
  
  test('should remove a layer correctly', () => {
    // Add a layer first
    const layer = new Layer({ id: 'test-layer' });
    layer.group = { id: 'test-group' };
    layerManager.addLayer(layer);
    
    // Remove the layer
    layerManager.removeLayer('test-layer');
    
    // Check if layer was removed from the layers array and map
    expect(layerManager.layers).not.toContain(layer);
    expect(layerManager.layersMap.get('test-layer')).toBeUndefined();
    
    // Check if layer was removed from the canvas
    expect(mockCoordinatePlane.canvas.remove).toHaveBeenCalledWith(layer.group);
    expect(mockCoordinatePlane.canvas.renderAll).toHaveBeenCalled();
  });
  
  test('should get a layer by ID', () => {
    // Add a layer first
    const layer = new Layer({ id: 'test-layer' });
    layerManager.addLayer(layer);
    
    // Get the layer by ID
    const retrievedLayer = layerManager.getLayer('test-layer');
    
    // Check if the correct layer was retrieved
    expect(retrievedLayer).toBe(layer);
  });
  
  test('should return null when getting a non-existent layer', () => {
    const retrievedLayer = layerManager.getLayer('non-existent-layer');
    expect(retrievedLayer).toBeNull();
  });
  
  test('should sort layers by z-index', () => {
    // Add layers with different z-indices
    const layer1 = new Layer({ id: 'layer1', zIndex: 3 });
    const layer2 = new Layer({ id: 'layer2', zIndex: 1 });
    const layer3 = new Layer({ id: 'layer3', zIndex: 2 });
    
    layerManager.addLayer(layer1);
    layerManager.addLayer(layer2);
    layerManager.addLayer(layer3);
    
    // Sort the layers
    layerManager.sortLayers();
    
    // Check if layers are sorted by z-index
    expect(layerManager.layers[0]).toBe(layer2); // zIndex: 1
    expect(layerManager.layers[1]).toBe(layer3); // zIndex: 2
    expect(layerManager.layers[2]).toBe(layer1); // zIndex: 3
  });
});
