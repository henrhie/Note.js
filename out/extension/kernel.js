"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Kernel = void 0;
const vscode = require("vscode");
class Kernel {
    constructor() {
        this.id = 'notebook';
        this.label = 'Notebook Kernel';
        this.supportedLanguages = ['javascript'];
        this.executionOrder = 0;
        this.controller = vscode.notebooks.createNotebookController(this.id, 'notebook', this.label);
        this.controller.supportedLanguages = this.supportedLanguages;
        this.controller.supportsExecutionOrder = true;
        this.controller.executeHandler = this._executeAll.bind(this);
    }
    dispose() {
        this.controller.dispose();
    }
    _executeAll(cells, _notebook, _controller) {
        for (let cell of cells) {
            this._doExecution(cell);
        }
    }
    async _doExecution(cell) {
        const execution = this.controller.createNotebookCellExecution(cell);
        const text = cell.document.getText();
        execution.executionOrder = ++this.executionOrder;
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
exports.Kernel = Kernel;
//# sourceMappingURL=kernel.js.map