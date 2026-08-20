import React from 'react';
import ContentCalendarView from './ContentCalendarView';

const ProjectList = () => {
  return (
    <div className="page-container">
      {/* Page Header */}
      <div className="page-header" style={{ marginBottom: '16px' }}>
        <div className="page-title-section">
          <h2>Content Calendar & Planner</h2>
          <span className="page-subtitle">Import deliverables spreadsheets, schedule monthly calendars, and approve content calendars for the creative team</span>
        </div>
      </div>

      {/* Render the Content Calendar */}
      <ContentCalendarView />
    </div>
  );
};

export default ProjectList;
