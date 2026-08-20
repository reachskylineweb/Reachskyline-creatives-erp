import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import { 
  CalendarClock, 
  Search, 
  Save, 
  Check, 
  AlertCircle,
  FileText,
  User,
  Filter
} from 'lucide-react';

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

const ManagerDeliverableList = () => {
  const { user } = useAuth();
  const managerProfile = user?.managerProfile || {};

  const [deliverables, setDeliverables] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filters
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
  });
  const [selectedClient, setSelectedClient] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  // Row state tracking for changes
  const [modifiedRows, setModifiedRows] = useState({}); // id -> { assigned_employee_id, status, remarks }
  const [savedRowIds, setSavedRowIds] = useState(new Set()); // IDs of rows that were recently saved successfully

  // Fetch employees for this department
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

  // Fetch deliverables
  const fetchDeliverables = useCallback(async () => {
    if (!managerProfile.department_id) return;
    setLoading(true);
    try {
      const res = await api.get('/deliverables', {
        params: {
          monthFilter: selectedMonth,
          departmentFilter: managerProfile.department_id,
          limit: 100, // Fetch up to 100 items for department
          page: 1
        }
      });
      if (res.data.success) {
        setDeliverables(res.data.data.deliverables || []);
        // Reset modified state when reload
        setModifiedRows({});
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

  // Handle cell edits in memory
  const handleCellEdit = (itemId, field, value) => {
    const originalItem = deliverables.find(item => item.id === itemId);
    if (!originalItem) return;

    setModifiedRows(prev => {
      const currentMod = prev[itemId] || {
        assigned_employee_id: originalItem.assigned_employee_id,
        status: originalItem.status,
        remarks: originalItem.remarks || ''
      };

      const updatedMod = {
        ...currentMod,
        [field]: value
      };

      // Check if changes match the original. If yes, we can remove tracking
      const isUnchanged = 
        Number(updatedMod.assigned_employee_id) === Number(originalItem.assigned_employee_id) &&
        updatedMod.status === originalItem.status &&
        updatedMod.remarks.trim() === (originalItem.remarks || '').trim();

      if (isUnchanged) {
        const next = { ...prev };
        delete next[itemId];
        return next;
      }

      return {
        ...prev,
        [itemId]: updatedMod
      };
    });
  };

  // Submit changes for a single row
  const handleSaveRow = async (itemId) => {
    const changes = modifiedRows[itemId];
    if (!changes) return;

    const originalItem = deliverables.find(item => item.id === itemId);
    if (!originalItem) return;

    try {
      const payload = {
        client_id: originalItem.client_id,
        month: originalItem.month,
        department_id: originalItem.department_id,
        deliverable: originalItem.deliverable,
        quantity: originalItem.quantity,
        assigned_manager_id: originalItem.assigned_manager_id,
        assigned_employee_id: Number(changes.assigned_employee_id),
        priority: originalItem.priority,
        due_date: originalItem.due_date ? originalItem.due_date.substring(0, 10) : '',
        status: changes.status,
        description: originalItem.description || '',
        remarks: changes.remarks
      };

      const res = await api.put(`/deliverables/${itemId}`, payload);
      if (res.data.success) {
        // Update local deliverables state list
        setDeliverables(prev => prev.map(item => {
          if (item.id === itemId) {
            const empObj = employees.find(e => e.id === Number(changes.assigned_employee_id)) || {};
            return {
              ...item,
              assigned_employee_id: Number(changes.assigned_employee_id),
              employee_name: empObj.full_name || item.employee_name,
              status: changes.status,
              remarks: changes.remarks
            };
          }
          return item;
        }));

        // Remove from modified tracking
        setModifiedRows(prev => {
          const next = { ...prev };
          delete next[itemId];
          return next;
        });

        // Trigger visual success highlight
        setSavedRowIds(prev => {
          const next = new Set(prev);
          next.add(itemId);
          return next;
        });

        setTimeout(() => {
          setSavedRowIds(prev => {
            const next = new Set(prev);
            next.delete(itemId);
            return next;
          });
        }, 2000);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save changes. Make sure all fields are valid.');
    }
  };

  // Extract unique clients list from deliverables for filtering
  const clientsList = Array.from(
    new Set(deliverables.map(d => JSON.stringify({ id: d.client_id, company_name: d.client_name })))
  ).map(str => JSON.parse(str)).sort((a, b) => a.company_name.localeCompare(b.company_name));

  // Filter deliverables list
  const filteredDeliverables = deliverables.filter(item => {
    const matchesSearch = 
      item.deliverable.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.remarks || '').toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesClient = selectedClient === '' || Number(item.client_id) === Number(selectedClient);
    const matchesStatus = selectedStatus === '' || item.status === selectedStatus;

    return matchesSearch && matchesClient && matchesStatus;
  });

  return (
    <div style={{ padding: '30px', maxWidth: '1400px', margin: '0 auto' }}>
      
      {/* Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-color)', display: 'flex', alignItems: 'center', gap: '10px', margin: 0 }}>
            <CalendarClock size={26} style={{ color: 'var(--primary)' }} />
            Deliverables Delegation Panel
          </h1>
          <p style={{ margin: '6px 0 0 0', color: 'var(--text-muted)', fontSize: '14px' }}>
            Assign tasks to your graphic designers and monitor their work status inline.
          </p>
        </div>

        {/* Month Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: '#ffffff', border: '1px solid var(--border-color)', padding: '6px 12px', borderRadius: 'var(--radius-sm)' }}>
          <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>Month:</span>
          <input 
            type="month" 
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            style={{ border: 'none', outline: 'none', fontWeight: 700, fontSize: '13px', cursor: 'pointer', color: 'var(--text-color)' }}
          />
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div 
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '20px',
          backgroundColor: '#ffffff',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-md)',
          padding: '16px 20px',
          marginBottom: '20px',
          boxShadow: 'var(--shadow-sm)',
          flexWrap: 'wrap'
        }}
      >
        {/* Search */}
        <div style={{ position: 'relative', flex: 1, minWidth: '250px' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search deliverables or remarks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 12px 10px 40px',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-sm)',
              outline: 'none',
              fontSize: '14px'
            }}
          />
        </div>

        {/* Client filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Filter size={16} style={{ color: 'var(--text-muted)' }} />
          <select
            value={selectedClient}
            onChange={(e) => setSelectedClient(e.target.value)}
            style={{
              padding: '10px 14px',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-sm)',
              fontSize: '14px',
              backgroundColor: '#ffffff',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="">All Clients</option>
            {clientsList.map(c => (
              <option key={c.id} value={c.id}>{c.company_name}</option>
            ))}
          </select>
        </div>

        {/* Status filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            style={{
              padding: '10px 14px',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-sm)',
              fontSize: '14px',
              backgroundColor: '#ffffff',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Table Container */}
      <div 
        style={{
          backgroundColor: '#ffffff',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-sm)',
          overflow: 'hidden'
        }}
      >
        {loading ? (
          <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <div style={{ width: '32px', height: '32px', border: '3px solid #e2e8f0', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 12px auto' }}></div>
            <span>Fetching deliverables...</span>
          </div>
        ) : filteredDeliverables.length === 0 ? (
          <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <FileText size={40} style={{ color: 'var(--border-color)', marginBottom: '12px' }} />
            <p style={{ margin: 0, fontWeight: 600 }}>No deliverables found matching current filters.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '1000px' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--bg-light)', borderBottom: '1px solid var(--border-color)' }}>
                  <th style={{ padding: '16px 20px', fontSize: '13px', fontWeight: 700, color: 'var(--text-color)', textTransform: 'uppercase', width: '120px' }}>Due Date</th>
                  <th style={{ padding: '16px 20px', fontSize: '13px', fontWeight: 700, color: 'var(--text-color)', textTransform: 'uppercase', width: '180px' }}>Client</th>
                  <th style={{ padding: '16px 20px', fontSize: '13px', fontWeight: 700, color: 'var(--text-color)', textTransform: 'uppercase' }}>Deliverable</th>
                  <th style={{ padding: '16px 20px', fontSize: '13px', fontWeight: 700, color: 'var(--text-color)', textTransform: 'uppercase', width: '220px' }}>Assign Designer</th>
                  <th style={{ padding: '16px 20px', fontSize: '13px', fontWeight: 700, color: 'var(--text-color)', textTransform: 'uppercase', width: '160px' }}>Status</th>
                  <th style={{ padding: '16px 20px', fontSize: '13px', fontWeight: 700, color: 'var(--text-color)', textTransform: 'uppercase', width: '220px' }}>Remarks</th>
                  <th style={{ padding: '16px 20px', fontSize: '13px', fontWeight: 700, color: 'var(--text-color)', textTransform: 'uppercase', width: '100px', textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDeliverables.map(item => {
                  const isModified = !!modifiedRows[item.id];
                  const isSaved = savedRowIds.has(item.id);
                  
                  const rowState = modifiedRows[item.id] || {
                    assigned_employee_id: item.assigned_employee_id,
                    status: item.status,
                    remarks: item.remarks || ''
                  };

                  return (
                    <tr 
                      key={item.id}
                      style={{ 
                        borderBottom: '1px solid var(--border-color)',
                        transition: 'background-color 0.2s, outline 0.2s',
                        backgroundColor: isSaved ? '#f0fdf4' : isModified ? '#fefeff' : '#ffffff',
                        outline: isSaved ? '2px solid #22c55e' : 'none'
                      }}
                    >
                      {/* Due Date */}
                      <td style={{ padding: '16px 20px', fontSize: '14px', fontWeight: 600, color: 'var(--text-muted)' }}>
                        {new Date(item.due_date).toLocaleDateString('en-US', { timeZone: 'UTC', day: 'numeric', month: 'short' })}
                      </td>

                      {/* Client */}
                      <td style={{ padding: '16px 20px', fontSize: '14px', fontWeight: 700, color: 'var(--text-color)' }}>
                        {item.client_name}
                      </td>

                      {/* Deliverable */}
                      <td style={{ padding: '16px 20px', fontSize: '14px', fontWeight: 600, color: 'var(--text-color)' }}>
                        {item.deliverable}
                        {item.is_event_day === 1 && (
                          <span style={{ backgroundColor: '#e0e7ff', color: '#4338ca', fontSize: '10px', fontWeight: 800, padding: '2px 8px', borderRadius: '99px', marginLeft: '8px', textTransform: 'uppercase' }}>
                            EVENT DAY
                          </span>
                        )}
                      </td>

                      {/* Designer Dropdown */}
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <User size={14} style={{ color: 'var(--text-light)', flexShrink: 0 }} />
                          <select
                            value={rowState.assigned_employee_id}
                            onChange={(e) => handleCellEdit(item.id, 'assigned_employee_id', e.target.value)}
                            style={{
                              width: '100%',
                              padding: '8px 10px',
                              borderRadius: 'var(--radius-sm)',
                              border: '1px solid ' + (isModified && Number(rowState.assigned_employee_id) !== Number(item.assigned_employee_id) ? 'var(--primary)' : 'var(--border-color)'),
                              fontSize: '13px',
                              backgroundColor: '#ffffff',
                              outline: 'none',
                              fontWeight: 500,
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

                      {/* Status Dropdown */}
                      <td style={{ padding: '12px 16px' }}>
                        <select
                          value={rowState.status}
                          onChange={(e) => handleCellEdit(item.id, 'status', e.target.value)}
                          style={{
                            width: '100%',
                            padding: '8px 10px',
                            borderRadius: 'var(--radius-sm)',
                            border: '1px solid ' + (isModified && rowState.status !== item.status ? 'var(--primary)' : 'var(--border-color)'),
                            fontSize: '13px',
                            backgroundColor: rowState.status === 'completed' ? 'rgba(16, 185, 129, 0.08)' : rowState.status === 'in_progress' ? 'rgba(59, 130, 246, 0.08)' : 'rgba(218, 167, 27, 0.08)',
                            color: rowState.status === 'completed' ? 'var(--success)' : rowState.status === 'in_progress' ? 'var(--info)' : 'var(--warning)',
                            outline: 'none',
                            fontWeight: 700,
                            cursor: 'pointer'
                          }}
                        >
                          <option value="pending">Pending</option>
                          <option value="in_progress">In Progress</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>

                      {/* Remarks */}
                      <td style={{ padding: '12px 16px' }}>
                        <input 
                          type="text"
                          value={rowState.remarks}
                          onChange={(e) => handleCellEdit(item.id, 'remarks', e.target.value)}
                          placeholder="Log remarks..."
                          style={{
                            width: '100%',
                            padding: '8px 12px',
                            borderRadius: 'var(--radius-sm)',
                            border: '1px solid ' + (isModified && rowState.remarks !== (item.remarks || '') ? 'var(--primary)' : 'var(--border-color)'),
                            fontSize: '13px',
                            outline: 'none'
                          }}
                        />
                      </td>

                      {/* Save Action */}
                      <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                        {isSaved ? (
                          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--success)', color: '#ffffff', borderRadius: '50%', width: '28px', height: '28px' }}>
                            <Check size={16} />
                          </div>
                        ) : (
                          <button
                            disabled={!isModified}
                            onClick={() => handleSaveRow(item.id)}
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
                              transition: 'background-color 0.2s',
                              boxShadow: isModified ? '0 1px 3px rgba(79, 70, 229, 0.2)' : 'none'
                            }}
                            title={isModified ? "Save changes for this row" : "No changes to save"}
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

export default ManagerDeliverableList;
