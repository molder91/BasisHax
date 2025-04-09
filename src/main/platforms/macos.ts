import { exec } from 'child_process';
import { promisify } from 'util';
import { AppState } from '../index';

const execAsync = promisify(exec);

/**
 * Application information interface
 */
export interface ApplicationInfo {
  name: string;
  pid: number;
  bundleId: string;
  platform: 'darwin';
  additionalInfo?: any;
}

/**
 * Get the current WiFi status
 * @returns Promise resolving to boolean indicating if WiFi is enabled
 */
export async function getWiFiStatus(): Promise<boolean> {
  try {
    const { stdout } = await execAsync('networksetup -getairportpower en0');
    return stdout.includes('On');
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
    const newState = isEnabled ? 'off' : 'on';
    await execAsync(`networksetup -setairportpower en0 ${newState}`);
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
      tell application "System Events"
        set frontApp to first application process whose frontmost is true
        set frontAppName to name of frontApp
        set frontPid to unix id of frontApp
        set frontBundleId to bundle identifier of frontApp
        return {name:frontAppName, pid:frontPid, bundleId:frontBundleId}
      end tell
    `;
    
    const { stdout } = await execAsync(`osascript -e '${script}'`);
    const parts = stdout.trim().split(', ');
    
    // Parse the results (assumes format like "name:AppName, pid:1234, bundleId:com.example.app")
    const name = parts[0].split(':')[1];
    const pid = parseInt(parts[1].split(':')[1]);
    const bundleId = parts[2].split(':')[1];
    
    return {
      name,
      pid,
      bundleId,
      platform: 'darwin'
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

/**
 * Launch an application given its path
 * @param appPath Path to the application
 * @param fullScreen Whether to launch in full screen mode
 */
export async function launchApplication(appPath: string, fullScreen = true): Promise<void> {
  try {
    let launchScript = '';
    
    if (appPath.endsWith('.app')) {
      // It's a macOS app bundle
      launchScript = `
        tell application "${appPath}"
          activate
        end tell
      `;
    } else {
      // It's a regular application file
      launchScript = `
        do shell script "open \\"${appPath}\\""
      `;
    }
    
    await execAsync(`osascript -e '${launchScript}'`);
    
    if (fullScreen) {
      // Wait a moment for the app to launch then make it full screen
      setTimeout(async () => {
        const fullScreenScript = `
          tell application "System Events"
            keystroke "f" using {control down, command down}
          end tell
        `;
        
        try {
          await execAsync(`osascript -e '${fullScreenScript}'`);
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