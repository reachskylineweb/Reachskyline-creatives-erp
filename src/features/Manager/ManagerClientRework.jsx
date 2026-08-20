import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  AlertTriangle, ExternalLink, User, CheckCircle, RefreshCw, ArrowLeftRight
} from 'lucide-react';
import api from '../../utils/api';
import Modal from '../../components/Modal';

const ensureExternalLink = (url) => {
  if (!url) return '';
  const trimmed = url.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }
  return `https://${trimmed}`;
};

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

const ManagerClientRework = () => {
  const { user } = useAuth();
  const managerProfile = user?.managerProfile || {};

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actingId, setActingId] = useState(null);

  // Month filtering & pagination state
  const [delivMonth, setDelivMonth] = useState(() => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
  });
  const [page, setPage] = useState(1);

  // Modal and state for manager reassign corrections
  const [reassignItem, setReassignItem] = useState(null);
  const [isReassignModalOpen, setIsReassignModalOpen] = useState(false);
  const [reassignRemarks, setReassignRemarks] = useState('');
  const [approveItem, setApproveItem] = useState(null);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
  const [employees, setEmployees] = useState([]);

  // Popup for Client text feedback details
  const [activeClientTextItem, setActiveClientTextItem] = useState(null);

  const fetchClientReworks = useCallback(async () => {
    if (!managerProfile.department_id) return;
    setLoading(true);
    try {
      const [delivsRes, jobsRes] = await Promise.all([
        api.get('/deliverables', {
          params: {
            departmentFilter: managerProfile.department_id,
            statusFilter: 'client_approved,client_rework',
            limit: 1000,
            page: 1
          }
        }),
        api.get('/deliverables/job-work/client-rework')
      ]);

      let combined = [];

      if (delivsRes.data.success) {
        const list = delivsRes.data.data.deliverables || [];
        const filteredDelivs = list.filter(item => ['client_rework', 'client_approved'].includes(item.status)).map(d => ({
          ...d,
          isJobWork: d.is_job_work === 1 || d.is_job_work === true
        }));
        combined = [...combined, ...filteredDelivs];
      }

      if (jobsRes.data.success) {
        const list = jobsRes.data.data || [];
        const filteredJobs = list
          .filter(j => !combined.some(existing => existing.isJobWork && existing.id === j.id))
          .map(j => ({
            ...j,
            isJobWork: true,
            deliverable: `Job Work #${j.id}: ${j.activity_name || j.activity_type_code} (Qty: ${j.quantity})`
          }));
        combined = [...combined, ...filteredJobs];
      }

      setItems(combined);
    } catch (err) {
      console.error('Error fetching client reworks:', err.message);
    } finally {
      setLoading(false);
    }
  }, [managerProfile.department_id]);

  const fetchEmployees = useCallback(async () => {
    if (!managerProfile.department_id) return;
    try {
      const res = await api.get('/users/employees/dropdown', {
        params: { departmentId: managerProfile.department_id }
      });
      if (res.data.success) {
        setEmployees(res.data.data.employees || []);
      }
    } catch (err) {
      console.error('Error fetching employees:', err.message);
    }
  }, [managerProfile.department_id]);

  useEffect(() => {
    fetchClientReworks();
    fetchEmployees();
  }, [fetchClientReworks, fetchEmployees]);

  const handlePrevMonth = () => {
    const [year, month] = delivMonth.split('-').map(Number);
    const date = new Date(year, month - 2, 1);
    setDelivMonth(`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`);
    setPage(1);
  };

  const handleNextMonth = () => {
    const [year, month] = delivMonth.split('-').map(Number);
    const date = new Date(year, month, 1);
    setDelivMonth(`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`);
    setPage(1);
  };

  const formatMonthDisplay = (monthStr) => {
    if (!monthStr) return '';
    const [year, month] = monthStr.split('-');
    const date = new Date(year, month - 1, 1);
    return date.toLocaleDateString('default', { month: 'long', year: 'numeric' });
  };

  const getMonthForItem = (item) => {
    if (!item) return '';
    if (!item.isJobWork) return item.month || '';
    return item.created_at ? item.created_at.substring(0, 7) : '';
  };

  // Filter and paginated lists
  const filteredItems = items.filter(item => {
    const itemMonth = getMonthForItem(item);
    return itemMonth === delivMonth;
  });

  const totalPages = Math.ceil(filteredItems.length / 10);
  const paginatedItems = filteredItems.slice((page - 1) * 10, page * 10);

  const handleOpenReassignModal = (item) => {
    setReassignItem(item);
    setReassignRemarks('');
    setSelectedEmployeeId(item.assigned_employee_id || '');
    setIsReassignModalOpen(true);
  };

  const handleSubmitReassign = async () => {
    if (!reassignItem) return;
    if (!reassignRemarks.trim()) {
      alert('Please provide text corrections feedback.');
      return;
    }
    
    setActingId(reassignItem.id);
    try {
      const endpoint = reassignItem.isJobWork
        ? `/deliverables/job-work/${reassignItem.id}/review`
        : `/deliverables/${reassignItem.id}/manager-client-review`;
      
      const payload = {
        action: 'reassign',
        feedbackText: reassignRemarks,
        voiceBase64: null,
        employeeId: selectedEmployeeId ? Number(selectedEmployeeId) : null
      };

      const res = reassignItem.isJobWork
        ? await api.post(endpoint, payload)
        : await api.put(endpoint, payload);

      if (res.data.success) {
        alert('Work successfully reassigned to designer employee.');
        setIsReassignModalOpen(false);
        setReassignItem(null);
        fetchClientReworks();
      }
    } catch (err) {
      console.error('Failed to reassign client rework:', err.message);
      alert(err.response?.data?.message || 'Failed to process reassignment.');
    } finally {
      setActingId(null);
    }
  };

  const handleApproveAction = (itemId, isJobWork = false) => {
    const item = items.find(i => i.id === itemId && i.isJobWork === isJobWork);
    if (!item) return;
    setApproveItem(item);
  };

  const confirmApproveAction = async () => {
    if (!approveItem) return;
    setActingId(approveItem.id);
    try {
      const endpoint = approveItem.isJobWork
        ? `/deliverables/job-work/${approveItem.id}/review`
        : `/deliverables/${approveItem.id}/manager-client-review`;
      
      const payload = { action: 'approved' };

      const res = approveItem.isJobWork
        ? await api.post(endpoint, { action: 'approve' })
        : await api.put(endpoint, payload);

      if (res.data.success) {
        alert('Work approved successfully!');
        setApproveItem(null);
        fetchClientReworks();
      }
    } catch (err) {
      console.error('Failed to approve client rework:', err.message);
      alert(err.response?.data?.message || 'Failed to process approval.');
    } finally {
      setActingId(null);
    }
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;
    return (
      <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
        <button
          className="pagination-btn"
          disabled={page === 1}
          onClick={() => setPage(p => p - 1)}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '32px', height: '32px', border: '1px solid var(--border-color)', borderRadius: '4px', backgroundColor: '#fff', cursor: page === 1 ? 'not-allowed' : 'pointer', opacity: page === 1 ? 0.5 : 1 }}
        >
          &lt;
        </button>
        {Array.from({ length: totalPages }).map((_, i) => (
          <button
            key={i}
            className={`pagination-btn ${page === i + 1 ? 'active' : ''}`}
            onClick={() => setPage(i + 1)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: '32px',
              height: '32px',
              border: '1px solid var(--border-color)',
              borderRadius: '4px',
              backgroundColor: page === i + 1 ? 'var(--primary)' : '#fff',
              color: page === i + 1 ? '#fff' : 'var(--text-color)',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            {i + 1}
          </button>
        ))}
        <button
          className="pagination-btn"
          disabled={page === totalPages}
          onClick={() => setPage(p => p + 1)}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '32px', height: '32px', border: '1px solid var(--border-color)', borderRadius: '4px', backgroundColor: '#fff', cursor: page === totalPages ? 'not-allowed' : 'pointer', opacity: page === totalPages ? 0.5 : 1 }}
        >
          &gt;
        </button>
      </div>
    );
  };

  return (
    <div style={{ padding: '30px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-color)', display: 'flex', alignItems: 'center', gap: '10px', margin: 0 }}>
            <ArrowLeftRight size={26} style={{ color: 'var(--primary)' }} />
            OP from Client
          </h1>
          <p style={{ margin: '6px 0 0 0', color: 'var(--text-muted)', fontSize: '14px' }}>
            Review approvals and rework requests submitted by clients. You can assign corrections back to the employee or finalize approvals.
          </p>
        </div>
        <button className="btn btn-secondary" onClick={fetchClientReworks} disabled={loading} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', height: '38px' }}>
          <RefreshCw size={14} /> Refresh Outputs
        </button>
      </div>

      {loading ? (
        <div style={{ padding: '80px', textAlign: 'center', color: 'var(--text-muted)' }}>
          <div style={{ width: '32px', height: '32px', border: '3px solid #e2e8f0', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 12px auto' }}></div>
          <span>Loading client decisions...</span>
        </div>
      ) : items.length === 0 ? (
        <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--border-color)', padding: '60px 40px', textAlign: 'center', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)' }}>
          <CheckCircle size={44} style={{ color: 'var(--success)', marginBottom: '12px' }} />
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: 'var(--text-color)' }}>No Client Decisions Pending</h3>
          <p style={{ margin: '8px 0 0 0', color: 'var(--text-muted)', fontSize: '14px' }}>
            No deliverables are currently awaiting review from client decisions. Keep it up.
          </p>
        </div>
      ) : (
        <div style={{ padding: '0px' }}>
          {/* Month Filter Picker */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            marginBottom: '24px',
            backgroundColor: 'var(--bg-light)',
            padding: '12px',
            borderRadius: '8px',
            border: '1px solid var(--border-color)',
            gap: '12px'
          }}>
            <button 
              type="button" 
              className="btn btn-secondary btn-sm" 
              onClick={handlePrevMonth}
              style={{ padding: '6px 12px', fontWeight: 700 }}
            >
              &lt;
            </button>
            <span style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-color)', minWidth: '120px', textAlign: 'center' }}>
              {formatMonthDisplay(delivMonth)}
            </span>
            <button 
              type="button" 
              className="btn btn-secondary btn-sm" 
              onClick={handleNextMonth}
              style={{ padding: '6px 12px', fontWeight: 700 }}
            >
              &gt;
            </button>
          </div>

          {filteredItems.length === 0 ? (
            <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--border-color)', padding: '60px 40px', textAlign: 'center', borderRadius: 'var(--radius-md)' }}>
              <CheckCircle size={40} style={{ color: 'var(--success)', marginBottom: '12px', opacity: 0.7 }} />
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700 }}>No Decisions in {formatMonthDisplay(delivMonth)}</h3>
              <p style={{ margin: '6px 0 0 0', fontSize: '13px', color: 'var(--text-muted)' }}>
                There are no client review decisions logged for this month.
              </p>
            </div>
          ) : (
            <>
              <div style={{ overflowX: 'auto', backgroundColor: '#ffffff', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', marginBottom: '20px' }}>
                <table className="enterprise-table" style={{ width: '100%', minWidth: '1000px' }}>
                  <thead>
                    <tr>
                      <th style={{ width: '180px' }}>Client</th>
                      <th style={{ width: '100px' }}>Type</th>
                      <th style={{ width: '220px' }}>Title</th>
                      <th style={{ width: '140px' }}>Employee</th>
                      <th style={{ width: '250px' }}>Client Corrections (Text)</th>
                      <th style={{ width: '140px', textAlign: 'center' }}>Design Asset</th>
                      <th style={{ width: '240px', textAlign: 'center' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedItems.map(item => {
                      const isClientApproved = item.status === 'client_approved';
                      const isApproved = item.status === 'approved';
                      const isReassigned = item.status === 'reassigned';
                      
                      return (
                        <tr key={item.isJobWork ? `job_${item.id}` : `deliv_${item.id}`} style={{ verticalAlign: 'middle' }}>
                          
                          {/* Client */}
                          <td style={{ fontWeight: 700, color: 'var(--text-color)' }}>
                            {item.client_name}
                          </td>

                          {/* Type Badge */}
                          <td>
                            <span className={`badge ${item.isJobWork ? 'badge-danger' : 'badge-primary'}`} style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 800, backgroundColor: item.isJobWork ? 'rgba(239, 68, 68, 0.15)' : 'rgba(99, 102, 241, 0.15)', color: item.isJobWork ? '#dc2626' : 'var(--primary)', border: 'none', display: 'inline-flex', padding: '4px 8px', borderRadius: '4px' }}>
                              {item.isJobWork ? 'Job Work' : 'Deliverable'}
                            </span>
                          </td>

                          {/* Title */}
                          <td style={{ fontWeight: 600 }}>
                            {item.deliverable}
                          </td>

                          {/* Employee */}
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
                              <User size={14} className="text-muted" />
                              <span style={{ fontWeight: 600 }}>{item.employee_name || 'Unassigned'}</span>
                            </div>
                          </td>

                          {/* Client Corrections (Text) */}
                          <td>
                            {isClientApproved || isApproved ? (
                              <span style={{ fontSize: '12px', color: 'var(--success)', fontWeight: 700 }}>
                                Client Approved
                              </span>
                            ) : item.client_feedback_text ? (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                <span style={{ fontSize: '10px', fontWeight: 800, color: '#f97316', textTransform: 'uppercase' }}>
                                  Client Rework
                                </span>
                                <button
                                  type="button"
                                  onClick={() => setActiveClientTextItem(item)}
                                  style={{ 
                                    background: 'none', 
                                    border: 'none', 
                                    padding: 0, 
                                    color: '#be123c', 
                                    fontWeight: 700, 
                                    cursor: 'pointer', 
                                    textDecoration: 'underline', 
                                    fontSize: '12px',
                                    textAlign: 'left'
                                  }}
                                >
                                  View Comments
                                </button>
                              </div>
                            ) : (
                              <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                                No written comments
                              </span>
                            )}
                          </td>

                          {/* Design Asset Link */}
                          <td style={{ textAlign: 'center' }}>
                            {item.google_drive_link ? (
                              <a 
                                href={item.google_drive_link} 
                                target="_blank" 
                                rel="noreferrer" 
                                className="btn btn-secondary btn-sm"
                                style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '6px 12px', fontSize: '12px', fontWeight: 600 }}
                              >
                                <ExternalLink size={12} /> View Asset
                              </a>
                            ) : (
                              <span style={{ fontSize: '12px', color: '#cbd5e1', fontStyle: 'italic' }}>No link</span>
                            )}
                          </td>

                          {/* Action buttons */}
                          <td>
                            <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', alignItems: 'center' }}>
                              {isApproved ? (
                                <span className="badge badge-success" style={{ padding: '6px 12px', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', backgroundColor: 'rgba(16, 185, 129, 0.15)', color: 'var(--success)', border: 'none' }}>
                                  Approved
                                </span>
                              ) : isReassigned ? (
                                <span className="badge" style={{ padding: '6px 12px', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', backgroundColor: 'rgba(79, 70, 229, 0.15)', color: '#4f46e5', border: 'none' }}>
                                  Reassigned
                                </span>
                              ) : (
                                <>
                                  <button 
                                    className="btn btn-warning btn-sm"
                                    onClick={() => handleOpenReassignModal(item)}
                                    disabled={actingId !== null}
                                    style={{ padding: '6px 12px', fontWeight: 700, fontSize: '12px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                                  >
                                    <ArrowLeftRight size={12} /> Reassign Work
                                  </button>
                                  <button 
                                    className="btn btn-success btn-sm"
                                    onClick={() => handleApproveAction(item.id, item.isJobWork)}
                                    disabled={actingId !== null}
                                    style={{ padding: '6px 12px', fontWeight: 700, fontSize: '12px' }}
                                  >
                                    Approve
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Counts and Pagination controls */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', padding: '0 4px' }}>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                  Showing {paginatedItems.length} of {filteredItems.length} items
                </div>
                {renderPagination()}
              </div>
            </>
          )}
        </div>
      )}

      {/* POP-UP MODAL FOR CLIENT WRITTEN FEEDBACK */}
      {activeClientTextItem && (
        <Modal
          isOpen={!!activeClientTextItem}
          onClose={() => setActiveClientTextItem(null)}
          title="Client Corrections Comments"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
              Client: <strong>{activeClientTextItem.client_name}</strong> | Deliverable: <strong>{activeClientTextItem.deliverable}</strong>
            </div>
            <div style={{ 
              padding: '16px', 
              backgroundColor: '#fff5f5', 
              border: '1px solid #fed7d7', 
              borderRadius: 'var(--radius-sm)', 
              fontSize: '14px', 
              lineHeight: 1.5,
              color: '#9b1c1c',
              fontWeight: 600,
              whiteSpace: 'pre-wrap',
              maxHeight: '300px',
              overflowY: 'auto'
            }}>
              {activeClientTextItem.client_feedback_text}
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '14px' }}>
              <button className="btn btn-secondary" onClick={() => setActiveClientTextItem(null)} style={{ padding: '8px 20px', fontWeight: 700 }}>
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* REASSIGN WORK WITH CORRECTIONS MODAL */}
      <Modal
        isOpen={isReassignModalOpen}
        onClose={() => setIsReassignModalOpen(false)}
        title="Reassign to Designer with Corrections"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setIsReassignModalOpen(false)}>
              Cancel
            </button>
            <button className="btn btn-warning" onClick={handleSubmitReassign}>
              Submit & Reassign
            </button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {reassignItem?.status !== 'client_approved' && (
            <div>
              <span style={{ fontSize: '11px', color: 'var(--text-light)', display: 'block', textTransform: 'uppercase', fontWeight: 700 }}>
                Client Feedback
              </span>
              <div style={{ padding: '12px', backgroundColor: '#fff5f5', border: '1px solid #fed7d7', borderRadius: '4px', fontSize: '13px', color: '#9b1c1c', fontWeight: 600 }}>
                {reassignItem?.client_feedback_text || 'No client written comments.'}
              </div>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-main)' }}>Assign Employee / Designer</label>
            <select
              className="form-control"
              value={selectedEmployeeId}
              onChange={(e) => setSelectedEmployeeId(e.target.value)}
              style={{ padding: '8px 12px', fontSize: '13px' }}
            >
              <option value="">-- Choose Employee --</option>
              {(() => {
                const reqSubDept = reassignItem?.sub_department_id;
                let filtered = getFilteredEmployees(reqSubDept, employees);
                if (reassignItem?.assigned_employee_id && !filtered.some(e => e.id === reassignItem.assigned_employee_id)) {
                  const currentEmp = employees.find(e => e.id === reassignItem.assigned_employee_id);
                  if (currentEmp) {
                    filtered = [...filtered, currentEmp];
                  }
                }
                return filtered.map(emp => (
                  <option key={emp.id} value={emp.id}>
                    {emp.full_name} ({emp.role_name || emp.role || 'Employee'})
                  </option>
                ));
              })()}
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-main)' }}>Manager Correction Instructions</label>
            <textarea
              className="form-control"
              value={reassignRemarks}
              onChange={(e) => setReassignRemarks(e.target.value)}
              placeholder="E.g., Please change the main color to match the client requirement..."
              rows={4}
              style={{ padding: '10px 12px', fontSize: '13px' }}
            />
          </div>
        </div>
      </Modal>

      {/* APPROVE ACTION MODAL */}
      {approveItem && (
        <Modal
          isOpen={!!approveItem}
          onClose={() => setApproveItem(null)}
          title="Approve Deliverable Work"
          footer={
            <>
              <button className="btn btn-secondary" onClick={() => setApproveItem(null)}>Cancel</button>
              <button className="btn btn-success" onClick={confirmApproveAction} disabled={actingId !== null}>
                {actingId ? 'Approving...' : 'Confirm Approve'}
              </button>
            </>
          }
        >
          <div style={{ fontSize: '14px', lineHeight: 1.5 }}>
            Are you sure you want to approve this work for <strong>{approveItem.client_name}</strong>?<br/>
            Once approved, it will be finalized and routed to the social media posting dashboard.
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ManagerClientRework;
