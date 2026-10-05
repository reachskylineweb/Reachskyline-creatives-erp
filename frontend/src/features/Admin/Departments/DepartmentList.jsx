import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Plus, Edit2, Trash2, Ban, CheckCircle, Search, Eye, 
  Users, Shield, Layers, Briefcase, TrendingUp, Sparkles, 
  ArrowRight, Building2, UserCheck, FolderCheck, Filter
} from 'lucide-react';
import api from '../../../utils/api';
import Modal from '../../../components/Modal';
import { FormInput, FormSelect, FormTextArea } from '../../../components/FormFields';
import DepartmentDetail from './DepartmentDetail';
import AppIcon from '../../../utils/appIcons';

// Helper to determine Department visual accents
const getDeptTheme = (code = '', name = '') => {
  const normalized = (code + ' ' + name).toLowerCase();
  if (normalized.includes('cd') || normalized.includes('creat') || normalized.includes('design')) {
    return {
      gradient: 'linear-gradient(135deg, #DAA71B 0%, #f59e0b 100%)',
      iconBg: '#fef3c7',
      iconColor: '#b45309',
      borderGlow: 'rgba(218, 167, 27, 0.4)',
      appIconName: 'creativesTeam',
      icon: Sparkles
    };
  }
  if (normalized.includes('smm') || normalized.includes('social') || normalized.includes('media') || normalized.includes('cmp') || normalized.includes('campaign') || normalized.includes('ads')) {
    return {
      gradient: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
      iconBg: '#ede9fe',
      iconColor: '#6d28d9',
      borderGlow: 'rgba(139, 92, 246, 0.4)',
      appIconName: 'campaignTeam',
      icon: Layers
    };
  }
  if (normalized.includes('seo') || normalized.includes('search')) {
    return {
      gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      iconBg: '#ecfdf5',
      iconColor: '#047857',
      borderGlow: 'rgba(16, 185, 129, 0.4)',
      appIconName: 'seoTeam',
      icon: TrendingUp
    };
  }
  if (normalized.includes('bd') || normalized.includes('business') || normalized.includes('sales')) {
    return {
      gradient: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
      iconBg: '#eff6ff',
      iconColor: '#1d4ed8',
      borderGlow: 'rgba(59, 130, 246, 0.4)',
      appIconName: 'businessDevelopment',
      icon: Briefcase
    };
  }
  if (normalized.includes('hr') || normalized.includes('human')) {
    return {
      gradient: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
      iconBg: '#fce7f3',
      iconColor: '#be185d',
      borderGlow: 'rgba(236, 72, 153, 0.4)',
      appIconName: 'hr',
      icon: Users
    };
  }
  return {
    gradient: 'linear-gradient(135deg, #64748b 0%, #475569 100%)',
    iconBg: '#f1f5f9',
    iconColor: '#334155',
    borderGlow: 'rgba(100, 116, 139, 0.4)',
    appIconName: 'department',
    icon: Building2
  };
};

const DepartmentList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlDeptId = searchParams.get('id');

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);

  // Sorting & Search
  const [sortOption, setSortOption] = useState('name_asc');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentDept, setCurrentDept] = useState(null);
  const [selectedDeptId, setSelectedDeptId] = useState(urlDeptId ? Number(urlDeptId) : null);
  
  // Form fields
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    status: 'active'
  });
  
  const [formErrors, setFormErrors] = useState({});
  const [formSubmitError, setFormSubmitError] = useState('');

  // Synchronize URL search params with state
  useEffect(() => {
    if (urlDeptId) {
      setSelectedDeptId(Number(urlDeptId));
    } else {
      setSelectedDeptId(null);
    }
  }, [urlDeptId]);

  const fetchDepartments = useCallback(async () => {
    setLoading(true);
    try {
      let sortColumn = 'name';
      let sortOrder = 'asc';
      if (sortOption === 'name_desc') {
        sortColumn = 'name';
        sortOrder = 'desc';
      } else if (sortOption === 'employees_desc') {
        sortColumn = 'employee_count';
        sortOrder = 'desc';
      } else if (sortOption === 'code_asc') {
        sortColumn = 'code';
        sortOrder = 'asc';
      }

      const response = await api.get('/departments', {
        params: {
          limit: 100,
          sortColumn,
          sortOrder,
          searchQuery: search,
          statusFilter
        }
      });
      if (response.data.success) {
        setData(response.data.data.departments || []);
        setTotal(response.data.data.pagination?.total || (response.data.data.departments || []).length);
      }
    } catch (err) {
      console.error('Error fetching departments:', err.message);
    } finally {
      setLoading(false);
    }
  }, [sortOption, search, statusFilter]);

  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);

  const handleOpenDepartment = (deptId) => {
    setSelectedDeptId(deptId);
    setSearchParams({ id: deptId });
  };

  const handleBackToList = () => {
    setSelectedDeptId(null);
    setSearchParams({});
    fetchDepartments();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Department Name is required.';
    
    if (!formData.code.trim()) {
      errors.code = 'Department Code is required.';
    } else if (!/^[A-Z0-9\-]{2,15}$/.test(formData.code.toUpperCase().trim())) {
      errors.code = 'Code must be 2-15 characters, uppercase, alphanumeric or hyphens.';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleOpenCreate = () => {
    setCurrentDept(null);
    setFormData({
      name: '',
      code: '',
      description: '',
      status: 'active'
    });
    setFormErrors({});
    setFormSubmitError('');
    setIsFormOpen(true);
  };

  const handleOpenEdit = (dept, e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    setCurrentDept(dept);
    setFormData({
      name: dept.name,
      code: dept.code,
      description: dept.description || '',
      status: dept.status
    });
    setFormErrors({});
    setFormSubmitError('');
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setFormSubmitError('');
    try {
      let res;
      const payload = {
        ...formData,
        code: formData.code.toUpperCase().trim()
      };

      if (currentDept) {
        try {
          res = await api.post(`/departments/${currentDept.id}/update`, payload);
        } catch (_) {
          res = await api.put(`/departments/${currentDept.id}`, payload);
        }
      } else {
        res = await api.post('/departments', payload);
      }

      if (res.data.success) {
        setIsFormOpen(false);
        fetchDepartments();
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Server error occurred.';
      setFormSubmitError(msg);
    }
  };

  const handleDelete = async (dept, e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    const confirmMessage = `Delete "${dept.name}" department? Note: This may impact employees and sub-departments assigned to it.`;
    if (!(await window.confirm(confirmMessage))) return;

    try {
      let res;
      try {
        res = await api.post(`/departments/${dept.id}/delete`);
      } catch (_) {
        res = await api.delete(`/departments/${dept.id}`);
      }
      fetchDepartments();
    } catch (err) {
      console.error('Delete failed:', err.message);
    }
  };

  const handleToggleStatus = async (dept, e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    const nextStatus = dept.status === 'active' ? 'inactive' : 'active';
    try {
      await api.patch(`/departments/${dept.id}/status`, { status: nextStatus });
      fetchDepartments();
    } catch (err) {
      console.error('Status change failed:', err.message);
    }
  };

  // Render Department Detail Workspace if department is selected
  if (selectedDeptId) {
    return (
      <DepartmentDetail 
        deptId={selectedDeptId} 
        onBack={handleBackToList} 
      />
    );
  }

  return (
    <div className="page-container" style={{ maxWidth: '1440px', margin: '0 auto', padding: '24px 32px' }}>
      
      {/* Page Header */}
      <div className="page-header" style={{ marginBottom: '24px' }}>
        <div className="page-title-section">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h2 style={{ fontSize: '26px', fontWeight: 850, color: 'var(--text-main)', letterSpacing: '-0.3px', margin: 0 }}>
              Departments Workspace
            </h2>
            <span style={{ 
              backgroundColor: '#fef3c7', 
              color: '#92400e', 
              fontSize: '12px', 
              fontWeight: 800, 
              padding: '2px 10px', 
              borderRadius: '20px',
              border: '1px solid #fde68a'
            }}>
              {data.length} Units
            </span>
          </div>
          <span className="page-subtitle" style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px', display: 'block' }}>
            Corporate operational divisions, team rosters, and departmental efficiency
          </span>
        </div>
        
        <button 
          className="btn btn-primary" 
          onClick={handleOpenCreate}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            fontWeight: 700,
            borderRadius: '10px',
            boxShadow: '0 2px 8px rgba(218, 167, 27, 0.25)'
          }}
        >
          <Plus size={18} /> Add Department
        </button>
      </div>

      {/* Filter, Search, and Sort Bar */}
      <div 
        style={{
          background: '#ffffff',
          border: '1px solid var(--border-color)',
          borderRadius: '14px',
          padding: '14px 18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '14px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: '280px' }}>
          <div style={{ position: 'relative', width: '100%', maxWidth: '400px' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input
              type="text"
              placeholder="Search departments by name or code..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: '100%',
                padding: '9px 12px 9px 36px',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                fontSize: '13.5px',
                outline: 'none',
                background: '#f8fafc'
              }}
            />
          </div>

          <select
            name="statusFilter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              padding: '9px 14px',
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              fontSize: '13.5px',
              background: '#ffffff',
              color: '#334155',
              cursor: 'pointer'
            }}
          >
            <option value="">All Statuses</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 600 }}>Sort By:</span>
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            style={{
              padding: '9px 14px',
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              fontSize: '13.5px',
              background: '#ffffff',
              color: '#334155',
              cursor: 'pointer'
            }}
          >
            <option value="name_asc">Name (A-Z)</option>
            <option value="name_desc">Name (Z-A)</option>
            <option value="code_asc">Department Code</option>
            <option value="employees_desc">Most Employees</option>
          </select>
        </div>
      </div>

      {/* Main Content Area: Loading / Empty / Department Cards Grid */}
      {loading ? (
        <div style={{ padding: '80px', textAlign: 'center', color: 'var(--text-muted)' }}>
          <div className="spinner" style={{ margin: '0 auto 16px auto' }}></div>
          <span style={{ fontWeight: 600, fontSize: '15px' }}>Loading departments...</span>
        </div>
      ) : data.length === 0 ? (
        <div 
          style={{
            background: '#ffffff',
            border: '2px dashed var(--border-color)',
            borderRadius: '16px',
            padding: '60px 20px',
            textAlign: 'center',
            marginTop: '24px'
          }}
        >
          <Building2 size={48} style={{ color: '#cbd5e1', margin: '0 auto 16px auto' }} />
          <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-main)', marginBottom: '8px' }}>
            No Departments Found
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', maxWidth: '440px', margin: '0 auto 20px auto' }}>
            {search || statusFilter ? 'No departments match your search criteria. Try resetting filters.' : 'Get started by creating your first department workspace.'}
          </p>
          <button 
            className="btn btn-primary" 
            onClick={handleOpenCreate}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
          >
            <Plus size={16} /> Create Department
          </button>
        </div>
      ) : (
        <div className="dept-cards-grid">
          {data.map((dept) => {
            const theme = getDeptTheme(dept.code, dept.name);
            const IconComponent = theme.icon;
            const empCount = Number(dept.employee_count) || 0;
            const mgrCount = Number(dept.manager_count) || 0;
            const subCount = Number(dept.sub_department_count) || 0;
            const clientCount = Number(dept.client_count) || 0;

            return (
              <div 
                key={dept.id} 
                className="dept-card"
                onClick={() => handleOpenDepartment(dept.id)}
              >
                {/* Top Colored Accent Strip */}
                <div 
                  className="dept-card-top-strip" 
                  style={{ background: theme.gradient }}
                />

                <div className="dept-card-body">
                  {/* Card Header */}
                  <div className="dept-card-header">
                    <div 
                      className="dept-card-icon-box"
                      style={{ background: theme.iconBg }}
                    >
                      <AppIcon name={theme.appIconName} size={36} alt={dept.name} />
                    </div>

                    <div className="dept-card-tags">
                      <span className="dept-code-pill">
                        {dept.code}
                      </span>
                      <span className={`badge ${dept.status === 'active' ? 'badge-active' : 'badge-inactive'}`}>
                        {dept.status === 'active' ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3 className="dept-card-title">
                    {dept.name}
                  </h3>
                  <p className="dept-card-desc" title={dept.description || ''}>
                    {dept.description || 'Corporate operations, team deliverables, and strategic workflows.'}
                  </p>

                  {/* Department Personnel & Connected Entities */}
                  <div className="dept-card-stats">
                    <div className="dept-stat-item">
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                        <AppIcon name="employee" size={19} />
                        <span className="dept-stat-val" style={{ color: '#2563eb' }}>{empCount}</span>
                      </div>
                      <span className="dept-stat-lbl">Employees</span>
                    </div>
                    <div className="dept-stat-item">
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                        <AppIcon name="manager" size={19} />
                        <span className="dept-stat-val" style={{ color: '#7c3aed' }}>{mgrCount}</span>
                      </div>
                      <span className="dept-stat-lbl">Managers</span>
                    </div>
                    <div className="dept-stat-item">
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                        <AppIcon name="department" size={19} />
                        <span className="dept-stat-val" style={{ color: '#d97706' }}>{subCount}</span>
                      </div>
                      <span className="dept-stat-lbl">Sub-depts</span>
                    </div>
                    <div className="dept-stat-item">
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                        <AppIcon name="clients" size={19} />
                        <span className="dept-stat-val" style={{ color: '#059669' }}>{clientCount}</span>
                      </div>
                      <span className="dept-stat-lbl">Clients</span>
                    </div>
                  </div>

                  {/* Card Footer with Big CTA and Quick Actions */}
                  <div className="dept-card-footer">
                    <button 
                      className="dept-btn-open"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenDepartment(dept.id);
                      }}
                    >
                      <span>Open Workspace</span>
                      <ArrowRight size={15} />
                    </button>

                    <div className="dept-card-quick-actions">
                      <button 
                        className="dept-action-icon-btn" 
                        onClick={(e) => handleOpenEdit(dept, e)}
                        title="Edit Department"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button 
                        className="dept-action-icon-btn"
                        onClick={(e) => handleToggleStatus(dept, e)}
                        title={dept.status === 'active' ? 'Deactivate Department' : 'Activate Department'}
                      >
                        {dept.status === 'active' ? (
                          <Ban size={14} style={{ color: '#e11d48' }} />
                        ) : (
                          <CheckCircle size={14} style={{ color: '#059669' }} />
                        )}
                      </button>
                      <button 
                        className="dept-action-icon-btn danger" 
                        onClick={(e) => handleDelete(dept, e)}
                        title="Delete Department"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Department Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={currentDept ? 'Edit Department Details' : 'Create New Department'}
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setIsFormOpen(false)}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleFormSubmit}>
              {currentDept ? 'Save Changes' : 'Create Department'}
            </button>
          </>
        }
      >
        <form onSubmit={handleFormSubmit}>
          {formSubmitError && (
            <div style={{
              padding: '10px 14px',
              backgroundColor: 'var(--danger-light)',
              color: 'var(--danger)',
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: 600,
              marginBottom: '16px'
            }}>
              {formSubmitError}
            </div>
          )}

          <FormInput
            label="Department Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            error={formErrors.name}
            placeholder="e.g. Creatives, Digital Marketing, SEO"
            required
          />

          <FormInput
            label="Department Code (Prefix)"
            name="code"
            value={formData.code}
            onChange={handleInputChange}
            error={formErrors.code}
            placeholder="e.g. CD-RS, SMM-RS, SEO-RS"
            required
            disabled={!!currentDept}
          />

          <FormTextArea
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Describe operations, scope of work, and team responsibilities..."
            rows={3}
          />

          <FormSelect
            label="Operational Status"
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            options={[
              { value: 'active', label: 'Active (Operational)' },
              { value: 'inactive', label: 'Inactive (Suspended)' }
            ]}
          />
        </form>
      </Modal>

    </div>
  );
};

export default DepartmentList;
