import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Edit2, Trash2, Key, Ban, CheckCircle, Search } from 'lucide-react';
import api from '../../../utils/api';
import Table from '../../../components/Table';
import Modal from '../../../components/Modal';
import { FormInput, FormSelect } from '../../../components/FormFields';

const HRList = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  // Sorting & Search
  const [sortColumn, setSortColumn] = useState('full_name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isResetOpen, setIsResetOpen] = useState(false);
  const [currentHR, setCurrentHR] = useState(null);

  // Form Fields
  const [formData, setFormData] = useState({
    full_name: '',
    username: '',
    password: '',
    email: '',
    phone: '',
    joining_date: '',
    status: 'active',
    profile_image: null
  });
  
  const [formErrors, setFormErrors] = useState({});
  const [formSubmitError, setFormSubmitError] = useState('');

  // Reset password fields
  const [newPassword, setNewPassword] = useState('');
  const [resetError, setResetError] = useState('');

  const fetchHR = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/users/hr', {
        params: {
          page,
          limit,
          sortColumn,
          sortOrder,
          searchQuery: search,
          statusFilter
        }
      });
      if (response.data.success) {
        setData(response.data.data.hrList);
        setTotal(response.data.data.pagination.total);
      }
    } catch (err) {
      console.error('Error fetching HR list:', err.message);
    } finally {
      setLoading(false);
    }
  }, [page, sortColumn, sortOrder, search, statusFilter]);

  useEffect(() => {
    fetchHR();
  }, [fetchHR]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.full_name.trim()) errors.full_name = 'Full name is required.';
    
    if (!currentHR) {
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
    setCurrentHR(null);
    setFormData({
      full_name: '',
      username: '',
      password: '',
      email: '',
      phone: '',
      joining_date: new Date().toISOString().split('T')[0],
      status: 'active',
      profile_image: null
    });
    setFormErrors({});
    setFormSubmitError('');
    setIsFormOpen(true);
  };

  const handleOpenEdit = (hr) => {
    setCurrentHR(hr);
    setFormData({
      full_name: hr.full_name,
      username: hr.username,
      password: '',
      email: hr.email,
      phone: hr.phone,
      joining_date: hr.joining_date,
      status: hr.status,
      profile_image: hr.profile_image || null
    });
    setFormErrors({});
    setFormSubmitError('');
    setIsFormOpen(true);
  };

  const handleOpenReset = (hr) => {
    setCurrentHR(hr);
    setNewPassword('');
    setResetError('');
    setIsResetOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setFormSubmitError('');
    try {
      let res;
      if (currentHR) {
        res = await api.put(`/users/hr/${currentHR.id}`, formData);
      } else {
        res = await api.post('/users/hr', formData);
      }

      if (res.data.success) {
        setIsFormOpen(false);
        fetchHR();
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Server error occurred.';
      setFormSubmitError(msg);
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
        profileId: currentHR.id,
        userType: 'hr',
        newPassword
      });

      if (res.data.success) {
        setIsResetOpen(false);
        alert('HR password reset successfully.');
      }
    } catch (err) {
      setResetError(err.response?.data?.message || 'Reset failed.');
    }
  };

  const handleDelete = async (id) => {
    if (!(await window.confirm('Are you sure you want to delete this HR profile? This deactivates their access.'))) return;
    try {
      await api.delete(`/users/hr/${id}`);
      fetchHR();
    } catch (err) {
      console.error('Delete failed:', err.message);
    }
  };

  const handleToggleStatus = async (hr) => {
    const nextStatus = hr.status === 'active' ? 'inactive' : 'active';
    try {
      await api.post('/users/change-status', {
        profileId: hr.id,
        userType: 'hr',
        status: nextStatus
      });
      fetchHR();
    } catch (err) {
      console.error('Status toggling failed:', err.message);
    }
  };

  const columns = [
    { key: 'hr_id_code', label: 'HR Staff ID', sortable: true, width: '120px' },
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
          <button className="btn btn-secondary btn-sm" onClick={() => handleDelete(row.id)} title="Delete HR profile">
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
          <h2>HR Staff Directory</h2>
          <span className="page-subtitle">Configure human resource officers, portal access accounts, and join records</span>
        </div>
        <button className="btn btn-primary" onClick={handleOpenCreate}>
          <Plus size={18} /> Add HR Staff
        </button>
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

      {/* CREATE / EDIT HR MODAL */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={currentHR ? `Edit HR Staff: ${currentHR.full_name}` : 'Register New HR Staff'}
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setIsFormOpen(false)}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleFormSubmit}>
              {currentHR ? 'Save Changes' : 'Create Profile'}
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

          {/* Profile Image Preview & Upload Button */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '24px', gap: '10px' }}>
            <div style={{ position: 'relative', width: '90px', height: '90px' }}>
              {formData.profile_image ? (
                <img 
                  src={formData.profile_image} 
                  alt="Preview" 
                  style={{ width: '90px', height: '90px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--primary)' }} 
                />
              ) : (
                <div style={{ 
                  width: '90px', 
                  height: '90px', 
                  borderRadius: '50%', 
                  backgroundColor: 'var(--primary-light)', 
                  color: 'var(--primary)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  fontWeight: '700',
                  fontSize: '28px',
                  border: '3px dashed var(--border-color)'
                }}>
                  {formData.full_name ? formData.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : '?'}
                </div>
              )}
            </div>
            <label 
              className="btn btn-secondary btn-sm" 
              style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px', margin: 0 }}
            >
              Upload Photo
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageChange} 
                style={{ display: 'none' }} 
              />
            </label>
            {formData.profile_image && (
              <button 
                type="button" 
                onClick={() => setFormData(prev => ({ ...prev, profile_image: null }))}
                style={{ background: 'none', border: 'none', color: 'var(--danger)', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
              >
                Remove Photo
              </button>
            )}
          </div>

          <FormInput
            label="Full Name"
            name="full_name"
            value={formData.full_name}
            onChange={handleInputChange}
            error={formErrors.full_name}
            required
          />

          {!currentHR && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <FormInput
                label="Username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                error={formErrors.username}
                placeholder="e.g. anjali_hr"
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
        title={currentHR ? `Reset Password: ${currentHR.full_name}` : 'Reset Password'}
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

export default HRList;
