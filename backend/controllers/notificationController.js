const notificationService = require('../services/notificationService');

class NotificationController {
  async list(req, res, next) {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit, 10) : 50;
      const userId = req.user ? req.user.id : null;
      const userRole = req.user ? req.user.role : null;
      const notifications = await notificationService.listNotifications(userId, userRole, limit);
      res.status(200).json({
        success: true,
        message: 'Notifications retrieved successfully.',
        data: { notifications },
        errors: []
      });
    } catch (error) {
      next(error);
    }
  }

  async markRead(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user ? req.user.id : null;
      await notificationService.markNotificationRead(id, userId);
      res.status(200).json({
        success: true,
        message: 'Notification marked as read.',
        data: null,
        errors: []
      });
    } catch (error) {
      next(error);
    }
  }

  async markAllRead(req, res, next) {
    try {
      const userId = req.user ? req.user.id : null;
      await notificationService.markAllNotificationsRead(userId);
      res.status(200).json({
        success: true,
        message: 'All notifications marked as read.',
        data: null,
        errors: []
      });
    } catch (error) {
      next(error);
    }
  }

  async subscribe(req, res, next) {
    try {
      const { subscriptionId } = req.body;
      const userId = req.user.id;

      if (!subscriptionId) {
        return res.status(400).json({
          success: false,
          message: 'Subscription ID is required.',
          data: null,
          errors: ['Subscription ID is required.']
        });
      }

      await notificationService.subscribePush(userId, subscriptionId);
      res.status(200).json({
        success: true,
        message: 'Subscribed to push notifications successfully.',
        data: null,
        errors: []
      });
    } catch (error) {
      next(error);
    }
  }

  async unsubscribe(req, res, next) {
    try {
      const { subscriptionId } = req.body;
      const userId = req.user.id;

      if (!subscriptionId) {
        return res.status(400).json({
          success: false,
          message: 'Subscription ID is required.',
          data: null,
          errors: ['Subscription ID is required.']
        });
      }

      await notificationService.unsubscribePush(userId, subscriptionId);
      res.status(200).json({
        success: true,
        message: 'Unsubscribed from push notifications.',
        data: null,
        errors: []
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new NotificationController();
