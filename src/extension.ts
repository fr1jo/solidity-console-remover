import * as vscode from 'vscode';
import { ConsoleRemover } from './consoleRemover';
import { WorkspaceProcessor } from './workspaceProcessor';
import { Config } from './config';

/**
 * Extension activation
 */
export function activate(context: vscode.ExtensionContext) {
  const remover = new ConsoleRemover();
  const processor = new WorkspaceProcessor();

  // Register commands
  const removeLogsCommand = vscode.commands.registerCommand(
    'solidity-console-remover.removeConsoleLogs',
    () => handleRemoval(false, remover)
  );

  const removeLogsAndImportCommand = vscode.commands.registerCommand(
    'solidity-console-remover.removeConsoleLogsAndImport',
    () => handleRemoval(true, remover)
  );

  const removeLogsWorkspaceCommand = vscode.commands.registerCommand(
    'solidity-console-remover.removeConsoleLogsWorkspace',
    () => handleWorkspaceRemoval(false, processor)
  );

  const removeLogsAndImportWorkspaceCommand = vscode.commands.registerCommand(
    'solidity-console-remover.removeConsoleLogsAndImportWorkspace',
    () => handleWorkspaceRemoval(true, processor)
  );

  context.subscriptions.push(
    removeLogsCommand,
    removeLogsAndImportCommand,
    removeLogsWorkspaceCommand,
    removeLogsAndImportWorkspaceCommand
  );
}

/**
 * Handle removal for single file
 */
async function handleRemoval(removeImports: boolean, remover: ConsoleRemover): Promise<void> {
  const editor = vscode.window.activeTextEditor;

  if (!editor) {
    vscode.window.showErrorMessage('No active editor found');
    return;
  }

  const document = editor.document;

  // Check if it's a Solidity file
  if (!document.fileName.endsWith('.sol')) {
    vscode.window.showWarningMessage('This command only works on Solidity (.sol) files');
    return;
  }

  const text = document.getText();
  const options = Config.getOptions(removeImports);

  // Preview removal
  const preview = remover.previewRemoval(text, options);

  if (preview.totalToRemove === 0) {
    if (Config.shouldShowNotifications()) {
      vscode.window.showInformationMessage('No console.log statements found');
    }
    return;
  }

  // Show confirmation dialog if enabled
  if (options.confirmBeforeRemoval) {
    const message = `Found ${preview.lineNumbers.length} console.log statement(s)${
      removeImports && preview.importLineNumbers.length > 0
        ? ` and ${preview.importLineNumbers.length} import(s)`
        : ''
    }. Remove?`;

    const action = await vscode.window.showWarningMessage(
      message,
      { modal: true },
      'Remove',
      'Cancel'
    );

    if (action !== 'Remove') {
      return; // User cancelled
    }
  }

  // Perform removal
  const result = remover.removeConsoleLogs(text, options);

  // Apply changes
  const edit = new vscode.WorkspaceEdit();
  const fullRange = new vscode.Range(
    document.positionAt(0),
    document.positionAt(text.length)
  );
  edit.replace(document.uri, fullRange, result.newText);

  const success = await vscode.workspace.applyEdit(edit);

  if (success) {
    // Show notification
    if (Config.shouldShowNotifications()) {
      const message = `Removed ${result.consoleLogsRemoved} console.log statement(s)${
        result.importsRemoved > 0 ? ` and ${result.importsRemoved} import(s)` : ''
      }`;
      vscode.window.showInformationMessage(message);
    }
  } else {
    vscode.window.showErrorMessage('Failed to remove console logs');
  }
}

/**
 * Handle workspace-wide removal
 */
async function handleWorkspaceRemoval(
  removeImports: boolean,
  processor: WorkspaceProcessor
): Promise<void> {
  const options = Config.getOptions(removeImports);

  // Find all Solidity files
  const files = await processor.findSolidityFiles();

  if (files.length === 0) {
    vscode.window.showInformationMessage('No Solidity files found in workspace');
    return;
  }

  // Show confirmation dialog
  if (options.confirmBeforeRemoval) {
    const message = `Remove console logs from ${files.length} Solidity file(s)?`;
    const action = await vscode.window.showWarningMessage(
      message,
      { modal: true },
      'Remove',
      'Cancel'
    );

    if (action !== 'Remove') {
      return; // User cancelled
    }
  }

  // Process workspace
  const result = await processor.processWorkspace(options);

  // Show results
  if (Config.shouldShowNotifications()) {
    if (result.filesProcessed === 0) {
      vscode.window.showInformationMessage('No console.log statements found in workspace');
    } else {
      const message = `Removed ${result.totalLogsRemoved} console.log statement(s)${
        result.totalImportsRemoved > 0 ? ` and ${result.totalImportsRemoved} import(s)` : ''
      } from ${result.filesProcessed} file(s)`;

      if (result.errors.length > 0) {
        const errorMsg = `${message}\n\nErrors:\n${result.errors.join('\n')}`;
        vscode.window.showWarningMessage(errorMsg);
      } else {
        vscode.window.showInformationMessage(message);
      }
    }
  }
}

/**
 * Extension deactivation
 */
export function deactivate() {
  // Cleanup if needed
}
