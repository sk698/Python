import axios from 'axios';


const API_BASE_URL = "https://python-production-2bac.up.railway.app";

const api = axios.create({
    baseURL: API_BASE_URL,
});

export default api;