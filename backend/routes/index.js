const express = require('express');
const router = express.Router();

// Middlewares
const { authenticateToken, requireAdmin, requireManagerOrAdmin } = require('../middlewares/auth');

// Route modules
const authRoutes = require('./authRoutes');
const clientRoutes = require('./clientRoutes');
const departmentRoutes = require('./departmentRoutes');
const userRoutes = require('./userRoutes');
const projectRoutes = require('./projectRoutes');
const deliverableRoutes = require('./deliverableRoutes');
const dashboardRoutes = require('./dashboardRoutes');
const notificationRoutes = require('./notificationRoutes');
const calendarRoutes = require('./calendarRoutes');
const activityTypesRoutes = require('./activityTypesRoutes');
const clientPortalRoutes = require('./clientPortalRoutes');
const superAdminRoutes = require('./superAdminRoutes');
const eventDayRoutes = require('./eventDayRoutes');
const contentWorkRoutes = require('./contentWorkRoutes');
const blogAssignmentRoutes = require('./blogAssignmentRoutes');
const blogCalendarRoutes = require('./blogCalendarRoutes');
const uploadRoutes = require('./uploadRoutes');

// 1. Mount Auth (contains both public and private endpoints)
router.use('/auth', authRoutes);
router.use('/upload', uploadRoutes);
router.use('/client-portal', clientPortalRoutes);
router.use('/super-admin', superAdminRoutes);

// 2. Mount Protected Admin-Only Routes
router.use('/clients', authenticateToken, clientRoutes);
router.use('/departments', authenticateToken, departmentRoutes);
router.use('/users', authenticateToken, requireManagerOrAdmin, userRoutes);
router.use('/projects', authenticateToken, projectRoutes);
router.use('/deliverables', authenticateToken, deliverableRoutes);
router.use('/dashboard', authenticateToken, dashboardRoutes);
router.use('/notifications', authenticateToken, notificationRoutes);
router.use('/calendar', authenticateToken, calendarRoutes);
router.use('/activity-types', authenticateToken, activityTypesRoutes);
router.use('/event-days', eventDayRoutes);
router.use('/content-work', contentWorkRoutes);
router.use('/blog-assignments', blogAssignmentRoutes);
router.use('/blog-calendar', authenticateToken, blogCalendarRoutes);

// 3. Global Search Endpoint
const userRepository = require('../repositories/userRepository');
const clientRepository = require('../repositories/clientRepository');
const departmentRepository = require('../repositories/departmentRepository');
const projectRepository = require('../repositories/projectRepository');

router.get('/search', authenticateToken, requireManagerOrAdmin, async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q || q.trim() === '') {
      return res.status(200).json({
        success: true,
        message: 'No search query provided.',
        data: { clients: [], departments: [], managers: [], employees: [], projects: [] },
        errors: []
      });
    }

    const like = `%${q}%`;
    const searchParams = { limit: 10, offset: 0, searchQuery: q };

    // Search different repositories concurrently
    const [clients, departments, managers, employees, projects] = await Promise.all([
      clientRepository.getClientsList(searchParams),
      departmentRepository.getDepartmentsList(searchParams),
      userRepository.getManagersList(searchParams),
      userRepository.getEmployeesList(searchParams),
      projectRepository.getProjectsList(searchParams)
    ]);

    res.status(200).json({
      success: true,
      message: 'Global search completed.',
      data: {
        clients,
        departments,
        managers,
        employees,
        projects
      },
      errors: []
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
