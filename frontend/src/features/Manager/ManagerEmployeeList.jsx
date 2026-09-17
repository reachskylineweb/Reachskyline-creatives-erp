import React, { useState, useEffect, useCallback } from 'react';
import { Users, Search, Mail, Phone, Calendar, ShieldCheck, Tag } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import Table from '../../components/Table';
import ManagerEfficiency from './ManagerEfficiency';

const ManagerEmployeeList = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('details');
  const managerProfile = user?.managerProfile || {};
  const departmentId = managerProfile.department_id;

  const [data, setData] = useState([]);
  const [subDepartments, setSubDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  // Filters
  const [search, setSearch] = useState('');
  const [subDeptFilter, setSubDeptFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const fetchSubDepartments = useCallback(async () => {
    if (!departmentId) return;
    try {
      const res = await api.get(`/departments/${departmentId}/sub-departments`);
      if (res.data.success) {
        setSubDepartments(res.data.data.subDepartments || []);
      }
    } catch (err) {
      console.error('Error fetching sub-departments:', err.message);
    }
  }, [departmentId]);

  const fetchEmployees = useCallback(async () => {
    if (!departmentId) return;
    setLoading(true);
    try {
      const response = await api.get('/users/employees', {
        params: {
          page,
          limit,
          sortColumn: 'full_name',
          sortOrder: 'asc',
          searchQuery: search,
          departmentFilter: departmentId,
          statusFilter
        }
      });
      if (response.data.success) {
        let employeesList = response.data.data.employees || [];
        // Client-side filter by sub-department if selected
        if (subDeptFilter) {
          employeesList = employeesList.filter(emp => Number(emp.sub_department_id) === Number(subDeptFilter));
        }
        setData(employeesList);
        setTotal(response.data.data.pagination?.total || response.data.data.employees?.length || 0);
      }
    } catch (err) {
      console.error('Error fetching employees:', err.message);
    } finally {
      setLoading(false);
    }
  }, [page, limit, search, departmentId, subDeptFilter, statusFilter]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [search, subDeptFilter, statusFilter]);

  useEffect(() => {
    fetchSubDepartments();
  }, [fetchSubDepartments]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const columns = [
    {
      key: 'full_name',
      label: 'Employee Name',
      render: (name, row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
            {name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div style={{ fontWeight: 700, color: 'var(--text-color)' }}>{name}</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'monospace' }}>{row.employee_id_code}</div>
          </div>
        </div>
      )
    },
    {
      key: 'sub_department_name',
      label: 'Sub-Department / Role',
      render: (val, row) => (
        <span className="badge" style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary)', border: '1px solid var(--primary)', fontWeight: 600 }}>
          {row.sub_department_name || row.department_name || 'Unassigned'}
        </span>
      )
    },
    {
      key: 'email',
      label: 'Contact Email',
      render: (email) => (
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)' }}>
          <Mail size={14} />
          <span>{email || 'N/A'}</span>
        </div>
      )
    },
    {
      key: 'phone',
      label: 'Phone Number',
      render: (phone) => (
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)' }}>
          <Phone size={14} />
          <span>{phone || 'N/A'}</span>
        </div>
      )
    },
    {
      key: 'joining_date',
      label: 'Joining Date',
      render: (date) => (
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)' }}>
          <Calendar size={14} />
          <span>{date ? new Date(date).toLocaleDateString() : 'N/A'}</span>
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (status) => (
        <span className={`badge ${status === 'active' ? 'badge-active' : 'badge-inactive'}`}>
          {status}
        </span>
      )
    }
  ];

  return (
    <div style={{ padding: '30px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Page Header (Only show when Details tab is active) */}
      {activeTab === 'details' && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 800, color: 'var(--text-color)' }}>
              Department Employees
            </h1>
            <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: 'var(--text-muted)' }}>
              View and manage employee directory and sub-department roles in your department.
            </p>
          </div>
        </div>
      )}

      {/* Tabs Header */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border-color)', marginBottom: '24px', paddingBottom: '1px' }}>
        <button
          onClick={() => setActiveTab('details')}
          style={{
            padding: '10px 20px',
            backgroundColor: 'transparent',
            color: activeTab === 'details' ? 'var(--primary)' : 'var(--text-muted)',
            border: 'none',
            borderBottom: activeTab === 'details' ? '3px solid var(--primary)' : '3px solid transparent',
            fontWeight: 700,
            fontSize: '14px',
            cursor: 'pointer',
            transition: 'all 0.2s',
            marginBottom: '-2px'
          }}
        >
          Employee Details
        </button>
        <button
          onClick={() => setActiveTab('efficiency')}
          style={{
            padding: '10px 20px',
            backgroundColor: 'transparent',
            color: activeTab === 'efficiency' ? 'var(--primary)' : 'var(--text-muted)',
            border: 'none',
            borderBottom: activeTab === 'efficiency' ? '3px solid var(--primary)' : '3px solid transparent',
            fontWeight: 700,
            fontSize: '14px',
            cursor: 'pointer',
            transition: 'all 0.2s',
            marginBottom: '-2px'
          }}
        >
          Employee Efficiency
        </button>
      </div>

      {activeTab === 'details' ? (
        <>
          {/* Filters Bar */}
          <div className="card" style={{ padding: '16px 20px', marginBottom: '16px', display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', gap: '12px', flex: 1, minWidth: '280px', flexWrap: 'wrap' }}>
              <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
                <Search style={{ position: 'absolute', left: '12px', top: '10px', color: 'var(--text-muted)' }} size={16} />
                <input
                  type="text"
                  placeholder="Search employee by name..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="form-control"
                  style={{ width: '100%', paddingLeft: '36px' }}
                />
              </div>
              <div style={{ minWidth: '180px' }}>
                <select
                  value={subDeptFilter}
                  onChange={(e) => setSubDeptFilter(e.target.value)}
                  className="form-control"
                  style={{ width: '100%', cursor: 'pointer' }}
                >
                  <option value="">All Sub-Departments</option>
                  {subDepartments.map(sd => (
                    <option key={sd.id} value={sd.id}>{sd.name}</option>
                  ))}
                </select>
              </div>
              <div style={{ minWidth: '150px' }}>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="form-control"
                  style={{ width: '100%', cursor: 'pointer' }}
                >
                  <option value="">All Statuses</option>
                  <option value="active">Active Only</option>
                  <option value="inactive">Inactive Only</option>
                </select>
              </div>
            </div>
            <div className="text-muted" style={{ fontSize: '13px' }}>
              Total Members: <strong>{total}</strong> employees
            </div>
          </div>

          {/* Table */}
          <div className="card" style={{ padding: '0px', overflow: 'hidden' }}>
            {loading && data.length === 0 ? (
              <div style={{ padding: '80px', textAlign: 'center', color: 'var(--text-muted)' }}>
                <div className="spinner" style={{ margin: '0 auto 12px auto' }}></div>
                <span>Loading employees ledger...</span>
              </div>
            ) : data.length === 0 ? (
              <div style={{ padding: '80px 40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                <Users size={40} style={{ margin: '0 auto 12px auto', opacity: 0.5 }} />
                <h4 style={{ margin: 0, fontWeight: 700 }}>No Employees Found</h4>
                <p style={{ margin: '4px 0 0 0', fontSize: '13px' }}>
                  No employees match the filters in your department.
                </p>
              </div>
            ) : (
              <Table
                columns={columns}
                data={data}
                pagination={{
                  page,
                  limit,
                  total,
                  totalPages: Math.ceil(total / limit),
                  onPageChange: (p) => setPage(p)
                }}
                emptyMessage="No employees found in your department."
              />
            )}
          </div>
        </>
      ) : (
        <ManagerEfficiency isTab={true} />
      )}
    </div>
  );
};

export default ManagerEmployeeList;
