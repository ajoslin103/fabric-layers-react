import React, { useEffect, useRef } from 'react';
import { CoordinatePlane, LayerManager, ImageLayer } from 'fabric-layers-react';

/**
 * Basic example of using a coordinate plane with an image layer
 */
const BasicCoordinatePlane = () => {
  const containerRef = useRef(null);
  const coordinatePlaneRef = useRef(null);
  const layerManagerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize the coordinate plane
    const coordinatePlane = new CoordinatePlane(containerRef.current, {
      width: 800,
      height: 600,
      gridEnabled: true,
      zoomEnabled: true,
      selectEnabled: true
    });
    coordinatePlaneRef.current = coordinatePlane;

    // Initialize the layer manager
    const layerManager = new LayerManager({
      coordinatePlane: coordinatePlane
    });
    layerManagerRef.current = layerManager;

    // Add an image layer using the local fp.jpg file
    const imageLayer = new ImageLayer({
      url: `${process.env.PUBLIC_URL}/fp.jpg`,
      position: { x: 100, y: 100 },
      draggable: true,
      zIndex: 1
    });
    layerManager.addLayer(imageLayer);

    // Clean up on unmount
    return () => {
      coordinatePlane.dispose();
    };
  }, []);

  const handleZoomIn = () => {
    if (coordinatePlaneRef.current) {
      coordinatePlaneRef.current.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (coordinatePlaneRef.current) {
      coordinatePlaneRef.current.zoomOut();
    }
  };

  const handleResetView = () => {
    if (coordinatePlaneRef.current) {
      coordinatePlaneRef.current.resetView();
    }
  };

  return (
    <div className="demo-container">
      <h2>Basic Coordinate Plane Example</h2>
      <p>
        This example demonstrates the basic setup of a coordinate plane with an image layer.
        You can zoom in/out, pan around, and select objects.
      </p>
      
      <div 
        ref={containerRef} 
        className="canvas-container"
        style={{ 
          width: '800px', 
          height: '600px'
        }}
      />
      
      <div className="controls">
        <button onClick={handleZoomIn}>Zoom In</button>
        <button onClick={handleZoomOut}>Zoom Out</button>
        <button onClick={handleResetView}>Reset View</button>
      </div>
      
      <div className="code-example">
        <h3>Code Example</h3>
        <pre>
{`
// Initialize the coordinate plane
const coordinatePlane = new CoordinatePlane(containerElement, {
  width: 800,
  height: 600,
  gridEnabled: true,
  zoomEnabled: true,
  selectEnabled: true
});

// Initialize the layer manager
const layerManager = new LayerManager({
  coordinatePlane: coordinatePlane
});

// Add an image layer
const imageLayer = new ImageLayer({
  url: 'path/to/image.jpg',
  position: { x: 100, y: 100 },
  draggable: true,
  zIndex: 1
});
layerManager.addLayer(imageLayer);
`}
        </pre>
      </div>
    </div>
  );
};

export default BasicCoordinatePlane;
