import axios from 'axios';

/**
 * Central API Service Configuration
 *
 * Configures the base URL for Spring Boot backend.
 * Uses Vite proxy (/api) by default or the VITE_API_BASE_URL env variable if provided.
 */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 8000,
});

// Interceptor for logging & standardized error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Format error message for easy display in UI
    const customError = {
      message:
        error.response?.data?.message ||
        error.response?.data ||
        error.message ||
        'Server communication failed',
      status: error.response?.status,
      isNetworkError: !error.response,
    };
    return Promise.reject(customError);
  }
);

// ----------------------------------------------------------------------
// Theme Endpoints
// ----------------------------------------------------------------------
export const getThemes = async () => {
  const response = await apiClient.get('/themes');
  return response.data;
};

export const getThemeById = async (id) => {
  const response = await apiClient.get(`/themes/${id}`);
  return response.data;
};

// ----------------------------------------------------------------------
// Decoration Item Catalog Endpoints
// ----------------------------------------------------------------------
export const getDecorationItems = async () => {
  const response = await apiClient.get('/decoration-items');
  return response.data;
};

export const getDecorationItemById = async (id) => {
  const response = await apiClient.get(`/decoration-items/${id}`);
  return response.data;
};

// ----------------------------------------------------------------------
// Event Decoration (Selected Items) Endpoints
// ----------------------------------------------------------------------
export const getEventDecorations = async (eventId = 1) => {
  // Query by eventId parameter, falling back to base path if parameter is omitted
  const url = eventId ? `/event-decorations?eventId=${eventId}` : '/event-decorations';
  const response = await apiClient.get(url);
  return response.data;
};

export const addEventDecoration = async (payload) => {
  // payload: { eventId, itemId, quantity, unitPrice } or { event: { eventId }, decorationItem: { itemId }, quantity, unitPrice }
  const response = await apiClient.post('/event-decorations', payload);
  return response.data;
};

export const updateEventDecoration = async (id, payload) => {
  const response = await apiClient.put(`/event-decorations/${id}`, payload);
  return response.data;
};

export const deleteEventDecoration = async (id) => {
  const response = await apiClient.delete(`/event-decorations/${id}`);
  return response.data;
};

export default apiClient;
