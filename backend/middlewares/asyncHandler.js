/**
 * asyncHandler middleware to catch unhandled promise rejections
 * and safely pass them to the Express error handler.
 */
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

module.exports = asyncHandler;
