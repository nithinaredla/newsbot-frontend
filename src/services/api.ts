import axios from 'axios';
import { ChatResponse, ApiError, SystemStatus, SessionInfo } from '../types';

// Use environment variable with fallback
const API_BASE_URL = process.env.REACT_APP_API_URL;

console.log('API Base URL:', API_BASE_URL); // Debug log

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('API Response Error:', error);
    
    if (error.response) {
      // Server responded with error status
      const apiError: ApiError = {
        message: error.response.data?.error || 'Server error occurred',
        status: error.response.status,
      };
      return Promise.reject(apiError);
    } else if (error.request) {
      // Request made but no response received
      const apiError: ApiError = {
        message: 'No response from server. Please check your connection.',
      };
      return Promise.reject(apiError);
    } else {
      // Other errors
      const apiError: ApiError = {
        message: error.message || 'An unexpected error occurred',
      };
      return Promise.reject(apiError);
    }
  }
);

export const chatApi = {
  sendMessage: async (sessionId: string, message: string): Promise<ChatResponse> => {
    const response = await api.post('/api/chat/message', {
      sessionId,
      message,
    });
    return response.data;
  },

  getChatHistory: async (sessionId: string): Promise<{ messages: any[] }> => {
    const response = await api.get(`/api/chat/history/${sessionId}`);
    return response.data;
  },

  clearChatHistory: async (sessionId: string): Promise<{ message: string }> => {
    const response = await api.delete(`/api/chat/history/${sessionId}`);
    return response.data;
  },

  getSystemStatus: async (): Promise<SystemStatus> => {
    const response = await api.get('/api/chat/status');
    return response.data;
  },

  createSession: async (sessionId?: string): Promise<{ sessionId: string }> => {
    const response = await api.post('/api/session', { sessionId });
    return response.data;
  },

  getSessionInfo: async (sessionId: string): Promise<SessionInfo> => {
    const response = await api.get(`/api/session/${sessionId}`);
    return response.data;
  },
};

export default api;