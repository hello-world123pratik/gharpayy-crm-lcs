import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Dashboard from './components/Dashboard';
import './App.css';

const STAGES = [
  'New Lead', 'Contacted', 'Requirement Collected', 'Property Suggested', 
  'Visit Scheduled', 'Visit Completed', 'Booked', 'Lost'
];

function App() {
  const [leads, setLeads] = useState([]);
  const [stats, setStats] = useState({});

  /**
   * API_URL CONFIGURATION
   * Logic: If running on your own computer (localhost), use the local port.
   * If running on the web (Vercel), use your live Render backend link.
   */
  const API_URL = window.location.hostname === "localhost" 
    ? "http://localhost:5000/api/leads" 
    : "https://gharpayy-crm-lcs.onrender.com/api/leads";

  const loadData = async () => {
    try {
      const [leadsRes, statsRes] = await Promise.all([
        axios.get(API_URL),
        axios.get(`${API_URL}/stats`)
      ]);
      setLeads(leadsRes.data);
      setStats(statsRes.data);
    } catch (err) { 
      console.error("Sync Error:", err); 
    }
  };

  useEffect(() => {
    loadData();
    // Refresh every 60 seconds to keep data fresh
    const interval = setInterval(loadData, 60000); 
    return () => clearInterval(interval);
  }, [API_URL]);

  const handleUpdate = async (id, stage) => {
    let payload = { status: stage };

    if (stage === "Visit Scheduled") {
      const prop = prompt("Enter Property Name:");
      const date = prompt("Enter Visit Date/Time (YYYY-MM-DD):");
      if (!prop || !date) return;
      payload.property = prop;
      payload.scheduledAt = date;
    }

    if (stage === "Visit Completed") {
      const outcome = prompt("What was the visit outcome? (Interested/Not Interested/No Show)");
      if (!outcome) return;
      payload.outcome = outcome;
    }

    try {
      await axios.put(`${API_URL}/${id}`, payload);
      loadData();
    } catch (err) {
      console.error("Update Error:", err);
    }
  };

  const isOverdue = (updatedAt) => (new Date() - new Date(updatedAt)) > 86400000;

  return (
    <div className="crm-root">
      <header className="navbar">
        <h1>Gharpayy Lead Management</h1>
      </header>

      <Dashboard stats={stats} />

      <div className="pipeline">
        {STAGES.map(stage => (
          <div key={stage} className="column">
            <div className="column-header">
              <h3>{stage}</h3>
              <span className="badge">{leads.filter(l => l.status === stage).length}</span>
            </div>
            
            <div className="scroll-container">
              {leads.filter(l => l.status === stage).map(lead => (
                <div key={lead._id} className={`card ${isOverdue(lead.updatedAt) ? 'overdue' : ''}`}>
                  <div className="card-meta">
                    <span className="source">{lead.source}</span>
                    {isOverdue(lead.updatedAt) && <span className="alert">⚠️ FOLLOW-UP</span>}
                  </div>
                  
                  <h4>{lead.name}</h4>
                  <p>📞 {lead.phone}</p>
                  <p className="agent">Owner: {lead.agentName}</p>
                  
                  {lead.visitDetails?.property && (
                    <div className="visit-tag">📍 {lead.visitDetails.property}</div>
                  )}

                  <select 
                    value={lead.status} 
                    onChange={(e) => handleUpdate(lead._id, e.target.value)}
                  >
                    {STAGES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
