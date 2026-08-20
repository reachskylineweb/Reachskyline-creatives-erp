import React, { useState, useEffect, useCallback } from 'react';
import { CalendarClock, CheckCircle, AlertTriangle, AlertCircle, RefreshCw, Send, Search } from 'lucide-react';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

const EmployeeOverallWork = () => {
  const { user } = useAuth();
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
  });
  const [selectedDate, setSelectedDate] = useState('');

  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'completed' | 'pending' | 'submitted' | 'undone'
  const [loading, setLoading] = useState(false);
  
  // Raw lists
  const [deliverables, setDeliverables] = useState([]);
  const [eventDays, setEventDays] = useState([]);
  const [jobWorks, setJobWorks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchOverallData = useCallback(async () => {
    setLoading(true);
    try {
      const isContentWriter = user?.employeeProfile?.sub_department_id === 3;
      if (isContentWriter) {
        const [delivsRes, eventsRes, jobsRes] = await Promise.all([
          api.get(`/content-work/assigned-content-calendar?month=${selectedMonth}`),
          api.get(`/content-work/assigned-event-days?month=${selectedMonth}`),
          api.get('/deliverables/job-work/employee')
        ]);

        if (delivsRes.data.success) setDeliverables(delivsRes.data.data || []);
        if (eventsRes.data.success) setEventDays(eventsRes.data.data || []);
        if (jobsRes.data.success) {
          const list = jobsRes.data.data || [];
          const filteredJobs = list.filter(job => {
            const jobMonth = job.deadline ? job.deadline.substring(0, 7) : '';
            return jobMonth === selectedMonth && Number(job.content_writer_id) === Number(user?.employeeProfile?.employee_id || user?.employeeProfile?.id);
          });
          setJobWorks(filteredJobs);
        }
      } else {
        const [delivsRes, jobsRes] = await Promise.all([
          api.get('/deliverables/employee/all'),
          api.get('/deliverables/job-work/employee')
        ]);

        if (delivsRes.data.success) {
          const list = delivsRes.data.data.deliverables || [];
          setDeliverables(list);
        }
        if (jobsRes.data.success) {
          setJobWorks(jobsRes.data.data || []);
        }
        setEventDays([]);
      }
    } catch (err) {
      console.error('Error fetching overall work:', err.message);
    } finally {
      setLoading(false);
    }
  }, [selectedMonth, user]);

  useEffect(() => {
    fetchOverallData();
  }, [fetchOverallData]);

  const getLocalDateOnlyStr = (d) => {
    if (!d) return '';
    try {
      const dateObj = new Date(d);
      return dateObj.toISOString().substring(0, 10);
    } catch (err) {
      return '';
    }
  };

  const todayStr = new Date().toISOString().substring(0, 10);

  // Helper to categorize work items
  const processItems = () => {
    const isContentWriter = user?.employeeProfile?.sub_department_id === 3;
    
    let rawItems = [];
    if (isContentWriter) {
      rawItems = [
        ...deliverables.map(d => ({ ...d, type: 'Normal Deliverable', dateStr: d.date, code: d.activity_code, title: d.activity_name || d.title })),
        ...eventDays.map(e => ({ ...e, type: 'Event Calendar Day', dateStr: e.date, code: `EVT-${e.id}`, title: e.title })),
        ...jobWorks.map(j => ({ ...j, type: 'Job Work', dateStr: j.deadline ? j.deadline.split(/[T ]/)[0] : '', code: j.activity_code || `JOB-${j.id}`, title: j.deliverable }))
      ];
    } else {
      rawItems = [
        ...deliverables.map(d => ({ ...d, type: 'Normal Deliverable', dateStr: d.due_date, code: d.activity_code, title: d.activity_name || d.title })),
        ...jobWorks.map(j => ({ ...j, type: 'Job Work', dateStr: j.deadline ? j.deadline.split(/[T ]/)[0] : '', code: j.activity_code || `JOB-${j.id}`, title: j.deliverable }))
      ];
    }

    // Filter by selectedDate or selectedMonth
    const filteredItems = rawItems.filter(item => {
      if (!item.dateStr) return false;
      const itemDate = item.dateStr.split(/[T ]/)[0];
      if (selectedDate) {
        return itemDate === selectedDate;
      }
      return itemDate.substring(0, 7) === selectedMonth;
    });

    const completed = [];
    const pending = [];
    const submitted = [];
    const undone = [];

    filteredItems.forEach(item => {
      // Determine status category
      let statusCat = 'undone';
      
      const isCompleted = item.type === 'Job Work'
        ? (
            ['approved', 'completed', 'posted'].includes(item.status) ||
            (isContentWriter && item.assigned_employee_id !== null && Number(item.assigned_employee_id) !== Number(item.content_writer_id))
          )
        : (item.type === 'Normal Deliverable' && !isContentWriter)
        ? ['approved', 'completed', 'posted', 'client_approved'].includes(item.status)
        : item.submission_status === 'approved';

      const isSubmitted = item.type === 'Job Work'
        ? item.status === 'submitted'
        : (item.type === 'Normal Deliverable' && !isContentWriter)
        ? ['submitted', 'sent_to_client'].includes(item.status)
        : item.submission_status === 'submitted';

      const itemDate = getLocalDateOnlyStr(item.dateStr);

      if (isCompleted) {
        statusCat = 'completed';
      } else if (isSubmitted) {
        statusCat = 'submitted';
      } else if (itemDate && itemDate < todayStr) {
        statusCat = 'pending';
      } else {
        statusCat = 'undone';
      }

      const itemWithCat = { ...item, statusCat };
      if (statusCat === 'completed') completed.push(itemWithCat);
      else if (statusCat === 'submitted') submitted.push(itemWithCat);
      else if (statusCat === 'pending') pending.push(itemWithCat);
      else undone.push(itemWithCat);
    });

    return { completed, pending, submitted, undone };
  };

  const categorized = processItems();

  const getActiveList = () => {
    let rawList = [];
    if (activeTab === 'completed') rawList = categorized.completed;
    else if (activeTab === 'submitted') rawList = categorized.submitted;
    else if (activeTab === 'pending') rawList = categorized.pending;
    else if (activeTab === 'all') {
      rawList = [
        ...categorized.undone,
        ...categorized.pending,
        ...categorized.submitted,
        ...categorized.completed
      ];
    }
    else rawList = categorized.undone;

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      return rawList.filter(item => 
        (item.title || '').toLowerCase().includes(term) || 
        (item.code || '').toLowerCase().includes(term) || 
        (item.client_name || '').toLowerCase().includes(term)
      );
    }
    return rawList;
  };

  const activeList = getActiveList();

  const getStatusLabelStyles = (tabName) => {
    if (tabName === 'completed') return { bg: '#eefdf2', color: '#15803d', border: '1px solid #c2e7cc' };
    if (tabName === 'submitted') return { bg: '#fff7ed', color: '#ea580c', border: '1px solid #ffedd5' };
    if (tabName === 'pending') return { bg: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca' };
    return { bg: '#fffbeb', color: '#ca8a04', border: '1px solid #fef3c7' };
  };

  return (
    <div style={{ padding: '30px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-color)', display: 'flex', alignItems: 'center', gap: '10px', margin: 0 }}>
            <CalendarClock size={26} style={{ color: 'var(--primary)' }} />
            Overall Work Ledger
          </h1>
          <p style={{ margin: '6px 0 0 0', color: 'var(--text-muted)', fontSize: '13px' }}>
            Comprehensive month-wise overview of all completed, pending, submitted, and undone deliverables, event briefs, and job works.
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)' }}>Month:</span>
            <input 
              type="month" 
              value={selectedMonth} 
              onChange={(e) => {
                setSelectedMonth(e.target.value);
                setSelectedDate('');
              }}
              style={{ padding: '6px 12px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', outline: 'none', fontWeight: 700 }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)' }}>Date:</span>
            <input 
              type="date" 
              value={selectedDate} 
              onChange={(e) => {
                const dateVal = e.target.value;
                setSelectedDate(dateVal);
                if (dateVal) {
                  setSelectedMonth(dateVal.substring(0, 7));
                }
              }}
              style={{ padding: '6px 12px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', outline: 'none', fontWeight: 700 }}
            />
            {selectedDate && (
              <button 
                onClick={() => setSelectedDate('')}
                className="btn btn-secondary btn-sm"
                style={{ padding: '6px 10px', height: '34px', fontSize: '11px', margin: 0 }}
              >
                Clear Date
              </button>
            )}
          </div>

          <button className="btn btn-secondary" onClick={fetchOverallData} disabled={loading} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <RefreshCw size={14} /> Refresh
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        {[
          { id: 'all', label: 'TOTAL ASSIGNED', count: categorized.completed.length + categorized.submitted.length + categorized.pending.length + categorized.undone.length, color: 'var(--primary)', bg: 'var(--primary-light)' },
          { id: 'undone', label: 'UNDONE WORKS', count: categorized.undone.length, color: '#ca8a04', bg: '#fefbeb' },
          { id: 'pending', label: 'PENDING (OVERDUE)', count: categorized.pending.length, color: '#dc2626', bg: '#fff5f5' },
          { id: 'submitted', label: 'SENT TO APPROVAL', count: categorized.submitted.length, color: '#ea580c', bg: '#fffbf7' },
          { id: 'completed', label: 'COMPLETED WORKS', count: categorized.completed.length, color: '#15803d', bg: '#f4fdf6' }
        ].map(card => (
          <div 
            key={card.id}
            onClick={() => setActiveTab(card.id)}
            className="card"
            style={{ 
              padding: '16px 20px', 
              border: activeTab === card.id ? `2px solid ${card.color}` : '1px solid var(--border-color)', 
              borderRadius: '12px',
              backgroundColor: card.bg,
              cursor: 'pointer',
              boxShadow: activeTab === card.id ? '0 4px 12px rgba(0,0,0,0.05)' : 'none',
              transition: 'all 0.2s'
            }}
          >
            <span style={{ fontSize: '11px', color: activeTab === card.id ? card.color : 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase' }}>{card.label}</span>
            <h2 style={{ margin: '4px 0 0 0', fontSize: '28px', fontWeight: 900, color: card.color }}>{card.count}</h2>
          </div>
        ))}
      </div>

      {/* Toolbar Search */}
      <div className="table-toolbar" style={{ display: 'flex', gap: '16px', padding: '16px 20px', backgroundColor: '#fff', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md) var(--radius-md) 0 0', borderBottom: 'none', alignItems: 'center' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search ledger by client, deliverable, code..."
            className="form-control"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%', paddingLeft: '36px', fontSize: '13px' }}
          />
        </div>
      </div>

      {/* Grid listing */}
      <div className="card" style={{ padding: 0, borderRadius: '0 0 var(--radius-md) var(--radius-md)', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '80px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <div className="spinner" style={{ margin: '0 auto 12px auto' }}></div>
            <span>Loading overall ledger...</span>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="tracker-enterprise-table" style={{ width: '100%' }}>
              <thead>
                <tr>
                  <th style={{ padding: '14px 18px', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase' }}>Client</th>
                  <th style={{ padding: '14px 18px', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase' }}>Deliverable Type</th>
                  <th style={{ padding: '14px 18px', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase' }}>Activity Brief</th>
                  <th style={{ padding: '14px 18px', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase' }}>Code</th>
                  <th style={{ padding: '14px 18px', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', width: '130px' }}>Due Date</th>
                  <th style={{ padding: '14px 18px', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', width: '140px', textAlign: 'center' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {activeList.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '14px', fontWeight: 600 }}>
                      No items found in this category.
                    </td>
                  </tr>
                ) : (
                  activeList.map(item => {
                    const statusStyle = getStatusLabelStyles(item.statusCat);
                    return (
                      <tr key={`${item.type}_${item.id}`} className="tracker-row-interactive" style={{ borderBottom: '1px solid var(--border-color)' }}>
                        <td style={{ padding: '14px 18px', fontWeight: 700 }}>
                          {item.client_name || 'Event Calendar'}
                        </td>
                        <td style={{ padding: '14px 18px' }}>
                          <span style={{ fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', border: '1px solid var(--primary-light)' }}>
                            {item.type}
                          </span>
                        </td>
                        <td style={{ padding: '14px 18px', fontWeight: 600 }}>
                          {item.title}
                        </td>
                        <td style={{ padding: '14px 18px', fontFamily: 'monospace', fontWeight: 700 }}>
                          {item.code}
                        </td>
                        <td style={{ padding: '14px 18px' }}>
                          {item.dateStr ? new Date(item.dateStr).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A'}
                        </td>
                        <td style={{ padding: '14px 18px', textAlign: 'center' }}>
                          <span style={{ 
                            fontSize: '11px', 
                            fontWeight: 800, 
                            padding: '4px 10px', 
                            borderRadius: '99px',
                            textTransform: 'uppercase',
                            backgroundColor: statusStyle.bg,
                            color: statusStyle.color,
                            border: statusStyle.border
                          }}>
                            {item.statusCat === 'undone' ? 'undone' : item.statusCat === 'pending' ? 'pending (overdue)' : item.statusCat === 'submitted' ? 'submitted' : 'completed'}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeOverallWork;
