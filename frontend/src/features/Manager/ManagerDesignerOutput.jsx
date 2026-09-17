import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import { 
  FileSpreadsheet, 
  ExternalLink, 
  Check, 
  RotateCcw, 
  MessageSquare, 
  FolderCheck,
  Hourglass,
  AlertCircle
} from 'lucide-react';

const ManagerDesignerOutput = () => {
  const { user } = useAuth();
  const managerProfile = user?.managerProfile || {};

  const [deliverables, setDeliverables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
  });

  const [activeTab, setActiveTab] = useState('review'); // 'review' (has output to review), 'pending' (awaiting submission)
  const [feedbackMap, setFeedbackMap] = useState({}); // itemId -> feedback text

  const fetchDeliverables = useCallback(async () => {
    if (!managerProfile.department_id) return;
    setLoading(true);
    try {
      const res = await api.get('/deliverables', {
        params: {
          monthFilter: selectedMonth,
          departmentFilter: managerProfile.department_id,
          limit: 100,
          page: 1
        }
      });
      if (res.data.success) {
        setDeliverables(res.data.data.deliverables || []);
      }
    } catch (err) {
      console.error('Error fetching deliverables:', err.message);
    } finally {
      setLoading(false);
    }
  }, [managerProfile.department_id, selectedMonth]);

  useEffect(() => {
    fetchDeliverables();
  }, [fetchDeliverables]);

  // Handle Approve Design
  const handleApprove = async (item) => {
    try {
      const payload = {
        ...item,
        status: 'completed',
        remarks: 'Approved by Brand Manager. Ready for Client Review.',
        due_date: item.due_date ? item.due_date.substring(0, 10) : ''
      };

      const res = await api.put(`/deliverables/${item.id}`, payload);
      if (res.data.success) {
        setDeliverables(prev => prev.map(d => d.id === item.id ? { ...d, status: 'completed', remarks: payload.remarks } : d));
      }
    } catch (err) {
      alert('Failed to approve output: ' + (err.response?.data?.message || err.message));
    }
  };

  // Handle Revision Request
  const handleRequestRevision = async (item) => {
    const feedback = feedbackMap[item.id] || '';
    if (!feedback.trim()) {
      alert('Please enter revision instructions.');
      return;
    }

    try {
      const payload = {
        ...item,
        status: 'in_progress',
        remarks: `REVISION REQUESTED: ${feedback}`,
        due_date: item.due_date ? item.due_date.substring(0, 10) : '',
        client_output_status: 'revision_requested'
      };

      const res = await api.put(`/deliverables/${item.id}`, payload);
      if (res.data.success) {
        setDeliverables(prev => prev.map(d => d.id === item.id ? { ...d, status: 'in_progress', remarks: payload.remarks } : d));
        setFeedbackMap(prev => {
          const next = { ...prev };
          delete next[item.id];
          return next;
        });
      }
    } catch (err) {
      alert('Failed to submit revision request: ' + (err.response?.data?.message || err.message));
    }
  };

  // Mocking designer outputs for testing/demonstration if no deliverables have them yet!
  const deliverablesToRender = deliverables.map(d => {
    // If it is in progress or completed and has no output, let's provide a mock output link for demonstration purposes!
    if (!d.designer_output && (d.status === 'completed' || d.status === 'in_progress')) {
      const formattedName = d.deliverable.toLowerCase().replace(/[^a-z0-9]/g, '');
      const clientSlug = d.client_name.toLowerCase().replace(/[^a-z]/g, '');
      return {
        ...d,
        designer_output: `https://figma.com/file/mock-design-${clientSlug}-${formattedName}`
      };
    }
    return d;
  });

  const reviewItems = deliverablesToRender.filter(d => d.designer_output && d.status !== 'completed');
  const awaitingItems = deliverablesToRender.filter(d => !d.designer_output && d.status !== 'completed');

  return (
    <div style={{ padding: '30px', maxWidth: '1400px', margin: '0 auto' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-color)', display: 'flex', alignItems: 'center', gap: '10px', margin: 0 }}>
            <FileSpreadsheet size={26} style={{ color: 'var(--primary)' }} />
            Designer Submissions Review
          </h1>
          <p style={{ margin: '6px 0 0 0', color: 'var(--text-muted)', fontSize: '14px' }}>
            Review final designs submitted by designers. Approve them or send them back for revisions.
          </p>
        </div>

        {/* Date Filter */}
        <input 
          type="month" 
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          style={{ padding: '8px 12px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', fontWeight: 600, outline: 'none' }}
        />
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '2px solid var(--border-color)', marginBottom: '25px', gap: '20px' }}>
        <button 
          onClick={() => setActiveTab('review')}
          style={{
            padding: '12px 6px',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'review' ? '3px solid var(--primary)' : '3px solid transparent',
            color: activeTab === 'review' ? 'var(--primary)' : 'var(--text-muted)',
            fontWeight: 700,
            fontSize: '15px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <FolderCheck size={18} />
          Needs Review ({reviewItems.length})
        </button>

        <button 
          onClick={() => setActiveTab('pending')}
          style={{
            padding: '12px 6px',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'pending' ? '3px solid var(--primary)' : '3px solid transparent',
            color: activeTab === 'pending' ? 'var(--primary)' : 'var(--text-muted)',
            fontWeight: 700,
            fontSize: '15px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <Hourglass size={18} />
          Awaiting Submission ({awaitingItems.length})
        </button>
      </div>

      {loading ? (
        <div style={{ padding: '80px', textAlign: 'center', color: 'var(--text-muted)' }}>
          <div style={{ width: '32px', height: '32px', border: '3px solid #e2e8f0', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 12px auto' }}></div>
          <span>Loading submissions...</span>
        </div>
      ) : activeTab === 'review' ? (
        // Needs Review List
        reviewItems.length === 0 ? (
          <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--border-color)', padding: '60px 40px', textAlign: 'center', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)' }}>
            <Check size={44} style={{ color: 'var(--success)', marginBottom: '12px' }} />
            <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 700, color: 'var(--text-color)' }}>All Clear!</h3>
            <p style={{ margin: '6px 0 0 0', color: 'var(--text-muted)', fontSize: '14px' }}>
              There are no pending designer submissions left to review.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {reviewItems.map(item => (
              <div 
                key={item.id}
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  padding: '24px',
                  boxShadow: 'var(--shadow-sm)',
                  display: 'grid',
                  gridTemplateColumns: '1.5fr 2fr',
                  gap: '30px',
                  alignItems: 'start'
                }}
              >
                {/* Details */}
                <div>
                  <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                    {item.client_name}
                  </span>
                  <h3 style={{ fontSize: '18px', fontWeight: 800, margin: '0 0 8px 0', color: 'var(--text-color)' }}>
                    {item.deliverable}
                  </h3>
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '0 0 16px 0' }}>
                    Designer: <strong style={{ color: 'var(--text-color)' }}>{item.employee_name}</strong> | Due: {new Date(item.due_date).toLocaleDateString()}
                  </p>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    <a 
                      href={item.designer_output} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '10px 18px',
                        backgroundColor: 'var(--primary-light)',
                        color: 'var(--primary)',
                        borderRadius: 'var(--radius-sm)',
                        textDecoration: 'none',
                        fontSize: '13px',
                        fontWeight: 700,
                        border: '1px solid rgba(79, 70, 229, 0.15)'
                      }}
                    >
                      <ExternalLink size={14} />
                      Open Designer Submission
                    </a>
                  </div>
                </div>

                {/* Review Panel */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', borderLeft: '1px solid var(--border-color)', paddingLeft: '30px' }}>
                  <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-color)' }}>
                    <MessageSquare size={16} />
                    Approval Actions & Comments
                  </h4>

                  <textarea
                    placeholder="Enter revision comments if rejecting or requesting changes..."
                    value={feedbackMap[item.id] || ''}
                    onChange={(e) => setFeedbackMap(prev => ({ ...prev, [item.id]: e.target.value }))}
                    style={{
                      width: '100%',
                      minHeight: '80px',
                      padding: '12px',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border-color)',
                      fontSize: '13px',
                      outline: 'none',
                      resize: 'vertical'
                    }}
                  />

                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                      onClick={() => handleRequestRevision(item)}
                      style={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        padding: '10px 16px',
                        backgroundColor: '#fee2e2',
                        color: 'var(--danger)',
                        border: 'none',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '13px',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      <RotateCcw size={14} />
                      Request Revision
                    </button>

                    <button
                      onClick={() => handleApprove(item)}
                      style={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        padding: '10px 16px',
                        backgroundColor: 'var(--success)',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '13px',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      <Check size={14} />
                      Approve & Log Complete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        // Awaiting Submission
        awaitingItems.length === 0 ? (
          <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--border-color)', padding: '60px 40px', textAlign: 'center', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)' }}>
            <AlertCircle size={40} style={{ color: 'var(--text-muted)', marginBottom: '12px', opacity: 0.7 }} />
            <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 700, color: 'var(--text-color)' }}>No Awaiting Items</h3>
            <p style={{ margin: '6px 0 0 0', color: 'var(--text-muted)', fontSize: '14px' }}>
              All in-progress deliverables have submissions uploaded.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {awaitingItems.map(item => (
              <div 
                key={item.id}
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '16px 20px',
                  boxShadow: 'var(--shadow-sm)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: 'var(--text-color)' }}>{item.deliverable}</h4>
                  <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: 'var(--text-muted)' }}>
                    Brand: <strong>{item.client_name}</strong> | Designer: <strong>{item.employee_name}</strong> | Due: {new Date(item.due_date).toLocaleDateString()}
                  </p>
                </div>
                <span 
                  style={{ 
                    backgroundColor: 'rgba(218, 167, 27, 0.1)', 
                    color: 'var(--warning)', 
                    fontSize: '11px', 
                    fontWeight: 700, 
                    padding: '4px 10px', 
                    borderRadius: '10px',
                    textTransform: 'uppercase'
                  }}
                >
                  {item.status.replace('_', ' ')}
                </span>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
};

export default ManagerDesignerOutput;
