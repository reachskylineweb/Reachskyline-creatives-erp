const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

function validateEnv() {
  const requiredEnv = [
    'PORT',
    'JWT_SECRET',
    'DB_HOST',
    'DB_USER',
    'DB_PASSWORD',
    'DB_NAME'
  ];

  const missing = [];
  for (const envVar of requiredEnv) {
    if (!process.env[envVar] || process.env[envVar].trim() === '') {
      missing.push(envVar);
    }
  }

  if (missing.length > 0) {
    const divider = '='.repeat(60);
    const title = '            CRITICAL CONFIGURATION ERROR            ';
    console.error('\x1b[31m'); // Red color
    console.error(divider);
    console.error(title);
    console.error(divider);
    console.error(' The backend server cannot start because the following required');
    console.error(' environment variables are missing or empty:');
    console.error('');
    missing.forEach(v => {
      console.error(`   ❌ \x1b[1m${v}\x1b[22m\x1b[31m`);
    });
    console.error('');
    console.error(' Please check your backend/.env file and configure these keys.');
    console.error(divider);
    console.error('\x1b[0m'); // Reset color
    process.exit(1);
  }
}

module.exports = validateEnv;
