import React from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';

// Demo pages
import Home from './pages/Home';
import BasicDemo from './pages/BasicDemo';
import LayerManagementDemo from './pages/LayerManagementDemo';
import GridCustomizationDemo from './pages/GridCustomizationDemo';
import EventHandlingDemo from './pages/EventHandlingDemo';

function App() {
  return (
    <div className="app">
      <header className="header">
        <h1>fabric-layers-react Demo</h1>
        <nav className="nav">
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/basic">Basic Setup</NavLink>
          <NavLink to="/layers">Layer Management</NavLink>
          <NavLink to="/grid">Grid Customization</NavLink>
          <NavLink to="/events">Event Handling</NavLink>
        </nav>
      </header>
      
      <div className="content">
        <main className="main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/basic" element={<BasicDemo />} />
            <Route path="/layers" element={<LayerManagementDemo />} />
            <Route path="/grid" element={<GridCustomizationDemo />} />
            <Route path="/events" element={<EventHandlingDemo />} />
          </Routes>
        </main>
      </div>
      
      <footer className="footer">
        <p>fabric-layers-react - A fabric.js coordinate-plane (grid) & layers library for React</p>
      </footer>
    </div>
  );
}

export default App;
