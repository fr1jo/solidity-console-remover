import * as vscode from 'vscode';
import { ConsoleRemover } from './consoleRemover';
import { RemovalOptions, WorkspaceResult } from './types';

/**
 * Handles workspace-wide console log removal operations
 */
export class WorkspaceProcessor {
  private remover: ConsoleRemover;

  constructor() {
    this.remover = new ConsoleRemover();
  }

  /**
   * Find all Solidity files in the workspace
   */
  async findSolidityFiles(): Promise<vscode.Uri[]> {
    return await vscode.workspace.findFiles('**/*.sol', '**/node_modules/**');
  }

  /**
   * Process all Solidity files in workspace
   */
  async processWorkspace(options: RemovalOptions): Promise<WorkspaceResult> {
    const files = await this.findSolidityFiles();

    if (files.length === 0) {
      return {
        filesProcessed: 0,
        totalLogsRemoved: 0,
        totalImportsRemoved: 0,
        errors: []
      };
    }

    return await this.processWithProgress(files, options);
  }

  /**
   * Process files with progress indication
   */
  async processWithProgress(
    files: vscode.Uri[],
    options: RemovalOptions
  ): Promise<WorkspaceResult> {
    const result: WorkspaceResult = {
      filesProcessed: 0,
      totalLogsRemoved: 0,
      totalImportsRemoved: 0,
      errors: []
    };

    await vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Notification,
        title: 'Removing console logs from Solidity files',
        cancellable: true
      },
      async (progress, token) => {
        for (let i = 0; i < files.length; i++) {
          if (token.isCancellationRequested) {
            break;
          }

          const file = files[i];
          progress.report({
            message: `Processing ${i + 1}/${files.length}: ${file.fsPath.split('/').pop()}`,
            increment: (100 / files.length)
          });

          try {
            await this.processFile(file, options, result);
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            result.errors.push(`${file.fsPath}: ${errorMessage}`);
          }
        }
      }
    );

    return result;
  }

  /**
   * Process a single file
   */
  private async processFile(
    fileUri: vscode.Uri,
    options: RemovalOptions,
    result: WorkspaceResult
  ): Promise<void> {
    // Read file
    const document = await vscode.workspace.openTextDocument(fileUri);
    const text = document.getText();

    // Remove console logs
    const removalResult = this.remover.removeConsoleLogs(text, options);

    // Only update file if something was removed
    if (removalResult.consoleLogsRemoved > 0 || removalResult.importsRemoved > 0) {
      const edit = new vscode.WorkspaceEdit();
      const fullRange = new vscode.Range(
        document.positionAt(0),
        document.positionAt(text.length)
      );
      edit.replace(fileUri, fullRange, removalResult.newText);

      const success = await vscode.workspace.applyEdit(edit);

      if (success) {
        result.filesProcessed++;
        result.totalLogsRemoved += removalResult.consoleLogsRemoved;
        result.totalImportsRemoved += removalResult.importsRemoved;

        // Save the document
        await document.save();
      } else {
        throw new Error('Failed to apply edit');
      }
    }
  }
}
