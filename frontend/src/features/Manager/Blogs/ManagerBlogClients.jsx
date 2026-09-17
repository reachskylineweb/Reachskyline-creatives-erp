import React, { useState, useEffect, useCallback } from 'react';
import { Building2, Search, Calendar, Globe, Mail, Phone, ExternalLink, RefreshCw, FileText, CheckCircle2 } from 'lucide-react';
import api from '../../../utils/api';
import Table from '../../../components/Table';
import { useNavigate } from 'react-router-dom';
import CreateBlogCalendarModal from './CreateBlogCalendarModal';

const ManagerBlogClients = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedClientForModal, setSelectedClientForModal] = useState(null);
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);
  const navigate = useNavigate();

  const fetchAssignedClients = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/blog-assignments/my-clients');
      if (res.data.success) {
        setClients(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching manager assigned blog clients:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAssignedClients();
  }, [fetchAssignedClients]);

  const filteredClients = clients.filter(c => 
    c.company_name?.toLowerCase().includes(search.toLowerCase()) ||
    c.client_name?.toLowerCase().includes(search.toLowerCase()) ||
    c.client_id_code?.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    {
      key: 'client_id_code',
      label: 'Client Code',
      width: '120px',
      render: (val) => (
        <span style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '13px' }}>
          {val || 'N/A'}
        </span>
      )
    },
    {
      key: 'company_name',
      label: 'Company Name',
      render: (val, row) => (
        <div>
          <strong style={{ display: 'block', fontSize: '15px', color: 'var(--text-color)' }}>{val}</strong>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Contact: {row.client_name}</span>
        </div>
      )
    },
    {
      key: 'contact',
      label: 'Contact Info',
      render: (_, row) => (
        <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Mail size={13} /> {row.email || 'N/A'}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
            <Phone size={13} /> {row.phone || 'N/A'}
          </div>
        </div>
      )
    },
    {
      key: 'website',
      label: 'Website',
      render: (val) => val ? (
        <a 
          href={val.startsWith('http') ? val : `https://${val}`} 
          target="_blank" 
          rel="noreferrer" 
          style={{ fontSize: '13px', color: 'var(--primary)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
        >
          <Globe size={13} /> {val} <ExternalLink size={11} />
        </a>
      ) : <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>-</span>
    },
    {
      key: 'assigned_at',
      label: 'Assigned Date',
      render: (val) => val ? new Date(val).toLocaleDateString() : '-'
    },
    {
      key: 'client_status',
      label: 'Status',
      render: (val) => (
        <span className={`badge ${val === 'active' ? 'badge-active' : 'badge-inactive'}`}>
          {val}
        </span>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <button
          onClick={() => {
            setSelectedClientForModal(row);
            setIsCalendarModalOpen(true);
          }}
          className="btn btn-primary btn-sm"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontWeight: 700 }}
          title="Create Blog Calendar for Client"
        >
          <Calendar size={14} />
          <span>Create Calendar</span>
        </button>
      )
    }
  ];

  return (
    <div className="page-container" style={{ padding: '30px', maxWidth: '1400px', margin: '0 auto' }}>
      
      {/* Page Header */}
      <div className="page-header" style={{ marginBottom: '24px' }}>
        <div className="page-title-section">
          <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-color)' }}>
            Clients for Blog
          </h2>
          <span className="page-subtitle" style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
            List of clients assigned to you by Admin for Blog management and SEO content
          </span>
        </div>
        <button 
          onClick={fetchAssignedClients} 
          className="btn btn-secondary"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}
        >
          <RefreshCw size={14} /> Refresh List
        </button>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '24px' }}>
        <div 
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            padding: '20px',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
            Total Assigned Blog Clients
          </span>
          <div style={{ fontSize: '28px', fontWeight: 850, color: 'var(--primary)', marginTop: '6px' }}>
            {clients.length}
          </div>
        </div>

        <div 
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            padding: '20px',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
            Active Clients
          </span>
          <div style={{ fontSize: '28px', fontWeight: 850, color: '#16a34a', marginTop: '6px' }}>
            {clients.filter(c => c.client_status === 'active').length}
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="table-toolbar" style={{ marginBottom: '16px' }}>
        <div className="toolbar-left" style={{ flex: 1 }}>
          <div className="table-search" style={{ maxWidth: '350px' }}>
            <Search size={16} className="text-muted" />
            <input
              type="text"
              placeholder="Search assigned client company or code..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Clients Table */}
      <Table
        columns={columns}
        data={filteredClients}
        loading={loading}
      />

      <CreateBlogCalendarModal
        isOpen={isCalendarModalOpen}
        onClose={() => {
          setIsCalendarModalOpen(false);
          setSelectedClientForModal(null);
        }}
        client={selectedClientForModal}
        onSuccess={(msg, month) => {
          setIsCalendarModalOpen(false);
          setSelectedClientForModal(null);
          navigate(`/manager/blog-calendar${month ? `?month=${month}` : ''}`);
        }}
      />
    </div>
  );
};

export default ManagerBlogClients;
