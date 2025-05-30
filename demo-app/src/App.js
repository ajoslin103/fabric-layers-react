import React, { useState } from 'react';
import BasicCoordinatePlane from './examples/BasicCoordinatePlane';
import AdvancedLayersExample from './examples/AdvancedLayersExample';
import GridCustomizationExample from './examples/GridCustomizationExample';
import EventHandlingExample from './examples/EventHandlingExample';

const App = () => {
  const [activeTab, setActiveTab] = useState('basic');

  const renderContent = () => {
    switch (activeTab) {
      case 'basic':
        return <BasicCoordinatePlane />;
      case 'advanced':
        return <AdvancedLayersExample />;
      case 'grid':
        return <GridCustomizationExample />;
      case 'events':
        return <EventHandlingExample />;
      default:
        return <BasicCoordinatePlane />;
    }
  };

  return (
    <div className="app-container">
      <h1>Fabric Layers React Demo</h1>
      <p>
        This demo showcases the key features of the fabric-layers-react library,
        a fabric.js coordinate-plane (grid) & layers library for React.
      </p>

      <div className="tab-container">
        <div
          className={`tab ${activeTab === 'basic' ? 'active' : ''}`}
          onClick={() => setActiveTab('basic')}
        >
          Basic Setup
        </div>
        <div
          className={`tab ${activeTab === 'advanced' ? 'active' : ''}`}
          onClick={() => setActiveTab('advanced')}
        >
          Advanced Layers
        </div>
        <div
          className={`tab ${activeTab === 'grid' ? 'active' : ''}`}
          onClick={() => setActiveTab('grid')}
        >
          Grid Customization
        </div>
        <div
          className={`tab ${activeTab === 'events' ? 'active' : ''}`}
          onClick={() => setActiveTab('events')}
        >
          Event Handling
        </div>
      </div>

      <div className="tab-content active">
        {renderContent()}
      </div>
    </div>
  );
};

export default App;
