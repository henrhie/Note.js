"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loaderPlugin = void 0;
const axios_1 = require("axios");
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
            /**@todo test fetching on local laptop... does not on company machine due to network restrictions */
            build.onLoad({ filter: /^https?:\/\//, namespace: 'unpkg' }, async (args) => {
                const { data } = await axios_1.default.get(args.path);
                const chunk = {
                    loader: 'jsx',
                    contents: data,
                };
                return chunk;
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