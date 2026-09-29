const validateFields = (data, rules) => {
  const errors = [];
  
  for (const field in rules) {
    const value = data[field];
    const fieldRules = rules[field];
    const label = fieldRules.label || field;

    // Check required fields
    if (fieldRules.required && (value === undefined || value === null || String(value).trim() === '')) {
      errors.push(`${label} is required.`);
      continue;
    }

    // Check rules if value is present
    if (value !== undefined && value !== null && String(value).trim() !== '') {
      const stringVal = String(value).trim();

      if (fieldRules.isEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(stringVal)) {
        errors.push(`${label} must be a valid email address.`);
      }
      if (fieldRules.minLength && stringVal.length < fieldRules.minLength) {
        errors.push(`${label} must be at least ${fieldRules.minLength} characters.`);
      }
      if (fieldRules.maxLength && stringVal.length > fieldRules.maxLength) {
        errors.push(`${label} must not exceed ${fieldRules.maxLength} characters.`);
      }
      if (fieldRules.regex && !fieldRules.regex.test(stringVal)) {
        errors.push(`${label} format is invalid.`);
      }
      if (fieldRules.isNumber && isNaN(Number(stringVal))) {
        errors.push(`${label} must be a valid number.`);
      }
      if (fieldRules.minNum !== undefined && Number(stringVal) < fieldRules.minNum) {
        errors.push(`${label} must be at least ${fieldRules.minNum}.`);
      }
    }
  }

  return errors;
};

// Middleware wrapper for Express
const makeValidationMiddleware = (rules) => {
  return (req, res, next) => {
    let activeRules = rules;
    // ✅ ADDED ENDSWITH('/UPDATE') CHECK HERE:
    if (req.method === 'PUT' || req.method === 'PATCH' || (req.path && req.path.endsWith('/update'))) {
      activeRules = { ...rules };
      if (activeRules.username) {
        activeRules.username = { ...activeRules.username, required: false };
      }
      if (activeRules.password) {
        activeRules.password = { ...activeRules.password, required: false };
      }
    }
    const errors = validateFields(req.body, activeRules);
    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: errors.length === 1 ? errors[0] : `Validation failed: ${errors.join(' ')}`,
        data: null,
        errors
      });
    }
    next();
  };
};

module.exports = {
  validateFields,
  makeValidationMiddleware
};