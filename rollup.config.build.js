import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import css from 'rollup-plugin-css-only';

// List of modules to compile (must match .js filenames in src, eg. LineChart.js => LineChart)
const modules = ['LineChart', 'BarChart', 'ColumnChart'];

export default modules.map(module => {
	return {
		input: `src/apps/${module}.js`,
		output: {
			sourcemap: true,
			format: 'iife',
			name: `${module}`,
			file: `dist/apps/${module}.js`
		},
		plugins: [
			svelte({
				compilerOptions: {
					dev: false,
					hydratable: false
				}
			}),
			css({ output: `${module}.css` }),

			// If you have external dependencies installed from
			// npm, you'll most likely need these plugins. In
			// some cases you'll need additional configuration -
			// consult the documentation for details:
			// https://github.com/rollup/plugins/tree/master/packages/commonjs
			resolve({
				browser: true,
				dedupe: ['svelte']
			}),
			commonjs(),

			terser()
		],
		watch: {
			clearScreen: false
		}
	}
});