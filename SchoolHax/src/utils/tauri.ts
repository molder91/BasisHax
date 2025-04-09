import { invoke } from '@tauri-apps/api/core';

// Types
export interface HotkeyConfig {
  wifi_toggle: string;
  app_hide: string;
  combo_mode: string;
}

export interface ComboConfig {
  disable_wifi: boolean;
  hide_current_app: boolean;
  launch_app: boolean;
  target_app: string;
}

export interface Settings {
  hotkeys: HotkeyConfig;
  combo: ComboConfig;
  start_minimized: boolean;
  launch_at_startup: boolean;
  show_notifications: boolean;
  theme: string;
}

// WiFi controls
export async function toggleWifi(): Promise<boolean> {
  return await invoke('toggle_wifi_command');
}

export async function isWifiEnabled(): Promise<boolean> {
  return await invoke('is_wifi_enabled_command');
}

// App controls
export async function hideCurrentApp(): Promise<void> {
  return await invoke('hide_current_app_command');
}

export async function launchApplication(appName: string): Promise<void> {
  return await invoke('launch_application_command', { appName });
}

// Combo mode
export async function activateComboMode(): Promise<void> {
  return await invoke('activate_combo_mode_command');
}

// Settings
export async function getSettings(): Promise<Settings> {
  return await invoke('get_settings');
}

export async function updateSettings(settings: Settings): Promise<void> {
  return await invoke('update_settings', { settings });
}

export async function updateHotkeyConfig(config: HotkeyConfig): Promise<void> {
  return await invoke('update_hotkey_config', { config });
}

export async function updateComboConfig(config: ComboConfig): Promise<void> {
  return await invoke('update_combo_config', { config });
} 