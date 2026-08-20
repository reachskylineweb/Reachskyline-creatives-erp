import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Edit2, Trash2, Key, Ban, CheckCircle, Search } from 'lucide-react';
import api from '../../../utils/api';
import Table from '../../../components/Table';
import Modal from '../../../components/Modal';
import { FormInput, FormSelect } from '../../../components/FormFields';

const ManagerList = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  // Sorting & Search
  const [sortColumn, setSortColumn] = useState('full_name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('active');
  const [deptFilter, setDeptFilter] = useState('');

  // Dropdowns lists
  const [departments, setDepartments] = useState([]);
  const [subDepartments, setSubDepartments] = useState([]);

  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isResetOpen, setIsResetOpen] = useState(false);
  const [currentManager, setCurrentManager] = useState(null);

  // Form Fields
  const [formData, setFormData] = useState({
    full_name: '',
    username: '',
    password: '',
    email: '',
    phone: '',
    department_id: '',
    sub_department_id: '',
    branch: '',
    joining_date: '',
    status: 'active',
    profile_image: null
  });
  
  const [formErrors, setFormErrors] = useState({});
  const [formSubmitError, setFormSubmitError] = useState('');

  // Reset password fields
  const [newPassword, setNewPassword] = useState('');
  const [resetError, setResetError] = useState('');

  const fetchDropdowns = useCallback(async () => {
    try {
      const deptRes = await api.get('/departments/dropdown');
      if (deptRes.data.success) {
        setDepartments(deptRes.data.data.departments.map(d => ({ value: d.id, label: `${d.name} (${d.code})` })));
      }
    } catch (err) {
      console.error('Error fetching dropdowns:', err.message);
    }
  }, []);

  const fetchSubDepartments = useCallback(async (deptId) => {
    if (!deptId) {
      setSubDepartments([]);
      return;
    }
    try {
      const res = await api.get(`/departments/${deptId}/sub-departments`);
      if (res.data.success) {
        setSubDepartments(res.data.data.subDepartments || []);
      }
    } catch (err) {
      console.error('Failed to fetch sub-departments:', err.message);
    }
  }, []);

  const fetchManagers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/users/managers', {
        params: {
          page,
          limit,
          sortColumn,
          sortOrder,
          searchQuery: search,
          departmentFilter: deptFilter,
          statusFilter
        }
      });
      if (response.data.success) {
        setData(response.data.data.managers);
        setTotal(response.data.data.pagination.total);
      }
    } catch (err) {
      console.error('Error fetching managers:', err.message);
    } finally {
      setLoading(false);
    }
  }, [page, sortColumn, sortOrder, search, deptFilter, statusFilter]);

  useEffect(() => {
    fetchDropdowns();
  }, [fetchDropdowns]);

  useEffect(() => {
    fetchManagers();
  }, [fetchManagers]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (name === 'department_id') {
      setFormData(prev => ({ ...prev, sub_department_id: '' }));
      fetchSubDepartments(value);
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.full_name.trim()) errors.full_name = 'Full name is required.';
    
    // Username and password required on creation only
    if (!currentManager) {
      if (!formData.username.trim()) {
        errors.username = 'Username is required.';
      } else if (formData.username.trim().length < 3) {
        errors.username = 'Username must be at least 3 characters.';
      }

      if (!formData.password.trim()) {
        errors.password = 'Initial password is required.';
      } else if (formData.password.trim().length < 6) {
        errors.password = 'Password must be at least 6 characters.';
      }
    }

    if (!formData.email.trim()) {
      errors.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Email format is invalid.';
    }

    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required.';
    } else if (!/^\+?[0-9\s\-()]{10,20}$/.test(formData.phone)) {
      errors.phone = 'Phone number format is invalid.';
    }

    if (!formData.department_id) errors.department_id = 'Department assignment is required.';
    if (!formData.branch.trim()) errors.branch = 'Work branch office is required.';
    if (!formData.joining_date) errors.joining_date = 'Joining date is required.';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleImageChange = (e) => {
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
        setFormData(prev => ({ ...prev, profile_image: webpBase64 }));
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleOpenCreate = () => {
    setCurrentManager(null);
    setSubDepartments([]);
    setFormData({
      full_name: '',
      username: '',
      password: '',
      email: '',
      phone: '',
      department_id: '',
      sub_department_id: '',
      branch: '',
      joining_date: new Date().toISOString().split('T')[0],
      status: 'active',
      profile_image: null
    });
    setFormErrors({});
    setFormSubmitError('');
    setIsFormOpen(true);
  };

  const handleOpenEdit = (mgr) => {
    setCurrentManager(mgr);
    setFormData({
      full_name: mgr.full_name,
      username: mgr.username,
      password: '', // Ignored on edit
      email: mgr.email,
      phone: mgr.phone,
      department_id: mgr.department_id,
      sub_department_id: mgr.sub_department_id || '',
      branch: mgr.branch,
      joining_date: mgr.joining_date,
      status: mgr.status,
      profile_image: mgr.profile_image || null
    });
    setFormErrors({});
    setFormSubmitError('');
    setIsFormOpen(true);
    fetchSubDepartments(mgr.department_id);
  };

  const handleOpenReset = (mgr) => {
    setCurrentManager(mgr);
    setNewPassword('');
    setResetError('');
    setIsResetOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      setFormSubmitError('Please fill in all required fields. Scroll down to see all fields.');
      return;
    }

    setFormSubmitError('');
    try {
      let res;
      if (currentManager) {
        res = await api.put(`/users/managers/${currentManager.id}`, formData);
      } else {
        res = await api.post('/users/managers', formData);
      }

      if (res.data.success) {
        setIsFormOpen(false);
        fetchManagers();
      }
    } catch (err) {
      const serverMsg = err.response?.data?.message;
      const serverErrors = err.response?.data?.errors;
      if (Array.isArray(serverErrors) && serverErrors.length > 0) {
        setFormSubmitError(`Validation Error: ${serverErrors.join('. ')}`);
      } else if (serverMsg) {
        setFormSubmitError(serverMsg);
      } else {
        setFormSubmitError('An unexpected server error occurred. Please check your network connection.');
      }
    }
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      setResetError('Password must be at least 6 characters.');
      return;
    }

    try {
      const res = await api.post('/users/reset-password', {
        profileId: currentManager.id,
        userType: 'manager',
        newPassword
      });

      if (res.data.success) {
        setIsResetOpen(false);
        alert('Manager password reset successfully.');
      }
    } catch (err) {
      setResetError(err.response?.data?.message || 'Reset failed.');
    }
  };

  const handleDelete = async (id) => {
    if (!(await window.confirm('Are you sure you want to delete this manager profile?'))) return;
    try {
      await api.post('/users/change-status', {
        profileId: id,
        userType: 'manager',
        status: 'inactive'
      });
      setData(prev => prev.filter(item => item.id !== id));
      setTotal(prev => Math.max(0, prev - 1));
      fetchManagers();
    } catch (err) {
      console.error('Delete failed:', err.message);
    }
  };

  const handleToggleStatus = async (mgr) => {
    const nextStatus = mgr.status === 'active' ? 'inactive' : 'active';
    try {
      await api.post('/users/change-status', {
        profileId: mgr.id,
        userType: 'manager',
        status: nextStatus
      });
      fetchManagers();
    } catch (err) {
      console.error('Status toggling failed:', err.message);
    }
  };

  const columns = [
    { key: 'manager_id_code', label: 'Manager ID', sortable: true, width: '120px' },
    { 
      key: 'full_name', 
      label: 'Full Name', 
      sortable: true,
      render: (val, row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {row.profile_image ? (
            <img 
              src={row.profile_image} 
              alt={val} 
              style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} 
            />
          ) : (
            <div style={{ 
              width: '32px', 
              height: '32px', 
              borderRadius: '50%', 
              backgroundColor: 'var(--primary-light)', 
              color: 'var(--primary)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              fontWeight: '700',
              fontSize: '12px'
            }}>
              {val.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
            </div>
          )}
          <div>
            <span style={{ fontWeight: 700, color: 'var(--text-color)' }}>{val}</span>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{row.email}</div>
          </div>
        </div>
      )
    },
    { key: 'phone', label: 'Phone' },
    { key: 'department_name', label: 'Department', sortable: true },
    { key: 'branch', label: 'Branch' },
    { key: 'joining_date', label: 'Joining Date', sortable: true },
    { 
      key: 'status', 
      label: 'Status', 
      sortable: true,
      render: (val) => (
        <span className={`badge ${val === 'active' ? 'badge-active' : 'badge-inactive'}`}>
          {val}
        </span>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="btn btn-secondary btn-sm" onClick={() => handleOpenEdit(row)} title="Edit profile">
            <Edit2 size={14} />
          </button>
          <button className="btn btn-secondary btn-sm" onClick={() => handleOpenReset(row)} title="Reset Password">
            <Key size={14} className="text-orange" />
          </button>
          <button 
            className="btn btn-secondary btn-sm" 
            onClick={() => handleToggleStatus(row)} 
            title={row.status === 'active' ? 'Deactivate' : 'Activate'}
          >
            {row.status === 'active' ? <Ban size={14} className="text-danger" /> : <CheckCircle size={14} className="text-success" />}
          </button>
          <button className="btn btn-secondary btn-sm" onClick={() => handleDelete(row.id)} title="Delete Manager">
            <Trash2 size={14} className="text-danger" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="page-container">
      {/* Page Header */}
      <div className="page-header">
        <div className="page-title-section">
          <h2>Managers Directory</h2>
          <span className="page-subtitle">Manage department managers, branches, assignments, and portal access passwords</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="table-toolbar">
        <div className="toolbar-left">
          <div className="table-search">
            <Search size={16} className="text-muted" />
            <input
              type="text"
              placeholder="Search by name, ID, email..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <select
            name="deptFilter"
            value={deptFilter}
            onChange={(e) => {
              setDeptFilter(e.target.value);
              setPage(1);
            }}
            className="filter-select"
          >
            <option value="">All Departments</option>
            {departments.map((opt, index) => (
              <option key={index} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <select
            name="statusFilter"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="filter-select"
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Core Table */}
      <Table
        columns={columns}
        data={data}
        loading={loading}
        pagination={{
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
          onPageChange: (p) => setPage(p)
        }}
        sorting={{
          sortColumn,
          sortOrder,
          onSort: (col, ord) => {
            setSortColumn(col);
            setSortOrder(ord);
          }
        }}
      />

      {/* CREATE / EDIT MANAGER MODAL */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={currentManager ? `Edit Manager: ${currentManager.full_name}` : 'Register New Manager'}
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setIsFormOpen(false)}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleFormSubmit}>
              {currentManager ? 'Save Changes' : 'Create Manager'}
            </button>
          </>
        }
      >
        <form onSubmit={handleFormSubmit}>
          {formSubmitError && (
            <div style={{ padding: '10px 14px', backgroundColor: 'var(--danger-light)', color: 'var(--danger)', borderRadius: '4px', fontSize: '13px', fontWeight: 600, marginBottom: '16px' }}>
              {formSubmitError}
            </div>
          )}



          <FormInput
            label="Full Name"
            name="full_name"
            value={formData.full_name}
            onChange={handleInputChange}
            error={formErrors.full_name}
            required
          />

          {!currentManager && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <FormInput
                label="Username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                error={formErrors.username}
                placeholder="e.g. arun_mgr"
                required
              />
              <FormInput
                label="Initial Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                error={formErrors.password}
                required
              />
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <FormInput
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              error={formErrors.email}
              required
            />
            <FormInput
              label="Phone Number"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              error={formErrors.phone}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <FormSelect
              label="Department Assigned"
              name="department_id"
              value={formData.department_id}
              onChange={handleInputChange}
              options={departments}
              error={formErrors.department_id}
              required
            />
            <FormSelect
              label="Sub-department Assigned (Optional)"
              name="sub_department_id"
              value={formData.sub_department_id}
              onChange={handleInputChange}
              options={subDepartments.map(sd => ({ value: sd.id, label: `${sd.name} (${sd.code})` }))}
              error={formErrors.sub_department_id}
              disabled={!formData.department_id}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <FormInput
              label="Branch Location"
              name="branch"
              value={formData.branch}
              onChange={handleInputChange}
              error={formErrors.branch}
              placeholder="e.g. Chennai, Bangalore"
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <FormInput
              label="Joining Date"
              name="joining_date"
              type="date"
              value={formData.joining_date}
              onChange={handleInputChange}
              error={formErrors.joining_date}
              required
            />
            <FormSelect
              label="Status"
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              options={[
                { value: 'active', label: 'Active' },
                { value: 'inactive', label: 'Inactive' }
              ]}
              required
            />
          </div>
        </form>
      </Modal>

      {/* RESET PASSWORD MODAL */}
      <Modal
        isOpen={isResetOpen}
        onClose={() => setIsResetOpen(false)}
        title={currentManager ? `Reset Password: ${currentManager.full_name}` : 'Reset Password'}
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setIsResetOpen(false)}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleResetSubmit}>
              Update Password
            </button>
          </>
        }
      >
        <form onSubmit={handleResetSubmit}>
          {resetError && (
            <div style={{ padding: '10px 14px', backgroundColor: 'var(--danger-light)', color: 'var(--danger)', borderRadius: '4px', fontSize: '13px', fontWeight: 600, marginBottom: '16px' }}>
              {resetError}
            </div>
          )}

          <FormInput
            label="New Password"
            name="newPassword"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Min 6 characters required"
            required
          />
        </form>
      </Modal>
    </div>
  );
};

export default ManagerList;
