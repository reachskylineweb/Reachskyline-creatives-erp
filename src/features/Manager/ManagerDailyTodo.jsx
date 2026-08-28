import React, { useState, useEffect, useCallback } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import { ListTodo, CheckCircle2, CheckCircle, User, UserPlus, Check, X, RefreshCw, ExternalLink, FileText, Image as ImageIcon, Square, CheckSquare, Globe, Briefcase, Clock, AlertCircle, Volume2, Mic, Search, Filter } from 'lucide-react';
import Modal from '../../components/Modal';

const ensureExternalLink = (url) => {
  if (!url) return '';
  const trimmed = url.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }
  return `https://${trimmed}`;
};

const getTodayOffsetDateStr = (offsetDays = 0) => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

const getFilteredEmployees = (reqSubDeptId, employeesList) => {
  if (!reqSubDeptId) return employeesList;
  const reqId = Number(reqSubDeptId);
  let filtered = employeesList.filter(emp => {
    const empSubDeptId = Number(emp.sub_department_id);
    const code = (emp.sub_department_code || '').toUpperCase();
    const name = (emp.sub_department_name || '').toLowerCase();

    if (reqId === 3) {
      // Content Writing (CW-RS / Sub-dept 3)
      return empSubDeptId === 3 || code === 'CW-RS' || name.includes('content') || name.includes('writer');
    }
    // Designers & Video Editors (GD-RS, VE-RS, CRD-RS / Sub-depts 1, 2, 4)
    return (
      [1, 2, 4].includes(empSubDeptId) ||
      ['GD-RS', 'VE-RS', 'CRD-RS'].includes(code) ||
      name.includes('graphic') || name.includes('video') || name.includes('designer') ||
      (empSubDeptId !== 3 && Number(emp.department_id) === 1)
    );
  });

  return filtered;
};

const getSubDeptSuffix = (subDeptId) => {
  const id = Number(subDeptId);
  if (id === 1) return ' (Content Writer)';
  if (id === 2) return ' (Graphic Designer)';
  if (id === 3 || id === 5) return ' (Video Editor)';
  if (id === 4) return ' (Creative Designer)';
  return ' (Designer)';
};

const getPendingReason = (item) => {
  const status = (item.status || '').toLowerCase();
  const hasContent = !!item.content_link;

  if (!hasContent) {
    return 'Awaiting Content Script document/link upload';
  }
  if (status === 'pending') {
    return 'Content Script is approved; manager needs to assign a Designer';
  }
  if (status === 'assigned' || status === 'in_progress') {
    return `Assigned to designer ${item.employee_name || ''}; awaiting design output upload`;
  }
  if (status === 'submitted') {
    return 'Designer uploaded draft; manager needs to review/approve output';
  }
  if (status === 'reassigned') {
    return 'Rework requested by manager; designer is revising the output';
  }
  if (status === 'sent_to_client') {
    return 'Design sent to client; awaiting client feedback or approval';
  }
  if (status === 'client_rework') {
    return 'Client requested revisions (client rework); corrections pending';
  }
  return 'Pending review/approval';
};

const getJobWorkPendingReason = (jw) => {
  const status = (jw.status || '').toLowerCase();
  const hasContent = !!jw.content_link;
  const hasDesign = !!jw.google_drive_link;
  const designerAssigned = !!jw.assigned_employee_id;
  const isReworkStatus = ['reassigned', 'client_rework', 'rework'].includes(status);

  if (isReworkStatus) {
    return 'Sent back to designer or writer for rework revisions';
  }
  if (!hasContent) {
    if (!designerAssigned) {
      return 'Content writer is not assigned yet';
    }
    return 'Assigned to content writer; script document not uploaded yet';
  }
  if (status === 'submitted' && !hasDesign) {
    return 'Content script submitted; manager needs to review/approve content';
  }
  if (!designerAssigned) {
    return 'Content approved; manager needs to assign a designer';
  }
  if (!hasDesign) {
    return 'Assigned to designer; design/video output not uploaded yet';
  }
  if (status === 'submitted' && hasDesign) {
    return 'Designer submitted output; manager needs to review/approve design';
  }
  if (status === 'sent_to_client') {
    return 'Design sent to client; awaiting client feedback/approval';
  }
  return 'Pending review or approval';
};

const ManagerDailyTodo = () => {
  const { user } = useAuth();
  const managerProfile = user?.managerProfile || {};

  if (managerProfile.department_code === 'SMM-RS') {
    return <Navigate to="/manager/dashboard" replace />;
  }

  const [todayItems, setTodayItems] = useState([]);
  const [overdueItems, setOverdueItems] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [assigningItemId, setAssigningItemId] = useState(null);
  const [selectedDesigner, setSelectedDesigner] = useState('');
  const [actionInProgress, setActionInProgress] = useState(null);
  const [smmTab, setSmmTab] = useState('assign'); // 'assign' or 'post'
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: null
  });

  // Tab & Filtration states for Daily Deliverables and Job Work
  const [activeTab, setActiveTab] = useState('deliverables'); // 'deliverables' | 'job_work'
  const [reworkModal, setReworkModal] = useState({ isOpen: false, jobId: null, feedbackText: '' });
  const [jobWorks, setJobWorks] = useState([]);
  const [deliverablesFilter, setDeliverablesFilter] = useState('all'); // 'all' | 'assigned' | 'unassigned'
  const [jobWorksFilter, setJobWorksFilter] = useState('all'); // 'all' | 'assigned' | 'unassigned'
  const [jobWorksTabFilter, setJobWorksTabFilter] = useState('all');
  const [assigningJobId, setAssigningJobId] = useState(null);
  const [selectedJobEmployee, setSelectedJobEmployee] = useState('');
  const [jobSearchQuery, setJobSearchQuery] = useState('');

  const todayStr = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const d_temp = new Date();
  const localDateStr = `${d_temp.getFullYear()}-${String(d_temp.getMonth() + 1).padStart(2, '0')}-${String(d_temp.getDate()).padStart(2, '0')}`;

  const [selectedDate, setSelectedDate] = useState(localDateStr);
  const [selectedMonth, setSelectedMonth] = useState(localDateStr.substring(0, 7));

  // Today's Job Works (based on selectedDate, including all active/incomplete ones so they are manageable)
  const todayJobWorks = jobWorks.filter(jw => {
    const status = (jw.status || '').toLowerCase();
    const isCompleted = ['completed', 'posted', 'client_approved'].includes(status);
    return !isCompleted;
  });

  // Calculate task counts per employee for workload dashboard
  const getEmployeeTaskCount = (empId) => {
    const isSMM = managerProfile.department_code === 'SMM-RS';
    
    // Count deliverables (todayItems) - only if status is not 'pending'
    const delCount = todayItems.filter(item => 
      Number(item.assigned_employee_id) === Number(empId) && item.status !== 'pending'
    ).length;
    
    // Count job works (todayJobWorks) - count active job works assigned to designer/editor
    const jwCount = todayJobWorks.filter(jw => {
      const assignedId = isSMM ? jw.smm_employee_id : jw.assigned_employee_id;
      if (Number(assignedId) !== Number(empId)) return false;
      if (isSMM) return true;
      
      const status = (jw.status || '').toLowerCase();
      return ['assigned_employee', 'submitted', 'completed', 'posted', 'script_submitted', 'waiting_for_approval', 'manager_review_script', 'manager_review_design', 'in_progress', 'pending'].includes(status);
    }).length;
    
    return delCount + jwCount;
  };

  // Get employee initials for initials avatar
  const getInitials = (name) => {
    if (!name) return '';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  const getStatusColors = (status) => {
    const s = (status || '').toLowerCase().replace(' ', '_');
    switch (s) {
      case 'pending':
        return {
          bg: '#ffffff',
          border: 'var(--border-color)',
          badgeBg: '#f1f5f9',
          badgeText: '#475569'
        };
      case 'assigned':
      case 'assigned_employee':
        return {
          bg: '#f0f7ff',
          border: '#bfdbfe',
          badgeBg: '#eff6ff',
          badgeText: '#2563eb'
        };
      case 'submitted':
        return {
          bg: '#fffbeb',
          border: '#fde68a',
          badgeBg: '#fef3c7',
          badgeText: '#d97706'
        };
      case 'reassigned':
      case 'rework':
        return {
          bg: '#fff5f5',
          border: '#fecdd3',
          badgeBg: '#fff1f2',
          badgeText: '#e11d48'
        };
      case 'approved':
      case 'completed':
        return {
          bg: '#f0fdf4',
          border: '#bbf7d0',
          badgeBg: '#ecfdf5',
          badgeText: '#059669'
        };
      case 'sent_to_client':
        return {
          bg: '#faf5ff',
          border: '#ddd6fe',
          badgeBg: '#f5f3ff',
          badgeText: '#7c3aed'
        };
      case 'client_approved':
        return {
          bg: '#ecfdf5',
          border: '#a7f3d0',
          badgeBg: '#d1fae5',
          badgeText: '#065f46'
        };
      case 'client_rejected':
      case 'client_rework':
        return {
          bg: '#fff1f2',
          border: '#ffe4e6',
          badgeBg: '#ffe4e6',
          badgeText: '#b91c1c'
        };
      default:
        return {
          bg: '#ffffff',
          border: 'var(--border-color)',
          badgeBg: '#f8fafc',
          badgeText: '#64748b'
        };
    }
  };

  const getItemStageDetails = (item) => {
    const status = (item.status || '').toLowerCase();
    const hasContent = Boolean(item.content_link);
    const isDesignerAssigned = Boolean(item.assigned_employee_id) && Number(item.assigned_employee_id) !== Number(item.content_writer_id);
    const isRework = ['reassigned', 'rework', 'client_rework', 'script_rework'].includes(status);
    const requiresContent = [1, 2, 4].includes(Number(item.sub_department_id)) || ['AT001', 'AT002', 'AT003', 'AT004', 'AT005', 'AT006', 'AT008'].includes(item.activity_type_code);
    const isEventDayItem = item.activity_type_code === 'AT006' || item.is_event_day === 1;

    if (status === 'posted' || status === 'completed') {
      return {
        label: 'COMPLETED & POSTED',
        badgeBg: '#d1fae5',
        badgeText: '#065f46',
        border: '#a7f3d0',
        bg: '#ecfdf5'
      };
    }

    if (isEventDayItem && item.due_date && item.due_date.split(/[T ]/)[0] > selectedDate) {
      const eventName = item.event_day_title || item.deliverable || 'Event Day';
      const eventDateStr = item.due_date.split(/[T ]/)[0];
      return {
        label: `EVENT DAY PREP (${eventName} - ${eventDateStr})`,
        badgeBg: '#fef3c7',
        badgeText: '#b45309',
        border: '#fde68a',
        bg: '#fffbeb'
      };
    }

    if (status === 'client_approved') {
      return {
        label: 'CLIENT APPROVED',
        badgeBg: '#d1fae5',
        badgeText: '#047857',
        border: '#a7f3d0',
        bg: '#f0fdf4'
      };
    }

    if (status === 'sent_to_client') {
      return {
        label: 'SENT TO CLIENT',
        badgeBg: '#f3e8ff',
        badgeText: '#6d28d9',
        border: '#ddd6fe',
        bg: '#faf5ff'
      };
    }

    if (status === 'submitted') {
      return {
        label: 'PENDING MANAGER APPROVAL',
        badgeBg: '#fef3c7',
        badgeText: '#b45309',
        border: '#fde68a',
        bg: '#fffbeb'
      };
    }

    if (isRework) {
      const emp = item.employee_name || item.assigned_employee_name || '';
      return {
        label: emp ? `REWORK REQUESTED (${emp})` : 'REWORK REQUESTED',
        badgeBg: '#ffe4e6',
        badgeText: '#b91c1c',
        border: '#fecdd3',
        bg: '#fff1f2'
      };
    }

    if (requiresContent && !hasContent) {
      const writerName = item.content_writer_name || 'Content Writer';
      return {
        label: `AWAITING CONTENT SCRIPT (${writerName})`,
        badgeBg: '#f1f5f9',
        badgeText: '#475569',
        border: '#cbd5e1',
        bg: '#ffffff'
      };
    }

    if (hasContent && !isDesignerAssigned) {
      return {
        label: 'DESIGNER UNASSIGNED',
        badgeBg: '#dbeafe',
        badgeText: '#1d4ed8',
        border: '#bfdbfe',
        bg: '#eff6ff'
      };
    }

    if (isDesignerAssigned && (status === 'assigned' || status === 'in_progress' || status === 'pending')) {
      const designerName = item.employee_name || 'Designer';
      return {
        label: `DESIGN IN PROGRESS (${designerName})`,
        badgeBg: '#e0f2fe',
        badgeText: '#0369a1',
        border: '#bae6fd',
        bg: '#f0f9ff'
      };
    }

    return {
      label: 'PENDING',
      badgeBg: '#f8fafc',
      badgeText: '#64748b',
      border: '#e2e8f0',
    };
  };

  // Sort and filter employees for the workload summary (exclude Content Writers for design/video departments)
  const workloadEmployees = employees
    .filter(emp => {
      const subDeptId = Number(emp.sub_department_id);
      const subDeptCode = (emp.sub_department_code || '').toUpperCase();
      const subDeptName = (emp.sub_department_name || '').toLowerCase();
      const nameLower = (emp.full_name || '').toLowerCase();

      // Exclude Content Writers (sub_department_id = 1, CW-RS, or content in name/role)
      const isContentWriter = 
        subDeptId === 1 || 
        subDeptCode === 'CW-RS' || 
        subDeptName.includes('content') || 
        nameLower.includes('writer');

      return !isContentWriter;
    })
    .sort((a, b) => {
      if (a.sub_department_id !== b.sub_department_id) {
        return Number(a.sub_department_id) - Number(b.sub_department_id);
      }
      return a.full_name.localeCompare(b.full_name);
    });

  // Render workload dashboard panel (Removed per user request)
  const renderWorkloadSummary = () => {
    return null;
  };

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

  const fetchDailyTodo = useCallback(async () => {
    if (!managerProfile.department_id) return;
    setLoading(true);
    try {
      const d = new Date();
      const localDateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

      if (false && managerProfile.department_code === 'SEO-RS') {
        const currentMonthStr = selectedDate.substring(0, 7);
        const res = await api.get('/blog-calendar', {
          params: { month: currentMonthStr }
        });
        if (res.data.success) {
          const list = res.data.data || [];
          // Filter tasks due for today's date that are approved/sent_to_employees
          const todayTasks = list.filter(item => {
            if (!item.date) return false;
            const dateObj = new Date(item.date);
            const yyyy = dateObj.getFullYear();
            const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
            const dd = String(dateObj.getDate()).padStart(2, '0');
            const itemDateStr = `${yyyy}-${mm}-${dd}`;
            return itemDateStr === selectedDate && item.status !== 'draft';
          });
          setTodayItems(todayTasks);
        }
      } else {
        const isSMM = managerProfile.department_code === 'SMM-RS';
        const params = {
          dateFilter: selectedDate,
          departmentFilter: isSMM ? 1 : managerProfile.department_id, // SMM uses Creatives (dept 1) deliverables
          limit: 100,
          page: 1
        };
        if (isSMM && smmTab === 'post') {
          params.statusFilter = 'approved';
        }

        // Fetch overdue items (all incomplete items for this department prior to today's date)
        const overdueParams = {
          departmentFilter: isSMM ? 1 : managerProfile.department_id,
          statusFilter: 'pending,assigned,submitted,reassigned,sent_to_client,client_rework,in_progress,assigned_employee,approved',
          limit: 150,
          page: 1
        };

        const [delivsRes, overdueRes, jobsRes] = await Promise.all([
          api.get('/deliverables', { params }),
          api.get('/deliverables', { params: overdueParams }),
          managerProfile.department_code !== 'SMM-RS' ? api.get('/deliverables/job-work/manager') : Promise.resolve({ data: { success: false } })
        ]);

        if (delivsRes.data.success) {
          const allDelivs = delivsRes.data.data.deliverables || [];
          // Include deliverables for selected date/month (both active & completed) that are NOT job works
          const contentCalendarDelivs = allDelivs.filter(item => {
            if (item.is_job_work !== 0 || !item.activity_code) return false;
            return true;
          });
          setTodayItems(contentCalendarDelivs);
        }

        if (overdueRes.data.success) {
          const allOverdue = overdueRes.data.data.deliverables || [];
          const activeDeliverables = allOverdue.filter(item => {
            if (item.is_job_work !== 0 || !item.activity_code) return false;
            
            // Exclude items due today (since they are in todayItems)
            const itemDate = item.due_date ? item.due_date.split(/[T ]/)[0] : '';
            if (itemDate === selectedDate) return false;
            
            // Keep it if it's incomplete/active
            const status = (item.status || '').toLowerCase();
            return !['completed', 'posted', 'client_approved'].includes(status);
          });
          setOverdueItems(activeDeliverables);
        }

        if (jobsRes.data.success) {
          setJobWorks(jobsRes.data.data || []);
        }
      }
    } catch (err) {
      console.error('Error fetching daily todo items:', err.message);
    } finally {
      setLoading(false);
    }
  }, [managerProfile.department_id, managerProfile.department_code, smmTab, selectedDate]);

  const handleSaveJobAssignment = async (jobId, employeeId) => {
    if (!employeeId) return;
    setActionInProgress(jobId);
    const empNum = Number(employeeId);
    const payload = {
      employeeId: empNum,
      assigned_employee_id: empNum,
      employee_id: empNum,
      isJobWork: true,
      is_job_work: true,
      feedbackText: null,
      voiceBase64: null
    };
    try {
      let res;
      try {
        res = await api.post(`/deliverables/job-work/${jobId}/assign`, payload);
      } catch (e1) {
        try {
          res = await api.post(`/deliverables/${jobId}/assign`, payload);
        } catch (e2) {
          try {
            res = await api.put(`/deliverables/${jobId}/assign`, payload);
          } catch (_) {
            throw e1;
          }
        }
      }
      if (res?.data?.success) {
        alert('Job Work assigned successfully.');
        setAssigningJobId(null);
        setSelectedJobEmployee('');
        fetchDailyTodo();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to assign Job Work.');
    } finally {
      setActionInProgress(null);
    }
  };

  const handleReviewJobWork = async (jobId, action, feedbackText = '') => {
    setActionInProgress(jobId);
    try {
      const res = await api.post(`/deliverables/job-work/${jobId}/review`, {
        action,
        feedbackText
      });
      if (res.data.success) {
        alert(`Job Work ${action === 'approve' ? 'approved' : 'reassigned for rework'} successfully.`);
        setReworkModal({ isOpen: false, jobId: null, feedbackText: '' });
        fetchDailyTodo();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to review Job Work.');
    } finally {
      setActionInProgress(null);
    }
  };

  const startAssigningJob = (job, forceRole = null) => {
    setAssigningJobId(job.id);
    const reqSubDept = forceRole || (managerProfile.department_code === 'SMM-RS' ? 3 : job.sub_department_id);
    
    let filtered = getFilteredEmployees(reqSubDept, employees);
    
    const currentAssignedId = managerProfile.department_code === 'SMM-RS'
      ? job.smm_employee_id
      : job.assigned_employee_id;

    if (currentAssignedId && !filtered.some(e => e.id === currentAssignedId)) {
      const currEmp = employees.find(e => e.id === currentAssignedId);
      if (currEmp) filtered = [...filtered, currEmp];
    }
    
    const isAssignedValid = filtered.some(emp => Number(emp.id) === Number(currentAssignedId));
    if (isAssignedValid) {
      setSelectedJobEmployee(currentAssignedId);
    } else if (filtered.length > 0) {
      setSelectedJobEmployee(filtered[0].id);
    } else {
      setSelectedJobEmployee('');
    }
  };

  const handleMarkAsPosted = async (itemId) => {
    if (!(await window.confirm('Are you sure you want to mark this item as posted?'))) return;
    setActionInProgress(itemId);
    try {
      let res;
      try {
        res = await api.post(`/deliverables/${itemId}/status`, { status: 'posted' });
      } catch (_) {
        res = await api.patch(`/deliverables/${itemId}/status`, { status: 'posted' });
      }
      if (res.data.success) {
        fetchDailyTodo();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update posting status.');
    } finally {
      setActionInProgress(null);
    }
  };

  const handleMarkSeoTaskCompleted = async (item) => {
    setActionInProgress(item.id);
    try {
      const dateObj = new Date(item.date);
      const yyyy = dateObj.getFullYear();
      const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
      const dd = String(dateObj.getDate()).padStart(2, '0');
      const dateStr = `${yyyy}-${mm}-${dd}`;

      const payload = {
        date: dateStr,
        title: item.title,
        description: item.description,
        status: 'sent_to_employees',
        type: item.type,
        assigned_employee_id: item.assigned_employee_id || null,
        content_link: item.content_link || null,
        google_drive_link: item.google_drive_link || null
      };

      const res = await api.put(`/blog-calendar/${item.id}`, payload);
      if (res.data.success) {
        fetchDailyTodo();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update task status.');
    } finally {
      setActionInProgress(null);
    }
  };

  const handleSaveSeoAssignment = async (item, employeeId) => {
    try {
      const dateObj = new Date(item.date);
      const yyyy = dateObj.getFullYear();
      const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
      const dd = String(dateObj.getDate()).padStart(2, '0');
      const dateStr = `${yyyy}-${mm}-${dd}`;

      const payload = {
        date: dateStr,
        title: item.title,
        description: item.description,
        status: 'assigned',
        type: item.type,
        assigned_employee_id: Number(employeeId) || null,
        content_link: item.content_link || null,
        google_drive_link: item.google_drive_link || null
      };

      const res = await api.put(`/blog-calendar/${item.id}`, payload);
      if (res.data.success) {
        const empObj = employees.find(e => e.id === Number(employeeId)) || {};
        const empName = empObj.full_name || 'employee';
        fetchDailyTodo();
        setAssigningItemId(null);
        setSelectedDesigner('');
        alert(`Work assigned successfully to ${empName}!`);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update assignment.');
    }
  };

  const executeAutoAssignSeoAll = async (unassignedItems) => {
    setLoading(true);
    try {
      // 1. Sort today's unassigned items to keep order consistent
      const sortedUnassigned = [...unassignedItems].sort((a, b) => a.id - b.id);
      
      // 2. Load balance based on employee counts
      const counts = {};
      employees.forEach(emp => {
        counts[emp.id] = todayItems.filter(item => Number(item.assigned_employee_id) === Number(emp.id)).length;
      });

      // 3. Round-robin assignment loop
      for (const item of sortedUnassigned) {
        const eligible = [...employees].sort((a, b) => (counts[a.id] || 0) - (counts[b.id] || 0));
        const chosen = eligible[0];
        
        counts[chosen.id] = (counts[chosen.id] || 0) + 1;

        const dateObj = new Date(item.date);
        const yyyy = dateObj.getFullYear();
        const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
        const dd = String(dateObj.getDate()).padStart(2, '0');
        const dateStr = `${yyyy}-${mm}-${dd}`;

        const payload = {
          date: dateStr,
          title: item.title,
          description: item.description,
          status: 'assigned',
          type: item.type,
          assigned_employee_id: Number(chosen.id),
          content_link: item.content_link || null,
          google_drive_link: item.google_drive_link || null
        };

        await api.put(`/blog-calendar/${item.id}`, payload);
      }

      alert('Successfully auto-assigned SEO tasks using round-robin method!');
      fetchDailyTodo();
    } catch (err) {
      console.error(err);
      alert('Failed to complete auto-assignment. Please refresh and check.');
    } finally {
      setLoading(false);
    }
  };

  const handleAutoAssignSeoAll = async () => {
    const unassignedItems = todayItems.filter(item => !item.assigned_employee_id);
    if (unassignedItems.length === 0) {
      alert('All items are already assigned!');
      return;
    }

    if (employees.length === 0) {
      alert('No active employees found to assign these tasks.');
      return;
    }

    setConfirmModal({
      isOpen: true,
      title: 'Auto-Assign Today\'s SEO Tasks',
      message: `Are you sure you want to auto-assign all ${unassignedItems.length} today's SEO tasks using round-robin distribution?`,
      onConfirm: () => executeAutoAssignSeoAll(unassignedItems)
    });
  };

  useEffect(() => {
    fetchEmployees();
    fetchDailyTodo();
  }, [fetchEmployees, fetchDailyTodo]);

  const handleSaveAssignment = async (item) => {
    if (!selectedDesigner) return;
    try {
      let res;
      try {
        res = await api.post(`/deliverables/${item.id}/assign`, { employeeId: Number(selectedDesigner) });
      } catch (_) {
        res = await api.put(`/deliverables/${item.id}/assign`, { employeeId: Number(selectedDesigner) });
      }
      if (res.data.success) {
        const empObj = employees.find(e => e.id === Number(selectedDesigner)) || {};
        const empName = empObj.full_name || 'employee';
        setAssigningItemId(null);
        setSelectedDesigner('');
        alert(`Work assigned successfully to ${empName}!`);
        await fetchDailyTodo();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update assignment.');
    }
  };
  const executeAutoAssignAll = async (unassignedItems) => {
    // Track task count per employee to distribute work evenly
    const employeeTaskCounts = {};
    employees.forEach(emp => {
      const currentCount = todayItems.filter(item => Number(item.assigned_employee_id) === Number(emp.id)).length;
      employeeTaskCounts[emp.id] = currentCount;
    });

    const assignmentsToSubmit = [];
    for (const item of unassignedItems) {
      // Exclude design/video tasks without a content link from auto assignment
      const requiresContent = [1, 2, 4].includes(Number(item.sub_department_id)) || ['AT001', 'AT002', 'AT003', 'AT004', 'AT005', 'AT006', 'AT008'].includes(item.activity_type_code);
      if (requiresContent && !item.content_link) {
        continue;
      }
      const actCode = (item.activity_type_code || '').toUpperCase();
      const isVideo = ['AT004', 'AT005', 'REELS', 'YT', 'YTS'].some(code => actCode.includes(code) || (item.deliverable || '').toLowerCase().includes('video') || (item.deliverable || '').toLowerCase().includes('reel'));
      const reqSubDept = isVideo ? 2 : 1;
      const eligible = getFilteredEmployees(reqSubDept, employees);
      if (eligible.length === 0) continue;

      // Sort eligible employees by their current simulated workload ascending
      eligible.sort((a, b) => (employeeTaskCounts[a.id] || 0) - (employeeTaskCounts[b.id] || 0));
      
      const chosen = eligible[0];
      employeeTaskCounts[chosen.id] = (employeeTaskCounts[chosen.id] || 0) + 1;

      assignmentsToSubmit.push({
        itemId: item.id,
        employeeId: chosen.id,
        employeeName: chosen.full_name
      });
    }

    if (assignmentsToSubmit.length === 0) {
      alert('No eligible employees found to assign these tasks.');
      return;
    }

    setLoading(true);
    try {
      await Promise.all(assignmentsToSubmit.map(async (assign) => {
        try {
          await api.post(`/deliverables/${assign.itemId}/assign`, { employeeId: assign.employeeId });
        } catch (_) {
          await api.put(`/deliverables/${assign.itemId}/assign`, { employeeId: assign.employeeId });
        }
      }));

      setTodayItems(prev => prev.map(d => {
        const assignment = assignmentsToSubmit.find(a => a.itemId === d.id);
        if (assignment) {
          return {
            ...d,
            status: 'assigned',
            assigned_employee_id: assignment.employeeId,
            employee_name: assignment.employeeName
          };
        }
        return d;
      }));

      alert(`Successfully auto-assigned ${assignmentsToSubmit.length} tasks!`);
    } catch (err) {
      console.error('Error during auto-assign:', err);
      alert('Failed to complete auto-assignment. Please refresh and check list.');
    } finally {
      setLoading(false);
      fetchDailyTodo();
    }
  };

  const handleAutoAssignAll = async () => {
    const unassignedItems = todayItems.filter(item => {
      const isUnassigned = item.status === 'pending' || !item.assigned_employee_id;
      const requiresContent = [1, 2, 4].includes(Number(item.sub_department_id)) || ['AT001', 'AT002', 'AT003', 'AT004', 'AT005', 'AT006', 'AT008'].includes(item.activity_type_code);
      const hasContent = !!item.content_link;
      if (requiresContent && !hasContent) {
        return false;
      }
      return isUnassigned;
    });
    if (unassignedItems.length === 0) {
      alert('All items are already assigned (or awaiting content script)!');
      return;
    }

    setConfirmModal({
      isOpen: true,
      title: 'Auto-Assign Today\'s Tasks',
      message: `Are you sure you want to auto-assign all ${unassignedItems.length} today's tasks?`,
      onConfirm: () => executeAutoAssignAll(unassignedItems)
    });
  };

  const startAssigning = (item) => {
    setAssigningItemId(item.id);
    const actCode = (item.activity_type_code || '').toUpperCase();
    const isVideo = ['AT004', 'AT005', 'REELS', 'YT', 'YTS'].some(code => actCode.includes(code) || (item.deliverable || '').toLowerCase().includes('video') || (item.deliverable || '').toLowerCase().includes('reel'));
    const reqSubDept = isVideo ? 2 : 1;
    let filtered = getFilteredEmployees(reqSubDept, employees).filter(e => Number(e.sub_department_id) !== 3);
    
    if (item.assigned_employee_id) {
      const currEmp = employees.find(e => e.id === item.assigned_employee_id);
      if (currEmp && Number(currEmp.sub_department_id) !== 3 && !filtered.some(e => e.id === currEmp.id)) {
        filtered = [...filtered, currEmp];
      }
    }
    
    const isAssignedValid = filtered.some(emp => Number(emp.id) === Number(item.assigned_employee_id) && Number(emp.sub_department_id) !== 3);
    if (isAssignedValid) {
      setSelectedDesigner(item.assigned_employee_id);
    } else if (filtered.length > 0) {
      setSelectedDesigner(filtered[0].id);
    } else {
      setSelectedDesigner('');
    }
  };

  const renderSmmTabBar = () => {
    if (managerProfile.department_code !== 'SMM-RS') return null;
    return (
      <div style={{ display: 'flex', gap: '12px', borderBottom: '1px solid var(--border-color)', marginBottom: '24px', paddingBottom: '12px' }}>
        <button
          onClick={() => setSmmTab('assign')}
          style={{
            padding: '8px 16px',
            backgroundColor: smmTab === 'assign' ? 'var(--primary)' : 'var(--bg-light)',
            color: smmTab === 'assign' ? '#ffffff' : 'var(--text-muted)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-sm)',
            fontWeight: 700,
            fontSize: '13px',
            cursor: 'pointer'
          }}
        >
          Assign Deliverables
        </button>
        <button
          onClick={() => setSmmTab('post')}
          style={{
            padding: '8px 16px',
            backgroundColor: smmTab === 'post' ? 'var(--primary)' : 'var(--bg-light)',
            color: smmTab === 'post' ? '#ffffff' : 'var(--text-muted)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-sm)',
            fontWeight: 700,
            fontSize: '13px',
            cursor: 'pointer'
          }}
        >
          Publish Approved Posts
        </button>
      </div>
    );
  };

  if (false && managerProfile.department_code === 'SEO-RS') {
    return (
      <div style={{ padding: '30px', maxWidth: '1400px', margin: '0 auto' }}>
        {/* Title */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-color)', display: 'flex', alignItems: 'center', gap: '10px', margin: 0 }}>
              <ListTodo size={26} style={{ color: 'var(--primary)' }} />
              SEO Daily To-Do List
            </h1>
            <p style={{ margin: '6px 0 0 0', color: 'var(--text-muted)', fontSize: '14px' }}>
              Scheduled SEO tasks (Blogs, GMB posts, and Backlinks) due today: <strong style={{ color: 'var(--primary)' }}>{todayStr}</strong>.
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              onClick={fetchDailyTodo}
              disabled={loading}
              style={{
                padding: '8px 16px',
                backgroundColor: 'var(--bg-light)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-sm)',
                fontWeight: 700,
                fontSize: '13px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                height: '38px'
              }}
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
              Refresh List
            </button>
          </div>
        </div>

        {renderWorkloadSummary()}

        {loading ? (
          <div style={{ padding: '80px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <div style={{ width: '32px', height: '32px', border: '3px solid #e2e8f0', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 12px auto' }}></div>
            <span>Loading today's SEO tasks...</span>
          </div>
        ) : todayItems.length === 0 ? (
          <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--border-color)', padding: '60px 40px', textAlign: 'center', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)' }}>
            <CheckCircle2 size={44} style={{ color: 'var(--success)', marginBottom: '12px' }} />
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: 'var(--text-color)' }}>All SEO tasks completed!</h3>
            <p style={{ margin: '8px 0 0 0', color: 'var(--text-muted)', fontSize: '14px' }}>
              There are no pending SEO tasks scheduled for today.
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px' }}>
            {todayItems.map(item => {
              const isAssigned = item.status !== 'approved';
              return (
                <div 
                  key={item.id}
                  style={{
                    backgroundColor: item.status === 'sent_to_employees' ? '#f0fdf4' : isAssigned ? '#eff6ff' : '#ffffff',
                    border: item.status === 'sent_to_employees' ? '1px solid #bbf7d0' : isAssigned ? '1px solid #bfdbfe' : '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    padding: '24px',
                    boxShadow: 'var(--shadow-sm)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    borderLeft: `5px solid ${item.type === 'gmb' ? '#10b981' : item.type === 'backlink' ? '#8b5cf6' : '#3b82f6'}`,
                    position: 'relative'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                          {item.client_name}
                        </span>
                      </div>
                      <span 
                        style={{
                          backgroundColor: 
                            item.status === 'sent_to_employees' ? 'rgba(16, 185, 129, 0.1)' : 
                            item.status === 'submitted' ? 'rgba(79, 70, 229, 0.1)' : 
                            isAssigned ? 'rgba(59, 130, 246, 0.1)' : 
                            'rgba(218, 167, 27, 0.1)',
                          color: 
                            item.status === 'sent_to_employees' ? 'var(--success)' : 
                            item.status === 'submitted' ? '#4f46e5' : 
                            isAssigned ? 'var(--primary)' : 
                            'var(--warning)',
                          padding: '4px 10px',
                          borderRadius: '12px',
                          fontSize: '11px',
                          fontWeight: 700,
                          textTransform: 'uppercase'
                        }}
                      >
                        {item.status === 'sent_to_employees' ? 'Completed' : item.status === 'submitted' ? 'Submitted' : isAssigned ? 'Assigned' : 'Pending'}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 10px 0', color: 'var(--text-color)' }}>
                      {item.title}
                    </h3>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                      <span className="badge" style={{
                        backgroundColor: item.type === 'gmb' ? '#ecfdf5' : item.type === 'backlink' ? '#f5f3ff' : 'var(--primary-light)',
                        color: item.type === 'gmb' ? '#047857' : item.type === 'backlink' ? '#6d28d9' : 'var(--primary)',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        fontSize: '10px',
                        padding: '4px 8px'
                      }}>
                        {item.type || 'blog'}
                      </span>
                    </div>

                    {item.description && (
                      <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '0 0 16px 0', lineHeight: 1.4 }}>
                        {item.description}
                      </p>
                    )}

                    {/* Submission Links */}
                    {(item.content_link || item.google_drive_link) && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px', padding: '12px', backgroundColor: 'var(--bg-light)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                        <strong style={{ fontSize: '11px', color: 'var(--text-muted)' }}>SPECIALIST SUBMISSIONS:</strong>
                        {item.content_link && (
                          <div style={{ fontSize: '13px' }}>
                            <a 
                              href={ensureExternalLink(item.content_link)} 
                              target="_blank" 
                              rel="noreferrer" 
                              style={{ color: 'var(--primary)', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '6px', textDecoration: 'none' }}
                            >
                              <FileText size={14} /> View Content Document <ExternalLink size={12} />
                            </a>
                          </div>
                        )}
                        {item.google_drive_link && (
                          <div style={{ fontSize: '13px' }}>
                            <a 
                              href={ensureExternalLink(item.google_drive_link)} 
                              target="_blank" 
                              rel="noreferrer" 
                              style={{ color: 'var(--primary)', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '6px', textDecoration: 'none' }}
                            >
                              <ImageIcon size={14} /> View Visual Assets <ExternalLink size={12} />
                            </a>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Assignee Control Section */}
                    <div 
                      style={{ 
                        borderTop: '1px solid var(--border-color)', 
                        paddingTop: '12px', 
                        marginTop: '12px', 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontSize: '13px'
                      }}
                    >
                      {assigningItemId === item.id ? (
                        /* Inline Assignment Dropdown */
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', width: '100%' }}>
                          <select
                            value={selectedDesigner}
                            onChange={(e) => setSelectedDesigner(e.target.value)}
                            style={{
                              flex: 1,
                              padding: '6px 8px',
                              borderRadius: 'var(--radius-sm)',
                              border: '1px solid var(--primary)',
                              fontSize: '12px',
                              outline: 'none',
                              backgroundColor: '#ffffff'
                            }}
                          >
                            <option value="">Select Employee</option>
                            {employees.map(emp => (
                              <option key={emp.id} value={emp.id}>{emp.full_name}</option>
                            ))}
                          </select>
                          <button
                            onClick={() => handleSaveSeoAssignment(item, selectedDesigner)}
                            style={{
                              padding: '6px',
                              backgroundColor: 'var(--success)',
                              color: '#ffffff',
                              border: 'none',
                              borderRadius: 'var(--radius-sm)',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                            title="Save assignment"
                          >
                            <Check size={14} />
                          </button>
                          <button
                            onClick={() => setAssigningItemId(null)}
                            style={{
                              padding: '6px',
                              backgroundColor: 'var(--bg-light)',
                              color: 'var(--text-muted)',
                              border: '1px solid var(--border-color)',
                              borderRadius: 'var(--radius-sm)',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                            title="Cancel"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ) : (
                        <>
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>SEO Specialist</span>
                            <strong style={{ color: 'var(--text-color)', fontSize: '13px' }}>{item.employee_name || 'Unassigned'}</strong>
                          </div>
                          {item.status !== 'sent_to_employees' && (
                            <button
                              onClick={() => { setAssigningItemId(item.id); setSelectedDesigner(item.assigned_employee_id || ''); }}
                              style={{
                                padding: '6px 12px',
                                backgroundColor: 'var(--primary-light)',
                                color: 'var(--primary)',
                                border: '1px solid rgba(79, 70, 229, 0.15)',
                                borderRadius: 'var(--radius-sm)',
                                fontSize: '12px',
                                fontWeight: 700,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px'
                              }}
                            >
                              <UserPlus size={14} /> Assign Work
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  if (managerProfile.department_code === 'SMM-RS' && smmTab === 'post') {
    return (
      <div style={{ padding: '30px', maxWidth: '1400px', margin: '0 auto' }}>
        {/* Title */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-color)', display: 'flex', alignItems: 'center', gap: '10px', margin: 0 }}>
              <ListTodo size={26} style={{ color: 'var(--primary)' }} />
              SMM Daily To-Do List
            </h1>
            <p style={{ margin: '6px 0 0 0', color: 'var(--text-muted)', fontSize: '14px' }}>
              Approved creative assets scheduled to be posted today: <strong style={{ color: 'var(--primary)' }}>{todayStr}</strong>.
            </p>
          </div>
        </div>

        {renderSmmTabBar()}

        <button 
          onClick={fetchDailyTodo}
            disabled={loading}
            style={{
              padding: '8px 16px',
              backgroundColor: 'var(--bg-light)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-sm)',
              fontWeight: 700,
              fontSize: '13px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              height: '38px'
            }}
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            Refresh List
          </button>

        {loading ? (
          <div style={{ padding: '80px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <div style={{ width: '32px', height: '32px', border: '3px solid #e2e8f0', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 12px auto' }}></div>
            <span>Loading today's posting tasks...</span>
          </div>
        ) : todayItems.length === 0 ? (
          <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--border-color)', padding: '60px 40px', textAlign: 'center', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)' }}>
            <CheckCircle2 size={44} style={{ color: 'var(--success)', marginBottom: '12px' }} />
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: 'var(--text-color)' }}>All postings caught up!</h3>
            <p style={{ margin: '8px 0 0 0', color: 'var(--text-muted)', fontSize: '14px' }}>
              There are no pending approved postings scheduled for today.
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px' }}>
            {todayItems.map(item => (
              <div 
                key={item.id}
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  padding: '24px',
                  boxShadow: 'var(--shadow-sm)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  borderLeft: '5px solid var(--primary)',
                  position: 'relative'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--primary)', letterSpacing: '0.5px' }}>
                      {item.client_name}
                    </span>
                    <span 
                      style={{
                        backgroundColor: 'rgba(79, 70, 229, 0.1)',
                        color: 'var(--primary)',
                        padding: '4px 10px',
                        borderRadius: '12px',
                        fontSize: '11px',
                        fontWeight: 700,
                        textTransform: 'uppercase'
                      }}
                    >
                      Approved
                    </span>
                  </div>

                  <h3 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 10px 0', color: 'var(--text-color)' }}>
                    {item.deliverable}
                  </h3>
                  
                  {item.description && (
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '0 0 16px 0', lineHeight: 1.4 }}>
                      {item.description}
                    </p>
                  )}

                  {/* Document & Design Links */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
                    {item.content_link && (
                      <div style={{ fontSize: '13px' }}>
                        <a 
                          href={ensureExternalLink(item.content_link)} 
                          target="_blank" 
                          rel="noreferrer" 
                          style={{ color: 'var(--primary)', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '6px', textDecoration: 'none' }}
                        >
                          <FileText size={14} /> View Caption & Script <ExternalLink size={12} />
                        </a>
                      </div>
                    )}
                    {item.google_drive_link && (
                      <div style={{ fontSize: '13px' }}>
                        <a 
                          href={ensureExternalLink(item.google_drive_link)} 
                          target="_blank" 
                          rel="noreferrer" 
                          style={{ color: 'var(--primary)', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '6px', textDecoration: 'none' }}
                        >
                          <ImageIcon size={14} /> Open Visual Asset <ExternalLink size={12} />
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                <div 
                  style={{ 
                    borderTop: '1px solid var(--border-color)', 
                    paddingTop: '16px', 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Square size={18} style={{ color: 'var(--primary)', opacity: 0.6 }} />
                    <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Ready for social platforms (Awaiting SMM Employee)</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
  const combinedDeliverables = [...todayItems, ...overdueItems];

  // Filter deliverables
  const filteredDeliverables = combinedDeliverables.filter(item => {
    const status = (item.status || '').toLowerCase();
    const hasContent = !!item.content_link;
    const itemDate = item.due_date ? item.due_date.split(/[T ]/)[0] : '';
    const isToday = itemDate === selectedDate;
    const isCompleted = ['completed', 'posted', 'client_approved'].includes(status);
    const isDesignerAssigned = Boolean(item.assigned_employee_id) && Number(item.assigned_employee_id) !== Number(item.content_writer_id);

    if (deliverablesFilter === 'approved') {
      return isCompleted;
    }

    if (isCompleted) {
      return false;
    }

    if (deliverablesFilter === 'all') {
      return isToday;
    }

    if (deliverablesFilter === 'pending_work') {
      const isOverdue = itemDate && itemDate < selectedDate;
      return isOverdue;
    }

    if (deliverablesFilter === 'pending_content') {
      return !hasContent;
    }

    if (deliverablesFilter === 'content_approval_pending') {
      return hasContent && status === 'submitted';
    }

    if (deliverablesFilter === 'assign_designer_pending') {
      return (hasContent || status === 'approved') && !isDesignerAssigned && !isCompleted;
    }

    if (deliverablesFilter === 'rework') {
      return ['reassigned', 'client_rework', 'rework'].includes(status);
    }

    if (deliverablesFilter === 'sent_to_client') {
      return status === 'sent_to_client';
    }

    return true;
  });

  // Filter job works based on state machine stages & tabs (today vs pending)
  const filteredJobWorks = jobWorks.filter(jw => {
    const searchLower = jobSearchQuery.toLowerCase();
    const matchesSearch = jw.client_name?.toLowerCase().includes(searchLower) || 
                          jw.deliverable?.toLowerCase().includes(searchLower) ||
                          jw.activity_code?.toLowerCase().includes(searchLower);
    
    if (!matchesSearch) return false;

    const itemDate = jw.deadline ? jw.deadline.split(/[T ]/)[0] : '';
    const status = (jw.status || '').toLowerCase();
    const hasContent = !!jw.content_link;
    const hasDesign = !!jw.google_drive_link;
    const isDesignerAssigned = Boolean(jw.assigned_employee_id) && Number(jw.assigned_employee_id) !== Number(jw.content_writer_id);
    
    // A job work is only completed when design/output is approved or posted
    const isCompleted = ['completed', 'posted', 'client_approved'].includes(status) || (status === 'approved' && hasDesign);

    if (jobWorksTabFilter === 'approved') {
      return isCompleted;
    }

    if (isCompleted) {
      return false;
    }

    if (jobWorksTabFilter === 'all') {
      return itemDate === selectedDate;
    }

    if (jobWorksTabFilter === 'pending_work') {
      const isOverdue = itemDate && itemDate < selectedDate;
      return isOverdue;
    }

    if (jobWorksTabFilter === 'pending_content') {
      return !hasContent;
    }

    if (jobWorksTabFilter === 'content_approval_pending') {
      return hasContent && !hasDesign && status === 'submitted';
    }

    if (jobWorksTabFilter === 'assign_designer_pending') {
      return (!isDesignerAssigned || (hasContent && !hasDesign)) && !isCompleted;
    }

    if (jobWorksTabFilter === 'rework') {
      return ['reassigned', 'client_rework', 'rework'].includes(status);
    }

    if (jobWorksTabFilter === 'sent_to_client') {
      return status === 'sent_to_client';
    }

    return true;
  });

  return (
    <div style={{ padding: '30px', maxWidth: '1400px', margin: '0 auto' }}>
      
      {/* Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-color)', display: 'flex', alignItems: 'center', gap: '10px', margin: 0 }}>
            <ListTodo size={26} style={{ color: 'var(--primary)' }} />
            Daily Tasks & To-Do List
          </h1>
          <p style={{ margin: '6px 0 0 0', color: 'var(--text-muted)', fontSize: '14px' }}>
            Manage and track deliverables and job works due for the selected date.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            onClick={fetchDailyTodo}
            style={{
              padding: '8px 16px',
              backgroundColor: 'var(--bg-light)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-sm)',
              fontWeight: 700,
              fontSize: '13px',
              cursor: 'pointer',
              outline: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            Refresh List
          </button>
        </div>
      </div>

      {/* Date & Month Filtration Bar */}
      <div className="table-toolbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', backgroundColor: '#fff', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', marginBottom: '30px', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)' }}>Filter by Month</label>
            <input 
              type="month" 
              value={selectedMonth} 
              onChange={(e) => {
                const newMonth = e.target.value;
                setSelectedMonth(newMonth);
                setSelectedDate(`${newMonth}-01`);
              }}
              style={{ padding: '8px 12px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', outline: 'none', fontSize: '13px' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)' }}>Quick Day Filter</label>
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              {[
                { label: 'Yesterday', offset: -1 },
                { label: 'Today', offset: 0 },
                { label: 'Tomorrow', offset: 1 }
              ].map(btn => {
                const targetDateStr = getTodayOffsetDateStr(btn.offset);
                const isActive = selectedDate === targetDateStr;
                return (
                  <button
                    key={btn.label}
                    type="button"
                    onClick={() => {
                      setSelectedDate(targetDateStr);
                      setSelectedMonth(targetDateStr.substring(0, 7));
                    }}
                    style={{
                      padding: '6px 12px',
                      fontSize: '12px',
                      fontWeight: 700,
                      borderRadius: '20px',
                      border: '1px solid',
                      borderColor: isActive ? 'var(--primary)' : 'var(--border-color)',
                      backgroundColor: isActive ? 'var(--primary)' : '#ffffff',
                      color: isActive ? '#ffffff' : 'var(--text-main)',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    {btn.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)' }}>Filter by Date</label>
            <input 
              type="date" 
              value={selectedDate} 
              onChange={(e) => {
                const newDate = e.target.value;
                setSelectedDate(newDate);
                if (newDate) {
                  setSelectedMonth(newDate.substring(0, 7));
                }
              }}
              style={{ padding: '8px 12px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', outline: 'none', fontSize: '13px' }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 16px', borderRadius: '99px', backgroundColor: 'var(--primary-light)', border: '1px solid var(--primary)', color: 'var(--primary)', fontWeight: 700, fontSize: '13px' }}>
            <span>Target Date:</span>
            <strong style={{ fontSize: '14px' }}>{new Date(selectedDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</strong>
          </div>
        </div>
      </div>

      {renderSmmTabBar()}

      {/* TODAY SUMMARY STATS BANNER */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
        <div style={{
          backgroundColor: '#eff6ff',
          border: '1px solid #bfdbfe',
          borderRadius: '12px',
          padding: '16px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px'
        }}>
          <span style={{ fontSize: '12px', fontWeight: 700, color: '#1e3a8a', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Today's Tasks</span>
          <strong style={{ fontSize: '28px', fontWeight: 800, color: '#1e40af' }}>{todayItems.length + todayJobWorks.length}</strong>
        </div>
        <div style={{
          backgroundColor: '#fef3c7',
          border: '1px solid #fde68a',
          borderRadius: '12px',
          padding: '16px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px'
        }}>
          <span style={{ fontSize: '12px', fontWeight: 700, color: '#78350f', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Normal Deliverables</span>
          <strong style={{ fontSize: '28px', fontWeight: 800, color: '#92400e' }}>{todayItems.length}</strong>
        </div>
        <div style={{
          backgroundColor: '#f3e8ff',
          border: '1px solid #e9d5ff',
          borderRadius: '12px',
          padding: '16px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px'
        }}>
          <span style={{ fontSize: '12px', fontWeight: 700, color: '#581c87', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Job Work</span>
          <strong style={{ fontSize: '28px', fontWeight: 800, color: '#6b21a8' }}>{todayJobWorks.length}</strong>
        </div>
      </div>

      {/* MAIN NAVIGATION TABS */}
      <div style={{ display: 'flex', gap: '12px', borderBottom: '1px solid var(--border-color)', marginBottom: '24px', paddingBottom: '12px' }}>
        <button
          onClick={() => setActiveTab('deliverables')}
          style={{
            padding: '10px 20px',
            backgroundColor: activeTab === 'deliverables' ? 'var(--primary)' : 'var(--bg-light)',
            color: activeTab === 'deliverables' ? '#ffffff' : 'var(--text-muted)',
            border: 'none',
            borderRadius: 'var(--radius-sm, 6px)',
            fontWeight: 700,
            fontSize: '14px',
            cursor: 'pointer',
            boxShadow: activeTab === 'deliverables' ? '0 2px 4px rgba(218, 167, 27, 0.2)' : 'none',
            transition: 'all 0.2s ease'
          }}
        >
          Normal Deliverables
        </button>
        <button
          onClick={() => setActiveTab('job_work')}
          style={{
            padding: '10px 20px',
            backgroundColor: activeTab === 'job_work' ? 'var(--primary)' : 'var(--bg-light)',
            color: activeTab === 'job_work' ? '#ffffff' : 'var(--text-muted)',
            border: 'none',
            borderRadius: 'var(--radius-sm, 6px)',
            fontWeight: 700,
            fontSize: '14px',
            cursor: 'pointer',
            boxShadow: activeTab === 'job_work' ? '0 2px 4px rgba(218, 167, 27, 0.2)' : 'none',
            transition: 'all 0.2s ease'
          }}
        >
          Job Work
        </button>
      </div>

      {loading ? (
        <div style={{ padding: '80px', textAlign: 'center', color: 'var(--text-muted)' }}>
          <div style={{ width: '32px', height: '32px', border: '3px solid #e2e8f0', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 12px auto' }}></div>
          <span>Loading list...</span>
        </div>
      ) : activeTab === 'deliverables' ? (
        /* NORMAL DELIVERABLES VIEW */
        <>
          {renderWorkloadSummary()}

          {/* Deliverables filtration control */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
            {[
              { code: 'all', label: 'Today Work' },
              { code: 'pending_work', label: 'Pending Work' },
              { code: 'pending_content', label: 'Pending Content' },
              { code: 'content_approval_pending', label: 'Content Approval Pending' },
              { code: 'assign_designer_pending', label: 'Assign Designer Pending' },
              { code: 'rework', label: 'Rework' },
              { code: 'sent_to_client', label: 'Sent to Client' },
              { code: 'approved', label: 'Completed' }
            ].map(f => (
              <button
                key={f.code}
                onClick={() => setDeliverablesFilter(f.code)}
                style={{
                  padding: '6px 14px',
                  backgroundColor: deliverablesFilter === f.code ? 'var(--primary-light)' : 'transparent',
                  color: deliverablesFilter === f.code ? 'var(--primary)' : 'var(--text-muted)',
                  border: deliverablesFilter === f.code ? '1px solid var(--primary)' : '1px solid var(--border-color)',
                  borderRadius: '20px',
                  fontWeight: 700,
                  fontSize: '12px',
                  cursor: 'pointer'
                }}
              >
                {f.label}
              </button>
            ))}
          </div>

          {filteredDeliverables.length === 0 ? (
            <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--border-color)', padding: '60px 40px', textAlign: 'center', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)' }}>
              <CheckCircle2 size={44} style={{ color: 'var(--success)', marginBottom: '12px' }} />
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: 'var(--text-color)' }}>No deliverables found</h3>
              <p style={{ margin: '8px 0 0 0', color: 'var(--text-muted)', fontSize: '14px' }}>
                There are no deliverables matching this filter.
              </p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px' }}>
              {filteredDeliverables.map(item => {
                const itemDate = item.due_date ? item.due_date.split(/[T ]/)[0] : '';
                const isOverdue = itemDate && itemDate < selectedDate && !['completed', 'posted', 'client_approved'].includes((item.status || '').toLowerCase());
                const stageDetails = getItemStageDetails(item);

                return (
                  <div 
                    key={item.id}
                    style={{
                      backgroundColor: stageDetails.bg || '#ffffff',
                      border: `1px solid ${stageDetails.border || 'var(--border-color)'}`,
                      borderRadius: 'var(--radius-md)',
                      padding: '24px',
                      boxShadow: 'var(--shadow-sm)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      borderLeft: '5px solid ' + (item.priority === 'high' ? 'var(--danger)' : item.priority === 'medium' ? 'var(--warning)' : 'var(--success)')
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                          <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                            {item.client_name}
                          </span>
                          {item.activity_code && (
                            <span style={{ fontFamily: 'monospace', fontSize: '11px', fontWeight: 800, color: 'var(--primary)' }}>
                              {item.activity_code}
                            </span>
                          )}
                          {(item.is_event_day === 1 || item.activity_type_code === 'AT006' || item.isEventDay) && (
                            <span style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '3px',
                              padding: '2px 8px',
                              borderRadius: '10px',
                              backgroundColor: '#fef3c7',
                              color: '#d97706',
                              border: '1px solid #fcd34d',
                              fontSize: '10px',
                              fontWeight: 800,
                              textTransform: 'uppercase',
                              width: 'fit-content',
                              marginTop: '2px'
                            }}>
                              📅 EVENT WORK
                            </span>
                          )}
                        </div>
                        <span 
                          style={{
                            backgroundColor: stageDetails.badgeBg,
                            color: stageDetails.badgeText,
                            border: `1px solid ${stageDetails.border}`,
                            padding: '4px 10px',
                            borderRadius: '12px',
                            fontSize: '11px',
                            fontWeight: 800,
                            textTransform: 'uppercase',
                            letterSpacing: '0.3px'
                          }}
                        >
                          {stageDetails.label}
                        </span>
                      </div>

                      <h3 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 10px 0', color: 'var(--text-color)' }}>
                        {item.deliverable}
                      </h3>

                      <div style={{ fontSize: '12px', marginBottom: '12px', display: 'flex', gap: '4px', alignItems: 'center' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Due Date:</span>
                        <strong style={{ color: isOverdue ? 'var(--danger)' : 'var(--text-color)', fontWeight: 800 }}>
                          {new Date(item.due_date).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </strong>
                        {isOverdue && (
                          <span style={{
                            backgroundColor: 'rgba(239, 68, 68, 0.1)',
                            color: 'var(--danger)',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            fontSize: '10px',
                            fontWeight: 800,
                            textTransform: 'uppercase',
                            marginLeft: '4px'
                          }}>
                            Overdue
                          </span>
                        )}
                      </div>

                      {isOverdue && (
                        <div style={{
                          backgroundColor: '#fef2f2',
                          border: '1px solid #fee2e2',
                          borderRadius: 'var(--radius-sm, 6px)',
                          padding: '12px',
                          margin: '12px 0',
                          fontSize: '13px',
                          color: '#b91c1c',
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '8px'
                        }}>
                          <AlertCircle size={16} style={{ marginTop: '2px', flexShrink: 0 }} />
                          <div>
                            <strong>Pending Reason: </strong>
                            {getPendingReason(item)}
                          </div>
                        </div>
                      )}
                      
                      {item.description && (
                        <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '0 0 16px 0', lineHeight: 1.4, whiteSpace: 'pre-wrap' }}>
                          {item.description.split(/Approved Content\/Script Link:/i)[0].trim()}
                        </p>
                      )}
                      {item.content_link && (
                        <div style={{ margin: '0 0 16px 0', fontSize: '13px' }}>
                          <strong style={{ color: 'var(--text-color)' }}>Content Link: </strong>
                          <a 
                            href={ensureExternalLink(item.content_link)} 
                            target="_blank" 
                            rel="noreferrer" 
                            style={{ color: 'var(--primary)', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px', textDecoration: 'underline' }}
                          >
                            Open Script/Document <ExternalLink size={12} />
                          </a>
                        </div>
                      )}
                    </div>

                    <div 
                      style={{ 
                        borderTop: '1px solid var(--border-color)', 
                        paddingTop: '12px', 
                        marginTop: '12px', 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontSize: '13px'
                      }}
                    >
                      {assigningItemId === item.id ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', width: '100%' }}>
                          {(() => {
                            const actCode = (item.activity_type_code || '').toUpperCase();
                            const isVideo = ['AT004', 'AT005', 'REELS', 'YT', 'YTS'].some(code => actCode.includes(code) || (item.deliverable || '').toLowerCase().includes('video') || (item.deliverable || '').toLowerCase().includes('reel'));
                            const reqSubDept = isVideo ? 3 : 2;
                            let filteredEmployees = getFilteredEmployees(reqSubDept, employees).filter(e => Number(e.sub_department_id) !== 3);
                            if (item.assigned_employee_id) {
                              const currEmp = employees.find(e => e.id === item.assigned_employee_id);
                              if (currEmp && Number(currEmp.sub_department_id) !== 3 && !filteredEmployees.some(e => e.id === currEmp.id)) {
                                filteredEmployees = [...filteredEmployees, currEmp];
                              }
                            }
                            return (
                              <select
                                value={selectedDesigner}
                                onChange={(e) => setSelectedDesigner(e.target.value)}
                                style={{
                                  flex: 1,
                                  padding: '6px 8px',
                                  borderRadius: 'var(--radius-sm)',
                                  border: '1px solid var(--primary)',
                                  fontSize: '12px',
                                  outline: 'none',
                                  backgroundColor: '#ffffff'
                                }}
                              >
                                {filteredEmployees.length === 0 ? (
                                  <option value="">No matching role employees</option>
                                ) : (
                                  filteredEmployees.map(emp => (
                                    <option key={emp.id} value={emp.id}>{emp.full_name} ({emp.employee_id_code.split(' ')[0]})</option>
                                  ))
                                )}
                              </select>
                            );
                          })()}

                          <button
                            onClick={() => handleSaveAssignment(item)}
                            style={{
                              padding: '6px',
                              backgroundColor: 'var(--success)',
                              color: '#ffffff',
                              border: 'none',
                              borderRadius: 'var(--radius-sm)',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                            title="Save assignment"
                          >
                            <Check size={14} />
                          </button>

                          <button
                            onClick={() => setAssigningItemId(null)}
                            style={{
                              padding: '6px',
                              backgroundColor: 'var(--bg-light)',
                              color: 'var(--text-muted)',
                              border: '1px solid var(--border-color)',
                              borderRadius: 'var(--radius-sm)',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                            title="Cancel"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ) : (
                        <>
                          {(() => {
                            const requiresContent = [1, 2, 4].includes(Number(item.sub_department_id)) || ['AT001', 'AT002', 'AT003', 'AT004', 'AT005', 'AT006', 'AT008'].includes(item.activity_type_code);
                            const hasContent = Boolean(item.content_link);

                            if (requiresContent && !hasContent) {
                              const writerName = item.content_writer_name || 'Content Writer';
                              return (
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                  <span style={{ color: 'var(--text-muted)', fontSize: '11px', fontWeight: 600 }}>Content Writer</span>
                                  <strong style={{ color: 'var(--text-color)', fontSize: '13px' }}>
                                    {writerName}
                                  </strong>
                                </div>
                              );
                            }

                            const isDesignerAssigned = Boolean(
                              item.assigned_employee_id && 
                              Number(item.assigned_employee_id) !== Number(item.content_writer_id)
                            );

                            const assignedEmp = isDesignerAssigned 
                              ? employees.find(e => Number(e.id) === Number(item.assigned_employee_id)) 
                              : null;

                            let roleTitle = 'Specialist';
                            if (assignedEmp && assignedEmp.sub_department_name) {
                              roleTitle = assignedEmp.sub_department_name;
                            } else if (assignedEmp && (assignedEmp.sub_department_code === 'CRD-RS' || (assignedEmp.full_name || '').includes('Creative Designer'))) {
                              roleTitle = 'Creative Designer';
                            } else if (assignedEmp && (assignedEmp.sub_department_code === 'VE-RS' || (assignedEmp.full_name || '').includes('Video Editor'))) {
                              roleTitle = 'Video Editor';
                            } else if (assignedEmp && (assignedEmp.sub_department_code === 'GD-RS' || (assignedEmp.full_name || '').includes('Graphic Designer'))) {
                              roleTitle = 'Graphic Designer';
                            } else {
                              const actCode = (item.activity_type_code || '').toUpperCase();
                              const isVideo = ['AT004', 'AT005', 'REELS', 'YT', 'YTS'].some(code => actCode.includes(code) || (item.deliverable || '').toLowerCase().includes('video') || (item.deliverable || '').toLowerCase().includes('reel'));
                              roleTitle = isVideo ? 'Video Editor / Creative Designer' : 'Graphic Designer';
                            }

                            const assignedName = isDesignerAssigned ? (item.employee_name || item.assigned_employee_name || (assignedEmp ? assignedEmp.full_name : 'Assigned')) : 'Unassigned';

                            return (
                              <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <span style={{ color: 'var(--text-muted)', fontSize: '11px', fontWeight: 600 }}>{roleTitle}</span>
                                <strong style={{ color: 'var(--text-color)', fontSize: '13px' }}>
                                  {assignedName}
                                </strong>
                              </div>
                            );
                           })()}

                           <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                             {deliverablesFilter === 'approved' || ['completed', 'posted', 'client_approved'].includes(status) ? (
                               <span 
                                 style={{
                                   padding: '6px 12px',
                                   backgroundColor: '#d1fae5',
                                   color: '#065f46',
                                   border: '1px solid #a7f3d0',
                                   borderRadius: 'var(--radius-sm)',
                                   fontSize: '12px',
                                   fontWeight: 700,
                                   display: 'inline-flex',
                                   alignItems: 'center',
                                   gap: '4px'
                                 }}
                               >
                                 <CheckCircle size={12} /> Completed & Posted
                               </span>
                             ) : ((!item.content_link) && ([1, 2, 4].includes(Number(item.sub_department_id)) || ['AT001', 'AT002', 'AT003', 'AT004', 'AT005', 'AT006', 'AT008'].includes(item.activity_type_code))) ? (
                               <span 
                                 style={{
                                   padding: '6px 12px',
                                   backgroundColor: '#f1f5f9',
                                   color: '#64748b',
                                   border: '1px solid #e2e8f0',
                                   borderRadius: 'var(--radius-sm)',
                                   fontSize: '12px',
                                   fontWeight: 700,
                                   display: 'inline-flex',
                                   alignItems: 'center',
                                   gap: '4px'
                                 }}
                                 title="Content script must be submitted by Content Writer before designer assignment."
                               >
                                 <AlertCircle size={12} style={{ color: '#94a3b8' }} />
                                 Awaiting Content ({item.content_writer_name || assignedName || 'Unassigned'})
                               </span>
                            ) : (
                              <button
                                onClick={() => startAssigning(item)}
                                style={{
                                  padding: '6px 12px',
                                  backgroundColor: 'var(--primary-light)',
                                  color: 'var(--primary)',
                                  border: '1px solid rgba(79, 70, 229, 0.15)',
                                  borderRadius: 'var(--radius-sm)',
                                  fontSize: '12px',
                                  fontWeight: 700,
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '4px'
                                }}
                              >
                                <UserPlus size={12} />
                                Assign Work
                              </button>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      ) : (
        /* JOB WORKS VIEW (WITH Life Cycle States) */
        <>
          {/* Job Work filtration control */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
            {[
              { code: 'all', label: 'Today Work' },
              { code: 'pending_work', label: 'Pending Work' },
              { code: 'pending_content', label: 'Pending Content' },
              { code: 'content_approval_pending', label: 'Content Approval Pending' },
              { code: 'assign_designer_pending', label: 'Assign Designer Pending' },
              { code: 'rework', label: 'Rework' },
              { code: 'sent_to_client', label: 'Sent to Client' },
              { code: 'approved', label: 'Completed' }
            ].map(f => (
              <button
                key={f.code}
                onClick={() => setJobWorksTabFilter(f.code)}
                style={{
                  padding: '6px 14px',
                  backgroundColor: jobWorksTabFilter === f.code ? '#f3e8ff' : 'transparent',
                  color: jobWorksTabFilter === f.code ? '#6b21a8' : 'var(--text-muted)',
                  border: jobWorksTabFilter === f.code ? '1px solid #c084fc' : '1px solid var(--border-color)',
                  borderRadius: '20px',
                  fontWeight: 700,
                  fontSize: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Group Filtration control */}
          <div style={{
            display: 'flex',
            gap: '16px',
            marginBottom: '24px',
            flexWrap: 'wrap',
            alignItems: 'center',
            backgroundColor: 'var(--bg-light)',
            padding: '16px',
            borderRadius: '12px',
            border: '1px solid var(--border-color)'
          }}>
            <div style={{ flex: 1, minWidth: '220px', position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="text"
                placeholder="Search job works..."
                value={jobSearchQuery}
                onChange={(e) => setJobSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px 8px 36px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)',
                  fontSize: '14px',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          {filteredJobWorks.length === 0 ? (
            <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--border-color)', padding: '60px 40px', textAlign: 'center', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)' }}>
              <CheckCircle2 size={44} style={{ color: 'var(--success)', marginBottom: '12px' }} />
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: 'var(--text-color)' }}>No Job Works found</h3>
              <p style={{ margin: '8px 0 0 0', color: 'var(--text-muted)', fontSize: '14px' }}>
                There are no Job Works matching the selected criteria.
              </p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px' }}>
              {filteredJobWorks.map(jw => {
                const status = (jw.status || '').toLowerCase();
                const hasContent = !!jw.content_link;
                const hasDesign = !!jw.google_drive_link;

                // Derive step name for user display
                let currentStepText = 'Unassigned';
                let stepColor = '#64748b';
                
                const isReworkStatus = ['reassigned', 'client_rework', 'rework'].includes(status);

                if (isReworkStatus) {
                  if (jw.assigned_employee_id) {
                    if (Number(jw.employee_sub_dept_id || jw.sub_department_id) === 3) {
                      currentStepText = 'Content Writer Rework In Progress';
                      stepColor = '#ef4444';
                    } else if ([1, 2, 4].includes(Number(jw.employee_sub_dept_id || jw.sub_department_id))) {
                      currentStepText = 'Designer Rework In Progress';
                      stepColor = '#ef4444';
                    } else {
                      currentStepText = 'Rework In Progress';
                      stepColor = '#ef4444';
                    }
                  } else {
                    currentStepText = 'Awaiting Rework Assignment';
                    stepColor = '#d97706';
                  }
                } else if (!jw.assigned_employee_id && !hasContent && ['pending', 'assigned'].includes(status)) {
                  currentStepText = 'Awaiting Content Writer Assignment';
                  stepColor = '#d97706';
                } else if (jw.assigned_employee_id && !hasContent && ['assigned', 'assigned_employee'].includes(status)) {
                  currentStepText = 'Content Writing In Progress';
                  stepColor = '#3b82f6';
                } else if (status === 'submitted' && !hasDesign) {
                  currentStepText = 'Content Script Submitted (Pending Review)';
                  stepColor = '#8b5cf6';
                } else if (status === 'approved' && !jw.assigned_employee_id) {
                  currentStepText = 'Content Approved (Awaiting Designer)';
                  stepColor = '#10b981';
                } else if (jw.assigned_employee_id && !hasDesign && ['assigned', 'assigned_employee'].includes(status)) {
                  currentStepText = 'Designing In Progress';
                  stepColor = '#06b6d4';
                } else if (status === 'submitted' && hasDesign) {
                  currentStepText = 'Design Output Submitted (Pending Review)';
                  stepColor = '#d946ef';
                } else if (status === 'approved' && jw.assigned_manager_id !== null) {
                  currentStepText = 'Approved & Routed to SMM';
                  stepColor = '#10b981';
                } else if (['completed', 'posted'].includes(status)) {
                  currentStepText = 'Completed';
                  stepColor = '#10b981';
                } else if (jw.assigned_employee_id) {
                  currentStepText = hasContent ? 'Designing In Progress' : 'Content Writing In Progress';
                  stepColor = hasContent ? '#06b6d4' : '#3b82f6';
                }

                const itemDate = jw.deadline ? jw.deadline.split(/[T ]/)[0] : '';
                const isOverdue = itemDate && itemDate < selectedDate;
                const isCompleted = ['completed', 'posted', 'client_approved'].includes(status);
                const displayStatus = (isOverdue && !isCompleted) ? 'pending' : status;

                let displayStatusLabel = displayStatus.replace('_', ' ');
                let colors = getStatusColors(displayStatus);

                const statusLower = status.toLowerCase();

                if (isReworkStatus) {
                  if (jw.assigned_employee_id) {
                    if (Number(jw.employee_sub_dept_id || jw.sub_department_id) === 3) {
                      displayStatusLabel = isOverdue ? 'PENDING' : 'REWORK WRITER';
                      colors = isOverdue ? getStatusColors('pending') : getStatusColors('rework');
                    } else if ([1, 2, 4].includes(Number(jw.employee_sub_dept_id || jw.sub_department_id))) {
                      displayStatusLabel = isOverdue ? 'PENDING' : 'REWORK DESIGNER';
                      colors = isOverdue ? getStatusColors('pending') : getStatusColors('rework');
                    } else {
                      displayStatusLabel = isOverdue ? 'PENDING' : 'REWORK';
                      colors = isOverdue ? getStatusColors('pending') : getStatusColors('rework');
                    }
                  } else {
                    displayStatusLabel = isOverdue ? 'PENDING' : 'REWORK';
                    colors = isOverdue ? getStatusColors('pending') : getStatusColors('rework');
                  }
                } else if (statusLower === 'submitted') {
                  displayStatusLabel = 'WAITING FOR APPROVAL';
                  colors = getStatusColors('submitted');
                } else if (statusLower === 'sent_to_client') {
                  displayStatusLabel = 'SENT TO CLIENT';
                  colors = getStatusColors('sent_to_client');
                } else if (statusLower === 'approved') {
                  displayStatusLabel = 'SCRIPT APPROVED';
                  colors = getStatusColors('approved');
                } else if (['completed', 'posted', 'client_approved'].includes(statusLower)) {
                  displayStatusLabel = 'COMPLETED';
                  colors = getStatusColors('completed');
                } else if (['assigned', 'assigned_employee', 'pending'].includes(displayStatus)) {
                  if (!jw.assigned_employee_id && !jw.smm_employee_id) {
                    displayStatusLabel = isOverdue ? 'PENDING' : 'UNASSIGNED';
                    colors = isOverdue ? getStatusColors('pending') : {
                      bg: '#ffffff',
                      border: '#fca5a5',
                      badgeBg: '#fef2f2',
                      badgeText: '#ef4444'
                    };
                  } else if (jw.assigned_employee_id) {
                    const isWriter = (Number(jw.employee_sub_dept_id) === 1 || Number(jw.assigned_employee_id) === Number(jw.content_writer_id)) && !hasContent;
                    if (isWriter) {
                      displayStatusLabel = isOverdue ? 'PENDING' : 'CONTENT WRITER';
                      colors = isOverdue ? getStatusColors('pending') : {
                        bg: '#f0f7ff',
                        border: '#bfdbfe',
                        badgeBg: '#eff6ff',
                        badgeText: '#2563eb'
                      };
                    } else {
                      displayStatusLabel = isOverdue ? 'PENDING' : 'DESIGNER';
                      colors = isOverdue ? getStatusColors('pending') : {
                        bg: '#fdf4ff',
                        border: '#f5d0fe',
                        badgeBg: '#fae8ff',
                        badgeText: '#d946ef'
                      };
                    }
                  } else if (jw.smm_employee_id) {
                    displayStatusLabel = isOverdue ? 'PENDING' : 'SMM STAFF';
                    colors = isOverdue ? getStatusColors('pending') : {
                      bg: '#f0fdf4',
                      border: '#bbf7d0',
                      badgeBg: '#ecfdf5',
                      badgeText: '#10b981'
                    };
                  }
                }

                if (isOverdue && !isCompleted) {
                  const jwDateStr = jw.deadline ? new Date(jw.deadline).toLocaleDateString('en-US', { day: '2-digit', month: 'short' }) : '';
                  displayStatusLabel = `PENDING (${jwDateStr})`;
                }

                return (
                  <div 
                    key={jw.id}
                    style={{
                      backgroundColor: colors.bg,
                      border: `1px solid ${colors.border}`,
                      borderRadius: 'var(--radius-md)',
                      padding: '24px',
                      boxShadow: 'var(--shadow-sm)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      borderLeft: `5px solid ${stepColor}`
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                          <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                            {jw.client_name}
                          </span>
                          <span style={{ fontFamily: 'monospace', fontSize: '11px', fontWeight: 800, color: 'var(--primary)' }}>
                            {jw.activity_code || `Job Work #${jw.id}`}
                          </span>
                        </div>
                        <span 
                          style={{
                            backgroundColor: colors.badgeBg,
                            color: colors.badgeText,
                            border: colors.border === 'var(--border-color)' ? '1px solid #cbd5e1' : `1px solid ${colors.border}`,
                            padding: '4px 10px',
                            borderRadius: '12px',
                            fontSize: '11px',
                            fontWeight: 800,
                            textTransform: 'uppercase',
                            textAlign: 'center'
                          }}
                        >
                          {displayStatusLabel}
                        </span>
                      </div>

                      <h3 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 10px 0', color: 'var(--text-color)' }}>
                        {jw.deliverable || jw.activity_name || 'Job Work'}
                      </h3>

                      <p style={{ fontSize: '12px', fontWeight: 700, color: stepColor, margin: '0 0 6px 0' }}>
                        Current Stage: {currentStepText}{jw.employee_name ? ` (${jw.employee_name})` : ''}
                      </p>

                      {jw.employee_name && (
                        <p style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', margin: '0 0 12px 0' }}>
                          Assigned Designer: <strong style={{ color: '#2563eb' }}>{jw.employee_name}</strong>
                        </p>
                      )}

                      <div style={{ fontSize: '12px', marginBottom: '12px', display: 'flex', gap: '4px', alignItems: 'center' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Deadline:</span>
                        <strong style={{ color: isOverdue ? 'var(--danger)' : 'var(--text-color)', fontWeight: 800 }}>
                          {jw.deadline ? new Date(jw.deadline).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }) : ''}
                        </strong>
                        {isOverdue && (
                          <span style={{
                            backgroundColor: 'rgba(239, 68, 68, 0.1)',
                            color: 'var(--danger)',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            fontSize: '10px',
                            fontWeight: 800,
                            textTransform: 'uppercase',
                            marginLeft: '4px'
                          }}>
                            Overdue
                          </span>
                        )}
                      </div>

                      {isOverdue && (
                        <div style={{
                          backgroundColor: '#fef2f2',
                          border: '1px solid #fee2e2',
                          borderRadius: 'var(--radius-sm, 6px)',
                          padding: '12px',
                          margin: '12px 0',
                          fontSize: '13px',
                          color: '#b91c1c',
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '8px'
                        }}>
                          <AlertCircle size={16} style={{ marginTop: '2px', flexShrink: 0 }} />
                          <div>
                            <strong>Pending Reason: </strong>
                            {getJobWorkPendingReason(jw)}
                          </div>
                        </div>
                      )}

                      {jw.description && (
                        <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '0 0 16px 0', lineHeight: 1.4, whiteSpace: 'pre-wrap' }}>
                          {jw.description}
                        </p>
                      )}

                      {/* Content Link */}
                      {hasContent && (
                        <div style={{ margin: '0 0 12px 0', fontSize: '13px' }}>
                          <strong style={{ color: 'var(--text-color)' }}>Content Link: </strong>
                          <a 
                            href={ensureExternalLink(jw.content_link)} 
                            target="_blank" 
                            rel="noreferrer" 
                            style={{ color: 'var(--primary)', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px', textDecoration: 'underline' }}
                          >
                            Open Script <ExternalLink size={12} />
                          </a>
                        </div>
                      )}

                      {/* Design Link */}
                      {hasDesign && (
                        <div style={{ margin: '0 0 16px 0', fontSize: '13px' }}>
                          <strong style={{ color: 'var(--text-color)' }}>Design Link: </strong>
                          <a 
                            href={ensureExternalLink(jw.google_drive_link)} 
                            target="_blank" 
                            rel="noreferrer" 
                            style={{ color: 'var(--primary)', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px', textDecoration: 'underline' }}
                          >
                            Open Design Draft <ExternalLink size={12} />
                          </a>
                        </div>
                      )}
                    </div>

                    <div 
                      style={{ 
                        borderTop: '1px solid var(--border-color)', 
                        paddingTop: '12px', 
                        marginTop: '12px',
                        display: 'flex', 
                        flexDirection: 'column',
                        gap: '12px',
                        fontSize: '13px'
                      }}
                    >
                      {/* Step 1: Assign Content Writer */}
                      {!jw.assigned_employee_id && !hasContent && ['pending', 'reassigned', 'assigned'].includes(status) && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)' }}>ASSIGN CONTENT CREATOR:</span>
                          {assigningJobId === jw.id ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', width: '100%' }}>
                              <select
                                value={selectedJobEmployee}
                                onChange={(e) => setSelectedJobEmployee(e.target.value)}
                                style={{
                                  flex: 1,
                                  padding: '6px 8px',
                                  borderRadius: 'var(--radius-sm)',
                                  border: '1px solid var(--primary)',
                                  fontSize: '12px',
                                  outline: 'none',
                                  backgroundColor: '#ffffff'
                                }}
                              >
                                <option value="">Select Writer</option>
                                {employees.filter(e => Number(e.sub_department_id) === 3 || e.sub_department_code === 'CW-RS' || (e.sub_department_code || '').toUpperCase().includes('CW') || (e.sub_department_name || '').toLowerCase().includes('content') || (e.sub_department_name || '').toLowerCase().includes('writer') || (e.sub_department_name || '').toLowerCase().includes('writing')).map(emp => (
                                  <option key={emp.id} value={emp.id}>{emp.full_name}</option>
                                ))}
                              </select>
                              <button
                                onClick={() => handleSaveJobAssignment(jw.id, selectedJobEmployee)}
                                className="btn btn-success"
                                style={{ padding: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                              >
                                <Check size={14} />
                              </button>
                              <button
                                onClick={() => setAssigningJobId(null)}
                                className="btn btn-light"
                                style={{ padding: '6px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                              >
                                <X size={14} />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => startAssigningJob(jw, 3)}
                              className="btn btn-primary"
                              style={{ width: '100%', padding: '8px', fontSize: '13px', fontWeight: 700 }}
                            >
                              <UserPlus size={14} /> Assign Content Creator
                            </button>
                          )}
                        </div>
                      )}

                      {/* Step 2: Content Writer In Progress */}
                      {jw.assigned_employee_id && !hasContent && status === 'assigned_employee' && (Number(jw.employee_sub_dept_id) === 1 || Number(jw.assigned_employee_id) === Number(jw.content_writer_id)) && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Assigned Writer:</span>
                          <strong style={{ fontSize: '13px' }}>{jw.employee_name || 'Content Writer'}</strong>
                        </div>
                      )}



                      {/* Step 4: Assign Designer */}
                      {(hasContent || status === 'approved') && !jw.assigned_employee_id && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)' }}>ASSIGN DESIGNER/EDITOR:</span>
                          {assigningJobId === jw.id ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', width: '100%' }}>
                              <select
                                value={selectedJobEmployee}
                                onChange={(e) => setSelectedJobEmployee(e.target.value)}
                                style={{
                                  flex: 1,
                                  padding: '6px 8px',
                                  borderRadius: 'var(--radius-sm)',
                                  border: '1px solid var(--primary)',
                                  fontSize: '12px',
                                  outline: 'none',
                                  backgroundColor: '#ffffff'
                                }}
                              >
                                <option value="">Select Designer / Video Editor</option>
                                {employees.filter(e => ['GD-RS', 'VE-RS', 'CRD-RS', '4321-RS'].includes(e.sub_department_code) || (e.sub_department_name || '').toLowerCase().includes('design') || (e.sub_department_name || '').toLowerCase().includes('graphic') || (e.sub_department_name || '').toLowerCase().includes('creative') || (e.sub_department_name || '').toLowerCase().includes('video') || (e.sub_department_name || '').toLowerCase().includes('editor') || (Number(e.sub_department_id) !== 3 && !e.sub_department_code?.includes('CW-RS') && !(e.sub_department_name || '').toLowerCase().includes('content'))).map(emp => (
                                  <option key={emp.id} value={emp.id}>{emp.full_name} ({emp.sub_department_name || 'Design/Video'})</option>
                                ))}
                              </select>
                              <button
                                onClick={() => handleSaveJobAssignment(jw.id, selectedJobEmployee)}
                                className="btn btn-success"
                                style={{ padding: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                              >
                                <Check size={14} />
                              </button>
                              <button
                                onClick={() => setAssigningJobId(null)}
                                className="btn btn-light"
                                style={{ padding: '6px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                              >
                                <X size={14} />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => startAssigningJob(jw, 1)}
                              className="btn btn-primary"
                              style={{ width: '100%', padding: '8px', fontSize: '13px', fontWeight: 700 }}
                            >
                              <UserPlus size={14} /> Assign Designer
                            </button>
                          )}
                        </div>
                      )}

                      {/* Step 5: Designer In Progress */}
                      {jw.assigned_employee_id && !hasDesign && status === 'assigned_employee' && [2, 3, 4].includes(Number(jw.employee_sub_dept_id)) && Number(jw.assigned_employee_id) !== Number(jw.content_writer_id) && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Assigned Designer:</span>
                          <strong style={{ fontSize: '13px' }}>{jw.employee_name || 'Designer'}</strong>
                        </div>
                      )}



                      {/* Step 7 & 8: Routed to SMM or Completed */}
                      {((status === 'approved' && jw.assigned_manager_id !== null && hasDesign) || ['completed', 'posted'].includes(status)) && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Workflow State:</span>
                          <strong style={{ fontSize: '13px', color: 'var(--success)' }}>
                            {status === 'approved' ? 'Routed to Social Media Manager' : 'Completed'}
                          </strong>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* REWORK FEEDBACK INPUT MODAL */}
      <Modal
        isOpen={reworkModal.isOpen}
        onClose={() => setReworkModal({ isOpen: false, jobId: null, feedbackText: '' })}
        title="Request Task Rework"
        footer={
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', width: '100%' }}>
            <button 
              onClick={() => setReworkModal({ isOpen: false, jobId: null, feedbackText: '' })}
              style={{
                padding: '8px 16px',
                backgroundColor: 'var(--bg-light)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-sm)',
                fontWeight: 700,
                fontSize: '13px',
                cursor: 'pointer',
                color: 'var(--text-muted)'
              }}
            >
              Cancel
            </button>
            <button 
              onClick={() => handleReviewJobWork(reworkModal.jobId, 'reassign', reworkModal.feedbackText)}
              style={{
                padding: '8px 16px',
                backgroundColor: 'var(--danger)',
                color: '#ffffff',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                fontWeight: 700,
                fontSize: '13px',
                cursor: 'pointer'
              }}
              disabled={!reworkModal.feedbackText.trim() || actionInProgress === reworkModal.jobId}
            >
              Confirm Rework
            </button>
          </div>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '13px', lineHeight: 1.4 }}>
            Please provide clear rework feedback and guidelines to the employee detailing what revisions are required.
          </p>
          <textarea
            value={reworkModal.feedbackText}
            onChange={(e) => setReworkModal(prev => ({ ...prev, feedbackText: e.target.value }))}
            placeholder="Write revisions instruction here..."
            style={{
              width: '100%',
              minHeight: '120px',
              padding: '12px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-color)',
              fontSize: '13px',
              outline: 'none',
              fontFamily: 'inherit',
              lineHeight: 1.5,
              resize: 'vertical'
            }}
            required
          />
        </div>
      </Modal>

      {/* CONFIRMATION POPUP MODAL */}
      <Modal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
        title={confirmModal.title}
        footer={
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', width: '100%' }}>
            <button 
              onClick={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
              style={{
                padding: '8px 16px',
                backgroundColor: 'var(--bg-light)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-sm)',
                fontWeight: 700,
                fontSize: '13px',
                cursor: 'pointer',
                color: 'var(--text-muted)'
              }}
            >
              Cancel
            </button>
            <button 
              onClick={() => {
                if (confirmModal.onConfirm) confirmModal.onConfirm();
                setConfirmModal(prev => ({ ...prev, isOpen: false }));
              }}
              style={{
                padding: '8px 16px',
                backgroundColor: 'var(--primary)',
                color: '#ffffff',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                fontWeight: 700,
                fontSize: '13px',
                cursor: 'pointer'
              }}
            >
              Confirm
            </button>
          </div>
        }
      >
        <p style={{ margin: 0, color: 'var(--text-color)', fontSize: '14px', lineHeight: 1.5 }}>
          {confirmModal.message}
        </p>
      </Modal>
    </div>
  );
};
export default ManagerDailyTodo;
