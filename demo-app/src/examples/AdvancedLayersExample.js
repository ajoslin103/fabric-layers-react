import React, { useEffect, useRef, useState } from 'react';
import { 
  CoordinatePlane, 
  LayerManager, 
  ImageLayer,
  Layer,
  vector
} from 'fabric-layers-react';

/**
 * Advanced example showing multiple layer types and layer management
 */
const AdvancedLayersExample = () => {
  const containerRef = useRef(null);
  const [coordinatePlane, setCoordinatePlane] = useState(null);
  const [layerManager, setLayerManager] = useState(null);
  const [layers, setLayers] = useState([]);
  
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

    // Initialize the layer manager
    const lManager = new LayerManager({
      coordinatePlane: plane
    });
    setLayerManager(lManager);

    // Add initial image layer
    const imageLayer = new ImageLayer({
      url: `${process.env.PUBLIC_URL}/fp.jpg`,
      position: { x: 100, y: 100 },
      draggable: true,
      zIndex: 1,
      opacity: 0.8,
      name: 'Floor Plan'
    });
    
    lManager.addLayer(imageLayer);
    setLayers([imageLayer]);

    // Clean up on unmount
    return () => {
      plane.dispose();
    };
  }, []);

  // Add a new image layer
  const addImageLayer = () => {
    if (!layerManager) return;
    
    const imageLayer = new ImageLayer({
      url: `${process.env.PUBLIC_URL}/radar.png`,
      position: { x: Math.random() * 400, y: Math.random() * 300 },
      draggable: true,
      zIndex: layers.length + 1,
      opacity: 0.8,
      name: `Image Layer ${layers.length + 1}`
    });
    
    layerManager.addLayer(imageLayer);
    setLayers([...layers, imageLayer]);
  };

  // Add a rectangle layer
  const addRectangleLayer = () => {
    if (!layerManager) return;
    
    const rectLayer = new Layer({
      name: `Rectangle ${layers.length + 1}`,
      zIndex: layers.length + 1
    });
    
    const rect = new vector.Rect({
      left: Math.random() * 400,
      top: Math.random() * 300,
      width: 100,
      height: 80,
      fill: getRandomColor(),
      stroke: '#000',
      strokeWidth: 2,
      opacity: 0.7
    });
    
    rectLayer.addObject(rect);
    layerManager.addLayer(rectLayer);
    setLayers([...layers, rectLayer]);
  };

  // Add a circle layer
  const addCircleLayer = () => {
    if (!layerManager) return;
    
    const circleLayer = new Layer({
      name: `Circle ${layers.length + 1}`,
      zIndex: layers.length + 1
    });
    
    const circle = new vector.Circle({
      left: Math.random() * 400,
      top: Math.random() * 300,
      radius: 50,
      fill: getRandomColor(),
      stroke: '#000',
      strokeWidth: 2,
      opacity: 0.7
    });
    
    circleLayer.addObject(circle);
    layerManager.addLayer(circleLayer);
    setLayers([...layers, circleLayer]);
  };

  // Remove the last added layer
  const removeLastLayer = () => {
    if (!layerManager || layers.length === 0) return;
    
    const lastLayer = layers[layers.length - 1];
    layerManager.removeLayer(lastLayer);
    setLayers(layers.slice(0, -1));
  };

  // Toggle visibility of all layers
  const toggleLayersVisibility = () => {
    if (!layerManager) return;
    
    const allVisible = layers.every(layer => layer.visible !== false);
    
    if (allVisible) {
      layerManager.hideAllLayers();
    } else {
      layerManager.showAllLayers();
    }
    
    // Update local state to reflect changes
    setLayers([...layers]);
  };

  // Helper function to generate random colors
  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  return (
    <div className="demo-container">
      <h2>Advanced Layers Example</h2>
      <p>
        This example demonstrates advanced layer management capabilities.
        You can add different types of layers, remove layers, and toggle their visibility.
      </p>
      
      <div className="controls">
        <h3>Layer Controls</h3>
        <div>
          <button onClick={addImageLayer}>Add Image Layer</button>
          <button onClick={addRectangleLayer}>Add Rectangle Layer</button>
          <button onClick={addCircleLayer}>Add Circle Layer</button>
          <button onClick={removeLastLayer}>Remove Last Layer</button>
          <button onClick={toggleLayersVisibility}>Toggle Visibility</button>
        </div>
        
        <h3>Layers ({layers.length})</h3>
        <ul className="layer-list">
          {layers.map((layer, index) => (
            <li key={index} className="layer-item">
              <span>{layer.name || `Layer ${index + 1}`}</span>
              <span>Visible: {layer.visible !== false ? 'Yes' : 'No'}</span>
            </li>
          ))}
        </ul>
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
// Add an image layer
const imageLayer = new ImageLayer({
  url: 'path/to/image.jpg',
  position: { x: 100, y: 100 },
  draggable: true,
  zIndex: 1,
  opacity: 0.8,
  name: 'Floor Plan'
});
layerManager.addLayer(imageLayer);

// Add a rectangle layer
const rectLayer = new Layer({
  name: 'Rectangle Layer',
  zIndex: 2
});

const rect = new vector.Rect({
  left: 200,
  top: 150,
  width: 100,
  height: 80,
  fill: '#3498db',
  stroke: '#000',
  strokeWidth: 2,
  opacity: 0.7
});

rectLayer.addObject(rect);
layerManager.addLayer(rectLayer);

// Layer management
layerManager.hideAllLayers();
layerManager.showAllLayers();
layerManager.removeLayer(layer);
`}
        </pre>
      </div>
    </div>
  );
};

export default AdvancedLayersExample;
