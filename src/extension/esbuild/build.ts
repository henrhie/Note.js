import * as esbuild from 'esbuild';
import { resolverPlugin } from './plugins/resolvePlugin';
import { loaderPlugin } from './plugins/loaderPlugin';

export type ModuleNameToModuleType = { [key: string]: string };

export const bundleCode = async (
	entryCellValue: string,
	codeCells: ModuleNameToModuleType
) => {
	const buildResult = await esbuild.build({
		entryPoints: ['index.js'],
		bundle: true,
		platform: 'browser',
		write: false,
		plugins: [resolverPlugin(), loaderPlugin(entryCellValue, codeCells)],
		define: {
			// eslint-disable-next-line @typescript-eslint/naming-convention
			'process.env.NODE_ENV': '"production"',
			global: 'window',
		},
	});

	return buildResult;
};
