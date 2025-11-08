// src/api.js
import axios from 'axios';

// Your FastAPI backend is running on http://127.0.0.1:8000
export default axios.create({
  baseURL: "http://127.0.0.1:8000"
});