import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import dsv from '@rollup/plugin-dsv';
import { terser } from 'rollup-plugin-terser';
import json from "@rollup/plugin-json";
import css from 'rollup-plugin-css-only';

// List of modules to compile (must match .js filenames in src, eg. LineChart.js => LineChart)
const modules = ['LineChart', 'BarChart', 'ColumnChart', 'ScatterChart', 'DotPlotChart'];

export default [
	...modules.map(module => {
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
	}),
	{
		input: 'src/main.js',
		output: {
			sourcemap: true,
			format: 'iife',
			name: 'app',
			file: 'dist/build/bundle.js'
		},
		plugins: [
			// Allow for importing csv files as modules
			dsv(),
			// And importing json files
			json(),

			svelte({
				compilerOptions: {
					dev: false, 
					hydratable: false
				}
			}),
			// we'll extract any component CSS out into
			// a separate file - better for performance
			css({ output: 'bundle.css' }),

			// If you have external dependencies installed from
			// npm, you'll most likely need these plugins. In
			// some cases you'll need additional configuration —
			// consult the documentation for details:
			// https://github.com/rollup/plugins/tree/master/packages/commonjs
			resolve({
				browser: true,
				dedupe: importee => importee === 'svelte' || importee.startsWith('svelte/')
			}),
			commonjs(),

			terser()

		],
		watch: {
			clearScreen: false
		}
	}
];