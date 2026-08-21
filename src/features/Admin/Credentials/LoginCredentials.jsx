import React, { useState, useEffect, useCallback } from 'react';
import { Search, ShieldCheck, Eye, EyeOff, Clipboard, Check, AlertCircle } from 'lucide-react';
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
      const [resUsers, resClients] = await Promise.all([
        api.get('/users/credentials').catch(() => ({ data: { success: false, data: [] } })),
        api.get('/clients?limit=500').catch(() => ({ data: { success: false, data: [] } }))
      ]);

      let userCreds = resUsers.data?.data?.credentials || resUsers.data?.credentials || resUsers.data?.data || [];
      if (!Array.isArray(userCreds)) userCreds = [];

      const clientsList = resClients.data?.data?.clients || resClients.data?.data || resClients.data?.clients || [];

      // Create a lookup map for client passwords
      const clientPasswordMap = {};
      if (Array.isArray(clientsList)) {
        clientsList.forEach(c => {
          const clientPwd = c.plain_password || c.raw_password || c.password;
          if (clientPwd) {
            if (c.username) clientPasswordMap[c.username.toLowerCase()] = clientPwd;
            if (c.email) clientPasswordMap[c.email.toLowerCase()] = clientPwd;
            if (c.id) clientPasswordMap[`id_${c.id}`] = clientPwd;
          }
        });
      }

      // Merge client passwords into credentials list
      const updatedCreds = userCreds.map(cred => {
        const role = (cred.role || cred.user_type || '').toLowerCase();
        if (role === 'client') {
          const pwdFromMap = (cred.username && clientPasswordMap[cred.username.toLowerCase()]) ||
                             (cred.email && clientPasswordMap[cred.email.toLowerCase()]) ||
                             clientPasswordMap[`id_${cred.id}`] ||
                             clientPasswordMap[`id_${cred.profile_id}`];
          if (pwdFromMap && !cred.plain_password && !cred.raw_password) {
            return { ...cred, plain_password: pwdFromMap, raw_password: pwdFromMap };
          }
        }
        return cred;
      });

      setCredentials(updatedCreds);
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
      render: (role, row) => {
        const r = (role || row.user_type || 'client').toLowerCase();
        const label = r === 'client' ? 'CLIENT' : r === 'manager' ? 'MANAGER' : 'EMPLOYEE';
        return (
          <span style={{ 
            fontSize: '11px', 
            fontWeight: 800, 
            textTransform: 'uppercase', 
            padding: '4px 8px', 
            backgroundColor: r === 'client' ? '#eff6ff' : r === 'manager' ? '#faf5ff' : '#f0fdf4',
            color: r === 'client' ? '#1d4ed8' : r === 'manager' ? '#6b21a8' : '#166534',
            borderRadius: '4px'
          }}>
            {label}
          </span>
        );
      }
    },
    { 
      key: 'username', 
      label: 'Portal Username',
      render: (username) => <strong style={{ color: 'var(--primary)' }}>{username}</strong>
    },
    { 
      key: 'plain_password', 
      label: 'Password (Raw)',
      width: '320px',
      render: (pwd, row) => {
        const rawPwd = pwd || row.password || row.raw_password || row.plain_password || row.client_password || '';
        const isVisible = !!visiblePasswords[row.id];
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ 
              fontFamily: 'monospace', 
              fontSize: '14px', 
              letterSpacing: isVisible ? 'normal' : '3px',
              fontWeight: 600,
              backgroundColor: rawPwd ? 'var(--bg-light)' : '#fef2f2',
              color: rawPwd ? 'inherit' : '#dc2626',
              padding: '4px 10px',
              borderRadius: '4px',
              border: rawPwd ? '1px solid var(--border-color)' : '1px solid #fca5a5',
              minWidth: '130px',
              textAlign: 'center'
            }}>
              {isVisible ? (rawPwd || 'No Password') : '••••••••'}
            </span>
            <button 
              className="btn btn-secondary" 
              onClick={() => togglePasswordVisibility(row.id)}
              style={{ padding: '4px 8px', minWidth: '0' }}
              title={isVisible ? 'Hide password' : 'Show password'}
            >
              {isVisible ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
            {rawPwd && (
              <button 
                className="btn btn-secondary"
                onClick={() => handleCopyToClipboard(rawPwd, row.id)}
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
            View and manage portal login accounts for Managers, Employees, and Clients.
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
