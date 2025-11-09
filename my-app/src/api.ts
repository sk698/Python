import axios from 'axios';

// --- API Configuration ---
//
// IMPORTANT: YOU MUST CHANGE THIS IP ADDRESS
//
// Find your computer's local network IP:
// - Windows: Open 'cmd' and type 'ipconfig' (Look for IPv4 Address)
// - macOS: Open 'Terminal' and type 'ifconfig | grep inet'
//
// Your phone/simulator must be on the same WiFi network as your computer.
//
const API_IP = '192.168.1.6'; // <-- CHANGE THIS
const API_PORT = '8000'; // Your FastAPI port
const API_BASE_URL = `http://${API_IP}:${API_PORT}`;

const api = axios.create({
    baseURL: API_BASE_URL,
});

export default api;