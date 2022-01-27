import * as esbuild from 'esbuild';
import axios from 'axios';
import { cache } from '../../cache';

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

			build.onLoad({ filter: /.*/, namespace: 'unpkg' }, async (args) => {
				const paths = new URL(args.path).pathname.split('/');
				const filename = new URL(args.path).pathname.split('/')[
					paths.length - 1
				];
				const cacheData = cache.getModuleData(filename);

				if (cacheData) {
					return {
						contents: cacheData,
						loader: 'jsx',
					};
				}
			});

			build.onLoad(
				{ filter: /^https?:\/\//, namespace: 'unpkg' },
				async (args) => {
					const { data, request } = await axios.get<string>(args.path);
					cache.setModuleData(data, request.path);
					const chunk: esbuild.OnLoadResult = {
						loader: 'jsx',
						contents: data,
					};
					return chunk;
				}
			);

			build.onLoad(
				{ filter: /.css$/, namespace: 'cell_module' },
				async (args: esbuild.OnLoadArgs) => {
					const moduleName = args.path.substring(2).replace(/.css$/, '');
					const cellData = cells[moduleName];

					const escaped = cellData
						.replace(/\n/g, '')
						.replace(/"/g, '\\"')
						.replace(/'/g, "\\'")
						.replace(/\r/g, '');

					const contents = `
			    const style = document.createElement("style");
			    style.innerText = "${escaped}";
			    document.head.appendChild(style);
			  `;

					const result: esbuild.OnLoadResult = {
						loader: 'jsx',
						contents,
					};
					return result;
				}
			);

			build.onLoad(
				{ filter: /.css$/, namespace: 'unpkg-css' },
				async (args: esbuild.OnLoadArgs) => {
					const paths = new URL(args.path).pathname.split('/');
					const filename = new URL(args.path).pathname.split('/')[
						paths.length - 1
					];
					const cacheData = cache.getModuleData(filename.replace(/.css$/, ''));

					if (cacheData) {
						return {
							contents: cacheData,
							loader: 'jsx',
						};
					}
					const { data, request } = await axios.get<string>(
						args.path.replace(/.css$/, '')
					);

					const escaped = data
						.replace(/\n/g, '')
						.replace(/"/g, '\\"')
						.replace(/'/g, "\\'");

					const contents = `
			    const style = document.createElement("style");
			    style.innerText = "${escaped}";
			    document.head.appendChild(style);
			  `;

					const result: esbuild.OnLoadResult = {
						loader: 'jsx',
						contents,
					};

					cache.setModuleData(contents, request.path);
					return result;
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
