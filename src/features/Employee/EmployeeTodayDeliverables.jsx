import React, { useState, useEffect, useCallback } from 'react';
import { FileText, Send, Calendar, CheckCircle, ExternalLink, RefreshCw, AlertCircle, Clock } from 'lucide-react';
import api from '../../utils/api';

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

const EmployeeTodayDeliverables = () => {
  const [items, setItems] = useState([]);
  const [jobWorks, setJobWorks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submittingId, setSubmittingId] = useState(null);
  const [driveLinks, setDriveLinks] = useState({});
  const [dayOffsetFilter, setDayOffsetFilter] = useState(0); // -1 = Yesterday, 0 = Today, 1 = Tomorrow, null = All

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [delivsRes, jobsRes] = await Promise.all([
        api.get('/deliverables/employee/today'),
        api.get('/deliverables/job-work/employee')
      ]);
      if (delivsRes.data.success) {
        setItems(delivsRes.data.data.deliverables || []);
      }
      if (jobsRes.data.success) {
        setJobWorks(jobsRes.data.data || []);
      }
    } catch (err) {
      console.error('Error fetching today employee tasks:', err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSubmitWork = async (item) => {
    const link = driveLinks[item.id];
    if (!link || !link.trim()) {
      alert('Please enter a valid Google Drive link.');
      return;
    }
    
    setSubmittingId(item.id);
    try {
      const res = await api.put(`/deliverables/${item.id}/submit`, { googleDriveLink: link });
      if (res.data.success) {
        alert('Work successfully submitted to manager.');
        setDriveLinks(prev => {
          const next = { ...prev };
          delete next[item.id];
          return next;
        });
        fetchData();
      }
    } catch (err) {
      console.error('Error submitting work:', err.message);
      alert(err.response?.data?.message || 'Failed to submit work.');
    } finally {
      setSubmittingId(null);
    }
  };

  const handleSubmitJobWork = async (job) => {
    const link = driveLinks['job_' + job.id];
    if (!link || !link.trim()) {
      alert('Please enter a valid Google Drive link.');
      return;
    }
    
    setSubmittingId('job_' + job.id);
    try {
      const res = await api.post(`/deliverables/job-work/${job.id}/submit`, { googleDriveLink: link });
      if (res.data.success) {
        alert('Job Work successfully submitted to manager.');
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

  const targetDateStr = dayOffsetFilter === null ? null : getTodayOffsetDateStr(dayOffsetFilter);

  const filteredJobWorks = jobWorks.filter(job => {
    if (!targetDateStr) return true;
    const jobDate = parseLocalDateStr(job.deadline || job.created_at || job.due_date);
    return jobDate === targetDateStr;
  });

  const filteredItems = items.filter(item => {
    if (!targetDateStr) return true;
    const itemDate = parseLocalDateStr(item.due_date || item.deadline || item.date || item.created_at);
    return itemDate === targetDateStr;
  });

  const todayStr = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div style={{ padding: '30px', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-color)', display: 'flex', alignItems: 'center', gap: '10px', margin: 0 }}>
            <Calendar size={26} style={{ color: 'var(--primary)' }} />
            Today's Assigned Deliverables
          </h1>
          <p style={{ margin: '6px 0 0 0', color: 'var(--text-muted)', fontSize: '14px' }}>
            List of deliverables and job works allocated to you for today: <strong>{todayStr}</strong>.
          </p>
        </div>
        <button className="btn btn-secondary" onClick={fetchData} disabled={loading} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* Quick Day Filtration Bar */}
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '30px', backgroundColor: '#fff', padding: '12px 20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
        <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-muted)' }}>Quick Day Filter:</span>
        {[
          { label: 'Yesterday', offset: -1 },
          { label: 'Today', offset: 0 },
          { label: 'Tomorrow', offset: 1 },
          { label: 'All Tasks', offset: null }
        ].map(btn => {
          const isActive = dayOffsetFilter === btn.offset;
          return (
            <button
              key={btn.label}
              type="button"
              onClick={() => setDayOffsetFilter(btn.offset)}
              style={{
                padding: '6px 14px',
                fontSize: '12px',
                fontWeight: 700,
                borderRadius: '20px',
                border: '1px solid',
                borderColor: isActive ? 'var(--primary)' : 'var(--border-color)',
                backgroundColor: isActive ? 'var(--primary)' : '#ffffff',
                color: isActive ? '#ffffff' : 'var(--text-main)',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {btn.label}
            </button>
          );
        })}
      </div>

      {loading ? (
        <div style={{ padding: '80px', textAlign: 'center', color: 'var(--text-muted)' }}>
          <div style={{ width: '32px', height: '32px', border: '3px solid #e2e8f0', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 12px auto' }}></div>
          <span>Loading today's tasks...</span>
        </div>
      ) : (
        <>
          {/* Priority Job Works Section */}
          {filteredJobWorks.length > 0 && (
            <div style={{ marginBottom: '40px', backgroundColor: '#fff5f5', border: '1px solid #feb2b2', borderRadius: 'var(--radius-md)', padding: '24px', boxShadow: 'var(--shadow-sm)' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: '8px', margin: '0 0 16px 0' }}>
                <AlertCircle size={22} />
                ⚠️ PRIORITY JOB WORKS (Must complete first)
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px' }}>
                {filteredJobWorks.map(job => (
                  <div 
                    key={job.id}
                    style={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #fca5a5',
                      borderRadius: 'var(--radius-sm)',
                      padding: '20px',
                      boxShadow: 'var(--shadow-sm)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      borderLeft: '5px solid var(--danger)'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--danger)' }}>
                          {job.client_name} (Job Work #{job.id})
                        </span>
                        <span className="badge badge-danger" style={{ fontSize: '10px', textTransform: 'uppercase' }}>
                          {job.status.replace('_', ' ')}
                        </span>
                      </div>
                      
                      <h3 style={{ fontSize: '15px', fontWeight: 700, margin: '0 0 8px 0', color: 'var(--text-color)' }}>
                        Activity: {job.activity_type_code} (Qty: {job.quantity})
                      </h3>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '12px' }}>
                        <Clock size={12} />
                        <span>Deadline: {new Date(job.deadline).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</span>
                      </div>

                      {job.manager_feedback_text && (
                        <div style={{ backgroundColor: 'var(--danger-light)', padding: '10px 14px', borderRadius: '4px', fontSize: '13px', color: 'var(--danger)', marginBottom: '12px', borderLeft: '3px solid var(--danger)' }}>
                          <strong>Manager Correction:</strong> {job.manager_feedback_text}
                        </div>
                      )}


                    </div>

                    <div style={{ borderTop: '1px solid #fecaca', paddingTop: '14px', marginTop: '14px' }}>
                    {['completed', 'posted'].includes(job.status) ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--success)', fontWeight: 700, fontSize: '14px', padding: '10px 0' }}>
                        <CheckCircle size={18} /> Posted on Social Media
                      </div>
                    ) : (
                      <>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px' }}>
                          Submit Google Drive Link
                        </label>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <input
                            type="url"
                            placeholder="https://drive.google.com/drive/folders/..."
                            value={driveLinks['job_' + job.id] || ''}
                            onChange={(e) => handleLinkChange('job_' + job.id, e.target.value)}
                            className="form-control"
                            style={{ flex: 1, padding: '8px 12px', fontSize: '13px', border: '1px solid #fca5a5' }}
                            disabled={submittingId === 'job_' + job.id}
                          />
                          <button
                            className="btn btn-danger"
                            onClick={() => handleSubmitJobWork(job)}
                            disabled={submittingId === 'job_' + job.id || !driveLinks['job_' + job.id]?.trim()}
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '8px 14px' }}
                          >
                            <Send size={14} />
                            {submittingId === 'job_' + job.id ? 'Sending...' : 'Send'}
                          </button>
                        </div>
                      </>
                    )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Standard Deliverables Section */}
          <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-color)', marginBottom: '16px' }}>
            Monthly Assigned Deliverables
          </h2>
          
          {filteredItems.length === 0 ? (
            <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--border-color)', padding: '60px 40px', textAlign: 'center', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)' }}>
              <CheckCircle size={44} style={{ color: 'var(--success)', marginBottom: '12px' }} />
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: 'var(--text-color)' }}>No Deliverables Found</h3>
              <p style={{ margin: '8px 0 0 0', color: 'var(--text-muted)', fontSize: '14px' }}>
                You have no outstanding monthly deliverables assigned for the selected day filter.
              </p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px' }}>
              {filteredItems.map(item => (
                <div 
                  key={item.id}
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    padding: '24px',
                    boxShadow: 'var(--shadow-sm)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    borderLeft: '5px solid ' + (item.priority === 'high' ? 'var(--danger)' : item.priority === 'medium' ? 'var(--warning)' : 'var(--success)')
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                          {item.client_name}
                        </span>
                        {item.activity_code && (
                          <span style={{ fontFamily: 'monospace', fontSize: '11px', fontWeight: 800, color: 'var(--primary)' }}>
                            {item.activity_code}
                          </span>
                        )}
                      </div>
                      <span className="badge badge-active" style={{ textTransform: 'capitalize' }}>
                        {item.status}
                      </span>
                    </div>

                    {item.is_event_day === 1 && (
                      <div style={{ marginBottom: '8px' }}>
                        <span style={{ backgroundColor: '#e0e7ff', color: '#4338ca', fontSize: '11px', fontWeight: 800, padding: '3px 10px', borderRadius: '99px', textTransform: 'uppercase', display: 'inline-block' }}>
                          EVENT DAY {item.event_day_title ? `: ${item.event_day_title}` : ''}
                        </span>
                      </div>
                    )}
                    <h3 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 10px 0', color: 'var(--text-color)' }}>
                      {item.deliverable}
                    </h3>
                    
                    {item.description && (
                      <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '0 0 16px 0', lineHeight: 1.4 }}>
                        {item.description}
                      </p>
                    )}
                  </div>

                  <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px', marginTop: '16px' }}>
                  {['completed', 'posted'].includes(item.status) ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--success)', fontWeight: 700, fontSize: '14px', padding: '10px 0' }}>
                      <CheckCircle size={18} /> Posted on Social Media
                    </div>
                  ) : (
                    <>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '8px' }}>
                        Submit Google Drive Link
                      </label>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <input
                          type="url"
                          placeholder="https://drive.google.com/drive/folders/..."
                          value={driveLinks[item.id] || ''}
                          onChange={(e) => handleLinkChange(item.id, e.target.value)}
                          className="form-control"
                          style={{ flex: 1, padding: '8px 12px', fontSize: '13px' }}
                          disabled={submittingId === item.id}
                        />
                        <button
                          className="btn btn-primary"
                          onClick={() => handleSubmitWork(item)}
                          disabled={submittingId === item.id || !driveLinks[item.id]?.trim()}
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '8px 14px' }}
                        >
                          <Send size={14} />
                          {submittingId === item.id ? 'Sending...' : 'Send'}
                        </button>
                      </div>
                    </>
                  )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default EmployeeTodayDeliverables;
