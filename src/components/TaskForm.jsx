import React, { useState, useEffect } from 'react';

function TaskForm({ task, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    projectId: '',
    projectName: '',
    taskName: '',
    description: '',
    assignedTo: '',
    dueDate: '',
    priority: 'medium',
    status: 'todo',
    estimatedHours: '',
    actualHours: '',
  });

  // Sample projects for dropdown
  const projects = [
    { id: 1, name: 'Website Redesign' },
    { id: 2, name: 'Mobile App Development' },
    { id: 3, name: 'Database Migration' },
  ];

  // Sample team members
  const teamMembers = [
    'John Doe',
    'Jane Smith',
    'Mike Johnson',
    'Sarah Williams',
    'David Brown',
  ];

  useEffect(() => {
    if (task) {
      setFormData(task);
    }
  }, [task]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleProjectChange = (e) => {
    const selectedId = e.target.value;
    const selectedProject = projects.find((p) => p.id === parseInt(selectedId));
    setFormData({
      ...formData,
      projectId: selectedId,
      projectName: selectedProject?.name || '',
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.projectName ||
      !formData.taskName ||
      !formData.assignedTo ||
      !formData.dueDate ||
      !formData.estimatedHours
    ) {
      alert('Please fill in all required fields');
      return;
    }

    onSave(formData);
    setFormData({
      projectId: '',
      projectName: '',
      taskName: '',
      description: '',
      assignedTo: '',
      dueDate: '',
      priority: 'medium',
      status: 'todo',
      estimatedHours: '',
      actualHours: '',
    });
  };

  return (
    <div className="form-container">
      <h3 style={{ marginBottom: '25px', color: 'var(--primary)', fontSize: '18px', fontWeight: '800', textTransform: 'uppercase' }}>
        {task ? '✎ Edit Task' : '+ Add New Task'}
      </h3>

      <form onSubmit={handleSubmit}>
        {/* Project Selection */}
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Select Project *</label>
            <select
              name="projectId"
              className="form-select"
              value={formData.projectId}
              onChange={handleProjectChange}
            >
              <option value="">Choose a project</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Task Name *</label>
            <input
              type="text"
              name="taskName"
              className="form-input"
              value={formData.taskName}
              onChange={handleChange}
              placeholder="Enter task name"
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
              placeholder="Enter task description"
            ></textarea>
          </div>
        </div>

        {/* Assignment and Due Date */}
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Assign To *</label>
            <select
              name="assignedTo"
              className="form-select"
              value={formData.assignedTo}
              onChange={handleChange}
            >
              <option value="">Select team member</option>
              {teamMembers.map((member) => (
                <option key={member} value={member}>
                  {member}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Due Date *</label>
            <input
              type="date"
              name="dueDate"
              className="form-input"
              value={formData.dueDate}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Priority and Status */}
        <div className="form-row">
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

          <div className="form-group">
            <label className="form-label">Status</label>
            <select
              name="status"
              className="form-select"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="blocked">Blocked</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        {/* Hours */}
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Estimated Hours *</label>
            <input
              type="number"
              name="estimatedHours"
              className="form-input"
              value={formData.estimatedHours}
              onChange={handleChange}
              placeholder="Enter estimated hours"
              min="0"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Actual Hours</label>
            <input
              type="number"
              name="actualHours"
              className="form-input"
              value={formData.actualHours}
              onChange={handleChange}
              placeholder="Enter actual hours spent"
              min="0"
            />
          </div>
        </div>

        {/* Hours Summary */}
        {formData.estimatedHours && (
          <div
            style={{
              background: 'var(--bg-light)',
              padding: '15px',
              borderRadius: '8px',
              marginBottom: '20px',
              borderLeft: `4px solid ${
                formData.actualHours > formData.estimatedHours
                  ? '#FF6B6B'
                  : '#00FF88'
              }`,
            }}
          >
            <div style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
              {formData.actualHours ? (
                <>
                  {formData.actualHours > formData.estimatedHours ? (
                    <span style={{ color: '#FF6B6B', fontWeight: 700 }}>
                      ⚠️ Over budget by {formData.actualHours - formData.estimatedHours} hours
                    </span>
                  ) : formData.actualHours < formData.estimatedHours ? (
                    <span style={{ color: '#00FF88', fontWeight: 700 }}>
                      ✓ {formData.estimatedHours - formData.actualHours} hours remaining
                    </span>
                  ) : (
                    <span style={{ color: 'var(--primary)', fontWeight: 700 }}>
                      ✓ On track
                    </span>
                  )}
                </>
              ) : (
                <span>Estimated: {formData.estimatedHours} hours</span>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            {task ? '✓ Update Task' : '✓ Add Task'}
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

export default TaskForm;