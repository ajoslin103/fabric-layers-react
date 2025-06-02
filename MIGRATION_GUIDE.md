# Migration Guide for Fabric Layers React

This guide will help you migrate from the previous version of `fabric-layers-react` to the new version that uses the split library architecture.

## Overview of Changes

The `fabric-layers-react` library has been split into two separate packages:

1. **fabric-layers** - Core functionality without React dependencies
   - Contains all core utilities, constants, geometry tools, grid fundamentals
   - No React-specific code or dependencies

2. **fabric-layers-react** - React extensions
   - Depends on the fabric-layers core library
   - Contains all React components, hooks, and JSX rendering
   - Provides React-specific implementation on top of core functionality

## Installation

If you were previously using `fabric-layers-react`, you now need to install both packages:

```bash
# First ensure you're using the correct Node version
nvm use

# Install both packages
npm install fabric-layers fabric-layers-react
```

## Import Changes

### Basic Usage

For most users, the import paths remain the same. You can continue to import React components from `fabric-layers-react` as before:

```javascript
// Before
import { Grid, Layer, Point } from 'fabric-layers-react';

// After - still works the same way
import { Grid, Layer, Point } from 'fabric-layers-react';
```

### Advanced Usage

For advanced users who need direct access to core functionality, you can now import from either library depending on your needs:

```javascript
// Import React components from fabric-layers-react
import { Grid as ReactGrid } from 'fabric-layers-react';

// Import core functionality directly from fabric-layers
import { Point, MAP, Modes } from 'fabric-layers';
```

## Breaking Changes

While we've maintained backward compatibility for most components, there are a few breaking changes to be aware of:

1. Some utility functions may have slightly different behavior in edge cases
2. If you were directly accessing internal properties of components, these may have changed
3. The build output structure has been updated to better support various module systems

## Custom Extensions

If you've built custom extensions on top of the library:

### Extending Core Components

```javascript
// Before
import { Base } from 'fabric-layers-react';

// After
import { Base } from 'fabric-layers';

class MyCustomClass extends Base {
  // Your implementation
}
```

### Extending React Components

```javascript
// Before
import { Layer } from 'fabric-layers-react';

// After - still the same
import { Layer } from 'fabric-layers-react';

class MyCustomLayer extends Layer {
  // Your implementation
}
```

## Node Version Requirements

Both libraries require Node v22.16.0 as specified in their .nvmrc files. Always run `nvm use` before any npm commands to ensure you're using the correct Node version.

## Getting Help

If you encounter any issues during migration, please open an issue on the GitHub repository.
