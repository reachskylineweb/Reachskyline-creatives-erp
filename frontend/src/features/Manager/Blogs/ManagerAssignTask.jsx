import React, { useState, useEffect, useCallback } from 'react';
import { 
  Users, Calendar, RefreshCw, Send, CheckCircle2, 
  Search, AlertCircle, Plus, Building2
} from 'lucide-react';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const SEOAssignTask = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [selectedMonth, setSelectedMonth] = useState(() => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
  });

  const [loading, setLoading] = useState(false);
  const [blogItems, setBlogItems] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Row state maps
  const [selectedEmployees, setSelectedEmployees] = useState({}); // taskId -> empId
  const [featuredImages, setFeaturedImages] = useState({});       // taskId -> 'YES' | 'NO'
  const [sendingTaskId, setSendingTaskId] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch calendar tasks and employee list
  const fetchData = useCallback(async () => {
    setLoading(true);
    setSuccessMessage('');
    setErrorMessage('');
    try {
      const [blogRes, empRes] = await Promise.all([
        api.get('/blog-calendar', { params: { month: selectedMonth } }),
        api.get('/users/employees/dropdown')
      ]);

      if (blogRes.data.success) {
        const list = blogRes.data.data || [];
        setBlogItems(list);

        // Pre-fill row state from items
        const empMap = {};
        const featMap = {};
        list.forEach(item => {
          if (item.assigned_employee_id) {
            empMap[item.id] = String(item.assigned_employee_id);
          }
          const featVal = item.featured_image || item.has_featured_image;
          featMap[item.id] = (featVal === 'NO' || featVal === false || featVal === 0) ? 'NO' : 'YES';
        });
        setSelectedEmployees(empMap);
        setFeaturedImages(featMap);
      }

      if (empRes.data.success && empRes.data.data) {
        const raw = empRes.data.data;
        const empList = Array.isArray(raw) ? raw : (Array.isArray(raw?.employees) ? raw.employees : []);
        setEmployees(empList);
      }
    } catch (err) {
      console.error('Error fetching SEO assign task data:', err.message);
      setErrorMessage('Failed to load tasks data.');
    } finally {
      setLoading(false);
    }
  }, [selectedMonth]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Handle Send Assignment Click
  const handleSendAssignment = async (item) => {
    const empId = selectedEmployees[item.id];
    const featOption = featuredImages[item.id] || 'YES';
    setSendingTaskId(item.id);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      const dateObj = new Date(item.date);
      const yyyy = dateObj.getFullYear();
      const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
      const dd = String(dateObj.getDate()).padStart(2, '0');
      const dateStr = `${yyyy}-${mm}-${dd}`;

      const payload = {
        date: dateStr,
        title: item.title,
        description: item.description || '',
        status: empId ? 'assigned' : 'draft',
        type: item.type || 'blog',
        assigned_employee_id: empId ? Number(empId) : null,
        featured_image: featOption,
        has_featured_image: featOption,
        featured_image_required: featOption,
        content_link: item.content_link || null,
        google_drive_link: item.google_drive_link || null
      };

      const res = await api.put(`/blog-calendar/${item.id}`, payload);
      if (res.data.success) {
        const empObj = employees.find(e => Number(e.id) === Number(empId)) || {};
        const empName = empObj.full_name || 'employee';
        
        // Update local item state
        setBlogItems(prev => prev.map(t => t.id === item.id ? { 
          ...t, 
          status: empId ? 'assigned' : 'draft', 
          assigned_employee_id: empId ? Number(empId) : null,
          assigned_employee_name: empId ? empName : null,
          employee_name: empId ? empName : null,
          featured_image: featOption,
          has_featured_image: featOption
        } : t));

        setSuccessMessage(empId ? `Employee assigned successfully!` : `Task unassigned successfully!`);
        
        // Auto-dismiss success message after 5 seconds
        setTimeout(() => setSuccessMessage(''), 5000);
      }
    } catch (err) {
      console.error('Error assigning employee:', err);
      setErrorMessage(err.response?.data?.message || 'Failed to update assignment.');
    } finally {
      setSendingTaskId(null);
    }
  };

  const [selectedClientFilter, setSelectedClientFilter] = useState('all');

  // Extract unique client names for client-wise filtration option
  const uniqueClients = Array.from(new Set(blogItems.map(item => item.client_name).filter(Boolean))).sort();

  // Filter items by client and search term
  const filteredItems = blogItems.filter(item => {
    if (selectedClientFilter !== 'all' && item.client_name !== selectedClientFilter) {
      return false;
    }
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const client = (item.client_name || '').toLowerCase();
      const title = (item.title || '').toLowerCase();
      const code = (item.activity_code || item.type || '').toLowerCase();
      return client.includes(term) || title.includes(term) || code.includes(term);
    }
    return true;
  });

  // Group filtered items by Client
  const groupedByClient = filteredItems.reduce((acc, item) => {
    const client = item.client_name || 'Unassigned Client';
    if (!acc[client]) acc[client] = [];
    acc[client].push(item);
    return acc;
  }, {});

  const formatMonthDisplay = (monthStr) => {
    const [y, m] = monthStr.split('-').map(Number);
    const d = new Date(y, m - 1, 1);
    return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  return (
    <div style={{ padding: '30px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-color)', display: 'flex', alignItems: 'center', gap: '10px', margin: 0 }}>
            <Users size={26} style={{ color: 'var(--primary)' }} />
            Assign Work Tasks to Employees
          </h1>
          <p style={{ margin: '6px 0 0 0', color: 'var(--text-muted)', fontSize: '13px' }}>
            Client-wise task allocation for blog posting, GMB, and SEO deliverables
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Client Filter Option */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#fff', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', padding: '6px 12px' }}>
            <Building2 size={16} style={{ color: 'var(--primary)' }} />
            <select 
              value={selectedClientFilter}
              onChange={(e) => setSelectedClientFilter(e.target.value)}
              style={{ border: 'none', outline: 'none', fontWeight: 700, fontSize: '14px', backgroundColor: 'transparent', cursor: 'pointer' }}
            >
              <option value="all">All Clients ({uniqueClients.length})</option>
              {uniqueClients.map(clientName => (
                <option key={clientName} value={clientName}>{clientName}</option>
              ))}
            </select>
          </div>

          {/* Month Filter Option */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#fff', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', padding: '6px 12px' }}>
            <Calendar size={16} style={{ color: 'var(--text-muted)' }} />
            <input 
              type="month" 
              value={selectedMonth} 
              onChange={(e) => setSelectedMonth(e.target.value)}
              style={{ border: 'none', outline: 'none', fontWeight: 700, fontSize: '14px', backgroundColor: 'transparent' }}
            />
          </div>
          
          <button className="btn btn-secondary" onClick={fetchData} disabled={loading} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
          </button>
        </div>
      </div>

      {/* Success Alert Banner */}
      {successMessage && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 18px', backgroundColor: '#ecfdf5', border: '1px solid #a7f3d0', color: '#047857', borderRadius: '8px', marginBottom: '20px', fontWeight: 700, fontSize: '14px' }}>
          <CheckCircle2 size={20} />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Error Alert Banner */}
      {errorMessage && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 18px', backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', borderRadius: '8px', marginBottom: '20px', fontWeight: 700, fontSize: '14px' }}>
          <AlertCircle size={20} />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Search Input Bar */}
      <div className="card" style={{ padding: '16px 20px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Search size={18} style={{ color: 'var(--text-muted)' }} />
        <input
          type="text"
          placeholder="Search by client, blog title, or type..."
          className="form-control"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: '100%', border: 'none', outline: 'none', fontSize: '14px', boxShadow: 'none' }}
        />
      </div>

      {/* Client-wise Cards & Task Tables */}
      {loading ? (
        <div style={{ padding: '80px', textAlign: 'center', color: 'var(--text-muted)' }}>
          <div className="spinner" style={{ margin: '0 auto 12px auto' }}></div>
          <span>Loading scheduled tasks...</span>
        </div>
      ) : Object.keys(groupedByClient).length === 0 ? (
        <div className="card" style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
          <Building2 size={40} style={{ margin: '0 auto 12px auto', opacity: 0.5 }} />
          <h3 style={{ margin: 0, fontWeight: 700 }}>No tasks found</h3>
          <p style={{ margin: '6px 0 0 0', fontSize: '13px' }}>
            No blog or SEO calendar tasks match your search for {formatMonthDisplay(selectedMonth)}.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {Object.entries(groupedByClient).map(([clientName, items]) => (
            <div key={clientName} className="card" style={{ padding: 0, borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
              {/* Client Group Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', backgroundColor: '#fafafa', borderBottom: '1px solid var(--border-color)', flexWrap: 'wrap', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Building2 size={20} style={{ color: 'var(--primary)' }} />
                  <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: 'var(--text-color)' }}>{clientName}</h3>
                  <span className="badge" style={{ backgroundColor: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0', padding: '4px 12px', borderRadius: '99px', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase' }}>
                    {items.length} {items.length === 1 ? 'TASK SCHEDULED' : 'TASKS SCHEDULED'}
                  </span>
                </div>

                {/* Top Pagination Controls */}
                {totalPages > 1 && (
                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                    <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginRight: '6px' }}>
                      Showing {startIndex + 1}-{endIndex} of {items.length}
                    </span>
                    <button
                      className="btn btn-secondary btn-sm"
                      disabled={currentPage === 1}
                      onClick={() => handlePageChange(clientName, currentPage - 1)}
                      style={{ padding: '3px 8px', fontSize: '12px' }}
                    >
                      Previous
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(clientName, pageNum)}
                        className={`btn btn-sm ${pageNum === currentPage ? 'btn-primary' : 'btn-secondary'}`}
                        style={{
                          padding: '3px 8px',
                          fontSize: '12px',
                          fontWeight: pageNum === currentPage ? 800 : 600,
                          minWidth: '28px'
                        }}
                      >
                        {pageNum}
                      </button>
                    ))}
                    <button
                      className="btn btn-secondary btn-sm"
                      disabled={currentPage === totalPages}
                      onClick={() => handlePageChange(clientName, currentPage + 1)}
                      style={{ padding: '3px 8px', fontSize: '12px' }}
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>

              {/* Client Tasks Table */}
              <div className="table-responsive">
                <table className="tracker-enterprise-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#fff', borderBottom: '2px solid var(--border-color)' }}>
                      <th style={{ padding: '12px 18px', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', width: '120px' }}>DATE</th>
                      <th style={{ padding: '12px 18px', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)' }}>TASK TITLE</th>
                      <th style={{ padding: '12px 18px', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', width: '100px' }}>TYPE</th>
                      <th style={{ padding: '12px 18px', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', width: '120px' }}>STATUS</th>
                      <th style={{ padding: '12px 18px', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', width: '200px' }}>ASSIGN EMPLOYEE</th>
                      <th style={{ padding: '12px 18px', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', width: '220px' }}>FEATURE IMAGE</th>
                      <th style={{ padding: '12px 18px', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', width: '110px', textAlign: 'center' }}>ACTION</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map(item => {
                      const isAssigned = item.status === 'assigned' || !!item.assigned_employee_id;
                      const dateDisplay = item.date 
                        ? new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
                        : 'N/A';

                      return (
                        <tr key={item.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                          {/* DATE */}
                          <td style={{ padding: '14px 18px', fontWeight: 700, color: '#d97706', fontSize: '13px', whiteSpace: 'nowrap' }}>
                            📅 {dateDisplay}
                          </td>

                          {/* TASK TITLE */}
                          <td style={{ padding: '14px 18px', fontWeight: 700, fontSize: '14px', color: 'var(--text-color)' }}>
                            {item.title}
                            {item.description && (
                              <span style={{ display: 'block', fontSize: '12px', fontWeight: 400, color: 'var(--text-muted)', marginTop: '2px' }}>
                                {item.description}
                              </span>
                            )}
                          </td>

                          {/* TYPE */}
                          <td style={{ padding: '14px 18px' }}>
                            <span className="badge" style={{
                              backgroundColor: item.type === 'gmb' ? '#ecfdf5' : item.type === 'backlink' ? '#f5f3ff' : '#eff6ff',
                              color: item.type === 'gmb' ? '#047857' : item.type === 'backlink' ? '#6d28d9' : '#1d4ed8',
                              border: item.type === 'gmb' ? '1px solid #a7f3d0' : item.type === 'backlink' ? '1px solid #ddd6fe' : '1px solid #bfdbfe',
                              fontWeight: 800,
                              textTransform: 'uppercase',
                              fontSize: '10px',
                              padding: '3px 8px',
                              borderRadius: '4px'
                            }}>
                              {item.type || 'BLOG'}
                            </span>
                          </td>

                          {/* STATUS */}
                          <td style={{ padding: '14px 18px' }}>
                            <span style={{
                              backgroundColor: isAssigned ? '#ecfdf5' : '#fef2f2',
                              color: isAssigned ? '#047857' : '#dc2626',
                              border: isAssigned ? '1px solid #a7f3d0' : '1px solid #fecaca',
                              padding: '3px 10px',
                              borderRadius: '12px',
                              fontSize: '10px',
                              fontWeight: 800,
                              textTransform: 'uppercase',
                              display: 'inline-block'
                            }}>
                              {isAssigned ? (item.status === 'sent_to_employees' ? 'RELEASED' : 'ASSIGNED') : 'UNASSIGNED'}
                            </span>
                          </td>

                          {/* ASSIGN EMPLOYEE */}
                          <td style={{ padding: '14px 18px' }}>
                            <select
                              className="form-control"
                              value={selectedEmployees[item.id] || ''}
                              onChange={(e) => setSelectedEmployees(prev => ({ ...prev, [item.id]: e.target.value }))}
                              style={{
                                padding: '6px 12px',
                                borderRadius: '6px',
                                border: '1px solid ' + (selectedEmployees[item.id] ? '#10b981' : 'var(--border-color)'),
                                fontSize: '13px',
                                fontWeight: 600,
                                outline: 'none',
                                width: '100%',
                                backgroundColor: '#fff'
                              }}
                            >
                              <option value="">-- Select Employee --</option>
                              {employees.map(emp => (
                                <option key={emp.id} value={emp.id}>{emp.full_name}</option>
                              ))}
                            </select>
                          </td>

                          {/* FEATURE IMAGE DROPDOWN */}
                          <td style={{ padding: '14px 18px' }}>
                            <select
                              className="form-control"
                              value={featuredImages[item.id] || 'YES'}
                              onChange={(e) => setFeaturedImages(prev => ({ ...prev, [item.id]: e.target.value }))}
                              style={{
                                padding: '6px 12px',
                                borderRadius: '6px',
                                border: '1px solid ' + (featuredImages[item.id] === 'YES' ? '#10b981' : '#64748b'),
                                fontSize: '13px',
                                fontWeight: 700,
                                color: featuredImages[item.id] === 'YES' ? '#15803d' : '#475569',
                                backgroundColor: featuredImages[item.id] === 'YES' ? '#f0fdf4' : '#f8fafc',
                                outline: 'none',
                                width: '100%'
                              }}
                            >
                              <option value="YES">With feature image</option>
                              <option value="NO">Without feature image</option>
                            </select>
                          </td>

                          {/* ACTION / SEND BUTTON */}
                          <td style={{ padding: '14px 18px', textAlign: 'center' }}>
                            <button
                              onClick={() => handleSendAssignment(item)}
                              disabled={sendingTaskId === item.id}
                              className="btn btn-primary btn-sm"
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                fontWeight: 700,
                                padding: '6px 14px',
                                fontSize: '12px',
                                borderRadius: '6px',
                                cursor: 'pointer'
                              }}
                            >
                              <Send size={14} />
                              {sendingTaskId === item.id ? 'Sending...' : 'Send'}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SEOAssignTask;
