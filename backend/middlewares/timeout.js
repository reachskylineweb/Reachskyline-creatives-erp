const logger = require('../config/logger');

/**
 * requestTimeout middleware
 * Rejects requests with 503 if they take longer than specified ms.
 */
const requestTimeout = (limitInMs = 30000) => {
  return (req, res, next) => {
    const timer = setTimeout(() => {
      if (!res.headersSent) {
        logger.error(`Request Timeout triggered for route: ${req.method} ${req.originalUrl}`);
        res.status(503).json({
          success: false,
          message: 'Request timed out.',
          data: null,
          errors: ['The server took too long to respond. Connection aborted.']
        });
      }
    }, limitInMs);

    // Clear timeout on finish or close
    res.on('finish', () => clearTimeout(timer));
    res.on('close', () => clearTimeout(timer));

    next();
  };
};

module.exports = requestTimeout;
