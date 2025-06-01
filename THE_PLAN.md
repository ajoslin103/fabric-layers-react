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
- [x] Rename package from "indoorjs" to "fabric-layers-react"
- [x] Update package description to reflect new purpose as a fabric.js coordinate-plane (grid) & layers library for React
- [x] Update keywords to match new functionality (fabric.js, canvas, grid, coordinate-plane, layers, react)
- [x] Update repository, bugs, and homepage URLs

### Package Structure
- [x] Review and update main entry point in package.json
- [x] Add module field for ES modules support
- [ ] Add types field if TypeScript definitions are added
- [x] Set appropriate "files" array to include only necessary files
- [x] Properly mark React and fabric.js as peer dependencies

### Build Configuration
- [x] Update webpack/rollup configuration to generate:
  - CommonJS build (for Node.js/npm)
  - ES module build (for modern bundlers)
  - UMD build (for direct browser usage)
- [x] Configure external dependencies correctly
- [x] Set up source maps generation
- [x] Ensure tree-shaking friendly exports

## 3. Code Refactoring

### Architecture Adjustments
- [x] Ensure proper module exports for all components
- [x] Review and restructure entry points if needed
- [x] Update imports/exports to support tree-shaking
- [x] Verify React hooks usage follows best practices

### API Improvements
- [x] Document public API interface focusing on coordinate-plane and layers functionality
- [x] Ensure consistent naming conventions across the codebase
- [x] Remove any indoor-specific code that wasn't already refactored
- [x] Enhance grid system and layer management APIs
- [x] Add TypeScript type definitions (optional but recommended)

## 4. Documentation

### Package Documentation
- [x] Create comprehensive README.md
- [x] Include installation instructions
- [x] Add basic usage examples for coordinate planes and layer management
- [x] Document grid system API and coordinate transformation utilities
- [x] Explain layer system configuration options
- [x] Provide examples of integrating with existing React applications

### Code Documentation
- [x] Add/update JSDoc comments for public methods and components
- [x] Create example documentation

## 5. Testing

### Test Infrastructure
- [x] Set up/update testing framework
- [x] Write unit tests for core functionality
- [x] Add integration tests for React components

### Demo Application
- [x] Create/update demo application
- [x] Include examples showing:
  - [x] Basic coordinate plane setup
  - [x] Layer management and interaction
  - [x] Grid customization options
  - [x] Event handling with layers
- [x] Ensure demo is buildable independently
- [x] Create CodeSandbox examples for quick testing

## 6. Publishing

###  Pre-publishing Checklist
- [x] Verify package.json configuration
- [x] Fix build dependencies (added missing Babel plugins)
- [x] Run all tests (with some warnings to address in future updates)
- [x] Build production assets
- [x] Test package locally using npm link

### Publishing Process
- [x] Set up npm account if needed
- [x] Configure npm access (public/private)
- [x] Create .npmrc configuration if needed
- [x] Update version number
- [x] Publish with `npm publish`

### Continuous Integration
- [ ] Set up GitHub Actions or similar for automated testing
- [ ] Configure automated publishing (optional)

## 7. Dependency Upgrades

### Upgrade Strategy
- [x] Create a separate branch for upgrades after initial library is working
- [x] Upgrade Node.js version (from 14.x to latest LTS)
- [x] Update React to latest version (from 17.0.2 to 19.1.0)
- [x] Update fabric.js dependency (from 3.4.0 to 5.1.0)
- [x] Update build tools (webpack, babel, etc.)
- [x] Update all other dependencies to compatible versions
- [x] Test thoroughly after upgrades
- [x] Document breaking changes if any

## 8. Maintenance

### Version Control
- [x] Create semantic versioning strategy
- [x] Set up change log process

### Future Development
- [x] Outline roadmap for future features:
  - [x] Additional grid types (polar, isometric)
  - [x] Advanced layer management features
  - [x] Performance optimizations for large canvases
  - [x] Enhanced event handling system
- [x] Consider module federation for larger applications
- [x] Explore integration with other React visualization libraries
