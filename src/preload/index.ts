import { contextBridge, ipcRenderer } from 'electron';

// Define the API exposed to the renderer process
const api = {
  // Settings
  getSettings: async () => {
    return ipcRenderer.invoke('get-settings');
  },
  saveSettings: async (settings: any) => {
    return ipcRenderer.invoke('save-settings', settings);
  },
  
  // WiFi
  getWiFiStatus: async () => {
    return ipcRenderer.invoke('get-wifi-status');
  },
  
  // Applications
  getHiddenApps: async () => {
    return ipcRenderer.invoke('get-hidden-apps');
  }
};

// Expose the API to the renderer process
contextBridge.exposeInMainWorld('electronAPI', api);

// TypeScript interface for the API
export interface ElectronAPI {
  getSettings: () => Promise<{
    wifiToggleHotkey: string;
    appHideHotkey: string;
    appRestoreHotkey: string;
    contextSwitchHotkey: string;
    safeAppPath: string;
    launchAtStartup: boolean;
    minimizeToTray: boolean;
  }>;
  saveSettings: (settings: any) => Promise<boolean>;
  getWiFiStatus: () => Promise<boolean>;
  getHiddenApps: () => Promise<Array<{
    name: string;
    pid: number;
    platform: 'win32' | 'darwin';
    additionalInfo: any;
  }>>;
}

// Add type declaration for the global Window interface
declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
} 