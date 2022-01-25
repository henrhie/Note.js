// import * as esbuild from 'esbuild';
// import axios from 'axios';
// import fs from 'fs/promises';
// import cache from './cache';

// type PluginFactoryType = () => esbuild.Plugin;

// const loaderPlugin: PluginFactoryType = () => {
// 	return {
// 		name: 'custom-loader-plugin',
// 		setup(build: esbuild.PluginBuild) {
// 			build.onLoad({ filter: /.*/, namespace: 'unpkg' }, async (args) => {
// 				const paths = new URL(args.path).pathname.split('/');
// 				const filename = new URL(args.path).pathname.split('/')[
// 					paths.length - 1
// 				];
// 				const cachedResult = await cache.retrieveFile(filename);
// 				if (cachedResult) {
// 					return {
// 						contents: cachedResult,
// 					};
// 				}
// 			});
// 			build.onLoad(
// 				{ filter: /^https?:\/\//, namespace: 'unpkg' },
// 				async (args) => {
// 					const { data, request } = await axios.get<string>(args.path);
// 					await cache.writeFile(data, request.path);
// 					const chunk: esbuild.OnLoadResult = {
// 						loader: 'jsx',
// 						contents: data,
// 					};
// 					return chunk;
// 				}
// 			);

// 			build.onLoad({ filter: /.*/, namespace: 'file' }, async (args) => {
// 				const contents = await fs.readFile(args.path, { encoding: 'utf-8' });
// 				const chunk: esbuild.OnLoadResult = {
// 					loader: 'jsx',
// 					contents,
// 				};
// 				return chunk;
// 			});
// 		},
// 	};
// };

// export default loaderPlugin;
