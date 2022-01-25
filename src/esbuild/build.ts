import * as esbuild from 'esbuild';
import resolverPlugin from './plugins/resolvePlugin';

esbuild
	.build({
		entryPoints: ['index.js'],
		outfile: 'output.js',
		bundle: true,
		platform: 'node',
		plugins: [resolverPlugin()],
	})
	.then((buildResult: esbuild.BuildResult) => {
		console.log('✅✅✅ bundle successful');
	})
	.catch((err: any) => {
		console.log('❌❌❌ error occured: ', err.message);
		process.exit(1);
	});
