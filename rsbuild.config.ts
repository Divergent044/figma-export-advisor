import { defineConfig } from '@rsbuild/core';

import { ReplaceFigmaFontsPlugin } from './rsbuild/plugins';
import { rspack, swc } from './rsbuild/tools';

export default defineConfig({
	source: {
		entry: {
			ui: './src/ui/main.ts',
			code: {
				import: './src/code.ts',
				html: false,
			},
		},
	},

	html: {
		inject: 'body',
		scriptLoading: 'blocking',
		template: './src/ui/index.html',
	},

	output: {
		minify: true,
		distPath: {
			root: '.',
			js: '',
		},

		filename: {
			js: '[name].js',
		},

		inlineScripts: true,
		inlineStyles: true,
	},

	tools: {
		rspack: rspack([new ReplaceFigmaFontsPlugin()]),
		swc,
	},
});
