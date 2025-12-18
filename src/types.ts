/**
 * Options for console log removal
 */
export interface RemovalOptions {
  /** Whether to remove import statements */
  removeImports: boolean;
  /** Whether to preserve empty lines after removal */
  preserveEmptyLines: boolean;
  /** Whether to show confirmation dialog before removal */
  confirmBeforeRemoval: boolean;
  /** Custom regex patterns for additional logging libraries */
  customPatterns: string[];
}

/**
 * Result of console log removal operation
 */
export interface RemovalResult {
  /** The new text after removal */
  newText: string;
  /** Number of console log statements removed */
  consoleLogsRemoved: number;
  /** Number of import statements removed */
  importsRemoved: number;
}

/**
 * Preview of what will be removed (for confirmation dialog)
 */
export interface PreviewResult {
  /** Line numbers containing console logs */
  lineNumbers: number[];
  /** Line numbers containing import statements */
  importLineNumbers: number[];
  /** Total number of lines to be removed */
  totalToRemove: number;
}

/**
 * Information about a matched import statement
 */
export interface ImportMatch {
  /** Line number of the import */
  lineNumber: number;
  /** Full text of the import line */
  text: string;
}

/**
 * Result of workspace-wide processing
 */
export interface WorkspaceResult {
  /** Number of files processed */
  filesProcessed: number;
  /** Total console logs removed across all files */
  totalLogsRemoved: number;
  /** Total imports removed across all files */
  totalImportsRemoved: number;
  /** Any errors that occurred during processing */
  errors: string[];
}
