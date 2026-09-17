import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import { CheckCircle2, Search, ExternalLink, Calendar, User } from 'lucide-react';

const ManagerApprovedWorks = () => {
  const { user } = useAuth();
  const managerProfile = user?.managerProfile || {};

  const [deliverables, setDeliverables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
  });

  const fetchApprovedDeliverables = useCallback(async () => {
    if (!managerProfile.department_id) return;
    setLoading(true);
    try {
      const res = await api.get('/deliverables', {
        params: {
          monthFilter: selectedMonth,
          departmentFilter: managerProfile.department_id,
          statusFilter: 'completed',
          limit: 100,
          page: 1
        }
      });
      if (res.data.success) {
        setDeliverables(res.data.data.deliverables || []);
      }
    } catch (err) {
      console.error('Error fetching approved deliverables:', err.message);
    } finally {
      setLoading(false);
    }
  }, [managerProfile.department_id, selectedMonth]);

  useEffect(() => {
    fetchApprovedDeliverables();
  }, [fetchApprovedDeliverables]);

  const filteredItems = deliverables.filter(item => 
    item.deliverable.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.client_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.employee_name || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ padding: '30px', maxWidth: '1400px', margin: '0 auto' }}>
      
      {/* Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-color)', display: 'flex', alignItems: 'center', gap: '10px', margin: 0 }}>
            <CheckCircle2 size={26} style={{ color: 'var(--success)' }} />
            Approved Works History
          </h1>
          <p style={{ margin: '6px 0 0 0', color: 'var(--text-muted)', fontSize: '14px' }}>
            Browse the history of completed and approved deliverables in your department.
          </p>
        </div>

        <input 
          type="month" 
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          style={{ padding: '8px 12px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', fontWeight: 600, outline: 'none' }}
        />
      </div>

      {/* Search bar */}
      <div style={{ position: 'relative', marginBottom: '20px', width: '100%', maxWidth: '400px' }}>
        <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        <input
          type="text"
          placeholder="Search by client, designer or deliverable..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: '100%',
            padding: '10px 12px 10px 40px',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-sm)',
            fontSize: '14px',
            outline: 'none'
          }}
        />
      </div>

      {/* Grid List */}
      {loading ? (
        <div style={{ padding: '80px', textAlign: 'center', color: 'var(--text-muted)' }}>
          <div style={{ width: '32px', height: '32px', border: '3px solid #e2e8f0', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 12px auto' }}></div>
          <span>Loading archive...</span>
        </div>
      ) : filteredItems.length === 0 ? (
        <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--border-color)', padding: '60px 40px', textAlign: 'center', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)' }}>
          <CheckCircle2 size={40} style={{ color: 'var(--success)', marginBottom: '12px', opacity: 0.5 }} />
          <p style={{ margin: 0, fontWeight: 600, color: 'var(--text-muted)' }}>No completed works found in this month.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
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
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                    {item.client_name}
                  </span>
                  <span 
                    style={{
                      backgroundColor: 'rgba(16, 185, 129, 0.1)',
                      color: 'var(--success)',
                      padding: '4px 10px',
                      borderRadius: '12px',
                      fontSize: '11px',
                      fontWeight: 700,
                      textTransform: 'uppercase'
                    }}
                  >
                    Approved
                  </span>
                </div>

                <h3 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 8px 0', color: 'var(--text-color)' }}>
                  {item.deliverable}
                </h3>
                
                {item.remarks && (
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '0 0 16px 0', fontStyle: 'italic' }}>
                    Remarks: "{item.remarks}"
                  </p>
                )}
              </div>

              <div 
                style={{ 
                  borderTop: '1px solid var(--border-color)', 
                  paddingTop: '12px', 
                  marginTop: '12px', 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '13px'
                }}
              >
                <div>
                  <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '11px' }}>Designer</span>
                  <strong style={{ color: 'var(--text-color)' }}>{item.employee_name}</strong>
                </div>

                {item.designer_output && (
                  <a 
                    href={item.designer_output} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      color: 'var(--primary)',
                      textDecoration: 'none',
                      fontWeight: 700,
                      fontSize: '12px'
                    }}
                  >
                    Open Submission
                    <ExternalLink size={12} />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default ManagerApprovedWorks;
