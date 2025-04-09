import { 
  getCurrentApplication as getPlatformCurrentApplication,
  hideApplication as hidePlatformApplication,
  restoreApplication as restorePlatformApplication,
  launchApplication as launchPlatformApplication
} from './platforms';
import { appState } from './index';

/**
 * Type union for application information across platforms
 */
export type ApplicationInfo = {
  name: string;
  pid: number;
  platform: 'win32' | 'darwin';
  additionalInfo?: any;
} & ({
  platform: 'darwin';
  bundleId: string;
} | {
  platform: 'win32';
  path: string;
});

/**
 * Get information about the current foreground application
 * @returns Promise resolving to ApplicationInfo
 */
export async function getCurrentApplication(): Promise<ApplicationInfo> {
  try {
    // Get current application info from platform implementation
    const appInfo = await getPlatformCurrentApplication();
    return appInfo as ApplicationInfo;
  } catch (error) {
    console.error('Failed to get current application:', error);
    throw new Error('Failed to get current application');
  }
}

/**
 * Hide the current foreground application
 * @returns Promise resolving to the hidden application info
 */
export async function hideCurrentApplication(): Promise<ApplicationInfo | null> {
  try {
    // Get current application
    const appInfo = await getCurrentApplication();
    
    // Don't hide our own app
    if (appInfo.name.toLowerCase().includes('basishax')) {
      console.log('Not hiding BasisHax application');
      return null;
    }
    
    // Hide the application using platform implementation
    await hidePlatformApplication(appInfo);
    
    return appInfo;
  } catch (error) {
    console.error('Failed to hide current application:', error);
    throw new Error('Failed to hide current application');
  }
}

/**
 * Restore a previously hidden application
 * @param appInfo Application information for app to restore
 */
export async function restoreApplication(appInfo: ApplicationInfo): Promise<void> {
  try {
    // Restore the application using platform implementation
    await restorePlatformApplication(appInfo);
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
    // Launch application using platform implementation
    await launchPlatformApplication(appPath, fullScreen);
  } catch (error) {
    console.error('Failed to launch application:', error);
    throw new Error('Failed to launch application');
  }
}

/**
 * Get a list of all currently hidden applications
 */
export function getHiddenApplications(): Array<{
  name: string;
  pid: number;
  platform: 'win32' | 'darwin';
  additionalInfo: any;
}> {
  return [...appState.hiddenApplications];
} 