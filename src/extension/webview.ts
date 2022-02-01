import * as vscode from 'vscode';
// import { html } from './webview-internal/html';

class WebViewManager {
	/**
	 * Track the currently panel. Only allow a single panel to exist at a time.
	 */
	public static currentPanel: WebViewManager | undefined;
	private extensionURI: vscode.Uri;
	private static webviewRootUri: vscode.Uri;

	public static readonly viewType = 'webViewManager';

	private readonly _panel: vscode.WebviewPanel;
	private _disposables: vscode.Disposable[] = [];

	private constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
		this._panel = panel;
		this._panel.onDidDispose(() => this.dispose(), null, this._disposables);
		this.extensionURI = extensionUri;
		WebViewManager.webviewRootUri = this._panel.webview.asWebviewUri(
			vscode.Uri.joinPath(
				this.extensionURI,
				'src',
				'extension',
				'webview-internal'
			)
		);
		this._panel.webview.html = WebViewManager.webviewHtml(
			'',
			this._panel.webview,
			WebViewManager.webviewRootUri
		);
	}

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
			{
				enableScripts: true,
				localResourceRoots: [
					vscode.Uri.joinPath(
						extensionUri,
						'src',
						'extension',
						'webview-internal'
					),
				],
			}
		);

		WebViewManager.currentPanel = new WebViewManager(panel, extensionUri);
	}

	public static revive(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
		WebViewManager.currentPanel = new WebViewManager(panel, extensionUri);
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

	private static webviewHtml(
		htmlContent: string,
		webview: vscode.Webview,
		rootResourceUri: vscode.Uri
	) {
		if (!WebViewManager.currentPanel) {
			return '';
		}
		const scriptUri = webview.asWebviewUri(
			vscode.Uri.joinPath(rootResourceUri, 'webview-scripts.js')
		);

		const styleUri = webview.asWebviewUri(
			vscode.Uri.joinPath(rootResourceUri, 'webview-styles.css')
		);

		const nonce = getNonce();

		return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8"/>
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
			<meta http-equiv="Content-Security-Policy"
     		content="img-src ${webview.cspSource} https:; script-src 
		 		${webview.cspSource} 'unsafe-eval';"
			/>
      <link href="${styleUri}" rel="stylesheet">
    </head>
    <body>
     ${htmlContent}
     <script src="${scriptUri}"></script>
    </body>
    </html>
  `;
	}

	public static setHtmlAsString(htmlContent: string) {
		if (WebViewManager.currentPanel) {
			WebViewManager.currentPanel._panel.webview.html = this.webviewHtml(
				htmlContent,
				WebViewManager.currentPanel?._panel.webview,
				WebViewManager.webviewRootUri
			);
		}
	}

	public static setHtmlWithContentOnly(htmlContent: string) {
		WebViewManager.setHtmlAsString(htmlContent);
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

function getNonce() {
	let text = '';
	const possible =
		'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	for (let i = 0; i < 32; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return text;
}

export { WebViewManager };
