const calendarService = require('../services/calendarService');

class CalendarController {
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
      let data = await calendarService.getCalendarByMonth(month);
      
      // If user is employee, only return items released to employees
      if (req.user.role === 'employee') {
        data = data.filter(item => item.status === 'sent_to_employees');
      }

      res.status(200).json({
        success: true,
        message: 'Content calendar retrieved successfully.',
        data,
        errors: []
      });
    } catch (error) {
      next(error);
    }
  }

  async createCalendarItem(req, res, next) {
    try {
      const id = await calendarService.createCalendarItem(req.body);
      res.status(201).json({
        success: true,
        message: 'Calendar item created successfully.',
        data: { id },
        errors: []
      });
    } catch (error) {
      next(error);
    }
  }

  async generateCalendar(req, res, next) {
    try {
      const { month, rows, skipDates } = req.body;
      const adminUserId = req.user.id;

      if (!month || !Array.isArray(rows)) {
        return res.status(400).json({
          success: false,
          message: 'Month and rows array are required.',
          data: null,
          errors: ['Validation error']
        });
      }

      console.log('GENERATE CALENDAR REQUEST:', { month, rowsCount: rows.length, skipDatesCount: skipDates ? skipDates.length : 0 });

      const data = await calendarService.generateCalendar(month, rows, adminUserId, skipDates);
      res.status(201).json({
        success: true,
        message: 'Content calendar generated successfully.',
        data,
        errors: []
      });
    } catch (error) {
      next(error);
    }
  }

  async updateCalendarItem(req, res, next) {
    try {
      const { id } = req.params;
      await calendarService.updateCalendarItem(id, req.body);
      res.status(200).json({
        success: true,
        message: 'Calendar item updated successfully.',
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
      await calendarService.deleteCalendarItem(id);
      res.status(200).json({
        success: true,
        message: 'Calendar item deleted successfully.',
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
      const adminUserId = req.user.id;
      await calendarService.deleteCalendarMonth(month, adminUserId);
      res.status(200).json({
        success: true,
        message: `Content calendar for ${month} deleted successfully.`,
        data: null,
        errors: []
      });
    } catch (error) {
      next(error);
    }
  }

  async approveCalendar(req, res, next) {
    try {
      const { month } = req.body;
      const adminUserId = req.user.id;

      if (!month) {
        return res.status(400).json({
          success: false,
          message: 'Month is required.',
          data: null,
          errors: ['Validation error']
        });
      }

      await calendarService.approveCalendar(month, adminUserId);
      res.status(200).json({
        success: true,
        message: 'Content calendar approved and deliverables successfully assigned to Graphic Design.',
        data: null,
        errors: []
      });
    } catch (error) {
      next(error);
    }
  }

  async importGoogleSheets(req, res, next) {
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
      const data = await calendarService.fetchAndParseGoogleSheets(url);
      res.status(200).json({
        success: true,
        message: 'Google Sheet imported and parsed successfully.',
        data,
        errors: []
      });
    } catch (error) {
      next(error);
    }
  }

  async sendCalendarToEmployees(req, res, next) {
    try {
      const { month } = req.body;
      const adminUserId = req.user.id;

      if (!month) {
        return res.status(400).json({
          success: false,
          message: 'Month is required.',
          data: null,
          errors: ['Validation error']
        });
      }

      await calendarService.sendCalendarToEmployees(month, adminUserId);
      res.status(200).json({
        success: true,
        message: 'Content calendar successfully sent to all employees.',
        data: null,
        errors: []
      });
    } catch (error) {
      next(error);
    }
  }

  async sendCalendarToManager(req, res, next) {
    try {
      const { month } = req.body;
      const adminUserId = req.user.id;

      if (!month) {
        return res.status(400).json({
          success: false,
          message: 'Month is required.',
          data: null,
          errors: ['Validation error']
        });
      }

      await calendarService.sendCalendarToManager(month, adminUserId);
      res.status(200).json({
        success: true,
        message: 'Content calendar successfully submitted to the Creative Manager.',
        data: null,
        errors: []
      });
    } catch (error) {
      next(error);
    }
  }

  async setCalendarToDraft(req, res, next) {
    try {
      const { month } = req.body;
      if (!month) {
        return res.status(400).json({
          success: false,
          message: 'Month is required.',
          data: null,
          errors: ['Validation error']
        });
      }
      await calendarService.setCalendarToDraft(month);
      res.status(200).json({
        success: true,
        message: 'Calendar status set to draft for editing.',
        data: null,
        errors: []
      });
    } catch (error) {
      next(error);
    }
  }

  async getSkipDates(req, res, next) {
    try {
      const { month } = req.query;
      if (!month) {
        return res.status(400).json({
          success: false,
          message: 'Parameter "month" is required.',
          data: null,
          errors: ['Validation error']
        });
      }
      const data = await calendarService.getSkipDates(month);
      res.status(200).json({
        success: true,
        message: 'Skipped dates retrieved successfully.',
        data,
        errors: []
      });
    } catch (error) {
      next(error);
    }
  }

  async saveSkipDates(req, res, next) {
    try {
      const { month, skipDates } = req.body;
      if (!month || !Array.isArray(skipDates)) {
        return res.status(400).json({
          success: false,
          message: 'Month and skipDates array are required.',
          data: null,
          errors: ['Validation error']
        });
      }
      await calendarService.saveSkipDates(month, skipDates);
      res.status(200).json({
        success: true,
        message: 'Skipped dates saved successfully.',
        data: null,
        errors: []
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new CalendarController();
