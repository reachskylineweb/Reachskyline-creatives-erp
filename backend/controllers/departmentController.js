const departmentService = require('../services/departmentService');

class DepartmentController {
  async list(req, res, next) {
    try {
      const data = await departmentService.getDepartments(req.query);
      res.status(200).json({
        success: true,
        message: 'Departments list retrieved successfully.',
        data,
        errors: []
      });
    } catch (error) {
      next(error);
    }
  }

  async get(req, res, next) {
    try {
      const department = await departmentService.getDepartmentById(req.params.id);
      res.status(200).json({
        success: true,
        message: 'Department details retrieved.',
        data: { department },
        errors: []
      });
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const adminUserId = req.user.id;
      const id = await departmentService.createDepartment(req.body, adminUserId);
      res.status(201).json({
        success: true,
        message: 'Department created successfully.',
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
      await departmentService.updateDepartment(req.params.id, req.body, adminUserId);
      res.status(200).json({
        success: true,
        message: 'Department updated successfully.',
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
      await departmentService.deleteDepartment(req.params.id, adminUserId);
      res.status(200).json({
        success: true,
        message: 'Department soft-deleted successfully.',
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
      await departmentService.toggleDepartmentStatus(req.params.id, status, adminUserId);
      res.status(200).json({
        success: true,
        message: `Department status changed to ${status} successfully.`,
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
      await departmentService.bulkDeleteDepartments(ids, adminUserId);
      res.status(200).json({
        success: true,
        message: `Selected departments (${ids.length}) deleted successfully.`,
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
      await departmentService.bulkUpdateDepartmentsStatus(ids, status, adminUserId);
      res.status(200).json({
        success: true,
        message: `Selected departments status updated to "${status}".`,
        data: null,
        errors: []
      });
    } catch (error) {
      next(error);
    }
  }

  async getDropdown(req, res, next) {
    try {
      // Direct call to rep
      const departmentRepository = require('../repositories/departmentRepository');
      const departments = await departmentRepository.getDepartmentsDropdown();
      res.status(200).json({
        success: true,
        message: 'Active departments dropdown items retrieved.',
        data: { departments },
        errors: []
      });
    } catch (error) {
      next(error);
    }
  }

  async getSubDepartments(req, res, next) {
    try {
      const { id } = req.params;
      const subDepartments = await departmentService.getSubDepartmentsByDeptId(id);
      res.status(200).json({
        success: true,
        message: 'Sub-departments retrieved successfully.',
        data: { subDepartments },
        errors: []
      });
    } catch (error) {
      next(error);
    }
  }

  async getDetails(req, res, next) {
    try {
      const { id } = req.params;
      const details = await departmentService.getDepartmentDetails(id);
      res.status(200).json({
        success: true,
        message: 'Department details retrieved successfully.',
        data: details,
        errors: []
      });
    } catch (error) {
      next(error);
    }
  }

  async createSubDepartment(req, res, next) {
    try {
      const { id } = req.params;
      const adminUserId = req.user.id;
      const subDeptId = await departmentService.createSubDepartment(id, req.body, adminUserId);
      res.status(201).json({
        success: true,
        message: 'Sub-department created successfully.',
        data: { id: subDeptId },
        errors: []
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteSubDepartment(req, res, next) {
    try {
      const { subDeptId } = req.params;
      const adminUserId = req.user.id;
      await departmentService.deleteSubDepartment(subDeptId, adminUserId);
      res.status(200).json({
        success: true,
        message: 'Sub-department deleted successfully.',
        data: {},
        errors: []
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new DepartmentController();
