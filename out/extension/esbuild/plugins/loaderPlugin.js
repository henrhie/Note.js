"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loaderPlugin = void 0;
const axios_1 = require("axios");
const cache_1 = require("../../cache");
const loaderPlugin = (entryCellValue, cells) => {
    return {
        name: 'custom-loader-plugin',
        setup(build) {
            build.onLoad({ filter: /^index\.js$/ }, () => {
                return {
                    loader: 'jsx',
                    contents: entryCellValue,
                };
            });
            build.onLoad({ filter: /.*/, namespace: 'unpkg' }, async (args) => {
                const paths = new URL(args.path).pathname.split('/');
                const filename = new URL(args.path).pathname.split('/')[paths.length - 1];
                const cacheData = cache_1.cache.getModuleData(filename);
                if (cacheData) {
                    return {
                        contents: cacheData,
                        loader: 'jsx',
                    };
                }
            });
            build.onLoad({ filter: /^https?:\/\//, namespace: 'unpkg' }, async (args) => {
                const { data, request } = await axios_1.default.get(args.path);
                cache_1.cache.setModuleData(data, request.path);
                const chunk = {
                    loader: 'jsx',
                    contents: data,
                };
                return chunk;
            });
            build.onLoad({ filter: /.css$/, namespace: 'cell_module' }, async (args) => {
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
                const result = {
                    loader: 'jsx',
                    contents,
                };
                return result;
            });
            build.onLoad({ filter: /.css$/, namespace: 'unpkg-css' }, async (args) => {
                const { data, request } = await axios_1.default.get(args.path.replace(/.css$/, ''));
                const escaped = data
                    .replace(/\n/g, '')
                    .replace(/"/g, '\\"')
                    .replace(/'/g, "\\'");
                const contents = `
			    const style = document.createElement("style");
			    style.innerText = "${escaped}";
			    document.head.appendChild(style);
			  `;
                const result = {
                    loader: 'jsx',
                    contents,
                };
                cache_1.cache.setModuleData(data, request.path);
                return result;
            });
            build.onLoad({ filter: /.*/, namespace: 'cell_module' }, async (args) => {
                const contents = cells[args.path.substring(2)];
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
//# sourceMappingURL=loaderPlugin.js.map