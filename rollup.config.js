// Rollup configuration for fabric-layers library
import { babel } from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import pkg from './package.json' assert { type: 'json' };

const banner = `/* @preserve
 * fabric-layers ${pkg.version}, a fabric.js coordinate-plane (grid) & layers library. ${pkg.homepage}
 * (c) ${new Date().getFullYear()} ${pkg.author || 'fabric-layers contributors'}
 * License: ${pkg.license}
 */
`;

const outputConfig = (format) => ({
  globals: {
    'fabric-pure-browser': 'fabric'
  },
  sourcemap: true,
  banner,
  format
});

const commonPlugins = [
  nodeResolve({
    browser: true,
    preferBuiltins: true
  }),
  commonjs(),
  json(),
  babel({
    babelHelpers: 'bundled',
    exclude: 'node_modules/**',
    presets: [
      ['@babel/preset-env', {
        targets: '> 0.25%, not dead',
        modules: false,
        useBuiltIns: 'usage',
        corejs: 3
      }]
    ]
  })
];

export default [
  // UMD build for browsers
  {
    input: 'src/index.js',
    output: [
      {
        file: pkg.unpkg.replace('.js', '.min.js'),
        format: 'umd',
        name: 'FabricLayers',
        ...outputConfig('umd')
      },
      {
        file: pkg.unpkg,
        format: 'umd',
        name: 'FabricLayers',
        ...outputConfig('umd'),
        sourcemap: false,
        plugins: [terser()]
      }
    ],
    plugins: commonPlugins
  },

  // ESM build for modern bundlers
  {
    input: 'src/index.js',
    output: {
      file: pkg.module,
      format: 'es',
      ...outputConfig('es')
    },
    plugins: commonPlugins
  },

  // CommonJS build for Node.js/npm
  {
    input: 'src/index.js',
    output: {
      file: pkg.main,
      format: 'cjs',
      ...outputConfig('cjs')
    },
    plugins: commonPlugins
  }
];
