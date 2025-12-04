#!/usr/bin/env node

/**
 * Stub Integrations Script
 * 
 * This script helps disable optional third-party integrations
 * to enable zero-secrets deployment on Railway free tier.
 * 
 * Usage:
 *   node scripts/stub-integrations.js [--check|--disable|--enable]
 * 
 * Options:
 *   --check   Check current integration status (default)
 *   --disable Disable all optional integrations
 *   --enable  Enable all integrations (requires API keys)
 */

const fs = require('fs');
const path = require('path');

// Configuration - can be overridden via environment variable
const CONFIG_FILE = process.env.CONFIG_FILE || path.join(__dirname, '..', 'app', 'submit', 'action.ts');

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkIntegrationStatus() {
  log('\n=== Integration Status Check ===\n', 'bright');
  
  try {
    const content = fs.readFileSync(CONFIG_FILE, 'utf8');
    
    // Check AI enrichment status
    const aiEnabledMatch = content.match(/aiEnrichmentEnabled:\s*(true|false)/);
    const aiEnabled = aiEnabledMatch && aiEnabledMatch[1] === 'true';
    
    log('AI Enrichment:', 'blue');
    log(`  Status: ${aiEnabled ? 'ENABLED' : 'DISABLED'}`, aiEnabled ? 'green' : 'yellow');
    log(`  Location: app/submit/action.ts`, 'reset');
    log(`  Required: ANTHROPIC_API_KEY or OPENAI_API_KEY`, 'reset');
    
    // Check environment variables
    log('\nEnvironment Variables:', 'blue');
    const envFile = path.join(__dirname, '..', '.env.local');
    if (fs.existsSync(envFile)) {
      const envContent = fs.readFileSync(envFile, 'utf8');
      const hasAnthropic = envContent.includes('ANTHROPIC_API_KEY=');
      const hasOpenAI = envContent.includes('OPENAI_API_KEY=');
      const hasSupabase = envContent.includes('NEXT_PUBLIC_SUPABASE_URL=');
      
      log(`  Supabase: ${hasSupabase ? 'Configured' : 'Missing'}`, hasSupabase ? 'green' : 'red');
      log(`  Anthropic: ${hasAnthropic ? 'Configured' : 'Not set'}`, hasAnthropic ? 'green' : 'yellow');
      log(`  OpenAI: ${hasOpenAI ? 'Configured' : 'Not set'}`, hasOpenAI ? 'green' : 'yellow');
    } else {
      log('  .env.local not found - using Railway environment variables', 'yellow');
    }
    
    // Deployment recommendations
    log('\nDeployment Status:', 'blue');
    if (!aiEnabled) {
      log('  ✓ Ready for Railway free tier deployment', 'green');
      log('  ✓ No AI API keys required', 'green');
      log('  ✓ Cost-protected configuration', 'green');
    } else {
      log('  ⚠ AI enrichment enabled - requires API key', 'yellow');
      log('  ⚠ Will incur AI API costs', 'yellow');
    }
    
    log('');
    return aiEnabled;
    
  } catch (error) {
    log(`Error checking status: ${error.message}`, 'red');
    return null;
  }
}

function disableIntegrations() {
  log('\n=== Disabling Optional Integrations ===\n', 'bright');
  
  try {
    let content = fs.readFileSync(CONFIG_FILE, 'utf8');
    
    // Disable AI enrichment
    const originalContent = content;
    content = content.replace(
      /aiEnrichmentEnabled:\s*true/,
      'aiEnrichmentEnabled: false'
    );
    
    if (content === originalContent) {
      log('AI enrichment already disabled', 'yellow');
    } else {
      fs.writeFileSync(CONFIG_FILE, content, 'utf8');
      log('✓ AI enrichment disabled', 'green');
      log(`  Updated: ${CONFIG_FILE}`, 'reset');
    }
    
    log('\nIntegrations stubbed successfully!', 'green');
    log('Application is now ready for zero-secrets deployment.', 'green');
    log('');
    
  } catch (error) {
    log(`Error disabling integrations: ${error.message}`, 'red');
    process.exit(1);
  }
}

function enableIntegrations() {
  log('\n=== Enabling Optional Integrations ===\n', 'bright');
  
  try {
    let content = fs.readFileSync(CONFIG_FILE, 'utf8');
    
    // Enable AI enrichment
    const originalContent = content;
    content = content.replace(
      /aiEnrichmentEnabled:\s*false/,
      'aiEnrichmentEnabled: true'
    );
    
    if (content === originalContent) {
      log('AI enrichment already enabled', 'yellow');
    } else {
      fs.writeFileSync(CONFIG_FILE, content, 'utf8');
      log('✓ AI enrichment enabled', 'green');
      log(`  Updated: ${CONFIG_FILE}`, 'reset');
    }
    
    log('\nIntegrations enabled!', 'green');
    log('⚠ Make sure to set required environment variables:', 'yellow');
    log('  - ANTHROPIC_API_KEY or OPENAI_API_KEY', 'yellow');
    log('');
    
  } catch (error) {
    log(`Error enabling integrations: ${error.message}`, 'red');
    process.exit(1);
  }
}

function showHelp() {
  log('\nStub Integrations Script', 'bright');
  log('========================\n', 'bright');
  log('This script helps manage optional third-party integrations.');
  log('');
  log('Usage:', 'blue');
  log('  node scripts/stub-integrations.js [option]\n');
  log('Options:', 'blue');
  log('  --check   Check current integration status (default)');
  log('  --disable Disable all optional integrations');
  log('  --enable  Enable all integrations (requires API keys)');
  log('  --help    Show this help message\n');
  log('Examples:', 'blue');
  log('  node scripts/stub-integrations.js --check');
  log('  node scripts/stub-integrations.js --disable');
  log('  node scripts/stub-integrations.js --enable\n');
  log('Environment Variables:', 'blue');
  log('  CONFIG_FILE   Path to config file (default: app/submit/action.ts)');
  log('                Example: CONFIG_FILE=path/to/config.ts node scripts/stub-integrations.js\n');
}

// Main execution
const args = process.argv.slice(2);
const command = args[0] || '--check';

switch (command) {
  case '--check':
    checkIntegrationStatus();
    break;
  case '--disable':
    disableIntegrations();
    checkIntegrationStatus();
    break;
  case '--enable':
    enableIntegrations();
    checkIntegrationStatus();
    break;
  case '--help':
  case '-h':
    showHelp();
    break;
  default:
    log(`Unknown command: ${command}`, 'red');
    showHelp();
    process.exit(1);
}
