import axios from 'axios';

// Get variables from .env
const API_IP = process.env.EXPO_PUBLIC_API_IP || '192.168.1.6'; // Fallback
const API_PORT = process.env.EXPO_PUBLIC_API_PORT || '8000';   // Fallback

const API_BASE_URL = `http://${API_IP}:${API_PORT}`;

const api = axios.create({
    baseURL: API_BASE_URL,
});

export default api;