# Contributing to BasisHax

Thank you for your interest in contributing to BasisHax! This document provides guidelines and instructions for contributing to the project.

## Development Setup

### Prerequisites

- Node.js 16+
- npm or yarn
- Git

### Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/molder91/BasisHax.git
   cd BasisHax
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## Project Structure

- **`src/main`** - Electron main process code
- **`src/renderer`** - React frontend application
- **`src/preload`** - Preload scripts for secure IPC
- **`docs`** - Project documentation

## Development Workflow

1. **Create a branch**: Make a new branch for your feature or bugfix
2. **Make changes**: Implement your feature or fix
3. **Test**: Ensure your changes work correctly
4. **Commit**: Use descriptive commit messages
5. **Push**: Push your changes to your fork
6. **Create a Pull Request**: Submit your changes for review

## Coding Standards

- Follow the ESLint configuration
- Use TypeScript for type safety
- Follow the project's architectural patterns
- Write unit tests for new functionality
- Document new features or changes

## Building the Application

- For all platforms: `npm run build:all`
- For macOS only: `npm run build:mac`
- For Windows only: `npm run build:win`

## Platform-Specific Development

### macOS

- Requires Xcode Command Line Tools
- Ensure you have proper permissions for using AppleScript and system commands

### Windows

- Requires Visual Studio Build Tools for native module compilation
- PowerShell scripts may require execution policy adjustment

## Submitting Changes

1. Push your changes to your fork
2. Submit a Pull Request against the `main` branch
3. Ensure all checks pass
4. Wait for review and address any feedback

## Getting Help

If you have questions about the codebase or need help with development:

- Open an issue with your question
- Comment on the relevant issue or pull request

Thank you for contributing to make BasisHax better! 