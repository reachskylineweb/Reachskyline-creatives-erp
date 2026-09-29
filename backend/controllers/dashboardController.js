const dashboardService = require('../services/dashboardService');

class DashboardController {
  async getSummary(req, res, next) {
    try {
      const data = await dashboardService.getDashboardSummary();
      res.status(200).json({
        success: true,
        message: 'Dashboard summary metrics retrieved.',
        data,
        errors: []
      });
    } catch (error) {
      next(error);
    }
  }

  async getCharts(req, res, next) {
    try {
      const data = await dashboardService.getDashboardCharts();
      res.status(200).json({
        success: true,
        message: 'Dashboard analytics charts data retrieved.',
        data,
        errors: []
      });
    } catch (error) {
      next(error);
    }
  }

  async exportReport(req, res, next) {
    try {
      const { type, format } = req.query;
      
      if (!type) {
        return res.status(400).json({
          success: false,
          message: 'Report type is required (e.g. client, employee, project, deliverables, daily, weekly, monthly).',
          data: null,
          errors: ['Validation error']
        });
      }

      const { csv, data } = await dashboardService.generateReport(req.query);

      if (format === 'csv') {
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename=report_${type}_${new Date().toISOString().split('T')[0]}.csv`);
        return res.status(200).send(csv);
      }

      // Default to JSON response format if format is not specified or set to json/excel
      res.status(200).json({
        success: true,
        message: `Report for type "${type}" generated.`,
        data: { report: data },
        errors: []
      });
    } catch (error) {
      next(error);
    }
  }

  async sendClientReport(req, res, next) {
    try {
      const { clientId, month } = req.body;
      const adminUserId = req.user.id;

      if (!clientId || !month) {
        return res.status(400).json({
          success: false,
          message: 'Client ID and Month are required.',
          data: null,
          errors: ['Validation error']
        });
      }

      await dashboardService.sendClientReport(clientId, month, adminUserId);

      res.status(200).json({
        success: true,
        message: 'Monthly report successfully sent to the client portal.',
        data: null,
        errors: []
      });
    } catch (error) {
      next(error);
    }
  }

  async sendSuperAdminReport(req, res, next) {
    try {
      const { reportType, title, monthOrRange, reportData } = req.body;
      const adminUserId = req.user.id;

      if (!reportType || !title || !monthOrRange || !reportData) {
        return res.status(400).json({
          success: false,
          message: 'Report parameters are incomplete.',
          data: null,
          errors: ['Validation error']
        });
      }

      await dashboardService.sendSuperAdminReport({
        reportType,
        title,
        monthOrRange,
        reportData: JSON.stringify(reportData),
        sentBy: adminUserId
      });

      res.status(200).json({
        success: true,
        message: 'Report successfully submitted to the superadmin.',
        data: null,
        errors: []
      });
    } catch (error) {
      next(error);
    }
  }

  async getSuperAdminReportsList(req, res, next) {
    try {
      const list = await dashboardService.getSuperAdminReportsList();
      res.status(200).json({
        success: true,
        message: 'Superadmin reports list retrieved successfully.',
        data: { reports: list },
        errors: []
      });
    } catch (error) {
      next(error);
    }
  }

  async getSuperAdminReportDetail(req, res, next) {
    try {
      const reportId = req.params.id;
      const report = await dashboardService.getSuperAdminReportDetail(reportId);
      res.status(200).json({
        success: true,
        message: 'Superadmin report details retrieved successfully.',
        data: { report },
        errors: []
      });
    } catch (error) {
      next(error);
    }
  }

  async getReportsSummary(req, res, next) {
    try {
      const { month, date } = req.query;
      const data = await dashboardService.getReportsSummary({ month, date });
      res.status(200).json({
        success: true,
        message: 'Reports summary data retrieved successfully.',
        data,
        errors: []
      });
    } catch (error) {
      next(error);
    }
  }

  async getAdminMetrics(req, res, next) {
    try {
      const { date, month } = req.query;
      const data = await dashboardService.getAdminMetrics(date, month);
      res.status(200).json({
        success: true,
        message: 'Admin dashboard metrics retrieved successfully.',
        data,
        errors: []
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new DashboardController();
