const express = require('express');
const router = express.Router();
const clientPortalController = require('../controllers/clientPortalController');
const { authenticateToken, requireClient } = require('../middlewares/auth');

router.use(authenticateToken);
router.use(requireClient);

router.get('/profile', clientPortalController.getProfile);
router.get('/approvals', clientPortalController.getApprovals);
router.post('/approvals/:id/action', clientPortalController.submitApprovalAction);
router.get('/reports', clientPortalController.getSentReports);
router.get('/reports/detail', clientPortalController.getReportDetail);

// Deliverable reviews (supports both PUT and POST to bypass CORS preflight restrictions)
router.get('/deliverables', clientPortalController.getClientDeliverables);
router.put('/deliverables/:id/review', clientPortalController.submitDeliverableReview);
router.post('/deliverables/:id/review', clientPortalController.submitDeliverableReview);

// Job work reviews (supports both PUT and POST to bypass CORS preflight restrictions)
router.get('/job-works', clientPortalController.getClientJobWorks);
router.put('/job-works/:id/review', clientPortalController.submitJobWorkReview);
router.post('/job-works/:id/review', clientPortalController.submitJobWorkReview);

module.exports = router;