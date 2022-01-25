import * as vscode from 'vscode';
import { serializer } from './notebook-serializer';
import { bundleCode } from './esbuild/build';

export class Kernel {
	readonly id = 'notebook';
	public readonly label = 'Notebook Kernel';
	readonly supportedLanguages = ['javascript'];

	private executionOrder = 0;
	private readonly controller: vscode.NotebookController;

	constructor() {
		this.controller = vscode.notebooks.createNotebookController(
			this.id,
			'notebook',
			this.label
		);

		this.controller.supportedLanguages = this.supportedLanguages;
		this.controller.supportsExecutionOrder = true;
		this.controller.executeHandler = this._executeAll.bind(this);
	}

	dispose(): void {
		this.controller.dispose();
	}

	private _executeAll(
		cells: vscode.NotebookCell[],
		_notebook: vscode.NotebookDocument,
		_controller: vscode.NotebookController
	): void {
		for (let cell of cells) {
			this._doExecution(cell);
		}
	}

	private async _doExecution(cell: vscode.NotebookCell): Promise<void> {
		const execution = this.controller.createNotebookCellExecution(cell);

		execution.executionOrder = ++this.executionOrder;
		execution.start(Date.now());

		const code = await bundleCode(
			cell.document.getText(),
			serializer.getMapModuleNameToModule()
		);

		try {
			execution.replaceOutput([
				new vscode.NotebookCellOutput([
					vscode.NotebookCellOutputItem.text(
						'Dummy output text!========> ',
						code.outputFiles && code.outputFiles[0].text
					),
				]),
			]);
			execution.end(true, Date.now());
		} catch (err: any) {
			execution.replaceOutput([
				new vscode.NotebookCellOutput([
					vscode.NotebookCellOutputItem.error(err),
				]),
			]);
			execution.end(false, Date.now());
		}
	}
}
