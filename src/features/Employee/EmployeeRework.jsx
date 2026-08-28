import React, { useState, useEffect, useCallback } from 'react';
import { RefreshCw, Play, AlertTriangle, Send, Link, MessageSquare, CheckCircle } from 'lucide-react';
import api from '../../utils/api';

const EmployeeRework = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submittingId, setSubmittingId] = useState(null);
  const [driveLinks, setDriveLinks] = useState({});

  const fetchReworkQueue = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/deliverables/employee/rework');
      if (res.data.success) {
        setItems(res.data.data.deliverables || []);
      }
    } catch (err) {
      console.error('Error fetching rework queue:', err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReworkQueue();
  }, [fetchReworkQueue]);

  const handleSubmitRework = async (item) => {
    const link = driveLinks[item.id] || item.google_drive_link;
    if (!link || !link.trim()) {
      alert('Please enter a valid Google Drive link.');
      return;
    }
    
    setSubmittingId(item.id);
    try {
      const res = await api.post(`/deliverables/${item.id}/submit`, { googleDriveLink: link });
      if (res.data.success) {
        alert('Rework successfully submitted to manager.');
        setDriveLinks(prev => {
          const next = { ...prev };
          delete next[item.id];
          return next;
        });
        fetchReworkQueue();
      }
    } catch (err) {
      console.error('Error submitting rework:', err.message);
      alert(err.response?.data?.message || 'Failed to submit rework.');
    } finally {
      setSubmittingId(null);
    }
  };

  const handleLinkChange = (id, val) => {
    setDriveLinks(prev => ({ ...prev, [id]: val }));
  };

  return (
    <div style={{ padding: '30px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-color)', display: 'flex', alignItems: 'center', gap: '10px', margin: 0 }}>
            <AlertTriangle size={26} style={{ color: 'var(--warning)' }} />
            Rework & Corrections Queue
          </h1>
          <p style={{ margin: '6px 0 0 0', color: 'var(--text-muted)', fontSize: '14px' }}>
            List of deliverables requiring adjustments based on feedback or client reviews.
          </p>
        </div>
        <button className="btn btn-secondary" onClick={fetchReworkQueue} disabled={loading} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {loading ? (
        <div style={{ padding: '80px', textAlign: 'center', color: 'var(--text-muted)' }}>
          <div style={{ width: '32px', height: '32px', border: '3px solid #e2e8f0', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 12px auto' }}></div>
          <span>Loading rework items...</span>
        </div>
      ) : items.length === 0 ? (
        <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--border-color)', padding: '60px 40px', textAlign: 'center', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)' }}>
          <CheckCircle size={44} style={{ color: 'var(--success)', marginBottom: '12px' }} />
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: 'var(--text-color)' }}>Rework Queue is Clear</h3>
          <p style={{ margin: '8px 0 0 0', color: 'var(--text-muted)', fontSize: '14px' }}>
            No deliverables require correction. All submitted content is active or approved!
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {items.map(item => (
            <div 
              key={item.id}
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                padding: '24px',
                boxShadow: 'var(--shadow-sm)',
                borderLeft: '5px solid var(--warning)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                    {item.client_name}
                  </span>
                  {item.activity_code && (
                    <span style={{ fontFamily: 'monospace', fontSize: '11px', fontWeight: 800, color: 'var(--primary)', display: 'block', marginBottom: '4px' }}>
                      {item.activity_code}
                    </span>
                  )}
                  <h3 style={{ fontSize: '18px', fontWeight: 800, margin: 0, color: 'var(--text-color)' }}>
                    {item.deliverable}
                  </h3>
                </div>
                <span className="badge badge-inactive" style={{ backgroundColor: '#fef3c7', color: '#b45309', border: '1px solid #fde68a', fontWeight: 700 }}>
                  Rework Requested
                </span>
              </div>

              {item.description && (
                <p style={{ fontSize: '14px', color: 'var(--text-muted)', margin: '0 0 20px 0', lineHeight: 1.5 }}>
                  {item.description}
                </p>
              )}

              {/* Feedbacks Block */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', backgroundColor: 'var(--bg-light)', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', marginBottom: '20px' }}>
                {/* Manager Feedback */}
                <div>
                  <h4 style={{ fontSize: '13px', fontWeight: 800, margin: '0 0 10px 0', color: 'var(--text-color)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <MessageSquare size={16} className="text-primary" />
                    Manager Corrections List
                  </h4>
                  {item.manager_feedback_text ? (
                    <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-main)', backgroundColor: '#fff', padding: '10px 12px', borderRadius: '4px', border: '1px solid var(--border-color)', minHeight: '60px' }}>
                      {item.manager_feedback_text}
                    </p>
                  ) : (
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontStyle: 'italic' }}>No written manager feedback.</span>
                  )}


                </div>

                {/* Client Feedback (if any) */}
                <div>
                  <h4 style={{ fontSize: '13px', fontWeight: 800, margin: '0 0 10px 0', color: 'var(--text-color)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <MessageSquare size={16} className="text-success" />
                    Client Feedback & Adjustments
                  </h4>
                  {item.client_feedback_text ? (
                    <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-main)', backgroundColor: '#fff', padding: '10px 12px', borderRadius: '4px', border: '1px solid var(--border-color)', minHeight: '60px' }}>
                      {item.client_feedback_text}
                    </p>
                  ) : (
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontStyle: 'italic' }}>No client review comments.</span>
                  )}
                </div>
              </div>

              {/* Rework Submit Form */}
              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-main)' }}>
                    Re-submit Corrected Deliverable Link
                  </label>
                  {item.google_drive_link && (
                    <a href={item.google_drive_link} target="_blank" rel="noreferrer" style={{ fontSize: '12px', color: 'var(--primary)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px', fontWeight: 700 }}>
                      <Link size={12} /> Open Last Submitted Link
                    </a>
                  )}
                </div>
                
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="url"
                    placeholder="https://drive.google.com/drive/folders/..."
                    value={driveLinks[item.id] !== undefined ? driveLinks[item.id] : item.google_drive_link || ''}
                    onChange={(e) => handleLinkChange(item.id, e.target.value)}
                    className="form-control"
                    style={{ flex: 1, padding: '10px 12px', fontSize: '13px' }}
                    disabled={submittingId === item.id}
                  />
                  <button
                    className="btn btn-primary"
                    onClick={() => handleSubmitRework(item)}
                    disabled={submittingId === item.id}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '10px 16px' }}
                  >
                    <Send size={14} />
                    {submittingId === item.id ? 'Submitting...' : 'Send Rework'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EmployeeRework;
