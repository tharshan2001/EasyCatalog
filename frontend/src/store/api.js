// src/store/api.js
import axios from 'axios';

// Vite env variable (must start with VITE_)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Create an Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // automatically send cookies/credentials
});


export default api;