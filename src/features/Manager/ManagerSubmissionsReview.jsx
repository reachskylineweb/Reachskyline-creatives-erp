import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  FileText, ExternalLink, AlertCircle, CheckCircle, 
  Send, RefreshCw, Mic, Square, Trash2, Play, Volume2, 
  HelpCircle, Plus, Calendar, User, Eye, EyeOff, ClipboardList,
  ChevronLeft, ChevronRight
} from 'lucide-react';
import api from '../../utils/api';
import Modal from '../../components/Modal';

const ensureExternalLink = (url) => {
  if (!url) return '';
  const trimmed = url.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }
  return `https://${trimmed}`;
};

const getLocalDateString = (dateVal) => {
  if (!dateVal) return '';
  if (typeof dateVal === 'string') {
    return dateVal.split(/[T ]/)[0];
  }
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

const getStatusColors = (status) => {
  const s = (status || '').toLowerCase().replace(' ', '_');
  switch (s) {
    case 'pending':
      return { bg: '#f1f5f9', text: '#475569', border: '#cbd5e1' };
    case 'assigned':
    case 'assigned_employee':
      return { bg: '#eff6ff', text: '#2563eb', border: '#bfdbfe' };
    case 'submitted':
      return { bg: '#fef3c7', text: '#d97706', border: '#fde68a' };
    case 'reassigned':
    case 'rework':
      return { bg: '#fff1f2', text: '#e11d48', border: '#fecdd3' };
    case 'approved':
    case 'completed':
      return { bg: '#ecfdf5', text: '#059669', border: '#a7f3d0' };
    case 'sent_to_client':
      return { bg: '#f5f3ff', text: '#7c3aed', border: '#ddd6fe' };
    case 'client_approved':
      return { bg: '#f0fdf4', text: '#16a34a', border: '#bbf7d0' };
    case 'client_rejected':
    case 'client_rework':
      return { bg: '#fff1f2', text: '#e11d48', border: '#fecdd3' };
    default:
      return { bg: '#f8fafc', text: '#64748b', border: '#e2e8f0' };
  }
};

const SUB_DEPARTMENTS = [
  { id: 2, name: 'Graphic Design' },
  { id: 3, name: 'Video editor' },
  { id: 1, name: 'Content Writer' },
  { id: 4, name: 'Creatives Designer' }
];

const ManagerSubmissionsReview = () => {
  const { user } = useAuth();
  const managerProfile = user?.managerProfile || {};

  const [activeSubDeptId, setActiveSubDeptId] = useState(2);
  const [submissions, setSubmissions] = useState([]);
  const [contentSubmissions, setContentSubmissions] = useState([]);
  const [contentSubTab, setContentSubTab] = useState('content_calendar'); // 'content_calendar' | 'event_days' | 'shoot_scripts'
  const [statusFilter, setStatusFilter] = useState('all'); // Default to All Statuses
  
  const [loading, setLoading] = useState(true);
  const [reviewingItem, setReviewingItem] = useState(null);
  const [feedbackText, setFeedbackText] = useState('');

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
  
  // Shoot script manager states
  const [showShootScriptsList, setShowShootScriptsList] = useState(false);
  const [shootScriptsList, setShootScriptsList] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
  });

  const [activeSubTab, setActiveSubTab] = useState('today_work'); // 'today_work' | 'pending_approval' | 'approved'
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  });

  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  // Reset page when any filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeSubDeptId, activeSubTab, contentSubTab, selectedMonth, selectedDate]);

  const handlePrevDate = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() - 1);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    setSelectedDate(`${yyyy}-${mm}-${dd}`);
  };

  const handleNextDate = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + 1);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    setSelectedDate(`${yyyy}-${mm}-${dd}`);
  };

  const renderTopPagination = (totalPagesVal) => {
    if (totalPagesVal <= 1) return null;
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'flex-end', 
        alignItems: 'center', 
        gap: '12px',
        marginBottom: '14px'
      }}>
        <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)' }}>
          Page {currentPage} of {totalPagesVal}
        </span>
        <div style={{ display: 'flex', gap: '4px' }}>
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            className="btn btn-secondary btn-sm"
            style={{ padding: '4px 8px' }}
          >
            <ChevronLeft size={14} />
          </button>
          <button
            disabled={currentPage === totalPagesVal}
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPagesVal))}
            className="btn btn-secondary btn-sm"
            style={{ padding: '4px 8px' }}
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    );
  };

  const renderBottomPagination = (totalPagesVal) => {
    if (totalPagesVal <= 1) return null;
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginTop: '16px',
        padding: '12px 16px',
        backgroundColor: '#f8fafc',
        border: '1px solid #e2e8f0',
        borderRadius: 'var(--radius-sm)'
      }}>
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          className="btn btn-secondary btn-sm"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontWeight: 700 }}
        >
          <ChevronLeft size={14} /> Previous Page
        </button>
        <span style={{ fontSize: '13px', fontWeight: 700, color: '#64748b' }}>
          Showing Page {currentPage} of {totalPagesVal}
        </span>
        <button
          disabled={currentPage === totalPagesVal}
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPagesVal))}
          className="btn btn-secondary btn-sm"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontWeight: 700 }}
        >
          Next Page <ChevronRight size={14} />
        </button>
      </div>
    );
  };
  
  // Shoot script assign modal state
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [clients, setClients] = useState([]);
  const [contentWriters, setContentWriters] = useState([]);
  const [assignForm, setAssignForm] = useState({
    client_id: '',
    assigned_employee_id: '',
    month: '',
    title: '',
    description: ''
  });
  const [assignLoading, setAssignLoading] = useState(false);

  // Central Centralized review modal variables
  const [reviewingContentItem, setReviewingContentItem] = useState(null); // { itemType, itemId, title }

  // CENTRAL VOICE NOTES RECORDER
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [recordingStatus, setRecordingStatus] = useState('idle'); // idle | recording
  const [audioChunks, setAudioChunks] = useState([]);
  const [audioUrl, setAudioUrl] = useState(null);
  const [audioBase64, setAudioBase64] = useState(null);
  const [recordDuration, setRecordDuration] = useState(0);
  const timerRef = useRef(null);

  const fetchGeneralSubmissions = useCallback(async () => {
    if (!managerProfile.department_id) return;
    try {
      const targetMonth = activeSubTab === 'today_work' ? selectedDate.substring(0, 7) : selectedMonth;
      const [delivsRes, jobsRes] = await Promise.all([
        api.get('/deliverables', {
          params: {
            departmentFilter: managerProfile.department_id,
            monthFilter: targetMonth,
            limit: 1000,
            page: 1
          }
        }),
        api.get('/deliverables/job-work/manager')
      ]);

      let combined = [];

      if (delivsRes.data.success) {
        const list = delivsRes.data.data.deliverables || [];
        const filteredDelivs = list.map(d => ({
          ...d,
          isJobWork: d.is_job_work === 1 || d.is_job_work === true
        }));
        combined = [...combined, ...filteredDelivs];
      }

      if (jobsRes.data.success) {
        const list = jobsRes.data.data || [];
        const filteredJobs = list
          .filter(j => !combined.some(existing => existing.isJobWork && existing.id === j.id))
          .map(j => ({
            ...j,
            isJobWork: true,
            due_date: j.created_at || null,
            deliverable: `Job Work #${j.id}: ${j.activity_type_code} (Qty: ${j.quantity})`
          }));
        combined = [...combined, ...filteredJobs];
      }

      setSubmissions(combined);
    } catch (err) {
      console.error('Error fetching general submissions:', err.message);
    }
  }, [managerProfile.department_id, selectedMonth, selectedDate, activeSubTab]);

  const fetchContentSubmissions = useCallback(async () => {
    try {
      const res = await api.get('/content-work/submissions');
      if (res.data.success) {
        setContentSubmissions(res.data.data || []);
      }
    } catch (err) {
      console.error('Error fetching content submissions:', err.message);
    }
  }, []);

  const fetchShootScripts = useCallback(async () => {
    try {
      const targetMonth = activeSubTab === 'today_work' ? selectedDate.substring(0, 7) : selectedMonth;
      const res = await api.get(`/content-work/shoot-scripts?month=${targetMonth}`);
      if (res.data.success) {
        setShootScriptsList(res.data.data || []);
      }
    } catch (err) {
      console.error('Error fetching shoot scripts:', err.message);
    }
  }, [selectedMonth, selectedDate, activeSubTab]);

  const fetchAllData = useCallback(async () => {
    setLoading(true);
    await Promise.all([
      fetchGeneralSubmissions(),
      fetchContentSubmissions(),
      fetchShootScripts()
    ]);
    setLoading(false);
  }, [fetchGeneralSubmissions, fetchContentSubmissions, fetchShootScripts]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // Fetch dropdowns for Assign Shoot Script modal
  const fetchDropdowns = async () => {
    try {
      const [clientsRes, empsRes] = await Promise.all([
        api.get('/clients'),
        api.get('/users/employees/dropdown')
      ]);

      if (clientsRes.data.success) {
        setClients(clientsRes.data.data.clients || []);
      }
      if (empsRes.data.success) {
        const list = empsRes.data.data || [];
        // Filter to only content writers (sub_department_id = 1)
        const writers = list.filter(emp => Number(emp.sub_department_id) === 1);
        setContentWriters(writers);
      }
    } catch (err) {
      console.error('Error loading dropdown lists:', err.message);
    }
  };

  const handleOpenAssignModal = () => {
    fetchDropdowns();
    setAssignForm({
      client_id: '',
      assigned_employee_id: '',
      month: selectedMonth,
      title: '',
      description: ''
    });
    setIsAssignModalOpen(true);
  };

  const handleAssignShootScript = async (e) => {
    e.preventDefault();
    if (!assignForm.client_id || !assignForm.assigned_employee_id || !assignForm.month || !assignForm.title) {
      alert('Please fill out all required fields.');
      return;
    }
    setAssignLoading(true);
    try {
      const res = await api.post('/content-work/shoot-scripts', assignForm);
      if (res.data.success) {
        alert('Shoot script successfully assigned to content writer.');
        setIsAssignModalOpen(false);
        fetchShootScripts();
      }
    } catch (err) {
      console.error('Error creating shoot script:', err.message);
      alert(err.response?.data?.message || 'Failed to assign shoot script.');
    } finally {
      setAssignLoading(false);
    }
  };

  const handleDeleteShootScript = async (id) => {
    if (!(await window.confirm('Are you sure you want to delete this shoot script?'))) return;
    try {
      const res = await api.delete(`/content-work/shoot-scripts/${id}`);
      if (res.data.success) {
        alert('Shoot script deleted.');
        fetchShootScripts();
      }
    } catch (err) {
      console.error('Error deleting shoot script:', err.message);
      alert('Failed to delete shoot script.');
    }
  };

  // Central Audio notes handling
  const startRecording = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert('Your browser does not support audio recording.');
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      setMediaRecorder(recorder);
      
      const chunks = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);

        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
          setAudioBase64(reader.result);
        };
      };

      recorder.start();
      setRecordingStatus('recording');
      setRecordDuration(0);
      timerRef.current = setInterval(() => {
        setRecordDuration(prev => prev + 1);
      }, 1000);
    } catch (err) {
      console.error('Failed to start recording:', err.message);
      alert('Could not access microphone.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && recordingStatus === 'recording') {
      mediaRecorder.stop();
      mediaRecorder.stream.getTracks().forEach(track => track.stop());
      setRecordingStatus('idle');
      clearInterval(timerRef.current);
    }
  };

  const resetAudio = () => {
    setAudioUrl(null);
    setAudioBase64(null);
    setRecordDuration(0);
  };

  const closeReviewModal = () => {
    setReviewingItem(null);
    setReviewingContentItem(null);
    setFeedbackText('');
    resetAudio();
  };

  const [reviewLoading, setReviewLoading] = useState(false);

  // General submissions review action (Video editor, Graphic design, Creatives designer)
  const handleReviewAction = async (itemId, action, isJobWork = false) => {
    if (reviewLoading) return;
    if (action === 'reassign' && !feedbackText.trim()) {
      alert('Please provide text corrections feedback.');
      return;
    }

    setReviewLoading(true);
    try {
      let endpoint = '';
      let res;

      if (isJobWork) {
        endpoint = `/deliverables/job-work/${itemId}/review`;
        const payload = {
          action,
          feedbackText: feedbackText,
          voiceBase64: null
        };
        res = await api.post(endpoint, payload);
      } else {
        endpoint = `/deliverables/${itemId}/review`;
        const payload = {
          action,
          feedback: feedbackText,
          voiceNote: null
        };
        res = await api.put(endpoint, payload);
      }

      if (res.data.success) {
        alert(`Deliverable successfully ${action === 'approve' ? 'approved' : 'returned for corrections'}.`);
        closeReviewModal();
        fetchGeneralSubmissions();
      }
    } catch (err) {
      console.error('Error reviewing deliverable:', err.message);
      alert(err.response?.data?.message || 'Failed to review deliverable.');
    } finally {
      setReviewLoading(false);
    }
  };

  // Content writer submission review action
  const handleContentReviewAction = async (itemType, itemId, action) => {
    if (reviewLoading) return;
    if (action === 'reassign' && !feedbackText.trim()) {
      alert('Please write comments for the content writer.');
      return;
    }

    setReviewLoading(true);
    try {
      const payload = {
        itemType,
        itemId,
        action,
        feedback: action === 'reassign' ? feedbackText : '',
        voiceNote: null
      };

      const res = await api.post('/content-work/review', payload);
      if (res.data.success) {
        alert(`Content submission successfully ${action === 'approve' ? 'approved' : 'returned for corrections'}.`);
        closeReviewModal();
        fetchContentSubmissions();
      }
    } catch (err) {
      console.error('Error reviewing content submission:', err.message);
      alert(err.response?.data?.message || 'Failed to review content work.');
    } finally {
      setReviewLoading(false);
    }
  };

  // Filter submissions by active sub-department tab, active sub-tab (Today Work, Pending, Approved), and dates/months
  const getSubDeptSubmissions = () => {
    return submissions.filter(item => {
      // Sub-department match: check employee_sub_dept_id, fallback to sub_department_id
      const actualSubDeptId = item.employee_sub_dept_id || item.sub_department_id;
      if (Number(actualSubDeptId) !== Number(activeSubDeptId)) return false;

      const status = (item.status || '').toLowerCase();

      if (activeSubTab === 'today_work') {
        // Date match: check item.updated_at
        const itemDate = item.updated_at ? getLocalDateString(item.updated_at) : null;
        if (itemDate !== selectedDate) return false;

        // Show items that are submitted/approved/reworked today
        if (!['submitted', 'approved', 'client_approved', 'sent_to_client', 'reassigned'].includes(status)) return false;
      } else if (activeSubTab === 'pending_approval') {
        // Pending approval: status is 'submitted'
        if (status !== 'submitted') return false;
        
        if (selectedMonth) {
          const itemMonth = item.due_date ? item.due_date.substring(0, 7) : null;
          if (itemMonth !== selectedMonth) return false;
        }
      } else if (activeSubTab === 'approved') {
        // Approved: status is 'approved', 'client_approved', 'sent_to_client'
        if (!['approved', 'client_approved', 'sent_to_client'].includes(status)) return false;

        if (selectedMonth) {
          const itemMonth = item.due_date ? item.due_date.substring(0, 7) : null;
          if (itemMonth !== selectedMonth) return false;
        }
      }

      return true;
    });
  };

  const getContentSubmissionsByType = () => {
    if (contentSubTab === 'job_work') {
      return submissions.filter(item => {
        if (!item.isJobWork) return false;

        // Check if creator/writer is Content Writer (sub department 1)
        // Prioritize content_writer_id to ensure approved/unassigned tasks remain visible in Content Writer tab
        const actualSubDeptId = (item.content_writer_id ? 1 : null) || item.employee_sub_dept_id || item.sub_department_id;
        if (Number(actualSubDeptId) !== 1) return false;

        const status = (item.status || '').toLowerCase();

        if (activeSubTab === 'today_work') {
          // Date match: check item.updated_at
          const itemDate = item.updated_at ? getLocalDateString(item.updated_at) : null;
          if (itemDate !== selectedDate) return false;

          // Show items that are submitted/approved/reworked today
          if (!['submitted', 'approved', 'client_approved', 'sent_to_client', 'reassigned'].includes(status)) return false;
        } else if (activeSubTab === 'pending_approval') {
          // Pending approval: status is 'submitted'
          if (status !== 'submitted') return false;

          if (selectedMonth) {
            const itemMonth = item.due_date ? item.due_date.substring(0, 7) : null;
            if (itemMonth !== selectedMonth) return false;
          }
        } else if (activeSubTab === 'approved') {
          // Approved: status is 'approved', 'client_approved', 'sent_to_client', 'completed', 'posted'
          // OR if it's currently assigned to a designer/editor (meaning content script was approved)
          const isScriptApproved = ['approved', 'client_approved', 'sent_to_client', 'completed', 'posted'].includes(status) ||
            (item.assigned_employee_id !== null && Number(item.assigned_employee_id) !== Number(item.content_writer_id));
          
          if (!isScriptApproved) return false;

          if (selectedMonth) {
            const itemMonth = item.due_date ? item.due_date.substring(0, 7) : null;
            if (itemMonth !== selectedMonth) return false;
          }
        }

        return true;
      });
    }

    return contentSubmissions.filter(item => {
      // Category match
      if (item.category !== contentSubTab) return false;

      const subStatus = (item.submission_status || '').toLowerCase();

      if (activeSubTab === 'today_work') {
        // Date match: check item.updated_at
        const itemDate = item.updated_at ? getLocalDateString(item.updated_at) : null;
        if (itemDate !== selectedDate) return false;

        // Content calendars/event days that are submitted/approved/pending today
        if (!['submitted', 'approved', 'pending'].includes(subStatus)) return false;
      } else if (activeSubTab === 'pending_approval') {
        // Pending approval: status is 'submitted'
        if (subStatus !== 'submitted') return false;

        if (selectedMonth) {
          const itemMonth = item.month || (item.date ? item.date.substring(0, 7) : null);
          if (itemMonth !== selectedMonth) return false;
        }
      } else if (activeSubTab === 'approved') {
        // Approved: status is 'approved'
        if (subStatus !== 'approved') return false;

        if (selectedMonth) {
          const itemMonth = item.month || (item.date ? item.date.substring(0, 7) : null);
          if (itemMonth !== selectedMonth) return false;
        }
      }

      return true;
    });
  };

  return (
    <div style={{ padding: '30px', maxWidth: '1400px', margin: '0 auto' }}>
      
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-color)', display: 'flex', alignItems: 'center', gap: '10px', margin: 0 }}>
            <ClipboardList size={26} style={{ color: 'var(--primary)' }} />
            Approval Works
          </h1>
          <p style={{ margin: '6px 0 0 0', color: 'var(--text-muted)', fontSize: '13px' }}>
            Review, approve, and reassign creative deliverables, content drafts, and script submissions sub-department wise.
          </p>
        </div>
        <button className="btn btn-secondary" onClick={fetchAllData} disabled={loading} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <RefreshCw size={14} /> Refresh Submissions
        </button>
      </div>

      {/* Sub Department Navigation Tabs */}
      <div style={{ 
        display: 'flex', 
        gap: '4px', 
        marginBottom: '24px', 
        borderBottom: '1px solid var(--border-color)', 
        paddingBottom: '0',
        overflowX: 'auto'
      }}>
        {SUB_DEPARTMENTS.map(dept => (
          <button 
            key={dept.id}
            onClick={() => setActiveSubDeptId(dept.id)}
            style={{
              padding: '12px 24px',
              fontWeight: 700,
              fontSize: '14px',
              border: 'none',
              background: 'none',
              color: activeSubDeptId === dept.id ? 'var(--primary)' : 'var(--text-muted)',
              borderBottom: activeSubDeptId === dept.id ? '2px solid var(--primary)' : 'none',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s',
              outline: 'none'
            }}
          >
            {dept.name}
          </button>
        ))}
      </div>

      {/* Sub-Tabs (Today Work | Pending Approval | Approved) */}
      <div style={{ 
        display: 'flex', 
        gap: '10px', 
        marginBottom: '20px',
        flexWrap: 'wrap'
      }}>
        {[
          { code: 'today_work', label: 'Today Work' },
          { code: 'pending_approval', label: 'Pending Approval' },
          { code: 'approved', label: 'Approved' }
        ].map(tab => (
          <button 
            key={tab.code}
            className={`btn ${activeSubTab === tab.code ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveSubTab(tab.code)}
            style={{ 
              fontWeight: 700, 
              fontSize: '13px', 
              borderRadius: '99px', 
              padding: '10px 24px',
              boxShadow: activeSubTab === tab.code ? '0 4px 6px -1px rgba(79, 70, 229, 0.2)' : 'none',
              transition: 'all 0.2s',
              cursor: 'pointer'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Dynamic Date/Month Filter Toolbar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '16px 20px',
        backgroundColor: '#fff',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-md)',
        marginBottom: '20px',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        {activeSubTab === 'today_work' ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="pagination-controls" style={{ margin: 0 }}>
              <button className="btn btn-secondary btn-sm" onClick={handlePrevDate}>
                <ChevronLeft size={16} />
              </button>
              <span style={{ fontWeight: 700, fontSize: '16px', color: 'var(--text-main)', minWidth: '150px', textAlign: 'center', display: 'inline-block' }}>
                {(() => {
                  const d = new Date(selectedDate);
                  return isNaN(d.getTime()) ? selectedDate : d.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
                })()}
              </span>
              <button className="btn btn-secondary btn-sm" onClick={handleNextDate}>
                <ChevronRight size={16} />
              </button>
            </div>
            
            <input 
              type="date" 
              value={selectedDate} 
              onChange={(e) => setSelectedDate(e.target.value)}
              style={{ padding: '6px 12px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', outline: 'none' }}
            />
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
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
        )}
      </div>

      {/* Tab Content rendering */}
      {loading ? (
        <div style={{ padding: '100px 0', textAlign: 'center', color: 'var(--text-muted)' }}>
          <div style={{ width: '36px', height: '36px', border: '3px solid #e2e8f0', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px auto' }}></div>
          <span style={{ fontWeight: 600 }}>Fetching pending submissions...</span>
        </div>
      ) : activeSubDeptId !== 1 ? (
        // DELIVERABLES REVIEW FOR NON-WRITERS (Video editor, Graphic design, Creatives designer) - TABLE VIEW
        <div>
          {(() => {
            const allItems = getSubDeptSubmissions();
            const totalPages = Math.ceil(allItems.length / ITEMS_PER_PAGE) || 1;
            const paginatedItems = allItems.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

            if (allItems.length === 0) {
              return (
                <div className="card" style={{ padding: '80px 40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  <CheckCircle size={40} style={{ margin: '0 auto 12px auto', color: 'var(--success)' }} />
                  <h3 style={{ margin: 0, fontWeight: 700, color: 'var(--text-color)' }}>No Submissions Awaiting</h3>
                  <p style={{ margin: '4px 0 0 0', fontSize: '13px' }}>
                    There are no creative deliverables awaiting approval for this sub-department right now.
                  </p>
                </div>
              );
            }

            return (
              <div className="card" style={{ padding: '20px', borderRadius: 'var(--radius-md)' }}>
                {renderTopPagination(totalPages)}
                <div style={{ overflowX: 'auto' }}>
                  <table className="enterprise-table" style={{ width: '100%', minWidth: '1000px' }}>
                    <thead>
                      <tr>
                        <th style={{ width: '150px' }}>Client</th>
                        <th>Deliverable</th>
                        <th style={{ width: '130px' }}>Creator</th>
                        <th style={{ width: '120px' }}>Due Date</th>
                        <th style={{ width: '120px' }}>Activity Code</th>
                        <th style={{ width: '160px' }}>Visual Design</th>
                        <th style={{ width: '160px' }}>Content Link</th>
                        <th style={{ width: '160px' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedItems.map(item => (
                        <tr key={item.isJobWork ? `job-${item.id}` : `deliv-${item.id}`}>
                          {/* Client */}
                          <td style={{ fontWeight: 700 }}>
                            {item.client_name || 'Event Day'}
                          </td>
                          
                          {/* Deliverable */}
                          <td>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                              <span style={{ fontWeight: 600 }}>
                                {item.isJobWork ? item.deliverable : item.activity_name || item.activity_type_code}
                              </span>
                              {!item.isJobWork && item.title && (
                                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{item.title}</span>
                              )}
                            </div>
                          </td>
                          
                          {/* Creator */}
                          <td style={{ fontWeight: 600 }}>
                            {item.employee_name || 'Unassigned'}
                          </td>
                          
                          {/* Due Date */}
                          <td>
                            {item.due_date ? new Date(item.due_date).toLocaleDateString() : 'N/A'}
                          </td>
                          
                          {/* Activity Code */}
                          <td>
                            {item.activity_code ? (
                              <span style={{ fontFamily: 'monospace', fontWeight: 800, padding: '3px 6px', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', borderRadius: '4px', fontSize: '11px' }}>
                                {item.activity_code}
                              </span>
                            ) : (
                              <span style={{ color: 'var(--text-muted)', fontSize: '11px', fontStyle: 'italic' }}>N/A</span>
                            )}
                          </td>
                          
                          {/* Visual Design */}
                          <td>
                            {item.google_drive_link ? (
                              <a 
                                href={ensureExternalLink(item.google_drive_link)} 
                                target="_blank" 
                                rel="noreferrer" 
                                style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: 'var(--primary)', fontWeight: 700, fontSize: '12px' }}
                              >
                                Open Design <ExternalLink size={12} />
                              </a>
                            ) : (
                              <span className="text-muted">No link</span>
                            )}
                          </td>
 
                          {/* Content Link */}
                          <td>
                            {item.content_link ? (
                              <a 
                                href={ensureExternalLink(item.content_link)} 
                                target="_blank" 
                                rel="noreferrer" 
                                style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: 'var(--primary)', fontWeight: 700, fontSize: '12px' }}
                              >
                                Open Script <ExternalLink size={12} />
                              </a>
                            ) : (
                              <span className="text-muted">No link</span>
                            )}
                          </td>
                          
                          {/* Actions */}
                          <td>
                            {item.status !== 'submitted' ? (
                              (() => {
                                const colors = getStatusColors(item.status);
                                return (
                                  <span 
                                    style={{ 
                                      backgroundColor: colors.bg,
                                      color: colors.text,
                                      border: `1px solid ${colors.border}`,
                                      padding: '4px 10px',
                                      borderRadius: '12px',
                                      fontSize: '10px',
                                      fontWeight: 700,
                                      textTransform: 'uppercase',
                                      display: 'inline-block'
                                    }}
                                  >
                                    {item.status === 'sent_to_client'
                                      ? 'Sent to Client'
                                      : ['approved', 'client_approved'].includes(item.status)
                                      ? 'Approved' 
                                      : item.status === 'reassigned' 
                                      ? 'Rework' 
                                      : 'Not Done'}
                                  </span>
                                );
                              })()
                            ) : (
                              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                <button
                                  className="btn btn-success btn-sm"
                                  onClick={() => handleReviewAction(item.id, 'approve', item.isJobWork)}
                                  style={{ padding: '6px 10px', fontSize: '11px', fontWeight: 700 }}
                                >
                                  Approve
                                </button>
                                <button
                                  className="btn btn-primary btn-sm"
                                  onClick={() => handleReviewAction(item.id, 'send_to_client', item.isJobWork)}
                                  style={{ padding: '6px 10px', fontSize: '11px', fontWeight: 700, backgroundColor: '#0284c7', borderColor: '#0284c7', color: '#fff' }}
                                >
                                  Send to Client
                                </button>
                                <button
                                  className="btn btn-danger btn-sm"
                                  onClick={() => {
                                    setReviewingItem(item);
                                    setFeedbackText('');
                                    resetAudio();
                                  }}
                                  style={{ padding: '6px 10px', fontSize: '11px', fontWeight: 700 }}
                                >
                                  Reassign Work
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {renderBottomPagination(totalPages)}
              </div>
            );
          })()}
        </div>
      ) : (
        // CONTENT WRITER TAB - SPECIAL WORKFLOW
        <div>
          {/* Secondary toolbar for Shoot scripts CRUD and filter sub-tabs */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            backgroundColor: '#fff', 
            border: '1px solid var(--border-color)', 
            padding: '12px 20px', 
            borderRadius: 'var(--radius-md) var(--radius-md) 0 0',
            borderBottom: 'none',
            flexWrap: 'wrap', 
            gap: '16px' 
          }}>
            {/* Left: Content Sub-tabs */}
            <div style={{ display: 'flex', gap: '8px' }}>
              {[
                { id: 'content_calendar', label: 'Content Calendar' },
                { id: 'event_days', label: 'Event Calendar' },
                { id: 'shoot_scripts', label: 'Shoot Scripts' },
                { id: 'job_work', label: 'Job Work' }
              ].map(sub => (
                <button
                  key={sub.id}
                  onClick={() => setContentSubTab(sub.id)}
                  style={{
                    padding: '8px 16px',
                    fontSize: '13px',
                    fontWeight: 700,
                    borderRadius: '4px',
                    border: '1px solid',
                    borderColor: contentSubTab === sub.id ? 'var(--primary)' : 'var(--border-color)',
                    backgroundColor: contentSubTab === sub.id ? 'var(--primary-light)' : '#fff',
                    color: contentSubTab === sub.id ? 'var(--primary)' : 'var(--text-muted)',
                    cursor: 'pointer',
                    outline: 'none',
                    transition: 'all 0.15s'
                  }}
                >
                  {sub.label}
                </button>
              ))}
            </div>

            {/* Right: Shoot script assign and view toolbar controls */}
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              {contentSubTab === 'shoot_scripts' && (
                <>
                  <input 
                    type="month"
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    style={{ padding: '6px 10px', fontSize: '13px', border: '1px solid var(--border-color)', borderRadius: '4px' }}
                  />
                  <button 
                    className="btn btn-secondary btn-sm"
                    onClick={() => setShowShootScriptsList(!showShootScriptsList)}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                  >
                    {showShootScriptsList ? <EyeOff size={14} /> : <Eye size={14} />} 
                    {showShootScriptsList ? 'Hide Scripts' : 'Manage Scripts'}
                  </button>
                  <button 
                    className="btn btn-primary btn-sm"
                    onClick={handleOpenAssignModal}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                  >
                    <Plus size={14} /> Assign Shoot Script
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Manage shoot scripts panel */}
          {contentSubTab === 'shoot_scripts' && showShootScriptsList && (
            <div className="card" style={{ padding: '20px', border: '1px solid var(--border-color)', borderBottom: 'none', borderTop: 'none', borderRadius: 0, backgroundColor: 'var(--bg-light)', marginBottom: 0 }}>
              <h3 style={{ margin: '0 0 12px 0', fontSize: '15px', fontWeight: 800 }}>
                Created Shoot Scripts for {formatMonthLabel(selectedMonth)}
              </h3>
              {shootScriptsList.length === 0 ? (
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>No scripts assigned for this month.</p>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table className="enterprise-table" style={{ width: '100%', minWidth: '800px' }}>
                    <thead>
                      <tr>
                        <th>Client</th>
                        <th>Writer</th>
                        <th>Title</th>
                        <th>Status</th>
                        <th style={{ width: '100px' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {shootScriptsList.map(s => (
                        <tr key={s.id}>
                          <td style={{ fontWeight: 700 }}>{s.client_name}</td>
                          <td style={{ fontWeight: 600 }}>{s.employee_name}</td>
                          <td>{s.title}</td>
                          <td>
                            {(() => {
                              const colors = getStatusColors(s.submission_status);
                              return (
                                <span 
                                  style={{ 
                                    backgroundColor: colors.bg,
                                    color: colors.text,
                                    border: `1px solid ${colors.border}`,
                                    padding: '3px 8px',
                                    borderRadius: '12px',
                                    fontSize: '9px',
                                    fontWeight: 700,
                                    textTransform: 'uppercase',
                                    display: 'inline-block'
                                  }}
                                >
                                  {s.submission_status}
                                </span>
                              );
                            })()}
                          </td>
                          <td>
                            <button className="btn btn-danger btn-sm" onClick={() => handleDeleteShootScript(s.id)} style={{ padding: '4px 8px' }} title="Delete Script">
                              <Trash2 size={12} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Submissions items list */}
          <div className="card" style={{ padding: '20px', borderRadius: '0 0 var(--radius-md) var(--radius-md)' }}>
            {(() => {
              const allContent = getContentSubmissionsByType();
              const totalContentPages = Math.ceil(allContent.length / ITEMS_PER_PAGE) || 1;
              const paginatedContent = allContent.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

              if (allContent.length === 0) {
                return (
                  <div style={{ padding: '60px 0', textAlign: 'center', color: 'var(--text-muted)' }}>
                    <CheckCircle size={40} style={{ margin: '0 auto 12px auto', color: 'var(--success)', opacity: 0.8 }} />
                    <h3 style={{ margin: 0, fontWeight: 700 }}>All Caught Up!</h3>
                    <p style={{ margin: '4px 0 0 0', fontSize: '13px' }}>
                      There are no content submissions pending review under this category.
                    </p>
                  </div>
                );
              }

              return (
                <>
                  {renderTopPagination(totalContentPages)}
                  <div style={{ overflowX: 'auto' }}>
                    <table className="enterprise-table" style={{ width: '100%', minWidth: '1000px' }}>
                      <thead>
                        <tr>
                          {contentSubTab === 'content_calendar' && (
                            <>
                              <th style={{ width: '120px' }}>Date</th>
                              <th style={{ width: '150px' }}>Client</th>
                              <th style={{ width: '120px' }}>Code</th>
                              <th style={{ width: '120px' }}>Writer</th>
                              <th>Deliverable / Title</th>
                            </>
                          )}
                          {contentSubTab === 'event_days' && (
                            <>
                              <th style={{ width: '120px' }}>Date</th>
                              <th style={{ width: '200px' }}>Event Name</th>
                              <th style={{ width: '140px' }}>Event Type</th>
                              <th style={{ width: '120px' }}>Writer</th>
                              <th>Description</th>
                            </>
                          )}
                          {contentSubTab === 'shoot_scripts' && (
                            <>
                              <th style={{ width: '150px' }}>Client</th>
                              <th style={{ width: '120px' }}>Writer</th>
                              <th style={{ width: '200px' }}>Title</th>
                              <th>Instruction</th>
                            </>
                          )}
                          {contentSubTab === 'job_work' && (
                            <>
                              <th style={{ width: '120px' }}>Deadline</th>
                              <th style={{ width: '150px' }}>Client</th>
                              <th style={{ width: '120px' }}>Code</th>
                              <th style={{ width: '120px' }}>Writer</th>
                              <th>Job Work Detail</th>
                            </>
                          )}
                          <th style={{ width: '180px' }}>Submitted Link</th>
                          <th style={{ width: '180px' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedContent.map(item => (
                          <tr key={item.isJobWork ? `job-${item.id}` : `deliv-${item.id}`}>
                            {/* --- Tab specific content columns --- */}
                            {contentSubTab === 'content_calendar' && (
                              <>
                                <td style={{ fontWeight: 700 }}>
                                  {new Date(item.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                                </td>
                                <td style={{ fontWeight: 700 }}>{item.client_name}</td>
                                <td>
                                  <span style={{ fontFamily: 'monospace', fontWeight: 800, padding: '3px 6px', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', borderRadius: '4px', fontSize: '11px' }}>
                                    {item.activity_code}
                                  </span>
                                </td>
                                <td style={{ fontWeight: 600 }}>{item.employee_name}</td>
                                <td style={{ fontWeight: 500 }}>{item.title}</td>
                              </>
                            )}

                            {contentSubTab === 'event_days' && (
                              <>
                                <td style={{ fontWeight: 700 }}>
                                  {item.date ? new Date(item.date).toLocaleDateString('en-US', { timeZone: 'UTC', day: 'numeric', month: 'short' }) : 'N/A'}
                                </td>
                                <td style={{ fontWeight: 700 }}>{item.title}</td>
                                <td>
                                  {(() => {
                                    const info = (EVENT_TYPES && EVENT_TYPES[item.event_type]) ? EVENT_TYPES[item.event_type] : EVENT_TYPES.event_day;
                                    return (
                                      <span style={{ 
                                        fontSize: '11px', 
                                        fontWeight: 700, 
                                        padding: '2px 8px', 
                                        borderRadius: '4px', 
                                        backgroundColor: info.bg, 
                                        color: info.color,
                                        border: `1px solid ${info.border}`
                                      }}>
                                        {info.label}
                                      </span>
                                    );
                                  })()}
                                </td>
                                <td style={{ fontWeight: 600 }}>{item.employee_name}</td>
                                <td style={{ fontSize: '12px', color: 'var(--text-light)' }}>{item.description || 'No description'}</td>
                              </>
                            )}

                            {contentSubTab === 'shoot_scripts' && (
                              <>
                                <td style={{ fontWeight: 700 }}>{item.client_name}</td>
                                <td style={{ fontWeight: 600 }}>{item.employee_name}</td>
                                <td style={{ fontWeight: 700 }}>{item.title}</td>
                                <td style={{ fontSize: '12px', color: 'var(--text-light)' }}>{item.description || 'No instruction'}</td>
                              </>
                            )}

                            {contentSubTab === 'job_work' && (
                              <>
                                <td style={{ fontWeight: 700 }}>
                                  {item.due_date ? new Date(item.due_date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' }) : 'N/A'}
                                </td>
                                <td style={{ fontWeight: 700 }}>{item.client_name}</td>
                                <td>
                                  <span style={{ fontFamily: 'monospace', fontWeight: 800, padding: '3px 6px', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', borderRadius: '4px', fontSize: '11px' }}>
                                    {item.activity_code}
                                  </span>
                                </td>
                                <td style={{ fontWeight: 600 }}>{item.content_writer_name || item.employee_name || 'N/A'}</td>
                                <td style={{ fontWeight: 500 }}>{item.deliverable}</td>
                              </>
                            )}

                            <td>
                              {(() => {
                                const linkToUse = item.isJobWork ? item.content_link : item.work_link;
                                return linkToUse ? (
                                  <a 
                                    href={ensureExternalLink(linkToUse)} 
                                    target="_blank" 
                                    rel="noreferrer" 
                                    style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: 'var(--primary)', fontWeight: 700, fontSize: '12px' }}
                                  >
                                    Open Document <ExternalLink size={12} />
                                  </a>
                                ) : (
                                  <span className="text-muted">No link</span>
                                );
                              })()}
                            </td>

                            {/* --- Actions --- */}
                            <td>
                              {item.isJobWork ? (
                                (item.status || '').toLowerCase() !== 'submitted' ? (
                                  (() => {
                                    const statusStr = (item.status || '').toLowerCase();
                                    const isScriptApproved = ['approved', 'client_approved', 'sent_to_client', 'completed', 'posted'].includes(statusStr) ||
                                      (item.assigned_employee_id !== null && Number(item.assigned_employee_id) !== Number(item.content_writer_id));
                                    const colors = getStatusColors(isScriptApproved ? 'approved' : (statusStr === 'reassigned' ? 'reassigned' : statusStr));
                                    return (
                                      <span 
                                        style={{ 
                                          backgroundColor: colors.bg,
                                          color: colors.text,
                                          border: `1px solid ${colors.border}`,
                                          padding: '4px 10px',
                                          borderRadius: '12px',
                                          fontSize: '10px',
                                          fontWeight: 700,
                                          textTransform: 'uppercase',
                                          display: 'inline-block'
                                        }}
                                      >
                                        {isScriptApproved
                                          ? 'Approved' 
                                          : statusStr === 'reassigned' 
                                          ? 'Rework' 
                                          : 'Not Done'}
                                      </span>
                                    );
                                  })()
                                ) : (
                                  <div style={{ display: 'flex', gap: '8px' }}>
                                    <button
                                      className="btn btn-success btn-sm"
                                      onClick={() => handleReviewAction(item.id, 'approve', true)}
                                      style={{ padding: '6px 8px' }}
                                    >
                                      Approve
                                    </button>
                                    <button
                                      className="btn btn-danger btn-sm"
                                      onClick={() => {
                                        setReviewingItem(item);
                                        setFeedbackText('');
                                        resetAudio();
                                      }}
                                      style={{ padding: '6px 8px' }}
                                    >
                                      Reassign
                                    </button>
                                  </div>
                                )
                              ) : (
                                item.submission_status !== 'submitted' ? (
                                  (() => {
                                    const statusStr = item.submission_status === 'approved' ? 'approved' : (item.remarks ? 'reassigned' : 'pending');
                                    const colors = getStatusColors(statusStr);
                                    return (
                                      <span 
                                        style={{ 
                                          backgroundColor: colors.bg,
                                          color: colors.text,
                                          border: `1px solid ${colors.border}`,
                                          padding: '4px 10px',
                                          borderRadius: '12px',
                                          fontSize: '10px',
                                          fontWeight: 700,
                                          textTransform: 'uppercase',
                                          display: 'inline-block'
                                        }}
                                      >
                                        {item.submission_status === 'approved' 
                                          ? 'Approved' 
                                          : item.remarks 
                                          ? 'Rework' 
                                          : 'Not Done'}
                                      </span>
                                    );
                                  })()
                                ) : (
                                  <div style={{ display: 'flex', gap: '8px' }}>
                                    <button
                                      className="btn btn-success btn-sm"
                                      onClick={() => handleContentReviewAction(contentSubTab, item.id, 'approve')}
                                      style={{ padding: '6px 8px' }}
                                    >
                                      Approve
                                    </button>
                                    <button
                                      className="btn btn-danger btn-sm"
                                      onClick={() => {
                                        setReviewingContentItem({
                                          itemType: contentSubTab,
                                          itemId: item.id,
                                          title: item.title
                                        });
                                        setFeedbackText('');
                                      }}
                                      style={{ padding: '6px 8px' }}
                                    >
                                      Reassign
                                    </button>
                                  </div>
                                )
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {renderBottomPagination(totalContentPages)}
                </>
              );
            })()}
          </div>
        </div>
      )}

      {/* 1. DELIVERABLE REVIEW MODAL FOR NON-WRITERS */}
      {reviewingItem && (
        <Modal
          isOpen={!!reviewingItem}
          onClose={closeReviewModal}
          title="Review Creative Work"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ fontWeight: 800, display: 'block', marginBottom: '4px', fontSize: '13px' }}>Deliverable</label>
              <div style={{ padding: '12px', backgroundColor: 'var(--bg-light)', borderRadius: '4px', fontSize: '14px', fontWeight: 600 }}>
                {reviewingItem.isJobWork ? reviewingItem.deliverable : reviewingItem.title}
              </div>
            </div>

            <div>
              <label style={{ fontWeight: 800, display: 'block', marginBottom: '4px', fontSize: '13px' }}>Submitted Link</label>
              <a 
                href={ensureExternalLink(reviewingItem.google_drive_link)} 
                target="_blank" 
                rel="noreferrer" 
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--primary)', fontWeight: 700, fontSize: '14px' }}
              >
                Open Google Drive Work Folder <ExternalLink size={14} />
              </a>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: 0 }} />

            <div>
              <label style={{ fontWeight: 800, display: 'block', marginBottom: '8px', fontSize: '13px' }}>Corrections & Feedback</label>
              <textarea
                placeholder="Enter corrections, guidelines or notes for the designer/editor..."
                className="form-control"
                rows={4}
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                style={{ fontSize: '13px' }}
              />
            </div>



            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <button 
                className="btn btn-success" 
                onClick={() => handleReviewAction(reviewingItem.id, 'approve', reviewingItem.isJobWork)}
                style={{ flex: 1 }}
              >
                Approve & Finish
              </button>
              <button 
                className="btn btn-danger" 
                onClick={() => handleReviewAction(reviewingItem.id, 'reassign', reviewingItem.isJobWork)}
                style={{ flex: 1 }}
              >
                Reassign to Employee
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* 2. CONTENT SUBMISSION REASSIGN feedback MODAL */}
      {reviewingContentItem && (
        <Modal
          isOpen={!!reviewingContentItem}
          onClose={closeReviewModal}
          title="Reassign Content Submission"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ padding: '12px', backgroundColor: 'var(--bg-light)', borderRadius: '4px', fontSize: '13px' }}>
              Reassigning submission: <strong>{reviewingContentItem.title}</strong>
            </div>

            <div>
              <label style={{ fontWeight: 800, display: 'block', marginBottom: '8px', fontSize: '13px' }}>
                Corrections & Feedback
              </label>
              <textarea
                placeholder="Detail what needs to be changed in this content draft..."
                className="form-control"
                rows={4}
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                style={{ fontSize: '13px' }}
              />
            </div>



            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <button className="btn btn-secondary" onClick={closeReviewModal} style={{ flex: 1 }}>
                Cancel
              </button>
              <button 
                className="btn btn-danger" 
                onClick={() => handleContentReviewAction(reviewingContentItem.itemType, reviewingContentItem.itemId, 'reassign')}
                style={{ flex: 1 }}
              >
                Send back to Writer
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* 3. ASSIGN SHOOT SCRIPT MODAL */}
      {isAssignModalOpen && (
        <Modal
          isOpen={isAssignModalOpen}
          onClose={() => setIsAssignModalOpen(false)}
          title="Assign Shoot Script"
        >
          <form onSubmit={handleAssignShootScript} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ fontWeight: 800, display: 'block', marginBottom: '6px', fontSize: '13px' }}>Client *</label>
              <select
                className="form-control"
                value={assignForm.client_id}
                onChange={(e) => setAssignForm(prev => ({ ...prev, client_id: e.target.value }))}
                required
              >
                <option value="">-- Select Client --</option>
                {clients.map(c => (
                  <option key={c.id} value={c.id}>{c.company_name}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ fontWeight: 800, display: 'block', marginBottom: '6px', fontSize: '13px' }}>Content Writer *</label>
              <select
                className="form-control"
                value={assignForm.assigned_employee_id}
                onChange={(e) => setAssignForm(prev => ({ ...prev, assigned_employee_id: e.target.value }))}
                required
              >
                <option value="">-- Select Writer --</option>
                {contentWriters.map(w => (
                  <option key={w.id} value={w.id}>{w.full_name} ({w.employee_id_code})</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ fontWeight: 800, display: 'block', marginBottom: '6px', fontSize: '13px' }}>Month *</label>
              <input
                type="month"
                className="form-control"
                value={assignForm.month}
                onChange={(e) => setAssignForm(prev => ({ ...prev, month: e.target.value }))}
                required
              />
            </div>

            <div>
              <label style={{ fontWeight: 800, display: 'block', marginBottom: '6px', fontSize: '13px' }}>Title *</label>
              <input
                type="text"
                placeholder="e.g. Reel Shoot Script #1"
                className="form-control"
                value={assignForm.title}
                onChange={(e) => setAssignForm(prev => ({ ...prev, title: e.target.value }))}
                required
              />
            </div>

            <div>
              <label style={{ fontWeight: 800, display: 'block', marginBottom: '6px', fontSize: '13px' }}>Instructions / Details</label>
              <textarea
                placeholder="Add special instructions or script requirements here..."
                className="form-control"
                rows={4}
                value={assignForm.description}
                onChange={(e) => setAssignForm(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setIsAssignModalOpen(false)} style={{ flex: 1 }}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={assignLoading} style={{ flex: 1 }}>
                {assignLoading ? 'Assigning...' : 'Assign Script'}
              </button>
            </div>
          </form>
        </Modal>
      )}

    </div>
  );
};

const formatMonthLabel = (monthStr) => {
  const [year, month] = monthStr.split('-');
  const date = new Date(year, month - 1, 1);
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
};

export default ManagerSubmissionsReview;
