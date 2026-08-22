import React, { useState, useEffect, useCallback } from 'react';
import { CheckCircle, XCircle, Clock, ShieldAlert, Phone, User, Globe, Hash, MapPin, Briefcase, Calendar, AlertCircle, ExternalLink, RefreshCw, ChevronLeft, ChevronRight, Check, Mic, Square, Trash2 } from 'lucide-react';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import Modal from '../../components/Modal';

const ensureExternalLink = (url) => {
  if (!url) return '';
  const trimmed = url.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }
  return `https://${trimmed}`;
};

const formatMonthDisplay = (monthStr) => {
  if (!monthStr || !monthStr.includes('-')) return monthStr || '';
  const parts = monthStr.split('-');
  if (parts.length < 2) return monthStr;
  const year = parts[0];
  const month = parseInt(parts[1], 10);
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  if (month < 1 || month > 12) return monthStr;
  return `${months[month - 1]} ${year}`;
};

const formatMonthDisplayShort = (monthStr) => {
  if (!monthStr || !monthStr.includes('-')) return monthStr || '';
  const parts = monthStr.split('-');
  if (parts.length < 2) return monthStr;
  const year = parts[0];
  const month = parseInt(parts[1], 10);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  if (month < 1 || month > 12) return monthStr;
  return `${months[month - 1]} ${year}`;
};

const ClientPortal = ({ activeTabProp }) => {
  const { logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [approvals, setApprovals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Action Modal State
  const [selectedApproval, setSelectedApproval] = useState(null);
  const [actionType, setActionType] = useState(''); // 'approved' or 'rejected'
  const [remarks, setRemarks] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  // Tab State
  const [activeTab, setActiveTab] = useState(activeTabProp || 'dashboard');

  useEffect(() => {
    if (activeTabProp) {
      setActiveTab(activeTabProp);
    }
  }, [activeTabProp]);
  
  // Skyline Deliverables Review State
  const [skylineDeliverables, setSkylineDeliverables] = useState([]);
  const [skylineLoading, setSkylineLoading] = useState(false);
  const [isReworkModalOpen, setIsReworkModalOpen] = useState(false);
  const [reworkRemarks, setReworkRemarks] = useState('');
  const [reworkRemarksItem, setReworkRemarksItem] = useState(null);

  // Month filter, selection, and paging for client approvals
  const [delivMonth, setDelivMonth] = useState(() => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
  });
  const [selectedIds, setSelectedIds] = useState([]);
  const [delivPage, setDelivPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('sent_to_client');

  // Central Voice Notes Recorder for Client Rework
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [recordingStatus, setRecordingStatus] = useState('idle'); // idle | recording
  const [audioUrl, setAudioUrl] = useState(null);
  const [audioBase64, setAudioBase64] = useState(null);
  const [recordDuration, setRecordDuration] = useState(0);

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
      
      const timer = setInterval(() => {
        setRecordDuration(prev => prev + 1);
      }, 1000);
      
      recorder.stream.getTracks().forEach(track => {
        track.onended = () => clearInterval(timer);
      });
      
      recorder.timerId = timer;
    } catch (err) {
      console.error('Failed to start recording:', err.message);
      alert('Please grant microphone access to record audio.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && recordingStatus === 'recording') {
      mediaRecorder.stop();
      mediaRecorder.stream.getTracks().forEach(track => track.stop());
      if (mediaRecorder.timerId) {
        clearInterval(mediaRecorder.timerId);
      }
      setRecordingStatus('idle');
    }
  };

  const resetAudio = () => {
    setAudioUrl(null);
    setAudioBase64(null);
    setRecordDuration(0);
  };

  const handlePrevDelivMonth = () => {
    const [year, month] = delivMonth.split('-').map(Number);
    const date = new Date(year, month - 2, 1);
    setDelivMonth(`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`);
    setDelivPage(1);
    setSelectedIds([]);
  };

  const handleNextDelivMonth = () => {
    const [year, month] = delivMonth.split('-').map(Number);
    const date = new Date(year, month, 1);
    setDelivMonth(`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`);
    setDelivPage(1);
    setSelectedIds([]);
  };

  const handleBulkApprove = async () => {
    if (selectedIds.length === 0) return;
    setActionLoading(true);
    try {
      await Promise.all(selectedIds.map(async (key) => {
        const isJobWork = key.startsWith('job_');
        const id = Number(key.replace('job_', '').replace('deliv_', ''));
        if (isJobWork) {
          await api.put(`/client-portal/job-works/${id}/review`, { action: 'approve' });
        } else {
          await api.put(`/client-portal/deliverables/${id}/review`, { action: 'approve' });
        }
      }));
      alert('Selected deliverables approved successfully.');
      setSelectedIds([]);
      fetchSkylineDeliverables();
    } catch (err) {
      console.error('Error during bulk approval:', err);
      alert('Failed to approve some deliverables.');
    } finally {
      setActionLoading(false);
    }
  };
  
  // Monthly Reports State
  const [sentReports, setSentReports] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [reportDetail, setReportDetail] = useState(null);
  const [reportLoading, setReportLoading] = useState(false);

  const fetchSentReports = useCallback(async () => {
    try {
      const res = await api.get('/client-portal/reports');
      if (res.data.success) {
        const list = res.data.data.reports || [];
        setSentReports(list);
        setSelectedMonth(prev => prev || (list.length > 0 ? list[0].month : ''));
      }
    } catch (err) {
      console.error('Error fetching client reports:', err.message);
    }
  }, []);

  const fetchSkylineDeliverables = useCallback(async () => {
    setSkylineLoading(true);
    try {
      const [delivsRes, jobsRes] = await Promise.all([
        api.get('/client-portal/deliverables'),
        api.get('/client-portal/job-works')
      ]);

      let combined = [];

      if (delivsRes.data.success) {
        const list = delivsRes.data.data.deliverables || [];
        combined = [...combined, ...list.map(d => ({ ...d, isJobWork: false }))];
      }

      if (jobsRes.data.success) {
        const list = jobsRes.data.data.jobWorks || [];
        combined = [...combined, ...list.map(j => ({ 
          ...j, 
          isJobWork: true,
          deliverable: j.activity_name || j.activity_type_code
        }))];
      }

      setSkylineDeliverables(combined);
      console.log('ClientPortal: fetched combined deliverables:', combined);
    } catch (err) {
      console.error('Error fetching skyline deliverables:', err.message);
    } finally {
      setSkylineLoading(false);
    }
  }, []);

  const handleApproveSkylineDeliverable = async (item) => {
    try {
      const endpoint = item.isJobWork
        ? `/client-portal/job-works/${item.id}/review`
        : `/client-portal/deliverables/${item.id}/review`;

      const res = await api.put(endpoint, { action: 'approve' });
      if (res.data.success) {
        alert('Item approved successfully.');
        fetchSkylineDeliverables();
      }
    } catch (err) {
      console.error('Approve failed:', err.message);
      alert('Failed to approve deliverable.');
    }
  };

  const getMonthForDel = (del) => {
    if (!del) return '';
    if (!del.isJobWork) return del.month || '';
    return del.created_at ? del.created_at.substring(0, 7) : '';
  };

  const filteredDelivs = skylineDeliverables.filter(del => {
    const itemMonth = getMonthForDel(del);
    if (itemMonth !== delivMonth) return false;

    if (statusFilter !== 'all') {
      const status = (del.status || '').toLowerCase();
      if (statusFilter === 'sent_to_client') {
        if (status !== 'sent_to_client') return false;
      } else if (statusFilter === 'client_approved') {
        if (status !== 'client_approved' && status !== 'approved' && status !== 'completed') return false;
      } else if (statusFilter === 'client_rework') {
        if (status !== 'client_rework') return false;
      }
    }

    return true;
  });

  const totalDelivPages = Math.ceil(filteredDelivs.length / 10);
  const paginatedItems = filteredDelivs.slice((delivPage - 1) * 10, delivPage * 10);

  const renderDelivPagination = () => {
    if (totalDelivPages <= 1) return null;
    return (
      <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
        <button
          className="pagination-btn"
          disabled={delivPage === 1}
          onClick={() => setDelivPage(p => p - 1)}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '32px', height: '32px', border: '1px solid var(--border-color)', borderRadius: '4px', backgroundColor: '#fff', cursor: delivPage === 1 ? 'not-allowed' : 'pointer', opacity: delivPage === 1 ? 0.5 : 1 }}
        >
          <ChevronLeft size={16} />
        </button>
        {Array.from({ length: totalDelivPages }).map((_, i) => (
          <button
            key={i}
            className={`pagination-btn ${delivPage === i + 1 ? 'active' : ''}`}
            onClick={() => setDelivPage(i + 1)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: '32px',
              height: '32px',
              border: '1px solid var(--border-color)',
              borderRadius: '4px',
              backgroundColor: delivPage === i + 1 ? 'var(--primary)' : '#fff',
              color: delivPage === i + 1 ? '#fff' : 'var(--text-color)',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            {i + 1}
          </button>
        ))}
        <button
          className="pagination-btn"
          disabled={delivPage === totalDelivPages}
          onClick={() => setDelivPage(p => p + 1)}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '32px', height: '32px', border: '1px solid var(--border-color)', borderRadius: '4px', backgroundColor: '#fff', cursor: delivPage === totalDelivPages ? 'not-allowed' : 'pointer', opacity: delivPage === totalDelivPages ? 0.5 : 1 }}
        >
          <ChevronRight size={16} />
        </button>
      </div>
    );
  };

  const handleOpenReworkModal = (item) => {
    setReworkRemarksItem(item);
    setReworkRemarks('');
    resetAudio();
    setIsReworkModalOpen(true);
  };

  const handleSubmitRework = async () => {
    if (!reworkRemarks.trim()) {
      alert('Please specify the correction details (write comments).');
      return;
    }
    try {
      const endpoint = reworkRemarksItem.isJobWork
        ? `/client-portal/job-works/${reworkRemarksItem.id}/review`
        : `/client-portal/deliverables/${reworkRemarksItem.id}/review`;

      const payload = { 
        action: 'rework', 
        feedbackText: reworkRemarks,
        voiceBase64: null
      };

      let res;
      try {
        res = await api.post(endpoint, payload);
      } catch (_) {
        res = await api.put(endpoint, payload);
      }

      if (res && res.data && res.data.success) {
        alert('Rework feedback submitted successfully.');
        setIsReworkModalOpen(false);
        setReworkRemarksItem(null);
        resetAudio();
        fetchPortalData();
      }
    } catch (err) {
      console.error('Rework submit failed:', err.message);
      alert('Failed to submit rework.');
    }
  };

  const fetchPortalData = useCallback(async () => {
    setLoading(true);
    setError('');

    const fetchSafe = async (url) => {
      try {
        const res = await api.get(url);
        return res.data && res.data.success ? res.data.data : null;
      } catch (_) {
        return null;
      }
    };

    try {
      const [profileData, approvalsData, reportsData, delivsData, jobsData] = await Promise.all([
        fetchSafe('/client-portal/profile'),
        fetchSafe('/client-portal/approvals'),
        fetchSafe('/client-portal/reports'),
        fetchSafe('/client-portal/deliverables'),
        fetchSafe('/client-portal/job-works')
      ]);

      if (profileData && profileData.profile) {
        setProfile(profileData.profile);
      } else {
        const savedUser = JSON.parse(localStorage.getItem('erp_user') || '{}');
        setProfile({
          id: savedUser.id || 1,
          client_id_code: 'C0001',
          company_name: savedUser.full_name || 'Rk hospitality',
          client_name: savedUser.username || 'rk',
          phone: '+919944226490',
          email: savedUser.email || 'rk@rkhospitality.com',
          status: 'active'
        });
      }
      
      if (approvalsData) {
        setApprovals(approvalsData.approvals || []);
      }

      if (reportsData) {
        const list = reportsData.reports || [];
        setSentReports(list);
        setSelectedMonth(prev => prev || (list.length > 0 ? list[0].month : ''));
      }

      let combined = [];
      if (delivsData && delivsData.deliverables) {
        combined = [...combined, ...delivsData.deliverables.map(d => ({ ...d, isJobWork: false }))];
      }
      if (jobsData && jobsData.jobWorks) {
        combined = [...combined, ...jobsData.jobWorks.map(j => ({ 
          ...j, 
          isJobWork: true,
          deliverable: j.activity_name || j.activity_type_code
        }))];
      }
      setSkylineDeliverables(combined);

    } catch (err) {
      console.error('Error loading client portal:', err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchReportDetail = useCallback(async () => {
    if (!selectedMonth) return;
    setReportLoading(true);
    try {
      const res = await api.get('/client-portal/reports/detail', {
        params: { month: selectedMonth }
      });
      if (res.data.success) {
        setReportDetail(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching report details:', err.message);
      setReportDetail(null);
    } finally {
      setReportLoading(false);
    }
  }, [selectedMonth]);

  useEffect(() => {
    fetchPortalData();
  }, [fetchPortalData, activeTabProp]); // Re-run when tab changes to refresh data

  useEffect(() => {
    if (activeTab === 'reports') {
      fetchReportDetail();
    }
  }, [fetchReportDetail, activeTab]);

  const handleOpenActionModal = (approval, type) => {
    setSelectedApproval(approval);
    setActionType(type);
    setRemarks('');
    setError('');
  };

  const handleConfirmAction = async () => {
    if (!selectedApproval) return;
    setActionLoading(true);
    setError('');
    try {
      const res = await api.post(`/client-portal/approvals/${selectedApproval.id}/action`, {
        status: actionType,
        remarks: remarks
      });

      if (res.data.success) {
        setSelectedApproval(null);
        fetchPortalData();
      }
    } catch (err) {
      console.error('Failed to submit approval action:', err.message);
      setError(err.response?.data?.message || 'Action submission failed.');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '80vh', color: 'var(--text-muted)' }}>
        <div style={{ width: '32px', height: '32px', border: '3px solid #e2e8f0', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <div className="alert alert-danger" style={{ maxWidth: '600px', margin: '0 auto' }}>
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '30px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Portal Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 800, color: 'var(--text-color)' }}>
            Welcome, {profile?.company_name}
          </h1>
          <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: 'var(--text-muted)' }}>
            {activeTab === 'dashboard' ? 'Client Collaboration and Work Approvals Portal' : 
             activeTab === 'approvals' ? 'Review pending drafts and media assets requested for approval' :
             activeTab === 'reachskyline_approvals' ? 'Review and approve design deliverables sent to you by the production team' :
             activeTab === 'reports' ? 'View monthly performance reports' :
             'Dedicated account manager and contact details'}
          </p>
        </div>
      </div>

      {activeTab === 'dashboard' && (
        <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr', gap: '24px', marginBottom: '30px' }}>
          {/* Profile Card */}
          <div style={{ backgroundColor: '#fff', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '24px', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: 800, color: 'var(--text-color)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <User size={18} className="text-primary" />
              Client Account Profile
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
              <div>
                <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-light)', textTransform: 'uppercase' }}>Client ID Code</span>
                <p style={{ margin: '4px 0 0 0', fontWeight: 700, color: 'var(--primary)', fontSize: '15px' }}>{profile?.client_id_code}</p>
              </div>
              <div>
                <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-light)', textTransform: 'uppercase' }}>Primary Contact Person</span>
                <p style={{ margin: '4px 0 0 0', fontWeight: 600 }}>{profile?.client_name}</p>
              </div>
              <div>
                <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-light)', textTransform: 'uppercase' }}>Contact Email</span>
                <p style={{ margin: '4px 0 0 0', fontWeight: 600 }}>{profile?.email}</p>
              </div>
              <div>
                <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-light)', textTransform: 'uppercase' }}>Contact Phone</span>
                <p style={{ margin: '4px 0 0 0', fontWeight: 600 }}>{profile?.phone}</p>
              </div>
              {/* GST Number removed */}
              <div>
                <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-light)', textTransform: 'uppercase' }}>Industry</span>
                <p style={{ margin: '4px 0 0 0', fontWeight: 600 }}>{profile?.industry}</p>
              </div>
              {profile?.website && (
                <div>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-light)', textTransform: 'uppercase' }}>Website</span>
                  <p style={{ margin: '4px 0 0 0', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Globe size={13} className="text-muted" />
                    <a href={ensureExternalLink(profile.website)} target="_blank" rel="noreferrer" style={{ color: 'var(--primary)', textDecoration: 'none' }}>{profile.website}</a>
                  </p>
                </div>
              )}
              <div>
                <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-light)', textTransform: 'uppercase' }}>Contract Start</span>
                <p style={{ margin: '4px 0 0 0', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Calendar size={13} className="text-muted" />
                  {profile?.start_date ? new Date(profile.start_date).toLocaleDateString([], { dateStyle: 'medium' }) : 'N/A'}
                </p>
              </div>
              <div>
                <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-light)', textTransform: 'uppercase' }}>Billing Address</span>
                <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: 'var(--text-muted)', whiteSpace: 'pre-line' }}>{profile?.address}</p>
              </div>
            </div>
          </div>

          {/* Assigned Skyline Contact Card */}
          <div style={{ backgroundColor: 'var(--bg-light)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: 800, color: 'var(--text-color)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Phone size={16} className="text-success" />
              ReachSkyline Contact
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--text-light)', margin: '0 0 16px 0' }}>
              Your dedicated account representative at ReachSkyline:
            </p>

            <div style={{ padding: '16px', backgroundColor: '#fff', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
              <span style={{ fontSize: '10px', fontWeight: 800, color: 'var(--text-light)', textTransform: 'uppercase' }}>Contact Person</span>
              <p style={{ margin: '2px 0 8px 0', fontWeight: 700, fontSize: '14px' }}>{profile?.contact_person || 'ReachSkyline Admin'}</p>

              <span style={{ fontSize: '10px', fontWeight: 800, color: 'var(--text-light)', textTransform: 'uppercase' }}>Phone Number</span>
              <p style={{ margin: '2px 0 0 0', fontWeight: 700, color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Phone size={12} />
                {profile?.contact_phone || '+91 99999 99999'}
              </p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'contact' && (
        <div style={{ backgroundColor: '#fff', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '24px', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
          <h2 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: 800, color: 'var(--text-color)' }}>
            ReachSkyline Dedicated Contact
          </h2>
          <p style={{ margin: '0 0 24px 0', fontSize: '13px', color: 'var(--text-muted)' }}>
            Below are the details of your assigned account manager and contact person at ReachSkyline. Feel free to reach out for any questions, campaign queries, or account support.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            <div style={{ display: 'flex', gap: '16px', padding: '20px', border: '1px solid var(--border-color)', borderRadius: '8px', backgroundColor: 'var(--bg-light)' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', alignSelf: 'center' }}>
                <User size={24} />
              </div>
              <div>
                <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-light)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Contact Person</span>
                <span style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-color)' }}>
                  {profile?.contact_person || 'ReachSkyline Admin'}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '16px', padding: '20px', border: '1px solid var(--border-color)', borderRadius: '8px', backgroundColor: 'var(--bg-light)' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'var(--success-light)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', alignSelf: 'center' }}>
                <Phone size={24} />
              </div>
              <div>
                <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-light)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Phone Number</span>
                <span style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-color)' }}>
                  {profile?.contact_phone || '+91 99999 99999'}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '16px', padding: '20px', border: '1px solid var(--border-color)', borderRadius: '8px', backgroundColor: 'var(--bg-light)' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', alignSelf: 'center' }}>
                <Globe size={24} />
              </div>
              <div>
                <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-light)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>ReachSkyline Portal</span>
                <a href={profile?.website || "https://reachskyline.com"} target="_blank" rel="noreferrer" style={{ fontSize: '16px', fontWeight: 700, color: 'var(--primary)', textDecoration: 'none' }}>
                  {profile?.website || "reachskyline.com"}
                </a>
              </div>
            </div>
          </div>
          
          {profile?.notes && (
            <div style={{ marginTop: '24px', padding: '20px', border: '1px solid var(--border-color)', borderRadius: '8px', borderLeft: '4px solid var(--primary)' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-light)', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>Important Account Notes</span>
              <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.5, whiteSpace: 'pre-line' }}>{profile.notes}</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'reachskyline_approvals' && (
        <div style={{ backgroundColor: '#fff', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h2 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: 'var(--text-color)' }}>
                Approval for ReachSkyline
              </h2>
              <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: 'var(--text-muted)' }}>
                Review and approve design deliverables sent to you by the production team.
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-muted)' }}>Status:</span>
                <select
                  className="form-control"
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setDelivPage(1);
                    setSelectedIds([]);
                  }}
                  style={{ minWidth: '150px', fontSize: '13px', padding: '6px 10px', height: '38px', margin: 0 }}
                >
                  <option value="all">All Statuses</option>
                  <option value="sent_to_client">New Approval</option>
                  <option value="client_approved">Approved</option>
                  <option value="client_rework">Rework</option>
                </select>
              </div>

              {selectedIds.length > 0 && (
                <button 
                  className="btn btn-success btn-sm"
                  onClick={handleBulkApprove}
                  disabled={actionLoading}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontWeight: 700, padding: '8px 16px' }}
                >
                  <Check size={14} /> Approve Selected ({selectedIds.length})
                </button>
              )}
              
              <button className="btn btn-secondary btn-sm" onClick={fetchSkylineDeliverables} disabled={skylineLoading} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', height: '38px' }}>
                <RefreshCw size={12} /> Refresh List
              </button>
            </div>
          </div>

          <div style={{ padding: '24px' }}>
            {/* Month Filter Picker */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              marginBottom: '24px',
              backgroundColor: 'var(--bg-light)',
              padding: '12px',
              borderRadius: '8px',
              border: '1px solid var(--border-color)',
              gap: '12px'
            }}>
              <button 
                type="button" 
                className="btn btn-secondary btn-sm" 
                onClick={handlePrevDelivMonth}
                style={{ padding: '6px 12px', fontWeight: 700 }}
              >
                &lt;
              </button>
              <span style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-color)', minWidth: '120px', textAlign: 'center' }}>
                {formatMonthDisplay(delivMonth)}
              </span>
              <button 
                type="button" 
                className="btn btn-secondary btn-sm" 
                onClick={handleNextDelivMonth}
                style={{ padding: '6px 12px', fontWeight: 700 }}
              >
                &gt;
              </button>
            </div>

            {skylineLoading ? (
              <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
                <div style={{ width: '28px', height: '28px', border: '3px solid #e2e8f0', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 12px auto' }}></div>
                <span>Loading deliverables...</span>
              </div>
            ) : filteredDelivs.length === 0 ? (
              <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)', backgroundColor: 'var(--bg-light)', borderRadius: '8px', border: '1px dashed var(--border-color)' }}>
                <CheckCircle size={40} style={{ color: 'var(--success)', margin: '0 auto 12px auto', opacity: 0.7 }} />
                <h4 style={{ margin: 0, fontWeight: 700, color: 'var(--text-color)' }}>No Deliverables Pending Review</h4>
                <p style={{ margin: '6px 0 0 0', fontSize: '13px' }}>
                  There are no design submissions waiting for your feedback in {formatMonthDisplay(delivMonth)}.
                </p>
              </div>
            ) : (
              <>
                <div style={{ overflowX: 'auto', marginBottom: '20px' }}>
                  <table className="enterprise-table" style={{ width: '100%', minWidth: '1000px' }}>
                    <thead>
                      <tr>
                        <th style={{ width: '40px', textAlign: 'center' }}>
                          <input 
                            type="checkbox"
                            checked={paginatedItems.filter(item => item.status === 'sent_to_client').length > 0 && paginatedItems.filter(item => item.status === 'sent_to_client').every(item => selectedIds.includes(item.isJobWork ? `job_${item.id}` : `deliv_${item.id}`))}
                            onChange={(e) => {
                              const isChecked = e.target.checked;
                              const pageKeys = paginatedItems.filter(item => item.status === 'sent_to_client').map(item => item.isJobWork ? `job_${item.id}` : `deliv_${item.id}`);
                              if (isChecked) {
                                setSelectedIds(prev => [...new Set([...prev, ...pageKeys])]);
                              } else {
                                setSelectedIds(prev => prev.filter(key => !pageKeys.includes(key)));
                              }
                            }}
                          />
                        </th>
                        <th style={{ width: '120px' }}>Type</th>
                        <th style={{ width: '220px' }}>Title</th>
                        <th style={{ width: '120px' }}>Month</th>
                        <th style={{ width: '130px' }}>Sent Date</th>
                        <th style={{ width: '180px', textAlign: 'center' }}>Design Asset</th>
                        <th style={{ width: '180px', textAlign: 'center' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedItems.map(del => {
                        const itemKey = del.isJobWork ? `job_${del.id}` : `deliv_${del.id}`;
                        const isSelected = selectedIds.includes(itemKey);
                        
                        return (
                          <tr key={itemKey} style={{ verticalAlign: 'middle' }}>
                            <td style={{ textAlign: 'center' }}>
                              {del.status === 'sent_to_client' ? (
                                <input 
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={(e) => {
                                    const isChecked = e.target.checked;
                                    if (isChecked) {
                                      setSelectedIds(prev => [...prev, itemKey]);
                                    } else {
                                      setSelectedIds(prev => prev.filter(k => k !== itemKey));
                                    }
                                  }}
                                />
                              ) : (
                                <span style={{ fontSize: '12px', color: '#cbd5e1' }}>-</span>
                              )}
                            </td>
                            <td>
                              <span className={`badge ${del.isJobWork ? 'badge-danger' : 'badge-primary'}`} style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 800, backgroundColor: del.isJobWork ? 'rgba(239, 68, 68, 0.15)' : 'rgba(99, 102, 241, 0.15)', color: del.isJobWork ? '#dc2626' : 'var(--primary)', border: 'none', display: 'inline-flex', padding: '4px 8px', borderRadius: '4px' }}>
                                {del.isJobWork ? 'Job Work' : 'Deliverable'}
                              </span>
                            </td>
                            <td style={{ fontWeight: 700, color: 'var(--text-color)' }}>
                              {del.deliverable}
                            </td>
                            <td style={{ fontWeight: 600, color: 'var(--text-muted)', fontSize: '13px' }}>
                              {formatMonthDisplayShort(getMonthForDel(del))}
                            </td>
                            <td style={{ fontWeight: 600, color: 'var(--text-muted)', fontSize: '13px' }}>
                              {del.sent_to_client_at ? new Date(del.sent_to_client_at).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A'}
                            </td>
                            <td style={{ textAlign: 'center' }}>
                              {del.google_drive_link ? (
                                <a 
                                  href={ensureExternalLink(del.google_drive_link)} 
                                  target="_blank" 
                                  rel="noreferrer" 
                                  className="btn btn-secondary btn-sm"
                                  style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '6px 12px', fontSize: '12px', fontWeight: 600 }}
                                >
                                  <ExternalLink size={12} /> View Assets
                                </a>
                              ) : (
                                <span style={{ fontSize: '12px', color: '#cbd5e1', fontStyle: 'italic' }}>No link</span>
                              )}
                            </td>
                            <td>
                              <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', alignItems: 'center' }}>
                                {['client_approved', 'approved', 'completed'].includes(del.status) ? (
                                  <span className="badge badge-success" style={{ padding: '6px 12px', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', backgroundColor: 'rgba(16, 185, 129, 0.15)', color: 'var(--success)', border: 'none' }}>
                                    Approved
                                  </span>
                                ) : del.status === 'client_rework' ? (
                                  <span className="badge badge-warning" style={{ padding: '6px 12px', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', backgroundColor: 'rgba(249, 115, 22, 0.15)', color: '#f97316', border: 'none' }}>
                                    Rework
                                  </span>
                                ) : (
                                  <>
                                    <button 
                                      className="btn btn-danger btn-sm"
                                      onClick={() => handleOpenReworkModal(del)}
                                      style={{ padding: '6px 12px', fontWeight: 700, fontSize: '12px' }}
                                    >
                                      Rework
                                    </button>
                                    <button 
                                      className="btn btn-success btn-sm"
                                      onClick={() => handleApproveSkylineDeliverable(del)}
                                      style={{ padding: '6px 12px', fontWeight: 700, fontSize: '12px' }}
                                    >
                                      Approve
                                    </button>
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Bottom Controls (Counts and Pagination) */}
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
                  <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 600 }}>
                    Showing {paginatedItems.length} of {filteredDelivs.length} deliverables
                  </span>
                  {renderDelivPagination()}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {activeTab === 'approvals' && (
        <div style={{ backgroundColor: '#fff', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-color)' }}>
            <h2 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: 'var(--text-color)' }}>
              Approval Requests
            </h2>
            <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: 'var(--text-muted)' }}>
              Review pending drafts and media assets requested for approval.
            </p>
          </div>

          <div style={{ overflowX: 'auto' }}>
            {approvals.length === 0 ? (
              <div style={{ padding: '60px 40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                <CheckCircle size={40} className="text-success" style={{ margin: '0 auto 12px auto', opacity: 0.6 }} />
                <h4 style={{ margin: 0, fontWeight: 700 }}>All Caught Up!</h4>
                <p style={{ margin: '4px 0 0 0', fontSize: '13px' }}>
                  No approval requests have been submitted for your review.
                </p>
              </div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border-color)', backgroundColor: 'var(--bg-light)', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '16px 24px', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', width: '80px' }}>ID</th>
                    <th style={{ padding: '16px 24px', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase' }}>Subject/Title</th>
                    <th style={{ padding: '16px 24px', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase' }}>Description / Assets</th>
                    <th style={{ padding: '16px 24px', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', width: '150px' }}>Requested</th>
                    <th style={{ padding: '16px 24px', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', width: '220px' }}>Status / Approved Person</th>
                    <th style={{ padding: '16px 24px', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', width: '180px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {approvals.map((app) => (
                    <tr key={app.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '16px 24px', fontSize: '13px', fontWeight: 600 }}>#{app.id}</td>
                      <td style={{ padding: '16px 24px', fontSize: '13px', fontWeight: 700, color: 'var(--text-color)' }}>{app.title}</td>
                      <td style={{ padding: '16px 24px', fontSize: '13px', color: 'var(--text-muted)', whiteSpace: 'pre-line' }}>{app.description}</td>
                      <td style={{ padding: '16px 24px', fontSize: '13px' }}>
                        {new Date(app.request_date).toLocaleDateString([], { dateStyle: 'medium' })}
                      </td>
                      <td style={{ padding: '16px 24px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <span className={`badge ${app.status === 'approved' ? 'badge-active' : app.status === 'rejected' ? 'badge-inactive' : 'badge-pending'}`}>
                            {app.status}
                          </span>
                          {app.status === 'approved' && (
                            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                              By: <strong>{app.approved_by}</strong> ({new Date(app.approval_date).toLocaleDateString()})
                            </span>
                          )}
                          {app.remarks && (
                            <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                              Remarks: {app.remarks}
                            </span>
                          )}
                        </div>
                      </td>
                      <td style={{ padding: '16px 24px' }}>
                        {app.status === 'pending' ? (
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                              className="btn btn-sm btn-primary"
                              onClick={() => handleOpenActionModal(app, 'approved')}
                              style={{
                                padding: '6px 12px',
                                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                border: 'none',
                                color: '#fff',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                boxShadow: '0 2px 5px rgba(16, 185, 129, 0.15)'
                              }}
                            >
                              <CheckCircle size={14} />
                              Approve
                            </button>
                            <button
                              className="btn btn-sm btn-secondary"
                              onClick={() => handleOpenActionModal(app, 'rejected')}
                              style={{
                                padding: '6px 12px',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                color: 'var(--danger)',
                                borderColor: 'var(--danger)',
                                backgroundColor: 'transparent'
                              }}
                            >
                              <XCircle size={14} />
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span style={{ fontSize: '12px', color: 'var(--text-light)', display: 'inline-flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                            <CheckCircle size={14} className="text-success" />
                            Processed
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {activeTab === 'reports' && (
        <div style={{ backgroundColor: '#fff', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '24px', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h2 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: 'var(--text-color)' }}>
                Monthly Performance Reports
              </h2>
              <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: 'var(--text-muted)' }}>
                View monthly project outputs, task completion rates, and campaign statistics.
              </p>
            </div>
            {sentReports.length > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)' }}>Select Month:</span>
                <select 
                  value={selectedMonth} 
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="filter-select"
                  style={{ padding: '6px 12px', borderRadius: '4px', border: '1px solid var(--border-color)', backgroundColor: '#fff', cursor: 'pointer' }}
                >
                  {sentReports.map(r => (
                    <option key={r.id} value={r.month}>{r.month}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {sentReports.length === 0 ? (
            <div style={{ padding: '60px 40px', textAlign: 'center', color: 'var(--text-muted)' }}>
              <Calendar size={40} style={{ margin: '0 auto 12px auto', opacity: 0.6 }} />
              <h4 style={{ margin: 0, fontWeight: 700 }}>No Reports Published</h4>
              <p style={{ margin: '4px 0 0 0', fontSize: '13px' }}>
                Monthly performance reports will appear here once sent by the administrator.
              </p>
            </div>
          ) : reportLoading ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
              <div style={{ width: '28px', height: '28px', border: '3px solid #e2e8f0', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
          ) : reportDetail ? (
            <div>
              {/* Stats Summary Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                <div style={{ padding: '16px', backgroundColor: 'var(--bg-light)', border: '1px solid var(--border-color)', borderRadius: '6px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-light)', textTransform: 'uppercase' }}>Total Tasks</span>
                  <p style={{ margin: '6px 0 0 0', fontSize: '20px', fontWeight: 800, color: 'var(--text-color)' }}>{reportDetail.summary.total_tasks}</p>
                </div>
                <div style={{ padding: '16px', backgroundColor: 'var(--success-light)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'var(--success)' }}>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-light)', textTransform: 'uppercase' }}>Completed Tasks</span>
                  <p style={{ margin: '6px 0 0 0', fontSize: '20px', fontWeight: 800 }}>{reportDetail.summary.completed_tasks}</p>
                </div>
                <div style={{ padding: '16px', backgroundColor: 'var(--bg-light)', border: '1px solid var(--border-color)', borderRadius: '6px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-light)', textTransform: 'uppercase' }}>Pending Tasks</span>
                  <p style={{ margin: '6px 0 0 0', fontSize: '20px', fontWeight: 800, color: 'var(--text-color)' }}>{reportDetail.summary.pending_tasks}</p>
                </div>
                <div style={{ padding: '16px', backgroundColor: 'var(--primary-light)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'var(--primary)' }}>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-light)', textTransform: 'uppercase' }}>Completion Rate</span>
                  <p style={{ margin: '6px 0 0 0', fontSize: '20px', fontWeight: 800 }}>{reportDetail.summary.efficiency_rate}%</p>
                </div>
                <div style={{ padding: '16px', backgroundColor: 'var(--bg-light)', border: '1px solid var(--border-color)', borderRadius: '6px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-light)', textTransform: 'uppercase' }}>Output Hours</span>
                  <p style={{ margin: '6px 0 0 0', fontSize: '20px', fontWeight: 800, color: 'var(--text-color)' }}>{reportDetail.summary.total_hours} hrs</p>
                </div>
              </div>

              {/* Deliverables Detail Ledger */}
              <h3 style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text-color)', marginBottom: '12px' }}>Activity Ledger</h3>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }} className="enterprise-table">
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--border-color)', backgroundColor: 'var(--bg-light)', color: 'var(--text-muted)' }}>
                      <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase' }}>Deliverable Name</th>
                      <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', width: '180px' }}>Department</th>
                      <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', width: '100px', textAlign: 'center' }}>Qty</th>
                      <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', width: '130px' }}>Due Date</th>
                      <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', width: '120px' }}>Status</th>
                      <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase' }}>Remarks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportDetail.deliverables.map((d, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid var(--border-color)' }}>
                        <td style={{ padding: '12px 16px', fontSize: '13px', fontWeight: 700, color: 'var(--text-color)' }}>{d.deliverable}</td>
                        <td style={{ padding: '12px 16px', fontSize: '13px', color: 'var(--text-muted)' }}>{d.department_name}</td>
                        <td style={{ padding: '12px 16px', fontSize: '13px', textAlign: 'center' }}>{d.quantity}</td>
                        <td style={{ padding: '12px 16px', fontSize: '13px' }}>
                          {new Date(d.due_date).toLocaleDateString([], { dateStyle: 'medium' })}
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <span className={`badge ${d.status === 'completed' ? 'badge-active' : d.status === 'in_progress' ? 'badge-pending' : 'badge-inactive'}`}>
                            {d.status}
                          </span>
                        </td>
                        <td style={{ padding: '12px 16px', fontSize: '12px', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                          {d.remarks || '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : null}
        </div>
      )}

      {/* ACTION MODAL */}
      <Modal
        isOpen={!!selectedApproval}
        onClose={() => setSelectedApproval(null)}
        title={actionType === 'approved' ? 'Approve Request' : 'Reject Request'}
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setSelectedApproval(null)}>
              Cancel
            </button>
            <button
              className={`btn ${actionType === 'approved' ? 'btn-primary' : 'btn-danger'}`}
              onClick={handleConfirmAction}
              disabled={actionLoading}
              style={actionType === 'approved' ? {
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                border: 'none'
              } : {}}
            >
              {actionLoading ? 'Submitting...' : actionType === 'approved' ? 'Confirm Approval' : 'Confirm Rejection'}
            </button>
          </>
        }
      >
        {error && (
          <div className="alert alert-danger" style={{ marginBottom: '16px' }}>
            <ShieldAlert size={18} />
            <span>{error}</span>
          </div>
        )}

        <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '16px' }}>
          You are marking approval request <strong>"{selectedApproval?.title}"</strong> as <strong>{actionType}</strong>.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-main)' }}>Remarks / Comments (Optional)</label>
          <textarea
            className="form-control"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            placeholder="Add comments or review feedback here..."
            rows={4}
            style={{ padding: '10px 12px' }}
          />
        </div>
      </Modal>

      {/* REWORK FEEDBACK MODAL */}
      <Modal
        isOpen={isReworkModalOpen}
        onClose={() => setIsReworkModalOpen(false)}
        title="Request Rework / Corrections"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setIsReworkModalOpen(false)}>
              Cancel
            </button>
            <button className="btn btn-danger" onClick={handleSubmitRework}>
              Submit Rework Request
            </button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', margin: 0 }}>
            Please write down specific changes or improvements required for this design asset.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-main)' }}>Correction Instructions</label>
            <textarea
              className="form-control"
              value={reworkRemarks}
              onChange={(e) => setReworkRemarks(e.target.value)}
              placeholder="E.g., Change title text font, adjust layout background colors..."
              rows={4}
              style={{ padding: '10px 12px', fontSize: '13px' }}
            />
          </div>


        </div>
      </Modal>
    </div>
  );
};

export default ClientPortal;
