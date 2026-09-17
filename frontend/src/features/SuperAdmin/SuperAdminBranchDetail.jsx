import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Building, ArrowLeft, RefreshCw, Plus, Edit, Trash2, 
  Users, UserCheck, ShieldAlert, BarChart3, HelpCircle, CalendarRange, Clock,
  Layers, Award, FileText, Play, Phone, ArrowRight, Search, Calendar, Eye, EyeOff, Send
} from 'lucide-react';
import api from '../../utils/api';
import Table from '../../components/Table';
import Modal from '../../components/Modal';

const SuperAdminBranchDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const branchId = Number(id);

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('admins'); // admins | managers | employees | efficiency | workflow | reports
  const [feedback, setFeedback] = useState({ type: '', text: '' });

  // Received Reports state
  const [receivedReports, setReceivedReports] = useState([]);
  const [reportsLoading, setReportsLoading] = useState(false);
  const [selectedReportType, setSelectedReportType] = useState('client'); 
  const [selectedCampaignDept, setSelectedCampaignDept] = useState(null);
  const [activeCampaignReportTab, setActiveCampaignReportTab] = useState('daily');
  const [viewingReportDetail, setViewingReportDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [departmentsList, setDepartmentsList] = useState([]);
  const [saCampaignSearchQuery, setSaCampaignSearchQuery] = useState('');
  const [saSelectedMonth, setSaSelectedMonth] = useState(() => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
  });
  const [saSelectedDate, setSaSelectedDate] = useState('');

  // Modal State for Admin CRUD
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [adminForm, setAdminForm] = useState({
    id: null,
    username: '',
    email: '',
    password: '',
    branchId: branchId
  });
  const [isEditingAdmin, setIsEditingAdmin] = useState(false);
  const [showAdminPassword, setShowAdminPassword] = useState(false);

  const closeAssignModal = () => {
    setIsAdminModalOpen(false);
    setShowAdminPassword(false);
  };

  const fetchBranchDetails = useCallback(async () => {
    setLoading(true);
    setFeedback({ type: '', text: '' });
    try {
      const res = await api.get(`/super-admin/branches/${branchId}`);
      if (res.data.success) {
        setData(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching branch details:', err.message);
      setFeedback({ type: 'danger', text: 'Failed to retrieve detailed statistics for this branch location.' });
    } finally {
      setLoading(false);
    }
  }, [branchId]);

  useEffect(() => {
    fetchBranchDetails();
  }, [fetchBranchDetails]);

  const fetchDepartmentsList = useCallback(async () => {
    try {
      const res = await api.get('/departments/dropdown');
      if (res.data.success) {
        setDepartmentsList(res.data.data.departments || []);
      }
    } catch (err) {
      console.error('Error fetching departments list:', err.message);
    }
  }, []);

  useEffect(() => {
    fetchDepartmentsList();
  }, [fetchDepartmentsList]);

  const fetchReceivedReports = useCallback(async () => {
    setReportsLoading(true);
    try {
      const res = await api.get('/dashboard/reports/superadmin-list');
      if (res.data.success) {
        const filtered = (res.data.data.reports || []).filter(r => r.branch_id === branchId);
        setReceivedReports(filtered);
      }
    } catch (err) {
      console.error('Error fetching received reports:', err.message);
    } finally {
      setReportsLoading(false);
    }
  }, [branchId]);

  useEffect(() => {
    if (activeTab === 'reports') {
      fetchReceivedReports();
    }
  }, [activeTab, fetchReceivedReports]);

  const handleViewReportDetail = async (report) => {
    setDetailLoading(true);
    try {
      const res = await api.get(`/super-admin-detail-placeholder/${report.id}`).catch(async () => {
        // Fallback to standard endpoint if path mapping has restrictions
        return await api.get(`/dashboard/reports/superadmin-detail/${report.id}`);
      });
      if (res.data.success) {
        setViewingReportDetail(res.data.data.report);
      }
    } catch (err) {
      console.error('Error fetching report detail:', err.message);
    } finally {
      setDetailLoading(false);
    }
  };

  const renderDetailReportTable = (reportDetail) => {
    if (!reportDetail?.report_data) return null;
    try {
      const rows = JSON.parse(reportDetail.report_data);
      if (!Array.isArray(rows) || rows.length === 0) {
        return <p style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)' }}>Empty report dataset.</p>;
      }

      // Exclude internal database IDs from header columns
      const headers = Object.keys(rows[0]).filter(k => k !== 'client_id' && k !== 'id');

      return (
        <div style={{ overflowX: 'auto', maxHeight: '450px', marginTop: '16px' }}>
          <table className="enterprise-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-color)', backgroundColor: 'var(--bg-light)', color: 'var(--text-muted)' }}>
                {headers.map((h, i) => (
                  <th key={i} style={{ padding: '12px 16px', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  {headers.map((h, i) => (
                    <td key={i} style={{ padding: '12px 16px', fontSize: '13px', color: 'var(--text-color)' }}>
                      {row[h] !== null && row[h] !== undefined ? String(row[h]) : '-'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    } catch (err) {
      return <p style={{ color: 'var(--danger)' }}>Failed to parse report dataset: {err.message}</p>;
    }
  };
  const superAdminCampaignDaily = useMemo(() => {
    const dailyPackages = receivedReports.filter(r => r.report_type === 'campaign_daily');
    let allRows = [];
    dailyPackages.forEach(pkg => {
      try {
        const rows = JSON.parse(pkg.report_data || '[]');
        if (Array.isArray(rows)) {
          allRows.push(...rows);
        }
      } catch (e) {
        console.error('Error parsing daily package JSON:', e);
      }
    });
    const uniqueMap = {};
    allRows.forEach(row => {
      if (row && row.id) {
        uniqueMap[row.id] = row;
      }
    });
    return Object.values(uniqueMap);
  }, [receivedReports]);

  const superAdminCampaignMonthly = useMemo(() => {
    const monthlyPackages = receivedReports.filter(r => r.report_type === 'campaign_monthly');
    let allRows = [];
    monthlyPackages.forEach(pkg => {
      try {
        const rows = JSON.parse(pkg.report_data || '[]');
        if (Array.isArray(rows)) {
          allRows.push(...rows);
        }
      } catch (e) {
        console.error('Error parsing monthly package JSON:', e);
      }
    });
    const uniqueMap = {};
    allRows.forEach(row => {
      if (row && row.id) {
        uniqueMap[row.id] = row;
      }
    });
    return Object.values(uniqueMap);
  }, [receivedReports]);

  const filteredSACampaignDaily = useMemo(() => {
    return superAdminCampaignDaily.filter(r => {
      if (!r.report_date) return false;
      if (saSelectedDate) {
        const rDateStr = typeof r.report_date === 'string' ? r.report_date : String(r.report_date);
        if (rDateStr.substring(0, 10) !== saSelectedDate) return false;
      } else {
        const rDateStr = typeof r.report_date === 'string' ? r.report_date : String(r.report_date);
        if (rDateStr.substring(0, 7) !== saSelectedMonth) return false;
      }

      const q = saCampaignSearchQuery.toLowerCase();
      return !saCampaignSearchQuery ||
        r.client_name?.toLowerCase().includes(q) ||
        r.campaign_name?.toLowerCase().includes(q) ||
        r.remarks?.toLowerCase().includes(q);
    });
  }, [superAdminCampaignDaily, saSelectedMonth, saSelectedDate, saCampaignSearchQuery]);

  const filteredSACampaignMonthly = useMemo(() => {
    return superAdminCampaignMonthly.filter(r => {
      if (r.report_month !== saSelectedMonth) return false;

      const q = saCampaignSearchQuery.toLowerCase();
      return !saCampaignSearchQuery ||
        r.client_name?.toLowerCase().includes(q) ||
        r.campaign_name?.toLowerCase().includes(q) ||
        r.remarks?.toLowerCase().includes(q);
    });
  }, [superAdminCampaignMonthly, saSelectedMonth, saCampaignSearchQuery]);
  const getDepartmentsToRender = () => {
    const defaultDepts = [
      { id: 1, name: 'Creatives', code: 'CD-RS', desc: 'Handles content, creatives, graphic design and calendars', color: '#faf5ff', textColor: '#7c3aed', iconBg: '#f3e8ff', icon: <FileText size={20} /> },
      { id: 3, name: 'Social media marketing', code: 'SMM-RS', desc: 'Social media posting and analytics overview', color: '#ecfdf5', textColor: '#059669', iconBg: '#d1fae5', icon: <Layers size={20} /> }
    ];

    if (departmentsList.length === 0) return defaultDepts;
    return departmentsList
      .filter(d => d.code !== 'SEO-RS' && d.code !== 'CAM-RS' && d.code !== 'CT-RS')
      .map(d => {
        const isCampaign = d.code === 'CAM-RS' || d.code === 'CT-RS' || d.name?.toLowerCase().includes('campaign');
        const isSmm = d.code === 'SMM-RS' || d.name?.toLowerCase().includes('social') || d.name?.toLowerCase().includes('smm');
        const isSeo = d.code === 'SEO-RS' || d.name?.toLowerCase().includes('seo') || d.name?.toLowerCase().includes('search');
        
        let color = '#faf5ff';
        let textColor = '#7c3aed';
        let iconBg = '#f3e8ff';
        let icon = <FileText size={20} />;
        let desc = d.description || 'Department operations and efficiency';

        if (isCampaign) {
          color = '#eff6ff';
          textColor = '#1d4ed8';
          iconBg = '#dbeafe';
          icon = <Phone size={20} />;
        } else if (isSmm) {
          color = '#ecfdf5';
          textColor = '#059669';
          iconBg = '#d1fae5';
          icon = <Layers size={20} />;
        } else if (isSeo) {
          color = '#fffbeb';
          textColor = '#d97706';
          iconBg = '#fef3c7';
          icon = <Calendar size={20} />;
        }

        return {
          id: d.id,
          name: d.name,
          code: d.code,
          desc,
          color,
          textColor,
          iconBg,
          icon
        };
      });
  };

  const renderSuperAdminReportsTab = () => {
    return (
      <div className="reports-layout-grid" style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '20px', padding: '24px' }}>
        
        {/* Sidebar */}
        <aside className="reports-sidebar" style={{ borderRight: '1px solid var(--border-color)', paddingRight: '20px' }}>
          <h3 style={{ fontSize: '12px', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '16px', letterSpacing: '0.05em' }}>
            Report Category
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div 
              className={`report-menu-item ${selectedReportType === 'client' ? 'active' : ''}`} 
              onClick={() => { setSelectedReportType('client'); setSelectedCampaignDept(null); setViewingReportDetail(null); }}
              style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, fontSize: '13px', color: selectedReportType === 'client' ? 'var(--primary)' : 'var(--text-main)', backgroundColor: selectedReportType === 'client' ? 'var(--bg-light)' : 'transparent' }}
            >
              <Building size={16} /> Client Report
            </div>
            <div 
              className={`report-menu-item ${selectedReportType === 'department' ? 'active' : ''}`} 
              onClick={() => { setSelectedReportType('department'); setSelectedCampaignDept(null); setViewingReportDetail(null); }}
              style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, fontSize: '13px', color: selectedReportType === 'department' ? 'var(--primary)' : 'var(--text-main)', backgroundColor: selectedReportType === 'department' ? 'var(--bg-light)' : 'transparent' }}
            >
              <Layers size={16} /> Department Report
            </div>
            <div 
              className={`report-menu-item ${selectedReportType === 'manager' ? 'active' : ''}`} 
              onClick={() => { setSelectedReportType('manager'); setSelectedCampaignDept(null); setViewingReportDetail(null); }}
              style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, fontSize: '13px', color: selectedReportType === 'manager' ? 'var(--primary)' : 'var(--text-main)', backgroundColor: selectedReportType === 'manager' ? 'var(--bg-light)' : 'transparent' }}
            >
              <Award size={16} /> Manager Report
            </div>
            <div 
              className={`report-menu-item ${selectedReportType === 'employee' ? 'active' : ''}`} 
              onClick={() => { setSelectedReportType('employee'); setSelectedCampaignDept(null); setViewingReportDetail(null); }}
              style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, fontSize: '13px', color: selectedReportType === 'employee' ? 'var(--primary)' : 'var(--text-main)', backgroundColor: selectedReportType === 'employee' ? 'var(--bg-light)' : 'transparent' }}
            >
              <Users size={16} /> Employee Report
            </div>
            <div 
              className={`report-menu-item ${selectedReportType === 'deliverables' ? 'active' : ''}`} 
              onClick={() => { setSelectedReportType('deliverables'); setSelectedCampaignDept(null); setViewingReportDetail(null); }}
              style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, fontSize: '13px', color: selectedReportType === 'deliverables' ? 'var(--primary)' : 'var(--text-main)', backgroundColor: selectedReportType === 'deliverables' ? 'var(--bg-light)' : 'transparent' }}
            >
              <FileText size={16} /> Deliverables Report
            </div>
          </div>
        </aside>

        {/* Content Viewer */}
        <main style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {selectedReportType === 'department' ? (
            selectedCampaignDept === null ? (
              // Department Cards Deck
              <div>
                <h3 style={{ fontSize: '15px', fontWeight: 800, marginBottom: '16px' }}>Select Department Report</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
                  {getDepartmentsToRender().map(dept => (
                    <div 
                      key={dept.id}
                      onClick={() => { setSelectedCampaignDept(dept); setViewingReportDetail(null); }}
                      style={{ backgroundColor: dept.color, border: '1px solid var(--border-color)', borderRadius: '8px', padding: '20px', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '12px' }}
                    >
                      <div style={{ color: dept.textColor, backgroundColor: dept.iconBg, width: '40px', height: '40px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {dept.icon}
                      </div>
                      <div>
                        <h4 style={{ margin: '0 0 4px 0', fontSize: '15px', fontWeight: 800, color: 'var(--text-color)' }}>{dept.name}</h4>
                        <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)' }}>{dept.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              // Specific Department Selected
              <div>
                <button 
                  className="btn btn-secondary btn-sm" 
                  onClick={() => { setSelectedCampaignDept(null); setViewingReportDetail(null); }}
                  style={{ marginBottom: '16px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                >
                  <ArrowLeft size={12} /> Back to Departments
                </button>
                
                {(() => {
                  const isCampaign = selectedCampaignDept.code === 'CAM-RS' || selectedCampaignDept.code === 'CT-RS' || selectedCampaignDept.name?.toLowerCase().includes('campaign');
                  return isCampaign ? (
                    // Campaign Department Reports
                    <div>
                      <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: 800 }}>Campaign Reports Workspace</h3>
                      
                      {/* Campaign Tab Selectors */}
                      <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', gap: '12px', marginBottom: '16px' }}>
                        <button 
                          onClick={() => { setActiveCampaignReportTab('daily'); setViewingReportDetail(null); }}
                          className={`btn btn-sm ${activeCampaignReportTab === 'daily' ? 'btn-primary' : 'btn-secondary'}`}
                          style={{ padding: '6px 12px', fontSize: '12px', fontWeight: 'bold' }}
                        >
                          Daily Reports
                        </button>
                        <button 
                          onClick={() => { setActiveCampaignReportTab('monthly'); setViewingReportDetail(null); }}
                          className={`btn btn-sm ${activeCampaignReportTab === 'monthly' ? 'btn-primary' : 'btn-secondary'}`}
                          style={{ padding: '6px 12px', fontSize: '12px', fontWeight: 'bold' }}
                        >
                          Monthly Reports
                        </button>
                      </div>

                      {/* Filter Bar (Admin Style) */}
                      <div className="card" style={{ padding: '16px 20px', display: 'flex', gap: '16px', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', backgroundColor: '#ffffff', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)', marginBottom: '16px' }}>
                        <div style={{ position: 'relative', flex: 1, minWidth: '280px', maxWidth: '400px' }}>
                          <Search style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-light)' }} size={16} />
                          <input
                            type="text"
                            placeholder="Search reports by client, campaign..."
                            value={saCampaignSearchQuery}
                            onChange={(e) => setSaCampaignSearchQuery(e.target.value)}
                            className="form-control"
                            style={{ width: '100%', paddingLeft: '36px', height: '40px', fontSize: '13px', margin: 0 }}
                          />
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                          {activeCampaignReportTab === 'daily' && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>Target Date:</span>
                              <input 
                                type="date" 
                                value={saSelectedDate} 
                                onChange={(e) => setSaSelectedDate(e.target.value)}
                                style={{ height: '40px', padding: '6px 10px', fontSize: '13px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', outline: 'none', backgroundColor: '#ffffff', color: 'var(--text-main)' }}
                              />
                              {saSelectedDate && (
                                <button 
                                  type="button"
                                  className="btn btn-secondary btn-sm" 
                                  onClick={() => setSaSelectedDate('')}
                                  style={{ padding: '6px 10px', height: '40px', fontSize: '12px', margin: 0 }}
                                >
                                  Clear
                                </button>
                              )}
                            </div>
                          )}

                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>Target Month:</span>
                            <input 
                              type="month" 
                              value={saSelectedMonth} 
                              onChange={(e) => setSaSelectedMonth(e.target.value)}
                              style={{ height: '40px', padding: '6px 10px', fontSize: '13px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', outline: 'none', backgroundColor: '#ffffff', color: 'var(--text-main)' }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Campaign reports listing */}
                      <div className="card" style={{ padding: '16px' }}>
                        <h4 style={{ fontSize: '14px', fontWeight: 800, margin: '0 0 12px 0' }}>
                          {activeCampaignReportTab === 'daily' ? 'Received Daily Campaign Logs' : 'Received Monthly Campaign Summaries'}
                        </h4>
                        
                        {reportsLoading ? (
                          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Loading records...</p>
                        ) : activeCampaignReportTab === 'daily' ? (
                          <Table 
                            columns={[
                              { key: 'client_name', label: 'Client Name', render: (val) => <strong style={{ color: 'var(--secondary)' }}>{val}</strong> },
                              { key: 'campaign_name', label: 'Campaign Name', render: (val) => <strong style={{ color: 'var(--primary)' }}>{val || 'N/A'}</strong> },
                              { key: 'manager_name', label: 'Submitted By', render: (val) => <span style={{ fontWeight: 600 }}>{val || 'N/A'}</span> },
                              { 
                                key: 'report_date', 
                                label: 'Report Date', 
                                render: (val) => {
                                  if (!val) return '-';
                                  const d = new Date(val);
                                  return isNaN(d.getTime()) ? String(val) : d.toLocaleDateString([], { dateStyle: 'medium' });
                                }
                              },
                              { key: 'leads_generated', label: 'Leads', render: (val) => <span style={{ fontWeight: 700 }}>{val}</span> },
                              { 
                                key: 'amount_spent', 
                                label: 'Spent (INR)', 
                                render: (val) => <span style={{ fontWeight: 600 }}>₹{val ? Number(val).toLocaleString('en-IN', { minimumFractionDigits: 2 }) : '0.00'}</span> 
                              },
                              { key: 'remarks', label: 'Remarks' }
                            ]}
                            data={filteredSACampaignDaily}
                            emptyMessage="No daily reports submitted for this branch location."
                          />
                        ) : (
                          <Table 
                            columns={[
                              { key: 'client_name', label: 'Client Name', render: (val) => <strong style={{ color: 'var(--secondary)' }}>{val}</strong> },
                              { key: 'campaign_name', label: 'Campaign Name', render: (val) => <strong style={{ color: 'var(--primary)' }}>{val || 'N/A'}</strong> },
                              { key: 'manager_name', label: 'Submitted By', render: (val) => <span style={{ fontWeight: 600 }}>{val || 'N/A'}</span> },
                              { 
                                key: 'report_month', 
                                label: 'Report Month', 
                                render: (val) => {
                                  if (!val) return '-';
                                  const parts = String(val).split('-');
                                  if (parts.length < 2) return String(val);
                                  const [y, m] = parts;
                                  const d = new Date(Number(y), Number(m) - 1);
                                  return isNaN(d.getTime()) ? String(val) : d.toLocaleDateString([], { month: 'long', year: 'numeric' });
                                }
                              },
                              { key: 'total_leads', label: 'Leads', render: (val) => <span style={{ fontWeight: 700 }}>{val}</span> },
                              { 
                                key: 'total_spent', 
                                label: 'Spent (INR)', 
                                render: (val) => <span style={{ fontWeight: 600 }}>₹{val ? Number(val).toLocaleString('en-IN', { minimumFractionDigits: 2 }) : '0.00'}</span> 
                              },
                              { key: 'remarks', label: 'Remarks' }
                            ]}
                            data={filteredSACampaignMonthly}
                            emptyMessage="No monthly reports submitted for this branch location."
                          />
                        )}
                      </div>
                    </div>
                  ) : (
                    // Other Department Reports Listing (SMM, SEO, etc.)
                    <div className="card" style={{ padding: '16px' }}>
                      <h4 style={{ fontSize: '14px', fontWeight: 800, margin: '0 0 12px 0' }}>{selectedCampaignDept.name} Operations Submissions</h4>
                      {reportsLoading ? (
                        <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Loading records...</p>
                      ) : (
                        <Table 
                          columns={[
                            { key: 'title', label: 'Title', render: (val) => <span style={{ fontWeight: 600 }}>{val}</span> },
                            { key: 'month_or_range', label: 'Range' },
                            { key: 'sent_by_username', label: 'Sent By' },
                            { key: 'sent_at', label: 'Received At', render: (val) => val ? new Date(val).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }) : '-' },
                            { 
                              key: 'actions', 
                              label: 'Action', 
                              render: (_, row) => (
                                <button className="btn btn-secondary btn-sm" onClick={() => handleViewReportDetail(row)}>
                                    <Eye size={12} /> View Report
                                </button>
                              )
                            }
                          ]}
                          data={receivedReports.filter(r => r.report_type === 'department')}
                          emptyMessage="No reports submitted for this branch location."
                        />
                      )}
                    </div>
                  );
                })()}

                {/* Detail Dataset Overlay */}
                {viewingReportDetail && (
                  <div className="card" style={{ marginTop: '20px', padding: '20px', border: '1px solid var(--primary)', borderLeft: '4px solid var(--primary)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
                      <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 800 }}>{viewingReportDetail.title} ({viewingReportDetail.month_or_range})</h4>
                      <button className="btn btn-sm btn-secondary" onClick={() => setViewingReportDetail(null)}>Close Dataset</button>
                    </div>
                    {detailLoading ? (
                      <p>Loading details...</p>
                    ) : (
                      renderDetailReportTable(viewingReportDetail)
                    )}
                  </div>
                )}
              </div>
            )
          ) : (
            // Client, Manager, Employee, or Deliverables Report Listing
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: 800, marginBottom: '16px', textTransform: 'capitalize' }}>{selectedReportType} Reports Archive</h3>
              <div className="card" style={{ padding: '16px' }}>
                {reportsLoading ? (
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Loading reports list...</p>
                ) : (
                  <Table 
                    columns={[
                      { key: 'title', label: 'Report Title', render: (val) => <span style={{ fontWeight: 600 }}>{val}</span> },
                      { key: 'month_or_range', label: 'Period' },
                      { key: 'sent_by_username', label: 'Sent By' },
                      { key: 'sent_at', label: 'Received At', render: (val) => val ? new Date(val).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }) : '-' },
                      { 
                        key: 'actions', 
                        label: 'Action', 
                        render: (_, row) => (
                          <button className="btn btn-secondary btn-sm" onClick={() => handleViewReportDetail(row)}>
                            <Eye size={12} /> View Report
                          </button>
                        )
                      }
                    ]}
                    data={receivedReports.filter(r => r.report_type === selectedReportType)}
                    emptyMessage={`No sent ${selectedReportType} reports found for this branch.`}
                  />
                )}
              </div>

              {/* Detail Dataset Overlay */}
              {viewingReportDetail && (
                <div className="card" style={{ marginTop: '20px', padding: '20px', border: '1px solid var(--primary)', borderLeft: '4px solid var(--primary)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
                    <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 800 }}>{viewingReportDetail.title} ({viewingReportDetail.month_or_range})</h4>
                    <button className="btn btn-sm btn-secondary" onClick={() => setViewingReportDetail(null)}>Close Dataset</button>
                  </div>
                  {detailLoading ? (
                    <p>Loading details...</p>
                  ) : (
                    renderDetailReportTable(viewingReportDetail)
                  )}
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    );
  };

  // Admin CRUD handlers
  const handleOpenCreateAdmin = () => {
    setIsEditingAdmin(false);
    setAdminForm({
      id: null,
      username: '',
      email: '',
      password: '',
      branchId: branchId
    });
    setShowAdminPassword(false);
    setIsAdminModalOpen(true);
  };

  const handleOpenEditAdmin = (admin) => {
    setIsEditingAdmin(true);
    setAdminForm({
      id: admin.id,
      username: admin.username,
      email: admin.email,
      password: '',
      branchId: branchId
    });
    setShowAdminPassword(false);
    setIsAdminModalOpen(true);
  };

  const handleSaveAdmin = async (e) => {
    e.preventDefault();
    const payload = {
      username: adminForm.username,
      email: adminForm.email,
      branchId: Number(adminForm.branchId)
    };
    if (adminForm.password.trim() !== '') {
      payload.password = adminForm.password;
    }

    try {
      if (isEditingAdmin) {
        const res = await api.put(`/super-admin/admins/${adminForm.id}`, payload);
        if (res.data.success) {
          setFeedback({ type: 'success', text: `Admin credentials updated successfully.` });
        }
      } else {
        if (!adminForm.password.trim()) {
          alert('Password is required for new Admin accounts.');
          return;
        }
        const res = await api.post('/super-admin/admins', payload);
        if (res.data.success) {
          setFeedback({ type: 'success', text: `New Admin account created successfully!` });
        }
      }
      setIsAdminModalOpen(false);
      fetchBranchDetails();
    } catch (err) {
      alert(err.response?.data?.message || 'Action failed.');
    }
  };

  const handleDeleteAdmin = async (adminId) => {
    if (!(await window.confirm('Are you sure you want to delete this Admin account?'))) {
      return;
    }
    try {
      const res = await api.delete(`/super-admin/admins/${adminId}`);
      if (res.data.success) {
        setFeedback({ type: 'success', text: 'Admin account deleted successfully.' });
        fetchBranchDetails();
      }
    } catch (err) {
      alert('Failed to delete Admin.');
    }
  };

  // Columns Configuration
  const adminColumns = [
    { key: 'id', label: 'ID', width: '80px', render: (id) => <span style={{ fontWeight: 600 }}>#{id}</span> },
    { key: 'username', label: 'Username', render: (name) => <strong style={{ color: 'var(--primary)' }}>{name}</strong> },
    { key: 'email', label: 'Email Account' },
    { key: 'status', label: 'Status', render: (status) => (
      <span className={`badge ${status === 'active' ? 'badge-active' : 'badge-inactive'}`} style={{ textTransform: 'uppercase', fontSize: '10px' }}>
        {status}
      </span>
    )},
    { 
      key: 'actions', 
      label: 'Actions', 
      render: (_, admin) => (
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="btn btn-secondary btn-sm" onClick={() => handleOpenEditAdmin(admin)} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '6px 10px' }}>
            <Edit size={12} /> Edit
          </button>
          <button className="btn btn-sm btn-danger" onClick={() => handleDeleteAdmin(admin.id)} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '6px 10px' }}>
            <Trash2 size={12} /> Delete
          </button>
        </div>
      )
    }
  ];

  const managerColumns = [
    { key: 'manager_id_code', label: 'Manager Code', render: (code) => <span style={{ fontFamily: 'monospace', fontWeight: 700 }}>{code}</span> },
    { key: 'full_name', label: 'Manager Name', render: (name) => <strong style={{ color: 'var(--text-color)' }}>{name}</strong> },
    { key: 'email', label: 'Email Account' },
    { key: 'phone', label: 'Phone' },
    { key: 'department_name', label: 'Department' },
    { key: 'joining_date', label: 'Joining Date', render: (date) => new Date(date).toLocaleDateString([], { dateStyle: 'medium' }) }
  ];

  const employeeColumns = [
    { key: 'employee_id_code', label: 'Employee Code', render: (code) => <span style={{ fontFamily: 'monospace', fontWeight: 700 }}>{code}</span> },
    { key: 'full_name', label: 'Employee Name', render: (name) => <strong style={{ color: 'var(--text-color)' }}>{name}</strong> },
    { key: 'email', label: 'Email Account' },
    { key: 'phone', label: 'Phone' },
    { key: 'department_name', label: 'Department' },
    { key: 'joining_date', label: 'Joining Date', render: (date) => new Date(date).toLocaleDateString([], { dateStyle: 'medium' }) }
  ];

  const empEfficiencyColumns = [
    { key: 'id', label: 'ID', width: '80px' },
    { key: 'full_name', label: 'Employee Name', render: (name) => <strong style={{ color: 'var(--text-color)' }}>{name}</strong> },
    { key: 'department_name', label: 'Department' },
    { key: 'total_tasks', label: 'Assigned Work', render: (val) => <span style={{ fontWeight: 600 }}>{val}</span> },
    { key: 'completed_tasks', label: 'Completed Work', render: (val) => <span style={{ fontWeight: 600, color: 'var(--success)' }}>{val}</span> },
    { 
      key: 'efficiency', 
      label: 'Efficiency Score', 
      render: (val) => {
        let barColor = 'var(--success)';
        if (val < 50) barColor = 'var(--danger)';
        else if (val < 80) barColor = 'var(--warning)';

        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ flex: 1, height: '8px', backgroundColor: '#e2e8f0', borderRadius: '4px', overflow: 'hidden', minWidth: '100px' }}>
              <div style={{ width: `${val}%`, height: '100%', backgroundColor: barColor, borderRadius: '4px' }}></div>
            </div>
            <strong style={{ fontSize: '13px', color: 'var(--text-color)', width: '36px' }}>{val}%</strong>
          </div>
        );
      } 
    }
  ];

  const mgrEfficiencyColumns = [
    { key: 'id', label: 'ID', width: '80px' },
    { key: 'full_name', label: 'Manager Name', render: (name) => <strong style={{ color: 'var(--text-color)' }}>{name}</strong> },
    { key: 'department_name', label: 'Department' },
    { key: 'total_tasks', label: 'Tasks Managed', render: (val) => <span style={{ fontWeight: 600 }}>{val}</span> },
    { key: 'completed_tasks', label: 'Signed Off', render: (val) => <span style={{ fontWeight: 600, color: 'var(--success)' }}>{val}</span> },
    { 
      key: 'efficiency', 
      label: 'Completion Rate', 
      render: (val) => {
        let barColor = 'var(--success)';
        if (val < 50) barColor = 'var(--danger)';
        else if (val < 80) barColor = 'var(--warning)';

        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ flex: 1, height: '8px', backgroundColor: '#e2e8f0', borderRadius: '4px', overflow: 'hidden', minWidth: '100px' }}>
              <div style={{ width: `${val}%`, height: '100%', backgroundColor: barColor, borderRadius: '4px' }}></div>
            </div>
            <strong style={{ fontSize: '13px', color: 'var(--text-color)', width: '36px' }}>{val}%</strong>
          </div>
        );
      } 
    }
  ];

  const brandingWorkflowColumns = [
    { key: 'id', label: 'Task ID', width: '80px', render: (id) => <span style={{ fontWeight: 600 }}>#{id}</span> },
    { key: 'type', label: 'Type', render: (t) => (
      <span className={`badge ${t === 'Job Work' ? 'badge-danger' : 'badge-info'}`} style={{ textTransform: 'uppercase', fontSize: '9px' }}>
        {t}
      </span>
    )},
    { key: 'client_name', label: 'Client Company', render: (name) => <strong style={{ color: 'var(--primary)' }}>{name}</strong> },
    { key: 'task_name', label: 'Job Work / Deliverable', render: (task, row) => (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
        <span style={{ fontWeight: 600 }}>{task}</span>
        {row.activity_code && (
          <span style={{ fontFamily: 'monospace', fontSize: '11px', fontWeight: 800, color: 'var(--primary)' }}>
            {row.activity_code}
          </span>
        )}
      </div>
    ) },
    { key: 'employee_name', label: 'Assigned Designer' },
    { key: 'deadline', label: 'Deadline', render: (date) => (
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)' }}>
        <Clock size={12} />
        {new Date(date).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
      </div>
    )},
    { key: 'status', label: 'Status', render: (status) => {
      let badgeClass = 'badge-inactive';
      if (status === 'completed' || status === 'approved' || status === 'client_approved') badgeClass = 'badge-active';
      else if (status === 'submitted') badgeClass = 'badge-info';
      else if (status === 'reassigned' || status === 'client_rework') badgeClass = 'badge-danger';
      
      return (
        <span className={`badge ${badgeClass}`} style={{ textTransform: 'uppercase', fontSize: '10px' }}>
          {status.replace('_', ' ')}
        </span>
      );
    }}
  ];

  return (
    <div style={{ padding: '30px', maxWidth: '1400px', margin: '0 auto' }}>
      
      {/* Header Breadcrumb */}
      <div style={{ marginBottom: '24px' }}>
        <button 
          onClick={() => navigate('/super-admin/branches')}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', border: 'none', background: 'none', color: 'var(--primary)', fontWeight: 700, fontSize: '13px', cursor: 'pointer', padding: 0, marginBottom: '12px' }}
        >
          <ArrowLeft size={14} /> Back to Branches List
        </button>
        <h1 style={{ margin: 0, fontSize: '26px', fontWeight: 800, color: 'var(--text-color)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Building size={28} style={{ color: 'var(--primary)' }} />
          {loading ? 'Loading branch...' : `${data?.branch?.name} Branch`}
        </h1>
        <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: 'var(--text-muted)' }}>
          Detailed branch configuration, human resource profiles, and creatives department workflow.
        </p>
      </div>

      {feedback.text && (
        <div style={{
          padding: '12px 20px',
          backgroundColor: feedback.type === 'success' ? 'var(--success-light)' : 'var(--danger-light)',
          color: feedback.type === 'success' ? 'var(--success)' : 'var(--danger)',
          fontSize: '13px',
          fontWeight: 600,
          marginBottom: '24px',
          borderRadius: '4px',
          borderLeft: `4px solid ${feedback.type === 'success' ? 'var(--success)' : 'var(--danger)'}`
        }}>
          {feedback.text}
        </div>
      )}

      {loading ? (
        <div style={{ padding: '100px', textAlign: 'center', color: 'var(--text-muted)' }}>
          <div className="spinner" style={{ margin: '0 auto 12px auto' }}></div>
          <span>Loading branch details...</span>
        </div>
      ) : (
        <>
          {/* Tabs */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
            <button 
              onClick={() => setActiveTab('admins')}
              className={`btn ${activeTab === 'admins' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '8px 16px', fontSize: '13px', fontWeight: 'bold' }}
            >
              Admins
            </button>
            <button 
              onClick={() => setActiveTab('managers')}
              className={`btn ${activeTab === 'managers' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '8px 16px', fontSize: '13px', fontWeight: 'bold' }}
            >
              Managers
            </button>
            <button 
              onClick={() => setActiveTab('employees')}
              className={`btn ${activeTab === 'employees' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '8px 16px', fontSize: '13px', fontWeight: 'bold' }}
            >
              Employees
            </button>
            <button 
              onClick={() => setActiveTab('efficiency')}
              className={`btn ${activeTab === 'efficiency' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '8px 16px', fontSize: '13px', fontWeight: 'bold' }}
            >
              Resource Efficiency
            </button>
            <button 
              onClick={() => setActiveTab('workflow')}
              className={`btn ${activeTab === 'workflow' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '8px 16px', fontSize: '13px', fontWeight: 'bold' }}
            >
              Branding Team Workflow
            </button>
            <button 
              onClick={() => { setActiveTab('reports'); setViewingReportDetail(null); setSelectedCampaignDept(null); }}
              className={`btn ${activeTab === 'reports' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '8px 16px', fontSize: '13px', fontWeight: 'bold' }}
            >
              Branch Reports
            </button>
            
            <button 
              className="btn btn-secondary" 
              onClick={fetchBranchDetails} 
              style={{ marginLeft: 'auto', padding: '8px 14px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <RefreshCw size={14} /> Sync Data
            </button>
          </div>

          {/* Tab Content Panel */}
          <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', overflowX: 'auto', boxShadow: 'var(--shadow-sm)' }}>
            
            {/* Admins Panel */}
            {activeTab === 'admins' && (
              <div>
                <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800 }}>Branch Administrators</h3>
                    <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: 'var(--text-muted)' }}>Configure specific admin accounts that have management rights over this branch.</p>
                  </div>
                  <button className="btn btn-primary" onClick={handleOpenCreateAdmin} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    <Plus size={16} /> Create Branch Admin
                  </button>
                </div>
                <Table 
                  columns={adminColumns}
                  data={data?.admins || []}
                  emptyMessage="No administrators assigned to this branch location."
                />
              </div>
            )}

            {/* Managers Panel */}
            {activeTab === 'managers' && (
              <div>
                <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-color)' }}>
                  <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800 }}>Branch Department Managers</h3>
                  <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: 'var(--text-muted)' }}>List of team managers overseeing branch creative divisions.</p>
                </div>
                <Table 
                  columns={managerColumns}
                  data={data?.managers || []}
                  emptyMessage="No managers registered for this branch."
                />
              </div>
            )}

            {/* Employees Panel */}
            {activeTab === 'employees' && (
              <div>
                <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-color)' }}>
                  <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800 }}>Branch Employees</h3>
                  <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: 'var(--text-muted)' }}>List of creative designers, video editors, and copywriters working at this branch.</p>
                </div>
                <Table 
                  columns={employeeColumns}
                  data={data?.employees || []}
                  emptyMessage="No employee profiles found at this branch."
                />
              </div>
            )}

            {/* Resource Efficiency Panel */}
            {activeTab === 'efficiency' && (
              <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '40px' }}>
                <div>
                  <h3 style={{ margin: '0 0 16px 0', fontSize: '15px', fontWeight: 800 }}>Manager Oversight & Completion Rates</h3>
                  <Table 
                    columns={mgrEfficiencyColumns}
                    data={data?.managerEfficiency || []}
                    emptyMessage="No manager stats compiled."
                  />
                </div>
                <div>
                  <h3 style={{ margin: '0 0 16px 0', fontSize: '15px', fontWeight: 800 }}>Employee Task Execution Efficiency</h3>
                  <Table 
                    columns={empEfficiencyColumns}
                    data={data?.employeeEfficiency || []}
                    emptyMessage="No employee stats compiled."
                  />
                </div>
              </div>
            )}

            {/* Branding Team Workflow Panel */}
            {activeTab === 'workflow' && (
              <div>
                <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-color)' }}>
                  <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800 }}>Branding Team (Creatives) Workflow</h3>
                  <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: 'var(--text-muted)' }}>Detailed list of monthly deliverables and ad-hoc Job Works assigned to this branch's creative department.</p>
                </div>
                <Table 
                  columns={brandingWorkflowColumns}
                  data={data?.brandingWorkflow || []}
                  emptyMessage="No creative workflow deliverables assigned or found in this branch."
                />
              </div>
            )}

            {/* Branch Reports Panel */}
            {activeTab === 'reports' && renderSuperAdminReportsTab()}

          </div>
        </>
      )}

      {/* CREATE / EDIT ADMIN MODAL */}
      {isAdminModalOpen && (
        <Modal
          isOpen={isAdminModalOpen}
          onClose={closeAssignModal}
          title={isEditingAdmin ? "Modify Administrator Credentials" : "Create New Branch Administrator"}
        >
          <form onSubmit={handleSaveAdmin} style={{ padding: '10px' }}>
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontWeight: 700, fontSize: '13px', marginBottom: '6px', color: 'var(--text-color)' }}>
                Username
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter username..."
                value={adminForm.username}
                onChange={(e) => setAdminForm(prev => ({ ...prev, username: e.target.value }))}
                style={{ width: '100%', padding: '10px' }}
                required
              />
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontWeight: 700, fontSize: '13px', marginBottom: '6px', color: 'var(--text-color)' }}>
                Email Address
              </label>
              <input
                type="email"
                className="form-control"
                placeholder="admin@reachskyline.com"
                value={adminForm.email}
                onChange={(e) => setAdminForm(prev => ({ ...prev, email: e.target.value }))}
                style={{ width: '100%', padding: '10px' }}
                required
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontWeight: 700, fontSize: '13px', marginBottom: '6px', color: 'var(--text-color)' }}>
                Password {isEditingAdmin && <span style={{ color: 'var(--text-light)', fontWeight: 500 }}>(Leave blank to keep current)</span>}
              </label>
              <div style={{ position: 'relative', width: '100%' }}>
                <input
                  type={showAdminPassword ? 'text' : 'password'}
                  className="form-control"
                  placeholder="••••••••"
                  value={adminForm.password}
                  onChange={(e) => setAdminForm(prev => ({ ...prev, password: e.target.value }))}
                  style={{ width: '100%', padding: '10px', paddingRight: '40px' }}
                  required={!isEditingAdmin}
                />
                <button
                  type="button"
                  onClick={() => setShowAdminPassword(!showAdminPassword)}
                  tabIndex="-1"
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#64748b',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 0
                  }}
                >
                  {showAdminPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
              <button type="button" className="btn btn-secondary" onClick={closeAssignModal}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                {isEditingAdmin ? 'Update Credentials' : 'Create Admin'}
              </button>
            </div>
          </form>
        </Modal>
      )}

    </div>
  );
};

export default SuperAdminBranchDetail;
