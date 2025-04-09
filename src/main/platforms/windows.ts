import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

/**
 * Application information interface
 */
export interface ApplicationInfo {
  name: string;
  pid: number;
  path: string;
  platform: 'win32';
  additionalInfo?: any;
}

/**
 * Get the current WiFi status
 * @returns Promise resolving to boolean indicating if WiFi is enabled
 */
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

/**
 * Toggle the WiFi connection
 * @returns Promise resolving to the new WiFi status
 */
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

/**
 * Get information about the current frontmost application
 * @returns Promise resolving to ApplicationInfo
 */
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
      path,
      platform: 'win32'
    };
  } catch (error) {
    console.error('Failed to get current application:', error);
    throw new Error('Failed to get current application');
  }
}

/**
 * Hide the specified application
 * @param appInfo Application information
 */
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
  } catch (error) {
    console.error('Failed to hide application:', error);
    throw new Error('Failed to hide application');
  }
}

/**
 * Restore a previously hidden application
 * @param appInfo Application information for app to restore
 */
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

/**
 * Launch an application given its path
 * @param appPath Path to the application
 * @param fullScreen Whether to launch in full screen mode
 */
export async function launchApplication(appPath: string, fullScreen = true): Promise<void> {
  try {
    // Launch the application
    await execAsync(`start "" "${appPath}"`);
    
    if (fullScreen) {
      // Wait a moment for the app to launch then make it full screen
      setTimeout(async () => {
        const fullScreenScript = `
          Add-Type @"
            using System;
            using System.Runtime.InteropServices;
            
            public class KeyboardInput {
              [DllImport("user32.dll")]
              public static extern void keybd_event(byte bVk, byte bScan, uint dwFlags, int dwExtraInfo);
              
              public const int KEYEVENTF_KEYUP = 0x0002;
              public const int VK_F11 = 0x7A;
            }
"@
          
          # Press F11 to toggle full screen for most applications
          [KeyboardInput]::keybd_event([KeyboardInput]::VK_F11, 0, 0, 0)
          Start-Sleep -Milliseconds 100
          [KeyboardInput]::keybd_event([KeyboardInput]::VK_F11, 0, [KeyboardInput]::KEYEVENTF_KEYUP, 0)
        `;
        
        try {
          await execAsync(`powershell -Command "${fullScreenScript}"`);
        } catch (error) {
          console.error('Failed to make application full screen:', error);
        }
      }, 1000);
    }
  } catch (error) {
    console.error('Failed to launch application:', error);
    throw new Error('Failed to launch application');
  }
}