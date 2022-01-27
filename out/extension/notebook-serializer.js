"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serializer = void 0;
const vscode = require("vscode");
const util_1 = require("util");
class Serializer {
    constructor() {
        this.label = 'Serializer';
        this.mapModuleNameToModule = {};
    }
    async deserializeNotebook(data, token) {
        var contents = new util_1.TextDecoder().decode(data);
        let raw;
        try {
            raw = JSON.parse(contents);
        }
        catch {
            raw = { cells: [] };
        }
        let moduleName;
        const cells = raw.cells.map((item) => {
            moduleName =
                item.value.match(/\/\/.+?\/\//) || item.value.match(/\/\*.+?\//);
            if (moduleName) {
                this.mapModuleNameToModule[moduleName[0]
                    .replace(/\/\//g, '')
                    .replace('/*', '')
                    .replace('*/', '')
                    .trim()] = item.value.replace(moduleName[0], '');
            }
            return new vscode.NotebookCellData(item.kind, item.value, item.language);
        });
        return new vscode.NotebookData(cells);
    }
    async serializeNotebook(data, token) {
        let contents = { cells: [] };
        let moduleName;
        for (const [index, cell] of data.cells.entries()) {
            contents.cells.push({
                kind: cell.kind,
                language: cell.languageId,
                value: cell.value,
                index,
            });
            moduleName =
                cell.value.match(/\/\/.+?\/\//) || cell.value.match(/\/\*.+?\//);
            if (moduleName) {
                this.mapModuleNameToModule[moduleName[0]
                    .replace(/\/\//g, '')
                    .replace('/*', '')
                    .replace('*/', '')
                    .trim()] = cell.value.replace(moduleName[0], '');
            }
        }
        return new util_1.TextEncoder().encode(JSON.stringify(contents));
    }
    getMapModuleNameToModule() {
        return this.mapModuleNameToModule;
    }
}
const serializer = new Serializer();
exports.serializer = serializer;
//# sourceMappingURL=notebook-serializer.js.map