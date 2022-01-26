import * as esbuild from 'esbuild';
import { URL } from 'url';

type PluginFactoryType = () => esbuild.Plugin;

export const resolverPlugin: PluginFactoryType = () => {
	return {
		name: 'custom-resolver-plugin',
		setup(build: esbuild.PluginBuild) {
			build.onResolve({ filter: /^index\.js$/ }, () => {
				return {
					path: 'index.js',
					namespace: 'a',
				};
			});

			build.onResolve({ filter: /.*/ }, (args: esbuild.OnResolveArgs) => {
				if (args.path.startsWith('./') || args.path.startsWith('../')) {
					if (
						args.importer.startsWith('https://') ||
						args.importer.startsWith('http://')
					) {
						return {
							namespace: 'unpkg',
							path: new URL(args.path, args.importer + '/').toString(),
						};
					}

					return {
						path: args.path,
						namespace: 'cell_module',
					};
				}
				return {
					namespace: 'unpkg',
					path: `https://unpkg.com/${args.path}`,
				};
			});
		},
	};
};
