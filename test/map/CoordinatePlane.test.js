import { Map as CoordinatePlane } from '../../src/map/Map';
import { fabric } from 'fabric-pure-browser';
import { Point } from '../../src/geometry/Point';

// Mock the fabric.Canvas class
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
      }))
    }
  };
});

describe('CoordinatePlane', () => {
  let coordinatePlane;
  let mockContainer;
  
  beforeEach(() => {
    // Create a mock container element
    mockContainer = document.createElement('div');
    document.body.appendChild(mockContainer);
    
    // Create a new coordinate plane instance before each test
    coordinatePlane = new CoordinatePlane(mockContainer, {
      center: { x: 0, y: 0 },
      zoom: 1.5,
      minZoom: 0.5,
      maxZoom: 3,
      gridEnabled: true,
      zoomEnabled: true,
      selectEnabled: true
    });
  });
  
  afterEach(() => {
    // Clean up the DOM
    if (mockContainer && mockContainer.parentNode) {
      mockContainer.parentNode.removeChild(mockContainer);
    }
  });
  
  test('should initialize with correct properties', () => {
    expect(coordinatePlane.container).toBe(mockContainer);
    expect(coordinatePlane.center).toBeInstanceOf(Point);
    expect(coordinatePlane.zoom).toBe(1.5);
    expect(coordinatePlane.minZoom).toBe(0.5);
    expect(coordinatePlane.maxZoom).toBe(3);
    expect(coordinatePlane.gridEnabled).toBe(true);
    expect(coordinatePlane.zoomEnabled).toBe(true);
    expect(coordinatePlane.selectEnabled).toBe(true);
  });
  
  test('should use default values when not provided', () => {
    const defaultCoordinatePlane = new CoordinatePlane(mockContainer);
    expect(defaultCoordinatePlane.zoom).toBe(1);
    expect(defaultCoordinatePlane.minZoom).toBe(0);
    expect(defaultCoordinatePlane.maxZoom).toBe(20);
    expect(defaultCoordinatePlane.gridEnabled).toBe(true);
    expect(defaultCoordinatePlane.zoomEnabled).toBe(true);
    expect(defaultCoordinatePlane.selectEnabled).toBe(true);
  });
  
  test('should create canvas elements', () => {
    expect(fabric.Canvas).toHaveBeenCalled();
    expect(coordinatePlane.canvas).toBeDefined();
  });
  
  test('should handle zoom operations correctly', () => {
    // Mock the render method
    coordinatePlane.render = jest.fn();
    
    // Test zoom in
    const initialZoom = coordinatePlane.zoom;
    coordinatePlane.zoomIn();
    expect(coordinatePlane.zoom).toBeGreaterThan(initialZoom);
    expect(coordinatePlane.zoom).toBeLessThanOrEqual(coordinatePlane.maxZoom);
    expect(coordinatePlane.render).toHaveBeenCalled();
    
    // Test zoom out
    coordinatePlane.render.mockClear();
    const currentZoom = coordinatePlane.zoom;
    coordinatePlane.zoomOut();
    expect(coordinatePlane.zoom).toBeLessThan(currentZoom);
    expect(coordinatePlane.zoom).toBeGreaterThanOrEqual(coordinatePlane.minZoom);
    expect(coordinatePlane.render).toHaveBeenCalled();
    
    // Test zoom to specific level
    coordinatePlane.render.mockClear();
    coordinatePlane.zoomTo(2);
    expect(coordinatePlane.zoom).toBe(2);
    expect(coordinatePlane.render).toHaveBeenCalled();
    
    // Test zoom beyond limits
    coordinatePlane.render.mockClear();
    coordinatePlane.zoomTo(5); // Above maxZoom
    expect(coordinatePlane.zoom).toBe(coordinatePlane.maxZoom);
    expect(coordinatePlane.render).toHaveBeenCalled();
    
    coordinatePlane.render.mockClear();
    coordinatePlane.zoomTo(0.1); // Below minZoom
    expect(coordinatePlane.zoom).toBe(coordinatePlane.minZoom);
    expect(coordinatePlane.render).toHaveBeenCalled();
  });
  
  test('should handle pan operations correctly', () => {
    // Mock the render method
    coordinatePlane.render = jest.fn();
    
    // Initial center position
    const initialX = coordinatePlane.center.x;
    const initialY = coordinatePlane.center.y;
    
    // Test pan
    coordinatePlane.pan(50, 30);
    expect(coordinatePlane.center.x).toBe(initialX + 50);
    expect(coordinatePlane.center.y).toBe(initialY + 30);
    expect(coordinatePlane.render).toHaveBeenCalled();
    
    // Test panTo
    coordinatePlane.render.mockClear();
    coordinatePlane.panTo(100, 200);
    expect(coordinatePlane.center.x).toBe(100);
    expect(coordinatePlane.center.y).toBe(200);
    expect(coordinatePlane.render).toHaveBeenCalled();
  });
  
  test('should handle reset view correctly', () => {
    // Mock the render method
    coordinatePlane.render = jest.fn();
    
    // Change the view
    coordinatePlane.zoom = 2;
    coordinatePlane.center.x = 100;
    coordinatePlane.center.y = 200;
    
    // Reset the view
    coordinatePlane.resetView();
    
    // Check if view was reset to default values
    expect(coordinatePlane.zoom).toBe(1);
    expect(coordinatePlane.center.x).toBe(0);
    expect(coordinatePlane.center.y).toBe(0);
    expect(coordinatePlane.render).toHaveBeenCalled();
  });
  
  test('should handle resize correctly', () => {
    // Mock the render method
    coordinatePlane.render = jest.fn();
    
    // Initial size
    const initialWidth = coordinatePlane.width;
    const initialHeight = coordinatePlane.height;
    
    // Resize
    coordinatePlane.resize(800, 600);
    
    // Check if size was updated
    expect(coordinatePlane.width).toBe(800);
    expect(coordinatePlane.height).toBe(600);
    expect(coordinatePlane.canvas.setWidth).toHaveBeenCalledWith(800);
    expect(coordinatePlane.canvas.setHeight).toHaveBeenCalledWith(600);
    expect(coordinatePlane.render).toHaveBeenCalled();
  });
});
