// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/

// Module declarations
mod wifi;
mod app_control;
mod hotkey;
mod combo;
mod settings;

// Re-exports
use wifi::{toggle_wifi, is_wifi_enabled, WiFiError};
use app_control::{hide_current_app, launch_application, AppControlError};
use hotkey::{HotkeyConfig, HotkeyManager, HotkeyError};
use combo::{ComboConfig, activate_combo_mode, deactivate_combo_mode, ComboError};
use settings::{Settings, save_settings, load_settings, SettingsError};

use std::sync::Arc;
use std::sync::Mutex as StdMutex;
use tokio::sync::Mutex;
use tauri::State;
use tokio::spawn;

// Application state to be shared across commands
struct AppState {
    hotkey_manager: StdMutex<Option<HotkeyManager>>,
    settings: StdMutex<Settings>,
    wifi_state: StdMutex<bool>,
}

// Command to toggle WiFi
#[tauri::command]
async fn toggle_wifi_command(state: State<'_, Arc<AppState>>) -> Result<bool, String> {
    let current_state = *state.wifi_state.lock().unwrap();
    let new_state = !current_state;
    
    toggle_wifi(new_state).await.map_err(|e| e.to_string())?;
    
    // Update state
    *state.wifi_state.lock().unwrap() = new_state;
    
    Ok(new_state)
}

// Command to check WiFi status
#[tauri::command]
async fn is_wifi_enabled_command(state: State<'_, Arc<AppState>>) -> Result<bool, String> {
    let state_value = is_wifi_enabled().await.map_err(|e| e.to_string())?;
    
    // Update state
    *state.wifi_state.lock().unwrap() = state_value;
    
    Ok(state_value)
}

// Command to hide current application
#[tauri::command]
async fn hide_current_app_command() -> Result<(), String> {
    hide_current_app().await.map_err(|e| e.to_string())
}

// Command to launch application
#[tauri::command]
async fn launch_application_command(app_name: String) -> Result<(), String> {
    launch_application(&app_name).await.map_err(|e| e.to_string())
}

// Command to activate combo mode
#[tauri::command]
async fn activate_combo_mode_command(state: State<'_, Arc<AppState>>) -> Result<(), String> {
    let settings = state.settings.lock().unwrap();
    activate_combo_mode(&settings.combo).await.map_err(|e| e.to_string())
}

// Command to update hotkey configuration
#[tauri::command]
async fn update_hotkey_config(config: HotkeyConfig, state: State<'_, Arc<AppState>>) -> Result<(), String> {
    let mut hotkey_manager_lock = state.hotkey_manager.lock().unwrap();
    
    if let Some(hotkey_manager) = hotkey_manager_lock.as_mut() {
        hotkey_manager.set_config(config.clone()).await.map_err(|e| e.to_string())?;
    }
    
    // Update settings
    let mut settings = state.settings.lock().unwrap();
    settings.hotkeys = config;
    
    // Save settings
    save_settings(&settings).map_err(|e| e.to_string())?;
    
    Ok(())
}

// Command to update combo mode configuration
#[tauri::command]
async fn update_combo_config(config: ComboConfig, state: State<'_, Arc<AppState>>) -> Result<(), String> {
    // Update settings
    let mut settings = state.settings.lock().unwrap();
    settings.combo = config;
    
    // Save settings
    save_settings(&settings).map_err(|e| e.to_string())?;
    
    Ok(())
}

// Command to get current settings
#[tauri::command]
fn get_settings(state: State<'_, Arc<AppState>>) -> Result<Settings, String> {
    let settings = state.settings.lock().unwrap();
    Ok(settings.clone())
}

// Command to update general settings
#[tauri::command]
fn update_settings(settings: Settings, state: State<'_, Arc<AppState>>) -> Result<(), String> {
    // Update settings
    {
        let mut current_settings = state.settings.lock().unwrap();
        *current_settings = settings.clone();
    }
    
    // Save settings
    save_settings(&settings).map_err(|e| e.to_string())?;
    
    // Update hotkey config in a separate task since it's async
    let hotkey_manager = state.hotkey_manager.lock().unwrap().clone();
    let hotkey_config = settings.hotkeys.clone();
    
    if let Some(mut manager) = hotkey_manager {
        spawn(async move {
            let _ = manager.set_config(hotkey_config).await;
        });
    }
    
    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    // Initialize application state
    let wifi_state = StdMutex::new(false);
    
    // Load settings
    let settings = match load_settings() {
        Ok(settings) => settings,
        Err(_) => Settings::default(),
    };
    
    // Initialize hotkey manager
    let hotkey_manager = match HotkeyManager::new() {
        Ok(mut manager) => {
            // Try to register hotkeys, but continue even if it fails
            let _ = tokio::runtime::Runtime::new()
                .unwrap()
                .block_on(manager.register_all());
            Some(manager)
        },
        Err(e) => {
            eprintln!("Failed to initialize hotkey manager: {}", e);
            None
        }
    };
    
    let app_state = Arc::new(AppState {
        hotkey_manager: StdMutex::new(hotkey_manager),
        settings: StdMutex::new(settings),
        wifi_state,
    });
    
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_global_shortcut::init())
        .manage(app_state)
        .invoke_handler(tauri::generate_handler![
            toggle_wifi_command,
            is_wifi_enabled_command,
            hide_current_app_command,
            launch_application_command,
            activate_combo_mode_command,
            update_hotkey_config,
            update_combo_config,
            get_settings,
            update_settings,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
