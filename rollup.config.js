// Rollup configuration for fabric-layers library
import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import builtins from 'rollup-plugin-node-builtins';
import globals from 'rollup-plugin-node-globals';
import json from 'rollup-plugin-json';
import pkg from './package.json';

const banner = `/* @preserve
 * fabric-layers ${pkg.version}, a fabric.js coordinate-plane (grid) & layers library. ${pkg.homepage}
 * (c) ${new Date().getFullYear()} ${pkg.author || 'fabric-layers contributors'}
 * License: ${pkg.license}
 */
`;

const outputConfig = {
  globals: {
    'fabric-pure-browser': 'fabric'
  },
  sourcemap: true,
  banner
};

export default [
  // UMD build for browsers
  {
    input: 'src/index.js',
    output: {
      file: pkg.unpkg,
      format: 'umd',
      name: 'FabricLayers',
      ...outputConfig
    },
    plugins: [
      commonjs(),
      json(),
      babel({
        exclude: 'node_modules/**',
        presets: [
          ['@babel/preset-env', {
            targets: '> 0.25%, not dead',
            modules: false
          }]
        ]
      }),
      globals(),
      builtins()
    ],
    external: ['fabric-pure-browser']
  },

  // ESM build for modern bundlers
  {
    input: 'src/index.js',
    output: {
      file: pkg.module,
      format: 'es',
      ...outputConfig
    },
    plugins: [
      commonjs(),
      json(),
      babel({
        exclude: 'node_modules/**',
        presets: [
          ['@babel/preset-env', {
            targets: '> 0.25%, not dead',
            modules: false
          }]
        ]
      }),
      globals(),
      builtins()
    ],
    external: ['fabric-pure-browser']
  },

  // CommonJS build for Node.js/npm
  {
    input: 'src/index.js',
    output: {
      file: pkg.main,
      format: 'cjs',
      ...outputConfig
    },
    plugins: [
      commonjs(),
      json(),
      babel({
        exclude: 'node_modules/**',
        presets: [
          ['@babel/preset-env', {
            targets: 'node 10',
            modules: false
          }]
        ]
      }),
      globals(),
      builtins()
    ],
    external: ['fabric-pure-browser']
  }
];
