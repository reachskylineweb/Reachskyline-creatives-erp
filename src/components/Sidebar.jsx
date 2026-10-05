import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  Layers,
  Award,
  Users,
  UserCheck,
  FolderGit,
  CalendarClock,
  BarChart3,
  LogOut,
  User,
  Boxes,
  Calendar,
  ListTodo,
  FileSpreadsheet,
  RefreshCw,
  CheckCircle2,
  MessageSquare,
  Key,
  Phone,
  FileText,
  Grid
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import reachskylineLogo from '../assets/reachskyline-logo.webp';
import AppIcon from '../utils/appIcons';

const Sidebar = () => {
  const { logout, user } = useAuth();

  const getAdminMenuItems = () => {
    const items = [
      { label: 'Dashboard', path: '/admin/dashboard', icon: <AppIcon name="dashboard" size={26} /> },
      { label: 'Clients', path: '/admin/clients', icon: <AppIcon name="clients" size={26} /> },
      { label: 'Departments', path: '/admin/departments', icon: <AppIcon name="department" size={26} /> },
      { label: 'Campaign Run', path: '/admin/campaign-run', icon: <AppIcon name="campaignTeam" size={26} /> },
      { label: 'Managers', path: '/admin/managers', icon: <AppIcon name="manager" size={26} /> },
      { label: 'Employees', path: '/admin/employees', icon: <AppIcon name="employee" size={26} /> },
      { label: 'Content Calendar', path: '/admin/projects', icon: <AppIcon name="contentCalendar" size={26} /> },
      { label: 'Event Day Calendar', path: '/admin/event-calendar', icon: <AppIcon name="blogCalendar" size={26} /> },
      { label: 'Deliverables', path: '/admin/deliverables', icon: <AppIcon name="deliverables" size={26} /> },
      { label: 'Reports', path: '/admin/reports', icon: <AppIcon name="report" size={26} /> },
      { label: 'Work Updates', path: '/admin/work-updates', icon: <AppIcon name="workUpdates" size={26} /> }
    ];

    if (user?.role === 'super_admin') {
      items.push({ label: 'Superadmin Reports', path: '/admin/superadmin-reports', icon: <AppIcon name="report" size={26} /> });
    }

    items.push(
      { label: 'Activity Types', path: '/admin/activity-types', icon: <AppIcon name="activityType" size={26} /> },
      { label: 'Credentials', path: '/admin/credentials', icon: <AppIcon name="credentials" size={26} /> }
    );

    return items;
  };

  const getMenuItems = () => {
    const isClientPath = window.location.pathname.startsWith('/client');
    const isClientUser = user?.role === 'client' || user?.user_type === 'client' || isClientPath;

    if (isClientUser) {
      return [
        { label: 'Client Dashboard', path: '/client/dashboard', icon: <AppIcon name="dashboard" size={26} /> },
        { label: 'Collaboration & Approvals', path: '/client/approvals', icon: <AppIcon name="completedTask" size={26} /> },
        { label: 'Approval for ReachSkyline', path: '/client/reachskyline-approvals', icon: <AppIcon name="task" size={26} /> },
        { label: 'Monthly Performance Reports', path: '/client/reports', icon: <AppIcon name="report" size={26} /> },
        { label: 'ReachSkyline Contact', path: '/client/contact', icon: <Phone size={22} /> }
      ];
    }

    if (user?.role === 'super_admin') {
      return [
        { label: 'Dashboard', path: '/super-admin/dashboard', icon: <AppIcon name="dashboard" size={26} /> },
        { label: 'Branches', path: '/super-admin/branches', icon: <Building2 size={24} /> },
        { label: 'Clients', path: '/super-admin/clients', icon: <AppIcon name="clients" size={26} /> },
        { label: 'Campaign Run', path: '/super-admin/campaign-run', icon: <AppIcon name="campaignTeam" size={26} /> },
        { label: 'Event Day Calendar', path: '/super-admin/event-calendar', icon: <AppIcon name="blogCalendar" size={26} /> },
        { label: 'Employee Efficiency', path: '/super-admin/efficiency', icon: <AppIcon name="report" size={26} /> },
        { label: 'Profile', path: '/super-admin/profile', icon: <User size={24} /> }
      ];
    }

    if (user?.role === 'manager') {
      const deptCode = user?.managerProfile?.department_code;
      const deptId = Number(user?.managerProfile?.department_id);

      if (deptCode === 'SMM-RS') {
        return [
          { label: 'Dashboard', path: '/manager/dashboard', icon: <AppIcon name="dashboard" size={26} /> },
          { label: 'Employees', path: '/manager/employees', icon: <AppIcon name="employee" size={26} /> },
          { label: 'Today\'s Posting', path: '/manager/today-posting', icon: <AppIcon name="task" size={26} /> },
          { label: 'Monthly Posting', path: '/manager/monthly-posting', icon: <Calendar size={24} /> },
          { label: 'Posted History', path: '/manager/posted', icon: <AppIcon name="completedTask" size={26} /> }
        ];
      }

      if (deptCode === 'CMP-RS' || deptId === 4) {
        return [
          { label: 'Dashboard', path: '/manager/dashboard', icon: <AppIcon name="dashboard" size={26} /> },
          { label: 'Campaign Run', path: '/manager/campaign-run', icon: <AppIcon name="campaignTeam" size={26} /> },
          { label: 'Employees', path: '/manager/employees', icon: <AppIcon name="employee" size={26} /> },
          { label: 'Sub-departments', path: '/manager/sub-departments', icon: <AppIcon name="department" size={26} /> },
          { label: 'Employee Efficiency', path: '/manager/efficiency', icon: <AppIcon name="report" size={26} /> }
        ];
      }

      return [
        { label: 'Dashboard', path: '/manager/dashboard', icon: <AppIcon name="dashboard" size={26} /> },
        { label: 'Campaign Run', path: '/manager/campaign-run', icon: <AppIcon name="campaignTeam" size={26} /> },
        { label: 'Daily To-Do', path: '/manager/daily-todo', icon: <AppIcon name="task" size={26} /> },
        { label: 'Completed Works', path: '/manager/completed-works', icon: <AppIcon name="completedTask" size={26} /> },
        { label: 'Content Calendar', path: '/manager/calendar', icon: <AppIcon name="contentCalendar" size={26} /> },
        { label: 'Event Day Calendar', path: '/manager/event-calendar', icon: <AppIcon name="blogCalendar" size={26} /> },
        { label: 'Content Writers Work Assignment', path: '/manager/writers-assignment', icon: <AppIcon name="employee" size={26} /> },
        { label: 'Sub-departments', path: '/manager/sub-departments', icon: <AppIcon name="department" size={26} /> },
        { label: 'Employees', path: '/manager/employees', icon: <AppIcon name="employee" size={26} /> },
        { label: 'Employee Efficiency', path: '/manager/efficiency', icon: <AppIcon name="report" size={26} /> },
        { label: 'Approval works', path: '/manager/submissions-review', icon: <AppIcon name="task" size={26} /> },
        { label: 'OP from Client', path: '/manager/client-reworks', icon: <RefreshCw size={22} /> }
      ];
    }

    if (user?.role === 'employee') {
      const deptCode = user?.employeeProfile?.department_code;
      const deptId = Number(user?.employeeProfile?.department_id);

      if (deptCode === 'CMP-RS' || deptId === 4) {
        return [
          { label: 'Dashboard', path: '/employee/dashboard', icon: <AppIcon name="dashboard" size={26} /> },
          { label: 'Campaign Run', path: '/employee/campaign-run', icon: <AppIcon name="campaignTeam" size={26} /> },
          { label: 'Assigned Work', path: '/employee/assigned-work', icon: <AppIcon name="task" size={26} /> }
        ];
      }

      if (deptCode === 'SMM-RS') {
        return [
          { label: 'Dashboard', path: '/employee/dashboard', icon: <AppIcon name="dashboard" size={26} /> },
          { label: 'To-Do', path: '/employee/today-posting', icon: <AppIcon name="task" size={26} /> },
          { label: 'Monthly Posting', path: '/employee/monthly-posting', icon: <Calendar size={24} /> },
          { label: 'Posted History', path: '/employee/posted', icon: <AppIcon name="completedTask" size={26} /> }
        ];
      }
      const subDeptId = Number(user?.employeeProfile?.sub_department_id);
      const subDeptCode = user?.employeeProfile?.sub_department_code;
      const subDeptName = (user?.employeeProfile?.sub_department_name || '').toLowerCase();
      const isContentWriter = subDeptId === 1 || subDeptCode === 'CW-RS' || subDeptName.includes('writer') || subDeptName.includes('content');

      if (isContentWriter) {
        return [
          { label: 'Dashboard', path: '/employee/dashboard', icon: <AppIcon name="dashboard" size={26} /> },
          { label: 'Event Day Calendar', path: '/employee/event-calendar', icon: <AppIcon name="blogCalendar" size={26} /> },
          { label: 'Assigned Work', path: '/employee/assigned-work', icon: <AppIcon name="task" size={26} /> },
          { label: 'Reassigned Work', path: '/employee/reassigned-work', icon: <RefreshCw size={22} /> },
          { label: 'Overall Work', path: '/employee/overall-work', icon: <AppIcon name="completedTask" size={26} /> }
        ];
      }
      return [
        { label: 'Dashboard', path: '/employee/dashboard', icon: <AppIcon name="dashboard" size={26} /> },
        { label: 'Campaign Run', path: '/employee/campaign-run', icon: <AppIcon name="campaignTeam" size={26} /> },
        { label: 'Content Calendar', path: '/employee/calendar', icon: <AppIcon name="contentCalendar" size={26} /> },
        { label: 'Assigned Work', path: '/employee/assigned-work', icon: <AppIcon name="task" size={26} /> },
        { label: 'Reassigned Work', path: '/employee/reassigned-work', icon: <RefreshCw size={22} /> },
        { label: 'Approved Work', path: '/employee/approved-work', icon: <AppIcon name="completedTask" size={26} /> }
      ];
    }

    return getAdminMenuItems();
  };

  const handleNavClick = () => {
    document.body.classList.remove('mobile-sidebar-open');
  };

  const menuItems = getMenuItems();

  return (
    <>
      <div className="sidebar-backdrop" onClick={handleNavClick}></div>
      <aside className="sidebar">
        <div className="sidebar-logo">
          <NavLink to="/" onClick={handleNavClick} className="sidebar-logo-link" title="ReachSkyline ERP">
            <img 
              src={reachskylineLogo} 
              alt="ReachSkyline Logo" 
              className="sidebar-brand-img"
            />
          </NavLink>
        </div>

        <ul className="sidebar-menu">
          {menuItems.map((item, index) => (
            <li key={index} className="sidebar-item">
              <NavLink
                to={item.path}
                state={item.state}
                onClick={handleNavClick}
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              >
                {item.icon}
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>

      <div className="sidebar-footer">
        <button
          onClick={logout}
          className="sidebar-link"
          style={{
            background: 'none',
            border: 'none',
            width: '100%',
            cursor: 'pointer',
            textAlign: 'left',
            color: 'var(--danger)'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.color = '#f87171'; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--danger)'; }}
        >
          <LogOut size={20} />
          <span style={{ fontWeight: 600 }}>Sign Out</span>
        </button>
      </div>
    </aside>
    </>
  );
};

export default Sidebar;
