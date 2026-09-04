import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Edit2, Trash2, Key, Ban, CheckCircle, Search, RefreshCw, BarChart3, Award, ListTodo, CheckCircle2, HelpCircle } from 'lucide-react';
import api from '../../../utils/api';
import Table from '../../../components/Table';
import Modal from '../../../components/Modal';
import { FormInput, FormSelect } from '../../../components/FormFields';

const EmployeeList = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  // Sorting & Search
  const [sortColumn, setSortColumn] = useState('full_name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('active');
  const [deptFilter, setDeptFilter] = useState('');

  // Tabs & Efficiency states
  const [activeTab, setActiveTab] = useState('details');
  const [efficiencyData, setEfficiencyData] = useState([]);
  const [effLoading, setEffLoading] = useState(false);
  const [effSearch, setEffSearch] = useState('');
  const [effDeptFilter, setEffDeptFilter] = useState('');
  const [effFilterType, setEffFilterType] = useState('daily');
  const [effDate, setEffDate] = useState(() => new Date().toISOString().substring(0, 10));
  const [effMonth, setEffMonth] = useState(() => new Date().toISOString().substring(0, 7));
  const [deliverables, setDeliverables] = useState([]);
  const [jobWorks, setJobWorks] = useState([]);
  const [contentSubmissions, setContentSubmissions] = useState([]);
  const [calendarItems, setCalendarItems] = useState([]);

  // Dropdown lists
  const [departments, setDepartments] = useState([]);
  const [subDepartments, setSubDepartments] = useState([]);
  const [managers, setManagers] = useState([]);

  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isResetOpen, setIsResetOpen] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [isCalculationModalOpen, setIsCalculationModalOpen] = useState(false);
  const [selectedEmployeeForCalculation, setSelectedEmployeeForCalculation] = useState(null);
  const [currentEmployee, setCurrentEmployee] = useState(null);

  // Form Fields
  const [formData, setFormData] = useState({
    full_name: '',
    username: '',
    password: '',
    email: '',
    phone: '',
    sub_department_id: '',
    department_id: '',
    reporting_manager_id: '',
    joining_date: '',
    status: 'active'
  });
  
  const [formErrors, setFormErrors] = useState({});
  const [formSubmitError, setFormSubmitError] = useState('');

  // Reset password fields
  const [newPassword, setNewPassword] = useState('');
  const [resetError, setResetError] = useState('');

  const fetchDropdowns = useCallback(async () => {
    try {
      const [deptRes, mgrRes] = await Promise.all([
        api.get('/departments'),
        api.get('/users/managers/dropdown')
      ]);
      
      if (deptRes.data.success) {
        setDepartments(deptRes.data.data.departments.map(d => ({ value: d.id, label: d.name })));
      }
      if (mgrRes.data.success) {
        setManagers(mgrRes.data.data.managers.map(m => ({ value: m.id, label: m.full_name })));
      }
    } catch (err) {
      console.error('Error loading dropdown lists:', err.message);
    }
  }, []);

  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/users/employees', {
        params: {
          page,
          limit,
          sortColumn,
          sortOrder,
          searchQuery: search,
          departmentFilter: deptFilter,
          statusFilter
        }
      });
      if (response.data.success) {
        setData(response.data.data.employees);
        setTotal(response.data.data.pagination.total);
      }
    } catch (err) {
      console.error('Error fetching employees:', err.message);
    } finally {
      setLoading(false);
    }
  }, [page, sortColumn, sortOrder, search, deptFilter, statusFilter]);

  useEffect(() => {
    fetchDropdowns();
  }, [fetchDropdowns]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const fetchEfficiency = useCallback(async () => {
    setEffLoading(true);
    try {
      const [effRes, delivsRes, jobsRes, contentRes, calRes] = await Promise.all([
        api.get('/users/efficiency', {
          params: {
            filterType: effFilterType,
            date: effDate,
            month: effMonth,
            departmentFilter: effDeptFilter || 'all'
          }
        }),
        api.get('/deliverables', { params: { limit: 10000, page: 1 } }),
        api.get('/deliverables/job-work/manager'),
        api.get('/content-work/submissions').catch(() => ({ data: { success: false, data: [] } })),
        api.get('/calendar', { params: { month: effMonth } }).catch(() => ({ data: { success: false, data: [] } }))
      ]);

      if (effRes.data.success) {
        setEfficiencyData(effRes.data.data || []);
      }
      if (delivsRes.data.success) {
        setDeliverables(delivsRes.data.data.deliverables || []);
      }
      if (jobsRes.data.success) {
        setJobWorks(jobsRes.data.data || []);
      }
      if (contentRes && contentRes.data && contentRes.data.success) {
        setContentSubmissions(contentRes.data.data || []);
      }
      if (calRes && calRes.data && calRes.data.success) {
        setCalendarItems(calRes.data.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch employee efficiency:', err.message);
    } finally {
      setEffLoading(false);
    }
  }, [effFilterType, effDate, effMonth, effDeptFilter]);

  useEffect(() => {
    if (activeTab === 'efficiency') {
      fetchEfficiency();
    }
  }, [activeTab, fetchEfficiency]);

  const fetchSubDepartments = useCallback(async (deptId) => {
    if (!deptId) {
      setSubDepartments([]);
      return;
    }
    try {
      const res = await api.get(`/departments/${deptId}/sub-departments`);
      if (res.data.success) {
        setSubDepartments(res.data.data.subDepartments || []);
      }
    } catch (err) {
      console.error('Failed to fetch sub-departments:', err.message);
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (name === 'department_id') {
      setFormData(prev => ({ ...prev, sub_department_id: '' }));
      fetchSubDepartments(value);
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.full_name.trim()) errors.full_name = 'Full name is required.';
    
    if (!formData.username.trim()) {
      errors.username = 'Username is required.';
    } else if (formData.username.trim().length < 3) {
      errors.username = 'Username must be at least 3 characters.';
    }

    if (!currentEmployee) {
      if (!formData.password.trim()) {
        errors.password = 'Initial password is required.';
      } else if (formData.password.trim().length < 6) {
        errors.password = 'Password must be at least 6 characters.';
      }
    } else {
      if (formData.password && formData.password.trim().length > 0 && formData.password.trim().length < 6) {
        errors.password = 'Password must be at least 6 characters.';
      }
    }

    if (!formData.email.trim()) {
      errors.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Email format is invalid.';
    }

    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required.';
    } else if (!/^\+?[0-9\s\-()]{10,20}$/.test(formData.phone)) {
      errors.phone = 'Phone number format is invalid.';
    }

    if (!formData.department_id) errors.department_id = 'Department assignment is required.';
    if (!formData.joining_date) errors.joining_date = 'Joining date is required.';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxDim = 200; // Optimal size for database storage and speed
        let width = img.width;
        let height = img.height;
        if (width > height) {
          if (width > maxDim) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          }
        } else {
          if (height > maxDim) {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        const webpBase64 = canvas.toDataURL('image/webp', 0.85); // Convert to WebP format
        setFormData(prev => ({ ...prev, profile_image: webpBase64 }));
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleOpenCreate = () => {
    setCurrentEmployee(null);
    setSubDepartments([]); // Clear sub-departments list
    setFormData({
      full_name: '',
      username: '',
      password: '',
      email: '',
      phone: '',
      department_id: '',
      sub_department_id: '',
      reporting_manager_id: '',
      joining_date: new Date().toISOString().split('T')[0],
      status: 'active',
      profile_image: null
    });
    setFormErrors({});
    setFormSubmitError('');
    setIsFormOpen(true);
  };

  const handleOpenEdit = async (emp) => {
    setCurrentEmployee(emp);
    await fetchSubDepartments(emp.department_id); // Fetch sub-departments before modal opens
    setFormData({
      full_name: emp.full_name,
      username: emp.username,
      password: '',
      email: emp.email,
      phone: emp.phone,
      department_id: emp.department_id,
      sub_department_id: emp.sub_department_id || '',
      reporting_manager_id: emp.reporting_manager_id || '',
      joining_date: emp.joining_date,
      status: emp.status,
      profile_image: emp.profile_image || null
    });
    setFormErrors({});
    setFormSubmitError('');
    setIsFormOpen(true);
  };

  const handleOpenReset = (emp) => {
    setCurrentEmployee(emp);
    setNewPassword('');
    setResetError('');
    setIsResetOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      setFormSubmitError('Please fill in all required fields. Scroll down to see all fields.');
      return;
    }

    setFormSubmitError('');
    try {
      let res;
      if (currentEmployee) {
        try {
          res = await api.post(`/users/employees/${currentEmployee.id}/update`, formData);
        } catch (_) {
          res = await api.put(`/users/employees/${currentEmployee.id}`, formData);
        }
      } else {
        res = await api.post('/users/employees', formData);
      }

      if (res.data.success) {
        setIsFormOpen(false);
        fetchEmployees();
      }
    } catch (err) {
      const serverMsg = err.response?.data?.message;
      const serverErrors = err.response?.data?.errors;
      if (Array.isArray(serverErrors) && serverErrors.length > 0) {
        setFormSubmitError(`Validation Error: ${serverErrors.join('. ')}`);
      } else if (serverMsg) {
        setFormSubmitError(serverMsg);
      } else {
        setFormSubmitError('An unexpected server error occurred. Please check your network connection.');
      }
    }
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      setResetError('Password must be at least 6 characters.');
      return;
    }

    try {
      const res = await api.post('/users/reset-password', {
        profileId: currentEmployee.id,
        userType: 'employee',
        newPassword
      });

      if (res.data.success) {
        setIsResetOpen(false);
        alert('Employee password reset successfully.');
      }
    } catch (err) {
      setResetError(err.response?.data?.message || 'Reset failed.');
    }
  };

  const handleDelete = async (id) => {
    if (!(await window.confirm('Are you sure you want to permanently delete this employee from the database?'))) return;
    try {
      try {
        await api.post(`/users/employees/${id}/delete`);
      } catch (_) {
        await api.delete(`/users/employees/${id}`);
      }
      setData(prev => prev.filter(item => item.id !== id));
      setTotal(prev => Math.max(0, prev - 1));
      fetchEmployees();
    } catch (err) {
      console.error('Delete failed:', err.message);
      alert(err.response?.data?.message || 'Failed to delete employee profile.');
    }
  };

  const handleToggleStatus = async (emp) => {
    const nextStatus = emp.status === 'active' ? 'inactive' : 'active';
    try {
      await api.post('/users/change-status', {
        profileId: emp.id,
        userType: 'employee',
        status: nextStatus
      });
      fetchEmployees();
    } catch (err) {
      console.error('Status toggling failed:', err.message);
    }
  };

  const columns = [
    { key: 'employee_id_code', label: 'Employee ID', sortable: true, width: '120px' },
    { 
      key: 'full_name', 
      label: 'Full Name', 
      sortable: true,
      render: (val, row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {row.profile_image ? (
            <img 
              src={row.profile_image} 
              alt={val} 
              style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--border-color)', flexShrink: 0 }} 
            />
          ) : (
            <div style={{ 
              width: '36px', 
              height: '36px', 
              borderRadius: '50%', 
              backgroundColor: 'var(--primary-light)', 
              color: 'var(--primary)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              fontWeight: '700',
              fontSize: '11px',
              flexShrink: 0
            }}>
              {val ? val.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : '?'}
            </div>
          )}
          <span style={{ fontWeight: 600 }}>{val}</span>
        </div>
      )
    },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'phone', label: 'Phone' },
    { key: 'department_name', label: 'Department', sortable: true },
    { 
      key: 'sub_department_name', 
      label: 'Sub-Department', 
      sortable: true,
      render: (val, row) => row.sub_department_name || row.department_name || 'N/A'
    },
    { key: 'joining_date', label: 'Joining Date', sortable: true },
    { 
      key: 'status', 
      label: 'Status', 
      sortable: true,
      render: (val) => (
        <span className={`badge ${val === 'active' ? 'badge-active' : 'badge-inactive'}`}>
          {val}
        </span>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="btn btn-secondary btn-sm" onClick={() => handleOpenEdit(row)} title="Edit profile">
            <Edit2 size={14} />
          </button>
          <button className="btn btn-secondary btn-sm" onClick={() => handleOpenReset(row)} title="Reset Password">
            <Key size={14} className="text-orange" />
          </button>
          <button 
            className="btn btn-secondary btn-sm" 
            onClick={() => handleToggleStatus(row)} 
            title={row.status === 'active' ? 'Deactivate' : 'Activate'}
          >
            {row.status === 'active' ? <Ban size={14} className="text-danger" /> : <CheckCircle size={14} className="text-success" />}
          </button>
          <button className="btn btn-secondary btn-sm" onClick={() => handleDelete(row.id)} title="Delete Employee">
            <Trash2 size={14} className="text-danger" />
          </button>
        </div>
      )
    }
  ];

  const workloadData = efficiencyData.map(emp => {
    const empId = Number(emp.id);

    const isWriter = emp.sub_department_code === 'CW-RS' || Number(emp.sub_department_id) === 1 || (emp.sub_department_name || '').toLowerCase().includes('content');
    
    let empDeliverables = [];
    let empJobWorks = [];
    let empContentTasks = [];

    if (isWriter) {
      // Content writers: workload comes from Content Calendar topics & Writer Job Works
      const writerDeliverables = deliverables.filter(d => {
        const status = (d.status || '').toLowerCase();
        if (status === 'cancelled' || status === 'deleted') return false;
        return Number(d.content_writer_id) === empId || Number(d.writer_id) === empId;
      });

      // Deduplicate multiple sub-deliverables (Post, Story, Reel) that share the same content calendar topic
      const seenTopics = new Set();
      empDeliverables = writerDeliverables.filter(d => {
        const key = d.content_calendar_id || d.calendar_id || d.topic || (d.deliverable ? `${d.deliverable}_${d.date || d.due_date || d.month}` : d.id);
        if (seenTopics.has(key)) return false;
        seenTopics.add(key);
        return true;
      });

      // Include calendar items if any exist that were not in deliverables
      calendarItems.forEach(c => {
        const status = (c.status || '').toLowerCase();
        if (status === 'cancelled' || status === 'deleted') return;
        const isAssigned = Number(c.content_writer_id) === empId || Number(c.writer_id) === empId;
        if (!isAssigned) return;
        const key = c.id || c.content_calendar_id;
        if (!seenTopics.has(key)) {
          seenTopics.add(key);
          empDeliverables.push(c);
        }
      });

      empJobWorks = jobWorks.filter(jw => {
        const status = (jw.status || '').toLowerCase();
        if (status === 'cancelled' || status === 'deleted') return false;
        return Number(jw.content_writer_id) === empId;
      });

      empContentTasks = contentSubmissions.filter(c => {
        const status = (c.submission_status || c.status || '').toLowerCase();
        if (status === 'cancelled' || status === 'deleted') return false;
        const isAssigned = Number(c.content_writer_id) === empId || Number(c.writer_id) === empId;
        if (!isAssigned) return false;
        const key = c.content_calendar_id || c.calendar_id || c.id;
        return !seenTopics.has(key);
      });
    } else {
      // Designers, Editors, SMM: workload comes from active assigned Deliverables & Job Works
      const activeDesignStatuses = [
        'assigned',
        'assigned_employee',
        'in_progress',
        'reassigned',
        'client_rework',
        'submitted',
        'sent_to_client',
        'approved',
        'client_approved',
        'completed',
        'posted'
      ];

      empDeliverables = deliverables.filter(d => {
        const status = (d.status || '').toLowerCase();
        if (!activeDesignStatuses.includes(status)) return false;
        return (
          Number(d.assigned_employee_id) === empId || 
          Number(d.smm_employee_id) === empId
        );
      });
      
      empJobWorks = jobWorks.filter(jw => {
        const status = (jw.status || '').toLowerCase();
        if (status === 'cancelled' || status === 'deleted') return false;
        return (
          Number(jw.assigned_employee_id) === empId || 
          Number(jw.smm_employee_id) === empId
        );
      });
    }

    let filteredDelivs = [];
    let filteredJobs = [];
    let filteredContent = [];

    const matchesMonth = (itemMonth, targetMonth) => {
      if (!itemMonth) return false;
      const str = String(itemMonth).replace(/,/g, '').trim().toLowerCase();
      const targetStr = String(targetMonth).trim().toLowerCase();
      if (str === targetStr || str.substring(0, 7) === targetStr) return true;
      
      const parts = targetMonth.split('-');
      if (parts.length < 2) return false;
      const targetYear = parts[0];
      const targetMm = parts[1];
      
      const dateObj = new Date(Number(targetYear), Number(targetMm) - 1, 1);
      if (isNaN(dateObj.getTime())) return false;
      
      const shortMonth = dateObj.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }).toLowerCase();
      const longMonth = dateObj.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }).toLowerCase();
      
      return str === shortMonth || str === longMonth || str.includes(longMonth) || str.includes(shortMonth);
    };

    const getTaskDueDateStr = (t) => {
      let raw = t.due_date || t.deadline || t.date || '';
      if (!raw || String(raw).startsWith('0000') || String(raw).startsWith('1970')) return '';
      return String(raw).split(/[T ]/)[0];
    };

    if (effFilterType === 'daily') {
      filteredDelivs = empDeliverables.filter(d => {
        const dueStr = getTaskDueDateStr(d);
        return dueStr === effDate;
      });
      filteredJobs = empJobWorks.filter(jw => {
        const dueStr = getTaskDueDateStr(jw);
        return dueStr === effDate || (!dueStr && (jw.created_at || '').split(/[T ]/)[0] === effDate);
      });
      filteredContent = empContentTasks.filter(c => {
        const dueStr = getTaskDueDateStr(c);
        return dueStr === effDate || (!dueStr && (c.date || c.created_at || '').split(/[T ]/)[0] === effDate);
      });
    } else {
      filteredDelivs = empDeliverables.filter(d => {
        const dueStr = getTaskDueDateStr(d);
        const dueMonth = dueStr ? dueStr.substring(0, 7) : '';
        if (dueMonth && dueMonth === effMonth) return true;
        if (d.month && matchesMonth(d.month, effMonth)) return true;
        return false;
      });
      filteredJobs = empJobWorks.filter(jw => {
        const dueStr = getTaskDueDateStr(jw);
        const dueMonth = dueStr ? dueStr.substring(0, 7) : '';
        if (dueMonth && dueMonth === effMonth) return true;
        if (jw.month && matchesMonth(jw.month, effMonth)) return true;
        return false;
      });
      filteredContent = empContentTasks.filter(c => {
        const dueStr = getTaskDueDateStr(c);
        const dueMonth = dueStr ? dueStr.substring(0, 7) : '';
        if (dueMonth && dueMonth === effMonth) return true;
        if (c.month && matchesMonth(c.month, effMonth)) return true;
        return false;
      });
    }

    const allPeriodTasks = [...filteredDelivs, ...filteredJobs, ...filteredContent];

    const taskDetails = allPeriodTasks.map(task => {
      const isJobWork = task.is_job_work === undefined && !task.category;
      const rawDue = isJobWork ? task.deadline : (task.due_date || task.date);
      const dueStr = rawDue ? String(rawDue).split(/[T ]/)[0] : '';

      const statusVal = (task.submission_status || task.status || '').toLowerCase();
      const isCompleted = ['submitted', 'script_submitted', 'completed', 'approved', 'client_approved', 'posted', 'sent_to_client'].includes(statusVal);
      const completionDate = task.updated_at ? String(task.updated_at).split(/[T ]/)[0] : '';

      let timingStatus = 'On Time';
      if (isCompleted) {
        if (completionDate && dueStr && completionDate > dueStr) {
          timingStatus = 'Completed Late';
        } else {
          timingStatus = 'On Time';
        }
      } else {
        const compareDate = effFilterType === 'daily' ? effDate : `${effMonth}-31`;
        if (dueStr && dueStr < compareDate) {
          timingStatus = 'Overdue';
        } else {
          timingStatus = 'Pending';
        }
      }

      return {
        name: task.title || task.activity_name || task.deliverable || task.activity_type_code || 'Task',
        type: task.category ? (task.category === 'event_days' ? 'Event Day' : 'Content Calendar') : (isJobWork ? 'Job Work' : 'Deliverable'),
        dueDate: dueStr,
        completedDate: isCompleted ? (completionDate || dueStr) : '',
        status: statusVal,
        timingStatus
      };
    });

    const computedTotal = taskDetails.length;
    const computedCompleted = taskDetails.filter(t => 
      ['On Time', 'Completed Late'].includes(t.timingStatus) || 
      ['submitted', 'script_submitted', 'completed', 'approved', 'client_approved', 'posted', 'sent_to_client'].includes((t.status || '').toLowerCase())
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

  const filteredEffData = workloadData.filter(emp => {
    const matchesSearch = emp.full_name?.toLowerCase().includes(effSearch.toLowerCase()) ||
                          emp.employee_id_code?.toLowerCase().includes(effSearch.toLowerCase());
    const selectedDeptOpt = departments.find(d => Number(d.value) === Number(effDeptFilter));
    const matchesDept = !effDeptFilter || (selectedDeptOpt && selectedDeptOpt.label.startsWith(emp.department_name));
    return matchesSearch && matchesDept;
  });

  const totalEffTasks = filteredEffData.reduce((sum, emp) => sum + (Number(emp.total_tasks) || 0), 0);
  const completedEffTasks = filteredEffData.reduce((sum, emp) => sum + (Number(emp.completed_tasks) || 0), 0);
  const avgEffScore = filteredEffData.length > 0
    ? Math.round(filteredEffData.reduce((sum, emp) => sum + (Number(emp.efficiency) || 0), 0) / filteredEffData.length)
    : 100;

  const effColumns = [
    { key: 'employee_id_code', label: 'Employee ID', sortable: false, width: '120px' },
    {
      key: 'full_name',
      label: 'Employee Name',
      render: (val, row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {row.profile_image ? (
            <img 
              src={row.profile_image} 
              alt={val} 
              style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--border-color)', flexShrink: 0 }} 
            />
          ) : (
            <div style={{ 
              width: '36px', 
              height: '36px', 
              borderRadius: '50%', 
              backgroundColor: 'var(--primary-light)', 
              color: 'var(--primary)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              fontWeight: '700',
              fontSize: '11px',
              flexShrink: 0
            }}>
              {val ? val.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : '?'}
            </div>
          )}
          <span style={{ fontWeight: 600 }}>{val}</span>
        </div>
      )
    },
    { key: 'department_name', label: 'Department' },
    {
      key: 'sub_department_name',
      label: 'Sub-Department / Role',
      render: (val, row) => row.sub_department_name || row.department_name || 'N/A'
    },
    {
      key: 'total_tasks',
      label: 'Assigned Tasks',
      render: (val) => <span style={{ fontWeight: 600 }}>{val}</span>
    },
    {
      key: 'completed_tasks',
      label: 'Completed Tasks',
      render: (val) => <span style={{ fontWeight: 600, color: 'var(--success)' }}>{val}</span>
    },
    {
      key: 'efficiency',
      label: 'Efficiency Score',
      render: (val, row) => {
        let progressColor = 'var(--success)';
        if (val < 50) progressColor = 'var(--danger)';
        else if (val < 80) progressColor = 'var(--warning)';

        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ flex: 1, height: '8px', backgroundColor: '#e2e8f0', borderRadius: '4px', overflow: 'hidden', minWidth: '100px' }}>
                <div style={{ width: `${val}%`, height: '100%', backgroundColor: progressColor, borderRadius: '4px' }}></div>
              </div>
              <span style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-color)', width: '40px', textAlign: 'right' }}>{val}</span>
            </div>
            <button
              className="btn btn-secondary btn-sm"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedEmployeeForCalculation(row);
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
    <div className="page-container">
      {/* Page Header */}
      {activeTab === 'details' ? (
        <div className="page-header">
          <div className="page-title-section">
            <h2>Employees Directory</h2>
            <span className="page-subtitle">Manage direct employees, reporting hierarchies, departments, and portal access</span>
          </div>
        </div>
      ) : (
        <div className="page-header">
          <div className="page-title-section">
            <h2>Employee Efficiency Report</h2>
            <span className="page-subtitle">Overall employee performance statistics calculated by comparing completed deliverables vs. assigned tasks</span>
          </div>
          <button className="btn btn-secondary" onClick={fetchEfficiency} disabled={effLoading}>
            <RefreshCw size={14} className={effLoading ? 'spin' : ''} style={{ marginRight: '6px' }} /> Refresh
          </button>
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
          {/* Filter and Search Bar */}
          <div className="table-toolbar">
            <div className="toolbar-left">
              <div className="table-search">
                <Search size={16} className="text-muted" />
                <input
                  type="text"
                  placeholder="Search by name, ID, email..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                />
              </div>
              <select
                name="deptFilter"
                value={deptFilter}
                onChange={(e) => {
                  setDeptFilter(e.target.value);
                  setPage(1);
                }}
                className="filter-select"
              >
                <option value="">All Departments</option>
                {departments.map((opt, index) => (
                  <option key={index} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <select
                name="statusFilter"
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(1);
                }}
                className="filter-select"
              >
                <option value="">All Statuses</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* Core Table */}
          <Table
            columns={columns}
            data={data}
            loading={loading}
            pagination={{
              page,
              limit,
              total,
              totalPages: Math.ceil(total / limit),
              onPageChange: (p) => setPage(p)
            }}
            sorting={{
              sortColumn,
              sortOrder,
              onSort: (col, ord) => {
                setSortColumn(col);
                setSortOrder(ord);
              }
            }}
          />
        </>
      ) : (
        <>

          {/* Filter and Search Bar for Efficiency */}
          <div className="table-toolbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', backgroundColor: '#fff', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md) var(--radius-md) 0 0', borderBottom: 'none' }}>
            <div style={{ display: 'flex', gap: '12px', flex: 1, flexWrap: 'wrap', alignItems: 'center' }}>
              <div className="table-search" style={{ width: '220px' }}>
                <Search size={16} className="text-muted" />
                <input
                  type="text"
                  placeholder="Search employee..."
                  value={effSearch}
                  onChange={(e) => setEffSearch(e.target.value)}
                />
              </div>
              <select
                value={effFilterType}
                onChange={(e) => setEffFilterType(e.target.value)}
                className="filter-select"
                style={{ width: '135px', padding: '8px 12px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)' }}
              >
                <option value="daily">Daily Filter</option>
                <option value="monthly">Monthly Filter</option>
              </select>
              {effFilterType === 'daily' ? (
                <input 
                  type="date"
                  value={effDate}
                  onChange={(e) => setEffDate(e.target.value)}
                  style={{ padding: '6px 12px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', outline: 'none' }}
                />
              ) : (
                <input 
                  type="month"
                  value={effMonth}
                  onChange={(e) => setEffMonth(e.target.value)}
                  style={{ padding: '6px 12px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', outline: 'none' }}
                />
              )}
              <select
                name="effDeptFilter"
                value={effDeptFilter}
                onChange={(e) => setEffDeptFilter(e.target.value)}
                className="filter-select"
                style={{ width: '180px' }}
              >
                <option value="">All Departments</option>
                {departments.map((opt, index) => (
                  <option key={index} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => setIsInfoModalOpen(true)}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontWeight: 700, marginLeft: 'auto', padding: '8px 12px', height: '38px' }}
              >
                <HelpCircle size={16} /> How is it calculated?
              </button>
            </div>
          </div>

          {/* Efficiency Table Container */}
          <div style={{ backgroundColor: '#fff', border: '1px solid var(--border-color)', borderRadius: '0 0 var(--radius-md) var(--radius-md)', overflowX: 'auto' }}>
            <Table
              columns={effColumns}
              data={filteredEffData}
              loading={effLoading}
              emptyMessage="No performance metrics available."
            />
          </div>
        </>
      )}

      {/* CREATE / EDIT EMPLOYEE MODAL */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={currentEmployee ? `Edit Employee: ${currentEmployee.full_name}` : 'Register New Employee'}
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setIsFormOpen(false)}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleFormSubmit}>
              {currentEmployee ? 'Save Changes' : 'Create Employee'}
            </button>
          </>
        }
      >
        <form onSubmit={handleFormSubmit}>
          {formSubmitError && (
            <div style={{ padding: '10px 14px', backgroundColor: 'var(--danger-light)', color: 'var(--danger)', borderRadius: '4px', fontSize: '13px', fontWeight: 600, marginBottom: '16px' }}>
              {formSubmitError}
            </div>
          )}



          <FormInput
            label="Full Name"
            name="full_name"
            value={formData.full_name}
            onChange={handleInputChange}
            error={formErrors.full_name}
            required
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <FormInput
              label="Username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              error={formErrors.username}
              placeholder="e.g. kishore_dev"
              required
            />
            <FormInput
              label={currentEmployee ? "New Password (Optional)" : "Initial Password"}
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              error={formErrors.password}
              placeholder={currentEmployee ? "Leave blank to keep existing password" : "Min 6 characters required"}
              required={!currentEmployee}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <FormInput
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              error={formErrors.email}
              required
            />
            <FormInput
              label="Phone Number"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              error={formErrors.phone}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <FormSelect
              label="Department Assignment"
              name="department_id"
              value={formData.department_id}
              onChange={handleInputChange}
              options={departments}
              error={formErrors.department_id}
              required
            />
            <FormSelect
              label="Sub-department Assignment (Optional)"
              name="sub_department_id"
              value={formData.sub_department_id}
              onChange={handleInputChange}
              options={subDepartments.map(sd => ({ value: sd.id, label: `${sd.name} (${sd.code})` }))}
              error={formErrors.sub_department_id}
              disabled={!formData.department_id}
              emptyOptionLabel="None (Direct Department Employee)"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <FormSelect
              label="Reporting Manager (Optional)"
              name="reporting_manager_id"
              value={formData.reporting_manager_id}
              onChange={handleInputChange}
              options={managers}
              error={formErrors.reporting_manager_id}
              emptyOptionLabel="No Reporting Manager (Independent)"
            />
            <FormInput
              label="Joining Date"
              name="joining_date"
              type="date"
              value={formData.joining_date}
              onChange={handleInputChange}
              error={formErrors.joining_date}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <FormSelect
              label="Status"
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              options={[
                { value: 'active', label: 'Active' },
                { value: 'inactive', label: 'Inactive' }
              ]}
              required
            />
            <div></div>
          </div>
        </form>
      </Modal>

      {/* RESET PASSWORD MODAL */}
      <Modal
        isOpen={isResetOpen}
        onClose={() => setIsResetOpen(false)}
        title={currentEmployee ? `Reset Password: ${currentEmployee.full_name}` : 'Reset Password'}
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setIsResetOpen(false)}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleResetSubmit}>
              Update Password
            </button>
          </>
        }
      >
        <form onSubmit={handleResetSubmit}>
          {resetError && (
            <div style={{ padding: '10px 14px', backgroundColor: 'var(--danger-light)', color: 'var(--danger)', borderRadius: '4px', fontSize: '13px', fontWeight: 600, marginBottom: '16px' }}>
              {resetError}
            </div>
          )}

          <FormInput
            label="New Password"
            name="newPassword"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Min 6 characters required"
            required
          />
        </form>
      </Modal>

      {/* EFFICIENCY INFO MODAL */}
      <Modal
        isOpen={isInfoModalOpen}
        onClose={() => setIsInfoModalOpen(false)}
        title="Efficiency Score Calculation Formula"
        footer={
          <button className="btn btn-primary" onClick={() => setIsInfoModalOpen(false)}>
            Close
          </button>
        }
      >
        <div style={{ padding: '10px 0', color: 'var(--text-main)', fontSize: '14px', lineHeight: '1.6' }}>
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
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '10px 0 0 0' }}>
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

export default EmployeeList;
