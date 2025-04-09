use std::process::Command;
use thiserror::Error;

#[derive(Debug, Error)]
pub enum WiFiError {
    #[error("Failed to execute WiFi command: {0}")]
    ExecutionError(String),
    
    #[error("Platform not supported")]
    UnsupportedPlatform,
    
    #[error("System error: {0}")]
    SystemError(String),
}

/// Toggle WiFi on or off
pub async fn toggle_wifi(enable: bool) -> Result<(), WiFiError> {
    #[cfg(target_os = "macos")]
    return toggle_wifi_macos(enable).await;
    
    #[cfg(target_os = "windows")]
    return toggle_wifi_windows(enable).await;
    
    #[cfg(not(any(target_os = "macos", target_os = "windows")))]
    return Err(WiFiError::UnsupportedPlatform);
}

/// Check if WiFi is currently enabled
pub async fn is_wifi_enabled() -> Result<bool, WiFiError> {
    #[cfg(target_os = "macos")]
    return is_wifi_enabled_macos().await;
    
    #[cfg(target_os = "windows")]
    return is_wifi_enabled_windows().await;
    
    #[cfg(not(any(target_os = "macos", target_os = "windows")))]
    return Err(WiFiError::UnsupportedPlatform);
}

// macOS implementation
#[cfg(target_os = "macos")]
async fn toggle_wifi_macos(enable: bool) -> Result<(), WiFiError> {
    let status = if enable { "on" } else { "off" };
    
    // Assuming the WiFi interface is en0, which is common on macOS
    // In a more robust implementation, we should determine this dynamically
    let output = Command::new("networksetup")
        .args(["-setairportpower", "en0", status])
        .output()
        .map_err(|e| WiFiError::ExecutionError(e.to_string()))?;
    
    if !output.status.success() {
        let error_message = String::from_utf8_lossy(&output.stderr).to_string();
        return Err(WiFiError::ExecutionError(error_message));
    }
    
    Ok(())
}

#[cfg(target_os = "macos")]
async fn is_wifi_enabled_macos() -> Result<bool, WiFiError> {
    let output = Command::new("networksetup")
        .args(["-getairportpower", "en0"])
        .output()
        .map_err(|e| WiFiError::ExecutionError(e.to_string()))?;
    
    if !output.status.success() {
        let error_message = String::from_utf8_lossy(&output.stderr).to_string();
        return Err(WiFiError::ExecutionError(error_message));
    }
    
    let output_str = String::from_utf8_lossy(&output.stdout).to_string();
    Ok(output_str.contains("On"))
}

// Windows implementation
#[cfg(target_os = "windows")]
async fn toggle_wifi_windows(enable: bool) -> Result<(), WiFiError> {
    let args = if enable {
        "netsh wlan connect"
    } else {
        "netsh wlan disconnect"
    };
    
    let output = Command::new("powershell")
        .args(["-Command", args])
        .output()
        .map_err(|e| WiFiError::ExecutionError(e.to_string()))?;
    
    if !output.status.success() {
        let error_message = String::from_utf8_lossy(&output.stderr).to_string();
        return Err(WiFiError::ExecutionError(error_message));
    }
    
    Ok(())
}

#[cfg(target_os = "windows")]
async fn is_wifi_enabled_windows() -> Result<bool, WiFiError> {
    let output = Command::new("powershell")
        .args(["-Command", "Get-NetAdapter | Where-Object {$_.Name -like '*Wi-Fi*' -and $_.Status -eq 'Up'} | Select-Object -ExpandProperty Status"])
        .output()
        .map_err(|e| WiFiError::ExecutionError(e.to_string()))?;
    
    if !output.status.success() {
        let error_message = String::from_utf8_lossy(&output.stderr).to_string();
        return Err(WiFiError::ExecutionError(error_message));
    }
    
    let output_str = String::from_utf8_lossy(&output.stdout).to_string();
    Ok(output_str.trim() == "Up")
} 