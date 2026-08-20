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

const Sidebar = () => {
  const { logout, user } = useAuth();

  const getAdminMenuItems = () => {
    const items = [
      { label: 'Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard size={20} /> },
      { label: 'Clients', path: '/admin/clients', icon: <Building2 size={20} /> },
      { label: 'Departments', path: '/admin/departments', icon: <Layers size={20} /> },
      { label: 'Managers', path: '/admin/managers', icon: <Award size={20} /> },
      { label: 'Employees', path: '/admin/employees', icon: <Users size={20} /> },
      // { label: 'HR Staff', path: '/admin/hr', icon: <UserCheck size={20} /> },
      { label: 'Content Calendar', path: '/admin/projects', icon: <FolderGit size={20} /> },
      { label: 'Event Day Calendar', path: '/admin/event-calendar', icon: <CalendarClock size={20} /> },
      // { label: 'SEO Calendar', path: '/admin/blog-calendar', icon: <Calendar size={20} /> },
      { label: 'Deliverables', path: '/admin/deliverables', icon: <CalendarClock size={20} /> },
      { label: 'Reports', path: '/admin/reports', icon: <BarChart3 size={20} /> },
      { label: 'Work Updates', path: '/admin/work-updates', icon: <Grid size={20} /> }
    ];

    if (user?.role === 'super_admin') {
      items.push({ label: 'Superadmin Reports', path: '/admin/superadmin-reports', icon: <FileSpreadsheet size={20} /> });
    }

    items.push(
      { label: 'Activity Types', path: '/admin/activity-types', icon: <Boxes size={20} /> },
      { label: 'Credentials', path: '/admin/credentials', icon: <Key size={20} /> }
    );

    return items;
  };

  const menuItems = user?.role === 'super_admin' ? [
    { label: 'Dashboard', path: '/super-admin/dashboard', icon: <LayoutDashboard size={20} /> },
    { label: 'Branches', path: '/super-admin/branches', icon: <Building2 size={20} /> },
    { label: 'Clients', path: '/super-admin/clients', icon: <Users size={20} /> },
    { label: 'Event Day Calendar', path: '/super-admin/event-calendar', icon: <CalendarClock size={20} /> },
    { label: 'Employee Efficiency', path: '/super-admin/efficiency', icon: <BarChart3 size={20} /> },
    { label: 'Profile', path: '/super-admin/profile', icon: <User size={20} /> }
  ] : user?.role === 'manager' ? (
    user?.managerProfile?.department_code === 'SMM-RS' ? [
      { label: 'Dashboard', path: '/manager/dashboard', icon: <LayoutDashboard size={20} /> },
      { label: 'Employees', path: '/manager/employees', icon: <Users size={20} /> },
      { label: 'Today\'s Posting', path: '/manager/today-posting', icon: <ListTodo size={20} /> },
      { label: 'Monthly Posting', path: '/manager/monthly-posting', icon: <Calendar size={20} /> },
      { label: 'Posted History', path: '/manager/posted', icon: <CheckCircle2 size={20} /> }
    ] : user?.managerProfile?.department_code === 'SEO-RS' ? [
      // { label: 'Dashboard', path: '/manager/dashboard', icon: <LayoutDashboard size={20} /> },
      // { label: 'SEO Calendar', path: '/manager/blog-calendar', icon: <Calendar size={20} /> },
      // { label: 'Employees', path: '/manager/employees', icon: <Users size={20} /> }
    ] : [
      { label: 'Dashboard', path: '/manager/dashboard', icon: <LayoutDashboard size={20} /> },
      { label: 'Daily To-Do', path: '/manager/daily-todo', icon: <ListTodo size={20} /> },
      { label: 'Completed Works', path: '/manager/completed-works', icon: <CheckCircle2 size={20} /> },
      { label: 'Content Calendar', path: '/manager/calendar', icon: <Calendar size={20} /> },
      { label: 'Event Day Calendar', path: '/manager/event-calendar', icon: <CalendarClock size={20} /> },
      { label: 'Content Writers Work Assignment', path: '/manager/writers-assignment', icon: <Users size={20} /> },
      { label: 'Sub-departments', path: '/manager/sub-departments', icon: <Layers size={20} /> },
      { label: 'Employees', path: '/manager/employees', icon: <Users size={20} /> },
      { label: 'Employee Efficiency', path: '/manager/efficiency', icon: <BarChart3 size={20} /> },
      { label: 'Approval works', path: '/manager/submissions-review', icon: <FileSpreadsheet size={20} /> },
      { label: 'OP from Client', path: '/manager/client-reworks', icon: <RefreshCw size={20} /> },
      { label: 'Job Works', path: '/manager/job-works', icon: <FileSpreadsheet size={20} /> }
    ]
  ) : user?.role === 'employee' ? (
    user?.employeeProfile?.department_code === 'SMM-RS' ? [
      { label: 'Dashboard', path: '/employee/dashboard', icon: <LayoutDashboard size={20} /> },
      { label: 'To-Do', path: '/employee/today-posting', icon: <ListTodo size={20} /> },
      { label: 'Monthly Posting', path: '/employee/monthly-posting', icon: <Calendar size={20} /> },
      { label: 'Posted History', path: '/employee/posted', icon: <CheckCircle2 size={20} /> }
    ] : user?.employeeProfile?.department_code === 'SEO-RS' ? [
      // { label: 'Dashboard', path: '/employee/dashboard', icon: <LayoutDashboard size={20} /> },
      // { label: 'SEO Calendar', path: '/employee/blog-calendar', icon: <Calendar size={20} /> },
      // { label: 'Assigned Work', path: '/employee/assigned-work', icon: <ListTodo size={20} /> }
    ] : user?.employeeProfile?.sub_department_id === 3 ? [
      { label: 'Dashboard', path: '/employee/dashboard', icon: <LayoutDashboard size={20} /> },
      { label: 'Event Day Calendar', path: '/employee/event-calendar', icon: <CalendarClock size={20} /> },
      { label: 'Assigned Work', path: '/employee/assigned-work', icon: <ListTodo size={20} /> },
      { label: 'Reassigned Work', path: '/employee/reassigned-work', icon: <RefreshCw size={20} /> },
      { label: 'Overall Work', path: '/employee/overall-work', icon: <FileSpreadsheet size={20} /> }
    ] : [
      { label: 'Dashboard', path: '/employee/dashboard', icon: <LayoutDashboard size={20} /> },
      { label: 'Content Calendar', path: '/employee/calendar', icon: <Calendar size={20} /> },
      { label: 'Assigned Work', path: '/employee/assigned-work', icon: <ListTodo size={20} /> },
      { label: 'Reassigned Work', path: '/employee/reassigned-work', icon: <RefreshCw size={20} /> },
      { label: 'Approved Work', path: '/employee/approved-work', icon: <CheckCircle2 size={20} /> }
    ]
  ) : user?.role === 'client' ? [
    { label: 'Client Dashboard', path: '/client/dashboard', icon: <LayoutDashboard size={20} /> },
    { label: 'Collaboration & Approvals', path: '/client/approvals', icon: <CheckCircle2 size={20} /> },
    { label: 'Approval for ReachSkyline', path: '/client/reachskyline-approvals', icon: <FileSpreadsheet size={20} /> },
    { label: 'Monthly Performance Reports', path: '/client/reports', icon: <BarChart3 size={20} /> },
    { label: 'ReachSkyline Contact', path: '/client/contact', icon: <Phone size={20} /> }
  ] : getAdminMenuItems();

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <img src="https://res.cloudinary.com/srfbqmic/image/upload/f_auto,q_auto/download_1_1_l9glns" alt="ReachSkyline Logo" />
        <span>ReachSkyline</span>
        
        {/* Support gradient SVG def inside the sidebar once */}
        <svg width="0" height="0" style={{ position: 'absolute' }}>
          <defs>
            <linearGradient id="logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#DAA71B" />
              <stop offset="100%" stopColor="#4f46e5" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <ul className="sidebar-menu">
        {menuItems.map((item, index) => (
          <li key={index} className="sidebar-item">
            <NavLink
              to={item.path}
              state={item.state}
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
  );
};

export default Sidebar;
