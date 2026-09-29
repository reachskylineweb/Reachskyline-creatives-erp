const blogAssignmentService = require('../services/blogAssignmentService');

class BlogAssignmentController {
  async getClients(req, res, next) {
    try {
      const clients = await blogAssignmentService.getClientsWithAssignments(req.query);
      res.status(200).json({
        success: true,
        message: 'Clients for blog assignment retrieved.',
        data: clients,
        errors: []
      });
    } catch (err) {
      next(err);
    }
  }

  async getManagers(req, res, next) {
    try {
      const managers = await blogAssignmentService.getManagersForBlog();
      res.status(200).json({
        success: true,
        message: 'SEO Managers retrieved.',
        data: managers,
        errors: []
      });
    } catch (err) {
      next(err);
    }
  }

  async assign(req, res, next) {
    try {
      const { client_ids, manager_id } = req.body;
      const adminUserId = req.user.id;
      const result = await blogAssignmentService.assignClients(client_ids, manager_id, adminUserId);
      res.status(200).json({
        success: true,
        alreadyAssignedAll: Boolean(result.alreadyAssignedAll),
        message: result.message,
        data: result,
        errors: []
      });
    } catch (err) {
      next(err);
    }
  }

  async unassign(req, res, next) {
    try {
      const { client_ids } = req.body;
      await blogAssignmentService.unassignClients(client_ids);
      res.status(200).json({
        success: true,
        message: 'Clients unassigned successfully.',
        data: null,
        errors: []
      });
    } catch (err) {
      next(err);
    }
  }

  async getMyAssignedClients(req, res, next) {
    try {
      const userId = req.user.id;
      const clients = await blogAssignmentService.getAssignedClientsForManager(userId);
      res.status(200).json({
        success: true,
        message: 'Your assigned blog clients retrieved.',
        data: clients,
        errors: []
      });
    } catch (err) {
      next(err);
    }
  }

  async createJobWork(req, res, next) {
    try {
      const adminUserId = req.user.id;
      const id = await blogAssignmentService.createJobWork(req.body, adminUserId);
      res.status(201).json({
        success: true,
        message: 'Blog Job Work created and sent to SEO Manager successfully.',
        data: { id },
        errors: []
      });
    } catch (err) {
      next(err);
    }
  }

  async getJobWorksForManager(req, res, next) {
    try {
      const userId = req.user.id;
      const data = await blogAssignmentService.getJobWorksForManager(userId);
      res.status(200).json({
        success: true,
        message: 'Blog Job Works retrieved successfully.',
        data,
        errors: []
      });
    } catch (err) {
      next(err);
    }
  }

  async getJobWorksForAdmin(req, res, next) {
    try {
      const data = await blogAssignmentService.getJobWorksForAdmin();
      res.status(200).json({
        success: true,
        message: 'All Blog Job Works retrieved.',
        data,
        errors: []
      });
    } catch (err) {
      next(err);
    }
  }

  async assignJobWorkToEmployee(req, res, next) {
    try {
      const { id } = req.params;
      const { assigned_employee_id } = req.body;
      await blogAssignmentService.assignJobWorkToEmployee(id, assigned_employee_id);
      res.status(200).json({
        success: true,
        message: 'Job Work assigned to employee successfully.',
        data: null,
        errors: []
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new BlogAssignmentController();
