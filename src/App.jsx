import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';

// Layout shells
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import ErrorBoundary from './components/ErrorBoundary';

// Lazy Loaded Pages
const Login = lazy(() => import('./features/Admin/Login/Login'));
const AdminDashboard = lazy(() => import('./features/Admin/Dashboard/AdminDashboard'));
const ClientList = lazy(() => import('./features/Admin/Clients/ClientList'));
const DepartmentList = lazy(() => import('./features/Admin/Departments/DepartmentList'));
const ManagerList = lazy(() => import('./features/Admin/Managers/ManagerList'));
const EmployeeList = lazy(() => import('./features/Admin/Employees/EmployeeList'));
const ProjectList = lazy(() => import('./features/Admin/Projects/ProjectList'));
const DeliverableList = lazy(() => import('./features/Admin/Deliverables/DeliverableList'));
const ReportDashboard = lazy(() => import('./features/Admin/Reports/ReportDashboard'));
const SuperadminReports = lazy(() => import('./features/Admin/Reports/SuperadminReports'));
const ActivityTypeList = lazy(() => import('./features/Admin/ActivityTypes/ActivityTypeList'));
const LoginCredentials = lazy(() => import('./features/Admin/Credentials/LoginCredentials'));
const WorkUpdates = lazy(() => import('./features/Admin/WorkUpdates/WorkUpdates'));
const ClientPortal = lazy(() => import('./features/Client/ClientPortal'));

// Manager features
const ManagerDashboard = lazy(() => import('./features/Manager/ManagerDashboard'));
const ManagerCalendar = lazy(() => import('./features/Manager/ManagerCalendar'));
const ManagerDailyTodo = lazy(() => import('./features/Manager/ManagerDailyTodo'));
const DesignerWorkload = lazy(() => import('./features/Manager/DesignerWorkload'));
const CompletedWorks = lazy(() => import('./features/Manager/CompletedWorks'));
const ManagerSubmissionsReview = lazy(() => import('./features/Manager/ManagerSubmissionsReview'));
const ManagerClientRework = lazy(() => import('./features/Manager/ManagerClientRework'));
const ManagerJobWorks = lazy(() => import('./features/Manager/ManagerJobWorks'));
const ManagerSubDepartmentList = lazy(() => import('./features/Manager/ManagerSubDepartmentList'));
const ManagerEmployeeList = lazy(() => import('./features/Manager/ManagerEmployeeList'));
const ManagerEfficiency = lazy(() => import('./features/Manager/ManagerEfficiency'));
const SMMTodayPosting = lazy(() => import('./features/Manager/SMMTodayPosting'));
const SMMMonthlyPosting = lazy(() => import('./features/Manager/SMMMonthlyPosting'));
const SMMPosted = lazy(() => import('./features/Manager/SMMPosted'));
const WritersAssignment = lazy(() => import('./features/Manager/WritersAssignment'));

// Employee features
const EmployeeDashboard = lazy(() => import('./features/Employee/EmployeeDashboard'));
const EmployeeCalendar = lazy(() => import('./features/Employee/EmployeeCalendar'));
const EmployeeEventCalendar = lazy(() => import('./features/Employee/EmployeeEventCalendar'));
const EmployeeAssignedWork = lazy(() => import('./features/Employee/EmployeeAssignedWork'));
const EmployeeReassignedWork = lazy(() => import('./features/Employee/EmployeeReassignedWork'));
const EmployeeApprovedWork = lazy(() => import('./features/Employee/EmployeeApprovedWork'));
const EmployeeTodayDeliverables = lazy(() => import('./features/Employee/EmployeeTodayDeliverables'));
const EmployeeRework = lazy(() => import('./features/Employee/EmployeeRework'));
const EmployeeOverallWork = lazy(() => import('./features/Employee/EmployeeOverallWork'));

// SuperAdmin features
const SuperAdminDashboard = lazy(() => import('./features/SuperAdmin/SuperAdminDashboard'));
const SuperAdminClients = lazy(() => import('./features/SuperAdmin/SuperAdminClients'));
const SuperAdminEfficiency = lazy(() => import('./features/SuperAdmin/SuperAdminEfficiency'));
const SuperAdminBranches = lazy(() => import('./features/SuperAdmin/SuperAdminBranches'));
const SuperAdminBranchDetail = lazy(() => import('./features/SuperAdmin/SuperAdminBranchDetail'));
const SuperAdminProfile = lazy(() => import('./features/SuperAdmin/SuperAdminProfile'));

const PageLoader = () => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', color: 'var(--text-muted)' }}>
    <div style={{ width: '32px', height: '32px', border: '3px solid #e2e8f0', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);

// Protected Super Admin Route Guard
const ProtectedSuperAdminRoute = () => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) return <PageLoader />;
  if (!isAuthenticated || user?.role !== 'super_admin') {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Header />
        <main style={{ flex: 1, overflowY: 'auto' }}>
          <Suspense fallback={<PageLoader />}>
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  );
};

const ProtectedAdminRoute = () => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) return <PageLoader />;
  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Header />
        <main style={{ flex: 1, overflowY: 'auto' }}>
          <Suspense fallback={<PageLoader />}>
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  );
};

// Protected Manager Route Guard
const ProtectedManagerRoute = () => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) return <PageLoader />;
  if (!isAuthenticated || (user?.role !== 'manager' && user?.role !== 'admin' && user?.role !== 'super_admin')) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Header />
        <main style={{ flex: 1, overflowY: 'auto' }}>
          <Suspense fallback={<PageLoader />}>
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  );
};

// Protected Client Route Guard
const ProtectedClientRoute = () => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) return <PageLoader />;
  if (!isAuthenticated || user?.role !== 'client') {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Header />
        <main style={{ flex: 1, overflowY: 'auto' }}>
          <Suspense fallback={<PageLoader />}>
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  );
};

// Protected Employee Route Guard
const ProtectedEmployeeRoute = () => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) return <PageLoader />;
  if (!isAuthenticated || user?.role !== 'employee') {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Header />
        <main style={{ flex: 1, overflowY: 'auto' }}>
          <Suspense fallback={<PageLoader />}>
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <NotificationProvider>
          <ErrorBoundary>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                {/* Public Routing */}
                <Route path="/login" element={<Login />} />

                {/* Protected Super Admin Routing */}
                <Route path="/super-admin" element={<ProtectedSuperAdminRoute />}>
                  <Route path="dashboard" element={<SuperAdminDashboard />} />
                  <Route path="clients" element={<SuperAdminClients />} />
                  <Route path="efficiency" element={<SuperAdminEfficiency />} />
                  <Route path="branches" element={<SuperAdminBranches />} />
                  <Route path="branches/:id" element={<SuperAdminBranchDetail />} />
                  <Route path="event-calendar" element={<ErrorBoundary><EmployeeEventCalendar /></ErrorBoundary>} />
                  <Route path="profile" element={<SuperAdminProfile />} />
                  <Route index element={<Navigate to="dashboard" replace />} />
                </Route>

                {/* Protected Admin Routing */}
                <Route path="/admin" element={<ProtectedAdminRoute />}>
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="clients" element={<ClientList />} />
                  <Route path="departments" element={<DepartmentList />} />
                  <Route path="managers" element={<ManagerList />} />
                  <Route path="employees" element={<EmployeeList />} />
                  <Route path="projects" element={<ProjectList />} />
                  <Route path="event-calendar" element={<ErrorBoundary><EmployeeEventCalendar /></ErrorBoundary>} />
                  <Route path="deliverables" element={<DeliverableList />} />
                  <Route path="reports" element={<ReportDashboard />} />
                  <Route path="superadmin-reports" element={<SuperadminReports />} />
                  <Route path="activity-types" element={<ActivityTypeList />} />
                  <Route path="credentials" element={<LoginCredentials />} />
                  <Route path="work-updates" element={<WorkUpdates />} />
                  <Route index element={<Navigate to="dashboard" replace />} />
                </Route>

                 {/* Protected Manager Routing */}
                <Route path="/manager" element={<ProtectedManagerRoute />}>
                  <Route path="dashboard" element={<ManagerDashboard />} />
                  <Route path="calendar" element={<ManagerCalendar />} />
                  <Route path="event-calendar" element={<ErrorBoundary><EmployeeEventCalendar /></ErrorBoundary>} />
                  <Route path="daily-todo" element={<ManagerDailyTodo />} />
                  <Route path="designer-workload" element={<DesignerWorkload />} />
                  <Route path="completed-works" element={<CompletedWorks />} />
                  <Route path="sub-departments" element={<ManagerSubDepartmentList />} />
                  <Route path="employees" element={<ManagerEmployeeList />} />
                  <Route path="efficiency" element={<ManagerEfficiency />} />
                  <Route path="submissions-review" element={<ErrorBoundary><ManagerSubmissionsReview /></ErrorBoundary>} />
                  <Route path="client-reworks" element={<ManagerClientRework />} />
                  <Route path="job-works" element={<ManagerJobWorks />} />
                  <Route path="today-posting" element={<SMMTodayPosting />} />
                  <Route path="monthly-posting" element={<SMMMonthlyPosting />} />
                  <Route path="posted" element={<SMMPosted />} />
                  <Route path="writers-assignment" element={<ErrorBoundary><WritersAssignment /></ErrorBoundary>} />
                  <Route index element={<Navigate to="dashboard" replace />} />
                </Route>

                {/* Protected Employee Routing */}
                <Route path="/employee" element={<ProtectedEmployeeRoute />}>
                  <Route path="dashboard" element={<EmployeeDashboard />} />
                  <Route path="calendar" element={<EmployeeCalendar />} />
                  <Route path="event-calendar" element={<ErrorBoundary><EmployeeEventCalendar /></ErrorBoundary>} />
                  <Route path="assigned-work" element={<EmployeeAssignedWork />} />
                  <Route path="reassigned-work" element={<EmployeeReassignedWork />} />
                  <Route path="approved-work" element={<EmployeeApprovedWork />} />
                  <Route path="overall-work" element={<EmployeeOverallWork />} />
                  <Route path="today" element={<EmployeeTodayDeliverables />} />
                  <Route path="rework" element={<EmployeeRework />} />
                  <Route path="today-posting" element={<SMMTodayPosting isEmployee />} />
                  <Route path="monthly-posting" element={<SMMMonthlyPosting isEmployee />} />
                  <Route path="posted" element={<SMMPosted isEmployee />} />
                  <Route index element={<Navigate to="dashboard" replace />} />
                </Route>

                {/* Protected Client Routing */}
                <Route path="/client" element={<ProtectedClientRoute />}>
                  <Route path="dashboard" element={<ClientPortal activeTabProp="dashboard" />} />
                  <Route path="approvals" element={<ClientPortal activeTabProp="approvals" />} />
                  <Route path="reachskyline-approvals" element={<ClientPortal activeTabProp="reachskyline_approvals" />} />
                  <Route path="reports" element={<ClientPortal activeTabProp="reports" />} />
                  <Route path="contact" element={<ClientPortal activeTabProp="contact" />} />
                  <Route path="portal" element={<Navigate to="/client/dashboard" replace />} />
                  <Route index element={<Navigate to="dashboard" replace />} />
                </Route>

                {/* Global fallback catcher */}
                <Route path="*" element={<Navigate to="/login" replace />} />
              </Routes>
            </Suspense>
          </ErrorBoundary>
        </NotificationProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
