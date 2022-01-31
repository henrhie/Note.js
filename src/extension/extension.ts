import * as vscode from 'vscode';
import { WebViewManager } from './webview';
import { Kernel } from './kernel';

import { serializer } from './notebook-serializer';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(
		vscode.workspace.registerNotebookSerializer('notebook', serializer, {
			transientOutputs: false,
		}),
		new Kernel()
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('show webview', () => {
			WebViewManager.createOrShow();
		})
	);
}

vscode.commands.executeCommand('show webview');

export function deactivate() {}
