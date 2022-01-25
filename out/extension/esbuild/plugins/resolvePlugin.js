"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolverPlugin = void 0;
const url_1 = require("url");
const resolverPlugin = () => {
    return {
        name: 'custom-resolver-plugin',
        setup(build) {
            build.onResolve({ filter: /^EntryUniqueFileName\.js$/ }, () => {
                return {
                    path: 'EntryUniqueFileName.js',
                };
            });
            build.onResolve({ filter: /.*/ }, (args) => {
                if (args.path.startsWith('./') || args.path.startsWith('../')) {
                    if (args.importer.startsWith('https://') ||
                        args.importer.startsWith('http://')) {
                        return {
                            namespace: 'unpkg',
                            path: new url_1.URL(args.path, args.importer + '/').toString(),
                        };
                    }
                    /**@todo modify this part to retrieve module content */
                    return {
                        path: args.path,
                        namespace: 'cell_module',
                    };
                }
                return {
                    namespace: 'unpkg',
                    path: `https://unpkg.com/${args.path}`,
                };
            });
        },
    };
};
exports.resolverPlugin = resolverPlugin;
exports.default = exports.resolverPlugin;
//# sourceMappingURL=resolvePlugin.js.map