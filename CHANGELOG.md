# Change Log

All notable changes to the "Solidity Console Log Remover" extension will be documented in this file.

## [0.1.0] - 2025-12-18

### Added
- Initial release of Solidity Console Log Remover
- Remove console.log statements from Solidity files (single file)
- Remove console.log statements workspace-wide
- Optional removal of import statements
- Configurable confirmation dialogs
- Keyboard shortcuts for quick access
- Context menu integration
- Support for all Hardhat console log variants (log, logInt, logUint, etc.)
- Configurable empty line preservation
- Extensible custom pattern support for additional logging libraries
- Progress indication for workspace-wide operations

### Features
- Four commands: single file with/without import, workspace-wide with/without import
- Configuration settings for user preferences
- Clear user feedback with count notifications
- Undo support via VSCode's built-in undo

## Future Enhancements
- Better multiline console.log detection
- Preview mode showing which lines will be removed
- Statistics view for console log usage
- Automatic detection of custom logging patterns
