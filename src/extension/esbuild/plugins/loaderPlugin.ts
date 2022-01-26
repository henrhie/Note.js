import * as esbuild from 'esbuild';
import axios from 'axios';

type MapModuleNametoModule = { [key: string]: string };
type PluginFactoryType = (
	entryCellValue: string,
	cells: MapModuleNametoModule
) => esbuild.Plugin;

export const loaderPlugin: PluginFactoryType = (entryCellValue, cells) => {
	return {
		name: 'custom-loader-plugin',
		setup(build: esbuild.PluginBuild) {
			build.onLoad({ filter: /^index\.js$/ }, () => {
				return {
					loader: 'jsx',
					contents: entryCellValue,
				};
			});

			/**@todo test fetching on local laptop... does not on company machine due to network restrictions */
			build.onLoad(
				{ filter: /^https?:\/\//, namespace: 'unpkg' },
				async (args) => {
					// console.log('args in onload: ', args);
					const { data } = await axios.get<string>(args.path);
					const chunk: esbuild.OnLoadResult = {
						loader: 'jsx',
						contents: data,
					};
					return chunk;
				}
			);

			build.onLoad({ filter: /.*/, namespace: 'cell_module' }, async (args) => {
				const contents = cells[args.path.substring(2)];
				const chunk: esbuild.OnLoadResult = {
					loader: 'jsx',
					contents,
				};
				return chunk;
			});
		},
	};
};
