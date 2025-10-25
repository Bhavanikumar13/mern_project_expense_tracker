import axios from 'axios';

const API_URL = '/api';

// Transaction API
export const transactionAPI = {
  getAll: (params) => axios.get(`${API_URL}/transactions`, { params }),
  getById: (id) => axios.get(`${API_URL}/transactions/${id}`),
  create: (data) => axios.post(`${API_URL}/transactions`, data),
  update: (id, data) => axios.put(`${API_URL}/transactions/${id}`, data),
  delete: (id) => axios.delete(`${API_URL}/transactions/${id}`),
  getStats: (params) => axios.get(`${API_URL}/transactions/stats/summary`, { params })
};

// Category API
export const categoryAPI = {
  getAll: (params) => axios.get(`${API_URL}/categories`, { params }),
  getById: (id) => axios.get(`${API_URL}/categories/${id}`),
  create: (data) => axios.post(`${API_URL}/categories`, data),
  update: (id, data) => axios.put(`${API_URL}/categories/${id}`, data),
  delete: (id) => axios.delete(`${API_URL}/categories/${id}`)
};

// User API
export const userAPI = {
  getProfile: () => axios.get(`${API_URL}/users/profile`),
  updateProfile: (data) => axios.put(`${API_URL}/users/profile`, data),
  updateProfilePicture: (formData) => axios.put(`${API_URL}/users/profile/picture`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  deleteAccount: () => axios.delete(`${API_URL}/users/profile`)
};

// Report API
export const reportAPI = {
  downloadPDF: (params) => axios.get(`${API_URL}/reports/pdf`, { 
    params,
    responseType: 'blob'
  }),
  downloadCSV: (params) => axios.get(`${API_URL}/reports/csv`, { 
    params,
    responseType: 'blob'
  }),
  sendEmail: (data) => axios.post(`${API_URL}/reports/email`, data)
};

export default {
  transaction: transactionAPI,
  category: categoryAPI,
  user: userAPI,
  report: reportAPI
};
