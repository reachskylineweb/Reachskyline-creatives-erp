import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import { 
  MessageSquare, 
  CheckCircle, 
  RotateCcw, 
  ExternalLink,
  HelpCircle,
  Play
} from 'lucide-react';

const ManagerClientOutput = () => {
  const { user } = useAuth();
  const managerProfile = user?.managerProfile || {};

  const [deliverables, setDeliverables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
  });

  const [simulationText, setSimulationText] = useState({}); // itemId -> feedback text

  const fetchClientDeliverables = useCallback(async () => {
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
        // Show completed deliverables (approved by manager) or any items having client feedback
        const list = res.data.data.deliverables || [];
        const clientTracked = list.filter(item => 
          item.status === 'completed' || 
          item.client_output_status === 'revision_requested' ||
          item.client_output_status === 'approved'
        );
        setDeliverables(clientTracked);
      }
    } catch (err) {
      console.error('Error fetching client deliverables:', err.message);
    } finally {
      setLoading(false);
    }
  }, [managerProfile.department_id, selectedMonth]);

  useEffect(() => {
    fetchClientDeliverables();
  }, [fetchClientDeliverables]);

  // Simulate Client Action (saves to database)
  const handleSimulateClient = async (item, actionType) => {
    const feedback = simulationText[item.id] || '';
    if (actionType === 'revision_requested' && !feedback.trim()) {
      alert('Please enter client feedback instructions to request a revision.');
      return;
    }

    try {
      const payload = {
        ...item,
        due_date: item.due_date ? item.due_date.substring(0, 10) : '',
        client_output_status: actionType,
        client_feedback: actionType === 'revision_requested' ? feedback : null,
        client_action_at: new Date().toISOString(),
        // If client requests revision, status goes back to in_progress!
        status: actionType === 'revision_requested' ? 'in_progress' : item.status,
        remarks: actionType === 'revision_requested' ? `CLIENT FEEDBACK: ${feedback}` : item.remarks
      };

      const res = await api.put(`/deliverables/${item.id}`, payload);
      if (res.data.success) {
        setDeliverables(prev => prev.map(d => d.id === item.id ? { 
          ...d, 
          client_output_status: actionType, 
          client_feedback: payload.client_feedback,
          client_action_at: payload.client_action_at,
          status: payload.status,
          remarks: payload.remarks
        } : d));

        setSimulationText(prev => {
          const next = { ...prev };
          delete next[item.id];
          return next;
        });
      }
    } catch (err) {
      alert('Simulation failed: ' + (err.response?.data?.message || err.message));
    }
  };

  // Send back to designer explicitly
  const handleRerouteToDesigner = async (item) => {
    try {
      const payload = {
        ...item,
        status: 'in_progress',
        remarks: `CLIENT REVISION REQUIRED: ${item.client_feedback || 'Adjust design elements.'}`,
        due_date: item.due_date ? item.due_date.substring(0, 10) : ''
      };

      const res = await api.put(`/deliverables/${item.id}`, payload);
      if (res.data.success) {
        setDeliverables(prev => prev.map(d => d.id === item.id ? { ...d, status: 'in_progress', remarks: payload.remarks } : d));
        alert('Task has been successfully sent back to designer.');
      }
    } catch (err) {
      alert('Failed: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div style={{ padding: '30px', maxWidth: '1400px', margin: '0 auto' }}>
      
      {/* Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-color)', display: 'flex', alignItems: 'center', gap: '10px', margin: 0 }}>
            <MessageSquare size={26} style={{ color: 'var(--primary)' }} />
            Client Reviews & Outputs
          </h1>
          <p style={{ margin: '6px 0 0 0', color: 'var(--text-muted)', fontSize: '14px' }}>
            Monitor client approvals and feedback for your department's completed designs.
          </p>
        </div>

        <input 
          type="month" 
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          style={{ padding: '8px 12px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', fontWeight: 600, outline: 'none' }}
        />
      </div>

      {loading ? (
        <div style={{ padding: '80px', textAlign: 'center', color: 'var(--text-muted)' }}>
          <div style={{ width: '32px', height: '32px', border: '3px solid #e2e8f0', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 12px auto' }}></div>
          <span>Loading client outputs...</span>
        </div>
      ) : deliverables.length === 0 ? (
        <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--border-color)', padding: '60px 40px', textAlign: 'center', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)' }}>
          <HelpCircle size={40} style={{ color: 'var(--text-muted)', marginBottom: '12px', opacity: 0.7 }} />
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: 'var(--text-color)' }}>No deliverables in review</h3>
          <p style={{ margin: '8px 0 0 0', color: 'var(--text-muted)', fontSize: '14px' }}>
            Completed deliverables will show up here once approved by the Brand Manager.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {deliverables.map(item => {
            const hasFeedback = !!item.client_feedback;
            const statusLabel = 
              item.client_output_status === 'approved' ? 'Approved by Client' : 
              item.client_output_status === 'revision_requested' ? 'Revision Requested' : 
              'Awaiting Client Review';

            return (
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
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                      {item.client_name}
                    </span>
                    <span 
                      style={{
                        backgroundColor: item.client_output_status === 'approved' ? 'rgba(16, 185, 129, 0.1)' : item.client_output_status === 'revision_requested' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(218, 167, 27, 0.1)',
                        color: item.client_output_status === 'approved' ? 'var(--success)' : item.client_output_status === 'revision_requested' ? 'var(--danger)' : 'var(--warning)',
                        padding: '4px 10px',
                        borderRadius: '12px',
                        fontSize: '11px',
                        fontWeight: 700,
                        textTransform: 'uppercase'
                      }}
                    >
                      {statusLabel}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '17px', fontWeight: 800, margin: '0 0 8px 0', color: 'var(--text-color)' }}>
                    {item.deliverable}
                  </h3>
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '0 0 16px 0' }}>
                    Designer: <strong style={{ color: 'var(--text-color)' }}>{item.employee_name}</strong> | Status: <strong style={{ color: 'var(--primary)', textTransform: 'capitalize' }}>{item.status}</strong>
                    {item.client_action_at && (
                      <>
                        {' '}| Client Action Date: <strong style={{ color: 'var(--text-color)' }}>{new Date(item.client_action_at).toLocaleString('en-US', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</strong>
                      </>
                    )}
                  </p>

                  <div style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
                    {item.designer_output && (
                      <a 
                        href={item.designer_output} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          fontSize: '13px',
                          color: 'var(--primary)',
                          textDecoration: 'none',
                          fontWeight: 700
                        }}
                      >
                        <ExternalLink size={14} />
                        View Submitted Design Output
                      </a>
                    )}

                    {hasFeedback && (
                      <div style={{ backgroundColor: 'var(--bg-light)', padding: '14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', marginTop: '8px' }}>
                        <strong style={{ display: 'block', fontSize: '12px', color: 'var(--danger)', textTransform: 'uppercase', marginBottom: '4px' }}>Client Feedback:</strong>
                        <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-color)', lineHeight: 1.4 }}>"{item.client_feedback}"</p>
                        
                        {item.status !== 'in_progress' && (
                          <button
                            onClick={() => handleRerouteToDesigner(item)}
                            style={{
                              marginTop: '10px',
                              padding: '6px 12px',
                              backgroundColor: 'var(--danger-light)',
                              color: 'var(--danger)',
                              border: '1px solid rgba(239, 68, 68, 0.2)',
                              borderRadius: 'var(--radius-sm)',
                              fontSize: '12px',
                              fontWeight: 700,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                          >
                            <RotateCcw size={12} />
                            Send to Designer to Fix
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Simulation Panel */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', borderLeft: '1px solid var(--border-color)', paddingLeft: '30px' }}>
                  <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: 'var(--text-color)', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Play size={14} style={{ color: 'var(--primary)' }} />
                    Simulate Client Review Action
                  </h4>
                  <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)' }}>
                    (Since the client portal is external, use this panel to simulate review inputs for demonstration.)
                  </p>

                  <textarea
                    placeholder="Enter client revision instructions here (required only for request revision)..."
                    value={simulationText[item.id] || ''}
                    onChange={(e) => setSimulationText(prev => ({ ...prev, [item.id]: e.target.value }))}
                    style={{
                      width: '100%',
                      minHeight: '80px',
                      padding: '10px 12px',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border-color)',
                      fontSize: '13px',
                      outline: 'none',
                      resize: 'none'
                    }}
                  />

                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                      onClick={() => handleSimulateClient(item, 'revision_requested')}
                      style={{
                        flex: 1,
                        padding: '10px 14px',
                        backgroundColor: '#fee2e2',
                        color: 'var(--danger)',
                        border: 'none',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '13px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px'
                      }}
                    >
                      <RotateCcw size={14} />
                      Simulate Client Reject
                    </button>

                    <button
                      onClick={() => handleSimulateClient(item, 'approved')}
                      style={{
                        flex: 1,
                        padding: '10px 14px',
                        backgroundColor: 'var(--success)',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '13px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px'
                      }}
                    >
                      <CheckCircle size={14} />
                      Simulate Client Approve
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ManagerClientOutput;
