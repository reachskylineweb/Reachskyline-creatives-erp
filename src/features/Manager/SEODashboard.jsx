import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import { 
  LayoutDashboard, 
  FileText, 
  CheckCircle, 
  Calendar, 
  Users, 
  ArrowRight,
  Clock,
  ExternalLink,
  BookOpen,
  Send
} from 'lucide-react';
import { Link } from 'react-router-dom';

const SEODashboard = () => {
  const { user } = useAuth();
  const managerProfile = user?.managerProfile || {};

  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
  });

  const [blogs, setBlogs] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    drafts: 0,
    approved: 0,
    released: 0
  });

  const fetchDashboardData = useCallback(async () => {
    if (!managerProfile.department_id) return;
    setLoading(true);
    try {
      // 1. Fetch blogs calendar for selected month
      const blogRes = await api.get('/blog-calendar', {
        params: { month: selectedMonth }
      });
      let blogList = [];
      if (blogRes.data.success) {
        blogList = blogRes.data.data || [];
        setBlogs(blogList);

        let drafts = 0;
        let approved = 0;
        let released = 0;

        blogList.forEach(item => {
          if (item.status === 'draft') drafts++;
          else if (item.status === 'approved') approved++;
          else if (item.status === 'sent_to_employees') released++;
        });

        setStats({
          total: blogList.length,
          drafts,
          approved,
          released
        });
      }

      // 2. Fetch department employees
      const empRes = await api.get('/users/employees/dropdown', {
        params: { departmentId: managerProfile.department_id }
      });
      if (empRes.data.success) {
        setEmployees(empRes.data.data.employees || []);
      }

    } catch (err) {
      console.error('Error loading SEO dashboard data:', err.message);
    } finally {
      setLoading(false);
    }
  }, [selectedMonth, managerProfile.department_id]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Upcoming publications for next 5 dates
  const upcomingBlogs = [...blogs]
    .filter(b => b.status === 'approved' || b.status === 'sent_to_employees')
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 5);

  const monthLabel = new Date(selectedMonth + '-02').toLocaleString([], { month: 'long', year: 'numeric' });

  if (loading && blogs.length === 0) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '400px', gap: '16px', color: 'var(--text-muted)' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid #e2e8f0', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        <p style={{ fontWeight: 600 }}>Loading SEO Manager Dashboard...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Dashboard Toolbar Header */}
      <div className="table-toolbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 800, color: 'var(--text-color)', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <LayoutDashboard size={24} style={{ color: 'var(--primary)' }} />
            SEO Management Dashboard
          </h2>
          <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: 'var(--text-muted)' }}>
            Overview of client SEO targets, drafts, and postings for <strong>{monthLabel}</strong>.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <input 
            type="month" 
            value={selectedMonth} 
            onChange={(e) => setSelectedMonth(e.target.value)}
            style={{ padding: '8px 12px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', outline: 'none' }}
          />
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
        
        {/* Total Target */}
        <div className="card stat-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '24px' }}>
          <div className="stat-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span className="stat-title" style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Targets</span>
            <div className="stat-icon bg-blue" style={{ padding: '8px', borderRadius: '6px' }}>
              <BookOpen size={20} />
            </div>
          </div>
          <div>
            <div className="stat-value" style={{ fontSize: '32px', fontWeight: 800 }}>{stats.total}</div>
            <span className="stat-footer" style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Tasks configured this month</span>
          </div>
        </div>

        {/* Drafts count */}
        <div className="card stat-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '24px' }}>
          <div className="stat-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span className="stat-title" style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Drafts</span>
            <div className="stat-icon bg-orange" style={{ padding: '8px', borderRadius: '6px' }}>
              <Clock size={20} />
            </div>
          </div>
          <div>
            <div className="stat-value" style={{ fontSize: '32px', fontWeight: 800 }}>{stats.drafts}</div>
            <span className="stat-footer" style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Awaiting content writing</span>
          </div>
        </div>

        {/* Approved count */}
        <div className="card stat-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '24px' }}>
          <div className="stat-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span className="stat-title" style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Approved</span>
            <div className="stat-icon bg-purple" style={{ padding: '8px', borderRadius: '6px' }}>
              <CheckCircle size={20} />
            </div>
          </div>
          <div>
            <div className="stat-value" style={{ fontSize: '32px', fontWeight: 800 }}>{stats.approved}</div>
            <span className="stat-footer" style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Ready for final release</span>
          </div>
        </div>

        {/* Released count */}
        <div className="card stat-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '24px' }}>
          <div className="stat-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span className="stat-title" style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Released</span>
            <div className="stat-icon bg-green" style={{ padding: '8px', borderRadius: '6px' }}>
              <Send size={20} />
            </div>
          </div>
          <div>
            <div className="stat-value" style={{ fontSize: '32px', fontWeight: 800 }}>{stats.released}</div>
            <span className="stat-footer" style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Sent to SEO specialists</span>
          </div>
        </div>

      </div>

      {/* Grid: Upcoming Blogs & Employees */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', flexWrap: 'wrap' }}>
        
        {/* Upcoming publications list */}
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700 }}>Upcoming SEO Postings</h3>
            <Link to="/manager/blog-calendar" className="btn btn-secondary btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              Full Calendar <ArrowRight size={14} />
            </Link>
          </div>

          {upcomingBlogs.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
              <Calendar size={32} style={{ margin: '0 auto 12px auto', opacity: 0.5 }} />
              <p style={{ fontSize: '14px' }}>No upcoming approved SEO tasks scheduled for this month.</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="enterprise-table" style={{ width: '100%' }}>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Client</th>
                    <th>Type</th>
                    <th>Task Title</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {upcomingBlogs.map(blog => (
                    <tr key={blog.id}>
                      <td style={{ fontWeight: 700 }}>
                        {new Date(blog.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                      </td>
                      <td>{blog.client_name}</td>
                      <td>
                        <span className="badge" style={{ backgroundColor: blog.type === 'gmb' ? '#ecfdf5' : blog.type === 'backlink' ? '#f5f3ff' : 'var(--primary-light)', color: blog.type === 'gmb' ? '#047857' : blog.type === 'backlink' ? '#6d28d9' : 'var(--primary)', fontWeight: 700, textTransform: 'uppercase', fontSize: '10px' }}>
                          {blog.type || 'blog'}
                        </span>
                      </td>
                      <td style={{ fontWeight: 500 }}>{blog.title}</td>
                      <td>
                        <span className={`badge ${blog.status === 'sent_to_employees' ? 'badge-active' : 'badge-pending'}`}>
                          {blog.status === 'sent_to_employees' ? 'released' : blog.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* SEO Team Members */}
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700 }}>SEO Team ({employees.length})</h3>
            <Link to="/manager/employees" className="btn btn-secondary btn-sm">
              Manage
            </Link>
          </div>

          {employees.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
              <Users size={32} style={{ margin: '0 auto 12px auto', opacity: 0.5 }} />
              <p style={{ fontSize: '14px' }}>No employees registered in the SEO department yet.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {employees.slice(0, 5).map(emp => (
                <div key={emp.id} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--primary-light)',
                    color: 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '14px'
                  }}>
                    {emp.full_name.charAt(0).toUpperCase()}
                  </div>
                  <div style={{ flex: 1 }}>
                    <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-color)', display: 'block' }}>{emp.full_name}</span>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>ID: {emp.employee_id_code}</span>
                  </div>
                  <span className={`badge ${emp.status === 'active' ? 'badge-active' : 'badge-inactive'}`} style={{ fontSize: '10px' }}>
                    {emp.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
};

export default SEODashboard;
