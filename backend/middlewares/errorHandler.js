const logger = require('../config/logger');

const errorHandler = (err, req, res, next) => {
  // Handle MySQL Duplicate Entry Errors (e.g. ER_DUP_ENTRY / 1062)
  if (err.code === 'ER_DUP_ENTRY' || err.errno === 1062) {
    let friendlyMessage = 'A record with this information already exists.';
    const rawMsg = err.sqlMessage || err.message || '';

    if (rawMsg.includes('users.email')) {
      const match = rawMsg.match(/Duplicate entry '(.*?)'/);
      const emailVal = match ? match[1] : '';
      friendlyMessage = `An account with email address "${emailVal}" already exists. Please use a different email address.`;
    } else if (rawMsg.includes('users.username')) {
      const match = rawMsg.match(/Duplicate entry '(.*?)'/);
      const usernameVal = match ? match[1] : '';
      friendlyMessage = `Username "${usernameVal}" is already registered. Please choose a different username.`;
    } else if (rawMsg.includes('clients.client_id_code')) {
      friendlyMessage = 'A client with this ID code already exists.';
    } else {
      const match = rawMsg.match(/Duplicate entry '(.*?)'/);
      friendlyMessage = match ? `Duplicate entry for "${match[1]}". This record already exists.` : friendlyMessage;
    }

    logger.warn(`Duplicate Entry Warning on [${req.method} ${req.originalUrl}]: ${friendlyMessage}`);

    return res.status(400).json({
      success: false,
      message: friendlyMessage,
      data: null,
      errors: [friendlyMessage]
    });
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || 'An unexpected database or server error occurred.';
  const errors = err.errors || [];

  // Log error using the centralized logger
  logger.error(`API Error on [${req.method} ${req.originalUrl}]: ${message}`, {
    statusCode,
    errors,
    stack: err.stack
  });

  res.status(statusCode).json({
    success: false,
    message,
    data: null,
    errors: Array.isArray(errors) ? errors : [errors]
  });
};

module.exports = errorHandler;
