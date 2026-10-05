import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Plus, Search, Filter, Calendar, DollarSign, Play, Pause, CheckCircle2, 
  ExternalLink, User, Users, Globe, MessageSquare, PhoneCall, FileText, 
  Sparkles, Layers, ShieldCheck, AlertCircle, ArrowRight, Clock, Edit3, Trash2, Eye, RefreshCw
} from 'lucide-react';
import api from '../../../utils/api';
import { useAuth } from '../../../context/AuthContext';
import Modal from '../../../components/Modal';
import { FormInput, FormSelect, FormTextArea } from '../../../components/FormFields';
import AppIcon from '../../../utils/appIcons';

const CAMPAIGN_TYPES = [
  { value: 'lead_form', label: 'Lead Form', icon: FileText, desc: 'Capture customer leads via instant forms' },
  { value: 'whatsapp_number', label: 'WhatsApp Number', icon: MessageSquare, desc: 'Direct click-to-chat WhatsApp conversations' },
  { value: 'awareness', label: 'Awareness / Reach', icon: Sparkles, desc: 'Maximize brand exposure, impressions and reach' },
  { value: 'call_ad', label: 'Call Ad', icon: PhoneCall, desc: 'Drive direct phone calls to your sales desk' },
  { value: 'website_link', label: 'Website Link', icon: Globe, desc: 'Drive traffic and conversions to landing page' }
];

const PLATFORMS = [
  { value: 'meta', label: 'Meta Ads', badgeBg: '#e0f2fe', badgeColor: '#0284c7', icon: 'Meta' },
  { value: 'google', label: 'Google Ads', badgeBg: '#fef3c7', badgeColor: '#d97706', icon: 'Google' },
  { value: 'both', label: 'Meta & Google', badgeBg: '#ede9fe', badgeColor: '#7c3aed', icon: 'Meta + Google' }
];

const STATUS_CONFIG = {
  pending_manager_review: {
    label: 'Pending Review',
    color: '#d97706',
    bg: '#fef3c7',
    border: '#fde68a'
  },
  assigned: {
    label: 'Assigned to Employee',
    color: '#2563eb',
    bg: '#eff6ff',
    border: '#bfdbfe'
  },
  running: {
    label: 'Active / Live',
    color: '#059669',
    bg: '#ecfdf5',
    border: '#a7f3d0'
  },
  paused: {
    label: 'Paused',
    color: '#64748b',
    bg: '#f1f5f9',
    border: '#cbd5e1'
  },
  completed: {
    label: 'Completed',
    color: '#7c3aed',
    bg: '#f5f3ff',
    border: '#ddd6fe'
  },
  cancelled: {
    label: 'Cancelled',
    color: '#dc2626',
    bg: '#fef2f2',
    border: '#fecaca'
  }
};

const CampaignRunList = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin';
  const isManager = user?.role === 'manager';
  const isEmployee = user?.role === 'employee';

  // Data states
  const [campaigns, setCampaigns] = useState([]);
  const [stats, setStats] = useState(null);
  const [metaOptions, setMetaOptions] = useState({ clients: [], campaignManagers: [], campaignEmployees: [], allEmployees: [] });
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState({ type: '', text: '' });

  // Filter states
  const [search, setSearch] = useState('');
  const [platformFilter, setPlatformFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isManagerModalOpen, setIsManagerModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);

  // Form states: Create (Admin)
  const [createForm, setCreateForm] = useState({
    client_id: '',
    title: '',
    campaign_details: '',
    platform: 'meta',
    start_date: new Date().toISOString().split('T')[0],
    end_date: '',
    has_no_end_date: false,
    total_amount: '',
    creatives_text: '',
    creatives_url: '',
    assigned_manager_id: ''
  });
  const [createErrors, setCreateErrors] = useState({});

  // Form states: Manager Review
  const [managerForm, setManagerForm] = useState({
    creatives_status: 'approved',
    creatives_notes: '',
    daily_budget: '',
    campaign_type: 'lead_form',
    campaign_type_target: '',
    assigned_employee_id: ''
  });
  const [managerErrors, setManagerErrors] = useState({});

  // Form states: Employee Execution & Status Update
  const [statusForm, setStatusForm] = useState({
    status: 'running',
    live_campaign_url: '',
    employee_notes: ''
  });

  // Fetch Meta Options (Clients, Managers, Employees)
  const fetchMetaOptions = useCallback(async () => {
    try {
      const res = await api.get('/campaign-runs/meta/options');
      if (res.data?.success) {
        setMetaOptions(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching campaign meta options:', err.message);
    }
  }, []);

  // Fetch Campaign Runs List
  const fetchCampaigns = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (search.trim()) params.q = search.trim();
      if (platformFilter !== 'all') params.platform = platformFilter;
      if (statusFilter !== 'all') params.status = statusFilter;
      if (typeFilter !== 'all') params.campaign_type = typeFilter;

      const res = await api.get('/campaign-runs', { params });
      if (res.data?.success) {
        setCampaigns(res.data.data.items || []);
        setStats(res.data.data.stats || null);
      }
    } catch (err) {
      console.error('Error fetching campaign runs:', err.message);
      setFeedbackMsg({ type: 'error', text: 'Failed to load campaign runs.' });
    } finally {
      setLoading(false);
    }
  }, [search, platformFilter, statusFilter, typeFilter]);

  useEffect(() => {
    fetchMetaOptions();
  }, [fetchMetaOptions]);

  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

  // Handle calculate duration helper
  const calculateDurationDays = (startDate, endDate, hasNoEndDate) => {
    if (hasNoEndDate) return 'Ongoing (No End Date)';
    if (!startDate || !endDate) return null;
    const s = new Date(startDate);
    const e = new Date(endDate);
    const diffTime = e - s;
    if (diffTime < 0) return 'Invalid dates';
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // inclusive of start & end
    return `${diffDays} Day${diffDays > 1 ? 's' : ''}`;
  };

  // Helper for formatting Indian currency (INR)
  const formatINR = (val) => {
    const num = Number(val) || 0;
    return '₹' + num.toLocaleString('en-IN');
  };

  // ==========================================
  // CREATE CAMPAIGN RUN (ADMIN ACTION)
  // ==========================================
  const handleOpenCreateModal = () => {
    // Default manager: Pick campaign manager if available
    const defaultManager = metaOptions.campaignManagers[0]?.id || '';
    setCreateForm({
      client_id: '',
      title: '',
      campaign_details: '',
      platform: 'meta',
      start_date: new Date().toISOString().split('T')[0],
      end_date: '',
      has_no_end_date: false,
      total_amount: '',
      creatives_text: '',
      creatives_url: '',
      assigned_manager_id: defaultManager
    });
    setCreateErrors({});
    setIsCreateModalOpen(true);
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    const errors = {};

    if (!createForm.client_id) errors.client_id = 'Please select a client.';
    if (!createForm.title.trim()) errors.title = 'Campaign title is required.';
    if (!createForm.start_date) errors.start_date = 'Start date is required.';

    if (!createForm.has_no_end_date) {
      if (!createForm.end_date) {
        errors.end_date = 'Please specify end date or check "Continuous / Without End Date".';
      } else if (new Date(createForm.end_date) < new Date(createForm.start_date)) {
        errors.end_date = 'End date cannot be earlier than start date.';
      }
    }

    const totalAmt = Number(createForm.total_amount);
    if (isNaN(totalAmt) || totalAmt <= 0) {
      errors.total_amount = 'Please enter a valid total budget amount.';
    }

    if (Object.keys(errors).length > 0) {
      setCreateErrors(errors);
      return;
    }

    setActionLoading(true);
    try {
      const res = await api.post('/campaign-runs', createForm);
      if (res.data?.success) {
        setFeedbackMsg({ type: 'success', text: 'Campaign Run submitted successfully and routed to Campaign Manager!' });
        setIsCreateModalOpen(false);
        fetchCampaigns();
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to create campaign run.';
      setCreateErrors({ submit: msg });
    } finally {
      setActionLoading(false);
    }
  };

  // ==========================================
  // MANAGER REVIEW & ASSIGNMENT
  // ==========================================
  const handleOpenManagerModal = (camp) => {
    setSelectedCampaign(camp);
    setManagerForm({
      creatives_status: camp.creatives_status || 'approved',
      creatives_notes: camp.creatives_notes || '',
      daily_budget: camp.daily_budget ? String(camp.daily_budget) : '',
      campaign_type: camp.campaign_type || 'lead_form',
      campaign_type_target: camp.campaign_type_target || '',
      assigned_employee_id: camp.assigned_employee_id ? String(camp.assigned_employee_id) : ''
    });
    setManagerErrors({});
    setIsManagerModalOpen(true);
  };

  const handleManagerSubmit = async (e) => {
    e.preventDefault();
    const errors = {};

    const dailyBud = Number(managerForm.daily_budget);
    if (isNaN(dailyBud) || dailyBud <= 0) {
      errors.daily_budget = 'Minimum daily budget must be greater than 0.';
    }

    if (!managerForm.campaign_type) {
      errors.campaign_type = 'Please select a campaign type.';
    }

    if (managerForm.campaign_type === 'whatsapp_number' && !managerForm.campaign_type_target.trim()) {
      errors.campaign_type_target = 'WhatsApp contact number is required.';
    } else if (managerForm.campaign_type === 'website_link' && !managerForm.campaign_type_target.trim()) {
      errors.campaign_type_target = 'Destination Website URL is required.';
    } else if (managerForm.campaign_type === 'call_ad' && !managerForm.campaign_type_target.trim()) {
      errors.campaign_type_target = 'Call phone number is required.';
    }

    if (Object.keys(errors).length > 0) {
      setManagerErrors(errors);
      return;
    }

    setActionLoading(true);
    try {
      const res = await api.put(`/campaign-runs/${selectedCampaign.id}/manager-review`, managerForm);
      if (res.data?.success) {
        setFeedbackMsg({ type: 'success', text: 'Campaign reviewed, daily budget allocated, and work assigned to employee!' });
        setIsManagerModalOpen(false);
        fetchCampaigns();
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update manager review.';
      setManagerErrors({ submit: msg });
    } finally {
      setActionLoading(false);
    }
  };

  // ==========================================
  // EMPLOYEE STATUS & LIVE LINK UPDATE
  // ==========================================
  const handleOpenStatusModal = (camp) => {
    setSelectedCampaign(camp);
    setStatusForm({
      status: camp.status === 'assigned' ? 'running' : camp.status,
      live_campaign_url: camp.live_campaign_url || '',
      employee_notes: camp.employee_notes || ''
    });
    setIsStatusModalOpen(true);
  };

  const handleStatusSubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const res = await api.put(`/campaign-runs/${selectedCampaign.id}/status`, statusForm);
      if (res.data?.success) {
        setFeedbackMsg({ type: 'success', text: `Campaign status updated to "${statusForm.status}".` });
        setIsStatusModalOpen(false);
        fetchCampaigns();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update campaign status.');
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Delete
  const handleDelete = async (camp) => {
    if (!window.confirm(`Delete Campaign Run "${camp.title}"?`)) return;
    try {
      await api.delete(`/campaign-runs/${camp.id}`);
      setFeedbackMsg({ type: 'success', text: 'Campaign Run deleted.' });
      fetchCampaigns();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete campaign run.');
    }
  };

  return (
    <div className="page-container" style={{ maxWidth: '1440px', margin: '0 auto', padding: '24px 32px' }}>
      
      {/* Page Header */}
      <div className="page-header" style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <AppIcon name="campaignTeam" size={28} />
            </div>
            <div>
              <h1 style={{ fontSize: '26px', fontWeight: 850, color: 'var(--text-main)', margin: 0, letterSpacing: '-0.3px' }}>
                Campaign Run
              </h1>
              <p style={{ margin: '4px 0 0 0', color: 'var(--text-muted)', fontSize: '14px' }}>
                End-to-end advertising workflow: Admin order & creatives &rarr; Campaign Manager budget & assignment &rarr; Employee ad execution.
              </p>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            className="btn btn-secondary"
            onClick={fetchCampaigns}
            title="Refresh List"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <RefreshCw size={16} className={loading ? 'spin' : ''} />
            Refresh
          </button>
          
          {(isAdmin || isManager) && (
            <button 
              className="btn btn-primary"
              onClick={handleOpenCreateModal}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 20px', fontWeight: 700 }}
            >
              <Plus size={18} />
              Create Campaign Run
            </button>
          )}
        </div>
      </div>

      {/* Global Feedback Banner */}
      {feedbackMsg.text && (
        <div style={{
          padding: '12px 16px',
          borderRadius: '10px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: feedbackMsg.type === 'error' ? '#fef2f2' : '#ecfdf5',
          border: `1px solid ${feedbackMsg.type === 'error' ? '#fecaca' : '#a7f3d0'}`,
          color: feedbackMsg.type === 'error' ? '#dc2626' : '#059669'
        }}>
          <span style={{ fontWeight: 600, fontSize: '14px' }}>{feedbackMsg.text}</span>
          <button 
            onClick={() => setFeedbackMsg({ type: '', text: '' })} 
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', fontWeight: 800 }}
          >
            &times;
          </button>
        </div>
      )}

      {/* Executive Metric Cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
        gap: '16px', 
        marginBottom: '28px' 
      }}>
        <div className="card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Layers size={24} />
          </div>
          <div>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Campaigns</span>
            <h3 style={{ margin: '4px 0 0 0', fontSize: '24px', fontWeight: 850, color: 'var(--text-main)' }}>
              {stats?.total_campaigns || campaigns.length}
            </h3>
          </div>
        </div>

        <div className="card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Play size={24} />
          </div>
          <div>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Active / Running</span>
            <h3 style={{ margin: '4px 0 0 0', fontSize: '24px', fontWeight: 850, color: '#059669' }}>
              {stats?.active_running || campaigns.filter(c => c.status === 'running').length}
            </h3>
          </div>
        </div>

        <div className="card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Clock size={24} />
          </div>
          <div>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Pending Review</span>
            <h3 style={{ margin: '4px 0 0 0', fontSize: '24px', fontWeight: 850, color: '#d97706' }}>
              {stats?.pending_manager_review || campaigns.filter(c => c.status === 'pending_manager_review').length}
            </h3>
          </div>
        </div>

        <div className="card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#fdf8e2', color: '#b45309', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <DollarSign size={24} />
          </div>
          <div>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Budget</span>
            <h3 style={{ margin: '4px 0 0 0', fontSize: '22px', fontWeight: 850, color: '#92400e' }}>
              {formatINR(stats?.total_budget_allocated || campaigns.reduce((acc, c) => acc + Number(c.total_amount || 0), 0))}
            </h3>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div style={{
        background: '#ffffff',
        border: '1px solid var(--border-color)',
        borderRadius: '14px',
        padding: '16px 20px',
        marginBottom: '24px',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '14px',
        alignItems: 'center'
      }}>
        <div style={{ flex: '1 1 240px', position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            className="form-control"
            placeholder="Search by campaign title, client name, or notes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: '38px', borderRadius: '10px' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <select 
            className="form-control" 
            value={platformFilter} 
            onChange={(e) => setPlatformFilter(e.target.value)}
            style={{ width: '150px', borderRadius: '10px', fontSize: '13.5px' }}
          >
            <option value="all">All Platforms</option>
            <option value="meta">Meta Ads</option>
            <option value="google">Google Ads</option>
            <option value="both">Meta & Google</option>
          </select>

          <select 
            className="form-control" 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ width: '175px', borderRadius: '10px', fontSize: '13.5px' }}
          >
            <option value="all">All Statuses</option>
            <option value="pending_manager_review">Pending Review</option>
            <option value="assigned">Assigned to Employee</option>
            <option value="running">Active / Running</option>
            <option value="paused">Paused</option>
            <option value="completed">Completed</option>
          </select>

          <select 
            className="form-control" 
            value={typeFilter} 
            onChange={(e) => setTypeFilter(e.target.value)}
            style={{ width: '170px', borderRadius: '10px', fontSize: '13.5px' }}
          >
            <option value="all">All Campaign Types</option>
            {CAMPAIGN_TYPES.map(t => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Campaigns Listing */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
          <div style={{ width: '32px', height: '32px', border: '3px solid #e2e8f0', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 12px auto' }}></div>
          <p>Loading campaign runs...</p>
        </div>
      ) : campaigns.length === 0 ? (
        <div style={{
          background: '#ffffff',
          border: '1px dashed var(--border-color)',
          borderRadius: '16px',
          padding: '60px 24px',
          textAlign: 'center'
        }}>
          <AppIcon name="campaignTeam" size={56} style={{ margin: '0 auto 16px auto', display: 'block' }} />
          <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-main)', marginBottom: '8px' }}>
            No Campaign Runs Found
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', maxWidth: '480px', margin: '0 auto 20px auto' }}>
            {search || platformFilter !== 'all' || statusFilter !== 'all' 
              ? 'No campaigns match the selected filters. Try clearing search and filter parameters.'
              : 'Get started by creating your first client campaign run.'}
          </p>
          {(isAdmin || isManager) && (
            <button className="btn btn-primary" onClick={handleOpenCreateModal}>
              <Plus size={16} style={{ marginRight: '6px' }} /> Create Campaign Run
            </button>
          )}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {campaigns.map((camp) => {
            const statusCfg = STATUS_CONFIG[camp.status] || STATUS_CONFIG.pending_manager_review;
            const platformInfo = PLATFORMS.find(p => p.value === camp.platform) || PLATFORMS[0];
            const campaignTypeObj = CAMPAIGN_TYPES.find(t => t.value === camp.campaign_type);

            return (
              <div 
                key={camp.id} 
                style={{
                  background: '#ffffff',
                  border: '1px solid var(--border-color)',
                  borderRadius: '16px',
                  padding: '24px',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.03)',
                  transition: 'all 0.2s ease',
                  position: 'relative'
                }}
              >
                {/* Top Header Row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    {/* Client Avatar / Logo */}
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '12px',
                      background: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      overflow: 'hidden',
                      fontWeight: 800,
                      color: 'var(--text-main)',
                      fontSize: '16px'
                    }}>
                      {camp.client_logo_url ? (
                        <img src={camp.client_logo_url} alt={camp.client_company_name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                      ) : (
                        camp.client_company_name?.substring(0, 2).toUpperCase() || 'CL'
                      )}
                    </div>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          {camp.client_company_name}
                        </span>
                        {camp.client_id_code && (
                          <span style={{ fontSize: '11px', background: '#f1f5f9', color: '#475569', padding: '1px 6px', borderRadius: '4px', fontWeight: 700 }}>
                            {camp.client_id_code}
                          </span>
                        )}
                        <span style={{ 
                          fontSize: '11px', 
                          fontWeight: 800, 
                          padding: '2px 8px', 
                          borderRadius: '12px', 
                          background: platformInfo.badgeBg, 
                          color: platformInfo.badgeColor 
                        }}>
                          {platformInfo.label}
                        </span>
                      </div>

                      <h3 style={{ fontSize: '18px', fontWeight: 850, color: 'var(--text-main)', margin: '4px 0 0 0' }}>
                        {camp.title}
                      </h3>
                    </div>
                  </div>

                  {/* Status & Top Action Buttons */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{
                      fontSize: '12px',
                      fontWeight: 800,
                      padding: '4px 12px',
                      borderRadius: '20px',
                      background: statusCfg.bg,
                      color: statusCfg.color,
                      border: `1px solid ${statusCfg.border}`,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}>
                      {camp.status === 'running' && (
                        <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#059669', display: 'inline-block', animation: 'pulse 1.5s infinite' }}></span>
                      )}
                      {statusCfg.label}
                    </span>

                    {isAdmin && (
                      <button 
                        onClick={() => handleDelete(camp)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: '4px' }}
                        title="Delete Campaign"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>

                {camp.campaign_details && (
                  <p style={{ color: 'var(--text-muted)', fontSize: '13.5px', margin: '0 0 16px 0', lineHeight: 1.5 }}>
                    {camp.campaign_details}
                  </p>
                )}

                {/* 3-Step Collaborative Workflow Progress Deck */}
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
                  gap: '16px',
                  background: '#f8fafc',
                  border: '1px solid #f1f5f9',
                  borderRadius: '12px',
                  padding: '16px',
                  marginBottom: '16px'
                }}>
                  {/* Step 1: Admin Order & Creatives */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ width: '22px', height: '22px', borderRadius: '50%', background: '#fef3c7', color: '#92400e', fontSize: '11px', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>1</span>
                      <span style={{ fontSize: '12.5px', fontWeight: 800, color: 'var(--text-main)', textTransform: 'uppercase' }}>Admin Order & Budget</span>
                    </div>

                    <div style={{ fontSize: '13px', color: 'var(--text-main)' }}>
                      <div>Total Budget: <strong style={{ color: '#0f172a' }}>{formatINR(camp.total_amount)}</strong></div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '12px', marginTop: '2px' }}>
                        Dates: <strong>{new Date(camp.start_date).toLocaleDateString('en-GB')}</strong> &rarr; {' '}
                        {camp.has_no_end_date ? (
                          <span style={{ color: '#0284c7', fontWeight: 700 }}>Continuous / No End Date</span>
                        ) : (
                          <strong>{new Date(camp.end_date).toLocaleDateString('en-GB')}</strong>
                        )}
                        {' '}({calculateDurationDays(camp.start_date, camp.end_date, camp.has_no_end_date)})
                      </div>
                    </div>

                    {/* Creatives Preview */}
                    <div style={{ marginTop: '4px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '8px 10px', fontSize: '12px' }}>
                      <div style={{ fontWeight: 700, color: 'var(--text-main)', marginBottom: '2px' }}>Creatives Provided:</div>
                      {camp.creatives_text && (
                        <div style={{ color: '#475569', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {camp.creatives_text}
                        </div>
                      )}
                      {camp.creatives_url ? (
                        <a 
                          href={camp.creatives_url} 
                          target="_blank" 
                          rel="noreferrer" 
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#0284c7', fontWeight: 700, marginTop: '2px', textDecoration: 'none' }}
                        >
                          <ExternalLink size={12} /> Open Creative Assets Link
                        </a>
                      ) : (
                        <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>Assets in specification</span>
                      )}
                    </div>
                  </div>

                  {/* Step 2: Campaign Manager Review & Allocation */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ width: '22px', height: '22px', borderRadius: '50%', background: '#e0f2fe', color: '#0369a1', fontSize: '11px', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>2</span>
                      <span style={{ fontSize: '12.5px', fontWeight: 800, color: 'var(--text-main)', textTransform: 'uppercase' }}>Campaign Manager Review</span>
                    </div>

                    <div style={{ fontSize: '13px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span>Creatives Check:</span>
                        <span style={{ 
                          fontSize: '11.5px', 
                          fontWeight: 800, 
                          color: camp.creatives_status === 'approved' ? '#059669' : '#d97706',
                          background: camp.creatives_status === 'approved' ? '#ecfdf5' : '#fef3c7',
                          padding: '1px 8px',
                          borderRadius: '6px'
                        }}>
                          {camp.creatives_status === 'approved' ? '✓ Creatives OK' : (camp.creatives_status === 'changes_requested' ? 'Changes Needed' : 'Pending Review')}
                        </span>
                      </div>

                      <div style={{ marginTop: '4px' }}>
                        Daily Budget: <strong>{camp.daily_budget ? formatINR(camp.daily_budget) + '/day' : <span style={{ color: '#d97706' }}>Not set</span>}</strong>
                      </div>

                      <div style={{ marginTop: '4px' }}>
                        Type: {campaignTypeObj ? (
                          <strong style={{ color: 'var(--primary)' }}>{campaignTypeObj.label}</strong>
                        ) : (
                          <span style={{ color: '#d97706' }}>Pending setup</span>
                        )}
                        {camp.campaign_type_target && (
                          <span style={{ color: '#475569', fontSize: '11.5px', display: 'block', wordBreak: 'break-all' }}>
                            &rarr; {camp.campaign_type_target}
                          </span>
                        )}
                      </div>

                      <div style={{ marginTop: '4px', fontSize: '12px', color: 'var(--text-muted)' }}>
                        Assigned Employee: <strong>{camp.assigned_employee_name || 'Unassigned'}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Step 3: Employee Execution & Live Link */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ width: '22px', height: '22px', borderRadius: '50%', background: '#ecfdf5', color: '#047857', fontSize: '11px', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>3</span>
                      <span style={{ fontSize: '12.5px', fontWeight: 800, color: 'var(--text-main)', textTransform: 'uppercase' }}>Employee Ad Execution</span>
                    </div>

                    <div style={{ fontSize: '13px' }}>
                      <div>Current Run Status: <strong style={{ color: statusCfg.color }}>{statusCfg.label}</strong></div>
                      
                      {camp.live_campaign_url ? (
                        <div style={{ marginTop: '6px' }}>
                          <a 
                            href={camp.live_campaign_url} 
                            target="_blank" 
                            rel="noreferrer" 
                            style={{ 
                              display: 'inline-flex', 
                              alignItems: 'center', 
                              gap: '5px', 
                              color: '#059669', 
                              fontWeight: 700, 
                              fontSize: '12.5px',
                              background: '#ecfdf5',
                              padding: '4px 10px',
                              borderRadius: '6px',
                              textDecoration: 'none'
                            }}
                          >
                            <ExternalLink size={13} /> View Live Ad / Link
                          </a>
                        </div>
                      ) : (
                        <div style={{ marginTop: '4px', fontSize: '12px', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                          Live ad link not submitted yet
                        </div>
                      )}

                      {camp.employee_notes && (
                        <div style={{ marginTop: '6px', fontSize: '12px', color: '#475569', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '6px 8px' }}>
                          {camp.employee_notes}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Actions Footer */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  {/* Manager Review Action */}
                  {(isAdmin || isManager) && (
                    <button 
                      className="btn btn-secondary btn-sm"
                      onClick={() => handleOpenManagerModal(camp)}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontWeight: 700 }}
                    >
                      <ShieldCheck size={15} style={{ color: '#d97706' }} />
                      {camp.creatives_status === 'approved' && camp.daily_budget ? 'Edit Manager Setup' : 'Manager Review & Assign'}
                    </button>
                  )}

                  {/* Status & Live Link Update Action */}
                  <button 
                    className="btn btn-primary btn-sm"
                    onClick={() => handleOpenStatusModal(camp)}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontWeight: 700 }}
                  >
                    <Play size={14} />
                    Update Status & Live Link
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 1: CREATE CAMPAIGN RUN (ADMIN / INTAKE)                 */}
      {/* ============================================================ */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create Campaign Run"
      >
        <form onSubmit={handleCreateSubmit}>
          {createErrors.submit && (
            <div style={{ padding: '10px 14px', borderRadius: '8px', background: '#fef2f2', color: '#dc2626', marginBottom: '16px', fontSize: '13px' }}>
              {createErrors.submit}
            </div>
          )}

          {/* Client Selection */}
          <div className="form-group" style={{ marginBottom: '16px' }}>
            <label className="form-label" style={{ fontWeight: 700, fontSize: '13px' }}>
              Select Client <span style={{ color: '#dc2626' }}>*</span>
            </label>
            <select
              className="form-control"
              value={createForm.client_id}
              onChange={(e) => setCreateForm({ ...createForm, client_id: e.target.value })}
              style={{ borderRadius: '8px' }}
            >
              <option value="">-- Choose Client --</option>
              {metaOptions.clients.map(c => (
                <option key={c.id} value={c.id}>
                  {c.company_name} {c.client_id_code ? `(${c.client_id_code})` : ''} - {c.client_name}
                </option>
              ))}
            </select>
            {createErrors.client_id && <span style={{ color: '#dc2626', fontSize: '12px' }}>{createErrors.client_id}</span>}
          </div>

          {/* Campaign Title */}
          <div className="form-group" style={{ marginBottom: '16px' }}>
            <label className="form-label" style={{ fontWeight: 700, fontSize: '13px' }}>
              Campaign Title / Concept <span style={{ color: '#dc2626' }}>*</span>
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Festive Sale Lead Generation 2026"
              value={createForm.title}
              onChange={(e) => setCreateForm({ ...createForm, title: e.target.value })}
              style={{ borderRadius: '8px' }}
            />
            {createErrors.title && <span style={{ color: '#dc2626', fontSize: '12px' }}>{createErrors.title}</span>}
          </div>

          {/* Platform Selection */}
          <div className="form-group" style={{ marginBottom: '16px' }}>
            <label className="form-label" style={{ fontWeight: 700, fontSize: '13px' }}>
              Platform Target <span style={{ color: '#dc2626' }}>*</span>
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
              {PLATFORMS.map(p => (
                <button
                  type="button"
                  key={p.value}
                  onClick={() => setCreateForm({ ...createForm, platform: p.value })}
                  style={{
                    padding: '12px',
                    borderRadius: '10px',
                    border: createForm.platform === p.value ? '2px solid var(--primary)' : '1px solid #e2e8f0',
                    background: createForm.platform === p.value ? '#fdf8e2' : '#ffffff',
                    fontWeight: 700,
                    fontSize: '13px',
                    color: createForm.platform === p.value ? '#92400e' : 'var(--text-main)',
                    cursor: 'pointer'
                  }}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Total Budget Amount */}
          <div className="form-group" style={{ marginBottom: '16px' }}>
            <label className="form-label" style={{ fontWeight: 700, fontSize: '13px' }}>
              Total Allocated Budget (₹) <span style={{ color: '#dc2626' }}>*</span>
            </label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', fontWeight: 800, color: 'var(--text-muted)' }}>₹</span>
              <input
                type="number"
                min="1"
                step="1"
                className="form-control"
                placeholder="e.g. 50000"
                value={createForm.total_amount}
                onChange={(e) => setCreateForm({ ...createForm, total_amount: e.target.value })}
                style={{ paddingLeft: '30px', borderRadius: '8px' }}
              />
            </div>
            {createErrors.total_amount && <span style={{ color: '#dc2626', fontSize: '12px' }}>{createErrors.total_amount}</span>}
          </div>

          {/* Date Range Selection with Ongoing Toggle */}
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '14px', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ fontWeight: 700, fontSize: '13px', color: 'var(--text-main)' }}>Campaign Schedule</span>
              <label style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12.5px', fontWeight: 700, cursor: 'pointer', color: '#0369a1' }}>
                <input
                  type="checkbox"
                  checked={createForm.has_no_end_date}
                  onChange={(e) => setCreateForm({ ...createForm, has_no_end_date: e.target.checked })}
                />
                Continuous / Without End Date
              </label>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Start Date *</label>
                <input
                  type="date"
                  className="form-control"
                  value={createForm.start_date}
                  onChange={(e) => setCreateForm({ ...createForm, start_date: e.target.value })}
                  style={{ borderRadius: '8px' }}
                />
                {createErrors.start_date && <span style={{ color: '#dc2626', fontSize: '11.5px' }}>{createErrors.start_date}</span>}
              </div>

              <div>
                <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                  End Date {createForm.has_no_end_date ? '(Disabled - Ongoing)' : '*'}
                </label>
                <input
                  type="date"
                  disabled={createForm.has_no_end_date}
                  className="form-control"
                  value={createForm.end_date}
                  onChange={(e) => setCreateForm({ ...createForm, end_date: e.target.value })}
                  style={{ borderRadius: '8px', opacity: createForm.has_no_end_date ? 0.5 : 1 }}
                />
                {createErrors.end_date && <span style={{ color: '#dc2626', fontSize: '11.5px' }}>{createErrors.end_date}</span>}
              </div>
            </div>

            <div style={{ marginTop: '8px', fontSize: '12px', color: 'var(--primary)', fontWeight: 700 }}>
              Schedule Summary: {calculateDurationDays(createForm.start_date, createForm.end_date, createForm.has_no_end_date)}
            </div>
          </div>

          {/* Creatives Information from Admin */}
          <div className="form-group" style={{ marginBottom: '16px' }}>
            <label className="form-label" style={{ fontWeight: 700, fontSize: '13px' }}>
              Creatives Specifications & Ad Copy Notes
            </label>
            <textarea
              rows="3"
              className="form-control"
              placeholder="Provide ad copy headlines, target audience keywords, design guidelines, dimensions, or specific offers..."
              value={createForm.creatives_text}
              onChange={(e) => setCreateForm({ ...createForm, creatives_text: e.target.value })}
              style={{ borderRadius: '8px' }}
            />
          </div>

          {/* Creatives Asset Link */}
          <div className="form-group" style={{ marginBottom: '16px' }}>
            <label className="form-label" style={{ fontWeight: 700, fontSize: '13px' }}>
              Creatives Asset Link (Google Drive / Figma / Dropbox)
            </label>
            <input
              type="url"
              className="form-control"
              placeholder="https://drive.google.com/..."
              value={createForm.creatives_url}
              onChange={(e) => setCreateForm({ ...createForm, creatives_url: e.target.value })}
              style={{ borderRadius: '8px' }}
            />
          </div>

          {/* Additional Notes */}
          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label className="form-label" style={{ fontWeight: 700, fontSize: '13px' }}>
              General Campaign Strategy & Client Objective
            </label>
            <textarea
              rows="2"
              className="form-control"
              placeholder="e.g. Focus on high-intent conversions in Chennai & Bangalore..."
              value={createForm.campaign_details}
              onChange={(e) => setCreateForm({ ...createForm, campaign_details: e.target.value })}
              style={{ borderRadius: '8px' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={actionLoading}>
              {actionLoading ? 'Creating...' : 'Submit to Campaign Manager'}
            </button>
          </div>
        </form>
      </Modal>

      {/* ============================================================ */}
      {/* MODAL 2: CAMPAIGN MANAGER REVIEW & ASSIGNMENT                */}
      {/* ============================================================ */}
      <Modal
        isOpen={isManagerModalOpen}
        onClose={() => setIsManagerModalOpen(false)}
        title={`Manager Review: ${selectedCampaign?.title || 'Campaign'}`}
      >
        <form onSubmit={handleManagerSubmit}>
          {managerErrors.submit && (
            <div style={{ padding: '10px 14px', borderRadius: '8px', background: '#fef2f2', color: '#dc2626', marginBottom: '16px', fontSize: '13px' }}>
              {managerErrors.submit}
            </div>
          )}

          {/* Quick Context Deck */}
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '12px 14px', marginBottom: '16px', fontSize: '12.5px' }}>
            <div>Client: <strong>{selectedCampaign?.client_company_name}</strong></div>
            <div>Total Budget: <strong>{formatINR(selectedCampaign?.total_amount)}</strong> | Platform: <strong>{selectedCampaign?.platform?.toUpperCase()}</strong></div>
            {selectedCampaign?.creatives_url && (
              <div style={{ marginTop: '4px' }}>
                <a href={selectedCampaign.creatives_url} target="_blank" rel="noreferrer" style={{ color: '#0284c7', fontWeight: 700 }}>
                  &rarr; Inspect Creative Files
                </a>
              </div>
            )}
          </div>

          {/* Creatives Approval Toggle */}
          <div className="form-group" style={{ marginBottom: '16px' }}>
            <label className="form-label" style={{ fontWeight: 700, fontSize: '13px' }}>
              Creatives Verification <span style={{ color: '#dc2626' }}>*</span>
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setManagerForm({ ...managerForm, creatives_status: 'approved' })}
                style={{
                  padding: '10px',
                  borderRadius: '8px',
                  border: managerForm.creatives_status === 'approved' ? '2px solid #059669' : '1px solid #e2e8f0',
                  background: managerForm.creatives_status === 'approved' ? '#ecfdf5' : '#ffffff',
                  color: managerForm.creatives_status === 'approved' ? '#065f46' : 'var(--text-main)',
                  fontWeight: 700,
                  fontSize: '13px',
                  cursor: 'pointer'
                }}
              >
                ✓ Creatives are OK / Approved
              </button>

              <button
                type="button"
                onClick={() => setManagerForm({ ...managerForm, creatives_status: 'changes_requested' })}
                style={{
                  padding: '10px',
                  borderRadius: '8px',
                  border: managerForm.creatives_status === 'changes_requested' ? '2px solid #d97706' : '1px solid #e2e8f0',
                  background: managerForm.creatives_status === 'changes_requested' ? '#fef3c7' : '#ffffff',
                  color: managerForm.creatives_status === 'changes_requested' ? '#92400e' : 'var(--text-main)',
                  fontWeight: 700,
                  fontSize: '13px',
                  cursor: 'pointer'
                }}
              >
                ⚠ Needs Revision / Changes
              </button>
            </div>
          </div>

          {/* Creatives Review Notes */}
          <div className="form-group" style={{ marginBottom: '16px' }}>
            <label className="form-label" style={{ fontWeight: 700, fontSize: '13px' }}>
              Creatives Feedback / Notes
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Dimensions verified, banner approved for Meta feed and story..."
              value={managerForm.creatives_notes}
              onChange={(e) => setManagerForm({ ...managerForm, creatives_notes: e.target.value })}
              style={{ borderRadius: '8px' }}
            />
          </div>

          {/* Minimum Daily Budget */}
          <div className="form-group" style={{ marginBottom: '16px' }}>
            <label className="form-label" style={{ fontWeight: 700, fontSize: '13px' }}>
              Minimum Daily Budget (₹ / Day) <span style={{ color: '#dc2626' }}>*</span>
            </label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', fontWeight: 800, color: 'var(--text-muted)' }}>₹</span>
              <input
                type="number"
                min="1"
                step="1"
                className="form-control"
                placeholder="e.g. 1500"
                value={managerForm.daily_budget}
                onChange={(e) => setManagerForm({ ...managerForm, daily_budget: e.target.value })}
                style={{ paddingLeft: '30px', borderRadius: '8px' }}
              />
            </div>
            {managerErrors.daily_budget && <span style={{ color: '#dc2626', fontSize: '12px' }}>{managerErrors.daily_budget}</span>}
          </div>

          {/* Campaign Type Selector */}
          <div className="form-group" style={{ marginBottom: '16px' }}>
            <label className="form-label" style={{ fontWeight: 700, fontSize: '13px' }}>
              Campaign Type / Objective <span style={{ color: '#dc2626' }}>*</span>
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '8px' }}>
              {CAMPAIGN_TYPES.map(t => {
                const IconComp = t.icon;
                const isSelected = managerForm.campaign_type === t.value;
                return (
                  <button
                    type="button"
                    key={t.value}
                    onClick={() => setManagerForm({ ...managerForm, campaign_type: t.value })}
                    style={{
                      padding: '10px 8px',
                      borderRadius: '8px',
                      border: isSelected ? '2px solid var(--primary)' : '1px solid #e2e8f0',
                      background: isSelected ? '#fdf8e2' : '#ffffff',
                      color: isSelected ? '#92400e' : 'var(--text-main)',
                      fontWeight: 700,
                      fontSize: '12px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    <IconComp size={18} />
                    <span>{t.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Contextual Target Field based on Type */}
          <div className="form-group" style={{ marginBottom: '16px' }}>
            <label className="form-label" style={{ fontWeight: 700, fontSize: '13px' }}>
              {managerForm.campaign_type === 'whatsapp_number' && 'WhatsApp Contact Number *'}
              {managerForm.campaign_type === 'call_ad' && 'Phone Number to Receive Calls *'}
              {managerForm.campaign_type === 'website_link' && 'Destination Website URL *'}
              {managerForm.campaign_type === 'lead_form' && 'Lead Form Name / Target Specification *'}
              {managerForm.campaign_type === 'awareness' && 'Targeting / Geo Details (Optional)'}
            </label>
            <input
              type="text"
              className="form-control"
              placeholder={
                managerForm.campaign_type === 'whatsapp_number' ? 'e.g. +91 9876543210' :
                managerForm.campaign_type === 'call_ad' ? 'e.g. +91 9876543210' :
                managerForm.campaign_type === 'website_link' ? 'e.g. https://www.clientbrand.com/promo' :
                managerForm.campaign_type === 'lead_form' ? 'e.g. Meta Instant Form - March Leads' :
                'e.g. Tamil Nadu, 25-45 age group'
              }
              value={managerForm.campaign_type_target}
              onChange={(e) => setManagerForm({ ...managerForm, campaign_type_target: e.target.value })}
              style={{ borderRadius: '8px' }}
            />
            {managerErrors.campaign_type_target && (
              <span style={{ color: '#dc2626', fontSize: '12px' }}>{managerErrors.campaign_type_target}</span>
            )}
          </div>

          {/* Assign to Campaign Employee */}
          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label className="form-label" style={{ fontWeight: 700, fontSize: '13px' }}>
              Assign to Campaign Employee <span style={{ color: '#dc2626' }}>*</span>
            </label>
            <select
              className="form-control"
              value={managerForm.assigned_employee_id}
              onChange={(e) => setManagerForm({ ...managerForm, assigned_employee_id: e.target.value })}
              style={{ borderRadius: '8px' }}
            >
              <option value="">-- Choose Campaign Team Member --</option>
              {metaOptions.allEmployees.map(emp => (
                <option key={emp.id} value={emp.id}>
                  {emp.full_name} ({emp.employee_id_code}) - {emp.department_name}
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setIsManagerModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={actionLoading}>
              {actionLoading ? 'Saving...' : 'Save & Assign Work'}
            </button>
          </div>
        </form>
      </Modal>

      {/* ============================================================ */}
      {/* MODAL 3: STATUS & LIVE LINK UPDATE (EMPLOYEE / EXECUTION)     */}
      {/* ============================================================ */}
      <Modal
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        title="Update Campaign Run Status & Live Link"
      >
        <form onSubmit={handleStatusSubmit}>
          <div className="form-group" style={{ marginBottom: '16px' }}>
            <label className="form-label" style={{ fontWeight: 700, fontSize: '13px' }}>
              Select Status <span style={{ color: '#dc2626' }}>*</span>
            </label>
            <select
              className="form-control"
              value={statusForm.status}
              onChange={(e) => setStatusForm({ ...statusForm, status: e.target.value })}
              style={{ borderRadius: '8px' }}
            >
              <option value="running">🟢 Active / Running (Live)</option>
              <option value="paused">🟡 Paused</option>
              <option value="completed">🟣 Completed</option>
              <option value="assigned">🔵 Assigned to Employee</option>
              <option value="cancelled">🔴 Cancelled</option>
            </select>
          </div>

          <div className="form-group" style={{ marginBottom: '16px' }}>
            <label className="form-label" style={{ fontWeight: 700, fontSize: '13px' }}>
              Live Ad Link / Ads Manager URL
            </label>
            <input
              type="url"
              className="form-control"
              placeholder="https://business.facebook.com/adsmanager/..."
              value={statusForm.live_campaign_url}
              onChange={(e) => setStatusForm({ ...statusForm, live_campaign_url: e.target.value })}
              style={{ borderRadius: '8px' }}
            />
            <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
              Provide the live ad preview or Meta/Google Ads Manager campaign link.
            </span>
          </div>

          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label className="form-label" style={{ fontWeight: 700, fontSize: '13px' }}>
              Employee Execution Notes / Updates
            </label>
            <textarea
              rows="3"
              className="form-control"
              placeholder="e.g. Campaign launched successfully on Meta. Initial CTR 2.4%, daily budget capped at ₹1,500."
              value={statusForm.employee_notes}
              onChange={(e) => setStatusForm({ ...statusForm, employee_notes: e.target.value })}
              style={{ borderRadius: '8px' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setIsStatusModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={actionLoading}>
              {actionLoading ? 'Updating...' : 'Update Status'}
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
};

export default CampaignRunList;
