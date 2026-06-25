import React, { useState, useEffect } from 'react';

function ProjectForm({ project, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    clientId: project?.clientId || '',
    clientName: project?.clientName || '',
    projectName: project?.projectName || '',
    description: project?.description || '',
    startDate: project?.startDate || '',
    endDate: project?.endDate || '',
    budget: project?.budget || '',
    spent: project?.spent || 0,
    status: project?.status || 'planning',
    priority: project?.priority || 'medium',
    progress: project?.progress || 0
  });

  // Sample clients for dropdown
  const clients = [
    { id: 1, name: 'ABC Corporation' },
    { id: 2, name: 'XYZ Solutions' },
    { id: 3, name: 'Global Enterprises' },
  ];

    useEffect(() => {
      if (project && project._id) {
        setFormData({
          id: project._id,        // ← keep this for the PUT request URL
          clientId: project.clientId || '',
          clientName: project.clientName || '',
          projectName: project.projectName || '',
          description: project.description || '',
          startDate: project.startDate || '',
          endDate: project.endDate || '',
          budget: project.budget || '',
          spent: project.spent || 0,
          status: project.status || 'planning',
          priority: project.priority || 'medium',
          progress: project.progress || 0,
        });
      }
    }, [project]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleClientChange = (e) => {
    const selectedId = e.target.value;
    const selectedClient = clients.find((c) => c.id === parseInt(selectedId));
    setFormData({
      ...formData,
      clientId: selectedId,
      clientName: selectedClient?.name || '',
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.clientName ||
      !formData.projectName ||
      !formData.startDate ||
      !formData.endDate ||
      !formData.budget
    ) {
      alert('Please fill in all required fields');
      return;
    }

    onSave(formData);
    setFormData({
      clientId: '',
      clientName: '',
      projectName: '',
      description: '',
      startDate: '',
      endDate: '',
      budget: '',
      spent: '',
      status: 'planning',
      priority: 'medium',
      progress: 0,
    });
  };

  return (
    <div className="form-container">
      <h3 style={{ marginBottom: '25px', color: 'var(--primary)', fontSize: '18px', fontWeight: '800', textTransform: 'uppercase' }}>
        {project ? '✎ Edit Project' : '+ Add New Project'}
      </h3>

      <form onSubmit={handleSubmit}>
        {/* Client Selection */}
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Client Name *</label>
            <input
              type="text"
              name="clientName"
              className="form-input"
              value={formData.clientName}
              onChange={handleChange}
              placeholder="Enter client name"
            />
          </div>

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
        </div>

        {/* Description */}
        <div className="form-row full">
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              name="description"
              className="form-textarea"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter project description"
            ></textarea>
          </div>
        </div>

        {/* Dates */}
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Start Date *</label>
            <input
              type="date"
              name="startDate"
              className="form-input"
              value={formData.startDate}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">End Date *</label>
            <input
              type="date"
              name="endDate"
              className="form-input"
              value={formData.endDate}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Budget */}
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Total Budget *</label>
            <input
              type="number"
              name="budget"
              className="form-input"
              value={formData.budget}
              onChange={handleChange}
              placeholder="Enter total budget"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Amount Spent</label>
            <input
              type="number"
              name="spent"
              className="form-input"
              value={formData.spent}
              onChange={handleChange}
              placeholder="Enter amount spent"
            />
          </div>
        </div>

        {/* Status and Priority */}
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Status</label>
            <select
              name="status"
              className="form-select"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="planning">Planning</option>
              <option value="in-progress">In Progress</option>
              <option value="on-hold">On Hold</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Priority</label>
            <select
              name="priority"
              className="form-select"
              value={formData.priority}
              onChange={handleChange}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>

        {/* Progress */}
        <div className="form-row full">
          <div className="form-group">
            <label className="form-label">Progress (%)</label>
            <input
              type="range"
              name="progress"
              className="form-input"
              min="0"
              max="100"
              value={formData.progress}
              onChange={handleChange}
              style={{ padding: '5px' }}
            />
            <div style={{ color: 'var(--primary)', marginTop: '8px', fontWeight: '700' }}>
              {formData.progress}% Complete
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            {project ? '✓ Update Project' : '✓ Add Project'}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onCancel}
          >
            ✕ Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default ProjectForm;