import * as esbuild from 'esbuild';
import path from 'path';
const builtins = require('module').builtinModules as string[];

type PluginFactoryType = () => esbuild.Plugin;

const resolverPlugin: PluginFactoryType = () => {
	return {
		name: 'custom-resolver-plugin',
		setup(build: esbuild.PluginBuild) {
			build.onResolve({ filter: /.*/ }, (args: esbuild.OnResolveArgs) => {
				if (
					args.path.startsWith('./') ||
					args.path.startsWith('../') ||
					args.kind === 'entry-point'
				) {
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
						path: path.join(
							args.resolveDir,
							args.path + (!args.path.endsWith('.js') ? '.js' : '')
						),
						namespace: 'file',
					};
				}
				if (!builtins.includes(args.path)) {
					return {
						namespace: 'unpkg',
						path: `https://unpkg.com/${args.path}`,
					};
				}
			});
		},
	};
};

export default resolverPlugin;
