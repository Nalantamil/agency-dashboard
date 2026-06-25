import React, { useState, useEffect } from 'react';
import Reports from '../components/Reports';
import { reportAPI } from '../utils/api';

function ReportsPage() {
  const [reports, setReports] = useState([]);
  const [selectedProject, setSelectedProject] = useState('all');
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    projectName: '',
    reportType: 'Monthly',
    generatedDate: new Date().toISOString().split('T')[0],
    totalTasks: 0,
    completedTasks: 0,
    ongoingTasks: 0,
    blockedTasks: 0,
    budgetStatus: 'On Track',
    timelineStatus: 'On Schedule',
    progress: 0,
    budgetSpent: 0,
    budgetTotal: 0,
    topPerformer: '',
    teamTasksCompleted: 0,
    teamHoursLogged: 0,
    summary: '',
  });

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await reportAPI.getReports();
      if (response.data.success) {
        const formattedReports = response.data.data.map(report => ({
          ...report,
          id: report._id
        }));
        setReports(formattedReports);
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleGenerateReport = async (e) => {
    e.preventDefault();
    if (!formData.projectName || !formData.reportType) {
      alert('Please fill in Project Name and Report Type');
      return;
    }
    try {
      const reportPayload = {
        projectName: formData.projectName,
        reportType: formData.reportType,
        generatedDate: formData.generatedDate,
        totalTasks: Number(formData.totalTasks),
        completedTasks: Number(formData.completedTasks),
        ongoingTasks: Number(formData.ongoingTasks),
        blockedTasks: Number(formData.blockedTasks),
        budgetStatus: formData.budgetStatus,
        timelineStatus: formData.timelineStatus,
        progress: Number(formData.progress),
        budgetSpent: Number(formData.budgetSpent),
        budgetTotal: Number(formData.budgetTotal),
        teamPerformance: {
          topPerformer: formData.topPerformer,
          tasksCompleted: Number(formData.teamTasksCompleted),
          hoursLogged: Number(formData.teamHoursLogged),
        },
        summary: formData.summary,
      };

      const response = await reportAPI.createReport(reportPayload);
      if (response.data.success) {
        fetchReports();
        setShowForm(false);
        setFormData({
          projectName: '',
          reportType: 'Monthly',
          generatedDate: new Date().toISOString().split('T')[0],
          totalTasks: 0,
          completedTasks: 0,
          ongoingTasks: 0,
          blockedTasks: 0,
          budgetStatus: 'On Track',
          timelineStatus: 'On Schedule',
          progress: 0,
          budgetSpent: 0,
          budgetTotal: 0,
          topPerformer: '',
          teamTasksCompleted: 0,
          teamHoursLogged: 0,
          summary: '',
        });
      }
    } catch (error) {
      console.error('Error generating report:', error);
      alert('Error generating report. Check console for details.');
    }
  };

  const handleDeleteReport = async (id) => {
    if (confirm('Are you sure you want to delete this report?')) {
      try {
        const response = await reportAPI.deleteReport(id);
        if (response.data.success) {
          fetchReports();
        }
      } catch (error) {
        console.error('Error deleting report:', error);
        alert('Error deleting report.');
      }
    }
  };

  const projects = [...new Set(reports.map((r) => r.projectName))];
  const filteredReports =
    selectedProject === 'all'
      ? reports
      : reports.filter((r) => r.projectName === selectedProject);

  return (
    <div className="main-content">
      <div className="page-header">
        <h1 className="page-title">Reports</h1>
        <p className="page-subtitle">View project reports and analytics</p>
      </div>

      <div className="report-controls">
        <div className="filter-group">
          <label className="filter-label">Filter by Project:</label>
          <select
            className="form-select"
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            style={{ maxWidth: '250px' }}
          >
            <option value="all">All Projects</option>
            {projects.map((project) => (
              <option key={project} value={project}>{project}</option>
            ))}
          </select>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? '✕ Cancel' : '📊 Generate New Report'}
        </button>
      </div>

      {/* Generate Report Form */}
      {showForm && (
        <div className="form-container" style={{ marginBottom: '30px' }}>
          <h3 style={{ marginBottom: '25px', color: 'var(--primary)', fontSize: '18px', fontWeight: '800', textTransform: 'uppercase' }}>
            📊 Generate New Report
          </h3>
          <form onSubmit={handleGenerateReport}>

            {/* Project Name and Report Type */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Project Name *</label>
                <input
                  type="text"
                  name="projectName"
                  className="form-input"
                  value={formData.projectName}
                  onChange={handleChange}
                  placeholder="Enter project name"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Report Type *</label>
                <select
                  name="reportType"
                  className="form-select"
                  value={formData.reportType}
                  onChange={handleChange}
                >
                  <option value="Weekly">Weekly</option>
                  <option value="Monthly">Monthly</option>
                  <option value="Final">Final</option>
                </select>
              </div>
            </div>

            {/* Generated Date and Progress */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Report Date</label>
                <input
                  type="date"
                  name="generatedDate"
                  className="form-input"
                  value={formData.generatedDate}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Overall Progress (%)</label>
                <input
                  type="number"
                  name="progress"
                  className="form-input"
                  value={formData.progress}
                  onChange={handleChange}
                  min="0"
                  max="100"
                  placeholder="0"
                />
              </div>
            </div>

            {/* Task Stats */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Total Tasks</label>
                <input type="number" name="totalTasks" className="form-input"
                  value={formData.totalTasks} onChange={handleChange} min="0" placeholder="0" />
              </div>
              <div className="form-group">
                <label className="form-label">Completed Tasks</label>
                <input type="number" name="completedTasks" className="form-input"
                  value={formData.completedTasks} onChange={handleChange} min="0" placeholder="0" />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Ongoing Tasks</label>
                <input type="number" name="ongoingTasks" className="form-input"
                  value={formData.ongoingTasks} onChange={handleChange} min="0" placeholder="0" />
              </div>
              <div className="form-group">
                <label className="form-label">Blocked Tasks</label>
                <input type="number" name="blockedTasks" className="form-input"
                  value={formData.blockedTasks} onChange={handleChange} min="0" placeholder="0" />
              </div>
            </div>

            {/* Budget */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Budget Spent ($)</label>
                <input type="number" name="budgetSpent" className="form-input"
                  value={formData.budgetSpent} onChange={handleChange} min="0" placeholder="0" />
              </div>
              <div className="form-group">
                <label className="form-label">Total Budget ($)</label>
                <input type="number" name="budgetTotal" className="form-input"
                  value={formData.budgetTotal} onChange={handleChange} min="0" placeholder="0" />
              </div>
            </div>

            {/* Status */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Budget Status</label>
                <select name="budgetStatus" className="form-select"
                  value={formData.budgetStatus} onChange={handleChange}>
                  <option value="On Track">On Track</option>
                  <option value="Within Budget">Within Budget</option>
                  <option value="Over Budget">Over Budget</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Timeline Status</label>
                <select name="timelineStatus" className="form-select"
                  value={formData.timelineStatus} onChange={handleChange}>
                  <option value="On Schedule">On Schedule</option>
                  <option value="On Time">On Time</option>
                  <option value="Slightly Behind">Slightly Behind</option>
                  <option value="Delayed">Delayed</option>
                </select>
              </div>
            </div>

            {/* Team Performance */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Top Performer</label>
                <input type="text" name="topPerformer" className="form-input"
                  value={formData.topPerformer} onChange={handleChange}
                  placeholder="Enter top performer name" />
              </div>
              <div className="form-group">
                <label className="form-label">Team Tasks Completed</label>
                <input type="number" name="teamTasksCompleted" className="form-input"
                  value={formData.teamTasksCompleted} onChange={handleChange} min="0" placeholder="0" />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Team Hours Logged</label>
                <input type="number" name="teamHoursLogged" className="form-input"
                  value={formData.teamHoursLogged} onChange={handleChange} min="0" placeholder="0" />
              </div>
            </div>

            {/* Summary */}
            <div className="form-row full">
              <div className="form-group">
                <label className="form-label">Summary</label>
                <textarea
                  name="summary"
                  className="form-textarea"
                  value={formData.summary}
                  onChange={handleChange}
                  placeholder="Write a brief summary of the project status..."
                  rows="4"
                ></textarea>
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                📊 Generate Report
              </button>
              <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>
                ✕ Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="empty-state">
          <p>Loading reports...</p>
        </div>
      ) : (
        <Reports reports={filteredReports} onDelete={handleDeleteReport} />
      )}
    </div>
  );
}

export default ReportsPage;