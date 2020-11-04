import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';

const production = !process.env.ROLLUP_WATCH;

export default {
	input: `apps/${process.env.module}.js`,
	output: {
		sourcemap: true,
		format: 'iife',
		name: `${process.env.module}`,
		file: `public/apps/${process.env.module}.js`
	},
	plugins: [
		svelte({
			// we'll extract any component CSS out into
			// a separate file - better for performance
			css: css => {
				css.write(`${process.env.module}.css`);
			}
		}),

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

		// If we're building for production (npm run build
		// instead of npm run dev), minify
		production && terser()
	],
	watch: {
		clearScreen: false
	}
};