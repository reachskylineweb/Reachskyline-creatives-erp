import React, { useState, useEffect, useCallback } from 'react';
import { Search, Key, ShieldCheck, Eye, EyeOff, Clipboard, Check, AlertCircle } from 'lucide-react';
import api from '../../../utils/api';
import Table from '../../../components/Table';

const LoginCredentials = () => {
  const [credentials, setCredentials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  
  // State to track shown passwords per row ID
  const [visiblePasswords, setVisiblePasswords] = useState({});
  // State to track copied cell indicators
  const [copiedId, setCopiedId] = useState(null);

  const fetchCredentials = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/users/credentials');
      if (res.data.success) {
        setCredentials(res.data.data.credentials || []);
      }
    } catch (err) {
      console.error('Error fetching login credentials:', err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCredentials();
  }, [fetchCredentials]);

  const togglePasswordVisibility = (id) => {
    setVisiblePasswords(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCopyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const filteredCredentials = credentials.filter(cred => {
    const searchLower = search.toLowerCase();
    const nameMatch = (cred.full_name || '').toLowerCase().includes(searchLower) || 
                      (cred.username || '').toLowerCase().includes(searchLower) ||
                      (cred.code || '').toLowerCase().includes(searchLower);
    const roleMatch = !roleFilter || cred.role === roleFilter;
    return nameMatch && roleMatch;
  });

  const columns = [
    { 
      key: 'code', 
      label: 'ID / Code', 
      width: '120px',
      render: (code) => <span style={{ fontWeight: 700, fontFamily: 'monospace' }}>{code || 'N/A'}</span>
    },
    { 
      key: 'full_name', 
      label: 'Display Name',
      render: (name, row) => (
        <div>
          <span style={{ fontWeight: 700, color: 'var(--text-color)' }}>{name || 'System User'}</span>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{row.email}</div>
        </div>
      )
    },
    { 
      key: 'role', 
      label: 'User Role',
      width: '120px',
      render: (role) => (
        <span style={{ 
          fontSize: '11px', 
          fontWeight: 800, 
          textTransform: 'uppercase', 
          padding: '4px 8px', 
          backgroundColor: role === 'client' ? '#eff6ff' : role === 'manager' ? '#faf5ff' : '#f0fdf4',
          color: role === 'client' ? '#1d4ed8' : role === 'manager' ? '#6b21a8' : '#166534',
          borderRadius: '4px' 
        }}>
          {role}
        </span>
      )
    },
    { 
      key: 'username', 
      label: 'Portal Username',
      render: (username) => <strong style={{ color: 'var(--primary)' }}>{username}</strong>
    },
    { 
      key: 'plain_password', 
      label: 'Password (Raw)',
      width: '280px',
      render: (pwd, row) => {
        const isVisible = !!visiblePasswords[row.id];
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ 
              fontFamily: 'monospace', 
              fontSize: '14px', 
              letterSpacing: isVisible ? 'normal' : '3px',
              fontWeight: 600,
              backgroundColor: 'var(--bg-light)',
              padding: '4px 10px',
              borderRadius: '4px',
              border: '1px solid var(--border-color)',
              minWidth: '140px',
              textAlign: 'center'
            }}>
              {isVisible ? (pwd || 'No Password') : '••••••••'}
            </span>
            <button 
              className="btn btn-secondary" 
              onClick={() => togglePasswordVisibility(row.id)}
              style={{ padding: '4px 8px', minWidth: '0' }}
              title={isVisible ? 'Hide password' : 'Show password'}
            >
              {isVisible ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
            {pwd && (
              <button 
                className="btn btn-secondary"
                onClick={() => handleCopyToClipboard(pwd, row.id)}
                style={{ padding: '4px 8px', minWidth: '0' }}
                title="Copy password"
              >
                {copiedId === row.id ? <Check size={14} className="text-success" /> : <Clipboard size={14} />}
              </button>
            )}
          </div>
        );
      }
    },
    { 
      key: 'status', 
      label: 'Status',
      width: '100px',
      render: (status) => (
        <span className={`badge ${status === 'active' ? 'badge-active' : 'badge-inactive'}`}>
          {status}
        </span>
      )
    }
  ];

  return (
    <div style={{ padding: '30px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Title Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 800, color: 'var(--text-color)' }}>
            System Login Credentials
          </h1>
          <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: 'var(--text-muted)' }}>
            View and manage portal login accounts for Managers, Employees, HR, and Clients.
          </p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="table-toolbar" style={{ display: 'flex', gap: '16px', padding: '16px 20px', backgroundColor: '#fff', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md) var(--radius-md) 0 0', borderBottom: 'none', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search style={{ position: 'absolute', left: '12px', top: '10px', color: 'var(--text-muted)' }} size={16} />
          <input
            type="text"
            placeholder="Search by name, username, or employee/client code..."
            className="form-control"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: '36px' }}
          />
        </div>

        <select
          className="form-control"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          style={{ width: '180px' }}
        >
          <option value="">All Roles</option>
          <option value="manager">Managers</option>
          <option value="employee">Employees</option>
          <option value="hr">HR Staff</option>
          <option value="client">Clients</option>
        </select>
      </div>

      {/* Table Ledger */}
      <div style={{ backgroundColor: '#fff', border: '1px solid var(--border-color)', borderRadius: '0 0 var(--radius-md) var(--radius-md)', overflowX: 'auto' }}>
        {loading ? (
          <div style={{ padding: '80px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <div className="spinner" style={{ margin: '0 auto 12px auto' }}></div>
            <span>Loading user credentials...</span>
          </div>
        ) : filteredCredentials.length === 0 ? (
          <div style={{ padding: '80px 40px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <AlertCircle size={36} style={{ margin: '0 auto 12px auto', opacity: 0.5 }} />
            <h4 style={{ margin: 0, fontWeight: 700 }}>No Accounts Found</h4>
            <p style={{ margin: '4px 0 0 0', fontSize: '13px' }}>
              No login credentials match your search criteria.
            </p>
          </div>
        ) : (
          <Table
            columns={columns}
            data={filteredCredentials}
            emptyMessage="No credentials found."
          />
        )}
      </div>
    </div>
  );
};

export default LoginCredentials;
