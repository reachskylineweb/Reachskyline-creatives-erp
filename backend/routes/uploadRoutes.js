const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');
const { uploadClientLogo, uploadEmployeePhoto } = require('../middlewares/uploadMiddleware');
const { authenticateToken } = require('../middlewares/auth');

// POST /api/upload/client-logo
router.post('/client-logo', authenticateToken, uploadClientLogo, uploadController.uploadClientLogo);

// POST /api/upload/employee-photo
router.post('/employee-photo', authenticateToken, uploadEmployeePhoto, uploadController.uploadEmployeePhoto);

module.exports = router;
