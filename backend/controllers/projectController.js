const projectService = require('../services/projectService');

class ProjectController {
  async list(req, res, next) {
    try {
      const data = await projectService.getProjects(req.query);
      res.status(200).json({
        success: true,
        message: 'Projects list retrieved successfully.',
        data,
        errors: []
      });
    } catch (error) {
      next(error);
    }
  }

  async get(req, res, next) {
    try {
      const project = await projectService.getProjectById(req.params.id);
      res.status(200).json({
        success: true,
        message: 'Project details retrieved.',
        data: { project },
        errors: []
      });
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const adminUserId = req.user.id;
      const id = await projectService.createProject(req.body, adminUserId);
      res.status(201).json({
        success: true,
        message: 'Project created successfully.',
        data: { id },
        errors: []
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const adminUserId = req.user.id;
      await projectService.updateProject(req.params.id, req.body, adminUserId);
      res.status(200).json({
        success: true,
        message: 'Project updated successfully.',
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
      await projectService.deleteProject(req.params.id, adminUserId);
      res.status(200).json({
        success: true,
        message: 'Project soft-deleted successfully.',
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
      if (!['pending', 'active', 'completed'].includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid status. Must be "pending", "active" or "completed".',
          data: null,
          errors: ['Validation error']
        });
      }
      await projectService.toggleProjectStatus(req.params.id, status, adminUserId);
      res.status(200).json({
        success: true,
        message: `Project status changed to ${status}.`,
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
      await projectService.bulkDeleteProjects(ids, adminUserId);
      res.status(200).json({
        success: true,
        message: `Selected projects (${ids.length}) deleted successfully.`,
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
      if (!['pending', 'active', 'completed'].includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid status.',
          data: null,
          errors: ['Validation error']
        });
      }
      await projectService.bulkUpdateProjectsStatus(ids, status, adminUserId);
      res.status(200).json({
        success: true,
        message: `Selected projects status updated to "${status}".`,
        data: null,
        errors: []
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ProjectController();
