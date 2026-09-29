const express = require('express');
const router = express.Router();
const calendarController = require('../controllers/calendarController');

const { authenticateToken, requireAdmin, requireManagerOrAdmin } = require('../middlewares/auth');

router.use(authenticateToken);

router.get('/', calendarController.getCalendar);
router.post('/', requireManagerOrAdmin, calendarController.createCalendarItem);
router.post('/generate', requireManagerOrAdmin, calendarController.generateCalendar);
router.put('/:id', requireManagerOrAdmin, calendarController.updateCalendarItem);
router.delete('/:id', requireManagerOrAdmin, calendarController.deleteCalendarItem);
router.delete('/month/:month', requireManagerOrAdmin, calendarController.deleteCalendarMonth);
router.post('/approve', requireManagerOrAdmin, calendarController.approveCalendar);
router.post('/send-manager', requireManagerOrAdmin, calendarController.sendCalendarToManager);
router.post('/send-employees', requireManagerOrAdmin, calendarController.sendCalendarToEmployees);
router.post('/set-draft', requireManagerOrAdmin, calendarController.setCalendarToDraft);
router.get('/skip-dates', calendarController.getSkipDates);
router.post('/skip-dates', requireAdmin, calendarController.saveSkipDates);

module.exports = router;
