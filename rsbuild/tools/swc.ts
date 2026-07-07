import type { SwcLoaderOptions } from '@rspack/core';

export const swc = (config: SwcLoaderOptions): SwcLoaderOptions => {
	config.jsc ??= {};
	config.jsc.target = 'esnext';

	return config;
};
