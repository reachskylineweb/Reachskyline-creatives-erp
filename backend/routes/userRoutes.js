const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { validateManager, validateEmployee, validateHR } = require('../validators/schemas');

const { requireAdmin } = require('../middlewares/auth');

// --- Manager Routes ---
router.get('/managers', requireAdmin, userController.listManagers);
router.get('/managers/dropdown', requireAdmin, userController.getManagersDropdown);
router.get('/managers/:id', requireAdmin, userController.getManager);
router.post('/managers', requireAdmin, validateManager, userController.createManager);
router.put('/managers/:id', requireAdmin, validateManager, userController.updateManager);
router.post('/managers/:id/update', requireAdmin, validateManager, userController.updateManager);
router.delete('/managers/:id', requireAdmin, userController.deleteManager);

// --- Employee Routes ---
router.get('/employees', userController.listEmployees);
router.get('/employees/dropdown', userController.getEmployeesDropdown);
router.get('/employees/:id', userController.getEmployee);
router.post('/employees', requireAdmin, validateEmployee, userController.createEmployee);
router.put('/employees/:id', requireAdmin, validateEmployee, userController.updateEmployee);
router.post('/employees/:id/update', requireAdmin, validateEmployee, userController.updateEmployee);
router.delete('/employees/:id', requireAdmin, userController.deleteEmployee);

// // --- HR Routes ---
// router.get('/hr', requireAdmin, userController.listHR);
// router.get('/hr/:id', requireAdmin, userController.getHR);
// router.post('/hr', requireAdmin, validateHR, userController.createHR);
// router.put('/hr/:id', requireAdmin, validateHR, userController.updateHR);
// router.delete('/hr/:id', requireAdmin, validateHR, userController.deleteHR);

// --- Global User Controls ---
router.get('/efficiency', userController.getEmployeeEfficiency);
router.get('/credentials', requireAdmin, userController.listCredentials);
router.post('/reset-password', requireAdmin, userController.resetPassword);
router.post('/change-status', requireAdmin, userController.changeStatus);

module.exports = router;