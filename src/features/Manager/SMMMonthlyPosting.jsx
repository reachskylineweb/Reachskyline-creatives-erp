import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import { 
  CalendarClock, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle,
  FileText,
  Image as ImageIcon,
  Globe,
  RefreshCw
} from 'lucide-react';
import Table from '../../components/Table';

const ensureExternalLink = (url) => {
  if (!url) return '';
  const trimmed = url.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }
  return `https://${trimmed}`;
};

const SMMMonthlyPosting = ({ isEmployee = false }) => {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
  });
   const [actionInProgress, setActionInProgress] = useState(null);
   const [employees, setEmployees] = useState([]);

   // Fetch SMM employees for filtering designer assignments
   useEffect(() => {
     if (user?.managerProfile?.department_id) {
       api.get('/users/employees/dropdown', {
         params: { departmentId: user.managerProfile.department_id }
       }).then(res => {
         if (res.data.success) {
           setEmployees(res.data.data.employees || []);
         }
       }).catch(err => {
         console.error('Error fetching SMM employees:', err.message);
       });
     }
   }, [user]);

     // Filter out items that are assigned to Creative Designers (status is 'assigned' or 'assigned_employee' but smm_employee_id is null)
     const filteredItems = items.filter(item => {
       if (['assigned', 'assigned_employee'].includes(item.status)) {
         return !!item.smm_employee_id;
       }
       return true;
     });

  const fetchMonthlyPostings = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch deliverables for Creatives department (department_id = 1) for selected month that are approved or posted
      const res = await api.get('/deliverables', {
        params: {
          departmentFilter: 1, // Creatives
          monthFilter: selectedMonth,
          statusFilter: 'approved,assigned,assigned_employee,posted,completed',
          limit: 150,
          page: 1
        }
      });

      if (res.data.success) {
        // Sort by due date ascending
        const sorted = (res.data.data.deliverables || []).sort(
          (a, b) => new Date(a.due_date) - new Date(b.due_date)
        );
        setItems(sorted);
      }
    } catch (err) {
      console.error('Error fetching monthly SMM postings:', err.message);
    } finally {
      setLoading(false);
    }
  }, [selectedMonth]);

  useEffect(() => {
    fetchMonthlyPostings();
  }, [fetchMonthlyPostings]);

  const handleMarkAsPosted = async (itemId) => {
    const item = items.find(x => x.id === itemId);
    const isJobWork = item?.is_job_work === 1;
    if (!(await window.confirm('Are you sure you want to mark this item as posted on social media?'))) return;
    setActionInProgress(itemId);
    try {
      const res = await api.patch(`/deliverables/${itemId}/status`, { status: 'posted', isJobWork });
      if (res.data.success) {
        alert('Deliverable successfully marked as Posted!');
        setItems(prev => prev.map(item => item.id === itemId ? { ...item, status: isJobWork ? 'completed' : 'posted' } : item));
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update posting status.');
    } finally {
      setActionInProgress(null);
    }
  };

  const columns = [
    {
      key: 'due_date',
      label: 'Posting Date',
      render: (val) => (
        <span style={{ fontWeight: 700, color: 'var(--text-color)' }}>
          {val ? val.substring(0, 10) : 'N/A'}
        </span>
      )
    },
    {
      key: 'client_name',
      label: 'Client',
      render: (val) => (
        <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>
          {val}
        </span>
      )
    },
    {
      key: 'deliverable',
      label: 'Post Title / Deliverable',
      render: (val) => (
        <strong style={{ fontSize: '13px', color: 'var(--text-color)' }}>
          {val}
        </strong>
      )
    },
    {
      key: 'content_link',
      label: 'Content Link',
      render: (val) => val ? (
        <a 
          href={ensureExternalLink(val)}
          target="_blank"
          rel="noreferrer"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: 'var(--primary)', fontWeight: 700 }}
        >
          <FileText size={14} /> Link <ExternalLink size={10} />
        </a>
      ) : (
        <span style={{ fontSize: '12px', color: 'var(--text-light)', fontStyle: 'italic' }}>No doc link</span>
      )
    },
    {
      key: 'google_drive_link',
      label: 'Designer Visual Link',
      render: (val) => val ? (
        <a 
          href={ensureExternalLink(val)}
          target="_blank"
          rel="noreferrer"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: 'var(--success)', fontWeight: 700 }}
        >
          <ImageIcon size={14} /> Link <ExternalLink size={10} />
        </a>
      ) : (
        <span style={{ fontSize: '12px', color: 'var(--text-light)', fontStyle: 'italic' }}>No design file</span>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (val) => (
        <span 
          style={{
            backgroundColor: ['posted', 'completed'].includes(val) ? 'rgba(16, 185, 129, 0.1)' : ['assigned', 'assigned_employee'].includes(val) ? 'rgba(245, 158, 11, 0.1)' : 'rgba(79, 70, 229, 0.1)',
            color: ['posted', 'completed'].includes(val) ? 'var(--success)' : ['assigned', 'assigned_employee'].includes(val) ? '#d97706' : 'var(--primary)',
            padding: '4px 10px',
            borderRadius: '12px',
            fontSize: '11px',
            fontWeight: 700,
            textTransform: 'uppercase'
          }}
        >
          {['posted', 'completed'].includes(val) ? 'POSTED' : ['assigned', 'assigned_employee'].includes(val) ? 'ASSIGNED' : 'READY TO POST'}
        </span>
      )
    },
    {
      key: 'id',
      label: 'Action',
      render: (val, item) => ['approved', 'assigned', 'assigned_employee'].includes(item.status) ? (
        isEmployee ? (
          <button
            onClick={() => handleMarkAsPosted(val)}
            disabled={actionInProgress === val}
            style={{
              padding: '6px 12px',
              backgroundColor: 'var(--primary-light)',
              color: 'var(--primary)',
              border: '1px solid rgba(79, 70, 229, 0.15)',
              borderRadius: 'var(--radius-sm)',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <Globe size={12} />
            Post
          </button>
        ) : (
          <span style={{ color: 'var(--text-muted)', fontSize: '12px', fontWeight: 500 }}>Awaiting SMM</span>
        )
      ) : (
        <span style={{ color: 'var(--success)', fontSize: '12px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
          <CheckCircle2 size={14} /> Done
        </span>
      )
    }
  ];

  return (
    <div style={{ padding: '30px', maxWidth: '1400px', margin: '0 auto' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '15px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-color)', display: 'flex', alignItems: 'center', gap: '10px', margin: 0 }}>
            <CalendarClock size={26} style={{ color: 'var(--primary)' }} />
            Monthly Posting
          </h1>
          <p style={{ margin: '6px 0 0 0', color: 'var(--text-muted)', fontSize: '14px' }}>
            Complete list of scheduled postings for month: <strong style={{ color: 'var(--primary)' }}>{selectedMonth}</strong>.
          </p>
        </div>

        {/* Filters Panel */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Selected Month</label>
            <input 
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              style={{
                padding: '8px 12px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-color)',
                fontSize: '13px',
                outline: 'none',
                fontWeight: 600
              }}
            />
          </div>
          
          <button 
            onClick={fetchMonthlyPostings}
            disabled={loading}
            style={{
              padding: '10px 14px',
              backgroundColor: 'var(--bg-light)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-sm)',
              fontWeight: 700,
              fontSize: '13px',
              cursor: 'pointer',
              marginTop: '19px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            Reload
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ padding: '80px', textAlign: 'center', color: 'var(--text-muted)' }}>
          <div style={{ width: '32px', height: '32px', border: '3px solid #e2e8f0', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 12px auto' }}></div>
          <span>Loading monthly postings...</span>
        </div>
      ) : items.length === 0 ? (
        <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--border-color)', padding: '60px 40px', textAlign: 'center', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)' }}>
          <AlertCircle size={44} style={{ color: 'var(--text-muted)', marginBottom: '12px', opacity: 0.5 }} />
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: 'var(--text-color)' }}>No postings scheduled</h3>
          <p style={{ margin: '8px 0 0 0', color: 'var(--text-muted)', fontSize: '14px' }}>
            There are no creative-approved deliverables in {selectedMonth}.
          </p>
        </div>
      ) : (
        <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
          <Table 
            data={filteredItems}
            columns={columns}
            keyField="id"
          />
        </div>
      )}
    </div>
  );
};

export default SMMMonthlyPosting;
