import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Clock, AlertCircle, Search, UserPlus, CheckCircle, RefreshCw, Mic, Square, Trash2, Volume2, ExternalLink, Play } from 'lucide-react';
import api from '../../utils/api';
import Table from '../../components/Table';
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

const getSubDeptSuffix = (subDeptId) => {
  const id = Number(subDeptId);
  if (id === 1) return ' (Graphic Designer)';
  if (id === 2) return ' (Video Editor)';
  if (id === 3) return ' (Content Writer)';
  if (id === 4) return ' (Creative Designer)';
  return '';
};

const getStatusLabel = (subDeptId) => {
  const id = Number(subDeptId);
  if (id === 1) return 'assigned to graphic designer';
  if (id === 2) return 'assigned to video editor';
  if (id === 3) return 'assigned to content writer';
  if (id === 4) return 'assigned to creative designer';
  return 'assigned to employee';
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

const ManagerJobWorks = () => {
  const { user } = useAuth();
  const [jobWorks, setJobWorks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState({ type: '', text: '' });
  const [actionInProgress, setActionInProgress] = useState(null); // ID of job work being processed
  const [jobPage, setJobPage] = useState(1);
  const jobLimit = 10;

  // Employees list for assignment
  const [employees, setEmployees] = useState([]);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [assigningJobId, setAssigningJobId] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [feedbackText, setFeedbackText] = useState('');

  // Review Modal State
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewingJob, setReviewingJob] = useState(null);

  // Audio Recorder State
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [recordingStatus, setRecordingStatus] = useState('idle'); // idle | recording
  const [audioUrl, setAudioUrl] = useState(null);
  const [audioBase64, setAudioBase64] = useState(null);
  const [recordDuration, setRecordDuration] = useState(0);
  const timerRef = useRef(null);

  const fetchEmployees = useCallback(async () => {
    try {
      const deptId = user?.managerProfile?.department_id;
      if (!deptId) return;

      const res = await api.get('/users/employees/dropdown', { params: { departmentId: deptId } });
      if (res.data.success) {
        setEmployees(res.data.data.employees || []);
      }
    } catch (err) {
      console.error('Error fetching department employees:', err.message);
    }
  }, [user]);

  const fetchJobWorks = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/deliverables/job-work/manager');
      if (res.data.success) {
        setJobWorks(res.data.data || []);
      }
    } catch (err) {
      console.error('Error fetching manager Job Works:', err.message);
      setFeedbackMessage({ type: 'danger', text: 'Failed to load assigned Job Works.' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchJobWorks();
    fetchEmployees();
  }, [fetchJobWorks, fetchEmployees]);

  // Audio recording handlers
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

  const formatDuration = (sec) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleAssignJob = async (e) => {
    e.preventDefault();
    if (!selectedEmployee) return;
    setActionInProgress(assigningJobId);
    setFeedbackMessage({ type: '', text: '' });
    try {
      const res = await api.put(`/deliverables/job-work/${assigningJobId}/assign`, {
        employeeId: Number(selectedEmployee),
        feedbackText: feedbackText.trim() || null,
        voiceBase64: audioBase64 || null
      });
      if (res.data.success) {
        setFeedbackMessage({ type: 'success', text: 'Job Work successfully assigned to employee!' });
        closeAssignModal();
        fetchJobWorks();
      }
    } catch (err) {
      setFeedbackMessage({ type: 'danger', text: err.response?.data?.message || 'Failed to assign Job Work.' });
    } finally {
      setActionInProgress(null);
    }
  };

  const closeAssignModal = () => {
    setIsAssignModalOpen(false);
    setAssigningJobId(null);
    setSelectedEmployee('');
    setFeedbackText('');
    resetAudio();
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const handleReviewJob = async (actionType) => {
    if (!reviewingJob) return;
    setActionInProgress(reviewingJob.id);
    setFeedbackMessage({ type: '', text: '' });
    try {
      const res = await api.post(`/deliverables/job-work/${reviewingJob.id}/review`, {
        action: actionType,
        feedbackText: feedbackText.trim() || null,
        voiceBase64: audioBase64 || null
      });
      if (res.data.success) {
        setFeedbackMessage({ 
          type: 'success', 
          text: `Job Work successfully ${actionType === 'reassign' ? 'reassigned for rework' : actionType === 'send_to_client' ? 'sent to client' : 'approved'}!` 
        });
        closeReviewModal();
        fetchJobWorks();
      }
    } catch (err) {
      setFeedbackMessage({ type: 'danger', text: err.response?.data?.message || 'Failed to review Job Work.' });
    } finally {
      setActionInProgress(null);
    }
  };

  const handleCompleteJobDirect = async (jobId) => {
    setActionInProgress(jobId);
    setFeedbackMessage({ type: '', text: '' });
    try {
      const res = await api.post(`/deliverables/job-work/${jobId}/complete`);
      if (res.data.success) {
        setFeedbackMessage({ type: 'success', text: 'Job Work successfully marked as Completed!' });
        fetchJobWorks();
      }
    } catch (err) {
      setFeedbackMessage({ type: 'danger', text: err.response?.data?.message || 'Failed to complete Job Work.' });
    } finally {
      setActionInProgress(null);
    }
  };

  const closeReviewModal = () => {
    setIsReviewModalOpen(false);
    setReviewingJob(null);
    setFeedbackText('');
    resetAudio();
    if (timerRef.current) clearInterval(timerRef.current);
  };

  // Filter job works
  const filteredJobWorks = jobWorks.filter(jw => {
    const status = (jw.status || '').toLowerCase();
    const isCompleted = ['completed', 'posted', 'approved', 'client_approved'].includes(status);
    if (isCompleted && !statusFilter) {
      return false;
    }

    const searchLower = searchQuery.toLowerCase();
    const clientMatch = jw.client_name?.toLowerCase().includes(searchLower) || 
                        jw.activity_type_code?.toLowerCase().includes(searchLower) ||
                        jw.activity_name?.toLowerCase().includes(searchLower);
    const statusMatch = !statusFilter || jw.status === statusFilter;
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
      label: 'Client Name', 
      render: (client_name) => <span style={{ fontWeight: 700, color: 'var(--primary)' }}>{client_name}</span> 
    },
    { 
      key: 'activity_name', 
      label: 'Work Activity Type', 
      render: (name) => <span style={{ fontWeight: 600 }}>{name || 'N/A'}</span> 
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
      label: 'Count (Qty)', 
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
    },
    { 
      key: 'employee_name', 
      label: user?.managerProfile?.department_code === 'SMM-RS' ? 'SMM Poster' : 'Assigned Employee', 
      render: (name, row) => {
        if (user?.managerProfile?.department_code === 'SMM-RS') {
          return row.smm_employee_name 
            ? <span style={{ fontWeight: 600, color: 'var(--text-color)' }}>{row.smm_employee_name}</span>
            : <span style={{ fontWeight: 600, color: 'var(--text-muted)' }}>Unassigned</span>;
        }
        if (!name) return <span style={{ fontWeight: 600, color: 'var(--text-muted)' }}>Unassigned</span>;
        const subDeptId = row.employee_sub_dept_id || row.sub_department_id;
        const roleSuffix = user?.managerProfile?.department_code === 'SMM-RS' ? '' : getSubDeptSuffix(subDeptId);
        return <span style={{ fontWeight: 600, color: 'var(--text-color)' }}>{name + roleSuffix}</span>;
      }
    },
    { 
      key: 'status', 
      label: 'Status', 
      render: (status, row) => {
        let label = status;
        if (status === 'assigned_employee') {
          label = user?.managerProfile?.department_code === 'SMM-RS'
            ? 'assigned to employee'
            : getStatusLabel(row.employee_sub_dept_id || row.sub_department_id);
        }
        const colors = getStatusColors(status);
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
            {label.replace('_', ' ')}
          </span>
        );
      } 
    },
    { 
      key: 'actions', 
      label: 'Actions', 
      render: (_, jw) => {
        const isSMMManager = user?.managerProfile?.department_code === 'SMM-RS';
        const showAssign = isSMMManager
          ? jw.smm_employee_id === null
          : (jw.status === 'assigned' || (jw.status === 'approved' && jw.assigned_employee_id === null));

        if (showAssign) {
          return (
            <button
              className="btn btn-primary btn-sm"
              onClick={() => {
                setAssigningJobId(jw.id);
                setIsAssignModalOpen(true);
                // Pre-select first employee from SMM or Creatives
                const filteredEmps = isSMMManager
                  ? employees.filter(emp => emp.department_id === 3)
                  : employees.filter(emp => 
                      jw.status === 'assigned' 
                        ? emp.sub_department_id === 3 
                        : [1, 2, 4].includes(emp.sub_department_id)
                    );
                if (filteredEmps.length > 0) setSelectedEmployee(filteredEmps[0].id);
              }}
              disabled={actionInProgress !== null}
              style={{
                padding: '6px 12px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontWeight: 700
              }}
            >
              <UserPlus size={14} />
              {isSMMManager ? 'Assign Employee' : jw.status === 'assigned' ? 'Assign Writer' : 'Assign Designer'}
            </button>
          );
        } else if (jw.status === 'submitted' || jw.status === 'client_rework') {
          return (
            <button
              className="btn btn-warning btn-sm"
              onClick={() => {
                setReviewingJob(jw);
                setIsReviewModalOpen(true);
              }}
              disabled={actionInProgress !== null}
              style={{
                padding: '6px 12px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontWeight: 700
              }}
            >
              <AlertCircle size={14} />
              Review Submission
            </button>
          );
        } else {
          return (
            <span style={{ fontSize: '13px', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
              <CheckCircle size={14} className="text-success" />
              Processed
            </span>
          );
        }
      }
    }
  ];

  const totalPages = Math.ceil(filteredJobWorks.length / jobLimit);
  const paginatedJobWorks = filteredJobWorks.slice((jobPage - 1) * jobLimit, jobPage * jobLimit);

  return (
    <div style={{ padding: '30px', maxWidth: '1400px', margin: '0 auto' }}>
      
      {/* Title Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 800, color: 'var(--text-color)' }}>
          My Assigned Job Works
        </h1>
        <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: 'var(--text-muted)' }}>
          Track and assign ad-hoc job work tasks to employees from your creative department.
        </p>
      </div>

      {/* Feedback Messages */}
      {feedbackMessage.text && (
        <div style={{
          padding: '12px 20px',
          backgroundColor: feedbackMessage.type === 'success' ? 'var(--success-light)' : 'var(--danger-light)',
          color: feedbackMessage.type === 'success' ? 'var(--success)' : 'var(--danger)',
          fontSize: '13px',
          fontWeight: 600,
          marginBottom: '20px',
          borderRadius: 'var(--radius-sm)',
          borderLeft: `4px solid ${feedbackMessage.type === 'success' ? 'var(--success)' : 'var(--danger)'}`
        }}>
          {feedbackMessage.text}
        </div>
      )}

      {/* Toolbar */}
      <div className="table-toolbar" style={{ display: 'flex', gap: '16px', padding: '16px 20px', backgroundColor: '#fff', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md) var(--radius-md) 0 0', borderBottom: 'none', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search style={{ position: 'absolute', left: '12px', top: '10px', color: 'var(--text-muted)' }} size={16} />
          <input
            type="text"
            placeholder="Search by client or activity code..."
            className="form-control"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '36px' }}
          />
        </div>

        <select
          className="form-control"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{ width: '160px' }}
        >
          <option value="">All Statuses</option>
          <option value="assigned">Assigned by Admin</option>
          <option value="assigned_employee">With Employee</option>
          <option value="submitted">Submitted</option>
          <option value="reassigned">Reworking</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {/* Table Container */}
      <div style={{ backgroundColor: '#fff', border: '1px solid var(--border-color)', borderRadius: '0 0 var(--radius-md) var(--radius-md)', overflowX: 'auto' }}>
        {loading && jobWorks.length === 0 ? (
          <div style={{ padding: '80px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <div className="spinner" style={{ margin: '0 auto 12px auto' }}></div>
            <span>Loading assigned Job Works...</span>
          </div>
        ) : filteredJobWorks.length === 0 ? (
          <div style={{ padding: '80px 40px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <AlertCircle size={36} style={{ margin: '0 auto 12px auto', opacity: 0.5 }} />
            <h4 style={{ margin: 0, fontWeight: 700 }}>No Job Works Found</h4>
            <p style={{ margin: '4px 0 0 0', fontSize: '13px' }}>
              You do not have any job works matching the criteria.
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

      {/* Assign Designer Modal */}
      {isAssignModalOpen && (() => {
        const assigningJob = jobWorks.find(jw => jw.id === assigningJobId);
        const isSMMManager = user?.managerProfile?.department_code === 'SMM-RS';
        const filteredEmployees = isSMMManager
          ? employees.filter(emp => emp.department_id === 3)
          : employees.filter(emp => 
              assigningJob?.status === 'assigned' 
                ? emp.sub_department_id === 3 
                : [1, 2, 4].includes(emp.sub_department_id)
            );

        return (
          <Modal
            isOpen={isAssignModalOpen}
            onClose={closeAssignModal}
            title={isSMMManager ? 'Assign Job Work to Employee' : assigningJob?.status === 'assigned' ? 'Assign Job Work to Content Writer' : 'Assign Job Work to Designer/Editor'}
          >
            <form onSubmit={handleAssignJob} style={{ padding: '10px' }}>
              
              {/* Employee Selector */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontWeight: 700, fontSize: '13px', marginBottom: '6px', color: 'var(--text-color)' }}>
                  {user?.managerProfile?.department_code === 'SMM-RS' ? 'Select Employee' : assigningJob?.status === 'assigned' ? 'Select Content Writer' : 'Select Designer/Editor'}
                </label>
                <select
                  className="form-control"
                  value={selectedEmployee}
                  onChange={(e) => setSelectedEmployee(e.target.value)}
                  style={{ width: '100%', padding: '10px', fontSize: '14px', outline: 'none' }}
                  required
                >
                  <option value="">-- Choose Employee --</option>
                  {filteredEmployees.map(emp => (
                    <option key={emp.id} value={emp.id}>
                      {emp.full_name} ({emp.department_name || 'Creative Team'})
                    </option>
                  ))}
                </select>
              </div>

              {/* Written Guideline Text */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontWeight: 700, fontSize: '13px', marginBottom: '6px', color: 'var(--text-color)' }}>
                  Job Specifications & Work Details (Text)
                </label>
                <textarea
                  className="form-control"
                  rows={3}
                  placeholder="Explain what work needs to be done, specific dimensions, color palettes, or file formats..."
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  style={{ width: '100%', fontSize: '13px', padding: '10px', resize: 'vertical' }}
                />
              </div>


              
              {/* Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={closeAssignModal}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={!selectedEmployee || actionInProgress !== null}
                >
                  {actionInProgress !== null 
                    ? 'Assigning...' 
                    : isSMMManager 
                      ? 'Assign Employee' 
                      : assigningJob?.status === 'assigned' 
                        ? 'Assign Content Writer' 
                        : 'Assign Designer'}
                </button>
              </div>
            </form>
          </Modal>
        );
      })()}

      {/* Review Submission Modal */}
      {isReviewModalOpen && reviewingJob && (
        <Modal
          isOpen={isReviewModalOpen}
          onClose={closeReviewModal}
          title="Review Job Work Submission"
        >
          <div style={{ padding: '10px' }}>
            
            {/* Header info */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', marginBottom: '16px', fontSize: '13px' }}>
              <div>Client: <strong style={{ color: 'var(--primary)' }}>{reviewingJob.client_name}</strong></div>
              <div>Job ID: <strong>#{reviewingJob.id}</strong> | Code: <strong style={{ fontFamily: 'monospace' }}>{reviewingJob.activity_code || reviewingJob.activity_type_code}</strong></div>
              <div>
                {user?.managerProfile?.department_code === 'SMM-RS' 
                  ? 'Assigned Employee: ' 
                  : (reviewingJob.employee_sub_dept_id === 3 ? 'Assigned Writer: ' : 'Assigned Designer: ')}
                <strong>{reviewingJob.smm_employee_name || reviewingJob.employee_name || 'Employee'}</strong>
              </div>
            </div>

            {/* Submission Link */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontWeight: 700, fontSize: '13px', marginBottom: '6px', color: 'var(--text-color)' }}>
                {user?.managerProfile?.department_code === 'SMM-RS' 
                  ? 'Employee Submission Link' 
                  : (reviewingJob.employee_sub_dept_id === 3 ? 'Writer Submission Link' : 'Designer Submission Link')}
              </label>
              {reviewingJob.google_drive_link ? (
                <a 
                  href={ensureExternalLink(reviewingJob.google_drive_link)} 
                  target="_blank" 
                  rel="noreferrer" 
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--primary)', fontWeight: 700, textDecoration: 'underline', fontSize: '14px' }}
                >
                  Open Google Drive Submission Asset <ExternalLink size={14} />
                </a>
              ) : (
                <span style={{ fontSize: '13px', color: 'var(--danger)', fontStyle: 'italic', fontWeight: 600 }}>
                  No submission link provided yet.
                </span>
              )}
            </div>

            {/* Client feedback text if client requested rework */}
            {reviewingJob.status === 'client_rework' && reviewingJob.client_feedback_text && (
              <div style={{ marginBottom: '20px', backgroundColor: '#fff5f5', border: '1px solid #fed7d7', padding: '12px 16px', borderRadius: 'var(--radius-sm)' }}>
                <span style={{ display: 'block', color: '#9b1c1c', fontWeight: 700, fontSize: '12px', textTransform: 'uppercase', marginBottom: '4px' }}>
                  Client Feedback (Rework Comments)
                </span>
                <p style={{ margin: 0, fontSize: '13px', color: '#9b1c1c', lineHeight: 1.4, fontWeight: 500 }}>
                  {reviewingJob.client_feedback_text}
                </p>
              </div>
            )}

            {/* Written feedback input */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontWeight: 700, fontSize: '13px', marginBottom: '6px', color: 'var(--text-color)' }}>
                Rework Specifications / Feedback Comments (Required if Reassigning)
              </label>
              <textarea
                className="form-control"
                rows={3}
                placeholder="Detail any corrections, additions, or changes needed..."
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                style={{ width: '100%', fontSize: '13px', padding: '10px', resize: 'vertical' }}
              />
            </div>



            {/* Actions Footer */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', borderTop: '1px solid var(--border-color)', paddingTop: '16px', flexWrap: 'wrap' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={closeReviewModal}
                disabled={actionInProgress !== null}
              >
                Cancel
              </button>
              
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => handleReviewJob('reassign')}
                disabled={actionInProgress !== null || !feedbackText.trim()}
                title={!feedbackText.trim() ? "Please write feedback text to reassign" : ""}
                style={{ fontWeight: 700 }}
              >
                Send back for Rework
              </button>

              <button
                type="button"
                className="btn btn-success"
                onClick={() => handleReviewJob('approve')}
                disabled={actionInProgress !== null}
                style={{ fontWeight: 700 }}
              >
                {reviewingJob.employee_sub_dept_id === 3 ? 'Approve Content' : 'Approve Design'}
              </button>
            </div>

          </div>
        </Modal>
      )}

    </div>
  );
};

export default ManagerJobWorks;
