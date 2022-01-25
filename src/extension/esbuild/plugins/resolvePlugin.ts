import * as esbuild from 'esbuild';
import * as path from 'path';
import { URL } from 'url';

type PluginFactoryType = () => esbuild.Plugin;

export const resolverPlugin: PluginFactoryType = () => {
	return {
		name: 'custom-resolver-plugin',
		setup(build: esbuild.PluginBuild) {
			build.onResolve({ filter: /^EntryUniqueFileName\.js$/ }, () => {
				return {
					path: 'EntryUniqueFileName.js',
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

					/**@todo modify this part to retrieve module content */
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

export default resolverPlugin;
