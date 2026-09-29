const express = require('express');
const router = express.Router();
const deliverableController = require('../controllers/deliverableController');
const { validateDeliverable, validateTemplate } = require('../validators/schemas');

const { requireAdmin, requireManagerOrAdmin, authenticateToken } = require('../middlewares/auth');

// Enforce authentication on all deliverable routes
router.use(authenticateToken);

// --- Monthly Grid Routes ---
router.get('/grid', requireAdmin, deliverableController.getMonthlyGrid);
router.post('/grid', requireAdmin, deliverableController.saveMonthlyGrid);
router.post('/grid/generate-calendar', requireAdmin, deliverableController.generateCalendarFromGrid);
router.get('/blog-grid', requireAdmin, deliverableController.getMonthlyBlogsGrid);
router.post('/blog-grid', requireAdmin, deliverableController.saveMonthlyBlogsGrid);
router.post('/blog-grid/generate-calendar', requireAdmin, deliverableController.generateBlogCalendarFromGrid);

// --- Job Work Routes ---
router.get('/job-work', requireAdmin, deliverableController.getJobWorks);
router.post('/job-work', requireAdmin, deliverableController.createJobWork);
router.get('/job-work/manager', requireManagerOrAdmin, deliverableController.getJobWorksByManager);
router.post('/job-work/:id/complete', requireManagerOrAdmin, deliverableController.completeJobWork);
router.put('/job-work/:id/complete', requireManagerOrAdmin, deliverableController.completeJobWork);
router.post('/job-work/:id/assign', requireManagerOrAdmin, deliverableController.assignJobWork);
router.put('/job-work/:id/assign', requireManagerOrAdmin, deliverableController.assignJobWork);
router.post('/job-work/:id/submit', authenticateToken, deliverableController.submitJobWork);
router.put('/job-work/:id/submit', authenticateToken, deliverableController.submitJobWork);
router.post('/job-work/:id/start', authenticateToken, deliverableController.startJobWork);
router.put('/job-work/:id/start', authenticateToken, deliverableController.startJobWork);
router.post('/job-work/:id/review', requireManagerOrAdmin, deliverableController.reviewJobWork);
router.put('/job-work/:id/review', requireManagerOrAdmin, deliverableController.reviewJobWork);
router.post('/job-work/:id/client-review', authenticateToken, deliverableController.clientReviewJobWork);
router.put('/job-work/:id/client-review', authenticateToken, deliverableController.clientReviewJobWork);
router.get('/job-work/:id/history', authenticateToken, deliverableController.getJobWorkHistory);
router.get('/job-work/employee', authenticateToken, deliverableController.getEmployeeJobWorks);
router.get('/job-work/client', authenticateToken, deliverableController.getClientJobWorks);
router.get('/job-work/client-rework', requireManagerOrAdmin, deliverableController.getClientReworkJobWorks);

// --- Bulk Actions ---
router.post('/bulk-delete', requireAdmin, deliverableController.bulkDelete);
router.post('/bulk-status', requireManagerOrAdmin, deliverableController.bulkUpdateStatus);

// --- Automated Generation ---
router.post('/generate', requireAdmin, deliverableController.generateFromTemplate);

// --- Template Routes ---
router.get('/templates', requireManagerOrAdmin, deliverableController.listTemplates);
router.get('/templates/:id', requireManagerOrAdmin, deliverableController.getTemplate);
router.post('/templates', requireAdmin, validateTemplate, deliverableController.createTemplate);
router.put('/templates/:id', requireAdmin, validateTemplate, deliverableController.updateTemplate);
router.delete('/templates/:id', requireAdmin, deliverableController.deleteTemplate);

// --- Employee/Manager Workflow Routes ---
router.get('/admin-updates', requireManagerOrAdmin, deliverableController.getAdminWorkUpdates);
router.get('/admin-updates/work', requireManagerOrAdmin, deliverableController.getAdminWorkUpdates);
router.get('/employee/today', authenticateToken, deliverableController.getEmployeeTodayDeliverables);
router.get('/employee/rework', authenticateToken, deliverableController.getEmployeeReworkQueue);
router.get('/employee/all', authenticateToken, deliverableController.getEmployeeAllDeliverables);
router.post('/:id/assign', requireManagerOrAdmin, deliverableController.assignDeliverableWork);
router.put('/:id/assign', requireManagerOrAdmin, deliverableController.assignDeliverableWork);
router.post('/:id/submit', authenticateToken, deliverableController.submitDeliverableWork);
router.put('/:id/submit', authenticateToken, deliverableController.submitDeliverableWork);
router.post('/:id/start', authenticateToken, deliverableController.startDeliverableWork);
router.put('/:id/start', authenticateToken, deliverableController.startDeliverableWork);
router.post('/:id/review', requireManagerOrAdmin, deliverableController.reviewDeliverableWork);
router.put('/:id/review', requireManagerOrAdmin, deliverableController.reviewDeliverableWork);
router.post('/:id/client-review', authenticateToken, deliverableController.clientReviewDeliverableWork);
router.put('/:id/client-review', authenticateToken, deliverableController.clientReviewDeliverableWork);
router.post('/:id/manager-client-review', requireManagerOrAdmin, deliverableController.managerClientReviewDeliverableWork);
router.put('/:id/manager-client-review', requireManagerOrAdmin, deliverableController.managerClientReviewDeliverableWork);

// --- Generic Deliverable Wildcards at the Bottom ---
router.get('/', authenticateToken, deliverableController.listDeliverables);
router.get('/:id', requireManagerOrAdmin, deliverableController.getDeliverable);
router.post('/', requireManagerOrAdmin, validateDeliverable, deliverableController.createDeliverable);
router.put('/:id', requireManagerOrAdmin, validateDeliverable, deliverableController.updateDeliverable);
router.delete('/:id', requireAdmin, deliverableController.deleteDeliverable);
router.post('/:id/status', authenticateToken, deliverableController.changeDeliverableStatus);
router.patch('/:id/status', authenticateToken, deliverableController.changeDeliverableStatus);

module.exports = router;