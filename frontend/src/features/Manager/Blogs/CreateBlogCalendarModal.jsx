import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Check, X, Plus, AlertCircle } from 'lucide-react';
import Modal from '../../../components/Modal';
import { FormSelect, FormInput } from '../../../components/FormFields';
import api from '../../../utils/api';

const CreateBlogCalendarModal = ({ isOpen, onClose, client: initialClient, onSuccess }) => {
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
  });

  const [clientList, setClientList] = useState([]);
  const [selectedClientId, setSelectedClientId] = useState(initialClient?.id || '');
  const [selectedDates, setSelectedDates] = useState([]);
  const [postType, setPostType] = useState('blog');
  const [titlePrefix, setTitlePrefix] = useState('Blog Post');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch clients if initialClient is not provided
  useEffect(() => {
    if (isOpen) {
      setSelectedDates([]);
      setError('');
      setTitlePrefix('Blog Post');
      if (initialClient) {
        setSelectedClientId(initialClient.id);
      } else {
        api.get('/blog-assignments/my-clients')
          .then(res => {
            if (res.data.success) {
              setClientList(res.data.data || []);
              if (res.data.data?.length > 0 && !selectedClientId) {
                setSelectedClientId(res.data.data[0].id);
              }
            }
          })
          .catch(() => {
            api.get('/clients')
              .then(res => {
                if (res.data.success) {
                  const list = res.data.data.clients || res.data.data || [];
                  setClientList(list);
                  if (list.length > 0 && !selectedClientId) {
                    setSelectedClientId(list[0].id);
                  }
                }
              })
              .catch(err => console.error('Error fetching clients for modal:', err));
          });
      }
    }
  }, [isOpen, initialClient]);

  if (!isOpen) return null;

  const activeClient = initialClient || clientList.find(c => Number(c.id) === Number(selectedClientId));

  // Calculate days in selected month
  const [yearStr, monthStr] = selectedMonth.split('-');
  const year = parseInt(yearStr, 10);
  const monthIndex = parseInt(monthStr, 10) - 1;

  const firstDay = new Date(year, monthIndex, 1);
  const lastDay = new Date(year, monthIndex + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay(); // 0 = Sun

  const toggleDate = (dayNum) => {
    const dateStr = `${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
    if (selectedDates.includes(dateStr)) {
      setSelectedDates(selectedDates.filter(d => d !== dateStr));
    } else {
      setSelectedDates([...selectedDates, dateStr].sort());
    }
  };

  const handleCreateCalendar = async () => {
    const targetClientId = activeClient?.id || selectedClientId;
    if (!targetClientId) {
      setError('Please select a client.');
      return;
    }
    if (selectedDates.length === 0) {
      setError('Please select at least one posting date on the calendar.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await api.post('/blog-calendar/bulk-create', {
        client_id: targetClientId,
        month: selectedMonth,
        dates: selectedDates,
        type: postType,
        titlePrefix
      });

      if (res.data.success) {
        if (onSuccess) {
          onSuccess(res.data.message || 'Calendar entries created successfully.', selectedMonth);
        }
        onClose();
      }
    } catch (err) {
      console.error('Error creating blog calendar:', err);
      setError(err.response?.data?.message || 'Failed to create blog calendar entries.');
    } finally {
      setLoading(false);
    }
  };

  // Days header
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Create Blog Calendar ${activeClient ? `- ${activeClient.company_name}` : ''}`}
      footer={
        <>
          <button className="btn btn-secondary" onClick={onClose} disabled={loading}>
            Cancel
          </button>
          <button 
            className="btn btn-primary" 
            onClick={handleCreateCalendar} 
            disabled={loading || selectedDates.length === 0}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontWeight: 700 }}
          >
            <CalendarIcon size={16} />
            {loading ? 'Creating...' : `Create Calendar (${selectedDates.length} Dates)`}
          </button>
        </>
      }
    >
      <div>
        {error && (
          <div style={{ padding: '10px 14px', backgroundColor: 'var(--danger-light)', color: 'var(--danger)', borderRadius: '6px', fontSize: '13px', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        {/* Top Controls */}
        {!initialClient && (
          <div style={{ marginBottom: '16px' }}>
            <FormSelect
              label="Select Client Company"
              name="clientId"
              value={selectedClientId}
              onChange={(e) => setSelectedClientId(e.target.value)}
              options={clientList.map(c => ({ value: c.id, label: `${c.company_name} (${c.client_id_code || c.id})` }))}
              required
            />
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '20px' }}>
          <div>
            <label className="form-label">Month</label>
            <input
              type="month"
              className="form-control"
              value={selectedMonth}
              onChange={(e) => {
                setSelectedMonth(e.target.value);
                setSelectedDates([]);
              }}
            />
          </div>
          <FormSelect
            label="Post Type"
            name="type"
            value={postType}
            onChange={(e) => setPostType(e.target.value)}
            options={[
              { value: 'blog', label: 'Blog Article' },
              { value: 'gmb', label: 'GMB Post' },
              { value: 'backlink', label: 'Backlink Task' }
            ]}
          />
          <FormInput
            label="Title Prefix"
            name="titlePrefix"
            value={titlePrefix}
            onChange={(e) => setTitlePrefix(e.target.value)}
            placeholder="e.g. Blog Post"
          />
        </div>

        <div style={{ marginBottom: '12px', fontSize: '13px', fontWeight: 700, color: 'var(--text-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Click dates on the calendar below to select blog posting schedule:</span>
          <span className="badge badge-active" style={{ fontSize: '12px' }}>
            {selectedDates.length} Selected
          </span>
        </div>

        {/* Interactive Month Calendar Grid */}
        <div style={{ border: '1px solid var(--border-color)', borderRadius: '8px', padding: '12px', backgroundColor: '#ffffff' }}>
          {/* Weekday headers */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', textAlign: 'center', marginBottom: '8px', fontWeight: 800, fontSize: '12px', color: 'var(--text-muted)' }}>
            {weekDays.map(day => (
              <div key={day} style={{ padding: '4px 0' }}>{day}</div>
            ))}
          </div>

          {/* Days Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px' }}>
            {/* Blank offset boxes for starting day */}
            {Array.from({ length: startingDayOfWeek }).map((_, i) => (
              <div key={`blank-${i}`} style={{ height: '42px' }} />
            ))}

            {/* Day Boxes */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const dayNum = i + 1;
              const dateStr = `${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
              const isSelected = selectedDates.includes(dateStr);

              return (
                <button
                  type="button"
                  key={dayNum}
                  onClick={() => toggleDate(dayNum)}
                  style={{
                    height: '42px',
                    borderRadius: '6px',
                    border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                    backgroundColor: isSelected ? 'var(--primary-light)' : '#f8fafc',
                    color: isSelected ? 'var(--primary)' : 'var(--text-color)',
                    fontWeight: isSelected ? 800 : 600,
                    fontSize: '13px',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '2px',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <span>{dayNum}</span>
                  {isSelected && <Check size={12} style={{ color: 'var(--primary)' }} />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Dates Summary */}
        {selectedDates.length > 0 && (
          <div style={{ marginTop: '16px', fontSize: '12px', color: 'var(--text-muted)' }}>
            <strong>Posting Dates: </strong> 
            {selectedDates.map(d => new Date(d).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })).join(', ')}
          </div>
        )}
      </div>
    </Modal>
  );
};

export default CreateBlogCalendarModal;
