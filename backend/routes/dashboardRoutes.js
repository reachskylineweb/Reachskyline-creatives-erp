const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { authenticateToken, requireAdmin } = require('../middlewares/auth');

router.use(authenticateToken);

// Endpoint-level role guards
router.get('/summary', requireAdmin, dashboardController.getSummary);
router.get('/charts', requireAdmin, dashboardController.getCharts);
router.get('/reports-summary', requireAdmin, dashboardController.getReportsSummary);
router.get('/reports/export', requireAdmin, dashboardController.exportReport);
router.post('/reports/send-client', requireAdmin, dashboardController.sendClientReport);
router.post('/reports/send-superadmin', requireAdmin, dashboardController.sendSuperAdminReport);
router.get('/reports/superadmin-list', requireAdmin, dashboardController.getSuperAdminReportsList);
router.get('/reports/superadmin-detail/:id', requireAdmin, dashboardController.getSuperAdminReportDetail);
router.get('/admin-metrics', requireAdmin, dashboardController.getAdminMetrics);

module.exports = router;
