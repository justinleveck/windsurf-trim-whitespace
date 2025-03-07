import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    console.log('Windsurf Trim Whitespace extension is active');

    // Register a listener for the pre-save event
    const disposable = vscode.workspace.onWillSaveTextDocument((event) => {
        const document = event.document;
        const edits: vscode.TextEdit[] = [];

        // Iterate through each line of the document
        for (let i = 0; i < document.lineCount; i++) {
            const line = document.lineAt(i);
            const text = line.text;
            const trimmedText = text.trimEnd();

            // If the line has trailing whitespace, create an edit
            if (text !== trimmedText) {
                const range = new vscode.Range(
                    i, 0, // Start of the line
                    i, text.length // End of the line
                );
                edits.push(vscode.TextEdit.replace(range, trimmedText));
            }
        }

        // Apply the edits if there are any
        if (edits.length > 0) {
            const workspaceEdit = new vscode.WorkspaceEdit();
            workspaceEdit.set(document.uri, edits);
            event.waitUntil(vscode.workspace.applyEdit(workspaceEdit));
        }
    });

    // Add the listener to the extension's subscriptions
    context.subscriptions.push(disposable);
}

export function deactivate() {
    console.log('Windsurf Trim Whitespace extension is deactivated');
}