import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import { 
  LayoutDashboard, 
  Send, 
  CheckCircle2, 
  Clock, 
  TrendingUp,
  BarChart4
} from 'lucide-react';

const SMMEmployeeDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const employeeProfile = user?.employeeProfile || {};

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    todayPending: 0,
    todayPosted: 0,
    monthlyPending: 0,
    monthlyPosted: 0
  });

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      const d = new Date();
      const todayStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      const monthStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;

      // Fetch deliverables for department ID 1 (Creatives) for the current month assigned to this employee
      const devRes = await api.get('/deliverables', {
        params: {
          departmentFilter: 1, // Creatives
          monthFilter: monthStr,
          employeeFilter: employeeProfile.employee_id || employeeProfile.id,
          limit: 150,
          page: 1
        }
      });

      if (devRes.data.success) {
        const deliverables = devRes.data.data.deliverables || [];
        
        let todayPending = 0;
        let todayPosted = 0;
        let monthlyPending = 0;
        let monthlyPosted = 0;

        deliverables.forEach(item => {
          const itemDueDate = item.due_date ? item.due_date.substring(0, 10) : '';
          
          const isPending = ['assigned', 'assigned_employee'].includes(item.status);
          const isPosted = ['posted', 'completed'].includes(item.status);

          if (itemDueDate === todayStr) {
            if (isPending) todayPending++;
            if (isPosted) todayPosted++;
          } else if (itemDueDate && itemDueDate < todayStr) {
            if (isPending) todayPending++;
          }

          if (isPending) monthlyPending++;
          if (isPosted) monthlyPosted++;
        });

        setStats({
          todayPending,
          todayPosted,
          monthlyPending,
          monthlyPosted
        });
      }
    } catch (err) {
      console.error('Error loading SMM Employee Dashboard data:', err.message);
    } finally {
      setLoading(false);
    }
  }, [employeeProfile]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const todayDisplayStr = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  if (loading) {
    return (
      <div style={{ padding: '80px', textAlign: 'center', color: 'var(--text-muted)' }}>
        <div style={{ width: '32px', height: '32px', border: '3px solid #e2e8f0', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 12px auto' }}></div>
        <span>Loading SMM Dashboard...</span>
      </div>
    );
  }

  const todayTotal = stats.todayPending + stats.todayPosted;
  const monthlyTotal = stats.monthlyPending + stats.monthlyPosted;

  return (
    <div style={{ padding: '30px', maxWidth: '1400px', margin: '0 auto' }}>
      
      {/* Title Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-color)', display: 'flex', alignItems: 'center', gap: '10px', margin: 0 }}>
            <LayoutDashboard size={26} style={{ color: 'var(--primary)' }} />
            SMM specialist Dashboard
          </h1>
          <p style={{ margin: '6px 0 0 0', color: 'var(--text-muted)', fontSize: '14px' }}>
            Welcome back, {employeeProfile.full_name || 'SMM Specialist'}! Today is <strong style={{ color: 'var(--primary)' }}>{todayDisplayStr}</strong>.
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', marginBottom: '40px' }}>
        
        {/* Card 1: Today's Posting */}
        <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '24px', boxShadow: 'var(--shadow-sm)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-muted)' }}>Today's Postings</span>
            <Clock size={20} style={{ color: 'var(--warning)' }} />
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-color)' }}>
            {todayTotal} <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-muted)' }}>total</span>
          </div>
          <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: 'var(--text-muted)' }}>
            {stats.todayPosted} posted • {stats.todayPending} pending
          </p>
        </div>

        {/* Card 2: Monthly Posting */}
        <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '24px', boxShadow: 'var(--shadow-sm)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-muted)' }}>Monthly Postings</span>
            <Send size={20} style={{ color: 'var(--primary)' }} />
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-color)' }}>
            {monthlyTotal} <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-muted)' }}>total</span>
          </div>
          <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: 'var(--text-muted)' }}>
            {stats.monthlyPosted} posted • {stats.monthlyPending} pending
          </p>
        </div>

      </div>

      {/* Main Grid Content */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px' }}>
        
        {/* Left Side: Bar chart */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          
          {/* Today's Pending & Posted Postings Bar Chart */}
          <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '28px', boxShadow: 'var(--shadow-sm)' }}>
            <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: 800, color: 'var(--text-color)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BarChart4 size={20} style={{ color: 'var(--primary)' }} />
              Today's Postings Status Chart
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '10px 0' }}>
              {todayTotal === 0 ? (
                <div style={{ padding: '30px', textAlign: 'center', backgroundColor: 'var(--bg-light)', borderRadius: 'var(--radius-sm)', border: '1px dashed var(--border-color)' }}>
                  <p style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: 'var(--text-color)' }}>No postings scheduled for today.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  {/* Bar 1: Total */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px', fontWeight: 600 }}>
                      <span>Total Today's Postings</span>
                      <span style={{ color: 'var(--primary)' }}>{todayTotal} items</span>
                    </div>
                    <div style={{ height: '24px', backgroundColor: '#f1f5f9', borderRadius: '4px', overflow: 'hidden', position: 'relative' }}>
                      <div 
                        style={{ 
                          height: '100%', 
                          width: '100%', 
                          backgroundColor: 'var(--primary)', 
                          borderRadius: '4px',
                          transition: 'width 1s ease'
                        }}
                      ></div>
                    </div>
                  </div>

                  {/* Bar 2: Posted */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px', fontWeight: 600 }}>
                      <span>Posted Today</span>
                      <span style={{ color: 'var(--success)' }}>{stats.todayPosted} / {todayTotal} ({todayTotal > 0 ? Math.round((stats.todayPosted / todayTotal) * 100) : 0}%)</span>
                    </div>
                    <div style={{ height: '24px', backgroundColor: '#f1f5f9', borderRadius: '4px', overflow: 'hidden', position: 'relative' }}>
                      <div 
                        style={{ 
                          height: '100%', 
                          width: `${todayTotal > 0 ? (stats.todayPosted / todayTotal) * 100 : 0}%`, 
                          backgroundColor: 'var(--success)', 
                          borderRadius: '4px',
                          transition: 'width 1s ease'
                        }}
                      ></div>
                    </div>
                  </div>

                  {/* Bar 3: Pending */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px', fontWeight: 600 }}>
                      <span>Pending Today</span>
                      <span style={{ color: 'var(--warning-dark, #b45309)' }}>{stats.todayPending} / {todayTotal} ({todayTotal > 0 ? Math.round((stats.todayPending / todayTotal) * 100) : 0}%)</span>
                    </div>
                    <div style={{ height: '24px', backgroundColor: '#f1f5f9', borderRadius: '4px', overflow: 'hidden', position: 'relative' }}>
                      <div 
                        style={{ 
                          height: '100%', 
                          width: `${todayTotal > 0 ? (stats.todayPending / todayTotal) * 100 : 0}%`, 
                          backgroundColor: '#f97316', 
                          borderRadius: '4px',
                          transition: 'width 1s ease'
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Right Side: Posting Tips */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div style={{ backgroundColor: 'var(--primary-light)', borderRadius: 'var(--radius-md)', padding: '24px', border: '1px solid rgba(79, 70, 229, 0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <TrendingUp size={20} style={{ color: 'var(--primary)' }} />
              <strong style={{ fontSize: '15px', color: 'var(--primary)' }}>SMM Posting Process</strong>
            </div>
            <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              1. Open <strong>Today's Posting</strong> from the sidebar.
              <br />
              2. Download/Copy scripts from the <strong>Content Doc Link</strong>.
              <br />
              3. Download visuals from the <strong>Designer Link</strong>.
              <br />
              4. Post on social media and click <strong>Post to Social Media</strong> to mark the task completed.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};

export default SMMEmployeeDashboard;
