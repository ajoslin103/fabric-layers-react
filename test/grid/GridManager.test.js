import { GridManager } from '../../src/grid/GridManager';
import Grid from '../../src/grid/Grid';

// Mock the Grid class
jest.mock('../../src/grid/Grid', () => {
  return jest.fn().mockImplementation(() => {
    return {
      draw: jest.fn(),
      update: jest.fn()
    };
  });
});

describe('GridManager', () => {
  let gridManager;
  let mockCanvas;
  let mockCoordinatePlane;
  
  beforeEach(() => {
    // Create a mock canvas
    mockCanvas = {
      getContext: jest.fn().mockReturnValue({
        clearRect: jest.fn()
      }),
      width: 800,
      height: 600
    };
    
    // Create a mock coordinate plane
    mockCoordinatePlane = {
      gridCanvas: mockCanvas
    };
    
    // Reset the Grid mock
    Grid.mockClear();
    
    // Create a new grid manager instance before each test
    gridManager = new GridManager({
      coordinatePlane: mockCoordinatePlane,
      canvas: mockCanvas,
      color: '#cccccc',
      opacity: 0.5,
      spacing: 20,
      showLabels: true,
      visible: true
    });
  });
  
  test('should initialize with correct properties', () => {
    expect(gridManager._coordinatePlane).toBe(mockCoordinatePlane);
    expect(gridManager._canvas).toBe(mockCanvas);
    expect(gridManager._color).toBe('#cccccc');
    expect(gridManager._opacity).toBe(0.5);
    expect(gridManager._spacing).toBe(20);
    expect(gridManager._showLabels).toBe(true);
    expect(gridManager._visible).toBe(true);
  });
  
  test('should initialize grid when canvas is provided', () => {
    expect(Grid).toHaveBeenCalledWith(mockCanvas, {
      color: '#cccccc',
      opacity: 0.5,
      axisColor: '#999999',
      spacing: 20,
      showLabels: true,
      visible: true
    });
    
    // The grid should be drawn if visible
    expect(gridManager._grid.draw).toHaveBeenCalled();
  });
  
  test('should use default values when not provided', () => {
    const defaultGridManager = new GridManager({});
    expect(defaultGridManager._coordinatePlane).toBeNull();
    expect(defaultGridManager._canvas).toBeNull();
    expect(defaultGridManager._color).toBe('#cccccc');
    expect(defaultGridManager._opacity).toBe(0.5);
    expect(defaultGridManager._spacing).toBe(10);
    expect(defaultGridManager._showLabels).toBe(true);
    expect(defaultGridManager._visible).toBe(true);
  });
  
  test('should set grid visibility correctly', () => {
    // Set grid to invisible
    gridManager.setVisible(false);
    expect(gridManager._visible).toBe(false);
    
    // The context should be used to clear the canvas
    expect(mockCanvas.getContext).toHaveBeenCalledWith('2d');
    expect(mockCanvas.getContext().clearRect).toHaveBeenCalledWith(0, 0, mockCanvas.width, mockCanvas.height);
    
    // Set grid to visible again
    gridManager.setVisible(true);
    expect(gridManager._visible).toBe(true);
    expect(gridManager._grid.draw).toHaveBeenCalled();
  });
  
  test('should update grid spacing correctly', () => {
    gridManager.setSpacing(30);
    expect(gridManager._spacing).toBe(30);
    expect(gridManager._grid.update).toHaveBeenCalledWith({ spacing: 30 });
    expect(gridManager._grid.draw).toHaveBeenCalled();
  });
  
  test('should update grid color correctly', () => {
    gridManager.setColor('#ff0000');
    expect(gridManager._color).toBe('#ff0000');
    expect(gridManager._grid.update).toHaveBeenCalledWith({ color: '#ff0000' });
    expect(gridManager._grid.draw).toHaveBeenCalled();
  });
  
  test('should update grid opacity correctly', () => {
    gridManager.setOpacity(0.8);
    expect(gridManager._opacity).toBe(0.8);
    expect(gridManager._grid.update).toHaveBeenCalledWith({ opacity: 0.8 });
    expect(gridManager._grid.draw).toHaveBeenCalled();
  });
  
  test('should update show labels setting correctly', () => {
    gridManager.setShowLabels(false);
    expect(gridManager._showLabels).toBe(false);
    expect(gridManager._grid.update).toHaveBeenCalledWith({ showLabels: false });
    expect(gridManager._grid.draw).toHaveBeenCalled();
  });
});
