import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import { 
  ListTodo, 
  ExternalLink, 
  CheckCircle, 
  AlertCircle,
  FileText,
  Image as ImageIcon,
  RefreshCw,
  Facebook,
  Instagram,
  Linkedin,
  Globe,
  Users,
  Send,
  Check
} from 'lucide-react';

const ensureExternalLink = (url) => {
  if (!url) return '';
  const trimmed = url.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }
  return `https://${trimmed}`;
};

const SMMTodayPosting = ({ isEmployee = false }) => {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionInProgress, setActionInProgress] = useState(null);
  
  // Selection and Assignment States
  const [selectedIds, setSelectedIds] = useState([]);
  const [bulkEmployeeId, setBulkEmployeeId] = useState('');
  const [selectedEmployees, setSelectedEmployees] = useState({}); // { itemId: employeeId }
  
  // Filtration and Pagination States
  const [queueFilter, setQueueFilter] = useState('all'); // all | unassigned | assigned | posted (manager) OR all | pending | posted (employee)
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Custom Modal State
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'alert', // 'alert' | 'confirm'
    onConfirm: null,
    onClose: null
  });

  const showModal = (config) => {
    setModalConfig({
      isOpen: true,
      title: config.title || 'Message',
      message: config.message || '',
      type: config.type || 'alert',
      onConfirm: config.onConfirm || null,
      onClose: config.onClose || null
    });
  };

  const closeModal = () => {
    if (modalConfig.onClose) modalConfig.onClose();
    setModalConfig(prev => ({ ...prev, isOpen: false }));
  };

  const confirmAction = () => {
    if (modalConfig.onConfirm) modalConfig.onConfirm();
    setModalConfig(prev => ({ ...prev, isOpen: false }));
  };

  const fetchTodayPostings = useCallback(async () => {
    setLoading(true);
    try {
      const d = new Date();
      const todayStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      
      const params = {
        departmentFilter: 1, // Creatives
        smmTodayFilter: todayStr,
        statusFilter: 'approved,manager_approved,client_approved,sent_to_client,assigned,assigned_employee,posted,completed',
        limit: 100,
        page: 1
      };

      const empId = user?.employeeProfile?.employee_id || user?.employeeProfile?.id;
      if (isEmployee && empId) {
        params.employeeFilter = empId;
      }
      
      const res = await api.get('/deliverables', { params });

      if (res.data.success) {
        setItems(res.data.data.deliverables || []);
      }
    } catch (err) {
      console.error('Error fetching today SMM postings:', err.message);
    } finally {
      setLoading(false);
    }
  }, [isEmployee, user]);

  // Fetch SMM employees for assignment
  useEffect(() => {
    if (!isEmployee && user?.managerProfile?.department_id) {
      api.get('/users/employees/dropdown', {
        params: { departmentId: user.managerProfile.department_id }
      }).then(res => {
        if (res.data.success) {
          setEmployees(res.data.data.employees || []);
        }
      }).catch(err => {
        console.error('Error fetching SMM employees:', err.message);
      });
    }
  }, [isEmployee, user]);

  useEffect(() => {
    fetchTodayPostings();
  }, [fetchTodayPostings]);

  const handleMarkAsPosted = async (itemId) => {
    const item = items.find(x => x.id === itemId);
    const isJobWork = item?.is_job_work === 1;
    showModal({
      title: 'Confirm Publish',
      message: 'Are you sure you want to mark this item as posted on social media?',
      type: 'confirm',
      onConfirm: async () => {
        setActionInProgress(itemId);
        try {
          let res;
          try {
            res = await api.post(`/deliverables/${itemId}/status`, { status: 'posted', isJobWork });
          } catch (_) {
            res = await api.patch(`/deliverables/${itemId}/status`, { status: 'posted', isJobWork });
          }
          if (res.data.success) {
            showModal({
              title: 'Success',
              message: 'Deliverable successfully marked as Posted!',
              type: 'alert'
            });
            // Update local state instead of erasing the item, so it stays visible for today
            setItems(prev => prev.map(item => item.id === itemId ? { ...item, status: isJobWork ? 'completed' : 'posted' } : item));
          }
        } catch (err) {
          showModal({
            title: 'Error',
            message: err.response?.data?.message || 'Failed to update posting status.',
            type: 'alert'
          });
        } finally {
          setActionInProgress(null);
        }
      }
    });
  };

  const handleAssignEmployee = async (itemId, empId) => {
    if (!empId) {
      showModal({
        title: 'Select Employee',
        message: 'Please select an employee from the dropdown list.',
        type: 'alert'
      });
      return;
    }
    const item = items.find(x => x.id === itemId);
    const isJobWork = item?.is_job_work === 1;
    setActionInProgress(itemId);
    try {
      let res;
      const assignPayload = { employeeId: Number(empId), isJobWork };
      const endpoint = isJobWork ? `/deliverables/job-work/${itemId}/assign` : `/deliverables/${itemId}/assign`;
      try {
        res = await api.post(endpoint, assignPayload);
      } catch (_) {
        res = await api.put(endpoint, assignPayload);
      }
      if (res.data.success) {
        showModal({
          title: 'Success',
          message: 'Deliverable assigned to SMM Employee successfully!',
          type: 'alert'
        });
        fetchTodayPostings();
      }
    } catch (err) {
      showModal({
        title: 'Error',
        message: err.response?.data?.message || 'Failed to assign deliverable.',
        type: 'alert'
      });
    } finally {
      setActionInProgress(null);
    }
  };

  const handleBulkAssign = async () => {
    if (selectedIds.length === 0) return;
    if (!bulkEmployeeId) {
      showModal({
        title: 'Select Employee',
        message: 'Please select an employee for bulk assignment.',
        type: 'alert'
      });
      return;
    }
    setActionInProgress('bulk');
    try {
      await Promise.all(selectedIds.map(async id => {
        const item = items.find(x => x.id === id);
        const isJobWork = item?.is_job_work === 1;
        const assignPayload = { employeeId: Number(bulkEmployeeId), isJobWork };
        const endpoint = isJobWork ? `/deliverables/job-work/${id}/assign` : `/deliverables/${id}/assign`;
        try {
          return await api.post(endpoint, assignPayload);
        } catch (_) {
          return await api.put(endpoint, assignPayload);
        }
      }));
      showModal({
        title: 'Success',
        message: 'Selected deliverables assigned successfully in bulk!',
        type: 'alert'
      });
      setSelectedIds([]);
      setBulkEmployeeId('');
      fetchTodayPostings();
    } catch (err) {
      showModal({
        title: 'Error',
        message: err.response?.data?.message || 'Failed to complete bulk assignment.',
        type: 'alert'
      });
    } finally {
      setActionInProgress(null);
    }
  };

  const toggleSelect = (itemId) => {
    setSelectedIds(prev => 
      prev.includes(itemId) ? prev.filter(id => id !== itemId) : [...prev, itemId]
    );
  };

  const toggleSelectAll = () => {
    const unassignedItems = filteredItems.filter(item => !item.smm_employee_id && !['posted', 'completed'].includes(item.status));
    const targetItems = unassignedItems.length > 0 ? unassignedItems : filteredItems.filter(item => !['posted', 'completed'].includes(item.status));
    
    if (selectedIds.length === targetItems.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(targetItems.map(item => item.id));
    }
  };

  // Client-side filtration logic
  const filteredItems = items.filter(item => {
    // Search query filter
    const matchesSearch = 
      item.deliverable.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.client_name.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;

    const isAssigned = !!item.smm_employee_id;
    
    // Exclude deliverables that are assigned to Creative Designers (status is 'assigned' or 'assigned_employee' but they are not SMM employees)
    if (!isEmployee && ['assigned', 'assigned_employee'].includes(item.status) && !isAssigned) {
      return false;
    }

    const isPosted = ['posted', 'completed'].includes(item.status);
    const itemDueDate = item.due_date ? item.due_date.substring(0, 10) : '';
    const todayStr = new Date().toISOString().substring(0, 10);
    const isEscalated = !isPosted && itemDueDate && itemDueDate < todayStr;

    if (isEmployee) {
      if (queueFilter === 'pending') {
        return !isPosted;
      }
      if (queueFilter === 'posted') {
        return isPosted;
      }
      if (queueFilter === 'escalated') {
        return isEscalated;
      }
      return true; // all
    } else {
      if (queueFilter === 'unassigned') {
        return !isAssigned && !isPosted;
      }
      if (queueFilter === 'assigned') {
        return isAssigned && !isPosted;
      }
      if (queueFilter === 'posted') {
        return isPosted;
      }
      if (queueFilter === 'escalated') {
        return isEscalated;
      }
      return true; // all
    }
  });

  // Client-side pagination calculation
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const paginatedItems = filteredItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Reset page when search or filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, queueFilter]);

  const todayDisplayStr = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div style={{ padding: '30px', maxWidth: '1400px', margin: '0 auto' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-color)', display: 'flex', alignItems: 'center', gap: '10px', margin: 0 }}>
            <ListTodo size={26} style={{ color: 'var(--primary)' }} />
            Today's Postings Queue {isEmployee ? '(Employee)' : '(Manager)'}
          </h1>
          <p style={{ margin: '6px 0 0 0', color: 'var(--text-muted)', fontSize: '14px' }}>
            {isEmployee 
              ? 'List of approved design deliverables assigned to you for posting today: ' 
              : 'Manage and delegate creative-approved posts scheduled for today: '
            }
            <strong style={{ color: 'var(--primary)' }}>{todayDisplayStr}</strong>.
          </p>
        </div>

        {/* Filter, Search and Refresh Toolbar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          
          {/* Search Box */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Search Postings</label>
            <input
              type="text"
              className="form-control"
              placeholder="Search client, title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ minWidth: '200px', fontSize: '13px', padding: '6px 12px', height: '38px', margin: 0 }}
            />
          </div>

          {/* Filter dropdown */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Filter Queue</label>
            <select
              value={queueFilter}
              onChange={(e) => {
                setQueueFilter(e.target.value);
                setSelectedIds([]); // Clear selection when filter changes
              }}
              className="form-control"
              style={{ minWidth: '180px', fontSize: '13px', padding: '6px 10px', height: '38px', margin: 0 }}
            >
              {isEmployee ? (
                <>
                  <option value="all">All Postings</option>
                  <option value="pending">Pending Publish</option>
                  <option value="posted">Posted Today</option>
                  <option value="escalated">Pending</option>
                </>
              ) : (
                <>
                  <option value="all">All Postings</option>
                  <option value="unassigned">Unassigned / New</option>
                  <option value="assigned">Sent to SMM Staff</option>
                  <option value="posted">Posted Today</option>
                  <option value="escalated">Pending</option>
                </>
              )}
            </select>
          </div>

          <button 
            onClick={fetchTodayPostings}
            disabled={loading}
            style={{
              padding: '8px 16px',
              backgroundColor: 'var(--bg-light)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-sm)',
              fontWeight: 700,
              fontSize: '13px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              height: '38px',
              marginTop: '19px'
            }}
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>
      </div>

      {/* Bulk Action Bar (For SMM Managers only) */}
      {!isEmployee && filteredItems.some(item => !item.smm_employee_id && !['posted', 'completed'].includes(item.status)) && (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          padding: '16px 20px', 
          backgroundColor: '#f8fafc', 
          border: '1px solid var(--border-color)', 
          borderRadius: 'var(--radius-md)', 
          marginBottom: '24px',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={toggleSelectAll}
              className="btn btn-secondary btn-sm"
              style={{ padding: '6px 12px', fontWeight: 700, fontSize: '12px' }}
            >
              {selectedIds.length === filteredItems.filter(item => !item.smm_employee_id && !['posted', 'completed'].includes(item.status)).length && selectedIds.length > 0
                ? 'Deselect All' 
                : 'Select All Unassigned'
              }
            </button>
            <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-muted)' }}>
              {selectedIds.length} item(s) selected
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-muted)' }}>Assign to Employee:</span>
            <select
              className="form-control"
              value={bulkEmployeeId}
              onChange={(e) => setBulkEmployeeId(e.target.value)}
              style={{ minWidth: '180px', fontSize: '13px', padding: '6px 10px', height: '38px', margin: 0 }}
            >
              <option value="">Select Employee...</option>
              {employees.map(emp => (
                <option key={emp.id} value={emp.id}>{emp.full_name}</option>
              ))}
            </select>
            <button
              className="btn btn-primary"
              onClick={handleBulkAssign}
              disabled={selectedIds.length === 0 || !bulkEmployeeId || actionInProgress !== null}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontWeight: 700, padding: '8px 18px', height: '38px' }}
            >
              <Send size={13} /> Bulk Send
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div style={{ padding: '80px', textAlign: 'center', color: 'var(--text-muted)' }}>
          <div style={{ width: '32px', height: '32px', border: '3px solid #e2e8f0', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 12px auto' }}></div>
          <span>Loading today's postings...</span>
        </div>
      ) : filteredItems.length === 0 ? (
        <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--border-color)', padding: '60px 40px', textAlign: 'center', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)' }}>
          <CheckCircle size={44} style={{ color: 'var(--success)', marginBottom: '12px' }} />
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: 'var(--text-color)' }}>No Postings Found</h3>
          <p style={{ margin: '8px 0 0 0', color: 'var(--text-muted)', fontSize: '14px' }}>
            There are no postings matching your filter query for today.
          </p>
        </div>
      ) : (
        <div className="card" style={{ padding: '20px', borderRadius: 'var(--radius-md)', backgroundColor: '#ffffff', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ overflowX: 'auto' }}>
            <table className="enterprise-table" style={{ width: '100%', minWidth: '1000px' }}>
              <thead>
                <tr>
                  {!isEmployee && (
                    <th style={{ width: '40px', textAlign: 'center' }}>
                      <input 
                        type="checkbox"
                        checked={selectedIds.length === filteredItems.filter(item => !item.smm_employee_id && !['posted', 'completed'].includes(item.status)).length && selectedIds.length > 0}
                        onChange={toggleSelectAll}
                        style={{ cursor: 'pointer' }}
                      />
                    </th>
                  )}
                  <th style={{ width: '150px' }}>Client</th>
                  <th>Deliverable Title</th>
                  <th style={{ width: '130px', textAlign: 'center' }}>Content Script</th>
                  <th style={{ width: '130px', textAlign: 'center' }}>Visual Design</th>
                  {!isEmployee && <th style={{ width: '220px', textAlign: 'center' }}>Assign SMM Staff</th>}
                  {!isEmployee && <th style={{ width: '100px', textAlign: 'center' }}>Send to Staff</th>}
                  <th style={{ width: '150px', textAlign: 'center' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {paginatedItems.map(item => {
                  const isAssignedToSMM = !!item.smm_employee_id;
                  const isChecked = selectedIds.includes(item.id);

                  return (
                    <tr key={item.id} style={{ verticalAlign: 'middle' }}>
                      {!isEmployee && (
                        <td style={{ textAlign: 'center' }}>
                          {!isAssignedToSMM && !['posted', 'completed'].includes(item.status) ? (
                            <input 
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => toggleSelect(item.id)}
                              style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                            />
                          ) : (
                            <span style={{ color: '#cbd5e1', fontSize: '12px' }}>-</span>
                          )}
                        </td>
                      )}
                      <td style={{ fontWeight: 700, color: 'var(--text-color)' }}>
                        {item.client_name}
                      </td>
                      <td style={{ fontWeight: 600 }}>
                        {item.deliverable}
                        {(() => {
                          const isPosted = ['posted', 'completed'].includes(item.status);
                          const itemDueDate = item.due_date ? item.due_date.substring(0, 10) : '';
                          const todayStr = new Date().toISOString().substring(0, 10);
                          const isEscalated = !isPosted && itemDueDate && itemDueDate < todayStr;
                          return isEscalated ? (
                            <span style={{ 
                              marginLeft: '8px', 
                              fontSize: '10px', 
                              textTransform: 'uppercase', 
                              backgroundColor: 'rgba(245, 158, 11, 0.1)', 
                              color: '#f59e0b', 
                              padding: '2px 8px', 
                              borderRadius: '4px',
                              fontWeight: 800,
                              border: '1px solid rgba(245, 158, 11, 0.2)',
                              display: 'inline-block',
                              verticalAlign: 'middle'
                            }}>
                              Pending
                            </span>
                          ) : null;
                        })()}
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        {item.content_link ? (
                          <a 
                            href={ensureExternalLink(item.content_link)}
                            target="_blank"
                            rel="noreferrer"
                            className="btn btn-secondary btn-sm"
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '6px 12px', fontSize: '12px', fontWeight: 600 }}
                          >
                            <FileText size={12} /> Open Doc
                          </a>
                        ) : (
                          <span style={{ fontSize: '12px', color: '#cbd5e1', fontStyle: 'italic' }}>No link</span>
                        )}
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        {item.google_drive_link ? (
                          <a 
                            href={ensureExternalLink(item.google_drive_link)}
                            target="_blank"
                            rel="noreferrer"
                            className="btn btn-secondary btn-sm"
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '6px 12px', fontSize: '12px', fontWeight: 600 }}
                          >
                            <ImageIcon size={12} /> Open Asset
                          </a>
                        ) : (
                          <span style={{ fontSize: '12px', color: '#cbd5e1', fontStyle: 'italic' }}>No link</span>
                        )}
                      </td>
                      {!isEmployee && (
                        <td>
                           {isAssignedToSMM || ['posted', 'completed'].includes(item.status) ? (
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--success)', fontWeight: 700, fontSize: '13px', justifyContent: 'center', width: '100%' }}>
                              <Check size={14} /> {item.smm_employee_name || 'Assigned'}
                            </div>
                          ) : (
                            <select
                              className="form-control"
                              value={selectedEmployees[item.id] || ''}
                              onChange={(e) => setSelectedEmployees(prev => ({ ...prev, [item.id]: e.target.value }))}
                              style={{ width: '100%', fontSize: '12px', padding: '4px 6px', height: '32px', margin: 0 }}
                            >
                              <option value="">Select Employee...</option>
                              {employees.map(emp => (
                                <option key={emp.id} value={emp.id}>{emp.full_name}</option>
                              ))}
                            </select>
                          )}
                        </td>
                      )}
                      {!isEmployee && (
                        <td style={{ textAlign: 'center' }}>
                          {['posted', 'completed'].includes(item.status) ? (
                            <span style={{ color: 'var(--success)' }}>
                              <CheckCircle size={16} style={{ margin: '0 auto' }} />
                            </span>
                          ) : !isAssignedToSMM ? (
                            <button
                              onClick={() => handleAssignEmployee(item.id, selectedEmployees[item.id])}
                              disabled={!selectedEmployees[item.id] || actionInProgress !== null}
                              className="btn btn-primary btn-sm"
                              style={{ padding: '6px 12px', fontSize: '11px', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px', height: '32px' }}
                            >
                              <Send size={11} /> Send
                            </button>
                          ) : (
                            <span style={{ color: 'var(--success)' }}>
                              <CheckCircle size={16} style={{ margin: '0 auto' }} />
                            </span>
                          )}
                        </td>
                      )}
                      <td style={{ textAlign: 'center' }}>
                        {['posted', 'completed'].includes(item.status) ? (
                          <span style={{ color: 'var(--success)', fontWeight: 700, fontSize: '13px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            <CheckCircle size={14} /> Posted
                          </span>
                        ) : (
                          isEmployee ? (
                            <button
                              onClick={() => handleMarkAsPosted(item.id)}
                              disabled={actionInProgress === item.id}
                              className="btn btn-success btn-sm"
                              style={{ padding: '6px 12px', fontWeight: 700, fontSize: '12px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                            >
                              {actionInProgress === item.id ? (
                                <span>Posting...</span>
                              ) : (
                                <>
                                  <Globe size={13} />
                                  Post
                                </>
                              )}
                            </button>
                          ) : (
                            <span style={{ color: 'var(--text-muted)', fontSize: '12px', fontWeight: 500 }}>Awaiting SMM</span>
                          )
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Client-side Pagination Controls */}
          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border-color)', flexWrap: 'wrap', gap: '12px' }}>
              <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredItems.length)} of {filteredItems.length} entries
              </span>
              <div style={{ display: 'flex', gap: '4px' }}>
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => prev - 1)}
                  className="btn btn-secondary btn-sm"
                  style={{ padding: '4px 8px' }}
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <button
                    key={p}
                    onClick={() => setCurrentPage(p)}
                    className={`btn btn-sm ${currentPage === p ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ padding: '4px 10px', minWidth: '32px', height: '30px' }}
                  >
                    {p}
                  </button>
                ))}
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  className="btn btn-secondary btn-sm"
                  style={{ padding: '4px 8px' }}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Custom Alert/Confirm Modal Overlay */}
      {modalConfig.isOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 9999
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            width: '450px',
            maxWidth: '90%',
            padding: '24px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            border: '1px solid var(--border-color)'
          }}>
            <h3 style={{ 
              margin: '0 0 12px 0', 
              fontSize: '18px', 
              fontWeight: 800, 
              color: 'var(--text-color)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              {modalConfig.title === 'Success' ? (
                <CheckCircle style={{ color: 'var(--success)' }} size={20} />
              ) : modalConfig.title === 'Error' ? (
                <AlertCircle style={{ color: 'var(--danger)' }} size={20} />
              ) : (
                <ListTodo style={{ color: 'var(--primary)' }} size={20} />
              )}
              {modalConfig.title}
            </h3>
            
            <p style={{ 
              margin: '0 0 20px 0', 
              fontSize: '14px', 
              color: 'var(--text-muted)',
              lineHeight: 1.5
            }}>
              {modalConfig.message}
            </p>
            
            <div style={{ 
              display: 'flex', 
              justifyContent: 'flex-end', 
              gap: '10px' 
            }}>
              {modalConfig.type === 'confirm' ? (
                <>
                  <button 
                    onClick={closeModal}
                    className="btn btn-secondary btn-sm"
                    style={{ 
                      padding: '8px 16px', 
                      fontSize: '13px', 
                      fontWeight: 700 
                    }}
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={confirmAction}
                    className="btn btn-primary btn-sm"
                    style={{ 
                      padding: '8px 16px', 
                      fontSize: '13px', 
                      fontWeight: 700 
                    }}
                  >
                    Confirm
                  </button>
                </>
              ) : (
                <button 
                  onClick={closeModal}
                  className="btn btn-primary btn-sm"
                  style={{ 
                    padding: '8px 16px', 
                    fontSize: '13px', 
                    fontWeight: 700 
                  }}
                >
                  OK
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SMMTodayPosting;
