const activityTypesService = require('../services/activityTypesService');

class ActivityTypesController {
  async listActivityTypes(req, res, next) {
    try {
      const data = await activityTypesService.listActivityTypes();
      res.status(200).json({
        success: true,
        message: 'Activity types list retrieved successfully.',
        data,
        errors: []
      });
    } catch (error) {
      next(error);
    }
  }

  async createActivityType(req, res, next) {
    try {
      const id = await activityTypesService.createActivityType(req.body);
      res.status(201).json({
        success: true,
        message: 'Activity type created successfully.',
        data: { id },
        errors: []
      });
    } catch (error) {
      next(error);
    }
  }

  async updateActivityType(req, res, next) {
    try {
      const { id } = req.params;
      await activityTypesService.updateActivityType(id, req.body);
      res.status(200).json({
        success: true,
        message: 'Activity type updated successfully.',
        data: null,
        errors: []
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteActivityType(req, res, next) {
    try {
      const { id } = req.params;
      await activityTypesService.deleteActivityType(id);
      res.status(200).json({
        success: true,
        message: 'Activity type deleted successfully.',
        data: null,
        errors: []
      });
    } catch (error) {
      next(error);
    }
  }

  async syncActivityTypes(req, res, next) {
    try {
      const { url } = req.body;
      if (!url) {
        return res.status(400).json({
          success: false,
          message: 'Google Sheets URL is required.',
          data: null,
          errors: ['Validation error']
        });
      }
      const data = await activityTypesService.syncActivityTypes(url);
      res.status(200).json({
        success: true,
        message: `Successfully synchronized ${data.length} activity types from Google Sheets.`,
        data,
        errors: []
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ActivityTypesController();
