import React, { useState, useEffect, useCallback } from 'react';
import { 
  BarChart3, 
  Search, 
  RefreshCw, 
  AlertCircle, 
  Award, 
  CheckCircle2, 
  ListTodo, 
  ChevronDown, 
  ChevronUp, 
  Calendar, 
  ChevronLeft, 
  ChevronRight,
  TrendingUp,
  HelpCircle
} from 'lucide-react';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import Modal from '../../components/Modal';
import './ManagerEfficiency.css';

const ManagerEfficiency = ({ isTab }) => {
  const { user } = useAuth();
  const managerProfile = user?.managerProfile || {};

  const [activeTab, setActiveTab] = useState('today'); // 'today' | 'monthly'
  const [employees, setEmployees] = useState([]);
  const [efficiencyData, setEfficiencyData] = useState([]);
  const [deliverables, setDeliverables] = useState([]);
  const [jobWorks, setJobWorks] = useState([]);
  const [subDepartments, setSubDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [subDeptFilter, setSubDeptFilter] = useState('');
  const [expandedRows, setExpandedRows] = useState({});
  const [detailFilters, setDetailFilters] = useState({});
  const [detailPages, setDetailPages] = useState({});
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [isCalculationModalOpen, setIsCalculationModalOpen] = useState(false);
  const [selectedEmployeeForCalculation, setSelectedEmployeeForCalculation] = useState(null);

  // Date filters
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  });

  const [selectedMonth, setSelectedMonth] = useState(() => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        limit: 10000,
        page: 1
      };

      if (activeTab === 'today') {
        params.dateFilter = selectedDate;
      } else {
        params.monthFilter = selectedMonth;
      }

      // Department filter is standard for Creative Manager
      const deptId = managerProfile.department_id || 1;
      params.departmentFilter = deptId;

      const effParams = {
        filterType: activeTab === 'today' ? 'daily' : 'monthly',
        date: selectedDate,
        month: selectedMonth,
        departmentFilter: deptId
      };

      const [empRes, delivsRes, jobsRes, subDeptRes, effRes] = await Promise.all([
        api.get('/users/employees', { params: { departmentFilter: deptId, limit: 500 } }),
        api.get('/deliverables', { params }),
        api.get('/deliverables/job-work/manager'),
        api.get(`/departments/${deptId}/sub-departments`),
        api.get('/users/efficiency', { params: effParams })
      ]);

      if (empRes.data.success) {
        setEmployees(empRes.data.data.employees || []);
      }
      if (delivsRes.data.success) {
        setDeliverables(delivsRes.data.data.deliverables || []);
      }
      if (jobsRes.data.success) {
        setJobWorks(jobsRes.data.data || []);
      }
      if (subDeptRes.data.success) {
        setSubDepartments(subDeptRes.data.data.subDepartments || []);
      }
      if (effRes.data.success) {
        setEfficiencyData(effRes.data.data || []);
      }
    } catch (err) {
      console.error('Error fetching efficiency data:', err.message);
    } finally {
      setLoading(false);
    }
  }, [activeTab, selectedDate, selectedMonth, managerProfile.department_id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Date handlers
  const handlePrevDate = () => {
    if (activeTab === 'today') {
      const current = new Date(selectedDate);
      current.setDate(current.getDate() - 1);
      setSelectedDate(current.toISOString().split('T')[0]);
    } else {
      const [year, month] = selectedMonth.split('-').map(Number);
      const prev = new Date(year, month - 2, 1);
      setSelectedMonth(`${prev.getFullYear()}-${String(prev.getMonth() + 1).padStart(2, '0')}`);
    }
  };

  const handleNextDate = () => {
    if (activeTab === 'today') {
      const current = new Date(selectedDate);
      current.setDate(current.getDate() + 1);
      setSelectedDate(current.toISOString().split('T')[0]);
    } else {
      const [year, month] = selectedMonth.split('-').map(Number);
      const next = new Date(year, month, 1);
      setSelectedMonth(`${next.getFullYear()}-${String(next.getMonth() + 1).padStart(2, '0')}`);
    }
  };

  const getSubDeptName = (id, departmentName) => {
    const subDept = subDepartments.find(sd => Number(sd.id) === Number(id));
    if (subDept) return subDept.name;
    const isSmm = departmentName && (
      departmentName.toLowerCase().includes('social') || 
      departmentName.toLowerCase().includes('marketing') || 
      departmentName.toLowerCase().includes('smm')
    );
    return isSmm ? '-' : 'Creative Specialist';
  };

  const getSubDeptGradient = (subDeptId) => {
    const id = Number(subDeptId);
    const colors = [
      'linear-gradient(135deg, #da1b60, #ff4081)', // SMM / Social
      'linear-gradient(135deg, #1565c0, #1e88e5)', // Graphic Designer
      'linear-gradient(135deg, #2e7d32, #43a047)', // Content Writer
      'linear-gradient(135deg, #ef6c00, #fb8c00)'  // Video Editor
    ];
    return (id >= 1 && id <= 4) ? colors[id - 1] : colors[id % colors.length];
  };

  const getInitials = (name) => {
    if (!name) return 'E';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  // Compute time-based efficiency report for each employee
  const workloadData = efficiencyData.map(emp => {
    const empId = Number(emp.id);

    const isWriter = emp.sub_department_code === 'CW-RS' || Number(emp.sub_department_id) === 1 || (emp.sub_department_name || '').toLowerCase().includes('content');
    
    // Filter to active assigned tasks only (exclude pending unassigned template items)
    const activeAssignedStatuses = [
      'assigned',
      'assigned_employee',
      'in_progress',
      'submitted',
      'script_submitted',
      'manager_review_script',
      'manager_review_design',
      'pending_review',
      'in_review',
      'waiting_for_approval',
      'pending_approval',
      'sent_to_approval',
      'reassigned',
      'rework',
      'approved',
      'client_approved',
      'completed',
      'posted',
      'sent_to_client'
    ];

    const empDeliverables = deliverables.filter(d => {
      const status = (d.status || '').toLowerCase();
      if (!activeAssignedStatuses.includes(status)) return false;
      return (
        Number(d.assigned_employee_id) === empId || 
        Number(d.content_writer_id) === empId ||
        Number(d.smm_employee_id) === empId
      );
    });
    
    const empJobWorks = jobWorks.filter(jw => {
      const status = (jw.status || '').toLowerCase();
      if (!activeAssignedStatuses.includes(status)) return false;
      return (
        Number(jw.assigned_employee_id) === empId || 
        Number(jw.content_writer_id) === empId ||
        Number(jw.smm_employee_id) === empId
      );
    });

    let filteredDelivs = [];
    let filteredJobs = [];

    const matchesMonth = (itemMonth, targetMonth) => {
      if (!itemMonth) return false;
      const str = String(itemMonth).trim();
      if (str === targetMonth || str.substring(0, 7) === targetMonth) return true;
      
      const parts = targetMonth.split('-');
      if (parts.length < 2) return false;
      const targetYear = parts[0];
      const targetMm = parts[1];
      
      const dateObj = new Date(Number(targetYear), Number(targetMm) - 1, 1);
      if (isNaN(dateObj.getTime())) return false;
      
      const shortMonth = dateObj.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      const longMonth = dateObj.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      
      const strLower = str.toLowerCase();
      return strLower === shortMonth.toLowerCase() || strLower === longMonth.toLowerCase();
    };

    const getTaskDueDateStr = (t) => {
      let raw = t.due_date || t.deadline || t.date || '';
      if (!raw || String(raw).startsWith('0000') || String(raw).startsWith('1970')) return '';
      return String(raw).split(/[T ]/)[0];
    };

    if (activeTab === 'today') {
      filteredDelivs = empDeliverables.filter(d => {
        const dueStr = getTaskDueDateStr(d);
        return dueStr === selectedDate;
      });
      filteredJobs = empJobWorks.filter(jw => {
        const dueStr = getTaskDueDateStr(jw);
        return dueStr === selectedDate || (!dueStr && (jw.created_at || '').split(/[T ]/)[0] === selectedDate);
      });
    } else {
      filteredDelivs = empDeliverables.filter(d => {
        const dueMonth = getTaskDueDateStr(d).substring(0, 7);
        return matchesMonth(d.month, selectedMonth) || (dueMonth && dueMonth === selectedMonth);
      });
      filteredJobs = empJobWorks.filter(jw => {
        const dueMonth = getTaskDueDateStr(jw).substring(0, 7);
        return matchesMonth(jw.month, selectedMonth) || (dueMonth && dueMonth === selectedMonth);
      });
    }

    const allPeriodTasks = [...filteredDelivs, ...filteredJobs];

    const taskDetails = allPeriodTasks.map(task => {
      const isJobWork = task.is_job_work === undefined;
      const rawDue = isJobWork ? task.deadline : task.due_date;
      const dueStr = rawDue ? String(rawDue).split(/[T ]/)[0] : '';

      const isCompleted = ['submitted', 'completed', 'approved', 'client_approved', 'posted', 'sent_to_client'].includes((task.status || '').toLowerCase());
      const completionDate = task.updated_at ? String(task.updated_at).split(/[T ]/)[0] : '';

      let timingStatus = 'On Time';
      if (isCompleted) {
        if (completionDate && dueStr && completionDate > dueStr) {
          timingStatus = 'Completed Late';
        } else {
          timingStatus = 'On Time';
        }
      } else {
        const compareDate = activeTab === 'today' ? selectedDate : `${selectedMonth}-31`;
        if (dueStr && dueStr < compareDate) {
          timingStatus = 'Overdue';
        } else {
          timingStatus = 'Pending';
        }
      }

      return {
        name: isJobWork ? (task.activity_name || task.activity_type_code) : task.deliverable,
        type: isJobWork ? 'Job Work' : 'Deliverable',
        dueDate: dueStr,
        completedDate: isCompleted ? (completionDate || dueStr) : '',
        status: task.status,
        timingStatus
      };
    });

    const computedTotal = taskDetails.length;
    const computedCompleted = taskDetails.filter(t => 
      ['On Time', 'Completed Late'].includes(t.timingStatus) || 
      ['submitted', 'completed', 'approved', 'client_approved', 'posted', 'sent_to_client'].includes((t.status || '').toLowerCase())
    ).length;
    
    const computedEfficiency = computedTotal > 0 ? Math.round((computedCompleted / computedTotal) * 100) : 0;

    return {
      ...emp,
      total_tasks: computedTotal,
      completed_tasks: computedCompleted,
      efficiency: computedEfficiency,
      details: taskDetails
    };
  });

  const filteredData = workloadData.filter(emp => {
    const matchesSearch = emp.full_name?.toLowerCase().includes(search.toLowerCase());
    const matchesSubDept = !subDeptFilter || Number(emp.sub_department_id) === Number(subDeptFilter);
    return matchesSearch && matchesSubDept;
  });

  // Calculate Average Team Metrics
  const totalTasksCount = filteredData.reduce((acc, curr) => acc + curr.total_tasks, 0);
  const totalCompletedCount = filteredData.reduce((acc, curr) => acc + curr.completed_tasks, 0);
  const averageEfficiency = filteredData.length > 0 
    ? Math.round(filteredData.reduce((acc, curr) => acc + curr.efficiency, 0) / filteredData.length)
    : 100;

  return (
    <div className={isTab ? "" : "efficiency-container"} style={isTab ? { maxWidth: '1400px', margin: '0 auto' } : {}}>
      {/* Header */}
      {!isTab && (
        <div className="efficiency-header">
          <div>
            <h1 className="efficiency-title">
              <BarChart3 size={26} style={{ color: 'var(--primary)' }} />
              Team Efficiency Report
            </h1>
            <p className="efficiency-subtitle">
              Compare creative employee performance metrics based on tasks due dates and delivery completion timestamps.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <button 
              type="button"
              onClick={() => setIsInfoModalOpen(true)}
              style={{
                padding: '8px 16px',
                backgroundColor: 'var(--bg-light, #f1f5f9)',
                border: '1px solid var(--border-color, #e2e8f0)',
                borderRadius: 'var(--radius-sm, 6px)',
                fontWeight: 700,
                fontSize: '13px',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                height: '38px',
                color: 'var(--text-color, #0f172a)'
              }}
            >
              <HelpCircle size={15} /> How is it calculated?
            </button>
            <button className="btn-refresh" onClick={fetchData} disabled={loading} style={{ height: '38px' }}>
              <RefreshCw size={14} className={loading ? 'spin' : ''} /> Refresh
            </button>
          </div>
        </div>
      )}

      {/* Date Navigation / Tabs Bar */}
      <div className="efficiency-tabs-wrapper">
        <div className="efficiency-tabs">
          <button 
            onClick={() => { setActiveTab('today'); setExpandedRows({}); }} 
            className={`efficiency-tab ${activeTab === 'today' ? 'active' : ''}`}
          >
            Daily Reports
          </button>
          <button 
            onClick={() => { setActiveTab('monthly'); setExpandedRows({}); }} 
            className={`efficiency-tab ${activeTab === 'monthly' ? 'active' : ''}`}
          >
            Monthly Reports
          </button>
        </div>

        <div className="efficiency-filters">
          <div className="search-input-wrapper">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              placeholder="Search employee..."
              className="search-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            className="role-select"
            value={subDeptFilter}
            onChange={(e) => setSubDeptFilter(e.target.value)}
          >
            <option value="">All Roles</option>
            {subDepartments.map(sd => (
              <option key={sd.id} value={sd.id}>{sd.name}</option>
            ))}
          </select>

          {/* Date Picker Navigation */}
          <div className="date-navigation">
            <button onClick={handlePrevDate} className="nav-btn">
              <ChevronLeft size={16} />
            </button>

            {activeTab === 'today' ? (
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => { if (e.target.value) setSelectedDate(e.target.value); }}
                className="date-picker-input"
              />
            ) : (
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => { if (e.target.value) setSelectedMonth(e.target.value); }}
                className="date-picker-input"
                style={{ width: '110px' }}
              />
            )}

            <button onClick={handleNextDate} className="nav-btn">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="loading-box">
          <div className="spinner"></div>
          <span>Computing time-based efficiency report...</span>
        </div>
      ) : filteredData.length === 0 ? (
        <div className="empty-state">
          <AlertCircle size={40} style={{ margin: '0 auto 12px auto', opacity: 0.5 }} />
          <h3>No Employee Records</h3>
          <p>No active employees found matching the filters or roles.</p>
        </div>
      ) : (
        <>

          {/* Efficiency Table layout */}
          <div className="table-card">
            <div className="table-responsive">
              <table className="efficiency-table">
                <thead>
                  <tr>
                    <th width="40"></th>
                    <th>Employee ID</th>
                    <th>Employee Name</th>
                    <th>Department</th>
                    <th>Sub-Department / Role</th>
                    <th style={{ textAlign: 'center' }}>Assigned Tasks</th>
                    <th style={{ textAlign: 'center' }}>Completed Tasks</th>
                    <th>Efficiency Score</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map(emp => {
                    const isExpanded = !!expandedRows[emp.id];
                    const gradient = getSubDeptGradient(emp.sub_department_id);
                    const initials = getInitials(emp.full_name);
                    const deptName = getSubDeptName(emp.sub_department_id, emp.department_name);

                    // Colors based on score range
                    let progressColor = 'var(--success)';
                    if (emp.efficiency < 50) progressColor = 'var(--danger)';
                    else if (emp.efficiency < 80) progressColor = 'var(--warning)';

                    return (
                      <React.Fragment key={emp.id}>
                        <tr
                          className={`efficiency-row ${isExpanded ? 'expanded' : ''}`}
                          onClick={() => setExpandedRows(prev => ({ ...prev, [emp.id]: !isExpanded }))}
                          style={{ cursor: 'pointer' }}
                        >
                          <td>
                            <div 
                              onClick={(e) => {
                                e.stopPropagation();
                                setExpandedRows(prev => ({ ...prev, [emp.id]: !isExpanded }));
                              }}
                              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', cursor: 'pointer' }}
                            >
                              {isExpanded ? (
                                <ChevronUp size={16} className="toggle-icon active" />
                              ) : (
                                <ChevronDown size={16} className="toggle-icon" />
                              )}
                            </div>
                          </td>
                          <td>
                            <span style={{ fontWeight: 700 }} className="text-muted">{emp.employee_id_code || 'N/A'}</span>
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
                            <span className="role-text">{emp.department_name || 'Creatives'}</span>
                          </td>
                          <td>
                            <span className="role-text">{deptName}</span>
                          </td>
                          <td align="center">
                            <span style={{ fontWeight: 700 }} className="text-muted">{emp.total_tasks}</span>
                          </td>
                          <td align="center">
                            <span style={{ fontWeight: 700, color: 'var(--success)' }}>{emp.completed_tasks}</span>
                          </td>
                          <td>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }} onClick={(e) => e.stopPropagation()}>
                              <div className="efficiency-progress-wrapper">
                                <div className="efficiency-progress-container">
                                  <div 
                                    className="efficiency-progress-fill"
                                    style={{ width: `${emp.efficiency}%`, backgroundColor: progressColor }}
                                  ></div>
                                </div>
                                <span className="efficiency-score-text">{emp.efficiency}%</span>
                              </div>
                              <button
                                className="view-details-btn"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedEmployeeForCalculation(emp);
                                  setIsCalculationModalOpen(true);
                                }}
                                style={{
                                  alignSelf: 'flex-start',
                                  padding: '2px 8px',
                                  fontSize: '11px',
                                  backgroundColor: 'var(--primary-light)',
                                  color: 'var(--primary)',
                                  border: '1px solid var(--primary-light)',
                                  fontWeight: 700
                                }}
                              >
                                View Calculation
                              </button>
                            </div>
                          </td>
                        </tr>

                        {isExpanded && (
                          <tr className="detail-subrow">
                            <td colSpan="10">
                              <div className="detail-expand-wrapper">
                                <h4 className="detail-section-title">
                                  Task Performance Ledger for {emp.full_name}
                                </h4>

                                {(() => {
                                  const currentFilter = detailFilters[emp.id] || 'all';
                                  const currentPage = detailPages[emp.id] || 1;

                                  const filteredDetails = emp.details.filter(t => {
                                    if (currentFilter === 'ontime') return t.timingStatus === 'On Time';
                                    if (currentFilter === 'late') return t.timingStatus === 'Completed Late';
                                    if (currentFilter === 'overdue') return t.timingStatus === 'Overdue';
                                    return true; // 'all'
                                  });

                                  const itemsPerPage = 5;
                                  const totalPages = Math.ceil(filteredDetails.length / itemsPerPage) || 1;
                                  const activePage = Math.min(currentPage, totalPages);
                                  const startIndex = (activePage - 1) * itemsPerPage;
                                  const paginatedDetails = filteredDetails.slice(startIndex, startIndex + itemsPerPage);

                                  const onTimeCount = emp.details.filter(t => t.timingStatus === 'On Time').length;
                                  const lateCount = emp.details.filter(t => t.timingStatus === 'Completed Late').length;
                                  const overdueCount = emp.details.filter(t => t.timingStatus === 'Overdue').length;

                                  return (
                                    <>
                                      {/* Filtration bar */}
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
                                          className={`detail-filter-btn ${currentFilter === 'ontime' ? 'active' : ''}`}
                                          onClick={() => {
                                            setDetailFilters(prev => ({ ...prev, [emp.id]: 'ontime' }));
                                            setDetailPages(prev => ({ ...prev, [emp.id]: 1 }));
                                          }}
                                        >
                                          On Time ({onTimeCount})
                                        </button>
                                        <button
                                          className={`detail-filter-btn ${currentFilter === 'late' ? 'active' : ''}`}
                                          onClick={() => {
                                            setDetailFilters(prev => ({ ...prev, [emp.id]: 'late' }));
                                            setDetailPages(prev => ({ ...prev, [emp.id]: 1 }));
                                          }}
                                        >
                                          Completed Late ({lateCount})
                                        </button>
                                        <button
                                          className={`detail-filter-btn ${currentFilter === 'overdue' ? 'active' : ''}`}
                                          onClick={() => {
                                            setDetailFilters(prev => ({ ...prev, [emp.id]: 'overdue' }));
                                            setDetailPages(prev => ({ ...prev, [emp.id]: 1 }));
                                          }}
                                        >
                                          Overdue ({overdueCount})
                                        </button>
                                      </div>

                                      {/* Task list layout */}
                                      {filteredDetails.length === 0 ? (
                                        <div className="detail-empty-state">
                                          No tasks found matching this timing status.
                                        </div>
                                      ) : (
                                        <>
                                          <div className="detail-tasks-list">
                                            {paginatedDetails.map((task, idx) => (
                                              <div key={idx} className="detail-task-item">
                                                <div>
                                                  <span className={`task-type-badge ${task.type.toLowerCase().replace(' ', '')}`}>
                                                    {task.type}
                                                  </span>
                                                </div>

                                                <div className="task-date-info">
                                                  <span className="task-date-lbl">Due Date</span>
                                                  <span className="task-date-val">{task.dueDate}</span>
                                                </div>

                                                <div className="task-name-col" title={task.name}>
                                                  {task.name}
                                                </div>

                                                <div className="task-score-col">
                                                  <TrendingUp size={16} style={{ color: task.score === 100 ? 'var(--success)' : task.score === 60 ? '#d97706' : '#dc2626' }} />
                                                  <span>{task.score}%</span>
                                                </div>

                                                <div className="task-timing-col">
                                                  <span className={`task-timing-badge ${task.timingStatus.toLowerCase().replace(' ', '')}`}>
                                                    {task.timingStatus}
                                                  </span>
                                                </div>
                                              </div>
                                            ))}
                                          </div>

                                          {/* Pagination */}
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
        </>
      )}

      {/* EFFICIENCY INFO MODAL */}
      <Modal
        isOpen={isInfoModalOpen}
        onClose={() => setIsInfoModalOpen(false)}
        title="Efficiency Score Calculation Formula"
        footer={
          <button className="btn btn-primary" onClick={() => setIsInfoModalOpen(false)} style={{ padding: '8px 16px', backgroundColor: 'var(--primary)', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 600, cursor: 'pointer' }}>
            Close
          </button>
        }
      >
        <div style={{ padding: '10px 0', color: 'var(--text-main, #0f172a)', fontSize: '14px', lineHeight: '1.6' }}>
          <p style={{ marginBottom: '16px' }}>
            The <strong>Efficiency Score</strong> measures employee performance out of <strong>100</strong> based directly on the ratio of completed tasks to total assigned tasks.
          </p>

          <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px', marginBottom: '20px' }}>
            <h4 style={{ margin: '0 0 12px 0', fontSize: '15px', color: 'var(--primary)', fontWeight: 700 }}>
              Efficiency Calculation Formula
            </h4>
            <div style={{ fontFamily: 'monospace', fontSize: '15px', background: '#fff', padding: '10px 14px', borderRadius: '4px', border: '1px solid #cbd5e1', textAlign: 'center', fontWeight: 700, color: 'var(--primary)' }}>
              Efficiency Score = (Completed Tasks / Total Assigned Tasks) × 100
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-muted, #64748b)', margin: '10px 0 0 0' }}>
              * If an employee has 0 assigned tasks, the efficiency score is 0%.
            </p>
          </div>

          <div style={{ marginBottom: '10px' }}>
            <h5 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--primary)', display: 'inline-block' }}></span>
              Example Calculations
            </h5>
            <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '13px' }}>
              <li style={{ marginBottom: '6px' }}>
                Completing 4 out of 5 assigned tasks: <strong>(4 / 5) × 100 = 80% Score</strong>.
              </li>
              <li style={{ marginBottom: '6px' }}>
                Completing 10 out of 10 assigned tasks: <strong>(10 / 10) × 100 = 100% Score</strong>.
              </li>
              <li>
                Completing 0 out of 1 assigned task: <strong>(0 / 1) × 100 = 0% Score</strong>.
              </li>
            </ul>
          </div>
        </div>
      </Modal>

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
              Here is the individual calculation breakdown of the efficiency score for <strong>{selectedEmployeeForCalculation.full_name}</strong> ({selectedEmployeeForCalculation.employee_id_code}) for the selected period.
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

            {/* 2. Time Score Card */}
            {selectedEmployeeForCalculation.estimated_time !== null && (
              <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px', marginBottom: '16px' }}>
                <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', color: 'var(--primary)', fontWeight: 700 }}>
                  2. Time Score
                </h4>
                <p style={{ margin: '0 0 10px 0', fontSize: '13px', color: 'var(--text-muted)' }}>
                  Compares actual spent duration against estimated task parameters. Deducts 1 point per extra minute spent over estimates.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', background: '#fff', padding: '12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                    <span>Total Estimated Time:</span>
                    <span style={{ fontWeight: 700 }}>{selectedEmployeeForCalculation.estimated_time || 0} mins</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                    <span>Total Actual Time:</span>
                    <span style={{ fontWeight: 700 }}>
                      {(() => {
                        const seconds = selectedEmployeeForCalculation.completed_time || 0;
                        const m = Math.floor(seconds / 60);
                        const s = seconds % 60;
                        if (m === 0 && s === 0) return '0 mins';
                        if (m === 0) return `${s} secs`;
                        return `${m} mins ${s} secs`;
                      })()}
                    </span>
                  </div>
                  <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '6px 0' }} />
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>
                    Formula: (Time Score Sum of Completed Tasks / Total Assigned Tasks)
                  </div>
                  <div style={{ fontWeight: 700, fontSize: '14px', fontFamily: 'monospace', marginBottom: '8px', background: '#f8fafc', padding: '6px 10px', borderRadius: '4px', border: '1px solid #e2e8f0' }}>
                    {(() => {
                      const completedCount = selectedEmployeeForCalculation.completed_tasks || 0;
                      const totalCount = selectedEmployeeForCalculation.total_tasks || 0;
                      const timeScore = selectedEmployeeForCalculation.time_score || 0;
                      
                      if (completedCount === 0) {
                        return `(0% Score / ${totalCount} Tasks) = 0%`;
                      }
                      
                      const completedTasksScoreSum = Math.round((timeScore * totalCount));
                      return `(${completedTasksScoreSum}% Score Sum / ${totalCount} Tasks) = ${timeScore}%`;
                    })()}
                  </div>
                  {(() => {
                    const actualMins = (selectedEmployeeForCalculation.completed_time || 0) / 60;
                    const estMins = selectedEmployeeForCalculation.estimated_time || 0;
                    const completedCount = selectedEmployeeForCalculation.completed_tasks || 0;
                    if (completedCount > 0 && actualMins > estMins) {
                      const penalty = (actualMins - estMins).toFixed(1);
                      return (
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)', background: '#fffbeb', border: '1px solid #fef3c7', padding: '8px 10px', borderRadius: '4px', marginBottom: '8px', lineHeight: '1.4' }}>
                          * Penalty for extra time spent on completed work:<br />
                          100 - ({actualMins.toFixed(1)} mins actual - {estMins} mins est) = 100 - {penalty} = <strong>{Math.max(0, Math.round(100 - penalty))}%</strong> average score per completed task.
                        </div>
                      );
                    }
                    return null;
                  })()}
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', fontWeight: 700 }}>
                    <span>Time Score:</span>
                    <span style={{ fontFamily: 'monospace' }}>{selectedEmployeeForCalculation.time_score || 0}%</span>
                  </div>
                </div>
              </div>
            )}

            {/* 3. Overall Score Card */}
            <div style={{ backgroundColor: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '8px', padding: '16px' }}>
              <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#047857', fontWeight: 700 }}>
                {selectedEmployeeForCalculation.estimated_time === null ? '2. Overall Efficiency Score' : '3. Overall Efficiency Score'}
              </h4>
              <p style={{ margin: '0 0 10px 0', fontSize: '13px', color: '#065f46' }}>
                {selectedEmployeeForCalculation.estimated_time === null 
                  ? 'Based on Completion Score of tasks.' 
                  : 'The simple average of Completion Score and Time Score.'}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', background: '#fff', padding: '12px', borderRadius: '6px', border: '1px solid #a7f3d0' }}>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  {selectedEmployeeForCalculation.estimated_time === null 
                    ? 'Formula: Completion Score' 
                    : 'Formula: (Completion Score + Time Score) / 2'}
                </div>
                <div style={{ fontWeight: 800, fontSize: '16px', color: '#047857', fontFamily: 'monospace' }}>
                  {selectedEmployeeForCalculation.estimated_time === null 
                    ? `${selectedEmployeeForCalculation.completion_score || 0}%`
                    : `(${selectedEmployeeForCalculation.completion_score || 0}% + ${selectedEmployeeForCalculation.time_score || 0}%) / 2 = ${selectedEmployeeForCalculation.efficiency || 0}%`}
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ManagerEfficiency;
