import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Edit2, Trash2, Ban, CheckCircle, Search, Eye } from 'lucide-react';
import api from '../../../utils/api';
import Table from '../../../components/Table';
import Modal from '../../../components/Modal';
import { FormInput, FormSelect, FormTextArea } from '../../../components/FormFields';
import DepartmentDetail from './DepartmentDetail';

const DepartmentList = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  // Sorting & Search
  const [sortColumn, setSortColumn] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Bulk actions selected IDs
  const [selectedIds, setSelectedIds] = useState([]);

  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentDept, setCurrentDept] = useState(null);
  const [selectedDeptId, setSelectedDeptId] = useState(null);
  
  // Form fields
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    status: 'active'
  });
  
  const [formErrors, setFormErrors] = useState({});
  const [formSubmitError, setFormSubmitError] = useState('');

  const fetchDepartments = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/departments', {
        params: {
          page,
          limit,
          sortColumn,
          sortOrder,
          searchQuery: search,
          statusFilter
        }
      });
      if (response.data.success) {
        setData(response.data.data.departments);
        setTotal(response.data.data.pagination.total);
      }
    } catch (err) {
      console.error('Error fetching departments:', err.message);
    } finally {
      setLoading(false);
    }
  }, [page, sortColumn, sortOrder, search, statusFilter]);

  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);

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
    } else if (!/^[A-Z0-9\-]{2,15}$/.test(formData.code.toUpperCase())) {
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

  const handleOpenEdit = (dept) => {
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
      // Normalizing code to uppercase
      const payload = {
        ...formData,
        code: formData.code.toUpperCase().trim()
      };

      if (currentDept) {
        res = await api.put(`/departments/${currentDept.id}`, payload);
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

  const handleDelete = async (id) => {
    if (!(await window.confirm('Delete department? Note: This may impact employees and projects assigned to it.'))) return;
    try {
      await api.delete(`/departments/${id}`);
      fetchDepartments();
      setSelectedIds(prev => prev.filter(item => item !== id));
    } catch (err) {
      console.error('Delete failed:', err.message);
    }
  };

  const handleToggleStatus = async (dept) => {
    const nextStatus = dept.status === 'active' ? 'inactive' : 'active';
    try {
      await api.patch(`/departments/${dept.id}/status`, { status: nextStatus });
      fetchDepartments();
    } catch (err) {
      console.error('Status change failed:', err.message);
    }
  };

  // Bulk actions handler
  const handleBulkAction = async (action, ids) => {
    try {
      if (action === 'delete') {
        if (!(await window.confirm(`Are you sure you want to delete ${ids.length} selected departments?`))) return;
        await api.post('/departments/bulk-delete', { ids });
      } else if (action === 'activate' || action === 'deactivate') {
        const status = action === 'activate' ? 'active' : 'inactive';
        await api.post('/departments/bulk-status', { ids, status });
      }
      setSelectedIds([]);
      fetchDepartments();
    } catch (err) {
      console.error('Bulk action failed:', err.message);
    }
  };

  const columns = [
    { key: 'code', label: 'Dept Code', sortable: true, width: '120px' },
    { key: 'name', label: 'Department Name', sortable: true },
    { key: 'description', label: 'Description' },
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
          <button className="btn btn-secondary btn-sm" onClick={() => setSelectedDeptId(row.id)} title="View Details">
            <Eye size={14} className="text-primary" />
          </button>
          {/* <button className="btn btn-secondary btn-sm" onClick={() => handleOpenEdit(row)} title="Edit">
            <Edit2 size={14} />
          </button>
          <button 
            className="btn btn-secondary btn-sm" 
            onClick={() => handleToggleStatus(row)} 
            title={row.status === 'active' ? 'Deactivate' : 'Activate'}
          >
            {row.status === 'active' ? <Ban size={14} className="text-danger" /> : <CheckCircle size={14} className="text-success" />}
          </button>
          <button className="btn btn-secondary btn-sm" onClick={() => handleDelete(row.id)} title="Delete">
            <Trash2 size={14} className="text-danger" />
          </button> */}
        </div>
      )
    }
  ];

  // const bulkActions = {
  //   actions: [
  //     { label: 'Delete Selected', value: 'delete', className: 'btn-danger' }
  //   ],
  //   onExecute: handleBulkAction
  // };

  if (selectedDeptId) {
    return (
      <DepartmentDetail 
        deptId={selectedDeptId} 
        onBack={() => {
          setSelectedDeptId(null);
          fetchDepartments();
        }} 
      />
    );
  }

  return (
    <div className="page-container">
      {/* Page Header */}
      <div className="page-header">
        <div className="page-title-section">
          <h2>Departments</h2>
          <span className="page-subtitle">Configure corporate subdivisions and operational codes</span>
        </div>
        {/* <button className="btn btn-primary" onClick={handleOpenCreate}>
          <Plus size={18} /> Add Department
        </button> */}
      </div>

      {/* Filter and Search Bar */}
      <div className="table-toolbar">
        <div className="toolbar-left">
          <div className="table-search">
            <Search size={16} className="text-muted" />
            <input
              type="text"
              placeholder="Search by name or code..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>
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
        selectedIds={selectedIds}
        onSelectChange={setSelectedIds}
        // bulkActions={bulkActions}
      />

      {/* CREATE / EDIT DEPARTMENT MODAL */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={currentDept ? `Edit Department: ${currentDept.name}` : 'Create Department'}
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
            <div style={{ padding: '10px 14px', backgroundColor: 'var(--danger-light)', color: 'var(--danger)', borderRadius: '4px', fontSize: '13px', fontWeight: 600, marginBottom: '16px' }}>
              {formSubmitError}
            </div>
          )}

          <FormInput
            label="Department Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            error={formErrors.name}
            placeholder="e.g. Graphic Design"
            required
          />

          <FormInput
            label="Department Code"
            name="code"
            value={formData.code}
            onChange={handleInputChange}
            error={formErrors.code}
            placeholder="e.g. DEPT-GD"
            disabled={!!currentDept} // Block editing code for created depts
            required
          />

          <FormTextArea
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            error={formErrors.description}
            placeholder="Enter brief department objectives..."
          />

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
        </form>
      </Modal>
    </div>
  );
};

export default DepartmentList;
