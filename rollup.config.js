// Rollup configuration for fabric-layers-react
import { babel } from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import builtins from 'rollup-plugin-node-builtins';
import globals from 'rollup-plugin-node-globals';
import nodePolyfills from 'rollup-plugin-polyfill-node';
import pkg from './package.json';

const banner = `/* @preserve
 * fabric-layers-react v${pkg.version}
 * A fabric.js coordinate-plane (grid) & layers library for React
 * ${pkg.homepage}
 * (c) ${new Date().getFullYear()} ${pkg.author || 'fabric-layers-react contributors'}
 * Released under the ${pkg.license} License
 */
`;

// Define external dependencies
const external = [
  'react',
  'react-dom',
  'fabric-pure-browser',
  'eventemitter2'
];

// Define globals for UMD build
const globalModules = {
  react: 'React',
  'react-dom': 'ReactDOM',
  'fabric-pure-browser': 'fabric',
  eventemitter2: 'EventEmitter2'
};

// Input configuration
const input = 'src/index.js';

export default [
  // CommonJS build (for Node.js)
  {
    input,
    output: {
      file: pkg.main,
      format: 'cjs',
      banner,
      sourcemap: true,
      exports: 'named'
    },
    external,
    plugins: [
      json(),
      babel({
        exclude: 'node_modules/**',
        babelHelpers: 'bundled'
      }),
      commonjs()
    ]
  },

  // ES module build (for bundlers)
  {
    input,
    output: {
      file: pkg.module,
      format: 'es',
      banner,
      sourcemap: true
    },
    external,
    plugins: [
      json(),
      babel({
        exclude: 'node_modules/**',
        babelHelpers: 'bundled'
      }),
      commonjs()
    ]
  },

  // UMD build (for browsers)
  {
    input,
    output: {
      file: pkg.unpkg,
      format: 'umd',
      name: 'FabricLayersReact',
      banner,
      globals: globalModules,
      sourcemap: true
    },
    external,
    plugins: [
      json(),
      babel({
        exclude: 'node_modules/**',
        babelHelpers: 'bundled'
      }),
      commonjs(),
      globals(),
      builtins(),
      nodePolyfills()
    ]
  }
];
