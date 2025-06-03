/**
 * Core Library Integration Tests
 * 
 * This test suite verifies that fabric-layers-react correctly integrates with
 * the core fabric-layers library by testing the imports and exports between them.
 */

// Import from core library
import * as fabricLayers from 'fabric-layers';

// Import from React library
import * as fabricLayersReact from '../..';

describe('Core Library Integration', () => {
  test('Core library is correctly imported in React library', () => {
    // Verify that the React library has imported the core library version
    expect(fabricLayersReact.version).toBeDefined();
    
    // Verify that core components are re-exported through the React library
    expect(fabricLayersReact.Constants).toBeDefined();
    expect(fabricLayersReact.Point).toBeDefined();
    expect(fabricLayersReact.Grid).toBeDefined();
    expect(fabricLayersReact.CoordinatePlane).toBeDefined();
  });
  
  test('Constants from core library are correctly imported', () => {
    // Compare constants between libraries to ensure they match
    expect(fabricLayersReact.Constants.GRID_STYLE).toEqual(fabricLayers.Constants.GRID_STYLE);
    expect(fabricLayersReact.Constants.DEFAULT_GRID_COLOR).toEqual(fabricLayers.Constants.DEFAULT_GRID_COLOR);
    expect(fabricLayersReact.Constants.DEFAULT_GRID_OPACITY).toEqual(fabricLayers.Constants.DEFAULT_GRID_OPACITY);
  });
  
  test('Point class from core library is correctly imported', () => {
    // Create points using both libraries
    const corePoint = new fabricLayers.Point(100, 200);
    const reactPoint = new fabricLayersReact.Point(100, 200);
    
    // Verify they have the same properties and methods
    expect(reactPoint.x).toEqual(corePoint.x);
    expect(reactPoint.y).toEqual(corePoint.y);
    expect(typeof reactPoint.copy).toEqual(typeof corePoint.copy);
    expect(typeof reactPoint.getArray).toEqual(typeof corePoint.getArray);
    
    // Verify they behave the same way
    const testPoint = new fabricLayers.Point(50, 50);
    corePoint.copy(testPoint);
    reactPoint.copy(testPoint);
    
    expect(reactPoint.x).toEqual(corePoint.x);
    expect(reactPoint.y).toEqual(corePoint.y);
    expect(reactPoint.getArray()).toEqual(corePoint.getArray());
  });
  
  test('Grid class from core library is correctly imported', () => {
    // Create grids using both libraries with the same options
    const options = {
      width: 800,
      height: 600,
      spacing: 20,
      color: '#ff0000',
      opacity: 0.7,
      style: fabricLayers.Constants.GRID_STYLE.LINES
    };
    
    const coreGrid = new fabricLayers.Grid(options);
    const reactGrid = new fabricLayersReact.Grid(options);
    
    // Verify they have the same properties
    expect(reactGrid.width).toEqual(coreGrid.width);
    expect(reactGrid.height).toEqual(coreGrid.height);
    expect(reactGrid.spacing).toEqual(coreGrid.spacing);
    expect(reactGrid.color).toEqual(coreGrid.color);
    expect(reactGrid.opacity).toEqual(coreGrid.opacity);
    expect(reactGrid.style).toEqual(coreGrid.style);
  });
  
  test('React-specific components exist and extend core functionality', () => {
    // Verify that React-specific components exist
    expect(fabricLayersReact.GridSystem).toBeDefined();
    expect(fabricLayersReact.CoordinatePlane).toBeDefined();
    expect(fabricLayersReact.LayerManager).toBeDefined();
    
    // These should only exist in the React library, not in the core library
    expect(fabricLayers.GridSystem).toBeUndefined();
    expect(fabricLayers.CoordinatePlane).not.toEqual(fabricLayersReact.CoordinatePlane);
  });
});
