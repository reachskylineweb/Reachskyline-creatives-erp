import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, Plus, Users, UserPlus, Mail, Phone, Calendar, Shield, Info, Edit2, Key, Ban, CheckCircle, Trash2 } from 'lucide-react';
import api from '../../../utils/api';
import Modal from '../../../components/Modal';
import { FormInput, FormSelect } from '../../../components/FormFields';

const DepartmentDetail = ({ deptId, onBack }) => {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Active sub-department tab
  const [activeSubDeptId, setActiveSubDeptId] = useState(null);

  // Modals state
  const [isSubDeptModalOpen, setIsSubDeptModalOpen] = useState(false);
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
  const [isManagerModalOpen, setIsManagerModalOpen] = useState(false);

  const [currentEmployee, setCurrentEmployee] = useState(null);
  const [currentManager, setCurrentManager] = useState(null);

  // Add Sub-department Form
  const [subDeptForm, setSubDeptForm] = useState({ name: '', code: '' });
  const [subDeptError, setSubDeptError] = useState('');

  // Register Employee Form
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

  // Register Manager Form
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

  // Handle Add Sub-department Submit
  const handleSubDeptSubmit = async (e) => {
    e.preventDefault();
    setSubDeptError('');
    if (!subDeptForm.name.trim() || !subDeptForm.code.trim()) {
      setSubDeptError('Both fields are required.');
      return;
    }
    if (!/^[A-Z0-9-]{2,12}$/.test(subDeptForm.code.toUpperCase().trim())) {
      setSubDeptError('Prefix code must be 2-12 letters/numbers, e.g. GD, VD-RS.');
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
        // Set new sub-dept active
        setActiveSubDeptId(res.data.data.id);
        fetchDetails();
      }
    } catch (err) {
      setSubDeptError(err.response?.data?.message || 'Failed to create sub-department.');
    }
  };

  const handleDeleteSubDept = async (subDept) => {
    if (!(await window.confirm(`Are you sure you want to delete the "${subDept.name}" sub-department?`))) return;

    try {
      const res = await api.delete(`/departments/sub-departments/${subDept.id}`);
      if (res.data.success) {
        if (activeSubDeptId === subDept.id) {
          setActiveSubDeptId(null);
        }
        fetchDetails();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete sub-department.');
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

  const handleDeleteManager = async (id) => {
    if (!(await window.confirm('Are you sure you want to permanently delete this manager?'))) return;
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

  // Validate Employee Register Form
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

  // Handle Register Employee Submit
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
        res = await api.put(`/users/employees/${currentEmployee.id}`, payload);
      } else {
        res = await api.post('/users/employees', payload);
      }

      if (res.data.success) {
        setIsEmployeeModalOpen(false);
        // Reset form
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
          sub_department_id: ''
        });
        setCurrentEmployee(null);
        fetchDetails();
      }
    } catch (err) {
      setEmpSubmitError(err.response?.data?.message || 'Failed to save employee.');
    }
  };

  // Validate Manager Register Form
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

  // Handle Register Manager Submit
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
        // Reset form
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
        setCurrentManager(null);
        fetchDetails();
      }
    } catch (err) {
      setMgrSubmitError(err.response?.data?.message || 'Failed to save manager.');
    }
  };

  const handleEmpImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxDim = 200;
        let width = img.width;
        let height = img.height;
        if (width > height) {
          if (width > maxDim) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          }
        } else {
          if (height > maxDim) {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        const webpBase64 = canvas.toDataURL('image/webp', 0.85);
        setEmpForm(prev => ({ ...prev, profile_image: webpBase64 }));
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleMgrImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxDim = 200;
        let width = img.width;
        let height = img.height;
        if (width > height) {
          if (width > maxDim) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          }
        } else {
          if (height > maxDim) {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        const webpBase64 = canvas.toDataURL('image/webp', 0.85);
        setMgrForm(prev => ({ ...prev, profile_image: webpBase64 }));
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
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

  if (loading && !details) {
    return (
      <div style={{ padding: '80px', textAlign: 'center', color: 'var(--text-muted)' }}>
        <div className="spinner" style={{ margin: '0 auto 12px auto' }}></div>
        <span>Loading department workspace...</span>
      </div>
    );
  }

  if (error || !details) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <p className="text-danger" style={{ fontWeight: 600 }}>{error || 'Workspace could not be loaded.'}</p>
        <button className="btn btn-secondary btn-sm" onClick={onBack}>
          <ArrowLeft size={16} /> Back to Departments
        </button>
      </div>
    );
  }

  const { department, manager, allManagers = [], subDepartments, employees } = details;
  const activeSubDept = subDepartments.find(sd => sd.id === activeSubDeptId);

  // Filter employees and managers for active sub-department
  const activeEmployees = employees.filter(emp => emp.sub_department_id === (activeSubDeptId || null));
  const activeManagers = allManagers.filter(mgr => mgr.sub_department_id === (activeSubDeptId || null));

  // Reporting managers of this department
  const managerOptions = allManagers
    .filter(mgr => mgr.status === 'active')
    .map(mgr => ({ value: mgr.id, label: `${mgr.full_name} (${mgr.manager_id_code})` }));

  return (
    <div style={{ padding: '30px', maxWidth: '1400px', margin: '0 auto' }}>
      
      {/* Back Button */}
      <button 
        onClick={onBack} 
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '8px 14px',
          backgroundColor: 'var(--bg-light)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-sm)',
          fontSize: '13px',
          fontWeight: 700,
          cursor: 'pointer',
          marginBottom: '24px',
          color: 'var(--text-color)'
        }}
      >
        <ArrowLeft size={16} />
        Back to Departments
      </button>

      {/* Main Department Header Panel */}
      <div 
        style={{
          backgroundColor: '#ffffff',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-sm)',
          padding: '30px',
          marginBottom: '30px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px'
        }}
      >
        <div>
          <span 
            style={{ 
              backgroundColor: 'var(--primary-light)', 
              color: 'var(--primary)', 
              fontSize: '11px', 
              fontWeight: 700, 
              padding: '4px 10px', 
              borderRadius: '12px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}
          >
            {department.code}
          </span>
          <h1 style={{ fontSize: '28px', fontWeight: 850, color: 'var(--text-color)', margin: '8px 0 6px 0' }}>
            {department.name} Department
          </h1>
          {department.description && (
            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '14px', maxWidth: '600px' }}>
              {department.description}
            </p>
          )}
        </div>

        {/* Manager Widget & Control */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div 
            style={{ 
              backgroundColor: 'var(--bg-light)', 
              border: '1px solid var(--border-color)', 
              padding: '16px 24px', 
              borderRadius: 'var(--radius-sm)',
              minWidth: '280px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}
          >
            <Shield size={24} style={{ color: 'var(--primary)', opacity: 0.8 }} />
            <div>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, display: 'block' }}>
                Department Manager
              </span>
              <strong style={{ fontSize: '15px', color: 'var(--text-color)', display: 'block', marginTop: '2px' }}>
                {manager ? manager.full_name : 'No Active Manager'}
              </strong>
              {manager && (
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Code: {manager.manager_id_code}</span>
              )}
            </div>
          </div>

          <button
            onClick={() => {
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
              setCurrentManager(null);
              setIsManagerModalOpen(true);
            }}
            className="btn btn-secondary"
            style={{ height: '54px', padding: '0 16px', display: 'inline-flex', alignItems: 'center', gap: '6px', fontWeight: 700 }}
          >
            <UserPlus size={16} /> Add Manager
          </button>

          <button
            onClick={() => {
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
                sub_department_id: ''
              });
              setEmpErrors({});
              setEmpSubmitError('');
              setCurrentEmployee(null);
              setIsEmployeeModalOpen(true);
            }}
            className="btn btn-success"
            style={{ height: '54px', padding: '0 16px', display: 'inline-flex', alignItems: 'center', gap: '6px', fontWeight: 700 }}
          >
            <UserPlus size={16} /> Add Employee
          </button>
        </div>
      </div>

      {/* Columns Workspace */}
      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '30px', alignItems: 'start' }}>
        
        {/* Left Column: Sub-departments */}
        <div 
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-sm)',
            padding: '20px'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 800, margin: 0, textTransform: 'uppercase', color: 'var(--text-color)' }}>
              Sub-departments
            </h3>
            <button 
              onClick={() => setIsSubDeptModalOpen(true)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '6px 10px',
                backgroundColor: 'var(--primary)',
                color: '#ffffff',
                border: 'none',
                borderRadius: 'var(--radius-xs)',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
              title="Add Sub-department"
            >
              <Plus size={14} />
              Add
            </button>
          </div>

          {subDepartments.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {/* Direct Department Roster Tab when no sub-departments */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--primary)',
                  backgroundColor: 'var(--primary-light)',
                  transition: 'border-color 0.2s, background-color 0.2s'
                }}
              >
                <button
                  style={{
                    flex: 1,
                    padding: '12px 16px',
                    backgroundColor: 'transparent',
                    border: 'none',
                    color: 'var(--primary)',
                    textAlign: 'left',
                    fontWeight: 700,
                    fontSize: '14px',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <span>Direct Department Roster</span>
                  <span 
                    style={{ 
                      backgroundColor: 'var(--primary)', 
                      color: '#ffffff',
                      padding: '2px 8px',
                      borderRadius: '10px',
                      fontSize: '11px',
                      fontWeight: 700
                    }}
                  >
                    {employees.filter(e => e.sub_department_id === null).length}
                  </span>
                </button>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {/* Direct Department Roster Tab */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid ' + (activeSubDeptId === null ? 'var(--primary)' : 'var(--border-color)'),
                  backgroundColor: activeSubDeptId === null ? 'var(--primary-light)' : '#ffffff',
                  transition: 'border-color 0.2s, background-color 0.2s'
                }}
              >
                <button
                  onClick={() => setActiveSubDeptId(null)}
                  style={{
                    flex: 1,
                    padding: '12px 16px',
                    backgroundColor: 'transparent',
                    border: 'none',
                    color: activeSubDeptId === null ? 'var(--primary)' : 'var(--text-color)',
                    textAlign: 'left',
                    fontWeight: 700,
                    fontSize: '14px',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <span>Direct Department Roster</span>
                  <span 
                    style={{ 
                      backgroundColor: activeSubDeptId === null ? 'var(--primary)' : 'var(--bg-light)', 
                      color: activeSubDeptId === null ? '#ffffff' : 'var(--text-muted)',
                      padding: '2px 8px',
                      borderRadius: '10px',
                      fontSize: '11px',
                      fontWeight: 700
                    }}
                  >
                    {employees.filter(e => e.sub_department_id === null).length}
                  </span>
                </button>
              </div>

              {subDepartments.map(sd => {
                const isActive = sd.id === activeSubDeptId;
                const empCount = employees.filter(e => e.sub_department_id === sd.id).length;

                return (
                  <div
                    key={sd.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid ' + (isActive ? 'var(--primary)' : 'var(--border-color)'),
                      backgroundColor: isActive ? 'var(--primary-light)' : '#ffffff',
                      transition: 'border-color 0.2s, background-color 0.2s'
                    }}
                  >
                    <button
                      onClick={() => setActiveSubDeptId(sd.id)}
                      style={{
                        flex: 1,
                        padding: '12px 16px',
                        backgroundColor: 'transparent',
                        border: 'none',
                        color: isActive ? 'var(--primary)' : 'var(--text-color)',
                        textAlign: 'left',
                        fontWeight: 700,
                        fontSize: '14px',
                        cursor: 'pointer',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <span>{sd.name} ({sd.code})</span>
                      <span 
                        style={{ 
                          backgroundColor: isActive ? 'var(--primary)' : 'var(--bg-light)', 
                          color: isActive ? '#ffffff' : 'var(--text-muted)',
                          padding: '2px 8px',
                          borderRadius: '10px',
                          fontSize: '11px',
                          fontWeight: 700,
                          marginRight: '6px'
                        }}
                      >
                        {empCount}
                      </span>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteSubDept(sd);
                      }}
                      style={{
                        padding: '12px 12px',
                        backgroundColor: 'transparent',
                        border: 'none',
                        color: 'var(--danger)',
                        cursor: 'pointer',
                        opacity: 0.6,
                        transition: 'opacity 0.2s',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                      title="Delete sub-department"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Staff assigned under sub-department */}
        <div 
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-sm)',
            padding: '24px',
            minHeight: '400px'
          }}
        >
          {(activeSubDept || subDepartments.length === 0 || activeSubDeptId === null) ? (
            <div>
              {/* Header */}
              <div 
                style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  borderBottom: '1px solid var(--border-color)',
                  paddingBottom: '16px',
                  marginBottom: '20px',
                  flexWrap: 'wrap',
                  gap: '12px'
                }}
              >
                <div>
                  <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-color)', margin: 0 }}>
                    {(() => {
                      const name = activeSubDept ? activeSubDept.name : department.name;
                      return name.toLowerCase().endsWith('team') || name.toLowerCase().endsWith('department') ? name : `${name} Team`;
                    })()}
                  </h2>
                  <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                    {activeSubDept 
                      ? `Staff roster assigned to ${department.name} ➔ ${activeSubDept.name}`
                      : `Staff roster assigned directly to ${department.name} department`}
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => {
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
                        sub_department_id: activeSubDeptId || ''
                      });
                      setMgrErrors({});
                      setMgrSubmitError('');
                      setCurrentManager(null);
                      setIsManagerModalOpen(true);
                    }}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '8px 14px',
                      backgroundColor: 'var(--primary)',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '13px',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    <UserPlus size={16} />
                    Register Manager
                  </button>
                  <button
                    onClick={() => {
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
                        sub_department_id: activeSubDeptId || ''
                      });
                      setEmpErrors({});
                      setEmpSubmitError('');
                      setCurrentEmployee(null);
                      setIsEmployeeModalOpen(true);
                    }}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '8px 14px',
                      backgroundColor: 'var(--success)',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '13px',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    <UserPlus size={16} />
                    Register Employee
                  </button>
                </div>
              </div>

              {/* Combined Roster lists */}
              {activeManagers.length === 0 && activeEmployees.length === 0 ? (
                <div style={{ padding: '60px 40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  <Users size={36} style={{ margin: '0 auto 12px auto', opacity: 0.5 }} />
                  <h4 style={{ margin: 0, fontSize: '15px', color: 'var(--text-color)', fontWeight: 700 }}>No Staff Registered</h4>
                  <p style={{ margin: '6px 0 0 0', fontSize: '13px' }}>
                    Click "Register Employee" or "Register Manager" to create staff for this {activeSubDept ? 'sub-department' : 'department'}.
                  </p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                  
                  {/* Sub-department Managers */}
                  {activeManagers.length > 0 && (
                    <div>
                      <h3 style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        {activeSubDept ? 'Sub-department Managers' : 'Department Managers'} ({activeManagers.length})
                      </h3>
                      <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                          <thead>
                            <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                              <th style={{ padding: '12px 10px', fontSize: '12px', fontWeight: 750, textTransform: 'uppercase' }}>Manager ID</th>
                              <th style={{ padding: '12px 10px', fontSize: '12px', fontWeight: 750, textTransform: 'uppercase' }}>Full Name</th>
                              <th style={{ padding: '12px 10px', fontSize: '12px', fontWeight: 750, textTransform: 'uppercase' }}>Email</th>
                              <th style={{ padding: '12px 10px', fontSize: '12px', fontWeight: 750, textTransform: 'uppercase' }}>Phone</th>
                              <th style={{ padding: '12px 10px', fontSize: '12px', fontWeight: 750, textTransform: 'uppercase' }}>Status</th>
                              <th style={{ padding: '12px 10px', fontSize: '12px', fontWeight: 750, textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {activeManagers.map(mgr => (
                              <tr key={mgr.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                <td style={{ padding: '14px 10px', fontSize: '13px', fontWeight: 700, color: 'var(--primary)' }}>
                                  {mgr.manager_id_code}
                                </td>
                                 <td style={{ padding: '14px 10px', fontSize: '13px', fontWeight: 600, color: 'var(--text-color)' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    {mgr.profile_image ? (
                                      <img 
                                        src={mgr.profile_image} 
                                        alt={mgr.full_name} 
                                        style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }} 
                                      />
                                    ) : (
                                      <div style={{ 
                                        width: '28px', 
                                        height: '28px', 
                                        borderRadius: '50%', 
                                        backgroundColor: 'var(--primary-light)', 
                                        color: 'var(--primary)', 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        justifyContent: 'center',
                                        fontWeight: '700',
                                        fontSize: '11px'
                                      }}>
                                        {mgr.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                                      </div>
                                    )}
                                    <span>{mgr.full_name}</span>
                                  </div>
                                </td>
                                <td style={{ padding: '14px 10px', fontSize: '13px', color: 'var(--text-muted)' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <Mail size={12} />
                                    {mgr.email}
                                  </div>
                                </td>
                                <td style={{ padding: '14px 10px', fontSize: '13px', color: 'var(--text-muted)' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <Phone size={12} />
                                    {mgr.phone}
                                  </div>
                                </td>
                                <td style={{ padding: '14px 10px', fontSize: '13px' }}>
                                  <span className={`badge ${mgr.status === 'active' ? 'badge-active' : 'badge-inactive'}`}>
                                    {mgr.status}
                                  </span>
                                </td>
                                 <td style={{ padding: '14px 10px', textAlign: 'right' }}>
                                   <div style={{ display: 'inline-flex', gap: '6px', justifyContent: 'flex-end' }}>
                                     <button 
                                       className="btn btn-secondary btn-sm" 
                                       onClick={() => handleToggleManagerStatus(mgr)} 
                                       title={mgr.status === 'active' ? 'Deactivate' : 'Activate'}
                                       style={{ padding: '6px 8px' }}
                                     >
                                       {mgr.status === 'active' ? (
                                         <Ban size={14} className="text-danger" />
                                       ) : (
                                         <CheckCircle size={14} className="text-success" />
                                       )}
                                     </button>
                                     <button
                                       className="btn btn-secondary btn-sm"
                                       onClick={() => handleDeleteManager(mgr.id)}
                                       title="Delete Manager"
                                       style={{ padding: '6px 8px' }}
                                     >
                                       <Trash2 size={14} className="text-danger" />
                                     </button>
                                   </div>
                                 </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Sub-department Employees */}
                  {activeEmployees.length > 0 && (
                    <div>
                      <h3 style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        {activeSubDept ? 'Sub-department Employees' : 'Department Employees'} ({activeEmployees.length})
                      </h3>
                      <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                          <thead>
                            <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                              <th style={{ padding: '12px 10px', fontSize: '12px', fontWeight: 750, textTransform: 'uppercase' }}>Employee ID</th>
                              <th style={{ padding: '12px 10px', fontSize: '12px', fontWeight: 750, textTransform: 'uppercase' }}>Full Name</th>
                              <th style={{ padding: '12px 10px', fontSize: '12px', fontWeight: 750, textTransform: 'uppercase' }}>Email</th>
                              <th style={{ padding: '12px 10px', fontSize: '12px', fontWeight: 750, textTransform: 'uppercase' }}>Phone</th>
                              <th style={{ padding: '12px 10px', fontSize: '12px', fontWeight: 750, textTransform: 'uppercase' }}>Status</th>
                              <th style={{ padding: '12px 10px', fontSize: '12px', fontWeight: 750, textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {activeEmployees.map(emp => (
                              <tr key={emp.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                <td style={{ padding: '14px 10px', fontSize: '13px', fontWeight: 700, color: 'var(--primary)' }}>
                                  {emp.employee_id_code}
                                </td>
                                 <td style={{ padding: '14px 10px', fontSize: '13px', fontWeight: 600, color: 'var(--text-color)' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    {emp.profile_image ? (
                                      <img 
                                        src={emp.profile_image} 
                                        alt={emp.full_name} 
                                        style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }} 
                                      />
                                    ) : (
                                      <div style={{ 
                                        width: '28px', 
                                        height: '28px', 
                                        borderRadius: '50%', 
                                        backgroundColor: 'var(--primary-light)', 
                                        color: 'var(--primary)', 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        justifyContent: 'center',
                                        fontWeight: '700',
                                        fontSize: '11px'
                                      }}>
                                        {emp.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                                      </div>
                                    )}
                                    <span>{emp.full_name}</span>
                                  </div>
                                </td>
                                <td style={{ padding: '14px 10px', fontSize: '13px', color: 'var(--text-muted)' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <Mail size={12} />
                                    {emp.email}
                                  </div>
                                </td>
                                <td style={{ padding: '14px 10px', fontSize: '13px', color: 'var(--text-muted)' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <Phone size={12} />
                                    {emp.phone}
                                  </div>
                                </td>
                                <td style={{ padding: '14px 10px', fontSize: '13px' }}>
                                  <span className={`badge ${emp.status === 'active' ? 'badge-active' : 'badge-inactive'}`}>
                                    {emp.status}
                                  </span>
                                </td>
                                 <td style={{ padding: '14px 10px', textAlign: 'right' }}>
                                   <div style={{ display: 'inline-flex', gap: '6px', justifyContent: 'flex-end' }}>
                                     <button 
                                       className="btn btn-secondary btn-sm" 
                                       onClick={() => handleToggleEmployeeStatus(emp)} 
                                       title={emp.status === 'active' ? 'Deactivate' : 'Activate'}
                                       style={{ padding: '6px 8px' }}
                                     >
                                       {emp.status === 'active' ? (
                                         <Ban size={14} className="text-danger" />
                                       ) : (
                                         <CheckCircle size={14} className="text-success" />
                                       )}
                                     </button>
                                     <button
                                       className="btn btn-secondary btn-sm"
                                       onClick={() => handleDeleteEmployee(emp.id)}
                                       title="Delete Employee"
                                       style={{ padding: '6px 8px' }}
                                     >
                                       <Trash2 size={14} className="text-danger" />
                                     </button>
                                   </div>
                                 </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div style={{ padding: '80px 40px', textAlign: 'center', color: 'var(--text-muted)' }}>
              <Info size={36} style={{ margin: '0 auto 12px auto', opacity: 0.5 }} />
              <h4 style={{ margin: 0, fontWeight: 700 }}>Select Sub-department</h4>
              <p style={{ margin: '4px 0 0 0', fontSize: '13px' }}>
                Select a sub-department from the left column to view its team roster and register staff.
              </p>
            </div>
          )}
        </div>

      </div>

      {/* 1. ADD SUB-DEPARTMENT MODAL */}
      <Modal
        isOpen={isSubDeptModalOpen}
        onClose={() => {
          setIsSubDeptModalOpen(false);
          setSubDeptForm({ name: '', code: '' });
          setSubDeptError('');
        }}
        title="Add Sub-department"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setIsSubDeptModalOpen(false)}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleSubDeptSubmit}>
              Create Sub-dept
            </button>
          </>
        }
      >
        <form onSubmit={handleSubDeptSubmit}>
          {subDeptError && (
            <div style={{ padding: '10px 14px', backgroundColor: 'var(--danger-light)', color: 'var(--danger)', borderRadius: '4px', fontSize: '13px', fontWeight: 600, marginBottom: '16px' }}>
              {subDeptError}
            </div>
          )}

          <FormInput
            label="Sub-department Name"
            name="name"
            value={subDeptForm.name}
            onChange={(e) => setSubDeptForm(prev => ({ ...prev, name: e.target.value }))}
            placeholder="e.g. Video Editor, Graphic Designer"
            required
          />

          <FormInput
            label="Code Prefix (2-12 letters/numbers)"
            name="code"
            value={subDeptForm.code}
            onChange={(e) => setSubDeptForm(prev => ({ ...prev, code: e.target.value }))}
            placeholder="e.g. VD, GD, CD-RS"
            required
          />
        </form>
      </Modal>

      {/* 2. REGISTER EMPLOYEE MODAL */}
      <Modal
        isOpen={isEmployeeModalOpen}
        onClose={() => {
          setIsEmployeeModalOpen(false);
          setEmpSubmitError('');
        }}
        title={currentEmployee ? `Edit Employee Profile` : (activeSubDept ? `Register Employee under ${activeSubDept.name}` : `Register Employee under ${department.name}`)}
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => { setIsEmployeeModalOpen(false); setCurrentEmployee(null); }}>
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
            <div style={{ padding: '10px 14px', backgroundColor: 'var(--danger-light)', color: 'var(--danger)', borderRadius: '4px', fontSize: '13px', fontWeight: 600, marginBottom: '16px' }}>
              {empSubmitError}
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
              value={empForm.sub_department_id}
              onChange={(e) => setEmpForm(prev => ({ ...prev, sub_department_id: e.target.value }))}
              options={subDepartments.map(sd => ({ value: sd.id, label: `${sd.name} (${sd.code})` }))}
              emptyOptionLabel="None (Direct Department Employee)"
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

      {/* 3. REGISTER MANAGER MODAL */}
      <Modal
        isOpen={isManagerModalOpen}
        onClose={() => {
          setIsManagerModalOpen(false);
          setMgrSubmitError('');
        }}
        title={currentManager ? `Edit Manager Profile` : (activeSubDept ? `Register Manager under ${activeSubDept.name}` : `Register Manager under ${department.name}`)}
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => { setIsManagerModalOpen(false); setCurrentManager(null); }}>
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
            <div style={{ padding: '10px 14px', backgroundColor: 'var(--danger-light)', color: 'var(--danger)', borderRadius: '4px', fontSize: '13px', fontWeight: 600, marginBottom: '16px' }}>
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
              placeholder="e.g. Chennai, Bangalore"
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

    </div>
  );
};

export default DepartmentDetail;
