import axios from "axios";

// Base URL for backend API
const API_BASE_URL = "https://agency-dashboard-mfsy.onrender.com/api";

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Client API
export const clientAPI = {
  getClients: () => api.get("/clients"),
  createClient: (data) => api.post("/clients", data),
  getClient: (id) => api.get(`/clients/${id}`),
  updateClient: (id, data) => api.put(`/clients/${id}`, data),
  deleteClient: (id) => api.delete(`/clients/${id}`),
};

// Project API
export const projectAPI = {
  getProjects: () => api.get("/projects"),
  createProject: (data) => api.post("/projects", data),
  getProject: (id) => api.get(`/projects/${id}`),
  updateProject: (id, data) => api.put(`/projects/${id}`, data),
  deleteProject: (id) => api.delete(`/projects/${id}`),
};

// Task API
export const taskAPI = {
  getTasks: () => api.get("/tasks"),
  createTask: (data) => api.post("/tasks", data),
  getTask: (id) => api.get(`/tasks/${id}`),
  updateTask: (id, data) => api.put(`/tasks/${id}`, data),
  deleteTask: (id) => api.delete(`/tasks/${id}`),
};

// Team API
export const teamAPI = {
  getTeam: () => api.get("/team"),
  createTeamMember: (data) => api.post("/team", data),
  getTeamMember: (id) => api.get(`/team/${id}`),
  updateTeamMember: (id, data) => api.put(`/team/${id}`, data),
  deleteTeamMember: (id) => api.delete(`/team/${id}`),
};

// Report API
export const reportAPI = {
  getReports: () => api.get("/reports"),
  createReport: (data) => api.post("/reports", data),
  getReport: (id) => api.get(`/reports/${id}`),
  updateReport: (id, data) => api.put(`/reports/${id}`, data),
  deleteReport: (id) => api.delete(`/reports/${id}`),
};

export default api;