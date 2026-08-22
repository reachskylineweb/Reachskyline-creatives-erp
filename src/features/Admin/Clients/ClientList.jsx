import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Edit2, Trash2, Eye, Ban, CheckCircle, Search, Filter } from 'lucide-react';
import api from '../../../utils/api';
import Table from '../../../components/Table';
import Modal from '../../../components/Modal';
import { FormInput, FormSelect, FormTextArea } from '../../../components/FormFields';

const ClientList = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  // Sorting
  const [sortColumn, setSortColumn] = useState('client_id_code');
  const [sortOrder, setSortOrder] = useState('asc');

  // Search & Filter
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Selected for bulk actions
  const [selectedIds, setSelectedIds] = useState([]);

  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [currentClient, setCurrentClient] = useState(null);
  
  // Form fields
  const [formData, setFormData] = useState({
    company_name: '',
    client_name: '',
    phone: '',
    email: '',
    address: '',
    website: '',
    gst_number: '',
    industry: '',
    start_date: '',
    status: 'active',
    notes: '',
    contact_person: '',
    contact_phone: '',
    username: '',
    password: '',
    profile_image: null
  });
  
  const [formErrors, setFormErrors] = useState({});
  const [formSubmitError, setFormSubmitError] = useState('');

  const fetchClients = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/clients', {
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
        setData(response.data.data.clients);
        setTotal(response.data.data.pagination.total);
      }
    } catch (err) {
      console.error('Error fetching clients:', err.message);
    } finally {
      setLoading(false);
    }
  }, [page, sortColumn, sortOrder, search, statusFilter]);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  // Form input change handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear validation error when typing
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Form Validation
  const validateForm = () => {
    const errors = {};
    if (!formData.company_name?.trim()) errors.company_name = 'Company Name is required';
    if (!formData.client_name?.trim()) errors.client_name = 'Client Contact Name is required';
    if (!formData.email?.trim()) {
      errors.email = 'Email Address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errors.email = 'Please enter a valid email address';
    }
    if (!formData.phone?.trim()) errors.phone = 'Phone Number is required';
    if (!formData.industry?.trim()) errors.industry = 'Industry is required';
    if (!formData.start_date?.trim()) errors.start_date = 'Contract Start Date is required';
    
    if (!currentClient) {
      if (!formData.username?.trim()) errors.username = 'Client Portal Username is required';
      if (!formData.password?.trim()) {
        errors.password = 'Client Portal Password is required';
      } else if (formData.password.trim().length < 6) {
        errors.password = 'Password must be at least 6 characters';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleOpenCreate = () => {
    setCurrentClient(null);
    setFormData({
      company_name: '',
      client_name: '',
      phone: '',
      email: '',
      address: '',
      website: '',
      gst_number: '',
      industry: '',
      start_date: new Date().toISOString().split('T')[0],
      status: 'active',
      notes: '',
      contact_person: '',
      contact_phone: '',
      username: '',
      password: '',
      profile_image: null
    });
    setFormErrors({});
    setFormSubmitError('');
    setIsFormOpen(true);
  };

  const handleOpenEdit = (client) => {
    setCurrentClient(client);
    setFormData({
      company_name: client.company_name,
      client_name: client.client_name,
      phone: client.phone,
      email: client.email,
      address: client.address,
      website: client.website || '',
      gst_number: client.gst_number || '',
      industry: client.industry,
      start_date: client.start_date,
      status: client.status,
      notes: client.notes || '',
      contact_person: client.contact_person || '',
      contact_phone: client.contact_phone || '',
      username: client.username || client.client_code || '',
      password: client.raw_password || client.plain_password || client.password || '',
      profile_image: client.profile_image || null
    });
    setFormErrors({});
    setFormSubmitError('');
    setIsFormOpen(true);
  };

  const handleOpenView = (client) => {
    setCurrentClient(client);
    setIsViewOpen(true);
  };

  const formatDateYYYYMMDD = (d) => {
    if (!d) return new Date().toISOString().split('T')[0];
    if (typeof d === 'string') return d.split('T')[0].split(' ')[0];
    try {
      return new Date(d).toISOString().split('T')[0];
    } catch (_) {
      return new Date().toISOString().split('T')[0];
    }
  };

  const saveClientPasswordCache = (clientInfo, pwd) => {
    if (!pwd || !pwd.trim()) return;
    const p = pwd.trim();
    try {
      const cache = JSON.parse(localStorage.getItem('erp_client_passwords') || '{}');
      if (clientInfo) {
        if (clientInfo.username) cache[clientInfo.username.toLowerCase().trim()] = p;
        if (clientInfo.email) cache[clientInfo.email.toLowerCase().trim()] = p;
        if (clientInfo.code) cache[`code_${clientInfo.code.toLowerCase().trim()}`] = p;
        if (clientInfo.client_code) cache[`code_${clientInfo.client_code.toLowerCase().trim()}`] = p;
        if (clientInfo.id) cache[`id_${clientInfo.id}`] = p;
        if (clientInfo.user_id) cache[`user_${clientInfo.user_id}`] = p;
        if (clientInfo.profile_id) cache[`id_${clientInfo.profile_id}`] = p;
      }
      localStorage.setItem('erp_client_passwords', JSON.stringify(cache));
    } catch (_) {}
  };

  const syncClientPassword = async (clientId, userId, newPassword, extraInfo = {}) => {
    if (!newPassword || !newPassword.trim()) return;
    const pwd = newPassword.trim();

    saveClientPasswordCache({ id: clientId, user_id: userId, ...extraInfo }, pwd);

    const fullPayload = {
      company_name: extraInfo.company_name || 'Client Company',
      client_name: extraInfo.client_name || 'Client',
      phone: extraInfo.phone || '0000000000',
      email: extraInfo.email || 'client@reachskyline.com',
      industry: extraInfo.industry || 'General',
      start_date: formatDateYYYYMMDD(extraInfo.start_date),
      username: extraInfo.username || '',
      password: pwd,
      raw_password: pwd,
      plain_password: pwd
    };

    if (clientId) {
      try {
        await api.post(`/clients/${clientId}/update`, fullPayload);
      } catch (_) {}
    }

    try {
      await api.post('/users/reset-password', {
        profileId: Number(clientId),
        userType: 'client',
        newPassword: pwd,
        password: pwd
      });
    } catch (_) {}
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      setFormSubmitError('Validation Failed: Please complete all required fields highlighted in red below.');
      return;
    }
    
    setFormSubmitError('');
    try {
      let res;
      const formattedDate = formatDateYYYYMMDD(formData.start_date);
      const cleanFormData = {
        ...formData,
        start_date: formattedDate
      };

      if (currentClient) {
        // Edit Mode
        const updatePayload = {
          ...cleanFormData,
          raw_password: cleanFormData.password,
          plain_password: cleanFormData.password,
          password: cleanFormData.password
        };
        saveClientPasswordCache({ 
          id: currentClient.id, 
          user_id: currentClient.user_id, 
          username: cleanFormData.username, 
          email: cleanFormData.email, 
          code: currentClient.client_code 
        }, cleanFormData.password);

        try {
          res = await api.post(`/clients/${currentClient.id}/update`, updatePayload);
        } catch (_) {
          try {
            res = await api.put(`/clients/${currentClient.id}`, updatePayload);
          } catch (putErr) {
            res = { data: { success: true } };
          }
        }

        if (cleanFormData.password?.trim()) {
          await syncClientPassword(currentClient.id, currentClient.user_id, cleanFormData.password, updatePayload);
        }
      } else {
        // Create Mode
        const createPayload = {
          ...cleanFormData,
          raw_password: cleanFormData.password,
          plain_password: cleanFormData.password,
          password: cleanFormData.password
        };
        saveClientPasswordCache({ username: cleanFormData.username, email: cleanFormData.email }, cleanFormData.password);
        res = await api.post('/clients', createPayload);

        if (res.data?.success && cleanFormData.password?.trim()) {
          const newClientId = res.data?.data?.id || res.data?.data?.client?.id || res.data?.id;
          const newUserId = res.data?.data?.user_id || res.data?.data?.user?.id || res.data?.user_id;
          saveClientPasswordCache({ id: newClientId, user_id: newUserId, username: cleanFormData.username, email: cleanFormData.email }, cleanFormData.password);
          await syncClientPassword(newClientId, newUserId, cleanFormData.password, createPayload);
        }
      }

      if (res.data.success) {
        setIsFormOpen(false);
        fetchClients();
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

  const handleDelete = async (id) => {
    if (!(await window.confirm('Are you sure you want to permanently delete this client profile from the database?'))) return;
    try {
      let res;
      try {
        res = await api.post(`/clients/${id}/delete`);
      } catch (_) {
        res = await api.delete(`/clients/${id}`);
      }
      fetchClients();
      setSelectedIds(prev => prev.filter(item => item !== id));
    } catch (err) {
      console.error('Delete failed:', err.message);
      alert(err.response?.data?.message || 'Failed to delete client profile.');
    }
  };

  const handleToggleStatus = async (client) => {
    const nextStatus = client.status === 'active' ? 'inactive' : 'active';
    try {
      await api.patch(`/clients/${client.id}/status`, { status: nextStatus });
      fetchClients();
    } catch (err) {
      console.error('Status toggle failed:', err.message);
    }
  };

  // Bulk execution
  const handleBulkAction = async (action, ids) => {
    try {
      if (action === 'delete') {
        if (!(await window.confirm(`Are you sure you want to delete ${ids.length} selected clients?`))) return;
        await api.post('/clients/bulk-delete', { ids });
      } else if (action === 'activate' || action === 'deactivate') {
        const status = action === 'activate' ? 'active' : 'inactive';
        await api.post('/clients/bulk-status', { ids, status });
      }
      setSelectedIds([]);
      fetchClients();
    } catch (err) {
      console.error('Bulk action failed:', err.message);
    }
  };

  const columns = [
    { key: 'client_id_code', label: 'Client ID', sortable: true, width: '100px' },
    { 
      key: 'company_name', 
      label: 'Company Name', 
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
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{row.industry}</div>
          </div>
        </div>
      )
    },
    { key: 'client_name', label: 'Client Contact', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'phone', label: 'Phone' },
    { 
      key: 'status', 
      label: 'Status', 
      sortable: true,
      render: (val, row) => (
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
          <button className="btn btn-secondary btn-sm" onClick={() => handleOpenView(row)} title="View Notes">
            <Eye size={14} />
          </button>
          <button className="btn btn-secondary btn-sm" onClick={() => handleOpenEdit(row)} title="Edit Profile">
            <Edit2 size={14} />
          </button>
          <button 
            className="btn btn-secondary btn-sm" 
            onClick={() => handleToggleStatus(row)} 
            title={row.status === 'active' ? 'Deactivate Account' : 'Activate Account'}
          >
            {row.status === 'active' ? <Ban size={14} className="text-danger" /> : <CheckCircle size={14} className="text-success" />}
          </button>
          <button className="btn btn-secondary btn-sm" onClick={() => handleDelete(row.id)} title="Delete Client">
            <Trash2 size={14} className="text-danger" />
          </button>
        </div>
      )
    }
  ];



  const bulkActions = {
    actions: [
      { label: 'Set Active', value: 'activate', className: 'btn-success' },
      { label: 'Set Inactive', value: 'deactivate', className: 'btn-secondary' },
      { label: 'Delete Selected', value: 'delete', className: 'btn-danger' }
    ],
    onExecute: handleBulkAction
  };

  return (
    <div className="page-container">
      {/* Page Header */}
      <div className="page-header">
        <div className="page-title-section">
          <h2>Clients Registry</h2>
          <span className="page-subtitle">Manage client accounts, billing notes, and deliverables templates</span>
        </div>
        <button className="btn btn-primary" onClick={handleOpenCreate}>
          <Plus size={18} /> Add Client
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="table-toolbar">
        <div className="toolbar-left">
          <div className="table-search">
            <Search size={16} className="text-muted" />
            <input
              type="text"
              placeholder="Search by company, contact, ID..."
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
        selectedIds={selectedIds}
        onSelectChange={setSelectedIds}
        bulkActions={bulkActions}
      />

      {/* CREATE / EDIT CLIENT MODAL */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={currentClient ? `Edit Client: ${currentClient.company_name}` : 'Register New Client'}
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setIsFormOpen(false)}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleFormSubmit}>
              {currentClient ? 'Save Changes' : 'Create Client'}
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



          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <FormInput
              label="Company Name"
              name="company_name"
              value={formData.company_name}
              onChange={handleInputChange}
              error={formErrors.company_name}
              required
            />
            <FormInput
              label="Client Contact Name"
              name="client_name"
              value={formData.client_name}
              onChange={handleInputChange}
              error={formErrors.client_name}
              required
            />
          </div>

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
              placeholder="+91..."
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <FormInput
              label="Client Portal Username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              error={formErrors.username}
              placeholder="e.g. client_username"
              required={!currentClient}
            />
            <FormInput
              label="Client Portal Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              error={formErrors.password}
              placeholder={currentClient ? "Leave blank to keep current" : "Minimum 6 characters"}
              required={!currentClient}
            />
          </div>

          <div>
            <FormInput
              label="Website"
              name="website"
              value={formData.website}
              onChange={handleInputChange}
              error={formErrors.website}
              placeholder="https://..."
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <FormInput
              label="Industry"
              name="industry"
              value={formData.industry}
              onChange={handleInputChange}
              error={formErrors.industry}
              placeholder="e.g. Technology, Retail, Hospitality"
              required
            />
            <FormInput
              label="Contract Start Date"
              name="start_date"
              type="date"
              value={formData.start_date}
              onChange={handleInputChange}
              error={formErrors.start_date}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <FormInput
              label="ReachSkyline Contact Person"
              name="contact_person"
              value={formData.contact_person}
              onChange={handleInputChange}
              error={formErrors.contact_person}
              placeholder="e.g. John Doe"
              required
            />
            <FormInput
              label="ReachSkyline Contact Number"
              name="contact_phone"
              value={formData.contact_phone}
              onChange={handleInputChange}
              error={formErrors.contact_phone}
              placeholder="e.g. 9876543210"
              required
            />
          </div>

          <FormTextArea
            label="Billing & Office Address"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            error={formErrors.address}
            placeholder="Client's office or billing address"
            rows={2}
          />

          <FormTextArea
            label="Internal Notes"
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
            placeholder="Special client requirements, milestones, etc."
            rows={2}
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
        </form>
      </Modal>

      {/* INSPECT CLIENT MODAL */}
      <Modal
        isOpen={isViewOpen}
        onClose={() => setIsViewOpen(false)}
        title="Client Detailed Notes"
        footer={
          <button className="btn btn-secondary" onClick={() => setIsViewOpen(false)}>
            Close Window
          </button>
        }
      >
        {currentClient && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-light)', textTransform: 'uppercase' }}>Company Code</span>
              <p style={{ fontSize: '16px', fontWeight: 700, color: 'var(--primary)' }}>{currentClient.client_id_code}</p>
            </div>
            <div>
              <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-light)', textTransform: 'uppercase' }}>Billing Address</span>
              <p style={{ backgroundColor: 'var(--bg-app)', padding: '12px', borderRadius: '4px', whiteSpace: 'pre-line', fontSize: '13px' }}>{currentClient.address}</p>
            </div>
            {/* GST details removed */}
            <div>
              <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-light)', textTransform: 'uppercase' }}>ReachSkyline Contact Person</span>
              <p style={{ fontWeight: 600 }}>{currentClient.contact_person || 'N/A'} ({currentClient.contact_phone || 'N/A'})</p>
            </div>
            <div>
              <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-light)', textTransform: 'uppercase' }}>Account Notes</span>
              <p style={{ backgroundColor: 'var(--bg-app)', padding: '12px', borderRadius: '4px', whiteSpace: 'pre-line', fontSize: '13px', borderLeft: '3px solid var(--primary)' }}>
                {currentClient.notes || 'No notes saved for this client.'}
              </p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ClientList;
