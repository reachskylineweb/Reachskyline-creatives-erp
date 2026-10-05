const express = require('express');
const router = express.Router();
const campaignRunController = require('../controllers/campaignRunController');
const { requireManagerOrAdmin } = require('../middlewares/auth');

// Options metadata (clients, campaign managers, campaign employees)
router.get('/meta/options', requireManagerOrAdmin, campaignRunController.getMetaOptions);

// List campaign runs (scoped based on role)
router.get('/', campaignRunController.list);

// Get single campaign run
router.get('/:id', campaignRunController.getById);

// Create new campaign run (Admin / Manager)
router.post('/', requireManagerOrAdmin, campaignRunController.create);

// Campaign Manager review, budget & assignment
router.put('/:id/manager-review', requireManagerOrAdmin, campaignRunController.managerReview);

// Status updates (Employee, Manager, or Admin)
router.put('/:id/status', campaignRunController.updateStatus);

// Admin general update
router.put('/:id/admin-update', requireManagerOrAdmin, campaignRunController.adminUpdate);

// Delete campaign run (Admin)
router.delete('/:id', requireManagerOrAdmin, campaignRunController.delete);

module.exports = router;
