const express = require('express');
const router = express.Router();
const eventDayController = require('../controllers/eventDayController');
const { authenticateToken } = require('../middlewares/auth');

router.use(authenticateToken);

router.get('/', eventDayController.getEvents);
router.post('/', eventDayController.createEvent);
router.put('/:id', eventDayController.updateEvent);
router.delete('/:id', eventDayController.deleteEvent);
router.post('/send-to-manager', eventDayController.sendToManager);
router.post('/send-to-employee', eventDayController.sendToEmployee);
router.get('/:id/clients', eventDayController.getEventClientDeliverables);
router.post('/:id/clients', eventDayController.saveEventClientDeliverables);

module.exports = router;
