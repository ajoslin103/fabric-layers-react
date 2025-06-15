import React, { useCallback } from 'react';
import { FabricLayersReact, LayerPanel, useFabricLayers } from '../src';

const App = () => {
  const { canvas, onObjectAdded } = useFabricLayers();

  const handleReady = useCallback((canvas: any, layerManager: any) => {
    console.log('Canvas and LayerManager are ready');
    
    // Add a rectangle to the default layer
    const rect = new window.fabric.Rect({
      left: 100,
      top: 100,
      width: 100,
      height: 100,
      fill: 'red',
    });
    
    canvas.add(rect);
    
    // Create a new layer and add a circle to it
    const circleLayer = layerManager.createLayer({
      name: 'Circle Layer',
      selectable: true,
    });
    
    const circle = new window.fabric.Circle({
      left: 200,
      top: 200,
      radius: 50,
      fill: 'blue',
    });
    
    canvas.add(circle);
    layerManager.render();
  }, []);

  // Log when objects are added
  onObjectAdded((object) => {
    console.log('Object added:', object);
  });

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <div style={{ flex: 1, border: '1px solid #ddd' }}>
        <FabricLayersReact 
          onReady={handleReady}
          style={{ width: '100%', height: '100%' }}
        />
      </div>
      <div style={{ width: '250px', borderLeft: '1px solid #ddd' }}>
        <LayerPanel />
      </div>
    </div>
  );
};

export default App;
