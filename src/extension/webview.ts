import * as vscode from 'vscode';
import { html } from './webview-internal/html';

class WebViewManager {
	/**
	 * Track the currently panel. Only allow a single panel to exist at a time.
	 */
	public static currentPanel: WebViewManager | undefined;

	public static readonly viewType = 'webViewManager';

	private readonly _panel: vscode.WebviewPanel;
	private _disposables: vscode.Disposable[] = [];

	public static createOrShow(extensionUri: vscode.Uri) {
		const column = vscode.window.activeTextEditor
			? vscode.window.activeTextEditor.viewColumn
			: undefined;

		if (WebViewManager.currentPanel) {
			WebViewManager.currentPanel._panel.reveal(column);
			return;
		}

		const panel = vscode.window.createWebviewPanel(
			WebViewManager.viewType,
			'View Session',
			column || vscode.ViewColumn.Two,
			{ enableScripts: true }
		);

		WebViewManager.currentPanel = new WebViewManager(panel);
	}

	public static revive(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
		WebViewManager.currentPanel = new WebViewManager(panel);
	}

	public static postMessageToWebiew(message: any) {
		WebViewManager.currentPanel?._panel.webview.postMessage(message);
	}

	public static webViewContextOnMessage(callback: Function) {
		WebViewManager.currentPanel?._panel.webview.onDidReceiveMessage(
			(message: any) => {
				callback(message);
			}
		);
	}

	public static setHtmlAsString(htmlContent: string) {
		if (this.currentPanel) {
			this.currentPanel._panel.webview.html = html(htmlContent);
		}
	}

	private constructor(panel: vscode.WebviewPanel) {
		this._panel = panel;

		WebViewManager.setHtmlAsString(html());
		this._panel.onDidDispose(() => this.dispose(), null, this._disposables);
	}

	public dispose() {
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

export { WebViewManager };
