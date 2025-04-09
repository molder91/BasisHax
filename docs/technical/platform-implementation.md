# Platform-Specific Implementation Guidelines

This document outlines the technical approach for implementing BasisHax functionality on both macOS and Windows platforms.

## Cross-Platform Framework

BasisHax uses Electron as the base framework for cross-platform compatibility. This provides:
- Consistent UI rendering via Chromium
- Access to Node.js for backend functionality
- IPC for communication between UI and system-level processes
- Native module support for platform-specific functionality

## macOS Implementation

### WiFi Control Module

#### Approach
For macOS, we'll use the native `networksetup` command line utility.

#### Implementation Details
```typescript
// Example implementation for macOS WiFi control
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function getWiFiStatus(): Promise<boolean> {
  try {
    const { stdout } = await execAsync('networksetup -getairportpower en0');
    return stdout.includes('On');
  } catch (error) {
    console.error('Failed to get WiFi status:', error);
    throw new Error('Failed to get WiFi status');
  }
}

export async function toggleWiFi(): Promise<boolean> {
  try {
    const isEnabled = await getWiFiStatus();
    const newState = isEnabled ? 'off' : 'on';
    await execAsync(`networksetup -setairportpower en0 ${newState}`);
    return !isEnabled;
  } catch (error) {
    console.error('Failed to toggle WiFi:', error);
    throw new Error('Failed to toggle WiFi');
  }
}
```

#### Required Permissions
- Network management permissions (requires user approval)

### Application Control Module

#### Approach
For application control on macOS, we'll use a combination of:
- AppleScript for window management
- CoreAudio API for audio control
- Process management via Node.js

#### Implementation Details
```typescript
// Example implementation for macOS application control
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

interface ApplicationInfo {
  name: string;
  pid: number;
  bundleId: string;
}

export async function getCurrentApplication(): Promise<ApplicationInfo> {
  try {
    const script = `
      tell application "System Events"
        set frontApp to first application process whose frontmost is true
        set frontAppName to name of frontApp
        set frontPid to unix id of frontApp
        set frontBundleId to bundle identifier of frontApp
        return {name:frontAppName, pid:frontPid, bundleId:frontBundleId}
      end tell
    `;
    
    const { stdout } = await execAsync(`osascript -e '${script}'`);
    const [name, pid, bundleId] = stdout.trim().split(', ');
    
    return {
      name: name.split(':')[1],
      pid: parseInt(pid.split(':')[1]),
      bundleId: bundleId.split(':')[1]
    };
  } catch (error) {
    console.error('Failed to get current application:', error);
    throw new Error('Failed to get current application');
  }
}

export async function hideApplication(appInfo: ApplicationInfo): Promise<void> {
  try {
    // Hide from Dock and Command+Tab
    const hideScript = `
      tell application "System Events"
        set visible of process "${appInfo.name}" to false
      end tell
    `;
    
    // Mute application audio
    const muteScript = `
      tell application "System Events"
        set volume input volume 0
        set volume output muted true
      end tell
    `;
    
    await execAsync(`osascript -e '${hideScript}'`);
    await execAsync(`osascript -e '${muteScript}'`);
    
    // Store app state for later restoration
    // ...
  } catch (error) {
    console.error('Failed to hide application:', error);
    throw new Error('Failed to hide application');
  }
}

export async function restoreApplication(appInfo: ApplicationInfo): Promise<void> {
  try {
    // Restore visibility
    const showScript = `
      tell application "System Events"
        set visible of process "${appInfo.name}" to true
        tell process "${appInfo.name}" to set frontmost to true
      end tell
    `;
    
    // Restore audio
    const unmuteScript = `
      tell application "System Events"
        set volume output muted false
      end tell
    `;
    
    await execAsync(`osascript -e '${showScript}'`);
    await execAsync(`osascript -e '${unmuteScript}'`);
  } catch (error) {
    console.error('Failed to restore application:', error);
    throw new Error('Failed to restore application');
  }
}
```

#### Required Permissions
- Accessibility permissions (System Preferences > Security & Privacy > Privacy > Accessibility)
- Automation permissions (prompted when first used)

### Hotkey Registration

#### Approach
Use Electron's `globalShortcut` API with fallback to native methods if needed.

#### Implementation Details
```typescript
// Example implementation for macOS hotkey registration
import { globalShortcut } from 'electron';

export function registerHotkey(
  accelerator: string, 
  callback: () => void
): boolean {
  try {
    // Unregister if already registered
    if (globalShortcut.isRegistered(accelerator)) {
      globalShortcut.unregister(accelerator);
    }
    
    // Register new hotkey
    return globalShortcut.register(accelerator, callback);
  } catch (error) {
    console.error('Failed to register hotkey:', error);
    return false;
  }
}

export function unregisterHotkey(accelerator: string): void {
  try {
    if (globalShortcut.isRegistered(accelerator)) {
      globalShortcut.unregister(accelerator);
    }
  } catch (error) {
    console.error('Failed to unregister hotkey:', error);
  }
}
```

## Windows Implementation

### WiFi Control Module

#### Approach
For Windows, we'll use the `netsh` command-line utility.

#### Implementation Details
```typescript
// Example implementation for Windows WiFi control
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function getWiFiStatus(): Promise<boolean> {
  try {
    const { stdout } = await execAsync('netsh interface show interface');
    const lines = stdout.split('\n');
    
    // Find WiFi interface line
    const wifiLine = lines.find(line => 
      line.includes('Wireless') || line.includes('Wi-Fi')
    );
    
    if (!wifiLine) {
      throw new Error('WiFi interface not found');
    }
    
    return wifiLine.includes('Connected');
  } catch (error) {
    console.error('Failed to get WiFi status:', error);
    throw new Error('Failed to get WiFi status');
  }
}

export async function toggleWiFi(): Promise<boolean> {
  try {
    const isEnabled = await getWiFiStatus();
    const action = isEnabled ? 'disconnect' : 'connect';
    
    // Get interface name
    const { stdout: interfaceOutput } = await execAsync(
      'netsh interface show interface'
    );
    const interfaceLines = interfaceOutput.split('\n');
    const wifiLine = interfaceLines.find(line => 
      line.includes('Wireless') || line.includes('Wi-Fi')
    );
    
    if (!wifiLine) {
      throw new Error('WiFi interface not found');
    }
    
    // Extract interface name - this is a simplification, actual parsing needed
    const parts = wifiLine.trim().split(/\s+/);
    const interfaceName = parts[parts.length - 1];
    
    // Toggle interface
    await execAsync(
      `netsh interface set interface "${interfaceName}" ${action}`
    );
    
    return !isEnabled;
  } catch (error) {
    console.error('Failed to toggle WiFi:', error);
    throw new Error('Failed to toggle WiFi');
  }
}
```

#### Required Permissions
- Administrator privileges (may require UAC elevation)

### Application Control Module

#### Approach
For application control on Windows, we'll use a combination of:
- Windows API via Node.js native addons
- PowerShell commands for advanced operations

#### Implementation Details
```typescript
// Example implementation for Windows application control
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

interface ApplicationInfo {
  name: string;
  pid: number;
  path: string;
}

export async function getCurrentApplication(): Promise<ApplicationInfo> {
  try {
    const script = `
      Add-Type @"
        using System;
        using System.Runtime.InteropServices;
        
        public class ForegroundApp {
          [DllImport("user32.dll")]
          public static extern IntPtr GetForegroundWindow();
          
          [DllImport("user32.dll")]
          public static extern Int32 GetWindowThreadProcessId(IntPtr hWnd, out Int32 lpdwProcessId);
        }
"@
      
      $hwnd = [ForegroundApp]::GetForegroundWindow()
      $pid = 0
      [ForegroundApp]::GetWindowThreadProcessId($hwnd, [ref]$pid)
      
      $process = Get-Process -Id $pid
      Write-Host "$($process.ProcessName),$($process.Id),$($process.Path)"
    `;
    
    const { stdout } = await execAsync(`powershell -Command "${script}"`);
    const [name, pid, path] = stdout.trim().split(',');
    
    return {
      name,
      pid: parseInt(pid),
      path
    };
  } catch (error) {
    console.error('Failed to get current application:', error);
    throw new Error('Failed to get current application');
  }
}

export async function hideApplication(appInfo: ApplicationInfo): Promise<void> {
  try {
    // Hide window
    const hideScript = `
      Add-Type @"
        using System;
        using System.Runtime.InteropServices;
        
        public class WindowManager {
          [DllImport("user32.dll")]
          public static extern bool ShowWindow(IntPtr hWnd, int nCmdShow);
          
          [DllImport("user32.dll")]
          public static extern IntPtr FindWindow(string lpClassName, string lpWindowName);
        }
"@
      
      $process = Get-Process -Id ${appInfo.pid}
      $mainWindowHandle = $process.MainWindowHandle
      
      if ($mainWindowHandle -ne [IntPtr]::Zero) {
        [WindowManager]::ShowWindow($mainWindowHandle, 0) # SW_HIDE = 0
      }
    `;
    
    // Mute application
    const muteScript = `
      $volume = New-Object -ComObject WScript.Shell
      $volume.SendKeys([char]173)
    `;
    
    await execAsync(`powershell -Command "${hideScript}"`);
    await execAsync(`powershell -Command "${muteScript}"`);
    
    // Store app state for later restoration
    // ...
  } catch (error) {
    console.error('Failed to hide application:', error);
    throw new Error('Failed to hide application');
  }
}

export async function restoreApplication(appInfo: ApplicationInfo): Promise<void> {
  try {
    // Restore window
    const showScript = `
      Add-Type @"
        using System;
        using System.Runtime.InteropServices;
        
        public class WindowManager {
          [DllImport("user32.dll")]
          public static extern bool ShowWindow(IntPtr hWnd, int nCmdShow);
          
          [DllImport("user32.dll")]
          public static extern bool SetForegroundWindow(IntPtr hWnd);
        }
"@
      
      $process = Get-Process -Id ${appInfo.pid}
      $mainWindowHandle = $process.MainWindowHandle
      
      if ($mainWindowHandle -ne [IntPtr]::Zero) {
        [WindowManager]::ShowWindow($mainWindowHandle, 5) # SW_SHOW = 5
        [WindowManager]::SetForegroundWindow($mainWindowHandle)
      }
    `;
    
    // Unmute application
    const unmuteScript = `
      $volume = New-Object -ComObject WScript.Shell
      $volume.SendKeys([char]173) # Toggle mute
    `;
    
    await execAsync(`powershell -Command "${showScript}"`);
    await execAsync(`powershell -Command "${unmuteScript}"`);
  } catch (error) {
    console.error('Failed to restore application:', error);
    throw new Error('Failed to restore application');
  }
}
```

#### Required Permissions
- Administrator privileges for some operations

### Hotkey Registration

#### Approach
Similar to macOS, use Electron's `globalShortcut` API.

#### Implementation Details
```typescript
// Same implementation as macOS
import { globalShortcut } from 'electron';

export function registerHotkey(
  accelerator: string, 
  callback: () => void
): boolean {
  try {
    // Unregister if already registered
    if (globalShortcut.isRegistered(accelerator)) {
      globalShortcut.unregister(accelerator);
    }
    
    // Register new hotkey
    return globalShortcut.register(accelerator, callback);
  } catch (error) {
    console.error('Failed to register hotkey:', error);
    return false;
  }
}

export function unregisterHotkey(accelerator: string): void {
  try {
    if (globalShortcut.isRegistered(accelerator)) {
      globalShortcut.unregister(accelerator);
    }
  } catch (error) {
    console.error('Failed to unregister hotkey:', error);
  }
}
```

## Platform Detection and Abstraction

To ensure code maintainability, we'll implement a platform abstraction layer:

```typescript
// Platform detection and abstraction
import * as macOS from './platforms/macos';
import * as windows from './platforms/windows';
import { platform } from 'os';

const currentPlatform = platform();
const isWindows = currentPlatform === 'win32';
const isMacOS = currentPlatform === 'darwin';

// Select appropriate implementation based on platform
export const platformImpl = isMacOS ? macOS : 
                            isWindows ? windows : 
                            null;

if (!platformImpl) {
  throw new Error(`Unsupported platform: ${currentPlatform}`);
}

// Export platform-specific implementations through a common interface
export const {
  getWiFiStatus,
  toggleWiFi,
  getCurrentApplication,
  hideApplication,
  restoreApplication,
  registerHotkey,
  unregisterHotkey
} = platformImpl;
```

## Testing Approach

1. **Unit Tests**: Platform-specific implementations should be tested in isolation
2. **Integration Tests**: Test platform abstraction layer with mocked platform implementations
3. **Manual Testing**: Real-world testing on both platforms for actual system behavior
4. **Permission Testing**: Verify application behavior with different permission levels 