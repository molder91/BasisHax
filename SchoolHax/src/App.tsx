import { useState, useEffect } from "react";
import "./App.css";
import { 
  toggleWifi, 
  isWifiEnabled, 
  hideCurrentApp,
  activateComboMode,
  getSettings,
  updateHotkeyConfig,
  updateComboConfig,
  type HotkeyConfig,
  type ComboConfig
} from "./utils/tauri";

function App() {
  // State for hotkeys
  const [wifiToggleHotkey, setWifiToggleHotkey] = useState("Ctrl+Shift+W");
  const [appHideHotkey, setAppHideHotkey] = useState("Ctrl+Shift+H");
  const [comboModeHotkey, setComboModeHotkey] = useState("Ctrl+Shift+C");
  
  // State for combo mode
  const [targetApp, setTargetApp] = useState("Calculator");
  const [isEditingHotkey, setIsEditingHotkey] = useState<string | null>(null);
  
  // Additional states for functionality
  const [wifiEnabled, setWifiEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load settings on component mount
  useEffect(() => {
    async function loadSettings() {
      try {
        setIsLoading(true);
        const settings = await getSettings();
        
        // Update hotkey states
        setWifiToggleHotkey(settings.hotkeys.wifi_toggle);
        setAppHideHotkey(settings.hotkeys.app_hide);
        setComboModeHotkey(settings.hotkeys.combo_mode);
        
        // Update combo mode states
        setTargetApp(settings.combo.target_app);
        
        // Check WiFi status
        const wifiStatus = await isWifiEnabled();
        setWifiEnabled(wifiStatus);
        
      } catch (err) {
        console.error("Failed to load settings:", err);
        setError("Failed to load settings. Please restart the application.");
      } finally {
        setIsLoading(false);
      }
    }
    
    loadSettings();
  }, []);
  
  // Handle editing hotkeys
  const handleEditHotkey = (hotkeyType: string) => {
    setIsEditingHotkey(hotkeyType);
  };

  // Handle saving hotkeys
  const handleSaveHotkey = async (newHotkey: string) => {
    try {
      let updatedConfig: HotkeyConfig = {
        wifi_toggle: wifiToggleHotkey,
        app_hide: appHideHotkey,
        combo_mode: comboModeHotkey
      };
      
      if (isEditingHotkey === "wifi") {
        updatedConfig.wifi_toggle = newHotkey;
        setWifiToggleHotkey(newHotkey);
      } else if (isEditingHotkey === "hide") {
        updatedConfig.app_hide = newHotkey;
        setAppHideHotkey(newHotkey);
      } else if (isEditingHotkey === "combo") {
        updatedConfig.combo_mode = newHotkey;
        setComboModeHotkey(newHotkey);
      }
      
      await updateHotkeyConfig(updatedConfig);
    } catch (err) {
      console.error("Failed to update hotkey:", err);
      setError("Failed to update hotkey. Please try again.");
    }
    
    setIsEditingHotkey(null);
  };

  // Handle canceling edit
  const handleCancelEdit = () => {
    setIsEditingHotkey(null);
  };
  
  // Handle target app change
  const handleTargetAppChange = async (app: string) => {
    setTargetApp(app);
    
    try {
      const comboConfig: ComboConfig = {
        disable_wifi: true,
        hide_current_app: true,
        launch_app: true,
        target_app: app
      };
      
      await updateComboConfig(comboConfig);
    } catch (err) {
      console.error("Failed to update target app:", err);
      setError("Failed to update target application. Please try again.");
    }
  };
  
  // Handle manual WiFi toggle
  const handleToggleWifi = async () => {
    try {
      const newState = await toggleWifi();
      setWifiEnabled(newState);
    } catch (err) {
      console.error("Failed to toggle WiFi:", err);
      setError("Failed to toggle WiFi. Please check your permissions.");
    }
  };
  
  // Handle quick hide
  const handleQuickHide = async () => {
    try {
      await hideCurrentApp();
    } catch (err) {
      console.error("Failed to hide application:", err);
      setError("Failed to hide application. Please check your permissions.");
    }
  };
  
  // Handle combo mode activation
  const handleComboActivation = async () => {
    try {
      await activateComboMode();
    } catch (err) {
      console.error("Failed to activate combo mode:", err);
      setError("Failed to activate combo mode. Please check your settings.");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark flex items-center justify-center">
        <p>Loading BasisHax...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark">
      <div className="max-w-md mx-auto p-4">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-primary">BasisHax</h1>
          <div className="flex space-x-2">
            <button className="text-secondary hover:text-primary">_</button>
            <button className="text-secondary hover:text-primary">□</button>
            <button className="text-secondary hover:text-primary">X</button>
          </div>
        </header>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p>{error}</p>
            <button 
              onClick={() => setError(null)}
              className="text-sm underline ml-2"
            >
              Dismiss
            </button>
          </div>
        )}

        <main className="space-y-6">
          {/* WiFi Toggle Section */}
          <section className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${wifiEnabled ? 'bg-primary text-white' : 'bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300'}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M17.778 8.222c-4.296-4.296-11.26-4.296-15.556 0A1 1 0 01.808 6.808c5.076-5.077 13.308-5.077 18.384 0a1 1 0 01-1.414 1.414zM14.95 11.05a7 7 0 00-9.9 0 1 1 0 01-1.414-1.414 9 9 0 0112.728 0 1 1 0 01-1.414 1.414zM12.12 13.88a3 3 0 00-4.242 0 1 1 0 01-1.415-1.415 5 5 0 017.072 0 1 1 0 01-1.415 1.415zM9 16a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h2 className="font-medium">WiFi Toggle</h2>
                  <div className="text-secondary text-sm">Hotkey: <span className="font-mono">{wifiToggleHotkey}</span></div>
                </div>
              </div>
              <div className="flex space-x-2">
                <button 
                  onClick={handleToggleWifi}
                  className={`px-3 py-1 text-sm rounded ${wifiEnabled ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
                >
                  {wifiEnabled ? 'ON' : 'OFF'}
                </button>
                <button 
                  onClick={() => handleEditHotkey("wifi")}
                  className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded"
                >
                  Edit
                </button>
              </div>
            </div>
          </section>

          {/* App Quick Hide Section */}
          <section className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                    <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                  </svg>
                </div>
                <div>
                  <h2 className="font-medium">App Quick Hide</h2>
                  <div className="text-secondary text-sm">Hotkey: <span className="font-mono">{appHideHotkey}</span></div>
                </div>
              </div>
              <div className="flex space-x-2">
                <button 
                  onClick={handleQuickHide}
                  className="px-3 py-1 text-sm bg-primary text-white rounded"
                >
                  Hide
                </button>
                <button 
                  onClick={() => handleEditHotkey("hide")}
                  className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded"
                >
                  Edit
                </button>
              </div>
            </div>
          </section>

          {/* Combo Mode Section */}
          <section className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM14 11a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0v-1h-1a1 1 0 110-2h1v-1a1 1 0 011-1z" />
                  </svg>
                </div>
                <div>
                  <h2 className="font-medium">Combo Mode</h2>
                  <div className="text-secondary text-sm">Hotkey: <span className="font-mono">{comboModeHotkey}</span></div>
                </div>
              </div>
              <div className="flex space-x-2">
                <button 
                  onClick={handleComboActivation}
                  className="px-3 py-1 text-sm bg-primary text-white rounded"
                >
                  Activate
                </button>
                <button 
                  onClick={() => handleEditHotkey("combo")}
                  className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded"
                >
                  Edit
                </button>
              </div>
            </div>
            <div className="mt-3">
              <label className="block text-sm text-secondary mb-1">Target App:</label>
              <div className="relative">
                <select 
                  value={targetApp}
                  onChange={(e) => handleTargetAppChange(e.target.value)}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
                >
                  <option value="Calculator">Calculator</option>
                  <option value="Notepad">Notepad</option>
                  <option value="Browser">Browser</option>
                  <option value="Custom">Custom...</option>
                </select>
              </div>
            </div>
          </section>

          {/* Bottom Buttons */}
          <div className="flex justify-between mt-6">
            <button className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded">
              Settings
            </button>
            <button className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded">
              About
            </button>
          </div>
        </main>
      </div>

      {/* Hotkey Configuration Modal */}
      {isEditingHotkey && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-medium">Configure Hotkey</h2>
              <button onClick={handleCancelEdit} className="text-gray-500 hover:text-gray-700">X</button>
            </div>
            
            <div className="mb-4">
              <p className="mb-2">Feature: {
                isEditingHotkey === "wifi" ? "WiFi Toggle" : 
                isEditingHotkey === "hide" ? "App Quick Hide" : 
                "Combo Mode"
              }</p>
              
              <p className="mb-2">Press desired key combination:</p>
              <div className="border border-gray-300 dark:border-gray-600 p-3 rounded font-mono bg-gray-50 dark:bg-gray-700">
                {isEditingHotkey === "wifi" ? wifiToggleHotkey : 
                 isEditingHotkey === "hide" ? appHideHotkey : 
                 comboModeHotkey}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Note: You can manually edit this since actual key detection is not implemented yet.
              </p>
            </div>
            
            <div className="flex justify-between">
              <button 
                className="px-3 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded"
              >
                Reset to Default
              </button>
              <div className="space-x-2">
                <button 
                  onClick={handleCancelEdit}
                  className="px-3 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => handleSaveHotkey(
                    isEditingHotkey === "wifi" ? wifiToggleHotkey : 
                    isEditingHotkey === "hide" ? appHideHotkey : 
                    comboModeHotkey
                  )}
                  className="px-3 py-2 bg-primary hover:bg-blue-600 text-white rounded"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
