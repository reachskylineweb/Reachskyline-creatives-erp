const express = require('express');
const router = express.Router();
const contentWorkController = require('../controllers/contentWorkController');
const { authenticateToken, requireManagerOrAdmin } = require('../middlewares/auth');

router.use(authenticateToken);

// --- Content Calendar Submissions ---
router.get('/assigned-content-calendar', contentWorkController.getAssignedContentCalendar);
router.put('/assigned-content-calendar/:id/link', contentWorkController.saveContentCalendarLink);
router.post('/assigned-content-calendar/:id/submit', contentWorkController.submitContentCalendar);
router.post('/assigned-content-calendar/:id/start', contentWorkController.startContentCalendar);
router.post('/assigned-content-calendar/submit-all', contentWorkController.submitAllContentCalendar);

// --- Event Days Calendar Submissions ---
router.get('/assigned-event-days', contentWorkController.getAssignedEventDays);
router.put('/assigned-event-days/:id/link', contentWorkController.saveEventDayLink);
router.post('/assigned-event-days/:id/submit', contentWorkController.submitEventDay);
router.post('/assigned-event-days/:id/start', contentWorkController.startEventDay);
router.post('/assigned-event-days/submit-all', contentWorkController.submitAllEventDays);

// --- Shoot Scripts Submissions ---
router.get('/assigned-shoot-scripts', contentWorkController.getAssignedShootScripts);
router.put('/assigned-shoot-scripts/:id/link', contentWorkController.saveShootScriptLink);
router.post('/assigned-shoot-scripts/:id/submit', contentWorkController.submitShootScript);
router.post('/assigned-shoot-scripts/:id/start', contentWorkController.startShootScript);
router.post('/assigned-shoot-scripts/submit-all', contentWorkController.submitAllShootScripts);

// --- Manager Shoot Scripts CRUD ---
router.get('/shoot-scripts', requireManagerOrAdmin, contentWorkController.getShootScriptsManaged);
router.post('/shoot-scripts', requireManagerOrAdmin, contentWorkController.createShootScript);
router.delete('/shoot-scripts/:id', requireManagerOrAdmin, contentWorkController.deleteShootScript);

// --- Manager Review endpoints ---
router.get('/submissions', requireManagerOrAdmin, contentWorkController.getManagerSubmissions);
router.post('/review', requireManagerOrAdmin, contentWorkController.reviewItem);

// --- Employee Reassigned / Approved Content Work ---
router.get('/reassigned', contentWorkController.getReassignedContentWork);
router.get('/approved', contentWorkController.getApprovedContentWork);

// --- Manager Manual Assignment Endpoints ---
router.get('/unassigned-calendar', requireManagerOrAdmin, contentWorkController.getUnassignedCalendarItems);
router.post('/assign-writers', requireManagerOrAdmin, contentWorkController.assignWriters);

module.exports = router;
