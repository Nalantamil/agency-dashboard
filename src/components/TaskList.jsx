import React from 'react';

function TaskList({ tasks, onEdit, onDelete }) {
  const getPriorityClass = (priority) => {
    return `priority-${priority}`;
  };

  const getStatusClass = (status) => {
    return `status-${status.replace('-', '')}`;
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const isOverdue = (dueDate, status) => {
    if (status === 'completed') return false;
    return new Date(dueDate) < new Date();
  };

  if (tasks.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">✓</div>
        <h3 className="empty-state-title">No Tasks Yet</h3>
        <p>Create your first task to get started</p>
      </div>
    );
  }

  return (
    <div className="tasks-table-container">
      <table className="tasks-table">
        <thead>
          <tr>
            <th>Task Name</th>
            <th>Project</th>
            <th>Assigned To</th>
            <th>Due Date</th>
            <th>Priority</th>
            <th>Status</th>
            <th>Hours</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr
              key={task.id}
              style={{
                opacity: task.status === 'completed' ? 0.7 : 1,
                textDecoration: task.status === 'completed' ? 'line-through' : 'none',
              }}
            >
              {/* Task Name */}
              <td>
                <div className="task-name">{task.taskName}</div>
                <div className="task-project">{task.description}</div>
              </td>

              {/* Project */}
              <td>
                <div className="task-project">{task.projectName}</div>
              </td>

              {/* Assigned To */}
              <td>
                <div style={{ fontWeight: 600 }}>{task.assignedTo}</div>
              </td>

              {/* Due Date */}
              <td>
                <div
                  style={{
                    color: isOverdue(task.dueDate, task.status)
                      ? '#FF6B6B'
                      : 'var(--text-secondary)',
                    fontWeight: isOverdue(task.dueDate, task.status) ? 700 : 500,
                  }}
                >
                  {formatDate(task.dueDate)}
                  {isOverdue(task.dueDate, task.status) && (
                    <span style={{ marginLeft: '8px' }}>⚠️</span>
                  )}
                </div>
              </td>

              {/* Priority */}
              <td>
                <span className={`task-priority-badge ${getPriorityClass(task.priority)}`}>
                  {task.priority}
                </span>
              </td>

              {/* Status */}
              <td>
                <span className={`task-status-badge ${getStatusClass(task.status)}`}>
                  {task.status === 'in-progress' ? 'In Progress' : task.status}
                </span>
              </td>

              {/* Hours */}
              <td>
                <div style={{ fontSize: 12 }}>
                  <div>{task.actualHours}h / {task.estimatedHours}h</div>
                  <div style={{ color: 'var(--text-muted)', marginTop: '4px' }}>
                    {task.actualHours > task.estimatedHours ? (
                      <span style={{ color: '#FF6B6B' }}>
                        +{task.actualHours - task.estimatedHours}h over
                      </span>
                    ) : task.actualHours < task.estimatedHours ? (
                      <span style={{ color: '#00FF88' }}>
                        {task.estimatedHours - task.actualHours}h left
                      </span>
                    ) : (
                      <span style={{ color: 'var(--primary)' }}>On track</span>
                    )}
                  </div>
                </div>
              </td>

              {/* Actions */}
              <td>
                <div className="task-actions">
                  <button
                    className="btn btn-secondary"
                    onClick={() => onEdit(task)}
                    title="Edit task"
                  >
                    ✎
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => onDelete(task.id)}
                    title="Delete task"
                  >
                    🗑
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TaskList;