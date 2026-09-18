const express = require('express');
const router = express.Router();
const superAdminController = require('../controllers/superAdminController');
const { authenticateToken, requireSuperAdmin } = require('../middlewares/auth');

// Apply super admin security globally to all endpoints under this router
router.use(authenticateToken);
router.use(requireSuperAdmin);

// Branches CRUD & Details
router.get('/branches', superAdminController.getBranches);
router.post('/branches', superAdminController.createBranch);
router.get('/branches/:id', superAdminController.getBranchDetails);
router.delete('/branches/:id', superAdminController.deleteBranch);

// Admins CRUD
router.get('/admins', superAdminController.getAdmins);
router.post('/admins', superAdminController.createAdmin);
router.put('/admins/:id', superAdminController.updateAdmin);
router.delete('/admins/:id', superAdminController.deleteAdmin);

// Dashboard Statistics & Reports
router.get('/dashboard', superAdminController.getDashboardStats);
router.get('/efficiency', superAdminController.getEmployeeEfficiency);

// Profile
router.put('/profile', superAdminController.updateProfile);

module.exports = router;
