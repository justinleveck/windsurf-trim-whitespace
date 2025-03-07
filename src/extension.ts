import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    // Register a command that can be called manually if needed
    const trimWhitespaceCommand = vscode.commands.registerCommand('windsurf-trim-whitespace.trimWhitespace', () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            trimWhitespaceInDocument(editor.document);
        } else {
            vscode.window.showInformationMessage('No active editor to trim whitespace');
        }
    });

    // Auto-trim on save
    const disposable = vscode.workspace.onWillSaveTextDocument((event) => {
        // Check if we should trim for this file type
        const config = vscode.workspace.getConfiguration('windsurfTrimWhitespace');
        const enabled = config.get<boolean>('enabled', true);
        const excludedLanguages = config.get<string[]>('excludedLanguages', []);

        if (!enabled) {
            return;
        }

        const document = event.document;

        // Skip excluded languages
        if (document.languageId && excludedLanguages.includes(document.languageId)) {
            return;
        }

        event.waitUntil(trimWhitespaceInDocument(document));
    });

    context.subscriptions.push(disposable, trimWhitespaceCommand);
}

// Helper function to trim whitespace in a document
async function trimWhitespaceInDocument(document: vscode.TextDocument): Promise<boolean> {
    const edits: vscode.TextEdit[] = [];

    for (let i = 0; i < document.lineCount; i++) {
        const line = document.lineAt(i);
        const text = line.text;
        const trimmedText = text.trimEnd();

        if (text !== trimmedText) {
            const range = new vscode.Range(i, 0, i, text.length);
            edits.push(vscode.TextEdit.replace(range, trimmedText));
        }
    }

    if (edits.length > 0) {
        const workspaceEdit = new vscode.WorkspaceEdit();
        workspaceEdit.set(document.uri, edits);
        return vscode.workspace.applyEdit(workspaceEdit);
    } else {
        return Promise.resolve(true);
    }
}

export function deactivate() {
    // Clean up resources when the extension is deactivated
}