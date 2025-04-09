import { globalShortcut } from 'electron';
import { store, AppState } from './index';
import { toggleWifi } from './platforms';
import { hideCurrentApplication, restoreApplication, launchApplication } from './application';

// Map to store registered hotkeys for later cleanup
const registeredHotkeys = new Map<string, () => void>();

/**
 * Register all configured hotkeys from settings
 */
export function registerHotkeys(): void {
  const wifiToggleHotkey = store.get('hotkeys.wifiToggle', 'Alt+W');
  const appHideHotkey = store.get('hotkeys.appHide', 'Alt+H');
  const appRestoreHotkey = store.get('hotkeys.appRestore', 'Alt+Shift+H');
  const contextSwitchHotkey = store.get('hotkeys.contextSwitch', 'Alt+Shift+S');

  // Register individual hotkeys if they're configured
  if (wifiToggleHotkey) {
    registerHotkey(wifiToggleHotkey, 'wifiToggle');
  }
  
  if (appHideHotkey) {
    registerHotkey(appHideHotkey, 'appHide');
  }
  
  if (appRestoreHotkey) {
    registerHotkey(appRestoreHotkey, 'appRestore');
  }
  
  if (contextSwitchHotkey) {
    registerHotkey(contextSwitchHotkey, 'contextSwitch');
  }
}

/**
 * Register a single hotkey with error handling
 */
function registerHotkey(accelerator: string, actionType: string): void {
  try {
    // If already registered, unregister first
    if (registeredHotkeys.has(accelerator)) {
      globalShortcut.unregister(accelerator);
      registeredHotkeys.delete(accelerator);
    }
    
    // Create and register the new shortcut handler
    const success = globalShortcut.register(accelerator, () => {
      // This will just trigger the event, actual handling is in setupHotkeyHandlers
      console.log(`Hotkey triggered: ${actionType}`);
    });
    
    if (success) {
      registeredHotkeys.set(accelerator, () => {
        console.log(`Hotkey triggered: ${actionType}`);
      });
      console.log(`Registered hotkey ${accelerator} for ${actionType}`);
    } else {
      console.error(`Failed to register hotkey: ${accelerator}`);
    }
  } catch (error) {
    console.error(`Error registering hotkey ${accelerator}:`, error);
  }
}

/**
 * Unregister all hotkeys
 */
export function unregisterHotkeys(): void {
  registeredHotkeys.forEach((_, accelerator) => {
    try {
      globalShortcut.unregister(accelerator);
    } catch (error) {
      console.error(`Error unregistering hotkey ${accelerator}:`, error);
    }
  });
  
  registeredHotkeys.clear();
}

/**
 * Setup handlers for the hotkeys
 */
export function setupHotkeyHandlers(appState: AppState): void {
  // WiFi toggle handler
  const wifiToggleHotkey = store.get('hotkeys.wifiToggle', 'Alt+W');
  if (wifiToggleHotkey) {
    globalShortcut.register(wifiToggleHotkey, async () => {
      try {
        const newStatus = await toggleWifi();
        appState.isWifiEnabled = newStatus;
        console.log(`WiFi toggled to: ${newStatus ? 'enabled' : 'disabled'}`);
      } catch (error) {
        console.error('Error toggling WiFi:', error);
      }
    });
  }
  
  // Application hide handler
  const appHideHotkey = store.get('hotkeys.appHide', 'Alt+H');
  if (appHideHotkey) {
    globalShortcut.register(appHideHotkey, async () => {
      try {
        const hiddenApp = await hideCurrentApplication();
        if (hiddenApp) {
          appState.hiddenApplications.push(hiddenApp);
          console.log(`Hidden application: ${hiddenApp.name}`);
        }
      } catch (error) {
        console.error('Error hiding application:', error);
      }
    });
  }
  
  // Application restore handler
  const appRestoreHotkey = store.get('hotkeys.appRestore', 'Alt+Shift+H');
  if (appRestoreHotkey) {
    globalShortcut.register(appRestoreHotkey, async () => {
      try {
        if (appState.hiddenApplications.length > 0) {
          const appToRestore = appState.hiddenApplications.pop();
          if (appToRestore) {
            await restoreApplication(appToRestore);
            console.log(`Restored application: ${appToRestore.name}`);
          }
        }
      } catch (error) {
        console.error('Error restoring application:', error);
      }
    });
  }
  
  // Context switch handler
  const contextSwitchHotkey = store.get('hotkeys.contextSwitch', 'Alt+Shift+S');
  if (contextSwitchHotkey) {
    globalShortcut.register(contextSwitchHotkey, async () => {
      try {
        // 1. Disable WiFi if currently enabled
        if (appState.isWifiEnabled) {
          const newStatus = await toggleWifi();
          appState.isWifiEnabled = newStatus;
        }
        
        // 2. Hide current application
        const hiddenApp = await hideCurrentApplication();
        if (hiddenApp) {
          appState.hiddenApplications.push(hiddenApp);
        }
        
        // 3. Launch safe application
        const safeAppPath = store.get('safeApp.path', '');
        if (safeAppPath) {
          await launchApplication(safeAppPath);
        } else {
          console.warn('No safe application configured for context switch');
        }
      } catch (error) {
        console.error('Error during context switch:', error);
      }
    });
  }
} 