import axios from 'axios';

// Helper function to determine the base URL for API calls
const getBaseURL = () => {
    if (process.env.REACT_APP_API_URL) {
        return process.env.REACT_APP_API_URL;
    }
    return process.env.NODE_ENV === 'production'
        ? 'https://www.mytensecondstory.com/api'
        : 'http://localhost:8000';
};

// Create the main axios instance
const api = axios.create({
    baseURL: getBaseURL(),
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
    withCredentials: true,
    timeout: 30000,
});

// API Routes constants
export const API_ROUTES = {
    AUTH: {
        LOGIN: '/auth/login',
        LOGOUT: '/auth/logout',
        REGISTER: '/auth/register',
        GOOGLE: '/auth/google',
        GITHUB: '/auth/github',
        LINKEDIN: '/auth/linkedin',
    },
    STORIES: {
        LIST: '/stories/',
        CREATE: '/stories/',
        DETAIL: (id) => `/stories/${id}`,
        SHARE: (id) => `/stories/${id}/share`,
    },
    PROFILE: {
        ME: '/profile/me',
    },
};

// Request interceptor
api.interceptors.request.use(
    (config) => {
        // Log requests in development mode
        if (process.env.NODE_ENV === 'development') {
            console.log('API Request:', {
                url: `${config.baseURL}${config.url}`,
                method: config.method,
            });
        }

        // Add authorization token if available
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        console.error('Request error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor
api.interceptors.response.use(
    (response) => {
        // Log responses in development mode
        if (process.env.NODE_ENV === 'development') {
            console.log('API Response:', {
                url: response.config.url,
                status: response.status,
            });
        }
        return response;
    },
    (error) => {
        // Handle errors
        if (!error.response) {
            return Promise.reject(
                new Error('Network error. Please check your connection.')
            );
        }

        // Handle specific status codes
        switch (error.response.status) {
            case 401:
                // Clear auth data and redirect to login
                localStorage.removeItem('token');
                delete api.defaults.headers.common['Authorization'];
                if (!window.location.pathname.includes('/login')) {
                    window.location.href = '/login';
                }
                return Promise.reject(
                    new Error('Session expired. Please log in again.')
                );

            case 404:
                return Promise.reject(
                    new Error('The requested resource was not found.')
                );

            default:
                return Promise.reject(
                    new Error(
                        error.response.data?.detail || 'An unexpected error occurred.'
                    )
                );
        }
    }
);

// OAuth URL methods
const getGoogleOAuthUrl = () => {
    const redirectUri = encodeURIComponent(`${window.location.origin}/auth/google/callback`);
    return `${getBaseURL()}${API_ROUTES.AUTH.GOOGLE}?redirect_uri=${redirectUri}`;
};

const getGithubOAuthUrl = () => {
    const redirectUri = encodeURIComponent(`${window.location.origin}/auth/github/callback`);
    return `${getBaseURL()}${API_ROUTES.AUTH.GITHUB}?redirect_uri=${redirectUri}`;
};

const getLinkedinOAuthUrl = () => {
    const redirectUri = encodeURIComponent(`${window.location.origin}/auth/linkedin/callback`);
    return `${getBaseURL()}${API_ROUTES.AUTH.LINKEDIN}?redirect_uri=${redirectUri}`;
};

// Auth methods
const auth = {
    async login(credentials) {
        try {
            const response = await api.post(API_ROUTES.AUTH.LOGIN, credentials);
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
            }
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async register(userData) {
        try {
            const response = await api.post(API_ROUTES.AUTH.REGISTER, userData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async logout() {
        try {
            await api.post(API_ROUTES.AUTH.LOGOUT);
            localStorage.removeItem('token');
            delete api.defaults.headers.common['Authorization'];
        } catch (error) {
            console.error('Logout error:', error);
            // Still remove token even if API call fails
            localStorage.removeItem('token');
            delete api.defaults.headers.common['Authorization'];
        }
    },

    isAuthenticated() {
        return !!localStorage.getItem('token');
    }
};

// Story methods
const stories = {
    async create(storyData) {
        try {
            const response = await api.post(API_ROUTES.STORIES.CREATE, storyData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async getAll() {
        try {
            const response = await api.get(API_ROUTES.STORIES.LIST);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async getById(id) {
        try {
            const response = await api.get(API_ROUTES.STORIES.DETAIL(id));
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async share(id) {
        try {
            const response = await api.post(API_ROUTES.STORIES.SHARE(id));
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};

// Profile methods
const profile = {
    async getMyProfile() {
        try {
            const response = await api.get(API_ROUTES.PROFILE.ME);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};

// Initialize token from localStorage if exists
const token = localStorage.getItem('token');
if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

// Export the combined API service
const apiService = {
    // Core HTTP methods
    get: api.get.bind(api),
    post: api.post.bind(api),
    put: api.put.bind(api),
    delete: api.delete.bind(api),

    // Service modules
    auth,
    stories,
    profile,

    // OAuth URL methods
    getGoogleOAuthUrl,
    getGithubOAuthUrl,
    getLinkedinOAuthUrl,
};

export default apiService;