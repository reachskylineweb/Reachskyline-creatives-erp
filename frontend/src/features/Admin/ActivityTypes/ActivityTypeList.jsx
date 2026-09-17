import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, RefreshCw, Layers, CheckCircle, AlertCircle, Link, Search } from 'lucide-react';
import api from '../../../utils/api';
import Modal from '../../../components/Modal';
import { FormInput, FormSelect } from '../../../components/FormFields';

const ActivityTypeList = () => {
  const [activities, setActivities] = useState([]);
  const [subDepartments, setSubDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSyncOpen, setIsSyncOpen] = useState(false);
  const [currentActivity, setCurrentActivity] = useState(null);
  
  // Pagination & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [teamFilter, setTeamFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Form states
  const [formData, setFormData] = useState({
    activity_type_code: '',
    activity_name: '',
    time_editor: 0,
    time_content: 0,
    editor_employees: '',
    content_employees: '',
    sub_department_id: ''
  });
  const [syncUrl, setSyncUrl] = useState('');
  const [syncLoading, setSyncLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    fetchActivities();
    fetchSubDepartments();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, teamFilter]);

  const fetchActivities = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/activity-types');
      if (response.data && response.data.success) {
        setActivities(response.data.data);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch activity types.');
    } finally {
      setLoading(false);
    }
  };

  const fetchSubDepartments = async () => {
    try {
      const response = await api.get('/departments/1/sub-departments');
      if (response.data && response.data.success) {
        setSubDepartments(response.data.data.subDepartments || []);
      }
    } catch (err) {
      console.error('Failed to fetch sub-departments:', err.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.activity_type_code.trim()) errors.activity_type_code = 'Activity code is required.';
    if (!formData.activity_name.trim()) errors.activity_name = 'Activity name is required.';
    if (Number(formData.time_editor) < 0) errors.time_editor = 'Time cannot be negative.';
    if (Number(formData.time_content) < 0) errors.time_content = 'Time cannot be negative.';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleOpenCreate = () => {
    setCurrentActivity(null);
    setFormData({
      activity_type_code: '',
      activity_name: '',
      time_editor: 0,
      time_content: 0,
      editor_employees: '',
      content_employees: '',
      sub_department_id: ''
    });
    setFormErrors({});
    setIsFormOpen(true);
  };

  const handleOpenEdit = (act) => {
    setCurrentActivity(act);
    setFormData({
      activity_type_code: act.activity_type_code,
      activity_name: act.activity_name,
      time_editor: act.time_editor,
      time_content: act.time_content,
      editor_employees: act.editor_employees || '',
      content_employees: act.content_employees || '',
      sub_department_id: act.sub_department_id || ''
    });
    setFormErrors({});
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setError('');
    setSuccessMsg('');
    try {
      if (currentActivity) {
        // Edit
        await api.put(`/activity-types/${currentActivity.id}`, formData);
        setSuccessMsg(`Activity type "${formData.activity_name}" updated successfully.`);
      } else {
        // Create
        await api.post('/activity-types', formData);
        setSuccessMsg(`Activity type "${formData.activity_name}" created successfully.`);
      }
      setIsFormOpen(false);
      fetchActivities();
      setTimeout(() => setSuccessMsg(''), 5000);
    } catch (err) {
      console.error(err);
      const errMsg = err.response?.data?.message || 'Operation failed. Check if code already exists.';
      setError(errMsg);
    }
  };

  const handleDelete = async (id, name) => {
    if (!(await window.confirm(`Are you sure you want to delete the activity type "${name}"?`))) return;

    setError('');
    setSuccessMsg('');
    try {
      await api.delete(`/activity-types/${id}`);
      setSuccessMsg(`Activity type "${name}" deleted.`);
      fetchActivities();
      setTimeout(() => setSuccessMsg(''), 5000);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to delete activity type.');
    }
  };

  const handleSyncSubmit = async (e) => {
    e.preventDefault();
    if (!syncUrl.trim()) return;

    setSyncLoading(true);
    setError('');
    setSuccessMsg('');
    try {
      const response = await api.post('/activity-types/sync', { url: syncUrl });
      if (response.data && response.data.success) {
        setSuccessMsg(response.data.message);
        setIsSyncOpen(false);
        setSyncUrl('');
        fetchActivities();
        setTimeout(() => setSuccessMsg(''), 6000);
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Sync failed. Ensure URL is shared and columns match.');
    } finally {
      setSyncLoading(false);
    }
  };

  // Filter logic
  const filteredActivities = activities.filter(act => {
    const matchesSearch = 
      act.activity_type_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      act.activity_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTeam = 
      teamFilter === 'all' || 
      Number(act.sub_department_id) === Number(teamFilter);
    return matchesSearch && matchesTeam;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredActivities.length / itemsPerPage);
  const paginatedActivities = filteredActivities.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;
    return (
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 20px', backgroundColor: 'var(--bg-app)', fontSize: '13px', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
        <div className="text-muted">
          Showing <strong>{(currentPage - 1) * itemsPerPage + 1}</strong> to <strong>{Math.min(currentPage * itemsPerPage, filteredActivities.length)}</strong> of <strong>{filteredActivities.length}</strong> entries
        </div>
        <div style={{ display: 'flex', gap: '4px' }}>
          <button 
            className="btn btn-sm btn-secondary" 
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            style={{ padding: '4px 10px' }}
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <button
              key={p}
              className={`btn btn-sm ${currentPage === p ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => handlePageChange(p)}
              style={{ padding: '4px 10px', minWidth: '32px' }}
            >
              {p}
            </button>
          ))}
          <button 
            className="btn btn-sm btn-secondary" 
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            style={{ padding: '4px 10px' }}
          >
            Next
          </button>
        </div>
      </div>
    );
  };

  const getSubDeptBadgeStyle = (id) => {
    // 1 = Video editor (purple), 2 = Graphic Design (sky), 3 = content writer (emerald)
    switch (Number(id)) {
      case 1:
        return { backgroundColor: '#faf5ff', color: '#6b21a8', borderColor: '#f3e8ff' };
      case 2:
        return { backgroundColor: '#e0f2fe', color: '#0369a1', borderColor: '#bae6fd' };
      case 3:
        return { backgroundColor: '#ecfdf5', color: '#065f46', borderColor: '#a7f3d0' };
      default:
        return { backgroundColor: '#f1f5f9', color: '#475569', borderColor: '#e2e8f0' };
    }
  };

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header" style={{ marginBottom: '24px' }}>
        <div className="page-title-section">
          <h2>Activity Types Settings</h2>
          <span className="page-subtitle">Configure deliverables setup times, role assignments, and employee targets to calculate operations efficiency</span>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn btn-secondary" onClick={() => setIsSyncOpen(true)}>
            <RefreshCw size={16} style={{ marginRight: '6px' }} /> Sync from Google Sheet
          </button>
          <button className="btn btn-primary" onClick={handleOpenCreate}>
            <Plus size={16} style={{ marginRight: '6px' }} /> Add Activity Type
          </button>
        </div>
      </div>

      {/* Messages */}
      {successMsg && (
        <div className="alert alert-success" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', padding: '12px 16px', backgroundColor: 'var(--success-light)', color: 'var(--success)', border: '1px solid var(--success)', borderRadius: 'var(--radius-md)', fontWeight: 600 }}>
          <CheckCircle size={18} />
          <span>{successMsg}</span>
        </div>
      )}

      {error && (
        <div className="alert alert-danger" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', padding: '12px 16px', backgroundColor: '#fef2f2', color: '#dc2626', border: '1px solid #fee2e2', borderRadius: 'var(--radius-md)', fontWeight: 600 }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Filters */}
      <div className="card" style={{ padding: '16px 20px', marginBottom: '16px', display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: '12px', flex: 1, minWidth: '280px', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
            <input
              type="text"
              placeholder="Search by code or activity name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-control"
              style={{ width: '100%', paddingLeft: '12px' }}
            />
          </div>
          <div style={{ minWidth: '180px' }}>
            <select
              value={teamFilter}
              onChange={(e) => setTeamFilter(e.target.value)}
              className="form-control"
              style={{ width: '100%', cursor: 'pointer' }}
            >
              <option value="all">All Teams / Roles</option>
              {subDepartments.map(sd => (
                <option key={sd.id} value={sd.id}>{sd.name}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="text-muted" style={{ fontSize: '13px' }}>
          Total Filtered: <strong>{filteredActivities.length}</strong> activity types
        </div>
      </div>

      {/* Main Table Card */}
      <div className="card" style={{ padding: '0px', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '250px', gap: '12px' }}>
            <div style={{ width: '36px', height: '36px', border: '3px solid #e2e8f0', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
            <p className="text-muted" style={{ fontWeight: 600 }}>Loading activity types...</p>
          </div>
        ) : filteredActivities.length === 0 ? (
          <div style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <Layers size={40} style={{ color: 'var(--text-light)', marginBottom: '12px', opacity: 0.6 }} />
            <h4>No Matching Activity Types</h4>
            <p style={{ fontSize: '13px', margin: '6px 0 0 0' }}>Try adjusting your search query or team filter</p>
          </div>
        ) : (
          <>
            {/* Top Pagination */}
            {renderPagination()}

            <div className="table-responsive">
              <table className="enterprise-table" style={{ margin: 0 }}>
                <thead>
                  <tr>
                    <th style={{ width: '120px' }}>Code</th>
                    <th>Activity Name</th>
                    <th style={{ width: '150px' }}>Editor Time</th>
                    <th style={{ width: '150px' }}>Content Time</th>
                    <th style={{ width: '220px' }}>Assigned Team / Role</th>
                    <th style={{ width: '120px', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedActivities.map(act => (
                    <tr key={act.id} style={{ verticalAlign: 'middle' }}>
                      <td>
                        <span className="badge badge-active" style={{ fontSize: '12px', fontWeight: 800, letterSpacing: '0.5px' }}>
                          {act.activity_type_code}
                        </span>
                      </td>
                      <td style={{ fontWeight: 600, color: 'var(--text-main)' }}>{act.activity_name}</td>
                      <td>
                        <span className="badge badge-in-progress" style={{ fontWeight: 600 }}>
                          {act.time_editor} mins
                        </span>
                      </td>
                      <td>
                        <span className="badge badge-pending" style={{ fontWeight: 600 }}>
                          {act.time_content} mins
                        </span>
                      </td>
                      <td>
                        <span 
                          className="badge" 
                          style={{ 
                            fontWeight: 700,
                            padding: '6px 12px',
                            fontSize: '12px',
                            border: '1px solid',
                            ...getSubDeptBadgeStyle(act.sub_department_id) 
                          }}
                        >
                          {act.sub_department_name || 'Unassigned'}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '6px' }}>
                          <button className="btn-icon" onClick={() => handleOpenEdit(act)} title="Edit Activity" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '6px', borderRadius: '4px', color: 'var(--primary)' }}>
                            <Edit2 size={16} />
                          </button>
                          <button className="btn-icon text-danger" onClick={() => handleDelete(act.id, act.activity_name)} title="Delete Activity" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '6px', borderRadius: '4px', color: '#dc2626' }}>
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Bottom Pagination */}
            <div style={{ borderTop: 'none' }}>
              {renderPagination()}
            </div>
          </>
        )}
      </div>

      {/* CREATE / EDIT MODAL */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={currentActivity ? `Edit Activity Type: ${currentActivity.activity_type_code}` : 'Create Activity Type'}
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setIsFormOpen(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleFormSubmit}>
              {currentActivity ? 'Save Changes' : 'Create Type'}
            </button>
          </>
        }
      >
        <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <FormInput
            label="Activity Code (e.g. AT001)"
            name="activity_type_code"
            value={formData.activity_type_code}
            onChange={handleInputChange}
            error={formErrors.activity_type_code}
            required
            disabled={!!currentActivity} // Can't change code once created
          />

          <FormInput
            label="Activity Name"
            name="activity_name"
            value={formData.activity_name}
            onChange={handleInputChange}
            error={formErrors.activity_name}
            required
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <FormInput
              label="Editor Setup Time (minutes)"
              name="time_editor"
              type="number"
              value={formData.time_editor}
              onChange={handleInputChange}
              error={formErrors.time_editor}
              required
            />
            <FormInput
              label="Creator Setup Time (minutes)"
              name="time_content"
              type="number"
              value={formData.time_content}
              onChange={handleInputChange}
              error={formErrors.time_content}
              required
            />
          </div>

          <FormSelect
            label="Assigned Team / Role"
            name="sub_department_id"
            value={formData.sub_department_id || ''}
            onChange={handleInputChange}
            options={[
              { value: '', label: 'Select Team / Role (Unassigned)' },
              ...subDepartments.map(sd => ({ value: sd.id, label: sd.name }))
            ]}
          />
        </form>
      </Modal>

      {/* GOOGLE SHEETS SYNC MODAL */}
      <Modal
        isOpen={isSyncOpen}
        onClose={() => setIsSyncOpen(false)}
        title="Sync Activity Types from Google Sheet"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setIsSyncOpen(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSyncSubmit} disabled={syncLoading || !syncUrl.trim()}>
              {syncLoading ? 'Syncing...' : 'Sync Now'}
            </button>
          </>
        }
      >
        <form onSubmit={handleSyncSubmit}>
          <p className="text-muted" style={{ fontSize: '13px', marginBottom: '16px' }}>
            Enter a public Google Sheets link. The sheet must contain a tab with activity code, time details, and employee columns:
          </p>

          <FormInput
            label="Google Sheets URL"
            name="syncUrl"
            value={syncUrl}
            onChange={(e) => setSyncUrl(e.target.value)}
            placeholder="https://docs.google.com/spreadsheets/d/.../edit#gid=1805900264"
            required
          />

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', backgroundColor: 'var(--primary-light)', color: 'var(--text-muted)', fontSize: '12px', borderRadius: '4px', marginTop: '16px', border: '1px solid var(--primary)' }}>
            <Link size={16} style={{ color: 'var(--secondary)', flexShrink: 0 }} />
            <span>Note: Ensure the spreadsheet sharing settings are set to <strong>"Anyone with the link can view"</strong> so the server can fetch it.</span>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ActivityTypeList;
