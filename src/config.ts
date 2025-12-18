import * as vscode from 'vscode';
import { RemovalOptions } from './types';

/**
 * Configuration manager for Solidity Console Remover extension
 */
export class Config {
  private static readonly CONFIG_SECTION = 'solidityConsoleRemover';

  /**
   * Get current configuration as RemovalOptions
   */
  static getOptions(removeImports: boolean): RemovalOptions {
    const config = vscode.workspace.getConfiguration(this.CONFIG_SECTION);

    return {
      removeImports,
      preserveEmptyLines: config.get<boolean>('preserveEmptyLines', true),
      confirmBeforeRemoval: config.get<boolean>('confirmBeforeRemoval', true),
      customPatterns: config.get<string[]>('customPatterns', [])
    };
  }

  /**
   * Check if notifications should be shown
   */
  static shouldShowNotifications(): boolean {
    const config = vscode.workspace.getConfiguration(this.CONFIG_SECTION);
    return config.get<boolean>('showNotifications', true);
  }

  /**
   * Get confirm before removal setting
   */
  static shouldConfirmBeforeRemoval(): boolean {
    const config = vscode.workspace.getConfiguration(this.CONFIG_SECTION);
    return config.get<boolean>('confirmBeforeRemoval', true);
  }

  /**
   * Get custom patterns from config
   */
  static getCustomPatterns(): string[] {
    const config = vscode.workspace.getConfiguration(this.CONFIG_SECTION);
    return config.get<string[]>('customPatterns', []);
  }

  /**
   * Get preserve empty lines setting
   */
  static shouldPreserveEmptyLines(): boolean {
    const config = vscode.workspace.getConfiguration(this.CONFIG_SECTION);
    return config.get<boolean>('preserveEmptyLines', true);
  }
}
