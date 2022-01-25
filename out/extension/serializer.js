"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Serializer = void 0;
const vscode = require("vscode");
const util_1 = require("util");
class Serializer {
    constructor() {
        this.label = 'My Sample Content Serializer';
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
        const cells = raw.cells.map((item) => new vscode.NotebookCellData(item.kind, item.value, item.language));
        return new vscode.NotebookData(cells);
    }
    async serializeNotebook(data, token) {
        let contents = { cells: [] };
        for (const cell of data.cells) {
            contents.cells.push({
                kind: cell.kind,
                language: cell.languageId,
                value: cell.value,
            });
        }
        return new util_1.TextEncoder().encode(JSON.stringify(contents));
    }
}
exports.Serializer = Serializer;
//# sourceMappingURL=serializer.js.map