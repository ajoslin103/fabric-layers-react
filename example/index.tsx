import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { FabricLayersReact, LayerPanel } from 'fabric-layers-react';

declare global {
  interface Window {
    fabric: any; // Fabric.js will be loaded via CDN
  }
}

// Define the LayerManager interface based on fabric-layers
type LayerManager = {
  createLayer: (options: { name: string; selectable: boolean }) => any;
  render: () => void;
  getLayers: () => Array<{ id: string; name: string; visible: boolean }>;
  setActiveLayer: (id: string) => void;
  getActiveLayer: () => { id: string } | null;
  on: (event: string, callback: Function) => void;
  off: (event: string, callback: Function) => void;
};

const App = () => {
  const handleReady = (canvas: any, layerManager: LayerManager) => {
    console.log('Canvas and LayerManager are ready', { canvas, layerManager });
    
    // Add a rectangle to the default layer
    const rect = new window.fabric.Rect({
      left: 100,
      top: 100,
      width: 100,
      height: 100,
      fill: 'red',
      selectable: true,
    });
    
    canvas.add(rect);
    
    // Create a new layer and add a circle to it
    layerManager.createLayer({
      name: 'Circle Layer',
      selectable: true,
    });
    
    const circle = new window.fabric.Circle({
      left: 200,
      top: 200,
      radius: 50,
      fill: 'blue',
      selectable: true,
    });
    
    canvas.add(circle);
    
    // Set up layer change handler
    const onLayerChange = () => {
      console.log('Layers updated:', layerManager.getLayers());
    };
    
    layerManager.on('layer:created', onLayerChange);
    layerManager.on('layer:updated', onLayerChange);
    layerManager.on('layer:removed', onLayerChange);
    
    // Initial render
    layerManager.render();
    
    // Clean up event listeners on unmount
    return () => {
      layerManager.off('layer:created', onLayerChange);
      layerManager.off('layer:updated', onLayerChange);
      layerManager.off('layer:removed', onLayerChange);
    };
  };

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

// Create root element
const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

// Create a root.
const root = ReactDOM.createRoot(rootElement);

// Initial render
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
