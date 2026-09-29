const contentWorkService = require('../services/contentWorkService');

class ContentWorkController {
  // --- Content Calendar endpoints ---

  async getAssignedContentCalendar(req, res, next) {
    try {
      const userId = req.user.id;
      const { month } = req.query;
      if (!month) {
        return res.status(400).json({ success: false, message: 'Month is required.' });
      }
      const data = await contentWorkService.getAssignedContentCalendar(userId, month);
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  async saveContentCalendarLink(req, res, next) {
    try {
      const userId = req.user.id;
      const { id } = req.params;
      const { work_link } = req.body;
      await contentWorkService.saveContentCalendarLink(id, userId, work_link);
      res.status(200).json({ success: true, message: 'Link saved successfully.' });
    } catch (error) {
      next(error);
    }
  }

  async submitContentCalendar(req, res, next) {
    try {
      const userId = req.user.id;
      const { id } = req.params;
      const { work_link } = req.body;
      await contentWorkService.submitContentCalendar(id, userId, work_link);
      res.status(200).json({ success: true, message: 'Submitted successfully.' });
    } catch (error) {
      next(error);
    }
  }

  async startContentCalendar(req, res, next) {
    try {
      const userId = req.user.id;
      const { id } = req.params;
      await contentWorkService.startContentCalendar(id, userId);
      res.status(200).json({ success: true, message: 'Started successfully.' });
    } catch (error) {
      next(error);
    }
  }

  async submitAllContentCalendar(req, res, next) {
    try {
      const userId = req.user.id;
      const { month } = req.body;
      if (!month) {
        return res.status(400).json({ success: false, message: 'Month is required.' });
      }
      await contentWorkService.submitAllContentCalendar(userId, month);
      res.status(200).json({ success: true, message: 'All items submitted successfully.' });
    } catch (error) {
      next(error);
    }
  }

  // --- Event Days endpoints ---

  async getAssignedEventDays(req, res, next) {
    try {
      const userId = req.user.id;
      const { month } = req.query;
      if (!month) {
        return res.status(400).json({ success: false, message: 'Month is required.' });
      }
      const data = await contentWorkService.getAssignedEventDays(userId, month);
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  async saveEventDayLink(req, res, next) {
    try {
      const userId = req.user.id;
      const { id } = req.params;
      const { work_link } = req.body;
      await contentWorkService.saveEventDayLink(id, userId, work_link);
      res.status(200).json({ success: true, message: 'Link saved successfully.' });
    } catch (error) {
      next(error);
    }
  }

  async submitEventDay(req, res, next) {
    try {
      const userId = req.user.id;
      const { id } = req.params;
      const { work_link } = req.body;
      await contentWorkService.submitEventDay(id, userId, work_link);
      res.status(200).json({ success: true, message: 'Submitted successfully.' });
    } catch (error) {
      next(error);
    }
  }

  async startEventDay(req, res, next) {
    try {
      const userId = req.user.id;
      const { id } = req.params;
      await contentWorkService.startEventDay(id, userId);
      res.status(200).json({ success: true, message: 'Started successfully.' });
    } catch (error) {
      next(error);
    }
  }

  async submitAllEventDays(req, res, next) {
    try {
      const userId = req.user.id;
      const { month } = req.body;
      if (!month) {
        return res.status(400).json({ success: false, message: 'Month is required.' });
      }
      await contentWorkService.submitAllEventDays(userId, month);
      res.status(200).json({ success: true, message: 'All event days submitted successfully.' });
    } catch (error) {
      next(error);
    }
  }

  // --- Shoot Scripts endpoints ---

  async getAssignedShootScripts(req, res, next) {
    try {
      const userId = req.user.id;
      const { month } = req.query;
      if (!month) {
        return res.status(400).json({ success: false, message: 'Month is required.' });
      }
      const data = await contentWorkService.getAssignedShootScripts(userId, month);
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  async saveShootScriptLink(req, res, next) {
    try {
      const userId = req.user.id;
      const { id } = req.params;
      const { work_link } = req.body;
      await contentWorkService.saveShootScriptLink(id, userId, work_link);
      res.status(200).json({ success: true, message: 'Link saved successfully.' });
    } catch (error) {
      next(error);
    }
  }

  async submitShootScript(req, res, next) {
    try {
      const userId = req.user.id;
      const { id } = req.params;
      const { work_link } = req.body;
      await contentWorkService.submitShootScript(id, userId, work_link);
      res.status(200).json({ success: true, message: 'Submitted successfully.' });
    } catch (error) {
      next(error);
    }
  }

  async startShootScript(req, res, next) {
    try {
      const userId = req.user.id;
      const { id } = req.params;
      await contentWorkService.startShootScript(id, userId);
      res.status(200).json({ success: true, message: 'Started successfully.' });
    } catch (error) {
      next(error);
    }
  }

  async submitAllShootScripts(req, res, next) {
    try {
      const userId = req.user.id;
      const { month } = req.body;
      if (!month) {
        return res.status(400).json({ success: false, message: 'Month is required.' });
      }
      await contentWorkService.submitAllShootScripts(userId, month);
      res.status(200).json({ success: true, message: 'All shoot scripts submitted successfully.' });
    } catch (error) {
      next(error);
    }
  }

  // --- Manager Shoot Scripts CRUD ---

  async getShootScriptsManaged(req, res, next) {
    try {
      const userId = req.user.id;
      const { month } = req.query;
      if (!month) {
        return res.status(400).json({ success: false, message: 'Month is required.' });
      }
      const data = await contentWorkService.getShootScriptsManaged(userId, month);
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  async createShootScript(req, res, next) {
    try {
      const userId = req.user.id;
      const id = await contentWorkService.createShootScript(req.body, userId);
      res.status(201).json({ success: true, data: { id }, message: 'Shoot script assigned successfully.' });
    } catch (error) {
      next(error);
    }
  }

  async deleteShootScript(req, res, next) {
    try {
      const userId = req.user.id;
      const { id } = req.params;
      await contentWorkService.deleteShootScript(id, userId);
      res.status(200).json({ success: true, message: 'Shoot script deleted successfully.' });
    } catch (error) {
      next(error);
    }
  }

  // --- Manager Review Submissions ---

  async getManagerSubmissions(req, res, next) {
    try {
      const data = await contentWorkService.getManagerSubmissions();
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  async reviewItem(req, res, next) {
    try {
      const userId = req.user.id;
      const { itemType, itemId, action, feedback, voiceNote } = req.body;
      if (!itemType || !itemId || !action) {
        return res.status(400).json({ success: false, message: 'itemType, itemId, and action are required.' });
      }
      await contentWorkService.reviewItem(itemType, itemId, action, feedback, voiceNote, userId);
      res.status(200).json({ success: true, message: 'Submissions reviewed successfully.' });
    } catch (error) {
      next(error);
    }
  }

  async getReassignedContentWork(req, res, next) {
    try {
      const userId = req.user.id;
      const data = await contentWorkService.getReassignedContentWork(userId);
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  async getApprovedContentWork(req, res, next) {
    try {
      const userId = req.user.id;
      const data = await contentWorkService.getApprovedContentWork(userId);
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  async getUnassignedCalendarItems(req, res, next) {
    try {
      const { month } = req.query;
      if (!month) {
        return res.status(400).json({ success: false, message: 'Month is required.' });
      }
      const data = await contentWorkService.getUnassignedCalendarItems(month);
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  async assignWriters(req, res, next) {
    try {
      await contentWorkService.assignWriters(req.body);
      res.status(200).json({ success: true, message: 'Writers successfully assigned.' });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ContentWorkController();
