import { app, BrowserWindow, ipcMain, globalShortcut, Tray, Menu } from 'electron';
import path from 'path';
import Store from 'electron-store';
import { 
  registerHotkeys, 
  unregisterHotkeys, 
  setupHotkeyHandlers 
} from './hotkeys';

// Initialize the application store
const store = new Store();

// Define types for our application state
interface AppState {
  isWifiEnabled: boolean;
  hiddenApplications: Array<{
    name: string;
    pid: number;
    platform: 'win32' | 'darwin';
    additionalInfo: any;
  }>;
}

// Global references to prevent garbage collection
let mainWindow: BrowserWindow | null = null;
let tray: Tray | null = null;
const appState: AppState = {
  isWifiEnabled: true,
  hiddenApplications: []
};

// Development mode check
const isDevelopment = process.env.NODE_ENV === 'development';

function createWindow() {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
    backgroundColor: '#f6f8fc',
    show: false,
    frame: true,
    titleBarStyle: 'hiddenInset',
  });

  // Load the application
  if (isDevelopment) {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
  }

  // When window is ready to show, display it
  mainWindow.once('ready-to-show', () => {
    mainWindow?.show();
  });

  // Clean up the window reference on close
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function createTray() {
  // Create tray icon
  tray = new Tray(path.join(__dirname, '../../assets/tray-icon.png'));
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Open BasisHax', click: () => mainWindow?.show() },
    { type: 'separator' },
    { label: 'Quit', click: () => app.quit() }
  ]);
  tray.setToolTip('BasisHax');
  tray.setContextMenu(contextMenu);

  // Double click on tray icon shows the app
  tray.on('double-click', () => {
    if (mainWindow) {
      mainWindow.show();
    }
  });
}

// App event handlers
app.whenReady().then(() => {
  createWindow();
  createTray();
  setupIpcHandlers();
  
  // Register global shortcuts
  registerHotkeys();
  setupHotkeyHandlers(appState);

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('will-quit', () => {
  // Unregister all shortcuts
  unregisterHotkeys();
  globalShortcut.unregisterAll();
});

// IPC handlers
function setupIpcHandlers() {
  // Settings-related handlers
  ipcMain.handle('get-settings', async () => {
    return {
      wifiToggleHotkey: store.get('hotkeys.wifiToggle', 'Alt+W'),
      appHideHotkey: store.get('hotkeys.appHide', 'Alt+H'),
      appRestoreHotkey: store.get('hotkeys.appRestore', 'Alt+Shift+H'),
      contextSwitchHotkey: store.get('hotkeys.contextSwitch', 'Alt+Shift+S'),
      safeAppPath: store.get('safeApp.path', ''),
      launchAtStartup: store.get('general.launchAtStartup', false),
      minimizeToTray: store.get('general.minimizeToTray', true),
    };
  });

  ipcMain.handle('save-settings', async (_, settings) => {
    // Save settings to store
    for (const [key, value] of Object.entries(settings)) {
      store.set(key, value);
    }

    // Re-register hotkeys with new settings
    unregisterHotkeys();
    registerHotkeys();
    
    return true;
  });

  // App state handlers
  ipcMain.handle('get-wifi-status', async () => {
    return appState.isWifiEnabled;
  });

  ipcMain.handle('get-hidden-apps', async () => {
    return appState.hiddenApplications;
  });
}

// Handle exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

export { store, AppState, appState }; 