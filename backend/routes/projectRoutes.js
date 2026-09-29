const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const { validateProject } = require('../validators/schemas');
const { requireAdmin, requireManagerOrAdmin } = require('../middlewares/auth');

// Endpoint-level role guards
router.get('/', requireManagerOrAdmin, projectController.list); // Managers may view projects list
router.get('/:id', requireAdmin, projectController.get);
router.post('/', requireAdmin, validateProject, projectController.create);
router.put('/:id', requireAdmin, validateProject, projectController.update);
router.delete('/:id', requireAdmin, projectController.delete);
router.patch('/:id/status', requireAdmin, projectController.changeStatus);

// Bulk actions
router.post('/bulk-delete', requireAdmin, projectController.bulkDelete);
router.post('/bulk-status', requireAdmin, projectController.bulkUpdateStatus);

module.exports = router;
