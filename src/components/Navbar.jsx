import React from 'react';

function Navbar({ onMenuClick }) {
  return (
    <nav className="navbar">
      <div className="navbar-brand">📊 Agency Dashboard</div>
      <button className="navbar-menu-btn" onClick={onMenuClick}>
        ☰ Menu
      </button>
    </nav>
  );
}

export default Navbar;