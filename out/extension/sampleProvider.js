"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SampleKernel = exports.SampleContentSerializer = void 0;
const vscode = require("vscode");
const util_1 = require("util");
class SampleContentSerializer {
    constructor() {
        this.label = 'My Sample Content Serializer';
    }
    async deserializeNotebook(data, token) {
        var contents = new util_1.TextDecoder().decode(data); // convert to String to make JSON object
        // Read file contents
        let raw;
        try {
            raw = JSON.parse(contents);
        }
        catch {
            raw = { cells: [] };
        }
        // Create array of Notebook cells for the VS Code API from file contents
        const cells = raw.cells.map((item) => new vscode.NotebookCellData(item.kind, item.value, item.language));
        // Pass read and formatted Notebook Data to VS Code to display Notebook with saved cells
        return new vscode.NotebookData(cells);
    }
    async serializeNotebook(data, token) {
        // Map the Notebook data into the format we want to save the Notebook data as
        let contents = { cells: [] };
        for (const cell of data.cells) {
            contents.cells.push({
                kind: cell.kind,
                language: cell.languageId,
                value: cell.value,
            });
        }
        // Give a string of all the data to save and VS Code will handle the rest
        return new util_1.TextEncoder().encode(JSON.stringify(contents));
    }
}
exports.SampleContentSerializer = SampleContentSerializer;
class SampleKernel {
    constructor() {
        this.id = 'test-notebook-renderer-kernel';
        this.label = 'Sample Notebook Kernel';
        this.supportedLanguages = ['javascript'];
        this._executionOrder = 0;
        this._controller = vscode.notebooks.createNotebookController(this.id, 'test-notebook-renderer', this.label);
        this._controller.supportedLanguages = this.supportedLanguages;
        this._controller.supportsExecutionOrder = true;
        this._controller.executeHandler = this._executeAll.bind(this);
    }
    dispose() {
        this._controller.dispose();
    }
    _executeAll(cells, _notebook, _controller) {
        for (let cell of cells) {
            this._doExecution(cell);
        }
    }
    async _doExecution(cell) {
        const execution = this._controller.createNotebookCellExecution(cell);
        execution.executionOrder = ++this._executionOrder;
        execution.start(Date.now());
        try {
            execution.replaceOutput([
                new vscode.NotebookCellOutput([
                    vscode.NotebookCellOutputItem.text('Dummy output text!'),
                ]),
            ]);
            execution.end(true, Date.now());
        }
        catch (err) {
            execution.replaceOutput([
                new vscode.NotebookCellOutput([
                    vscode.NotebookCellOutputItem.error(err),
                ]),
            ]);
            execution.end(false, Date.now());
        }
    }
}
exports.SampleKernel = SampleKernel;
//# sourceMappingURL=sampleProvider.js.map