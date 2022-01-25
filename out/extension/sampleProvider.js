"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SampleKernel = void 0;
const vscode = require("vscode");
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