# Technical Approaches for BasisHax Core Features

This document outlines potential implementation approaches for the core features of BasisHax.

## 1. WiFi Toggle Control

### macOS Approach

On macOS, we have several options:

1. **Using Network Framework API (Preferred)**
   ```swift
   import NetworkExtension
   
   func toggleWiFi(enabled: Bool) {
       NEHotspotConfigurationManager.shared.getConfiguredSSIDs { (ssids) in
           // Logic to enable/disable specific SSID
       }
   }
   ```

2. **AppleScript Through Shell**
   ```rust
   fn toggle_wifi(enable: bool) -> Result<(), Error> {
       let script = if enable {
           "networksetup -setairportpower en0 on"
       } else {
           "networksetup -setairportpower en0 off"
       };
       
       Command::new("sh")
           .arg("-c")
           .arg(script)
           .output()?;
           
       Ok(())
   }
   ```

3. **Using System Framework via FFI**
   We can use Rust's Foreign Function Interface to call into the Apple System Framework directly.

### Windows Approach

For Windows, we can use:

1. **Network Management Windows API**
   ```rust
   fn toggle_wifi(enable: bool) -> Result<(), Error> {
       // Using Windows API through winapi crate
       unsafe {
           // Call appropriate Windows API functions
           // for managing wireless networks
       }
       
       Ok(())
   }
   ```

2. **PowerShell Commands**
   ```rust
   fn toggle_wifi(enable: bool) -> Result<(), Error> {
       let script = if enable {
           "netsh wlan connect name=\"YourNetworkName\""
       } else {
           "netsh wlan disconnect"
       };
       
       Command::new("powershell")
           .arg("-Command")
           .arg(script)
           .output()?;
           
       Ok(())
   }
   ```

## 2. Application Control

### macOS Approach

1. **Using NSWorkspace API**
   ```swift
   import Cocoa
   
   func hideApplication() {
       let frontmostApp = NSWorkspace.shared.frontmostApplication
       // Hide and suppress in app switcher
   }
   ```

2. **Using Apple Event Manager**
   ```rust
   fn hide_current_application() -> Result<(), Error> {
       // AppleScript to hide current application and modify its state
       let script = r#"
           tell application "System Events"
               set frontApp to first application process whose frontmost is true
               set visible of frontApp to false
               // Additional code to suppress in app switcher
           end tell
       "#;
       
       Command::new("osascript")
           .arg("-e")
           .arg(script)
           .output()?;
           
       Ok(())
   }
   ```

### Windows Approach

1. **Using Windows API**
   ```rust
   fn hide_current_application() -> Result<(), Error> {
       unsafe {
           let hwnd = GetForegroundWindow();
           ShowWindow(hwnd, SW_HIDE);
           
           // Additional code to prevent Alt+Tab appearance
           // and handle audio muting
       }
       
       Ok(())
   }
   ```

2. **Using PowerShell**
   ```rust
   fn hide_current_application() -> Result<(), Error> {
       let script = r#"
           $foregroundProcess = Get-Process | Where-Object { $_.MainWindowHandle -eq (Get-ForegroundWindow) }
           # Logic to hide window and suppress in task switcher
       "#;
       
       Command::new("powershell")
           .arg("-Command")
           .arg(script)
           .output()?;
           
       Ok(())
   }
   ```

## 3. Global Hotkey Registration

### Cross-Platform Approach

We can use the `global-hotkey` crate in Rust which supports both macOS and Windows:

```rust
use global_hotkey::{GlobalHotKeyManager, HotKey, Modifiers, Key};

fn register_hotkeys() -> Result<(), Error> {
    let manager = GlobalHotKeyManager::new()?;
    
    // Register WiFi toggle hotkey
    let hotkey_wifi = HotKey::new(Some(Modifiers::SHIFT | Modifiers::CONTROL), Key::W);
    manager.register(hotkey_wifi)?;
    
    // Register app hide hotkey
    let hotkey_hide = HotKey::new(Some(Modifiers::SHIFT | Modifiers::CONTROL), Key::H);
    manager.register(hotkey_hide)?;
    
    // Register combo hotkey
    let hotkey_combo = HotKey::new(Some(Modifiers::SHIFT | Modifiers::CONTROL), Key::C);
    manager.register(hotkey_combo)?;
    
    Ok(())
}
```

## 4. Combo Mode Implementation

The combo mode will combine the WiFi toggling and application switching:

```rust
fn activate_combo_mode(target_app: &str) -> Result<(), Error> {
    // 1. Turn off WiFi
    toggle_wifi(false)?;
    
    // 2. Hide current application
    hide_current_application()?;
    
    // 3. Launch and focus target application
    launch_application(target_app)?;
    
    Ok(())
}

fn launch_application(app_name: &str) -> Result<(), Error> {
    #[cfg(target_os = "macos")]
    {
        Command::new("open")
            .arg("-a")
            .arg(app_name)
            .output()?;
    }
    
    #[cfg(target_os = "windows")]
    {
        Command::new("cmd")
            .args(&["/C", "start", "", app_name])
            .output()?;
    }
    
    Ok(())
}
```

## Security and Permission Considerations

Both macOS and Windows will require special permissions for:

1. **WiFi Control**
   - macOS: Network Extension entitlement
   - Windows: Administrator privileges or specialized driver

2. **Application Control**
   - macOS: Accessibility permissions
   - Windows: User Interface Privilege Isolation considerations

3. **Global Hotkey Registration**
   - Generally requires less permissions but may conflict with system or other application hotkeys

## Technical Challenges

1. **App Switcher Suppression**: Making an application truly "invisible" in the app switcher is challenging and may require OS-specific approaches.

2. **Audio Muting**: Application-specific audio muting requires identifying and controlling audio streams from specific applications.

3. **Permission Management**: Both platforms are increasingly strict about system-level permissions.

4. **Performance**: Ensuring hotkey detection is responsive with minimal resource usage.

## Next Steps

1. Prototype each approach on both platforms
2. Measure performance and reliability
3. Evaluate permission requirements and user experience impact
4. Select final implementation approach 