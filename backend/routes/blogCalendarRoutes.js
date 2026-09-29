const express = require('express');
const router = express.Router();
const blogCalendarController = require('../controllers/blogCalendarController');

const { authenticateToken, requireManagerOrAdmin } = require('../middlewares/auth');

router.use(authenticateToken);

router.get('/', blogCalendarController.getCalendar);
router.post('/', requireManagerOrAdmin, blogCalendarController.createCalendarItem);
router.post('/bulk-create', requireManagerOrAdmin, blogCalendarController.bulkCreateCalendarItems);
router.post('/send-to-seo', requireManagerOrAdmin, blogCalendarController.sendToSeoTeam);
router.put('/:id/assign', requireManagerOrAdmin, blogCalendarController.assignEmployee);
router.put('/:id', requireManagerOrAdmin, blogCalendarController.updateCalendarItem);
router.delete('/:id', requireManagerOrAdmin, blogCalendarController.deleteCalendarItem);
router.delete('/month/:month', requireManagerOrAdmin, blogCalendarController.deleteCalendarMonth);

module.exports = router;
