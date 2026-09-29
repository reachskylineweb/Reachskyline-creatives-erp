const eventDayService = require('../services/eventDayService');

class EventDayController {
  async getEvents(req, res, next) {
    try {
      const { month } = req.query;
      if (!month) {
        return res.status(400).json({
          success: false,
          message: 'Parameter "month" (YYYY-MM) is required.',
          data: null,
          errors: ['Validation error']
        });
      }

      const userRole = req.user.role;
      const userId = req.user.id;
      const events = await eventDayService.getEventsByMonth(month, userRole, userId);

      res.status(200).json({
        success: true,
        message: 'Event days retrieved successfully.',
        data: events,
        errors: []
      });
    } catch (error) {
      next(error);
    }
  }

  async createEvent(req, res, next) {
    try {
      const userId = req.user.id;
      const userRole = req.user.role;
      const insertId = await eventDayService.createEvent(req.body, userId, userRole);
      res.status(201).json({
        success: true,
        message: 'Event day created successfully.',
        data: { id: insertId },
        errors: []
      });
    } catch (error) {
      next(error);
    }
  }

  async updateEvent(req, res, next) {
    try {
      const { id } = req.params;
      await eventDayService.updateEvent(id, req.body, req.user.role);
      res.status(200).json({
        success: true,
        message: 'Event day updated successfully.',
        data: null,
        errors: []
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteEvent(req, res, next) {
    try {
      const { id } = req.params;
      await eventDayService.deleteEvent(id, req.user.role);
      res.status(200).json({
        success: true,
        message: 'Event day deleted successfully.',
        data: null,
        errors: []
      });
    } catch (error) {
      next(error);
    }
  }

  async sendToManager(req, res, next) {
    try {
      const { month } = req.body;
      if (!month) {
        return res.status(400).json({
          success: false,
          message: 'Parameter "month" is required.',
          data: null,
          errors: ['Validation error']
        });
      }
      const userId = req.user.id;
      await eventDayService.sendToManager(month, userId);
      res.status(200).json({
        success: true,
        message: 'Event day calendar successfully sent to manager.',
        data: null,
        errors: []
      });
    } catch (error) {
      next(error);
    }
  }

  async sendToEmployee(req, res, next) {
    try {
      const { month } = req.body;
      if (!month) {
        return res.status(400).json({
          success: false,
          message: 'Parameter "month" is required.',
          data: null,
          errors: ['Validation error']
        });
      }
      const userId = req.user.id;
      await eventDayService.sendToEmployee(month, userId);
      res.status(200).json({
        success: true,
        message: 'Event day calendar successfully sent to content writer.',
        data: null,
        errors: []
      });
    } catch (error) {
      next(error);
    }
  }
  async getEventClientDeliverables(req, res, next) {
    try {
      const { id } = req.params;
      const deliverables = await eventDayService.getEventClientDeliverables(id);
      res.status(200).json({
        success: true,
        message: 'Event day client deliverables retrieved successfully.',
        data: deliverables,
        errors: []
      });
    } catch (error) {
      next(error);
    }
  }

  async saveEventClientDeliverables(req, res, next) {
    try {
      const { id } = req.params;
      const { deliverables } = req.body;
      await eventDayService.saveEventClientDeliverables(id, deliverables);
      res.status(200).json({
        success: true,
        message: 'Event day client deliverables saved successfully.',
        data: null,
        errors: []
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new EventDayController();
