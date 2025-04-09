# BasisHax

A modern, cross-platform utility for quickly switching contexts with hotkeys. Perfect for students and professionals who need to quickly change their screen state.

![BasisHax Logo](assets/logo.png) *(Logo placeholder)*

## Features

🔄 **WiFi Toggle** - Quickly enable/disable your WiFi connection with a customizable hotkey

🔒 **Application Hiding** - Instantly hide your current application from view and taskswitchers

⚡ **Context Switch** - Combine WiFi toggle and application switching in one smooth action

## Installation

### macOS

1. Download the latest release from the [releases page](https://github.com/molder91/BasisHax/releases)
2. Move BasisHax.app to your Applications folder
3. Launch BasisHax
4. Grant permissions when prompted (required for hotkey and network functionality)

### Windows

1. Download the latest release from the [releases page](https://github.com/molder91/BasisHax/releases)
2. Run the installer and follow the prompts
3. Launch BasisHax
4. Grant permissions when prompted (administrator privileges may be required)

## Getting Started

1. **Setup Hotkeys** - Configure your preferred keyboard shortcuts
2. **Safe Application** - Choose which application to launch during a context switch
3. **Test** - Verify functionality works as expected

## Usage

### WiFi Toggle

Press your configured hotkey (default: `Alt+W`) to quickly toggle your WiFi connection on or off.

### Application Hiding

Press your configured hotkey (default: `Alt+H`) to instantly hide the current application. The application will be:
- Hidden from view
- Removed from Alt+Tab/Command+Tab switcher
- Muted
- Still running in the background

To restore a hidden application, press the configured restoration hotkey (default: `Alt+Shift+H`).

### Context Switch

Press your configured hotkey (default: `Alt+Shift+S`) to:
1. Disable WiFi connection
2. Hide the current application
3. Launch your pre-configured "safe" application in full screen

## Configuration

All settings can be accessed through the BasisHax preferences window:

- **Hotkeys** - Customize all keyboard shortcuts
- **Behavior** - Configure how features work
- **Startup** - Set BasisHax to launch at system startup
- **Notifications** - Enable/disable visual/sound feedback

## Security and Privacy

BasisHax values your privacy:
- No data collection or telemetry
- All configuration is stored locally
- No internet connectivity required for core functionality
- Minimal system permissions requested

## Development

BasisHax is built with Electron, React, and TypeScript. See the [contributing guide](CONTRIBUTING.md) for more information on development.

### Prerequisites

- Node.js 16+
- npm or yarn
- Git

### Setup

```bash
# Clone the repository
git clone https://github.com/molder91/BasisHax.git
cd BasisHax

# Install dependencies
npm install

# Start development server
npm run dev
```

### Building

```bash
# Build for current platform
npm run build

# Build for all platforms
npm run build:all
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you encounter any issues or have questions, please [open an issue](https://github.com/molder91/BasisHax/issues/new) on GitHub.

## Acknowledgements

- [Electron](https://www.electronjs.org/)
- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [TailwindCSS](https://tailwindcss.com/) 