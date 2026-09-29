const blogAssignmentRepository = require('../repositories/blogAssignmentRepository');

class BlogAssignmentService {
  async getClientsWithAssignments(params) {
    return await blogAssignmentRepository.getAllClientsWithBlogAssignments(params);
  }

  async getManagersForBlog() {
    return await blogAssignmentRepository.getManagersForBlogAssignment();
  }

  async assignClients(clientIds, managerId, adminUserId) {
    if (!clientIds || !Array.isArray(clientIds) || clientIds.length === 0) {
      throw new Error('At least one client must be selected.');
    }
    if (!managerId) {
      throw new Error('Please select an SEO manager to assign.');
    }
    await blogAssignmentRepository.assignClientsToManager(clientIds, managerId, adminUserId);
  }

  async unassignClients(clientIds) {
    if (!clientIds || !Array.isArray(clientIds) || clientIds.length === 0) {
      throw new Error('At least one client must be selected.');
    }
    await blogAssignmentRepository.unassignClients(clientIds);
  }

  async getAssignedClientsForManager(userId) {
    const manager = await blogAssignmentRepository.getManagerByUserId(userId);
    if (!manager) {
      return [];
    }
    return await blogAssignmentRepository.getClientsAssignedToManager(manager.id);
  }

  async createJobWork(data, adminUserId) {
    const { client_id, topic, manager_id } = data;
    if (!client_id || !topic || !manager_id) {
      throw new Error('Client ID, Topic, and SEO Manager are required for Job Work.');
    }
    return await blogAssignmentRepository.createBlogJobWork({ client_id, topic, manager_id, admin_user_id: adminUserId });
  }

  async getJobWorksForManager(userId) {
    const manager = await blogAssignmentRepository.getManagerByUserId(userId);
    if (!manager) {
      return [];
    }
    return await blogAssignmentRepository.getBlogJobWorksForManager(manager.id);
  }

  async getJobWorksForAdmin() {
    return await blogAssignmentRepository.getBlogJobWorksForAdmin();
  }

  async assignJobWorkToEmployee(jobWorkId, employeeId) {
    if (!jobWorkId || !employeeId) {
      throw new Error('Job Work ID and Employee ID are required.');
    }
    await blogAssignmentRepository.assignJobWorkToEmployee(jobWorkId, employeeId);
  }
}

module.exports = new BlogAssignmentService();
