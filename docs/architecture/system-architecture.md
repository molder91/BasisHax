# BasisHax System Architecture

## Overview

BasisHax is designed with a modular architecture to support cross-platform functionality on both macOS and Windows. The application is built using Electron for the frontend UI and native modules for system-level interactions.

## System Components

```
┌─────────────────────────────────────────────────┐
│                                                 │
│                  User Interface                 │
│                                                 │
└───────────────────┬─────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────┐
│                                                 │
│               Core Application                  │
│                                                 │
├─────────────┬─────────────────┬─────────────────┤
│  Hotkey     │  Settings       │ State           │
│  Manager    │  Manager        │ Manager         │
│             │                 │                 │
└─────────────┼─────────────────┼─────────────────┘
              │                 │
              ▼                 ▼
┌─────────────────────┐ ┌─────────────────────────┐
│                     │ │                         │
│  System Modules     │ │  Platform-Specific      │
│                     │ │  Implementations        │
│  - WiFi Control     │ │                         │
│  - App Control      │ │  - macOS                │
│  - Audio Control    │ │  - Windows              │
│                     │ │                         │
└─────────────────────┘ └─────────────────────────┘
```

## Component Details

### User Interface Layer
- **Main Window**: Configuration interface for the application
- **System Tray/Menu Bar**: Quick access to common functions
- **Notification System**: Visual feedback for actions
- **Settings Interface**: User configuration options

### Core Application Layer
- **Hotkey Manager**: Registers global shortcuts and routes to appropriate modules
- **Settings Manager**: Handles user configuration storage and retrieval
- **State Manager**: Tracks application and system state for proper functionality

### System Modules Layer
- **WiFi Control Module**: Interfaces with network adapters
- **Application Control Module**: Manages application visibility and focus
- **Audio Control Module**: Handles muting/unmuting applications

### Platform-Specific Implementations
- **macOS Implementation**: Uses native macOS APIs for system interaction
- **Windows Implementation**: Uses Windows API for system interaction

## Technology Stack

### Frontend
- **Electron**: Cross-platform desktop application framework
- **React**: UI component library
- **TypeScript**: Type-safe JavaScript
- **TailwindCSS**: Utility-first CSS framework

### Backend
- **Node.js**: JavaScript runtime
- **Electron IPC**: For communication between renderer and main processes
- **Native Modules**:
  - Node-WiFi: WiFi interface control
  - Robotjs: System automation
  - Active-win: Window management

### Data Storage
- **Electron-Store**: Persistent settings storage
- **Keytar**: Secure credential storage

## Key System Flows

### Hotkey Registration
1. User configures hotkey in settings
2. Settings Manager saves configuration
3. Hotkey Manager registers global shortcut
4. System confirms registration success/failure

### WiFi Toggle Action
1. User presses configured hotkey
2. Hotkey Manager intercepts and routes to WiFi module
3. WiFi module checks current state
4. WiFi module toggles state via platform-specific implementation
5. State Manager updates WiFi status
6. UI provides feedback of successful action

### Application Hiding Action
1. User presses configured hotkey
2. Hotkey Manager intercepts and routes to App Control module
3. App Control identifies current foreground application
4. App Control uses platform-specific implementation to:
   - Hide application window
   - Remove from Alt+Tab/Command+Tab switcher
   - Mute audio output
5. State Manager records hidden application for later restoration

### Context Switch Action
1. User presses configured hotkey
2. Hotkey Manager intercepts and routes to Context Switch handler
3. Context Switch handler orchestrates:
   - WiFi Toggle action
   - Application Hiding action
   - Launch of configured "safe" application in full-screen
4. State Manager records complete system state for restoration

## Security Considerations

- Application requires minimal system permissions
- No remote data transmission
- Settings stored locally with appropriate encryption
- No logging of user activity

## Error Handling Strategy

- Robust error handling for system-level operations
- Graceful degradation when permissions are restricted
- Clear user feedback for troubleshooting
- Auto-recovery mechanisms for common failure scenarios 