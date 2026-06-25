import React, { useState, useEffect } from 'react';

function ClientForm({ client, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    industry: '',
    budget: '',
    status: 'active',
  });

  useEffect(() => {
    if (client) {
      setFormData(client);
    }
  }, [client]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.phone) {
      alert('Please fill in all required fields');
      return;
    }

    onSave(formData);
    setFormData({
      name: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      industry: '',
      budget: '',
      status: 'active',
    });
  };

  return (
    <div className="form-container">
      <h3 style={{ marginBottom: '25px', color: 'var(--primary)', fontSize: '18px', fontWeight: '800', textTransform: 'uppercase' }}>
        {client ? '✎ Edit Client' : '+ Add New Client'}
      </h3>

      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Client Name *</label>
            <input
              type="text"
              name="name"
              className="form-input"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter client name"
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
            <label className="form-label">Industry</label>
            <select
              name="industry"
              className="form-select"
              value={formData.industry}
              onChange={handleChange}
            >
              <option value="">Select industry</option>
              <option value="Technology">Technology</option>
              <option value="Finance">Finance</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Retail">Retail</option>
              <option value="Manufacturing">Manufacturing</option>
              <option value="Education">Education</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Address</label>
            <input
              type="text"
              name="address"
              className="form-input"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter street address"
            />
          </div>

          <div className="form-group">
            <label className="form-label">City</label>
            <input
              type="text"
              name="city"
              className="form-input"
              value={formData.city}
              onChange={handleChange}
              placeholder="Enter city"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Budget</label>
            <input
              type="number"
              name="budget"
              className="form-input"
              value={formData.budget}
              onChange={handleChange}
              placeholder="Enter budget amount"
            />
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
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            {client ? '✓ Update Client' : '✓ Add Client'}
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

export default ClientForm;