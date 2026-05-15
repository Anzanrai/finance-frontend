import React, { useState } from 'react';
import Dashboard from './pages/Dashboard';
import Goals from './pages/Goals';
import Allocations from './pages/Allocations';
import Planning from './pages/Planning';

const PAGES = [
  { id: 'dashboard', label: 'Dashboard', icon: '⬡' },
  { id: 'goals', label: 'Goals', icon: '🎯' },
  { id: 'allocations', label: 'Allocations', icon: '💸' },
  { id: 'planning', label: 'Plan & Strategy', icon: '🗺' },
];

export default function App() {
  const [page, setPage] = useState('dashboard');

  const renderPage = () => {
    switch (page) {
      case 'dashboard': return <Dashboard />;
      case 'goals': return <Goals />;
      case 'allocations': return <Allocations />;
      case 'planning': return <Planning />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <h1>Anjan Rai</h1>
          <p>Financial Dashboard</p>
        </div>
        <nav className="sidebar-nav">
          <div className="nav-section-label">Menu</div>
          {PAGES.map(p => (
            <button key={p.id} className={`nav-item ${page === p.id ? 'active' : ''}`}
              onClick={() => setPage(p.id)}>
              <span className="icon">{p.icon}</span>
              {p.label}
            </button>
          ))}
        </nav>
        <div className="sidebar-footer">
          Family · Stability · Growth
        </div>
      </aside>
      <main className="main">
        {renderPage()}
      </main>
    </div>
  );
}
