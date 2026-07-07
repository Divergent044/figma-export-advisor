import type { RspackPluginInstance } from '@rspack/core';
import type { ToolsConfig } from '@rsbuild/core';

type RspackConfigFn =
	NonNullable<ToolsConfig['rspack']> extends infer T
		? T extends (config: infer C, ...args: infer A) => infer R
			? (config: C, ...args: A) => R
			: never
		: never;

export const rspack =
	(plugins: RspackPluginInstance | RspackPluginInstance[]): RspackConfigFn =>
	(config) => {
		const _plugins = Array.isArray(plugins) ? plugins : [plugins];

		config.plugins ??= [];
		config.plugins.push(..._plugins);

		return config;
	};
