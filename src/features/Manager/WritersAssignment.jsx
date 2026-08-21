import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, ChevronLeft, ChevronRight, User, Users, CheckCircle2, AlertTriangle, AlertCircle, RefreshCw, Layers } from 'lucide-react';
import api from '../../utils/api';
import Modal from '../../components/Modal';

const WritersAssignment = () => {
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
  });

  const [activeMainTab, setActiveMainTab] = useState('content'); // 'content' | 'event' | 'ledger'
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({ writers: [], contentCal: [], eventDays: [], counts: {} });
  
  // Modals & Form States
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [isSingleModalOpen, setIsSingleModalOpen] = useState(false);
  const [singleItem, setSingleItem] = useState(null);
  const [bulkInputs, setBulkInputs] = useState({});
  const [selectedWriterId, setSelectedWriterId] = useState('');
  const [formError, setFormError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  // Event Day Client Config Modal State
  const [isEventClientModalOpen, setIsEventClientModalOpen] = useState(false);
  const [selectedEventDay, setSelectedEventDay] = useState(null);
  const [allClients, setAllClients] = useState([]);
  const [eventClientConfig, setEventClientConfig] = useState({}); // clientId -> { selected: bool, activity_type_code: string }
  const [clientConfigLoading, setClientConfigLoading] = useState(false);

  const fetchClients = async () => {
    try {
      const res = await api.get('/clients?status=active');
      if (res.data.success && res.data.data) {
        const raw = res.data.data;
        const list = Array.isArray(raw) ? raw : (Array.isArray(raw?.clients) ? raw.clients : []);
        setAllClients(list);
      } else {
        setAllClients([]);
      }
    } catch (err) {
      console.error('Error fetching clients:', err.message);
      setAllClients([]);
    }
  };

  const handleOpenEventClientsModal = async (eventDay) => {
    setSelectedEventDay(eventDay);
    setIsEventClientModalOpen(true);
    setClientConfigLoading(true);
    fetchClients();

    try {
      const res = await api.get(`/event-days/${eventDay.id}/clients`);
      const existing = res.data.success ? res.data.data : [];
      const configMap = {};
      existing.forEach(item => {
        configMap[item.client_id] = { selected: true, activity_type_code: item.activity_type_code };
      });
      setEventClientConfig(configMap);
    } catch (err) {
      console.error('Error fetching event client deliverables:', err.message);
    } finally {
      setClientConfigLoading(false);
    }
  };

  const handleSaveEventClients = async (e) => {
    e.preventDefault();
    if (!selectedEventDay) return;
    setActionLoading(true);

    const deliverables = [];
    Object.entries(eventClientConfig).forEach(([clientId, cfg]) => {
      if (cfg.selected && cfg.activity_type_code) {
        deliverables.push({
          client_id: Number(clientId),
          activity_type_code: cfg.activity_type_code
        });
      }
    });

    try {
      const res = await api.post(`/event-days/${selectedEventDay.id}/clients`, { deliverables });
      if (res.data.success) {
        alert('Event Day client deliverables configured successfully.');
        setIsEventClientModalOpen(false);
        fetchAssignmentData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save event deliverables.');
    } finally {
      setActionLoading(false);
    }
  };

  // Pagination
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  const fetchAssignmentData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get(`/content-work/unassigned-calendar?month=${selectedMonth}`);
      if (res.data.success && res.data.data) {
        const raw = res.data.data;
        setData({
          writers: Array.isArray(raw.writers) ? raw.writers : [],
          contentCal: Array.isArray(raw.contentCal) ? raw.contentCal : [],
          eventDays: Array.isArray(raw.eventDays) ? raw.eventDays : [],
          counts: raw.counts || {}
        });
      }
    } catch (err) {
      console.error('Error fetching unassigned items:', err.message);
    } finally {
      setLoading(false);
    }
  }, [selectedMonth]);

  useEffect(() => {
    fetchAssignmentData();
  }, [fetchAssignmentData]);

  useEffect(() => {
    setPage(1);
  }, [activeMainTab, selectedMonth]);

  // Month navigation
  const handlePrevMonth = () => {
    const [year, month] = selectedMonth.split('-').map(Number);
    const prevDate = new Date(year, month - 2, 1);
    setSelectedMonth(`${prevDate.getFullYear()}-${String(prevDate.getMonth() + 1).padStart(2, '0')}`);
  };

  const handleNextMonth = () => {
    const [year, month] = selectedMonth.split('-').map(Number);
    const nextDate = new Date(year, month, 1);
    setSelectedMonth(`${nextDate.getFullYear()}-${String(nextDate.getMonth() + 1).padStart(2, '0')}`);
  };

  // Open Bulk Modal
  const openBulkModal = () => {
    const initialInputs = {};
    (data.writers || []).forEach(w => {
      initialInputs[w.id] = '';
    });
    setBulkInputs(initialInputs);
    setFormError('');
    setIsBulkModalOpen(true);
  };

  // Submit Bulk Assignment
  const handleBulkSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    
    const unassignedCount = activeMainTab === 'content' 
      ? (data?.counts?.contentUnassigned || 0) 
      : (data?.counts?.eventUnassigned || 0);

    let totalRequested = 0;
    const assignmentsMap = {};
    
    Object.entries(bulkInputs).forEach(([wId, val]) => {
      const parsed = parseInt(val, 10);
      if (!isNaN(parsed) && parsed > 0) {
        totalRequested += parsed;
        assignmentsMap[wId] = parsed;
      }
    });

    if (totalRequested === 0) {
      setFormError('Please enter a valid count of works for at least one writer.');
      return;
    }

    if (totalRequested > unassignedCount) {
      setFormError(`You cannot assign ${totalRequested} works when only ${unassignedCount} are unassigned.`);
      return;
    }

    setActionLoading(true);
    try {
      const res = await api.post('/content-work/assign-writers', {
        month: selectedMonth,
        assignments: assignmentsMap,
        isEventDay: activeMainTab === 'event'
      });
      if (res.data.success) {
        setIsBulkModalOpen(false);
        fetchAssignmentData();
      }
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to assign writers.');
    } finally {
      setActionLoading(false);
    }
  };

  // Click on Designer / Writer Cell
  const handleWriterCellClick = (item) => {
    setSingleItem(item);
    setSelectedWriterId(item.assigned_employee_id || '');
    setFormError('');
    setIsSingleModalOpen(true);
  };

  // Submit Single Assignment
  const handleSingleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedWriterId) {
      setFormError('Please select a content writer.');
      return;
    }
    
    setActionLoading(true);
    try {
      const res = await api.post('/content-work/assign-writers', {
        month: selectedMonth,
        deliverableId: singleItem.id,
        writerId: Number(selectedWriterId),
        isEventDay: activeMainTab === 'event'
      });
      if (res.data.success) {
        setIsSingleModalOpen(false);
        setSingleItem(null);
        fetchAssignmentData();
      }
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to assign content writer.');
    } finally {
      setActionLoading(false);
    }
  };

  const getActiveTabUnassignedCount = () => {
    return activeMainTab === 'content' 
      ? (data?.counts?.contentUnassigned || 0) 
      : (data?.counts?.eventUnassigned || 0);
  };

  const getFilteredList = () => {
    const contentCal = Array.isArray(data?.contentCal) ? data.contentCal : [];
    const eventDays = Array.isArray(data?.eventDays) ? data.eventDays : [];
    if (activeMainTab === 'content') return contentCal;
    if (activeMainTab === 'event') return eventDays;
    return [...contentCal, ...eventDays].filter(item => item && item.assigned_employee_id);
  };

  const filteredList = getFilteredList();
  const totalPages = Math.ceil(filteredList.length / itemsPerPage);
  const paginatedList = filteredList.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const renderPaginationControls = () => {
    if (totalPages <= 1) return null;
    return (
      <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
        <button
          className="btn btn-secondary btn-sm"
          disabled={page === 1}
          onClick={() => setPage(prev => Math.max(prev - 1, 1))}
          style={{ minWidth: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <ChevronLeft size={16} />
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
          <button
            key={p}
            onClick={() => setPage(p)}
            className={`btn btn-sm ${page === p ? 'btn-primary' : 'btn-secondary'}`}
            style={{
              minWidth: '32px',
              height: '32px',
              fontWeight: 700,
              backgroundColor: page === p ? 'var(--primary)' : '#fff',
              color: page === p ? '#fff' : 'var(--text-main)',
              border: '1px solid var(--border-color)',
              cursor: 'pointer'
            }}
          >
            {p}
          </button>
        ))}
        <button
          className="btn btn-secondary btn-sm"
          disabled={page === totalPages || totalPages === 0}
          onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
          style={{ minWidth: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <ChevronRight size={16} />
        </button>
      </div>
    );
  };

  return (
    <div style={{ padding: '30px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Page Title & Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-color)', display: 'flex', alignItems: 'center', gap: '10px', margin: 0 }}>
            <Users size={26} style={{ color: 'var(--primary)' }} />
            Content Writers Work Assignment
          </h1>
          <p style={{ margin: '6px 0 0 0', color: 'var(--text-muted)', fontSize: '13px' }}>
            Manually allocate calendar deliverables and confirmed event day briefs to content writers by count or individual assignment.
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button className="btn btn-secondary" onClick={fetchAssignmentData} disabled={loading} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <RefreshCw size={14} /> Refresh
          </button>
        </div>
      </div>

      {/* Main Tabs Layout */}
      <div style={{ 
        display: 'flex', 
        gap: '4px', 
        marginBottom: '24px', 
        borderBottom: '1px solid var(--border-color)', 
        paddingBottom: '0' 
      }}>
        {[
          { id: 'content', label: 'Content Calendar (Normal)' },
          { id: 'event', label: 'Event Calendar (Normal)' },
          { id: 'ledger', label: 'Assigned Works Ledger' }
        ].map(t => (
          <button 
            key={t.id}
            onClick={() => setActiveMainTab(t.id)}
            style={{
              padding: '10px 20px',
              fontWeight: 700,
              fontSize: '14px',
              border: 'none',
              background: 'none',
              color: activeMainTab === t.id ? 'var(--primary)' : 'var(--text-muted)',
              borderBottom: activeMainTab === t.id ? '2px solid var(--primary)' : 'none',
              cursor: 'pointer',
              transition: 'all 0.2s',
              outline: 'none'
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Month Toolbar */}
      <div className="table-toolbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', backgroundColor: '#fff', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md) var(--radius-md) 0 0', borderBottom: 'none', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div className="pagination-controls" style={{ margin: 0 }}>
            <button className="btn btn-secondary btn-sm" onClick={handlePrevMonth}>
              <ChevronLeft size={16} />
            </button>
            <span style={{ fontWeight: 700, fontSize: '16px', color: 'var(--text-main)', minWidth: '130px', textAlign: 'center', display: 'inline-block' }}>
              {(() => {
                const parts = selectedMonth.split('-');
                const d = new Date(parts[0], parts[1] - 1, 1);
                return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
              })()}
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

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {totalPages > 1 && renderPaginationControls()}
          {activeMainTab !== 'ledger' && (
            <button 
              className="btn btn-primary"
              onClick={openBulkModal}
              disabled={getActiveTabUnassignedCount() === 0}
              style={{ fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '8px' }}
            >
              <Layers size={16} />
              Bulk Assign Writers
            </button>
          )}
        </div>
      </div>

      {/* Summary Banner Stats */}
      {activeMainTab !== 'ledger' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', padding: '16px 20px', backgroundColor: 'var(--bg-light)', borderLeft: '1px solid var(--border-color)', borderRight: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
            <Calendar size={24} style={{ color: 'var(--primary)' }} />
            <div>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>TOTAL DELIVERABLES</span>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>
                {activeMainTab === 'content' ? (data?.counts?.contentTotal || 0) : (data?.counts?.eventTotal || 0)}
              </h3>
            </div>
          </div>
          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
            <AlertTriangle size={24} style={{ color: '#da851b' }} />
            <div>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>UNASSIGNED WORKS</span>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>
                {activeMainTab === 'content' ? (data?.counts?.contentUnassigned || 0) : (data?.counts?.eventUnassigned || 0)}
              </h3>
            </div>
          </div>
          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
            <CheckCircle2 size={24} style={{ color: '#15803d' }} />
            <div>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>ASSIGNED WORKS</span>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>
                {activeMainTab === 'content' 
                  ? ((data?.counts?.contentTotal || 0) - (data?.counts?.contentUnassigned || 0))
                  : ((data?.counts?.eventTotal || 0) - (data?.counts?.eventUnassigned || 0))}
              </h3>
            </div>
          </div>
        </div>
      )}

      {/* Main Grid Lists */}
      <div className="card" style={{ padding: 0, borderRadius: totalPages > 1 ? '0' : '0 0 var(--radius-md) var(--radius-md)', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '80px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <div className="spinner" style={{ margin: '0 auto 12px auto' }}></div>
            <span>Loading updates...</span>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="tracker-enterprise-table" style={{ width: '100%' }}>
              <thead>
                <tr>
                  <th style={{ padding: '14px 18px', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase' }}>Client</th>
                  <th style={{ padding: '14px 18px', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase' }}>Deliverable / Activity</th>
                  <th style={{ padding: '14px 18px', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase' }}>Code</th>
                  <th style={{ padding: '14px 18px', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', width: '130px' }}>Due Date</th>
                  <th style={{ padding: '14px 18px', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', width: '180px' }}>Content Writer</th>
                </tr>
              </thead>
              <tbody>
                {(() => {
                  if (paginatedList.length === 0) {
                    return (
                      <tr>
                        <td colSpan={5} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '14px', fontWeight: 600 }}>
                          No deliverables found for this month view.
                        </td>
                      </tr>
                    );
                  }

                  return paginatedList.map(item => {
                    const isAssigned = !!item.assigned_employee_id;
                    const displayClient = item.client_name || 'Event Calendar Day';
                    const displayCode = item.activity_code || `EVT-${item.id}`;
                    const displayTitle = item.activity_name || item.title || 'Event Day Day';

                    return (
                      <tr key={`${item.month}_${item.id}_${item.activity_code}`} className="tracker-row-interactive" style={{ borderBottom: '1px solid var(--border-color)' }}>
                        <td style={{ padding: '14px 18px', fontWeight: 700 }}>{displayClient}</td>
                        <td style={{ padding: '14px 18px', fontWeight: 600 }}>
                          {displayTitle}
                          {(item.is_event_day === 1 || activeMainTab === 'event') && (
                            <span style={{ backgroundColor: '#e0e7ff', color: '#4338ca', fontSize: '10px', fontWeight: 800, padding: '2px 8px', borderRadius: '99px', marginLeft: '8px', textTransform: 'uppercase' }}>
                              EVENT DAY
                            </span>
                          )}
                        </td>
                        <td style={{ padding: '14px 18px', fontFamily: 'monospace', fontWeight: 700 }}>{displayCode}</td>
                        <td style={{ padding: '14px 18px' }}>
                          {item.date ? new Date(item.date).toLocaleDateString('en-US', { timeZone: 'UTC', day: 'numeric', month: 'short', year: 'numeric' }) : (item.due_date ? new Date(item.due_date).toLocaleDateString('en-US', { timeZone: 'UTC', day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A')}
                        </td>
                        <td style={{ padding: '14px 18px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <button
                            onClick={() => handleWriterCellClick(item)}
                            style={{
                              padding: '5px 12px',
                              borderRadius: '99px',
                              fontSize: '12px',
                              fontWeight: 700,
                              cursor: 'pointer',
                              border: isAssigned ? '1px solid #c2e7cc' : '1px solid #da851b',
                              backgroundColor: isAssigned ? '#eefdf2' : '#fffbeb',
                              color: isAssigned ? '#15803d' : '#da851b',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              outline: 'none'
                            }}
                          >
                            <User size={12} />
                            {isAssigned ? item.content_writer_name : 'Unassigned'}
                          </button>

                        </td>
                      </tr>
                    );
                  });
                })()}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          padding: '20px', 
          backgroundColor: '#fff', 
          border: '1px solid var(--border-color)', 
          borderTop: 'none', 
          borderRadius: '0 0 var(--radius-md) var(--radius-md)',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 600 }}>
            Showing <strong>{((page - 1) * itemsPerPage) + 1}</strong> to <strong>{Math.min(page * itemsPerPage, filteredList.length)}</strong> of <strong>{filteredList.length}</strong> items
          </span>
          {renderPaginationControls()}
        </div>
      )}

      {/* 1. Bulk Assignment Modal */}
      {isBulkModalOpen && (
        <Modal
          isOpen={isBulkModalOpen}
          onClose={() => setIsBulkModalOpen(false)}
          title={`Bulk Assign ${activeMainTab === 'content' ? 'Normal Deliverables' : 'Event Calendar Days'}`}
        >
          <form onSubmit={handleBulkSubmit} style={{ padding: '20px' }}>
            <p style={{ margin: '0 0 16px 0', fontSize: '13px', color: 'var(--text-muted)' }}>
              Enter the count of unassigned deliverables to assign to each content writer. 
              <br />
              <strong style={{ color: 'var(--primary)' }}>
                Total Unassigned: {getActiveTabUnassignedCount()}
              </strong>
            </p>

            {formError && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 12px', backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: 'var(--danger)', borderRadius: '4px', marginBottom: '16px', fontSize: '13px' }}>
                <AlertCircle size={16} />
                <span>{formError}</span>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxHeight: '300px', overflowY: 'auto', paddingRight: '4px' }}>
              {(data.writers || []).map(w => (
                <div key={w.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
                  <span style={{ fontWeight: 700, fontSize: '14px' }}>{w.full_name}</span>
                  <input
                    type="number"
                    min="0"
                    placeholder="Count"
                    className="form-control"
                    value={bulkInputs[w.id] || ''}
                    onChange={(e) => setBulkInputs(prev => ({ ...prev, [w.id]: e.target.value }))}
                    style={{ width: '100px', textAlign: 'center' }}
                  />
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setIsBulkModalOpen(false)} disabled={actionLoading}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" style={{ fontWeight: 700 }} disabled={actionLoading}>
                {actionLoading ? 'Assigning...' : 'Assign & Send'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* 2. Single Assignment Modal */}
      {isSingleModalOpen && (
        <Modal
          isOpen={isSingleModalOpen}
          onClose={() => setIsSingleModalOpen(false)}
          title="Assign Content Writer"
        >
          <form onSubmit={handleSingleSubmit} style={{ padding: '20px' }}>
            <p style={{ margin: '0 0 16px 0', fontSize: '13px', color: 'var(--text-muted)' }}>
              Assign a writer for: <strong>{singleItem?.activity_name || singleItem?.title}</strong>
            </p>

            {formError && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 12px', backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: 'var(--danger)', borderRadius: '4px', marginBottom: '16px', fontSize: '13px' }}>
                <AlertCircle size={16} />
                <span>{formError}</span>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label className="form-label" style={{ fontWeight: 700 }}>Select Content Writer</label>
              <select
                className="form-control"
                value={selectedWriterId}
                onChange={(e) => setSelectedWriterId(e.target.value)}
                required
              >
                <option value="">-- Choose Writer --</option>
                {(data.writers || []).map(w => (
                  <option key={w.id} value={w.id}>{w.full_name}</option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setIsSingleModalOpen(false)} disabled={actionLoading}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" style={{ fontWeight: 700 }} disabled={actionLoading}>
                {actionLoading ? 'Assigning...' : 'Confirm Assignment'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default WritersAssignment;
