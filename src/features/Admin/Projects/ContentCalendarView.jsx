import React, { useState, useEffect, useCallback } from 'react';
import * as XLSX from 'xlsx';
import { 
  Plus, Edit2, Trash2, CheckCircle, Calendar, 
  Upload, Link, Grid, List, ChevronLeft, ChevronRight, AlertCircle, RefreshCw, HelpCircle, Send
} from 'lucide-react';
import api from '../../../utils/api';
import { useAuth } from '../../../context/AuthContext';
import Modal from '../../../components/Modal';
import { FormInput, FormSelect, FormTextArea } from '../../../components/FormFields';

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
  if (typeof dateVal === 'string') {
    return dateVal.split('T')[0];
  }
  const dateObj = new Date(dateVal);
  if (isNaN(dateObj.getTime())) return '';
  const yyyy = dateObj.getUTCFullYear();
  const mm = String(dateObj.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(dateObj.getUTCDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

const ContentCalendarView = ({ activityTypeFilter = null }) => {
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
  const isApproved = Array.isArray(calendarItems) && calendarItems.length > 0 && calendarItems.some(item => ['approved', 'sent_to_employees'].includes(item.status));
  const isSentToManager = Array.isArray(calendarItems) && calendarItems.length > 0 && calendarItems.every(item => ['sent_to_manager', 'approved', 'sent_to_employees'].includes(item.status));

  const displayedItems = Array.isArray(calendarItems)
    ? (activityTypeFilter ? calendarItems.filter(item => item.activity_type_code === activityTypeFilter) : calendarItems)
    : [];
  const [loading, setLoading] = useState(false);
  const [clients, setClients] = useState([]);
  const [activityTypes, setActivityTypes] = useState([]);
  
  // View mode: 'grid' or 'list'
  const [viewMode, setViewMode] = useState('grid');
  const [listPage, setListPage] = useState(1);
  
  // Sheet imports
  const [googleSheetUrl, setGoogleSheetUrl] = useState('');
  const [importRows, setImportRows] = useState([]);
  const [isImportPreviewOpen, setIsImportPreviewOpen] = useState(false);
  const [importLoading, setImportLoading] = useState(false);
  
  // Modals for editing / adding single items
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [approveModal, setApproveModal] = useState({ isOpen: false, type: 'confirm', message: '' });
  const [currentItem, setCurrentItem] = useState(null);
  const [editFormData, setEditFormData] = useState({
    date: '',
    activity_type_code: '',
    title: '',
    description: ''
  });
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addForDate, setAddForDate] = useState('');
  const [addFormData, setAddFormData] = useState({
    client_id: '',
    activity_type_code: '',
    title: '',
    description: ''
  });

  const [formErrors, setFormErrors] = useState({});

  const [skipDates, setSkipDates] = useState([]);
  const [isSkipModalOpen, setIsSkipModalOpen] = useState(false);
  const [alreadyApprovedModalOpen, setAlreadyApprovedModalOpen] = useState(false);

  // 1. Fetch calendar items for the selected month
  const fetchCalendar = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/calendar', {
        params: { month: selectedMonth }
      });
      if (response.data.success) {
        setCalendarItems(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching calendar:', err.message);
    } finally {
      setLoading(false);
    }
  }, [selectedMonth]);

  useEffect(() => {
    setListPage(1);
  }, [selectedMonth, calendarItems?.length]);

  // 2. Fetch clients dropdown list for single item creations
  const fetchClients = useCallback(async () => {
    try {
      const res = await api.get('/clients/dropdown');
      if (res.data.success) {
        setClients(res.data.data.clients.map(c => ({ value: c.id, label: c.company_name })));
      }
    } catch (err) {
      console.error('Error fetching clients:', err.message);
    }
  }, []);

  const fetchActivityTypes = useCallback(async () => {
    try {
      const res = await api.get('/activity-types');
      if (res.data.success) {
        setActivityTypes(res.data.data);
        if (res.data.data.length > 0) {
          const defaultCode = res.data.data[0].activity_type_code;
          setAddFormData(prev => ({ ...prev, activity_type_code: defaultCode }));
          setEditFormData(prev => ({ ...prev, activity_type_code: defaultCode }));
        }
      }
    } catch (err) {
      console.error('Error fetching activity types:', err.message);
    }
  }, []);

  const fetchSkipDates = useCallback(async () => {
    try {
      const res = await api.get('/calendar/skip-dates', { params: { month: selectedMonth } });
      if (res.data.success) {
        setSkipDates(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching skip dates:', err.message);
    }
  }, [selectedMonth]);

  useEffect(() => {
    fetchCalendar();
    fetchSkipDates();
  }, [fetchCalendar, fetchSkipDates]);

  useEffect(() => {
    if (user?.role === 'admin' || user?.role === 'manager') {
      fetchClients();
    }
  }, [fetchClients, user?.role]);

  useEffect(() => {
    if (user?.role === 'admin' || user?.role === 'manager') {
      fetchActivityTypes();
    }
  }, [fetchActivityTypes, user?.role]);

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

  // Google Sheet Import Handler
  const handleGoogleSheetImport = async (e) => {
    e.preventDefault();
    if (isApproved) {
      setAlreadyApprovedModalOpen(true);
      return;
    }
    if (!googleSheetUrl.trim()) return;
    setImportLoading(true);
    try {
      const res = await api.post('/calendar/import-google-sheets', { url: googleSheetUrl });
      if (res.data.success) {
        setImportRows(res.data.data);
        setIsImportPreviewOpen(true);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to fetch the Google Sheet. Make sure it is shared publicly.');
    } finally {
      setImportLoading(false);
    }
  };

  // Excel File Upload Parser (Vite compatible XLSX parser)
  const handleExcelUpload = (e) => {
    if (isApproved) {
      setAlreadyApprovedModalOpen(true);
      return;
    }
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = new Uint8Array(evt.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        // Find header row (first row that contains 'client name' or 'client' in first column)
        let headerIdx = -1;
        for (let i = 0; i < json.length; i++) {
          const row = json[i];
          if (row && row[0] && (row[0].toString().toLowerCase().includes('client name') || row[0].toString().toLowerCase() === 'client' || row[0].toString().toLowerCase() === 'client_name')) {
            headerIdx = i;
            break;
          }
        }

        if (headerIdx === -1) {
          alert('Could not find header row. Please make sure the first column header is "Client Name".');
          return;
        }

        const headers = json[headerIdx].map(h => h ? h.toString().trim() : '');
        const rows = [];

        for (let i = headerIdx + 1; i < json.length; i++) {
          const row = json[i];
          if (!row || !row[0] || row[0].toString().trim() === '' || row[0].toString().toLowerCase().includes('client name') || row[0].toString().toLowerCase() === 'client') {
            continue; // Skip headers or empty rows
          }

          const rowObj = {};
          headers.forEach((header, idx) => {
            if (header) {
              rowObj[header] = row[idx];
            }
          });
          rowObj.clientName = row[0].toString().trim();
          rows.push(rowObj);
        }

        if (rows.length === 0) {
          alert('No valid client deliverables found in sheet. Make sure the first column contains client names.');
          return;
        }

        setImportRows(rows);
        setIsImportPreviewOpen(true);
      } catch (err) {
        console.error(err);
        alert('Failed to parse Excel file. Please ensure it is a valid format.');
      }
    };
    reader.readAsArrayBuffer(file);
    e.target.value = null;
  };

  // Submit parsed sheet rows to generate calendar draft
  const handleGenerateCalendar = async () => {
    setLoading(true);
    setIsImportPreviewOpen(false);
    try {
      const res = await api.post('/calendar/generate', {
        month: selectedMonth,
        rows: importRows,
        skipDates: skipDates
      });
      if (res.data.success) {
        setCalendarItems(res.data.data);
        setGoogleSheetUrl('');
        // Reload clients dropdown in case new clients were auto-created
        fetchClients();
        fetchSkipDates();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error generating content calendar.');
    } finally {
      setLoading(false);
    }
  };

  // Delete all items for selected month
  const handleDeleteMonth = async () => {
    if (isApproved) {
      setAlreadyApprovedModalOpen(true);
      return;
    }

    const isApprovedCheck = calendarItems.some(item => item.status === 'approved' || item.status === 'sent_to_employees');
    const msg = isApprovedCheck 
      ? 'WARNING: This calendar has already been approved and deliverables have been assigned to creatives. Deleting it now will remove it from the calendar ledger, but will NOT delete previously generated monthly deliverables. Are you sure you want to proceed?'
      : 'Are you sure you want to delete the draft calendar for this month? This will clear all scheduled items.';

    if (!(await window.confirm(msg))) return;

    setLoading(true);
    try {
      const res = await api.delete(`/calendar/month/${selectedMonth}`);
      if (res.data.success) {
        setCalendarItems([]);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete calendar.');
    } finally {
      setLoading(false);
    }
  };

  // Open confirmation modal instead of window.confirm
  const handleApproveCalendarClick = () => {
    if (!calendarItems || calendarItems.length === 0) return;
    setApproveModal({
      isOpen: true,
      type: 'confirm',
      message: 'Are you sure you want to approve this calendar and send deliverables to the Creatives Team? This will lock the schedule.'
    });
  };

  // Perform backend approval call
  const handleConfirmApproval = async () => {
    setLoading(true);
    setApproveModal(prev => ({ ...prev, isOpen: false })); // close confirm modal first
    try {
      const res = await api.post('/calendar/approve', { month: selectedMonth });
      if (res.data.success) {
        fetchCalendar();
        // Open success modal
        setApproveModal({
          isOpen: true,
          type: 'success',
          message: 'Content calendar has been approved and successfully sent to the Creatives Team!'
        });
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Approval failed.');
    } finally {
      setLoading(false);
    }
  };

  const [employeesSending, setEmployeesSending] = useState(false);
  const [managerSending, setManagerSending] = useState(false);

  const handleSendCalendarToEmployees = async () => {
    setEmployeesSending(true);
    try {
      const res = await api.post('/calendar/send-employees', { month: selectedMonth });
      if (res.data.success) {
        alert('Content calendar successfully published and sent to all employees of the Creatives Team.');
      }
    } catch (err) {
      console.error('Failed to send calendar to employees:', err.message);
      alert(err.response?.data?.message || 'Failed to distribute content calendar.');
    } finally {
      setEmployeesSending(false);
    }
  };

  const handleSendCalendarToManager = async () => {
    if (isSentToManager) {
      alert('already send');
      return;
    }
    setManagerSending(true);
    try {
      const res = await api.post('/calendar/send-manager', { month: selectedMonth });
      if (res.data.success) {
        alert('Content calendar successfully submitted to the Creative Manager for approval.');
        fetchCalendar();
      }
    } catch (err) {
      console.error('Failed to submit calendar to manager:', err.message);
      alert(err.response?.data?.message || 'Failed to submit content calendar.');
    } finally {
      setManagerSending(false);
    }
  };

  const handleSetCalendarToDraft = async () => {
    if (isApproved) {
      setAlreadyApprovedModalOpen(true);
      return;
    }
    if (!window.confirm('Are you sure you want to put this calendar in edit mode? This will allow you to edit/delete items.')) return;
    try {
      const res = await api.post('/calendar/set-draft', { month: selectedMonth });
      if (res.data.success) {
        alert('Calendar is now in Edit Mode! You can now click any task pill or row edit icon to edit/delete items.');
        fetchCalendar();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to switch calendar to edit mode.');
    }
  };

  // Open Edit Modal
  const handleOpenEdit = (item, e) => {
    if (e) e.stopPropagation();
    if (user?.role !== 'admin' && user?.role !== 'manager') return; // Read-only for non-admins/non-managers
    if (isApproved) {
      setAlreadyApprovedModalOpen(true);
      return;
    }
    if (item.assigned_employee_id !== null) {
      alert('Work is assigned to the content writer');
      return;
    }
    setCurrentItem(item);
    setEditFormData({
      date: getLocalDateString(item.date),
      activity_type_code: item.activity_type_code,
      title: item.title,
      description: item.description || ''
    });
    setFormErrors({});
    setIsEditModalOpen(true);
  };

  // Submit Edit Modal
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editFormData.title.trim()) {
      setFormErrors({ title: 'Title is required.' });
      return;
    }

    const targetDate = editFormData.date;
    if (isSundayDate(targetDate) || isSkippedDate(targetDate)) {
      const dayType = isSundayDate(targetDate) ? 'Sunday mandatory holiday' : 'company skipped off-day';
      if (!(await window.confirm(`Selected date (${targetDate}) is a ${dayType}. Are you sure you want to assign work on this off-day?`))) {
        return;
      }
    }

    try {
      const res = await api.put(`/calendar/${currentItem.id}`, editFormData);
      if (res.data.success) {
        setIsEditModalOpen(false);
        fetchCalendar();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Update failed.');
    }
  };

  // Delete Single Item
  const handleDeleteItem = async (id) => {
    if (isApproved) {
      setAlreadyApprovedModalOpen(true);
      return;
    }
    if (currentItem && currentItem.assigned_employee_id !== null) {
      alert('Work is assigned to the content writer');
      return;
    }
    if (!(await window.confirm('Delete this scheduled item?'))) return;
    try {
      const res = await api.delete(`/calendar/${id}`);
      if (res.data.success) {
        setIsEditModalOpen(false);
        fetchCalendar();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed.');
    }
  };

  // Save Skip Dates to Backend
  const handleSaveSkipDates = async (newSkipDates) => {
    if (isApproved) {
      setAlreadyApprovedModalOpen(true);
      return;
    }
    try {
      const res = await api.post('/calendar/skip-dates', { month: selectedMonth, skipDates: newSkipDates });
      if (res.data.success) {
        setSkipDates(newSkipDates);
        alert('Skipped dates updated successfully.');
        setIsSkipModalOpen(false);
        fetchCalendar();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save skipped dates.');
    }
  };

  const isSundayDate = (dateStr) => {
    if (!dateStr) return false;
    const cleanStr = dateStr.includes('T') ? dateStr.split('T')[0] : dateStr;
    const parts = cleanStr.split('-');
    if (parts.length !== 3) return false;
    const y = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10) - 1;
    const d = parseInt(parts[2], 10);
    const dt = new Date(y, m, d);
    return dt.getDay() === 0;
  };

  const isSkippedDate = (dateStr) => {
    if (!dateStr) return false;
    const cleanStr = dateStr.includes('T') ? dateStr.split('T')[0] : dateStr;
    return skipDates.includes(cleanStr);
  };

  // Open Add Modal
  const handleOpenAdd = (dateStr) => {
    if (isApproved) {
      setAlreadyApprovedModalOpen(true);
      return;
    }
    const isSun = isSundayDate(dateStr);
    const isSkip = isSkippedDate(dateStr);
    if (isSun || isSkip) {
      const msg = isSun 
        ? 'Sunday is a mandatory holiday. Are you sure you want to assign work on a Sunday?'
        : `Date ${dateStr} is marked as a skipped off-day. Are you sure you want to assign work on this date?`;
      if (!window.confirm(msg)) return;
    }
    setAddForDate(dateStr);
    setAddFormData({
      client_id: clients[0]?.value || '',
      activity_type_code: activityTypes.find(at => at.activity_type_code !== 'AT006')?.activity_type_code || '',
      title: '',
      description: ''
    });
    setFormErrors({});
    setIsAddModalOpen(true);
  };

  // Submit Add Modal
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!addFormData.title.trim()) {
      setFormErrors({ title: 'Title is required.' });
      return;
    }
    if (!addFormData.client_id) {
      setFormErrors({ client_id: 'Client assignment is required.' });
      return;
    }

    try {
      const res = await api.post('/calendar', {
        ...addFormData,
        date: addForDate,
        month: selectedMonth
      });
      if (res.data.success) {
        setIsAddModalOpen(false);
        fetchCalendar();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add item.');
    }
  };

  // Render Calendar Grid Days Calculation
  const renderCalendarCells = () => {
    const [year, month] = selectedMonth.split('-').map(Number);
    const totalDays = new Date(year, month, 0).getDate();
    const firstDayIndex = new Date(year, month - 1, 1).getDay(); // Sunday=0, Monday=1...

    const dayCells = [];

    // Add empty placeholder cells for offset
    for (let i = 0; i < firstDayIndex; i++) {
      dayCells.push(<div key={`empty-${i}`} className="calendar-day-cell empty-cell" />);
    }

    // Add days of the month
    for (let day = 1; day <= totalDays; day++) {
      const dayDateStr = `${selectedMonth}-${String(day).padStart(2, '0')}`;
      const itemsForDay = displayedItems.filter(item => getLocalDateString(item.date) === dayDateStr);
      
      const isSun = (firstDayIndex + day - 1) % 7 === 0;
      const isSkip = skipDates.includes(dayDateStr);

      let cellBg = 'var(--bg-card)';
      let cellBorder = 'none';
      if (isSun) {
        cellBg = '#fff5f5';
        cellBorder = '1px dashed #fca5a5';
      } else if (isSkip) {
        cellBg = '#fffbeb';
        cellBorder = '1px dashed #fcd34d';
      }

      dayCells.push(
        <div key={`day-${day}`} className="calendar-day-cell" style={{ backgroundColor: cellBg, border: cellBorder }}>
          <div className="day-cell-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span className="day-number" style={{ color: isSun ? '#dc2626' : isSkip ? '#b45309' : 'var(--text-main)' }}>{day}</span>
              {isSun && (
                <span style={{ fontSize: '9px', fontWeight: 700, color: '#dc2626', backgroundColor: '#fee2e2', padding: '1px 4px', borderRadius: '3px' }}>
                  Sunday
                </span>
              )}
              {!isSun && isSkip && (
                <span style={{ fontSize: '9px', fontWeight: 700, color: '#b45309', backgroundColor: '#fef3c7', padding: '1px 4px', borderRadius: '3px' }}>
                  Skipped
                </span>
              )}
            </div>
            {(user?.role === 'admin' || user?.role === 'manager') && (
              <button 
                className="btn-add-day-item" 
                onClick={() => handleOpenAdd(dayDateStr)}
                title={isSun ? 'Sunday - Mandatory Holiday' : isSkip ? 'Skipped Off-Day' : 'Add task to this day'}
              >
                <Plus size={12} />
              </button>
            )}
          </div>
          <div className="day-cell-content scrollable-y">
            {itemsForDay.map(item => {
              const getActivityPillStyle = (code) => {
                switch (code) {
                  case 'AT001': return { backgroundColor: '#e0f2fe', color: '#0369a1', borderColor: '#bae6fd' }; // Sky (Poster)
                  case 'AT002': return { backgroundColor: '#faf5ff', color: '#6b21a8', borderColor: '#f3e8ff' }; // Purple (Reel)
                  case 'AT003': return { backgroundColor: '#fef3c7', color: '#b45309', borderColor: '#fde68a' }; // Amber (Carousel)
                  case 'AT004': return { backgroundColor: '#fee2e2', color: '#991b1b', borderColor: '#fecaca' }; // Red (Shorts & Blogs)
                  case 'AT005': return { backgroundColor: '#ffedd5', color: '#c2410c', borderColor: '#fed7aa' }; // Orange (Longform)
                  case 'AT006': return { backgroundColor: '#ecfdf5', color: '#065f46', borderColor: '#a7f3d0' }; // Emerald (Event Day)
                  case 'AT008': return { backgroundColor: '#fff1f2', color: '#9f1239', borderColor: '#ffe4e6' }; // Rose (Ad Shorts)
                  default: return { backgroundColor: '#f1f5f9', color: '#334155', borderColor: '#e2e8f0' }; // Slate (Default)
                }
              };
              const pillStyle = getActivityPillStyle(item.activity_type_code);

              return (
                <div 
                  key={item.id} 
                  className="calendar-item-pill"
                  onClick={(e) => handleOpenEdit(item, e)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '3px 6px',
                    borderRadius: '3px',
                    fontSize: '11px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    border: '1px solid',
                    marginBottom: '3px',
                    ...pillStyle
                  }}
                  title={`${item.client_name} - ${item.activity_name || item.activity_type_code} (${item.activity_code || ''}): ${item.title}`}
                >
                  <span style={{ opacity: 0.8, fontWeight: 800, fontSize: '9px', minWidth: '32px' }}>{item.activity_type_code}</span>
                  <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', flex: 1 }}>{item.client_name}</span>
                  {item.activity_code && (
                    <span style={{ fontSize: '8px', opacity: 0.7, fontFamily: 'monospace', fontWeight: 800, marginLeft: 'auto' }}>
                      {item.activity_code}
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

  // Is calendar approved / sent checks are evaluated at top of component

  const renderPagination = (isTop = false) => {
    if (displayedItems.length <= 10) return null;
    
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
          Showing <strong>{((listPage - 1) * 10) + 1}</strong> to <strong>{Math.min(listPage * 10, displayedItems.length)}</strong> of <strong>{displayedItems.length}</strong> items
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
          
          {Array.from({ length: Math.ceil(displayedItems.length / 10) }, (_, i) => i + 1)
            .filter(p => p === 1 || p === Math.ceil(displayedItems.length / 10) || Math.abs(p - listPage) <= 1)
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
            disabled={listPage === Math.ceil(displayedItems.length / 10)}
            onClick={() => setListPage(p => p + 1)}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '32px', height: '32px', padding: '0 6px', border: '1px solid var(--border-color)', borderRadius: '4px', backgroundColor: '#fff', cursor: listPage === Math.ceil(displayedItems.length / 10) ? 'not-allowed' : 'pointer', opacity: listPage === Math.ceil(displayedItems.length / 10) ? 0.5 : 1 }}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
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

          {displayedItems.length > 0 && (
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: '99px', backgroundColor: 'var(--primary-light)', border: '1px solid var(--primary)', color: 'var(--primary)', fontWeight: 700, fontSize: '13px' }}>
              <span>Total Deliverables:</span>
              <strong style={{ fontSize: '15px' }}>{displayedItems.length}</strong>
            </div>
          )}
        </div>

        {/* Right Side: Toolbar buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {user?.role === 'admin' && (
            <button 
              className="btn btn-secondary" 
              onClick={() => setIsSkipModalOpen(true)}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', border: '1px solid var(--border-color)' }}
              title="Select custom dates to skip for work assignment"
            >
              <Calendar size={16} /> Skip Dates {skipDates.length > 0 ? `(${skipDates.length})` : ''}
            </button>
          )}

          {displayedItems.length > 0 && (
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

              {user?.role === 'admin' ? (
                // ADMIN ACTIONS
                <>
                  {!isApproved ? (
                    <>
                      <button className="btn btn-primary" onClick={handleSendCalendarToManager} disabled={managerSending}>
                        <Send size={16} style={{ marginRight: '6px' }} /> Send to Creative Manager
                      </button>
                      {isSentToManager ? (
                        <span className="badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 14px', fontSize: '13px', fontWeight: 700, backgroundColor: '#e0f2fe', color: '#0369a1', border: '1px solid #bae6fd' }}>
                          <CheckCircle size={14} /> Sent to Creative Manager
                        </span>
                      ) : (
                        <span className="badge badge-pending" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 14px', fontSize: '13px', fontWeight: 700, backgroundColor: '#fef3c7', color: '#d97706', border: '1px solid #fcd34d' }}>
                          Draft / Pending Approval
                        </span>
                      )}
                      <button className="btn btn-danger" onClick={handleDeleteMonth} title="Clear this month's calendar">
                        <Trash2 size={16} /> Delete Calendar
                      </button>
                    </>
                  ) : (
                    <span className="badge badge-active" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 14px', fontSize: '13px', fontWeight: 700 }}>
                      <CheckCircle size={14} /> Approved & Active
                    </span>
                  )}
                </>
              ) : user?.role === 'manager' ? (
                // MANAGER ACTIONS
                <>
                  {!isApproved ? (
                    <button className="btn btn-success" onClick={handleApproveCalendarClick}>
                      <CheckCircle size={16} style={{ marginRight: '6px' }} /> Approve Calendar
                    </button>
                  ) : (
                    <>
                      <span className="badge badge-active" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 14px', fontSize: '13px', fontWeight: 700 }}>
                        <CheckCircle size={14} /> Approved & Active
                      </span>
                      <button 
                        className="btn btn-primary" 
                        onClick={handleSendCalendarToEmployees}
                        disabled={employeesSending}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', marginLeft: '10px' }}
                      >
                        <Send size={14} /> {employeesSending ? 'Sending...' : 'Send to Employee'}
                      </button>
                    </>
                  )}
                </>
              ) : (
                // EMPLOYEE ACTIONS (READ-ONLY VIEW)
                <span className="badge badge-active" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 14px', fontSize: '13px', fontWeight: 700 }}>
                  <CheckCircle size={14} /> Active Content Calendar
                </span>
              )}
            </>
          )}
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '350px', gap: '16px', color: 'var(--text-muted)' }}>
          <div style={{ width: '40px', height: '40px', border: '3px solid #e2e8f0', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
          <p style={{ fontWeight: 600 }}>Loading calendar records...</p>
        </div>
      ) : displayedItems.length === 0 ? (
        user?.role !== 'admin' ? (
          <div className="card" style={{ padding: '80px 40px', textAlign: 'center', maxWidth: '800px', margin: '40px auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
            <Calendar size={48} className="text-muted" style={{ opacity: 0.5 }} />
            <h3 style={{ margin: 0, fontWeight: 700 }}>No Content Calendar Found</h3>
            <p className="text-muted" style={{ margin: 0, fontSize: '14px', maxWidth: '500px' }}>
              There is no content calendar generated for the month of {(() => {
                const date = parseLocalDate(selectedMonth + '-01');
                return date ? date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : '';
              })()} yet. Please wait for the admin to configure and approve the content calendar.
            </p>
          </div>
        ) : (
          /* Empty State / Import Zone */
          <div className="card" style={{ padding: '40px', textAlign: 'center', maxWidth: '800px', margin: '40px auto' }}>
            <Calendar size={48} className="text-muted" style={{ margin: '0 auto 16px auto', display: 'block' }} />
            <h3>No Content Calendar Found</h3>
            <p className="text-muted" style={{ margin: '8px auto 24px auto', maxWidth: '500px' }}>
              There is no content calendar generated for the month of {(() => {
                const date = parseLocalDate(selectedMonth + '-01');
                return date ? date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : '';
              })()}. Please import deliverables using one of the methods below.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', margin: '0 auto' }}>
              {/* Box 1: Excel File Upload */}
              <div style={{ border: '2px dashed var(--border-color)', borderRadius: 'var(--radius-md)', padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <Upload size={32} style={{ color: 'var(--secondary)', marginBottom: '12px' }} />
                <h4>Upload Excel / CSV File</h4>
                <p className="text-muted" style={{ fontSize: '12px', marginTop: '4px', marginBottom: '16px' }}>Upload a local .xlsx or .csv sheet</p>
                <label className="btn btn-secondary btn-sm" style={{ cursor: 'pointer' }}>
                  Choose File
                  <input 
                    type="file" 
                    accept=".xlsx, .xls, .csv" 
                    onChange={handleExcelUpload} 
                    style={{ display: 'none' }} 
                  />
                </label>
              </div>

              {/* Box 2: Google Sheet Import */}
              <div style={{ border: '2px dashed var(--border-color)', borderRadius: 'var(--radius-md)', padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <Link size={32} style={{ color: 'var(--primary)', marginBottom: '12px' }} />
                <h4>Import Google Sheets</h4>
                <p className="text-muted" style={{ fontSize: '12px', marginTop: '4px', marginBottom: '16px' }}>Fetch from public Google spreadsheet URL</p>
                <form onSubmit={handleGoogleSheetImport} style={{ width: '100%' }}>
                  <input 
                    type="url" 
                    placeholder="https://docs.google.com/spreadsheets/..." 
                    className="form-control" 
                    value={googleSheetUrl}
                    onChange={(e) => setGoogleSheetUrl(e.target.value)}
                    required
                    style={{ marginBottom: '12px', fontSize: '12px' }}
                  />
                  <button type="submit" className="btn btn-secondary btn-sm" disabled={importLoading} style={{ width: '100%' }}>
                    {importLoading ? 'Fetching...' : 'Fetch Sheet'}
                  </button>
                </form>
              </div>

            </div>

            <div style={{ marginTop: '24px', padding: '12px', backgroundColor: 'var(--primary-light)', color: 'var(--text-muted)', fontSize: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--primary)' }}>
              <strong>Note on Sheet Structure:</strong> The sheet must have columns in this sequence: <strong>Client Name</strong>, <strong>P (Posts)</strong>, <strong>R (Reels)</strong>, <strong>YTS (YouTube Shorts)</strong>, and <strong>YT (YouTube Long)</strong>.
            </div>
          </div>
        )
      ) : viewMode === 'grid' ? (
        
        /* Calendar Grid View */
        <div className="card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', maxHeight: 'calc(100vh - 160px)' }}>
          <div style={{ overflow: 'auto', flex: 1, borderRadius: 'var(--radius-md)' }}>
            <div className={`calendar-grid-container ${(user?.role !== 'admin' && user?.role !== 'manager') ? 'readonly-calendar' : ''}`} style={{ minWidth: '950px' }}>
              {/* Days of Week Header */}
              {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(day => (
                <div key={day} className="calendar-header-cell">{day}</div>
              ))}
              
              {/* Days Grid Cells */}
              {renderCalendarCells()}
            </div>
          </div>

          {/* Grid CSS definitions */}
          <style>{`
            .calendar-grid-container {
              display: grid;
              grid-template-columns: repeat(7, 1fr);
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
            
            /* Custom Pills color codes */
            .calendar-item-pill {
              display: flex;
              align-items: center;
              gap: 6px;
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
            .readonly-calendar .calendar-item-pill {
              cursor: default;
            }
            .readonly-calendar .calendar-item-pill:hover {
              transform: none;
              box-shadow: none;
              filter: none;
            }
            .pill-type-label {
              font-weight: 800;
              border-right: 1px solid rgba(0,0,0,0.1);
              padding-right: 4px;
            }
            .pill-client-name {
              overflow: hidden;
              text-overflow: ellipsis;
            }
            
            .badge-slate {
              background-color: #f1f5f9;
              color: #334155;
            }
            .badge-purple {
              background-color: #fae8ff;
              color: #86198f;
            }
            .badge-red {
              background-color: #fee2e2;
              color: #991b1b;
            }
            .badge-darkred {
              background-color: #fef3c7;
              color: #92400e;
            }
          `}</style>
        </div>
      ) : (
        
        /* List View */
        <div>
          {renderPagination(true)}
          <div 
            className="card" 
            style={{ 
              padding: '20px', 
              borderRadius: displayedItems.length > 10 ? '0' : 'var(--radius-md) var(--radius-md) 0 0', 
              borderBottom: 'none', 
              borderTop: displayedItems.length > 10 ? 'none' : '1px solid var(--border-color)',
              marginBottom: 0 
            }}
          >
            <div style={{ overflowX: 'auto' }}>
              <table className="enterprise-table" style={{ width: '100%', minWidth: '1000px' }}>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Client Name</th>
                    <th>Activity Code</th>
                    <th>Type Code</th>
                    <th>Activity Name</th>
                    <th>Title</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedItems
                    .slice((listPage - 1) * 10, listPage * 10)
                    .map(item => (
                      <tr key={item.id} style={{ verticalAlign: 'middle' }}>
                        <td style={{ fontWeight: 700 }}>{(() => {
                          const date = parseLocalDate(item.date);
                          return date ? date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : '';
                        })()}</td>
                        <td>{item.client_name}</td>
                        <td>
                          {item.activity_code ? (
                            <span style={{ fontFamily: 'monospace', fontWeight: 700, padding: '3px 8px', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', borderRadius: '4px', fontSize: '11px' }}>
                              {item.activity_code}
                            </span>
                          ) : (
                            <span className="text-muted" style={{ fontSize: '11px' }}>N/A</span>
                          )}
                        </td>
                        <td>
                          <span className="badge badge-active" style={{ fontSize: '11px', fontWeight: 800 }}>
                            {item.activity_type_code}
                          </span>
                        </td>
                        <td style={{ fontWeight: 600 }}>{item.activity_name || <span className="text-muted">N/A</span>}</td>
                        <td style={{ fontWeight: 500 }}>{item.title}</td>
                        <td>
                          <span 
                            className="badge"
                            style={{
                              backgroundColor: item.status === 'approved' || item.status === 'sent_to_employees'
                                ? 'rgba(16, 185, 129, 0.1)'
                                : item.status === 'sent_to_manager'
                                ? 'rgba(59, 130, 246, 0.1)'
                                : 'rgba(100, 116, 139, 0.1)',
                              color: item.status === 'approved' || item.status === 'sent_to_employees'
                                ? 'var(--success, #10b981)'
                                : item.status === 'sent_to_manager'
                                ? '#3b82f6'
                                : '#64748b',
                              border: item.status === 'approved' || item.status === 'sent_to_employees'
                                ? '1px solid rgba(16, 185, 129, 0.2)'
                                : item.status === 'sent_to_manager'
                                ? '1px solid rgba(59, 130, 246, 0.2)'
                                : '1px solid rgba(100, 116, 139, 0.2)',
                              padding: '4px 8px',
                              borderRadius: '4px',
                              fontWeight: 700,
                              fontSize: '11px',
                              textTransform: 'uppercase',
                              display: 'inline-block'
                            }}
                          >
                            {item.status === 'sent_to_manager' ? 'sent to manager' : item.status}
                          </span>
                        </td>
                        <td>
                          <button 
                            className="btn btn-secondary btn-sm" 
                            onClick={(e) => handleOpenEdit(item, e)}
                            title="Edit Scheduled Item"
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

      {/* SPREADSHEET PREVIEW & MAP MODAL */}
      <Modal
        isOpen={isImportPreviewOpen}
        onClose={() => setIsImportPreviewOpen(false)}
        title="Deliverables Import Preview"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setIsImportPreviewOpen(false)}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleGenerateCalendar}>
              Generate Draft Calendar
            </button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ padding: '12px', backgroundColor: 'var(--primary-light)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--primary)', display: 'flex', gap: '10px', alignItems: 'center' }}>
            <AlertCircle size={20} className="text-warning" style={{ flexShrink: 0 }} />
            <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              <strong>Automatic Matching:</strong> Clients not found in the ERP database will be auto-created under a default profile. Please review the deliverables count below before generating the schedule.
            </div>
          </div>

          {/* Skipped Off-Days info banner in import modal */}
          <div style={{ padding: '10px 14px', backgroundColor: '#fffbeb', borderRadius: 'var(--radius-sm)', border: '1px solid #fde68a', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: '13px', color: '#b45309' }}>
              <strong>Holiday Exclusions for {selectedMonth}:</strong>
              <div style={{ fontSize: '12px', marginTop: '2px' }}>
                Sundays: <strong>Excluded (Mandatory)</strong> | Custom Skipped Dates: <strong>{skipDates.length > 0 ? skipDates.join(', ') : 'None selected'}</strong>
              </div>
            </div>
            {user?.role === 'admin' && (
              <button 
                className="btn btn-secondary btn-sm" 
                onClick={() => setIsSkipModalOpen(true)}
                style={{ fontSize: '12px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
              >
                <Calendar size={14} /> Configure Skip Dates
              </button>
            )}
          </div>

          <div style={{ maxHeight: '350px', overflowY: 'auto', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)' }}>
            {(() => {
              const getImportHeaders = () => {
                if (importRows.length === 0) return [];
                return Object.keys(importRows[0]).filter(k => k !== 'clientName');
              };
              const headers = getImportHeaders();

              return (
                <table className="table" style={{ width: '100%', fontSize: '13px', borderCollapse: 'collapse', margin: 0 }}>
                  <thead style={{ backgroundColor: 'var(--bg-app)', position: 'sticky', top: 0 }}>
                    <tr>
                      <th style={{ padding: '10px' }}>Client Company Name</th>
                      {headers.map(h => (
                        <th key={h} style={{ padding: '10px', textAlign: 'center' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {importRows.map((row, idx) => (
                      <tr key={idx} style={{ borderTop: '1px solid var(--border-color)' }}>
                        <td style={{ padding: '10px', fontWeight: 600 }}>{row.clientName}</td>
                        {headers.map(h => (
                          <td key={h} style={{ padding: '10px', textAlign: 'center' }}>{row[h] || 0}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              );
            })()}
          </div>
        </div>
      </Modal>

      {/* SKIP DATES MODAL */}
      <Modal
        isOpen={isSkipModalOpen}
        onClose={() => setIsSkipModalOpen(false)}
        title={`Skip Dates / Off-Days (${selectedMonth})`}
        footer={
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button className="btn btn-secondary" onClick={() => setIsSkipModalOpen(false)}>
              Cancel
            </button>
            <button 
              className="btn btn-primary" 
              onClick={() => handleSaveSkipDates(skipDates)}
            >
              Save Skipped Dates
            </button>
          </div>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ padding: '12px', backgroundColor: '#fffbeb', borderRadius: 'var(--radius-sm)', border: '1px solid #fde68a', color: '#b45309', fontSize: '13px' }}>
            <strong>Mandatory Sundays & Custom Off-Days:</strong>
            <p style={{ margin: '4px 0 0 0' }}>
              Sundays are mandatory holidays and automatically excluded from work assignment. Click on any date below to select or unselect extra company off-days for <strong>{selectedMonth}</strong>.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px', padding: '12px', backgroundColor: 'var(--bg-app)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
              <div key={d} style={{ textAlign: 'center', fontWeight: 700, fontSize: '12px', color: d === 'Sun' ? '#dc2626' : 'var(--text-muted)' }}>
                {d}
              </div>
            ))}
            {(() => {
              const [year, month] = selectedMonth.split('-').map(Number);
              const totalDays = new Date(year, month, 0).getDate();
              const firstDayIndex = new Date(year, month - 1, 1).getDay();
              const cells = [];

              for (let i = 0; i < firstDayIndex; i++) {
                cells.push(<div key={`skip-empty-${i}`} />);
              }

              for (let day = 1; day <= totalDays; day++) {
                const dateStr = `${selectedMonth}-${String(day).padStart(2, '0')}`;
                const isSun = (firstDayIndex + day - 1) % 7 === 0;
                const isSelected = skipDates.includes(dateStr);

                cells.push(
                  <div
                    key={`skip-day-${day}`}
                    onClick={() => {
                      if (isSun) return; // Sunday is mandatory holiday
                      if (isSelected) {
                        setSkipDates(prev => prev.filter(d => d !== dateStr));
                      } else {
                        setSkipDates(prev => [...prev, dateStr]);
                      }
                    }}
                    style={{
                      padding: '10px 4px',
                      borderRadius: '6px',
                      textAlign: 'center',
                      cursor: isSun ? 'not-allowed' : 'pointer',
                      fontSize: '13px',
                      fontWeight: 700,
                      border: '1px solid',
                      backgroundColor: isSun
                        ? '#fee2e2'
                        : isSelected
                        ? '#fef3c7'
                        : '#ffffff',
                      borderColor: isSun
                        ? '#fca5a5'
                        : isSelected
                        ? '#fcd34d'
                        : 'var(--border-color)',
                      color: isSun
                        ? '#991b1b'
                        : isSelected
                        ? '#b45309'
                        : 'var(--text-main)',
                      transition: 'all 0.15s ease'
                    }}
                    title={isSun ? 'Sunday - Mandatory Holiday' : isSelected ? 'Skipped Off-Day' : 'Click to skip date'}
                  >
                    <div>{day}</div>
                    <div style={{ fontSize: '9px', fontWeight: 600, marginTop: '2px', opacity: 0.85 }}>
                      {isSun ? 'Sunday' : isSelected ? 'Skipped' : 'Work'}
                    </div>
                  </div>
                );
              }
              return cells;
            })()}
          </div>
        </div>
      </Modal>

      {/* EDIT MODAL */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title={`Edit Calendar Work: ${currentItem?.client_name}`}
        footer={
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            {currentItem && currentItem.assigned_employee_id === null ? (
              <button className="btn btn-danger" onClick={() => handleDeleteItem(currentItem.id)}>
                Delete Item
              </button>
            ) : <div />}
            <div style={{ display: 'flex', gap: '10px' }}>
              <button className="btn btn-secondary" onClick={() => setIsEditModalOpen(false)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleEditSubmit}>
                Save Changes
              </button>
            </div>
          </div>
        }
      >
        <form onSubmit={handleEditSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <FormInput
            label="Schedule Date"
            name="date"
            type="date"
            value={editFormData.date}
            onChange={(e) => setEditFormData(prev => ({ ...prev, date: e.target.value }))}
            required
          />

          <FormSelect
            label="Activity Type"
            name="activity_type_code"
            value={editFormData.activity_type_code}
            onChange={(e) => setEditFormData(prev => ({ ...prev, activity_type_code: e.target.value }))}
            options={activityTypes.filter(at => at.activity_type_code !== 'AT006').map(at => ({ value: at.activity_type_code, label: `${at.activity_name} (${at.activity_type_code})` }))}
            required
          />

          <FormInput
            label="Task Title / Header"
            name="title"
            value={editFormData.title}
            onChange={(e) => {
              setEditFormData(prev => ({ ...prev, title: e.target.value }));
              if (formErrors.title) setFormErrors(prev => ({ ...prev, title: '' }));
            }}
            error={formErrors.title}
            required
          />

          <FormTextArea
            label="Brief Description / Creative Goal"
            name="description"
            value={editFormData.description}
            onChange={(e) => setEditFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Outline image ideas, hashtags, or editing scripts..."
          />
        </form>
      </Modal>

      {/* ADD MODAL */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title={`Add Custom Work for: ${(() => {
          const date = parseLocalDate(addForDate);
          return date ? date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : '';
        })()}`}
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleAddSubmit}>
              Add Item
            </button>
          </>
        }
      >
        <form onSubmit={handleAddSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <FormSelect
            label="Assign Client"
            name="client_id"
            value={addFormData.client_id}
            onChange={(e) => {
              setAddFormData(prev => ({ ...prev, client_id: e.target.value }));
              if (formErrors.client_id) setFormErrors(prev => ({ ...prev, client_id: '' }));
            }}
            options={clients}
            error={formErrors.client_id}
            required
          />

          <FormSelect
            label="Activity Type"
            name="activity_type_code"
            value={addFormData.activity_type_code}
            onChange={(e) => setAddFormData(prev => ({ ...prev, activity_type_code: e.target.value }))}
            options={activityTypes.filter(at => at.activity_type_code !== 'AT006').map(at => ({ value: at.activity_type_code, label: `${at.activity_name} (${at.activity_type_code})` }))}
            required
          />

          <FormInput
            label="Task Title / Header"
            name="title"
            value={addFormData.title}
            onChange={(e) => {
              setAddFormData(prev => ({ ...prev, title: e.target.value }));
              if (formErrors.title) setFormErrors(prev => ({ ...prev, title: '' }));
            }}
            error={formErrors.title}
            required
          />

          <FormTextArea
            label="Brief Description"
            name="description"
            value={addFormData.description}
            onChange={(e) => setAddFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Details of the post..."
          />
        </form>
      </Modal>

      {/* APPROVAL MODAL */}
      <Modal
        isOpen={approveModal.isOpen}
        onClose={() => setApproveModal(prev => ({ ...prev, isOpen: false }))}
        title={approveModal.type === 'confirm' ? 'Approve Content Calendar' : 'Calendar Approved!'}
        footer={
          approveModal.type === 'confirm' ? (
            <>
              <button className="btn btn-secondary" onClick={() => setApproveModal(prev => ({ ...prev, isOpen: false }))}>
                Cancel
              </button>
              <button className="btn btn-success" onClick={handleConfirmApproval} disabled={loading}>
                {loading ? 'Approving...' : 'Approve & Send'}
              </button>
            </>
          ) : (
            <button className="btn btn-primary" onClick={() => setApproveModal(prev => ({ ...prev, isOpen: false }))}>
              Ok
            </button>
          )
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '10px 0' }}>
          {approveModal.type === 'success' ? (
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'var(--success-light)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
              <CheckCircle size={28} />
            </div>
          ) : (
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
              <HelpCircle size={28} />
            </div>
          )}
          <p style={{ fontSize: '15px', color: 'var(--text-main)', fontWeight: 600, margin: 0, lineHeight: '1.6' }}>
            {approveModal.message}
          </p>
        </div>
      </Modal>

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
              This Content Calendar for <strong>{selectedMonth}</strong> has already been approved and finalized. It cannot be edited by anyone.
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

export default ContentCalendarView;
