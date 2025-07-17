import axios from 'axios';
import { LoginCredentials, TokenResponse, Genre, Actor, Movie, MovieCreate, Review, MovieStats } from '../types';

const API_BASE_URL = 'http://localhost:8000/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        try {
          const response = await axios.post(`${API_BASE_URL}/authentication/token/refresh/`, {
            refresh: refreshToken,
          });
          
          const { access } = response.data;
          localStorage.setItem('access_token', access);
          
          return api(originalRequest);
        } catch (refreshError) {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          window.location.href = '/login';
        }
      }
    }
    
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (credentials: LoginCredentials): Promise<TokenResponse> => {
    const response = await api.post('/authentication/token/', credentials);
    return response.data;
  },
  
  verifyToken: async (token: string): Promise<boolean> => {
    try {
      await api.post('/authentication/token/verify/', { token });
      return true;
    } catch {
      return false;
    }
  },
};

// Genres API
export const genresAPI = {
  getAll: async (): Promise<Genre[]> => {
    const response = await api.get('/genres/');
    return response.data;
  },
  
  create: async (genre: Omit<Genre, 'id'>): Promise<Genre> => {
    const response = await api.post('/genres/', genre);
    return response.data;
  },
  
  update: async (id: number, genre: Omit<Genre, 'id'>): Promise<Genre> => {
    const response = await api.put(`/genres/${id}/`, genre);
    return response.data;
  },
  
  delete: async (id: number): Promise<void> => {
    await api.delete(`/genres/${id}/`);
  },
};

// Actors API
export const actorsAPI = {
  getAll: async (): Promise<Actor[]> => {
    const response = await api.get('/actors/');
    return response.data;
  },
  
  create: async (actor: Omit<Actor, 'id'>): Promise<Actor> => {
    const response = await api.post('/actors/', actor);
    return response.data;
  },
  
  update: async (id: number, actor: Omit<Actor, 'id'>): Promise<Actor> => {
    const response = await api.put(`/actors/${id}/`, actor);
    return response.data;
  },
  
  delete: async (id: number): Promise<void> => {
    await api.delete(`/actors/${id}/`);
  },
};

// Movies API
export const moviesAPI = {
  getAll: async (): Promise<Movie[]> => {
    const response = await api.get('/movies/');
    return response.data;
  },
  
  getById: async (id: number): Promise<Movie> => {
    const response = await api.get(`/movies/${id}/`);
    return response.data;
  },
  
  create: async (movie: MovieCreate): Promise<Movie> => {
    const response = await api.post('/movies/', movie);
    return response.data;
  },
  
  update: async (id: number, movie: MovieCreate): Promise<Movie> => {
    const response = await api.put(`/movies/${id}/`, movie);
    return response.data;
  },
  
  delete: async (id: number): Promise<void> => {
    await api.delete(`/movies/${id}/`);
  },
  
  getStats: async (): Promise<MovieStats> => {
    const response = await api.get('/movies/stats/');
    return response.data;
  },
};

// Reviews API
export const reviewsAPI = {
  getAll: async (): Promise<Review[]> => {
    const response = await api.get('/reviews/');
    return response.data;
  },
  
  create: async (review: Omit<Review, 'id'>): Promise<Review> => {
    const response = await api.post('/reviews/', review);
    return response.data;
  },
  
  update: async (id: number, review: Omit<Review, 'id'>): Promise<Review> => {
    const response = await api.put(`/reviews/${id}/`, review);
    return response.data;
  },
  
  delete: async (id: number): Promise<void> => {
    await api.delete(`/reviews/${id}/`);
  },
};