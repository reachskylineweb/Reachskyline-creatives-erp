const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validateLogin } = require('../validators/schemas');
const { authenticateToken } = require('../middlewares/auth');

router.post('/login', validateLogin, authController.login);
router.get('/session', authenticateToken, authController.verifySession);

module.exports = router;
