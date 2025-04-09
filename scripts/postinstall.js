#!/usr/bin/env node

/**
 * Post-installation script to set up additional dependencies
 * and perform platform-specific configurations
 */

const { execSync } = require('child_process');
const { platform } = require('os');
const fs = require('fs');
const path = require('path');

// Determine platform
const isWindows = platform() === 'win32';
const isMacOS = platform() === 'darwin';

console.log('Running BasisHax post-installation setup...');

// Create assets directory if it doesn't exist
const assetsDir = path.join(__dirname, '..', 'assets');
if (!fs.existsSync(assetsDir)) {
  console.log('Creating assets directory...');
  fs.mkdirSync(assetsDir, { recursive: true });
}

// Create a placeholder for the tray icon
const trayIconPlaceholder = path.join(assetsDir, 'tray-icon.png');
if (!fs.existsSync(trayIconPlaceholder)) {
  console.log('Creating placeholder tray icon...');
  // This would normally create or copy an icon file
  // For now, we'll just create an empty file as a placeholder
  fs.writeFileSync(trayIconPlaceholder, '');
}

// Install platform-specific dependencies
console.log('Installing platform-specific dependencies...');

try {
  // Install dependencies based on platform
  if (isWindows) {
    console.log('Installing Windows-specific dependencies...');
    // Additional Windows dependencies would go here
  } else if (isMacOS) {
    console.log('Installing macOS-specific dependencies...');
    // Additional macOS dependencies would go here
  } else {
    console.log('Unsupported platform detected. Some features may not work correctly.');
  }
  
  console.log('BasisHax setup completed successfully!');
} catch (error) {
  console.error('Error during post-installation setup:', error);
  process.exit(1);
} 