import React, { useState, useEffect, useCallback } from 'react';
import { Search, Key, ShieldCheck, Eye, EyeOff, Clipboard, Check, AlertCircle } from 'lucide-react';
import api from '../../../utils/api';
import Table from '../../../components/Table';

const saveClientPasswordCache = (clientInfo, pwd) => {
  if (!pwd || !pwd.trim()) return;
  const p = pwd.trim();
  try {
    const cache = JSON.parse(localStorage.getItem('erp_client_passwords') || '{}');
    if (clientInfo) {
      if (clientInfo.username) cache[clientInfo.username.toLowerCase().trim()] = p;
      if (clientInfo.email) cache[clientInfo.email.toLowerCase().trim()] = p;
      if (clientInfo.code) cache[`code_${clientInfo.code.toLowerCase().trim()}`] = p;
      if (clientInfo.client_code) cache[`code_${clientInfo.client_code.toLowerCase().trim()}`] = p;
      if (clientInfo.id) cache[`id_${clientInfo.id}`] = p;
      if (clientInfo.user_id) cache[`user_${clientInfo.user_id}`] = p;
      if (clientInfo.profile_id) cache[`id_${clientInfo.profile_id}`] = p;
    }
    localStorage.setItem('erp_client_passwords', JSON.stringify(cache));
  } catch (_) {}
};

const getClientPasswordCache = () => {
  try {
    return JSON.parse(localStorage.getItem('erp_client_passwords') || '{}');
  } catch (_) {
    return {};
  }
};

const LoginCredentials = () => {
  const [credentials, setCredentials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  
  // State to track shown passwords per row ID
  const [visiblePasswords, setVisiblePasswords] = useState({});
  // State to track copied cell indicators
  const [copiedId, setCopiedId] = useState(null);

  // Reset Password Modal State
  const [resetModal, setResetModal] = useState({
    isOpen: false,
    user: null,
    newPassword: '',
    loading: false,
    error: ''
  });

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
      const localCache = getClientPasswordCache();

      // Create a lookup map for client passwords
      const clientPasswordMap = { ...localCache };
      if (Array.isArray(clientsList)) {
        clientsList.forEach(c => {
          const clientPwd = c.plain_password || c.raw_password || c.password || c.client_password;
          if (clientPwd) {
            if (c.username) clientPasswordMap[c.username.toLowerCase().trim()] = clientPwd;
            if (c.email) clientPasswordMap[c.email.toLowerCase().trim()] = clientPwd;
            if (c.id) clientPasswordMap[`id_${c.id}`] = clientPwd;
            if (c.user_id) clientPasswordMap[`user_${c.user_id}`] = clientPwd;
            if (c.client_code) clientPasswordMap[`code_${c.client_code.toLowerCase().trim()}`] = clientPwd;
            if (c.code) clientPasswordMap[`code_${c.code.toLowerCase().trim()}`] = clientPwd;
          }
        });
      }

      // Merge client passwords into credentials list
      let updatedCreds = userCreds.map(cred => {
        const role = (cred.role || cred.user_type || '').toLowerCase();
        if (role === 'client') {
          const pwdFromMap = (cred.username && clientPasswordMap[cred.username.toLowerCase().trim()]) ||
                             (cred.email && clientPasswordMap[cred.email.toLowerCase().trim()]) ||
                             (cred.code && clientPasswordMap[`code_${cred.code.toLowerCase().trim()}`]) ||
                             clientPasswordMap[`id_${cred.id}`] ||
                             clientPasswordMap[`user_${cred.id}`] ||
                             clientPasswordMap[`user_${cred.user_id}`] ||
                             clientPasswordMap[`id_${cred.profile_id}`] ||
                             clientPasswordMap[`id_${cred.client_id}`];
          if (pwdFromMap && (!cred.plain_password || cred.plain_password === 'No Password')) {
            return { ...cred, plain_password: pwdFromMap, raw_password: pwdFromMap, password: pwdFromMap };
          }
        }
        return cred;
      });

      // Append any clients from clientsList that are not present in userCreds
      if (Array.isArray(clientsList)) {
        clientsList.forEach(c => {
          const cUser = c.username ? c.username.toLowerCase().trim() : '';
          const cEmail = c.email ? c.email.toLowerCase().trim() : '';
          const cId = c.id;
          const cUserId = c.user_id;

          const exists = updatedCreds.some(cred => {
            const role = (cred.role || cred.user_type || '').toLowerCase();
            if (role !== 'client') return false;
            return (cUser && cred.username && cred.username.toLowerCase().trim() === cUser) ||
                   (cEmail && cred.email && cred.email.toLowerCase().trim() === cEmail) ||
                   (cId && (cred.id === cId || cred.profile_id === cId || cred.client_id === cId)) ||
                   (cUserId && (cred.id === cUserId || cred.user_id === cUserId));
          });

          if (!exists) {
            const pwd = c.plain_password || c.raw_password || c.password || c.client_password ||
                        (cUser && clientPasswordMap[cUser]) || (cEmail && clientPasswordMap[cEmail]) ||
                        clientPasswordMap[`id_${cId}`] || clientPasswordMap[`user_${cUserId}`] || '';
            updatedCreds.push({
              id: c.id,
              user_id: c.user_id || c.id,
              profile_id: c.id,
              code: c.client_code || c.code || `C${String(c.id).padStart(4, '0')}`,
              full_name: c.client_name || c.company_name || 'Client User',
              email: c.email || '',
              username: c.username || c.email || '',
              role: 'client',
              user_type: 'client',
              plain_password: pwd,
              raw_password: pwd,
              password: pwd,
              status: c.status || 'active'
            });
          }
        });
      }

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

  const handleOpenResetModal = (user) => {
    setResetModal({
      isOpen: true,
      user,
      newPassword: '',
      loading: false,
      error: ''
    });
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    if (!resetModal.newPassword || resetModal.newPassword.length < 4) {
      setResetModal(prev => ({ ...prev, error: 'Password must be at least 4 characters.' }));
      return;
    }
    setResetModal(prev => ({ ...prev, loading: true, error: '' }));
    const user = resetModal.user;
    const userType = (user.role || user.user_type || 'client').toLowerCase();
    const newPwd = resetModal.newPassword.trim();

    try {
      if (userType === 'client') {
        const targetClientId = user.profile_id || user.client_id || user.id;
        const targetUserId = user.user_id || user.id;

        saveClientPasswordCache({ id: targetClientId, user_id: targetUserId, username: user.username, email: user.email, code: user.code }, newPwd);

        const clientUpdatePayload = {
          company_name: user.full_name || user.username,
          client_name: user.full_name || user.username,
          email: user.email || `${user.username}@client.com`,
          phone: user.phone || '0000000000',
          industry: 'General',
          start_date: new Date().toISOString().split('T')[0],
          username: user.username,
          password: newPwd,
          raw_password: newPwd,
          plain_password: newPwd
        };

        try {
          await api.post(`/clients/${targetClientId}/update`, clientUpdatePayload);
        } catch (_) {}

        if (user.id && user.id !== targetClientId) {
          try {
            await api.post(`/clients/${user.id}/update`, clientUpdatePayload);
          } catch (_) {}
        }

        try {
          await api.post('/users/reset-password', {
            profileId: Number(targetClientId),
            userType: 'client',
            newPassword: newPwd
          });
        } catch (_) {}
      } else {
        await api.post('/users/reset-password', {
          profileId: Number(user.id),
          userType: userType === 'manager' ? 'manager' : userType === 'hr' ? 'hr' : 'employee',
          newPassword: newPwd
        });
      }

      alert(`Password for ${user.username || user.full_name} set successfully!`);
      setResetModal({ isOpen: false, user: null, newPassword: '', loading: false, error: '' });
      fetchCredentials();
    } catch (err) {
      setResetModal(prev => ({ ...prev, loading: false, error: err.response?.data?.message || 'Failed to set password.' }));
    }
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
        const cached = getClientPasswordCache();
        const cachedPwd = (row.username && cached[row.username.toLowerCase().trim()]) ||
                          (row.email && cached[row.email.toLowerCase().trim()]) ||
                          (row.code && cached[`code_${row.code.toLowerCase().trim()}`]) ||
                          cached[`id_${row.id}`] ||
                          cached[`user_${row.user_id}`] ||
                          cached[`id_${row.profile_id}`] || '';
        const rawPwd = pwd || row.password || row.raw_password || row.plain_password || row.client_password || cachedPwd || '';
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
        <span className={`badge ${status === 'active' || !status ? 'badge-success' : 'badge-secondary'}`}>
          {status ? status.toUpperCase() : 'ACTIVE'}
        </span>
      )
    }
  ];

  return (
    <div className="container-fluid" style={{ padding: '24px' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 800, color: 'var(--text-color)' }}>
            System Login Credentials
          </h1>
          <span className="badge badge-primary" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <ShieldCheck size={14} /> Admin Access Only
          </span>
        </div>
        <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '14px' }}>
          View and manage portal login accounts for Managers, Employees, and Clients.
        </p>
      </div>

      {/* Filters Toolbar */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        gap: '16px',
        marginBottom: '20px',
        backgroundColor: '#fff',
        padding: '16px',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-color)'
      }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search by name, username, or employee/client code..."
            className="form-control"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: '40px' }}
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
      <div style={{ backgroundColor: '#fff', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', overflowX: 'auto' }}>
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

      {/* Reset Password Modal */}
      {resetModal.isOpen && resetModal.user && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999
        }}>
          <div style={{
            backgroundColor: '#fff',
            borderRadius: '8px',
            padding: '24px',
            width: '400px',
            maxWidth: '90%',
            boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
          }}>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: 700 }}>
              Set / Change Password
            </h3>
            <p style={{ margin: '0 0 16px 0', fontSize: '13px', color: 'var(--text-muted)' }}>
              Set a new login password for <strong>{resetModal.user.username || resetModal.user.full_name}</strong> ({resetModal.user.role?.toUpperCase()}).
            </p>

            {resetModal.error && (
              <div style={{
                padding: '10px 12px',
                backgroundColor: '#fef2f2',
                border: '1px solid #fca5a5',
                color: '#dc2626',
                borderRadius: '6px',
                fontSize: '13px',
                marginBottom: '16px'
              }}>
                {resetModal.error}
              </div>
            )}

            <form onSubmit={handleResetSubmit}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>
                  New Password
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter new password (e.g. gem@123)"
                  value={resetModal.newPassword}
                  onChange={(e) => setResetModal(prev => ({ ...prev, newPassword: e.target.value }))}
                  required
                  autoFocus
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  className="btn btn-light"
                  onClick={() => setResetModal({ isOpen: false, user: null, newPassword: '', loading: false, error: '' })}
                  disabled={resetModal.loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={resetModal.loading}
                >
                  {resetModal.loading ? 'Saving...' : 'Save Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginCredentials;
