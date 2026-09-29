const clientService = require('../services/clientService');

class ClientController {
  async list(req, res, next) {
    try {
      const data = await clientService.getClients(req.query);
      res.status(200).json({
        success: true,
        message: 'Clients list retrieved successfully.',
        data,
        errors: []
      });
    } catch (error) {
      next(error);
    }
  }

  async get(req, res, next) {
    try {
      const client = await clientService.getClientById(req.params.id);
      res.status(200).json({
        success: true,
        message: 'Client details retrieved successfully.',
        data: { client },
        errors: []
      });
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const adminUserId = req.user.id;
      const result = await clientService.createClient(req.body, adminUserId);
      res.status(201).json({
        success: true,
        message: 'Client created successfully.',
        data: result,
        errors: []
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const adminUserId = req.user.id;
      await clientService.updateClient(req.params.id, req.body, adminUserId);
      res.status(200).json({
        success: true,
        message: 'Client updated successfully.',
        data: null,
        errors: []
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const adminUserId = req.user.id;
      await clientService.deleteClient(req.params.id, adminUserId);
      res.status(200).json({
        success: true,
        message: 'Client soft-deleted successfully.',
        data: null,
        errors: []
      });
    } catch (error) {
      next(error);
    }
  }

  async changeStatus(req, res, next) {
    try {
      const adminUserId = req.user.id;
      const { status } = req.body;
      if (!['active', 'inactive'].includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid status. Must be "active" or "inactive".',
          data: null,
          errors: ['Validation error']
        });
      }
      await clientService.toggleClientStatus(req.params.id, status, adminUserId);
      res.status(200).json({
        success: true,
        message: `Client status changed to ${status} successfully.`,
        data: null,
        errors: []
      });
    } catch (error) {
      next(error);
    }
  }

  // Bulk Actions
  async bulkDelete(req, res, next) {
    try {
      const adminUserId = req.user.id;
      const { ids } = req.body;
      await clientService.bulkDeleteClients(ids, adminUserId);
      res.status(200).json({
        success: true,
        message: `Selected clients (${ids.length}) deleted successfully.`,
        data: null,
        errors: []
      });
    } catch (error) {
      next(error);
    }
  }

  async bulkUpdateStatus(req, res, next) {
    try {
      const adminUserId = req.user.id;
      const { ids, status } = req.body;
      if (!['active', 'inactive'].includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid status. Must be "active" or "inactive".',
          data: null,
          errors: ['Validation error']
        });
      }
      await clientService.bulkUpdateClientsStatus(ids, status, adminUserId);
      res.status(200).json({
        success: true,
        message: `Selected clients status updated to "${status}".`,
        data: null,
        errors: []
      });
    } catch (error) {
      next(error);
    }
  }

  async getDropdown(req, res, next) {
    try {
      const clients = await clientService.getClientsDropdown();
      res.status(200).json({
        success: true,
        message: 'Clients dropdown items retrieved.',
        data: { clients },
        errors: []
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ClientController();
