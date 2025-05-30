import React, { useEffect, useRef, useState } from 'react';
import { 
  CoordinatePlane, 
  LayerManager, 
  GridManager,
  ImageLayer, 
  Layer
} from 'fabric-layers-react';

/**
 * Advanced example showing grid customization and multiple layers
 */
const AdvancedLayersExample = () => {
  const containerRef = useRef(null);
  const [coordinatePlane, setCoordinatePlane] = useState(null);
  const [layerManager, setLayerManager] = useState(null);
  const [gridManager, setGridManager] = useState(null);
  const [layers, setLayers] = useState([]);
  
  // Grid customization options
  const [gridColor, setGridColor] = useState('#cccccc');
  const [gridOpacity, setGridOpacity] = useState(0.5);
  const [gridSpacing, setGridSpacing] = useState(20);
  const [showLabels, setShowLabels] = useState(true);
  
  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize the coordinate plane
    const plane = new CoordinatePlane(containerRef.current, {
      width: 1000,
      height: 800,
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
    
    // Initialize the grid manager
    const gManager = new GridManager({
      coordinatePlane: plane,
      canvas: plane.gridCanvas,
      color: gridColor,
      opacity: gridOpacity,
      spacing: gridSpacing,
      showLabels: showLabels
    });
    setGridManager(gManager);

    // Add event listeners
    plane.on('object:added', handleObjectAdded);
    plane.on('object:removed', handleObjectRemoved);
    plane.on('object:modified', handleObjectModified);

    // Clean up on unmount
    return () => {
      plane.off('object:added', handleObjectAdded);
      plane.off('object:removed', handleObjectRemoved);
      plane.off('object:modified', handleObjectModified);
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
  }, [gridManager, gridColor, gridOpacity, gridSpacing, showLabels]);

  // Event handlers
  const handleObjectAdded = (e) => {
    console.log('Object added:', e);
  };

  const handleObjectRemoved = (e) => {
    console.log('Object removed:', e);
  };

  const handleObjectModified = (e) => {
    console.log('Object modified:', e);
  };

  // Add a new image layer
  const addImageLayer = () => {
    if (!layerManager) return;
    
    const imageLayer = new ImageLayer({
      url: 'https://example.com/sample-image.jpg',
      position: { x: Math.random() * 400, y: Math.random() * 300 },
      draggable: true,
      zIndex: layers.length + 1,
      opacity: 0.8
    });
    
    layerManager.addLayer(imageLayer);
    setLayers([...layers, imageLayer]);
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

  return (
    <div>
      <h2>Advanced Layers Example</h2>
      <div className="controls">
        <div>
          <h3>Grid Controls</h3>
          <div>
            <label>
              Grid Color:
              <input 
                type="color" 
                value={gridColor} 
                onChange={(e) => setGridColor(e.target.value)} 
              />
            </label>
          </div>
          <div>
            <label>
              Grid Opacity:
              <input 
                type="range" 
                min="0" 
                max="1" 
                step="0.1" 
                value={gridOpacity} 
                onChange={(e) => setGridOpacity(parseFloat(e.target.value))} 
              />
            </label>
          </div>
          <div>
            <label>
              Grid Spacing:
              <input 
                type="number" 
                min="5" 
                max="100" 
                value={gridSpacing} 
                onChange={(e) => setGridSpacing(parseInt(e.target.value, 10))} 
              />
            </label>
          </div>
          <div>
            <label>
              Show Labels:
              <input 
                type="checkbox" 
                checked={showLabels} 
                onChange={(e) => setShowLabels(e.target.checked)} 
              />
            </label>
          </div>
        </div>
        
        <div>
          <h3>Layer Controls</h3>
          <button onClick={addImageLayer}>Add Image Layer</button>
          <button onClick={removeLastLayer}>Remove Last Layer</button>
          <button onClick={toggleLayersVisibility}>Toggle Visibility</button>
        </div>
      </div>
      
      <div 
        ref={containerRef} 
        style={{ 
          width: '1000px', 
          height: '800px', 
          border: '1px solid #ccc',
          margin: '20px 0'
        }}
      />
      
      <div>
        <h3>Layers ({layers.length})</h3>
        <ul>
          {layers.map((layer, index) => (
            <li key={index}>
              Layer {index + 1} - {layer.visible === false ? 'Hidden' : 'Visible'}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdvancedLayersExample;
