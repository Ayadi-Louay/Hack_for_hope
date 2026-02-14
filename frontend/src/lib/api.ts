import axios from 'axios';
import type { AuthResponse, Incident, CreateIncidentDto, UpdateIncidentDto } from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

// Instance Axios avec configuration
export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token JWT
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Intercepteur pour gérer les erreurs d'authentification
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// === AUTH API ===
export const authAPI = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', { email, password });
    return response.data;
  },

  getCurrentUser: () => {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    }
    return null;
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
  },
};

// === INCIDENTS API ===
export const incidentsAPI = {
  // Récupérer tous les incidents (filtré par RLS)
  getAll: async (): Promise<Incident[]> => {
    const response = await api.get<Incident[]>('/incidents');
    return response.data;
  },

  // Récupérer un incident par ID
  getById: async (id: number): Promise<Incident> => {
    const response = await api.get<Incident>(`/incidents/${id}`);
    return response.data;
  },

  // Créer un nouveau signalement
  create: async (data: CreateIncidentDto): Promise<Incident> => {
    const response = await api.post<Incident>('/incidents', data);
    return response.data;
  },

  // Mettre à jour un incident (classification, statut)
  update: async (id: number, data: UpdateIncidentDto): Promise<Incident> => {
    const response = await api.patch<Incident>(`/incidents/${id}`, data);
    return response.data;
  },

  // Supprimer un incident
  delete: async (id: number): Promise<void> => {
    await api.delete(`/incidents/${id}`);
  },

  // Classifier un incident (PSYCHOLOGUE/RESPONSABLE_SOCIAL)
  classify: async (id: number, classification: string): Promise<Incident> => {
    const response = await api.patch<Incident>(`/incidents/${id}/classify`, {
      classification,
    });
    return response.data;
  },
};
