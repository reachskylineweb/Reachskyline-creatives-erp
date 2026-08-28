import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  RefreshCw, Play, AlertTriangle, Send, 
  ExternalLink, MessageSquare, CheckCircle, Search, 
  ChevronLeft, ChevronRight 
} from 'lucide-react';
import api from '../../utils/api';
import Modal from '../../components/Modal';
import { useAuth } from '../../context/AuthContext';

const ensureExternalLink = (url) => {
  if (!url) return '';
  const trimmed = url.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }
  return `https://${trimmed}`;
};

const EmployeeReassignedWork = () => {
  const { user } = useAuth();
  const isContentWriter = user?.employeeProfile?.sub_department_id === 3;

  const [selectedMonth, setSelectedMonth] = useState(() => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
  });

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submittingId, setSubmittingId] = useState(null);
  const [driveLinks, setDriveLinks] = useState({});

  // Pagination & Search States
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [statusFilter, setStatusFilter] = useState('all'); // all | reassigned | submitted

  // Active popup corrections item
  const [activeManagerTextItem, setActiveManagerTextItem] = useState(null);
  const [activeClientTextItem, setActiveClientTextItem] = useState(null);

  const [confirmStartModal, setConfirmStartModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {}
  });

  const fetchReworkQueue = useCallback(async () => {
    setLoading(true);
    try {
      const [delivsRes, contentRes, jobWorksRes] = await Promise.all([
        api.get('/deliverables/employee/all'),
        api.get('/content-work/reassigned').catch(() => ({ data: { success: false, data: [] } })),
        api.get('/deliverables/job-work/employee').catch(() => ({ data: { success: false, data: [] } }))
      ]);

      let combined = [];

      if (delivsRes.data.success) {
        const reworkTasks = (delivsRes.data.data.deliverables || []).filter(
          item => item.status === 'reassigned' || item.status === 'submitted'
        ).map(task => ({
          ...task,
          isContentWork: false,
          isJobWork: false
        }));
        combined = [...combined, ...reworkTasks];
      }

      if (contentRes.data.success) {
        const contentTasks = (contentRes.data.data || []).map(task => ({
          ...task,
          isContentWork: true,
          isJobWork: false,
          due_date: task.date || null
        }));
        combined = [...combined, ...contentTasks];
      }

      if (jobWorksRes.data.success) {
        const jobReworks = (jobWorksRes.data.data || []).filter(
          item => item.status === 'reassigned' || item.status === 'submitted'
        ).map(task => ({
          ...task,
          id: task.id,
          isContentWork: false,
          isJobWork: true,
          due_date: task.deadline || null
        }));
        combined = [...combined, ...jobReworks];
      }

      setItems(combined);
    } catch (err) {
      console.error('Error fetching rework queue:', err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReworkQueue();
  }, [fetchReworkQueue]);

  // Reset page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handleSubmitRework = async (item) => {
    const link = driveLinks[item.id];
    if (!link || !link.trim()) {
      alert('Please paste the updated work link before submitting.');
      return;
    }
    
    setSubmittingId(item.id);
    try {
      if (item.isContentWork) {
        let endpoint = '';
        if (item.category === 'content_calendar') {
          endpoint = `/content-work/assigned-content-calendar/${item.id}/submit`;
        } else if (item.category === 'event_days') {
          endpoint = `/content-work/assigned-event-days/${item.id}/submit`;
        } else {
          endpoint = `/content-work/assigned-shoot-scripts/${item.id}/submit`;
        }
        const res = await api.post(endpoint, { work_link: link });
        if (res.data.success) {
          alert('Content rework successfully submitted to manager.');
          setDriveLinks(prev => {
            const next = { ...prev };
            delete next[item.id];
            return next;
          });
          fetchReworkQueue();
        }
      } else if (item.isJobWork) {
        const res = await api.post(`/deliverables/job-work/${item.id}/submit`, { googleDriveLink: link });
        if (res.data.success) {
          alert('Job work rework successfully submitted to manager.');
          setDriveLinks(prev => {
            const next = { ...prev };
            delete next[item.id];
            return next;
          });
          fetchReworkQueue();
        }
      } else {
        const res = await api.post(`/deliverables/${item.id}/submit`, { googleDriveLink: link });
        if (res.data.success) {
          alert('Rework successfully submitted to manager.');
          setDriveLinks(prev => {
            const next = { ...prev };
            delete next[item.id];
            return next;
          });
          fetchReworkQueue();
        }
      }
    } catch (err) {
      console.error('Error submitting rework:', err.message);
      alert(err.response?.data?.message || 'Failed to submit rework.');
    } finally {
      setSubmittingId(null);
    }
  };

  const isTaskStarted = (item) => {
    if (item.isJobWork) {
      return isContentWriter ? !!item.writer_started_at : !!item.started_at;
    }
    return !!item.started_at;
  };

  const executeStartRework = async (item) => {
    const key = item.id;
    setSubmittingId(key);
    try {
      let res;
      if (item.isContentWork) {
        let endpoint = '';
        if (item.category === 'content_calendar') {
          endpoint = `/content-work/assigned-content-calendar/${item.id}/start`;
        } else if (item.category === 'event_days') {
          endpoint = `/content-work/assigned-event-days/${item.id}/start`;
        } else {
          endpoint = `/content-work/assigned-shoot-scripts/${item.id}/start`;
        }
        res = await api.post(endpoint);
      } else if (item.isJobWork) {
        res = await api.post(`/deliverables/job-work/${item.id}/start`);
      } else {
        res = await api.put(`/deliverables/${item.id}/start`);
      }

      if (res.data.success) {
        alert('Rework timer started!');
        fetchReworkQueue();
      }
    } catch (err) {
      console.error('Error starting rework:', err.message);
      alert(err.response?.data?.message || 'Failed to start rework.');
    } finally {
      setSubmittingId(null);
    }
  };

  const handleStartRework = (item) => {
    const title = item.title || item.deliverable || item.activity_name || 'Rework Task';
    setConfirmStartModal({
      isOpen: true,
      title: 'Confirm Start Rework Task',
      message: `Are you sure you want to start rework on "${title}"? The timer will begin tracking your rework time.`,
      onConfirm: () => executeStartRework(item)
    });
  };

  const handleLinkChange = (id, val) => {
    setDriveLinks(prev => ({ ...prev, [id]: val }));
  };

  // Truncate corrections text helper
  const truncateText = (text, maxLen = 30) => {
    if (!text) return 'No feedback';
    if (text.length <= maxLen) return text;
    return text.substring(0, maxLen) + '...';
  };

  const handlePrevMonth = () => {
    const [year, month] = selectedMonth.split('-').map(Number);
    const date = new Date(year, month - 2, 1);
    setSelectedMonth(`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`);
  };

  const handleNextMonth = () => {
    const [year, month] = selectedMonth.split('-').map(Number);
    const date = new Date(year, month, 1);
    setSelectedMonth(`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`);
  };

  const formatMonthLabel = (monthStr) => {
    const [year, month] = monthStr.split('-');
    const date = new Date(year, month - 1, 1);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  // Filter reworks
  const filteredItems = items.filter(item => {
    const term = searchTerm.toLowerCase();
    const clientName = item.client_name || 'Event Day';
    const searchMatch = (
      clientName.toLowerCase().includes(term) ||
      item.title?.toLowerCase().includes(term) ||
      (item.isContentWork ? item.category : item.activity_type_code)?.toLowerCase().includes(term)
    );

    const itemMonth = item.isContentWork 
      ? item.month 
      : (item.due_date ? item.due_date.substring(0, 7) : null);
      
    let statusMatch = true;
    if (statusFilter === 'reassigned') {
      statusMatch = item.status === 'reassigned';
    } else if (statusFilter === 'submitted') {
      statusMatch = item.status === 'submitted';
    }

    return searchMatch && itemMonth === selectedMonth && statusMatch;
  });

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const paginatedItems = filteredItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const renderPaginationControls = () => {
    if (totalPages <= 1) return null;
    return (
      <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
        <button
          className="pagination-btn"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(p => p - 1)}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '32px', height: '32px', border: '1px solid var(--border-color)', borderRadius: '4px', backgroundColor: '#fff', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', opacity: currentPage === 1 ? 0.5 : 1 }}
        >
          <ChevronLeft size={16} />
        </button>
        
        {Array.from({ length: totalPages }, (_, i) => i + 1)
          .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
          .map((p, idx, arr) => {
            const prev = arr[idx - 1];
            const showEllipsis = prev && p - prev > 1;
            return (
              <React.Fragment key={p}>
                {showEllipsis && <span style={{ padding: '0 4px', color: 'var(--text-muted)', fontSize: '13px' }}>...</span>}
                <button
                  onClick={() => setCurrentPage(p)}
                  style={{
                    minWidth: '32px',
                    height: '32px',
                    padding: '0 6px',
                    border: '1px solid',
                    borderColor: currentPage === p ? 'var(--primary)' : 'var(--border-color)',
                    borderRadius: '4px',
                    backgroundColor: currentPage === p ? 'var(--primary)' : '#fff',
                    color: currentPage === p ? '#fff' : 'var(--text-main)',
                    fontWeight: 700,
                    fontSize: '13px',
                    cursor: 'pointer',
                    transition: 'all 0.15s'
                  }}
                >
                  {p}
                </button>
              </React.Fragment>
            );
          })}

        <button
          className="pagination-btn"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(p => p + 1)}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '32px', height: '32px', border: '1px solid var(--border-color)', borderRadius: '4px', backgroundColor: '#fff', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', opacity: currentPage === totalPages ? 0.5 : 1 }}
        >
          <ChevronRight size={16} />
        </button>
      </div>
    );
  };

  return (
    <div style={{ padding: '30px', maxWidth: '1400px', margin: '0 auto' }}>
      
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-color)', display: 'flex', alignItems: 'center', gap: '10px', margin: 0 }}>
            <AlertTriangle size={26} style={{ color: 'var(--warning)' }} />
            Reassigned Work (Reworks)
          </h1>
          <p style={{ margin: '6px 0 0 0', color: 'var(--text-muted)', fontSize: '13px' }}>
            List of deliverables requiring corrections or changes based on manager or client feedback.
          </p>
        </div>
        <button className="btn btn-secondary" onClick={fetchReworkQueue} disabled={loading} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* Toolbar / Search & TOP Pagination */}
      <div className="table-toolbar" style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '16px 20px', backgroundColor: '#fff', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md) var(--radius-md) 0 0', borderBottom: 'none' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
          <div className="pagination-controls" style={{ margin: 0 }}>
            <button className="btn btn-secondary btn-sm" onClick={handlePrevMonth}>
              <ChevronLeft size={16} />
            </button>
            <span style={{ fontWeight: 700, fontSize: '16px', color: 'var(--text-main)', minWidth: '150px', textAlign: 'center', display: 'inline-block' }}>
              {formatMonthLabel(selectedMonth)}
            </span>
            <button className="btn btn-secondary btn-sm" onClick={handleNextMonth}>
              <ChevronRight size={16} />
            </button>
          </div>
          
          <input 
            type="month" 
            value={selectedMonth} 
            onChange={(e) => setSelectedMonth(e.target.value)}
            style={{ padding: '6px 12px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', outline: 'none' }}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ position: 'relative', flex: 1, maxWidth: '600px', display: 'flex', gap: '12px' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <Search style={{ position: 'absolute', left: '12px', top: '10px', color: 'var(--text-muted)' }} size={16} />
              <input
                type="text"
                placeholder="Search by client or title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-control"
                style={{ width: '100%', paddingLeft: '36px', fontSize: '13px', margin: 0 }}
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="form-control"
              style={{ width: '180px', fontSize: '13px', margin: 0, padding: '6px 12px' }}
            >
              <option value="all">All Reworks</option>
              <option value="reassigned">Rework Requested</option>
              <option value="submitted">Sent for Approval</option>
            </select>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 14px', borderRadius: '99px', backgroundColor: '#fef3c7', border: '1px solid #fde68a', color: '#b45309', fontWeight: 700, fontSize: '13px', whiteSpace: 'nowrap' }}>
              <span>Reworks:</span>
              <strong>{filteredItems.length}</strong>
            </div>
          </div>

          {/* Top Pagination */}
          {renderPaginationControls()}
        </div>
      </div>

      {/* Main List Table */}
      <div className="card" style={{ padding: '20px', borderRadius: '0 0 var(--radius-md) var(--radius-md)', minHeight: '300px' }}>
        {loading ? (
          <div style={{ padding: '80px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <div style={{ width: '32px', height: '32px', border: '3px solid #e2e8f0', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 12px auto' }}></div>
            <span>Loading rework items...</span>
          </div>
        ) : filteredItems.length === 0 ? (
          <div style={{ padding: '60px 40px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <CheckCircle size={40} style={{ margin: '0 auto 12px auto', color: 'var(--success)', opacity: 0.8 }} />
            <h3 style={{ margin: 0, fontWeight: 700, color: 'var(--text-color)' }}>Rework Queue is Clear</h3>
            <p style={{ margin: '4px 0 0 0', fontSize: '13px' }}>
              Excellent job! No deliverables require correction at this time.
            </p>
          </div>
        ) : (
          <>
            <div style={{ overflowX: 'auto' }}>
              <table className="enterprise-table" style={{ width: '100%', minWidth: '1200px' }}>
                <thead>
                  <tr>
                    <th style={{ width: '160px' }}>Client & Category</th>
                    <th style={{ width: '180px' }}>Deliverable</th>
                    <th style={{ width: '160px' }}>Manager Corrections</th>
                    <th style={{ width: '160px' }}>Client Corrections</th>
                    <th style={{ width: '110px' }}>Original Link</th>
                    <th style={{ width: '220px' }}>Paste Updated Link</th>
                    <th style={{ width: '130px' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedItems.map(item => {
                    const prevLink = item.isJobWork ? item.content_link : (item.isContentWork ? item.work_link : item.google_drive_link);

                    return (
                      <tr key={item.isJobWork ? `job-${item.id}` : (item.isContentWork ? `content-${item.category}-${item.id}` : `deliv-${item.id}`)} style={{ verticalAlign: 'middle' }}>
                        
                        {/* Column 1: Client & Category */}
                        <td>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                            <strong style={{ color: 'var(--text-color)', fontSize: '13px' }}>
                              {item.client_name || 'Event Day'}
                            </strong>
                            <span className="badge badge-pending" style={{ textTransform: 'uppercase', fontSize: '9px', width: 'fit-content' }}>
                              {item.isJobWork ? 'Job Work' : (item.isContentWork ? `Content: ${item.category?.replace('_', ' ')}` : 'Deliverable')}
                            </span>
                          </div>
                        </td>

                        {/* Column 2: Deliverable Title */}
                        <td>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                            <span style={{ fontWeight: 600, fontSize: '13px' }}>
                              {item.isContentWork ? item.title : item.activity_name || item.activity_type_code}
                            </span>
                            {!item.isContentWork && (
                              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{item.title}</span>
                            )}
                          </div>
                        </td>

                        {/* Column 3: Manager Corrections (Text) */}
                        <td>
                          {item.manager_feedback_text || (item.isContentWork && item.remarks) ? (
                            <button
                              type="button"
                              onClick={() => setActiveManagerTextItem(item)}
                              style={{ 
                                background: 'none', 
                                border: 'none', 
                                padding: 0, 
                                textAlign: 'left', 
                                color: '#be123c', 
                                fontWeight: 700, 
                                fontSize: '12px', 
                                cursor: 'pointer',
                                textDecoration: 'underline',
                                display: 'inline-block'
                              }}
                            >
                              {truncateText(item.isContentWork ? item.remarks : item.manager_feedback_text, 25)}
                            </button>
                          ) : (
                            <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                              No manager comments.
                            </span>
                          )}
                        </td>

                        {/* Column 5: Client Corrections (Text) */}
                        <td>
                          {(!item.isContentWork && item.client_feedback_text) ? (
                            <button
                              type="button"
                              onClick={() => setActiveClientTextItem(item)}
                              style={{ 
                                background: 'none', 
                                border: 'none', 
                                padding: 0, 
                                textAlign: 'left', 
                                color: '#be123c', 
                                fontWeight: 700, 
                                fontSize: '12px', 
                                cursor: 'pointer',
                                textDecoration: 'underline',
                                display: 'inline-block'
                              }}
                            >
                              {truncateText(item.client_feedback_text, 25)}
                            </button>
                          ) : (
                            <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                              No client comments.
                            </span>
                          )}
                        </td>

                        {/* Column 7: Original Link */}
                        <td>
                          {prevLink ? (
                            <a 
                              href={ensureExternalLink(prevLink)} 
                              target="_blank" 
                              rel="noreferrer" 
                              style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: 'var(--primary)', fontWeight: 700, fontSize: '12px' }}
                            >
                              Open link <ExternalLink size={12} />
                            </a>
                          ) : (
                            <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                              No link
                            </span>
                          )}
                        </td>

                        {/* Column 6: Paste Link Input */}
                        <td>
                          <input
                            type="url"
                            placeholder={
                              item.status === 'submitted'
                                ? "Link submitted..."
                                : "Paste Google Drive / Work Link here..."
                            }
                            className="form-control"
                            value={item.status === 'submitted' ? (item.isContentWork ? item.work_link : item.google_drive_link) : (driveLinks[item.id] || '')}
                            onChange={(e) => handleLinkChange(item.id, e.target.value)}
                            disabled={item.status === 'submitted'}
                            style={{ fontSize: '12px', padding: '6px 10px', margin: 0, backgroundColor: item.status === 'submitted' ? 'var(--bg-light)' : '#fff' }}
                          />
                        </td>

                        {/* Column 7: Submit Rework */}
                        <td>
                          {item.status === 'submitted' ? (
                            <span className="badge" style={{ padding: '6px 10px', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', backgroundColor: 'rgba(249, 115, 22, 0.15)', color: '#f97316', border: 'none', display: 'inline-flex', width: '100%', justifyContent: 'center' }}>
                              Sent for Approval
                            </span>
                          ) : (
                            <button
                              onClick={() => handleSubmitRework(item)}
                              disabled={submittingId === item.id || !driveLinks[item.id]}
                              className="btn btn-warning btn-sm"
                              style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontWeight: 700, width: '100%', justifyContent: 'center' }}
                            >
                              <Send size={12} />
                              {submittingId === item.id ? 'Submitting...' : 'Submit Rework'}
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Bottom Pagination */}
            {filteredItems.length > 10 && (
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                paddingTop: '20px', 
                borderTop: '1px solid var(--border-color)',
                marginTop: '20px',
                flexWrap: 'wrap',
                gap: '12px'
              }}>
                <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                  Showing <strong>{((currentPage - 1) * itemsPerPage) + 1}</strong> to <strong>{Math.min(currentPage * itemsPerPage, filteredItems.length)}</strong> of <strong>{filteredItems.length}</strong> items
                </span>
                {renderPaginationControls()}
              </div>
            )}
          </>
        )}
      </div>

      {/* Pop-up Modal for Manager written Corrections Feedback */}
      {activeManagerTextItem && (
        <Modal
          isOpen={!!activeManagerTextItem}
          onClose={() => setActiveManagerTextItem(null)}
          title="Manager Correction Comments"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
              Client: <strong>{activeManagerTextItem.client_name || 'Event Day'}</strong> | Deliverable: <strong>{activeManagerTextItem.isContentWork ? activeManagerTextItem.title : activeManagerTextItem.activity_name || activeManagerTextItem.activity_type_code}</strong>
            </div>
            <div style={{ 
              padding: '16px', 
              backgroundColor: 'var(--bg-light)', 
              border: '1px solid var(--border-color)', 
              borderRadius: 'var(--radius-sm)', 
              fontSize: '14px', 
              lineHeight: 1.5,
              color: '#be123c',
              fontWeight: 600,
              whiteSpace: 'pre-wrap',
              maxHeight: '300px',
              overflowY: 'auto'
            }}>
              {activeManagerTextItem.isContentWork ? activeManagerTextItem.remarks : activeManagerTextItem.manager_feedback_text}
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '14px' }}>
              <button className="btn btn-secondary" onClick={() => setActiveManagerTextItem(null)} style={{ padding: '8px 20px', fontWeight: 700 }}>
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Pop-up Modal for Client written Corrections Feedback */}
      {activeClientTextItem && (
        <Modal
          isOpen={!!activeClientTextItem}
          onClose={() => setActiveClientTextItem(null)}
          title="Client Correction Comments"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
              Client: <strong>{activeClientTextItem.client_name}</strong> | Deliverable: <strong>{activeClientTextItem.activity_name || activeClientTextItem.activity_type_code}</strong>
            </div>
            <div style={{ 
              padding: '16px', 
              backgroundColor: 'var(--bg-light)', 
              border: '1px solid var(--border-color)', 
              borderRadius: 'var(--radius-sm)', 
              fontSize: '14px', 
              lineHeight: 1.5,
              color: '#be123c',
              fontWeight: 600,
              whiteSpace: 'pre-wrap',
              maxHeight: '300px',
              overflowY: 'auto'
            }}>
              {activeClientTextItem.client_feedback_text}
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '14px' }}>
              <button className="btn btn-secondary" onClick={() => setActiveClientTextItem(null)} style={{ padding: '8px 20px', fontWeight: 700 }}>
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Start Rework Task Confirmation Modal */}
      {confirmStartModal.isOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ backgroundColor: 'var(--card-bg, #ffffff)', border: '1px solid var(--border-color)', borderRadius: '16px', width: '90%', maxWidth: '440px', padding: '28px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', animation: 'fadeIn 0.2s ease-out' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: '#fff7ed', border: '1px solid #ffedd5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f97316' }}>
                <Clock size={22} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: 'var(--text-color)' }}>{confirmStartModal.title}</h3>
              </div>
            </div>
            <p style={{ margin: '0 0 24px 0', fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.5' }}>
              {confirmStartModal.message}
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setConfirmStartModal({ isOpen: false, title: '', message: '', onConfirm: () => {} })}
                style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-light, #f8fafc)', color: 'var(--text-color)', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const action = confirmStartModal.onConfirm;
                  setConfirmStartModal({ isOpen: false, title: '', message: '', onConfirm: () => {} });
                  if (action) action();
                }}
                style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', backgroundColor: 'var(--primary, #4f46e5)', color: '#ffffff', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}
              >
                Confirm Start
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeReassignedWork;
