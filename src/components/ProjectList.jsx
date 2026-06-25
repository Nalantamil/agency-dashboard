import React from 'react';

function ProjectList({ projects, onEdit, onDelete }) {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return '#FF6B6B';
      case 'medium':
        return '#FFD700';
      case 'low':
        return '#00FF88';
      default:
        return '#A0A0A0';
    }
  };

  const formatNumber = (value) => {
    if (!value) return '0';
    const num = typeof value === 'string' ? parseInt(value) : value;
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  if (projects.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">📁</div>
        <h3 className="empty-state-title">No Projects Yet</h3>
        <p>Create your first project to get started</p>
      </div>
    );
  }

  return (
    <div className="projects-container">
      {projects.map((project) => (
        <div key={project.id} className="project-card">
          <div className="project-header">
            <h3 className="project-name">{project.projectName}</h3>
            <span className={`project-status status-${project.status}`}>
              {project.status}
            </span>
          </div>

          <p className="project-client">👤 {project.clientName}</p>
          <p className="project-description">{project.description}</p>

          {/* Progress Bar */}
          <div className="progress-container">
            <div className="progress-label">
              <span className="progress-label-text">Progress</span>
              <span className="progress-percent">{project.progress || 0}%</span>
            </div>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${project.progress || 0}%` }}
              ></div>
            </div>
          </div>

          {/* Budget Info */}
          <div className="budget-info">
            <span className="budget-spent">💰 ${formatNumber(project.spent)}</span>
            <span className="budget-total">of ${formatNumber(project.budget)}</span>
          </div>

          {/* Project Info Grid */}
          <div className="project-info">
            <div className="project-info-item">
              <div className="project-info-label">Start Date</div>
              <div className="project-info-value">{project.startDate}</div>
            </div>

            <div className="project-info-item">
              <div className="project-info-label">End Date</div>
              <div className="project-info-value">{project.endDate}</div>
            </div>

            <div className="project-info-item">
              <div className="project-info-label">Priority</div>
              <div
                className="project-info-value"
                style={{ color: getPriorityColor(project.priority) }}
              >
                {project.priority ? project.priority.toUpperCase() : 'MEDIUM'}
              </div>
            </div>

            <div className="project-info-item">
              <div className="project-info-label">Total Budget</div>
              <div className="project-info-value">
                ${formatNumber(project.budget)}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="project-actions">
            <button
              className="btn btn-secondary"
              onClick={() => onEdit(project)}
              style={{ flex: 1 }}
            >
              ✎ Edit
            </button>
            <button
              className="btn btn-danger"
              onClick={() => onDelete(project.id)}
              style={{ flex: 1 }}
            >
              🗑 Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ProjectList;