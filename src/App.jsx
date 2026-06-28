import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import ClientsPage from './pages/ClientsPage';
import ProjectsPage from './pages/ProjectsPage';
import TasksPage from './pages/TasksPage';
import TeamPage from './pages/TeamPage';
import ReportsPage from './pages/ReportsPage';
import './App.css';

function App() {
   const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 768);

  return (
    <Router>
      <div className="app-container">
        <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <div className="app-content">
          <Sidebar isOpen={sidebarOpen} />
          <main className={`main-content ${!sidebarOpen ? 'full-width' : ''}`}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/clients" element={<ClientsPage />} />
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/tasks" element={<TasksPage />} />
              <Route path="/team" element={<TeamPage />} />
              <Route path="/reports" element={<ReportsPage />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;