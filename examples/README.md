# fabric-layers-react Examples

This directory contains example code demonstrating how to use the fabric-layers-react library in React applications.

## Examples Overview

### Basic Coordinate Plane Example

File: `BasicCoordinatePlane.js`

This example demonstrates:
- Setting up a basic coordinate plane
- Adding a simple image layer
- Basic interaction controls (zoom in/out, reset view)

### Advanced Layers Example

File: `AdvancedLayersExample.js`

This example demonstrates:
- Customizing the grid appearance (color, opacity, spacing, labels)
- Managing multiple layers
- Layer visibility controls
- Event handling for layer interactions

## Running the Examples

To run these examples in your own project:

1. Install the fabric-layers-react library:
   ```bash
   npm install fabric-layers-react
   # or
   yarn add fabric-layers-react
   ```

2. Copy the example file you want to use into your React project.

3. Import and use the component in your application:
   ```jsx
   import BasicCoordinatePlaneExample from './path/to/BasicCoordinatePlane';
   
   function App() {
     return (
       <div className="App">
         <BasicCoordinatePlaneExample />
       </div>
     );
   }
   ```

## Notes

- These examples assume you have React and fabric.js installed as peer dependencies.
- The image URLs in the examples (`https://example.com/sample-image.jpg`) should be replaced with actual image URLs in your application.
- The examples are designed to be educational and may need to be adapted to fit your specific use case.

## Additional Resources

For more detailed information about the library's API, please refer to the main README.md file and the API documentation.
