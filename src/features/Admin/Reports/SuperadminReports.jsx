import React, { useState, useEffect, useCallback } from 'react';
import { FileSpreadsheet, Eye, Calendar, User, Search, RefreshCw, Layers } from 'lucide-react';
import api from '../../../utils/api';
import Table from '../../../components/Table';
import Modal from '../../../components/Modal';

const SuperadminReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);
  const [reportDetail, setReportDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [search, setSearch] = useState('');

  const fetchReports = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/dashboard/reports/superadmin-list');
      if (res.data.success) {
        setReports(res.data.data.reports || []);
      }
    } catch (err) {
      console.error('Error fetching superadmin reports:', err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const handleViewDetails = async (report) => {
    setSelectedReport(report);
    setDetailLoading(true);
    try {
      const res = await api.get(`/dashboard/reports/superadmin-detail/${report.id}`);
      if (res.data.success) {
        setReportDetail(res.data.data.report);
      }
    } catch (err) {
      console.error('Error fetching report detail:', err.message);
      setSelectedReport(null);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleCloseDetail = () => {
    setSelectedReport(null);
    setReportDetail(null);
  };

  // Dynamic table headers and rows based on parsed JSON
  const renderDetailTable = () => {
    if (!reportDetail?.report_data) return null;
    try {
      const rows = JSON.parse(reportDetail.report_data);
      if (!Array.isArray(rows) || rows.length === 0) {
        return <p style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)' }}>Empty report dataset.</p>;
      }

      // Exclude internal database IDs from header columns
      const headers = Object.keys(rows[0]).filter(k => k !== 'client_id' && k !== 'id');

      return (
        <div style={{ overflowX: 'auto', maxHeight: '450px' }}>
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
      return <p className="text-danger">Failed to parse report dataset: {err.message}</p>;
    }
  };

  const filteredReports = reports.filter(r => 
    r.title.toLowerCase().includes(search.toLowerCase()) ||
    r.report_type.toLowerCase().includes(search.toLowerCase()) ||
    r.sent_by_username.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    { key: 'id', label: 'ID', render: (val) => <strong>#{val}</strong> },
    { key: 'title', label: 'Report Title', render: (val) => <span style={{ fontWeight: 600 }}>{val}</span> },
    { key: 'report_type', label: 'Type', render: (val) => <span style={{ textTransform: 'capitalize' }} className="badge badge-active">{val}</span> },
    { key: 'month_or_range', label: 'Month / Date Range' },
    { key: 'sent_by_username', label: 'Compiled By' },
    { 
      key: 'sent_at', 
      label: 'Date Received',
      render: (val) => val ? new Date(val).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }) : '-'
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (val, row) => (
        <button className="btn btn-secondary btn-sm" onClick={() => handleViewDetails(row)} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
          <Eye size={14} /> View Report
        </button>
      )
    }
  ];

  return (
    <div className="page-container">
      {/* Page Header */}
      <div className="page-header">
        <div className="page-title-section">
          <h2>Superadmin Received Reports</h2>
          <span className="page-subtitle">View and inspect operational efficiency and client performance reports compiled by administrators</span>
        </div>
        <button className="btn btn-secondary" onClick={fetchReports}>
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="table-toolbar">
        <div className="toolbar-left">
          <div className="table-search">
            <Search size={16} className="text-muted" />
            <input
              type="text"
              placeholder="Search reports by title, type, sender..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Reports Table */}
      <div className="card">
        <Table
          columns={columns}
          data={filteredReports}
          loading={loading}
          emptyMessage="No received reports found."
        />
      </div>

      {/* REPORT VIEWER DETAIL MODAL */}
      <Modal
        isOpen={!!selectedReport}
        onClose={handleCloseDetail}
        title={reportDetail ? reportDetail.title : 'Loading Report...'}
        size="large"
        footer={
          <button className="btn btn-secondary" onClick={handleCloseDetail}>
            Close Report
          </button>
        }
      >
        {detailLoading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
            <div style={{ width: '28px', height: '28px', border: '3px solid #e2e8f0', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        ) : reportDetail ? (
          <div>
            {/* Meta tags */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '24px', padding: '16px', backgroundColor: 'var(--bg-light)', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <div>
                <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-light)', textTransform: 'uppercase', display: 'block' }}>Report Category</span>
                <span style={{ fontSize: '14px', fontWeight: 700, textTransform: 'capitalize' }}>{reportDetail.report_type} Report</span>
              </div>
              <div>
                <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-light)', textTransform: 'uppercase', display: 'block' }}>Compiled By</span>
                <span style={{ fontSize: '14px', fontWeight: 700 }}>{reportDetail.sent_by_username}</span>
              </div>
              <div>
                <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-light)', textTransform: 'uppercase', display: 'block' }}>Month / Range</span>
                <span style={{ fontSize: '14px', fontWeight: 700 }}>{reportDetail.month_or_range}</span>
              </div>
            </div>

            {/* Table data */}
            {renderDetailTable()}
          </div>
        ) : null}
      </Modal>
    </div>
  );
};

export default SuperadminReports;
