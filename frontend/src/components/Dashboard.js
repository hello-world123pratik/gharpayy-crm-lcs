import React from 'react';

const Dashboard = ({ stats }) => {
  return (
    <div className="stats-dashboard">
      <div className="stat-card">
        <h3>Total Leads</h3>
        <p>{stats.totalLeads || 0}</p>
      </div>
      <div className="stat-card">
        <h3>Visits Scheduled</h3>
        <p>{stats.visits || 0}</p>
      </div>
      <div className="stat-card">
        <h3>Bookings Confirmed</h3>
        <p>{stats.booked || 0}</p>
      </div>
    </div>
  );
};

export default Dashboard;