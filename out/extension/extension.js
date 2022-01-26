"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
const webview_1 = require("./webview");
const kernel_1 = require("./kernel");
const notebook_serializer_1 = require("./notebook-serializer");
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
function activate(context) {
    context.subscriptions.push(vscode.workspace.registerNotebookSerializer('notebook', notebook_serializer_1.serializer, {
        transientOutputs: false,
    }), new kernel_1.Kernel());
    context.subscriptions.push(vscode.commands.registerCommand('show webview', () => {
        webview_1.WebViewManager.createOrShow(context.extensionUri);
    }));
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map