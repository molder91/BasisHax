import { platform } from 'os';
import * as macOS from './macos';
import * as windows from './windows';

// Determine current platform
const currentPlatform = platform();
const isWindows = currentPlatform === 'win32';
const isMacOS = currentPlatform === 'darwin';

// Select appropriate implementation based on platform
const platformImpl = isMacOS ? macOS : 
                    isWindows ? windows : 
                    null;

if (!platformImpl) {
  console.error(`Unsupported platform: ${currentPlatform}`);
  throw new Error(`Unsupported platform: ${currentPlatform}`);
}

// Export platform-specific implementations through a common interface
export const {
  getWiFiStatus,
  toggleWiFi,
  getCurrentApplication,
  hideApplication,
  restoreApplication,
  launchApplication
} = platformImpl; 