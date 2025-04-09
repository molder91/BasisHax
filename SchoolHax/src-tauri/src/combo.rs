use crate::wifi::{toggle_wifi, WiFiError};
use crate::app_control::{hide_current_app, launch_application, AppControlError};
use thiserror::Error;

#[derive(Debug, Error)]
pub enum ComboError {
    #[error("WiFi error: {0}")]
    WiFiError(#[from] WiFiError),
    
    #[error("App control error: {0}")]
    AppControlError(#[from] AppControlError),
    
    #[error("No target application specified")]
    NoTargetApp,
}

#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
pub struct ComboConfig {
    pub disable_wifi: bool,
    pub hide_current_app: bool,
    pub launch_app: bool,
    pub target_app: String,
}

impl Default for ComboConfig {
    fn default() -> Self {
        Self {
            disable_wifi: true,
            hide_current_app: true,
            launch_app: true,
            target_app: "Calculator".to_string(),
        }
    }
}

/// Activate combo mode using the provided configuration
pub async fn activate_combo_mode(config: &ComboConfig) -> Result<(), ComboError> {
    // Step 1: Disable WiFi if configured
    if config.disable_wifi {
        toggle_wifi(false).await?;
    }
    
    // Step 2: Hide current application if configured
    if config.hide_current_app {
        hide_current_app().await?;
    }
    
    // Step 3: Launch target application if configured
    if config.launch_app {
        if config.target_app.is_empty() {
            return Err(ComboError::NoTargetApp);
        }
        
        launch_application(&config.target_app).await?;
    }
    
    Ok(())
}

/// Deactivate combo mode (re-enable WiFi)
pub async fn deactivate_combo_mode() -> Result<(), ComboError> {
    // Re-enable WiFi
    toggle_wifi(true).await?;
    
    Ok(())
} 