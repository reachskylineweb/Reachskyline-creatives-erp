import React from 'react';

export const APP_ICONS = {
  dashboard: 'https://img.icons8.com/clouds/100/performance-macbook.png',
  completedTask: 'https://img.icons8.com/fluency/48/completed-task.png',
  task: 'https://img.icons8.com/arcade/64/task.png',
  manager: 'https://img.icons8.com/bubbles/100/manager.png',
  employee: 'https://img.icons8.com/plasticine/100/manager.png',
  clients: 'https://img.icons8.com/doodle/48/manager--v1.png',
  department: 'https://img.icons8.com/plasticine/100/department.png',
  contentCalendar: 'https://img.icons8.com/external-filled-outline-icons-maxicons/85/external-calender-insurance-filled-outline-filled-outline-icons-maxicons.png',
  blogCalendar: 'https://img.icons8.com/external-frizty-kerismaker/48/external-Calender-internet-advertising-frizty-kerismaker.png',
  deliverables: 'https://img.icons8.com/color/48/motorcycle-delivery-single-box.png',
  report: 'https://img.icons8.com/arcade/64/health-graph.png',
  workUpdates: 'https://img.icons8.com/flat-round/64/loop.png',
  activityType: 'https://img.icons8.com/color/48/sports-mode.png',
  credentials: 'https://img.icons8.com/external-smashingstocks-isometric-smashing-stocks/55/external-id-card-social-media-smashingstocks-isometric-smashing-stocks.png',
  creativesTeam: 'https://img.icons8.com/fluency/48/creativity.png',
  campaignTeam: 'https://img.icons8.com/external-flaticons-flat-flat-icons/64/external-ads-internet-marketing-service-flaticons-flat-flat-icons.png',
  seoTeam: 'https://img.icons8.com/bubbles/100/positive-dynamic.png',
  hr: 'https://img.icons8.com/external-flaticons-lineal-color-flat-icons/64/external-hr-manager-professions-flaticons-lineal-color-flat-icons-2.png',
  businessDevelopment: 'https://img.icons8.com/external-flat-icons-pack-pongsakorn-tan/64/external-bussiness-insurance-flat-icons-pack-pongsakorn-tan.png'
};

export const AppIcon = ({ name, size = 26, style = {}, className = '', alt = '' }) => {
  const iconSrc = APP_ICONS[name] || name;
  return (
    <img
      src={iconSrc}
      alt={alt || name}
      className={`app-icon-img ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        objectFit: 'contain',
        display: 'inline-block',
        flexShrink: 0,
        verticalAlign: 'middle',
        ...style
      }}
      loading="lazy"
    />
  );
};

export default AppIcon;
