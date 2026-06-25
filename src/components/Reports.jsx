import React from 'react';

function Reports({ reports, onDelete }) {
  const getStatusColor = (status) => {
    if (status && (status.includes('On Track') || status.includes('On Time') || status.includes('Within Budget'))) {
      return 'status-on-track';
    }
    return 'status-behind';
  };

  const getStatusIcon = (status) => {
    if (status && (status.includes('On Track') || status.includes('On Time') || status.includes('Within Budget'))) {
      return '✓';
    }
    return '⚠';
  };

  if (reports.length === 0) {
    return (
      <div className="empty-reports">
        <div className="empty-reports-icon">📊</div>
        <h3 className="empty-reports-title">No Reports Available</h3>
        <p className="empty-reports-text">Generate your first report to get started</p>
      </div>
    );
  }

  return (
    <div className="reports-container">
      {reports.map((report) => (
        <div key={report.id} className="report-card">
          <div className="report-header">
            <div className="report-title">
              <h3 className="report-project-name">{report.projectName}</h3>
              <p className="report-type">{report.reportType} Report</p>
            </div>
            <span className="report-date">{report.generatedDate}</span>
          </div>

          <div className="report-progress">
            <div className="progress-header">
              <span className="progress-title">Overall Progress</span>
              <span className="progress-percent">{report.progress}%</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${report.progress}%` }}></div>
            </div>
          </div>

          <div className="report-stats">
            <div className="stat-box">
              <div className="stat-box-label">Completed</div>
              <div className="stat-box-value">{report.completedTasks || 0}</div>
            </div>
            <div className="stat-box">
              <div className="stat-box-label">Ongoing</div>
              <div className="stat-box-value">{report.ongoingTasks || 0}</div>
            </div>
            <div className="stat-box">
              <div className="stat-box-label">Total</div>
              <div className="stat-box-value">{report.totalTasks || 0}</div>
            </div>
            <div className="stat-box">
              <div className="stat-box-label">Blocked</div>
              <div className="stat-box-value">{report.blockedTasks || 0}</div>
            </div>
          </div>

          <div className="report-status-row">
            <div className={`status-item ${getStatusColor(report.budgetStatus)}`}>
              <div className="status-item-label">Budget</div>
              <div className="status-item-value">
                {getStatusIcon(report.budgetStatus)} {report.budgetStatus}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '5px' }}>
                ${(report.budgetSpent || 0).toLocaleString()} / ${(report.budgetTotal || 0).toLocaleString()}
              </div>
            </div>
            <div className={`status-item ${getStatusColor(report.timelineStatus)}`}>
              <div className="status-item-label">Timeline</div>
              <div className="status-item-value">
                {getStatusIcon(report.timelineStatus)} {report.timelineStatus}
              </div>
            </div>
          </div>

          {report.teamPerformance && (
            <div className="report-team">
              <div className="team-perf-title">👥 Team Performance</div>
              <div className="team-perf-item">
                <span className="team-perf-label">Top Performer:</span>
                <span className="team-perf-value">{report.teamPerformance.topPerformer}</span>
              </div>
              <div className="team-perf-item">
                <span className="team-perf-label">Tasks Completed:</span>
                <span className="team-perf-value">{report.teamPerformance.tasksCompleted}</span>
              </div>
              <div className="team-perf-item">
                <span className="team-perf-label">Hours Logged:</span>
                <span className="team-perf-value">{report.teamPerformance.hoursLogged}h</span>
              </div>
            </div>
          )}

          <div className="report-summary">
            <div className="summary-title">📋 Summary</div>
            <p className="summary-text">{report.summary}</p>
          </div>

          <div className="report-actions">
            <button className="btn btn-secondary">👁 View</button>
            <button className="btn btn-secondary">⬇ Download</button>
            <button
              className="btn btn-danger"
              onClick={() => onDelete(report.id)}
            >
              🗑 Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Reports;