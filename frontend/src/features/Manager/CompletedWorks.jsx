import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import { 
  CheckCircle2, Calendar, FileText, User, RefreshCw, 
  ExternalLink, Search, ChevronLeft, ChevronRight, Globe 
} from 'lucide-react';
import './CompletedWorks.css';

const CompletedWorks = () => {
  const { user } = useAuth();
  const managerProfile = user?.managerProfile || {};

  const [filterType, setFilterType] = useState('month'); // 'day' | 'month'
  const [deliverables, setDeliverables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Date filters
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  });

  const [selectedMonth, setSelectedMonth] = useState(() => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
  });

  // Fetch completed deliverables
  const fetchCompletedWorks = useCallback(async () => {
    if (!managerProfile.department_id) return;
    setLoading(true);
    try {
      const params = {
        departmentFilter: managerProfile.department_id,
        statusFilter: 'completed,approved,client_approved,posted',
        limit: 200,
        page: 1
      };

      if (filterType === 'day') {
        params.dateFilter = selectedDate;
      } else {
        params.monthFilter = selectedMonth;
      }

      const res = await api.get('/deliverables', { params });
      if (res.data.success) {
        // Include both normal deliverables and Job Works
        const allDelivs = res.data.data.deliverables || [];
        setDeliverables(allDelivs.filter(item => (item.is_job_work === 0 && item.activity_code) || item.is_job_work === 1));
      }
    } catch (err) {
      console.error('Error fetching completed works:', err);
    } finally {
      setLoading(false);
    }
  }, [managerProfile.department_id, filterType, selectedDate, selectedMonth]);

  useEffect(() => {
    fetchCompletedWorks();
  }, [fetchCompletedWorks]);

  // Navigate date/month
  const handlePrevDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() - 1);
    setSelectedDate(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`);
  };

  const handleNextDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + 1);
    setSelectedDate(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`);
  };

  const handlePrevMonth = () => {
    const [year, month] = selectedMonth.split('-').map(Number);
    const d = new Date(year, month - 2, 1);
    setSelectedMonth(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
  };

  const handleNextMonth = () => {
    const [year, month] = selectedMonth.split('-').map(Number);
    const d = new Date(year, month, 1);
    setSelectedMonth(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
  };

  const ensureExternalLink = (url) => {
    if (!url) return '';
    const trimmed = url.trim();
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
      return trimmed;
    }
    return `https://${trimmed}`;
  };

  const filteredDeliverables = deliverables.filter(item => 
    (item.client_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.deliverable || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.activity_code || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="completed-container">
      {/* Title */}
      <div className="completed-header">
        <div>
          <h1 className="completed-title">
            <CheckCircle2 size={26} style={{ color: 'var(--success)' }} />
            Completed Works Archive
          </h1>
          <p className="completed-subtitle">
            View and audit all successfully finished and approved content deliverables.
          </p>
        </div>

        <button onClick={fetchCompletedWorks} className="btn-refresh">
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="completed-toolbar">
        <div className="filter-modes">
          <button 
            className={`mode-btn ${filterType === 'month' ? 'active' : ''}`}
            onClick={() => setFilterType('month')}
          >
            Monthly Filter
          </button>
          <button 
            className={`mode-btn ${filterType === 'day' ? 'active' : ''}`}
            onClick={() => setFilterType('day')}
          >
            Daily Date Filter
          </button>
        </div>

        <div className="toolbar-right">
          <div className="search-box">
            <Search size={14} className="search-icon" />
            <input 
              type="text" 
              placeholder="Search Deliverable..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="toolbar-search-input"
            />
          </div>

          {filterType === 'day' ? (
            <div className="navigation-group">
              <button onClick={handlePrevDay} className="nav-btn"><ChevronLeft size={16} /></button>
              <input 
                type="date" 
                value={selectedDate} 
                onChange={(e) => setSelectedDate(e.target.value)}
                className="picker-input"
              />
              <button onClick={handleNextDay} className="nav-btn"><ChevronRight size={16} /></button>
            </div>
          ) : (
            <div className="navigation-group">
              <button onClick={handlePrevMonth} className="nav-btn"><ChevronLeft size={16} /></button>
              <input 
                type="month" 
                value={selectedMonth} 
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="picker-input"
              />
              <button onClick={handleNextMonth} className="nav-btn"><ChevronRight size={16} /></button>
            </div>
          )}
        </div>
      </div>

      {/* Content Area */}
      {loading ? (
        <div className="completed-loading">
          <div className="loading-spinner"></div>
          <span>Loading completed deliverables...</span>
        </div>
      ) : filteredDeliverables.length === 0 ? (
        <div className="completed-empty">
          <CheckCircle2 size={40} className="empty-icon" />
          <h3>No completed deliverables found</h3>
          <p>No deliverables match the selected date filters or search queries.</p>
        </div>
      ) : (
        <div className="table-card">
          <div className="table-responsive">
            <table className="completed-table">
              <thead>
                <tr>
                  <th>Client</th>
                  <th>Activity Code</th>
                  <th>Deliverable Description</th>
                  <th>Assigned Specialist</th>
                  <th>Due Date</th>
                  <th>Status</th>
                  <th>Links & Deliverables</th>
                </tr>
              </thead>
              <tbody>
                {filteredDeliverables.map(item => (
                  <tr key={item.id}>
                    <td>
                      <strong className="client-cell-name">{item.client_name}</strong>
                    </td>
                    <td>
                      <span className="code-badge">{item.activity_code || `Job Work #${item.id}`}</span>
                    </td>
                    <td className="desc-cell-title">
                      <div className="deliverable-text">{item.deliverable}</div>
                    </td>
                    <td>
                      <div className="specialist-cell">
                        <User size={13} style={{ color: 'var(--text-muted)' }} />
                        <span>{item.employee_name || 'Unassigned'}</span>
                      </div>
                    </td>
                    <td>
                      <span className="due-date-cell">
                        {item.due_date ? new Date(item.due_date).toLocaleDateString([], { day: '2-digit', month: 'short', year: 'numeric' }) : ''}
                      </span>
                    </td>
                    <td>
                      <span className="status-badge-completed completed">
                        completed
                      </span>
                    </td>
                    <td>
                      <div className="actions-cell">
                        {item.content_link && (
                          <a 
                            href={ensureExternalLink(item.content_link)}
                            target="_blank"
                            rel="noreferrer"
                            className="action-link-btn"
                            title="Open Content Script"
                          >
                            <FileText size={14} /> Script
                          </a>
                        )}
                        {item.google_drive_link && (
                          <a 
                            href={ensureExternalLink(item.google_drive_link)}
                            target="_blank"
                            rel="noreferrer"
                            className="action-link-btn primary"
                            title="Open Google Drive Asset"
                          >
                            <ExternalLink size={14} /> Drive
                          </a>
                        )}
                        {item.designer_output && (
                          <a 
                            href={ensureExternalLink(item.designer_output)}
                            target="_blank"
                            rel="noreferrer"
                            className="action-link-btn success"
                            title="Open Final Output"
                          >
                            <Globe size={14} /> Output
                          </a>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompletedWorks;
