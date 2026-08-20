import React, { useState, useEffect, useCallback } from 'react';
import { Briefcase, Send, Calendar, ExternalLink, RefreshCw, AlertCircle, Play, MessageSquare, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

const ensureExternalLink = (url) => {
  if (!url) return '';
  const trimmed = url.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }
  return `https://${trimmed}`;
};

const EmployeeJobWork = () => {
  const { user } = useAuth();
  const [jobWorks, setJobWorks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submittingId, setSubmittingId] = useState(null);
  const [driveLinks, setDriveLinks] = useState({});
  const [statusFilter, setStatusFilter] = useState('undone');
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/deliverables/job-work/employee');
      if (res.data.success) {
        setJobWorks(res.data.data || []);
      }
    } catch (err) {
      console.error('Error fetching employee job works:', err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSubmitJobWork = async (job) => {
    const isSMM = user?.employeeProfile?.department_code === 'SMM-RS';
    const link = driveLinks['job_' + job.id];
    if (!isSMM && (!link || !link.trim())) {
      alert('Please enter a valid Google Drive link.');
      return;
    }
    
    setSubmittingId('job_' + job.id);
    try {
      const res = await api.post(`/deliverables/job-work/${job.id}/submit`, { googleDriveLink: isSMM ? '' : link });
      if (res.data.success) {
        alert(isSMM
          ? 'Job Work marked as completed.'
          : 'Job Work successfully submitted to manager.'
        );
        setDriveLinks(prev => {
          const next = { ...prev };
          delete next['job_' + job.id];
          return next;
        });
        fetchData();
      }
    } catch (err) {
      console.error('Error submitting job work:', err.message);
      alert(err.response?.data?.message || 'Failed to submit Job Work.');
    } finally {
      setSubmittingId(null);
    }
  };

  const handleLinkChange = (id, val) => {
    setDriveLinks(prev => ({ ...prev, [id]: val }));
  };

  // Play spoken feedback note
  const playAudio = (base64String) => {
    try {
      const audio = new Audio(base64String);
      audio.play();
    } catch (error) {
      console.error('Error playing feedback audio:', error);
      alert('Could not play voice recording.');
    }
  };

  // Filter job works
  const filteredJobWorks = jobWorks.filter(job => {
    if (statusFilter === 'undone') {
      return ['assigned', 'assigned_employee', 'reassigned', 'client_rework'].includes(job.status);
    }
    if (statusFilter === 'submitted') {
      return ['submitted', 'sent_to_client'].includes(job.status);
    }
    if (statusFilter === 'approved') {
      return ['approved', 'client_approved', 'completed'].includes(job.status);
    }
    return true;
  });

  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedJobWorks = filteredJobWorks.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredJobWorks.length / itemsPerPage);

  return (
    <div style={{ padding: '30px', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-color)', display: 'flex', alignItems: 'center', gap: '10px', margin: 0 }}>
            <Briefcase size={26} style={{ color: 'var(--danger)' }} />
            Priority Job Work
          </h1>
          <p style={{ margin: '6px 0 0 0', color: 'var(--text-muted)', fontSize: '14px' }}>
            Urgent task requests assigned directly to you. **Job works are first priority** and must be resolved immediately.
          </p>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <select
            className="form-control"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            style={{ width: '180px', fontSize: '13px', margin: 0, padding: '8px 12px' }}
          >
            <option value="all">All Statuses</option>
            <option value="undone">Not Done</option>
            <option value="submitted">Sent for Approval</option>
            <option value="approved">Approved</option>
          </select>
          
          <button className="btn btn-secondary" onClick={fetchData} disabled={loading} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', margin: 0, padding: '10px 16px' }}>
            <RefreshCw size={14} /> Refresh
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ padding: '80px', textAlign: 'center', color: 'var(--text-muted)' }}>
          <div style={{ width: '32px', height: '32px', border: '3px solid #e2e8f0', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 12px auto' }}></div>
          <span>Loading priority job works...</span>
        </div>
      ) : jobWorks.length === 0 ? (
        <div className="card" style={{ padding: '80px 40px', textAlign: 'center', color: 'var(--text-muted)' }}>
          <Briefcase size={40} style={{ margin: '0 auto 12px auto', opacity: 0.4 }} />
          <h3 style={{ margin: 0, fontWeight: 700, color: 'var(--text-color)' }}>No Job Works Assigned</h3>
          <p style={{ margin: '4px 0 0 0', fontSize: '14px' }}>
            You have no active or urgent job work tasks assigned at this time.
          </p>
        </div>
      ) : (
        <div className="card" style={{ padding: '20px', borderRadius: 'var(--radius-md)', minHeight: '300px' }}>
          <div style={{ overflowX: 'auto' }}>
            <table className="enterprise-table" style={{ width: '100%', minWidth: '1100px' }}>
              <thead>
                <tr>
                  <th style={{ width: '130px' }}>Client Name</th>
                  <th style={{ width: '160px' }}>Activity Name</th>
                  <th style={{ width: '110px' }}>Activity Code</th>
                  <th style={{ width: '60px' }}>Qty</th>
                  <th style={{ width: '130px' }}>Deadline</th>
                  <th>Instructions</th>
                  <th style={{ width: '130px' }}>Approved Script</th>
                  {user?.employeeProfile?.department_code !== 'SMM-RS' && <th style={{ width: '240px' }}>Work Link</th>}
                  <th style={{ width: '110px' }}>Status</th>
                  <th style={{ width: '110px' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {paginatedJobWorks.length === 0 ? (
                  <tr>
                    <td colSpan={user?.employeeProfile?.department_code === 'SMM-RS' ? 9 : 10} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                      No job works found matching the selected filter.
                    </td>
                  </tr>
                ) : (
                  paginatedJobWorks.map(job => {
                    const statusText = job.status === 'reassigned' || job.status === 'client_rework' ? 'Rework' : job.status === 'submitted' || job.status === 'sent_to_client' ? 'Pending Approval' : ['approved', 'client_approved', 'completed'].includes(job.status) ? 'Approved' : 'Urgent';
                    
                    const rowBg = (() => {
                      const status = (job.status || '').toLowerCase();
                      if (['approved', 'client_approved', 'completed'].includes(status)) {
                        return 'rgba(74, 222, 128, 0.15)'; // Light transparent Green (Approved)
                      }
                      if (['submitted', 'sent_to_client'].includes(status)) {
                        return 'rgba(253, 224, 71, 0.25)'; // Light transparent Yellow (Sent for Approval)
                      }
                      if (status === 'reassigned' || status === 'client_rework') {
                        return 'rgba(251, 146, 60, 0.15)'; // Light transparent Orange (Rework)
                      }
                      return 'rgba(248, 113, 113, 0.12)'; // Light transparent Red (Urgent)
                    })();

                    return (
                      <tr key={job.id} style={{ verticalAlign: 'middle', backgroundColor: rowBg }}>
                        {/* 1. Client Name */}
                        <td style={{ fontWeight: 700 }}>
                          {job.client_name}
                        </td>

                        {/* 2. Activity Name */}
                        <td>
                          <span style={{ fontWeight: 600, fontSize: '13px' }}>
                            {job.activity_name || job.activity_type_code}
                          </span>
                        </td>

                        {/* 3. Activity Code */}
                        <td>
                          {job.activity_code ? (
                            <span style={{ fontFamily: 'monospace', fontSize: '11px', color: 'var(--primary)', fontWeight: 700, padding: '3px 6px', backgroundColor: 'var(--primary-light)', borderRadius: '4px' }}>
                              {job.activity_code}
                            </span>
                          ) : (
                            <span style={{ color: 'var(--text-muted)', fontSize: '11px', fontStyle: 'italic' }}>N/A</span>
                          )}
                        </td>

                        {/* 4. Qty */}
                        <td style={{ fontWeight: 700 }}>
                          {job.quantity}
                        </td>

                        {/* 5. Deadline */}
                        <td style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            <Calendar size={12} />
                            {new Date(job.deadline).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                          </div>
                        </td>

                        {/* 6. Instructions */}
                        <td>
                          {job.manager_feedback_text ? (
                            <span style={{ fontSize: '12px', color: 'var(--text-color)', whiteSpace: 'pre-wrap' }}>
                              {job.manager_feedback_text}
                            </span>
                          ) : (
                            <span style={{ color: 'var(--text-muted)', fontStyle: 'italic', fontSize: '12px' }}>No instructions</span>
                          )}
                        </td>



                        {/* 8. Approved Script */}
                        <td>
                          {[1, 2, 4].includes(Number(user?.employeeProfile?.sub_department_id)) && job.google_drive_link ? (
                            <a 
                              href={ensureExternalLink(job.google_drive_link)} 
                              target="_blank" 
                              rel="noreferrer" 
                              style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: 'var(--success)', fontWeight: 700, fontSize: '12px' }}
                            >
                              Open Script <ExternalLink size={12} />
                            </a>
                          ) : (
                            <span style={{ color: 'var(--text-muted)', fontSize: '12px', fontStyle: 'italic' }}>N/A</span>
                          )}
                        </td>

                        {/* 9. Work Link Input */}
                        {user?.employeeProfile?.department_code !== 'SMM-RS' && (
                          <td>
                            <input
                              type="url"
                              placeholder="Paste submission link here..."
                              className="form-control"
                              value={['submitted', 'sent_to_client', 'approved', 'client_approved', 'completed'].includes(job.status) ? (job.google_drive_link || '') : driveLinks['job_' + job.id] || ''}
                              onChange={(e) => handleLinkChange('job_' + job.id, e.target.value)}
                              disabled={['submitted', 'sent_to_client', 'approved', 'client_approved', 'completed'].includes(job.status)}
                              style={{ fontSize: '12px', padding: '6px 10px', margin: 0, width: '100%' }}
                            />
                          </td>
                        )}

                        {/* 10. Status Badge */}
                        <td>
                          {job.status === 'completed' ? (
                            <span className="badge badge-active" style={{ textTransform: 'uppercase', fontSize: '10px', display: 'inline-flex', alignItems: 'center', gap: '4px', width: '100%', justifyContent: 'center', height: '34px', fontWeight: 700, backgroundColor: 'var(--success)', borderColor: 'var(--success)', color: '#fff' }}>
                              <CheckCircle size={12} /> Completed
                            </span>
                          ) : ['approved', 'client_approved'].includes(job.status) ? (
                            <span className="badge badge-active" style={{ textTransform: 'uppercase', fontSize: '10px', display: 'inline-flex', alignItems: 'center', gap: '4px', width: '100%', justifyContent: 'center', height: '34px', fontWeight: 700, backgroundColor: 'var(--success)', borderColor: 'var(--success)', color: '#fff' }}>
                              <CheckCircle size={12} /> Approved
                            </span>
                          ) : job.status === 'sent_to_client' ? (
                            <span className="badge badge-active" style={{ textTransform: 'uppercase', fontSize: '10px', display: 'inline-flex', alignItems: 'center', gap: '4px', width: '100%', justifyContent: 'center', height: '34px', fontWeight: 700, backgroundColor: '#0284c7', borderColor: '#0284c7' }}>
                              <Clock size={12} /> Sent to Client
                            </span>
                          ) : job.status === 'submitted' ? (
                            <span className="badge badge-in-progress" style={{ textTransform: 'uppercase', fontSize: '10px', display: 'inline-flex', alignItems: 'center', gap: '4px', width: '100%', justifyContent: 'center', height: '34px', fontWeight: 700 }}>
                              <Clock size={12} /> Sent for Approval
                            </span>
                          ) : ['reassigned', 'client_rework'].includes(job.status) ? (
                            <span className="badge badge-inactive" style={{ textTransform: 'uppercase', fontSize: '10px', display: 'inline-flex', alignItems: 'center', gap: '4px', width: '100%', justifyContent: 'center', height: '34px', fontWeight: 700, backgroundColor: 'rgba(249, 115, 22, 0.15)', color: '#ea580c', borderColor: '#ea580c' }}>
                              <AlertCircle size={12} /> Rework
                            </span>
                          ) : (
                            <span className="badge badge-pending" style={{ textTransform: 'uppercase', fontSize: '10px', display: 'inline-flex', alignItems: 'center', gap: '4px', width: '100%', justifyContent: 'center', height: '34px', fontWeight: 700, backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#dc2626', borderColor: '#dc2626' }}>
                              <AlertTriangle size={12} /> Urgent
                            </span>
                          )}
                        </td>

                        {/* 11. Action Button */}
                        <td>
                          {['submitted', 'sent_to_client', 'approved', 'client_approved', 'completed'].includes(job.status) ? (
                            <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontStyle: 'italic', display: 'block', textAlign: 'center' }}>Locked</span>
                          ) : (
                            <button
                              onClick={() => handleSubmitJobWork(job)}
                              disabled={submittingId === 'job_' + job.id || (user?.employeeProfile?.department_code !== 'SMM-RS' && !driveLinks['job_' + job.id]?.trim())}
                              className={`btn ${['reassigned', 'client_rework'].includes(job.status) ? 'btn-warning' : 'btn-primary'} btn-sm`}
                              style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontWeight: 700, width: '100%', justifyContent: 'center', height: '34px', backgroundColor: ['reassigned', 'client_rework'].includes(job.status) ? '#f97316' : undefined, borderColor: ['reassigned', 'client_rework'].includes(job.status) ? '#f97316' : undefined, color: ['reassigned', 'client_rework'].includes(job.status) ? '#fff' : undefined }}
                            >
                              <Send size={12} />
                              {submittingId === 'job_' + job.id 
                                ? 'Sending...' 
                                : (user?.employeeProfile?.department_code === 'SMM-RS' ? 'Mark Completed' : 'Submit')
                              }
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Bottom Pagination */}
          {filteredJobWorks.length > itemsPerPage && (
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
                Showing <strong>{((page - 1) * itemsPerPage) + 1}</strong> to <strong>{Math.min(page * itemsPerPage, filteredJobWorks.length)}</strong> of <strong>{filteredJobWorks.length}</strong> items
              </span>
              
              <div style={{ display: 'flex', gap: '4px' }}>
                <button 
                  onClick={() => setPage(p => Math.max(p - 1, 1))} 
                  disabled={page === 1}
                  className="btn btn-secondary btn-sm"
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <button 
                    key={p} 
                    onClick={() => setPage(p)}
                    className={`btn btn-sm ${page === p ? 'btn-primary' : 'btn-secondary'}`}
                  >
                    {p}
                  </button>
                ))}
                <button 
                  onClick={() => setPage(p => Math.min(p + 1, totalPages))} 
                  disabled={page === totalPages}
                  className="btn btn-secondary btn-sm"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EmployeeJobWork;
