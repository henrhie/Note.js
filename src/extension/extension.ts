import * as vscode from 'vscode';
import { WebViewManager } from './webview';

import { Serializer } from './serializer';

export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(
		vscode.workspace.registerNotebookSerializer('notebook', new Serializer(), {
			transientOutputs: false,
		})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('show webview', () => {
			WebViewManager.createOrShow(context.extensionUri);
		})
	);
}

export function deactivate() {}
