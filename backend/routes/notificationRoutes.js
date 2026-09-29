const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');

router.get('/', notificationController.list);
router.patch('/:id/read', notificationController.markRead);
router.post('/read-all', notificationController.markAllRead);
router.post('/subscribe', notificationController.subscribe);
router.post('/unsubscribe', notificationController.unsubscribe);

module.exports = router;
