use crate::hotkey::HotkeyConfig;
use crate::combo::ComboConfig;
use directories::ProjectDirs;
use std::fs::{self, File};
use std::io::{Read, Write};
use std::path::PathBuf;
use thiserror::Error;

#[derive(Debug, Error)]
pub enum SettingsError {
    #[error("Failed to save settings: {0}")]
    SaveError(String),
    
    #[error("Failed to load settings: {0}")]
    LoadError(String),
    
    #[error("Settings path not found")]
    PathNotFound,
}

#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
pub struct Settings {
    pub hotkeys: HotkeyConfig,
    pub combo: ComboConfig,
    pub start_minimized: bool,
    pub launch_at_startup: bool,
    pub show_notifications: bool,
    pub theme: String,
}

impl Default for Settings {
    fn default() -> Self {
        Self {
            hotkeys: HotkeyConfig::default(),
            combo: ComboConfig::default(),
            start_minimized: false,
            launch_at_startup: false,
            show_notifications: true,
            theme: "system".to_string(),
        }
    }
}

// Function to get the settings directory
fn get_settings_dir() -> Option<PathBuf> {
    ProjectDirs::from("com", "basishax", "BasisHax").map(|dirs| dirs.config_dir().to_path_buf())
}

// Function to get the settings file path
fn get_settings_path() -> Option<PathBuf> {
    get_settings_dir().map(|dir| dir.join("settings.json"))
}

// Save settings to disk
pub fn save_settings(settings: &Settings) -> Result<(), SettingsError> {
    let settings_dir = get_settings_dir().ok_or(SettingsError::PathNotFound)?;
    let settings_path = get_settings_path().ok_or(SettingsError::PathNotFound)?;
    
    // Create directory if it doesn't exist
    fs::create_dir_all(&settings_dir)
        .map_err(|e| SettingsError::SaveError(format!("Failed to create settings directory: {}", e)))?;
    
    // Serialize settings to JSON
    let json = serde_json::to_string_pretty(settings)
        .map_err(|e| SettingsError::SaveError(format!("Failed to serialize settings: {}", e)))?;
    
    // Write to file
    let mut file = File::create(&settings_path)
        .map_err(|e| SettingsError::SaveError(format!("Failed to create settings file: {}", e)))?;
    
    file.write_all(json.as_bytes())
        .map_err(|e| SettingsError::SaveError(format!("Failed to write settings: {}", e)))?;
    
    Ok(())
}

// Load settings from disk
pub fn load_settings() -> Result<Settings, SettingsError> {
    let settings_path = get_settings_path().ok_or(SettingsError::PathNotFound)?;
    
    // Check if file exists
    if !settings_path.exists() {
        // Return default settings if file doesn't exist
        return Ok(Settings::default());
    }
    
    // Open file
    let mut file = File::open(&settings_path)
        .map_err(|e| SettingsError::LoadError(format!("Failed to open settings file: {}", e)))?;
    
    // Read file content
    let mut content = String::new();
    file.read_to_string(&mut content)
        .map_err(|e| SettingsError::LoadError(format!("Failed to read settings file: {}", e)))?;
    
    // Deserialize JSON
    let settings = serde_json::from_str(&content)
        .map_err(|e| SettingsError::LoadError(format!("Failed to parse settings: {}", e)))?;
    
    Ok(settings)
} 