import React, { useState, useEffect, useCallback } from 'react';
import { 
  FileText, Send, Calendar, CheckCircle, ExternalLink, 
  RefreshCw, AlertCircle, Clock, Link as LinkIcon, Trash2, 
  Save, ChevronLeft, ChevronRight, Briefcase, Search, AlertTriangle
} from 'lucide-react';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { useLocation } from 'react-router-dom';

const ensureExternalLink = (url) => {
  if (!url || typeof url !== 'string' || !url.trim()) return '#';
  const trimmed = url.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }
  return `https://${trimmed}`;
};

const parseLocalDateStr = (val) => {
  if (!val) return '';
  if (typeof val === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(val.trim())) {
    return val.trim();
  }
  const d = new Date(val);
  if (isNaN(d.getTime())) return '';
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

const getTodayOffsetDateStr = (offsetDays = 0) => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

const getItemDay = (item) => {
  const dateStr = parseLocalDateStr(item.date || item.deadline || item.created_at || item.due_date);
  if (dateStr) {
    const parts = dateStr.split('-');
    if (parts.length >= 3) {
      return Number(parts[2]);
    }
  }
  return null;
};

const getDaysInMonth = (monthStr) => {
  if (!monthStr) return 30;
  const parts = monthStr.split('-');
  if (parts.length < 2) return 30;
  const year = Number(parts[0]);
  const month = Number(parts[1]);
  return new Date(year, month, 0).getDate();
};

const EVENT_TYPES = {
  event_day: { label: 'Event Day', color: '#1d4ed8', bg: '#eff6ff', border: '#bfdbfe' },
  national_day: { label: 'National Day', color: '#15803d', bg: '#f0fdf4', border: '#bbf7d0' },
  international_day: { label: 'International Day', color: '#0891b2', bg: '#ecfeff', border: '#a5f3fc' },
  celebrity_birthday: { label: 'Celebrity Birthday', color: '#7e22ce', bg: '#faf5ff', border: '#e9d5ff' },
  festival_state: { label: 'Festival (State)', color: '#b45309', bg: '#fffbeb', border: '#fde68a' },
  festival_national: { label: 'Festival (National)', color: '#be123c', bg: '#fff1f2', border: '#fecdd3' }
};

const EmployeeAssignedWork = () => {
  const { user } = useAuth();
  const location = useLocation();
  const isContentWriter = Number(user?.employeeProfile?.sub_department_id) === 3 || 
                          Number(user?.sub_department_id) === 3 ||
                          user?.employeeProfile?.sub_department_code === 'CW-RS' ||
                          user?.sub_department_code === 'CW-RS' ||
                          (user?.employeeProfile?.sub_department_name || '').toLowerCase().includes('content') ||
                          (user?.sub_department_name || '').toLowerCase().includes('content') ||
                          (user?.employeeProfile?.full_name || '').toLowerCase().includes('writer') ||
                          (user?.username || '').toLowerCase().includes('writer');
  const isSEO = false; // user?.employeeProfile?.department_code === 'SEO-RS';

  // -------------------------------------------------------------
  // SEO SPECIALIST STATES
  // -------------------------------------------------------------
  const [seoItems, setSeoItems] = useState([]);
  const [selectedSeoMonth, setSelectedSeoMonth] = useState(() => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
  });
  const [seoLinks, setSeoLinks] = useState({});
  const [seoStatusFilter, setSeoStatusFilter] = useState('all');

  // -------------------------------------------------------------
  // CONTENT WRITER STATES
  // -------------------------------------------------------------
  const [activeTab, setActiveTab] = useState(() => {
    return location.state?.activeTab || 'content_calendar';
  });

  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
      setDesignerTab(location.state.activeTab);
    }
  }, [location.state]); 
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
  });
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);
  const [submittingId, setSubmittingId] = useState(null);
  const [bulkSubmitting, setBulkSubmitting] = useState(false);
  const [links, setLinks] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDay, setSelectedDay] = useState('all');
  const [todayFilterDay, setTodayFilterDay] = useState('today'); // 'yesterday' | 'today' | 'tomorrow' | 'all'
  const [designerTodayFilterDay, setDesignerTodayFilterDay] = useState('today'); // 'yesterday' | 'today' | 'tomorrow' | 'all'
  const itemsPerPage = 10;

  const [confirmStartModal, setConfirmStartModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {}
  });

  // -------------------------------------------------------------
  // -------------------------------------------------------------
  // DESIGNER & EDITOR STATES
  // -------------------------------------------------------------
  const [designerTab, setDesignerTab] = useState(() => {
    return location.state?.activeTab || 'today';
  }); // 'today' | 'pending' | 'job_work' | 'deliverables'
  const [designerStatusTab, setDesignerStatusTab] = useState('all'); // 'all' | 'undone' | 'pending' | 'submitted' | 'completed'
  const [filterDate, setFilterDate] = useState(() => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  });
  const [filterMonth, setFilterMonth] = useState(() => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
  });
  const [designerItems, setDesignerItems] = useState([]);
  const [designerLinks, setDesignerLinks] = useState({});
  const [designerSearch, setDesignerSearch] = useState('');
  const [designerPage, setDesignerPage] = useState(1);
  const [activityTypes, setActivityTypes] = useState([]);

  // -------------------------------------------------------------
  // DATA FETCHING & ACTIONS FOR SEO SPECIALIST
  // -------------------------------------------------------------
  const fetchSeoData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/blog-calendar', {
        params: { month: selectedSeoMonth }
      });
      if (res.data.success) {
        const list = res.data.data || [];
        // Filter tasks assigned to current employee
        const myTasks = list.filter(item => Number(item.assigned_employee_id) === Number(user?.id));
        setSeoItems(myTasks);

        const initialLinks = {};
        myTasks.forEach(item => {
          initialLinks[item.id] = {
            content_link: item.content_link || '',
            google_drive_link: item.google_drive_link || ''
          };
        });
        setSeoLinks(initialLinks);
      }
    } catch (err) {
      console.error('Error fetching assigned SEO tasks:', err.message);
    } finally {
      setLoading(false);
    }
  }, [selectedSeoMonth, user?.id]);

  const handlePrevSeoMonth = () => {
    const [year, month] = selectedSeoMonth.split('-').map(Number);
    const date = new Date(year, month - 2, 1);
    setSelectedSeoMonth(`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`);
  };

  const handleNextSeoMonth = () => {
    const [year, month] = selectedSeoMonth.split('-').map(Number);
    const date = new Date(year, month, 1);
    setSelectedSeoMonth(`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`);
  };

  const handleSeoLinkChange = (id, field, val) => {
    setSeoLinks(prev => ({
      ...prev,
      [id]: {
        ...(prev[id] || { content_link: '', google_drive_link: '' }),
        [field]: val
      }
    }));
  };

  const handleSaveSeoLink = async (itemId) => {
    const linkObj = seoLinks[itemId] || { content_link: '', google_drive_link: '' };
    setSavingId(itemId);
    try {
      const item = seoItems.find(t => t.id === itemId);
      if (!item) return;

      const dateObj = new Date(item.date);
      const yyyy = dateObj.getFullYear();
      const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
      const dd = String(dateObj.getDate()).padStart(2, '0');
      const dateStr = `${yyyy}-${mm}-${dd}`;

      const payload = {
        date: dateStr,
        title: item.title,
        description: item.description,
        status: item.status,
        type: item.type,
        assigned_employee_id: item.assigned_employee_id,
        content_link: linkObj.content_link || null,
        google_drive_link: linkObj.google_drive_link || null
      };

      const res = await api.put(`/blog-calendar/${itemId}`, payload);
      if (res.data.success) {
        alert('Work links saved successfully.');
        fetchSeoData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save links.');
    } finally {
      setSavingId(null);
    }
  };

  const handleSubmitSeoWork = async (itemId) => {
    const linkObj = seoLinks[itemId] || { content_link: '', google_drive_link: '' };
    if (!linkObj.content_link && !linkObj.google_drive_link) {
      alert('Please provide at least a content document link or a visual asset link before submitting!');
      return;
    }

    if (!(await window.confirm('Are you sure you want to submit this SEO task for manager review?'))) {
      return;
    }

    setSubmittingId(itemId);
    try {
      const item = seoItems.find(t => t.id === itemId);
      if (!item) return;

      const dateObj = new Date(item.date);
      const yyyy = dateObj.getFullYear();
      const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
      const dd = String(dateObj.getDate()).padStart(2, '0');
      const dateStr = `${yyyy}-${mm}-${dd}`;

      const payload = {
        date: dateStr,
        title: item.title,
        description: item.description,
        status: 'submitted',
        type: item.type,
        assigned_employee_id: item.assigned_employee_id,
        content_link: linkObj.content_link || null,
        google_drive_link: linkObj.google_drive_link || null
      };

      const res = await api.put(`/blog-calendar/${itemId}`, payload);
      if (res.data.success) {
        alert('Work submitted successfully for review!');
        fetchSeoData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit work.');
    } finally {
      setSubmittingId(null);
    }
  };

  const fetchWriterData = useCallback(async () => {
    setLoading(true);
    try {
      const [contentRes, eventRes, jobsRes, actTypesRes] = await Promise.all([
        api.get(`/content-work/assigned-content-calendar?month=${selectedMonth}`).catch(() => ({ data: { success: false, data: [] } })),
        api.get(`/content-work/assigned-event-days?month=${selectedMonth}`).catch(() => ({ data: { success: false, data: [] } })),
        api.get('/deliverables/job-work/employee').catch(() => ({ data: { success: false, data: [] } })),
        api.get('/activity-types').catch(() => ({ data: { success: false, data: [] } }))
      ]);

      if (actTypesRes && actTypesRes.data && actTypesRes.data.success) {
        setActivityTypes(actTypesRes.data.data || []);
      }

      let contentList = [];
      if (contentRes.data.success) {
        contentList = (contentRes.data.data || []).map(item => ({
          ...item,
          isJobWork: false,
          isEventDay: false
        }));
      }

      let eventList = [];
      if (eventRes.data.success) {
        eventList = (eventRes.data.data || []).map(item => ({
          ...item,
          isJobWork: false,
          isEventDay: true
        }));
      }

      let jobsList = [];
      if (jobsRes.data.success) {
        const rawJobs = jobsRes.data.data || [];
        jobsList = rawJobs.filter(job => 
          Number(job.content_writer_id) === Number(user?.employeeProfile?.employee_id || user?.employeeProfile?.id)
        ).map(item => ({
          ...item,
          isJobWork: true,
          isEventDay: false
        }));
      }

      const combined = [...contentList, ...eventList, ...jobsList];
      setItems(combined);

      // Initialize links state
      const initialLinks = {};
      combined.forEach(item => {
        const key = item.isJobWork ? `job_${item.id}` : item.isEventDay ? `event_${item.id}` : `deliv_${item.id}`;
        initialLinks[key] = item.isJobWork ? (item.google_drive_link || '') : (item.work_link || '');
      });
      setLinks(initialLinks);
    } catch (err) {
      console.error('Error fetching assigned content tasks:', err.message);
    } finally {
      setLoading(false);
    }
  }, [selectedMonth, user]);

  // -------------------------------------------------------------
  // DATA FETCHING FOR DESIGNERS / EDITERS
  // -------------------------------------------------------------
  const fetchDesignerData = useCallback(async () => {
    setLoading(true);
    try {
      const [delivsRes, jobWorksRes, actTypesRes] = await Promise.all([
        api.get('/deliverables/employee/all'),
        api.get('/deliverables/job-work/employee'),
        api.get('/activity-types').catch(() => ({ data: { success: false, data: [] } }))
      ]);

      if (actTypesRes.data.success) {
        setActivityTypes(actTypesRes.data.data || []);
      }

      let combined = [];

      if (delivsRes.data.success) {
        const delivsList = delivsRes.data.data.deliverables || [];
        // Filter normal deliverables (including submitted, reassigned, approved)
        const activeDelivs = delivsList.filter(task => 
          ['assigned', 'in_progress', 'reassigned', 'client_rework', 'submitted', 'sent_to_client', 'approved', 'client_approved'].includes((task.status || '').toLowerCase())
        ).map(task => ({
          ...task,
          isJobWork: false
        }));
        combined = [...combined, ...activeDelivs];
      }

      if (jobWorksRes.data.success) {
        const jobList = jobWorksRes.data.data || [];
        // Filter active job works (including submitted, approved, completed, excluding cancelled)
        const activeJobs = jobList.filter(job => 
          !['cancelled'].includes((job.status || '').toLowerCase())
        ).map(job => ({
          ...job,
          isJobWork: true,
          due_date: job.created_at || null,
          priority: 'medium'
        }));
        combined = [...combined, ...activeJobs];
      }

      setDesignerItems(combined);

      // Initialize links state
      const initialLinks = {};
      combined.forEach(item => {
        const key = item.isJobWork ? `job_${item.id}` : `deliv_${item.id}`;
        initialLinks[key] = item.isJobWork ? '' : (item.google_drive_link || '');
      });
      setDesignerLinks(initialLinks);
    } catch (err) {
      console.error('Error fetching designer/editor deliverables:', err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isSEO) {
      fetchSeoData();
    } else if (isContentWriter) {
      fetchWriterData();
    } else {
      fetchDesignerData();
    }
  }, [isSEO, isContentWriter, fetchSeoData, fetchWriterData, fetchDesignerData]);

  // Reset pagination on filtering parameters change
  useEffect(() => {
    setCurrentPage(1);
    setSelectedDay('all');
  }, [activeTab, selectedMonth, searchTerm, statusFilter]);

  useEffect(() => {
    const el = document.getElementById(`day-tab-${selectedDay}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, [selectedDay]);

  useEffect(() => {
    setDesignerPage(1);
  }, [designerTab, designerStatusTab, filterDate, filterMonth, designerSearch]);

  // -------------------------------------------------------------
  // CONTENT WRITER ACTIONS
  // -------------------------------------------------------------
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

  const handleLinkChange = (id, val) => {
    setLinks(prev => ({ ...prev, [id]: val }));
  };

  const handleSaveLink = async (item) => {
    if (item.isJobWork) return; // Not applicable
    const key = item.isJobWork ? `job_${item.id}` : item.isEventDay ? `event_${item.id}` : `deliv_${item.id}`;
    const link = links[key] || '';
    setSavingId(key);
    try {
      let endpoint = '';
      if (!item.isEventDay) {
        endpoint = `/content-work/assigned-content-calendar/${item.id}/link`;
      } else {
        endpoint = `/content-work/assigned-event-days/${item.id}/link`;
      }

      const res = await api.put(endpoint, { work_link: link });
      if (res.data.success) {
        alert('Work link saved successfully.');
        fetchWriterData();
      }
    } catch (err) {
      console.error('Error saving link:', err.message);
      alert(err.response?.data?.message || 'Failed to save link.');
    } finally {
      setSavingId(null);
    }
  };

  const handleDeleteLink = async (item) => {
    if (item.isJobWork) return; // Not applicable
    const key = item.isJobWork ? `job_${item.id}` : item.isEventDay ? `event_${item.id}` : `deliv_${item.id}`;
    if (!(await window.confirm('Are you sure you want to clear this link?'))) return;
    setSavingId(key);
    try {
      let endpoint = '';
      if (!item.isEventDay) {
        endpoint = `/content-work/assigned-content-calendar/${item.id}/link`;
      } else {
        endpoint = `/content-work/assigned-event-days/${item.id}/link`;
      }

      const res = await api.put(endpoint, { work_link: '' });
      if (res.data.success) {
        setLinks(prev => ({ ...prev, [key]: '' }));
        alert('Work link cleared.');
        fetchWriterData();
      }
    } catch (err) {
      console.error('Error clearing link:', err.message);
      alert('Failed to clear link.');
    } finally {
      setSavingId(null);
    }
  };

  const handleWriterSubmitLink = async (item) => {
    const key = item.isJobWork ? `job_${item.id}` : item.isEventDay ? `event_${item.id}` : `deliv_${item.id}`;
    const link = links[key] || '';
    if (!link.trim()) {
      alert('Please enter or paste a valid work document link first.');
      return;
    }
    if (!(await window.confirm('Are you sure you want to submit this work for manager review?'))) return;

    setSubmittingId(key);
    try {
      if (item.isJobWork) {
        const res = await api.post(`/deliverables/job-work/${item.id}/submit`, { googleDriveLink: link });
        if (res.data.success) {
          alert('Job work submitted to manager for approval.');
          fetchWriterData();
        }
      } else {
        let endpoint = '';
        if (!item.isEventDay) {
          endpoint = `/content-work/assigned-content-calendar/${item.id}/submit`;
        } else {
          endpoint = `/content-work/assigned-event-days/${item.id}/submit`;
        }
        const res = await api.post(endpoint, { work_link: link });
        if (res.data.success) {
          alert('Work submitted to manager for approval.');
          fetchWriterData();
        }
      }
    } catch (err) {
      console.error('Error submitting work:', err.message);
      alert(err.response?.data?.message || 'Failed to submit work.');
    } finally {
      setSubmittingId(null);
    }
  };

  const handleSubmitItem = handleWriterSubmitLink;

  const executeStartItem = async (item) => {
    const key = item.isJobWork ? `job_${item.id}` : item.isEventDay ? `event_${item.id}` : `deliv_${item.id}`;
    setSubmittingId(key);
    try {
      let endpoint = '';
      if (item.isJobWork) {
        endpoint = `/deliverables/job-work/${item.id}/start`;
      } else if (!item.isEventDay) {
        endpoint = `/content-work/assigned-content-calendar/${item.id}/start`;
      } else {
        endpoint = `/content-work/assigned-event-days/${item.id}/start`;
      }
      const res = await api.post(endpoint);
      if (res.data.success) {
        alert('Task timer started!');
        fetchWriterData();
      }
    } catch (err) {
      console.error('Error starting task:', err.message);
      alert('Failed to start task.');
    } finally {
      setSubmittingId(null);
    }
  };

  const handleStartItem = (item) => {
    const title = item.activity_name || item.title || item.deliverable || 'Task';
    setConfirmStartModal({
      isOpen: true,
      title: 'Confirm Start Task',
      message: `Are you sure you want to start working on "${title}"? The timer will begin tracking your work time.`,
      onConfirm: () => executeStartItem(item)
    });
  };

  const handleBulkSubmit = async () => {
    const pendingWithLinks = items.filter(item => {
      const isPending = activeTab === 'job_work'
        ? (
            !['approved', 'completed', 'posted', 'submitted'].includes((item.status || '').toLowerCase()) &&
            !(item.assigned_employee_id !== null && Number(item.assigned_employee_id) !== Number(item.content_writer_id))
          )
        : item.submission_status === 'pending';
      return isPending && links[item.id] && links[item.id].trim();
    });

    if (pendingWithLinks.length === 0) {
      alert('There are no pending items with work links filled out to submit.');
      return;
    }

    if (!(await window.confirm(`Are you sure you want to submit all ${pendingWithLinks.length} filled items for manager approval?`))) return;

    setBulkSubmitting(true);
    try {
      if (activeTab === 'job_work') {
        for (const item of pendingWithLinks) {
          await api.post(`/deliverables/job-work/${item.id}/submit`, { googleDriveLink: links[item.id] });
        }
        alert('All selected job works successfully submitted!');
        fetchWriterData();
      } else {
        for (const item of pendingWithLinks) {
          let saveEndpoint = '';
          if (activeTab === 'content_calendar') {
            saveEndpoint = `/content-work/assigned-content-calendar/${item.id}/link`;
          } else if (activeTab === 'event_days') {
            saveEndpoint = `/content-work/assigned-event-days/${item.id}/link`;
          }
          await api.put(saveEndpoint, { work_link: links[item.id] });
        }

        let submitEndpoint = '';
        if (activeTab === 'content_calendar') {
          submitEndpoint = '/content-work/assigned-content-calendar/submit-all';
        } else if (activeTab === 'event_days') {
          submitEndpoint = '/content-work/assigned-event-days/submit-all';
        }

        const res = await api.post(submitEndpoint, { month: selectedMonth });
        if (res.data.success) {
          alert('All pending filled items successfully submitted to the manager!');
          fetchWriterData();
        }
      }
    } catch (err) {
      console.error('Error in bulk submission:', err.message);
      alert('Failed to submit all items.');
    } finally {
      setBulkSubmitting(false);
    }
  };

  // -------------------------------------------------------------
  // DESIGNER & EDITOR ACTIONS
  // -------------------------------------------------------------
  const handleDesignerLinkChange = (key, val) => {
    setDesignerLinks(prev => ({ ...prev, [key]: val }));
  };

  const handleSubmitDesignerWork = async (item) => {
    const key = item.isJobWork ? `job_${item.id}` : `deliv_${item.id}`;
    const link = designerLinks[key] || '';
    if (!link || !link.trim()) {
      alert('Please enter a valid Google Drive or design URL link first.');
      return;
    }

    if (!(await window.confirm('Are you sure you want to submit this work for manager review?'))) return;
    setSubmittingId(key);

    try {
      if (item.isJobWork) {
        const res = await api.post(`/deliverables/job-work/${item.id}/submit`, { googleDriveLink: link });
        if (res.data.success) {
          alert('Job Work successfully submitted to manager.');
          fetchDesignerData();
        }
      } else {
        let res;
        try {
          res = await api.post(`/deliverables/${item.id}/submit`, { googleDriveLink: link });
        } catch (_) {
          res = await api.put(`/deliverables/${item.id}/submit`, { googleDriveLink: link });
        }
        if (res.data.success) {
          alert('Deliverable successfully submitted to manager.');
          fetchDesignerData();
        }
      }
    } catch (err) {
      console.error('Error submitting designer work:', err.message);
      alert(err.response?.data?.message || 'Failed to submit work.');
    } finally {
      setSubmittingId(null);
    }
  };

  const executeStartDesignerWork = async (item) => {
    const key = item.isJobWork ? `job_${item.id}` : `deliv_${item.id}`;
    setSubmittingId(key);
    try {
      const endpoint = item.isJobWork
        ? `/deliverables/job-work/${item.id}/start`
        : `/deliverables/${item.id}/start`;
      const res = await (item.isJobWork ? api.post(endpoint) : api.put(endpoint));
      if (res.data.success) {
        alert('Task timer started!');
        fetchDesignerData();
      }
    } catch (err) {
      console.error('Error starting designer work:', err.message);
      alert(err.response?.data?.message || 'Failed to start task.');
    } finally {
      setSubmittingId(null);
    }
  };

  const handleStartDesignerWork = (item) => {
    const title = item.deliverable || item.activity_name || 'Task';
    setConfirmStartModal({
      isOpen: true,
      title: 'Confirm Start Task',
      message: `Are you sure you want to start working on "${title}"? The timer will begin tracking your work time.`,
      onConfirm: () => executeStartDesignerWork(item)
    });
  };

  const handleDesignerBulkSubmit = async () => {
    const activeWithLinks = designerItems.filter(item => {
      const key = item.isJobWork ? `job_${item.id}` : `deliv_${item.id}`;
      return designerLinks[key] && designerLinks[key].trim() && item.status !== 'submitted';
    });

    if (activeWithLinks.length === 0) {
      alert('No active tasks have work links filled out to submit.');
      return;
    }

    if (!(await window.confirm(`Are you sure you want to submit all ${activeWithLinks.length} filled tasks for manager review?`))) return;

    setBulkSubmitting(true);
    try {
      for (const item of activeWithLinks) {
        const key = item.isJobWork ? `job_${item.id}` : `deliv_${item.id}`;
        const link = designerLinks[key];
        if (item.isJobWork) {
          await api.post(`/deliverables/job-work/${item.id}/submit`, { googleDriveLink: link });
        } else {
          try {
            await api.post(`/deliverables/${item.id}/submit`, { googleDriveLink: link });
          } catch (_) {
            await api.put(`/deliverables/${item.id}/submit`, { googleDriveLink: link });
          }
        }
      }
      alert('All filled deliverables and job works successfully submitted to the manager!');
      fetchDesignerData();
    } catch (err) {
      console.error('Error in designer bulk submit:', err.message);
      alert('Failed to submit all deliverables.');
    } finally {
      setBulkSubmitting(false);
    }
  };

  // -------------------------------------------------------------
  // DATA FILTERING & PAGINATION (WRITERS)
  // -------------------------------------------------------------
  const filteredItems = items.filter(item => {
    const term = searchTerm.toLowerCase();
    const clientMatch = item.client_name ? item.client_name.toLowerCase().includes(term) : false;
    const codeMatch = item.activity_code ? item.activity_code.toLowerCase().includes(term) : false;
    const titleMatch = item.title ? item.title.toLowerCase().includes(term) : false;
    const descMatch = item.description ? item.description.toLowerCase().includes(term) : false;
    const searchMatch = !searchTerm || clientMatch || codeMatch || titleMatch || descMatch;

    let statusMatch = true;
    if (statusFilter !== 'all') {
      if (statusFilter === 'approved') {
        statusMatch = item.submission_status === 'approved';
      } else if (statusFilter === 'submitted') {
        statusMatch = item.submission_status === 'submitted';
      } else if (statusFilter === 'rework') {
        statusMatch = item.submission_status === 'pending' && item.remarks !== null && item.remarks !== '';
      } else if (statusFilter === 'not_done') {
        statusMatch = item.submission_status === 'pending' && (item.remarks === null || item.remarks === '');
      }
    }

    let dayMatch = true;
    if (selectedDay !== 'all') {
      dayMatch = getItemDay(item) === Number(selectedDay);
    }

    return searchMatch && statusMatch && dayMatch;
  });

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const paginatedItems = filteredItems;

  // -------------------------------------------------------------
  // DATA FILTERING & PAGINATION (DESIGNERS)
  // -------------------------------------------------------------
  const getDesignerItemStatus = (item) => {
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    const status = (item.status || '').toLowerCase();
    
    // Completed status
    const isCompleted = ['approved', 'client_approved', 'completed', 'posted'].includes(status);
    // Sent for approval
    const isSubmitted = ['submitted', 'sent_to_client'].includes(status);

    const rawDate = item.due_date ? new Date(item.due_date) : (item.deadline ? new Date(item.deadline) : null);
    let itemDateStr = '';
    if (rawDate && !isNaN(rawDate.getTime())) {
      itemDateStr = `${rawDate.getFullYear()}-${String(rawDate.getMonth() + 1).padStart(2, '0')}-${String(rawDate.getDate()).padStart(2, '0')}`;
    }

    if (isCompleted) return 'completed';
    if (isSubmitted) return 'submitted';
    if (itemDateStr && itemDateStr < todayStr) return 'pending';
    return 'undone';
  };

  const getFilteredDesignerItems = () => {
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    return designerItems.filter(item => {
      // 1. Search match
      const term = designerSearch.toLowerCase();
      const client = (item.client_name || '').toLowerCase();
      const deliverable = (item.deliverable || item.title || '').toLowerCase();
      const searchMatch = !designerSearch || client.includes(term) || deliverable.includes(term);

      if (!searchMatch) return false;

      // 2. Extract and format item date
      const rawDate = item.due_date ? new Date(item.due_date) : (item.deadline ? new Date(item.deadline) : null);
      if (!rawDate || isNaN(rawDate.getTime())) return false;

      const yyyy = String(rawDate.getFullYear());
      const mm = String(rawDate.getMonth() + 1).padStart(2, '0');
      const dd = String(rawDate.getDate()).padStart(2, '0');
      const formattedDate = `${yyyy}-${mm}-${dd}`;
      const formattedMonth = `${yyyy}-${mm}`;

      const status = (item.status || '').toLowerCase();
      const isCompleted = ['approved', 'client_approved', 'completed', 'posted'].includes(status);
      const isSubmitted = ['submitted', 'sent_to_client'].includes(status);

      // 3. Tab filter
      if (designerTab === 'today') {
        let targetDate = todayStr;
        if (designerTodayFilterDay === 'yesterday') {
          targetDate = getTodayOffsetDateStr(-1);
        } else if (designerTodayFilterDay === 'tomorrow') {
          targetDate = getTodayOffsetDateStr(1);
        } else if (designerTodayFilterDay === 'today') {
          targetDate = todayStr;
        }
        if (designerTodayFilterDay !== 'all' && formattedDate !== targetDate) return false;
      } else if (designerTab === 'pending') {
        if (formattedDate >= todayStr || isCompleted || isSubmitted) return false;
      } else if (designerTab === 'job_work') {
        if (!item.isJobWork) return false;
        
        if (filterDate) {
          if (formattedDate !== filterDate) return false;
        } else if (filterMonth) {
          if (formattedMonth !== filterMonth) return false;
        }
      } else if (designerTab === 'deliverables') {
        if (item.isJobWork) return false;
        
        if (filterDate) {
          if (formattedDate !== filterDate) return false;
        } else if (filterMonth) {
          if (formattedMonth !== filterMonth) return false;
        }
      }

      // Hide completed/submitted tasks from default lists (undone)
      const isCompletedOrSubmitted = isCompleted || isSubmitted;
      if (isCompletedOrSubmitted) {
        if (designerStatusTab !== 'completed' && designerStatusTab !== 'submitted' && designerStatusTab !== 'all') {
          return false;
        }
      }

      // 4. Status tab filter: undone, completed, pending, submitted
      if (designerStatusTab !== 'all') {
        const itemStatus = getDesignerItemStatus(item);
        if (designerStatusTab !== itemStatus) return false;
      }

      return true;
    });
  };

  const filteredDesignerList = getFilteredDesignerItems();
  const totalDesignerPages = Math.ceil(filteredDesignerList.length / itemsPerPage);
  const paginatedDesignerList = filteredDesignerList.slice((designerPage - 1) * itemsPerPage, designerPage * itemsPerPage);

  // -------------------------------------------------------------
  // WRITER PAGINATION COMPONENT
  // -------------------------------------------------------------
  const renderPaginationControls = () => {
    const daysInMonth = getDaysInMonth(selectedMonth);
    
    const handlePrevDay = () => {
      if (selectedDay === 'all') return;
      if (selectedDay === 1) {
        setSelectedDay('all');
      } else {
        setSelectedDay(Number(selectedDay) - 1);
      }
    };
    
    const handleNextDay = () => {
      if (selectedDay === 'all') {
        setSelectedDay(1);
      } else if (Number(selectedDay) < daysInMonth) {
        setSelectedDay(Number(selectedDay) + 1);
      } else {
        setSelectedDay('all');
      }
    };

    return (
      <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
        <button
          className="pagination-btn"
          disabled={selectedDay === 'all'}
          onClick={handlePrevDay}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '32px', height: '32px', border: '1px solid var(--border-color)', borderRadius: '4px', backgroundColor: '#fff', cursor: selectedDay === 'all' ? 'not-allowed' : 'pointer', opacity: selectedDay === 'all' ? 0.5 : 1 }}
        >
          <ChevronLeft size={16} />
        </button>
        
        <div style={{ display: 'flex', gap: '4px', overflowX: 'auto', maxWidth: '380px', scrollbarWidth: 'none', msOverflowStyle: 'none', padding: '2px 0' }}>
          <button
            id="day-tab-all"
            onClick={() => setSelectedDay('all')}
            style={{
              minWidth: '40px',
              height: '32px',
              border: '1px solid',
              borderColor: selectedDay === 'all' ? 'var(--primary)' : 'var(--border-color)',
              borderRadius: '4px',
              backgroundColor: selectedDay === 'all' ? 'var(--primary)' : '#fff',
              color: selectedDay === 'all' ? '#fff' : 'var(--text-main)',
              fontWeight: 700,
              fontSize: '13px',
              cursor: 'pointer',
              padding: '0 8px',
              flexShrink: 0
            }}
          >
            All
          </button>
          {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(d => {
            const [year, monthVal] = selectedMonth.split('-').map(Number);
            const isSunday = new Date(year, monthVal - 1, d).getDay() === 0;
            return (
              <button
                id={`day-tab-${d}`}
                key={d}
                onClick={() => setSelectedDay(d)}
                style={{
                  minWidth: '32px',
                  height: '32px',
                  border: '1px solid',
                  borderColor: selectedDay === d 
                    ? 'var(--primary)' 
                    : isSunday 
                      ? 'rgba(239, 68, 68, 0.3)' 
                      : 'var(--border-color)',
                  borderRadius: '4px',
                  backgroundColor: selectedDay === d 
                    ? 'var(--primary)' 
                    : isSunday 
                      ? '#fef2f2' 
                      : '#fff',
                  color: selectedDay === d 
                    ? '#fff' 
                    : isSunday 
                      ? '#ef4444' 
                      : 'var(--text-main)',
                  fontWeight: 700,
                  fontSize: '13px',
                  cursor: 'pointer',
                  flexShrink: 0
                }}
                title={isSunday ? 'Sunday' : undefined}
              >
                {d}
              </button>
            );
          })}
        </div>

        <button
          className="pagination-btn"
          onClick={handleNextDay}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '32px', height: '32px', border: '1px solid var(--border-color)', borderRadius: '4px', backgroundColor: '#fff', cursor: 'pointer' }}
        >
          <ChevronRight size={16} />
        </button>
      </div>
    );
  };

  // -------------------------------------------------------------
  // DESIGNER PAGINATION COMPONENT
  // -------------------------------------------------------------
  const renderDesignerPagination = () => {
    if (totalDesignerPages <= 1) return null;
    return (
      <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
        <button
          className="pagination-btn"
          disabled={designerPage === 1}
          onClick={() => setDesignerPage(p => p - 1)}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '32px', height: '32px', border: '1px solid var(--border-color)', borderRadius: '4px', backgroundColor: '#fff', cursor: designerPage === 1 ? 'not-allowed' : 'pointer', opacity: designerPage === 1 ? 0.5 : 1 }}
        >
          <ChevronLeft size={16} />
        </button>
        {Array.from({ length: totalDesignerPages }, (_, i) => i + 1).map(p => (
          <button
            key={p}
            onClick={() => setDesignerPage(p)}
            style={{
              minWidth: '32px',
              height: '32px',
              border: '1px solid',
              borderColor: designerPage === p ? 'var(--primary)' : 'var(--border-color)',
              borderRadius: '4px',
              backgroundColor: designerPage === p ? 'var(--primary)' : '#fff',
              color: designerPage === p ? '#fff' : 'var(--text-main)',
              fontWeight: 700,
              fontSize: '13px',
              cursor: 'pointer'
            }}
          >
            {p}
          </button>
        ))}
        <button
          className="pagination-btn"
          disabled={designerPage === totalDesignerPages}
          onClick={() => setDesignerPage(p => p + 1)}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '32px', height: '32px', border: '1px solid var(--border-color)', borderRadius: '4px', backgroundColor: '#fff', cursor: designerPage === totalDesignerPages ? 'not-allowed' : 'pointer', opacity: designerPage === totalDesignerPages ? 0.5 : 1 }}
        >
          <ChevronRight size={16} />
        </button>
      </div>
    );
  };

  const formatMonthLabel = (monthStr) => {
    const [year, month] = monthStr.split('-');
    const date = new Date(year, month - 1, 1);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  // Helper to resolve time (editor time) from activity types
  const getEditorTime = (typeCode) => {
    if (!typeCode) return 'N/A';
    const found = activityTypes.find(a => a.activity_type_code.toUpperCase() === typeCode.toUpperCase());
    return found ? `${found.time_editor} mins` : 'N/A';
  };

  // Helper to resolve time (content writer time) from activity types
  const getContentTime = (typeCode) => {
    if (!typeCode) return 'N/A';
    const found = activityTypes.find(a => a.activity_type_code.toUpperCase() === typeCode.toUpperCase());
    return found ? `${found.time_content} mins` : 'N/A';
  };

  // -------------------------------------------------------------
  // VIEW RENDERER (1: CONTENT WRITER VIEW)
  // -------------------------------------------------------------
  if (isSEO) {
    return (
      <div style={{ padding: '30px', maxWidth: '1400px', margin: '0 auto' }}>
        {/* Page Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-color)', display: 'flex', alignItems: 'center', gap: '10px', margin: 0 }}>
              <Clock size={26} style={{ color: 'var(--primary)' }} />
              Assigned SEO Work
            </h1>
            <p style={{ margin: '6px 0 0 0', color: 'var(--text-muted)', fontSize: '13px' }}>
              Submit and manage your assigned daily Blogs, GMB posts, and Backlink submissions.
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#ffffff', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', padding: '4px 8px' }}>
              <button onClick={handlePrevSeoMonth} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}><ChevronLeft size={16} /></button>
              <span style={{ fontSize: '13px', fontWeight: 700, minWidth: '110px', textAlign: 'center' }}>{formatMonthLabel(selectedSeoMonth)}</span>
              <button onClick={handleNextSeoMonth} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}><ChevronRight size={16} /></button>
            </div>
            <button className="btn btn-secondary" onClick={fetchSeoData} disabled={loading} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
            </button>
          </div>
        </div>

        {/* Filter bar for SEO */}
        {seoItems.length > 0 && (
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            gap: '16px', 
            backgroundColor: '#fff', 
            padding: '16px 20px', 
            border: '1px solid var(--border-color)', 
            borderRadius: 'var(--radius-md)', 
            marginBottom: '20px' 
          }}>
            <div style={{ display: 'flex', gap: '12px', flex: 1, minWidth: '300px' }}>
              <select
                className="form-control"
                value={seoStatusFilter}
                onChange={(e) => setSeoStatusFilter(e.target.value)}
                style={{ maxWidth: '180px', fontSize: '13px', padding: '8px 12px' }}
              >
                <option value="all">All Statuses</option>
                <option value="approved">Approved</option>
                <option value="submitted">Sent for Approval</option>
                <option value="not_done">Not Done</option>
              </select>
            </div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: '99px', backgroundColor: 'var(--primary-light)', border: '1px solid var(--primary)', color: 'var(--primary)', fontWeight: 700, fontSize: '13px' }}>
              <span>Active Tasks:</span>
              <strong style={{ fontSize: '15px' }}>{
                (() => {
                  const filtered = seoItems.filter(item => {
                    let statusMatch = true;
                    if (seoStatusFilter !== 'all') {
                      if (seoStatusFilter === 'approved') {
                        statusMatch = item.status === 'sent_to_employees';
                      } else if (seoStatusFilter === 'submitted') {
                        statusMatch = item.status === 'submitted';
                      } else if (seoStatusFilter === 'not_done') {
                        statusMatch = item.status === 'assigned' || item.status === 'draft';
                      }
                    }
                    return statusMatch;
                  });
                  return filtered.length;
                })()
              }</strong>
            </div>
          </div>
        )}

        {loading ? (
          <div style={{ padding: '80px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <div style={{ width: '32px', height: '32px', border: '3px solid #e2e8f0', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 12px auto' }}></div>
            <span>Loading assigned tasks...</span>
          </div>
        ) : seoItems.length === 0 ? (
          <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--border-color)', padding: '60px 40px', textAlign: 'center', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)' }}>
            <CheckCircle size={44} style={{ color: 'var(--success)', marginBottom: '12px' }} />
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: 'var(--text-color)' }}>No assigned tasks</h3>
            <p style={{ margin: '8px 0 0 0', color: 'var(--text-muted)', fontSize: '14px' }}>
              You don't have any assigned SEO tasks for this month.
            </p>
          </div>
        ) : (() => {
          const filtered = seoItems.filter(item => {
            let statusMatch = true;
            if (seoStatusFilter !== 'all') {
              if (seoStatusFilter === 'approved') {
                statusMatch = item.status === 'sent_to_employees';
              } else if (seoStatusFilter === 'submitted') {
                statusMatch = item.status === 'submitted';
              } else if (seoStatusFilter === 'not_done') {
                statusMatch = item.status === 'assigned' || item.status === 'draft';
              }
            }
            return statusMatch;
          });

          if (filtered.length === 0) {
            return (
              <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--border-color)', padding: '60px 40px', textAlign: 'center', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)' }}>
                <AlertCircle size={44} style={{ color: 'var(--text-muted)', marginBottom: '12px' }} />
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: 'var(--text-color)' }}>No tasks match filter</h3>
                <p style={{ margin: '8px 0 0 0', color: 'var(--text-muted)', fontSize: '14px' }}>
                  Try selecting a different status filter.
                </p>
              </div>
            );
          }

          return (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px' }}>
              {filtered.map(item => {
              const currentLinks = seoLinks[item.id] || { content_link: '', google_drive_link: '' };
              const isLocked = item.status === 'submitted' || item.status === 'sent_to_employees';

              return (
                <div 
                  key={item.id}
                  style={{
                    backgroundColor: item.status === 'sent_to_employees' ? '#f0fdf4' : '#ffffff',
                    border: item.status === 'sent_to_employees' ? '1px solid #bbf7d0' : '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    padding: '24px',
                    boxShadow: 'var(--shadow-sm)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    borderLeft: `5px solid ${item.type === 'gmb' ? '#10b981' : item.type === 'backlink' ? '#8b5cf6' : '#3b82f6'}`,
                    position: 'relative'
                  }}
                >
                  <div>
                    {/* Header line */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.5px' }}>
                        {item.client_name}
                      </span>
                      <span 
                        style={{
                          backgroundColor: 
                            item.status === 'sent_to_employees' ? 'rgba(16, 185, 129, 0.1)' : 
                            item.status === 'submitted' ? 'rgba(79, 70, 229, 0.1)' : 
                            'rgba(59, 130, 246, 0.1)',
                          color: 
                            item.status === 'sent_to_employees' ? '#10b981' : 
                            item.status === 'submitted' ? '#4f46e5' : 
                            '#3b82f6',
                          padding: '4px 10px',
                          borderRadius: '12px',
                          fontSize: '11px',
                          fontWeight: 700,
                          textTransform: 'uppercase'
                        }}
                      >
                        {
                          item.status === 'sent_to_employees' ? 'Completed' : 
                          item.status === 'submitted' ? 'Submitted' : 
                          'Assigned'
                        }
                      </span>
                    </div>

                    <h3 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 8px 0', color: 'var(--text-color)' }}>
                      {item.title}
                    </h3>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                      <span className="badge" style={{
                        backgroundColor: item.type === 'gmb' ? '#ecfdf5' : item.type === 'backlink' ? '#f5f3ff' : 'var(--primary-light)',
                        color: item.type === 'gmb' ? '#047857' : item.type === 'backlink' ? '#6d28d9' : 'var(--primary)',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        fontSize: '10px',
                        padding: '4px 8px'
                      }}>
                        {item.type || 'blog'}
                      </span>
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>
                        Due: {new Date(item.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                      </span>
                    </div>

                    {item.description && (
                      <div style={{ backgroundColor: 'var(--bg-light)', padding: '12px', borderRadius: 'var(--radius-sm)', fontSize: '13px', color: 'var(--text-main)', marginBottom: '16px', whiteSpace: 'pre-wrap', lineHeight: '1.4' }}>
                        <strong>Brief/Instructions:</strong><br />
                        {item.description}
                      </div>
                    )}

                    {/* Inputs & Links */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                      {isLocked ? (
                        /* Read-only links */
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          {item.content_link && (
                            <div style={{ fontSize: '13px' }}>
                              <a 
                                href={ensureExternalLink(item.content_link)} 
                                target="_blank" 
                                rel="noreferrer" 
                                style={{ color: 'var(--primary)', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '6px', textDecoration: 'none' }}
                              >
                                <FileText size={14} /> Open Submitted Document <ExternalLink size={12} />
                              </a>
                            </div>
                          )}
                          {item.google_drive_link && (
                            <div style={{ fontSize: '13px' }}>
                              <a 
                                href={ensureExternalLink(item.google_drive_link)} 
                                target="_blank" 
                                rel="noreferrer" 
                                style={{ color: 'var(--primary)', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '6px', textDecoration: 'none' }}
                              >
                                <LinkIcon size={14} /> Open Visual Assets <ExternalLink size={12} />
                              </a>
                            </div>
                          )}
                        </div>
                      ) : (
                        /* Editable inputs */
                        <>
                          <div>
                            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px' }}>
                              Content Document Link (Google Doc)
                            </label>
                            <input 
                              type="text" 
                              value={currentLinks.content_link}
                              onChange={(e) => handleSeoLinkChange(item.id, 'content_link', e.target.value)}
                              placeholder="https://docs.google.com/..."
                              style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', outline: 'none', fontSize: '13px' }}
                            />
                          </div>

                          <div>
                            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px' }}>
                              Visual / Upload Drive Link
                            </label>
                            <input 
                              type="text" 
                              value={currentLinks.google_drive_link}
                              onChange={(e) => handleSeoLinkChange(item.id, 'google_drive_link', e.target.value)}
                              placeholder="https://drive.google.com/..."
                              style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', outline: 'none', fontSize: '13px' }}
                            />
                          </div>

                          <div style={{ display: 'flex', gap: '10px' }}>
                            <button
                              onClick={() => handleSaveSeoLink(item.id)}
                              disabled={savingId === item.id}
                              className="btn btn-secondary btn-sm"
                              style={{ flex: 1, padding: '8px', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                            >
                              <Save size={14} /> {savingId === item.id ? 'Saving...' : 'Save Draft Links'}
                            </button>
                            <button
                              onClick={() => handleSubmitSeoWork(item.id)}
                              disabled={submittingId === item.id}
                              className="btn btn-primary btn-sm"
                              style={{ flex: 1, padding: '8px', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', background: 'var(--success)', border: 'none' }}
                            >
                              <Send size={14} /> {submittingId === item.id ? 'Submitting...' : 'Submit Work'}
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          );
        })()}
      </div>
    );
  }

  if (isContentWriter) {
    const getWriterItemDateStr = (item) => {
      return parseLocalDateStr(item.date || item.deadline || item.created_at || item.due_date);
    };

    const getFilteredItems = () => {
      const today = new Date();
      const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

      return items.filter(item => {
        // Search filter
        const term = searchTerm.toLowerCase();
        const client = (item.client_name || 'Event Day').toLowerCase();
        const deliverable = (item.activity_name || item.title || item.deliverable || '').toLowerCase();
        const code = (item.activity_code || `EVT-${item.id}`).toLowerCase();
        const searchMatch = !searchTerm || client.includes(term) || deliverable.includes(term) || code.includes(term);

        if (!searchMatch) return false;

        const itemDateStr = getWriterItemDateStr(item);

        // Status evaluation
        const isCompleted = item.isJobWork
          ? (
              ['approved', 'completed', 'posted'].includes((item.status || '').toLowerCase()) ||
              (item.assigned_employee_id !== null && Number(item.assigned_employee_id) !== Number(item.content_writer_id))
            )
          : item.submission_status === 'approved';

        const isSubmitted = item.isJobWork
          ? (item.status || '').toLowerCase() === 'submitted'
          : item.submission_status === 'submitted';

        // Tab Filter
        if (activeTab === 'today') {
          let targetDate = todayStr;
          if (todayFilterDay === 'yesterday') {
            targetDate = getTodayOffsetDateStr(-1);
          } else if (todayFilterDay === 'tomorrow') {
            targetDate = getTodayOffsetDateStr(1);
          } else if (todayFilterDay === 'today') {
            targetDate = todayStr;
          }
          if (todayFilterDay !== 'all' && itemDateStr !== targetDate) return false;
        } else if (activeTab === 'pending') {
          if (itemDateStr >= todayStr || isCompleted || isSubmitted) return false;
        } else if (activeTab === 'job_work') {
          if (!item.isJobWork) return false;
        } else if (activeTab === 'event_days') {
          if (item.isJobWork || !item.isEventDay) return false;
        } else if (activeTab === 'content_calendar') {
          if (item.isJobWork || item.isEventDay) return false;
        }

        // Month filter & day filter (only applied to non-today, non-pending tabs)
        if (activeTab !== 'today' && activeTab !== 'pending') {
          if (selectedMonth) {
            const itemMonth = itemDateStr.substring(0, 7);
            if (itemMonth !== selectedMonth) return false;
          }

          if (selectedDay !== 'all') {
            const dayStr = itemDateStr.split('-')[2];
            if (dayStr && Number(dayStr) !== Number(selectedDay)) return false;
          }
        }

        // Status dropdown filter
        let statusCat = 'undone';
        if (isCompleted) {
          statusCat = 'completed';
        } else if (isSubmitted) {
          statusCat = 'submitted';
        } else if (itemDateStr && itemDateStr < todayStr) {
          statusCat = 'pending';
        } else {
          statusCat = 'undone';
        }

        // Hide completed/submitted tasks from default lists (undone)
        const isCompletedOrSubmitted = isCompleted || isSubmitted;
        if (isCompletedOrSubmitted) {
          if (statusFilter !== 'completed' && statusFilter !== 'submitted' && statusFilter !== 'all') {
            return false;
          }
        }

        if (statusFilter !== 'all' && statusFilter !== statusCat) {
          return false;
        }

        return true;
      });
    };

    const filteredList = getFilteredItems();
    const writerItemsPerPage = 10;
    const totalWriterPages = Math.ceil(filteredList.length / writerItemsPerPage);
    const paginatedList = filteredList.slice((currentPage - 1) * writerItemsPerPage, currentPage * writerItemsPerPage);

    const renderWriterPagination = () => (
      <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
        <button
          className="btn btn-secondary btn-sm"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          style={{ minWidth: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <ChevronLeft size={16} />
        </button>
        {Array.from({ length: totalWriterPages }, (_, i) => i + 1).map(p => (
          <button
            key={p}
            onClick={() => setCurrentPage(p)}
            className={`btn btn-sm ${currentPage === p ? 'btn-primary' : 'btn-secondary'}`}
            style={{
              minWidth: '32px',
              height: '32px',
              fontWeight: 700,
              backgroundColor: currentPage === p ? 'var(--primary)' : '#fff',
              color: currentPage === p ? '#fff' : 'var(--text-main)',
              border: '1px solid var(--border-color)'
            }}
          >
            {p}
          </button>
        ))}
        <button
          className="btn btn-secondary btn-sm"
          disabled={currentPage === totalWriterPages || totalWriterPages === 0}
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalWriterPages))}
          style={{ minWidth: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <ChevronRight size={16} />
        </button>
      </div>
    );

    return (
      <div style={{ padding: '30px', maxWidth: '1400px', margin: '0 auto' }}>
        {/* Page Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-color)', display: 'flex', alignItems: 'center', gap: '10px', margin: 0 }}>
              <Clock size={26} style={{ color: 'var(--primary)' }} />
              Daily Tasks & To-Do List
            </h1>
            <p style={{ margin: '6px 0 0 0', color: 'var(--text-muted)', fontSize: '13px' }}>
              Manage your daily tasks, priority job works, and track pending items.
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <button className="btn btn-secondary" onClick={fetchWriterData} disabled={loading} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <RefreshCw size={14} /> Refresh
            </button>
          </div>
        </div>

        {/* Tabs Layout */}
        <div style={{ 
          display: 'flex', 
          gap: '4px', 
          marginBottom: '20px', 
          borderBottom: '1px solid var(--border-color)', 
          paddingBottom: '0' 
        }}>
          {[
            { id: 'today', label: "Today's Work" },
            { id: 'pending', label: 'Pending Work' },
            { id: 'job_work', label: 'Job Work' },
            { id: 'event_days', label: 'Event Calendar' },
            { id: 'content_calendar', label: 'Monthly Deliverables' }
          ].map(t => (
            <button 
              key={t.id}
              onClick={() => {
                setActiveTab(t.id);
                setCurrentPage(1);
              }}
              style={{
                padding: '10px 20px',
                fontWeight: 700,
                fontSize: '14px',
                border: 'none',
                background: 'none',
                color: activeTab === t.id ? 'var(--primary)' : 'var(--text-muted)',
                borderBottom: activeTab === t.id ? '2px solid var(--primary)' : 'none',
                cursor: 'pointer',
                transition: 'all 0.2s',
                outline: 'none'
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Toolbar / Month Selection & Filtration */}
        <div className="table-toolbar" style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '16px 20px', backgroundColor: '#fff', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md) var(--radius-md) 0 0', borderBottom: 'none' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            {!['today', 'pending'].includes(activeTab) ? (
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
            ) : activeTab === 'today' ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)' }}>Quick Day:</span>
                {[
                  { id: 'yesterday', label: 'Yesterday' },
                  { id: 'today', label: 'Today' },
                  { id: 'tomorrow', label: 'Tomorrow' },
                  { id: 'all', label: 'All Days' }
                ].map(b => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => {
                      setTodayFilterDay(b.id);
                      setCurrentPage(1);
                    }}
                    style={{
                      padding: '5px 12px',
                      fontSize: '12px',
                      fontWeight: 700,
                      borderRadius: '20px',
                      border: '1px solid',
                      borderColor: todayFilterDay === b.id ? 'var(--primary)' : 'var(--border-color)',
                      backgroundColor: todayFilterDay === b.id ? 'var(--primary)' : '#ffffff',
                      color: todayFilterDay === b.id ? '#ffffff' : 'var(--text-main)',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    {b.label}
                  </button>
                ))}
              </div>
            ) : (
              <div />
            )}

            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: '99px', backgroundColor: 'var(--primary-light)', border: '1px solid var(--primary)', color: 'var(--primary)', fontWeight: 700, fontSize: '13px' }}>
                <span>Total:</span>
                <strong style={{ fontSize: '15px' }}>{filteredList.length}</strong>
              </div>
              <button 
                className="btn btn-primary"
                onClick={handleBulkSubmit}
                disabled={loading || bulkSubmitting || items.length === 0}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontWeight: 700 }}
              >
                <Send size={14} /> {bulkSubmitting ? 'Sending...' : 'Send All to Approval'}
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
            <div style={{ display: 'flex', gap: '12px', flex: 1, minWidth: '300px' }}>
              <input
                type="text"
                placeholder="Search by client, title, code..."
                className="form-control"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ maxWidth: '300px', fontSize: '13px', padding: '8px 12px' }}
              />

              <select
                className="form-control"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{ maxWidth: '180px', fontSize: '13px', padding: '8px 12px' }}
              >
                <option value="all">All Statuses</option>
                <option value="completed">Completed</option>
                <option value="submitted">Sent for Approval</option>
                <option value="pending">Pending (Overdue)</option>
                <option value="undone">Undone</option>
              </select>
            </div>

            {totalWriterPages > 1 && renderWriterPagination()}
          </div>
        </div>

        {/* Main List Table */}
        <div className="card" style={{ padding: '20px', borderRadius: '0 0 var(--radius-md) var(--radius-md)', minHeight: '300px' }}>
          {loading ? (
            <div style={{ padding: '80px', textAlign: 'center', color: 'var(--text-muted)' }}>
              <div style={{ width: '32px', height: '32px', border: '3px solid #e2e8f0', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 12px auto' }}></div>
              <span>Loading assigned tasks...</span>
            </div>
          ) : paginatedList.length === 0 ? (
            <div style={{ padding: '60px 40px', textAlign: 'center', color: 'var(--text-muted)' }}>
              <CheckCircle size={40} style={{ margin: '0 auto 12px auto', color: 'var(--success)', opacity: 0.8 }} />
              <h3 style={{ margin: 0, fontWeight: 700, color: 'var(--text-color)' }}>No assigned work found</h3>
              <p style={{ margin: '4px 0 0 0', fontSize: '13px' }}>
                You don't have any assigned deliverables matching the criteria.
              </p>
            </div>
          ) : (
            <>
              <div style={{ overflowX: 'auto' }}>
                <table className="enterprise-table" style={{ width: '100%', minWidth: '1100px' }}>
                  <thead>
                    <tr>
                      <th style={{ width: '120px' }}>Due Date</th>
                      <th style={{ width: '180px' }}>Client</th>
                      <th style={{ width: '180px' }}>Type</th>
                      <th style={{ width: '120px' }}>Code</th>
                      <th style={{ width: '120px' }}>Est. Time</th>
                      <th>Script / Work Link Input</th>
                      <th style={{ width: '150px', textAlign: 'center' }}>Status</th>
                      <th style={{ width: '150px', textAlign: 'center' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedList.map(item => {
                      const key = item.isJobWork ? `job_${item.id}` : item.isEventDay ? `event_${item.id}` : `deliv_${item.id}`;
                      const hasLink = links[key] && links[key].trim();
                      const today = new Date();
                      const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
                      
                      // Status Evaluation
                      const isCompleted = item.isJobWork
                        ? (
                            ['approved', 'completed', 'posted'].includes((item.status || '').toLowerCase()) ||
                            (item.assigned_employee_id !== null && Number(item.assigned_employee_id) !== Number(item.content_writer_id))
                          )
                        : item.submission_status === 'approved';

                      const isSubmitted = item.isJobWork
                        ? (item.status || '').toLowerCase() === 'submitted'
                        : item.submission_status === 'submitted';

                      const itemDateStr = parseLocalDateStr(item.date || item.deadline || item.created_at || item.due_date);

                      let statusBadge = { label: 'Undone', bg: '#fffbeb', color: '#ca8a04', border: '1px solid #fef3c7' };
                      if (isCompleted) {
                        statusBadge = { label: 'Completed', bg: '#eefdf2', color: '#15803d', border: '1px solid #c2e7cc' };
                      } else if (isSubmitted) {
                        statusBadge = { label: 'Send to Approval', bg: '#fff7ed', color: '#ea580c', border: '1px solid #ffedd5' };
                      } else if ((item.status || '').toLowerCase() === 'reassigned') {
                        statusBadge = { label: 'Rework', bg: '#fff1f2', color: '#e11d48', border: '1px solid #fecdd3' };
                      } else if (itemDateStr && itemDateStr < todayStr) {
                        statusBadge = { label: 'Pending (Overdue)', bg: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca' };
                      }

                      const displayClient = item.isEventDay ? 'Event Calendar' : (item.client_name || 'Generic Client');
                      let displayTitle = item.isJobWork ? (item.activity_name || item.deliverable || 'Job Work') : (item.activity_name || item.title || 'Brief Title');
                      if (item.isJobWork && item.quantity) {
                        displayTitle += ` (Qty: ${item.quantity})`;
                      }
                      const displayCode = item.isEventDay ? `EVT-${item.id}` : (item.activity_code || `JOB-${item.id}`);

                      return (
                        <tr key={key} style={{ verticalAlign: 'middle' }}>
                          <td style={{ fontWeight: 700 }}>
                            {itemDateStr ? (
                              (() => {
                                const [y, m, d] = itemDateStr.split('-').map(Number);
                                return new Date(y, m - 1, d).toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
                              })()
                            ) : 'N/A'}
                          </td>
                          <td style={{ fontWeight: 700 }}>{displayClient}</td>
                          <td>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                              <span style={{ fontWeight: 600, fontSize: '13px' }}>{displayTitle}</span>
                              {(item.isEventDay || item.is_event_day === 1 || item.activity_type_code === 'AT006') && (
                                <span style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '3px',
                                  padding: '2px 8px',
                                  borderRadius: '10px',
                                  backgroundColor: '#fef3c7',
                                  color: '#d97706',
                                  border: '1px solid #fcd34d',
                                  fontSize: '10px',
                                  fontWeight: 800,
                                  marginTop: '3px',
                                  width: 'fit-content',
                                  textTransform: 'uppercase'
                                }}>
                                  📅 EVENT WORK
                                </span>
                              )}
                              {item.description && (
                                <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', maxWidth: '250px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={item.description}>
                                  {item.description}
                                </span>
                              )}
                            </div>
                          </td>
                          <td>
                            <span style={{ fontFamily: 'monospace', fontWeight: 800, padding: '3px 6px', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', borderRadius: '4px', fontSize: '11px' }}>
                              {displayCode}
                            </span>
                          </td>
                          <td style={{ fontWeight: 600, fontSize: '13px' }}>
                            {getContentTime(item.activity_type_code)}
                          </td>
                          <td>
                            {isCompleted || isSubmitted ? (
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <a 
                                  href={ensureExternalLink(item.work_link || item.content_link || item.google_drive_link || item.drive_link)} 
                                  target="_blank" 
                                  rel="noopener noreferrer" 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    const link = ensureExternalLink(item.work_link || item.content_link || item.google_drive_link || item.drive_link);
                                    if (link && link !== '#') {
                                      window.open(link, '_blank');
                                    }
                                  }}
                                  style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: 'var(--primary)', fontWeight: 700, fontSize: '12px' }}
                                >
                                  Open Submitted Work Link <ExternalLink size={12} />
                                </a>
                              </div>
                            ) : (
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <input
                                  type="url"
                                  placeholder="Paste script or work document link here..."
                                  className="form-control"
                                  value={links[key] || ''}
                                  onChange={(e) => handleLinkChange(key, e.target.value)}
                                  style={{ fontSize: '12px', padding: '6px 10px', margin: 0, flex: 1 }}
                                />
                                {hasLink && (
                                  <a 
                                    href={ensureExternalLink(links[key])} 
                                    target="_blank" 
                                    rel="noreferrer" 
                                    className="btn btn-secondary btn-sm"
                                    style={{ padding: '6px 8px', display: 'inline-flex', alignItems: 'center', height: '34px' }}
                                    title="Open Link"
                                  >
                                    <ExternalLink size={14} />
                                  </a>
                                )}
                              </div>
                            )}
                          </td>
                          <td style={{ textAlign: 'center' }}>
                            <span style={{ 
                              fontSize: '11px', 
                              fontWeight: 800, 
                              padding: '4px 10px', 
                              borderRadius: '99px',
                              textTransform: 'uppercase',
                              backgroundColor: statusBadge.bg,
                              color: statusBadge.color,
                              border: statusBadge.border
                            }}>
                              {statusBadge.label}
                            </span>
                            {item.remarks && (
                              <span style={{ fontSize: '10px', color: 'var(--danger)', fontStyle: 'italic', display: 'block', marginTop: '4px' }}>
                                Rework: {item.remarks}
                              </span>
                            )}
                          </td>
                          <td style={{ textAlign: 'center' }}>
                            {isCompleted || isSubmitted ? (
                              <span style={{ fontSize: '12px', color: 'var(--success)', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                <CheckCircle size={14} /> Sent
                              </span>
                            ) : (
                              <button
                                onClick={() => handleWriterSubmitLink(item)}
                                disabled={submittingId === key || !hasLink}
                                className="btn btn-primary btn-sm"
                                style={{ padding: '6px 12px', fontWeight: 700 }}
                              >
                                {submittingId === key ? 'Submitting...' : 'Submit Work'}
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {totalWriterPages > 1 && (
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
                    Showing <strong>{((currentPage - 1) * writerItemsPerPage) + 1}</strong> to <strong>{Math.min(currentPage * writerItemsPerPage, filteredList.length)}</strong> of <strong>{filteredList.length}</strong> items
                  </span>
                  {renderWriterPagination()}
                </div>
              )}
            </>
          )}
        {/* Start Task Confirmation Modal */}
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
    </div>
  );
  }

  // -------------------------------------------------------------
  // VIEW RENDERER (2: DESIGNER & EDITOR VIEW)
  // -------------------------------------------------------------
  return (
    <div style={{ padding: '30px', maxWidth: '1400px', margin: '0 auto' }}>
      
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-color)', display: 'flex', alignItems: 'center', gap: '10px', margin: 0 }}>
            <Briefcase size={26} style={{ color: 'var(--primary)' }} />
            Daily Tasks & To-Do List
          </h1>
          <p style={{ margin: '6px 0 0 0', color: 'var(--text-muted)', fontSize: '13px' }}>
            Manage your daily tasks, priority job works, and track pending items.
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button className="btn btn-secondary" onClick={fetchDesignerData} disabled={loading} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <RefreshCw size={14} /> Refresh Tasks
          </button>
          
          <button 
            className="btn btn-primary"
            onClick={handleDesignerBulkSubmit}
            disabled={loading || bulkSubmitting || designerItems.length === 0}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontWeight: 700 }}
          >
            <Send size={14} /> {bulkSubmitting ? 'Submitting...' : 'Submit All Work'}
          </button>
        </div>
      </div>

      {/* Tabs Layout */}
      <div style={{ 
        display: 'flex', 
        gap: '4px', 
        marginBottom: '20px', 
        borderBottom: '1px solid var(--border-color)', 
        paddingBottom: '0' 
      }}>
        {[
          { id: 'today', label: "Today's Work" },
          { id: 'pending', label: 'Pending Work' },
          { id: 'job_work', label: 'Job Work' },
          { id: 'deliverables', label: 'Monthly Deliverables' }
        ].map(t => (
          <button 
            key={t.id}
            onClick={() => {
              setDesignerTab(t.id);
              setDesignerPage(1);
            }}
            style={{
              padding: '10px 20px',
              fontWeight: 700,
              fontSize: '14px',
              border: 'none',
              background: 'none',
              color: designerTab === t.id ? 'var(--primary)' : 'var(--text-muted)',
              borderBottom: designerTab === t.id ? '2px solid var(--primary)' : 'none',
              cursor: 'pointer',
              transition: 'all 0.2s',
              outline: 'none'
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Toolbar: Month/Date Filters, Status Sub-tabs & Search */}
      <div className="table-toolbar" style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '16px 20px', backgroundColor: '#fff', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md) var(--radius-md) 0 0', borderBottom: 'none' }}>
        
        {/* Row 1: Month & Date Filter Inputs */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          {['job_work', 'deliverables'].includes(designerTab) ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)' }}>Month Filter</label>
                <input 
                  type="month" 
                  value={filterMonth} 
                  onChange={(e) => {
                    const newMonth = e.target.value;
                    setFilterMonth(newMonth);
                    setFilterDate(`${newMonth}-01`);
                  }}
                  style={{ padding: '6px 10px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', outline: 'none', fontSize: '13px' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)' }}>Date Filter</label>
                <input 
                  type="date" 
                  value={filterDate} 
                  onChange={(e) => {
                    const newDate = e.target.value;
                    setFilterDate(newDate);
                    if (newDate) {
                      setFilterMonth(newDate.substring(0, 7));
                    }
                  }}
                  style={{ padding: '6px 10px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', outline: 'none', fontSize: '13px' }}
                />
              </div>
            </div>
          ) : designerTab === 'today' ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)' }}>Quick Day:</span>
              {[
                { id: 'yesterday', label: 'Yesterday' },
                { id: 'today', label: 'Today' },
                { id: 'tomorrow', label: 'Tomorrow' },
                { id: 'all', label: 'All Days' }
              ].map(b => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => {
                    setDesignerTodayFilterDay(b.id);
                    setDesignerPage(1);
                  }}
                  style={{
                    padding: '5px 12px',
                    fontSize: '12px',
                    fontWeight: 700,
                    borderRadius: '20px',
                    border: '1px solid',
                    borderColor: designerTodayFilterDay === b.id ? 'var(--primary)' : 'var(--border-color)',
                    backgroundColor: designerTodayFilterDay === b.id ? 'var(--primary)' : '#ffffff',
                    color: designerTodayFilterDay === b.id ? '#ffffff' : 'var(--text-main)',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  {b.label}
                </button>
              ))}
            </div>
          ) : (
            <div />
          )}

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: '99px', backgroundColor: 'var(--primary-light)', border: '1px solid var(--primary)', color: 'var(--primary)', fontWeight: 700, fontSize: '13px' }}>
            <span>Total Tasks:</span>
            <strong style={{ fontSize: '15px' }}>{filteredDesignerList.length}</strong>
          </div>
        </div>

        {/* Row 2: Status Sub-tabs, Search & Top Pagination */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
          
          {/* Status filter tabs */}
          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
            {[
              { id: 'all', label: 'All Tasks', bg: 'var(--bg-light)', color: 'var(--text-main)', border: '1px solid var(--border-color)' },
              { id: 'undone', label: 'Undone', bg: '#fffbeb', color: '#ca8a04', border: '1px solid #fef3c7' },
              { id: 'pending', label: 'Pending', bg: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca' },
              { id: 'submitted', label: 'Sent to Approval', bg: '#fff7ed', color: '#ea580c', border: '1px solid #ffedd5' },
              { id: 'completed', label: 'Completed', bg: '#eefdf2', color: '#15803d', border: '1px solid #c2e7cc' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  setDesignerStatusTab(tab.id);
                  setDesignerPage(1);
                }}
                className={`btn btn-sm`}
                style={{
                  fontWeight: 700,
                  fontSize: '12px',
                  padding: '6px 14px',
                  borderRadius: '99px',
                  backgroundColor: designerStatusTab === tab.id ? tab.color : '#fff',
                  color: designerStatusTab === tab.id ? '#fff' : tab.color,
                  border: `1.5px solid ${tab.color}`,
                  cursor: 'pointer',
                  boxShadow: designerStatusTab === tab.id ? '0 2px 4px rgba(0,0,0,0.05)' : 'none',
                  transition: 'all 0.2s'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flex: 1, justifyContent: 'flex-end' }}>
            <div style={{ position: 'relative', width: '100%', maxWidth: '300px' }}>
              <Search style={{ position: 'absolute', left: '12px', top: '10px', color: 'var(--text-muted)' }} size={16} />
              <input
                type="text"
                placeholder="Search client or title..."
                className="form-control"
                value={designerSearch}
                onChange={(e) => setDesignerSearch(e.target.value)}
                style={{ width: '100%', paddingLeft: '36px', fontSize: '13px', margin: 0 }}
              />
            </div>
            {totalDesignerPages > 1 && renderDesignerPagination()}
          </div>
        </div>
      </div>

      {/* Main Designer Table */}
      <div className="card" style={{ padding: '20px', borderRadius: '0 0 var(--radius-md) var(--radius-md)', minHeight: '300px' }}>
        {loading ? (
          <div style={{ padding: '80px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <div style={{ width: '32px', height: '32px', border: '3px solid #e2e8f0', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 12px auto' }}></div>
            <span>Loading assigned tasks...</span>
          </div>
        ) : filteredDesignerList.length === 0 ? (
          <div style={{ padding: '60px 40px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <CheckCircle size={40} style={{ margin: '0 auto 12px auto', color: 'var(--success)', opacity: 0.8 }} />
            <h3 style={{ margin: 0, fontWeight: 700, color: 'var(--text-color)' }}>No assigned tasks</h3>
            <p style={{ margin: '4px 0 0 0', fontSize: '13px' }}>
              Your workspace is clear! No deliverables match the selected filters.
            </p>
          </div>
        ) : (
          <>
            <div style={{ overflowX: 'auto' }}>
              <table className="enterprise-table" style={{ width: '100%', minWidth: '1100px' }}>
                <thead>
                  <tr>
                    <th style={{ width: '120px' }}>Due Date</th>
                    <th style={{ width: '180px' }}>Client Name</th>
                    <th style={{ width: '220px' }}>Activity Name</th>
                    <th style={{ width: '140px' }}>Activity Code</th>
                    <th style={{ width: '120px' }}>Time</th>
                    <th>Script / Content</th>
                    <th style={{ width: '280px' }}>Submit Work Link</th>
                    <th style={{ width: '150px', textAlign: 'center' }}>Status</th>
                    <th style={{ width: '140px', textAlign: 'center' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedDesignerList.map(item => {
                    const key = item.isJobWork ? `job_${item.id}` : `deliv_${item.id}`;
                    const linkValue = designerLinks[key] || '';
                    const hasLink = linkValue.trim();

                    const status = (item.status || '').toLowerCase();
                    const isCompleted = ['approved', 'client_approved', 'completed', 'posted'].includes(status);
                    const isSubmitted = ['submitted', 'sent_to_client'].includes(status);

                    const todayStr = parseLocalDateStr(new Date());
                    const itemDateStr = parseLocalDateStr(item.due_date || item.deadline || item.created_at || item.date);

                    let statusBadge = { label: 'Undone', bg: '#fffbeb', color: '#ca8a04', border: '1px solid #fef3c7' };
                    if (isCompleted) {
                      statusBadge = { label: 'Completed', bg: '#eefdf2', color: '#15803d', border: '1px solid #c2e7cc' };
                    } else if (isSubmitted) {
                      statusBadge = { label: 'Send to Approval', bg: '#fff7ed', color: '#ea580c', border: '1px solid #ffedd5' };
                    } else if (status === 'reassigned') {
                      statusBadge = { label: 'Rework', bg: '#fff1f2', color: '#e11d48', border: '1px solid #fecdd3' };
                    } else if (itemDateStr && itemDateStr < todayStr) {
                      statusBadge = { label: 'Pending (Overdue)', bg: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca' };
                    }

                    return (
                      <tr key={key} style={{ verticalAlign: 'middle' }}>
                        {/* 1. Due Date */}
                        <td style={{ fontWeight: 700 }}>
                          {itemDateStr ? (
                            (() => {
                              const [y, m, d] = itemDateStr.split('-').map(Number);
                              return new Date(y, m - 1, d).toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
                            })()
                          ) : 'N/A'}
                        </td>
                        
                        {/* 2. Client Name */}
                        <td style={{ fontWeight: 700 }}>
                          {item.client_name || 'Event Day'}
                        </td>

                        {/* 3. Activity Name */}
                        <td>
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontWeight: 600, fontSize: '13px' }}>
                              {item.activity_name || item.deliverable || item.activity_type_code}
                              {item.isJobWork && item.quantity && ` (Qty: ${item.quantity})`}
                            </span>
                            {(item.is_event_day === 1 || item.activity_type_code === 'AT006' || item.isEventDay) && (
                              <span style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '3px',
                                padding: '2px 8px',
                                borderRadius: '10px',
                                backgroundColor: '#fef3c7',
                                color: '#d97706',
                                border: '1px solid #fcd34d',
                                fontSize: '10px',
                                fontWeight: 800,
                                marginTop: '3px',
                                width: 'fit-content',
                                textTransform: 'uppercase'
                              }}>
                                📅 EVENT WORK
                              </span>
                            )}
                          </div>
                        </td>

                        {/* 4. Activity Code */}
                        <td>
                          {item.activity_code ? (
                            <span style={{ fontFamily: 'monospace', fontSize: '11px', color: 'var(--primary)', fontWeight: 700, padding: '3px 6px', backgroundColor: 'var(--primary-light)', borderRadius: '4px' }}>
                              {item.activity_code}
                            </span>
                          ) : (
                            <span style={{ color: 'var(--text-muted)', fontSize: '11px', fontStyle: 'italic' }}>N/A</span>
                          )}
                        </td>

                        {/* 5. Time */}
                        <td style={{ fontWeight: 600 }}>
                          {getEditorTime(item.activity_type_code)}
                        </td>

                        {/* 6. Content Link */}
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
                            <span className="badge badge-pending" style={{ textTransform: 'uppercase', fontSize: '10px' }}>
                              Pending Content
                            </span>
                          )}
                        </td>

                        {/* 7. Work Link */}
                        <td>
                          {isCompleted || isSubmitted ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                               <a 
                                 href={ensureExternalLink(item.google_drive_link || item.designer_output || item.work_link || item.content_link)} 
                                 target="_blank" 
                                 rel="noopener noreferrer" 
                                 onClick={(e) => {
                                   e.stopPropagation();
                                   const link = ensureExternalLink(item.google_drive_link || item.designer_output || item.work_link || item.content_link);
                                   if (link && link !== '#') {
                                     window.open(link, '_blank');
                                   }
                                 }}
                                 style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: 'var(--primary)', fontWeight: 700, fontSize: '12px' }}
                               >
                                 Open Submitted Design <ExternalLink size={12} />
                               </a>
                            </div>
                          ) : (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                               <input
                                 type="url"
                                 placeholder="Paste Google Drive / Design Link here..."
                                 className="form-control"
                                 value={linkValue}
                                 onChange={(e) => handleDesignerLinkChange(key, e.target.value)}
                                 style={{ fontSize: '12px', padding: '6px 10px', margin: 0, flex: 1 }}
                               />
                               {hasLink && (
                                 <a 
                                   href={ensureExternalLink(linkValue)} 
                                   target="_blank" 
                                   rel="noreferrer" 
                                   className="btn btn-secondary btn-sm"
                                   style={{ padding: '6px 8px', display: 'inline-flex', alignItems: 'center', height: '34px' }}
                                   title="Open Link"
                                 >
                                   <ExternalLink size={14} />
                                 </a>
                               )}
                             </div>
                           )}
                         </td>
 
                         {/* 8. Status Column */}
                         <td style={{ textAlign: 'center' }}>
                           <span style={{ 
                             fontSize: '11px', 
                             fontWeight: 800, 
                             padding: '4px 10px', 
                             borderRadius: '99px',
                             textTransform: 'uppercase',
                             backgroundColor: statusBadge.bg,
                             color: statusBadge.color,
                             border: statusBadge.border
                           }}>
                             {statusBadge.label}
                           </span>
                           {item.remarks && (
                             <span style={{ fontSize: '10px', color: 'var(--danger)', fontStyle: 'italic', display: 'block', marginTop: '4px' }}>
                               Rework: {item.remarks}
                             </span>
                           )}
                         </td>
 
                         {/* 9. Action Button */}
                         <td style={{ textAlign: 'center' }}>
                           {isCompleted || isSubmitted ? (
                             <span style={{ fontSize: '12px', color: 'var(--success)', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                               <CheckCircle size={14} /> Sent
                             </span>
                           ) : (
                             <button
                               onClick={() => handleSubmitDesignerWork(item)}
                               disabled={submittingId === key || !hasLink}
                               className="btn btn-primary btn-sm"
                               style={{ padding: '6px 12px', fontWeight: 700 }}
                             >
                               {submittingId === key ? 'Sending...' : 'Submit Work'}
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
            {totalDesignerPages > 1 && (
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
                  Showing <strong>{((designerPage - 1) * itemsPerPage) + 1}</strong> to <strong>{Math.min(designerPage * itemsPerPage, filteredDesignerList.length)}</strong> of <strong>{filteredDesignerList.length}</strong> items
                </span>
                {renderDesignerPagination()}
              </div>
            )}
          </>
        )}
      </div>

      {/* Start Task Confirmation Modal */}
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

export default EmployeeAssignedWork;
