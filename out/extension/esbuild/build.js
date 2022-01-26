"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bundleCode = void 0;
const esbuild = require("esbuild");
const resolvePlugin_1 = require("./plugins/resolvePlugin");
const loaderPlugin_1 = require("./plugins/loaderPlugin");
const bundleCode = async (entryCellValue, codeCells) => {
    const buildResult = await esbuild.build({
        entryPoints: ['index.js'],
        bundle: true,
        platform: 'browser',
        write: false,
        plugins: [resolvePlugin_1.resolverPlugin(), loaderPlugin_1.loaderPlugin(entryCellValue, codeCells)],
    });
    return buildResult;
};
exports.bundleCode = bundleCode;
//# sourceMappingURL=build.js.map