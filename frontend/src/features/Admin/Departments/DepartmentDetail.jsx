import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  ArrowLeft, Plus, Users, UserPlus, Mail, Phone, Calendar, 
  Shield, Info, Edit2, Key, Ban, CheckCircle, Trash2, 
  Search, LayoutDashboard, Building2, UserCheck, Briefcase, 
  Zap, Award, TrendingUp, Filter, ExternalLink, Sparkles, 
  Clock, CheckCircle2, AlertCircle, Layers
} from 'lucide-react';
import api from '../../../utils/api';
import Modal from '../../../components/Modal';
import { FormInput, FormSelect, FormTextArea } from '../../../components/FormFields';
import AppIcon from '../../../utils/appIcons';

const DepartmentDetail = ({ deptId, onBack }) => {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Active Tab: 'dashboard' | 'sub_departments' | 'employees' | 'managers' | 'clients' | 'employee_efficiency' | 'manager_efficiency'
  const [activeTab, setActiveTab] = useState('dashboard');

  // Search & filter states within tabs
  const [empSearch, setEmpSearch] = useState('');
  const [empSubDeptFilter, setEmpSubDeptFilter] = useState('');
  const [empStatusFilter, setEmpStatusFilter] = useState('');

  const [mgrSearch, setMgrSearch] = useState('');
  const [mgrStatusFilter, setMgrStatusFilter] = useState('');

  const [clientSearch, setClientSearch] = useState('');
  const [subDeptSearch, setSubDeptSearch] = useState('');

  // Modals state
  const [isSubDeptModalOpen, setIsSubDeptModalOpen] = useState(false);
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
  const [isManagerModalOpen, setIsManagerModalOpen] = useState(false);
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] = useState(false);

  const [currentSubDept, setCurrentSubDept] = useState(null);
  const [currentEmployee, setCurrentEmployee] = useState(null);
  const [currentManager, setCurrentManager] = useState(null);
  const [targetUserForReset, setTargetUserForReset] = useState(null);

  // Add/Edit Sub-department Form
  const [subDeptForm, setSubDeptForm] = useState({ name: '', code: '' });
  const [subDeptError, setSubDeptError] = useState('');

  // Register/Edit Employee Form
  const [empForm, setEmpForm] = useState({
    full_name: '',
    username: '',
    password: '',
    email: '',
    phone: '',
    reporting_manager_id: '',
    joining_date: new Date().toISOString().split('T')[0],
    status: 'active',
    profile_image: null,
    sub_department_id: ''
  });
  const [empErrors, setEmpErrors] = useState({});
  const [empSubmitError, setEmpSubmitError] = useState('');

  // Register/Edit Manager Form
  const [mgrForm, setMgrForm] = useState({
    full_name: '',
    username: '',
    password: '',
    email: '',
    phone: '',
    branch: 'Main Office',
    joining_date: new Date().toISOString().split('T')[0],
    status: 'active',
    profile_image: null,
    sub_department_id: ''
  });
  const [mgrErrors, setMgrErrors] = useState({});
  const [mgrSubmitError, setMgrSubmitError] = useState('');

  // Reset Password State
  const [newPassword, setNewPassword] = useState('');
  const [resetError, setResetError] = useState('');

  // Fetch all department details
  const fetchDetails = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get(`/departments/${deptId}/details`);
      if (res.data.success) {
        setDetails(res.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load department details.');
    } finally {
      setLoading(false);
    }
  }, [deptId]);

  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);

  // Sub-department Submit
  const handleOpenAddSubDept = () => {
    setCurrentSubDept(null);
    setSubDeptForm({ name: '', code: '' });
    setSubDeptError('');
    setIsSubDeptModalOpen(true);
  };

  const handleSubDeptSubmit = async (e) => {
    e.preventDefault();
    setSubDeptError('');
    if (!subDeptForm.name.trim() || !subDeptForm.code.trim()) {
      setSubDeptError('Both sub-department name and code prefix are required.');
      return;
    }
    if (!/^[A-Z0-9-]{2,15}$/.test(subDeptForm.code.toUpperCase().trim())) {
      setSubDeptError('Prefix code must be 2-15 letters/numbers, e.g. CW-RS, GD-RS.');
      return;
    }

    try {
      const payload = {
        name: subDeptForm.name.trim(),
        code: subDeptForm.code.toUpperCase().trim()
      };
      const res = await api.post(`/departments/${deptId}/sub-departments`, payload);
      if (res.data.success) {
        setIsSubDeptModalOpen(false);
        setSubDeptForm({ name: '', code: '' });
        fetchDetails();
      }
    } catch (err) {
      setSubDeptError(err.response?.data?.message || 'Failed to create sub-department.');
    }
  };

  const handleDeleteSubDept = async (subDept) => {
    const empCount = (details?.employees || []).filter(e => e.sub_department_id === subDept.id).length;
    if (empCount > 0) {
      alert(`Cannot delete sub-department "${subDept.name}" because it currently has ${empCount} assigned employee(s). Please reassign or delete the employees first.`);
      return;
    }

    if (!(await window.confirm(`Are you sure you want to delete the "${subDept.name}" sub-department?`))) return;

    try {
      const res = await api.delete(`/departments/sub-departments/${subDept.id}`);
      if (res.data.success) {
        fetchDetails();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete sub-department.');
    }
  };

  // Open Employee Modal
  const handleOpenAddEmployee = (subDeptId = '') => {
    setCurrentEmployee(null);
    setEmpForm({
      full_name: '',
      username: '',
      password: '',
      email: '',
      phone: '',
      reporting_manager_id: '',
      joining_date: new Date().toISOString().split('T')[0],
      status: 'active',
      profile_image: null,
      sub_department_id: subDeptId || ''
    });
    setEmpErrors({});
    setEmpSubmitError('');
    setIsEmployeeModalOpen(true);
  };

  const handleOpenEditEmployee = (emp) => {
    setCurrentEmployee(emp);
    setEmpForm({
      full_name: emp.full_name,
      username: emp.username,
      password: '',
      email: emp.email,
      phone: emp.phone,
      reporting_manager_id: emp.reporting_manager_id || '',
      joining_date: emp.joining_date ? emp.joining_date.substring(0, 10) : '',
      status: emp.status,
      profile_image: emp.profile_image || null,
      sub_department_id: emp.sub_department_id || ''
    });
    setEmpErrors({});
    setEmpSubmitError('');
    setIsEmployeeModalOpen(true);
  };

  const validateEmployeeForm = () => {
    const errors = {};
    if (!empForm.full_name.trim()) errors.full_name = 'Full name is required.';
    if (!currentEmployee) {
      if (!empForm.username.trim() || empForm.username.trim().length < 3) {
        errors.username = 'Username must be at least 3 characters.';
      }
      if (!empForm.password.trim() || empForm.password.trim().length < 6) {
        errors.password = 'Initial password must be at least 6 characters.';
      }
    }
    if (!empForm.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(empForm.email)) {
      errors.email = 'Valid email is required.';
    }
    if (!empForm.phone.trim() || !/^\+?[0-9\s\-()]{10,20}$/.test(empForm.phone)) {
      errors.phone = 'Valid phone number is required.';
    }
    setEmpErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleEmployeeSubmit = async (e) => {
    e.preventDefault();
    if (!validateEmployeeForm()) return;
    setEmpSubmitError('');

    try {
      const payload = {
        ...empForm,
        department_id: Number(deptId),
        sub_department_id: empForm.sub_department_id ? Number(empForm.sub_department_id) : null
      };

      let res;
      if (currentEmployee) {
        try {
          res = await api.post(`/users/employees/${currentEmployee.id}/update`, payload);
        } catch (_) {
          res = await api.put(`/users/employees/${currentEmployee.id}`, payload);
        }
      } else {
        res = await api.post('/users/employees', payload);
      }

      if (res.data.success) {
        setIsEmployeeModalOpen(false);
        setCurrentEmployee(null);
        fetchDetails();
      }
    } catch (err) {
      setEmpSubmitError(err.response?.data?.message || 'Failed to save employee.');
    }
  };

  const handleDeleteEmployee = async (id) => {
    if (!(await window.confirm('Are you sure you want to delete this employee?'))) return;
    try {
      let res;
      try {
        res = await api.post(`/users/employees/${id}/delete`);
      } catch (_) {
        res = await api.delete(`/users/employees/${id}`);
      }
      if (res.data.success) {
        fetchDetails();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete employee.');
    }
  };

  const handleToggleEmployeeStatus = async (emp) => {
    const nextStatus = emp.status === 'active' ? 'inactive' : 'active';
    try {
      const res = await api.post('/users/change-status', {
        profileId: emp.id,
        userType: 'employee',
        status: nextStatus
      });
      if (res.data.success) {
        fetchDetails();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to toggle status.');
    }
  };

  // Open Manager Modal
  const handleOpenAddManager = () => {
    setCurrentManager(null);
    setMgrForm({
      full_name: '',
      username: '',
      password: '',
      email: '',
      phone: '',
      branch: 'Main Office',
      joining_date: new Date().toISOString().split('T')[0],
      status: 'active',
      profile_image: null,
      sub_department_id: ''
    });
    setMgrErrors({});
    setMgrSubmitError('');
    setIsManagerModalOpen(true);
  };

  const handleOpenEditManager = (mgr) => {
    setCurrentManager(mgr);
    setMgrForm({
      full_name: mgr.full_name,
      username: mgr.username,
      password: '',
      email: mgr.email,
      phone: mgr.phone,
      branch: mgr.branch || 'Main Office',
      joining_date: mgr.joining_date ? mgr.joining_date.substring(0, 10) : '',
      status: mgr.status,
      profile_image: mgr.profile_image || null,
      sub_department_id: mgr.sub_department_id || ''
    });
    setMgrErrors({});
    setMgrSubmitError('');
    setIsManagerModalOpen(true);
  };

  const validateManagerForm = () => {
    const errors = {};
    if (!mgrForm.full_name.trim()) errors.full_name = 'Full name is required.';
    if (!currentManager) {
      if (!mgrForm.username.trim() || mgrForm.username.trim().length < 3) {
        errors.username = 'Username must be at least 3 characters.';
      }
      if (!mgrForm.password.trim() || mgrForm.password.trim().length < 6) {
        errors.password = 'Initial password must be at least 6 characters.';
      }
    }
    if (!mgrForm.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mgrForm.email)) {
      errors.email = 'Valid email is required.';
    }
    if (!mgrForm.phone.trim() || !/^\+?[0-9\s\-()]{10,20}$/.test(mgrForm.phone)) {
      errors.phone = 'Valid phone number is required.';
    }
    if (!mgrForm.branch.trim()) errors.branch = 'Work branch office is required.';
    setMgrErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleManagerSubmit = async (e) => {
    e.preventDefault();
    if (!validateManagerForm()) return;
    setMgrSubmitError('');

    try {
      const payload = {
        ...mgrForm,
        department_id: Number(deptId),
        sub_department_id: mgrForm.sub_department_id ? Number(mgrForm.sub_department_id) : null
      };

      let res;
      if (currentManager) {
        try {
          res = await api.post(`/users/managers/${currentManager.id}/update`, payload);
        } catch (_) {
          res = await api.put(`/users/managers/${currentManager.id}`, payload);
        }
      } else {
        res = await api.post('/users/managers', payload);
      }

      if (res.data.success) {
        setIsManagerModalOpen(false);
        setCurrentManager(null);
        fetchDetails();
      }
    } catch (err) {
      setMgrSubmitError(err.response?.data?.message || 'Failed to save manager.');
    }
  };

  const handleDeleteManager = async (id) => {
    if (!(await window.confirm('Are you sure you want to delete this manager?'))) return;
    try {
      let res;
      try {
        res = await api.post(`/users/managers/${id}/delete`);
      } catch (_) {
        res = await api.delete(`/users/managers/${id}`);
      }
      if (res?.data?.success || res?.status === 200) {
        fetchDetails();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete manager.');
    }
  };

  const handleToggleManagerStatus = async (mgr) => {
    const nextStatus = mgr.status === 'active' ? 'inactive' : 'active';
    try {
      const res = await api.post('/users/change-status', {
        profileId: mgr.id,
        userType: 'manager',
        status: nextStatus
      });
      if (res.data.success) {
        fetchDetails();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to toggle status.');
    }
  };

  // Open Reset Password
  const handleOpenResetPassword = (userObj, type) => {
    setTargetUserForReset({ id: userObj.id, name: userObj.full_name, type });
    setNewPassword('');
    setResetError('');
    setIsResetPasswordModalOpen(true);
  };

  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      setResetError('Password must be at least 6 characters.');
      return;
    }
    try {
      const res = await api.post('/users/reset-password', {
        profileId: targetUserForReset.id,
        userType: targetUserForReset.type,
        newPassword
      });
      if (res.data.success) {
        setIsResetPasswordModalOpen(false);
        setNewPassword('');
        setTargetUserForReset(null);
        alert('Password updated successfully.');
      }
    } catch (err) {
      setResetError(err.response?.data?.message || 'Failed to reset password.');
    }
  };

  // Filtered views
  const department = details?.department || {};
  const allManagers = details?.allManagers || [];
  const subDepartments = details?.subDepartments || [];
  const employees = details?.employees || [];
  const clients = details?.clients || [];
  const employeeEfficiency = details?.employeeEfficiency || [];
  const managerEfficiency = details?.managerEfficiency || [];
  const stats = details?.stats || {
    totalEmployees: employees.length,
    activeEmployees: employees.filter(e => e.status === 'active').length,
    totalManagers: allManagers.length,
    activeManagers: allManagers.filter(m => m.status === 'active').length,
    totalSubDepartments: subDepartments.length,
    totalClients: clients.length,
    avgEmployeeEfficiency: 100,
    avgManagerEfficiency: 100
  };

  // Filtered Employees
  const filteredEmployees = useMemo(() => {
    return employees.filter(emp => {
      const matchSearch = !empSearch.trim() || 
        emp.full_name?.toLowerCase().includes(empSearch.toLowerCase()) ||
        emp.employee_id_code?.toLowerCase().includes(empSearch.toLowerCase()) ||
        emp.email?.toLowerCase().includes(empSearch.toLowerCase()) ||
        emp.username?.toLowerCase().includes(empSearch.toLowerCase());
      
      const matchSubDept = !empSubDeptFilter || 
        String(emp.sub_department_id) === String(empSubDeptFilter) || 
        (empSubDeptFilter === 'direct' && !emp.sub_department_id);

      const matchStatus = !empStatusFilter || emp.status === empStatusFilter;

      return matchSearch && matchSubDept && matchStatus;
    });
  }, [employees, empSearch, empSubDeptFilter, empStatusFilter]);

  // Filtered Managers
  const filteredManagers = useMemo(() => {
    return allManagers.filter(mgr => {
      const matchSearch = !mgrSearch.trim() || 
        mgr.full_name?.toLowerCase().includes(mgrSearch.toLowerCase()) ||
        mgr.manager_id_code?.toLowerCase().includes(mgrSearch.toLowerCase()) ||
        mgr.email?.toLowerCase().includes(mgrSearch.toLowerCase());

      const matchStatus = !mgrStatusFilter || mgr.status === mgrStatusFilter;

      return matchSearch && matchStatus;
    });
  }, [allManagers, mgrSearch, mgrStatusFilter]);

  // Filtered Clients
  const filteredClients = useMemo(() => {
    return clients.filter(c => {
      return !clientSearch.trim() || 
        c.company_name?.toLowerCase().includes(clientSearch.toLowerCase()) ||
        c.client_name?.toLowerCase().includes(clientSearch.toLowerCase()) ||
        c.client_id_code?.toLowerCase().includes(clientSearch.toLowerCase()) ||
        c.industry?.toLowerCase().includes(clientSearch.toLowerCase());
    });
  }, [clients, clientSearch]);

  // Filtered Sub-departments
  const filteredSubDepts = useMemo(() => {
    return subDepartments.filter(sd => {
      return !subDeptSearch.trim() ||
        sd.name?.toLowerCase().includes(subDeptSearch.toLowerCase()) ||
        sd.code?.toLowerCase().includes(subDeptSearch.toLowerCase());
    });
  }, [subDepartments, subDeptSearch]);

  const managerOptions = allManagers
    .filter(mgr => mgr.status === 'active')
    .map(mgr => ({ value: mgr.id, label: `${mgr.full_name} (${mgr.manager_id_code})` }));

  if (loading && !details) {
    return (
      <div style={{ padding: '80px', textAlign: 'center', color: 'var(--text-muted)' }}>
        <div className="spinner" style={{ margin: '0 auto 16px auto' }}></div>
        <span style={{ fontWeight: 600, fontSize: '15px' }}>Loading department workspace...</span>
      </div>
    );
  }

  if (error || !details) {
    return (
      <div style={{ padding: '60px 20px', textAlign: 'center' }}>
        <p className="text-danger" style={{ fontWeight: 700, fontSize: '16px', marginBottom: '16px' }}>
          {error || 'Department workspace could not be loaded.'}
        </p>
        <button 
          className="btn btn-secondary" 
          onClick={onBack}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
        >
          <ArrowLeft size={16} /> Back to Departments
        </button>
      </div>
    );
  }

  const getDeptIconName = (code = '', name = '') => {
    const normalized = (code + ' ' + name).toLowerCase();
    if (normalized.includes('cd') || normalized.includes('creat') || normalized.includes('design')) return 'creativesTeam';
    if (normalized.includes('smm') || normalized.includes('social') || normalized.includes('media') || normalized.includes('cmp') || normalized.includes('campaign') || normalized.includes('ads')) return 'campaignTeam';
    if (normalized.includes('seo') || normalized.includes('search')) return 'seoTeam';
    if (normalized.includes('bd') || normalized.includes('business') || normalized.includes('sales')) return 'businessDevelopment';
    if (normalized.includes('hr') || normalized.includes('human')) return 'hr';
    return 'department';
  };

  return (
    <div className="dept-workspace-container">
      
      {/* Back Button */}
      <button 
        onClick={onBack} 
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 16px',
          backgroundColor: '#ffffff',
          border: '1px solid var(--border-color)',
          borderRadius: '8px',
          fontSize: '13px',
          fontWeight: 700,
          cursor: 'pointer',
          marginBottom: '20px',
          color: 'var(--text-main)',
          boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
          transition: 'all 0.15s ease'
        }}
      >
        <ArrowLeft size={16} />
        Back to All Departments
      </button>

      {/* Hero Header Card */}
      <div className="dept-workspace-hero">
        <div className="dept-workspace-hero-top">
          <div className="dept-hero-identity">
            <div 
              className="dept-hero-icon-large"
              style={{
                background: '#ffffff',
                border: '2px solid rgba(218, 167, 27, 0.3)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '6px'
              }}
            >
              <AppIcon name={getDeptIconName(department.code, department.name)} size={42} alt={department.name} />
            </div>

            <div className="dept-hero-title-group">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                <span className="dept-code-pill" style={{ background: '#fef3c7', color: '#92400e', border: '1px solid #fde68a' }}>
                  {department.code}
                </span>
                <span className={`badge ${department.status === 'active' ? 'badge-active' : 'badge-inactive'}`}>
                  {department.status === 'active' ? 'Active Unit' : 'Inactive Unit'}
                </span>
              </div>
              <h1>{department.name} Department</h1>
              <p className="dept-hero-desc">
                {department.description || 'Corporate operations, team personnel, project assignments, and productivity metrics.'}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Summary Pill Bar */}
        <div className="dept-hero-stats-bar">
          <div className="dept-hero-pill">
            <AppIcon name="employee" size={16} />
            <span>Employees: <strong>{stats.totalEmployees}</strong> ({stats.activeEmployees} active)</span>
          </div>
          <div className="dept-hero-pill">
            <AppIcon name="manager" size={16} />
            <span>Managers: <strong>{stats.totalManagers}</strong></span>
          </div>
          <div className="dept-hero-pill">
            <AppIcon name="department" size={16} />
            <span>Sub-departments: <strong>{stats.totalSubDepartments}</strong></span>
          </div>
          <div className="dept-hero-pill">
            <AppIcon name="clients" size={16} />
            <span>Clients: <strong>{stats.totalClients}</strong></span>
          </div>
          <div className="dept-hero-pill">
            <AppIcon name="report" size={16} />
            <span>Avg Efficiency: <strong style={{ color: stats.avgEmployeeEfficiency >= 80 ? '#059669' : '#d97706' }}>{stats.avgEmployeeEfficiency}%</strong></span>
          </div>
        </div>
      </div>

      {/* Modern Navigation Tabs Strip */}
      <div className="dept-tabs-nav-bar">
        <button 
          className={`dept-nav-tab ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          <LayoutDashboard size={16} />
          <span>Dashboard</span>
        </button>

        <button 
          className={`dept-nav-tab ${activeTab === 'sub_departments' ? 'active' : ''}`}
          onClick={() => setActiveTab('sub_departments')}
        >
          <AppIcon name="department" size={16} />
          <span>Sub-departments</span>
          <span className="dept-nav-tab-badge">{subDepartments.length}</span>
        </button>

        <button 
          className={`dept-nav-tab ${activeTab === 'employees' ? 'active' : ''}`}
          onClick={() => setActiveTab('employees')}
        >
          <AppIcon name="employee" size={16} />
          <span>Employees</span>
          <span className="dept-nav-tab-badge">{employees.length}</span>
        </button>

        <button 
          className={`dept-nav-tab ${activeTab === 'managers' ? 'active' : ''}`}
          onClick={() => setActiveTab('managers')}
        >
          <AppIcon name="manager" size={16} />
          <span>Managers</span>
          <span className="dept-nav-tab-badge">{allManagers.length}</span>
        </button>

        <button 
          className={`dept-nav-tab ${activeTab === 'clients' ? 'active' : ''}`}
          onClick={() => setActiveTab('clients')}
        >
          <AppIcon name="clients" size={16} />
          <span>Clients</span>
          <span className="dept-nav-tab-badge">{clients.length}</span>
        </button>

        <button 
          className={`dept-nav-tab ${activeTab === 'employee_efficiency' ? 'active' : ''}`}
          onClick={() => setActiveTab('employee_efficiency')}
        >
          <AppIcon name="report" size={16} />
          <span>Employee Efficiency</span>
        </button>

        <button 
          className={`dept-nav-tab ${activeTab === 'manager_efficiency' ? 'active' : ''}`}
          onClick={() => setActiveTab('manager_efficiency')}
        >
          <AppIcon name="report" size={16} />
          <span>Manager Efficiency</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: 📊 DASHBOARD OVERVIEW                                              */}
      {/* ========================================================================= */}
      {activeTab === 'dashboard' && (
        <div>
          {/* KPI Cards Row */}
          <div className="dept-kpi-row">
            <div className="dept-kpi-card">
              <div className="dept-kpi-icon" style={{ background: '#eff6ff', color: '#2563eb' }}>
                <AppIcon name="employee" size={24} />
              </div>
              <div className="dept-kpi-data">
                <span className="dept-kpi-val">{stats.totalEmployees}</span>
                <span className="dept-kpi-lbl">Total Employees</span>
              </div>
            </div>

            <div className="dept-kpi-card">
              <div className="dept-kpi-icon" style={{ background: '#ede9fe', color: '#7c3aed' }}>
                <AppIcon name="manager" size={24} />
              </div>
              <div className="dept-kpi-data">
                <span className="dept-kpi-val">{stats.totalManagers}</span>
                <span className="dept-kpi-lbl">Department Managers</span>
              </div>
            </div>

            <div className="dept-kpi-card">
              <div className="dept-kpi-icon" style={{ background: '#fef3c7', color: '#d97706' }}>
                <AppIcon name="department" size={24} />
              </div>
              <div className="dept-kpi-data">
                <span className="dept-kpi-val">{stats.totalSubDepartments}</span>
                <span className="dept-kpi-lbl">Sub-departments</span>
              </div>
            </div>

            <div className="dept-kpi-card">
              <div className="dept-kpi-icon" style={{ background: '#ecfdf5', color: '#059669' }}>
                <AppIcon name="clients" size={24} />
              </div>
              <div className="dept-kpi-data">
                <span className="dept-kpi-val">{stats.totalClients}</span>
                <span className="dept-kpi-lbl">Connected Clients</span>
              </div>
            </div>

            <div className="dept-kpi-card">
              <div className="dept-kpi-icon" style={{ background: '#fdf8e2', color: '#b45309' }}>
                <AppIcon name="report" size={24} />
              </div>
              <div className="dept-kpi-data">
                <span className="dept-kpi-val">{stats.avgEmployeeEfficiency}%</span>
                <span className="dept-kpi-lbl">Team Efficiency</span>
              </div>
            </div>
          </div>

          {/* Quick Actions Bar */}
          <div 
            style={{
              background: '#ffffff',
              border: '1px solid var(--border-color)',
              borderRadius: '14px',
              padding: '16px 20px',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px'
            }}
          >
            <div>
              <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 800, color: 'var(--text-main)' }}>
                Department Administrative Actions
              </h4>
              <span style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
                Register personnel or configure sub-department units for {department.name}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <button 
                className="btn btn-primary"
                onClick={() => handleOpenAddEmployee()}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}
              >
                <UserPlus size={15} /> Add Employee
              </button>
              <button 
                className="btn btn-secondary"
                onClick={handleOpenAddManager}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}
              >
                <Shield size={15} /> Add Manager
              </button>
              <button 
                className="btn btn-secondary"
                onClick={handleOpenAddSubDept}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}
              >
                <Plus size={15} /> Add Sub-department
              </button>
            </div>
          </div>

          {/* 2-Column Dashboard Sections */}
          <div className="dept-dash-grid">
            
            {/* Left Panel: Sub-department Units */}
            <div className="dept-dash-panel">
              <div className="dept-dash-panel-title">
                <span>Sub-departments ({subDepartments.length})</span>
                <button 
                  className="btn btn-secondary btn-sm"
                  onClick={() => setActiveTab('sub_departments')}
                  style={{ fontSize: '12px', padding: '4px 10px' }}
                >
                  View All
                </button>
              </div>

              {subDepartments.length === 0 ? (
                <div style={{ padding: '30px 10px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  <Layers size={32} style={{ color: '#cbd5e1', margin: '0 auto 8px auto' }} />
                  <p style={{ margin: 0, fontSize: '13.5px' }}>No sub-departments configured yet.</p>
                  <button 
                    onClick={handleOpenAddSubDept}
                    style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 700, cursor: 'pointer', marginTop: '6px' }}
                  >
                    + Add first sub-department
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {subDepartments.slice(0, 5).map(sd => (
                    <div 
                      key={sd.id}
                      style={{
                        padding: '12px 16px',
                        background: '#f8fafc',
                        borderRadius: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span className="dept-code-pill" style={{ fontSize: '10px', padding: '3px 8px' }}>{sd.code}</span>
                        <strong style={{ fontSize: '13.5px', color: 'var(--text-main)' }}>{sd.name}</strong>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '12px', color: 'var(--text-muted)' }}>
                        <span>👥 <strong>{sd.employee_count || 0}</strong> employees</span>
                        <span>👔 <strong>{sd.manager_count || 0}</strong> mgrs</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right Panel: Top Department Employees */}
            <div className="dept-dash-panel">
              <div className="dept-dash-panel-title">
                <span>Employees Overview ({employees.length})</span>
                <button 
                  className="btn btn-secondary btn-sm"
                  onClick={() => setActiveTab('employees')}
                  style={{ fontSize: '12px', padding: '4px 10px' }}
                >
                  Manage Employees
                </button>
              </div>

              {employees.length === 0 ? (
                <div style={{ padding: '30px 10px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  <Users size={32} style={{ color: '#cbd5e1', margin: '0 auto 8px auto' }} />
                  <p style={{ margin: 0, fontSize: '13.5px' }}>No employees registered in this department yet.</p>
                  <button 
                    onClick={() => handleOpenAddEmployee()}
                    style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 700, cursor: 'pointer', marginTop: '6px' }}
                  >
                    + Register employee now
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {employees.slice(0, 5).map(emp => (
                    <div 
                      key={emp.id}
                      style={{
                        padding: '10px 14px',
                        background: '#f8fafc',
                        borderRadius: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          background: '#e2e8f0',
                          color: '#475569',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 700,
                          fontSize: '12px'
                        }}>
                          {emp.full_name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <strong style={{ fontSize: '13px', color: 'var(--text-main)', display: 'block' }}>
                            {emp.full_name}
                          </strong>
                          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                            {emp.employee_id_code} {emp.sub_department_name ? `• ${emp.sub_department_name}` : ''}
                          </span>
                        </div>
                      </div>

                      <span className={`badge ${emp.status === 'active' ? 'badge-active' : 'badge-inactive'}`}>
                        {emp.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: 🏢 SUB-DEPARTMENTS                                                 */}
      {/* ========================================================================= */}
      {activeTab === 'sub_departments' && (
        <div>
          {/* Sub-departments Toolbar */}
          <div style={{
            background: '#ffffff',
            border: '1px solid var(--border-color)',
            borderRadius: '14px',
            padding: '14px 18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            marginBottom: '20px'
          }}>
            <div style={{ position: 'relative', width: '100%', maxWidth: '360px' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input
                type="text"
                placeholder="Search sub-departments..."
                value={subDeptSearch}
                onChange={(e) => setSubDeptSearch(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px 8px 36px',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  fontSize: '13px',
                  background: '#f8fafc'
                }}
              />
            </div>

            <button 
              className="btn btn-primary"
              onClick={handleOpenAddSubDept}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <Plus size={16} /> Add Sub-department
            </button>
          </div>

          {filteredSubDepts.length === 0 ? (
            <div style={{ background: '#ffffff', border: '1px dashed var(--border-color)', borderRadius: '14px', padding: '50px 20px', textAlign: 'center' }}>
              <Layers size={40} style={{ color: '#cbd5e1', margin: '0 auto 12px auto' }} />
              <h4 style={{ margin: '0 0 6px 0', fontSize: '16px', fontWeight: 800 }}>No Sub-departments</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '13.5px', margin: '0 auto 16px auto', maxWidth: '380px' }}>
                Break down {department.name} into specialized units (e.g. Content Writers, Designers, Video Editors).
              </p>
              <button className="btn btn-primary" onClick={handleOpenAddSubDept}>
                <Plus size={15} /> Create Sub-department
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
              {filteredSubDepts.map(sd => (
                <div 
                  key={sd.id}
                  style={{
                    background: '#ffffff',
                    border: '1px solid var(--border-color)',
                    borderRadius: '14px',
                    padding: '20px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                      <span className="dept-code-pill">{sd.code}</span>
                      <button 
                        onClick={() => handleDeleteSubDept(sd)}
                        title="Delete Sub-department"
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#94a3b8',
                          cursor: 'pointer',
                          padding: '4px'
                        }}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>

                    <h3 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 12px 0' }}>
                      {sd.name}
                    </h3>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', padding: '10px', background: '#f8fafc', borderRadius: '10px', marginBottom: '14px' }}>
                      <div style={{ textAlign: 'center' }}>
                        <span style={{ fontSize: '18px', fontWeight: 800, color: '#2563eb', display: 'block' }}>{sd.employee_count || 0}</span>
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>Employees</span>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <span style={{ fontSize: '18px', fontWeight: 800, color: '#7c3aed', display: 'block' }}>{sd.manager_count || 0}</span>
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>Managers</span>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', paddingTop: '10px', borderTop: '1px solid #f1f5f9' }}>
                    <button 
                      className="btn btn-secondary btn-sm"
                      onClick={() => {
                        setEmpSubDeptFilter(String(sd.id));
                        setActiveTab('employees');
                      }}
                      style={{ flex: 1, fontSize: '12px' }}
                    >
                      View Employees
                    </button>
                    <button 
                      className="btn btn-primary btn-sm"
                      onClick={() => handleOpenAddEmployee(String(sd.id))}
                      style={{ flex: 1, fontSize: '12px' }}
                    >
                      + Add Employee
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: 👥 EMPLOYEES                                                       */}
      {/* ========================================================================= */}
      {activeTab === 'employees' && (
        <div>
          {/* Employee Toolbar */}
          <div style={{
            background: '#ffffff',
            border: '1px solid var(--border-color)',
            borderRadius: '14px',
            padding: '14px 18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            marginBottom: '20px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', flex: 1, minWidth: '280px' }}>
              <div style={{ position: 'relative', width: '100%', maxWidth: '320px' }}>
                <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input
                  type="text"
                  placeholder="Search employees..."
                  value={empSearch}
                  onChange={(e) => setEmpSearch(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px 8px 36px',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    fontSize: '13px',
                    background: '#f8fafc'
                  }}
                />
              </div>

              <select
                value={empSubDeptFilter}
                onChange={(e) => setEmpSubDeptFilter(e.target.value)}
                style={{
                  padding: '8px 12px',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  fontSize: '13px',
                  background: '#ffffff'
                }}
              >
                <option value="">All Sub-departments</option>
                <option value="direct">Direct Department Roster</option>
                {subDepartments.map(sd => (
                  <option key={sd.id} value={sd.id}>{sd.name} ({sd.code})</option>
                ))}
              </select>

              <select
                value={empStatusFilter}
                onChange={(e) => setEmpStatusFilter(e.target.value)}
                style={{
                  padding: '8px 12px',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  fontSize: '13px',
                  background: '#ffffff'
                }}
              >
                <option value="">All Statuses</option>
                <option value="active">Active Only</option>
                <option value="inactive">Inactive Only</option>
              </select>
            </div>

            <button 
              className="btn btn-primary"
              onClick={() => handleOpenAddEmployee()}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <UserPlus size={16} /> Add Employee
            </button>
          </div>

          {/* Employees List */}
          {filteredEmployees.length === 0 ? (
            <div style={{ background: '#ffffff', border: '1px dashed var(--border-color)', borderRadius: '14px', padding: '50px 20px', textAlign: 'center' }}>
              <Users size={40} style={{ color: '#cbd5e1', margin: '0 auto 12px auto' }} />
              <h4 style={{ margin: '0 0 6px 0', fontSize: '16px', fontWeight: 800 }}>No Employees Found</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '13.5px', margin: '0 auto 16px auto', maxWidth: '380px' }}>
                {empSearch || empSubDeptFilter || empStatusFilter ? 'No employees match the selected filters.' : `No employees have been added to ${department.name} yet.`}
              </p>
              <button className="btn btn-primary" onClick={() => handleOpenAddEmployee()}>
                <UserPlus size={15} /> Add First Employee
              </button>
            </div>
          ) : (
            <div style={{ background: '#ffffff', border: '1px solid var(--border-color)', borderRadius: '14px', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13.5px' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '1px solid var(--border-color)' }}>
                    <th style={{ padding: '12px 16px', fontWeight: 800, color: 'var(--text-main)' }}>Employee</th>
                    <th style={{ padding: '12px 16px', fontWeight: 800, color: 'var(--text-main)' }}>Code / Sub-unit</th>
                    <th style={{ padding: '12px 16px', fontWeight: 800, color: 'var(--text-main)' }}>Contact</th>
                    <th style={{ padding: '12px 16px', fontWeight: 800, color: 'var(--text-main)' }}>Reporting Manager</th>
                    <th style={{ padding: '12px 16px', fontWeight: 800, color: 'var(--text-main)' }}>Status</th>
                    <th style={{ padding: '12px 16px', fontWeight: 800, color: 'var(--text-main)', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEmployees.map(emp => (
                    <tr key={emp.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            background: '#f1f5f9',
                            color: '#334155',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 800,
                            fontSize: '13px'
                          }}>
                            {emp.full_name?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <strong style={{ display: 'block', color: 'var(--text-main)' }}>{emp.full_name}</strong>
                            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>@{emp.username}</span>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <span className="dept-code-pill" style={{ fontSize: '11px' }}>{emp.employee_id_code}</span>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                          {emp.sub_department_name || 'Direct Roster'}
                        </div>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ fontSize: '13px', color: 'var(--text-main)' }}>{emp.email}</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{emp.phone}</div>
                      </td>
                      <td style={{ padding: '14px 16px', color: 'var(--text-muted)' }}>
                        {emp.reporting_manager_name || '—'}
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <span className={`badge ${emp.status === 'active' ? 'badge-active' : 'badge-inactive'}`}>
                          {emp.status}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '6px' }}>
                          <button 
                            className="dept-action-icon-btn"
                            onClick={() => handleOpenEditEmployee(emp)}
                            title="Edit Employee"
                          >
                            <Edit2 size={13} />
                          </button>
                          <button 
                            className="dept-action-icon-btn"
                            onClick={() => handleOpenResetPassword(emp, 'employee')}
                            title="Reset Password"
                          >
                            <Key size={13} />
                          </button>
                          <button 
                            className="dept-action-icon-btn"
                            onClick={() => handleToggleEmployeeStatus(emp)}
                            title={emp.status === 'active' ? 'Deactivate' : 'Activate'}
                          >
                            {emp.status === 'active' ? (
                              <Ban size={13} style={{ color: '#e11d48' }} />
                            ) : (
                              <CheckCircle size={13} style={{ color: '#059669' }} />
                            )}
                          </button>
                          <button 
                            className="dept-action-icon-btn danger"
                            onClick={() => handleDeleteEmployee(emp.id)}
                            title="Delete Employee"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: 👔 MANAGERS                                                         */}
      {/* ========================================================================= */}
      {activeTab === 'managers' && (
        <div>
          {/* Manager Toolbar */}
          <div style={{
            background: '#ffffff',
            border: '1px solid var(--border-color)',
            borderRadius: '14px',
            padding: '14px 18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            marginBottom: '20px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', flex: 1, minWidth: '280px' }}>
              <div style={{ position: 'relative', width: '100%', maxWidth: '320px' }}>
                <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input
                  type="text"
                  placeholder="Search managers..."
                  value={mgrSearch}
                  onChange={(e) => setMgrSearch(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px 8px 36px',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    fontSize: '13px',
                    background: '#f8fafc'
                  }}
                />
              </div>

              <select
                value={mgrStatusFilter}
                onChange={(e) => setMgrStatusFilter(e.target.value)}
                style={{
                  padding: '8px 12px',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  fontSize: '13px',
                  background: '#ffffff'
                }}
              >
                <option value="">All Statuses</option>
                <option value="active">Active Only</option>
                <option value="inactive">Inactive Only</option>
              </select>
            </div>

            <button 
              className="btn btn-primary"
              onClick={handleOpenAddManager}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <UserPlus size={16} /> Add Manager
            </button>
          </div>

          {filteredManagers.length === 0 ? (
            <div style={{ background: '#ffffff', border: '1px dashed var(--border-color)', borderRadius: '14px', padding: '50px 20px', textAlign: 'center' }}>
              <Shield size={40} style={{ color: '#cbd5e1', margin: '0 auto 12px auto' }} />
              <h4 style={{ margin: '0 0 6px 0', fontSize: '16px', fontWeight: 800 }}>No Managers Registered</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '13.5px', margin: '0 auto 16px auto', maxWidth: '380px' }}>
                {mgrSearch || mgrStatusFilter ? 'No managers match the selected criteria.' : `Assign a manager to lead ${department.name}.`}
              </p>
              <button className="btn btn-primary" onClick={handleOpenAddManager}>
                <UserPlus size={15} /> Add Department Manager
              </button>
            </div>
          ) : (
            <div style={{ background: '#ffffff', border: '1px solid var(--border-color)', borderRadius: '14px', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13.5px' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '1px solid var(--border-color)' }}>
                    <th style={{ padding: '12px 16px', fontWeight: 800, color: 'var(--text-main)' }}>Manager</th>
                    <th style={{ padding: '12px 16px', fontWeight: 800, color: 'var(--text-main)' }}>Code / Branch</th>
                    <th style={{ padding: '12px 16px', fontWeight: 800, color: 'var(--text-main)' }}>Contact</th>
                    <th style={{ padding: '12px 16px', fontWeight: 800, color: 'var(--text-main)' }}>Sub-department</th>
                    <th style={{ padding: '12px 16px', fontWeight: 800, color: 'var(--text-main)' }}>Status</th>
                    <th style={{ padding: '12px 16px', fontWeight: 800, color: 'var(--text-main)', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredManagers.map(mgr => (
                    <tr key={mgr.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            background: '#eff6ff',
                            color: '#1d4ed8',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 800,
                            fontSize: '13px'
                          }}>
                            {mgr.full_name?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <strong style={{ display: 'block', color: 'var(--text-main)' }}>{mgr.full_name}</strong>
                            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>@{mgr.username}</span>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <span className="dept-code-pill" style={{ fontSize: '11px' }}>{mgr.manager_id_code}</span>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                          {mgr.branch || 'Main Office'}
                        </div>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ fontSize: '13px', color: 'var(--text-main)' }}>{mgr.email}</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{mgr.phone}</div>
                      </td>
                      <td style={{ padding: '14px 16px', color: 'var(--text-muted)' }}>
                        {mgr.sub_department_name || 'Department-wide Lead'}
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <span className={`badge ${mgr.status === 'active' ? 'badge-active' : 'badge-inactive'}`}>
                          {mgr.status}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '6px' }}>
                          <button 
                            className="dept-action-icon-btn"
                            onClick={() => handleOpenEditManager(mgr)}
                            title="Edit Manager"
                          >
                            <Edit2 size={13} />
                          </button>
                          <button 
                            className="dept-action-icon-btn"
                            onClick={() => handleOpenResetPassword(mgr, 'manager')}
                            title="Reset Password"
                          >
                            <Key size={13} />
                          </button>
                          <button 
                            className="dept-action-icon-btn"
                            onClick={() => handleToggleManagerStatus(mgr)}
                            title={mgr.status === 'active' ? 'Deactivate' : 'Activate'}
                          >
                            {mgr.status === 'active' ? (
                              <Ban size={13} style={{ color: '#e11d48' }} />
                            ) : (
                              <CheckCircle size={13} style={{ color: '#059669' }} />
                            )}
                          </button>
                          <button 
                            className="dept-action-icon-btn danger"
                            onClick={() => handleDeleteManager(mgr.id)}
                            title="Delete Manager"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: 🤝 CLIENTS WORKING WITH THIS DEPARTMENT                            */}
      {/* ========================================================================= */}
      {activeTab === 'clients' && (
        <div>
          {/* Client Search Toolbar */}
          <div style={{
            background: '#ffffff',
            border: '1px solid var(--border-color)',
            borderRadius: '14px',
            padding: '14px 18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            marginBottom: '20px'
          }}>
            <div style={{ position: 'relative', width: '100%', maxWidth: '360px' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input
                type="text"
                placeholder="Search clients by name, code or industry..."
                value={clientSearch}
                onChange={(e) => setClientSearch(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px 8px 36px',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  fontSize: '13px',
                  background: '#f8fafc'
                }}
              />
            </div>

            <div style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 600 }}>
              Showing {filteredClients.length} connected client(s)
            </div>
          </div>

          {filteredClients.length === 0 ? (
            <div style={{ background: '#ffffff', border: '1px dashed var(--border-color)', borderRadius: '14px', padding: '50px 20px', textAlign: 'center' }}>
              <Briefcase size={40} style={{ color: '#cbd5e1', margin: '0 auto 12px auto' }} />
              <h4 style={{ margin: '0 0 6px 0', fontSize: '16px', fontWeight: 800 }}>No Clients Currently Connected</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '13.5px', margin: '0 auto 16px auto', maxWidth: '420px' }}>
                Clients are automatically connected when projects or deliverables are assigned to {department.name}.
              </p>
              <a 
                href="/admin/clients"
                className="btn btn-secondary"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <span>View All Corporate Clients</span>
                <ExternalLink size={14} />
              </a>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
              {filteredClients.map(c => (
                <div 
                  key={c.id}
                  style={{
                    background: '#ffffff',
                    border: '1px solid var(--border-color)',
                    borderRadius: '14px',
                    padding: '20px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <span className="dept-code-pill">{c.client_id_code}</span>
                      <span className={`badge ${c.status === 'active' ? 'badge-active' : 'badge-inactive'}`}>
                        {c.status}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 4px 0' }}>
                      {c.company_name}
                    </h3>
                    <span style={{ fontSize: '12.5px', color: 'var(--text-muted)', display: 'block', marginBottom: '14px' }}>
                      {c.industry || 'Enterprise Partner'}
                    </span>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', padding: '10px', background: '#f8fafc', borderRadius: '10px', marginBottom: '14px' }}>
                      <div style={{ textAlign: 'center' }}>
                        <span style={{ fontSize: '18px', fontWeight: 800, color: '#2563eb', display: 'block' }}>{c.project_count || 0}</span>
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>Dept Projects</span>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <span style={{ fontSize: '18px', fontWeight: 800, color: '#059669', display: 'block' }}>{c.deliverable_count || 0}</span>
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>Deliverables</span>
                      </div>
                    </div>

                    <div style={{ fontSize: '12.5px', color: '#475569', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      {c.contact_person && <div>👤 {c.contact_person}</div>}
                      {c.email && <div>✉️ {c.email}</div>}
                      {c.phone && <div>📞 {c.phone}</div>}
                    </div>
                  </div>

                  <div style={{ paddingTop: '14px', borderTop: '1px solid #f1f5f9', marginTop: '14px' }}>
                    <a 
                      href={`/admin/clients?id=${c.id}`}
                      className="btn btn-secondary btn-sm"
                      style={{ width: '100%', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                    >
                      <span>Open Client Profile</span>
                      <ExternalLink size={13} />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 6: ⚡ EMPLOYEE EFFICIENCY                                             */}
      {/* ========================================================================= */}
      {activeTab === 'employee_efficiency' && (
        <div>
          {/* Header Banner */}
          <div style={{
            background: 'linear-gradient(135deg, #fef3c7 0%, #fffbeb 100%)',
            border: '1px solid #fde68a',
            borderRadius: '14px',
            padding: '18px 24px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 850, color: '#92400e' }}>
                {department.name} Employee Efficiency Metrics
              </h3>
              <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#b45309' }}>
                Real-time tracking of task deliveries, completion velocity, and individual employee performance
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#b45309', display: 'block' }}>
                  Average Unit Score
                </span>
                <span style={{ fontSize: '24px', fontWeight: 900, color: '#92400e' }}>
                  {stats.avgEmployeeEfficiency}%
                </span>
              </div>
            </div>
          </div>

          {employeeEfficiency.length === 0 ? (
            <div style={{ background: '#ffffff', border: '1px dashed var(--border-color)', borderRadius: '14px', padding: '50px 20px', textAlign: 'center' }}>
              <Zap size={40} style={{ color: '#cbd5e1', margin: '0 auto 12px auto' }} />
              <h4 style={{ margin: '0 0 6px 0', fontSize: '16px', fontWeight: 800 }}>No Performance Records</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '13.5px', margin: 0 }}>
                Employees will appear here once tasks and deliverables are tracked.
              </p>
            </div>
          ) : (
            <div style={{ background: '#ffffff', border: '1px solid var(--border-color)', borderRadius: '14px', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13.5px' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '1px solid var(--border-color)' }}>
                    <th style={{ padding: '12px 16px', fontWeight: 800, color: 'var(--text-main)' }}>Employee</th>
                    <th style={{ padding: '12px 16px', fontWeight: 800, color: 'var(--text-main)' }}>Sub-department</th>
                    <th style={{ padding: '12px 16px', fontWeight: 800, color: 'var(--text-main)' }}>Total Tasks</th>
                    <th style={{ padding: '12px 16px', fontWeight: 800, color: 'var(--text-main)' }}>Completed</th>
                    <th style={{ padding: '12px 16px', fontWeight: 800, color: 'var(--text-main)' }}>Pending</th>
                    <th style={{ padding: '12px 16px', fontWeight: 800, color: 'var(--text-main)', width: '220px' }}>Efficiency Score</th>
                    <th style={{ padding: '12px 16px', fontWeight: 800, color: 'var(--text-main)', textAlign: 'right' }}>Performance Status</th>
                  </tr>
                </thead>
                <tbody>
                  {employeeEfficiency.map(emp => {
                    const eff = emp.efficiency || 0;
                    let barColor = '#10b981';
                    let badgeClass = 'badge-active';
                    let label = 'Top Performer';

                    if (eff < 50) {
                      barColor = '#ef4444';
                      badgeClass = 'badge-inactive';
                      label = 'Needs Attention';
                    } else if (eff < 75) {
                      barColor = '#f59e0b';
                      badgeClass = 'badge-warning';
                      label = 'Average';
                    } else if (eff < 90) {
                      barColor = '#3b82f6';
                      badgeClass = 'badge-info';
                      label = 'Good';
                    }

                    return (
                      <tr key={emp.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '14px 16px' }}>
                          <strong style={{ display: 'block', color: 'var(--text-main)' }}>{emp.full_name}</strong>
                          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{emp.employee_id_code}</span>
                        </td>
                        <td style={{ padding: '14px 16px', color: 'var(--text-muted)' }}>
                          {emp.sub_department_name || 'Direct Roster'}
                        </td>
                        <td style={{ padding: '14px 16px', fontWeight: 700 }}>
                          {emp.total_tasks}
                        </td>
                        <td style={{ padding: '14px 16px', color: '#059669', fontWeight: 700 }}>
                          {emp.completed_tasks}
                        </td>
                        <td style={{ padding: '14px 16px', color: '#d97706', fontWeight: 700 }}>
                          {emp.pending_tasks}
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <div className="dept-eff-bar-wrapper">
                            <div className="dept-eff-bar-bg">
                              <div 
                                className="dept-eff-bar-fill" 
                                style={{ width: `${Math.min(eff, 100)}%`, background: barColor }} 
                              />
                            </div>
                            <span className="dept-eff-pct" style={{ color: barColor }}>{eff}%</span>
                          </div>
                        </td>
                        <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                          <span className={`badge ${badgeClass}`} style={{ fontSize: '11.5px', padding: '4px 10px' }}>
                            {label}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 7: 🏆 MANAGER EFFICIENCY                                              */}
      {/* ========================================================================= */}
      {activeTab === 'manager_efficiency' && (
        <div>
          {/* Header Banner */}
          <div style={{
            background: 'linear-gradient(135deg, #ede9fe 0%, #f5f3ff 100%)',
            border: '1px solid #ddd6fe',
            borderRadius: '14px',
            padding: '18px 24px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 850, color: '#5b21b6' }}>
                {department.name} Leadership Efficiency
              </h3>
              <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#6d28d9' }}>
                Supervisory throughput, team delivery rates, and review turnaround metrics
              </p>
            </div>

            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#6d28d9', display: 'block' }}>
                Overall Leadership Rating
              </span>
              <span style={{ fontSize: '24px', fontWeight: 900, color: '#5b21b6' }}>
                {stats.avgManagerEfficiency}%
              </span>
            </div>
          </div>

          {managerEfficiency.length === 0 ? (
            <div style={{ background: '#ffffff', border: '1px dashed var(--border-color)', borderRadius: '14px', padding: '50px 20px', textAlign: 'center' }}>
              <Award size={40} style={{ color: '#cbd5e1', margin: '0 auto 12px auto' }} />
              <h4 style={{ margin: '0 0 6px 0', fontSize: '16px', fontWeight: 800 }}>No Manager Performance Records</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '13.5px', margin: 0 }}>
                Managers assigned to this department will display their supervised throughput here.
              </p>
            </div>
          ) : (
            <div style={{ background: '#ffffff', border: '1px solid var(--border-color)', borderRadius: '14px', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13.5px' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '1px solid var(--border-color)' }}>
                    <th style={{ padding: '12px 16px', fontWeight: 800, color: 'var(--text-main)' }}>Manager</th>
                    <th style={{ padding: '12px 16px', fontWeight: 800, color: 'var(--text-main)' }}>Manager Code</th>
                    <th style={{ padding: '12px 16px', fontWeight: 800, color: 'var(--text-main)' }}>Team Size</th>
                    <th style={{ padding: '12px 16px', fontWeight: 800, color: 'var(--text-main)' }}>Assigned Deliverables</th>
                    <th style={{ padding: '12px 16px', fontWeight: 800, color: 'var(--text-main)' }}>Completed & Approved</th>
                    <th style={{ padding: '12px 16px', fontWeight: 800, color: 'var(--text-main)', width: '220px' }}>Team Delivery Rate</th>
                    <th style={{ padding: '12px 16px', fontWeight: 800, color: 'var(--text-main)', textAlign: 'right' }}>Leadership Status</th>
                  </tr>
                </thead>
                <tbody>
                  {managerEfficiency.map(mgr => {
                    const eff = mgr.efficiency || 0;
                    let barColor = '#10b981';
                    let label = 'Excellent';
                    let badgeClass = 'badge-active';

                    if (eff < 50) {
                      barColor = '#ef4444';
                      label = 'Critical';
                      badgeClass = 'badge-inactive';
                    } else if (eff < 75) {
                      barColor = '#f59e0b';
                      label = 'Moderate';
                      badgeClass = 'badge-warning';
                    } else if (eff < 90) {
                      barColor = '#3b82f6';
                      label = 'Strong';
                      badgeClass = 'badge-info';
                    }

                    return (
                      <tr key={mgr.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '14px 16px' }}>
                          <strong style={{ display: 'block', color: 'var(--text-main)' }}>{mgr.full_name}</strong>
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <span className="dept-code-pill" style={{ fontSize: '11px' }}>{mgr.manager_id_code}</span>
                        </td>
                        <td style={{ padding: '14px 16px', color: '#2563eb', fontWeight: 700 }}>
                          👥 {mgr.team_size || 0} Employees
                        </td>
                        <td style={{ padding: '14px 16px', fontWeight: 700 }}>
                          {mgr.total_tasks}
                        </td>
                        <td style={{ padding: '14px 16px', color: '#059669', fontWeight: 700 }}>
                          {mgr.completed_tasks}
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <div className="dept-eff-bar-wrapper">
                            <div className="dept-eff-bar-bg">
                              <div 
                                className="dept-eff-bar-fill" 
                                style={{ width: `${Math.min(eff, 100)}%`, background: barColor }} 
                              />
                            </div>
                            <span className="dept-eff-pct" style={{ color: barColor }}>{eff}%</span>
                          </div>
                        </td>
                        <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                          <span className={`badge ${badgeClass}`} style={{ fontSize: '11.5px', padding: '4px 10px' }}>
                            {label}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: ADD SUB-DEPARTMENT                                               */}
      {/* ========================================================================= */}
      <Modal
        isOpen={isSubDeptModalOpen}
        onClose={() => setIsSubDeptModalOpen(false)}
        title={`Create Sub-department in ${department.name}`}
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setIsSubDeptModalOpen(false)}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleSubDeptSubmit}>
              Create Sub-department
            </button>
          </>
        }
      >
        <form onSubmit={handleSubDeptSubmit}>
          {subDeptError && (
            <div style={{
              padding: '10px 14px',
              backgroundColor: 'var(--danger-light)',
              color: 'var(--danger)',
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: 600,
              marginBottom: '16px'
            }}>
              {subDeptError}
            </div>
          )}

          <FormInput
            label="Sub-department Name"
            name="name"
            value={subDeptForm.name}
            onChange={(e) => setSubDeptForm(prev => ({ ...prev, name: e.target.value }))}
            placeholder="e.g. Content Writers, Graphic Designers"
            required
          />

          <FormInput
            label="Code Prefix"
            name="code"
            value={subDeptForm.code}
            onChange={(e) => setSubDeptForm(prev => ({ ...prev, code: e.target.value }))}
            placeholder="e.g. CW-RS, GD-RS, VD-RS"
            required
          />
        </form>
      </Modal>

      {/* ========================================================================= */}
      {/* MODAL 2: REGISTER / EDIT EMPLOYEE                                         */}
      {/* ========================================================================= */}
      <Modal
        isOpen={isEmployeeModalOpen}
        onClose={() => setIsEmployeeModalOpen(false)}
        title={currentEmployee ? `Edit Employee Profile` : `Register Employee in ${department.name}`}
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setIsEmployeeModalOpen(false)}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleEmployeeSubmit}>
              {currentEmployee ? 'Save Changes' : 'Register Employee'}
            </button>
          </>
        }
      >
        <form onSubmit={handleEmployeeSubmit}>
          {empSubmitError && (
            <div style={{
              padding: '10px 14px',
              backgroundColor: 'var(--danger-light)',
              color: 'var(--danger)',
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: 600,
              marginBottom: '16px'
            }}>
              {empSubmitError}
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Department</label>
              <input type="text" className="form-control" value={department.name} disabled style={{ backgroundColor: '#f1f5f9' }} />
            </div>

            <FormSelect
              label="Sub-department"
              name="sub_department_id"
              value={empForm.sub_department_id}
              onChange={(e) => setEmpForm(prev => ({ ...prev, sub_department_id: e.target.value }))}
              options={subDepartments.map(sd => ({ value: sd.id, label: `${sd.name} (${sd.code})` }))}
              emptyOptionLabel="Direct Department Roster"
            />
          </div>

          <FormInput
            label="Full Name"
            name="full_name"
            value={empForm.full_name}
            onChange={(e) => setEmpForm(prev => ({ ...prev, full_name: e.target.value }))}
            error={empErrors.full_name}
            placeholder="Enter employee's full name"
            required
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <FormInput
              label="Username"
              name="username"
              value={empForm.username}
              onChange={(e) => setEmpForm(prev => ({ ...prev, username: e.target.value }))}
              error={empErrors.username}
              placeholder="Username for login"
              required={!currentEmployee}
              disabled={!!currentEmployee}
            />

            {!currentEmployee ? (
              <FormInput
                label="Initial Password"
                name="password"
                type="password"
                value={empForm.password}
                onChange={(e) => setEmpForm(prev => ({ ...prev, password: e.target.value }))}
                error={empErrors.password}
                placeholder="Min 6 characters"
                required
              />
            ) : (
              <div className="form-group">
                <label className="form-label">Password</label>
                <input type="text" className="form-control" value="••••••••" disabled style={{ backgroundColor: '#f1f5f9' }} />
              </div>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <FormInput
              label="Email Address"
              name="email"
              type="email"
              value={empForm.email}
              onChange={(e) => setEmpForm(prev => ({ ...prev, email: e.target.value }))}
              error={empErrors.email}
              placeholder="email@reachskyline.com"
              required
            />
            <FormInput
              label="Phone Number"
              name="phone"
              value={empForm.phone}
              onChange={(e) => setEmpForm(prev => ({ ...prev, phone: e.target.value }))}
              error={empErrors.phone}
              placeholder="e.g. 9876543210"
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <FormSelect
              label="Reporting Manager (Optional)"
              name="reporting_manager_id"
              value={empForm.reporting_manager_id}
              onChange={(e) => setEmpForm(prev => ({ ...prev, reporting_manager_id: e.target.value }))}
              options={managerOptions}
              error={empErrors.reporting_manager_id}
              emptyOptionLabel="No Reporting Manager (Independent)"
            />
            <FormInput
              label="Joining Date"
              name="joining_date"
              type="date"
              value={empForm.joining_date}
              onChange={(e) => setEmpForm(prev => ({ ...prev, joining_date: e.target.value }))}
              required
            />
          </div>

          <FormSelect
            label="Status"
            name="status"
            value={empForm.status}
            onChange={(e) => setEmpForm(prev => ({ ...prev, status: e.target.value }))}
            options={[
              { value: 'active', label: 'Active' },
              { value: 'inactive', label: 'Inactive' }
            ]}
            required
          />
        </form>
      </Modal>

      {/* ========================================================================= */}
      {/* MODAL 3: REGISTER / EDIT MANAGER                                          */}
      {/* ========================================================================= */}
      <Modal
        isOpen={isManagerModalOpen}
        onClose={() => setIsManagerModalOpen(false)}
        title={currentManager ? `Edit Manager Profile` : `Register Manager in ${department.name}`}
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setIsManagerModalOpen(false)}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleManagerSubmit}>
              {currentManager ? 'Save Changes' : 'Register Manager'}
            </button>
          </>
        }
      >
        <form onSubmit={handleManagerSubmit}>
          {mgrSubmitError && (
            <div style={{
              padding: '10px 14px',
              backgroundColor: 'var(--danger-light)',
              color: 'var(--danger)',
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: 600,
              marginBottom: '16px'
            }}>
              {mgrSubmitError}
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Parent Department</label>
              <input type="text" className="form-control" value={department.name} disabled style={{ backgroundColor: '#f1f5f9' }} />
            </div>

            <FormSelect
              label="Sub-department Assignment (Optional)"
              name="sub_department_id"
              value={mgrForm.sub_department_id}
              onChange={(e) => setMgrForm(prev => ({ ...prev, sub_department_id: e.target.value }))}
              options={subDepartments.map(sd => ({ value: sd.id, label: `${sd.name} (${sd.code})` }))}
              emptyOptionLabel="None (Direct Department Manager)"
            />
          </div>

          <FormInput
            label="Full Name"
            name="full_name"
            value={mgrForm.full_name}
            onChange={(e) => setMgrForm(prev => ({ ...prev, full_name: e.target.value }))}
            error={mgrErrors.full_name}
            placeholder="Enter manager's full name"
            required
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <FormInput
              label="Username"
              name="username"
              value={mgrForm.username}
              onChange={(e) => setMgrForm(prev => ({ ...prev, username: e.target.value }))}
              error={mgrErrors.username}
              placeholder="Username for login"
              required={!currentManager}
              disabled={!!currentManager}
            />

            {!currentManager ? (
              <FormInput
                label="Initial Password"
                name="password"
                type="password"
                value={mgrForm.password}
                onChange={(e) => setMgrForm(prev => ({ ...prev, password: e.target.value }))}
                error={mgrErrors.password}
                placeholder="Min 6 characters"
                required
              />
            ) : (
              <div className="form-group">
                <label className="form-label">Password</label>
                <input type="text" className="form-control" value="••••••••" disabled style={{ backgroundColor: '#f1f5f9' }} />
              </div>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <FormInput
              label="Email Address"
              name="email"
              type="email"
              value={mgrForm.email}
              onChange={(e) => setMgrForm(prev => ({ ...prev, email: e.target.value }))}
              error={mgrErrors.email}
              placeholder="email@reachskyline.com"
              required
            />
            <FormInput
              label="Phone Number"
              name="phone"
              value={mgrForm.phone}
              onChange={(e) => setMgrForm(prev => ({ ...prev, phone: e.target.value }))}
              error={mgrErrors.phone}
              placeholder="e.g. 9876543210"
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <FormInput
              label="Branch Location"
              name="branch"
              value={mgrForm.branch}
              onChange={(e) => setMgrForm(prev => ({ ...prev, branch: e.target.value }))}
              error={mgrErrors.branch}
              placeholder="e.g. Main Office, Chennai"
              required
            />
            <FormInput
              label="Joining Date"
              name="joining_date"
              type="date"
              value={mgrForm.joining_date}
              onChange={(e) => setMgrForm(prev => ({ ...prev, joining_date: e.target.value }))}
              required
            />
          </div>
        </form>
      </Modal>

      {/* ========================================================================= */}
      {/* MODAL 4: RESET USER PASSWORD                                              */}
      {/* ========================================================================= */}
      <Modal
        isOpen={isResetPasswordModalOpen}
        onClose={() => setIsResetPasswordModalOpen(false)}
        title={`Reset Password for ${targetUserForReset?.name}`}
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setIsResetPasswordModalOpen(false)}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleResetPasswordSubmit}>
              Update Password
            </button>
          </>
        }
      >
        <form onSubmit={handleResetPasswordSubmit}>
          {resetError && (
            <div style={{
              padding: '10px 14px',
              backgroundColor: 'var(--danger-light)',
              color: 'var(--danger)',
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: 600,
              marginBottom: '16px'
            }}>
              {resetError}
            </div>
          )}

          <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', marginBottom: '16px' }}>
            Set a new secure password for <strong>{targetUserForReset?.name}</strong> ({targetUserForReset?.type}).
          </p>

          <FormInput
            label="New Password"
            name="newPassword"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter at least 6 characters"
            required
          />
        </form>
      </Modal>

    </div>
  );
};

export default DepartmentDetail;
