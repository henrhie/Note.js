"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loaderPlugin = void 0;
const axios_1 = require("axios");
const loaderPlugin = (entryCellValue, cells) => {
    return {
        name: 'custom-loader-plugin',
        setup(build) {
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
            build.onLoad({ filter: /^https?:\/\//, namespace: 'unpkg' }, async (args) => {
                const { data } = await axios_1.default.get(args.path);
                // await cache.writeFile(data, request.path);
                const chunk = {
                    loader: 'jsx',
                    contents: data,
                };
                return chunk;
            });
            build.onLoad({ filter: /.*/, namespace: 'cell_module' }, async (args) => {
                const contents = cells[args.path];
                const chunk = {
                    loader: 'jsx',
                    contents,
                };
                return chunk;
            });
        },
    };
};
exports.loaderPlugin = loaderPlugin;
exports.default = exports.loaderPlugin;
//# sourceMappingURL=loaderPlugin.js.map