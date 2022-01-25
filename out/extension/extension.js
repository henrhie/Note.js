"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
const webview_1 = require("./webview");
const serializer_1 = require("./serializer");
function activate(context) {
    context.subscriptions.push(vscode.workspace.registerNotebookSerializer('notebook', new serializer_1.Serializer(), {
        transientOutputs: false,
    }));
    context.subscriptions.push(vscode.commands.registerCommand('show webview', () => {
        webview_1.WebViewManager.createOrShow(context.extensionUri);
    }));
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map