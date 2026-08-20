import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, ListTodo, RefreshCw, User, Briefcase, Mail, Calendar, AlertCircle } from 'lucide-react';
import api from '../../utils/api';
import Modal from '../../components/Modal';

import SMMEmployeeDashboard from './SMMEmployeeDashboard';
import ContentWriterDashboard from './ContentWriterDashboard';

const EmployeeDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const employeeProfile = user?.employeeProfile || {};

  if (employeeProfile.department_code === 'SMM-RS') {
    return <SMMEmployeeDashboard />;
  }

  const subDeptId = employeeProfile.sub_department_id;
  const isContentWriter = subDeptId === 3 || employeeProfile.sub_department_code === 'CW-RS' || employeeProfile.sub_department_name?.toLowerCase().includes('writer');

  if (isContentWriter) {
    return <ContentWriterDashboard />;
  }

  const [stats, setStats] = useState({
    todayCount: 0,
    reworkCount: 0,
    jobWorksCount: 0
  });
  const [activeJobWorks, setActiveJobWorks] = useState([]);
  const [showPriorityAlert, setShowPriorityAlert] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [todayRes, reworkRes, jobsRes] = await Promise.all([
          api.get('/deliverables/employee/today'),
          api.get('/deliverables/employee/rework'),
          api.get('/deliverables/job-work/employee')
        ]);
        
        const jobs = jobsRes.data.success ? jobsRes.data.data : [];
        // Only count job works that are undone (pending)
        const pendingJobs = jobs.filter(job => 
          ['assigned_employee', 'reassigned', 'client_rework'].includes(job.status)
        );
        setActiveJobWorks(pendingJobs);
        
        setStats({
          todayCount: todayRes.data.success ? todayRes.data.data.deliverables.length : 0,
          reworkCount: reworkRes.data.success ? reworkRes.data.data.deliverables.length : 0,
          jobWorksCount: pendingJobs.length
        });

        if (pendingJobs.length > 0) {
          setShowPriorityAlert(true);
        }
      } catch (err) {
        console.error('Error fetching employee dashboard stats:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const todayStr = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div style={{ padding: '30px', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* Banner */}
      <div 
        style={{
          background: 'linear-gradient(135deg, var(--primary) 0%, #312e81 100%)',
          color: '#ffffff',
          padding: '40px',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-md)',
          marginBottom: '30px',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{ position: 'relative', zIndex: 1 }}>
          <span 
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              padding: '6px 14px',
              borderRadius: '20px',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              fontSize: '11px',
              fontWeight: 800,
              display: 'inline-block',
              marginBottom: '10px'
            }}
          >
            {employeeProfile.department_name || 'Production Team'}
          </span>
          <h1 style={{ fontSize: '28px', fontWeight: 800, margin: 0, letterSpacing: '-0.5px' }}>
            Hello, <span style={{ color: '#fbbf24' }}>{employeeProfile.full_name || user?.username || 'Team Member'}</span>!
          </h1>
          <p style={{ margin: '8px 0 0 0', color: '#c7d2fe', fontSize: '15px', fontWeight: 500 }}>
            Welcome to your production desk. Today is <strong>{todayStr}</strong>.
          </p>
        </div>
      </div>

      {/* Grid Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        
        {/* Priority Job Works */}
        <div 
          onClick={() => {
            if (user?.employeeProfile?.department_code === 'SMM-RS') {
              navigate('/employee/job-work');
            } else {
              navigate('/employee/assigned-work', { state: { activeTab: 'job_work' } });
            }
          }}
          style={{
            backgroundColor: stats.jobWorksCount > 0 ? '#fff5f5' : '#ffffff',
            border: stats.jobWorksCount > 0 ? '1px solid #fca5a5' : '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            padding: '24px',
            boxShadow: 'var(--shadow-sm)',
            cursor: 'pointer',
            transition: 'transform 0.2s, box-shadow 0.2s',
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            borderLeft: stats.jobWorksCount > 0 ? '5px solid var(--danger)' : '1px solid var(--border-color)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = 'var(--shadow-md)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
          }}
        >
          <div style={{ padding: '12px', borderRadius: 'var(--radius-sm)', backgroundColor: stats.jobWorksCount > 0 ? 'rgba(239, 68, 68, 0.1)' : 'var(--bg-light)', color: stats.jobWorksCount > 0 ? 'var(--danger)' : 'var(--text-muted)' }}>
            <AlertCircle size={24} />
          </div>
          <div>
            <span style={{ fontSize: '13px', color: stats.jobWorksCount > 0 ? 'var(--danger)' : 'var(--text-light)', fontWeight: 700, display: 'block', textTransform: 'uppercase' }}>
              Priority Job Works
            </span>
            <strong style={{ fontSize: '24px', fontWeight: 800, color: stats.jobWorksCount > 0 ? 'var(--danger)' : 'var(--text-color)' }}>
              {loading ? '...' : stats.jobWorksCount}
            </strong>
          </div>
        </div>

        {/* Today's Tasks */}
        <div 
          onClick={() => navigate('/employee/assigned-work', { state: { activeTab: 'today' } })}
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            padding: '24px',
            boxShadow: 'var(--shadow-sm)',
            cursor: 'pointer',
            transition: 'transform 0.2s, box-shadow 0.2s',
            display: 'flex',
            alignItems: 'center',
            gap: '20px'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = 'var(--shadow-md)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
          }}
        >
          <div style={{ padding: '12px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--primary-light)', color: 'var(--primary)' }}>
            <ListTodo size={24} />
          </div>
          <div>
            <span style={{ fontSize: '13px', color: 'var(--text-light)', fontWeight: 600, display: 'block', textTransform: 'uppercase' }}>Today's Tasks</span>
            <strong style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-color)' }}>
              {loading ? '...' : stats.todayCount}
            </strong>
          </div>
        </div>

        {/* Rework Queue */}
        <div 
          onClick={() => navigate('/employee/reassigned-work')}
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            padding: '24px',
            boxShadow: 'var(--shadow-sm)',
            cursor: 'pointer',
            transition: 'transform 0.2s, box-shadow 0.2s',
            display: 'flex',
            alignItems: 'center',
            gap: '20px'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = 'var(--shadow-md)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
          }}
        >
          <div style={{ padding: '12px', borderRadius: 'var(--radius-sm)', backgroundColor: '#fffbeb', color: '#d97706' }}>
            <RefreshCw size={24} />
          </div>
          <div>
            <span style={{ fontSize: '13px', color: 'var(--text-light)', fontWeight: 600, display: 'block', textTransform: 'uppercase' }}>Rework Queue</span>
            <strong style={{ fontSize: '24px', fontWeight: 800, color: '#d97706' }}>
              {loading ? '...' : stats.reworkCount}
            </strong>
          </div>
        </div>
      </div>

      {/* Profile / Context Card */}
      <div 
        style={{
          backgroundColor: '#ffffff',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-sm)',
          padding: '24px',
          maxWidth: '600px'
        }}
      >
        <h3 style={{ margin: '0 0 20px 0', fontSize: '16px', fontWeight: 800, color: 'var(--text-color)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <User size={18} className="text-primary" />
          My Profile Context
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Role Position</span>
            <span style={{ fontSize: '13px', fontWeight: 700, textTransform: 'capitalize' }}>{user?.role}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Email Account</span>
            <span style={{ fontSize: '13px', fontWeight: 600 }}>{user?.email}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Department</span>
            <span style={{ fontSize: '13px', fontWeight: 600 }}>{employeeProfile.department_name || 'Production'}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Username</span>
            <span style={{ fontSize: '13px', fontWeight: 600 }}>{user?.username}</span>
          </div>
        </div>
      </div>

      {/* Priority Job Work Alert Modal */}
      {showPriorityAlert && (
        <Modal
          isOpen={showPriorityAlert}
          onClose={() => setShowPriorityAlert(false)}
          title="⚠️ PRIORITY WORK RECEIVED"
        >
          <div style={{ padding: '16px', textAlign: 'center' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: '#fff5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto', border: '2px solid var(--danger)', color: 'var(--danger)' }}>
              <AlertCircle size={32} />
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--danger)', margin: '0 0 10px 0' }}>
              Priority Job Works Assigned!
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--text-color)', lineHeight: 1.5, margin: '0 0 20px 0' }}>
              You have received <strong>{activeJobWorks.length}</strong> urgent Job Work tasks. 
              Job Works are <strong>first priority</strong> and must be resolved before your monthly deliverables.
            </p>
            <button 
              className="btn btn-danger" 
              onClick={() => {
                setShowPriorityAlert(false);
                if (user?.employeeProfile?.department_code === 'SMM-RS') {
                  navigate('/employee/job-work');
                } else {
                  navigate('/employee/assigned-work', { state: { activeTab: 'job_work' } });
                }
              }}
              style={{ width: '100%', padding: '12px', fontWeight: 700 }}
            >
              Go to Job Works
            </button>
          </div>
        </Modal>
      )}

    </div>
  );
};

export default EmployeeDashboard;
