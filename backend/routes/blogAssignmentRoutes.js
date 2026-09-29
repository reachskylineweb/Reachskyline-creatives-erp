const express = require('express');
const router = express.Router();
const blogAssignmentController = require('../controllers/blogAssignmentController');
const { authenticateToken, requireAdmin } = require('../middlewares/auth');

router.use(authenticateToken);

// Admin endpoints
router.get('/clients', requireAdmin, blogAssignmentController.getClients);
router.get('/managers', requireAdmin, blogAssignmentController.getManagers);
router.post('/assign', requireAdmin, blogAssignmentController.assign);
router.post('/unassign', requireAdmin, blogAssignmentController.unassign);
router.post('/job-work', requireAdmin, blogAssignmentController.createJobWork);
router.get('/job-work/admin', requireAdmin, blogAssignmentController.getJobWorksForAdmin);

// Manager endpoints
router.get('/my-clients', blogAssignmentController.getMyAssignedClients);
router.get('/job-work/manager', blogAssignmentController.getJobWorksForManager);
router.post('/job-work/:id/assign', blogAssignmentController.assignJobWorkToEmployee);

module.exports = router;
