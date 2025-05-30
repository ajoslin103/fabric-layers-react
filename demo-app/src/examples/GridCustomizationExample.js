import React, { useEffect, useRef, useState } from 'react';
import { 
  CoordinatePlane, 
  GridManager
} from 'fabric-layers-react';

/**
 * Example showing grid customization options
 */
const GridCustomizationExample = () => {
  const containerRef = useRef(null);
  const [coordinatePlane, setCoordinatePlane] = useState(null);
  const [gridManager, setGridManager] = useState(null);
  
  // Grid customization options
  const [gridColor, setGridColor] = useState('#cccccc');
  const [gridOpacity, setGridOpacity] = useState(0.5);
  const [gridSpacing, setGridSpacing] = useState(20);
  const [showLabels, setShowLabels] = useState(true);
  const [axisColor, setAxisColor] = useState('#ff0000');
  const [labelColor, setLabelColor] = useState('#000000');
  const [labelFontSize, setLabelFontSize] = useState(12);
  
  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize the coordinate plane
    const plane = new CoordinatePlane(containerRef.current, {
      width: 800,
      height: 600,
      gridEnabled: true,
      zoomEnabled: true,
      selectEnabled: true
    });
    setCoordinatePlane(plane);
    
    // Initialize the grid manager
    const gManager = new GridManager({
      coordinatePlane: plane,
      canvas: plane.gridCanvas,
      color: gridColor,
      opacity: gridOpacity,
      spacing: gridSpacing,
      showLabels: showLabels,
      axisColor: axisColor,
      labelColor: labelColor,
      labelFontSize: labelFontSize
    });
    setGridManager(gManager);

    // Clean up on unmount
    return () => {
      plane.dispose();
    };
  }, []);

  // Update grid properties when they change
  useEffect(() => {
    if (!gridManager) return;
    
    gridManager.setColor(gridColor);
    gridManager.setOpacity(gridOpacity);
    gridManager.setSpacing(gridSpacing);
    gridManager.setShowLabels(showLabels);
    gridManager.setAxisColor(axisColor);
    gridManager.setLabelColor(labelColor);
    gridManager.setLabelFontSize(labelFontSize);
    
    // Redraw the grid with new settings
    gridManager.redraw();
  }, [gridManager, gridColor, gridOpacity, gridSpacing, showLabels, axisColor, labelColor, labelFontSize]);

  const handleZoomIn = () => {
    if (coordinatePlane) {
      coordinatePlane.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (coordinatePlane) {
      coordinatePlane.zoomOut();
    }
  };

  const handleResetView = () => {
    if (coordinatePlane) {
      coordinatePlane.resetView();
    }
  };

  return (
    <div className="demo-container">
      <h2>Grid Customization Example</h2>
      <p>
        This example demonstrates how to customize the grid appearance and behavior.
        You can change colors, spacing, opacity, and other grid properties.
      </p>
      
      <div className="controls">
        <h3>Grid Controls</h3>
        <div className="control-group">
          <div className="form-group color-picker">
            <label>Grid Color:</label>
            <input 
              type="color" 
              value={gridColor} 
              onChange={(e) => setGridColor(e.target.value)} 
            />
          </div>
          
          <div className="form-group">
            <label>Grid Opacity: {gridOpacity}</label>
            <input 
              type="range" 
              min="0" 
              max="1" 
              step="0.1" 
              value={gridOpacity} 
              onChange={(e) => setGridOpacity(parseFloat(e.target.value))} 
            />
          </div>
          
          <div className="form-group">
            <label>Grid Spacing: {gridSpacing}px</label>
            <input 
              type="range" 
              min="5" 
              max="100" 
              value={gridSpacing} 
              onChange={(e) => setGridSpacing(parseInt(e.target.value, 10))} 
            />
          </div>
          
          <div className="form-group">
            <label>
              <input 
                type="checkbox" 
                checked={showLabels} 
                onChange={(e) => setShowLabels(e.target.checked)} 
              />
              Show Labels
            </label>
          </div>
        </div>
        
        <div className="control-group">
          <div className="form-group color-picker">
            <label>Axis Color:</label>
            <input 
              type="color" 
              value={axisColor} 
              onChange={(e) => setAxisColor(e.target.value)} 
            />
          </div>
          
          <div className="form-group color-picker">
            <label>Label Color:</label>
            <input 
              type="color" 
              value={labelColor} 
              onChange={(e) => setLabelColor(e.target.value)} 
            />
          </div>
          
          <div className="form-group">
            <label>Label Font Size: {labelFontSize}px</label>
            <input 
              type="range" 
              min="8" 
              max="24" 
              value={labelFontSize} 
              onChange={(e) => setLabelFontSize(parseInt(e.target.value, 10))} 
            />
          </div>
        </div>
        
        <div className="control-group">
          <button onClick={handleZoomIn}>Zoom In</button>
          <button onClick={handleZoomOut}>Zoom Out</button>
          <button onClick={handleResetView}>Reset View</button>
        </div>
      </div>
      
      <div 
        ref={containerRef} 
        className="canvas-container"
        style={{ 
          width: '800px', 
          height: '600px'
        }}
      />
      
      <div className="code-example">
        <h3>Code Example</h3>
        <pre>
{`
// Initialize the coordinate plane
const plane = new CoordinatePlane(containerElement, {
  width: 800,
  height: 600,
  gridEnabled: true,
  zoomEnabled: true
});

// Initialize the grid manager with custom options
const gridManager = new GridManager({
  coordinatePlane: plane,
  canvas: plane.gridCanvas,
  color: '#cccccc',
  opacity: 0.5,
  spacing: 20,
  showLabels: true,
  axisColor: '#ff0000',
  labelColor: '#000000',
  labelFontSize: 12
});

// Update grid properties dynamically
gridManager.setColor('#0000ff');
gridManager.setOpacity(0.7);
gridManager.setSpacing(30);
gridManager.setShowLabels(false);
gridManager.redraw();
`}
        </pre>
      </div>
    </div>
  );
};

export default GridCustomizationExample;
