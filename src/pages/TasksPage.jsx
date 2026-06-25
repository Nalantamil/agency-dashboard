import React, { useState, useEffect } from 'react';
import TaskList from '../components/TaskList';
import TaskForm from '../components/TaskForm';
import { taskAPI } from '../utils/api';

function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await taskAPI.getTasks();
      if (response.data.success) {
        const formattedTasks = response.data.data.map(task => ({
          ...task,
          id: task._id
        }));
        setTasks(formattedTasks);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTasks =
    filterStatus === 'all'
      ? tasks
      : tasks.filter((task) => task.status === filterStatus);

  const handleAddTask = async (newTask) => {
    try {
      const response = await taskAPI.createTask(newTask);
      if (response.data.success) {
        fetchTasks();
        setShowForm(false);
      }
    } catch (error) {
      console.error('Error adding task:', error);
      alert('Error adding task. Check console for details.');
    }
  };

  const handleUpdateTask = async (updatedTask) => {
    try {
      const response = await taskAPI.updateTask(updatedTask.id, updatedTask);
      if (response.data.success) {
        fetchTasks();
        setEditingTask(null);
        setShowForm(false);
      }
    } catch (error) {
      console.error('Error updating task:', error);
      alert('Error updating task. Check console for details.');
    }
  };

  const handleDeleteTask = async (id) => {
    if (confirm('Are you sure you want to delete this task?')) {
      try {
        const response = await taskAPI.deleteTask(id);
        if (response.data.success) {
          fetchTasks();
        }
      } catch (error) {
        console.error('Error deleting task:', error);
        alert('Error deleting task. Check console for details.');
      }
    }
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingTask(null);
  };

  const taskStats = {
    total: tasks.length,
    todo: tasks.filter((t) => t.status === 'todo').length,
    inProgress: tasks.filter((t) => t.status === 'in-progress').length,
    completed: tasks.filter((t) => t.status === 'completed').length,
    blocked: tasks.filter((t) => t.status === 'blocked').length,
  };

  return (
    <div className="main-content">
      <div className="page-header">
        <h1 className="page-title">Tasks</h1>
        <p className="page-subtitle">Manage all project tasks and assignments</p>
      </div>

      {/* Task Stats */}
      <div className="task-stats">
        <div className="stat">
          <span className="stat-number">{taskStats.total}</span>
          <span className="stat-label">Total</span>
        </div>
        <div className="stat">
          <span className="stat-number">{taskStats.todo}</span>
          <span className="stat-label">To Do</span>
        </div>
        <div className="stat">
          <span className="stat-number">{taskStats.inProgress}</span>
          <span className="stat-label">In Progress</span>
        </div>
        <div className="stat">
          <span className="stat-number">{taskStats.completed}</span>
          <span className="stat-label">Completed</span>
        </div>
        <div className="stat">
          <span className="stat-number">{taskStats.blocked}</span>
          <span className="stat-label">Blocked</span>
        </div>
      </div>

      {/* Filter and Add Button */}
      <div className="task-controls">
        <div className="filter-group">
          <label className="filter-label">Filter by Status:</label>
          <select
            className="form-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{ maxWidth: '200px' }}
          >
            <option value="all">All Tasks</option>
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="blocked">Blocked</option>
          </select>
        </div>

        <button
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? '✕ Cancel' : '+ Add New Task'}
        </button>
      </div>

      {showForm && (
        <TaskForm
          task={editingTask || {}}
          onSave={editingTask ? handleUpdateTask : handleAddTask}
          onCancel={handleCloseForm}
        />
      )}

      {loading ? (
        <div className="empty-state">
          <p>Loading tasks...</p>
        </div>
      ) : (
        <TaskList
          tasks={filteredTasks}
          onEdit={handleEditTask}
          onDelete={handleDeleteTask}
        />
      )}
    </div>
  );
}

export default TasksPage;