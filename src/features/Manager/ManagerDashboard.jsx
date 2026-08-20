import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import { 
  LayoutDashboard, 
  Clock, 
  AlertCircle, 
  CheckCircle, 
  PlayCircle,
  Calendar,
  Layers,
  ArrowRight
} from 'lucide-react';

import SMMDashboard from './SMMDashboard';
// import SEODashboard from './SEODashboard';
import CreativesDashboard from './CreativesDashboard';

const ManagerDashboard = () => {
  const { user } = useAuth();
  const managerProfile = user?.managerProfile || {};

  if (managerProfile.department_code === 'SMM-RS') {
    return <SMMDashboard />;
  }

  // if (managerProfile.department_code === 'SEO-RS') {
  //   return <SEODashboard />;
  // }

  if (managerProfile.department_code === 'CD-RS' || managerProfile.department_id === 1) {
    return <CreativesDashboard />;
  }

  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
  });

  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    completed: 0,
    totalEffortHours: 0
  });

  const [upcomingDeliverables, setUpcomingDeliverables] = useState([]);
  const [activityTypesMap, setActivityTypesMap] = useState({});

  const fetchDashboardData = useCallback(async () => {
    if (!managerProfile.department_id) return;
    setLoading(true);
    try {
      // 1. Fetch active activity types to get setup times
      const actRes = await api.get('/activity-types');
      const actMap = {};
      if (actRes.data.success) {
        actRes.data.data.forEach(at => {
          const creatorTime = parseInt(at.creator_setup_time_mins, 10) || 0;
          const editorTime = parseInt(at.editor_setup_time_mins, 10) || 0;
          actMap[at.activity_type_code] = creatorTime + editorTime;
        });
        setActivityTypesMap(actMap);
      }

      // 2. Fetch deliverables for this manager and selected month
      const response = await api.get('/deliverables', {
        params: {
          monthFilter: selectedMonth,
          departmentFilter: managerProfile.department_id,
          limit: 100000, // Fetch all items to calculate correct statistics
          page: 1
        }
      });

      if (response.data.success) {
        const list = response.data.data.deliverables || [];
        
        let pending = 0;
        let inProgress = 0;
        let completed = 0;
        let totalEffortMins = 0;

        list.forEach(item => {
          if (item.status === 'pending') pending++;
          else if (item.status === 'in_progress') inProgress++;
          else if (item.status === 'completed') completed++;

          const setupMins = actMap[item.activity_type_code] || 0;
          totalEffortMins += (item.quantity || 1) * setupMins;
        });

        setStats({
          total: list.length,
          pending,
          inProgress,
          completed,
          totalEffortHours: Math.round((totalEffortMins / 60) * 10) / 10
        });

        // Get first 5 sorted by due date
        const sorted = [...list]
          .filter(item => item.status !== 'completed')
          .sort((a, b) => new Date(a.due_date) - new Date(b.due_date));
        setUpcomingDeliverables(sorted.slice(0, 5));
      }
    } catch (err) {
      console.error('Error fetching manager dashboard statistics:', err.message);
    } finally {
      setLoading(false);
    }
  }, [managerProfile.department_id, selectedMonth]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  if (loading && stats.total === 0) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '80vh', color: 'var(--text-muted)' }}>
        <div style={{ width: '32px', height: '32px', border: '3px solid #e2e8f0', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ padding: '30px', maxWidth: '1400px', margin: '0 auto' }}>
      
      {/* Header Banner */}
      <div 
        style={{
          background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
          padding: '30px 40px',
          borderRadius: 'var(--radius-lg)',
          color: '#ffffff',
          marginBottom: '30px',
          boxShadow: 'var(--shadow-md)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px'
        }}
      >
        <div>
          <span 
            style={{ 
              backgroundColor: 'rgba(218, 167, 27, 0.2)', 
              color: '#fef08a', 
              fontSize: '12px', 
              fontWeight: 700, 
              padding: '6px 14px', 
              borderRadius: '20px',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              display: 'inline-block',
              marginBottom: '10px'
            }}
          >
            {managerProfile.department_name || 'Manager Portal'}
          </span>
          <h1 style={{ fontSize: '28px', fontWeight: 800, margin: 0, letterSpacing: '-0.5px' }}>
            Hello, <span style={{ color: '#fbbf24' }}>{managerProfile.full_name || 'Department Manager'}</span>!
          </h1>
          <p style={{ margin: '8px 0 0 0', color: '#c7d2fe', fontSize: '15px', fontWeight: 500 }}>
            Monitor and delegate deliverables for your department to designer employees.
          </p>
        </div>

        {/* Date Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: 'rgba(255,255,255,0.08)', padding: '8px 16px', borderRadius: 'var(--radius-md)' }}>
          <Calendar size={18} style={{ color: '#c7d2fe' }} />
          <span style={{ fontSize: '14px', fontWeight: 600, color: '#e0e7ff' }}>Select Month:</span>
          <input 
            type="month" 
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            style={{ 
              backgroundColor: 'transparent', 
              border: 'none', 
              color: '#ffffff', 
              outline: 'none', 
              fontWeight: 700,
              fontSize: '14px',
              cursor: 'pointer'
            }} 
          />
        </div>
      </div>

      {/* Grid Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        
        {/* Total Deliverables */}
        <div className="stat-card" style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '20px', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ backgroundColor: 'rgba(79, 70, 229, 0.1)', color: 'var(--primary)', padding: '12px', borderRadius: 'var(--radius-sm)' }}>
            <Layers size={24} />
          </div>
          <div>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 600, display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Items</span>
            <span style={{ fontSize: '26px', fontWeight: 800, color: 'var(--text-color)' }}>{stats.total}</span>
          </div>
        </div>

        {/* Pending */}
        <div className="stat-card" style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '20px', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ backgroundColor: 'rgba(218, 167, 27, 0.1)', color: 'var(--warning)', padding: '12px', borderRadius: 'var(--radius-sm)' }}>
            <AlertCircle size={24} />
          </div>
          <div>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 600, display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Pending</span>
            <span style={{ fontSize: '26px', fontWeight: 800, color: 'var(--text-color)' }}>{stats.pending}</span>
          </div>
        </div>

        {/* In Progress */}
        <div className="stat-card" style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '20px', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', color: 'var(--info)', padding: '12px', borderRadius: 'var(--radius-sm)' }}>
            <PlayCircle size={24} />
          </div>
          <div>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 600, display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px' }}>In Progress</span>
            <span style={{ fontSize: '26px', fontWeight: 800, color: 'var(--text-color)' }}>{stats.inProgress}</span>
          </div>
        </div>

        {/* Completed */}
        <div className="stat-card" style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '20px', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', padding: '12px', borderRadius: 'var(--radius-sm)' }}>
            <CheckCircle size={24} />
          </div>
          <div>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 600, display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Completed</span>
            <span style={{ fontSize: '26px', fontWeight: 800, color: 'var(--text-color)' }}>{stats.completed}</span>
          </div>
        </div>

      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px', alignItems: 'start' }}>
        
        {/* Upcoming Pending Deliverables */}
        <div style={{ backgroundColor: '#ffffff', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', padding: '30px', boxShadow: 'var(--shadow-sm)' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 20px 0', display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-color)' }}>
            <Clock size={20} style={{ color: 'var(--primary)' }} />
            Upcoming Pending Deliverables
          </h2>

          {upcomingDeliverables.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
              <CheckCircle size={40} style={{ color: 'var(--success)', marginBottom: '12px' }} />
              <p style={{ margin: 0, fontWeight: 600 }}>All deliverables for this month are completed!</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {upcomingDeliverables.map(item => {
                const totalMins = activityTypesMap[item.activity_type_code] || 0;
                return (
                  <div 
                    key={item.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '16px 20px',
                      backgroundColor: 'var(--bg-light)',
                      borderRadius: 'var(--radius-sm)',
                      borderLeft: '4px solid ' + (item.priority === 'high' ? 'var(--danger)' : item.priority === 'medium' ? 'var(--warning)' : 'var(--success)')
                    }}
                  >
                    <div>
                      <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: 'var(--text-color)' }}>{item.deliverable}</h4>
                      <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: 'var(--text-muted)' }}>
                        Client: <strong style={{ color: 'var(--text-color)' }}>{item.client_name}</strong> | Due: <span style={{ fontWeight: 600 }}>{new Date(item.due_date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}</span>
                      </p>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      {totalMins > 0 && (
                        <div style={{ textAlign: 'right' }}>
                          <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', fontWeight: 600, textTransform: 'uppercase' }}>Effort</span>
                          <span style={{ fontSize: '13px', fontWeight: 700, color: '#ec4899' }}>{totalMins} mins</span>
                        </div>
                      )}
                      
                      <span 
                        style={{
                          backgroundColor: item.status === 'in_progress' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(218, 167, 27, 0.1)',
                          color: item.status === 'in_progress' ? 'var(--info)' : 'var(--warning)',
                          padding: '4px 10px',
                          borderRadius: '12px',
                          fontSize: '11px',
                          fontWeight: 700,
                          textTransform: 'uppercase'
                        }}
                      >
                        {item.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Workload Progress Card */}
        <div style={{ backgroundColor: '#ffffff', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', padding: '30px', boxShadow: 'var(--shadow-sm)' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 20px 0', color: 'var(--text-color)' }}>
            Workload Progress
          </h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', fontWeight: 600, marginBottom: '8px', color: 'var(--text-color)' }}>
                <span>Deliverables Completed</span>
                <span>{stats.completed} / {stats.total}</span>
              </div>
              <div style={{ height: '8px', backgroundColor: 'var(--border-color)', borderRadius: '4px', overflow: 'hidden' }}>
                <div 
                  style={{ 
                    height: '100%', 
                    backgroundColor: 'var(--success)', 
                    width: `${stats.total > 0 ? (stats.completed / stats.total) * 100 : 0}%`,
                    transition: 'width 0.5s ease-in-out'
                  }} 
                />
              </div>
            </div>

            <div style={{ backgroundColor: 'var(--bg-light)', padding: '16px', borderRadius: 'var(--radius-sm)', border: '1px dashed var(--border-color)' }}>
              <h4 style={{ margin: '0 0 6px 0', fontSize: '13px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Department Effort Analytics
              </h4>
              <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-color)', lineHeight: 1.5 }}>
                Estimated labor duration is <strong style={{ color: '#ec4899' }}>{stats.totalEffortHours} target hours</strong>. 
                This calculates task difficulty against activity configuration rules.
              </p>
            </div>
            
            <a 
              href="/manager/deliverables"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '12px',
                backgroundColor: 'var(--primary)',
                color: '#ffffff',
                borderRadius: 'var(--radius-sm)',
                textDecoration: 'none',
                fontWeight: 700,
                fontSize: '14px',
                textAlign: 'center',
                boxShadow: '0 2px 4px rgba(79, 70, 229, 0.2)',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#4338ca'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'var(--primary)'; }}
            >
              Go to Allocation Panel
              <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </div>

    </div>
  );
};

export default ManagerDashboard;
