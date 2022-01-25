import * as esbuild from 'esbuild';
import { resolverPlugin } from './plugins/resolvePlugin';
import { loaderPlugin } from './plugins/loaderPlugin';

export type ModuleNameToModuleType = { [key: string]: string };

export const bundleCode = async (
	entryCellValue: string,
	codeCells: ModuleNameToModuleType
) => {
	const buildResult = await esbuild.build({
		entryPoints: ['EntryUniqueFileName.js'],
		outfile: 'output.js',
		bundle: true,
		platform: 'browser',
		plugins: [resolverPlugin(), loaderPlugin(entryCellValue, codeCells)],
	});

	return buildResult;
};
