import React from 'react';

function ClientList({ clients, onEdit, onDelete }) {
  if (clients.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">👥</div>
        <h3 className="empty-state-title">No Clients Yet</h3>
        <p>Create your first client to get started</p>
      </div>
    );
  }

  return (
    <div className="clients-container">
      {clients.map((client) => (
        <div key={client.id} className="client-card">
          <div className="client-header">
            <h3 className="client-name">{client.name}</h3>
            <span className={`client-status status-${client.status}`}>
              {client.status}
            </span>
          </div>

          <div className="client-info">
            <div className="client-info-item">
              <span className="client-info-label">Email:</span>
              <span className="client-info-value">{client.email}</span>
            </div>

            <div className="client-info-item">
              <span className="client-info-label">Phone:</span>
              <span className="client-info-value">{client.phone}</span>
            </div>

            <div className="client-info-item">
              <span className="client-info-label">Industry:</span>
              <span className="client-info-value">{client.industry}</span>
            </div>
          </div>

          <div className="client-actions">
            <button
              className="btn btn-secondary"
              onClick={() => onEdit(client)}
              style={{ flex: 1 }}
            >
              ✎ Edit
            </button>
            <button
              className="btn btn-danger"
              onClick={() => onDelete(client.id)}
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

export default ClientList;