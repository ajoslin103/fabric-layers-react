import React, { useState, useEffect } from 'react';
import { useLayerManager } from '../context/LayerManagerContext';

export interface LayerPanelProps {
  className?: string;
  style?: React.CSSProperties;
}

export const LayerPanel: React.FC<LayerPanelProps> = ({ className = '', style = {} }) => {
  const { layerManager } = useLayerManager();
  const [layers, setLayers] = useState<any[]>([]);
  const [selectedLayer, setSelectedLayer] = useState<string | null>(null);

  useEffect(() => {
    if (!layerManager) return;

    const updateLayers = () => {
      const layerList = layerManager.getLayers();
      setLayers(layerList);
    };

    // Initial update
    updateLayers();

    // Subscribe to layer changes
    layerManager.on('layer:created', updateLayers);
    layerManager.on('layer:removed', updateLayers);
    layerManager.on('layer:updated', updateLayers);

    return () => {
      layerManager.off('layer:created', updateLayers);
      layerManager.off('layer:removed', updateLayers);
      layerManager.off('layer:updated', updateLayers);
    };
  }, [layerManager]);

  const handleLayerSelect = (layerId: string) => {
    if (layerManager) {
      layerManager.setActiveLayer(layerId);
      setSelectedLayer(layerId);
    }
  };

  const handleLayerVisibility = (layerId: string, visible: boolean) => {
    if (layerManager) {
      const layer = layerManager.getLayer(layerId);
      if (layer) {
        layer.setVisible(visible);
        layerManager.render();
      }
    }
  };

  if (!layerManager) return null;

  return (
    <div className={`fabric-layers-panel ${className}`} style={style}>
      <div className="fabric-layers-header">Layers</div>
      <div className="fabric-layers-list">
        {layers.map((layer) => (
          <div
            key={layer.id}
            className={`fabric-layer-item ${selectedLayer === layer.id ? 'selected' : ''}`}
            onClick={() => handleLayerSelect(layer.id)}
          >
            <input
              type="checkbox"
              checked={layer.visible}
              onChange={(e) => handleLayerVisibility(layer.id, e.target.checked)}
              onClick={(e) => e.stopPropagation()}
            />
            <span>{layer.name || `Layer ${layer.id}`}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LayerPanel;
