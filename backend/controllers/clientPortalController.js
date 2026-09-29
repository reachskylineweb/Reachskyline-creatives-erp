const clientPortalService = require('../services/clientPortalService');

class ClientPortalController {
  async getProfile(req, res, next) {
    try {
      const userId = req.user.id;
      const profile = await clientPortalService.getClientProfile(userId);

      res.status(200).json({
        success: true,
        message: 'Client profile retrieved successfully.',
        data: { profile },
        errors: []
      });
    } catch (error) {
      next(error);
    }
  }

  async getApprovals(req, res, next) {
    try {
      const userId = req.user.id;
      const profile = await clientPortalService.getClientProfile(userId);
      const approvals = await clientPortalService.getClientApprovals(profile.id);

      res.status(200).json({
        success: true,
        message: 'Client approvals retrieved successfully.',
        data: { approvals },
        errors: []
      });
    } catch (error) {
      next(error);
    }
  }

  async submitApprovalAction(req, res, next) {
    try {
      const userId = req.user.id;
      const { status, remarks } = req.body;
      const approvalId = req.params.id;

      if (!status || !['approved', 'rejected'].includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid status. Must be "approved" or "rejected".',
          data: null,
          errors: ['Validation error']
        });
      }

      const profile = await clientPortalService.getClientProfile(userId);
      const approvedBy = profile.client_name || 'Client';

      await clientPortalService.submitApprovalAction(approvalId, profile.id, status, remarks, approvedBy);

      res.status(200).json({
        success: true,
        message: `Approval request was successfully ${status}.`,
        data: null,
        errors: []
      });
    } catch (error) {
      next(error);
    }
  }

  async getSentReports(req, res, next) {
    try {
      const userId = req.user.id;
      const profile = await clientPortalService.getClientProfile(userId);
      const reports = await clientPortalService.getSentReports(profile.id);

      res.status(200).json({
        success: true,
        message: 'Client sent reports list retrieved successfully.',
        data: { reports },
        errors: []
      });
    } catch (error) {
      next(error);
    }
  }

  async getReportDetail(req, res, next) {
    try {
      const userId = req.user.id;
      const { month } = req.query;

      if (!month) {
        return res.status(400).json({
          success: false,
          message: 'Month query parameter is required.',
          data: null,
          errors: ['Validation error']
        });
      }

      const profile = await clientPortalService.getClientProfile(userId);
      const data = await clientPortalService.getReportDetail(profile.id, month);

      res.status(200).json({
        success: true,
        message: 'Monthly report details retrieved successfully.',
        data,
        errors: []
      });
    } catch (error) {
      next(error);
    }
  }

  async getClientDeliverables(req, res, next) {
    try {
      const userId = req.user.id;
      const profile = await clientPortalService.getClientProfile(userId);
      const deliverables = await clientPortalService.getClientDeliverables(profile.id);

      res.status(200).json({
        success: true,
        message: 'Client deliverables retrieved successfully.',
        data: { deliverables },
        errors: []
      });
    } catch (error) {
      next(error);
    }
  }

  async submitDeliverableReview(req, res, next) {
    try {
      const userId = req.user.id;
      const { id } = req.params;
      const { action, feedbackText, voiceBase64, voiceNote } = req.body;

      if (!action || !['approve', 'rework'].includes(action)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid action. Must be "approve" or "rework".',
          data: null,
          errors: ['Validation error']
        });
      }

      const profile = await clientPortalService.getClientProfile(userId);
      await clientPortalService.submitDeliverableReview(id, profile.id, action, feedbackText, voiceBase64 || voiceNote);

      res.status(200).json({
        success: true,
        message: `Deliverable review successfully submitted: ${action}.`,
        data: null,
        errors: []
      });
    } catch (error) {
      next(error);
    }
  }

  async getClientJobWorks(req, res, next) {
    try {
      const userId = req.user.id;
      const profile = await clientPortalService.getClientProfile(userId);
      const jobWorks = await clientPortalService.getClientJobWorks(profile.id);

      res.status(200).json({
        success: true,
        message: 'Client Job Works retrieved successfully.',
        data: { jobWorks },
        errors: []
      });
    } catch (error) {
      next(error);
    }
  }

  async submitJobWorkReview(req, res, next) {
    try {
      const userId = req.user.id;
      const { id } = req.params;
      const { action, feedbackText, voiceBase64, voiceNote } = req.body;

      if (!action || !['approve', 'rework'].includes(action)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid action. Must be "approve" or "rework".',
          data: null,
          errors: ['Validation error']
        });
      }

      const profile = await clientPortalService.getClientProfile(userId);
      await clientPortalService.submitJobWorkReview(id, profile.id, action, feedbackText, voiceBase64 || voiceNote);

      res.status(200).json({
        success: true,
        message: `Job Work review successfully submitted: ${action}.`,
        data: null,
        errors: []
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ClientPortalController();
