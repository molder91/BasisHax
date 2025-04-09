# BasisHax Development Roadmap

## Project Overview
BasisHax is a utility software designed for Mac and Windows that provides quick hotkey functions to help users evade detection while using their computers. The application features a modern, minimalistic, and clean GUI.

## Core Features
1. **WiFi Toggle Hotkey**
   - User-customizable hotkey to quickly disable/enable WiFi connection
   
2. **Quick Application Hide**
   - User-customizable hotkey to instantly "close" the current application
   - Note: "Closing" means the application window is hidden, muted, and not accessible via app switcher (cmd+tab/alt+tab) until a custom hotkey is pressed
   
3. **Combo Mode**
   - User-customizable hotkey to disable WiFi and switch to a pre-selected application in full-screen mode

## Development Phases

### Phase 1: Research & Setup (Week 1)
- [x] Define project requirements and features
- [x] Research platform-specific APIs for controlling WiFi on Mac and Windows
- [x] Research methods for controlling application visibility on both platforms
- [x] Select appropriate cross-platform technologies
- [x] Set up development environment
- [x] Create GitHub repository structure
- [x] Create initial project structure

### Phase 2: Core Functionality Development (Weeks 2-4)
- [x] Develop WiFi control module
  - [x] Mac implementation
  - [x] Windows implementation
  - [ ] Testing across different devices and OS versions
- [x] Develop application control module
  - [x] Implement window hiding mechanism
  - [x] Implement audio muting
  - [x] Prevent app from appearing in app switcher
  - [x] Create custom recall mechanism
  - [ ] Testing across different applications and scenarios
- [x] Develop hotkey management system
  - [x] Global hotkey registration
  - [x] Hotkey customization interface
  - [ ] Hotkey conflict resolution
  - [x] Persistence of hotkey settings

### Phase 3: GUI Development (Weeks 5-6)
- [x] Design UI wireframes
- [x] Create modern, minimalistic UI components
- [x] Implement main settings interface
- [x] Implement hotkey configuration screens
- [x] Implement application selector for combo mode
- [ ] Create system tray/menu bar integration
- [x] Implement user preferences storage

### Phase 4: Integration & Testing (Weeks 7-8)
- [ ] Integrate all modules
- [ ] Implement application state management
- [ ] Create startup and background process management
- [ ] Perform comprehensive testing on Mac platforms
  - [ ] macOS Ventura
  - [ ] macOS Monterey
  - [ ] macOS Big Sur
- [ ] Perform comprehensive testing on Windows platforms
  - [ ] Windows 11
  - [ ] Windows 10
- [ ] Bug fixing and performance optimization

### Phase 5: Packaging & Deployment (Week 9)
- [ ] Create installers for Mac and Windows
- [ ] Implement auto-update mechanism
- [ ] Prepare documentation
  - [ ] User manual
  - [ ] Installation guide
  - [ ] Troubleshooting guide
- [ ] Finalize GitHub repository
- [ ] Release v1.0.0

### Phase 6: Future Enhancements (Post-Release)
- [ ] Add support for additional platforms (Linux)
- [ ] Implement more advanced application control features
- [ ] Add scheduled activation/deactivation
- [ ] Introduce profiles for different scenarios
- [ ] Add network monitoring features
- [ ] Implement advanced customization options

## Technical Stack

### Selected Technologies
- **Cross-Platform Framework**: Tauri 2.0
- **Programming Languages**: Rust for backend, TypeScript for frontend
- **UI Framework**: React
- **Styling**: TailwindCSS for modern, clean interface
- **Packaging**: Tauri Bundler

### Platform-Specific Technologies
- **macOS**: AppleScript, Command-line utilities for system integration
- **Windows**: PowerShell, WinAPI for system control

## Development Approach
1. Modular architecture with clear separation of concerns
2. Platform-specific implementations with common interfaces
3. Comprehensive testing on all supported platforms
4. Regular commits to GitHub with descriptive messages
5. Continuous integration for build validation

## Risk Factors & Mitigation
- **System Permission Requirements**: Will require elevated permissions for WiFi control and application management
  - Mitigation: Clear documentation and secure permission requesting
- **OS Version Compatibility**: Different OS versions may require different approaches
  - Mitigation: Version detection and adaptive implementation
- **Security Considerations**: Ensure application cannot be misused
  - Mitigation: Implement responsible usage policies
- **Tauri 2.0 Compatibility**: Tauri 2.0 has different feature flags and configuration requirements
  - Mitigation: Stay updated with Tauri 2.0 documentation and make necessary adjustments

## Contribution Guidelines
- Follow established coding standards
- Maintain comprehensive documentation
- Create detailed pull requests
- Test on multiple platforms before submitting

## Project Tracking
Progress will be tracked on GitHub with the following labels:
- Feature
- Bug
- Enhancement
- Documentation
- Testing

## Regular Reviews
- Weekly code reviews
- Bi-weekly milestone assessments
- Monthly roadmap alignment

## Version Compatibility Notes
- **Tauri 2.0**: The project uses Tauri 2.0 which has different configurations than Tauri 1.0
  - The `shell-open` feature flag is no longer available in Tauri 2.0 core, use the shell plugin instead
  - System tray configuration requires the `tray-icon` feature flag
  - Consult the [Tauri 2.0 documentation](https://v2.tauri.app/) for the latest changes 