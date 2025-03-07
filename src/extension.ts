import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    try {
        console.log('Windsurf Trim Whitespace extension is now activating...');

        // Show notification for debugging purposes
        vscode.window.showInformationMessage('Windsurf Trim Whitespace extension activated');

        // Log the full configuration to verify settings are loaded
        const config = vscode.workspace.getConfiguration('trimWhitespace');
        console.log('Full configuration:', config);
        console.log('Configuration values:', {
            enabled: config.get('enabled'),
            trimAfterWindsurfChanges: config.get('trimAfterWindsurfChanges'),
            excludedLanguages: config.get('excludedLanguages')
        });

        // Register a command that can be called manually if needed
        const trimWhitespaceCommand = vscode.commands.registerCommand('windsurf-trim-whitespace.trimWhitespace', () => {
            const editor = vscode.window.activeTextEditor;
            if (editor) {
                trimWhitespaceInDocument(editor.document).then(success => {
                    if (success) {
                        vscode.window.showInformationMessage('Trailing whitespace trimmed successfully');
                    } else {
                        vscode.window.showWarningMessage('Failed to trim whitespace');
                    }
                });
            } else {
                vscode.window.showInformationMessage('No active editor to trim whitespace');
            }
        });

        // Auto-trim on save
        const onSaveDisposable = vscode.workspace.onWillSaveTextDocument((event) => {
            const config = vscode.workspace.getConfiguration('trimWhitespace');
            const enabled = config.get<boolean>('enabled', true);
            const excludedLanguages = config.get<string[]>('excludedLanguages', []);

            if (!enabled) {
                console.log('Trimming disabled by configuration');
                return;
            }

            const document = event.document;
            if (document.languageId && excludedLanguages.includes(document.languageId)) {
                console.log(`Trimming skipped for language: ${document.languageId}`);
                return;
            }

            console.log('Trimming whitespace on save for:', document.fileName);
            event.waitUntil(trimWhitespaceInDocument(document));
        });

        // Listen for text document changes (including those made by Windsurf)
        const onTextChangeDisposable = vscode.workspace.onDidChangeTextDocument((event) => {
            const config = vscode.workspace.getConfiguration('trimWhitespace');
            const enabled = config.get<boolean>('enabled', true);
            const trimAfterWindsurfChanges = config.get<boolean>('trimAfterWindsurfChanges', false);
            const excludedLanguages = config.get<string[]>('excludedLanguages', []);

            if (!enabled || !trimAfterWindsurfChanges) {
                return;
            }

            const document = event.document;
            if (document.languageId && excludedLanguages.includes(document.languageId)) {
                return;
            }

            // Safeguard against empty content changes
            if (event.contentChanges.length === 0) {
                console.log('No content changes detected, skipping trim');
                return;
            }

            const isWindsurfChange = event.contentChanges.some(change => {
                if (!change.text) return false;
                return change.text.includes('Windsurf') ||
                    (change.text.length > 50 && change.range.start.line !== change.range.end.line);
            });

            if (isWindsurfChange) {
                console.log('Detected Windsurf change, scheduling trim for:', document.fileName);
                setTimeout(() => {
                    trimWhitespaceInDocument(document).then(success => {
                        if (success) {
                            console.log('Whitespace trimmed after Windsurf change');
                        } else {
                            console.log('Failed to trim whitespace after Windsurf change');
                        }
                    });
                }, 100);
            }
        });

        // Register disposables
        context.subscriptions.push(onSaveDisposable, onTextChangeDisposable, trimWhitespaceCommand);

        console.log('Windsurf Trim Whitespace extension is now active!');
    } catch (error) {
        console.error('Windsurf Trim Whitespace activation failed:', error);
        vscode.window.showErrorMessage('Windsurf Trim Whitespace activation failed: ' + (error instanceof Error ? error.message : String(error)));
    }
}

// Helper function to trim whitespace in a document
async function trimWhitespaceInDocument(document: vscode.TextDocument): Promise<boolean> {
    const edits: vscode.TextEdit[] = [];

    for (let i = 0; i < document.lineCount; i++) {
        const line = document.lineAt(i);
        const text = line.text;
        const trimmedText = text.trimEnd();

        if (text !== trimmedText) {
            console.log(`Trimming whitespace on line ${i}: "${text}" -> "${trimmedText}"`);
            const range = new vscode.Range(i, 0, i, text.length);
            edits.push(vscode.TextEdit.replace(range, trimmedText));
        }
    }

    if (edits.length > 0) {
        const workspaceEdit = new vscode.WorkspaceEdit();
        workspaceEdit.set(document.uri, edits);
        return vscode.workspace.applyEdit(workspaceEdit);
    } else {
        console.log('No trailing whitespace found to trim in:', document.fileName);
        return Promise.resolve(true);
    }
}

export function deactivate() {
    console.log('Windsurf Trim Whitespace extension is deactivating...');
}