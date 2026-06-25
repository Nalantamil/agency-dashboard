import React, { useState, useEffect } from 'react';
import { clientAPI, projectAPI, taskAPI, teamAPI } from '../utils/api';

function Home() {
  const [stats, setStats] = useState({
    totalClients: 0,
    totalProjects: 0,
    totalTasks: 0,
    totalTeam: 0,
    activeProjects: 0,
    completedProjects: 0,
    pendingTasks: 0,
    completedTasks: 0,
  });
  const [recentProjects, setRecentProjects] = useState([]);
  const [recentTasks, setRecentTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [clientsRes, projectsRes, tasksRes, teamRes] = await Promise.all([
        clientAPI.getClients(),
        projectAPI.getProjects(),
        taskAPI.getTasks(),
        teamAPI.getTeam(),
      ]);

      const clients = clientsRes.data.success ? clientsRes.data.data : [];
      const projects = projectsRes.data.success ? projectsRes.data.data : [];
      const tasks = tasksRes.data.success ? tasksRes.data.data : [];
      const team = teamRes.data.success ? teamRes.data.data : [];

      setStats({
        totalClients: clients.length,
        totalProjects: projects.length,
        totalTasks: tasks.length,
        totalTeam: team.length,
        activeProjects: projects.filter(p => p.status === 'in-progress').length,
        completedProjects: projects.filter(p => p.status === 'completed').length,
        pendingTasks: tasks.filter(t => t.status === 'todo').length,
        completedTasks: tasks.filter(t => t.status === 'completed').length,
      });

      setRecentProjects(projects.slice(-3).reverse());
      setRecentTasks(tasks.slice(-5).reverse());

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      'planning': { label: 'Planning', color: '#6366f1' },
      'in-progress': { label: 'In Progress', color: '#f59e0b' },
      'completed': { label: 'Completed', color: '#10b981' },
      'on-hold': { label: 'On Hold', color: '#ef4444' },
      'todo': { label: 'To Do', color: '#6366f1' },
      'blocked': { label: 'Blocked', color: '#ef4444' },
    };
    return badges[status] || { label: status, color: '#6b7280' };
  };

  if (loading) {
    return (
      <div className="main-content">
        <div className="empty-state">
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="main-content">
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">Welcome back! Here's your agency overview</p>
      </div>

      {/* Stats Cards */}
      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-card-icon" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
            👥
          </div>
          <div className="stat-card-info">
            <h3 className="stat-card-number">{stats.totalClients}</h3>
            <p className="stat-card-label">Total Clients</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-icon" style={{ background: 'linear-gradient(135deg, #f59e0b, #ef4444)' }}>
            📁
          </div>
          <div className="stat-card-info">
            <h3 className="stat-card-number">{stats.totalProjects}</h3>
            <p className="stat-card-label">Total Projects</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-icon" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
            ✓
          </div>
          <div className="stat-card-info">
            <h3 className="stat-card-number">{stats.totalTasks}</h3>
            <p className="stat-card-label">Total Tasks</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-icon" style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}>
            👤
          </div>
          <div className="stat-card-info">
            <h3 className="stat-card-number">{stats.totalTeam}</h3>
            <p className="stat-card-label">Team Members</p>
          </div>
        </div>
      </div>

      {/* Second Row Stats */}
      <div className="dashboard-stats" style={{ marginTop: '20px' }}>
        <div className="stat-card">
          <div className="stat-card-icon" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
            🔥
          </div>
          <div className="stat-card-info">
            <h3 className="stat-card-number">{stats.activeProjects}</h3>
            <p className="stat-card-label">Active Projects</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-icon" style={{ background: 'linear-gradient(135deg, #10b981, #34d399)' }}>
            🏆
          </div>
          <div className="stat-card-info">
            <h3 className="stat-card-number">{stats.completedProjects}</h3>
            <p className="stat-card-label">Completed Projects</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-icon" style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)' }}>
            📋
          </div>
          <div className="stat-card-info">
            <h3 className="stat-card-number">{stats.pendingTasks}</h3>
            <p className="stat-card-label">Pending Tasks</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-icon" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
            ✅
          </div>
          <div className="stat-card-info">
            <h3 className="stat-card-number">{stats.completedTasks}</h3>
            <p className="stat-card-label">Completed Tasks</p>
          </div>
        </div>
      </div>

      {/* Recent Projects and Tasks */}
      <div className="dashboard-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginTop: '30px' }}>

        {/* Recent Projects */}
        <div className="dashboard-card">
          <h3 style={{ color: 'var(--primary)', fontWeight: '800', marginBottom: '20px', fontSize: '16px', textTransform: 'uppercase' }}>
            📁 Recent Projects
          </h3>
          {recentProjects.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '20px' }}>No projects yet</p>
          ) : (
            recentProjects.map((project) => {
              const badge = getStatusBadge(project.status);
              return (
                <div key={project._id} style={{ padding: '15px 0', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontWeight: '700', color: 'var(--text-primary)', fontSize: '14px' }}>
                      {project.projectName}
                    </span>
                    <span style={{ background: badge.color, color: '#fff', padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '700' }}>
                      {badge.label}
                    </span>
                  </div>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    👤 {project.clientName}
                  </span>
                  <div style={{ marginTop: '8px', background: 'var(--border)', borderRadius: '10px', height: '6px' }}>
                    <div style={{ width: `${project.progress || 0}%`, background: 'var(--primary)', borderRadius: '10px', height: '6px' }}></div>
                  </div>
                  <span style={{ fontSize: '11px', color: 'var(--primary)', fontWeight: '700' }}>{project.progress || 0}%</span>
                </div>
              );
            })
          )}
        </div>

        {/* Recent Tasks */}
        <div className="dashboard-card">
          <h3 style={{ color: 'var(--primary)', fontWeight: '800', marginBottom: '20px', fontSize: '16px', textTransform: 'uppercase' }}>
            ✓ Recent Tasks
          </h3>
          {recentTasks.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '20px' }}>No tasks yet</p>
          ) : (
            recentTasks.map((task) => {
              const badge = getStatusBadge(task.status);
              return (
                <div key={task._id} style={{ padding: '12px 0', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <p style={{ fontWeight: '700', color: 'var(--text-primary)', fontSize: '14px', marginBottom: '4px' }}>
                      {task.taskName}
                    </p>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      📁 {task.projectName}
                    </span>
                  </div>
                  <span style={{ background: badge.color, color: '#fff', padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '700', whiteSpace: 'nowrap' }}>
                    {badge.label}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;