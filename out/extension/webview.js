"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebViewManager = void 0;
const vscode = require("vscode");
const html_1 = require("./html");
class WebViewManager {
    constructor(panel, extensionUri) {
        this._disposables = [];
        this._panel = panel;
        this._extensionUri = extensionUri;
        this._panel.webview.html = html_1.html;
        this._panel.onDidDispose(() => this.dispose(), null, this._disposables);
    }
    static createOrShow(extensionUri) {
        const column = vscode.window.activeTextEditor
            ? vscode.window.activeTextEditor.viewColumn
            : undefined;
        if (WebViewManager.currentPanel) {
            WebViewManager.currentPanel._panel.reveal(column);
            return;
        }
        const panel = vscode.window.createWebviewPanel(WebViewManager.viewType, 'View Session', column || vscode.ViewColumn.Two, { enableScripts: true });
        WebViewManager.currentPanel = new WebViewManager(panel, extensionUri);
    }
    static revive(panel, extensionUri) {
        WebViewManager.currentPanel = new WebViewManager(panel, extensionUri);
    }
    static postMessageToWebiew(message) {
        var _a;
        (_a = WebViewManager.currentPanel) === null || _a === void 0 ? void 0 : _a._panel.webview.postMessage(message);
    }
    static webViewContextOnMessage(callback) {
        var _a;
        (_a = WebViewManager.currentPanel) === null || _a === void 0 ? void 0 : _a._panel.webview.onDidReceiveMessage((message) => {
            callback(message);
        });
    }
    dispose() {
        WebViewManager.currentPanel = undefined;
        this._panel.dispose();
        while (this._disposables.length) {
            const x = this._disposables.pop();
            if (x) {
                x.dispose();
            }
        }
    }
}
exports.WebViewManager = WebViewManager;
WebViewManager.viewType = 'webViewManager';
//# sourceMappingURL=webview.js.map