import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  Plus, 
  Search, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  Save, 
  Filter, 
  Clock, 
  ArrowRight,
  TrendingUp
} from 'lucide-react';
import api from '../../../utils/api';
import Table from '../../../components/Table';
import Modal from '../../../components/Modal';
import { FormInput, FormSelect } from '../../../components/FormFields';

const MultiDaySelect = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = React.useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const days = [
    { value: 'monday', label: 'Monday' },
    { value: 'tuesday', label: 'Tuesday' },
    { value: 'wednesday', label: 'Wednesday' },
    { value: 'thursday', label: 'Thursday' },
    { value: 'friday', label: 'Friday' },
    { value: 'saturday', label: 'Saturday' },
    { value: 'sunday', label: 'Sunday' },
  ];

  const currentValues = value && value !== 'any_day' ? value.split(',').map(s => s.trim().toLowerCase()) : [];

  const handleToggleDay = (dayVal) => {
    if (dayVal === 'any_day') {
      onChange('any_day');
      return;
    }

    let nextValues;
    if (currentValues.includes(dayVal)) {
      nextValues = currentValues.filter(v => v !== dayVal);
    } else {
      nextValues = [...currentValues, dayVal];
    }

    if (nextValues.length === 0) {
      onChange('any_day');
    } else {
      const order = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
      nextValues.sort((a, b) => order.indexOf(a) - order.indexOf(b));
      onChange(nextValues.join(','));
    }
  };

  let displayLabel = 'Any Day (Mon-Sat)';
  if (value && value !== 'any_day') {
    displayLabel = value
      .split(',')
      .map(v => {
        const found = days.find(d => d.value === v.trim().toLowerCase());
        return found ? found.label : v;
      })
      .join(', ');
  }

  return (
    <div ref={dropdownRef} style={{ position: 'relative', display: 'inline-block', width: '100%', maxWidth: '280px' }}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '100%',
          padding: '8px 12px',
          backgroundColor: '#fff',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-sm)',
          textAlign: 'left',
          fontSize: '13px',
          fontWeight: 500,
          color: 'var(--text-color)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: 'pointer'
        }}
      >
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginRight: '8px' }}>
          {displayLabel}
        </span>
        <span style={{ fontSize: '10px', color: 'var(--text-light)' }}>▼</span>
      </button>

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            zIndex: 999,
            backgroundColor: '#fff',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-md)',
            marginTop: '4px',
            padding: '8px',
            maxHeight: '260px',
            overflowY: 'auto'
          }}
        >
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 8px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '13px',
              userSelect: 'none',
              backgroundColor: (!value || value === 'any_day') ? 'var(--primary-light)' : 'transparent',
              color: (!value || value === 'any_day') ? 'var(--primary)' : 'var(--text-color)',
              fontWeight: (!value || value === 'any_day') ? 600 : 400
            }}
          >
            <input
              type="checkbox"
              checked={!value || value === 'any_day'}
              onChange={() => handleToggleDay('any_day')}
              style={{ cursor: 'pointer' }}
            />
            Any Day (Mon-Sat)
          </label>

          <hr style={{ margin: '6px 0', borderColor: 'var(--border-color)', borderWidth: '1px 0 0 0' }} />

          {days.map(day => {
            const isChecked = currentValues.includes(day.value);
            return (
              <label
                key={day.value}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '6px 8px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  userSelect: 'none',
                  backgroundColor: isChecked ? 'var(--primary-light)' : 'transparent',
                  color: isChecked ? 'var(--primary)' : 'var(--text-color)',
                  fontWeight: isChecked ? 600 : 400
                }}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => handleToggleDay(day.value)}
                  style={{ cursor: 'pointer' }}
                />
                {day.label}
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
};

const DeliverableList = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('monthly'); // 'monthly', 'blog', or 'job_work'
  const [loading, setLoading] = useState(false);
  const [clients, setClients] = useState([]);
  const [activityTypes, setActivityTypes] = useState([]);

  // --- MONTHLY GRID STATE ---
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
  });
  const [gridData, setGridData] = useState([]);
  const [savingGrid, setSavingGrid] = useState(false);
  const [gridMessage, setGridMessage] = useState({ type: '', text: '' });
  const [errorModal, setErrorModal] = useState({ isOpen: false, title: '', message: '' });
  
  // Content Calendar Generation Modal
  const [isGenModalOpen, setIsGenModalOpen] = useState(false);
  const [generatingCal, setGeneratingCal] = useState(false);

  // --- BLOG GRID STATE ---
  const [blogGridData, setBlogGridData] = useState([]);
  const [savingBlogGrid, setSavingBlogGrid] = useState(false);
  const [blogGridMessage, setBlogGridMessage] = useState({ type: '', text: '' });
  const [generatingBlogCal, setGeneratingBlogCal] = useState(false);
  const [isBlogGenModalOpen, setIsBlogGenModalOpen] = useState(false);

  // --- JOB WORK STATE ---
  const [jobWorks, setJobWorks] = useState([]);
  const [jobPage, setJobPage] = useState(1);
  const jobLimit = 10;
  const [jobSearch, setJobSearch] = useState('');
  const [jobStatusFilter, setJobStatusFilter] = useState('');
  const [jobForm, setJobForm] = useState({
    client_id: '',
    activity_type_code: '',
    quantity: 1,
    deadline: ''
  });
  const [jobErrors, setJobErrors] = useState({});
  const [jobSubmitError, setJobSubmitError] = useState('');
  const [jobSubmitSuccess, setJobSubmitSuccess] = useState('');
  const [assigningJob, setAssigningJob] = useState(false);

  // --- API DATA FETCHING ---
  const fetchClients = useCallback(async () => {
    try {
      const res = await api.get('/clients/dropdown');
      if (res.data.success) {
        setClients(res.data.data.clients || []);
      }
    } catch (err) {
      console.error('Error fetching clients dropdown:', err.message);
    }
  }, []);

  const fetchActivityTypes = useCallback(async () => {
    try {
      const res = await api.get('/activity-types');
      if (res.data.success) {
        setActivityTypes(res.data.data || []);
      }
    } catch (err) {
      console.error('Error fetching activity types:', err.message);
    }
  }, []);

  const fetchGridData = useCallback(async () => {
    setLoading(true);
    setGridMessage({ type: '', text: '' });
    try {
      const res = await api.get('/deliverables/grid', {
        params: { month: selectedMonth }
      });
      if (res.data.success) {
        setGridData(res.data.data || []);
      }
    } catch (err) {
      setGridMessage({ type: 'danger', text: err.response?.data?.message || 'Failed to load monthly grid.' });
    } finally {
      setLoading(false);
    }
  }, [selectedMonth]);

  const fetchBlogGridData = useCallback(async () => {
    setLoading(true);
    setBlogGridMessage({ type: '', text: '' });
    try {
      const res = await api.get('/deliverables/blog-grid', {
        params: { month: selectedMonth }
      });
      if (res.data.success) {
        setBlogGridData(res.data.data || []);
      }
    } catch (err) {
      setBlogGridMessage({ type: 'danger', text: err.response?.data?.message || 'Failed to load blog grid.' });
    } finally {
      setLoading(false);
    }
  }, [selectedMonth]);

  const fetchJobWorks = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/deliverables/job-work');
      if (res.data.success) {
        setJobWorks(res.data.data || []);
      }
    } catch (err) {
      console.error('Error fetching Job Works:', err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClients();
    fetchActivityTypes();
  }, [fetchClients, fetchActivityTypes]);

  useEffect(() => {
    if (activeTab === 'monthly') {
      fetchGridData();
    } else if (activeTab === 'blog') {
      fetchBlogGridData();
    } else {
      fetchJobWorks();
    }
  }, [activeTab, fetchGridData, fetchBlogGridData, fetchJobWorks]);

  // --- BLOG GRID HANDLERS ---
  const handleBlogGridInputChange = (clientId, field, value) => {
    setBlogGridData(prev => 
      prev.map(row => 
        row.client_id === clientId ? { ...row, [field]: value } : row
      )
    );
  };

  const handleSaveBlogGrid = async () => {
    setSavingBlogGrid(true);
    setBlogGridMessage({ type: '', text: '' });
    try {
      const res = await api.post('/deliverables/blog-grid', {
        month: selectedMonth,
        gridData: blogGridData
      });
      if (res.data.success) {
        setBlogGridMessage({ type: 'success', text: 'Monthly blogs grid counts saved successfully!' });
        fetchBlogGridData();
      }
    } catch (err) {
      setBlogGridMessage({ type: 'danger', text: err.response?.data?.message || 'Failed to save blog grid.' });
    } finally {
      setSavingBlogGrid(false);
    }
  };

  const handleGenerateBlogCalendar = async () => {
    const allZero = blogGridData.every(row => 
      (row.blogs_count || 0) === 0 && 
      (row.gmb_count || 0) === 0 && 
      (row.backlink_count || 0) === 0
    );
    if (allZero) {
      setBlogGridMessage({ type: 'danger', text: 'All SEO deliverable counts are zero. Please enter counts before generating the calendar.' });
      return;
    }

    setGeneratingBlogCal(true);
    setBlogGridMessage({ type: '', text: '' });
    try {
      // 1. Save counts first
      await api.post('/deliverables/blog-grid', {
        month: selectedMonth,
        gridData: blogGridData
      });
      // 2. Generate calendar
      const res = await api.post('/deliverables/blog-grid/generate-calendar', {
        month: selectedMonth
      });
      if (res.data.success) {
        setIsBlogGenModalOpen(true);
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to generate blog calendar.';
      if (errMsg.includes('approved') || errMsg.includes('done')) {
        setErrorModal({ isOpen: true, title: 'Calendar Regeneration Blocker', message: errMsg });
      } else {
        setBlogGridMessage({ type: 'danger', text: errMsg });
      }
    } finally {
      setGeneratingBlogCal(false);
    }
  };

  // --- MONTHLY GRID HANDLERS ---
  const handleGridInputChange = (clientId, field, value) => {
    setGridData(prev => 
      prev.map(row => 
        row.client_id === clientId ? { ...row, [field]: value } : row
      )
    );
  };

  const handleSaveGrid = async () => {
    setSavingGrid(true);
    setGridMessage({ type: '', text: '' });
    try {
      const res = await api.post('/deliverables/grid', {
        month: selectedMonth,
        gridData
      });
      if (res.data.success) {
        setGridMessage({ type: 'success', text: 'Monthly deliverables counts saved successfully!' });
        fetchGridData();
      }
    } catch (err) {
      setGridMessage({ type: 'danger', text: err.response?.data?.message || 'Failed to save monthly grid.' });
    } finally {
      setSavingGrid(false);
    }
  };

  const handleGenerateCalendar = async () => {
    const allZero = gridData.every(row => 
      (row.posters || 0) === 0 && 
      (row.reels || 0) === 0 && 
      (row.yts || 0) === 0 && 
      (row.yt || 0) === 0
    );
    if (allZero) {
      setGridMessage({ type: 'danger', text: 'All deliverable counts are zero. Please enter counts before generating the calendar.' });
      return;
    }

    setGeneratingCal(true);
    setGridMessage({ type: '', text: '' });
    try {
      // 1. First save grid data to ensure counts are stored
      await api.post('/deliverables/grid', {
        month: selectedMonth,
        gridData
      });
      
      // 2. Generate content calendar
      const res = await api.post('/deliverables/grid/generate-calendar', {
        month: selectedMonth
      });
      
      if (res.data.success) {
        setIsGenModalOpen(true);
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to generate calendar.';
      if (errMsg.includes('approved') || errMsg.includes('done')) {
        setErrorModal({ isOpen: true, title: 'Calendar Regeneration Blocker', message: errMsg });
      } else {
        setGridMessage({ type: 'danger', text: errMsg });
      }
    } finally {
      setGeneratingCal(false);
    }
  };

  // --- JOB WORK HANDLERS ---
  const validateJobForm = () => {
    const errors = {};
    if (!jobForm.client_id) errors.client_id = 'Client is required.';
    if (!jobForm.activity_type_code) errors.activity_type_code = 'Activity type is required.';
    if (!jobForm.quantity || parseInt(jobForm.quantity) < 1) errors.quantity = 'Quantity must be at least 1.';
    if (!jobForm.deadline) errors.deadline = 'Deadline date and time is required.';
    setJobErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleJobSubmit = async (e) => {
    e.preventDefault();
    if (!validateJobForm()) return;
    setJobSubmitError('');
    setJobSubmitSuccess('');
    setAssigningJob(true);

    try {
      const res = await api.post('/deliverables/job-work', jobForm);
      if (res.data.success) {
        setJobSubmitSuccess('Job Work successfully assigned to Creative Department Manager!');
        setJobForm({
          client_id: '',
          activity_type_code: '',
          quantity: 1,
          deadline: ''
        });
        fetchJobWorks();
      }
    } catch (err) {
      setJobSubmitError(err.response?.data?.message || 'Failed to assign Job Work.');
    } finally {
      setAssigningJob(false);
    }
  };

  // Filter job works
  const filteredJobWorks = jobWorks.filter(jw => {
    const searchLower = jobSearch.toLowerCase();
    const clientMatch = jw.client_name?.toLowerCase().includes(searchLower) || jw.activity_type_code?.toLowerCase().includes(searchLower);
    const statusMatch = !jobStatusFilter || jw.status === jobStatusFilter;
    return clientMatch && statusMatch;
  });

  const jobColumns = [
    { 
      key: 'id', 
      label: 'ID', 
      width: '80px', 
      render: (id) => <span style={{ fontWeight: 600 }}>#{id}</span> 
    },
    { 
      key: 'client_name', 
      label: 'Client', 
      render: (client_name) => <span style={{ fontWeight: 700, color: 'var(--primary)' }}>{client_name}</span> 
    },
    { 
      key: 'activity_type_code', 
      label: 'Activity Code', 
      render: (code, row) => (
        <span style={{ fontFamily: 'monospace', fontWeight: 700, padding: '3px 8px', backgroundColor: 'var(--bg-light)', border: '1px solid var(--border-color)', borderRadius: '4px' }} title={code}>
          {row.activity_code || code}
        </span>
      ) 
    },
    { 
      key: 'quantity', 
      label: 'Count', 
      render: (qty) => <span style={{ fontWeight: 700 }}>{qty}</span> 
    },
    { 
      key: 'deadline', 
      label: 'Deadline', 
      render: (deadline) => (
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)' }}>
          <Clock size={13} />
          {new Date(deadline).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
        </div>
      ) 
    }
  ];

  const totalPages = Math.ceil(filteredJobWorks.length / jobLimit);
  const paginatedJobWorks = filteredJobWorks.slice((jobPage - 1) * jobLimit, jobPage * jobLimit);

  return (
    <div style={{ padding: '30px', maxWidth: '1400px', margin: '0 auto' }}>
      
      {/* Title Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 800, color: 'var(--text-color)' }}>
            Deliverables Workspace
          </h1>
          <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: 'var(--text-muted)' }}>
            Manage client deliverables counts, generate content calendars, and assign job work.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '12px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', marginBottom: '24px' }}>
        <button
          className={`btn ${activeTab === 'monthly' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('monthly')}
          style={{ borderRadius: '99px', padding: '8px 24px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
        >
          <Calendar size={18} />
          Monthly Deliverables Grid
        </button>
        {/* <button
          className={`btn ${activeTab === 'blog' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('blog')}
          style={{ borderRadius: '99px', padding: '8px 24px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
        >
          <Calendar size={18} />
          SEO Deliverables
        </button> */}
        <button
          className={`btn ${activeTab === 'job_work' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('job_work')}
          style={{ borderRadius: '99px', padding: '8px 24px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
        >
          <FileText size={18} />
          Job Work Assignments
        </button>
      </div>

      {/* --- MONTHLY DELIVERABLES TAB --- */}
      {activeTab === 'monthly' && (
        <div>
          {/* Toolbar */}
          <div className="table-toolbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', padding: '16px 20px', backgroundColor: '#fff', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md) var(--radius-md) 0 0', borderBottom: 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-color)', fontWeight: 700 }}>
                <Filter size={16} />
                <span>Selected Month & Year:</span>
              </div>
              <input
                type="month"
                className="form-control"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                style={{ width: '180px', padding: '8px 12px', borderRadius: 'var(--radius-sm)' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button 
                className="btn btn-secondary" 
                onClick={handleSaveGrid} 
                disabled={savingGrid || loading}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
              >
                <Save size={16} />
                {savingGrid ? 'Saving Counts...' : 'Save Deliverables Grid'}
              </button>
              <button 
                className="btn btn-primary" 
                onClick={handleGenerateCalendar}
                disabled={generatingCal || loading || gridData.length === 0}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  border: 'none',
                  boxShadow: '0 4px 10px rgba(16, 185, 129, 0.2)'
                }}
              >
                <TrendingUp size={16} />
                {generatingCal ? 'Generating...' : 'Create Content Calendar'}
              </button>
            </div>
          </div>

          {/* Feedback Messages */}
          {gridMessage.text && (
            <div style={{
              padding: '12px 20px',
              backgroundColor: gridMessage.type === 'success' ? 'var(--success-light)' : 'var(--danger-light)',
              color: gridMessage.type === 'success' ? 'var(--success)' : 'var(--danger)',
              fontSize: '13px',
              fontWeight: 600,
              borderLeft: `4px solid ${gridMessage.type === 'success' ? 'var(--success)' : 'var(--danger)'}`
            }}>
              {gridMessage.text}
            </div>
          )}

          {/* Grid Table */}
          <div style={{ backgroundColor: '#fff', border: '1px solid var(--border-color)', borderRadius: '0 0 var(--radius-md) var(--radius-md)', overflowX: 'auto' }}>
            {loading ? (
              <div style={{ padding: '80px', textAlign: 'center', color: 'var(--text-muted)' }}>
                <div className="spinner" style={{ margin: '0 auto 12px auto' }}></div>
                <span>Loading clients grid counts...</span>
              </div>
            ) : gridData.length === 0 ? (
              <div style={{ padding: '80px 40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                <AlertCircle size={36} style={{ margin: '0 auto 12px auto', opacity: 0.5 }} />
                <h4 style={{ margin: 0, fontWeight: 700 }}>No Clients Found</h4>
                <p style={{ margin: '4px 0 0 0', fontSize: '13px' }}>
                  Please register active clients first.
                </p>
              </div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border-color)', backgroundColor: 'var(--bg-light)', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '16px 20px', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase' }}>Client Name</th>
                    <th style={{ padding: '16px 20px', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', textAlign: 'center' }}>Posters (P)</th>
                    <th style={{ padding: '16px 20px', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', textAlign: 'center' }}>Reels (R)</th>
                    <th style={{ padding: '16px 20px', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', textAlign: 'center' }}>YouTube Shorts (YTS)</th>
                    <th style={{ padding: '16px 20px', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', textAlign: 'center' }}>YouTube Long (YT)</th>
                    <th style={{ padding: '16px 20px', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase' }}>Posting Days</th>
                  </tr>
                </thead>
                <tbody>
                  {gridData.map(row => (
                    <tr key={row.client_id} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background-color 0.2s' }}>
                      <td style={{ padding: '16px 20px', fontSize: '14px', fontWeight: 700, color: 'var(--text-color)' }}>
                        {row.client_name}
                      </td>
                      <td style={{ padding: '12px 20px', textAlign: 'center' }}>
                        <input
                          type="number"
                          min="0"
                          className="form-control"
                          value={row.posters}
                          onChange={(e) => handleGridInputChange(row.client_id, 'posters', parseInt(e.target.value) || 0)}
                          style={{ width: '70px', textAlign: 'center', display: 'inline-block', padding: '6px 8px' }}
                        />
                      </td>
                      <td style={{ padding: '12px 20px', textAlign: 'center' }}>
                        <input
                          type="number"
                          min="0"
                          className="form-control"
                          value={row.reels}
                          onChange={(e) => handleGridInputChange(row.client_id, 'reels', parseInt(e.target.value) || 0)}
                          style={{ width: '70px', textAlign: 'center', display: 'inline-block', padding: '6px 8px' }}
                        />
                      </td>
                      <td style={{ padding: '12px 20px', textAlign: 'center' }}>
                        <input
                          type="number"
                          min="0"
                          className="form-control"
                          value={row.yts}
                          onChange={(e) => handleGridInputChange(row.client_id, 'yts', parseInt(e.target.value) || 0)}
                          style={{ width: '70px', textAlign: 'center', display: 'inline-block', padding: '6px 8px' }}
                        />
                      </td>
                      <td style={{ padding: '12px 20px', textAlign: 'center' }}>
                        <input
                          type="number"
                          min="0"
                          className="form-control"
                          value={row.yt}
                          onChange={(e) => handleGridInputChange(row.client_id, 'yt', parseInt(e.target.value) || 0)}
                          style={{ width: '70px', textAlign: 'center', display: 'inline-block', padding: '6px 8px' }}
                        />
                      </td>
                      <td style={{ padding: '12px 20px' }}>
                        <MultiDaySelect
                          value={row.posted_day || 'any_day'}
                          onChange={(val) => handleGridInputChange(row.client_id, 'posted_day', val)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* --- JOB WORK TAB --- */}
      {activeTab === 'job_work' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '30px' }}>
          
          {/* Assignment Form */}
          <div style={{ backgroundColor: '#fff', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '24px', alignSelf: 'start' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: 800, color: 'var(--text-color)' }}>
              Assign Job Work
            </h3>
            
            {jobSubmitError && (
              <div style={{ padding: '10px 14px', backgroundColor: 'var(--danger-light)', color: 'var(--danger)', borderRadius: '4px', fontSize: '13px', fontWeight: 600, marginBottom: '16px' }}>
                {jobSubmitError}
              </div>
            )}
            {jobSubmitSuccess && (
              <div style={{ padding: '10px 14px', backgroundColor: 'var(--success-light)', color: 'var(--success)', borderRadius: '4px', fontSize: '13px', fontWeight: 600, marginBottom: '16px' }}>
                {jobSubmitSuccess}
              </div>
            )}

            <form onSubmit={handleJobSubmit}>
              <FormSelect
                label="Select Client"
                value={jobForm.client_id}
                onChange={(e) => setJobForm(prev => ({ ...prev, client_id: e.target.value }))}
                error={jobErrors.client_id}
                options={[
                  { value: '', label: 'Select Client' },
                  ...clients.map(c => ({ value: c.id, label: c.company_name }))
                ]}
                required
              />

              <FormSelect
                label="Activity Type"
                value={jobForm.activity_type_code}
                onChange={(e) => setJobForm(prev => ({ ...prev, activity_type_code: e.target.value }))}
                error={jobErrors.activity_type_code}
                options={[
                  { value: '', label: 'Select Activity' },
                  ...activityTypes.map(at => ({ value: at.activity_type_code, label: `${at.activity_name} (${at.activity_type_code})` }))
                ]}
                required
              />

              <FormInput
                label="Deliverables Count (Quantity)"
                type="number"
                min="1"
                value={jobForm.quantity}
                onChange={(e) => setJobForm(prev => ({ ...prev, quantity: parseInt(e.target.value) || 1 }))}
                error={jobErrors.quantity}
                required
              />

              <FormInput
                label="Deadline Date & Time"
                type="datetime-local"
                value={jobForm.deadline}
                onChange={(e) => setJobForm(prev => ({ ...prev, deadline: e.target.value }))}
                error={jobErrors.deadline}
                required
              />

              <button 
                type="submit" 
                className="btn btn-primary" 
                disabled={assigningJob} 
                style={{ width: '100%', marginTop: '12px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                <Plus size={16} />
                {assigningJob ? 'Assigning...' : 'Assign Job Work'}
              </button>
            </form>
          </div>

          {/* Job Work List */}
          <div>
            {/* Filters */}
            <div className="table-toolbar" style={{ display: 'flex', gap: '16px', padding: '16px 20px', backgroundColor: '#fff', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md) var(--radius-md) 0 0', borderBottom: 'none', alignItems: 'center' }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <Search style={{ position: 'absolute', left: '12px', top: '10px', color: 'var(--text-muted)' }} size={16} />
                <input
                  type="text"
                  placeholder="Search by client or activity code..."
                  className="form-control"
                  value={jobSearch}
                  onChange={(e) => setJobSearch(e.target.value)}
                  style={{ paddingLeft: '36px' }}
                />
              </div>

              <select
                className="form-control"
                value={jobStatusFilter}
                onChange={(e) => setJobStatusFilter(e.target.value)}
                style={{ width: '160px' }}
              >
                <option value="">All Statuses</option>
                <option value="assigned">Assigned</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            {/* Table */}
            <div style={{ backgroundColor: '#fff', border: '1px solid var(--border-color)', borderRadius: '0 0 var(--radius-md) var(--radius-md)', overflowX: 'auto' }}>
              {loading && jobWorks.length === 0 ? (
                <div style={{ padding: '80px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  <div className="spinner" style={{ margin: '0 auto 12px auto' }}></div>
                  <span>Loading Job Works ledger...</span>
                </div>
              ) : filteredJobWorks.length === 0 ? (
                <div style={{ padding: '80px 40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  <AlertCircle size={36} style={{ margin: '0 auto 12px auto', opacity: 0.5 }} />
                  <h4 style={{ margin: 0, fontWeight: 700 }}>No Job Works Found</h4>
                  <p style={{ margin: '4px 0 0 0', fontSize: '13px' }}>
                    No job works match the filter requirements.
                  </p>
                </div>
              ) : (
                <Table
                  columns={jobColumns}
                  data={paginatedJobWorks}
                  pagination={{
                    page: jobPage,
                    limit: jobLimit,
                    total: filteredJobWorks.length,
                    totalPages: totalPages,
                    onPageChange: (p) => setJobPage(p)
                  }}
                  emptyMessage="No job works match the filter requirements."
                />
              )}
            </div>
          </div>

        </div>
      )}

      {/* --- SEO DELIVERABLES TAB --- */}
      {false && activeTab === 'blog' && (
        <div>
          {/* Toolbar */}
          <div className="table-toolbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', padding: '16px 20px', backgroundColor: '#fff', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md) var(--radius-md) 0 0', borderBottom: 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-color)', fontWeight: 700 }}>
                <Filter size={16} />
                <span>Selected Month & Year:</span>
              </div>
              <input
                type="month"
                className="form-control"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                style={{ width: '180px', padding: '8px 12px', borderRadius: 'var(--radius-sm)' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button 
                className="btn btn-secondary" 
                onClick={handleSaveBlogGrid} 
                disabled={savingBlogGrid || loading}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
              >
                <Save size={16} />
                {savingBlogGrid ? 'Saving Targets...' : 'Save SEO Grid'}
              </button>
              <button 
                className="btn btn-primary" 
                onClick={handleGenerateBlogCalendar}
                disabled={generatingBlogCal || loading || blogGridData.length === 0}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  border: 'none',
                  boxShadow: '0 4px 10px rgba(16, 185, 129, 0.2)'
                }}
              >
                <TrendingUp size={16} />
                {generatingBlogCal ? 'Generating...' : 'Create SEO Calendar'}
              </button>
            </div>
          </div>

          {/* Feedback Messages */}
          {blogGridMessage.text && (
            <div style={{
              padding: '12px 20px',
              backgroundColor: blogGridMessage.type === 'success' ? 'var(--success-light)' : 'var(--danger-light)',
              color: blogGridMessage.type === 'success' ? 'var(--success)' : 'var(--danger)',
              fontSize: '13px',
              fontWeight: 600,
              borderLeft: `4px solid ${blogGridMessage.type === 'success' ? 'var(--success)' : 'var(--danger)'}`
            }}>
              {blogGridMessage.text}
            </div>
          )}

          {/* Grid Table */}
          <div style={{ backgroundColor: '#fff', border: '1px solid var(--border-color)', borderRadius: '0 0 var(--radius-md) var(--radius-md)', overflowX: 'auto' }}>
            {loading ? (
              <div style={{ padding: '80px', textAlign: 'center', color: 'var(--text-muted)' }}>
                <div className="spinner" style={{ margin: '0 auto 12px auto' }}></div>
                <span>Loading SEO grid counts...</span>
              </div>
            ) : blogGridData.length === 0 ? (
              <div style={{ padding: '80px 40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                <AlertCircle size={36} style={{ margin: '0 auto 12px auto', opacity: 0.5 }} />
                <h4 style={{ margin: 0, fontWeight: 700 }}>No Clients Found</h4>
                <p style={{ margin: '4px 0 0 0', fontSize: '13px' }}>
                  Please register active clients first.
                </p>
              </div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border-color)', backgroundColor: 'var(--bg-light)', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '16px 20px', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase' }}>Client Name</th>
                    <th style={{ padding: '16px 20px', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', textAlign: 'center' }}>No. of Blogs</th>
                    <th style={{ padding: '16px 20px', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', textAlign: 'center' }}>No. of GMB Posts</th>
                    <th style={{ padding: '16px 20px', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', textAlign: 'center' }}>No. of Backlinks</th>
                    <th style={{ padding: '16px 20px', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase' }}>Posting Days</th>
                  </tr>
                </thead>
                <tbody>
                  {blogGridData.map(row => (
                    <tr key={row.client_id} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background-color 0.2s' }}>
                      <td style={{ padding: '16px 20px', fontSize: '14px', fontWeight: 700, color: 'var(--text-color)' }}>
                        {row.client_name}
                      </td>
                      <td style={{ padding: '12px 20px', textAlign: 'center' }}>
                        <input
                          type="number"
                          min="0"
                          className="form-control"
                          value={row.blogs_count}
                          onChange={(e) => handleBlogGridInputChange(row.client_id, 'blogs_count', parseInt(e.target.value) || 0)}
                          style={{ width: '100px', textAlign: 'center', display: 'inline-block', padding: '6px 8px' }}
                        />
                      </td>
                      <td style={{ padding: '12px 20px', textAlign: 'center' }}>
                        <input
                          type="number"
                          min="0"
                          className="form-control"
                          value={row.gmb_count || 0}
                          onChange={(e) => handleBlogGridInputChange(row.client_id, 'gmb_count', parseInt(e.target.value) || 0)}
                          style={{ width: '100px', textAlign: 'center', display: 'inline-block', padding: '6px 8px' }}
                        />
                      </td>
                      <td style={{ padding: '12px 20px', textAlign: 'center' }}>
                        <input
                          type="number"
                          min="0"
                          className="form-control"
                          value={row.backlink_count || 0}
                          onChange={(e) => handleBlogGridInputChange(row.client_id, 'backlink_count', parseInt(e.target.value) || 0)}
                          style={{ width: '100px', textAlign: 'center', display: 'inline-block', padding: '6px 8px' }}
                        />
                      </td>
                      <td style={{ padding: '12px 20px' }}>
                        <MultiDaySelect
                          value={row.posted_day || 'any_day'}
                          onChange={(val) => handleBlogGridInputChange(row.client_id, 'posted_day', val)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* --- CONFIRMATION DIALOG MODAL --- */}
      <Modal
        isOpen={isGenModalOpen}
        onClose={() => setIsGenModalOpen(false)}
        title="Calendar Generation Ready"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setIsGenModalOpen(false)}>
              Close
            </button>
            <button 
              className="btn btn-primary" 
              onClick={() => {
                setIsGenModalOpen(false);
                navigate(`/admin/projects?month=${selectedMonth}`);
              }}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
            >
              View Calendar
              <ArrowRight size={16} />
            </button>
          </>
        }
      >
        <div style={{ textAlign: 'center', padding: '10px 0' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '56px', height: '56px', borderRadius: '50%', backgroundColor: 'var(--success-light)', color: 'var(--success)', marginBottom: '16px' }}>
            <CheckCircle size={32} />
          </div>
          <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: 800, color: 'var(--text-color)' }}>
            Content Calendar Ready!
          </h3>
          <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.5' }}>
            The content calendar draft items for month <strong>{selectedMonth}</strong> have been generated successfully based on client grid counts.
          </p>
        </div>
      </Modal>

      {/* --- ERROR ALERT MODAL --- */}
      <Modal
        isOpen={errorModal.isOpen}
        onClose={() => setErrorModal(prev => ({ ...prev, isOpen: false }))}
        title={errorModal.title}
        footer={
          <button 
            className="btn btn-danger" 
            onClick={() => setErrorModal(prev => ({ ...prev, isOpen: false }))}
            style={{ width: '100%', fontWeight: 700 }}
          >
            Close
          </button>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', padding: '10px 0', textAlign: 'center' }}>
          <div style={{ 
            width: '56px', 
            height: '56px', 
            borderRadius: '50%', 
            backgroundColor: '#fee2e2', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            color: '#ef4444'
          }}>
            <AlertCircle size={32} />
          </div>
          <p style={{ fontWeight: 700, fontSize: '15px', color: '#ef4444', margin: 0, textTransform: 'capitalize', lineHeight: '1.5' }}>
            {errorModal.message}
          </p>
        </div>
      </Modal>

    </div>
  );
};

export default DeliverableList;
