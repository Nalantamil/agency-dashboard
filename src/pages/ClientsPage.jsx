import React, { useState, useEffect } from 'react';
import ClientList from '../components/ClientList';
import ClientForm from '../components/ClientForm';
import { clientAPI } from '../utils/api';

function ClientsPage() {
  const [clients, setClients] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch clients from backend
  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const response = await clientAPI.getClients();
      if (response.data.success) {
        // Convert MongoDB _id to id
        const formattedClients = response.data.data.map(client => ({
          ...client,
          id: client._id
        }));
        setClients(formattedClients);
      }
    } catch (error) {
      console.error('Error fetching clients:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddClient = async (newClient) => {
    try {
      const response = await clientAPI.createClient(newClient);
      if (response.data.success) {
        // Refresh clients list
        fetchClients();
        setShowForm(false);
      }
    } catch (error) {
      console.error('Error adding client:', error);
      alert('Error adding client. Check console for details.');
    }
  };

  const handleUpdateClient = async (updatedClient) => {
    try {
      const response = await clientAPI.updateClient(updatedClient.id, updatedClient);
      if (response.data.success) {
        // Refresh clients list
        fetchClients();
        setEditingClient(null);
      }
    } catch (error) {
      console.error('Error updating client:', error);
      alert('Error updating client. Check console for details.');
    }
  };

  const handleDeleteClient = async (id) => {
    if (confirm('Are you sure you want to delete this client?')) {
      try {
        const response = await clientAPI.deleteClient(id);
        if (response.data.success) {
          // Refresh clients list
          fetchClients();
        }
      } catch (error) {
        console.error('Error deleting client:', error);
        alert('Error deleting client. Check console for details.');
      }
    }
  };

  const handleEditClient = (client) => {
    setEditingClient(client);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingClient(null);
  };

  return (
    <div className="main-content">
      <div className="page-header">
        <h1 className="page-title">Clients</h1>
        <p className="page-subtitle">Manage all your clients and their information</p>
      </div>

      <button
        className="btn btn-primary"
        onClick={() => setShowForm(!showForm)}
        style={{ marginBottom: '30px' }}
      >
        {showForm ? '✕ Cancel' : '+ Add New Client'}
      </button>

      {showForm && (
        <ClientForm
          client={editingClient}
          onSave={editingClient ? handleUpdateClient : handleAddClient}
          onCancel={handleCloseForm}
        />
      )}

      {loading ? (
        <div className="empty-state">
          <p>Loading clients...</p>
        </div>
      ) : (
        <ClientList
          clients={clients}
          onEdit={handleEditClient}
          onDelete={handleDeleteClient}
        />
      )}
    </div>
  );
}

export default ClientsPage;