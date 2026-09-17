import React, { useState, useEffect, useCallback } from 'react';
import { Search, UserCheck, UserX, CheckSquare, Square, Building2, Filter, AlertCircle, RefreshCw, Send, Plus, FileText } from 'lucide-react';
import api from '../../../utils/api';
import Table from '../../../components/Table';
import Modal from '../../../components/Modal';
import { FormSelect, FormInput, FormTextArea } from '../../../components/FormFields';

const AdminBlogsAssignment = () => {
  const [activeTab, setActiveTab] = useState('normal'); // 'normal' or 'job_work'

  // --- Popup Modal Alert State ---
  const [popupModal, setPopupModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'info'
  });

  // --- Normal Deliverables State ---
  const [clients, setClients] = useState([]);
  const [seoManagers, setSeoManagers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [search, setSearch] = useState('');
  const [managerFilter, setManagerFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedClientIds, setSelectedClientIds] = useState([]);
  const [targetManagerId, setTargetManagerId] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });

  // --- Job Work State ---
  const [jobWorkClientId, setJobWorkClientId] = useState('');
  const [jobWorkTopic, setJobWorkTopic] = useState('');
  const [jobWorkManagerId, setJobWorkManagerId] = useState('');
  const [jobWorkList, setJobWorkList] = useState([]);
  const [jobWorkLoading, setJobWorkLoading] = useState(false);
  const [jobWorkSubmitting, setJobWorkSubmitting] = useState(false);
  const [jobWorkMsg, setJobWorkMsg] = useState({ type: '', text: '' });

  // Fetch all clients & managers for Normal Deliverables
  const fetchData = useCallback(async () => {
    setLoading(true);
    setMessage({ type: '', text: '' });
    try {
      const [clientsRes, managersRes] = await Promise.all([
        api.get('/blog-assignments/clients', {
          params: { searchQuery: search, managerFilter, statusFilter }
        }),
        api.get('/blog-assignments/managers')
      ]);

      if (clientsRes.data.success) {
        setClients(clientsRes.data.data);
      }
      if (managersRes.data.success) {
        setSeoManagers(managersRes.data.data);
      }
    } catch (err) {
      console.error('Error fetching blog assignments:', err);
      setMessage({ type: 'danger', text: err.response?.data?.message || 'Failed to load clients data.' });
    } finally {
      setLoading(false);
    }
  }, [search, managerFilter, statusFilter]);

  // Fetch Job Works list
  const fetchJobWorks = useCallback(async () => {
    setJobWorkLoading(true);
    try {
      const res = await api.get('/blog-assignments/job-work/admin');
      if (res.data.success) {
        setJobWorkList(res.data.data || []);
      }
    } catch (err) {
      console.error('Error fetching admin job works:', err);
    } finally {
      setJobWorkLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    fetchJobWorks();
  }, [fetchData, fetchJobWorks]);

  // Handle Select All / Deselect All
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedClientIds(clients.map(c => c.id));
    } else {
      setSelectedClientIds([]);
    }
  };

  const handleToggleSelect = (id) => {
    setSelectedClientIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Handle Assign Action (Normal Deliverables)
  const handleAssign = async () => {
    if (selectedClientIds.length === 0) {
      alert('Please select at least one client using the checkboxes.');
      return;
    }
    if (!targetManagerId) {
      alert('Please select an SEO Manager from the dropdown to assign the selected clients.');
      return;
    }

    setSubmitting(true);
    setMessage({ type: '', text: '' });
    try {
      const res = await api.post('/blog-assignments/assign', {
        client_ids: selectedClientIds,
        manager_id: targetManagerId
      });

      if (res.data.success) {
        const isWarning = res.data.alreadyAssignedAll;
        const msgText = res.data.message || 'Operation completed successfully.';

        setMessage({
          type: isWarning ? 'warning' : 'success',
          text: msgText
        });

        setPopupModal({
          isOpen: true,
          title: isWarning ? 'Already Assigned' : 'Assignment Successful',
          message: msgText,
          type: isWarning ? 'warning' : 'success'
        });

        setSelectedClientIds([]);
        fetchData();
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to assign clients.';
      setMessage({
        type: 'danger',
        text: errorMsg
      });
      setPopupModal({
        isOpen: true,
        title: 'Assignment Failed',
        message: errorMsg,
        type: 'danger'
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Unassign Action
  const handleUnassign = async () => {
    if (selectedClientIds.length === 0) {
      alert('Please select at least one client to unassign.');
      return;
    }

    if (!window.confirm(`Are you sure you want to unassign ${selectedClientIds.length} client(s) from Blog management?`)) {
      return;
    }

    setSubmitting(true);
    setMessage({ type: '', text: '' });
    try {
      const res = await api.post('/blog-assignments/unassign', {
        client_ids: selectedClientIds
      });

      if (res.data.success) {
        setMessage({
          type: 'success',
          text: `Successfully unassigned ${selectedClientIds.length} client(s).`
        });
        setSelectedClientIds([]);
        fetchData();
      }
    } catch (err) {
      setMessage({
        type: 'danger',
        text: err.response?.data?.message || 'Failed to unassign clients.'
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Create Job Work
  const handleCreateJobWork = async (e) => {
    e.preventDefault();
    if (!jobWorkClientId) {
      alert('Please select a client.');
      return;
    }
    if (!jobWorkTopic.trim()) {
      alert('Please enter a topic for the job work.');
      return;
    }
    if (!jobWorkManagerId) {
      alert('Please select an SEO Manager.');
      return;
    }

    setJobWorkSubmitting(true);
    setJobWorkMsg({ type: '', text: '' });
    try {
      const res = await api.post('/blog-assignments/job-work', {
        client_id: jobWorkClientId,
        topic: jobWorkTopic.trim(),
        manager_id: jobWorkManagerId
      });

      if (res.data.success) {
        setJobWorkMsg({
          type: 'success',
          text: 'Blog Job Work created and sent to SEO Manager successfully!'
        });
        setJobWorkClientId('');
        setJobWorkTopic('');
        setJobWorkManagerId('');
        fetchJobWorks();
      }
    } catch (err) {
      setJobWorkMsg({
        type: 'danger',
        text: err.response?.data?.message || 'Failed to create Job Work.'
      });
    } finally {
      setJobWorkSubmitting(false);
    }
  };

  const isAllSelected = clients.length > 0 && selectedClientIds.length === clients.length;

  const normalColumns = [
    {
      key: 'select',
      label: (
        <input 
          type="checkbox" 
          checked={isAllSelected} 
          onChange={handleSelectAll} 
          style={{ width: '16px', height: '16px', cursor: 'pointer' }}
        />
      ),
      width: '50px',
      render: (_, row) => (
        <input 
          type="checkbox" 
          checked={selectedClientIds.includes(row.id)} 
          onChange={() => handleToggleSelect(row.id)} 
          style={{ width: '16px', height: '16px', cursor: 'pointer' }}
        />
      )
    },
    {
      key: 'client_id_code',
      label: 'Client Code',
      width: '120px',
      render: (val) => (
        <span style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '13px' }}>
          {val || 'N/A'}
        </span>
      )
    },
    {
      key: 'company_name',
      label: 'Company Name',
      render: (val, row) => (
        <div>
          <strong style={{ display: 'block', fontSize: '14px', color: 'var(--text-color)' }}>{val}</strong>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Contact: {row.client_name}</span>
        </div>
      )
    },
    {
      key: 'manager_name',
      label: 'Assigned SEO Manager',
      render: (val, row) => val ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
          <UserCheck size={14} style={{ color: '#16a34a' }} />
          <span>{val} ({row.manager_id_code || 'Manager'})</span>
        </div>
      ) : (
        <span style={{ fontSize: '12px', color: '#dc2626', fontStyle: 'italic' }}>Unassigned</span>
      )
    },
    {
      key: 'client_status',
      label: 'Status',
      width: '100px',
      render: (val) => (
        <span className={`badge ${val === 'active' ? 'badge-active' : 'badge-inactive'}`}>
          {val}
        </span>
      )
    }
  ];

  const jobWorkColumns = [
    {
      key: 'id',
      label: 'ID',
      width: '60px',
      render: (val) => `#${val}`
    },
    {
      key: 'client_id_code',
      label: 'Client Code',
      width: '110px',
      render: (val, row) => (
        <span style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '13px' }}>
          {val || row.company_name}
        </span>
      )
    },
    {
      key: 'company_name',
      label: 'Company',
      render: (val) => <strong>{val}</strong>
    },
    {
      key: 'topic',
      label: 'Topic',
      render: (val) => <span style={{ fontSize: '13px', color: 'var(--text-color)' }}>{val || '-'}</span>
    },
    {
      key: 'manager_name',
      label: 'Assigned Manager',
      render: (val) => val ? <span className="badge badge-active">{val}</span> : <span style={{ color: '#dc2626' }}>Unassigned</span>
    },
    {
      key: 'employee_name',
      label: 'Assigned Employee',
      render: (val) => val ? <span className="badge badge-info">{val}</span> : <span style={{ color: '#64748b' }}>Not assigned yet</span>
    },
    {
      key: 'status',
      label: 'Status',
      render: (val) => <span className={`badge badge-${val === 'completed' ? 'success' : val === 'assigned' ? 'warning' : 'pending'}`}>{val}</span>
    },
    {
      key: 'created_at',
      label: 'Created Date',
      render: (val) => val ? new Date(val).toLocaleDateString() : '-'
    }
  ];

  return (
    <div className="page-container" style={{ padding: '30px', maxWidth: '1400px', margin: '0 auto' }}>
      <div className="page-header" style={{ marginBottom: '1.5rem' }}>
        <div>
          <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Building2 size={24} style={{ color: 'var(--primary)' }} />
            Blogs Client Assignment
          </h1>
          <p className="page-description">
            Assign ERP clients to SEO Managers for normal monthly deliverables or create special Topic-based Job Works.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '12px', borderBottom: '2px solid var(--border-color)', marginBottom: '1.5rem' }}>
        <button
          type="button"
          onClick={() => setActiveTab('normal')}
          style={{
            padding: '10px 20px',
            border: 'none',
            background: 'none',
            fontWeight: 600,
            fontSize: '14px',
            cursor: 'pointer',
            borderBottom: activeTab === 'normal' ? '3px solid var(--primary)' : '3px solid transparent',
            color: activeTab === 'normal' ? 'var(--primary)' : 'var(--text-muted)'
          }}
        >
          Normal Deliverables
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('job_work')}
          style={{
            padding: '10px 20px',
            border: 'none',
            background: 'none',
            fontWeight: 600,
            fontSize: '14px',
            cursor: 'pointer',
            borderBottom: activeTab === 'job_work' ? '3px solid var(--primary)' : '3px solid transparent',
            color: activeTab === 'job_work' ? 'var(--primary)' : 'var(--text-muted)'
          }}
        >
          Job Work
        </button>
      </div>

      {/* TAB 1: NORMAL DELIVERABLES */}
      {activeTab === 'normal' && (
        <>
          {message.text && (
            <div className={`alert alert-${message.type}`} style={{ marginBottom: '1rem' }}>
              <AlertCircle size={16} />
              <span>{message.text}</span>
            </div>
          )}

          {/* Action Header Card */}
          <div className="card" style={{ marginBottom: '1.5rem', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ flex: '1', minWidth: '260px', display: 'flex', gap: '10px', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>
                  Selected Clients: <strong style={{ color: 'var(--primary)', fontSize: '15px' }}>{selectedClientIds.length}</strong>
                </span>
                
                <FormSelect
                  style={{ minWidth: '220px', margin: 0 }}
                  value={targetManagerId}
                  onChange={(e) => setTargetManagerId(e.target.value)}
                  options={[
                    { value: '', label: '-- Select SEO Manager --' },
                    ...seoManagers.map(m => ({
                      value: m.id,
                      label: `${m.full_name} (${m.manager_id_code || 'Manager'})`
                    }))
                  ]}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleAssign}
                  disabled={submitting || selectedClientIds.length === 0 || !targetManagerId}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  <Send size={16} />
                  Send to SEO Manager
                </button>

                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleUnassign}
                  disabled={submitting || selectedClientIds.length === 0}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  <UserX size={16} />
                  Unassign Selected
                </button>
              </div>
            </div>
          </div>

          {/* Filters Bar */}
          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
              <div style={{ flex: 1, minWidth: '220px', position: 'relative' }}>
                <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  placeholder="Search client by code, name..."
                  className="form-control"
                  style={{ paddingLeft: '36px' }}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <div style={{ minWidth: '180px' }}>
                <FormSelect
                  style={{ margin: 0 }}
                  value={managerFilter}
                  onChange={(e) => setManagerFilter(e.target.value)}
                  options={[
                    { value: '', label: 'All Managers' },
                    { value: 'unassigned', label: 'Unassigned Clients Only' },
                    ...seoManagers.map(m => ({ value: m.id, label: m.full_name }))
                  ]}
                />
              </div>

              <div style={{ minWidth: '140px' }}>
                <FormSelect
                  style={{ margin: 0 }}
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  options={[
                    { value: '', label: 'All Statuses' },
                    { value: 'active', label: 'Active' },
                    { value: 'inactive', label: 'Inactive' }
                  ]}
                />
              </div>

              <button type="button" className="btn btn-secondary" onClick={fetchData} title="Refresh">
                <RefreshCw size={16} />
              </button>
            </div>
          </div>

          {/* Clients Table */}
          <div className="card">
            <Table
              columns={normalColumns}
              data={clients}
              loading={loading}
              emptyMessage="No clients found in the ERP system."
            />
          </div>
        </>
      )}

      {/* TAB 2: JOB WORK */}
      {activeTab === 'job_work' && (
        <>
          {jobWorkMsg.text && (
            <div className={`alert alert-${jobWorkMsg.type}`} style={{ marginBottom: '1rem' }}>
              <AlertCircle size={16} />
              <span>{jobWorkMsg.text}</span>
            </div>
          )}

          {/* Create Job Work Form */}
          <div className="card" style={{ marginBottom: '1.5rem', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Plus size={18} style={{ color: 'var(--primary)' }} /> Assign Job Work for Blogs
            </h3>

            <form onSubmit={handleCreateJobWork}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: 600, fontSize: '13px', marginBottom: '4px' }}>
                    Select Client <span style={{ color: '#dc2626' }}>*</span>
                  </label>
                  <FormSelect
                    style={{ margin: 0 }}
                    value={jobWorkClientId}
                    onChange={(e) => setJobWorkClientId(e.target.value)}
                    options={[
                      { value: '', label: '-- Select Client --' },
                      ...clients.map(c => ({
                        value: c.id,
                        label: `${c.company_name} (${c.client_id_code || 'Client'})`
                      }))
                    ]}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontWeight: 600, fontSize: '13px', marginBottom: '4px' }}>
                    Assign to SEO Manager <span style={{ color: '#dc2626' }}>*</span>
                  </label>
                  <FormSelect
                    style={{ margin: 0 }}
                    value={jobWorkManagerId}
                    onChange={(e) => setJobWorkManagerId(e.target.value)}
                    options={[
                      { value: '', label: '-- Select SEO Manager --' },
                      ...seoManagers.map(m => ({
                        value: m.id,
                        label: `${m.full_name} (${m.manager_id_code || 'Manager'})`
                      }))
                    ]}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontWeight: 600, fontSize: '13px', marginBottom: '4px' }}>
                  Topic / Work Description <span style={{ color: '#dc2626' }}>*</span>
                </label>
                <FormTextArea
                  placeholder="Enter the blog topic or specific instructions for this Job Work..."
                  rows={3}
                  value={jobWorkTopic}
                  onChange={(e) => setJobWorkTopic(e.target.value)}
                  style={{ margin: 0 }}
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={jobWorkSubmitting || !jobWorkClientId || !jobWorkTopic.trim() || !jobWorkManagerId}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <Send size={16} /> Send Job Work to SEO Manager
              </button>
            </form>
          </div>

          {/* Job Work List Table */}
          <div className="card">
            <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileText size={18} style={{ color: 'var(--primary)' }} /> Assigned Blog Job Works
            </h3>
            <Table
              columns={jobWorkColumns}
              data={jobWorkList}
              loading={jobWorkLoading}
              emptyMessage="No Blog Job Works created yet."
            />
          </div>
        </>
      )}

      {/* Popup Alert Modal */}
      <Modal
        isOpen={popupModal.isOpen}
        onClose={() => setPopupModal(prev => ({ ...prev, isOpen: false }))}
        title={popupModal.title}
        footer={
          <button 
            className="btn btn-primary" 
            onClick={() => setPopupModal(prev => ({ ...prev, isOpen: false }))}
            style={{ minWidth: '100px' }}
          >
            OK
          </button>
        }
      >
        <div style={{ padding: '12px 0', fontSize: '15px', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
          {popupModal.type === 'warning' ? (
            <AlertCircle size={28} style={{ color: '#d97706', flexShrink: 0 }} />
          ) : popupModal.type === 'danger' ? (
            <AlertCircle size={28} style={{ color: '#dc2626', flexShrink: 0 }} />
          ) : (
            <CheckSquare size={28} style={{ color: '#16a34a', flexShrink: 0 }} />
          )}
          <div style={{ fontWeight: 600, color: 'var(--text-main)', lineHeight: '1.5' }}>
            {popupModal.message}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdminBlogsAssignment;
