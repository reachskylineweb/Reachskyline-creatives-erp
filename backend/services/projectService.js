const projectRepository = require('../repositories/projectRepository');
const dashboardRepository = require('../repositories/dashboardRepository');
const notificationRepository = require('../repositories/notificationRepository');
const pool = require('../config/db');

class ProjectService {
  async getProjects(filters) {
    const limit = filters.limit ? parseInt(filters.limit, 10) : 10;
    const page = filters.page ? parseInt(filters.page, 10) : 1;
    const offset = (page - 1) * limit;

    const queryParams = {
      limit,
      offset,
      sortColumn: filters.sortColumn || 'id',
      sortOrder: filters.sortOrder || 'asc',
      searchQuery: filters.searchQuery || '',
      statusFilter: filters.statusFilter || '',
      priorityFilter: filters.priorityFilter || '',
      clientFilter: filters.clientFilter || '',
      departmentFilter: filters.departmentFilter || '',
      managerFilter: filters.managerFilter || ''
    };

    const projects = await projectRepository.getProjectsList(queryParams);
    const total = await projectRepository.getProjectsCount(queryParams);

    return {
      projects,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  async getProjectById(id) {
    const project = await projectRepository.findById(id);
    if (!project) {
      const error = new Error('Project not found.');
      error.statusCode = 404;
      throw error;
    }
    return project;
  }

  async createProject(projectData, adminUserId) {
    // Validate dates
    if (new Date(projectData.start_date) > new Date(projectData.end_date)) {
      const error = new Error('Start date cannot be after end date.');
      error.statusCode = 400;
      throw error;
    }

    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      const insertData = {
        ...projectData,
        created_by: adminUserId
      };

      const projectId = await projectRepository.create(insertData, connection);
      
      await dashboardRepository.createActivityLog(adminUserId, 'Create Project', `Project "${projectData.project_name}" was created.`, connection);
      await notificationRepository.createNotification(`Project Created: "${projectData.project_name}" is assigned to the department.`, 'client_created', connection);

      await connection.commit();
      return projectId;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async updateProject(id, projectData, adminUserId) {
    if (new Date(projectData.start_date) > new Date(projectData.end_date)) {
      const error = new Error('Start date cannot be after end date.');
      error.statusCode = 400;
      throw error;
    }

    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      const project = await projectRepository.findById(id);
      if (!project) {
        const error = new Error('Project not found.');
        error.statusCode = 404;
        throw error;
      }

      const updateData = {
        ...projectData,
        updated_by: adminUserId
      };

      await projectRepository.update(id, updateData, connection);
      
      await dashboardRepository.createActivityLog(adminUserId, 'Update Project', `Project "${projectData.project_name}" was updated.`, connection);

      // Check delay
      const today = new Date().toISOString().split('T')[0];
      if (projectData.status !== 'completed' && projectData.end_date < today) {
        await notificationRepository.createNotification(`Project Delayed: "${projectData.project_name}" has passed its end date.`, 'project_delayed', connection);
      }

      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async deleteProject(id, adminUserId) {
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      const project = await projectRepository.findById(id);
      if (!project) {
        const error = new Error('Project not found.');
        error.statusCode = 404;
        throw error;
      }

      await projectRepository.softDelete(id, connection);
      await dashboardRepository.createActivityLog(adminUserId, 'Delete Project', `Project "${project.project_name}" was soft-deleted.`, connection);

      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async toggleProjectStatus(id, status, adminUserId) {
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      const project = await projectRepository.findById(id);
      if (!project) {
        const error = new Error('Project not found.');
        error.statusCode = 404;
        throw error;
      }

      await projectRepository.changeStatus(id, status, connection);
      await dashboardRepository.createActivityLog(adminUserId, 'Toggle Project Status', `Project "${project.project_name}" status set to ${status}.`, connection);

      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  // Bulk Actions
  async bulkDeleteProjects(ids, adminUserId) {
    if (!Array.isArray(ids) || ids.length === 0) {
      const error = new Error('No project IDs provided.');
      error.statusCode = 400;
      throw error;
    }

    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      await projectRepository.bulkDelete(ids, connection);
      await dashboardRepository.createActivityLog(adminUserId, 'Bulk Delete Projects', `Bulk deleted ${ids.length} projects.`, connection);
      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async bulkUpdateProjectsStatus(ids, status, adminUserId) {
    if (!Array.isArray(ids) || ids.length === 0) {
      const error = new Error('No project IDs provided.');
      error.statusCode = 400;
      throw error;
    }

    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      await projectRepository.bulkUpdateStatus(ids, status, connection);
      await dashboardRepository.createActivityLog(adminUserId, 'Bulk Update Project Status', `Bulk updated status of ${ids.length} projects to "${status}".`, connection);
      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
}

module.exports = new ProjectService();
