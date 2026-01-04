import axios, { AxiosInstance } from 'axios';
import { supabase } from './supabase';

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

let axiosInstance: AxiosInstance | null = null;

// Initialize axios with JWT token from localStorage
export const initializeApi = async () => {
  const token = localStorage.getItem('access_token');
  
  if (!token) {
    console.warn('No token found in localStorage');
  }

  axiosInstance = axios.create({
    baseURL: apiUrl,
    headers: {
      'Authorization': token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json',
    },
  });

  // Auto-refresh token on 401
  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response?.status === 401) {
        try {
          const refreshToken = localStorage.getItem('refresh_token');
          if (refreshToken) {
            const response = await axios.post(`${apiUrl}/auth/refresh`, {
              refreshToken: refreshToken
            });
            
            const { access_token, refresh_token } = response.data;
            localStorage.setItem('access_token', access_token);
            if (refresh_token) {
              localStorage.setItem('refresh_token', refresh_token);
            }

            // Update token in axios instance
            if (axiosInstance) {
              axiosInstance.defaults.headers.Authorization = `Bearer ${access_token}`;
            }
            return axiosInstance?.request(error.config);
          } else {
            // No refresh token, redirect to login
            localStorage.removeItem('access_token');
            window.location.href = '/login';
          }
        } catch (refreshErr) {
          console.error('Token refresh failed:', refreshErr);
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          window.location.href = '/login';
        }
      }
      return Promise.reject(error);
    },
  );

  return axiosInstance;
};

export const getApi = () => {
  if (!axiosInstance) {
    throw new Error('API not initialized. Call initializeApi() first');
  }
  return axiosInstance;
};

// Auth endpoints
export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await axios.post(`${apiUrl}/auth/login`, { email, password });
    return response.data;
  },

  refresh: async (refreshToken: string) => {
    const response = await axios.post(`${apiUrl}/auth/refresh`, { refresh_token: refreshToken });
    return response.data;
  },

  logout: async () => {
    const api = getApi();
    return api.post('/auth/logout');
  },

  getCurrentUser: async () => {
    const api = getApi();
    return api.get('/auth/me');
  },
};

// Data endpoints
export const dataAPI = {
  getRecords: async (moduleSlug: string, page = 1, limit = 20) => {
    const api = getApi();
    return api.get(`/data/${moduleSlug}`, { params: { page, limit } });
  },

  getRecord: async (moduleSlug: string, recordId: string) => {
    const api = getApi();
    return api.get(`/data/${moduleSlug}/${recordId}`);
  },

  createRecord: async (moduleSlug: string, data: Record<string, any>) => {
    const api = getApi();
    return api.post(`/data/${moduleSlug}`, { data });
  },

  updateRecord: async (moduleSlug: string, recordId: string, data: Record<string, any>) => {
    const api = getApi();
    return api.patch(`/data/${moduleSlug}/${recordId}`, { data });
  },

  deleteRecord: async (moduleSlug: string, recordId: string) => {
    const api = getApi();
    return api.delete(`/data/${moduleSlug}/${recordId}`);
  },
};

// Tenant endpoints
export const tenantAPI = {
  getTenant: async (tenantId: string) => {
    const api = getApi();
    return api.get(`/tenants/${tenantId}`);
  },

  updateTenant: async (tenantId: string, data: any) => {
    const api = getApi();
    return api.patch(`/tenants/${tenantId}`, data);
  },

  getUsers: async (tenantId: string) => {
    const api = getApi();
    return api.get(`/tenants/${tenantId}/users`);
  },

  inviteUser: async (tenantId: string, email: string, role = 'viewer') => {
    const api = getApi();
    return api.post(`/tenants/${tenantId}/users`, { email, role });
  },

  updateUserRole: async (tenantId: string, userId: string, role: string) => {
    const api = getApi();
    return api.patch(`/tenants/${tenantId}/users/${userId}`, { role });
  },

  deleteUser: async (tenantId: string, userId: string) => {
    const api = getApi();
    return api.delete(`/tenants/${tenantId}/users/${userId}`);
  },
};

// Config endpoints
export const configAPI = {
  getModules: async () => {
    const api = getApi();
    return api.get('/config/modules');
  },

  getModuleFields: async (moduleId: string) => {
    const api = getApi();
    return api.get(`/config/modules/${moduleId}/fields`);
  },
};

// Dashboard endpoints
export const dashboardAPI = {
  getDashboards: async () => {
    const api = getApi();
    return api.get('/dashboards');
  },

  getDashboard: async (dashboardId: string) => {
    const api = getApi();
    return api.get(`/dashboards/${dashboardId}`);
  },
};

// Notifications endpoints
export const notificationsAPI = {
  getNotifications: async () => {
    const api = getApi();
    return api.get('/notifications');
  },

  markAsRead: async (notificationId: string) => {
    const api = getApi();
    return api.patch(`/notifications/${notificationId}/read`);
  },
};

// Comments endpoints
export const commentsAPI = {
  getComments: async (recordId: string) => {
    const api = getApi();
    return api.get(`/comments/${recordId}`);
  },

  createComment: async (recordId: string, content: string) => {
    const api = getApi();
    return api.post(`/comments/${recordId}`, { content });
  },

  deleteComment: async (commentId: string) => {
    const api = getApi();
    return api.delete(`/comments/${commentId}`);
  },
};

// Attachments endpoints
export const attachmentsAPI = {
  getAttachments: async (recordId: string) => {
    const api = getApi();
    return api.get(`/attachments/${recordId}`);
  },

  deleteAttachment: async (attachmentId: string) => {
    const api = getApi();
    return api.delete(`/attachments/${attachmentId}`);
  },
};

// Suppliers endpoints
export const suppliersAPI = {
  getSuppliers: async () => {
    const api = getApi();
    return api.get('/suppliers');
  },

  createSupplier: async (data: any) => {
    const api = getApi();
    return api.post('/suppliers', data);
  },

  updateSupplier: async (supplierId: string, data: any) => {
    const api = getApi();
    return api.patch(`/suppliers/${supplierId}`, data);
  },

  deleteSupplier: async (supplierId: string) => {
    const api = getApi();
    return api.delete(`/suppliers/${supplierId}`);
  },
};

// Workflows endpoints
export const workflowsAPI = {
  getWorkflows: async () => {
    const api = getApi();
    return api.get('/workflows');
  },

  createWorkflow: async (data: any) => {
    const api = getApi();
    return api.post('/workflows', data);
  },

  updateWorkflow: async (workflowId: string, data: any) => {
    const api = getApi();
    return api.patch(`/workflows/${workflowId}`, data);
  },

  deleteWorkflow: async (workflowId: string) => {
    const api = getApi();
    return api.delete(`/workflows/${workflowId}`);
  },
};
