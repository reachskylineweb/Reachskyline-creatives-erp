import React, { useState, useEffect, useCallback } from 'react';
import { 
  Building2, Layers, GitMerge, Award, Users, UserCheck, 
  CheckSquare, FileCheck, Clock, Calendar, RefreshCw, 
  Search, AlertCircle, ListTodo, ClipboardList
} from 'lucide-react';
import api from '../../../utils/api';

const AdminDashboard = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filtration States
  const [filterType, setFilterType] = useState('daily'); // daily | monthly
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [selectedMonth, setSelectedMonth] = useState(() => new Date().toISOString().substring(0, 7));

  // Activity Log Search States
  const [activitySearch, setActivitySearch] = useState('');
  const [activityDateFilter, setActivityDateFilter] = useState('');

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const res = await api.get('/dashboard/admin-metrics', {
        params: {
          date: selectedDate,
          month: selectedMonth
        }
      });

      if (res.data.success) {
        setMetrics(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching dashboard metrics:', err.message);
      setError('Could not load dashboard metrics. Check database connection.');
    } finally {
      setLoading(false);
    }
  }, [selectedDate, selectedMonth]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  if (loading && !metrics) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', color: 'var(--text-muted)' }}>
        <div style={{ width: '40px', height: '40px', border: '4px solid #e2e8f0', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        <p style={{ marginTop: '16px', fontWeight: 600 }}>Assembling ERP Admin Dashboard Panels...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container" style={{ padding: '30px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '24px', backgroundColor: 'var(--danger-light)', color: 'var(--danger)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <AlertCircle size={28} />
            <div>
              <h4 style={{ fontWeight: 700, margin: 0, fontSize: '16px' }}>Backend Database & API Connection Error</h4>
              <p style={{ fontSize: '14px', margin: '4px 0 0 0', opacity: 0.9 }}>{error}</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
            <button
              onClick={() => fetchDashboardData()}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                backgroundColor: 'var(--danger)',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                fontWeight: 600,
                cursor: 'pointer',
                fontSize: '13px'
              }}
            >
              <RefreshCw size={16} /> Retry Connection
            </button>
            <button
              onClick={() => {
                localStorage.removeItem('erp_token');
                localStorage.removeItem('erp_user');
                window.location.href = '/login';
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                backgroundColor: 'transparent',
                color: 'var(--danger)',
                border: '1px solid var(--danger)',
                borderRadius: '6px',
                fontWeight: 600,
                cursor: 'pointer',
                fontSize: '13px'
              }}
            >
              Re-login to Renew Session
            </button>
          </div>
        </div>
      </div>
    );
  }

  const stats = metrics?.stats || { totalClients: 0, totalDepartments: 0, totalSubDepartments: 0, totalManagers: 0, totalEmployees: 0, totalHR: 0 };
  const daily = metrics?.daily || { totalTodayWork: 0, completedTodayWork: 0, pendingTodayWork: 0, todayClientsList: [], todayPostingsCount: 0 };
  const monthly = metrics?.monthly || { totalMonthlyWork: 0, completedMonthlyWork: 0, pendingMonthlyWork: 0 };
  const recentActivities = metrics?.recentActivities || [];

  // Filter activities locally
  const filteredActivities = recentActivities.filter(activity => {
    const matchesSearch = 
      activity.action?.toLowerCase().includes(activitySearch.toLowerCase()) ||
      activity.description?.toLowerCase().includes(activitySearch.toLowerCase()) ||
      activity.username?.toLowerCase().includes(activitySearch.toLowerCase()) ||
      activity.role?.toLowerCase().includes(activitySearch.toLowerCase());

    const matchesDate = !activityDateFilter || activity.created_at?.startsWith(activityDateFilter);
    return matchesSearch && matchesDate;
  });

  // Graph Data based on active filter toggle
  const isDaily = filterType === 'daily';
  const totalGraphCount = isDaily ? daily.totalTodayWork : monthly.totalMonthlyWork;
  const completedGraphCount = isDaily ? daily.completedTodayWork : monthly.completedMonthlyWork;
  const pendingGraphCount = isDaily ? daily.pendingTodayWork : monthly.pendingMonthlyWork;

  const completedPct = totalGraphCount > 0 ? Math.round((completedGraphCount / totalGraphCount) * 100) : 0;
  const pendingPct = totalGraphCount > 0 ? Math.round((pendingGraphCount / totalGraphCount) * 100) : 0;

  return (
    <div className="page-container" style={{ padding: '30px', maxWidth: '1400px', margin: '0 auto' }}>
      
      {/* Top Filtration Controls Bar */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '28px', 
        backgroundColor: '#ffffff', 
        border: '1px solid var(--border-color)', 
        borderRadius: 'var(--radius-md)', 
        padding: '16px 24px', 
        boxShadow: 'var(--shadow-sm)',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-color)', margin: 0 }}>Enterprise Admin Dashboard</h2>
          <p style={{ margin: '4px 0 0 0', color: 'var(--text-muted)', fontSize: '13px' }}>Real-time business intelligence, daily logs & team workflow tracker</p>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <select 
            value={filterType} 
            onChange={(e) => setFilterType(e.target.value)}
            className="filter-select"
            style={{ width: '130px', padding: '8px 12px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)' }}
          >
            <option value="daily">Daily Filter</option>
            <option value="monthly">Monthly Filter</option>
          </select>

          {filterType === 'daily' ? (
            <input 
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              style={{ padding: '8px 12px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', outline: 'none' }}
            />
          ) : (
            <input 
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              style={{ padding: '8px 12px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', outline: 'none' }}
            />
          )}

          <button 
            className="btn btn-secondary" 
            onClick={fetchDashboardData} 
            disabled={loading}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', height: '38px' }}
          >
            <RefreshCw size={14} className={loading ? 'spin' : ''} /> {loading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* Grid count cards (Employee list counts, Clients, Departments, Managers, HR) */}
      <div className="stats-grid" style={{ marginBottom: '24px' }}>
        
        <div className="card stat-card" style={{ padding: '20px' }}>
          <div className="stat-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span className="stat-title" style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)' }}>Total Clients</span>
            <div className="stat-icon bg-blue" style={{ width: '36px', height: '36px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b82f6', backgroundColor: 'rgba(59, 130, 246, 0.1)' }}><Building2 size={18} /></div>
          </div>
          <div>
            <div className="stat-value" style={{ fontSize: '28px', fontWeight: '800', color: 'var(--text-color)' }}>{stats.totalClients}</div>
            <div className="stat-footer" style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>Active partnerships</div>
          </div>
        </div>

        <div className="card stat-card" style={{ padding: '20px' }}>
          <div className="stat-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span className="stat-title" style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)' }}>Departments</span>
            <div className="stat-icon bg-teal" style={{ width: '36px', height: '36px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#14b8a6', backgroundColor: 'rgba(20, 184, 166, 0.1)' }}><Layers size={18} /></div>
          </div>
          <div>
            <div className="stat-value" style={{ fontSize: '28px', fontWeight: '800', color: 'var(--text-color)' }}>{stats.totalDepartments}</div>
            <div className="stat-footer" style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>Organized units</div>
          </div>
        </div>

        <div className="card stat-card" style={{ padding: '20px' }}>
          <div className="stat-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span className="stat-title" style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)' }}>Sub-departments</span>
            <div className="stat-icon bg-orange" style={{ width: '36px', height: '36px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f97316', backgroundColor: 'rgba(249, 115, 22, 0.1)' }}><GitMerge size={18} /></div>
          </div>
          <div>
            <div className="stat-value" style={{ fontSize: '28px', fontWeight: '800', color: 'var(--text-color)' }}>{stats.totalSubDepartments}</div>
            <div className="stat-footer" style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>Specialized sections</div>
          </div>
        </div>

        <div className="card stat-card" style={{ padding: '20px' }}>
          <div className="stat-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span className="stat-title" style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)' }}>Managers</span>
            <div className="stat-icon bg-purple" style={{ width: '36px', height: '36px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a855f7', backgroundColor: 'rgba(168, 85, 247, 0.1)' }}><Award size={18} /></div>
          </div>
          <div>
            <div className="stat-value" style={{ fontSize: '28px', fontWeight: '800', color: 'var(--text-color)' }}>{stats.totalManagers}</div>
            <div className="stat-footer" style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>Operational leaders</div>
          </div>
        </div>

        <div className="card stat-card" style={{ padding: '20px' }}>
          <div className="stat-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span className="stat-title" style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)' }}>Employees</span>
            <div className="stat-icon bg-green" style={{ width: '36px', height: '36px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--success)', backgroundColor: 'rgba(16, 185, 129, 0.1)' }}><Users size={18} /></div>
          </div>
          <div>
            <div className="stat-value" style={{ fontSize: '28px', fontWeight: '800', color: 'var(--text-color)' }}>{stats.totalEmployees}</div>
            <div className="stat-footer" style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>Registered employees</div>
          </div>
        </div>

      </div>

      {/* Row 2: Today's detailed metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr 1fr', gap: '20px', marginBottom: '28px' }}>
        
        {/* Card 1: Today's Total Work */}
        <div className="card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '50px', height: '50px', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(218, 167, 27, 0.08)', color: '#DAA71B' }}>
            <ClipboardList size={26} />
          </div>
          <div>
            <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)', display: 'block' }}>Today's Total Tasks</span>
            <h3 style={{ margin: '4px 0 0 0', fontSize: '26px', fontWeight: '800', color: 'var(--text-color)' }}>{daily.totalTodayWork}</h3>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Scheduled for {selectedDate}</span>
          </div>
        </div>

        {/* Card 2: Today's Working Clients List */}
        <div className="card" style={{ padding: '20px', display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Building2 size={16} /> Clients Active Today
          </span>
          <div style={{ flex: 1, maxHeight: '80px', overflowY: 'auto', display: 'flex', flexWrap: 'wrap', gap: '6px', alignContent: 'flex-start' }}>
            {daily.todayClientsList && daily.todayClientsList.length > 0 ? (
              daily.todayClientsList.map((client, idx) => (
                <span key={idx} className="badge badge-active" style={{ fontSize: '11px', padding: '4px 10px', textTransform: 'none', backgroundColor: 'rgba(218, 167, 27, 0.1)', color: 'var(--primary)', fontWeight: 600 }}>
                  {client}
                </span>
              ))
            ) : (
              <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontStyle: 'italic' }}>No active client deliverables today.</span>
            )}
          </div>
        </div>

        {/* Card 3: Postings Done Today */}
        <div className="card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '50px', height: '50px', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(16, 185, 129, 0.08)', color: 'var(--success)' }}>
            <FileCheck size={26} />
          </div>
          <div>
            <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)', display: 'block' }}>Postings Completed Today</span>
            <h3 style={{ margin: '4px 0 0 0', fontSize: '26px', fontWeight: '800', color: 'var(--text-color)' }}>{daily.todayPostingsCount}</h3>
            <span style={{ fontSize: '11px', color: 'var(--success)', fontWeight: 700 }}>Published live</span>
          </div>
        </div>

      </div>

      {/* Main Grid: Postings Chart & Filtered Activity Log */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }}>
        
        {/* Left Side: Graphs for completed today vs pending / monthly */}
        <div className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ListTodo size={18} className="text-primary" /> 
            {isDaily ? `Deliverables Activity Graph (${selectedDate})` : `Monthly Postings Distribution (${selectedMonth})`}
          </h3>

          <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', flex: 1, padding: '10px 0' }}>
            
            {/* SVG Visual Progress Circles */}
            <div style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
              <div style={{ position: 'relative', width: '130px', height: '130px' }}>
                <svg width="100%" height="100%" viewBox="0 0 42 42" className="donut">
                  <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#e2e8f0" strokeWidth="4.5"></circle>
                  <circle 
                    cx="21" 
                    cy="21" 
                    r="15.915" 
                    fill="transparent" 
                    stroke="var(--success)" 
                    strokeWidth="4.5" 
                    strokeDasharray={`${completedPct} ${100 - completedPct}`} 
                    strokeDashoffset="25"
                  ></circle>
                </svg>
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                  <span style={{ display: 'block', fontSize: '20px', fontWeight: 800, color: 'var(--success)' }}>{completedPct}%</span>
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Done</span>
                </div>
              </div>

              <div style={{ position: 'relative', width: '130px', height: '130px' }}>
                <svg width="100%" height="100%" viewBox="0 0 42 42" className="donut">
                  <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#e2e8f0" strokeWidth="4.5"></circle>
                  <circle 
                    cx="21" 
                    cy="21" 
                    r="15.915" 
                    fill="transparent" 
                    stroke="#f97316" 
                    strokeWidth="4.5" 
                    strokeDasharray={`${pendingPct} ${100 - pendingPct}`} 
                    strokeDashoffset="25"
                  ></circle>
                </svg>
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                  <span style={{ display: 'block', fontSize: '20px', fontWeight: 800, color: '#f97316' }}>{pendingPct}%</span>
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Pending</span>
                </div>
              </div>
            </div>

            {/* Vertical Count bars */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', minWidth: '150px' }}>
              <div style={{ backgroundColor: 'var(--bg-light)', padding: '12px 16px', borderRadius: '6px', borderLeft: '4px solid var(--success)' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Completed / Posted</span>
                <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-color)' }}>{completedGraphCount}</div>
              </div>
              <div style={{ backgroundColor: 'var(--bg-light)', padding: '12px 16px', borderRadius: '6px', borderLeft: '4px solid #f97316' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Pending / In Progress</span>
                <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-color)' }}>{pendingGraphCount}</div>
              </div>
              <div style={{ borderTop: '1px dashed var(--border-color)', paddingTop: '10px', paddingLeft: '6px' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Total Output Volume</span>
                <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-main)' }}>{totalGraphCount} postings</div>
              </div>
            </div>

          </div>
        </div>

        {/* Right Side: Activity log with filtration */}
        <div className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', height: '400px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Clock size={18} className="text-secondary" /> Activity Logs
          </h3>
          
          {/* Logs Toolbar */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <Search style={{ position: 'absolute', left: '10px', top: '10px', color: 'var(--text-muted)' }} size={14} />
              <input
                type="text"
                placeholder="Search log action or username..."
                value={activitySearch}
                onChange={(e) => setActivitySearch(e.target.value)}
                className="form-control"
                style={{ width: '100%', paddingLeft: '32px', fontSize: '12px', height: '34px', margin: 0 }}
              />
            </div>
            <input 
              type="date"
              value={activityDateFilter}
              onChange={(e) => setActivityDateFilter(e.target.value)}
              style={{ width: '130px', padding: '6px 8px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', fontSize: '12px', height: '34px', outline: 'none' }}
            />
          </div>

          {/* Logs scrollable panel */}
          <div style={{ flex: 1, overflowY: 'auto', paddingRight: '4px' }}>
            {filteredActivities.length === 0 ? (
              <div style={{ textRank: 'center', padding: '40px 0', color: 'var(--text-muted)', fontSize: '13px' }}>
                No matching activity logs found.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {filteredActivities.map(log => (
                  <div key={log.id} style={{ display: 'flex', gap: '10px', fontSize: '12px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
                    <div style={{ 
                      width: '28px', 
                      height: '28px', 
                      borderRadius: '50%', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      backgroundColor: log.role === 'admin' ? 'rgba(239, 68, 68, 0.1)' : log.role === 'manager' ? 'rgba(168, 85, 247, 0.1)' : 'rgba(59, 130, 246, 0.1)',
                      color: log.role === 'admin' ? '#ef4444' : log.role === 'manager' ? '#a855f7' : '#3b82f6',
                      flexShrink: 0,
                      fontWeight: 700,
                      fontSize: '10px'
                    }}>
                      {log.username ? log.username.substring(0, 2).toUpperCase() : '??'}
                    </div>
                    <div style={{ flex: 1 }}>
                      <strong style={{ color: 'var(--text-color)', display: 'block' }}>{log.action}</strong>
                      <span style={{ color: 'var(--text-muted)', display: 'block', margin: '2px 0' }}>{log.description}</span>
                      <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                        by {log.username} ({log.role?.toUpperCase()}) • {new Date(log.created_at).toLocaleDateString()} {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};

export default AdminDashboard;
