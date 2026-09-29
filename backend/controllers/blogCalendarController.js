const blogCalendarService = require('../services/blogCalendarService');

class BlogCalendarController {
  async getCalendar(req, res, next) {
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
      const data = await blogCalendarService.getCalendarByMonth(month);
      res.status(200).json({
        success: true,
        message: 'Blog calendar retrieved successfully.',
        data,
        errors: []
      });
    } catch (error) {
      next(error);
    }
  }

  async bulkCreateCalendarItems(req, res, next) {
    try {
      const createdIds = await blogCalendarService.bulkCreateCalendarItems(req.body);
      res.status(201).json({
        success: true,
        message: `${createdIds.length} blog calendar posting entries created successfully.`,
        data: { createdIds, count: createdIds.length },
        errors: []
      });
    } catch (error) {
      next(error);
    }
  }

  async assignEmployee(req, res, next) {
    try {
      const { id } = req.params;
      const { assigned_employee_id } = req.body;
      await blogCalendarService.assignEmployee(id, assigned_employee_id);
      res.status(200).json({
        success: true,
        message: 'Blog task employee assignment updated successfully.',
        data: null,
        errors: []
      });
    } catch (error) {
      next(error);
    }
  }

  async createCalendarItem(req, res, next) {
    try {
      const id = await blogCalendarService.createCalendarItem(req.body);
      res.status(201).json({
        success: true,
        message: 'Blog calendar item created successfully.',
        data: { id },
        errors: []
      });
    } catch (error) {
      next(error);
    }
  }

  async updateCalendarItem(req, res, next) {
    try {
      const { id } = req.params;
      await blogCalendarService.updateCalendarItem(id, req.body);
      res.status(200).json({
        success: true,
        message: 'Blog calendar item updated successfully.',
        data: null,
        errors: []
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteCalendarItem(req, res, next) {
    try {
      const { id } = req.params;
      await blogCalendarService.deleteCalendarItem(id);
      res.status(200).json({
        success: true,
        message: 'Blog calendar item deleted successfully.',
        data: null,
        errors: []
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteCalendarMonth(req, res, next) {
    try {
      const { month } = req.params;
      await blogCalendarService.deleteCalendarMonth(month);
      res.status(200).json({
        success: true,
        message: 'Blog calendar items for the month deleted successfully.',
        data: null,
        errors: []
      });
    } catch (error) {
      next(error);
    }
  }

  async sendToSeoTeam(req, res, next) {
    try {
      const { month } = req.body;
      if (!month) {
        return res.status(400).json({
          success: false,
          message: 'Parameter "month" (YYYY-MM) is required.',
          data: null,
          errors: ['Validation error']
        });
      }
      await blogCalendarService.sendToSeoTeam(month, req.user?.id);
      res.status(200).json({
        success: true,
        message: 'Blog calendar successfully sent to SEO team.',
        data: null,
        errors: []
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new BlogCalendarController();
