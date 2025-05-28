# Plan to Convert React Indoor Mapping to npm Package

## 1. Project Assessment

### Current State
- Repository is structured as a React-based indoor mapping library that was refactored to be a generic image manipulation library
- Current name: "indoorjs" (in package.json)
- Using React 17.0.2 and fabric-pure-browser 3.4.0
- Has webpack and rollup configurations for building
- Main entry point: src/Indoor.js

## 2. Package Configuration Updates

### Package Identity
- [ ] Rename package from "indoorjs" to "fabric-layers-react"
- [ ] Update package description to reflect new purpose as a fabric.js coordinate-plane (grid) & layers library for React
- [ ] Update keywords to match new functionality (fabric.js, canvas, grid, coordinate-plane, layers, react)
- [ ] Update repository, bugs, and homepage URLs

### Package Structure
- [ ] Review and update main entry point in package.json
- [ ] Add module field for ES modules support
- [ ] Add types field if TypeScript definitions are added
- [ ] Set appropriate "files" array to include only necessary files
- [ ] Properly mark React and fabric.js as peer dependencies

### Build Configuration
- [ ] Update webpack/rollup configuration to generate:
  - CommonJS build (for Node.js/npm)
  - ES module build (for modern bundlers)
  - UMD build (for direct browser usage)
- [ ] Configure external dependencies correctly
- [ ] Set up source maps generation
- [ ] Ensure tree-shaking friendly exports

## 3. Code Refactoring

### Architecture Adjustments
- [ ] Ensure proper module exports for all components
- [ ] Review and restructure entry points if needed
- [ ] Update imports/exports to support tree-shaking
- [ ] Verify React hooks usage follows best practices

### API Improvements
- [ ] Document public API interface focusing on coordinate-plane and layers functionality
- [ ] Ensure consistent naming conventions across the codebase
- [ ] Remove any indoor-specific code that wasn't already refactored
- [ ] Enhance grid system and layer management APIs
- [ ] Add TypeScript type definitions (optional but recommended)

## 4. Documentation

### Package Documentation
- [ ] Create comprehensive README.md
- [ ] Include installation instructions
- [ ] Add basic usage examples for coordinate planes and layer management
- [ ] Document grid system API and coordinate transformation utilities
- [ ] Explain layer system configuration options
- [ ] Provide examples of integrating with existing React applications

### Code Documentation
- [ ] Add/update JSDoc comments for public methods and components
- [ ] Create example documentation

## 5. Testing

### Test Infrastructure
- [ ] Set up/update testing framework
- [ ] Write unit tests for core functionality
- [ ] Add integration tests for React components

### Demo Application
- [ ] Create/update demo application
- [ ] Include examples showing:
  - [ ] Basic coordinate plane setup
  - [ ] Layer management and interaction
  - [ ] Grid customization options
  - [ ] Event handling with layers
- [ ] Ensure demo is buildable independently
- [ ] Create CodeSandbox examples for quick testing

## 6. Publishing

### Pre-publishing Checklist
- [ ] Verify package.json configuration
- [ ] Run all tests
- [ ] Build production assets
- [ ] Test package locally using npm link

### Publishing Process
- [ ] Set up npm account if needed
- [ ] Configure npm access (public/private)
- [ ] Create .npmrc configuration if needed
- [ ] Update version number
- [ ] Publish with `npm publish`

### Continuous Integration
- [ ] Set up GitHub Actions or similar for automated testing
- [ ] Configure automated publishing (optional)

## 7. Dependency Upgrades

### Upgrade Strategy
- [ ] Create a separate branch for upgrades after initial library is working
- [ ] Upgrade Node.js version (from 14.x to latest LTS)
- [ ] Update React to latest version (from 17.0.2)
- [ ] Update fabric.js dependency
- [ ] Update build tools (webpack, babel, etc.)
- [ ] Update all other dependencies to compatible versions
- [ ] Test thoroughly after upgrades
- [ ] Document breaking changes if any

## 8. Maintenance

### Version Control
- [ ] Create semantic versioning strategy
- [ ] Set up change log process

### Future Development
- [ ] Outline roadmap for future features:
  - [ ] Additional grid types (polar, isometric)
  - [ ] Advanced layer management features
  - [ ] Performance optimizations for large canvases
  - [ ] Enhanced event handling system
- [ ] Consider module federation for larger applications
- [ ] Explore integration with other React visualization libraries
