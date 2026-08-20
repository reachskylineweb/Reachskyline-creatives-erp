import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building, Plus, RefreshCw, AlertCircle, ArrowRight } from 'lucide-react';
import api from '../../utils/api';
import Table from '../../components/Table';
import Modal from '../../components/Modal';

const SuperAdminBranches = () => {
  const navigate = useNavigate();
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newBranchName, setNewBranchName] = useState('');
  const [feedback, setFeedback] = useState({ type: '', text: '' });

  const fetchBranches = async () => {
    setLoading(true);
    setFeedback({ type: '', text: '' });
    try {
      const res = await api.get('/super-admin/branches');
      if (res.data.success) {
        setBranches(res.data.data || []);
      }
    } catch (err) {
      console.error('Error fetching branches list:', err.message);
      setFeedback({ type: 'danger', text: 'Failed to retrieve branch locations.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  const handleCreateBranch = async (e) => {
    e.preventDefault();
    if (!newBranchName.trim()) return;
    try {
      const res = await api.post('/super-admin/branches', { name: newBranchName.trim() });
      if (res.data.success) {
        setFeedback({ type: 'success', text: `Branch "${newBranchName}" created successfully!` });
        setNewBranchName('');
        setIsModalOpen(false);
        fetchBranches();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create branch.');
    }
  };

  const columns = [
    { key: 'id', label: 'ID', width: '80px', render: (id) => <span style={{ fontWeight: 600 }}>#{id}</span> },
    { key: 'name', label: 'Branch Location Name', render: (name, b) => (
      <strong 
        onClick={() => navigate(`/super-admin/branches/${b.id}`)}
        style={{ color: 'var(--primary)', cursor: 'pointer', fontSize: '15px', textDecoration: 'underline' }}
      >
        {name} Branch
      </strong>
    )},
    { key: 'admins_count', label: 'Admins', render: (val) => <span style={{ fontWeight: 600 }}>{val}</span> },
    { key: 'managers_count', label: 'Managers', render: (val) => <span style={{ fontWeight: 600 }}>{val}</span> },
    { key: 'employees_count', label: 'Employees', render: (val) => <span style={{ fontWeight: 600 }}>{val}</span> },
    { key: 'created_at', label: 'Date Registered', render: (date) => new Date(date).toLocaleString([], { dateStyle: 'short' }) },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, b) => (
        <button 
          className="btn btn-secondary btn-sm"
          onClick={() => navigate(`/super-admin/branches/${b.id}`)}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '6px 12px' }}
        >
          Manage Branch <ArrowRight size={13} />
        </button>
      )
    }
  ];

  return (
    <div style={{ padding: '30px', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 800, color: 'var(--text-color)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Building size={26} style={{ color: 'var(--primary)' }} />
            Operational Branches
          </h1>
          <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: 'var(--text-muted)' }}>
            Configure and oversee administrative branches within the organization.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn btn-primary" onClick={() => setIsModalOpen(true)} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <Plus size={16} /> Add Branch
          </button>
          <button className="btn btn-secondary" onClick={fetchBranches} disabled={loading} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <RefreshCw size={14} /> Refresh
          </button>
        </div>
      </div>

      {feedback.text && (
        <div style={{
          padding: '12px 20px',
          backgroundColor: feedback.type === 'success' ? 'var(--success-light)' : 'var(--danger-light)',
          color: feedback.type === 'success' ? 'var(--success)' : 'var(--danger)',
          fontSize: '13px',
          fontWeight: 600,
          marginBottom: '24px',
          borderRadius: '4px',
          borderLeft: `4px solid ${feedback.type === 'success' ? 'var(--success)' : 'var(--danger)'}`
        }}>
          {feedback.text}
        </div>
      )}

      {/* Table Container */}
      <div style={{ backgroundColor: '#fff', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', overflowX: 'auto', boxShadow: 'var(--shadow-sm)' }}>
        {loading ? (
          <div style={{ padding: '80px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <div className="spinner" style={{ margin: '0 auto 12px auto' }}></div>
            <span>Loading branch listing...</span>
          </div>
        ) : branches.length === 0 ? (
          <div style={{ padding: '80px 40px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <AlertCircle size={36} style={{ margin: '0 auto 12px auto', opacity: 0.5 }} />
            <h4 style={{ margin: 0, fontWeight: 700 }}>No Branches Found</h4>
            <p style={{ margin: '4px 0 0 0', fontSize: '13px' }}>
              Create an operational branch location to begin config.
            </p>
          </div>
        ) : (
          <Table
            columns={columns}
            data={branches}
            emptyMessage="No branches configured."
          />
        )}
      </div>

      {/* CREATE BRANCH MODAL */}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Create New Operational Branch"
        >
          <form onSubmit={handleCreateBranch} style={{ padding: '10px' }}>
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontWeight: 700, fontSize: '13px', marginBottom: '6px', color: 'var(--text-color)' }}>
                Branch Location Name
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Chennai Branch"
                value={newBranchName}
                onChange={(e) => setNewBranchName(e.target.value)}
                style={{ width: '100%', padding: '10px' }}
                required
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={!newBranchName.trim()}>
                Create Branch
              </button>
            </div>
          </form>
        </Modal>
      )}

    </div>
  );
};

export default SuperAdminBranches;
