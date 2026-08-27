import React, { useState, useEffect, useCallback } from 'react';
import { 
  Building2, ArrowLeft, Calendar, Clock, Search, LineChart, 
  Paintbrush, Share2, Megaphone, Grid, FileText, AlertTriangle, 
  User, Filter, CheckCircle2, PlayCircle, Compass, ArrowRight, 
  ExternalLink, Layers, Info, X, Eye, CalendarClock, ChevronLeft, ChevronRight, History
} from 'lucide-react';
import api from '../../../utils/api';
import './WorkUpdates.css';

const WorkUpdates = () => {
  const [departments, setDepartments] = useState([]);
  const [loadingDepts, setLoadingDepts] = useState(true);
  const [selectedDept, setSelectedDept] = useState(null);
  
  // Tab and filter states
  const [mainTab, setMainTab] = useState('deliverable'); // 'deliverable' | 'job_work'
  const [subTab, setSubTab] = useState('daily'); // 'daily' | 'monthly'
  const [filterState, setFilterState] = useState('undone'); // 'undone' | 'pending' | 'completed'

  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().substring(0, 10); // YYYY-MM-DD
  });
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`; // YYYY-MM
  });

  // Search & Filter state
  const [search, setSearch] = useState('');
  const [employeeFilter, setEmployeeFilter] = useState(''); // employeeId
  const [employees, setEmployees] = useState([]);

  // Pagination state
  const [page, setPage] = useState(1);
  const limit = 10;

  // Raw list data state
  const [rawUpdates, setRawUpdates] = useState([]);
  const [loadingUpdates, setLoadingUpdates] = useState(false);

  // Tracker Drawer state
  const [selectedItem, setSelectedItem] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (selectedItem) {
      api.get(`/deliverables/job-work/${selectedItem.id}/history`, {
        params: { isJobWork: selectedItem.is_job_work === 1 ? 1 : 0 }
      })
        .then(res => {
          if (res.data.success) {
            setHistory(res.data.data || []);
          }
        })
        .catch(err => {
          console.error('Error fetching history:', err);
          setHistory([]);
        });
    } else {
      setHistory([]);
    }
  }, [selectedItem]);

  // Fetch departments list
  const fetchDepartmentsList = useCallback(async () => {
    setLoadingDepts(true);
    try {
      const response = await api.get('/departments', {
        params: {
          page: 1,
          limit: 100,
          statusFilter: 'active'
        }
      });
      if (response.data.success) {
        // Normalize names
        const cleaned = (response.data.data.departments || []).map(d => {
          if (d.code === 'SEO-RS') {
            return { ...d, name: 'SEO' };
          }
          return d;
        });
        setDepartments(cleaned);
        
        // Find creatives department (CD-RS) and set it as default
        const creativesDept = cleaned.find(d => d.code === 'CD-RS') || cleaned[0];
        if (creativesDept) {
          setSelectedDept(creativesDept);
        } else {
          setSelectedDept({ id: 1, name: 'Creatives', code: 'CD-RS' });
        }
      }
    } catch (err) {
      console.error('Error fetching departments:', err.message);
      setSelectedDept({ id: 1, name: 'Creatives', code: 'CD-RS' });
    } finally {
      setLoadingDepts(false);
    }
  }, []);

  useEffect(() => {
    fetchDepartmentsList();
  }, [fetchDepartmentsList]);

  // Fetch employees list for dropdown filter
  const fetchEmployeesList = useCallback(async () => {
    if (!selectedDept) return;
    try {
      const response = await api.get('/users/employees/dropdown', {
        params: { departmentId: selectedDept.id }
      });
      if (response.data.success) {
        setEmployees(response.data.data.employees || []);
      }
    } catch (err) {
      console.error('Error fetching employees:', err.message);
    }
  }, [selectedDept]);

  // Fetch updates list based on month (always fetch full month data to calculate counts on frontend)
  const fetchWorkUpdates = useCallback(async () => {
    if (!selectedDept) return;
    setLoadingUpdates(true);
    try {
      const response = await api.get('/deliverables/admin-updates/work', {
        params: {
          departmentId: selectedDept.id,
          tab: 'monthly',
          month: selectedMonth,
          limit: 100000,
          page: 1
        }
      });
      if (response.data.success) {
        setRawUpdates(response.data.data.updates || []);
      }
    } catch (err) {
      console.error('Error fetching work updates:', err.message);
    } finally {
      setLoadingUpdates(false);
    }
  }, [selectedDept, selectedMonth]);

  useEffect(() => {
    if (selectedDept) {
      fetchWorkUpdates();
    }
  }, [fetchWorkUpdates, selectedDept]);

  useEffect(() => {
    if (selectedDept) {
      fetchEmployeesList();
    }
  }, [fetchEmployeesList, selectedDept]);

  // Reset pagination and default filter when tab/filter states change
  useEffect(() => {
    setPage(1);
  }, [mainTab, subTab, filterState, search, employeeFilter, selectedDate, selectedMonth]);

  // Reset filterState to match subTab default values when switching sub-tabs (default to undone)
  useEffect(() => {
    setFilterState('undone');
  }, [subTab]);

  // Helper to map department code to Lucide Icon & Card Colors
  const getDeptStyles = (code) => {
    const formatted = (code || '').toUpperCase();
    if (formatted === 'CD-RS') {
      return {
        icon: <Paintbrush size={28} />,
        gradient: 'linear-gradient(135deg, #da851b 0%, #daaa1b 100%)',
        shadowColor: 'rgba(218, 133, 27, 0.35)'
      };
    } else if (formatted === 'SEO-RS') {
      return {
        icon: <LineChart size={28} />,
        gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        shadowColor: 'rgba(16, 185, 129, 0.35)'
      };
    } else if (formatted === 'SMM-RS') {
      return {
        icon: <Share2 size={28} />,
        gradient: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
        shadowColor: 'rgba(59, 130, 246, 0.35)'
      };
    }
    return {
      icon: <Building2 size={28} />,
      gradient: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
      shadowColor: 'rgba(107, 114, 128, 0.35)'
    };
  };

  // Helper to format duration beautifully
  const formatDuration = (ms) => {
    if (ms <= 0) return '0 hrs';
    const days = Math.floor(ms / (1000 * 60 * 60 * 24));
    const hours = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${mins}m`;
    return `${mins}m`;
  };

  // Helper to format date cleanly
  const formatDateTime = (dateVal) => {
    if (!dateVal) return 'N/A';
    const d = new Date(dateVal);
    return d.toLocaleString('en-US', { 
      day: '2-digit', 
      month: 'short', 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const getLocalDateOnlyStr = (d) => {
    if (!d) return '';
    try {
      const dateObj = new Date(d);
      return dateObj.toISOString().substring(0, 10);
    } catch (err) {
      return '';
    }
  };

  const renderPagination = (isTop = false) => {
    if (totalPages <= 1) return null;
    return (
      <div 
        className="table-pagination-footer" 
        style={{ 
          borderTop: isTop ? 'none' : '1px solid var(--border-color)', 
          borderBottom: isTop ? '1px solid var(--border-color)' : 'none',
          padding: '12px 20px',
          backgroundColor: 'var(--bg-light)',
          borderRadius: isTop ? '12px 12px 0 0' : '0 0 12px 12px'
        }}
      >
        <span className="pagination-summary">
          Showing page <strong>{page}</strong> of <strong>{totalPages}</strong> ({totalItems} total updates)
        </span>

        <div className="pagination-actions">
          <button
            className="pagination-btn"
            onClick={() => setPage(prev => Math.max(prev - 1, 1))}
            disabled={page === 1}
          >
            <ChevronLeft size={16} className="lucide lucide-chevron-left" /> Prev
          </button>
          <button
            className="pagination-btn"
            onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
            disabled={page === totalPages}
          >
            Next <ChevronRight size={16} className="lucide lucide-chevron-right" />
          </button>
        </div>
      </div>
    );
  };

  const todayStr = new Date().toISOString().substring(0, 10);

  // Stuck details helper to show current owner and details
  const getStuckDetails = (item) => {
    const status = (item.status || '').toLowerCase();
    
    // STRICTLY: Completed if and only if status is strictly 'posted'
    if (status === 'posted') {
      return { owner: 'Social Media', stage: 'Posted & Live', color: '#047857', desc: 'Work is fully completed and posted.' };
    }
    
    const hasContent = Boolean(item.content_link && String(item.content_link).trim() !== '');
    const isStage1Done = hasContent;
    if (!isStage1Done) {
      return { 
        owner: item.content_writer_name || 'Content Writer', 
        stage: 'Script Upload', 
        color: '#d97706', 
        desc: `Awaiting content script upload from ${item.content_writer_name || 'writer'}.` 
      };
    }
    
    const isDesignerAssigned = Boolean(item.assigned_employee_id) && Number(item.assigned_employee_id) !== Number(item.content_writer_id);
    const isStage2Done = isStage1Done && (isDesignerAssigned || ['submitted', 'sent_to_client', 'client_approved', 'posted'].includes(status));
    if (!isStage2Done) {
      return { 
        owner: item.manager_name || 'Creatives Manager', 
        stage: 'Content Review & Assignment', 
        color: '#b45309', 
        desc: 'Content approved. Awaiting manager designer assignment.' 
      };
    }
    
    const hasDesignOutput = Boolean((item.google_drive_link && String(item.google_drive_link).trim() !== '') || (item.designer_output && String(item.designer_output).trim() !== ''));
    const isStage3Done = isStage2Done && (hasDesignOutput || ['submitted', 'sent_to_client', 'client_approved', 'posted'].includes(status));
    if (!isStage3Done) {
      if (status === 'reassigned') {
        return { 
          owner: item.employee_name || 'Designer', 
          stage: 'Designer Rework', 
          color: '#dc2626', 
          desc: `Manager requested rework: "${item.remarks || 'Revise draft'}"` 
        };
      }
      if (status === 'client_rework') {
        return { 
          owner: item.employee_name || 'Designer', 
          stage: 'Client Rework', 
          color: '#dc2626', 
          desc: `Client requested rework: "${item.client_feedback_text || 'Revision requested'}"` 
        };
      }
      return { 
        owner: item.employee_name || 'Designer', 
        stage: 'Design Production', 
        color: '#2563eb', 
        desc: `Design draft in progress by ${item.employee_name || 'designer'}.` 
      };
    }
    
    const isStage4Done = isStage3Done && ['sent_to_client', 'client_approved', 'posted'].includes(status);
    if (!isStage4Done) {
      return { 
        owner: item.manager_name || 'Creatives Manager', 
        stage: 'Output Review', 
        color: '#7c3aed', 
        desc: 'Design submitted. Awaiting manager review.' 
      };
    }
    
    const isStage5Done = isStage4Done && ['client_approved', 'posted'].includes(status);
    if (!isStage5Done) {
      return { 
        owner: 'Client', 
        stage: 'Client Approval', 
        color: '#0891b2', 
        desc: `Sent to client. Awaiting review from ${item.client_name || 'client'}.` 
      };
    }
    
    // Stage 6: SMM Posting (since not 'posted' yet, it's stuck at SMM)
    return { 
      owner: item.smm_employee_name || 'SMM Employee', 
      stage: 'Publishing', 
      color: '#db2777', 
      desc: `Approved by client. Awaiting publishing from ${item.smm_employee_name || 'SMM staff'}.` 
    };
  };

  // Deriving filtered lists in memory
  const mainTabFiltered = rawUpdates.filter(item => 
    mainTab === 'deliverable' ? item.is_job_work === 0 : item.is_job_work === 1
  );

  // Search & Staff dropdown filtered
  const searchAndEmployeeFiltered = mainTabFiltered.filter(item => {
    if (search.trim()) {
      const term = search.toLowerCase();
      const clientName = (item.client_name || '').toLowerCase();
      const title = (item.deliverable || '').toLowerCase();
      const code = (item.activity_code || '').toLowerCase();
      if (!clientName.includes(term) && !title.includes(term) && !code.includes(term)) {
        return false;
      }
    }
    if (employeeFilter) {
      const isDesignerAssigned = item.is_job_work === 0 
        ? item.status !== 'pending' 
        : (item.status !== 'pending' && !!item.assigned_employee_id && Number(item.assigned_employee_id) !== Number(item.content_writer_id));

      const matchesDesigner = Number(item.assigned_employee_id) === Number(employeeFilter) && isDesignerAssigned;
      const matchesWriter = Number(item.content_writer_id) === Number(employeeFilter);

      if (!matchesDesigner && !matchesWriter) {
        return false;
      }
    }
    return true;
  });

  const isCompletedStatus = (item) => {
    if (!item) return false;
    const status = item.status;
    if (item.is_job_work === 1 || item.is_job_work === true) {
      return status === 'completed';
    }
    if (item.activity_type_code === 'AT006') { // Event Day
      return status === 'approved';
    }
    return status === 'posted';
  };

  const isPendingStatus = (item) => {
    if (!item) return false;
    const status = item.status;
    if (item.is_job_work === 1 || item.is_job_work === true) {
      return ['submitted', 'sent_to_client', 'client_rework', 'approved', 'client_approved'].includes(status);
    }
    if (item.activity_type_code === 'AT006') { // Event Day
      return status === 'submitted';
    }
    return ['submitted', 'sent_to_client', 'client_rework', 'client_approved'].includes(status);
  };

  const isMatchDaily = (item) => {
    if (!item) return false;
    return getLocalDateOnlyStr(item.due_date) === selectedDate;
  };

  // Calculate counts for sub-tabs dynamically based on search & staff filtered lists
  const getTabCounts = (items) => {
    const dailyUndone = items.filter(item => isMatchDaily(item) && !isCompletedStatus(item) && !isPendingStatus(item)).length;
    const dailyPending = items.filter(item => isMatchDaily(item) && isPendingStatus(item)).length;
    const dailyCompleted = items.filter(item => isMatchDaily(item) && isCompletedStatus(item)).length;

    const monthlyCompleted = items.filter(item => isCompletedStatus(item)).length;
    const monthlyUndone = items.filter(item => getLocalDateOnlyStr(item.due_date) >= todayStr && !isCompletedStatus(item)).length;
    const monthlyPending = items.filter(item => getLocalDateOnlyStr(item.due_date) < todayStr && !isCompletedStatus(item)).length;

    return {
      daily: { undone: dailyUndone, pending: dailyPending, completed: dailyCompleted },
      monthly: { completed: monthlyCompleted, undone: monthlyUndone, pending: monthlyPending }
    };
  };

  const counts = getTabCounts(searchAndEmployeeFiltered);

  // Filter list by sub-tab and filterState
  const getFilteredItems = (items) => {
    if (subTab === 'daily') {
      if (filterState === 'undone') {
        return items.filter(item => isMatchDaily(item) && !isCompletedStatus(item) && !isPendingStatus(item));
      } else if (filterState === 'pending') {
        return items.filter(item => isMatchDaily(item) && isPendingStatus(item));
      } else {
        return items.filter(item => isMatchDaily(item) && isCompletedStatus(item));
      }
    } else {
      if (filterState === 'completed') {
        return items.filter(item => isCompletedStatus(item));
      } else if (filterState === 'undone') {
        return items.filter(item => getLocalDateOnlyStr(item.due_date) >= todayStr && !isCompletedStatus(item));
      } else {
        return items.filter(item => getLocalDateOnlyStr(item.due_date) < todayStr && !isCompletedStatus(item));
      }
    }
  };

  const currentFilteredItems = getFilteredItems(searchAndEmployeeFiltered);

  // Pagination slicing
  const totalItems = currentFilteredItems.length;
  const totalPages = Math.ceil(totalItems / limit) || 1;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const updates = currentFilteredItems.slice(startIndex, endIndex);

  // Calculate detailed timeline progress stages & duration bottlenecks
  const calculateTimelineStages = (item) => {
    if (!item) return [];
    
    const now = new Date();
    const createdDate = new Date(item.created_at || now);
    const status = (item.status || '').toLowerCase();
    
    const timeline = [];

    // If we have history log events in state, use them to calculate progress
    if (history && history.length > 0) {
      const getEvent = (stageCode) => history.find(h => h.stage === stageCode);
      const getLatestEvent = (stageCode) => {
        const matching = history.filter(h => h.stage === stageCode);
        return matching.length > 0 ? matching[matching.length - 1] : null;
      };

      // Stage 1: Content Script Doc Phase
      const hasContent = !!item.content_link;
      const adminAssignEvt = getEvent('admin_assign');
      const writerSubmitEvt = getEvent('writer_submit_script');
      const isStage1Done = !!writerSubmitEvt || hasContent || !['pending', 'assigned'].includes(status);
      
      const stage1Start = adminAssignEvt ? new Date(adminAssignEvt.created_at) : createdDate;
      const stage1End = writerSubmitEvt ? new Date(writerSubmitEvt.created_at) : (isStage1Done ? new Date(item.updated_at) : null);
      const stage1Duration = stage1End ? formatDuration(stage1End - stage1Start) : formatDuration(now - stage1Start);

      timeline.push({
        title: 'Content Script Doc',
        status: isStage1Done ? 'completed' : 'pending',
        start: stage1Start,
        end: stage1End,
        duration: stage1Duration,
        detail: isStage1Done 
          ? `Script uploaded successfully by writer: ${item.content_writer_name || 'Content Writer'}.` 
          : `Awaiting content script upload from writer: ${item.content_writer_name || 'Content Writer'} (Designer cannot start work yet).`,
        link: item.content_link || null,
        linkText: 'Open Script Doc',
        pendingSince: !isStage1Done ? stage1Start : null
      });

      // Stage 2: Content Review & Designer Assignment
      const assignDesignerEvt = getEvent('manager_assign_designer');
      const approveScriptEvt = getEvent('manager_approve_script');
      const stage2EndEvt = assignDesignerEvt || approveScriptEvt;
      const isDesignerAssigned = Boolean(item.assigned_employee_id) && Number(item.assigned_employee_id) !== Number(item.content_writer_id);
      const isStage2Done = !!stage2EndEvt || (isStage1Done && (isDesignerAssigned || ['sent_to_client', 'client_approved', 'approved', 'completed', 'posted'].includes(status)));
      
      const stage2Start = stage1End || stage1Start;
      const stage2End = stage2EndEvt ? new Date(stage2EndEvt.created_at) : (isStage2Done ? new Date(item.updated_at) : null);
      const stage2Duration = stage2End ? formatDuration(stage2End - stage2Start) : (isStage1Done ? formatDuration(now - stage2Start) : '');

      timeline.push({
        title: 'Content Review & Assignment',
        status: isStage2Done ? 'completed' : isStage1Done ? 'pending' : 'upcoming',
        start: isStage1Done ? stage2Start : null,
        end: stage2End,
        duration: stage2Duration,
        detail: isStage2Done 
          ? `Content approved. Assigned to designer: ${item.employee_name || 'Designer'}.`
          : isStage1Done 
            ? `Script uploaded. Awaiting manager approval & designer assignment.`
            : `Awaiting script upload. (Assigned Designer: ${item.employee_name || 'Designer'}).`,
        pendingSince: isStage1Done && !isStage2Done ? stage2Start : null
      });

      // Stage 3: Designer Work Output
      const hasDesignOutput = (!!item.google_drive_link && String(item.google_drive_link).trim() !== '') || (!!item.designer_output && String(item.designer_output).trim() !== '');
      const designerSubmitEvt = getEvent('designer_submit_design');
      const isStage3Done = !!designerSubmitEvt || (hasDesignOutput && isStage2Done) || ['sent_to_client', 'client_approved', 'approved', 'completed', 'posted'].includes(status);
      
      const stage3Start = stage2End || stage2Start;
      const stage3End = designerSubmitEvt ? new Date(designerSubmitEvt.created_at) : (hasDesignOutput && isStage2Done ? new Date(item.updated_at) : null);
      const stage3Duration = stage3End ? formatDuration(stage3End - stage3Start) : (isStage2Done ? formatDuration(now - stage3Start) : '');

      timeline.push({
        title: 'Designer Work Output',
        status: isStage3Done ? 'completed' : isStage2Done ? 'pending' : 'upcoming',
        start: isStage2Done ? stage3Start : null,
        end: stage3End,
        duration: stage3Duration,
        detail: isStage3Done 
          ? `Design draft uploaded by designer: ${item.employee_name || 'Designer'}.` 
          : isStage2Done 
            ? `Work in progress by designer: ${item.employee_name || 'Designer'}.`
            : item.assigned_employee_id 
              ? `Awaiting script approval so designer can start.` 
              : `Awaiting designer assignment.`,
        link: (hasDesignOutput && isStage2Done) ? (item.google_drive_link || item.designer_output) : null,
        linkText: 'Open Design Output',
        pendingSince: isStage2Done && !isStage3Done ? stage3Start : null
      });

      // Stage 4: Manager Output Review
      const sendClientEvt = getEvent('manager_send_client');
      const routeSmmEvt = getEvent('manager_route_smm');
      const stage4EndEvt = sendClientEvt || routeSmmEvt;
      const isStage4Done = !!stage4EndEvt || ['sent_to_client', 'client_approved', 'client_rework', 'approved', 'completed', 'posted'].includes(status);
      
      const stage4Start = stage3End || stage3Start;
      const stage4End = stage4EndEvt ? new Date(stage4EndEvt.created_at) : (isStage4Done ? new Date(item.updated_at) : null);
      const stage4Duration = stage4End ? formatDuration(stage4End - stage4Start) : (isStage3Done ? formatDuration(now - stage4Start) : '');

      const isReworkScript = getLatestEvent('manager_rework_script');
      const isReworkDesign = getLatestEvent('manager_rework_design');
      const lastReworkText = isReworkDesign ? isReworkDesign.description : (isReworkScript ? isReworkScript.description : '');

      timeline.push({
        title: 'Manager Output Review',
        status: isStage4Done ? 'completed' : isStage3Done ? 'pending' : 'upcoming',
        start: isStage3Done ? stage4Start : null,
        end: stage4End,
        duration: stage4Duration,
        detail: status === 'reassigned' 
          ? `Rework requested by Manager: "${lastReworkText || item.remarks || 'Revise draft'}"`
          : isStage4Done 
            ? 'Design reviewed and approved by Manager.' 
            : isStage3Done 
              ? 'Design submitted. Awaiting Manager verification.'
              : 'Awaiting design draft.',
        pendingSince: isStage3Done && !isStage4Done ? stage4Start : null
      });

      // Stage 5: Client Approval
      const clientApproveEvt = getEvent('client_approve');
      const isStage5Done = !!clientApproveEvt || ['client_approved', 'approved', 'completed', 'posted'].includes(status);
      
      const stage5Start = stage4End || stage4Start;
      const stage5End = clientApproveEvt ? new Date(clientApproveEvt.created_at) : (isStage5Done ? new Date(item.updated_at) : null);
      const stage5Duration = stage5End ? formatDuration(stage5End - stage5Start) : ((isStage4Done && status === 'sent_to_client') ? formatDuration(now - stage5Start) : '');

      const clientReworkEvt = getLatestEvent('client_rework');

      timeline.push({
        title: 'Client Approval',
        status: isStage5Done ? 'completed' : (isStage4Done && status === 'sent_to_client') ? 'pending' : 'upcoming',
        start: isStage4Done ? stage5Start : null,
        end: stage5End,
        duration: stage5Duration,
        detail: status === 'client_rework' 
          ? `Rework requested by Client: "${clientReworkEvt ? clientReworkEvt.description : (item.client_feedback_text || 'Revision requested')}"`
          : isStage5Done 
            ? 'Client approved design draft.' 
            : (isStage4Done && status === 'sent_to_client')
              ? 'Sent to Client. Awaiting review feedback.'
              : 'Awaiting manager approval.',
        pendingSince: (isStage4Done && status === 'sent_to_client') && !isStage5Done ? stage5Start : null
      });

      // Stage 6: Social Media Posting
      const smmPostEvt = getEvent('smm_post');
      const isStage6Done = !!smmPostEvt || ['posted', 'completed'].includes(status);
      
      const stage6Start = stage5End || stage5Start;
      const stage6End = smmPostEvt ? new Date(smmPostEvt.created_at) : (isStage6Done ? new Date(item.updated_at) : null);
      const stage6Duration = stage6End ? formatDuration(stage6End - stage6Start) : (isStage5Done ? formatDuration(now - stage6Start) : '');

      timeline.push({
        title: 'Social Media Posting',
        status: isStage6Done ? 'completed' : isStage5Done ? 'pending' : 'upcoming',
        start: isStage5Done ? stage6Start : null,
        end: stage6End,
        duration: stage6Duration,
        detail: isStage6Done 
          ? `Published & Live on social accounts by SMM Staff: ${item.smm_employee_name || 'SMM Staff'}.` 
          : isStage5Done 
            ? `Assigned to SMM Staff: ${item.smm_employee_name || 'SMM Staff'}. Awaiting publish completion.`
            : `Awaiting client approval. (Assigned SMM Staff: ${item.smm_employee_name || 'SMM Staff'}).`,
        pendingSince: isStage5Done && !isStage6Done ? stage6Start : null
      });

      return timeline;
    }

    // Standard fallback logic (monthly deliverables)
    // Stage 1: Content Script Doc Phase
    const hasContent = Boolean(item.content_link && String(item.content_link).trim() !== '');
    const isStage1Done = hasContent;
    let stage1End = null;
    let stage1Duration = '';

    if (isStage1Done) {
      const maxMs = 4 * 60 * 60 * 1000;
      const actualMs = new Date(item.updated_at).getTime() > createdDate.getTime()
        ? Math.min(new Date(item.updated_at).getTime(), createdDate.getTime() + maxMs)
        : createdDate.getTime() + 1000 * 60 * 30; // 30 mins fallback
      stage1End = new Date(actualMs);
      stage1Duration = formatDuration(stage1End - createdDate);
    } else {
      stage1Duration = formatDuration(now - createdDate);
    }

    timeline.push({
      title: 'Content Script Doc',
      status: isStage1Done ? 'completed' : 'pending',
      start: createdDate,
      end: stage1End,
      duration: stage1Duration,
      detail: isStage1Done 
        ? `Script uploaded successfully by writer: ${item.content_writer_name || 'Content Writer'}.` 
        : `Awaiting content script upload from writer: ${item.content_writer_name || 'Content Writer'} (Designer cannot start work yet).`,
      link: item.content_link || null,
      linkText: 'Open Script Doc',
      pendingSince: !isStage1Done ? createdDate : null
    });

    // Stage 2: Content Review & Designer Assignment
    const isDesignerAssigned = Boolean(item.assigned_employee_id) && Number(item.assigned_employee_id) !== Number(item.content_writer_id);
    const isStage2Done = isStage1Done && (isDesignerAssigned || ['submitted', 'sent_to_client', 'client_approved', 'posted'].includes(status));
    let stage2Start = stage1End || createdDate;
    let stage2End = null;
    let stage2Duration = '';

    if (isStage2Done) {
      const actualMs = new Date(item.updated_at).getTime() > stage2Start.getTime()
        ? Math.min(new Date(item.updated_at).getTime(), stage2Start.getTime() + 3 * 60 * 60 * 1000)
        : stage2Start.getTime() + 1000 * 60 * 60; // 1 hr fallback
      stage2End = new Date(actualMs);
      stage2Duration = formatDuration(stage2End - stage2Start);
    } else if (isStage1Done) {
      stage2Duration = formatDuration(now - stage2Start);
    }

    timeline.push({
      title: 'Content Review & Assignment',
      status: isStage2Done ? 'completed' : isStage1Done ? 'pending' : 'upcoming',
      start: isStage1Done ? stage2Start : null,
      end: stage2End,
      duration: stage2Duration,
      detail: isStage2Done 
        ? `Content approved. Assigned to designer: ${item.employee_name || 'Designer'}.`
        : isStage1Done 
          ? `Script uploaded. Awaiting manager approval & designer assignment.`
          : `Awaiting script upload.`,
      pendingSince: isStage1Done && !isStage2Done ? stage2Start : null
    });

    // Stage 3: Designer Work Output
    const hasDesignOutput = Boolean((item.google_drive_link && String(item.google_drive_link).trim() !== '') || (item.designer_output && String(item.designer_output).trim() !== ''));
    const isStage3Done = isStage2Done && (hasDesignOutput || ['submitted', 'sent_to_client', 'client_approved', 'posted'].includes(status));
    let stage3Start = stage2End || createdDate;
    let stage3End = null;
    let stage3Duration = '';

    if (isStage3Done) {
      const actualMs = new Date(item.updated_at).getTime() > stage3Start.getTime()
        ? Math.min(new Date(item.updated_at).getTime(), stage3Start.getTime() + 6 * 60 * 60 * 1000)
        : stage3Start.getTime() + 1000 * 60 * 120; // 2 hrs fallback
      stage3End = new Date(actualMs);
      stage3Duration = formatDuration(stage3End - stage3Start);
    } else if (isStage2Done) {
      stage3Duration = formatDuration(now - stage3Start);
    }

    timeline.push({
      title: 'Designer Work Output',
      status: isStage3Done ? 'completed' : isStage2Done ? 'pending' : 'upcoming',
      start: isStage2Done ? stage3Start : null,
      end: stage3End,
      duration: stage3Duration,
      detail: isStage3Done 
        ? `Design draft uploaded by designer: ${item.employee_name || 'Designer'}.` 
        : isStage2Done 
          ? `Work in progress by designer: ${item.employee_name || 'Designer'}.`
          : item.assigned_employee_id 
            ? `Awaiting script approval so designer can start.` 
            : `Awaiting designer assignment.`,
      link: item.google_drive_link || item.designer_output || null,
      linkText: 'Open Design Output',
      pendingSince: isStage2Done && !isStage3Done ? stage3Start : null
    });

    // Stage 4: Manager Output Review
    const isStage4Done = isStage3Done && ['sent_to_client', 'client_approved', 'posted'].includes(status);
    let stage4Start = stage3End || createdDate;
    let stage4End = null;
    let stage4Duration = '';

    if (isStage4Done) {
      const actualMs = new Date(item.sent_to_client_at || item.updated_at).getTime() > stage4Start.getTime()
        ? Math.min(new Date(item.sent_to_client_at || item.updated_at).getTime(), stage4Start.getTime() + 2 * 60 * 60 * 1000)
        : stage4Start.getTime() + 1000 * 60 * 30; // 30 mins fallback
      stage4End = new Date(actualMs);
      stage4Duration = formatDuration(stage4End - stage4Start);
    } else if (isStage3Done) {
      stage4Duration = formatDuration(now - stage4Start);
    }

    timeline.push({
      title: 'Manager Output Review',
      status: isStage4Done ? 'completed' : isStage3Done ? 'pending' : 'upcoming',
      start: isStage3Done ? stage4Start : null,
      end: stage4End,
      duration: stage4Duration,
      detail: status === 'reassigned' 
        ? `Rework requested by Manager: "${item.remarks || 'Revise draft'}"`
        : isStage4Done 
          ? 'Design reviewed and approved by Manager.' 
          : isStage3Done 
            ? 'Design submitted. Awaiting Manager verification.'
            : 'Awaiting design draft.',
      pendingSince: isStage3Done && !isStage4Done ? stage4Start : null
    });

    // Stage 5: Client Approval
    const isStage5Done = isStage4Done && ['client_approved', 'posted'].includes(status);
    let stage5Start = stage4End || createdDate;
    let stage5End = null;
    let stage5Duration = '';

    if (isStage5Done) {
      const actualMs = new Date(item.client_action_at || item.updated_at).getTime() > stage5Start.getTime()
        ? Math.min(new Date(item.client_action_at || item.updated_at).getTime(), stage5Start.getTime() + 12 * 60 * 60 * 1000)
        : stage5Start.getTime() + 1000 * 60 * 180; // 3 hrs fallback
      stage5End = new Date(actualMs);
      stage5Duration = formatDuration(stage5End - stage5Start);
    } else if (isStage4Done && status === 'sent_to_client') {
      stage5Duration = formatDuration(now - stage5Start);
    }

    timeline.push({
      title: 'Client Approval',
      status: isStage5Done ? 'completed' : (isStage4Done && status === 'sent_to_client') ? 'pending' : 'upcoming',
      start: isStage4Done ? stage5Start : null,
      end: stage5End,
      duration: stage5Duration,
      detail: status === 'client_rework' 
        ? `Rework requested by Client: "${item.client_feedback_text || 'Revision requested'}"`
        : isStage5Done 
          ? 'Client approved design draft.' 
          : (isStage4Done && status === 'sent_to_client')
            ? 'Sent to Client. Awaiting review feedback.'
            : 'Awaiting manager approval.',
      pendingSince: (isStage4Done && status === 'sent_to_client') && !isStage5Done ? stage5Start : null
    });

    // Stage 6: Social Media Publishing
    const isStage6Done = status === 'posted';
    let stage6Start = stage5End || createdDate;
    let stage6End = null;
    let stage6Duration = '';

    if (isStage6Done) {
      stage6End = new Date(item.updated_at);
      stage6Duration = formatDuration(stage6End - stage6Start);
    } else if (isStage5Done) {
      stage6Duration = formatDuration(now - stage6Start);
    }

    timeline.push({
      title: 'Social Media Posting',
      status: isStage6Done ? 'completed' : isStage5Done ? 'pending' : 'upcoming',
      start: isStage5Done ? stage6Start : null,
      end: stage6End,
      duration: stage6Duration,
      detail: isStage6Done 
        ? `Published & Live on social accounts by SMM Staff: ${item.smm_employee_name || 'SMM Staff'}.` 
        : isStage5Done 
          ? `Assigned to SMM Staff: ${item.smm_employee_name || 'SMM Staff'}. Awaiting publish completion.`
          : `Awaiting client approval. (Assigned SMM Staff: ${item.smm_employee_name || 'SMM Staff'}).`,
      pendingSince: isStage5Done && !isStage6Done ? stage6Start : null
    });

    return timeline;
  };

  const displayHistory = selectedItem ? (() => {
    if (history && history.length > 0) {
      return history;
    }
    const simulated = [];
    const stages = calculateTimelineStages(selectedItem);
    
    // Stage 1 (Content Script Doc)
    const s1 = stages[0];
    if (s1 && s1.status === 'completed' && s1.end) {
      simulated.push({
        id: 'sim-1',
        action: 'Submitted Script Doc',
        description: s1.detail,
        created_at: s1.end,
        user_name: selectedItem.content_writer_name || 'Content Writer'
      });
    }
    
    // Stage 2 (Content Review & Assignment)
    const s2 = stages[1];
    if (s2 && s2.status === 'completed' && s2.end) {
      simulated.push({
        id: 'sim-2',
        action: 'Approved & Assigned Designer',
        description: `Content approved and assigned to designer: ${selectedItem.employee_name || 'Designer'}.`,
        created_at: s2.end,
        user_name: selectedItem.manager_name || 'Manager'
      });
    }
    
    // Stage 3 (Designer Work Output)
    const s3 = stages[2];
    if (s3 && s3.status === 'completed' && s3.end) {
      simulated.push({
        id: 'sim-3',
        action: 'Submitted Design Draft',
        description: s3.detail,
        created_at: s3.end,
        user_name: selectedItem.employee_name || 'Designer'
      });
    }
    
    // Stage 4 (Manager Output Review)
    const s4 = stages[3];
    if (s4 && s4.status === 'completed' && s4.end) {
      simulated.push({
        id: 'sim-4',
        action: 'Manager Approved Design',
        description: s4.detail,
        created_at: s4.end,
        user_name: selectedItem.manager_name || 'Manager'
      });
    }
    
    // Stage 5 (Client Approval)
    const s5 = stages[4];
    if (s5 && s5.status === 'completed' && s5.end) {
      simulated.push({
        id: 'sim-5',
        action: 'Client Approved Design',
        description: s5.detail,
        created_at: s5.end,
        user_name: 'Client'
      });
    }
    
    // Stage 6 (Social Media Posting)
    const s6 = stages[5];
    if (s6 && s6.status === 'completed' && s6.end) {
      simulated.push({
        id: 'sim-6',
        action: 'Social Media Posted',
        description: s6.detail,
        created_at: s6.end,
        user_name: selectedItem.smm_employee_name || 'SMM Staff'
      });
    }
    
    return simulated;
  })() : [];

  return (
    <div style={{ padding: '30px', maxWidth: '1400px', margin: '0 auto' }}>
      
      {/* Dynamic CSS Styling for Filter State Buttons */}
      <style>{`
        .filter-pill {
          padding: 8px 16px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 700;
          border: 1px solid var(--border-color);
          background-color: #ffffff;
          color: var(--text-muted);
          cursor: pointer;
          transition: all 0.2s ease;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }
        .filter-pill:hover {
          background-color: var(--bg-light);
          color: var(--text-color);
          border-color: var(--border-color);
        }
        .filter-pill.active {
          color: #ffffff;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
        }
        .filter-pill.active.active-undone {
          background-color: #f59e0b !important;
          border-color: #d97706 !important;
        }
        .filter-pill.active.active-pending {
          background-color: #ef4444 !important;
          border-color: #dc2626 !important;
        }
        .filter-pill.active.active-completed {
          background-color: #10b981 !important;
          border-color: #059669 !important;
        }
      `}</style>

      {/* HEADER SECTION */}
      <div style={{ marginBottom: '35px' }}>
        {selectedDept ? (
          <button 
            onClick={() => {
              setSelectedDept(null);
              setSearch('');
              setEmployeeFilter('');
              setSelectedItem(null);
            }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'none',
              border: 'none',
              color: 'var(--primary)',
              fontWeight: 700,
              fontSize: '14px',
              cursor: 'pointer',
              padding: '6px 0',
              marginBottom: '16px',
              transition: 'transform 0.2s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateX(-4px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateX(0)'}
          >
            <ArrowLeft size={16} /> Back to Departments
          </button>
        ) : null}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-color)', display: 'flex', alignItems: 'center', gap: '12px', margin: 0 }}>
              <Grid size={32} style={{ color: 'var(--primary)' }} />
              {selectedDept ? `${selectedDept.name} Work Updates` : 'Department Work Updates'}
            </h1>
            <p style={{ margin: '8px 0 0 0', color: 'var(--text-muted)', fontSize: '15px' }}>
              {selectedDept 
                ? `Track and monitor progress reports and stage milestones for the ${selectedDept.name} department.`
                 : 'Select a department below to view its today or monthly work updates and deliverables.'
              }
            </p>
          </div>
        </div>
      </div>

      {loadingDepts ? (
        <div style={{ padding: '120px', textAlign: 'center', color: 'var(--text-muted)' }}>
          <div style={{ width: '36px', height: '36px', border: '3px solid #e2e8f0', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px auto' }}></div>
          <span style={{ fontWeight: 600 }}>Loading departments...</span>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      ) : !selectedDept ? (
        /* DEPARTMENT CARDS GRID */
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
          gap: '24px',
          marginTop: '20px'
        }}>
          {departments.map((dept) => {
            const styles = getDeptStyles(dept.code);
            return (
              <div 
                key={dept.id}
                onClick={() => {
                  setSelectedDept(dept);
                  setMainTab('deliverable');
                  setSubTab('daily');
                  setFilterState('undone');
                }}
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid var(--border-color)',
                  borderRadius: '16px',
                  padding: '24px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-6px)';
                  e.currentTarget.style.boxShadow = `0 12px 20px -8px ${styles.shadowColor}`;
                  e.currentTarget.style.borderColor = 'var(--primary)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)';
                  e.currentTarget.style.borderColor = 'var(--border-color)';
                }}
              >
                {/* Accent Icon Box */}
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '14px',
                  background: styles.gradient,
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '20px',
                  boxShadow: `0 4px 10px ${styles.shadowColor}`
                }}>
                  {styles.icon}
                </div>

                <h3 style={{ fontSize: '18px', fontWeight: 800, margin: '0 0 8px 0', color: 'var(--text-color)' }}>
                  {dept.name}
                </h3>
                <span style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  color: 'var(--primary)',
                  backgroundColor: 'rgba(218, 167, 27, 0.1)',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  textTransform: 'uppercase',
                  display: 'inline-block',
                  marginBottom: '14px'
                }}>
                  {dept.code}
                </span>
                <p style={{ 
                  margin: 0, 
                  fontSize: '13px', 
                  color: 'var(--text-muted)',
                  lineHeight: 1.5,
                  minHeight: '40px'
                }}>
                  {dept.description || 'No description provided.'}
                </p>
              </div>
            );
          })}
        </div>
      ) : (
        /* REDESIGNED DEPARTMENT DETAIL PAGE */
        <div style={{
          backgroundColor: '#ffffff',
          border: '1px solid var(--border-color)',
          borderRadius: '16px',
          padding: '30px',
          boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
        }}>
          {/* TABS SELECTOR & MONTH FILTER PANEL */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            borderBottom: '1px solid var(--border-color)',
            paddingBottom: '20px',
            marginBottom: '24px',
            flexWrap: 'wrap',
            gap: '20px'
          }}>
            {/* Main Tabs (Daily Deliverables vs Job Work) */}
            <div className="tab-segment">
              <button
                className={`segment-btn ${mainTab === 'deliverable' ? 'active' : ''}`}
                onClick={() => {
                  setMainTab('deliverable');
                  setPage(1);
                }}
              >
                Daily Deliverables
              </button>
              <button
                className={`segment-btn ${mainTab === 'job_work' ? 'active' : ''}`}
                onClick={() => {
                  setMainTab('job_work');
                  setPage(1);
                }}
              >
                Job Work
              </button>
            </div>

            {/* Global Month Filter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Calendar size={18} style={{ color: 'var(--text-muted)' }} />
                <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-color)' }}>
                  Month:
                </span>
                <input 
                  type="month"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    fontWeight: 600,
                    outline: 'none',
                    fontSize: '13px'
                  }}
                />
              </div>
            </div>
          </div>

              {/* Sub-Tabs: Today Work vs Total Monthly Work */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', flexWrap: 'wrap', gap: '16px' }}>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    onClick={() => { setSubTab('daily'); setPage(1); }}
                    style={{
                      padding: '8px 20px',
                      borderRadius: '20px',
                      border: 'none',
                      fontSize: '13px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      backgroundColor: subTab === 'daily' ? 'var(--primary)' : 'transparent',
                      color: subTab === 'daily' ? '#ffffff' : 'var(--text-muted)',
                      boxShadow: subTab === 'daily' ? '0 2px 4px rgba(79, 70, 229, 0.2)' : 'none'
                    }}
                  >
                    Today Work
                  </button>
              <button
                onClick={() => { setSubTab('monthly'); setPage(1); }}
                style={{
                  padding: '8px 20px',
                  borderRadius: '20px',
                  border: 'none',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  backgroundColor: subTab === 'monthly' ? 'var(--primary)' : 'transparent',
                  color: subTab === 'monthly' ? '#ffffff' : 'var(--text-muted)',
                  boxShadow: subTab === 'monthly' ? '0 2px 4px rgba(79, 70, 229, 0.2)' : 'none'
                }}
              >
                Total Monthly Work
              </button>
            </div>

            {/* Date filter shown contextually for Today Work */}
            {subTab === 'daily' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Calendar size={18} style={{ color: 'var(--text-muted)' }} />
                <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-color)' }}>Date:</span>
                <input 
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    fontWeight: 600,
                    outline: 'none',
                    fontSize: '13px'
                  }}
                />
              </div>
            )}
          </div>

          {/* Sub-Tab Filter Pills */}
          {subTab === 'daily' ? (
            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
              <button
                onClick={() => { setFilterState('undone'); setPage(1); }}
                className={`filter-pill ${filterState === 'undone' ? 'active active-undone' : ''}`}
              >
                Undone ({counts.daily.undone})
              </button>
              <button
                onClick={() => { setFilterState('pending'); setPage(1); }}
                className={`filter-pill ${filterState === 'pending' ? 'active active-pending' : ''}`}
              >
                Pending ({counts.daily.pending})
              </button>
              <button
                onClick={() => { setFilterState('completed'); setPage(1); }}
                className={`filter-pill ${filterState === 'completed' ? 'active active-completed' : ''}`}
              >
                Completed ({counts.daily.completed})
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
              <button
                onClick={() => { setFilterState('undone'); setPage(1); }}
                className={`filter-pill ${filterState === 'undone' ? 'active active-undone' : ''}`}
              >
                Undone ({counts.monthly.undone})
              </button>
              <button
                onClick={() => { setFilterState('pending'); setPage(1); }}
                className={`filter-pill ${filterState === 'pending' ? 'active active-pending' : ''}`}
              >
                Pending ({counts.monthly.pending})
              </button>
              <button
                onClick={() => { setFilterState('completed'); setPage(1); }}
                className={`filter-pill ${filterState === 'completed' ? 'active active-completed' : ''}`}
              >
                Completed ({counts.monthly.completed})
              </button>
            </div>
          )}

          {/* SEARCH & DROP-DOWN FILTERS BAR */}
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
            {/* Text Search */}
            <div style={{ flex: 1, minWidth: '220px', position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="text"
                placeholder="Search by client, deliverable title..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
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

          {/* MAIN DATATABLE LISTING */}
          {loadingUpdates ? (
            <div style={{ padding: '80px 0', textAlign: 'center', color: 'var(--text-muted)' }}>
              <div style={{ width: '32px', height: '32px', border: '3px solid #e2e8f0', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 12px auto' }}></div>
              <span style={{ fontWeight: 600 }}>Loading updates...</span>
            </div>
          ) : updates.length === 0 ? (
            <div style={{ padding: '60px 0', textAlign: 'center', backgroundColor: 'var(--bg-light)', borderRadius: '12px', border: '1px dashed var(--border-color)' }}>
              <CalendarClock size={40} style={{ color: 'var(--text-muted)', marginBottom: '12px', opacity: 0.6 }} />
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: 'var(--text-color)' }}>No Updates Found</h3>
              <p style={{ margin: '6px 0 0 0', color: 'var(--text-muted)', fontSize: '13px' }}>
                There are no tasks matching the selected filters.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {renderPagination(true)}
              <div className="table-responsive">
                <table className="tracker-enterprise-table" style={{ width: '100%' }}>
                  <thead>
                    <tr>
                      <th style={{ padding: '14px 18px', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase' }}>Client</th>
                      <th style={{ padding: '14px 18px', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase' }}>Deliverable</th>
                      <th style={{ padding: '14px 18px', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase' }}>Deliverable Code</th>
                      <th style={{ padding: '14px 18px', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase' }}>Content Writer</th>
                      <th style={{ padding: '14px 18px', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase' }}>Designer</th>
                      <th style={{ padding: '14px 18px', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', width: '110px' }}>Due Date</th>
                      <th style={{ padding: '14px 18px', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', textAlign: 'center', width: '110px' }}>Tracker</th>
                    </tr>
                  </thead>
                  <tbody>
                    {updates.map(item => {
                      // Highlight past incomplete items in red, completed items in green
                      const isCompleted = item.status === 'posted';
                      const isOverdue = !isCompleted && getLocalDateOnlyStr(item.due_date) < todayStr;
                      
                      let textStyle = {};
                      if (isCompleted) {
                        textStyle = { color: '#047857' }; // Soft green
                      } else if (isOverdue) {
                        textStyle = { color: '#dc2626' }; // Soft red
                      }

                      // Only show Designer if they have actually been assigned manually by the manager
                      const isDesignerAssigned = item.is_job_work === 0 
                        ? item.status !== 'pending' 
                        : (item.status !== 'pending' && !!item.assigned_employee_id && Number(item.assigned_employee_id) !== Number(item.content_writer_id));

                      return (
                        <tr 
                          key={`${item.is_job_work ? 'job' : 'del'}_${item.id}`}
                          className="tracker-row-interactive"
                          style={{ borderBottom: '1px solid var(--border-color)' }}
                        >
                          <td style={{ padding: '14px 18px', fontWeight: 700, ...textStyle }}>
                            {item.client_name}
                          </td>
                          <td style={{ padding: '14px 18px', fontWeight: 600, ...textStyle }}>
                            {item.deliverable}
                            {(item.is_event_day === 1 || item.activity_type_code === 'AT006') && (
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
                                marginLeft: '8px',
                                textTransform: 'uppercase'
                              }}>
                                📅 EVENT WORK
                              </span>
                            )}
                          </td>
                          <td className="code-cell" style={{ padding: '14px 18px', ...textStyle }}>
                            {item.activity_code || `ID: #${item.id}`}
                          </td>
                          <td style={{ padding: '14px 18px', fontWeight: 600, ...textStyle }}>
                            {item.content_writer_name || <span style={{ color: 'var(--text-muted)', fontStyle: 'italic', fontWeight: 500 }}>Unassigned</span>}
                          </td>
                          <td style={{ padding: '14px 18px', fontWeight: 600, ...textStyle }}>
                            {isDesignerAssigned ? item.employee_name : <span style={{ color: 'var(--text-muted)', fontStyle: 'italic', fontWeight: 500 }}>Unassigned</span>}
                          </td>
                          <td className="date-cell" style={{ padding: '14px 18px', ...textStyle }}>
                            {new Date(item.due_date).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}
                          </td>
                          <td style={{ padding: '14px 18px', textAlign: 'center' }}>
                            <button
                              className="action-track-btn"
                              onClick={() => setSelectedItem(item)}
                            >
                              <Eye size={12} />
                              Track
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              {renderPagination(false)}
            </div>
          )}
        </div>
      )}

      {/* DETAILED TIMELINE SLIDING DRAWER PANEL */}
      {selectedItem && (
        <>
          {/* Backdrop overlay */}
          <div className="drawer-backdrop" onClick={() => setSelectedItem(null)}></div>
          
          {/* Sliding panel drawer */}
          <div className="drawer-panel">
            <div className="drawer-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div className="drawer-client-avatar">
                  {selectedItem.client_name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="drawer-client-name">{selectedItem.client_name}</h3>
                  <span className="drawer-activity-code">
                    {selectedItem.is_job_work ? 'Job Work' : 'Monthly Deliverable'} &bull; {selectedItem.activity_code}
                  </span>
                </div>
              </div>
              <button className="drawer-close-btn" onClick={() => setSelectedItem(null)}>
                <X size={20} />
              </button>
            </div>

            <div className="drawer-content">
              {/* Deliverable Metadata Card */}
              <div className="drawer-metadata-card">
                <div className="meta-card-row">
                  <span>DUE DATE</span>
                  <strong className="due-date-highlight">
                    {new Date(selectedItem.due_date).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </strong>
                </div>
                <div className="meta-card-row block">
                  <span>TASK NAME</span>
                  <p className="meta-task-name">{selectedItem.deliverable}</p>
                </div>
                {selectedItem.description && (
                  <div className="meta-card-row block border">
                    <span>TASK SPECIFICATION</span>
                    <p className="meta-task-description" style={{ whiteSpace: 'pre-wrap' }}>
                      {selectedItem.description.split(/Approved Content\/Script Link:/i)[0].trim()}
                    </p>
                  </div>
                )}
              </div>

              {/* Progress Stepper Section */}
              <h4 className="drawer-section-title">ERP Stage Milestone Timeline</h4>

              <div className="drawer-timeline-stepper">
                {calculateTimelineStages(selectedItem).map((stage, idx, arr) => {
                  let stepClass = 'drawer-step upcoming';
                  let icon = <Clock size={14} />;
                  
                  if (stage.status === 'completed') {
                    stepClass = 'drawer-step completed';
                    icon = <CheckCircle2 size={14} />;
                  } else if (stage.status === 'pending') {
                    stepClass = 'drawer-step pending';
                    icon = <AlertTriangle size={14} />;
                  }

                  return (
                    <div key={idx} className={stepClass}>
                      {idx < arr.length - 1 && <div className="drawer-step-connector"></div>}
                      
                      <div className="drawer-step-icon">
                        {icon}
                      </div>

                      <div className="drawer-step-details">
                        <div className="drawer-step-header">
                          <span className="drawer-step-title">{stage.title}</span>
                          {stage.status === 'completed' && (
                            <span className="drawer-time-badge completed">
                              {stage.duration}
                            </span>
                          )}
                          {stage.status === 'pending' && (
                            <span className="drawer-time-badge pending">
                              Delayed: {stage.duration}
                            </span>
                          )}
                        </div>

                        <p className="drawer-step-desc">{stage.detail}</p>

                        <div className="drawer-step-dates">
                          {stage.start && <span>Started: {formatDateTime(stage.start)}</span>}
                          {stage.end && <span>Completed: {formatDateTime(stage.end)}</span>}
                          {stage.pendingSince && (
                            <span className="overdue-alert">
                              <Info size={11} />
                              Pending since: {formatDateTime(stage.pendingSince)}
                            </span>
                          )}
                        </div>

                        {stage.link && (
                          <a 
                            href={stage.link}
                            target="_blank"
                            rel="noreferrer"
                            className="drawer-step-link"
                          >
                            <ExternalLink size={12} />
                            {stage.linkText}
                          </a>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {displayHistory && displayHistory.length > 0 && (
                <div style={{ marginTop: '30px', borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
                  <h4 className="drawer-section-title" style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <History size={16} /> Detailed Action & Rework History
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {displayHistory.map((log) => (
                      <div 
                        key={log.id} 
                        style={{
                          backgroundColor: '#f8fafc',
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px',
                          padding: '14px 16px',
                          fontSize: '13px',
                          position: 'relative'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                          <span style={{ fontWeight: 800, color: '#1e293b' }}>
                            {log.action}
                          </span>
                          <span style={{ fontSize: '11px', color: '#64748b', whiteSpace: 'nowrap' }}>
                            {formatDateTime(new Date(log.created_at))}
                          </span>
                        </div>
                        <p style={{ margin: '0 0 6px 0', color: '#475569', lineHeight: 1.4 }}>
                          {log.description}
                        </p>
                        {log.user_name && (
                          <div style={{ fontSize: '11px', color: 'var(--primary)', fontWeight: 700 }}>
                            Action by: {log.user_name}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default WorkUpdates;
