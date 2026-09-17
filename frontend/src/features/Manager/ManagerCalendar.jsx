import React from 'react';
import ContentCalendarView from '../Admin/Projects/ContentCalendarView';

const ManagerCalendar = () => {
  return (
    <div className="page-container">
      {/* Page Header */}
      <div className="page-header" style={{ marginBottom: '16px' }}>
        <div className="page-title-section">
          <h2>Content Calendar & Planner</h2>
          <span className="page-subtitle">View approved monthly content calendars, plan activities, and send deliverables to employees</span>
        </div>
      </div>

      {/* Render the unified Content Calendar View */}
      <ContentCalendarView />
    </div>
  );
};

export default ManagerCalendar;
