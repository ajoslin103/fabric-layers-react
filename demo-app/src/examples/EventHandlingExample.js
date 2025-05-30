import React, { useEffect, useRef, useState } from 'react';
import { 
  CoordinatePlane, 
  LayerManager, 
  Layer,
  vector,
  ImageLayer
} from 'fabric-layers-react';

/**
 * Example showing event handling with layers and objects
 */
const EventHandlingExample = () => {
  const containerRef = useRef(null);
  const [coordinatePlane, setCoordinatePlane] = useState(null);
  const [layerManager, setLayerManager] = useState(null);
  const [eventLog, setEventLog] = useState([]);
  const [selectedObject, setSelectedObject] = useState(null);
  
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

    // Add event listeners
    plane.on('object:added', handleObjectAdded);
    plane.on('object:removed', handleObjectRemoved);
    plane.on('object:modified', handleObjectModified);
    plane.on('object:selected', handleObjectSelected);
    plane.on('selection:cleared', handleSelectionCleared);
    plane.on('mouse:down', handleMouseDown);
    plane.on('mouse:move', handleMouseMove);
    plane.on('mouse:up', handleMouseUp);
    plane.on('zoom:changed', handleZoomChanged);

    // Add some initial objects
    addInitialObjects(lManager);

    // Clean up on unmount
    return () => {
      plane.off('object:added', handleObjectAdded);
      plane.off('object:removed', handleObjectRemoved);
      plane.off('object:modified', handleObjectModified);
      plane.off('object:selected', handleObjectSelected);
      plane.off('selection:cleared', handleSelectionCleared);
      plane.off('mouse:down', handleMouseDown);
      plane.off('mouse:move', handleMouseMove);
      plane.off('mouse:up', handleMouseUp);
      plane.off('zoom:changed', handleZoomChanged);
      plane.dispose();
    };
  }, []);

  // Add initial objects to demonstrate events
  const addInitialObjects = (lManager) => {
    // Add a rectangle layer
    const rectLayer = new Layer({
      name: 'Rectangle Layer',
      zIndex: 1
    });
    
    const rect = new vector.Rect({
      left: 100,
      top: 100,
      width: 100,
      height: 80,
      fill: '#3498db',
      stroke: '#000',
      strokeWidth: 2,
      opacity: 0.7
    });
    
    rectLayer.addObject(rect);
    lManager.addLayer(rectLayer);
    
    // Add a circle layer
    const circleLayer = new Layer({
      name: 'Circle Layer',
      zIndex: 2
    });
    
    const circle = new vector.Circle({
      left: 300,
      top: 150,
      radius: 50,
      fill: '#e74c3c',
      stroke: '#000',
      strokeWidth: 2,
      opacity: 0.7
    });
    
    circleLayer.addObject(circle);
    lManager.addLayer(circleLayer);
    
    // Add an image layer
    const imageLayer = new ImageLayer({
      url: `${process.env.PUBLIC_URL}/fp.jpg`,
      position: { x: 400, y: 300 },
      draggable: true,
      zIndex: 3,
      opacity: 0.8,
      name: 'Image Layer'
    });
    
    lManager.addLayer(imageLayer);
  };

  // Event handlers
  const handleObjectAdded = (e) => {
    logEvent('Object added', e.target);
  };

  const handleObjectRemoved = (e) => {
    logEvent('Object removed', e.target);
  };

  const handleObjectModified = (e) => {
    logEvent('Object modified', e.target);
  };

  const handleObjectSelected = (e) => {
    logEvent('Object selected', e.target);
    setSelectedObject(e.target);
  };

  const handleSelectionCleared = () => {
    logEvent('Selection cleared');
    setSelectedObject(null);
  };

  const handleMouseDown = (e) => {
    const pointer = e.pointer;
    logEvent('Mouse down', `x: ${Math.round(pointer.x)}, y: ${Math.round(pointer.y)}`);
  };

  const handleMouseMove = (e) => {
    // Too frequent to log every move
  };

  const handleMouseUp = (e) => {
    const pointer = e.pointer;
    logEvent('Mouse up', `x: ${Math.round(pointer.x)}, y: ${Math.round(pointer.y)}`);
  };

  const handleZoomChanged = (e) => {
    logEvent('Zoom changed', `scale: ${e.scale.toFixed(2)}`);
  };

  // Helper function to log events
  const logEvent = (eventName, details = '') => {
    const timestamp = new Date().toLocaleTimeString();
    const detailsText = details ? (typeof details === 'string' ? details : JSON.stringify(details)) : '';
    const logEntry = `${timestamp} - ${eventName}${detailsText ? ': ' + detailsText : ''}`;
    
    setEventLog(prevLog => {
      const newLog = [logEntry, ...prevLog];
      // Keep only the last 10 events
      return newLog.slice(0, 10);
    });
  };

  // Add a new object to the canvas
  const addNewObject = () => {
    if (!layerManager) return;
    
    const shapes = ['rect', 'circle', 'triangle'];
    const randomShape = shapes[Math.floor(Math.random() * shapes.length)];
    
    const newLayer = new Layer({
      name: `${randomShape.charAt(0).toUpperCase() + randomShape.slice(1)} Layer`,
      zIndex: 10
    });
    
    let shapeObj;
    
    switch (randomShape) {
      case 'rect':
        shapeObj = new vector.Rect({
          left: Math.random() * 400,
          top: Math.random() * 300,
          width: 80 + Math.random() * 40,
          height: 60 + Math.random() * 40,
          fill: getRandomColor(),
          stroke: '#000',
          strokeWidth: 2,
          opacity: 0.7
        });
        break;
      case 'circle':
        shapeObj = new vector.Circle({
          left: Math.random() * 400,
          top: Math.random() * 300,
          radius: 30 + Math.random() * 30,
          fill: getRandomColor(),
          stroke: '#000',
          strokeWidth: 2,
          opacity: 0.7
        });
        break;
      case 'triangle':
        shapeObj = new fabric.Triangle({
          left: Math.random() * 400,
          top: Math.random() * 300,
          width: 80,
          height: 80,
          fill: getRandomColor(),
          stroke: '#000',
          strokeWidth: 2,
          opacity: 0.7
        });
        break;
      default:
        return;
    }
    
    newLayer.addObject(shapeObj);
    layerManager.addLayer(newLayer);
  };

  // Remove selected object
  const removeSelectedObject = () => {
    if (!coordinatePlane || !selectedObject) return;
    
    coordinatePlane.remove(selectedObject);
    setSelectedObject(null);
  };

  // Clear event log
  const clearEventLog = () => {
    setEventLog([]);
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
      <h2>Event Handling Example</h2>
      <p>
        This example demonstrates event handling with fabric-layers-react.
        Interact with the canvas to see events being logged.
      </p>
      
      <div className="controls">
        <button onClick={addNewObject}>Add Random Shape</button>
        <button onClick={removeSelectedObject} disabled={!selectedObject}>Remove Selected</button>
        <button onClick={clearEventLog}>Clear Event Log</button>
      </div>
      
      <div style={{ display: 'flex', gap: '20px' }}>
        <div 
          ref={containerRef} 
          className="canvas-container"
          style={{ 
            width: '500px', 
            height: '500px'
          }}
        />
        
        <div style={{ flex: 1 }}>
          <h3>Event Log</h3>
          <div 
            style={{ 
              height: '500px', 
              overflow: 'auto', 
              border: '1px solid #ccc',
              padding: '10px',
              backgroundColor: '#f9f9f9',
              fontFamily: 'monospace',
              fontSize: '12px'
            }}
          >
            {eventLog.length === 0 ? (
              <p>No events logged yet. Interact with the canvas to see events.</p>
            ) : (
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {eventLog.map((log, index) => (
                  <li key={index} style={{ marginBottom: '5px' }}>{log}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
      
      <div className="code-example">
        <h3>Code Example</h3>
        <pre>
{`
// Add event listeners to the coordinate plane
coordinatePlane.on('object:added', handleObjectAdded);
coordinatePlane.on('object:removed', handleObjectRemoved);
coordinatePlane.on('object:modified', handleObjectModified);
coordinatePlane.on('object:selected', handleObjectSelected);
coordinatePlane.on('selection:cleared', handleSelectionCleared);
coordinatePlane.on('mouse:down', handleMouseDown);
coordinatePlane.on('mouse:move', handleMouseMove);
coordinatePlane.on('mouse:up', handleMouseUp);
coordinatePlane.on('zoom:changed', handleZoomChanged);

// Example event handler
const handleObjectSelected = (e) => {
  console.log('Object selected:', e.target);
  // Access properties of the selected object
  const { left, top, width, height } = e.target;
  console.log(\`Position: (\${left}, \${top}), Size: \${width}x\${height}\`);
};

// Clean up event listeners when component unmounts
coordinatePlane.off('object:added', handleObjectAdded);
// ... remove other event listeners
`}
        </pre>
      </div>
    </div>
  );
};

export default EventHandlingExample;
