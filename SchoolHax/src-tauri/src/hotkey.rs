use global_hotkey::{GlobalHotKeyManager, HotKey, Modifiers, Key};
use thiserror::Error;
use std::sync::Arc;
use tokio::sync::Mutex;

#[derive(Debug, Error)]
pub enum HotkeyError {
    #[error("Failed to register hotkey: {0}")]
    RegistrationError(String),
    
    #[error("Failed to parse hotkey string: {0}")]
    ParseError(String),
    
    #[error("System error: {0}")]
    SystemError(String),
}

// A struct to store the hotkey configuration
#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
pub struct HotkeyConfig {
    pub wifi_toggle: String,
    pub app_hide: String,
    pub combo_mode: String,
}

impl Default for HotkeyConfig {
    fn default() -> Self {
        Self {
            wifi_toggle: "Ctrl+Shift+W".to_string(),
            app_hide: "Ctrl+Shift+H".to_string(),
            combo_mode: "Ctrl+Shift+C".to_string(),
        }
    }
}

// A struct for managing hotkeys
pub struct HotkeyManager {
    manager: GlobalHotKeyManager,
    config: Arc<Mutex<HotkeyConfig>>,
    registered_hotkeys: Vec<HotKey>,
}

impl HotkeyManager {
    pub fn new() -> Result<Self, HotkeyError> {
        let manager = GlobalHotKeyManager::new().map_err(|e| HotkeyError::SystemError(e.to_string()))?;
        
        Ok(Self {
            manager,
            config: Arc::new(Mutex::new(HotkeyConfig::default())),
            registered_hotkeys: Vec::new(),
        })
    }
    
    pub async fn set_config(&mut self, config: HotkeyConfig) -> Result<(), HotkeyError> {
        // Unregister current hotkeys
        self.unregister_all()?;
        
        // Set new config
        {
            let mut current_config = self.config.lock().await;
            *current_config = config;
        }
        
        // Register new hotkeys
        self.register_all().await
    }
    
    pub async fn get_config(&self) -> HotkeyConfig {
        self.config.lock().await.clone()
    }
    
    pub async fn register_all(&mut self) -> Result<(), HotkeyError> {
        let config = self.config.lock().await.clone();
        
        // Register WiFi toggle hotkey
        let wifi_hotkey = parse_hotkey_string(&config.wifi_toggle)?;
        self.manager.register(wifi_hotkey.clone()).map_err(|e| HotkeyError::RegistrationError(e.to_string()))?;
        self.registered_hotkeys.push(wifi_hotkey);
        
        // Register app hide hotkey
        let hide_hotkey = parse_hotkey_string(&config.app_hide)?;
        self.manager.register(hide_hotkey.clone()).map_err(|e| HotkeyError::RegistrationError(e.to_string()))?;
        self.registered_hotkeys.push(hide_hotkey);
        
        // Register combo mode hotkey
        let combo_hotkey = parse_hotkey_string(&config.combo_mode)?;
        self.manager.register(combo_hotkey.clone()).map_err(|e| HotkeyError::RegistrationError(e.to_string()))?;
        self.registered_hotkeys.push(combo_hotkey);
        
        Ok(())
    }
    
    fn unregister_all(&mut self) -> Result<(), HotkeyError> {
        for hotkey in self.registered_hotkeys.drain(..) {
            self.manager.unregister(hotkey).map_err(|e| HotkeyError::RegistrationError(e.to_string()))?;
        }
        
        Ok(())
    }
}

// Helper function to parse a hotkey string like "Ctrl+Shift+W" into a HotKey object
fn parse_hotkey_string(hotkey_str: &str) -> Result<HotKey, HotkeyError> {
    let parts: Vec<&str> = hotkey_str.split('+').collect();
    
    if parts.is_empty() || parts.len() > 4 {
        return Err(HotkeyError::ParseError(format!("Invalid hotkey format: {}", hotkey_str)));
    }
    
    let mut modifiers = Modifiers::empty();
    let mut key = None;
    
    for part in parts.iter() {
        let part = part.trim();
        match part.to_lowercase().as_str() {
            "ctrl" | "control" => modifiers |= Modifiers::CONTROL,
            "shift" => modifiers |= Modifiers::SHIFT,
            "alt" => modifiers |= Modifiers::ALT,
            "super" | "meta" | "cmd" | "command" => modifiers |= Modifiers::META,
            _ => {
                // This must be the key
                if key.is_some() {
                    return Err(HotkeyError::ParseError(format!("Multiple keys specified in hotkey: {}", hotkey_str)));
                }
                
                // Try to parse the key
                key = Some(parse_key(part)?);
            }
        }
    }
    
    let key = key.ok_or_else(|| HotkeyError::ParseError(format!("No key specified in hotkey: {}", hotkey_str)))?;
    
    Ok(HotKey::new(Some(modifiers), key))
}

// Helper function to parse a key string like "W" into a Key enum
fn parse_key(key_str: &str) -> Result<Key, HotkeyError> {
    if key_str.len() != 1 {
        return Err(HotkeyError::ParseError(format!("Invalid key: {}", key_str)));
    }
    
    let c = key_str.chars().next().unwrap();
    
    // This is a simplified implementation focusing only on letters
    // A complete implementation would handle all possible keys
    match c.to_uppercase().next().unwrap() {
        'A' => Ok(Key::A),
        'B' => Ok(Key::B),
        'C' => Ok(Key::C),
        'D' => Ok(Key::D),
        'E' => Ok(Key::E),
        'F' => Ok(Key::F),
        'G' => Ok(Key::G),
        'H' => Ok(Key::H),
        'I' => Ok(Key::I),
        'J' => Ok(Key::J),
        'K' => Ok(Key::K),
        'L' => Ok(Key::L),
        'M' => Ok(Key::M),
        'N' => Ok(Key::N),
        'O' => Ok(Key::O),
        'P' => Ok(Key::P),
        'Q' => Ok(Key::Q),
        'R' => Ok(Key::R),
        'S' => Ok(Key::S),
        'T' => Ok(Key::T),
        'U' => Ok(Key::U),
        'V' => Ok(Key::V),
        'W' => Ok(Key::W),
        'X' => Ok(Key::X),
        'Y' => Ok(Key::Y),
        'Z' => Ok(Key::Z),
        _ => Err(HotkeyError::ParseError(format!("Unsupported key: {}", key_str))),
    }
} 