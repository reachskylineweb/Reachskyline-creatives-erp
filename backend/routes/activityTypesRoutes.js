const express = require('express');
const router = express.Router();
const activityTypesController = require('../controllers/activityTypesController');

const { requireAdmin } = require('../middlewares/auth');

router.get('/', activityTypesController.listActivityTypes);
router.post('/', requireAdmin, activityTypesController.createActivityType);
router.put('/:id', requireAdmin, activityTypesController.updateActivityType);
router.delete('/:id', requireAdmin, activityTypesController.deleteActivityType);
router.post('/sync', requireAdmin, activityTypesController.syncActivityTypes);

module.exports = router;
