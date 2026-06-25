import React, { useState, useEffect } from 'react';

function TeamManagement({ member, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    department: '',
    joinDate: '',
    status: 'active',
    assignedProjects: [],
    tasksCompleted: 0,
    hoursLogged: 0,
  });

  // Sample roles and departments
  const roles = ['Developer', 'Designer', 'Project Manager', 'QA Engineer', 'DevOps', 'Business Analyst'];
  const departments = ['Technology', 'Design', 'Management', 'Quality Assurance', 'Operations'];
  const projects = ['Website Redesign', 'Mobile App Development', 'Database Migration', 'API Integration'];

  useEffect(() => {
  if (member && member._id) {
    setFormData({
      id: member._id,
      name: member.name || '',
      email: member.email || '',
      phone: member.phone || '',
      role: member.role || '',
      department: member.department || '',
      joinDate: member.joinDate || '',
      status: member.status || 'active',
      assignedProjects: Array.isArray(member.assignedProjects) ? member.assignedProjects : [],
      tasksCompleted: member.tasksCompleted || 0,
      hoursLogged: member.hoursLogged || 0,
    });
  }
}, [member]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleProjectToggle = (project) => {
    setFormData({
      ...formData,
      assignedProjects: formData.assignedProjects.includes(project)
        ? formData.assignedProjects.filter((p) => p !== project)
        : [...formData.assignedProjects, project],
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.phone || !formData.role || !formData.department) {
      alert('Please fill in all required fields');
      return;
    }

    onSave(formData);
    setFormData({
      name: '',
      email: '',
      phone: '',
      role: '',
      department: '',
      joinDate: '',
      status: 'active',
      assignedProjects: [],
      tasksCompleted: 0,
      hoursLogged: 0,
    });
  };

  return (
    <div className="form-container">
      <h3 style={{ marginBottom: '25px', color: 'var(--primary)', fontSize: '18px', fontWeight: '800', textTransform: 'uppercase' }}>
        {member ? '✎ Edit Team Member' : '+ Add New Team Member'}
      </h3>

      <form onSubmit={handleSubmit}>
        {/* Name and Email */}
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Full Name *</label>
            <input
              type="text"
              name="name"
              className="form-input"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter full name"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email *</label>
            <input
              type="email"
              name="email"
              className="form-input"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email address"
            />
          </div>
        </div>

        {/* Phone and Role */}
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Phone *</label>
            <input
              type="tel"
              name="phone"
              className="form-input"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter phone number"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Role *</label>
            <select
              name="role"
              className="form-select"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="">Select role</option>
              {roles.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Department and Status */}
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Department *</label>
            <select
              name="department"
              className="form-select"
              value={formData.department}
              onChange={handleChange}
            >
              <option value="">Select department</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
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
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="on-leave">On Leave</option>
            </select>
          </div>
        </div>

        {/* Join Date */}
        <div className="form-row full">
          <div className="form-group">
            <label className="form-label">Join Date</label>
            <input
              type="date"
              name="joinDate"
              className="form-input"
              value={formData.joinDate}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Assigned Projects */}
        <div className="form-row full">
          <div className="form-group">
            <label className="form-label">Assign to Projects</label>
            <div className="projects-checkbox">
              {projects.map((project) => (
                <label key={project} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.assignedProjects.includes(project)}
                    onChange={() => handleProjectToggle(project)}
                  />
                  <span>{project}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Tasks Completed</label>
            <input
              type="number"
              name="tasksCompleted"
              className="form-input"
              value={formData.tasksCompleted}
              onChange={handleChange}
              min="0"
              placeholder="0"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Hours Logged</label>
            <input
              type="number"
              name="hoursLogged"
              className="form-input"
              value={formData.hoursLogged}
              onChange={handleChange}
              min="0"
              placeholder="0"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            {member ? '✓ Update Member' : '✓ Add Member'}
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

export default TeamManagement;