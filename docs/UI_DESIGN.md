# BasisHax UI Design

This document outlines the design principles and mockups for the BasisHax application UI.

## Design Principles

BasisHax follows these key design principles:

1. **Minimalism**: Clean interfaces with only essential elements
2. **Modern Aesthetics**: Following current design trends with subtle animations
3. **Intuitive**: Self-explanatory UI requiring minimal learning
4. **Accessibility**: Ensuring the application is usable by everyone
5. **Consistency**: Uniform design language throughout the application

## Color Scheme

The application will use a clean, modern color palette:

- **Primary**: `#3B82F6` (Blue)
- **Secondary**: `#6B7280` (Gray)
- **Background**: `#F9FAFB` (Light Gray) / `#1F2937` (Dark Mode)
- **Text**: `#111827` (Dark Gray) / `#F9FAFB` (Dark Mode)
- **Accent**: `#10B981` (Green for success states)
- **Warning**: `#F59E0B` (Yellow for warnings)
- **Danger**: `#EF4444` (Red for errors/critical actions)

## Typography

- **Primary Font**: Inter (Sans-serif)
- **Monospace Font**: JetBrains Mono (for keyboard shortcuts)
- **Base Font Size**: 16px
- **Scale**: 1.25 ratio for headings

## UI Components

### 1. Main Window

The main window will be compact and unobtrusive, featuring:

```
+-----------------------------------------------+
|  BasisHax                              _ □ X  |
+-----------------------------------------------+
|                                               |
|  [Toggle Icon] WiFi Toggle                    |
|  Hotkey: [Ctrl+Shift+W]     [Edit]           |
|                                               |
|  [Hide Icon] App Quick Hide                   |
|  Hotkey: [Ctrl+Shift+H]     [Edit]           |
|                                               |
|  [Combo Icon] Combo Mode                      |
|  Hotkey: [Ctrl+Shift+C]     [Edit]           |
|  Target App: [Calculator           ▼]         |
|                                               |
|                                               |
|  [Settings]                   [About]         |
|                                               |
+-----------------------------------------------+
```

### 2. Hotkey Configuration Modal

When editing a hotkey, a modal dialog appears:

```
+-----------------------------------------------+
|  Configure Hotkey                      _ X    |
+-----------------------------------------------+
|                                               |
|  Feature: WiFi Toggle                         |
|                                               |
|  Press desired key combination:               |
|  +-------------------------+                  |
|  | Ctrl+Shift+W            |                  |
|  +-------------------------+                  |
|                                               |
|  [Reset to Default]   [Cancel]   [Save]       |
|                                               |
+-----------------------------------------------+
```

### 3. System Tray Menu

The application will minimize to system tray with a context menu:

```
+----------------------------+
| ✓ Enable All Hotkeys       |
| -------------------------- |
| WiFi Toggle                |
| App Quick Hide             |
| Combo Mode                 |
| -------------------------- |
| Open Settings              |
| About                      |
| -------------------------- |
| Exit                       |
+----------------------------+
```

### 4. Settings Screen

```
+-----------------------------------------------+
|  Settings                              _ □ X  |
+-----------------------------------------------+
|                                               |
|  [General]  [Advanced]  [About]               |
|                                               |
|  General Settings                             |
|  ¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯                           |
|                                               |
|  □ Launch at startup                          |
|  □ Start minimized                            |
|  □ Show notifications                         |
|                                               |
|  Theme: [System Default    ▼]                 |
|                                               |
|  WiFi Interface: [en0        ▼]               |
|                                               |
|  [Reset All Settings]                         |
|                                               |
|                     [Cancel]  [Save]          |
|                                               |
+-----------------------------------------------+
```

### 5. Combo Mode Configuration

```
+-----------------------------------------------+
|  Combo Mode Setup                      _ □ X  |
+-----------------------------------------------+
|                                               |
|  When activated, Combo Mode will:             |
|                                               |
|  1. □ Disable WiFi                            |
|  2. □ Hide current application                |
|  3. □ Launch selected application             |
|                                               |
|  Target Application:                          |
|  +-------------------------+                  |
|  | Calculator            ▼ |                  |
|  +-------------------------+                  |
|                                               |
|  Custom Applications:                         |
|  [ Add Application... ]                       |
|                                               |
|                     [Cancel]  [Save]          |
|                                               |
+-----------------------------------------------+
```

## Responsive Behavior

The application will adapt to different window sizes while maintaining a minimum width of 320px to ensure all controls remain accessible.

## Animations

Subtle animations will be used to enhance the user experience:
- Smooth transitions between screens (150ms ease-in-out)
- Gentle hover effects on interactive elements
- Subtle feedback animations when hotkeys are activated

## Accessibility Features

- High contrast mode support
- Keyboard navigation for all functions
- Screen reader compatibility
- Customizable text size

## Platform-Specific Adaptations

### macOS
- Native window controls (traffic light)
- SF Pro font as an alternative to Inter
- Use of translucency when appropriate

### Windows
- Native window controls
- Segoe UI font as an alternative to Inter
- Respect Windows accent color settings

## Implementation Notes

The UI will be implemented using:
- React for component structure
- TailwindCSS for styling
- Headless UI components for accessibility
- CSS transitions for animations 