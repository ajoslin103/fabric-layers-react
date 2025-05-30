// Config file for running Rollup in "normal" mode (non-watch)

import rollupGitVersion from 'rollup-plugin-git-version';
import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import builtins from 'rollup-plugin-node-builtins';
import globals from 'rollup-plugin-node-globals';
import json from 'rollup-plugin-json';
import gitRev from 'git-rev-sync';
import pkg from '../package.json';

let { version } = pkg;
let release;

// Skip the git branch+rev in the banner when doing a release build
if (process.env.NODE_ENV === 'release') {
  release = true;
} else {
  release = false;
  const branch = gitRev.branch();
  const rev = gitRev.short();
  version += `+${branch}.${rev}`;
}

const banner = `/* @preserve
 * fabric-layers-react ${version}, a fabric.js coordinate-plane (grid) & layers library for React
 * (c) 2025 Allen Joslin
 */
`;

const outro = `var oldFLR = window.FabricLayersReact;
exports.noConflict = function() {
	window.FabricLayersReact = oldFLR;
	return this;
}
// Always export us to window global
window.FabricLayersReact = exports;`;


export default {
  input: 'src/index.js',
  output: [
    {
      file: pkg.main,
      format: 'cjs',
      banner,
      sourcemap: true
    },
    {
      file: pkg.module,
      format: 'es',
      banner,
      sourcemap: true
    },
    {
      file: pkg.unpkg,
      format: 'umd',
      name: 'FabricLayersReact',
      banner,
      outro: outro,
      sourcemap: true,
      globals:{
        'fabric-pure-browser': 'fabric',
        'react': 'React',
        'eventemitter2': 'EventEmitter2'
      }
    }
  ],
  plugins: [
    commonjs({
      include: 'src/lib/panzoom.js'
    }),
    release ? json() : rollupGitVersion(),
    babel({
      exclude: 'node_modules/**'
    }),
    globals(),
    builtins()
  ]
};
