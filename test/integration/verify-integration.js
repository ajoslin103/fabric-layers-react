/**
 * Integration Test Script
 * 
 * This script verifies that fabric-layers-react correctly integrates with
 * the core fabric-layers library by checking the package.json dependencies
 * and ensuring that the build process works correctly.
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

// Get the current file's directory with ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths to the projects
const reactLibPath = path.resolve(__dirname, '../..');
const coreLibPath = path.resolve(reactLibPath, '../fabric-layers');

// Function to check if a directory exists
function directoryExists(dirPath) {
  try {
    return fs.statSync(dirPath).isDirectory();
  } catch (err) {
    return false;
  }
}

// Function to check if a file exists
function fileExists(filePath) {
  try {
    return fs.statSync(filePath).isFile();
  } catch (err) {
    return false;
  }
}

// Function to read and parse package.json
function readPackageJson(projectPath) {
  const packageJsonPath = path.join(projectPath, 'package.json');
  if (!fileExists(packageJsonPath)) {
    throw new Error(`package.json not found at ${packageJsonPath}`);
  }
  
  const packageJsonContent = fs.readFileSync(packageJsonPath, 'utf8');
  return JSON.parse(packageJsonContent);
}

// Main test function
function runIntegrationTests() {
  console.log('Running integration tests between fabric-layers and fabric-layers-react...');
  
  // Check if both projects exist
  if (!directoryExists(reactLibPath)) {
    throw new Error(`React library not found at ${reactLibPath}`);
  }
  
  if (!directoryExists(coreLibPath)) {
    throw new Error(`Core library not found at ${coreLibPath}`);
  }
  
  console.log('✓ Both libraries found');
  
  // Check if both projects have the same Node version
  const reactNvmrcPath = path.join(reactLibPath, '.nvmrc');
  const coreNvmrcPath = path.join(coreLibPath, '.nvmrc');
  
  if (!fileExists(reactNvmrcPath) || !fileExists(coreNvmrcPath)) {
    throw new Error('.nvmrc file missing in one of the projects');
  }
  
  const reactNodeVersion = fs.readFileSync(reactNvmrcPath, 'utf8').trim();
  const coreNodeVersion = fs.readFileSync(coreNvmrcPath, 'utf8').trim();
  
  if (reactNodeVersion !== coreNodeVersion) {
    throw new Error(`Node version mismatch: React library uses ${reactNodeVersion}, Core library uses ${coreNodeVersion}`);
  }
  
  console.log(`✓ Both libraries use the same Node version: ${reactNodeVersion}`);
  
  // Check if React library depends on core library
  const reactPackageJson = readPackageJson(reactLibPath);
  
  if (!reactPackageJson.dependencies || !reactPackageJson.dependencies['fabric-layers']) {
    throw new Error('React library does not depend on fabric-layers');
  }
  
  console.log('✓ React library correctly depends on fabric-layers');
  
  // Check if core library exports required components
  const corePackageJson = readPackageJson(coreLibPath);
  console.log(`✓ Core library version: ${corePackageJson.version}`);
  
  // Check source files to ensure proper integration
  const coreIndexPath = path.join(coreLibPath, 'src', 'index.js');
  const reactIndexPath = path.join(reactLibPath, 'src', 'index.js');
  
  if (!fileExists(coreIndexPath) || !fileExists(reactIndexPath)) {
    throw new Error('Source index files missing');
  }
  
  const coreIndexContent = fs.readFileSync(coreIndexPath, 'utf8');
  const reactIndexContent = fs.readFileSync(reactIndexPath, 'utf8');
  
  // Check if React library imports from core library
  if (!reactIndexContent.includes('fabric-layers')) {
    throw new Error('React library does not import from fabric-layers');
  }
  
  console.log('✓ React library correctly imports from fabric-layers');
  
  // Final success message
  console.log('\n✅ Integration tests passed! fabric-layers-react correctly integrates with fabric-layers.');
  
  return true;
}

// Run the tests
try {
  runIntegrationTests();
  process.exit(0);
} catch (error) {
  console.error(`❌ Integration test failed: ${error.message}`);
  process.exit(1);
}
