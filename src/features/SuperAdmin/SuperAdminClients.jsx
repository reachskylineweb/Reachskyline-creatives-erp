import React, { useState, useEffect, useCallback } from 'react';
import { Users, Search, RefreshCw, AlertCircle } from 'lucide-react';
import api from '../../utils/api';
import Table from '../../components/Table';

const SuperAdminClients = () => {
  const [clients, setClients] = useState([]);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [branchFilter, setBranchFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [clientRes, branchRes] = await Promise.all([
        api.get('/super-admin/dashboard', { params: { branchId: branchFilter || undefined } }),
        api.get('/super-admin/branches')
      ]);

      if (clientRes.data.success) {
        setClients(clientRes.data.data.clients || []);
      }
      if (branchRes.data.success) {
        setBranches(branchRes.data.data || []);
      }
    } catch (err) {
      console.error('Error fetching clients data:', err.message);
    } finally {
      setLoading(false);
    }
  }, [branchFilter]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Client search filter
  const filteredClients = clients.filter(c => {
    const term = searchQuery.toLowerCase();
    return c.company_name?.toLowerCase().includes(term) || 
           c.client_name?.toLowerCase().includes(term) ||
           c.client_id_code?.toLowerCase().includes(term);
  });

  const columns = [
    { key: 'client_id_code', label: 'Client Code', width: '120px', render: (code) => <span style={{ fontFamily: 'monospace', fontWeight: 700 }}>{code}</span> },
    { key: 'company_name', label: 'Company Name', render: (name) => <strong style={{ color: 'var(--primary)' }}>{name}</strong> },
    { key: 'client_name', label: 'Contact Person' },
    { key: 'email', label: 'Email Address' },
    { key: 'phone', label: 'Phone Number' },
    { key: 'branch_name', label: 'Associated Branch', render: (name) => (
      <span className="badge badge-active" style={{ textTransform: 'uppercase', fontSize: '10px' }}>
        {name || 'Unassigned'}
      </span>
    )}
  ];

  return (
    <div style={{ padding: '30px', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 800, color: 'var(--text-color)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Users size={26} style={{ color: 'var(--primary)' }} />
            Active Clients
          </h1>
          <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: 'var(--text-muted)' }}>
            List of registered companies and corporate clients.
          </p>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <select
            className="form-control"
            value={branchFilter}
            onChange={(e) => setBranchFilter(e.target.value)}
            style={{ width: '180px', padding: '8px 12px', fontSize: '13px' }}
          >
            <option value="">All Branches</option>
            {branches.map(b => (
              <option key={b.id} value={b.id}>{b.name} Branch</option>
            ))}
          </select>
          <button className="btn btn-secondary" onClick={fetchData} disabled={loading} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <RefreshCw size={14} /> Refresh
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="table-toolbar" style={{ display: 'flex', gap: '16px', padding: '16px 20px', backgroundColor: '#fff', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md) var(--radius-md) 0 0', borderBottom: 'none', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search style={{ position: 'absolute', left: '12px', top: '10px', color: 'var(--text-muted)' }} size={16} />
          <input
            type="text"
            placeholder="Search by client code, company, contact name..."
            className="form-control"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '36px' }}
          />
        </div>
      </div>

      {/* Table Container */}
      <div style={{ backgroundColor: '#fff', border: '1px solid var(--border-color)', borderRadius: '0 0 var(--radius-md) var(--radius-md)', overflowX: 'auto' }}>
        {loading ? (
          <div style={{ padding: '80px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <div className="spinner" style={{ margin: '0 auto 12px auto' }}></div>
            <span>Loading clients list...</span>
          </div>
        ) : filteredClients.length === 0 ? (
          <div style={{ padding: '80px 40px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <AlertCircle size={36} style={{ margin: '0 auto 12px auto', opacity: 0.5 }} />
            <h4 style={{ margin: 0, fontWeight: 700 }}>No Clients Found</h4>
            <p style={{ margin: '4px 0 0 0', fontSize: '13px' }}>
              No client records matched the search criteria or selected branch.
            </p>
          </div>
        ) : (
          <Table
            columns={columns}
            data={filteredClients}
            emptyMessage="No clients matching criteria."
          />
        )}
      </div>

    </div>
  );
};

export default SuperAdminClients;
