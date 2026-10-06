const mysql = require('mysql2/promise');
const path = require('path');
const logger = require('./logger');

require('dotenv').config({
  path: path.join(__dirname, '../.env'),
  override: true
});



const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT, 10) || 25,
  queueLimit: 0,
  dateStrings: true,
  enableKeepAlive: true,
  keepAliveInitialDelay: 10000 // Send keep-alive packet every 10 seconds to keep connection active
});

// Capture unexpected errors on idle pool connections to prevent app crashes
pool.on('error', (err) => {
  logger.error('Unexpected database pool connection error:', err);
});

// Connection validation loop with exponential backoff on startup
async function connectWithRetry() {
  const maxRetries = 10;
  const initialDelay = 2000; // 2 seconds
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      logger.info(`Validating database connection (attempt ${attempt}/${maxRetries})...`);
      const connection = await pool.getConnection();
      logger.info('Database connection established successfully.');
      connection.release();
      return pool;
    } catch (err) {
      logger.error(`Database connection attempt ${attempt} failed: ${err.message}`);
      if (attempt === maxRetries) {
        logger.critical('Database connection could not be established. Shutting down.');
        throw err;
      }
      const delay = initialDelay * Math.pow(1.5, attempt - 1);
      logger.info(`Retrying in ${Math.round(delay)}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

// Database Health Check function
async function checkDbHealth() {
  try {
    const connection = await pool.getConnection();
    await connection.query('SELECT 1');
    connection.release();

    let activeConnections = 0;
    if (pool.pool && pool.pool._allConnections) {
      activeConnections = pool.pool._allConnections.length;
    }

    return {
      status: 'healthy',
      activeConnections
    };
  } catch (err) {
    logger.error('Database health check failed:', err);
    return {
      status: 'unhealthy',
      error: err.message,
      activeConnections: 0
    };
  }
}

// Attach utilities directly to pool object for backward compatibility
pool.connectWithRetry = connectWithRetry;
pool.checkDbHealth = checkDbHealth;

module.exports = pool;
