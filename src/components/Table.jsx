import React from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown, ChevronLeft, ChevronRight, Inbox } from 'lucide-react';

const Table = ({
  columns,
  data = [],
  loading = false,
  pagination = null, // { page, limit, total, totalPages, onPageChange }
  sorting = null,    // { sortColumn, sortOrder, onSort }
  selectedIds = [],
  onSelectChange = null, // (selectedIds) => {}
  bulkActions = null, // { actions: [{ label, value }], onExecute }
  emptyMessage = 'No records found.'
}) => {

  const handleSelectAll = (e) => {
    if (!onSelectChange) return;
    if (e.target.checked) {
      const allIds = data.map(row => row.id);
      onSelectChange(allIds);
    } else {
      onSelectChange([]);
    }
  };

  const handleSelectRow = (id, checked) => {
    if (!onSelectChange) return;
    if (checked) {
      onSelectChange([...selectedIds, id]);
    } else {
      onSelectChange(selectedIds.filter(item => item !== id));
    }
  };

  const handleSort = (columnKey) => {
    if (!sorting || !sorting.onSort) return;
    const isAsc = sorting.sortColumn === columnKey && sorting.sortOrder === 'asc';
    sorting.onSort(columnKey, isAsc ? 'desc' : 'asc');
  };

  const renderSortIcon = (column) => {
    if (!sorting || !column.sortable) return null;
    if (sorting.sortColumn !== column.key) {
      return <ArrowUpDown size={14} style={{ opacity: 0.5 }} />;
    }
    return sorting.sortOrder === 'asc' 
      ? <ArrowUp size={14} className="text-primary" /> 
      : <ArrowDown size={14} className="text-primary" />;
  };

  const isAllSelected = data.length > 0 && selectedIds.length === data.length;
  const isSomeSelected = selectedIds.length > 0 && selectedIds.length < data.length;

  return (
    <div>
      {/* Top Pagination Toolbar */}
      {!loading && pagination && pagination.totalPages > 1 && (
        <div className="pagination-toolbar" style={{ marginBottom: '16px', display: 'flex', justifyContent: 'flex-end', gap: '20px', borderBottom: 'none', padding: 0 }}>
          <div className="pagination-actions" style={{ display: 'flex', gap: '6px' }}>
            <button
              className="pagination-btn"
              disabled={pagination.page === 1}
              onClick={() => pagination.onPageChange(pagination.page - 1)}
            >
              <ChevronLeft size={16} />
            </button>
            
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
              .filter(p => p === 1 || p === pagination.totalPages || Math.abs(p - pagination.page) <= 1)
              .map((p, idx, arr) => {
                const prev = arr[idx - 1];
                const showEllipsis = prev && p - prev > 1;
                return (
                  <React.Fragment key={p}>
                    {showEllipsis && <span style={{ padding: '0 6px', color: 'var(--text-light)' }}>...</span>}
                    <button
                      className="pagination-btn"
                      style={{
                        backgroundColor: pagination.page === p ? 'var(--primary)' : 'white',
                        borderColor: pagination.page === p ? 'var(--primary)' : 'var(--border-color)',
                        color: pagination.page === p ? 'white' : 'var(--text-main)',
                        margin: 0
                      }}
                      onClick={() => pagination.onPageChange(p)}
                    >
                      {p}
                    </button>
                  </React.Fragment>
                );
              })}

            <button
              className="pagination-btn"
              disabled={pagination.page === pagination.totalPages}
              onClick={() => pagination.onPageChange(pagination.page + 1)}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Bulk Action Banner */}
      {selectedIds.length > 0 && bulkActions && (
        <div className="bulk-actions-banner">
          <span className="bulk-message">
            {selectedIds.length} {selectedIds.length === 1 ? 'item' : 'items'} selected
          </span>
          <div className="bulk-action-buttons">
            {bulkActions.actions.map((act, index) => (
              <button
                key={index}
                className={`btn btn-sm ${act.className || 'btn-secondary'}`}
                onClick={() => {
                  bulkActions.onExecute(act.value, selectedIds);
                }}
              >
                {act.label}
              </button>
            ))}
            <button 
              className="btn btn-sm btn-secondary" 
              onClick={() => onSelectChange([])}
            >
              Clear Selection
            </button>
          </div>
        </div>
      )}

      {/* Table Container */}
      <div className="table-responsive">
        <table className="enterprise-table">
          <thead>
            <tr>
              {onSelectChange && (
                <th style={{ width: '50px' }}>
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    ref={input => {
                      if (input) {
                        input.indeterminate = isSomeSelected;
                      }
                    }}
                    onChange={handleSelectAll}
                  />
                </th>
              )}
              {columns.map(col => (
                <th 
                  key={col.key}
                  onClick={() => col.sortable && handleSort(col.key)}
                  style={{ cursor: col.sortable ? 'pointer' : 'default', width: col.width }}
                >
                  <div className="th-content">
                    {col.label}
                    {renderSortIcon(col)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length + (onSelectChange ? 1 : 0)} style={{ textAlign: 'center', padding: '40px 0' }}>
                  <div style={{ display: 'inline-block', width: '24px', height: '24px', border: '3px solid #e2e8f0', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                  <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                  <p style={{ marginTop: '12px', color: 'var(--text-muted)' }}>Loading records...</p>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (onSelectChange ? 1 : 0)} style={{ textAlign: 'center', padding: '60px 0' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'var(--text-muted)' }}>
                    <Inbox size={48} strokeWidth={1.5} style={{ marginBottom: '12px' }} />
                    <p style={{ fontWeight: 600 }}>{emptyMessage}</p>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((row) => {
                const isSelected = selectedIds.includes(row.id);
                return (
                  <tr key={row.id} className={isSelected ? 'selected' : ''}>
                    {onSelectChange && (
                      <td>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => handleSelectRow(row.id, e.target.checked)}
                        />
                      </td>
                    )}
                    {columns.map(col => (
                      <td key={col.key}>
                        {col.render ? col.render(row[col.key], row) : row[col.key]}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Bottom Pagination Toolbar */}
      {!loading && pagination && pagination.totalPages > 1 && (
        <div className="pagination-toolbar">
          <div className="pagination-stats">
            Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} entries
          </div>
          <div className="pagination-actions">
            <button
              className="pagination-btn"
              disabled={pagination.page === 1}
              onClick={() => pagination.onPageChange(pagination.page - 1)}
            >
              <ChevronLeft size={16} />
            </button>
            
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
              .filter(p => p === 1 || p === pagination.totalPages || Math.abs(p - pagination.page) <= 1)
              .map((p, idx, arr) => {
                const prev = arr[idx - 1];
                const showEllipsis = prev && p - prev > 1;
                return (
                  <React.Fragment key={p}>
                    {showEllipsis && <span style={{ padding: '0 6px', color: 'var(--text-light)' }}>...</span>}
                    <button
                      className="pagination-btn"
                      style={{
                        backgroundColor: pagination.page === p ? 'var(--primary)' : 'white',
                        borderColor: pagination.page === p ? 'var(--primary)' : 'var(--border-color)',
                        color: pagination.page === p ? 'white' : 'var(--text-main)'
                      }}
                      onClick={() => pagination.onPageChange(p)}
                    >
                      {p}
                    </button>
                  </React.Fragment>
                );
              })}

            <button
              className="pagination-btn"
              disabled={pagination.page === pagination.totalPages}
              onClick={() => pagination.onPageChange(pagination.page + 1)}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Table;
