import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Plus, Edit2, Trash2, Send, Clock, CheckCircle2, MessageSquare, AlertCircle, RefreshCw, Users, Layers } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import Modal from '../../components/Modal';

// Helper: Parse YYYY-MM-DD local date
const parseLocalDate = (dateStr) => {
  if (!dateStr) return null;
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    const [y, m, d] = parts.map(Number);
    return new Date(y, m - 1, d);
  }
  return null;
};

// Helper: Format date object as YYYY-MM-DD
const getLocalDateString = (dateVal) => {
  if (!dateVal) return '';
  const dateObj = new Date(dateVal);
  if (isNaN(dateObj.getTime())) return '';
  const yyyy = dateObj.getFullYear();
  const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
  const dd = String(dateObj.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

const EVENT_TYPES = {
  event_day: { label: 'Event Day', color: '#1d4ed8', bg: '#eff6ff', border: '#bfdbfe' },
  national_day: { label: 'National Day', color: '#15803d', bg: '#f0fdf4', border: '#bbf7d0' },
  international_day: { label: 'International Day', color: '#0891b2', bg: '#ecfeff', border: '#a5f3fc' },
  celebrity_birthday: { label: 'Celebrity Birthday', color: '#7e22ce', bg: '#faf5ff', border: '#e9d5ff' },
  festival_state: { label: 'Festival (State Level)', color: '#b45309', bg: '#fffbeb', border: '#fde68a' },
  festival_national: { label: 'Festival (National Level)', color: '#be123c', bg: '#fff1f2', border: '#fecdd3' }
};

const EmployeeEventCalendar = () => {
  const { user } = useAuth();
  const isManager = user?.role === 'manager';
  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin';
  const isContentWriter = user?.employeeProfile?.sub_department_id === 3 || user?.sub_department_id === 3;
  

  // Guard states
  const [isLocked, setIsLocked] = useState(false);
  const [lockReason, setLockReason] = useState(''); // 'submitted' | 'approved'
  const [creatorName, setCreatorName] = useState('');
  const [alreadyApprovedModalOpen, setAlreadyApprovedModalOpen] = useState(false);
  const [approveConfirmationModalOpen, setApproveConfirmationModalOpen] = useState(false);
  const [approvingLoading, setApprovingLoading] = useState(false);

  // Manager Bulk Assignment
  const [writers, setWriters] = useState([]);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [bulkInputs, setBulkInputs] = useState({});
  const [bulkError, setBulkError] = useState('');
  const [bulkLoading, setBulkLoading] = useState(false);

  const [selectedMonth, setSelectedMonth] = useState(() => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
  });

  const [events, setEvents] = useState([]);
  const hasApprovedEvents = Array.isArray(events) && events.some(e => e.status === 'sent_to_employee');
  const canModify = (isManager || isContentWriter || isAdmin) && !isLocked && !(isManager && hasApprovedEvents);
  const [loading, setLoading] = useState(false);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('add'); // 'add' or 'edit'
  const [selectedEvent, setSelectedEvent] = useState(null);
  
  // Form fields
  const [formData, setFormData] = useState({
    date: '',
    title: '',
    description: '',
    event_type: 'event_day'
  });

  const displayEvents = events;
  const [formError, setFormError] = useState('');

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get(`/event-days?month=${selectedMonth}`);
      if (res.data.success) {
        const list = res.data.data || [];
        setEvents(list);
        
        const hasSubmitted = list.length > 0 && list.some(e => e.status === 'sent_to_manager');
        const hasApproved = list.length > 0 && list.some(e => e.status === 'sent_to_employee');
        
        if (hasApproved) {
          setIsLocked(true);
          setLockReason('approved');
        } else if (hasSubmitted && isContentWriter) {
          setIsLocked(true);
          setLockReason('submitted');
        } else {
          setIsLocked(false);
          setLockReason('');
        }
      }
    } catch (err) {
      console.error('Error fetching event days:', err.message);
    } finally {
      setLoading(false);
    }
  }, [selectedMonth, isContentWriter]);

  useEffect(() => {
    fetchEvents();
    // Auto-poll every 5 seconds so Creative Manager approvals appear automatically and immediately
    const intervalId = setInterval(() => {
      fetchEvents();
    }, 5000);
    return () => clearInterval(intervalId);
  }, [fetchEvents]);

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

  // Open Add Modal
  const handleOpenAdd = (dateStr = '') => {
    if (hasApprovedEvents && !isAdmin) {
      setAlreadyApprovedModalOpen(true);
      return;
    }
    setModalType('add');
    setFormData({
      date: dateStr || `${selectedMonth}-01`,
      title: '',
      description: '',
      event_type: 'event_day'
    });
    setFormError('');
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (event, e) => {
    if (e) e.stopPropagation();
    if ((hasApprovedEvents || event.status === 'sent_to_employee') && !isAdmin) {
      setAlreadyApprovedModalOpen(true);
      return;
    }
    setModalType('edit');
    setSelectedEvent(event);
    setFormData({
      date: getLocalDateString(event.date),
      title: event.title,
      description: event.description || '',
      event_type: event.event_type || 'event_day'
    });
    setFormError('');
    setIsModalOpen(true);
  };

  // Delete Event
  const handleDeleteEvent = async (id) => {
    if (!(await window.confirm('Are you sure you want to delete this event day?'))) return;
    try {
      let res;
      try {
        res = await api.post(`/event-days/${id}/delete`);
      } catch (_) {
        res = await api.delete(`/event-days/${id}`);
      }
      if (res.data.success) {
        fetchEvents();
      }
    } catch (err) {
      console.error('Error deleting event day:', err.message);
      alert(err.response?.data?.message || 'Failed to delete event day.');
    }
  };

  // Create / Update Event
  const handleSaveEvent = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.title.trim()) {
      setFormError('Event Title is required.');
      return;
    }
    if (!formData.date) {
      setFormError('Date is required.');
      return;
    }

    try {
      if (modalType === 'add') {
        const payload = {
          month: selectedMonth,
          date: formData.date,
          title: formData.title,
          description: formData.description,
          event_type: formData.event_type
        };
        const res = await api.post('/event-days', payload);
        if (res.data.success) {
          setIsModalOpen(false);
          fetchEvents();
        }
      } else {
        const payload = {
          date: formData.date,
          title: formData.title,
          description: formData.description,
          event_type: formData.event_type
        };
        let res;
        try {
          res = await api.post(`/event-days/${selectedEvent.id}/update`, payload);
        } catch (_) {
          res = await api.put(`/event-days/${selectedEvent.id}`, payload);
        }
        if (res.data.success) {
          setIsModalOpen(false);
          fetchEvents();
        }
      }
    } catch (err) {
      console.error('Error saving event day:', err.message);
      setFormError(err.response?.data?.message || 'Failed to save event day.');
    }
  };

  // Send to Manager
  const handleSendToManager = async () => {
    if (!Array.isArray(events) || events.length === 0) {
      alert('There are no event days to send.');
      return;
    }
    if (!(await window.confirm('Are you sure you want to submit this monthly event calendar to the manager?'))) return;
    try {
      const res = await api.post('/event-days/send-to-manager', { month: selectedMonth });
      if (res.data.success) {
        alert('Event calendar successfully submitted to the manager!');
        fetchEvents();
      }
    } catch (err) {
      console.error('Error sending event calendar:', err.message);
      alert(err.response?.data?.message || 'Failed to submit event calendar.');
    }
  };

  // Send to Content Writer (Manager only) - Opens Confirmation Modal
  const handleSendToEmployee = async () => {
    if (hasApprovedEvents) {
      setAlreadyApprovedModalOpen(true);
      return;
    }
    if (!Array.isArray(events) || events.length === 0) {
      alert('There are no event days to confirm.');
      return;
    }
    setApproveConfirmationModalOpen(true);
  };

  const confirmApproveAndFinalize = async () => {
    setApprovingLoading(true);
    try {
      const res = await api.post('/event-days/send-to-employee', { month: selectedMonth });
      if (res.data.success) {
        setApproveConfirmationModalOpen(false);
        alert('Event calendar successfully approved and finalized!');
        fetchEvents();
      }
    } catch (err) {
      console.error('Error approving event calendar:', err.message);
      alert(err.response?.data?.message || 'Failed to approve event calendar.');
    } finally {
      setApprovingLoading(false);
    }
  };

  const fetchWriters = useCallback(async () => {
    if (!isManager) return;
    try {
      const res = await api.get(`/content-work/unassigned-calendar?month=${selectedMonth}`);
      if (res.data.success) {
        setWriters(res.data.data.writers || []);
      }
    } catch (err) {
      console.error('Error fetching writers:', err.message);
    }
  }, [isManager, selectedMonth]);

  useEffect(() => {
    fetchWriters();
  }, [fetchWriters]);

  const handleOpenBulkAssign = () => {
    const initialInputs = {};
    writers.forEach(w => {
      initialInputs[w.id] = '';
    });
    setBulkInputs(initialInputs);
    setBulkError('');
    setIsBulkModalOpen(true);
  };

  const handleBulkAssignSubmit = async (e) => {
    e.preventDefault();
    setBulkError('');
    
    // Count unassigned event days
    const unassignedCount = events.filter(ev => ev.status === 'sent_to_employee' && !ev.assigned_employee_id).length;

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
      setBulkError('Please enter a valid count of works for at least one writer.');
      return;
    }

    if (totalRequested > unassignedCount) {
      setBulkError(`You cannot assign ${totalRequested} works when only ${unassignedCount} are unassigned.`);
      return;
    }

    setBulkLoading(true);
    try {
      const res = await api.post('/content-work/assign-writers', {
        month: selectedMonth,
        assignments: assignmentsMap,
        isEventDay: true
      });
      if (res.data.success) {
        setIsBulkModalOpen(false);
        fetchEvents();
        fetchWriters();
        alert('Event days successfully assigned to writers.');
      }
    } catch (err) {
      setBulkError(err.response?.data?.message || 'Failed to assign writers.');
    } finally {
      setBulkLoading(false);
    }
  };

  // Render Calendar Days
  const renderCalendarDays = () => {
    const [year, month] = selectedMonth.split('-').map(Number);
    const firstDayIndex = new Date(year, month - 1, 1).getDay(); // 0 = Sun, 1 = Mon ...
    const totalDays = new Date(year, month, 0).getDate();
    const prevMonthDays = new Date(year, month - 1, 0).getDate();

    const dayCells = [];

    // Empty spaces for previous month days
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      dayCells.push(
        <div key={`prev-${i}`} className="calendar-day-cell empty-day" style={{ opacity: 0.35, backgroundColor: 'var(--bg-light)' }}>
          <span className="day-number">{prevMonthDays - i}</span>
        </div>
      );
    }

    // Days of current month
    for (let day = 1; day <= totalDays; day++) {
      const dayDateStr = `${selectedMonth}-${String(day).padStart(2, '0')}`;
      const dayEvents = Array.isArray(displayEvents) ? displayEvents.filter(e => getLocalDateString(e.date) === dayDateStr) : [];

      dayCells.push(
        <div 
          key={`day-${day}`} 
          className="calendar-day-cell" 
          onClick={() => canModify && handleOpenAdd(dayDateStr)}
          style={{ cursor: canModify ? 'pointer' : 'default', minHeight: '110px', transition: 'background-color 0.2s' }}
        >
          <div className="day-cell-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span className="day-number" style={{ fontWeight: 700 }}>{day}</span>
            {canModify && (
              <span className="add-hover-btn" style={{ opacity: 0, transition: 'opacity 0.2s', color: 'var(--primary)' }}>
                <Plus size={14} />
              </span>
            )}
          </div>
          
          <div className="day-cell-content">
            {dayEvents.map(evt => {
              const typeInfo = EVENT_TYPES[evt.event_type] || EVENT_TYPES.event_day;
              const isDraft = evt.status !== 'sent_to_manager';
              return (
                <div 
                  key={evt.id}
                  onClick={(e) => handleOpenEdit(evt, e)}
                  className="calendar-event-item"
                  style={{
                    backgroundColor: typeInfo.bg,
                    border: `1px ${isDraft ? 'dashed' : 'solid'} ${typeInfo.color}`,
                    color: typeInfo.color
                  }}
                  title={`[${typeInfo.label}] ${evt.title}${evt.description ? ': ' + evt.description : ''} (${isDraft ? 'Draft' : 'Submitted'})`}
                >
                  <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', flex: 1 }}>
                    {evt.title}
                  </span>
                  
                  {/* Inline actions shown on hover */}
                  {canModify && (
                    <span className="event-actions-inline">
                      <Edit2 
                        size={10} 
                        style={{ opacity: 0.8, cursor: 'pointer' }} 
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          handleOpenEdit(evt, e); 
                        }} 
                      />
                      <Trash2 
                        size={10} 
                        style={{ opacity: 0.8, cursor: 'pointer' }} 
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          handleDeleteEvent(evt.id, e); 
                        }} 
                      />
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    return dayCells;
  };

  if (!isManager && !isContentWriter && !isAdmin) {
    return (
      <div className="page-container">
        <div className="card" style={{ padding: '40px', textAlign: 'center', maxWidth: '600px', margin: '40px auto' }}>
          <h3>Access Denied</h3>
          <p className="text-muted">The Event Day Calendar is only accessible to Content Writers and Managers.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '30px', maxWidth: '1400px', margin: '0 auto' }}>
      
      {/* Local Styles for Event Calendar */}
      <style>{`
        .calendar-grid-wrapper {
          background-color: var(--border-color);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          overflow-x: auto;
        }
        .calendar-day-cell {
          background-color: var(--bg-card);
          padding: 12px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          position: relative;
          transition: background-color 0.2s;
        }
        .calendar-day-cell:hover {
          background-color: #f8fafc;
        }
        .calendar-day-cell:hover .add-hover-btn {
          opacity: 1 !important;
        }
        .day-cell-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .day-number {
          font-weight: 700;
          font-size: 14px;
          color: var(--text-main);
        }
        .day-cell-content {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .event-actions-inline {
          display: flex;
          align-items: center;
          gap: 6px;
          opacity: 0;
          transition: opacity 0.2s;
          pointer-events: auto;
        }
        .calendar-event-item:hover .event-actions-inline {
          opacity: 1;
        }
        .calendar-event-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 4px 6px;
          border-radius: 4px;
          font-size: 11px;
          font-weight: 700;
          cursor: pointer;
          gap: 4px;
          transition: transform 0.1s, box-shadow 0.1s;
        }
        .calendar-event-item:hover {
          transform: translateY(-1px);
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }
      `}</style>
      
      {/* Lock Banner Alert */}
      {isLocked && (
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '12px', 
          padding: '16px 20px', 
          backgroundColor: lockReason === 'approved' ? '#e0e7ff' : '#fffbeb', 
          border: '1px solid', 
          borderColor: lockReason === 'approved' ? '#c7d2fe' : '#fef3c7', 
          borderRadius: '8px', 
          color: lockReason === 'approved' ? '#3730a3' : '#b45309', 
          marginBottom: '24px' 
        }}>
          <AlertCircle size={24} />
          <div>
            <h4 style={{ margin: 0, fontWeight: 800, fontSize: '15px' }}>
              {lockReason === 'approved' ? 'Event Calendar Approved & Finalized' : 'Event Calendar Submitted for Review'}
            </h4>
            <p style={{ margin: '2px 0 0 0', fontSize: '13px' }}>
              {lockReason === 'approved' 
                ? 'This Event Day Calendar has been approved and finalized. It cannot be edited by anyone.'
                : 'This Event Day Calendar has been submitted to the Creative Manager for review and cannot be modified until reviewed.'}
            </p>
          </div>
        </div>
      )}

      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 800, color: 'var(--text-color)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Calendar size={26} style={{ color: 'var(--primary)' }} />
            Event Day Calendar
          </h1>
          <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: 'var(--text-muted)' }}>
            {isManager 
              ? 'View and manage event days submitted by the content writing team.' 
              : 'Add, update, and submit monthly event days and public holidays to the manager.'}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          {/* Add Event (Admin/SuperAdmin) */}
          {isAdmin && (
            <button 
              className="btn btn-primary" 
              onClick={() => handleOpenAdd()}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontWeight: 700 }}
            >
              <Plus size={16} /> Add Event
            </button>
          )}

           {/* Send to Manager (Content Writer only) */}
          {isContentWriter && !isLocked && Array.isArray(events) && events.some(e => e.status === 'draft') && (
            <button 
              className="btn btn-success" 
              onClick={handleSendToManager}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontWeight: 700 }}
            >
              <Send size={16} /> Send to Manager
            </button>
          )}

          {/* Confirm Calendar (Manager only) */}
          {isManager && Array.isArray(events) && events.length > 0 && !hasApprovedEvents && (
            <button 
              className="btn btn-success" 
              onClick={handleSendToEmployee}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontWeight: 700 }}
            >
              <CheckCircle2 size={16} /> Confirm Calendar
            </button>
          )}
          
          <button className="btn btn-secondary" onClick={fetchEvents} disabled={loading} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <RefreshCw size={14} /> Refresh
          </button>
        </div>
      </div>

      {/* Toolbar / Month Selection */}
      <div className="table-toolbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', backgroundColor: '#fff', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md) var(--radius-md) 0 0', borderBottom: 'none', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div className="pagination-controls" style={{ margin: 0 }}>
            <button className="btn btn-secondary btn-sm" onClick={handlePrevMonth}>
              <ChevronLeft size={16} />
            </button>
            <span style={{ fontWeight: 700, fontSize: '16px', color: 'var(--text-main)', minWidth: '130px', textAlign: 'center', display: 'inline-block' }}>
              {(() => {
                const date = parseLocalDate(selectedMonth + '-01');
                return date ? date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : '';
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

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {isManager && events.length > 0 && (
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 14px', borderRadius: '99px', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', color: '#15803d', fontWeight: 700, fontSize: '13px' }}>
              <span>Created by:</span>
              <strong>{events.find(e => e.creator_name)?.creator_name || 'Content Writer'}</strong>
            </div>
          )}

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: '99px', backgroundColor: 'var(--primary-light)', border: '1px solid var(--primary)', color: 'var(--primary)', fontWeight: 700, fontSize: '13px' }}>
            <span>Total Events:</span>
            <strong style={{ fontSize: '15px' }}>{Array.isArray(displayEvents) ? displayEvents.length : 0}</strong>
          </div>

          {isManager && events.length > 0 && events.some(e => e.status === 'sent_to_employee') && (
            <button 
              className="btn btn-primary"
              onClick={handleOpenBulkAssign}
              style={{ fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '8px' }}
            >
              <Users size={16} />
              Assign Writers
            </button>
          )}
        </div>
      </div>

      {/* Event Type Legend Row */}
      <div style={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: '16px', 
        padding: '12px 20px', 
        backgroundColor: '#fff', 
        border: '1px solid var(--border-color)', 
        borderTop: 'none', 
        borderBottom: 'none',
        fontSize: '12px',
        fontWeight: 700
      }}>
        <span style={{ color: 'var(--text-muted)' }}>Legend:</span>
        {Object.entries(EVENT_TYPES).map(([key, info]) => (
          <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ 
              display: 'inline-block', 
              width: '12px', 
              height: '12px', 
              borderRadius: '3px', 
              backgroundColor: info.bg, 
              border: `1px solid ${info.color}` 
            }}></span>
            <span style={{ color: info.color }}>{info.label}</span>
          </div>
        ))}
      </div>

      {/* Main Calendar View Container */}
      <div className="card" style={{ padding: '0px', borderRadius: '0 0 var(--radius-md) var(--radius-md)', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '100px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <div className="spinner" style={{ margin: '0 auto 12px auto' }}></div>
            <span>Loading event days calendar...</span>
          </div>
        ) : (
          <div className="calendar-grid-wrapper">
            {/* Week Headers */}
            <div className="calendar-grid-header" style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', textAlign: 'center', borderBottom: '2px solid var(--border-color)', backgroundColor: 'var(--bg-light)', fontWeight: 800, fontSize: '12px', textTransform: 'uppercase', color: 'var(--text-muted)', minWidth: '850px' }}>
              <div style={{ padding: '12px' }}>Sun</div>
              <div style={{ padding: '12px' }}>Mon</div>
              <div style={{ padding: '12px' }}>Tue</div>
              <div style={{ padding: '12px' }}>Wed</div>
              <div style={{ padding: '12px' }}>Thu</div>
              <div style={{ padding: '12px' }}>Fri</div>
              <div style={{ padding: '12px' }}>Sat</div>
            </div>

            {/* Calendar Cells */}
            <div className="calendar-grid-body" style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', backgroundColor: 'var(--border-color)', gap: '1px', minWidth: '850px' }}>
              {renderCalendarDays()}
            </div>
          </div>
        )}
      </div>

      {/* Event Details List View */}
      {Array.isArray(displayEvents) && displayEvents.length > 0 && (
        <div className="card" style={{ marginTop: '24px', padding: '24px' }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: 800, color: 'var(--text-color)' }}>
            Monthly Event Ledger
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {displayEvents.map(evt => {
              const typeInfo = EVENT_TYPES[evt.event_type] || EVENT_TYPES.event_day;
              return (
                <div 
                  key={evt.id} 
                  className="card" 
                  style={{ 
                    padding: '16px', 
                    backgroundColor: 'var(--bg-light)', 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    borderLeft: `4px solid ${typeInfo.color}`
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text-color)' }}>
                        {new Date(evt.date).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </span>
                      <span 
                        style={{ 
                          fontSize: '11px', 
                          fontWeight: 700, 
                          padding: '2px 8px', 
                          borderRadius: '4px', 
                          backgroundColor: typeInfo.bg, 
                          color: typeInfo.color,
                          border: `1px solid ${typeInfo.border}`
                        }}
                      >
                        {typeInfo.label}
                      </span>
                      <span 
                        className={`badge ${
                          evt.status === 'sent_to_employee' 
                            ? 'badge-active' 
                            : evt.status === 'sent_to_manager' 
                            ? 'badge-in-progress' 
                            : 'badge-pending'
                        }`} 
                        style={{ fontSize: '10px', textTransform: 'uppercase' }}
                      >
                        {evt.status === 'sent_to_employee' 
                          ? 'Approved & Received' 
                          : evt.status === 'sent_to_manager' 
                          ? 'Sent to Manager' 
                          : 'Draft'}
                      </span>
                    </div>
                    <h4 style={{ margin: '0 0 4px 0', fontSize: '15px', fontWeight: 800, color: 'var(--text-color)' }}>{evt.title}</h4>
                    <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-muted)' }}>{evt.description || 'No description provided.'}</p>
                  </div>

                  {canModify && (
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button 
                        className="btn btn-secondary btn-sm"
                        onClick={(e) => handleOpenEdit(evt, e)}
                        style={{ padding: '6px 10px' }}
                        title="Edit Event"
                      >
                        <Edit2 size={12} /> Edit
                      </button>
                      <button 
                        className="btn btn-danger btn-sm"
                        onClick={(e) => handleDeleteEvent(evt.id, e)}
                        style={{ padding: '6px 10px' }}
                        title="Delete Event"
                      >
                        <Trash2 size={12} /> Delete
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Add / Edit Event Modal */}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={modalType === 'add' ? 'Add Event Day' : 'Edit Event Day'}
        >
          <form onSubmit={handleSaveEvent} style={{ padding: '16px' }}>
            {formError && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 12px', backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: 'var(--danger)', borderRadius: '4px', marginBottom: '16px', fontSize: '13px' }}>
                <AlertCircle size={16} />
                <span>{formError}</span>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label className="form-label" style={{ fontWeight: 700, marginBottom: '6px', display: 'block' }}>Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={formData.date}
                  onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                  required
                />
              </div>

              <div>
                <label className="form-label" style={{ fontWeight: 700, marginBottom: '6px', display: 'block' }}>Event Title</label>
                <input
                  type="text"
                  placeholder="e.g. Gandhi Jayanthi, Independence Day"
                  className="form-control"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  required
                />
              </div>

              <div>
                <label className="form-label" style={{ fontWeight: 700, marginBottom: '6px', display: 'block' }}>Event Type / Classification</label>
                <select
                  className="form-control"
                  value={formData.event_type}
                  onChange={(e) => setFormData(prev => ({ ...prev, event_type: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: '#fff',
                    outline: 'none'
                  }}
                  required
                >
                  <option value="event_day">Event Day</option>
                  <option value="national_day">National Day</option>
                  <option value="international_day">International Day</option>
                  <option value="celebrity_birthday">Celebrity Birthday</option>
                  <option value="festival_state">Festival Day (State Level)</option>
                  <option value="festival_national">Festival Day (National Level)</option>
                </select>
              </div>

              <div>
                <label className="form-label" style={{ fontWeight: 700, marginBottom: '6px', display: 'block' }}>Description</label>
                <textarea
                  placeholder="Details or notes about the event..."
                  className="form-control"
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" style={{ fontWeight: 700 }}>
                {modalType === 'add' ? 'Add Event' : 'Save Changes'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Manager Bulk Assignment Modal */}
      {isBulkModalOpen && (
        <Modal
          isOpen={isBulkModalOpen}
          onClose={() => setIsBulkModalOpen(false)}
          title="Bulk Assign Confirmed Event Days"
        >
          <form onSubmit={handleBulkAssignSubmit} style={{ padding: '20px' }}>
            <p style={{ margin: '0 0 16px 0', fontSize: '13px', color: 'var(--text-muted)' }}>
              Enter the count of unassigned event days to assign to each content writer. 
              <br />
              <strong style={{ color: 'var(--primary)' }}>
                Total Unassigned: {events.filter(ev => ev.status === 'sent_to_employee' && !ev.assigned_employee_id).length}
              </strong>
            </p>

            {bulkError && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 12px', backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: 'var(--danger)', borderRadius: '4px', marginBottom: '16px', fontSize: '13px' }}>
                <AlertCircle size={16} />
                <span>{bulkError}</span>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxHeight: '300px', overflowY: 'auto', paddingRight: '4px' }}>
              {writers.map(w => (
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
              <button type="button" className="btn btn-secondary" onClick={() => setIsBulkModalOpen(false)} disabled={bulkLoading}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" style={{ fontWeight: 700 }} disabled={bulkLoading}>
                {bulkLoading ? 'Assigning...' : 'Assign & Send'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* CONFIRMATION BEFORE APPROVAL MODAL */}
      {approveConfirmationModalOpen && (
        <Modal
          isOpen={approveConfirmationModalOpen}
          onClose={() => setApproveConfirmationModalOpen(false)}
          title="Approve & Finalize Event Calendar"
        >
          <div style={{ padding: '24px', textAlign: 'center' }}>
            <div style={{ 
              width: '64px', 
              height: '64px', 
              borderRadius: '50%', 
              backgroundColor: '#dcfce7', 
              color: '#15803d', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              margin: '0 auto 16px auto' 
            }}>
              <CheckCircle2 size={36} />
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-color)', margin: '0 0 10px 0' }}>
              Approve & Finalize Event Calendar?
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.6, margin: '0 0 24px 0' }}>
              Are you sure you want to approve and finalize the Event Day Calendar for <strong>{selectedMonth}</strong>?
              <br />
              <strong style={{ color: '#dc2626' }}>
                Once approved, deliverables will be generated for content writers and CANNOT be edited by anyone, including you.
              </strong>
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
              <button 
                type="button"
                className="btn btn-secondary" 
                onClick={() => setApproveConfirmationModalOpen(false)}
                disabled={approvingLoading}
                style={{ padding: '10px 24px', fontWeight: 700, borderRadius: '8px' }}
              >
                Cancel
              </button>
              <button 
                type="button"
                className="btn btn-success" 
                onClick={confirmApproveAndFinalize}
                disabled={approvingLoading}
                style={{ padding: '10px 28px', fontWeight: 700, borderRadius: '8px', fontSize: '14px' }}
              >
                {approvingLoading ? 'Finalizing...' : 'Approve & Finalize'}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* ALREADY APPROVED POPUP MODAL */}
      {alreadyApprovedModalOpen && (
        <Modal
          isOpen={alreadyApprovedModalOpen}
          onClose={() => setAlreadyApprovedModalOpen(false)}
          title="Already Approved"
        >
          <div style={{ padding: '24px', textAlign: 'center' }}>
            <div style={{ 
              width: '64px', 
              height: '64px', 
              borderRadius: '50%', 
              backgroundColor: '#fee2e2', 
              color: '#dc2626', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              margin: '0 auto 16px auto' 
            }}>
              <AlertCircle size={36} />
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-color)', margin: '0 0 8px 0' }}>
              Already Approved
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.5, margin: '0 0 24px 0' }}>
              This Event Day Calendar for <strong>{selectedMonth}</strong> has already been approved and finalized. It cannot be edited by anyone.
            </p>
            <button 
              className="btn btn-primary" 
              onClick={() => setAlreadyApprovedModalOpen(false)}
              style={{ padding: '10px 32px', fontWeight: 700, borderRadius: '8px', fontSize: '14px' }}
            >
              Understood
            </button>
          </div>
        </Modal>
      )}

    </div>
  );
};

export default EmployeeEventCalendar;
