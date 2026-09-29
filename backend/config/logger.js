const fs = require('fs');
const path = require('path');

const logDir = path.join(__dirname, '../logs');

// Self-healing directory creation
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const writeLog = (level, message, meta = '') => {
  const timestamp = new Date().toISOString();
  let metaStr = '';
  
  if (meta) {
    if (meta instanceof Error) {
      metaStr = ` | Error: ${meta.message} | Stack: ${meta.stack}`;
    } else {
      metaStr = ` | Meta: ${JSON.stringify(meta)}`;
    }
  }

  const logLine = `[${timestamp}] [${level.toUpperCase()}] ${message}${metaStr}\n`;

  // Print to console with colored outputs
  if (level === 'critical' || level === 'error') {
    console.error(`\x1b[31m${logLine.trim()}\x1b[0m`);
  } else if (level === 'warn') {
    console.warn(`\x1b[33m${logLine.trim()}\x1b[0m`);
  } else {
    console.log(logLine.trim());
  }

  // Write asynchronously or via sync append to log files
  try {
    fs.appendFileSync(path.join(logDir, 'combined.log'), logLine);
    if (level === 'error' || level === 'critical') {
      fs.appendFileSync(path.join(logDir, 'error.log'), logLine);
    }
  } catch (err) {
    console.error('Failed to write to log files:', err.message);
  }
};

const logger = {
  info: (message, meta) => writeLog('info', message, meta),
  warn: (message, meta) => writeLog('warn', message, meta),
  error: (message, meta) => writeLog('error', message, meta),
  critical: (message, meta) => writeLog('critical', message, meta)
};

module.exports = logger;
