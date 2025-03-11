import axios from 'axios';

// Create axios instance with base URL and default headers
const API = axios.create({
    baseURL: '/api/auth', // This will use the proxy in development
    headers: {
        'Content-Type': 'application/json'
    }
});

class AuthService {
    async login(universityId, password) {
        try {
            console.log('Attempting login with:', { universityId, password });
            const response = await API.post('/login', {
                universityId,
                password
            });

            console.log('Login response:', response.data);

            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
            }

            return response.data;
        } catch (error) {
            console.error('Login error:', error);
            throw error.response?.data || {
                message: 'Network error. Please check your connection.'
            };
        }
    }

    async register(userData) {
        try {
            const response = await API.post('/register', userData);
            return response.data;
        } catch (error) {
            throw error.response?.data || {
                message: 'Network error. Please check your connection.'
            };
        }
    }

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }

    getCurrentUser() {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    }

    getToken() {
        return localStorage.getItem('token');
    }

    // Add an interceptor to include the token with every request
    setAuthHeader() {
        API.interceptors.request.use(
            (config) => {
                const token = this.getToken();
                if (token) {
                    config.headers['x-auth-token'] = token;
                }
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );
    }
}

const authService = new AuthService();
// Set the auth header interceptor
authService.setAuthHeader();

export default authService;