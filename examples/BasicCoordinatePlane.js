import React, { useEffect, useRef } from 'react';
import { CoordinatePlane, LayerManager, ImageLayer } from 'fabric-layers-react';

/**
 * Basic example of using a coordinate plane with an image layer
 */
const BasicCoordinatePlaneExample = () => {
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

    // Add an image layer
    const imageLayer = new ImageLayer({
      url: 'https://example.com/sample-image.jpg',
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

  return (
    <div>
      <h2>Basic Coordinate Plane Example</h2>
      <div 
        ref={containerRef} 
        style={{ 
          width: '800px', 
          height: '600px', 
          border: '1px solid #ccc' 
        }}
      />
      <div className="controls">
        <button onClick={() => coordinatePlaneRef.current.zoomIn()}>Zoom In</button>
        <button onClick={() => coordinatePlaneRef.current.zoomOut()}>Zoom Out</button>
        <button onClick={() => coordinatePlaneRef.current.resetView()}>Reset View</button>
      </div>
    </div>
  );
};

export default BasicCoordinatePlaneExample;
