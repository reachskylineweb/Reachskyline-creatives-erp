import React, { useState, useEffect, useCallback } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import { 
  BarChart3, Calendar, Briefcase, User, RefreshCw, 
  CheckCircle2, Clock, Search, ChevronLeft, ChevronRight,
  ChevronDown, ChevronUp
} from 'lucide-react';
import './DesignerWorkload.css';

const DesignerWorkload = () => {
  const { user } = useAuth();
  
  // Prevent employees and managers from accessing the workload page
  if (user?.role === 'employee' || user?.role === 'manager') {
    return <Navigate to={user?.role === 'employee' ? "/employee/dashboard" : "/manager/dashboard"} replace />;
  }

  const managerProfile = user?.managerProfile || {};

  const [activeTab, setActiveTab] = useState('today'); // 'today' | 'monthly'
  const [employees, setEmployees] = useState([]);
  const [deliverables, setDeliverables] = useState([]);
  const [jobWorks, setJobWorks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedRows, setExpandedRows] = useState({});
  const [detailFilters, setDetailFilters] = useState({});
  const [detailPages, setDetailPages] = useState({});

  // Date filters
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  });

  const [selectedMonth, setSelectedMonth] = useState(() => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
  });

  const [searchTerm, setSearchTerm] = useState('');

  // Fetch employees
  const fetchEmployees = useCallback(async () => {
    if (!managerProfile.department_id) return;
    try {
      const res = await api.get(`/users/employees/dropdown`, {
        params: { departmentId: managerProfile.department_id }
      });
      if (res.data.success) {
        // Keep designers, video editors, creative designers, content writers
        // sub-department IDs: 1 (Video Editor), 2 (Graphic Design), 3 (Content Writer), 4 (Creatives Designer)
        const allEmployees = res.data.data.employees || [];
        setEmployees(allEmployees.filter(emp => [1, 2, 3, 4].includes(Number(emp.sub_department_id))));
      }
    } catch (err) {
      console.error('Error fetching employees:', err);
    }
  }, [managerProfile.department_id]);

  const getStatusColors = (status) => {
    const s = (status || '').toLowerCase().replace(' ', '_');
    switch (s) {
      case 'pending':
        return { bg: '#f1f5f9', text: '#475569', border: '#cbd5e1' };
      case 'assigned':
      case 'assigned_employee':
        return { bg: '#eff6ff', text: '#2563eb', border: '#bfdbfe' };
      case 'submitted':
        return { bg: '#fef3c7', text: '#d97706', border: '#fde68a' };
      case 'reassigned':
      case 'rework':
        return { bg: '#fff1f2', text: '#e11d48', border: '#fecdd3' };
      case 'approved':
      case 'completed':
        return { bg: '#ecfdf5', text: '#059669', border: '#a7f3d0' };
      case 'sent_to_client':
        return { bg: '#f5f3ff', text: '#7c3aed', border: '#ddd6fe' };
      case 'client_approved':
        return { bg: '#f0fdf4', text: '#16a34a', border: '#bbf7d0' };
      case 'client_rejected':
      case 'client_rework':
        return { bg: '#fff1f2', text: '#e11d48', border: '#fecdd3' };
      default:
        return { bg: '#f8fafc', text: '#64748b', border: '#e2e8f0' };
    }
  };

  // Fetch data depending on active tab
  const fetchData = useCallback(async () => {
    if (!managerProfile.department_id) return;
    setLoading(true);
    try {
      if (activeTab === 'today') {
        const params = {
          dateFilter: selectedDate,
          departmentFilter: managerProfile.department_id,
          limit: 200,
          page: 1
        };

        const [delivsRes, jobsRes] = await Promise.all([
          api.get('/deliverables', { params }),
          api.get('/deliverables/job-work/manager')
        ]);

        if (delivsRes.data.success) {
          // Filter to only content calendar items for today
          setDeliverables(delivsRes.data.data.deliverables.filter(item => item.is_job_work === 0 && item.activity_code) || []);
        }
        if (jobsRes.data.success) {
          // Filter job works due today
          const activeJobs = jobsRes.data.data || [];
          const todayJobs = activeJobs.filter(jw => {
            if (!jw.deadline) return false;
            const dateStr = jw.deadline.split(/[T ]/)[0];
            return dateStr === selectedDate;
          });
          setJobWorks(todayJobs);
        }
      } else {
        // Monthly view - load items for the selected month to check their completion count
        const params = {
          monthFilter: selectedMonth,
          departmentFilter: managerProfile.department_id,
          limit: 300,
          page: 1
        };

        const [delivsRes, jobsRes] = await Promise.all([
          api.get('/deliverables', { params }),
          api.get('/deliverables/job-work/manager')
        ]);

        if (delivsRes.data.success) {
          setDeliverables(delivsRes.data.data.deliverables.filter(item => item.is_job_work === 0 && item.activity_code) || []);
        }
        if (jobsRes.data.success) {
          const activeJobs = jobsRes.data.data || [];
          const monthJobs = activeJobs.filter(jw => {
            if (!jw.deadline) return false;
            return jw.deadline.startsWith(selectedMonth);
          });
          setJobWorks(monthJobs);
        }
      }
    } catch (err) {
      console.error('Error fetching workload data:', err);
    } finally {
      setLoading(false);
    }
  }, [managerProfile.department_id, activeTab, selectedDate, selectedMonth]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Navigate dates
  const handlePrevDate = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() - 1);
    setSelectedDate(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`);
  };

  const handleNextDate = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + 1);
    setSelectedDate(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`);
  };

  const handlePrevMonth = () => {
    const [year, month] = selectedMonth.split('-').map(Number);
    const d = new Date(year, month - 2, 1);
    setSelectedMonth(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
  };

  const handleNextMonth = () => {
    const [year, month] = selectedMonth.split('-').map(Number);
    const d = new Date(year, month, 1);
    setSelectedMonth(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
  };

  const getSubDeptName = (id) => {
    switch (Number(id)) {
      case 1: return 'Graphic Designer';
      case 2: return 'Video Editor';
      case 3: return 'Content Writer';
      case 4: return 'Creative Designer';
      default: return 'Designer';
    }
  };

  const getInitials = (name) => {
    if (!name) return '??';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const getSubDeptGradient = (subDeptId) => {
    const colors = [
      'linear-gradient(135deg, #06b6d4, #0891b2)', // Graphic Designer
      'linear-gradient(135deg, #6366f1, #4f46e5)', // Video Editor
      'linear-gradient(135deg, #f59e0b, #d97706)', // Content Writer
      'linear-gradient(135deg, #ec4899, #be185d)'  // Creative Designer
    ];
    const id = Number(subDeptId);
    return (id >= 1 && id <= 4) ? colors[id - 1] : colors[id % colors.length];
  };

  // Compute workload metrics for each employee
  const workloadData = employees.map(emp => {
    const empId = Number(emp.id);

    // Deliverables filter
    const empDeliverables = deliverables.filter(d => Number(d.assigned_employee_id) === empId);
    // Job Works filter
    const empJobWorks = jobWorks.filter(jw => Number(jw.assigned_employee_id) === empId);

    let filteredDelivs = [];
    let filteredJobs = [];

    if (activeTab === 'today') {
      // For deliverables: they are already date-filtered by the API for selectedDate.
      filteredDelivs = empDeliverables;
      
      // For job works: show all active (not completed) job works, plus any job works completed TODAY.
      filteredJobs = empJobWorks.filter(jw => {
        if (jw.status === 'completed') {
          const compDate = jw.updated_at ? jw.updated_at.split(/[T ]/)[0] : (jw.deadline ? jw.deadline.split(/[T ]/)[0] : '');
          return compDate === selectedDate;
        }
        return true;
      });
    } else {
      // For deliverables: they are already month-filtered by the API for selectedMonth.
      filteredDelivs = empDeliverables;
      
      // For job works: show job works whose deadline or completion date falls within the selected month.
      filteredJobs = empJobWorks.filter(jw => {
        const dateStr = jw.deadline || jw.updated_at || '';
        return dateStr.startsWith(selectedMonth);
      });
    }

    const doneDelivs = filteredDelivs.filter(d => ['completed', 'approved', 'client_approved', 'posted'].includes(d.status));
    const doneJobs = filteredJobs.filter(jw => jw.status === 'completed');

    const totalCount = filteredDelivs.length + filteredJobs.length;
    const doneCount = doneDelivs.length + doneJobs.length;
    const notDoneCount = totalCount - doneCount;

    return {
      ...emp,
      doneCount,
      notDoneCount,
      deliverablesCount: filteredDelivs.length,
      jobWorksCount: filteredJobs.length,
      totalCount,
      details: [
        ...filteredDelivs.map(d => ({ type: 'Deliverable', name: d.deliverable, client: d.client_name, status: d.status })),
        ...filteredJobs.map(j => ({ type: 'Job Work', name: j.activity_name || j.activity_type_code, client: j.client_name, status: j.status }))
      ]
    };
  });

  const filteredWorkload = workloadData.filter(emp => 
    emp.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="workload-container">
      {/* Title */}
      <div className="workload-header">
        <div>
          <h1 className="workload-title">
            <BarChart3 size={26} style={{ color: 'var(--primary)' }} />
            Employees Workload
          </h1>
          <p className="workload-subtitle">
            Monitor workloads and tasks completed by team employees.
          </p>
        </div>

        <button onClick={fetchData} className="btn-refresh">
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* Tabs */}
      <div className="workload-tabs-wrapper">
        <div className="workload-tabs">
          <button 
            className={`workload-tab ${activeTab === 'today' ? 'active' : ''}`}
            onClick={() => { setActiveTab('today'); setSearchTerm(''); }}
          >
            <Clock size={16} />
            Today's Active Load
          </button>
          <button 
            className={`workload-tab ${activeTab === 'monthly' ? 'active' : ''}`}
            onClick={() => { setActiveTab('monthly'); setSearchTerm(''); }}
          >
            <CheckCircle2 size={16} />
            Monthly Completed Output
          </button>
        </div>

        {/* Filters */}
        <div className="workload-filters">
          <div className="search-input-wrapper">
            <Search size={14} className="search-icon" />
            <input 
              type="text" 
              placeholder="Search Employee..." 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
              className="search-input"
            />
          </div>

          {activeTab === 'today' ? (
            <div className="date-navigation">
              <button onClick={handlePrevDate} className="nav-btn"><ChevronLeft size={16} /></button>
              <input 
                type="date" 
                value={selectedDate} 
                onChange={(e) => setSelectedDate(e.target.value)}
                className="date-picker-input"
              />
              <button onClick={handleNextDate} className="nav-btn"><ChevronRight size={16} /></button>
            </div>
          ) : (
            <div className="date-navigation">
              <button onClick={handlePrevMonth} className="nav-btn"><ChevronLeft size={16} /></button>
              <input 
                type="month" 
                value={selectedMonth} 
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="date-picker-input"
              />
              <button onClick={handleNextMonth} className="nav-btn"><ChevronRight size={16} /></button>
            </div>
          )}
        </div>
      </div>

      {/* Summary stats & expand actions */}
      {!loading && filteredWorkload.length > 0 && (
        <div className="workload-summary-bar">
          <div className="summary-stat">
            <span className="stat-label">Team Strength</span>
            <strong className="stat-value">{filteredWorkload.length} Employees</strong>
          </div>
          <div className="summary-stat">
            <span className="stat-label">Total Deliverables</span>
            <strong className="stat-value">
              {filteredWorkload.reduce((sum, emp) => sum + emp.deliverablesCount, 0)}
            </strong>
          </div>
          <div className="summary-stat">
            <span className="stat-label">Total Job Works</span>
            <strong className="stat-value">
              {filteredWorkload.reduce((sum, emp) => sum + emp.jobWorksCount, 0)}
            </strong>
          </div>
          <div className="summary-stat">
            <span className="stat-label">Overall Workload</span>
            <strong className="stat-value-highlight">
              {filteredWorkload.reduce((sum, emp) => sum + emp.totalCount, 0)}
            </strong>
          </div>
          <div className="summary-stat-actions">
            <button 
              onClick={() => {
                const expanded = {};
                filteredWorkload.forEach(e => { expanded[e.id] = true; });
                setExpandedRows(expanded);
              }} 
              className="bulk-btn"
            >
              Expand All
            </button>
            <button 
              onClick={() => setExpandedRows({})} 
              className="bulk-btn"
            >
              Collapse All
            </button>
          </div>
        </div>
      )}

      {/* Grid workload content */}
      {loading ? (
        <div className="workload-loading">
          <div className="loading-spinner"></div>
          <span>Loading workload details...</span>
        </div>
      ) : filteredWorkload.length === 0 ? (
        <div className="workload-empty">
          <User size={40} className="empty-icon" />
          <h3>No employee records found</h3>
          <p>No employees found matching the search or role configuration.</p>
        </div>
      ) : (
        <div className="table-card">
          <div className="table-responsive">
            <table className="workload-table">
              <thead>
                <tr>
                  <th width="40"></th>
                  <th>Employee</th>
                  <th>Role</th>
                  <th style={{ textAlign: 'center' }}>Total Assigned</th>
                  <th style={{ textAlign: 'center' }}>Done</th>
                  <th style={{ textAlign: 'center' }}>Not Done</th>
                  <th style={{ textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredWorkload.map(emp => {
                  const isExpanded = !!expandedRows[emp.id];
                  const gradient = getSubDeptGradient(emp.sub_department_id);
                  const initials = getInitials(emp.full_name);
                  const deptName = getSubDeptName(emp.sub_department_id);

                  return (
                    <React.Fragment key={emp.id}>
                      <tr 
                        className={`workload-row ${isExpanded ? 'expanded' : ''}`}
                        onClick={() => setExpandedRows(prev => ({ ...prev, [emp.id]: !isExpanded }))}
                        style={{ cursor: 'pointer' }}
                      >
                        <td>
                          {isExpanded ? (
                            <ChevronUp size={16} className="toggle-icon active" />
                          ) : (
                            <ChevronDown size={16} className="toggle-icon" />
                          )}
                        </td>
                        <td>
                          <div className="employee-info-cell">
                            <div style={{ background: gradient }} className="avatar-small">
                              {initials}
                            </div>
                            <span className="emp-name-text">{emp.full_name}</span>
                          </div>
                        </td>
                        <td>
                          <span className="role-text">{deptName}</span>
                        </td>
                        <td align="center">
                          <span className={`count-badge total ${emp.totalCount > 0 ? 'active' : ''}`}>
                            {emp.totalCount}
                          </span>
                        </td>
                        <td align="center">
                          <span className="count-badge done">{emp.doneCount}</span>
                        </td>
                        <td align="center">
                          <span className="count-badge not-done">{emp.notDoneCount}</span>
                        </td>
                        <td align="right">
                          <button 
                            className={`view-details-btn ${isExpanded ? 'active' : ''}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              setExpandedRows(prev => ({ ...prev, [emp.id]: !isExpanded }));
                            }}
                          >
                            {isExpanded ? 'Hide Tasks' : 'View Tasks'}
                          </button>
                        </td>
                      </tr>

                      {isExpanded && (
                        <tr className="detail-subrow">
                          <td colSpan="7">
                            <div className="detail-expand-wrapper">
                              <h4 className="detail-section-title">
                                Task Allocations for {emp.full_name} ({activeTab === 'today' ? 'Active' : 'Completed'} Tasks)
                              </h4>
                              {(() => {
                                const currentFilter = detailFilters[emp.id] || 'all';
                                const currentPage = detailPages[emp.id] || 1;

                                const filteredDetails = emp.details.filter(t => {
                                  const isDone = ['completed', 'approved', 'client_approved', 'posted'].includes(t.status);
                                  if (currentFilter === 'done') return isDone;
                                  if (currentFilter === 'not_done') return !isDone;
                                  return true;
                                });

                                const itemsPerPage = 5;
                                const totalPages = Math.ceil(filteredDetails.length / itemsPerPage) || 1;
                                const activePage = Math.min(currentPage, totalPages);
                                const startIndex = (activePage - 1) * itemsPerPage;
                                const paginatedDetails = filteredDetails.slice(startIndex, startIndex + itemsPerPage);

                                const doneCount = emp.details.filter(t => ['completed', 'approved', 'client_approved', 'posted'].includes(t.status)).length;
                                const notDoneCount = emp.details.length - doneCount;

                                return (
                                  <>
                                    {/* Filtration Bar inside expanded section */}
                                    <div className="detail-filter-bar">
                                      <button 
                                        className={`detail-filter-btn ${currentFilter === 'all' ? 'active' : ''}`}
                                        onClick={() => {
                                          setDetailFilters(prev => ({ ...prev, [emp.id]: 'all' }));
                                          setDetailPages(prev => ({ ...prev, [emp.id]: 1 }));
                                        }}
                                      >
                                        All Tasks ({emp.details.length})
                                      </button>
                                      <button 
                                        className={`detail-filter-btn ${currentFilter === 'done' ? 'active' : ''}`}
                                        onClick={() => {
                                          setDetailFilters(prev => ({ ...prev, [emp.id]: 'done' }));
                                          setDetailPages(prev => ({ ...prev, [emp.id]: 1 }));
                                        }}
                                      >
                                        Done ({doneCount})
                                      </button>
                                      <button 
                                        className={`detail-filter-btn ${currentFilter === 'not_done' ? 'active' : ''}`}
                                        onClick={() => {
                                          setDetailFilters(prev => ({ ...prev, [emp.id]: 'not_done' }));
                                          setDetailPages(prev => ({ ...prev, [emp.id]: 1 }));
                                        }}
                                      >
                                        Not Done ({notDoneCount})
                                      </button>
                                    </div>

                                    {/* Tasks List */}
                                    {filteredDetails.length === 0 ? (
                                      <div className="detail-empty-state">
                                        No tasks match the filter mode.
                                      </div>
                                    ) : (
                                      <>
                                        <div className="detail-tasks-list">
                                          {paginatedDetails.map((task, idx) => (
                                            <div key={idx} className="detail-task-item">
                                              <div className="task-type-badge-col">
                                                <span className={`task-type-badge ${task.type.toLowerCase().replace(' ', '')}`}>
                                                  {task.type}
                                                </span>
                                              </div>
                                              <div className="task-client-col">
                                                <span className="task-client-lbl">Client:</span>
                                                <strong>{task.client}</strong>
                                              </div>
                                              <div className="task-name-col" title={task.name}>
                                                {task.name}
                                              </div>
                                              <div className="task-status-col">
                                                {(() => {
                                                  const colors = getStatusColors(task.status);
                                                  return (
                                                    <span 
                                                      style={{
                                                        backgroundColor: colors.bg,
                                                        color: colors.text,
                                                        border: `1px solid ${colors.border}`,
                                                        padding: '4px 10px',
                                                        borderRadius: '12px',
                                                        fontSize: '11px',
                                                        fontWeight: 700,
                                                        textTransform: 'uppercase',
                                                        display: 'inline-block'
                                                      }}
                                                    >
                                                      {(task.status || '').replace('_', ' ')}
                                                    </span>
                                                  );
                                                })()}
                                              </div>
                                            </div>
                                          ))}
                                        </div>

                                        {/* Pagination Bar */}
                                        {totalPages > 1 && (
                                          <div className="detail-pagination-bar">
                                            <button 
                                              disabled={activePage === 1}
                                              onClick={() => setDetailPages(prev => ({ ...prev, [emp.id]: activePage - 1 }))}
                                              className="page-nav-btn"
                                            >
                                              <ChevronLeft size={14} style={{ marginRight: '4px' }} /> Prev
                                            </button>
                                            <span className="page-info-text">
                                              Page {activePage} of {totalPages}
                                            </span>
                                            <button 
                                              disabled={activePage === totalPages}
                                              onClick={() => setDetailPages(prev => ({ ...prev, [emp.id]: activePage + 1 }))}
                                              className="page-nav-btn"
                                            >
                                              Next <ChevronRight size={14} style={{ marginLeft: '4px' }} />
                                            </button>
                                          </div>
                                        )}
                                      </>
                                    )}
                                  </>
                                );
                              })()}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default DesignerWorkload;
