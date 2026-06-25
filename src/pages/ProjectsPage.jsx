import React, { useState, useEffect } from 'react';
import ProjectList from '../components/ProjectList';
import ProjectForm from '../components/ProjectForm';
import { projectAPI } from '../utils/api';

function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await projectAPI.getProjects();
      if (response.data.success) {
        const formattedProjects = response.data.data.map(project => ({
          ...project,
          id: project._id
        }));
        setProjects(formattedProjects);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProject = async (newProject) => {
    try {
      const response = await projectAPI.createProject(newProject);
      if (response.data.success) {
        fetchProjects();
        setShowForm(false);
      }
    } catch (error) {
      console.error('Error adding project:', error);
      alert('Error adding project. Check console for details.');
    }
  };

  const handleUpdateProject = async (updatedProject) => {
    try {
      const response = await projectAPI.updateProject(updatedProject.id, updatedProject);
      if (response.data.success) {
        fetchProjects();
        setEditingProject(null);
      }
    } catch (error) {
      console.error('Error updating project:', error);
      alert('Error updating project. Check console for details.');
    }
  };

  const handleDeleteProject = async (id) => {
    if (confirm('Are you sure you want to delete this project?')) {
      try {
        const response = await projectAPI.deleteProject(id);
        if (response.data.success) {
          fetchProjects();
        }
      } catch (error) {
        console.error('Error deleting project:', error);
        alert('Error deleting project. Check console for details.');
      }
    }
  };

  const handleEditProject = (project) => {
    setEditingProject(project);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingProject(null);
  };

  return (
    <div className="main-content">
      <div className="page-header">
        <h1 className="page-title">Projects</h1>
        <p className="page-subtitle">Manage all client projects and track progress</p>
      </div>

      <button
        className="btn btn-primary"
        onClick={() => setShowForm(!showForm)}
        style={{ marginBottom: '30px' }}
      >
        {showForm ? '✕ Cancel' : '+ Add New Project'}
      </button>

      {showForm && (
        <ProjectForm
          project={editingProject || {}}
          onSave={editingProject ? handleUpdateProject : handleAddProject}
          onCancel={handleCloseForm}
        />
      )}

      {loading ? (
        <div className="empty-state">
          <p>Loading projects...</p>
        </div>
      ) : (
        <ProjectList
          projects={projects}
          onEdit={handleEditProject}
          onDelete={handleDeleteProject}
        />
      )}
    </div>
  );
}

export default ProjectsPage;