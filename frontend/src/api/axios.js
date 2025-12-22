import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '/api', // Backend URL (Env var for dev, relative for prod)
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor to add language param to every request
api.interceptors.request.use((config) => {
    const lang = localStorage.getItem('i18nextLng') || 'az';
    config.params = config.params || {};
    config.params.lang = lang;
    return config;
});

export default api;
