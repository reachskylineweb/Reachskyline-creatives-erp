import React, { useState, useEffect, useCallback } from 'react';
import { BarChart3, Search, RefreshCw, AlertCircle } from 'lucide-react';
import api from '../../utils/api';
import Table from '../../components/Table';
import Modal from '../../components/Modal';

const SuperAdminEfficiency = () => {
  const [efficiencies, setEfficiencies] = useState([]);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [branchFilter, setBranchFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCalculationModalOpen, setIsCalculationModalOpen] = useState(false);
  const [selectedEmployeeForCalculation, setSelectedEmployeeForCalculation] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [effRes, branchRes] = await Promise.all([
        api.get('/super-admin/efficiency', { params: { branchId: branchFilter || undefined } }),
        api.get('/super-admin/branches')
      ]);

      if (effRes.data.success) {
        setEfficiencies(effRes.data.data || []);
      }
      if (branchRes.data.success) {
        setBranches(branchRes.data.data || []);
      }
    } catch (err) {
      console.error('Error fetching efficiency data:', err.message);
    } finally {
      setLoading(false);
    }
  }, [branchFilter]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Search filter
  const filteredEfficiencies = efficiencies.filter(emp => {
    const term = searchQuery.toLowerCase();
    return emp.full_name?.toLowerCase().includes(term) || 
           emp.department_name?.toLowerCase().includes(term);
  });

  const columns = [
    { key: 'employee_id_code', label: 'Employee ID', render: (code) => <span style={{ fontWeight: 600 }}>{code || 'N/A'}</span> },
    { key: 'full_name', label: 'Employee Name', render: (name) => <strong style={{ color: 'var(--text-color)' }}>{name}</strong> },
    { key: 'department_name', label: 'Department' },
    { 
      key: 'sub_department_name', 
      label: 'Sub-Department / Role', 
      render: (name, emp) => {
        if (emp.department_name && (emp.department_name.toLowerCase().includes('social') || emp.department_name.toLowerCase().includes('marketing') || emp.department_name.toLowerCase().includes('smm'))) {
          return '-';
        }
        return name || 'Creative Specialist';
      }
    },
    { key: 'total_tasks', label: 'Assigned Tasks', render: (val) => <span style={{ fontWeight: 600 }}>{val}</span> },
    { key: 'completed_tasks', label: 'Completed Tasks', render: (val) => <span style={{ fontWeight: 600, color: 'var(--success)' }}>{val}</span> },
    { 
      key: 'efficiency', 
      label: 'Efficiency Score', 
      render: (val, emp) => {
        let barColor = 'var(--success)';
        if (val < 50) barColor = 'var(--danger)';
        else if (val < 80) barColor = 'var(--warning)';

        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ flex: 1, height: '8px', backgroundColor: '#e2e8f0', borderRadius: '4px', overflow: 'hidden', minWidth: '100px' }}>
                <div style={{ width: `${val}%`, height: '100%', backgroundColor: barColor, borderRadius: '4px' }}></div>
              </div>
              <strong style={{ fontSize: '13px', color: 'var(--text-color)', width: '36px' }}>{val}%</strong>
            </div>
            <button
              className="btn btn-secondary btn-sm"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedEmployeeForCalculation(emp);
                setIsCalculationModalOpen(true);
              }}
              style={{
                alignSelf: 'flex-start',
                padding: '2px 8px',
                fontSize: '11px',
                marginTop: '2px',
                fontWeight: 700
              }}
            >
              View Calculation
            </button>
          </div>
        );
      } 
    }
  ];

  return (
    <div style={{ padding: '30px', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 800, color: 'var(--text-color)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <BarChart3 size={26} style={{ color: 'var(--primary)' }} />
            Employee Efficiency Report
          </h1>
          <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: 'var(--text-muted)' }}>
            Employee performance statistics calculated by comparing completed deliverables vs. assigned tasks.
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
            placeholder="Search by employee name or department..."
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
            <span>Loading performance metrics...</span>
          </div>
        ) : filteredEfficiencies.length === 0 ? (
          <div style={{ padding: '80px 40px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <AlertCircle size={36} style={{ margin: '0 auto 12px auto', opacity: 0.5 }} />
            <h4 style={{ margin: 0, fontWeight: 700 }}>No Performance Records Found</h4>
            <p style={{ margin: '4px 0 0 0', fontSize: '13px' }}>
              No employee data matched your filter criteria.
            </p>
          </div>
        ) : (
          <Table
            columns={columns}
            data={filteredEfficiencies}
            emptyMessage="No performance data available."
          />
        )}
      </div>

      {/* INDIVIDUAL SCORE CALCULATION BREAKDOWN MODAL */}
      <Modal
        isOpen={isCalculationModalOpen}
        onClose={() => {
          setIsCalculationModalOpen(false);
          setSelectedEmployeeForCalculation(null);
        }}
        title={`Score Brief: ${selectedEmployeeForCalculation?.full_name || ''}`}
        footer={
          <button 
            className="btn btn-primary" 
            onClick={() => {
              setIsCalculationModalOpen(false);
              setSelectedEmployeeForCalculation(null);
            }} 
            style={{ padding: '8px 16px', backgroundColor: 'var(--primary)', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 600, cursor: 'pointer' }}
          >
            Close
          </button>
        }
      >
        {selectedEmployeeForCalculation && (
          <div style={{ padding: '10px 0', color: 'var(--text-main, #0f172a)', fontSize: '14px', lineHeight: '1.6' }}>
            <p style={{ marginBottom: '16px' }}>
              Here is the individual calculation breakdown of the efficiency score for <strong>{selectedEmployeeForCalculation.full_name}</strong> for the selected period.
            </p>

            {/* 1. Completion Score Card */}
            <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px', marginBottom: '16px' }}>
              <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', color: 'var(--primary)', fontWeight: 700 }}>
                1. Completion Score
              </h4>
              <p style={{ margin: '0 0 10px 0', fontSize: '13px', color: 'var(--text-muted)' }}>
                Percentage of completed tasks relative to total assigned tasks (including any reworks).
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', background: '#fff', padding: '12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  Formula: (Completed Tasks / Total Tasks) × 100
                </div>
                <div style={{ fontWeight: 700, fontSize: '15px', fontFamily: 'monospace' }}>
                  ({selectedEmployeeForCalculation.completed_tasks} / {selectedEmployeeForCalculation.total_tasks}) × 100 = {selectedEmployeeForCalculation.completion_score || 0}%
                </div>
              </div>
            </div>
            
            {/* Final Overall Efficiency */}
            <div style={{ backgroundColor: 'var(--primary-light)', border: '1px solid var(--primary)', borderRadius: '8px', padding: '16px' }}>
              <h4 style={{ margin: '0 0 6px 0', fontSize: '14px', color: 'var(--primary)', fontWeight: 800 }}>
                Overall Efficiency Score
              </h4>
              <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--primary)' }}>
                {selectedEmployeeForCalculation.efficiency}%
              </div>
            </div>
          </div>
        )}
      </Modal>

    </div>
  );
};

export default SuperAdminEfficiency;
