const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');
const { validateClient } = require('../validators/schemas');
const { requireAdmin, requireManagerOrAdmin, authenticateToken } = require('../middlewares/auth');

// Endpoint-level role guards
router.get('/', requireManagerOrAdmin, clientController.list);
router.get('/dropdown', authenticateToken, clientController.getDropdown);
router.get('/:id', requireManagerOrAdmin, clientController.get);
router.post('/', requireManagerOrAdmin, validateClient, clientController.create);
router.put('/:id', requireManagerOrAdmin, validateClient, clientController.update);
router.delete('/:id', requireAdmin, clientController.delete);
router.patch('/:id/status', requireManagerOrAdmin, clientController.changeStatus);

// Bulk actions
router.post('/bulk-delete', requireAdmin, clientController.bulkDelete);
router.post('/bulk-status', requireManagerOrAdmin, clientController.bulkUpdateStatus);

module.exports = router;
