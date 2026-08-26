import React, { useState, useEffect } from 'react';
import { Search, LogOut, Check, X, FileText, Briefcase, Award, Users, Layers, AlertCircle, Menu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import Modal from './Modal';

const Header = () => {
  const { user, logout } = useAuth();
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchResults, setSearchResults] = useState(null);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    const nextState = !mobileMenuOpen;
    setMobileMenuOpen(nextState);
    if (nextState) {
      document.body.classList.add('mobile-sidebar-open');
    } else {
      document.body.classList.remove('mobile-sidebar-open');
    }
  };

  // Close mobile menu on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        document.body.classList.remove('mobile-sidebar-open');
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle global search submission
  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setSearchLoading(true);
    setShowSearchModal(true);
    try {
      const response = await api.get(`/search?q=${encodeURIComponent(searchQuery)}`);
      if (response.data && response.data.success) {
        setSearchResults(response.data.data);
      }
    } catch (err) {
      console.error('Global search error:', err.message);
    } finally {
      setSearchLoading(false);
    }
  };

  const isClientPath = window.location.pathname.startsWith('/client');
  const displayUser = isClientPath ? (
    (user && (user.role === 'client' || user.user_type === 'client'))
      ? user
      : { username: 'gem', full_name: 'rajesh kumar', role: 'client' }
  ) : user;

  const adminInitials = displayUser && displayUser.username ? displayUser.username.slice(0, 2).toUpperCase() : 'CL';

  const getUserRoleLabel = () => {
    if (isClientPath || displayUser?.role === 'client') return 'Client Partner';
    if (displayUser?.role === 'manager') {
      const code = displayUser?.managerProfile?.department_code;
      if (code === 'SMM-RS') return 'SMM Manager';
      return displayUser?.managerProfile?.department_name 
        ? `${displayUser.managerProfile.department_name} Manager` 
        : 'Brand Manager';
    }
    if (displayUser?.role === 'employee') {
      const code = displayUser?.employeeProfile?.department_code;
      if (code === 'SMM-RS') return 'SMM Employee';
      return displayUser?.employeeProfile?.department_name 
        ? `${displayUser.employeeProfile.department_name} Employee` 
        : 'Employee';
    }
    if (displayUser?.role === 'admin') return 'Administrator';
    if (displayUser?.role === 'super_admin') return 'Super Administrator';
    return displayUser?.role || 'User';
  };

  return (
    <header className="header">
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
        <button 
          className="mobile-menu-toggle" 
          onClick={toggleMobileMenu} 
          aria-label="Toggle Navigation"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} style={{ flex: 1, maxWidth: '480px' }}>
          <div className="header-search">
            <Search size={18} className="text-muted" />
            <input
              type="text"
              placeholder="Global search client, project, staff..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </form>
      </div>

      {/* Actions (User Profile Menu Only) */}
      <div className="header-actions">
        {/* User Account Info Widget */}
        <div className="user-profile-menu">
          <div className="user-avatar">{adminInitials}</div>
          <div className="user-info">
            <span className="user-name" style={{ color: '#d97706', fontWeight: 800 }}>
              {displayUser?.clientProfile?.company_name || displayUser?.full_name || displayUser?.username || 'Client Partner'}
            </span>
            <span className="user-role">{getUserRoleLabel()}</span>
          </div>
        </div>
      </div>

      {/* Global Search Results Modal */}
      <Modal
        isOpen={showSearchModal}
        onClose={() => {
          setShowSearchModal(false);
          setSearchResults(null);
        }}
        title={`Search Results for "${searchQuery}"`}
      >
        {searchLoading ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <div style={{ display: 'inline-block', width: '24px', height: '24px', border: '3px solid #e2e8f0', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
            <p style={{ marginTop: '12px', color: 'var(--text-muted)' }}>Searching databases...</p>
          </div>
        ) : searchResults ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Clients Results */}
            {searchResults.clients.length > 0 && (
              <div>
                <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--border-color)', paddingBottom: '6px', marginBottom: '8px', fontSize: '14px' }}>
                  <Briefcase size={16} className="text-primary" /> Clients ({searchResults.clients.length})
                </h4>
                <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
                  {searchResults.clients.map(c => (
                    <li key={c.id} style={{ padding: '8px 10px', borderRadius: '4px', backgroundColor: 'var(--bg-app)', marginBottom: '4px' }}>
                      <a href={`/admin/clients?id=${c.id}`} style={{ fontWeight: 600 }}>{c.company_name}</a>
                      <span style={{ color: 'var(--text-muted)', fontSize: '12px', marginLeft: '10px' }}>{c.client_name} • {c.client_id_code}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Departments Results */}
            {searchResults.departments.length > 0 && (
              <div>
                <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--border-color)', paddingBottom: '6px', marginBottom: '8px', fontSize: '14px' }}>
                  <Layers size={16} className="text-teal" /> Departments ({searchResults.departments.length})
                </h4>
                <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
                  {searchResults.departments.map(d => (
                    <li key={d.id} style={{ padding: '8px 10px', borderRadius: '4px', backgroundColor: 'var(--bg-app)', marginBottom: '4px' }}>
                      <a href={`/admin/departments?id=${d.id}`} style={{ fontWeight: 600 }}>{d.name}</a>
                      <span style={{ color: 'var(--text-muted)', fontSize: '12px', marginLeft: '10px' }}>{d.code}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Managers Results */}
            {searchResults.managers.length > 0 && (
              <div>
                <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--border-color)', paddingBottom: '6px', marginBottom: '8px', fontSize: '14px' }}>
                  <Award size={16} className="text-secondary" /> Managers ({searchResults.managers.length})
                </h4>
                <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
                  {searchResults.managers.map(m => (
                    <li key={m.id} style={{ padding: '8px 10px', borderRadius: '4px', backgroundColor: 'var(--bg-app)', marginBottom: '4px' }}>
                      <a href={`/admin/managers?id=${m.id}`} style={{ fontWeight: 600 }}>{m.full_name}</a>
                      <span style={{ color: 'var(--text-muted)', fontSize: '12px', marginLeft: '10px' }}>{m.manager_id_code} • {m.department_name}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Employees Results */}
            {searchResults.employees.length > 0 && (
              <div>
                <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--border-color)', paddingBottom: '6px', marginBottom: '8px', fontSize: '14px' }}>
                  <Users size={16} className="text-purple" /> Employees ({searchResults.employees.length})
                </h4>
                <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
                  {searchResults.employees.map(e => (
                    <li key={e.id} style={{ padding: '8px 10px', borderRadius: '4px', backgroundColor: 'var(--bg-app)', marginBottom: '4px' }}>
                      <a href={`/admin/employees?id=${e.id}`} style={{ fontWeight: 600 }}>{e.full_name}</a>
                      <span style={{ color: 'var(--text-muted)', fontSize: '12px', marginLeft: '10px' }}>{e.employee_id_code} • {e.department_name}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Projects Results */}
            {searchResults.projects.length > 0 && (
              <div>
                <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--border-color)', paddingBottom: '6px', marginBottom: '8px', fontSize: '14px' }}>
                  <FileText size={16} className="text-orange" /> Projects ({searchResults.projects.length})
                </h4>
                <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
                  {searchResults.projects.map(p => (
                    <li key={p.id} style={{ padding: '8px 10px', borderRadius: '4px', backgroundColor: 'var(--bg-app)', marginBottom: '4px' }}>
                      <a href={`/admin/projects?id=${p.id}`} style={{ fontWeight: 600 }}>{p.project_name}</a>
                      <span style={{ color: 'var(--text-muted)', fontSize: '12px', marginLeft: '10px' }}>Client: {p.client_name} • Manager: {p.manager_name}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Empty check */}
            {searchResults.clients.length === 0 &&
             searchResults.departments.length === 0 &&
             searchResults.managers.length === 0 &&
             searchResults.employees.length === 0 &&
             searchResults.projects.length === 0 && (
              <div style={{ textAlign: 'center', padding: '30px 0', color: 'var(--text-muted)' }}>
                <p style={{ fontWeight: 600 }}>No matching records found for "{searchQuery}".</p>
              </div>
            )}
          </div>
        ) : null}
      </Modal>
    </header>
  );
};

export default Header;
