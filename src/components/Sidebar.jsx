import React from 'react';
import { Link } from 'react-router-dom';

function Sidebar({ isOpen }) {
  return (
    <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-title">📋 Menu</div>
      
      <ul className="sidebar-menu">
        <li className="sidebar-item">
          <Link to="/" className="sidebar-link active">
            <span className="sidebar-icon">🏠</span>
            Dashboard
          </Link>
        </li>

        <li className="sidebar-item">
          <Link to="/clients" className="sidebar-link">
            <span className="sidebar-icon">👥</span>
            Clients
          </Link>
        </li>

        <li className="sidebar-item">
          <Link to="/projects" className="sidebar-link">
            <span className="sidebar-icon">📁</span>
            Projects
          </Link>
        </li>

        <li className="sidebar-item">
          <Link to="/tasks" className="sidebar-link">
            <span className="sidebar-icon">✓</span>
            Tasks
          </Link>
        </li>

        <li className="sidebar-item">
          <Link to="/team" className="sidebar-link">
            <span className="sidebar-icon">👨‍💼</span>
            Team
          </Link>
        </li>

        <li className="sidebar-item">
          <Link to="/reports" className="sidebar-link">
            <span className="sidebar-icon">📊</span>
            Reports
          </Link>
        </li>
      </ul>
    </aside>
  );
}

export default Sidebar;