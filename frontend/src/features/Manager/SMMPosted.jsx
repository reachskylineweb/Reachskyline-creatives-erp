import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import { 
  CheckCircle2, 
  ExternalLink, 
  AlertCircle,
  FileText,
  Image as ImageIcon,
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

const SMMPosted = ({ isEmployee = false }) => {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
  });

  // Pagination & Filtration State
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [limit] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState('');

  // Fetch clients for dropdown filter
  useEffect(() => {
    api.get('/clients/dropdown').then(res => {
      if (res.data.success) {
        setClients(res.data.data.clients || []);
      }
    }).catch(err => {
      console.error('Error fetching clients dropdown:', err.message);
    });
  }, []);

  const fetchPostedPostings = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        departmentFilter: 1, // Creatives
        monthFilter: selectedMonth,
        statusFilter: 'posted,completed', // Fetch only posted/completed ones
        limit,
        page,
        searchQuery
      };

      if (selectedClient) {
        params.clientFilter = selectedClient;
      }

      const empId = user?.employeeProfile?.employee_id || user?.employeeProfile?.id;
      if (isEmployee && empId) {
        params.employeeFilter = empId;
      }

      const res = await api.get('/deliverables', { params });

      if (res.data.success) {
        setItems(res.data.data.deliverables || []);
        if (res.data.data.pagination) {
          setTotalPages(res.data.data.pagination.totalPages || 1);
          setTotalItems(res.data.data.pagination.total || 0);
        }
      }
    } catch (err) {
      console.error('Error fetching SMM posted history:', err.message);
    } finally {
      setLoading(false);
    }
  }, [selectedMonth, isEmployee, user, page, limit, searchQuery, selectedClient]);

  useEffect(() => {
    fetchPostedPostings();
  }, [fetchPostedPostings]);

  // Reset page to 1 when filters or month change
  useEffect(() => {
    setPage(1);
  }, [selectedMonth, searchQuery, selectedClient]);

  const columns = [
    {
      key: 'due_date',
      label: 'Posted Date',
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
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            color: 'var(--success)',
            padding: '4px 10px',
            borderRadius: '12px',
            fontSize: '11px',
            fontWeight: 700,
            textTransform: 'uppercase',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          <CheckCircle2 size={12} />
          POSTED
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
            <CheckCircle2 size={26} style={{ color: 'var(--success)' }} />
            Posted History {isEmployee ? '(Employee)' : '(Manager)'}
          </h1>
          <p style={{ margin: '6px 0 0 0', color: 'var(--text-muted)', fontSize: '14px' }}>
            List of social media posts successfully published in: <strong style={{ color: 'var(--success)' }}>{selectedMonth}</strong>.
          </p>
        </div>

        {/* Filters Panel */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          
          {/* Search Box */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Search</label>
            <input 
              type="text"
              placeholder="Search title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                padding: '8px 12px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-color)',
                fontSize: '13px',
                outline: 'none',
                fontWeight: 600,
                width: '180px',
                height: '38px'
              }}
            />
          </div>

          {/* Client Filter */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Client</label>
            <select
              value={selectedClient}
              onChange={(e) => setSelectedClient(e.target.value)}
              className="form-control"
              style={{ minWidth: '160px', fontSize: '13px', padding: '6px 10px', height: '38px', margin: 0 }}
            >
              <option value="">All Clients</option>
              {clients.map(c => (
                <option key={c.id} value={c.id}>{c.company_name}</option>
              ))}
            </select>
          </div>

          {/* Selected Month */}
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
                fontWeight: 600,
                height: '38px'
              }}
            />
          </div>
          
          <button 
            onClick={fetchPostedPostings}
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
              gap: '6px',
              height: '38px'
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
          <span>Loading posted history...</span>
        </div>
      ) : items.length === 0 ? (
        <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--border-color)', padding: '60px 40px', textAlign: 'center', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)' }}>
          <AlertCircle size={44} style={{ color: 'var(--text-muted)', marginBottom: '12px', opacity: 0.5 }} />
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: 'var(--text-color)' }}>No postings found</h3>
          <p style={{ margin: '8px 0 0 0', color: 'var(--text-muted)', fontSize: '14px' }}>
            There are no deliverables marked as posted in {selectedMonth}.
          </p>
        </div>
      ) : (
        <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
          <Table 
            data={items}
            columns={columns}
            keyField="id"
            pagination={{
              page,
              limit,
              total: totalItems,
              totalPages,
              onPageChange: (newPage) => setPage(newPage)
            }}
          />
        </div>
      )}
    </div>
  );
};

export default SMMPosted;
