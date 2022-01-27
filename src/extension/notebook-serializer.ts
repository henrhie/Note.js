import * as vscode from 'vscode';
import { TextEncoder, TextDecoder } from 'util';

export interface RawNotebookData {
	cells: RawNotebookCell[];
}

interface RawNotebookCell {
	language: string;
	value: string;
	kind: vscode.NotebookCellKind;
	index: number;
	editable?: boolean;
}

class Serializer implements vscode.NotebookSerializer {
	public readonly label: string = 'Serializer';

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
		let moduleName: RegExpMatchArray | null;
		const cells = raw.cells.map((item) => {
			moduleName =
				item.value.match(/\/\/.+?\/\//) || item.value.match(/\/\*.+?\//);
			if (moduleName) {
				this.mapModuleNameToModule[
					moduleName[0]
						.replace(/\/\//g, '')
						.replace('/*', '')
						.replace('*/', '')
						.trim()
				] = item.value.replace(moduleName[0], '');
			}
			return new vscode.NotebookCellData(item.kind, item.value, item.language);
		});

		return new vscode.NotebookData(cells);
	}

	public async serializeNotebook(
		data: vscode.NotebookData,
		token: vscode.CancellationToken
	): Promise<Uint8Array> {
		let contents: RawNotebookData = { cells: [] };
		let moduleName: RegExpMatchArray | null;

		for (const [index, cell] of data.cells.entries()) {
			contents.cells.push({
				kind: cell.kind,
				language: cell.languageId,
				value: cell.value,
				index,
			});

			moduleName =
				cell.value.match(/\/\/.+?\/\//) || cell.value.match(/\/\*.+?\//);
			if (moduleName) {
				this.mapModuleNameToModule[
					moduleName[0]
						.replace(/\/\//g, '')
						.replace('/*', '')
						.replace('*/', '')
						.trim()
				] = cell.value.replace(moduleName[0], '');
			}
		}

		return new TextEncoder().encode(JSON.stringify(contents));
	}

	public getMapModuleNameToModule() {
		return this.mapModuleNameToModule;
	}

	private mapModuleNameToModule: { [key: string]: string } = {};
}

const serializer = new Serializer();

export { serializer };
