import * as esbuild from 'esbuild';
import axios from 'axios';
import * as fs from 'fs/promises';
// import cache from './cache';

type MapModuleNametoModule = { [key: string]: string };
type PluginFactoryType = (
	entryCellValue: string,
	cells: MapModuleNametoModule
) => esbuild.Plugin;

export const loaderPlugin: PluginFactoryType = (entryCellValue, cells) => {
	return {
		name: 'custom-loader-plugin',
		setup(build: esbuild.PluginBuild) {
			// build.onLoad({ filter: /.*/, namespace: 'unpkg' }, async (args) => {
			// 	const paths = new URL(args.path).pathname.split('/');
			// 	const filename = new URL(args.path).pathname.split('/')[
			// 		paths.length - 1
			// 	];
			// 	const cachedResult = await cache.retrieveFile(filename);
			// 	if (cachedResult) {
			// 		return {
			// 			contents: cachedResult,
			// 		};
			// 	}
			// });

			build.onLoad({ filter: /^EntryUniqueFileName\.js$/ }, () => {
				return {
					loader: 'jsx',
					contents: entryCellValue,
				};
			});

			build.onLoad(
				{ filter: /^https?:\/\//, namespace: 'unpkg' },
				async (args) => {
					const { data } = await axios.get<string>(args.path);
					// await cache.writeFile(data, request.path);
					const chunk: esbuild.OnLoadResult = {
						loader: 'jsx',
						contents: data,
					};
					return chunk;
				}
			);

			build.onLoad({ filter: /.*/, namespace: 'cell_module' }, async (args) => {
				const contents = cells[args.path];
				const chunk: esbuild.OnLoadResult = {
					loader: 'jsx',
					contents,
				};
				return chunk;
			});
		},
	};
};

export default loaderPlugin;
