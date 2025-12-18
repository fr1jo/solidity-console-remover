# Solidity Console Log Remover

A VSCode extension that quickly removes `console.log()` statements from Solidity contracts. Perfect for cleaning up Hardhat console logs before deployment.

## Features

- **Single File Removal**: Remove console logs from the current file with a single click or keyboard shortcut
- **Workspace-Wide Removal**: Clean all `.sol` files in your workspace at once
- **Optional Import Removal**: Remove console log imports (`import "hardhat/console.sol";`) along with the statements
- **Configurable Confirmation**: Choose whether to show confirmation dialogs before removal
- **Extensible Pattern Matching**: Add custom regex patterns for your own logging libraries
- **Smart Line Preservation**: Optionally preserve empty lines to maintain code structure

## Usage

### Context Menu (Right-Click)

1. Open a Solidity file (`.sol`)
2. Right-click anywhere in the editor
3. Select one of:
   - **Remove Console Logs** - Remove all console.log statements
   - **Remove Console Logs and Import** - Remove console logs AND import statements

### Keyboard Shortcuts

| Action | Windows/Linux | macOS |
|--------|--------------|-------|
| Remove Console Logs | `Ctrl+Shift+R` | `Cmd+Shift+R` |
| Remove Console Logs + Import | `Ctrl+Shift+Alt+R` | `Cmd+Shift+Alt+R` |
| Remove Workspace-Wide | `Ctrl+Shift+Alt+W` | `Cmd+Shift+Alt+W` |

### Command Palette

Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on macOS) and type:
- `Solidity: Remove Console Logs`
- `Solidity: Remove Console Logs and Import`
- `Solidity: Remove Console Logs (Workspace)`
- `Solidity: Remove Console Logs and Import (Workspace)`

## Supported Patterns

The extension detects and removes all Hardhat console log patterns:

```solidity
console.log("message");
console.log("message", variable);
console.logInt(value);
console.logUint(value);
console.logString(value);
console.logBool(value);
console.logAddress(value);
console.logBytes(value);
console.logBytes32(value);
```

And import statements:
```solidity
import "hardhat/console.sol";
import 'hardhat/console.sol';
import { console } from "hardhat/console.sol";
```

## Configuration

Access settings via: **File > Preferences > Settings** (or `Cmd+,` on macOS), then search for "Solidity Console Remover"

### Available Settings

```json
{
  // Show confirmation dialog before removing console logs
  "solidityConsoleRemover.confirmBeforeRemoval": true,

  // Keep empty lines after console log removal
  "solidityConsoleRemover.preserveEmptyLines": true,

  // Show notification after removal with count
  "solidityConsoleRemover.showNotifications": true,

  // Custom regex patterns for additional logging libraries
  "solidityConsoleRemover.customPatterns": []
}
```

### Adding Custom Patterns

For custom logging libraries, add regex patterns in settings:

```json
{
  "solidityConsoleRemover.customPatterns": [
    "^\\s*log\\.[a-zA-Z]+\\([^;]*\\);?\\s*$",
    "^\\s*Debug\\.log\\([^;]*\\);?\\s*$"
  ]
}
```

## Examples

### Before:
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract MyContract {
    function transfer(uint256 amount) public {
        console.log("Transferring:", amount);
        // transfer logic here
        console.log("Transfer complete");
    }
}
```

### After (Remove Console Logs):
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract MyContract {
    function transfer(uint256 amount) public {

        // transfer logic here

    }
}
```

### After (Remove Console Logs + Import):
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;


contract MyContract {
    function transfer(uint256 amount) public {

        // transfer logic here

    }
}
```

## Requirements

- VSCode 1.75.0 or higher
- Solidity files with `.sol` extension

## Installation

### From Source (Development)

1. Clone this repository
2. Run `npm install` to install dependencies
3. Run `npm run compile` to build the extension
4. Press `F5` in VSCode to open a new window with the extension loaded

### From VSIX Package

1. Download the `.vsix` file
2. In VSCode, go to Extensions view (`Ctrl+Shift+X`)
3. Click the `...` menu → "Install from VSIX..."
4. Select the downloaded file

## Known Issues

- Multiline console.log statements spanning multiple lines may not be detected in some edge cases
- Custom patterns must be valid JavaScript regex strings

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Release Notes

### 0.1.0

Initial release:
- Remove console.log statements from Solidity files
- Optional import removal
- Workspace-wide processing
- Configurable confirmation dialogs
- Extensible pattern matching

## License

MIT

## Support

For issues or feature requests, please visit the [GitHub repository](https://github.com/fr1jo/solidity-console-remover).
