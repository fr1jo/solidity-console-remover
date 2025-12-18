import { RemovalOptions, RemovalResult, PreviewResult, ImportMatch } from './types';

/**
 * Core console log remover for Solidity files
 */
export class ConsoleRemover {
  // Built-in patterns for Hardhat console logs
  // Simple approach: match any line containing console.log(
  private static readonly CONSOLE_LOG_PATTERNS = [
    /console\.log[A-Za-z]*\s*\(/  // Match any line with console.log(
  ];

  // Pattern for import statements
  private static readonly IMPORT_PATTERN = /^import\s+.*["'].*console.*["'].*;\s*$/gm;

  /**
   * Get all patterns (built-in + custom)
   */
  private getPatterns(customPatterns: string[]): RegExp[] {
    const patterns = [...ConsoleRemover.CONSOLE_LOG_PATTERNS];

    // Add custom patterns if provided
    for (const pattern of customPatterns) {
      try {
        patterns.push(new RegExp(pattern, 'gm'));
      } catch (error) {
        console.error(`Invalid custom pattern: ${pattern}`, error);
      }
    }

    return patterns;
  }

  /**
   * Preview what will be removed (for confirmation dialog)
   */
  previewRemoval(text: string, options: RemovalOptions): PreviewResult {
    const lineNumbers: number[] = [];
    const importLineNumbers: number[] = [];

    const lines = text.split('\n');
    const patterns = this.getPatterns(options.customPatterns);

    // Find console.log lines
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Check against all patterns
      for (const pattern of patterns) {
        pattern.lastIndex = 0; // Reset regex
        if (pattern.test(line)) {
          lineNumbers.push(i);
          break;
        }
      }
    }

    // Find import lines if needed
    if (options.removeImports) {
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        ConsoleRemover.IMPORT_PATTERN.lastIndex = 0;
        if (ConsoleRemover.IMPORT_PATTERN.test(line)) {
          importLineNumbers.push(i);
        }
      }
    }

    return {
      lineNumbers,
      importLineNumbers,
      totalToRemove: lineNumbers.length + importLineNumbers.length
    };
  }

  /**
   * Find import statements in text
   */
  findImportStatements(text: string): ImportMatch[] {
    const matches: ImportMatch[] = [];
    const lines = text.split('\n');

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      ConsoleRemover.IMPORT_PATTERN.lastIndex = 0;
      if (ConsoleRemover.IMPORT_PATTERN.test(line)) {
        matches.push({
          lineNumber: i,
          text: line
        });
      }
    }

    return matches;
  }

  /**
   * Remove console logs from text
   */
  removeConsoleLogs(text: string, options: RemovalOptions): RemovalResult {
    const preview = this.previewRemoval(text, options);

    if (preview.totalToRemove === 0) {
      return {
        newText: text,
        consoleLogsRemoved: 0,
        importsRemoved: 0
      };
    }

    const lines = text.split('\n');
    const linesToRemove = new Set([
      ...preview.lineNumbers,
      ...(options.removeImports ? preview.importLineNumbers : [])
    ]);

    // Remove lines
    const newLines: string[] = [];
    for (let i = 0; i < lines.length; i++) {
      if (!linesToRemove.has(i)) {
        newLines.push(lines[i]);
      } else if (options.preserveEmptyLines) {
        // Keep empty line to preserve structure
        newLines.push('');
      }
    }

    // Remove trailing empty lines if preserveEmptyLines is false
    if (!options.preserveEmptyLines) {
      while (newLines.length > 0 && newLines[newLines.length - 1].trim() === '') {
        newLines.pop();
      }
    }

    return {
      newText: newLines.join('\n'),
      consoleLogsRemoved: preview.lineNumbers.length,
      importsRemoved: preview.importLineNumbers.length
    };
  }

  /**
   * Remove specific lines while preserving structure
   */
  removeLines(text: string, lineNumbers: number[]): string {
    const lines = text.split('\n');
    const toRemove = new Set(lineNumbers);

    return lines
      .filter((_, index) => !toRemove.has(index))
      .join('\n');
  }
}
