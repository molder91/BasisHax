#!/usr/bin/env node

/**
 * Script to automate commits and pushes to GitHub
 * Used for development and continuous deployment
 */

const { execSync } = require('child_process');
const { existsSync } = require('fs');
const path = require('path');

// Configuration
const GITHUB_REPO = 'https://github.com/molder91/BasisHax.git';
const DEFAULT_COMMIT_MESSAGE = 'Update BasisHax application';

// Parse command line arguments
const args = process.argv.slice(2);
const commitMessage = args.length > 0 ? args.join(' ') : DEFAULT_COMMIT_MESSAGE;

// Check if we're in a git repository
function isGitRepo() {
  try {
    execSync('git rev-parse --is-inside-work-tree', { stdio: 'ignore' });
    return true;
  } catch (error) {
    return false;
  }
}

// Initialize git repository if not already
function initRepo() {
  if (!isGitRepo()) {
    console.log('Initializing git repository...');
    execSync('git init');
    execSync(`git remote add origin ${GITHUB_REPO}`);
  } else {
    // Check if remote exists
    try {
      execSync('git remote get-url origin', { stdio: 'ignore' });
    } catch (error) {
      console.log('Adding remote origin...');
      execSync(`git remote add origin ${GITHUB_REPO}`);
    }
  }
}

// Add all files, commit, and push
function commitAndPush() {
  console.log('Adding files to git...');
  execSync('git add .');
  
  console.log(`Committing with message: "${commitMessage}"`);
  execSync(`git commit -m "${commitMessage}"`);
  
  console.log('Pushing to GitHub...');
  try {
    execSync('git push -u origin main');
  } catch (error) {
    console.log('Failed to push to main branch. Creating main branch...');
    execSync('git checkout -b main');
    execSync('git push -u origin main');
  }
}

// Main execution
try {
  initRepo();
  commitAndPush();
  console.log('Successfully pushed to GitHub!');
} catch (error) {
  console.error('Error:', error.message);
  process.exit(1);
} 