import React from 'react';
import ContentCalendarView from '../Admin/Projects/ContentCalendarView';

const EmployeeCalendar = () => {
  return (
    <div className="page-container">
      {/* Page Header */}
      <div className="page-header" style={{ marginBottom: '16px' }}>
        <div className="page-title-section">
          <h2>Content Calendar & Planner</h2>
          <span className="page-subtitle">View approved monthly content calendars and activity schedule</span>
        </div>
      </div>

      {/* Render the unified Content Calendar View */}
      <ContentCalendarView />
    </div>
  );
};

export default EmployeeCalendar;
