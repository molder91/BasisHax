import React, { useState, useEffect } from 'react';
import { Save, Folder } from 'lucide-react';

const Settings: React.FC = () => {
  const [settings, setSettings] = useState({
    wifiToggleHotkey: '',
    appHideHotkey: '',
    appRestoreHotkey: '',
    contextSwitchHotkey: '',
    safeAppPath: '',
    launchAtStartup: false,
    minimizeToTray: true,
  });
  
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const settings = await window.electronAPI.getSettings();
        setSettings(settings);
      } catch (error) {
        console.error('Error fetching settings:', error);
      }
    };
    
    fetchSettings();
  }, []);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setSettings({
      ...settings,
      [name]: type === 'checkbox' ? checked : value,
    });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);
    
    try {
      await window.electronAPI.saveSettings(settings);
      setSaveSuccess(true);
      
      // Reset success message after a delay
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Settings</h1>
        {saveSuccess && (
          <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
            Settings saved successfully
          </div>
        )}
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Hotkeys Section */}
        <div className="bg-white dark:bg-zinc-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Hotkeys</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="wifiToggleHotkey" className="block text-sm font-medium">
                WiFi Toggle
              </label>
              <input
                type="text"
                id="wifiToggleHotkey"
                name="wifiToggleHotkey"
                value={settings.wifiToggleHotkey}
                onChange={handleChange}
                className="w-full p-2 border border-zinc-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-900"
                placeholder="e.g. Alt+W"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="appHideHotkey" className="block text-sm font-medium">
                Hide Application
              </label>
              <input
                type="text"
                id="appHideHotkey"
                name="appHideHotkey"
                value={settings.appHideHotkey}
                onChange={handleChange}
                className="w-full p-2 border border-zinc-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-900"
                placeholder="e.g. Alt+H"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="appRestoreHotkey" className="block text-sm font-medium">
                Restore Application
              </label>
              <input
                type="text"
                id="appRestoreHotkey"
                name="appRestoreHotkey"
                value={settings.appRestoreHotkey}
                onChange={handleChange}
                className="w-full p-2 border border-zinc-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-900"
                placeholder="e.g. Alt+Shift+H"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="contextSwitchHotkey" className="block text-sm font-medium">
                Context Switch
              </label>
              <input
                type="text"
                id="contextSwitchHotkey"
                name="contextSwitchHotkey"
                value={settings.contextSwitchHotkey}
                onChange={handleChange}
                className="w-full p-2 border border-zinc-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-900"
                placeholder="e.g. Alt+Shift+S"
              />
            </div>
          </div>
        </div>
        
        {/* Application Settings */}
        <div className="bg-white dark:bg-zinc-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Application Settings</h2>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="safeAppPath" className="block text-sm font-medium">
                Safe Application Path
              </label>
              <div className="flex">
                <input
                  type="text"
                  id="safeAppPath"
                  name="safeAppPath"
                  value={settings.safeAppPath}
                  onChange={handleChange}
                  className="flex-1 p-2 border border-zinc-300 dark:border-zinc-600 rounded-l-md bg-white dark:bg-zinc-900"
                  placeholder="Path to application to launch during context switch"
                />
                <button
                  type="button"
                  className="px-3 py-2 bg-zinc-200 dark:bg-zinc-700 rounded-r-md flex items-center"
                >
                  <Folder className="h-5 w-5" />
                </button>
              </div>
              <p className="text-xs text-zinc-500">
                This application will be launched when using the context switch hotkey.
              </p>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="launchAtStartup"
                name="launchAtStartup"
                checked={settings.launchAtStartup}
                onChange={handleChange}
                className="h-4 w-4 rounded border-zinc-300 dark:border-zinc-600"
              />
              <label htmlFor="launchAtStartup" className="ml-2 text-sm">
                Launch at system startup
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="minimizeToTray"
                name="minimizeToTray"
                checked={settings.minimizeToTray}
                onChange={handleChange}
                className="h-4 w-4 rounded border-zinc-300 dark:border-zinc-600"
              />
              <label htmlFor="minimizeToTray" className="ml-2 text-sm">
                Minimize to system tray when closing
              </label>
            </div>
          </div>
        </div>
        
        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="px-4 py-2 bg-blue-600 text-white rounded-md flex items-center space-x-2 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="h-4 w-4" />
            <span>{isSaving ? 'Saving...' : 'Save Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default Settings; 