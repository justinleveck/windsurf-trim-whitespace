"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
function activate(context) {
    console.log('Windsurf Trim Whitespace extension is active');
    // Register a listener for the pre-save event
    const disposable = vscode.workspace.onWillSaveTextDocument((event) => {
        const document = event.document;
        const edits = [];
        // Iterate through each line of the document
        for (let i = 0; i < document.lineCount; i++) {
            const line = document.lineAt(i);
            const text = line.text;
            const trimmedText = text.trimEnd();
            // If the line has trailing whitespace, create an edit
            if (text !== trimmedText) {
                const range = new vscode.Range(i, 0, // Start of the line
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
function deactivate() {
    console.log('Windsurf Trim Whitespace extension is deactivated');
}
//# sourceMappingURL=extension.js.map