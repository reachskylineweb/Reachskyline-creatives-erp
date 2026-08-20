import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Send, 
  AlertCircle, 
  FileText, 
  Briefcase, 
  Sparkles, 
  ChevronLeft, 
  ChevronRight, 
  RefreshCw, 
  ArrowRight,
  PieChart,
  BarChart3,
  Layers
} from 'lucide-react';
import api from '../../utils/api';

const ContentWriterDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const employeeProfile = user?.employeeProfile || {};

  const [selectedMonth, setSelectedMonth] = useState(() => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
  });

  const [loading, setLoading] = useState(true);

  // Metrics Data State
  const [metrics, setMetrics] = useState({
    overall: { total: 0, completed: 0, pendingApproval: 0, undone: 0 },
    contentCalendar: { total: 0, completed: 0, pendingApproval: 0, undone: 0, items: [] },
    eventDays: { total: 0, completed: 0, pendingApproval: 0, undone: 0, items: [] },
    jobWork: { total: 0, completed: 0, pendingApproval: 0, undone: 0, items: [] },
    shootScripts: { total: 0, completed: 0, pendingApproval: 0, undone: 0, items: [] }
  });

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      const [ccRes, edRes, jwRes] = await Promise.all([
        api.get('/content-work/assigned-content-calendar', { params: { month: selectedMonth } }),
        api.get('/content-work/assigned-event-days', { params: { month: selectedMonth } }),
        api.get('/deliverables/job-work/employee')
      ]);

      const ccItems = ccRes.data.success ? ccRes.data.data || [] : [];
      const edItems = edRes.data.success ? edRes.data.data || [] : [];
      const jwRaw = jwRes.data.success ? jwRes.data.data || [] : [];

      // Filter Job Works assigned as Content Writer for selected month
      const jwItems = jwRaw.filter(jw => {
        const isWriter = Number(jw.content_writer_id) === Number(employeeProfile.id);
        const jwMonth = jw.deadline ? jw.deadline.split(' ')[0].substring(0, 7) : (jw.created_at ? jw.created_at.substring(0, 7) : '');
        return isWriter && (jwMonth === selectedMonth || !jwMonth);
      });

      const calcCategoryMetrics = (items, isJobWork = false) => {
        let total = items.length;
        let completed = 0;
        let pendingApproval = 0;
        let undone = 0;

        items.forEach(item => {
          const statusLower = (item.status || '').toLowerCase();
          const subStatusLower = (item.submission_status || '').toLowerCase();

          if (isJobWork) {
            if (['approved', 'client_approved', 'completed', 'posted'].includes(statusLower)) {
              completed++;
            } else if (['submitted', 'sent_to_manager', 'sent_to_client'].includes(statusLower)) {
              pendingApproval++;
            } else {
              undone++;
            }
          } else {
            if (['approved', 'completed'].includes(subStatusLower)) {
              completed++;
            } else if (['submitted', 'sent_to_manager'].includes(subStatusLower)) {
              pendingApproval++;
            } else {
              undone++;
            }
          }
        });

        return { total, completed, pendingApproval, undone, items };
      };

      const cc = calcCategoryMetrics(ccItems);
      const ed = calcCategoryMetrics(edItems);
      const jw = calcCategoryMetrics(jwItems, true);

      const overallTotal = cc.total + ed.total + jw.total;
      const overallCompleted = cc.completed + ed.completed + jw.completed;
      const overallPendingApproval = cc.pendingApproval + ed.pendingApproval + jw.pendingApproval;
      const overallUndone = cc.undone + ed.undone + jw.undone;

      setMetrics({
        overall: { total: overallTotal, completed: overallCompleted, pendingApproval: overallPendingApproval, undone: overallUndone },
        contentCalendar: cc,
        eventDays: ed,
        jobWork: jw
      });
    } catch (err) {
      console.error('Error loading writer dashboard data:', err.message);
    } finally {
      setLoading(false);
    }
  }, [selectedMonth, employeeProfile.id]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handlePrevMonth = () => {
    const [y, m] = selectedMonth.split('-').map(Number);
    const d = new Date(y, m - 2, 1);
    setSelectedMonth(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
  };

  const handleNextMonth = () => {
    const [y, m] = selectedMonth.split('-').map(Number);
    const d = new Date(y, m, 1);
    setSelectedMonth(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
  };

  const formatMonthLabel = (monthStr) => {
    const [y, m] = monthStr.split('-').map(Number);
    const d = new Date(y, m - 1, 1);
    return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  // Helper SVG Donut Chart Renderer
  const renderDonutChart = (catData, size = 110) => {
    const total = catData.total || 0;
    if (total === 0) {
      return (
        <div style={{ width: `${size}px`, height: `${size}px`, borderRadius: '50%', border: '4px dashed var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '11px', fontWeight: 700 }}>
          0 Tasks
        </div>
      );
    }

    const strokeWidth = 10;
    const center = size / 2;
    const radius = center - strokeWidth;
    const circumference = 2 * Math.PI * radius;

    const completedPct = (catData.completed / total);
    const pendingPct = (catData.pendingApproval / total);
    const undonePct = (catData.undone / total);

    const completedStroke = completedPct * circumference;
    const pendingStroke = pendingPct * circumference;
    const undoneStroke = undonePct * circumference;

    const completedOffset = 0;
    const pendingOffset = -completedStroke;
    const undoneOffset = -(completedStroke + pendingStroke);

    return (
      <div style={{ position: 'relative', width: `${size}px`, height: `${size}px`, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          {/* Undone segment */}
          {undonePct > 0 && (
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke="#3b82f6"
              strokeWidth={strokeWidth}
              strokeDasharray={`${undoneStroke} ${circumference}`}
              strokeDashoffset={undoneOffset}
              strokeLinecap="round"
              style={{ transition: 'stroke-dasharray 0.5s ease' }}
            />
          )}
          {/* Pending Approval segment */}
          {pendingPct > 0 && (
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke="#f59e0b"
              strokeWidth={strokeWidth}
              strokeDasharray={`${pendingStroke} ${circumference}`}
              strokeDashoffset={pendingOffset}
              strokeLinecap="round"
              style={{ transition: 'stroke-dasharray 0.5s ease' }}
            />
          )}
          {/* Completed segment */}
          {completedPct > 0 && (
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke="#10b981"
              strokeWidth={strokeWidth}
              strokeDasharray={`${completedStroke} ${circumference}`}
              strokeDashoffset={completedOffset}
              strokeLinecap="round"
              style={{ transition: 'stroke-dasharray 0.5s ease' }}
            />
          )}
        </svg>
        <div style={{ position: 'absolute', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <span style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-color)', lineHeight: 1 }}>{total}</span>
          <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginTop: '2px' }}>Total</span>
        </div>
      </div>
    );
  };

  return (
    <div style={{ padding: '30px', maxWidth: '1400px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '28px' }}>
      
      {/* Top Banner & Month Selector */}
      <div 
        style={{
          background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)',
          color: '#ffffff',
          padding: '36px 40px',
          borderRadius: '16px',
          boxShadow: '0 10px 25px -5px rgba(49, 46, 129, 0.3)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Glow overlay */}
        <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '250px', height: '250px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(251, 191, 36, 0.15) 0%, rgba(0,0,0,0) 70%)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: 'rgba(255, 255, 255, 0.15)', padding: '5px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: 800, letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '12px' }}>
            <Sparkles size={12} style={{ color: '#fbbf24' }} /> Content Writing Workspace
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: 800, margin: 0, letterSpacing: '-0.5px' }}>
            Hello, <span style={{ color: '#fbbf24' }}>{employeeProfile.full_name || user?.username || 'Content Writer'}</span>! 👋
          </h1>
          <p style={{ margin: '6px 0 0 0', color: '#c7d2fe', fontSize: '14px', fontWeight: 500 }}>
            Here is your workload breakdown and live approval progress for <strong>{formatMonthLabel(selectedMonth)}</strong>.
          </p>
        </div>

        {/* Toolbar Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', zIndex: 1, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', backgroundColor: 'rgba(255, 255, 255, 0.1)', padding: '4px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
            <button 
              onClick={handlePrevMonth} 
              style={{ background: 'none', border: 'none', color: '#fff', padding: '6px 10px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
              title="Previous Month"
            >
              <ChevronLeft size={16} />
            </button>
            <span style={{ fontWeight: 700, fontSize: '14px', padding: '0 12px', minWidth: '130px', textAlign: 'center' }}>
              {formatMonthLabel(selectedMonth)}
            </span>
            <button 
              onClick={handleNextMonth} 
              style={{ background: 'none', border: 'none', color: '#fff', padding: '6px 10px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
              title="Next Month"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          <input 
            type="month" 
            value={selectedMonth} 
            onChange={(e) => setSelectedMonth(e.target.value)}
            style={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.15)', 
              color: '#fff', 
              border: '1px solid rgba(255, 255, 255, 0.2)', 
              borderRadius: '10px', 
              padding: '8px 12px', 
              fontSize: '13px', 
              fontWeight: 700,
              outline: 'none',
              cursor: 'pointer'
            }}
          />

          <button 
            onClick={fetchDashboardData} 
            disabled={loading}
            style={{ 
              backgroundColor: '#fbbf24', 
              color: '#1e1b4b', 
              border: 'none', 
              borderRadius: '10px', 
              padding: '9px 16px', 
              fontSize: '13px', 
              fontWeight: 800, 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '6px', 
              cursor: 'pointer',
              boxShadow: '0 4px 10px rgba(251, 191, 36, 0.3)'
            }}
          >
            <RefreshCw size={14} className={loading ? 'spin' : ''} /> Refresh
          </button>
        </div>
      </div>

      {/* Hero Stat: Total Number of Work Assigned This Month */}
      <div 
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          border: '1px solid var(--border-color)',
          padding: '28px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BarChart3 size={20} style={{ color: 'var(--primary)' }} />
              <h2 style={{ fontSize: '18px', fontWeight: 800, margin: 0, color: 'var(--text-color)' }}>
                Total Work Assigned This Month
              </h2>
            </div>
            <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: 'var(--text-muted)' }}>
              Combined total across Content Calendar, Event Days, Job Work, and Shoot Scripts.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span style={{ fontSize: '38px', fontWeight: 900, color: 'var(--primary)', lineHeight: 1 }}>
              {metrics.overall.total}
            </span>
            <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-muted)' }}>Tasks Assigned</span>
          </div>
        </div>

        {/* Overall Status Bar & Badges */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* Progress Multi-segment Bar */}
          <div style={{ height: '14px', width: '100%', backgroundColor: '#f1f5f9', borderRadius: '7px', overflow: 'hidden', display: 'flex' }}>
            <div 
              style={{ 
                width: `${metrics.overall.total > 0 ? (metrics.overall.completed / metrics.overall.total) * 100 : 0}%`, 
                backgroundColor: '#10b981', 
                transition: 'width 0.5s ease' 
              }} 
              title={`Completed: ${metrics.overall.completed}`}
            />
            <div 
              style={{ 
                width: `${metrics.overall.total > 0 ? (metrics.overall.pendingApproval / metrics.overall.total) * 100 : 0}%`, 
                backgroundColor: '#f59e0b', 
                transition: 'width 0.5s ease' 
              }} 
              title={`Pending (Sent for Approval): ${metrics.overall.pendingApproval}`}
            />
            <div 
              style={{ 
                width: `${metrics.overall.total > 0 ? (metrics.overall.undone / metrics.overall.total) * 100 : 0}%`, 
                backgroundColor: '#3b82f6', 
                transition: 'width 0.5s ease' 
              }} 
              title={`Undone: ${metrics.overall.undone}`}
            />
          </div>

          {/* Overall Status Legend Pills */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
            <div style={{ padding: '12px 16px', borderRadius: '10px', backgroundColor: '#ecfdf5', border: '1px solid #a7f3d0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={16} style={{ color: '#059669' }} />
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#065f46' }}>Completed</span>
              </div>
              <strong style={{ fontSize: '18px', color: '#065f46' }}>{metrics.overall.completed}</strong>
            </div>

            <div style={{ padding: '12px 16px', borderRadius: '10px', backgroundColor: '#fffbeb', border: '1px solid #fde68a', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Clock size={16} style={{ color: '#d97706' }} />
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#92400e' }}>Pending (Sent for Approval)</span>
              </div>
              <strong style={{ fontSize: '18px', color: '#92400e' }}>{metrics.overall.pendingApproval}</strong>
            </div>

            <div style={{ padding: '12px 16px', borderRadius: '10px', backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertCircle size={16} style={{ color: '#2563eb' }} />
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#1e40af' }}>Undone</span>
              </div>
              <strong style={{ fontSize: '18px', color: '#1e40af' }}>{metrics.overall.undone}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Chart Breakdown Cards Grid */}
      <h2 style={{ fontSize: '18px', fontWeight: 800, margin: '8px 0 -12px 0', color: 'var(--text-color)', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <PieChart size={20} style={{ color: 'var(--primary)' }} /> Visual Category Breakdown
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))', gap: '20px' }}>
        
        {/* 1. Content Calendar Card */}
        <div className="card" style={{ padding: '24px', borderRadius: '14px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '20px' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div>
                <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Monthly Strategy</span>
                <h3 style={{ fontSize: '17px', fontWeight: 800, margin: '2px 0 0 0', color: 'var(--text-color)' }}>Content Calendar</h3>
              </div>
              <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Calendar size={20} />
              </div>
            </div>

            {/* Donut Chart & Legend */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              {renderDonutChart(metrics.contentCalendar)}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontWeight: 600, color: 'var(--text-main)' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981' }}></span> Completed
                  </span>
                  <strong style={{ color: '#059669' }}>{metrics.contentCalendar.completed}</strong>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontWeight: 600, color: 'var(--text-main)' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#f59e0b' }}></span> Sent for Approval
                  </span>
                  <strong style={{ color: '#d97706' }}>{metrics.contentCalendar.pendingApproval}</strong>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontWeight: 600, color: 'var(--text-main)' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#3b82f6' }}></span> Undone
                  </span>
                  <strong style={{ color: '#2563eb' }}>{metrics.contentCalendar.undone}</strong>
                </div>
              </div>
            </div>
          </div>

          <button 
            className="btn btn-secondary" 
            onClick={() => navigate('/employee/assigned-work', { state: { activeTab: 'content_calendar' } })}
            style={{ width: '100%', justifyContent: 'center', display: 'inline-flex', alignItems: 'center', gap: '6px', fontWeight: 700, fontSize: '13px' }}
          >
            Open Content Calendar <ArrowRight size={14} />
          </button>
        </div>

        {/* 2. Event Day Calendar Card */}
        <div className="card" style={{ padding: '24px', borderRadius: '14px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '20px' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#7c3aed', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Special Days</span>
                <h3 style={{ fontSize: '17px', fontWeight: 800, margin: '2px 0 0 0', color: 'var(--text-color)' }}>Event Day Calendar</h3>
              </div>
              <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: '#f5f3ff', color: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Layers size={20} />
              </div>
            </div>

            {/* Donut Chart & Legend */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              {renderDonutChart(metrics.eventDays)}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontWeight: 600, color: 'var(--text-main)' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981' }}></span> Completed
                  </span>
                  <strong style={{ color: '#059669' }}>{metrics.eventDays.completed}</strong>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontWeight: 600, color: 'var(--text-main)' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#f59e0b' }}></span> Sent for Approval
                  </span>
                  <strong style={{ color: '#d97706' }}>{metrics.eventDays.pendingApproval}</strong>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontWeight: 600, color: 'var(--text-main)' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#3b82f6' }}></span> Undone
                  </span>
                  <strong style={{ color: '#2563eb' }}>{metrics.eventDays.undone}</strong>
                </div>
              </div>
            </div>
          </div>

          <button 
            className="btn btn-secondary" 
            onClick={() => navigate('/employee/event-calendar')}
            style={{ width: '100%', justifyContent: 'center', display: 'inline-flex', alignItems: 'center', gap: '6px', fontWeight: 700, fontSize: '13px' }}
          >
            Open Event Calendar <ArrowRight size={14} />
          </button>
        </div>

        {/* 3. Job Work Card */}
        <div className="card" style={{ padding: '24px', borderRadius: '14px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '20px' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#0284c7', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Ad-hoc & Priority</span>
                <h3 style={{ fontSize: '17px', fontWeight: 800, margin: '2px 0 0 0', color: 'var(--text-color)' }}>Job Work</h3>
              </div>
              <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Briefcase size={20} />
              </div>
            </div>

            {/* Donut Chart & Legend */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              {renderDonutChart(metrics.jobWork)}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontWeight: 600, color: 'var(--text-main)' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981' }}></span> Completed
                  </span>
                  <strong style={{ color: '#059669' }}>{metrics.jobWork.completed}</strong>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontWeight: 600, color: 'var(--text-main)' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#f59e0b' }}></span> Sent for Approval
                  </span>
                  <strong style={{ color: '#d97706' }}>{metrics.jobWork.pendingApproval}</strong>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontWeight: 600, color: 'var(--text-main)' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#3b82f6' }}></span> Undone
                  </span>
                  <strong style={{ color: '#2563eb' }}>{metrics.jobWork.undone}</strong>
                </div>
              </div>
            </div>
          </div>

          <button 
            className="btn btn-secondary" 
            onClick={() => navigate('/employee/assigned-work', { state: { activeTab: 'job_work' } })}
            style={{ width: '100%', justifyContent: 'center', display: 'inline-flex', alignItems: 'center', gap: '6px', fontWeight: 700, fontSize: '13px' }}
          >
            View Job Works <ArrowRight size={14} />
          </button>
        </div>

      </div>
    </div>
  );
};

export default ContentWriterDashboard;
