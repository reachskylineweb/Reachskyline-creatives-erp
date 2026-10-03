import React, { useState, useEffect, useCallback } from 'react';
import { 
  Building2, Calendar, FileSpreadsheet, Search, Printer, 
  CheckCircle, AlertCircle, Clock, CalendarDays, FileText, ChevronRight, X
} from 'lucide-react';
import api from '../../../utils/api';
import { useAuth } from '../../../context/AuthContext';

const ReportDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('daily'); // 'daily' | 'monthly'
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState({ clients: [], eventDaysToday: [], eventDaysMonth: [] });
  
  // Filters
  const [selectedDate, setSelectedDate] = useState(() => {
    return new Date().toISOString().substring(0, 10);
  });
  const [selectedMonth, setSelectedMonth] = useState(() => {
    return new Date().toISOString().substring(0, 7);
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClient, setSelectedClient] = useState(null);
  const [modalTab, setModalTab] = useState('deliverables'); // 'deliverables' | 'jobWorks'
  const [modalDelivPage, setModalDelivPage] = useState(1);
  const [modalJobPage, setModalJobPage] = useState(1);

  useEffect(() => {
    setModalDelivPage(1);
    setModalJobPage(1);
  }, [selectedClient, modalTab]);

  const fetchReports = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/dashboard/reports-summary', {
        params: {
          date: selectedDate,
          month: selectedMonth
        }
      });
      if (response.data.success) {
        setReportData(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching reports summary:', err.message);
    } finally {
      setLoading(false);
    }
  }, [selectedDate, selectedMonth]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  // Handle Client detail view update when data changes
  useEffect(() => {
    if (selectedClient && reportData.clients.length > 0) {
      const updated = reportData.clients.find(c => c.id === selectedClient.id);
      if (updated) setSelectedClient(updated);
    }
  }, [reportData, selectedClient]);

  // Filter clients based on search query
  const filteredClients = reportData.clients.filter(client => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    return (
      client.company_name.toLowerCase().includes(query) ||
      client.client_id_code.toLowerCase().includes(query)
    );
  });

  // Calculate percentages
  const getPercentage = (completed, total) => {
    const compNum = Number(completed) || 0;
    const totNum = Number(total) || 0;
    if (totNum === 0) return 0;
    return Math.round((compNum / totNum) * 100);
  };

  // CSV Export implementation
  const handleExportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    
    if (activeTab === 'daily') {
      csvContent += "Client ID,Client Name,Date,Today's Postings,Today's Job Works,Today's Scripts,Month Deliverables Posted,Month Job Works Completed,Month Scripts Approved\n";
      filteredClients.forEach(c => {
        csvContent += `"${c.client_id_code}","${c.company_name}","${selectedDate}",${c.dailyWorks.deliverables.length},${c.dailyWorks.jobWorks.length},${c.dailyWorks.contentCalendar.length},${c.monthlyStats.deliverables.posted}/${c.monthlyStats.deliverables.total},${c.monthlyStats.jobWorks.completed}/${c.monthlyStats.jobWorks.total},${c.monthlyStats.contentCalendar.completed}/${c.monthlyStats.contentCalendar.total}\n`;
      });
    } else {
      csvContent += "Client ID,Client Name,Month,Deliverables Posted,Deliverables Pending,Deliverables Total,Job Works Completed,Job Works Pending,Job Works Total,Scripts Approved,Scripts Pending,Scripts Total\n";
      filteredClients.forEach(c => {
        csvContent += `"${c.client_id_code}","${c.company_name}","${selectedMonth}",${c.monthlyStats.deliverables.posted},${c.monthlyStats.deliverables.pending},${c.monthlyStats.deliverables.total},${c.monthlyStats.jobWorks.completed},${c.monthlyStats.jobWorks.pending},${c.monthlyStats.jobWorks.total},${c.monthlyStats.contentCalendar.completed},${c.monthlyStats.contentCalendar.pending},${c.monthlyStats.contentCalendar.total}\n`;
      });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `reports_summary_${activeTab}_${activeTab === 'daily' ? selectedDate : selectedMonth}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  const formatReportDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return 'N/A';
    return d.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <div className="page-container" style={{ position: 'relative' }}>
      {/* Print Specific CSS Styles Injection */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body * {
            visibility: hidden;
          }
          #print-area, #print-area * {
            visibility: visible;
          }
          #print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .no-print {
            display: none !important;
          }
        }
      `}} />

      {/* Page Header */}
      <div className="page-header no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div className="page-title-section">
          <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-color)', margin: 0 }}>Reports &amp; Analytics</h2>
          <span className="page-subtitle" style={{ fontSize: '13px', color: 'var(--text-muted)' }}>getRedesigned daily operations tracking and monthly work execution metrics.</span>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn btn-secondary" onClick={handlePrint} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 16px', fontSize: '13px', fontWeight: 600 }}>
            <Printer size={16} /> Print PDF
          </button>
          <button className="btn btn-secondary text-success" onClick={handleExportCSV} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 16px', fontSize: '13px', fontWeight: 600, color: 'var(--success)', borderColor: 'rgba(16, 185, 129, 0.2)' }}>
            <FileSpreadsheet size={16} /> Export CSV
          </button>
        </div>
      </div>

      {/* Tab Selectors & Filter bar */}
      <div className="card no-print" style={{ padding: '16px', marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', flexWrap: 'wrap', gap: '16px' }}>
          {/* Tabs */}
          <div style={{ display: 'inline-flex', backgroundColor: 'var(--bg-light)', padding: '4px', borderRadius: '8px' }}>
            <button
              onClick={() => { setActiveTab('daily'); setSelectedClient(null); }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 20px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: activeTab === 'daily' ? 'var(--bg-card)' : 'transparent',
                color: activeTab === 'daily' ? 'var(--primary)' : 'var(--text-muted)',
                fontWeight: 700,
                fontSize: '13px',
                cursor: 'pointer',
                boxShadow: activeTab === 'daily' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                transition: 'all 0.2s'
              }}
            >
              <Calendar size={15} /> Daily Report
            </button>
            <button
              onClick={() => { setActiveTab('monthly'); setSelectedClient(null); }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 20px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: activeTab === 'monthly' ? 'var(--bg-card)' : 'transparent',
                color: activeTab === 'monthly' ? 'var(--primary)' : 'var(--text-muted)',
                fontWeight: 700,
                fontSize: '13px',
                cursor: 'pointer',
                boxShadow: activeTab === 'monthly' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                transition: 'all 0.2s'
              }}
            >
              <CalendarDays size={15} /> Monthly Report
            </button>
          </div>

          {/* Date Picker / Month Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {activeTab === 'daily' ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>Date:</span>
                <input 
                  type="date" 
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="form-control"
                  style={{ padding: '8px 12px', fontSize: '13px', borderRadius: '6px', border: '1px solid var(--border-color)', outline: 'none' }}
                />
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>Month:</span>
                <input 
                  type="month" 
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="form-control"
                  style={{ padding: '8px 12px', fontSize: '13px', borderRadius: '6px', border: '1px solid var(--border-color)', outline: 'none' }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Client Search bar */}
        <div style={{ position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            type="text"
            placeholder="Search client by company name or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 16px 10px 38px',
              fontSize: '13px',
              borderRadius: '6px',
              border: '1px solid var(--border-color)',
              backgroundColor: 'var(--bg-light)',
              outline: 'none'
            }}
          />
        </div>
      </div>

      {/* Main Print / Print-Ready Container */}
      <div id="print-area">
        {/* Print only header */}
        <div style={{ display: 'none' }} className="visible-print-block">
          <h2 style={{ fontSize: '26px', fontWeight: 900, marginBottom: '4px' }}>ReachSkyline - Operations Report</h2>
          <p style={{ fontSize: '14px', color: '#666', marginBottom: '24px' }}>
            {activeTab === 'daily' ? `Daily Summary for ${selectedDate}` : `Monthly Execution Report for ${selectedMonth}`}
          </p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '100px 0', color: 'var(--text-muted)' }}>
            <div className="spinner" style={{ border: '3px solid var(--border-color)', borderTop: '3px solid var(--primary)', borderRadius: '50%', width: '36px', height: '36px', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }}></div>
            <p style={{ fontWeight: 600, fontSize: '14px' }}>Loading reports data...</p>
          </div>
        ) : filteredClients.length === 0 ? (
          <div className="card" style={{ padding: '60px 0', textAlign: 'center', color: 'var(--text-muted)' }}>
            <Building2 size={48} style={{ opacity: 0.3, marginBottom: '16px' }} />
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-color)' }}>No Clients Found</h3>
            <p style={{ fontSize: '13px', marginTop: '4px' }}>No active clients match the current search criteria.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Global Events Box */}
            {((activeTab === 'daily' && reportData.eventDaysToday.length > 0) || 
              (activeTab === 'monthly' && reportData.eventDaysMonth.length > 0)) && (
              <div className="card" style={{ borderLeft: '4px solid var(--primary)', padding: '16px', background: 'linear-gradient(to right, rgba(79, 70, 229, 0.04), transparent)' }}>
                <h4 style={{ fontSize: '14px', fontWeight: 800, margin: '0 0 12px 0', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)' }}>
                  <CalendarDays size={16} /> Global Event Days ({activeTab === 'daily' ? reportData.eventDaysToday.length : reportData.eventDaysMonth.length})
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
                  {(activeTab === 'daily' ? reportData.eventDaysToday : reportData.eventDaysMonth).map(ev => (
                    <div key={ev.id} style={{ display: 'flex', flexDirection: 'column', padding: '10px 14px', borderRadius: '6px', backgroundColor: 'var(--bg-light)', border: '1px solid var(--border-color)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                        <strong style={{ fontSize: '13px', color: 'var(--text-color)' }}>{ev.title}</strong>
                        {activeTab === 'monthly' && <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)' }}>{ev.date?.substring(8, 10)}</span>}
                      </div>
                      {ev.description && <span style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>{ev.description}</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Clients Cards Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
              {filteredClients.map(client => {
                const totalDailyTasks = client.dailyWorks.deliverables.length + client.dailyWorks.jobWorks.length + client.dailyWorks.contentCalendar.length;
                const isSelected = selectedClient?.id === client.id;
                
                return (
                  <div 
                    key={client.id}
                    onClick={() => setSelectedClient(isSelected ? null : client)}
                    className="card interactive-card"
                    style={{
                      padding: '20px',
                      cursor: 'pointer',
                      border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                      boxShadow: isSelected ? 'var(--shadow-md)' : 'var(--shadow-sm)',
                      background: 'var(--bg-card)',
                      borderRadius: 'var(--radius-md)',
                      transition: 'all 0.2s',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '16px'
                    }}
                  >
                    {/* Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <strong style={{ fontSize: '16px', color: 'var(--text-color)', fontWeight: 800 }}>{client.company_name}</strong>
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)', letterSpacing: '0.05em', textTransform: 'uppercase', fontWeight: 600, marginTop: '2px' }}>{client.client_id_code}</span>
                      </div>
                      <ChevronRight size={18} style={{ transform: isSelected ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s', color: 'var(--text-muted)' }} />
                    </div>

                    {/* Stats summary row */}
                    {activeTab === 'daily' ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {/* Daily quick indicator badges */}
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: 700, padding: '4px 8px', borderRadius: '4px', backgroundColor: 'rgba(79, 70, 229, 0.08)', color: 'var(--primary)' }}>
                            {client.dailyWorks.deliverables.length} Postings
                          </span>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: 700, padding: '4px 8px', borderRadius: '4px', backgroundColor: 'rgba(249, 115, 22, 0.08)', color: '#ea580c' }}>
                            {client.dailyWorks.jobWorks.length} Jobs
                          </span>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: 700, padding: '4px 8px', borderRadius: '4px', backgroundColor: 'rgba(16, 185, 129, 0.08)', color: 'var(--success)' }}>
                            {client.dailyWorks.contentCalendar.length} Scripts
                          </span>
                        </div>

                        {/* Month Progress bar */}
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 600, marginBottom: '6px' }}>
                            <span style={{ color: 'var(--text-muted)' }}>Month Deliverables</span>
                            <span style={{ color: 'var(--text-color)' }}>{client.monthlyStats.deliverables.posted} / {client.monthlyStats.deliverables.total} Posted</span>
                          </div>
                          <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--bg-light)', borderRadius: '99px', overflow: 'hidden' }}>
                            <div 
                              style={{ 
                                width: `${getPercentage(client.monthlyStats.deliverables.posted, client.monthlyStats.deliverables.total)}%`, 
                                height: '100%', 
                                backgroundColor: 'var(--primary)', 
                                borderRadius: '99px' 
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {/* Monthly stats detail layout */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                          <div style={{ textAlign: 'center', backgroundColor: 'var(--bg-light)', padding: '8px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                            <span style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>Postings</span>
                            <strong style={{ display: 'block', fontSize: '14px', color: 'var(--text-color)', marginTop: '4px' }}>{client.monthlyStats.deliverables.posted}/{client.monthlyStats.deliverables.total}</strong>
                          </div>
                          <div style={{ textAlign: 'center', backgroundColor: 'var(--bg-light)', padding: '8px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                            <span style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>Job Works</span>
                            <strong style={{ display: 'block', fontSize: '14px', color: 'var(--text-color)', marginTop: '4px' }}>{client.monthlyStats.jobWorks.completed}/{client.monthlyStats.jobWorks.total}</strong>
                          </div>
                          <div style={{ textAlign: 'center', backgroundColor: 'var(--bg-light)', padding: '8px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                            <span style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>Scripts</span>
                            <strong style={{ display: 'block', fontSize: '14px', color: 'var(--text-color)', marginTop: '4px' }}>{client.monthlyStats.contentCalendar.completed}/{client.monthlyStats.contentCalendar.total}</strong>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Clicked client details popup modal */}
            {selectedClient && (
              <div 
                className="no-print"
                onClick={() => setSelectedClient(null)}
                style={{
                  position: 'fixed',
                  left: 0,
                  top: 0,
                  width: '100%',
                  height: '100%',
                  backgroundColor: 'rgba(0, 0, 0, 0.4)',
                  zIndex: 9999,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  backdropFilter: 'blur(4px)',
                  animation: 'fadeIn 0.2s ease-out'
                }}
              >
                <div 
                  className="card"
                  onClick={(e) => e.stopPropagation()}
                  style={{ 
                    padding: '24px', 
                    borderTop: '4px solid var(--primary)', 
                    background: 'var(--bg-card)', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: '20px', 
                    width: '90%',
                    maxWidth: '850px',
                    maxHeight: '90vh',
                    overflowY: 'auto',
                    boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)'
                  }}
                >
                  {/* Header detail */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
                    <div>
                      <h3 style={{ fontSize: '18px', fontWeight: 800, margin: 0, color: 'var(--text-color)' }}>
                        {selectedClient.company_name} <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-muted)' }}>({selectedClient.client_id_code})</span>
                      </h3>
                      <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
                        {activeTab === 'daily' ? `Detailed Work Schedule for ${selectedDate}` : `Month Execution Report for ${selectedMonth}`}
                      </p>
                    </div>
                    <button 
                      onClick={() => setSelectedClient(null)} 
                      className="no-print"
                      style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
                    >
                      <X size={20} />
                    </button>
                  </div>

                  {/* Main Work list panel */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {/* Left Column: Work schedule lists */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                      <h4 style={{ fontSize: '14px', fontWeight: 800, color: 'var(--primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FileText size={16} /> {activeTab === 'daily' ? 'Scheduled Execution Items' : 'Monthly Execution Details'}
                      </h4>

                      {/* Tabs */}
                      <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', gap: '4px' }} className="no-print">
                        <button
                          onClick={() => setModalTab('deliverables')}
                          style={{
                            padding: '8px 16px',
                            backgroundColor: 'transparent',
                            border: 'none',
                            borderBottom: modalTab === 'deliverables' ? '2px solid var(--primary)' : '2px solid transparent',
                            color: modalTab === 'deliverables' ? 'var(--primary)' : 'var(--text-muted)',
                            fontWeight: 700,
                            fontSize: '13px',
                            cursor: 'pointer',
                            outline: 'none',
                            transition: 'all 0.2s'
                          }}
                        >
                          Normal Deliverables
                        </button>
                        <button
                          onClick={() => setModalTab('jobWorks')}
                          style={{
                            padding: '8px 16px',
                            backgroundColor: 'transparent',
                            border: 'none',
                            borderBottom: modalTab === 'jobWorks' ? '2px solid var(--primary)' : '2px solid transparent',
                            color: modalTab === 'jobWorks' ? 'var(--primary)' : 'var(--text-muted)',
                            fontWeight: 700,
                            fontSize: '13px',
                            cursor: 'pointer',
                            outline: 'none',
                            transition: 'all 0.2s'
                          }}
                        >
                          Job Work
                        </button>
                      </div>

                      {activeTab === 'daily' ? (
                        <>
                          {modalTab === 'deliverables' ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                              <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                Normal Deliverables Today ({selectedClient.dailyWorks.deliverables.length})
                              </span>
                              {selectedClient.dailyWorks.deliverables.length === 0 ? (
                                <span style={{ fontSize: '13px', color: 'var(--text-light)', fontStyle: 'italic', paddingLeft: '8px' }}>No normal deliverables scheduled today.</span>
                              ) : (
                                selectedClient.dailyWorks.deliverables.map(item => {
                                  const isCompleted = item.status === 'posted';
                                  return (
                                    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', backgroundColor: 'var(--bg-light)', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                        <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-color)' }}>{item.deliverable || 'Deliverable'}</span>
                                        <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'monospace' }}>{item.activity_code}</span>
                                        {isCompleted && item.posted_at && (
                                          <span style={{ fontSize: '11px', color: 'var(--success)', fontWeight: 600 }}>
                                            Posted Date: {formatReportDate(item.posted_at)}
                                          </span>
                                        )}
                                      </div>
                                      <span style={{
                                        fontSize: '11px',
                                        fontWeight: 700,
                                        textTransform: 'uppercase',
                                        padding: '2px 8px',
                                        borderRadius: '12px',
                                        backgroundColor: isCompleted ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                                        color: isCompleted ? 'var(--success)' : '#d97706'
                                      }}>
                                        {isCompleted ? 'Completed' : 'Pending'}
                                      </span>
                                    </div>
                                  );
                                })
                              )}
                            </div>
                          ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                              <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                Job Works Today ({selectedClient.dailyWorks.jobWorks.length})
                              </span>
                              {selectedClient.dailyWorks.jobWorks.length === 0 ? (
                                <span style={{ fontSize: '13px', color: 'var(--text-light)', fontStyle: 'italic', paddingLeft: '8px' }}>No job works assigned today.</span>
                              ) : (
                                selectedClient.dailyWorks.jobWorks.map(item => {
                                  const isCompleted = ['completed', 'posted'].includes(item.status);
                                  return (
                                    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', backgroundColor: 'var(--bg-light)', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                        <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-color)' }}>{item.deliverable || 'Job Work'}</span>
                                        <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'monospace' }}>{item.activity_code}</span>
                                        {item.assigned_at && (
                                          <span style={{ fontSize: '11px', color: 'var(--primary)', fontWeight: 600 }}>
                                            Assigned Date: {formatReportDate(item.assigned_at)}
                                          </span>
                                        )}
                                        {isCompleted && (
                                           <span style={{ fontSize: '11px', color: 'var(--success)', fontWeight: 600 }}>
                                             Completed Date: {item.completed_at ? formatReportDate(item.completed_at) : formatReportDate(item.due_date)}
                                           </span>
                                         )}
                                      </div>
                                      <span style={{
                                        fontSize: '11px',
                                        fontWeight: 700,
                                        textTransform: 'uppercase',
                                        padding: '2px 8px',
                                        borderRadius: '12px',
                                        backgroundColor: isCompleted ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                                        color: isCompleted ? 'var(--success)' : '#d97706'
                                      }}>
                                        {isCompleted ? 'Completed' : 'Pending'}
                                      </span>
                                    </div>
                                  );
                                })
                              )}
                            </div>
                          )}
                        </>
                      ) : (
                        <>
                          {modalTab === 'deliverables' ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                              {/* Monthly stats cards */}
                              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', textAlign: 'center' }}>
                                <div style={{ padding: '10px', backgroundColor: 'var(--bg-light)', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                                  <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)' }}>Assigned</div>
                                  <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-color)' }}>
                                    {selectedClient.monthlyWorks?.deliverables?.length || 0}
                                  </div>
                                </div>
                                <div style={{ padding: '10px', backgroundColor: 'rgba(16, 185, 129, 0.05)', borderRadius: '6px', border: '1px solid rgba(16, 185, 129, 0.1)' }}>
                                  <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--success)' }}>Completed</div>
                                  <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--success)' }}>
                                    {selectedClient.monthlyWorks?.deliverables?.filter(d => d.status === 'posted').length || 0}
                                  </div>
                                </div>
                                <div style={{ padding: '10px', backgroundColor: 'rgba(245, 158, 11, 0.05)', borderRadius: '6px', border: '1px solid rgba(245, 158, 11, 0.1)' }}>
                                  <div style={{ fontSize: '11px', fontWeight: 600, color: '#d97706' }}>Pending</div>
                                  <div style={{ fontSize: '16px', fontWeight: 800, color: '#d97706' }}>
                                    {(selectedClient.monthlyWorks?.deliverables?.length || 0) - (selectedClient.monthlyWorks?.deliverables?.filter(d => d.status === 'posted').length || 0)}
                                  </div>
                                </div>
                              </div>

                              <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '6px' }}>
                                Normal Deliverables This Month ({selectedClient.monthlyWorks?.deliverables?.length || 0})
                              </span>
                              
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {(!selectedClient.monthlyWorks?.deliverables || selectedClient.monthlyWorks.deliverables.length === 0) ? (
                                  <span style={{ fontSize: '13px', color: 'var(--text-light)', fontStyle: 'italic', paddingLeft: '8px' }}>No normal deliverables this month.</span>
                                ) : (
                                  (() => {
                                    const delivs = selectedClient.monthlyWorks.deliverables;
                                    const totalPages = Math.ceil(delivs.length / 3);
                                    const paginated = delivs.slice((modalDelivPage - 1) * 3, modalDelivPage * 3);
                                    return (
                                      <>
                                        {paginated.map(item => {
                                          const isCompleted = item.status === 'posted';
                                          return (
                                            <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', backgroundColor: 'var(--bg-light)', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                                              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-color)' }}>{item.deliverable || 'Deliverable'}</span>
                                                <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'monospace' }}>{item.activity_code}</span>
                                                {isCompleted && item.posted_at ? (
                                                  <span style={{ fontSize: '11px', color: 'var(--success)', fontWeight: 600 }}>
                                                    Posted Date: {formatReportDate(item.posted_at)}
                                                  </span>
                                                ) : (
                                                  <span style={{ fontSize: '11px', color: 'var(--text-light)', fontStyle: 'italic' }}>
                                                    Not Posted Yet
                                                  </span>
                                                )}
                                              </div>
                                              <span style={{
                                                fontSize: '11px',
                                                fontWeight: 700,
                                                textTransform: 'uppercase',
                                                padding: '2px 8px',
                                                borderRadius: '12px',
                                                backgroundColor: isCompleted ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                                                color: isCompleted ? 'var(--success)' : '#d97706'
                                              }}>
                                                {isCompleted ? 'Completed' : 'Pending'}
                                              </span>
                                            </div>
                                          );
                                        })}

                                        {totalPages > 1 && (
                                          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', marginTop: '8px' }} className="no-print">
                                            <button 
                                              onClick={() => setModalDelivPage(p => Math.max(1, p - 1))}
                                              disabled={modalDelivPage === 1}
                                              style={{
                                                padding: '4px 10px',
                                                fontSize: '11px',
                                                fontWeight: 700,
                                                border: '1px solid var(--border-color)',
                                                borderRadius: '4px',
                                                backgroundColor: 'var(--bg-light)',
                                                color: modalDelivPage === 1 ? 'var(--text-light)' : 'var(--text-color)',
                                                cursor: modalDelivPage === 1 ? 'not-allowed' : 'pointer'
                                              }}
                                            >
                                              Prev
                                            </button>
                                            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)' }}>
                                              Page {modalDelivPage} of {totalPages}
                                            </span>
                                            <button 
                                              onClick={() => setModalDelivPage(p => Math.min(totalPages, p + 1))}
                                              disabled={modalDelivPage === totalPages}
                                              style={{
                                                padding: '4px 10px',
                                                fontSize: '11px',
                                                fontWeight: 700,
                                                border: '1px solid var(--border-color)',
                                                borderRadius: '4px',
                                                backgroundColor: 'var(--bg-light)',
                                                color: modalDelivPage === totalPages ? 'var(--text-light)' : 'var(--text-color)',
                                                cursor: modalDelivPage === totalPages ? 'not-allowed' : 'pointer'
                                              }}
                                            >
                                              Next
                                            </button>
                                          </div>
                                        )}
                                      </>
                                    );
                                  })()
                                )}
                              </div>
                            </div>
                          ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                              {/* Monthly stats cards */}
                              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', textAlign: 'center' }}>
                                <div style={{ padding: '10px', backgroundColor: 'var(--bg-light)', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                                  <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)' }}>Assigned</div>
                                  <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-color)' }}>
                                    {selectedClient.monthlyWorks?.jobWorks?.length || 0}
                                  </div>
                                </div>
                                <div style={{ padding: '10px', backgroundColor: 'rgba(16, 185, 129, 0.05)', borderRadius: '6px', border: '1px solid rgba(16, 185, 129, 0.1)' }}>
                                  <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--success)' }}>Completed</div>
                                  <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--success)' }}>
                                    {selectedClient.monthlyWorks?.jobWorks?.filter(jw => ['completed', 'posted'].includes(jw.status)).length || 0}
                                  </div>
                                </div>
                                <div style={{ padding: '10px', backgroundColor: 'rgba(245, 158, 11, 0.05)', borderRadius: '6px', border: '1px solid rgba(245, 158, 11, 0.1)' }}>
                                  <div style={{ fontSize: '11px', fontWeight: 600, color: '#d97706' }}>Pending</div>
                                  <div style={{ fontSize: '16px', fontWeight: 800, color: '#d97706' }}>
                                    {(selectedClient.monthlyWorks?.jobWorks?.length || 0) - (selectedClient.monthlyWorks?.jobWorks?.filter(jw => ['completed', 'posted'].includes(jw.status)).length || 0)}
                                  </div>
                                </div>
                              </div>

                              <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '6px' }}>
                                Job Works This Month ({selectedClient.monthlyWorks?.jobWorks?.length || 0})
                              </span>

                              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {(!selectedClient.monthlyWorks?.jobWorks || selectedClient.monthlyWorks.jobWorks.length === 0) ? (
                                  <span style={{ fontSize: '13px', color: 'var(--text-light)', fontStyle: 'italic', paddingLeft: '8px' }}>No job works this month.</span>
                                ) : (
                                  (() => {
                                    const jobs = selectedClient.monthlyWorks.jobWorks;
                                    const totalPages = Math.ceil(jobs.length / 3);
                                    const paginated = jobs.slice((modalJobPage - 1) * 3, modalJobPage * 3);
                                    return (
                                      <>
                                        {paginated.map(item => {
                                          const isCompleted = ['completed', 'posted'].includes(item.status);
                                          return (
                                            <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', backgroundColor: 'var(--bg-light)', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                                              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-color)' }}>{item.deliverable || 'Job Work'}</span>
                                                <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'monospace' }}>{item.activity_code}</span>
                                                {item.assigned_at && (
                                                  <span style={{ fontSize: '11px', color: 'var(--primary)', fontWeight: 600 }}>
                                                    Assigned Date: {formatReportDate(item.assigned_at)}
                                                  </span>
                                                )}
                                                {isCompleted ? (
                                                  <span style={{ fontSize: '11px', color: 'var(--success)', fontWeight: 600 }}>
                                                    Completed Date: {item.completed_at ? formatReportDate(item.completed_at) : formatReportDate(item.due_date)}
                                                  </span>
                                                ) : (
                                                  <span style={{ fontSize: '11px', color: 'var(--text-light)', fontStyle: 'italic' }}>
                                                    Not Completed Yet
                                                  </span>
                                                )}
                                              </div>
                                              <span style={{
                                                fontSize: '11px',
                                                fontWeight: 700,
                                                textTransform: 'uppercase',
                                                padding: '2px 8px',
                                                borderRadius: '12px',
                                                backgroundColor: isCompleted ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                                                color: isCompleted ? 'var(--success)' : '#d97706'
                                              }}>
                                                {isCompleted ? 'Completed' : 'Pending'}
                                              </span>
                                            </div>
                                          );
                                        })}

                                        {totalPages > 1 && (
                                          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', marginTop: '8px' }} className="no-print">
                                            <button 
                                              onClick={() => setModalJobPage(p => Math.max(1, p - 1))}
                                              disabled={modalJobPage === 1}
                                              style={{
                                                padding: '4px 10px',
                                                fontSize: '11px',
                                                fontWeight: 700,
                                                border: '1px solid var(--border-color)',
                                                borderRadius: '4px',
                                                backgroundColor: 'var(--bg-light)',
                                                color: modalJobPage === 1 ? 'var(--text-light)' : 'var(--text-color)',
                                                cursor: modalJobPage === 1 ? 'not-allowed' : 'pointer'
                                              }}
                                            >
                                              Prev
                                            </button>
                                            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)' }}>
                                              Page {modalJobPage} of {totalPages}
                                            </span>
                                            <button 
                                              onClick={() => setModalJobPage(p => Math.min(totalPages, p + 1))}
                                              disabled={modalJobPage === totalPages}
                                              style={{
                                                padding: '4px 10px',
                                                fontSize: '11px',
                                                fontWeight: 700,
                                                border: '1px solid var(--border-color)',
                                                borderRadius: '4px',
                                                backgroundColor: 'var(--bg-light)',
                                                color: modalJobPage === totalPages ? 'var(--text-light)' : 'var(--text-color)',
                                                cursor: modalJobPage === totalPages ? 'not-allowed' : 'pointer'
                                              }}
                                            >
                                              Next
                                            </button>
                                          </div>
                                        )}
                                      </>
                                    );
                                  })()
                                )}
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </div>

                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportDashboard;
