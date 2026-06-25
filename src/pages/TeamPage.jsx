import React, { useState, useEffect } from 'react';
import TeamManagement from '../components/TeamManagement';
import { teamAPI } from '../utils/api';

function TeamPage() {
  const [teamMembers, setTeamMembers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTeam();
  }, []);

  const fetchTeam = async () => {
    try {
      setLoading(true);
      const response = await teamAPI.getTeam();
      if (response.data.success) {
        const formattedMembers = response.data.data.map(member => ({
          ...member,
          id: member._id
        }));
        setTeamMembers(formattedMembers);
      }
    } catch (error) {
      console.error('Error fetching team:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMember = async (newMember) => {
    try {
      const response = await teamAPI.createTeamMember(newMember);
      if (response.data.success) {
        fetchTeam();
        setShowForm(false);
      }
    } catch (error) {
      console.error('Error adding member:', error);
      alert('Error adding member. Check console for details.');
    }
  };

  const handleUpdateMember = async (updatedMember) => {
    try {
      const response = await teamAPI.updateTeamMember(updatedMember.id, updatedMember);
      if (response.data.success) {
        fetchTeam();
        setEditingMember(null);
        setShowForm(false);
      }
    } catch (error) {
      console.error('Error updating member:', error);
      alert('Error updating member. Check console for details.');
    }
  };

  const handleDeleteMember = async (id) => {
    if (confirm('Are you sure you want to remove this team member?')) {
      try {
        const response = await teamAPI.deleteTeamMember(id);
        if (response.data.success) {
          fetchTeam();
        }
      } catch (error) {
        console.error('Error deleting member:', error);
        alert('Error deleting member. Check console for details.');
      }
    }
  };

  const handleEditMember = (member) => {
    setEditingMember(member);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingMember(null);
  };

  const activeMembers = teamMembers.filter((m) => m.status === 'active').length;
  const totalHours = teamMembers.reduce((sum, m) => sum + (m.hoursLogged || 0), 0);
  const totalTasks = teamMembers.reduce((sum, m) => sum + (m.tasksCompleted || 0), 0);

  return (
    <div className="main-content">
      <div className="page-header">
        <h1 className="page-title">Team Management</h1>
        <p className="page-subtitle">Manage team members and assignments</p>
      </div>

      {/* Team Stats */}
      <div className="team-stats">
        <div className="team-stat">
          <span className="stat-number">{teamMembers.length}</span>
          <span className="stat-label">Total Members</span>
        </div>
        <div className="team-stat">
          <span className="stat-number">{activeMembers}</span>
          <span className="stat-label">Active</span>
        </div>
        <div className="team-stat">
          <span className="stat-number">{totalTasks}</span>
          <span className="stat-label">Tasks Completed</span>
        </div>
        <div className="team-stat">
          <span className="stat-number">{totalHours}</span>
          <span className="stat-label">Hours Logged</span>
        </div>
      </div>

      {/* Add Button */}
      <button
        className="btn btn-primary"
        onClick={() => setShowForm(!showForm)}
        style={{ marginBottom: '30px' }}
      >
        {showForm ? '✕ Cancel' : '+ Add Team Member'}
      </button>

      {showForm && (
        <TeamManagement
          member={editingMember || {}}
          onSave={editingMember ? handleUpdateMember : handleAddMember}
          onCancel={handleCloseForm}
        />
      )}

      {loading ? (
        <div className="empty-state">
          <p>Loading team members...</p>
        </div>
      ) : (
        <div className="team-grid">
          {teamMembers.map((member) => (
            <div key={member.id} className="team-card">
              <div className="team-header">
                <div className="team-avatar">
                  {member.name?.split(' ').map((n) => n[0]).join('')}
                </div>
                <div className="team-info-header">
                  <h3 className="team-name">{member.name}</h3>
                  <p className="team-role">{member.role}</p>
                </div>
                <span className={`team-status status-${member.status}`}>
                  {member.status}
                </span>
              </div>

              <div className="team-details">
                <div className="detail-item">
                  <span className="detail-label">Email:</span>
                  <span className="detail-value">{member.email}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Phone:</span>
                  <span className="detail-value">{member.phone}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Department:</span>
                  <span className="detail-value">{member.department}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Joined:</span>
                  <span className="detail-value">{member.joinDate}</span>
                </div>
              </div>

              <div className="team-performance">
                <div className="perf-item">
                  <span className="perf-label">Tasks</span>
                  <span className="perf-value">{member.tasksCompleted}</span>
                </div>
                <div className="perf-item">
                  <span className="perf-label">Hours</span>
                  <span className="perf-value">{member.hoursLogged}h</span>
                </div>
                <div className="perf-item">
                  <span className="perf-label">Projects</span>
                  <span className="perf-value">{member.assignedProjects?.length || 0}</span>
                </div>
              </div>

              {member.assignedProjects?.length > 0 && (
                <div className="team-projects">
                  <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '8px' }}>
                    ASSIGNED PROJECTS
                  </p>
                  <div className="project-tags">
                    {member.assignedProjects.map((project, idx) => (
                      <span key={idx} className="project-tag">{project}</span>
                    ))}
                  </div>
                </div>
              )}

              <div className="team-actions">
                <button className="btn btn-secondary" onClick={() => handleEditMember(member)}>
                  ✎ Edit
                </button>
                <button className="btn btn-danger" onClick={() => handleDeleteMember(member.id)}>
                  🗑 Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TeamPage;