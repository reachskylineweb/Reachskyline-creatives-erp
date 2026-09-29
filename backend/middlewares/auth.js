const jwt = require('jsonwebtoken');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const setCorsHeaders = (res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
};

const authenticateToken = (req, res, next) => {
  setCorsHeaders(res);

  // Allow CORS preflight OPTIONS requests to pass through without token
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }

  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required. Please log in.',
      data: null,
      errors: ['Token not found']
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecretjwtkeyforerpsystem2026!');
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({
      success: false,
      message: 'Session expired or invalid token. Please log in again.',
      data: null,
      errors: [err.message]
    });
  }
};

const requireAdmin = (req, res, next) => {
  setCorsHeaders(res);

  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'User identity could not be verified.',
      data: null,
      errors: ['Identity context missing']
    });
  }

  if (req.user.role !== 'admin' && req.user.role !== 'super_admin') {
    return res.status(403).json({
      success: false,
      message: 'Forbidden. Access restricted to administrator accounts.',
      data: null,
      errors: ['Requires ADMIN role']
    });
  }

  next();
};

const requireManagerOrAdmin = (req, res, next) => {
  setCorsHeaders(res);

  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'User identity could not be verified.',
      data: null,
      errors: ['Identity context missing']
    });
  }

  if (req.user.role !== 'manager' && req.user.role !== 'admin' && req.user.role !== 'super_admin') {
    return res.status(403).json({
      success: false,
      message: 'Forbidden. Access restricted to managers or administrators.',
      data: null,
      errors: ['Requires MANAGER or ADMIN role']
    });
  }

  next();
};

const requireClient = (req, res, next) => {
  setCorsHeaders(res);

  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }

  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required. Please log in.',
      data: null,
      errors: ['Identity context missing']
    });
  }

  if (req.user.role !== 'client' && req.user.role !== 'super_admin') {
    return res.status(403).json({
      success: false,
      message: 'Forbidden. Access restricted to client accounts.',
      data: null,
      errors: ['Requires CLIENT role']
    });
  }

  next();
};

const requireSuperAdmin = (req, res, next) => {
  setCorsHeaders(res);

  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'User identity could not be verified.',
      data: null,
      errors: ['Identity context missing']
    });
  }

  if (req.user.role !== 'super_admin') {
    return res.status(403).json({
      success: false,
      message: 'Forbidden. Access restricted to super admin account.',
      data: null,
      errors: ['Requires SUPER_ADMIN role']
    });
  }

  next();
};

module.exports = {
  authenticateToken,
  requireAdmin,
  requireManagerOrAdmin,
  requireClient,
  requireSuperAdmin
};