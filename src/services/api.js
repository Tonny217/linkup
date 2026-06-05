// Production API service - connects to PocketBase/Backend API
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3002/api';
const PB_URL = import.meta.env.VITE_POCKETBASE_URL || 'http://localhost:8090';

let authToken = localStorage.getItem('linkup_token') || null;

const headers = () => ({
  'Content-Type': 'application/json',
  ...(authToken && { 'Authorization': authToken })
});

const apiRequest = async (method, path, data = null) => {
  const config = {
    method,
    headers: headers(),
    ...(data && { body: JSON.stringify(data) })
  };

  const response = await fetch(`${API_BASE}${path}`, config);
  if (!response.ok) throw new Error(await response.text());
  return response.json();
};

// PocketBase direct requests (for file uploads, realtime, etc.)
const pbRequest = async (method, path, data = null) => {
  const config = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(authToken && { 'Authorization': authToken })
    },
    ...(data && { body: JSON.stringify(data) })
  };

  const response = await fetch(`${PB_URL}/api${path}`, config);
  if (!response.ok) throw new Error(await response.text());
  return response.json();
};

export const api = {
  setToken: (token) => {
    authToken = token;
    localStorage.setItem('linkup_token', token);
  },

  clearToken: () => {
    authToken = null;
    localStorage.removeItem('linkup_token');
  },

  // Auth
  telegramAuth: async (telegramData) => {
    const res = await apiRequest('POST', '/auth/telegram', telegramData);
    if (res.token) api.setToken(res.token);
    return res;
  },

  // User
  getCurrentUser: async () => {
    return apiRequest('GET', '/users/me');
  },

  updateUser: async (data) => {
    return apiRequest('PATCH', '/users/me', data);
  },

  getUsers: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    return apiRequest('GET', `/users/discover?${params}`);
  },

  // Matches
  getMatches: async () => {
    return apiRequest('GET', '/matches');
  },

  // Likes
  addLike: async (toUser, superLike = false) => {
    return apiRequest('POST', '/likes', { to_user: toUser, super_like: superLike });
  },

  // Messages
  getMessages: async (matchId) => {
    return apiRequest('GET', `/messages/${matchId}`);
  },

  sendMessage: async (matchId, text) => {
    return apiRequest('POST', '/messages', { match: matchId, text });
  },

  // Events
  getEvents: async (type) => {
    const params = type ? `?type=${type}` : '';
    return apiRequest('GET', `/events${params}`);
  },

  joinEvent: async (eventId) => {
    return apiRequest('POST', `/events/${eventId}/join`);
  },

  // Reports
  createReport: async (reportedUser, reason, details) => {
    return apiRequest('POST', '/reports', { reported_user: reportedUser, reason, details });
  },

  // File upload via PocketBase
  uploadFile: async (file, collection = 'users', recordId = null) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${PB_URL}/api/collections/${collection}/records${recordId ? `/${recordId}` : ''}`, {
      method: recordId ? 'PATCH' : 'POST',
      headers: {
        ...(authToken && { 'Authorization': authToken })
      },
      body: formData
    });

    if (!response.ok) throw new Error('Upload failed');
    return response.json();
  },

  // Realtime subscriptions (PocketBase SSE)
  subscribeMessages: (matchId, callback) => {
    const eventSource = new EventSource(
      `${PB_URL}/api/collections/messages/records/subscribe?filter=match="${matchId}"`,
      { headers: { 'Authorization': authToken } }
    );

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      callback(data);
    };

    return () => eventSource.close();
  }
};

// Initialize mock data for development
export const initializeMockData = () => {
  // Only run if no token exists (development mode)
  if (!authToken) {
    const data = localStorage.getItem('linkup_dev_data');
    if (!data) {
      // Set up demo data in localStorage for offline mode
      localStorage.setItem('linkup_dev_data', JSON.stringify({ initialized: true }));
    }
  }
};
