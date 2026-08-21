const parseLocalDate = (dateStr) => {
  if (!dateStr) return null;
  const dObj = new Date(dateStr);
  if (!isNaN(dObj.getTime()) && dateStr.includes('T')) {
    return new Date(dObj.getFullYear(), dObj.getMonth(), dObj.getDate());
  }
  const cleanStr = dateStr.includes('T') ? dateStr.split('T')[0] : dateStr;
  const parts = cleanStr.split('-');
  if (parts.length === 2) {
    const [y, m] = parts.map(Number);
    return new Date(y, m - 1, 1);
  }
  if (parts.length === 3) {
    const [y, m, d] = parts.map(Number);
    return new Date(y, m - 1, d);
  }
  return null;
};

const getLocalDateString = (dateVal) => {
  if (!dateVal) return '';
  const dateObj = new Date(dateVal);
  if (isNaN(dateObj.getTime())) return '';
  const yyyy = dateObj.getFullYear();
  const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
  const dd = String(dateObj.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Plus, Edit2, Trash2, CheckCircle, Calendar, 
  ChevronLeft, ChevronRight, AlertCircle, RefreshCw, Grid, List, HelpCircle, Save, Info, Send
} from 'lucide-react';
import api from '../../../utils/api';
import { useAuth } from '../../../context/AuthContext';
import Modal from '../../../components/Modal';
import { FormInput, FormSelect, FormTextArea } from '../../../components/FormFields';

const BlogCalendarView = () => {
  const { user } = useAuth();
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    const monthParam = params.get('month');
    if (monthParam && /^\d{4}-\d{2}$/.test(monthParam)) {
      return monthParam;
    }
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
  });
  
  const [calendarItems, setCalendarItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [clients, setClients] = useState([]);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [listPage, setListPage] = useState(1);
  
  // Modals for editing / adding single items
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [editFormData, setEditFormData] = useState({
    date: '',
    title: '',
    description: '',
    status: 'draft',
    type: 'blog'
  });
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addForDate, setAddForDate] = useState('');
  const [addFormData, setAddFormData] = useState({
    client_id: '',
    title: '',
    description: '',
    status: 'draft',
    type: 'blog'
  });

  const [isSendConfirmModalOpen, setIsSendConfirmModalOpen] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [message, setMessage] = useState({ type: '', text: '' });

  // 1. Fetch blog calendar items for the selected month
  const fetchCalendar = useCallback(async () => {
    setLoading(true);
    setMessage({ type: '', text: '' });
    try {
      const response = await api.get('/blog-calendar', {
        params: { month: selectedMonth }
      });
      if (response.data.success) {
        setCalendarItems(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching blog calendar:', err.message);
      setMessage({ type: 'danger', text: 'Failed to load SEO calendar.' });
    } finally {
      setLoading(false);
    }
  }, [selectedMonth]);

  // 2. Fetch clients dropdown list for single item creations
  const fetchClients = useCallback(async () => {
    try {
      const res = await api.get('/clients/dropdown');
      if (res.data.success) {
        setClients(res.data.data.clients.map(c => ({ value: c.id, label: c.company_name })));
        if (res.data.data.clients.length > 0) {
          setAddFormData(prev => ({ ...prev, client_id: res.data.data.clients[0].id }));
        }
      }
    } catch (err) {
      console.error('Error fetching clients:', err.message);
    }
  }, []);

  useEffect(() => {
    fetchCalendar();
  }, [fetchCalendar]);

  useEffect(() => {
    if (user?.role === 'admin' || user?.role === 'manager') {
      fetchClients();
    }
  }, [fetchClients, user?.role]);

  // Handle Month Navigation
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

  // Add Item Single Click
  const handleOpenAddModal = (dateStr) => {
    setAddForDate(dateStr);
    setFormErrors({});
    setAddFormData({
      client_id: clients[0]?.value || '',
      title: '',
      description: '',
      status: 'draft',
      type: 'blog'
    });
    setIsAddModalOpen(true);
  };

  const validateAddForm = () => {
    const errors = {};
    if (!addFormData.client_id) errors.client_id = 'Client is required.';
    if (!addFormData.title.trim()) errors.title = 'Title is required.';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!validateAddForm()) return;
    try {
      const payload = {
        ...addFormData,
        date: addForDate,
        month: selectedMonth
      };
      const res = await api.post('/blog-calendar', payload);
      if (res.data.success) {
        setIsAddModalOpen(false);
        setMessage({ type: 'success', text: 'SEO calendar item added successfully!' });
        fetchCalendar();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add SEO calendar item.');
    }
  };

  // Edit Item Click
  const handleOpenEditModal = (item) => {
    if (item.assigned_employee_id !== null) {
      alert('Work is assigned to the content writer');
      return;
    }
    setCurrentItem(item);
    setFormErrors({});
    setEditFormData({
      date: getLocalDateString(item.date),
      title: item.title,
      description: item.description || '',
      status: item.status,
      type: item.type || 'blog'
    });
    setIsEditModalOpen(true);
  };

  const validateEditForm = () => {
    const errors = {};
    if (!editFormData.date) errors.date = 'Date is required.';
    if (!editFormData.title.trim()) errors.title = 'Title is required.';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!validateEditForm()) return;
    try {
      const res = await api.put(`/blog-calendar/${currentItem.id}`, editFormData);
      if (res.data.success) {
        setIsEditModalOpen(false);
        setMessage({ type: 'success', text: 'SEO calendar item updated successfully!' });
        fetchCalendar();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update SEO calendar item.');
    }
  };

  const handleDeleteItem = async () => {
    if (currentItem && currentItem.assigned_employee_id !== null) {
      alert('Work is assigned to the content writer');
      return;
    }
    if (!(await window.confirm(`Are you sure you want to delete this SEO item: "${currentItem.title}"?`))) return;
    try {
      let res;
      try {
        res = await api.post(`/blog-calendar/${currentItem.id}/delete`);
      } catch (_) {
        res = await api.delete(`/blog-calendar/${currentItem.id}`);
      }
      if (res.data.success) {
        setIsEditModalOpen(false);
        setMessage({ type: 'success', text: 'SEO calendar item deleted.' });
        fetchCalendar();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete SEO calendar item.');
    }
  };

  const handleClearMonth = async () => {
    if (!(await window.confirm(`WARNING: This will delete ALL draft SEO calendar items for the month of ${selectedMonth}. Are you sure?`))) return;
    try {
      let res;
      try {
        res = await api.post(`/blog-calendar/month/${selectedMonth}/delete`);
      } catch (_) {
        res = await api.delete(`/blog-calendar/month/${selectedMonth}`);
      }
      if (res.data.success) {
        setMessage({ type: 'success', text: `Cleared draft SEO calendar items for ${selectedMonth}.` });
        fetchCalendar();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to clear draft SEO calendar items.');
    }
  };

  const handleSendToSeoTeam = () => {
    setIsSendConfirmModalOpen(true);
  };

  const executeSendToSeoTeam = async () => {
    try {
      setLoading(true);
      const res = await api.post('/blog-calendar/send-to-seo', { month: selectedMonth });
      if (res.data.success) {
        setMessage({ type: 'success', text: `SEO calendar for ${selectedMonth} successfully sent to the SEO Team!` });
        fetchCalendar();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to send calendar to SEO team.');
    } finally {
      setLoading(false);
    }
  };

  const getPillStyle = (item) => {
    // defaults
    let bg = '#fef3c7';
    let color = '#92400e';
    let border = '#fde68a';

    if (item.status === 'approved') {
      bg = 'var(--success-light)';
      color = 'var(--success)';
      border = 'rgba(16, 185, 129, 0.2)';
    } else if (item.status === 'sent_to_employees') {
      bg = 'var(--primary-light)';
      color = 'var(--primary)';
      border = 'rgba(79, 70, 229, 0.2)';
    } else {
      // draft statuses can have specific colors per type
      if (item.type === 'gmb') {
        bg = '#ecfdf5';
        color = '#047857';
        border = '#a7f3d0';
      } else if (item.type === 'backlink') {
        bg = '#f5f3ff';
        color = '#6d28d9';
        border = '#ddd6fe';
      }
    }

    return {
      backgroundColor: bg,
      color: color,
      borderColor: border,
      border: '1px solid',
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
      padding: '3px 6px',
      borderRadius: '3px',
      fontSize: '11px',
      fontWeight: 600,
      cursor: 'pointer',
      marginBottom: '3px'
    };
  };

  const getPillLabel = (item) => {
    if (item.type === 'gmb') return 'GMB';
    if (item.type === 'backlink') return 'LINK';
    return 'BLOG';
  };

  // Helper: Get days of month to render grid
  const renderCalendarGrid = () => {
    const [year, month] = selectedMonth.split('-').map(Number);
    const firstDayIndex = new Date(year, month - 1, 1).getDay(); // 0 is Sunday
    const totalDays = new Date(year, month, 0).getDate();
    
    const cells = [];
    // Empty cells at start
    for (let i = 0; i < firstDayIndex; i++) {
      cells.push(<div key={`empty-${i}`} className="calendar-day-cell empty-cell"></div>);
    }

    // Days cells
    for (let day = 1; day <= totalDays; day++) {
      const dateStr = `${selectedMonth}-${String(day).padStart(2, '0')}`;
      const dayItems = calendarItems.filter(item => getLocalDateString(item.date) === dateStr);
      
      cells.push(
        <div key={`day-${day}`} className="calendar-day-cell">
          <div className="day-cell-header">
            <span className="day-number">{day}</span>
            {user?.role === 'admin' && (
              <button 
                onClick={() => handleOpenAddModal(dateStr)}
                className="btn-add-day-item"
                title="Add SEO Task"
              >
                <Plus size={12} />
              </button>
            )}
          </div>

          <div className="day-cell-content scrollable-y">
            {dayItems.map(item => (
              <div 
                key={item.id}
                onClick={() => handleOpenEditModal(item)}
                className="calendar-item-pill"
                style={getPillStyle(item)}
                title={`${item.client_name}: ${item.title} (${item.status})`}
              >
                <span className="pill-type-label" style={{ opacity: 0.8, fontWeight: 800, fontSize: '9px', minWidth: '34px', borderRight: '1px solid rgba(0,0,0,0.1)', paddingRight: '4px' }}>
                  {getPillLabel(item)}
                </span>
                <span className="pill-client-name" style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', flex: 1 }}>{item.client_name}</span>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return cells;
  };

  const isApproved = calendarItems.length > 0 && calendarItems.every(item => item.status === 'approved' || item.status === 'sent_to_employees');

  const renderPagination = (isTop = false) => {
    if (calendarItems.length <= 10) return null;
    
    return (
      <div 
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '16px 24px',
          backgroundColor: '#ffffff',
          border: '1px solid var(--border-color)',
          borderTop: isTop ? '1px solid var(--border-color)' : 'none',
          borderBottom: isTop ? 'none' : '1px solid var(--border-color)',
          borderRadius: isTop 
            ? 'var(--radius-md) var(--radius-md) 0 0' 
            : '0 0 var(--radius-md) var(--radius-md)',
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
          Showing <strong>{((listPage - 1) * 10) + 1}</strong> to <strong>{Math.min(listPage * 10, calendarItems.length)}</strong> of <strong>{calendarItems.length}</strong> items
        </span>
        
        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            className="pagination-btn"
            disabled={listPage === 1}
            onClick={() => setListPage(p => p - 1)}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '32px', height: '32px', padding: '0 6px', border: '1px solid var(--border-color)', borderRadius: '4px', backgroundColor: '#fff', cursor: listPage === 1 ? 'not-allowed' : 'pointer', opacity: listPage === 1 ? 0.5 : 1 }}
          >
            <ChevronLeft size={16} />
          </button>
          
          {Array.from({ length: Math.ceil(calendarItems.length / 10) }, (_, i) => i + 1)
            .filter(p => p === 1 || p === Math.ceil(calendarItems.length / 10) || Math.abs(p - listPage) <= 1)
            .map((p, idx, arr) => {
              const prev = arr[idx - 1];
              const showEllipsis = prev && p - prev > 1;
              return (
                <React.Fragment key={p}>
                  {showEllipsis && <span style={{ display: 'flex', alignItems: 'center', padding: '0 4px', color: 'var(--text-light)' }}>...</span>}
                  <button
                    className="pagination-btn"
                    style={{
                      minWidth: '32px',
                      height: '32px',
                      border: '1px solid ' + (listPage === p ? 'var(--primary)' : 'var(--border-color)'),
                      borderRadius: '4px',
                      backgroundColor: listPage === p ? 'var(--primary)' : 'white',
                      color: listPage === p ? 'white' : 'var(--text-main)',
                      fontWeight: 700,
                      fontSize: '13px',
                      cursor: 'pointer',
                      padding: '0 8px'
                    }}
                    onClick={() => setListPage(p)}
                  >
                    {p}
                  </button>
                </React.Fragment>
              );
            })}

          <button
            className="pagination-btn"
            disabled={listPage * 10 >= calendarItems.length}
            onClick={() => setListPage(p => p + 1)}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '32px', height: '32px', padding: '0 6px', border: '1px solid var(--border-color)', borderRadius: '4px', backgroundColor: '#fff', cursor: listPage * 10 >= calendarItems.length ? 'not-allowed' : 'pointer', opacity: listPage * 10 >= calendarItems.length ? 0.5 : 1 }}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div style={{ padding: '30px', maxWidth: '1400px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Month Selection Bar & Toolbar */}
      <div className="table-toolbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        
        {/* Left Side: Month navigation and details */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div className="pagination-controls" style={{ margin: 0 }}>
            <button className="btn btn-secondary btn-sm" onClick={handlePrevMonth}>
              <ChevronLeft size={16} />
            </button>
            <span style={{ fontWeight: 700, fontSize: '16px', color: 'var(--text-main)', minWidth: '130px', textAlign: 'center' }}>
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

          {calendarItems.length > 0 && (
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: '99px', backgroundColor: 'var(--primary-light)', border: '1px solid var(--primary)', color: 'var(--primary)', fontWeight: 700, fontSize: '13px' }}>
              <span>Total Tasks:</span>
              <strong style={{ fontSize: '15px' }}>{calendarItems.length}</strong>
            </div>
          )}
        </div>

        {/* Right Side: Toolbar buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {calendarItems.length > 0 && (
            <>
              <div className="view-mode-toggle" style={{ display: 'flex', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
                <button 
                  className={`btn btn-sm ${viewMode === 'grid' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ borderRadius: 0, border: 'none', padding: '6px 10px' }}
                  onClick={() => setViewMode('grid')}
                  title="Grid view"
                >
                  <Grid size={16} />
                </button>
                <button 
                  className={`btn btn-sm ${viewMode === 'list' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ borderRadius: 0, border: 'none', padding: '6px 10px' }}
                  onClick={() => setViewMode('list')}
                  title="List view"
                >
                  <List size={16} />
                </button>
              </div>

              {user?.role === 'admin' && (
                <>
                  {!isApproved ? (
                    <button className="btn btn-success" onClick={handleSendToSeoTeam} disabled={loading} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                      <Send size={16} /> Send to SEO Team
                    </button>
                  ) : (
                    <span className="badge badge-active" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 14px', fontSize: '13px', fontWeight: 700 }}>
                      <CheckCircle size={14} /> Sent to SEO Team
                    </span>
                  )}
                  <button className="btn btn-danger" onClick={handleClearMonth} title="Clear this month's draft SEO tasks">
                    <Trash2 size={16} style={{ marginRight: '6px' }} /> Delete Calendar
                  </button>
                </>
              )}

              {user?.role === 'manager' && (
                isApproved ? (
                  <span className="badge badge-active" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 14px', fontSize: '13px', fontWeight: 700 }}>
                    <CheckCircle size={14} /> Active SEO Calendar
                  </span>
                ) : (
                  <span className="badge badge-pending" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 14px', fontSize: '13px', fontWeight: 700, backgroundColor: '#fef3c7', color: '#b45309', border: '1px solid #fde68a' }}>
                    <AlertCircle size={14} /> Pending Admin Release
                  </span>
                )
              )}
            </>
          )}

          <button 
            className="btn btn-secondary" 
            onClick={fetchCalendar} 
            disabled={loading}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
          >
            <RefreshCw size={14} className={loading ? 'spin-anim' : ''} />
            Refresh
          </button>
        </div>
      </div>

      {/* Feedback Messages */}
      {message.text && (
        <div style={{
          padding: '12px 20px',
          backgroundColor: message.type === 'success' ? 'var(--success-light)' : 'var(--danger-light)',
          color: message.type === 'success' ? 'var(--success)' : 'var(--danger)',
          fontSize: '13px',
          fontWeight: 600,
          borderLeft: `4px solid ${message.type === 'success' ? 'var(--success)' : 'var(--danger)'}`,
          borderRadius: '4px'
        }}>
          {message.text}
        </div>
      )}

      {/* Main Content Area */}
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '350px', gap: '16px', color: 'var(--text-muted)' }}>
          <div style={{ width: '40px', height: '40px', border: '3px solid #e2e8f0', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
          <p style={{ fontWeight: 600 }}>Loading calendar records...</p>
        </div>
      ) : calendarItems.length === 0 ? (
        <div className="card" style={{ padding: '80px 40px', textAlign: 'center', maxWidth: '800px', margin: '40px auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
          <Calendar size={48} className="text-muted" style={{ opacity: 0.5 }} />
          <h3 style={{ margin: 0, fontWeight: 700 }}>No SEO Calendar Found</h3>
          <p className="text-muted" style={{ margin: 0, fontSize: '14px', maxWidth: '500px' }}>
            There is no SEO calendar generated for the month of {(() => {
              const date = parseLocalDate(selectedMonth + '-01');
              return date ? date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : '';
            })()} yet. Please configure counts and generate the calendar in **Deliverables Workspace to SEO Deliverables**.
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        
        /* Grid Calendar View */
        <div className="card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', maxHeight: 'calc(100vh - 160px)' }}>
          <div style={{ overflow: 'auto', flex: 1, borderRadius: 'var(--radius-md)' }}>
            <div className="calendar-grid-container" style={{ minWidth: '950px' }}>
              {/* Days of Week Header */}
              {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(day => (
                <div key={day} className="calendar-header-cell">{day}</div>
              ))}
              
              {/* Days Grid Cells */}
              {renderCalendarGrid()}
            </div>
          </div>
        </div>
      ) : (
        
        /* List View */
        <div>
          {renderPagination(true)}
          <div 
            className="card" 
            style={{ 
              padding: '20px', 
              borderRadius: calendarItems.length > 10 ? '0' : 'var(--radius-md) var(--radius-md) 0 0', 
              borderBottom: 'none', 
              borderTop: calendarItems.length > 10 ? 'none' : '1px solid var(--border-color)',
              marginBottom: 0, 
              overflowX: 'auto', 
              maxWidth: '100%' 
            }}
          >
            <div style={{ overflowX: 'auto' }}>
              <table className="enterprise-table" style={{ width: '100%', minWidth: '100%' }}>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Client Name</th>
                    <th>Type</th>
                    <th>Title</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {calendarItems
                    .slice((listPage - 1) * 10, listPage * 10)
                    .map(item => (
                      <tr key={item.id} style={{ verticalAlign: 'middle' }}>
                        <td style={{ fontWeight: 700 }}>{(() => {
                          const date = parseLocalDate(item.date);
                          return date ? date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : '';
                        })()}</td>
                        <td>{item.client_name}</td>
                        <td>
                          <span className="badge" style={{ backgroundColor: item.type === 'gmb' ? '#ecfdf5' : item.type === 'backlink' ? '#f5f3ff' : 'var(--primary-light)', color: item.type === 'gmb' ? '#047857' : item.type === 'backlink' ? '#6d28d9' : 'var(--primary)', fontWeight: 700, textTransform: 'uppercase', fontSize: '10px' }}>
                            {item.type || 'blog'}
                          </span>
                        </td>
                        <td style={{ fontWeight: 500 }}>{item.title}</td>
                        <td>
                          <span className={`badge ${item.status === 'approved' ? 'badge-active' : item.status === 'sent_to_employees' ? 'badge-active' : 'badge-pending'}`}>
                            {item.status}
                          </span>
                        </td>
                        <td>
                          <button 
                            className="btn btn-secondary btn-sm" 
                            onClick={() => handleOpenEditModal(item)}
                            title="Edit Scheduled Task"
                          >
                            <Edit2 size={12} />
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
          
          {renderPagination(false)}
        </div>
      )}

      {/* ADD BLOG MODAL */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title={`Add SEO Task - ${addForDate}`}
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setIsAddModalOpen(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleAddSubmit}>Add Task</button>
          </>
        }
      >
        <form onSubmit={handleAddSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <FormSelect
            label="Client Name"
            value={addFormData.client_id}
            onChange={(e) => setAddFormData(prev => ({ ...prev, client_id: e.target.value }))}
            options={clients}
            error={formErrors.client_id}
            required
          />
          <FormSelect
            label="Post Type"
            value={addFormData.type}
            onChange={(e) => setAddFormData(prev => ({ ...prev, type: e.target.value }))}
            options={[
              { value: 'blog', label: 'Blog Article' },
              { value: 'gmb', label: 'GMB Post' },
              { value: 'backlink', label: 'Backlink Submission' }
            ]}
          />
          <FormInput
            label="Task Title"
            value={addFormData.title}
            onChange={(e) => setAddFormData(prev => ({ ...prev, title: e.target.value }))}
            error={formErrors.title}
            placeholder="e.g. 5 Benefits of Chiropractic Care"
            required
          />
          <FormTextArea
            label="Task Details / Brief description"
            value={addFormData.description}
            onChange={(e) => setAddFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Outline keywords, posting requirements, references..."
            rows={4}
          />
          <FormSelect
            label="Scheduling Status"
            value={addFormData.status}
            onChange={(e) => setAddFormData(prev => ({ ...prev, status: e.target.value }))}
            options={[
              { value: 'draft', label: 'Draft' },
              { value: 'approved', label: 'Approved (Ready to publish)' },
              { value: 'sent_to_employees', label: 'Released' }
            ]}
          />
        </form>
      </Modal>

      {/* EDIT/DELETE BLOG MODAL */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit SEO Task"
        footer={
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            {currentItem && currentItem.assigned_employee_id === null ? (
              <button className="btn btn-secondary" style={{ color: 'var(--danger)', borderColor: 'rgba(239,68,68,0.2)' }} onClick={handleDeleteItem} type="button">
                <Trash2 size={16} style={{ marginRight: '6px' }} />
                Delete Item
              </button>
            ) : <div />}
            <div style={{ display: 'flex', gap: '12px' }}>
              <button className="btn btn-secondary" onClick={() => setIsEditModalOpen(false)} type="button">Cancel</button>
              <button className="btn btn-primary" onClick={handleEditSubmit} type="button">Save Changes</button>
            </div>
          </div>
        }
      >
        <form onSubmit={handleEditSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ padding: '10px 14px', backgroundColor: 'var(--bg-light)', border: '1px solid var(--border-color)', borderRadius: '6px' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', fontWeight: 600 }}>Client Profile</span>
            <span style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text-color)' }}>{currentItem?.client_name}</span>
          </div>

          <FormInput
            label="Schedule Date"
            type="date"
            value={editFormData.date}
            onChange={(e) => setEditFormData(prev => ({ ...prev, date: e.target.value }))}
            error={formErrors.date}
            required
          />

          <FormSelect
            label="Post Type"
            value={editFormData.type}
            onChange={(e) => setEditFormData(prev => ({ ...prev, type: e.target.value }))}
            options={[
              { value: 'blog', label: 'Blog Article' },
              { value: 'gmb', label: 'GMB Post' },
              { value: 'backlink', label: 'Backlink Submission' }
            ]}
          />

          <FormInput
            label="Task Title"
            value={editFormData.title}
            onChange={(e) => setEditFormData(prev => ({ ...prev, title: e.target.value }))}
            error={formErrors.title}
            required
          />

          <FormTextArea
            label="Task Details / Brief description"
            value={editFormData.description}
            onChange={(e) => setEditFormData(prev => ({ ...prev, description: e.target.value }))}
            rows={4}
          />

          <FormSelect
            label="Scheduling Status"
            value={editFormData.status}
            onChange={(e) => setEditFormData(prev => ({ ...prev, status: e.target.value }))}
            options={[
              { value: 'draft', label: 'Draft' },
              { value: 'approved', label: 'Approved (Ready to publish)' },
              { value: 'sent_to_employees', label: 'Released' }
            ]}
          />
        </form>
      </Modal>

      {/* SEND TO SEO CONFIRMATION MODAL */}
      <Modal
        isOpen={isSendConfirmModalOpen}
        onClose={() => setIsSendConfirmModalOpen(false)}
        title="Send Calendar to SEO Team"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setIsSendConfirmModalOpen(false)}>
              Cancel
            </button>
            <button 
              className="btn btn-success" 
              onClick={async () => {
                setIsSendConfirmModalOpen(false);
                await executeSendToSeoTeam();
              }}
              disabled={loading}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <Send size={16} /> Yes, Send Calendar
            </button>
          </>
        }
      >
        <div style={{ textAlign: 'center', padding: '10px 0' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '56px', height: '56px', borderRadius: '50%', backgroundColor: 'var(--success-light)', color: 'var(--success)', marginBottom: '16px' }}>
            <Send size={32} />
          </div>
          <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: 800, color: 'var(--text-color)' }}>
            Confirm SEO Handoff
          </h3>
          <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.5' }}>
            Are you sure you want to send the SEO Calendar for <strong>{selectedMonth}</strong> to the SEO Team? This will approve all draft tasks and notify the department manager.
          </p>
        </div>
      </Modal>

      <style>{`
        .calendar-grid-container {
          display: grid;
          grid-template-columns: repeat(7, minmax(0, 1fr));
          background-color: var(--border-color);
          gap: 1px;
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
        }
        .calendar-header-cell {
          position: sticky;
          top: 0;
          z-index: 10;
          background-color: var(--bg-app);
          padding: 12px;
          text-align: center;
          font-weight: 700;
          font-size: 13px;
          color: var(--text-muted);
          box-shadow: 0 1px 0 var(--border-color);
        }
        .calendar-day-cell {
          background-color: var(--bg-card);
          padding: 8px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          position: relative;
          min-height: 120px;
          transition: var(--transition-fast);
        }
        .calendar-day-cell:hover {
          background-color: #fafbfc;
        }
        .calendar-day-cell.empty-cell {
          background-color: #f1f5f9;
          cursor: not-allowed;
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
        .btn-add-day-item {
          background: none;
          border: none;
          color: var(--text-light);
          cursor: pointer;
          padding: 2px;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: var(--transition-fast);
        }
        .btn-add-day-item:hover {
          background-color: var(--primary-light);
          color: var(--primary);
        }
        .day-cell-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 4px;
          max-height: 100px;
        }
        .scrollable-y {
          overflow-y: auto;
        }
        .scrollable-y::-webkit-scrollbar {
          width: 3px;
        }
        .scrollable-y::-webkit-scrollbar-thumb {
          background-color: var(--text-light);
          border-radius: 2px;
        }
        .calendar-item-pill {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 11px;
          font-weight: 600;
          cursor: pointer;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          transition: var(--transition-fast);
        }
        .calendar-item-pill:hover {
          transform: translateY(-1px);
          box-shadow: var(--shadow-sm);
          filter: brightness(0.95);
        }
        .pill-client-name {
          font-weight: 800;
          border-right: 1px solid rgba(0,0,0,0.1);
          padding-right: 4px;
          margin-right: 4px;
        }
        .spin-anim {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default BlogCalendarView;
