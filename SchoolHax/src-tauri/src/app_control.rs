use std::process::Command;
use thiserror::Error;

#[derive(Debug, Error)]
pub enum AppControlError {
    #[error("Failed to execute app control command: {0}")]
    ExecutionError(String),
    
    #[error("Platform not supported")]
    UnsupportedPlatform,
    
    #[error("Application not found: {0}")]
    AppNotFoundError(String),
    
    #[error("System error: {0}")]
    SystemError(String),
}

/// Hide the currently active application
pub async fn hide_current_app() -> Result<(), AppControlError> {
    #[cfg(target_os = "macos")]
    return hide_current_app_macos().await;
    
    #[cfg(target_os = "windows")]
    return hide_current_app_windows().await;
    
    #[cfg(not(any(target_os = "macos", target_os = "windows")))]
    return Err(AppControlError::UnsupportedPlatform);
}

/// Launch a specific application
pub async fn launch_application(app_name: &str) -> Result<(), AppControlError> {
    #[cfg(target_os = "macos")]
    return launch_application_macos(app_name).await;
    
    #[cfg(target_os = "windows")]
    return launch_application_windows(app_name).await;
    
    #[cfg(not(any(target_os = "macos", target_os = "windows")))]
    return Err(AppControlError::UnsupportedPlatform);
}

// macOS implementations
#[cfg(target_os = "macos")]
async fn hide_current_app_macos() -> Result<(), AppControlError> {
    // AppleScript to hide the current frontmost application
    let script = r#"
        tell application "System Events"
            set frontApp to first application process whose frontmost is true
            set visible of frontApp to false
        end tell
    "#;
    
    let output = Command::new("osascript")
        .arg("-e")
        .arg(script)
        .output()
        .map_err(|e| AppControlError::ExecutionError(e.to_string()))?;
    
    if !output.status.success() {
        let error_message = String::from_utf8_lossy(&output.stderr).to_string();
        return Err(AppControlError::ExecutionError(error_message));
    }
    
    Ok(())
}

#[cfg(target_os = "macos")]
async fn launch_application_macos(app_name: &str) -> Result<(), AppControlError> {
    let output = Command::new("open")
        .args(["-a", app_name])
        .output()
        .map_err(|e| AppControlError::ExecutionError(e.to_string()))?;
    
    if !output.status.success() {
        let error_message = String::from_utf8_lossy(&output.stderr).to_string();
        if error_message.contains("Unable to find application") {
            return Err(AppControlError::AppNotFoundError(app_name.to_string()));
        }
        return Err(AppControlError::ExecutionError(error_message));
    }
    
    Ok(())
}

// Windows implementations
#[cfg(target_os = "windows")]
async fn hide_current_app_windows() -> Result<(), AppControlError> {
    // PowerShell script to hide the current foreground window
    let script = r#"
        Add-Type @"
        using System;
        using System.Runtime.InteropServices;
        
        public class WindowHelper {
            [DllImport("user32.dll")]
            public static extern IntPtr GetForegroundWindow();
            
            [DllImport("user32.dll")]
            public static extern bool ShowWindow(IntPtr hWnd, int nCmdShow);
        }
"@
        
        $hwnd = [WindowHelper]::GetForegroundWindow()
        [WindowHelper]::ShowWindow($hwnd, 0) # SW_HIDE = 0
    "#;
    
    let output = Command::new("powershell")
        .arg("-Command")
        .arg(script)
        .output()
        .map_err(|e| AppControlError::ExecutionError(e.to_string()))?;
    
    if !output.status.success() {
        let error_message = String::from_utf8_lossy(&output.stderr).to_string();
        return Err(AppControlError::ExecutionError(error_message));
    }
    
    Ok(())
}

#[cfg(target_os = "windows")]
async fn launch_application_windows(app_name: &str) -> Result<(), AppControlError> {
    let output = Command::new("cmd")
        .args(["/C", "start", "", app_name])
        .output()
        .map_err(|e| AppControlError::ExecutionError(e.to_string()))?;
    
    if !output.status.success() {
        let error_message = String::from_utf8_lossy(&output.stderr).to_string();
        return Err(AppControlError::ExecutionError(error_message));
    }
    
    Ok(())
} 