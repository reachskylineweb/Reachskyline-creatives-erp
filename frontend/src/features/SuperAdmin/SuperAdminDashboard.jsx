import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building, Users, UserCheck, BarChart3, ArrowRight, RefreshCw, AlertCircle } from 'lucide-react';
import api from '../../utils/api';

const SuperAdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchStats = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/super-admin/dashboard');
      if (res.data.success) {
        setStats(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching dashboard stats:', err.message);
      setError('Failed to load dashboard statistics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div style={{ padding: '30px', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* Title Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '26px', fontWeight: 800, color: 'var(--text-color)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <BarChart3 size={28} style={{ color: 'var(--primary)' }} />
            Super Admin Dashboard
          </h1>
          <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: 'var(--text-muted)' }}>
            Corporate performance summary and branch efficiency aggregates.
          </p>
        </div>
        <button 
          className="btn btn-secondary" 
          onClick={fetchStats} 
          disabled={loading}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
        >
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {error && (
        <div style={{ padding: '12px 20px', backgroundColor: 'var(--danger-light)', color: 'var(--danger)', fontSize: '13px', fontWeight: 600, borderRadius: '4px', marginBottom: '24px' }}>
          {error}
        </div>
      )}

      {loading ? (
        <div style={{ padding: '80px', textAlign: 'center', color: 'var(--text-muted)' }}>
          <div className="spinner" style={{ margin: '0 auto 12px auto' }}></div>
          <span>Compiling dashboard analytics...</span>
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px', marginBottom: '40px' }}>
            
            {/* Total Branches */}
            <div 
              onClick={() => navigate('/super-admin/branches')}
              style={{ backgroundColor: '#ffffff', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '24px', boxShadow: 'var(--shadow-sm)', display: 'flex', alignItems: 'center', gap: '20px', cursor: 'pointer', transition: 'transform 0.2s' }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{ padding: '12px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--primary-light)', color: 'var(--primary)' }}>
                <Building size={24} />
              </div>
              <div>
                <span style={{ fontSize: '12px', color: 'var(--text-light)', fontWeight: 700, display: 'block', textTransform: 'uppercase' }}>Active Branches</span>
                <strong style={{ fontSize: '26px', fontWeight: 800 }}>{stats?.branches?.length || 0}</strong>
              </div>
            </div>

            {/* Total Clients */}
            <div 
              onClick={() => navigate('/super-admin/clients')}
              style={{ backgroundColor: '#ffffff', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '24px', boxShadow: 'var(--shadow-sm)', display: 'flex', alignItems: 'center', gap: '20px', cursor: 'pointer', transition: 'transform 0.2s' }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{ padding: '12px', borderRadius: 'var(--radius-sm)', backgroundColor: 'rgba(59, 130, 246, 0.1)', color: 'var(--info)' }}>
                <Users size={24} />
              </div>
              <div>
                <span style={{ fontSize: '12px', color: 'var(--text-light)', fontWeight: 700, display: 'block', textTransform: 'uppercase' }}>Total Clients</span>
                <strong style={{ fontSize: '26px', fontWeight: 800 }}>{stats?.clientsCount || 0}</strong>
              </div>
            </div>

            {/* Total Employees */}
            <div 
              onClick={() => navigate('/super-admin/efficiency')}
              style={{ backgroundColor: '#ffffff', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '24px', boxShadow: 'var(--shadow-sm)', display: 'flex', alignItems: 'center', gap: '20px', cursor: 'pointer', transition: 'transform 0.2s' }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{ padding: '12px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--success-light)', color: 'var(--success)' }}>
                <UserCheck size={24} />
              </div>
              <div>
                <span style={{ fontSize: '12px', color: 'var(--text-light)', fontWeight: 700, display: 'block', textTransform: 'uppercase' }}>Total Employees</span>
                <strong style={{ fontSize: '26px', fontWeight: 800 }}>{stats?.employeesCount || 0}</strong>
              </div>
            </div>
          </div>

          {/* Branch Efficiency Grid */}
          <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '24px', boxShadow: 'var(--shadow-sm)' }}>
            <h3 style={{ margin: '0 0 20px 0', fontSize: '16px', fontWeight: 800, color: 'var(--text-color)' }}>
              Branch Performance & Efficiency Aggregates
            </h3>
            
            {stats?.branchEfficiencyList?.length === 0 ? (
              <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '13px' }}>No branch performance data compiled yet.</p>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
                {stats?.branchEfficiencyList?.map(be => {
                  let barColor = 'var(--success)';
                  if (be.efficiency < 50) barColor = 'var(--danger)';
                  else if (be.efficiency < 80) barColor = 'var(--warning)';

                  return (
                    <div 
                      key={be.id}
                      onClick={() => navigate(`/super-admin/branches/${be.id}`)}
                      style={{
                        padding: '20px',
                        border: '1px solid var(--border-color)',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        transition: 'box-shadow 0.2s',
                        backgroundColor: 'var(--bg-app)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.boxShadow = 'var(--shadow-sm)'}
                      onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}
                    >
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                          <h4 style={{ margin: 0, fontWeight: 800, fontSize: '14px', color: 'var(--text-color)' }}>
                            {be.name} Branch
                          </h4>
                          <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--primary)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            View Branch <ArrowRight size={13} />
                          </span>
                        </div>
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{ flex: 1, height: '8px', backgroundColor: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                            <div style={{ width: `${be.efficiency}%`, height: '100%', backgroundColor: barColor, borderRadius: '4px' }}></div>
                          </div>
                          <strong style={{ fontSize: '14px', width: '36px', textAlign: 'right' }}>{be.efficiency}%</strong>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default SuperAdminDashboard;
