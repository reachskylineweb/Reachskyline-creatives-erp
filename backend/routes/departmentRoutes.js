const express = require('express');
const router = express.Router();
const departmentController = require('../controllers/departmentController');
const { validateDepartment } = require('../validators/schemas');
const { requireAdmin } = require('../middlewares/auth');

// Endpoint-level role guards
router.get('/', requireAdmin, departmentController.list);
router.get('/dropdown', departmentController.getDropdown); // Accessed by managers/employees
router.get('/:id', requireAdmin, departmentController.get);
router.post('/', requireAdmin, validateDepartment, departmentController.create);
router.put('/:id', requireAdmin, validateDepartment, departmentController.update);
router.delete('/:id', requireAdmin, departmentController.delete);
router.patch('/:id/status', requireAdmin, departmentController.changeStatus);
router.get('/:id/sub-departments', departmentController.getSubDepartments); // Accessed by managers/employees
router.get('/:id/details', requireAdmin, departmentController.getDetails);
router.post('/:id/sub-departments', requireAdmin, departmentController.createSubDepartment);
router.delete('/sub-departments/:subDeptId', requireAdmin, departmentController.deleteSubDepartment);

// Bulk actions
router.post('/bulk-delete', requireAdmin, departmentController.bulkDelete);
router.post('/bulk-status', requireAdmin, departmentController.bulkUpdateStatus);

module.exports = router;
