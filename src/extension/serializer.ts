import * as vscode from 'vscode';
import { TextEncoder, TextDecoder } from 'util';

interface RawNotebookData {
	cells: RawNotebookCell[];
}

interface RawNotebookCell {
	language: string;
	value: string;
	kind: vscode.NotebookCellKind;
	editable?: boolean;
}

export class Serializer implements vscode.NotebookSerializer {
	public readonly label: string = 'My Sample Content Serializer';

	public async deserializeNotebook(
		data: Uint8Array,
		token: vscode.CancellationToken
	): Promise<vscode.NotebookData> {
		var contents = new TextDecoder().decode(data);

		let raw: RawNotebookData;
		try {
			raw = <RawNotebookData>JSON.parse(contents);
		} catch {
			raw = { cells: [] };
		}

		const cells = raw.cells.map(
			(item) =>
				new vscode.NotebookCellData(item.kind, item.value, item.language)
		);

		return new vscode.NotebookData(cells);
	}

	public async serializeNotebook(
		data: vscode.NotebookData,
		token: vscode.CancellationToken
	): Promise<Uint8Array> {
		let contents: RawNotebookData = { cells: [] };

		for (const cell of data.cells) {
			contents.cells.push({
				kind: cell.kind,
				language: cell.languageId,
				value: cell.value,
			});
		}

		return new TextEncoder().encode(JSON.stringify(contents));
	}
}
