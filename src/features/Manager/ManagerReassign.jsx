import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import { RefreshCw, Save, Check, User, ArrowRightLeft } from 'lucide-react';

const getFilteredEmployees = (reqSubDeptId, employeesList) => {
  if (!reqSubDeptId) return employeesList;
  const reqId = Number(reqSubDeptId);
  return employeesList.filter(emp => {
    const empSubDeptId = Number(emp.sub_department_id);
    if (empSubDeptId === reqId) return true;
    if (empSubDeptId === 4 && (reqId === 1 || reqId === 2)) return true;
    return false;
  });
};

const ManagerReassign = () => {
  const { user } = useAuth();
  const managerProfile = user?.managerProfile || {};

  const [deliverables, setDeliverables] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
  });

  const [assignments, setAssignments] = useState({}); // itemId -> employee_id
  const [savedRowIds, setSavedRowIds] = useState(new Set());

  const fetchEmployees = useCallback(async () => {
    if (!managerProfile.department_id) return;
    try {
      const res = await api.get(`/users/employees/dropdown`, {
        params: { departmentId: managerProfile.department_id }
      });
      if (res.data.success) {
        setEmployees(res.data.data.employees || []);
      }
    } catch (err) {
      console.error('Error fetching employees:', err.message);
    }
  }, [managerProfile.department_id]);

  const fetchDeliverables = useCallback(async () => {
    if (!managerProfile.department_id) return;
    setLoading(true);
    try {
      const res = await api.get('/deliverables', {
        params: {
          monthFilter: selectedMonth,
          departmentFilter: managerProfile.department_id,
          limit: 100,
          page: 1
        }
      });
      if (res.data.success) {
        const list = res.data.data.deliverables || [];
        // Filter to in-progress or pending only
        const activeList = list.filter(item => item.status !== 'completed');
        setDeliverables(activeList);
        setAssignments({});
      }
    } catch (err) {
      console.error('Error fetching deliverables:', err.message);
    } finally {
      setLoading(false);
    }
  }, [managerProfile.department_id, selectedMonth]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  useEffect(() => {
    fetchDeliverables();
  }, [fetchDeliverables]);

  const handleSelection = (itemId, employeeId) => {
    setAssignments(prev => ({
      ...prev,
      [itemId]: employeeId
    }));
  };

  const handleSaveReassignment = async (item) => {
    const newEmployeeId = assignments[item.id];
    if (!newEmployeeId) return;

    try {
      const payload = {
        ...item,
        assigned_employee_id: Number(newEmployeeId),
        due_date: item.due_date ? item.due_date.substring(0, 10) : ''
      };

      const res = await api.put(`/deliverables/${item.id}`, payload);
      if (res.data.success) {
        const empObj = employees.find(e => e.id === Number(newEmployeeId)) || {};
        setDeliverables(prev => prev.map(d => d.id === item.id ? { ...d, assigned_employee_id: Number(newEmployeeId), employee_name: empObj.full_name || d.employee_name } : d));
        setAssignments(prev => {
          const next = { ...prev };
          delete next[item.id];
          return next;
        });

        setSavedRowIds(prev => {
          const next = new Set(prev);
          next.add(item.id);
          return next;
        });
        setTimeout(() => {
          setSavedRowIds(prev => {
            const next = new Set(prev);
            next.delete(item.id);
            return next;
          });
        }, 2000);
      }
    } catch (err) {
      alert('Failed to reassign work: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div style={{ padding: '30px', maxWidth: '1400px', margin: '0 auto' }}>
      
      {/* Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-color)', display: 'flex', alignItems: 'center', gap: '10px', margin: 0 }}>
            <RefreshCw size={26} style={{ color: 'var(--primary)' }} />
            Reassign Designer Tasks
          </h1>
          <p style={{ margin: '6px 0 0 0', color: 'var(--text-muted)', fontSize: '14px' }}>
            Quickly reallocate active deliverables between designers in your department.
          </p>
        </div>

        <input 
          type="month" 
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          style={{ padding: '8px 12px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', fontWeight: 600, outline: 'none' }}
        />
      </div>

      <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <div style={{ width: '32px', height: '32px', border: '3px solid #e2e8f0', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 12px auto' }}></div>
            <span>Fetching active deliverables...</span>
          </div>
        ) : deliverables.length === 0 ? (
          <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <Check size={40} style={{ color: 'var(--success)', marginBottom: '12px' }} />
            <p style={{ margin: 0, fontWeight: 600 }}>No active deliverables in progress. All completed!</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '900px' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--bg-light)', borderBottom: '1px solid var(--border-color)' }}>
                  <th style={{ padding: '16px 20px', fontSize: '13px', fontWeight: 700, color: 'var(--text-color)', textTransform: 'uppercase' }}>Client</th>
                  <th style={{ padding: '16px 20px', fontSize: '13px', fontWeight: 700, color: 'var(--text-color)', textTransform: 'uppercase' }}>Deliverable</th>
                  <th style={{ padding: '16px 20px', fontSize: '13px', fontWeight: 700, color: 'var(--text-color)', textTransform: 'uppercase' }}>Current Assignee</th>
                  <th style={{ padding: '16px 20px', fontSize: '13px', fontWeight: 700, color: 'var(--text-color)', textTransform: 'uppercase', width: '320px' }}>Reassign To</th>
                  <th style={{ padding: '16px 20px', fontSize: '13px', fontWeight: 700, color: 'var(--text-color)', textTransform: 'uppercase', width: '100px', textAlign: 'center' }}>Save</th>
                </tr>
              </thead>
              <tbody>
                {deliverables.map(item => {
                  const currentSelection = assignments[item.id] || item.assigned_employee_id;
                  const isModified = Number(currentSelection) !== Number(item.assigned_employee_id);
                  const isSaved = savedRowIds.has(item.id);

                  return (
                    <tr 
                      key={item.id}
                      style={{
                        borderBottom: '1px solid var(--border-color)',
                        backgroundColor: isSaved ? '#f0fdf4' : isModified ? '#fefeff' : '#ffffff',
                        outline: isSaved ? '2px solid #22c55e' : 'none'
                      }}
                    >
                      <td style={{ padding: '16px 20px', fontSize: '14px', fontWeight: 700, color: 'var(--text-color)' }}>{item.client_name}</td>
                      <td style={{ padding: '16px 20px', fontSize: '14px', fontWeight: 600, color: 'var(--text-color)' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                          <span>{item.deliverable}</span>
                          {item.activity_code && (
                            <span style={{ fontFamily: 'monospace', fontSize: '11px', fontWeight: 800, color: 'var(--primary)' }}>
                              {item.activity_code}
                            </span>
                          )}
                        </div>
                      </td>
                      <td style={{ padding: '16px 20px', fontSize: '14px', color: 'var(--text-muted)', fontWeight: 500 }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: 'var(--bg-light)', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 600 }}>
                          <User size={12} />
                          {item.employee_name}
                        </span>
                      </td>

                      {/* Dropdown */}
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <ArrowRightLeft size={14} style={{ color: 'var(--text-light)' }} />
                          <select
                            value={currentSelection}
                            onChange={(e) => handleSelection(item.id, e.target.value)}
                            style={{
                              width: '100%',
                              padding: '8px 12px',
                              borderRadius: 'var(--radius-sm)',
                              border: '1px solid ' + (isModified ? 'var(--primary)' : 'var(--border-color)'),
                              fontSize: '13px',
                              outline: 'none',
                              backgroundColor: '#ffffff',
                              cursor: 'pointer'
                            }}
                          >
                            {(() => {
                              const reqSubDept = item.sub_department_id;
                              const filtered = getFilteredEmployees(reqSubDept, employees);
                              return filtered.map(emp => (
                                <option key={emp.id} value={emp.id}>{emp.full_name}</option>
                              ));
                            })()}
                          </select>
                        </div>
                      </td>

                      {/* Action */}
                      <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                        {isSaved ? (
                          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--success)', color: '#ffffff', borderRadius: '50%', width: '28px', height: '28px' }}>
                            <Check size={16} />
                          </div>
                        ) : (
                          <button
                            disabled={!isModified}
                            onClick={() => handleSaveReassignment(item)}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              backgroundColor: isModified ? 'var(--primary)' : 'var(--bg-light)',
                              color: isModified ? '#ffffff' : 'var(--text-light)',
                              border: 'none',
                              borderRadius: 'var(--radius-sm)',
                              width: '32px',
                              height: '32px',
                              cursor: isModified ? 'pointer' : 'default',
                              transition: 'background-color 0.2s'
                            }}
                          >
                            <Save size={16} />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};

export default ManagerReassign;
