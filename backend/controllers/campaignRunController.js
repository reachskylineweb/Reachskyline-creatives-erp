const campaignRunService = require('../services/campaignRunService');

class CampaignRunController {
  async list(req, res, next) {
    try {
      const filters = {
        clientId: req.query.client_id ? Number(req.query.client_id) : undefined,
        platform: req.query.platform || undefined,
        status: req.query.status || undefined,
        campaignType: req.query.campaign_type || undefined,
        searchQuery: req.query.q || undefined
      };

      const result = await campaignRunService.listCampaignRuns(req.user, filters);
      res.status(200).json({
        success: true,
        message: 'Campaign runs retrieved.',
        data: result,
        errors: []
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const data = await campaignRunService.getCampaignRunById(Number(id));
      res.status(200).json({
        success: true,
        message: 'Campaign run details retrieved.',
        data,
        errors: []
      });
    } catch (error) {
      next(error);
    }
  }

  async getMetaOptions(req, res, next) {
    try {
      const data = await campaignRunService.getMetaOptions();
      res.status(200).json({
        success: true,
        message: 'Meta options retrieved.',
        data,
        errors: []
      });
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const adminUserId = req.user.id;
      const campaignId = await campaignRunService.createCampaignRun(adminUserId, req.body);
      const data = await campaignRunService.getCampaignRunById(campaignId);

      res.status(201).json({
        success: true,
        message: 'Campaign Run created successfully and routed to Campaign Manager.',
        data,
        errors: []
      });
    } catch (error) {
      next(error);
    }
  }

  async managerReview(req, res, next) {
    try {
      const managerUserId = req.user.id;
      const { id } = req.params;
      const data = await campaignRunService.managerReview(managerUserId, Number(id), req.body);

      res.status(200).json({
        success: true,
        message: 'Campaign Manager review and assignment updated successfully.',
        data,
        errors: []
      });
    } catch (error) {
      next(error);
    }
  }

  async updateStatus(req, res, next) {
    try {
      const userId = req.user.id;
      const { id } = req.params;
      const data = await campaignRunService.updateStatus(userId, Number(id), req.body);

      res.status(200).json({
        success: true,
        message: 'Campaign Run status updated successfully.',
        data,
        errors: []
      });
    } catch (error) {
      next(error);
    }
  }

  async adminUpdate(req, res, next) {
    try {
      const adminUserId = req.user.id;
      const { id } = req.params;
      const data = await campaignRunService.adminUpdate(adminUserId, Number(id), req.body);

      res.status(200).json({
        success: true,
        message: 'Campaign Run updated successfully.',
        data,
        errors: []
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const adminUserId = req.user.id;
      const { id } = req.params;
      await campaignRunService.deleteCampaignRun(adminUserId, Number(id));

      res.status(200).json({
        success: true,
        message: 'Campaign Run deleted successfully.',
        data: null,
        errors: []
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new CampaignRunController();
