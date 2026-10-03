import React, { useState, useEffect, useCallback } from 'react';
import { 
  CheckCircle2, RefreshCw, ExternalLink, Calendar, FileText, 
  Search, ChevronLeft, ChevronRight 
} from 'lucide-react';
import api from '../../utils/api';
import Table from '../../components/Table';

const ensureExternalLink = (url) => {
  if (!url) return '';
  const trimmed = url.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }
  return `https://${trimmed}`;
};

const EmployeeApprovedWork = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
  });

  const fetchApprovedWork = useCallback(async () => {
    setLoading(true);
    try {
      const [delivsRes, contentRes] = await Promise.all([
        api.get('/deliverables/employee/all'),
        api.get('/content-work/approved').catch(() => ({ data: { success: false, data: [] } }))
      ]);

      let combined = [];

      if (delivsRes.data.success) {
        const approvedTasks = (delivsRes.data.data.deliverables || []).filter(
          item => item.status === 'approved' || item.status === 'client_approved' || item.status === 'sent_to_client'
        ).map(task => ({
          ...task,
          isContentWork: false
        }));
        combined = [...combined, ...approvedTasks];
      }

      if (contentRes.data.success) {
        const approvedContent = (contentRes.data.data || []).map(task => ({
          ...task,
          isContentWork: true,
          client_name: task.client_name,
          month: task.month,
          activity_type_code: task.category?.replace('_', ' ').toUpperCase(),
          google_drive_link: task.work_link,
          due_date: task.date || null
        }));
        combined = [...combined, ...approvedContent];
      }

      setItems(combined);
    } catch (err) {
      console.error('Error fetching approved employee tasks:', err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchApprovedWork();
  }, [fetchApprovedWork]);

  const handlePrevMonth = () => {
    const [year, month] = selectedMonth.split('-').map(Number);
    const date = new Date(year, month - 2, 1);
    setSelectedMonth(`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`);
  };

  const handleNextMonth = () => {
    const [year, month] = selectedMonth.split('-').map(Number);
    const date = new Date(year, month, 1);
    setSelectedMonth(`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`);
  };

  const formatMonthLabel = (monthStr) => {
    const [year, month] = monthStr.split('-');
    const date = new Date(year, month - 1, 1);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  // Search & Month filtering
  const filteredItems = items.filter(item => {
    const term = search.toLowerCase();
    const searchMatch = (
      !search ||
      item.client_name?.toLowerCase().includes(term) || 
      item.title?.toLowerCase().includes(term) || 
      item.activity_code?.toLowerCase().includes(term)
    );

    const itemMonth = item.isContentWork 
      ? item.month 
      : (item.due_date ? item.due_date.substring(0, 7) : null);
    
    const monthMatch = itemMonth === selectedMonth;

    return searchMatch && monthMatch;
  });

  const columns = [
    {
      key: 'client_name',
      label: 'Client Name',
      render: (name) => <strong style={{ color: 'var(--text-color)' }}>{name || 'Event Day'}</strong>
    },
    {
      key: 'activity_type_code',
      label: 'Type',
      render: (val, row) => (
        <span className={row.isContentWork ? "badge badge-pending" : "badge badge-active"} style={{ fontSize: '11px', fontWeight: 800 }}>
          {val}
        </span>
      )
    },
    {
      key: 'title',
      label: 'Deliverable Title',
      render: (title, row) => (
        <div>
          <div style={{ fontWeight: 600 }}>{title}</div>
          {row.activity_code && (
            <div style={{ fontSize: '11px', fontFamily: 'monospace', color: 'var(--primary)', fontWeight: 700 }}>
              {row.activity_code}
            </div>
          )}
        </div>
      )
    },
    {
      key: 'due_date',
      label: 'Due Date',
      render: (date) => (
        <span style={{ color: 'var(--text-muted)' }}>
          {date ? new Date(date).toLocaleDateString() : 'N/A'}
        </span>
      )
    },
    {
      key: 'google_drive_link',
      label: 'Delivered File URL',
      render: (link) => (
        <a 
          href={ensureExternalLink(link)} 
          target="_blank" 
          rel="noreferrer" 
          style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: 'var(--primary)', fontWeight: 700 }}
        >
          Open link <ExternalLink size={12} />
        </a>
      )
    },
    {
      key: 'status',
      label: 'Approval Status',
      render: (status, row) => (
        <span className="badge" style={{ backgroundColor: 'var(--success-light)', color: 'var(--success)', border: '1px solid var(--success)', fontWeight: 700, textTransform: 'uppercase' }}>
          {row.isContentWork ? 'Approved' : (status === 'sent_to_client' ? 'Approved & Live' : 'Approved')}
        </span>
      )
    }
  ];

  return (
    <div style={{ padding: '30px', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-color)', display: 'flex', alignItems: 'center', gap: '10px', margin: 0 }}>
            <CheckCircle2 size={26} style={{ color: 'var(--success)' }} />
            Approved Work
          </h1>
          <p style={{ margin: '6px 0 0 0', color: 'var(--text-muted)', fontSize: '14px' }}>
            Ledger of your successfully submitted and approved monthly deliverables.
          </p>
        </div>
        <button className="btn btn-secondary" onClick={fetchApprovedWork} disabled={loading} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* Filters & Month Selection */}
      <div className="card" style={{ padding: '16px 20px', marginBottom: '16px', display: 'flex', gap: '16px', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
        
        {/* Search */}
        <div style={{ position: 'relative', flex: 1, minWidth: '250px', maxWidth: '400px' }}>
          <Search style={{ position: 'absolute', left: '12px', top: '10px', color: 'var(--text-muted)' }} size={16} />
          <input
            type="text"
            placeholder="Search approved tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-control"
            style={{ width: '100%', paddingLeft: '36px', margin: 0 }}
          />
        </div>

        {/* Month Picker navigation */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div className="pagination-controls" style={{ margin: 0 }}>
            <button className="btn btn-secondary btn-sm" onClick={handlePrevMonth}>
              <ChevronLeft size={16} />
            </button>
            <span style={{ fontWeight: 700, fontSize: '15px', color: 'var(--text-main)', minWidth: '130px', textAlign: 'center', display: 'inline-block' }}>
              {formatMonthLabel(selectedMonth)}
            </span>
            <button className="btn btn-secondary btn-sm" onClick={handleNextMonth}>
              <ChevronRight size={16} />
            </button>
          </div>
          
          <input 
            type="month" 
            value={selectedMonth} 
            onChange={(e) => setSelectedMonth(e.target.value)}
            style={{ padding: '6px 10px', fontSize: '13px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', outline: 'none' }}
          />
        </div>

        <div className="text-muted" style={{ fontSize: '13px', fontWeight: 600 }}>
          Approved Items: <strong style={{ color: 'var(--primary)' }}>{filteredItems.length}</strong> tasks
        </div>
      </div>

      {/* Table */}
      <div className="card" style={{ padding: '0px', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '80px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <div className="spinner" style={{ margin: '0 auto 12px auto' }}></div>
            <span>Loading approved works list...</span>
          </div>
        ) : filteredItems.length === 0 ? (
          <div style={{ padding: '80px 40px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <FileText size={40} style={{ margin: '0 auto 12px auto', opacity: 0.5 }} />
            <h4 style={{ margin: 0, fontWeight: 700 }}>No Approved Items Found</h4>
            <p style={{ margin: '4px 0 0 0', fontSize: '13px' }}>
              You don't have any approved deliverables for {formatMonthLabel(selectedMonth)} matching your search yet.
            </p>
          </div>
        ) : (
          <Table
            columns={columns}
            data={filteredItems}
            emptyMessage="No approved tasks."
          />
        )}
      </div>

    </div>
  );
};

export default EmployeeApprovedWork;
