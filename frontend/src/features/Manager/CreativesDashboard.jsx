import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  AlertCircle, 
  PlayCircle, 
  CheckCircle, 
  Clock, 
  BarChart3, 
  PieChart, 
  ChevronLeft, 
  ChevronRight,
  Sparkles,
  ArrowRight,
  Layers
} from 'lucide-react';
import { Link } from 'react-router-dom';

const getSubDeptGroup = (subDeptCode, subDeptName) => {
  const code = (subDeptCode || '').toUpperCase();
  const name = (subDeptName || '').toLowerCase();
  
  if (code === 'GD-RS' || (name.includes('graphic') && !name.includes('creative'))) {
    return 'Graphic Designers';
  }
  if (code === 'VD-RS' || name.includes('video') || name.includes('editor')) {
    return 'Video Editors';
  }
  if (code === 'CW-RS' || name.includes('content') || name.includes('writer')) {
    return 'Content Writers';
  }
  if (code === 'CD-RS' || name.includes('creative')) {
    return 'Creative Designers';
  }
  return 'Other';
};

const CreativesDashboard = () => {
  const { user } = useAuth();
  const managerProfile = user?.managerProfile || {};

  const [loading, setLoading] = useState(true);
  const [activeFilterTab, setActiveFilterTab] = useState('daily'); // 'daily' | 'monthly'

  // Date filters
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  });

  const [selectedMonth, setSelectedMonth] = useState(() => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
  });

  const [deliverables, setDeliverables] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [subDepartments, setSubDepartments] = useState([]);
  const [error, setError] = useState(null);

  const fetchDashboardData = useCallback(async () => {
    if (!managerProfile.department_id) return;
    setLoading(true);
    setError(null);
    try {
      // Determine the month we need to fetch deliverables for
      // We fetch all deliverables for the month to calculate correct daily and monthly statistics in memory
      const monthQuery = activeFilterTab === 'daily' ? selectedDate.substring(0, 7) : selectedMonth;

      const [devRes, empRes, subDeptRes] = await Promise.all([
        api.get('/deliverables', {
          params: {
            departmentFilter: managerProfile.department_id,
            monthFilter: monthQuery,
            limit: 100000, // Fetch all deliverables in this month for perfect counts
            page: 1
          }
        }),
        api.get('/users/employees', {
          params: {
            departmentFilter: managerProfile.department_id,
            limit: 500,
            page: 1
          }
        }),
        api.get(`/departments/${managerProfile.department_id}/sub-departments`)
      ]);

      if (devRes.data.success) {
        setDeliverables(devRes.data.data.deliverables || []);
      }
      if (empRes.data.success) {
        setEmployees(empRes.data.data.employees || []);
      }
      if (subDeptRes.data.success) {
        setSubDepartments(subDeptRes.data.data.subDepartments || []);
      }
    } catch (err) {
      console.error('Error fetching creatives dashboard data:', err);
      setError('Failed to fetch dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [managerProfile.department_id, activeFilterTab, selectedDate, selectedMonth]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Compute deliverables based on selected tab filter
  const filteredDeliverables = useMemo(() => {
    return deliverables.filter(item => {
      if (!item.due_date) return false;
      const itemDate = item.due_date.substring(0, 10);
      if (activeFilterTab === 'daily') {
        return itemDate === selectedDate;
      } else {
        return itemDate.substring(0, 7) === selectedMonth;
      }
    });
  }, [deliverables, activeFilterTab, selectedDate, selectedMonth]);

  // General counts (Correct & validated)
  const stats = useMemo(() => {
    const total = filteredDeliverables.length;
    const pending = filteredDeliverables.filter(item => item.status === 'pending').length;
    const inProgress = filteredDeliverables.filter(item => item.status === 'in_progress').length;
    const completed = filteredDeliverables.filter(item => item.status === 'completed').length;
    const cancelled = filteredDeliverables.filter(item => item.status === 'cancelled').length;
    const activeEmployeesCount = employees.filter(e => e.status === 'active').length;

    return {
      total,
      pending,
      inProgress,
      completed,
      cancelled,
      employeesCount: activeEmployeesCount
    };
  }, [filteredDeliverables, employees]);

  // Breakdown of employee counts by roles
  const employeeBreakdown = useMemo(() => {
    const counts = {
      'Graphic Designers': 0,
      'Video Editors': 0,
      'Content Writers': 0,
      'Creative Designers': 0,
      'Other': 0
    };
    employees.forEach(emp => {
      if (emp.status === 'active') {
        const group = getSubDeptGroup(emp.sub_department_code, emp.sub_department_name);
        counts[group] = (counts[group] || 0) + 1;
      }
    });
    return counts;
  }, [employees]);

  // Work assigned to each role: Content Writers, Video Editors, Graphic Designers, Creative Designers
  const roleWorkload = useMemo(() => {
    const stats = {
      'Content Writers': { total: 0, completed: 0, pending: 0 },
      'Video Editors': { total: 0, completed: 0, pending: 0 },
      'Graphic Designers': { total: 0, completed: 0, pending: 0 },
      'Creative Designers': { total: 0, completed: 0, pending: 0 },
      'Other': { total: 0, completed: 0, pending: 0 }
    };

    filteredDeliverables.forEach(item => {
      // Find the employee's sub-department
      const emp = employees.find(e => e.id === item.assigned_employee_id);
      let code = '';
      let name = '';

      if (emp) {
        code = emp.sub_department_code;
        name = emp.sub_department_name;
      } else if (item.sub_department_id) {
        const sd = subDepartments.find(s => s.id === item.sub_department_id);
        if (sd) {
          code = sd.code;
          name = sd.name;
        }
      }

      const group = getSubDeptGroup(code, name);
      stats[group].total++;
      if (item.status === 'completed') {
        stats[group].completed++;
      } else {
        stats[group].pending++; // pending + in_progress + cancelled as outstanding
      }
    });

    return stats;
  }, [filteredDeliverables, employees, subDepartments]);

  // Date Navigation handlers
  const handlePrevDate = () => {
    if (activeFilterTab === 'daily') {
      const current = new Date(selectedDate);
      current.setDate(current.getDate() - 1);
      setSelectedDate(current.toISOString().split('T')[0]);
    } else {
      const [year, month] = selectedMonth.split('-').map(Number);
      const prev = new Date(year, month - 2, 1);
      setSelectedMonth(`${prev.getFullYear()}-${String(prev.getMonth() + 1).padStart(2, '0')}`);
    }
  };

  const handleNextDate = () => {
    if (activeFilterTab === 'daily') {
      const current = new Date(selectedDate);
      current.setDate(current.getDate() + 1);
      setSelectedDate(current.toISOString().split('T')[0]);
    } else {
      const [year, month] = selectedMonth.split('-').map(Number);
      const next = new Date(year, month, 1);
      setSelectedMonth(`${next.getFullYear()}-${String(next.getMonth() + 1).padStart(2, '0')}`);
    }
  };

  // SVG Donut Chart parameters
  const donutChartData = useMemo(() => {
    const total = stats.total;
    if (total === 0) return [];
    return [
      { name: 'Completed', count: stats.completed, color: '#10b981' },
      { name: 'In Progress', count: stats.inProgress, color: '#3b82f6' },
      { name: 'Pending', count: stats.pending, color: '#f59e0b' },
      { name: 'Cancelled', count: stats.cancelled, color: '#ef4444' }
    ].filter(item => item.count > 0);
  }, [stats]);

  const donutSegments = useMemo(() => {
    const total = stats.total;
    if (total === 0) return [];

    let accumulatedPercentage = 0;
    const r = 50;
    const circ = 2 * Math.PI * r; // ~314.16

    return donutChartData.map(item => {
      const percentage = item.count / total;
      const strokeDasharray = `${percentage * circ} ${circ}`;
      const strokeDashoffset = -accumulatedPercentage * circ;
      accumulatedPercentage += percentage;
      return {
        ...item,
        strokeDasharray,
        strokeDashoffset
      };
    });
  }, [donutChartData, stats.total]);

  // Custom SVG Bar Chart parameters
  const barChartMaxVal = useMemo(() => {
    const vals = Object.values(roleWorkload).map(d => d.total);
    const max = Math.max(...vals, 5); // Fallback to 5 to avoid zero division/tiny bars
    return Math.ceil(max / 5) * 5; // Round to nearest 5
  }, [roleWorkload]);

  const activeRoles = ['Graphic Designers', 'Video Editors', 'Content Writers', 'Creative Designers'];

  const formattedSelectedDate = useMemo(() => {
    const d = new Date(selectedDate);
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
  }, [selectedDate]);

  const formattedSelectedMonth = useMemo(() => {
    const [y, m] = selectedMonth.split('-');
    const d = new Date(y, m - 1, 1);
    return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  }, [selectedMonth]);

  return (
    <div style={{ padding: '30px', maxWidth: '1400px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '30px' }}>
      
      {/* Premium Header Banner */}
      <div 
        style={{
          background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
          padding: '32px 40px',
          borderRadius: 'var(--radius-lg)',
          color: '#ffffff',
          boxShadow: 'var(--shadow-lg)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '24px',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}
      >
        <div>
          <span 
            style={{ 
              backgroundColor: 'rgba(218, 167, 27, 0.15)', 
              color: '#fef08a', 
              fontSize: '11px', 
              fontWeight: 800, 
              padding: '6px 14px', 
              borderRadius: '30px',
              textTransform: 'uppercase',
              letterSpacing: '1.2px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              marginBottom: '12px',
              border: '1px solid rgba(254, 240, 138, 0.2)'
            }}
          >
            <Sparkles size={12} />
            {managerProfile.department_name || 'Creatives Department'}
          </span>
          <h1 style={{ fontSize: '30px', fontWeight: 800, margin: 0, letterSpacing: '-0.8px', color: '#ffffff' }}>
            Hello, <span style={{ color: '#fbbf24' }}>{managerProfile.full_name || 'Creative Manager'}</span>!
          </h1>
          <p style={{ margin: '8px 0 0 0', color: '#c7d2fe', fontSize: '15px', fontWeight: 500, opacity: 0.9 }}>
            Overview of deliverables, workflow status, and employee allocation for your creatives team.
          </p>
        </div>

        {/* Filters and Controls Desk */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', minWidth: '320px' }}>
          
          {/* Tab Selector */}
          <div style={{ display: 'flex', backgroundColor: 'rgba(0,0,0,0.25)', padding: '4px', borderRadius: 'var(--radius-sm)' }}>
            <button 
              onClick={() => setActiveFilterTab('daily')}
              style={{
                flex: 1,
                border: 'none',
                backgroundColor: activeFilterTab === 'daily' ? 'var(--primary)' : 'transparent',
                color: '#ffffff',
                padding: '8px 16px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 700,
                fontSize: '13px',
                transition: 'all 0.2s ease'
              }}
            >
              Daily View
            </button>
            <button 
              onClick={() => setActiveFilterTab('monthly')}
              style={{
                flex: 1,
                border: 'none',
                backgroundColor: activeFilterTab === 'monthly' ? 'var(--primary)' : 'transparent',
                color: '#ffffff',
                padding: '8px 16px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 700,
                fontSize: '13px',
                transition: 'all 0.2s ease'
              }}
            >
              Monthly View
            </button>
          </div>

          {/* Time Picker Navigation */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'rgba(255,255,255,0.08)', padding: '6px 12px', borderRadius: 'var(--radius-sm)' }}>
            <button 
              onClick={handlePrevDate}
              style={{ border: 'none', backgroundColor: 'transparent', color: '#ffffff', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '4px' }}
            >
              <ChevronLeft size={18} />
            </button>

            <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
              <Calendar size={15} style={{ color: '#fbbf24' }} />
              {activeFilterTab === 'daily' ? (
                <input 
                  type="date" 
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  style={{ 
                    backgroundColor: 'transparent', 
                    border: 'none', 
                    color: '#ffffff', 
                    outline: 'none', 
                    fontWeight: 700,
                    fontSize: '13px',
                    cursor: 'pointer',
                    width: '120px'
                  }} 
                />
              ) : (
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
                    fontSize: '13px',
                    cursor: 'pointer',
                    width: '120px'
                  }} 
                />
              )}
            </div>

            <button 
              onClick={handleNextDate}
              style={{ border: 'none', backgroundColor: 'transparent', color: '#ffffff', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '4px' }}
            >
              <ChevronRight size={18} />
            </button>
          </div>

        </div>
      </div>

      {/* Statistics Cards Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
        
        {/* Metric Card 1: Total Items */}
        <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '20px', boxShadow: 'var(--shadow-sm)', transition: 'transform 0.2s', cursor: 'default' }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseLeave={e => e.currentTarget.style.transform = 'none'}>
          <div style={{ backgroundColor: 'rgba(79, 70, 229, 0.1)', color: 'var(--secondary)', padding: '14px', borderRadius: '12px' }}>
            <Layers size={22} />
          </div>
          <div>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 700, display: 'block', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '4px' }}>
              {activeFilterTab === 'daily' ? 'Tasks Today' : 'Tasks This Month'}
            </span>
            <span style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-color)' }}>{stats.total}</span>
          </div>
        </div>

        {/* Metric Card 2: Pending */}
        <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '20px', boxShadow: 'var(--shadow-sm)', transition: 'transform 0.2s', cursor: 'default' }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseLeave={e => e.currentTarget.style.transform = 'none'}>
          <div style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', color: 'var(--warning)', padding: '14px', borderRadius: '12px' }}>
            <Clock size={22} />
          </div>
          <div>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 700, display: 'block', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '4px' }}>
              Pending Tasks
            </span>
            <span style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-color)' }}>{stats.pending + stats.inProgress}</span>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginTop: '2px' }}>
              {stats.pending} waiting • {stats.inProgress} in progress
            </span>
          </div>
        </div>

        {/* Metric Card 3: Completed */}
        <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '20px', boxShadow: 'var(--shadow-sm)', transition: 'transform 0.2s', cursor: 'default' }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseLeave={e => e.currentTarget.style.transform = 'none'}>
          <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', padding: '14px', borderRadius: '12px' }}>
            <CheckCircle size={22} />
          </div>
          <div>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 700, display: 'block', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '4px' }}>
              Completed
            </span>
            <span style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-color)' }}>{stats.completed}</span>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginTop: '2px' }}>
              Completion Rate: {stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%
            </span>
          </div>
        </div>

        {/* Metric Card 4: Employees count */}
        <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '20px', boxShadow: 'var(--shadow-sm)', transition: 'transform 0.2s', cursor: 'default', position: 'relative' }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseLeave={e => e.currentTarget.style.transform = 'none'}>
          <div style={{ backgroundColor: 'rgba(236, 72, 153, 0.1)', color: '#ec4899', padding: '14px', borderRadius: '12px' }}>
            <Users size={22} />
          </div>
          <div>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 700, display: 'block', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '4px' }}>
              Active Employees
            </span>
            <span style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-color)' }}>{stats.employeesCount}</span>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginTop: '2px' }}>
              CW: {employeeBreakdown['Content Writers']} • VD: {employeeBreakdown['Video Editors']} • GD: {employeeBreakdown['Graphic Designers']} • CD: {employeeBreakdown['Creative Designers']}
            </span>
          </div>
        </div>

      </div>

      {error && (
        <div style={{ backgroundColor: 'var(--danger-light)', border: '1px solid var(--danger)', color: 'var(--danger)', padding: '15px', borderRadius: 'var(--radius-sm)', fontWeight: 600 }}>
          {error}
        </div>
      )}

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '350px', gap: '16px', color: 'var(--text-muted)' }}>
          <div style={{ width: '40px', height: '40px', border: '3px solid #e2e8f0', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
          <p style={{ fontWeight: 600 }}>Analyzing dashboard analytics...</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      ) : (
        <>
          {/* Charts Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '7fr 5fr', gap: '30px', alignItems: 'stretch' }}>
            
            {/* Custom SVG Bar Chart */}
            <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '30px', boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: 'var(--text-color)', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                  <BarChart3 size={18} style={{ color: 'var(--primary)' }} />
                  Workload Distribution by Role ({activeFilterTab === 'daily' ? 'Today' : 'Month'})
                </h3>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>
                  Max: {barChartMaxVal} units
                </span>
              </div>

              {stats.total === 0 ? (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                  <BarChart3 size={48} style={{ color: 'var(--text-light)', marginBottom: '12px', opacity: 0.5 }} />
                  <p style={{ margin: 0, fontWeight: 600 }}>No workload data to chart for this period.</p>
                </div>
              ) : (
                <div style={{ width: '100%', overflowX: 'auto', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  
                  {/* Custom SVG Element */}
                  <svg width="100%" height="240" viewBox="0 0 600 240" preserveAspectRatio="xMidYMid meet" style={{ overflow: 'visible' }}>
                    {/* Gridlines */}
                    {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
                      const y = 20 + ratio * 160;
                      const val = Math.round(barChartMaxVal * (1 - ratio));
                      return (
                        <g key={idx}>
                          <line x1="60" y1={y} x2="560" y2={y} stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4 4" />
                          <text x="45" y={y + 4} fill="var(--text-muted)" fontSize="10" textAnchor="end" fontWeight="600">{val}</text>
                        </g>
                      );
                    })}

                    {/* Bars */}
                    {activeRoles.map((role, idx) => {
                      const roleStats = roleWorkload[role] || { total: 0, completed: 0 };
                      const colWidth = 100;
                      const xBase = 60 + idx * 125 + 20;

                      // Height calculations
                      const totalBarHeight = (roleStats.total / barChartMaxVal) * 160;
                      const completedBarHeight = (roleStats.completed / barChartMaxVal) * 160;

                      // Coordinates
                      const yTotal = 180 - totalBarHeight;
                      const yCompleted = 180 - completedBarHeight;

                      return (
                        <g key={role} style={{ cursor: 'pointer' }}>
                          {/* Tooltip triggers */}
                          <title>{`${role}: ${roleStats.total} assigned, ${roleStats.completed} completed`}</title>
                          
                          {/* Total Bar (Vibrant Indigo Gradient effect) */}
                          <rect 
                            x={xBase} 
                            y={yTotal} 
                            width="24" 
                            height={totalBarHeight > 0 ? totalBarHeight : 1} 
                            rx="4" 
                            fill="#6366f1"
                            opacity="0.85"
                            style={{ transition: 'height 0.4s ease, y 0.4s ease' }}
                          />
                          {/* Value text above Total Bar */}
                          {roleStats.total > 0 && (
                            <text x={xBase + 12} y={yTotal - 6} fill="#4f46e5" fontSize="10" fontWeight="700" textAnchor="middle">{roleStats.total}</text>
                          )}

                          {/* Completed Bar (Vibrant Emerald Gradient effect) */}
                          <rect 
                            x={xBase + 28} 
                            y={yCompleted} 
                            width="24" 
                            height={completedBarHeight > 0 ? completedBarHeight : 1} 
                            rx="4" 
                            fill="#10b981"
                            opacity="0.9"
                            style={{ transition: 'height 0.4s ease, y 0.4s ease' }}
                          />
                          {/* Value text above Completed Bar */}
                          {roleStats.completed > 0 && (
                            <text x={xBase + 40} y={yCompleted - 6} fill="#059669" fontSize="10" fontWeight="700" textAnchor="middle">{roleStats.completed}</text>
                          )}

                          {/* X-axis labels */}
                          <text 
                            x={xBase + 26} 
                            y="204" 
                            fill="var(--text-main)" 
                            fontSize="11" 
                            fontWeight="700" 
                            textAnchor="middle"
                          >
                            {role.split(' ')[0]} {/* Shorten label, e.g. "Graphic" */}
                          </text>
                          <text 
                            x={xBase + 26} 
                            y="218" 
                            fill="var(--text-muted)" 
                            fontSize="9" 
                            fontWeight="600" 
                            textAnchor="middle"
                          >
                            {role.split(' ')[1] || ''}
                          </text>
                        </g>
                      );
                    })}

                    {/* Bottom Baseline */}
                    <line x1="55" y1="180" x2="565" y2="180" stroke="var(--border-color)" strokeWidth="1.5" />
                  </svg>

                  {/* Chart Legend */}
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginTop: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ width: '12px', height: '12px', backgroundColor: '#6366f1', borderRadius: '3px', display: 'inline-block' }}></span>
                      <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>Total Assigned Work</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ width: '12px', height: '12px', backgroundColor: '#10b981', borderRadius: '3px', display: 'inline-block' }}></span>
                      <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>Completed Work</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Custom SVG Donut Status Chart */}
            <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '30px', boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column' }}>
              <h3 style={{ margin: '0 0 24px 0', fontSize: '16px', fontWeight: 800, color: 'var(--text-color)', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                <PieChart size={18} style={{ color: 'var(--primary)' }} />
                Completion Status Distribution
              </h3>

              {stats.total === 0 ? (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                  <PieChart size={48} style={{ color: 'var(--text-light)', marginBottom: '12px', opacity: 0.5 }} />
                  <p style={{ margin: 0, fontWeight: 600 }}>No status data available.</p>
                </div>
              ) : (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '24px' }}>
                  
                  {/* SVG Donut */}
                  <div style={{ position: 'relative', width: '160px', height: '160px' }}>
                    <svg width="100%" height="100%" viewBox="0 0 120 120">
                      <circle cx="60" cy="60" r="50" fill="none" stroke="#f1f5f9" strokeWidth="14" />
                      {donutSegments.map((segment, idx) => (
                        <circle
                          key={idx}
                          cx="60"
                          cy="60"
                          r="50"
                          fill="none"
                          stroke={segment.color}
                          strokeWidth="14"
                          strokeDasharray={segment.strokeDasharray}
                          strokeDashoffset={segment.strokeDashoffset}
                          transform="rotate(-90 60 60)"
                          style={{ transition: 'stroke-dasharray 0.3s, stroke-dashoffset 0.3s' }}
                        >
                          <title>{`${segment.name}: ${segment.count} (${Math.round((segment.count / stats.total) * 100)}%)`}</title>
                        </circle>
                      ))}
                    </svg>
                    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                      <span style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-color)' }}>{stats.total}</span>
                      <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Tasks</span>
                    </div>
                  </div>

                  {/* Donut Legend */}
                  <div style={{ width: '100%', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 20px', padding: '0 10px' }}>
                    {/* Completed */}
                    <div style={{ display: 'flex', alignItems: 'center', justify_content: 'space-between', padding: '8px 12px', backgroundColor: '#f8fafc', borderRadius: '6px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ width: '10px', height: '10px', backgroundColor: '#10b981', borderRadius: '50%', display: 'inline-block' }}></span>
                        <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>Completed</span>
                      </div>
                      <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--text-color)' }}>{stats.completed}</span>
                    </div>
                    {/* In Progress */}
                    <div style={{ display: 'flex', alignItems: 'center', justify_content: 'space-between', padding: '8px 12px', backgroundColor: '#f8fafc', borderRadius: '6px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ width: '10px', height: '10px', backgroundColor: '#3b82f6', borderRadius: '50%', display: 'inline-block' }}></span>
                        <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>In Progress</span>
                      </div>
                      <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--text-color)' }}>{stats.inProgress}</span>
                    </div>
                    {/* Pending */}
                    <div style={{ display: 'flex', alignItems: 'center', justify_content: 'space-between', padding: '8px 12px', backgroundColor: '#f8fafc', borderRadius: '6px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ width: '10px', height: '10px', backgroundColor: '#f59e0b', borderRadius: '50%', display: 'inline-block' }}></span>
                        <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>Pending</span>
                      </div>
                      <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--text-color)' }}>{stats.pending}</span>
                    </div>
                    {/* Cancelled */}
                    <div style={{ display: 'flex', alignItems: 'center', justify_content: 'space-between', padding: '8px 12px', backgroundColor: '#f8fafc', borderRadius: '6px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ width: '10px', height: '10px', backgroundColor: '#ef4444', borderRadius: '50%', display: 'inline-block' }}></span>
                        <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>Cancelled</span>
                      </div>
                      <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--text-color)' }}>{stats.cancelled}</span>
                    </div>
                  </div>

                </div>
              )}
            </div>

          </div>

          {/* Details Table Card */}
          <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '30px', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '15px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: 'var(--text-color)', display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
                  <Clock size={20} style={{ color: 'var(--primary)' }} />
                  Deliverables for {activeFilterTab === 'daily' ? formattedSelectedDate : formattedSelectedMonth} ({filteredDeliverables.length})
                </h3>
                <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: 'var(--text-muted)' }}>
                  A list of all content, graphics, and video projects scheduled for this period.
                </p>
              </div>

              <Link 
                to="/manager/job-works"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 18px',
                  backgroundColor: 'var(--primary)',
                  color: '#ffffff',
                  borderRadius: 'var(--radius-sm)',
                  fontWeight: 700,
                  fontSize: '13px',
                  boxShadow: '0 2px 5px rgba(218, 167, 27, 0.25)',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--primary-hover)'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'var(--primary)'}
              >
                Task Allocation Panel
                <ArrowRight size={14} />
              </Link>
            </div>

            {filteredDeliverables.length === 0 ? (
              <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
                <CheckCircle size={44} style={{ color: 'var(--success)', marginBottom: '14px', opacity: 0.8 }} />
                <p style={{ margin: 0, fontSize: '15px', fontWeight: 700 }}>No deliverables found for this date range.</p>
                <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: 'var(--text-light)' }}>Select another period or schedule deliverables via the Allocations Panel.</p>
              </div>
            ) : (
              <div style={{ overflowX: 'auto', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid var(--border-color)' }}>
                      <th style={{ padding: '16px 20px', fontSize: '12px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Deliverable</th>
                      <th style={{ padding: '16px 20px', fontSize: '12px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Client</th>
                      <th style={{ padding: '16px 20px', fontSize: '12px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Assigned Employee</th>
                      <th style={{ padding: '16px 20px', fontSize: '12px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Due Date</th>
                      <th style={{ padding: '16px 20px', fontSize: '12px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Priority</th>
                      <th style={{ padding: '16px 20px', fontSize: '12px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDeliverables.map((item, idx) => {
                      // Lookup employee role/sub-dept
                      const emp = employees.find(e => e.id === item.assigned_employee_id);
                      const subDeptName = emp ? emp.sub_department_name : (subDepartments.find(s => s.id === item.sub_department_id)?.name || 'Creative Specialist');
                      
                      return (
                        <tr 
                          key={item.id} 
                          style={{ 
                            borderBottom: idx < filteredDeliverables.length - 1 ? '1px solid var(--border-color)' : 'none',
                            backgroundColor: idx % 2 === 0 ? 'transparent' : '#fcfdfd',
                            transition: 'background-color 0.15s'
                          }}
                          onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f8fafc'}
                          onMouseLeave={e => e.currentTarget.style.backgroundColor = idx % 2 === 0 ? 'transparent' : '#fcfdfd'}
                        >
                          {/* Deliverable info */}
                          <td style={{ padding: '16px 20px' }}>
                            <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--text-color)' }}>{item.deliverable}</div>
                            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <span>Code: {item.activity_code || `DEL-${item.id}`}</span>
                              {item.is_job_work === 1 && (
                                <span style={{ backgroundColor: 'rgba(236, 72, 153, 0.1)', color: '#ec4899', fontSize: '9px', fontWeight: 700, padding: '1px 5px', borderRadius: '4px' }}>Job Work</span>
                              )}
                            </div>
                          </td>

                          {/* Client info */}
                          <td style={{ padding: '16px 20px', fontSize: '14px', color: 'var(--text-color)', fontWeight: 600 }}>
                            {item.client_name}
                          </td>

                          {/* Assigned employee info */}
                          <td style={{ padding: '16px 20px' }}>
                            {item.assigned_employee_id ? (
                              <div>
                                <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--text-color)' }}>{item.employee_name}</div>
                                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>{subDeptName}</div>
                              </div>
                            ) : (
                              <span style={{ fontStyle: 'italic', color: 'var(--text-light)', fontSize: '13px', fontWeight: 600 }}>Unassigned</span>
                            )}
                          </td>

                          {/* Due date */}
                          <td style={{ padding: '16px 20px', fontSize: '13px', color: 'var(--text-color)', fontWeight: 600 }}>
                            {new Date(item.due_date).toLocaleDateString('en-US', { timeZone: 'UTC', day: 'numeric', month: 'short', year: 'numeric' })}
                          </td>

                          {/* Priority badge */}
                          <td style={{ padding: '16px 20px' }}>
                            <span 
                              style={{
                                backgroundColor: item.priority === 'high' ? 'var(--danger-light)' : item.priority === 'medium' ? 'var(--warning-light)' : 'var(--success-light)',
                                color: item.priority === 'high' ? 'var(--danger)' : item.priority === 'medium' ? 'var(--warning)' : 'var(--success)',
                                padding: '4px 10px',
                                borderRadius: '12px',
                                fontSize: '11px',
                                fontWeight: 700,
                                textTransform: 'uppercase',
                                display: 'inline-block'
                              }}
                            >
                              {item.priority}
                            </span>
                          </td>

                          {/* Status badge */}
                          <td style={{ padding: '16px 20px' }}>
                            <span 
                              style={{
                                backgroundColor: 
                                  item.status === 'completed' ? 'rgba(16, 185, 129, 0.1)' : 
                                  item.status === 'in_progress' ? 'rgba(59, 130, 246, 0.1)' : 
                                  item.status === 'cancelled' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                                color: 
                                  item.status === 'completed' ? 'var(--success)' : 
                                  item.status === 'in_progress' ? 'var(--secondary)' : 
                                  item.status === 'cancelled' ? 'var(--danger)' : 'var(--warning)',
                                padding: '4px 10px',
                                borderRadius: '12px',
                                fontSize: '11px',
                                fontWeight: 700,
                                textTransform: 'uppercase',
                                display: 'inline-block'
                              }}
                            >
                              {item.status.replace('_', ' ')}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

    </div>
  );
};

export default CreativesDashboard;
